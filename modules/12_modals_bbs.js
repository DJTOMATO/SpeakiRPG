// --- SPEAKI BBS (COMMUNITY BULLETIN BOARD) ---
var bbsModalElements = {
	headerTitle: null,
	countBadge: null,
	refreshBtn: null,
	closeBtn: null,
	postsContainer: null,
	replyBar: null,
	replyBarText: null,
	replyBarCancel: null,
	input: null,
	charCount: null,
	submitBtn: null,
	statusMsg: null
};

var lunBbsPosts = [];
var lunBbsLoading = false;
var lunBbsPollTimer = null;
var lunBbsSeenTimer = null;
var lunBbsCooldownUntil = 0;
var lunBbsTranslations = {};
var lunBbsReplyTarget = null;
var lunBbsLastReadId = parseInt((window.localStorage && localStorage.getItem("spkmod-bbs-last-read-id")) || "0", 10);
var lunBbsHeartedPostIds = new Set();
try {
	const rawHearted = localStorage.getItem("spkmod-bbs-hearted-ids");
	if (rawHearted) {
		const parsed = JSON.parse(rawHearted);
		if (Array.isArray(parsed)) lunBbsHeartedPostIds = new Set(parsed);
	}
} catch (_) {}

function escapeBbsHtml(text) {
	if (!text) return '';
	return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getBbsServerUrl() {
	let saved = (window.localStorage && localStorage.getItem("spkmod-poll-server-url")) || "";
	if (saved.startsWith("http://") || saved.includes("YOUR_RPI")) saved = "";
	return (window.spkmodPollServerUrl || saved || "https://spk.lena.moe").replace(/\/+$/, "");
}

// --- BBS THEMING & FONT SCALING ---
var lunBbsTheme = (window.localStorage && localStorage.getItem("spkmod-bbs-theme")) || "normal";
var lunBbsFontSize = parseInt((window.localStorage && localStorage.getItem("spkmod-bbs-font-size")) || "11", 10);
if (isNaN(lunBbsFontSize) || lunBbsFontSize < 9 || lunBbsFontSize > 18) {
	lunBbsFontSize = 11;
}

var savedBbsIconActions = (window.localStorage && localStorage.getItem("spkmod-bbs-icon-actions"));
var lunBbsIconOnlyActions = (savedBbsIconActions !== null) ? (savedBbsIconActions === "true") : true;

function setBbsIconOnlyActions(enabled) {
	lunBbsIconOnlyActions = !!enabled;
	if (window.localStorage) {
		localStorage.setItem("spkmod-bbs-icon-actions", lunBbsIconOnlyActions ? "true" : "false");
	}
	if (bbsModalElements.iconOnlyCheckbox) {
		bbsModalElements.iconOnlyCheckbox.checked = lunBbsIconOnlyActions;
	}
	renderBbsPosts();
}

var savedBbsCollapseReplies = (window.localStorage && localStorage.getItem("spkmod-bbs-collapse-replies"));
var lunBbsCollapseReplies = (savedBbsCollapseReplies !== null) ? (savedBbsCollapseReplies === "true") : true;
var lunBbsExpandedThreadIds = new Set();

function setBbsCollapseReplies(enabled) {
	lunBbsCollapseReplies = !!enabled;
	if (window.localStorage) {
		localStorage.setItem("spkmod-bbs-collapse-replies", lunBbsCollapseReplies ? "true" : "false");
	}
	if (bbsModalElements.collapseRepliesCheckbox) {
		bbsModalElements.collapseRepliesCheckbox.checked = lunBbsCollapseReplies;
	}
	renderBbsPosts();
}
window.setBbsCollapseReplies = setBbsCollapseReplies;

const LUN_BBS_THEMES = {
	"normal": {
		id: "normal",
		name: "Normal",
		icon: "🌙",
		modalBg: "rgba(30, 41, 59, 0.98)",
		modalBorder: "2px solid #334155",
		postsBg: "transparent",
		postRootBg: "rgba(15, 23, 42, 0.45)",
		postReplyBg: "rgba(15, 23, 42, 0.28)",
		postBorder: "1px solid rgba(255, 255, 255, 0.05)",
		replyBorderLeft: "2px solid rgba(56, 189, 248, 0.45)",
		textColor: "#f1f5f9",
		nameColor: "#e2e8f0",
		levelColor: "#94a3b8",
		anchorColor: "#38bdf8",
		timeColor: "#64748b",
		bulletColorRoot: "#94a3b8",
		bulletColorChild: "#38bdf8",
		fontFamily: "inherit",
		padding: "3px 8px",
		lineHeight: "1.45"
	},
	"simple": {
		id: "simple",
		name: "Simple (Briefer)",
		icon: "⚡",
		iconOnlyActions: true,
		modalBg: "rgba(22, 30, 46, 0.98)",
		modalBorder: "1px solid #3b82f6",
		postsBg: "transparent",
		postRootBg: "rgba(13, 21, 36, 0.55)",
		postReplyBg: "rgba(13, 21, 36, 0.35)",
		postBorder: "1px solid rgba(255, 255, 255, 0.04)",
		replyBorderLeft: "2px solid #3b82f6",
		textColor: "#e2e8f0",
		nameColor: "#60a5fa",
		levelColor: "#64748b",
		anchorColor: "#38bdf8",
		timeColor: "#475569",
		bulletColorRoot: "#64748b",
		bulletColorChild: "#60a5fa",
		fontFamily: "inherit",
		padding: "2px 6px",
		lineHeight: "1.35"
	},
	"retro": {
		id: "retro",
		name: "Retro 2ch",
		icon: "📜",
		modalBg: "rgba(27, 25, 23, 0.98)",
		modalBorder: "2px solid #78350f",
		postsBg: "transparent",
		postRootBg: "rgba(41, 37, 36, 0.65)",
		postReplyBg: "rgba(28, 25, 23, 0.65)",
		postBorder: "1px solid rgba(245, 158, 11, 0.12)",
		replyBorderLeft: "2px solid #f59e0b",
		textColor: "#f5f5f4",
		nameColor: "#22c55e",
		levelColor: "#a8a29e",
		anchorColor: "#38bdf8",
		timeColor: "#78716c",
		bulletColorRoot: "#a8a29e",
		bulletColorChild: "#f59e0b",
		fontFamily: "'MS PGothic', 'IPAMonaPGothic', monospace, sans-serif",
		padding: "3px 8px",
		lineHeight: "1.4"
	},
	"terminal": {
		id: "terminal",
		name: "Terminal",
		icon: "📟",
		modalBg: "rgba(5, 8, 12, 0.98)",
		modalBorder: "2px solid #16a34a",
		postsBg: "transparent",
		postRootBg: "rgba(13, 22, 16, 0.75)",
		postReplyBg: "rgba(9, 15, 11, 0.75)",
		postBorder: "1px solid rgba(34, 197, 94, 0.15)",
		replyBorderLeft: "2px solid #22c55e",
		textColor: "#4ade80",
		nameColor: "#86efac",
		levelColor: "#15803d",
		anchorColor: "#22d3ee",
		timeColor: "#166534",
		bulletColorRoot: "#16a34a",
		bulletColorChild: "#22c55e",
		fontFamily: "'Consolas', 'Courier New', monospace",
		padding: "3px 8px",
		lineHeight: "1.4"
	},
	"amber": {
		id: "amber",
		name: "Cyber Amber",
		icon: "✨",
		modalBg: "rgba(18, 13, 6, 0.98)",
		modalBorder: "2px solid #d97706",
		postsBg: "transparent",
		postRootBg: "rgba(36, 24, 11, 0.7)",
		postReplyBg: "rgba(24, 16, 7, 0.7)",
		postBorder: "1px solid rgba(251, 191, 36, 0.15)",
		replyBorderLeft: "2px solid #f59e0b",
		textColor: "#fef3c7",
		nameColor: "#fbbf24",
		levelColor: "#92400e",
		anchorColor: "#fde68a",
		timeColor: "#78350f",
		bulletColorRoot: "#b45309",
		bulletColorChild: "#fbbf24",
		fontFamily: "'Consolas', monospace",
		padding: "3px 8px",
		lineHeight: "1.4"
	}
};

function formatBbsTime(ts, themeId) {
	if (!ts) return "";
	const d = new Date(ts);
	const activeTheme = themeId || lunBbsTheme || "normal";

	const y = d.getFullYear();
	const yy = String(y).slice(-2);
	const m = (d.getMonth() + 1).toString().padStart(2, '0');
	const day = d.getDate().toString().padStart(2, '0');
	const monthNum = d.getMonth() + 1;
	const dateNum = d.getDate();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const dayName = days[d.getDay()];

	const h24 = d.getHours().toString().padStart(2, '0');
	const min = d.getMinutes().toString().padStart(2, '0');
	const s = d.getSeconds().toString().padStart(2, '0');

	let h12 = d.getHours() % 12;
	if (h12 === 0) h12 = 12;
	const ampm = d.getHours() >= 12 ? "PM" : "AM";

	if (activeTheme === "simple" || activeTheme === "briefer") {
		// Concise brief format: e.g. 10/16 7:01PM
		return `${monthNum}/${dateNum} ${h12}:${min}${ampm}`;
	} else if (activeTheme === "retro") {
		// 2ch format: 26/10/16(Fri) 19:01:23
		return `${yy}/${m}/${day}(${dayName}) ${h24}:${min}:${s}`;
	} else if (activeTheme === "terminal") {
		// Terminal format: [10/16 19:01:23]
		return `[${m}/${day} ${h24}:${min}:${s}]`;
	} else if (activeTheme === "amber") {
		// Amber format: 10/16 7:01PM
		return `${monthNum}/${dateNum} ${h12}:${min}${ampm}`;
	} else {
		// Normal / actual detailed format: 2026-10-16 (Fri) 19:30:00
		return `${y}-${m}-${day} (${dayName}) ${h24}:${min}:${s}`;
	}
}

function setBbsTheme(themeId) {
	if (!LUN_BBS_THEMES[themeId]) themeId = "normal";
	lunBbsTheme = themeId;
	if (window.localStorage) {
		localStorage.setItem("spkmod-bbs-theme", themeId);
	}
	applyBbsThemeVisuals();
	renderBbsPosts();
}

function applyBbsThemeVisuals() {
	const t = LUN_BBS_THEMES[lunBbsTheme] || LUN_BBS_THEMES["normal"];
	if (lunHudElements.bbsModal) {
		lunHudElements.bbsModal.style.background = t.modalBg;
		lunHudElements.bbsModal.style.border = t.modalBorder;
		lunHudElements.bbsModal.style.fontFamily = t.fontFamily;
	}
	if (bbsModalElements.postsContainer) {
		bbsModalElements.postsContainer.style.fontFamily = t.fontFamily;
	}
	if (bbsModalElements.input) {
		bbsModalElements.input.style.fontFamily = t.fontFamily;
		bbsModalElements.input.style.fontSize = Math.max(10.5, lunBbsFontSize) + "px";
	}
	if (bbsModalElements.themeSelect) {
		bbsModalElements.themeSelect.value = lunBbsTheme;
		bbsModalElements.themeSelect.style.fontFamily = t.fontFamily;
	}
	if (bbsModalElements.fontSizeBadge) {
		bbsModalElements.fontSizeBadge.innerText = `${lunBbsFontSize}px`;
		bbsModalElements.fontSizeBadge.style.fontFamily = t.fontFamily;
	}
	if (bbsModalElements.iconOnlyContainer) {
		bbsModalElements.iconOnlyContainer.style.fontFamily = t.fontFamily;
	}
	if (bbsModalElements.iconOnlyCheckbox) {
		bbsModalElements.iconOnlyCheckbox.checked = lunBbsIconOnlyActions;
	}
}

function changeBbsFontSize(delta) {
	lunBbsFontSize = Math.max(9, Math.min(18, (lunBbsFontSize || 11) + delta));
	if (window.localStorage) {
		localStorage.setItem("spkmod-bbs-font-size", String(lunBbsFontSize));
	}
	applyBbsThemeVisuals();
	renderBbsPosts();
}

function getMyBbsInfo() {
	const username = (window.gameState && window.gameState.myPlayerName)
		? String(window.gameState.myPlayerName).trim()
		: (localStorage.getItem("spkmod-last-player-name") || "Player");
	const playerId = (window.gameState && window.gameState.myPlayerId)
		? String(window.gameState.myPlayerId).trim()
		: (localStorage.getItem("spkmod-last-player-id") || "");
	const level = (window.gameState && window.gameState.myStat && window.gameState.myStat.level)
		? Math.max(1, parseInt(window.gameState.myStat.level, 10) || 1)
		: 1;
	const n = username.toLowerCase();
	const isStaff = n === "glas" || n === "sp1cky" || n === "spk41i" || n === "gmdt" || n === "peiyu" || n === "obagi" || playerId === "17086812" || playerId === "17125820";
	return { username, playerId, level, isStaff };
}

function updateBbsWhoAmI() {
	// Deprecated: "Posting as: ..." was removed to reduce clutter
}

function updateBbsUnreadBadge() {
	const btn = (typeof lunPanelElements !== "undefined" && lunPanelElements.bbsBtn) || document.getElementById("spkmod-bbs-btn");
	if (!btn) return;
	let badge = document.getElementById("spkmod-bbs-btn-badge");
	const hasUnread = Array.isArray(lunBbsPosts) && lunBbsPosts.some(p => (p.id || 0) > lunBbsLastReadId);
	if (hasUnread) {
		if (!badge) {
			badge = document.createElement("span");
			badge.id = "spkmod-bbs-btn-badge";
			badge.innerText = "New!";
			badge.style.cssText = "position: absolute; top: -5px; right: -5px; background: #ef4444; color: #fff; font-size: 7.5px; font-weight: bold; padding: 1px 3px; border-radius: 4px; pointer-events: none; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5);";
			btn.appendChild(badge);
		}
	} else {
		if (badge) badge.remove();
	}
}

function markBbsPostsAsRead() {
	if (Array.isArray(lunBbsPosts) && lunBbsPosts.length > 0) {
		const maxId = Math.max(...lunBbsPosts.map(p => p.id || 0));
		if (maxId > lunBbsLastReadId) {
			lunBbsLastReadId = maxId;
			if (window.localStorage) {
				localStorage.setItem("spkmod-bbs-last-read-id", String(maxId));
			}
		}
	}
	const badge = document.getElementById("spkmod-bbs-btn-badge");
	if (badge) badge.remove();
}

function updateBbsComposerState() {
	if (!bbsModalElements.input) return;
	const me = getMyBbsInfo();
	if (bbsModalElements.staffKeyBtn) {
		bbsModalElements.staffKeyBtn.style.display = me.isStaff ? "inline-block" : "none";
	}
	const canPost = (me.level >= 3 || me.isStaff);

	if (!canPost) {
		bbsModalElements.input.readOnly = true;
		bbsModalElements.input.placeholder = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
		bbsModalElements.input.style.cursor = "not-allowed";
		bbsModalElements.input.style.opacity = "0.75";
		bbsModalElements.input.style.borderColor = "rgba(239, 68, 68, 0.4)";
		if (bbsModalElements.submitBtn) {
			bbsModalElements.submitBtn.disabled = true;
			bbsModalElements.submitBtn.style.opacity = "0.5";
			bbsModalElements.submitBtn.style.cursor = "not-allowed";
			bbsModalElements.submitBtn.title = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
		}
		if (bbsModalElements.emojiBtn) {
			bbsModalElements.emojiBtn.disabled = true;
			bbsModalElements.emojiBtn.style.opacity = "0.4";
			bbsModalElements.emojiBtn.style.cursor = "not-allowed";
		}
	} else {
		bbsModalElements.input.readOnly = false;
		bbsModalElements.input.placeholder = t("bbsPlaceholder") || "Write a message... (Enter to send, Shift+Enter for newline)";
		bbsModalElements.input.style.cursor = "";
		bbsModalElements.input.style.opacity = "1";
		bbsModalElements.input.style.borderColor = "rgba(255, 255, 255, 0.2)";
		if (bbsModalElements.submitBtn && (!lunBbsCooldownUntil || Date.now() >= lunBbsCooldownUntil)) {
			bbsModalElements.submitBtn.disabled = false;
			bbsModalElements.submitBtn.style.opacity = "1";
			bbsModalElements.submitBtn.style.cursor = "pointer";
			bbsModalElements.submitBtn.title = "";
		}
		if (bbsModalElements.emojiBtn) {
			bbsModalElements.emojiBtn.disabled = false;
			bbsModalElements.emojiBtn.style.opacity = "0.85";
			bbsModalElements.emojiBtn.style.cursor = "pointer";
		}
	}
}

window.toggleBbsModal = function() {
	if (!lunHudElements.bbsModal) return;
	try {
		const isClosed = lunHudElements.bbsModal.classList.contains("hidden");
		if (isClosed) {
			if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.bbsModal);
			lunHudElements.bbsModal.classList.remove("hidden");
			updateBbsComposerState();
			if (typeof applyBbsThemeVisuals === "function") applyBbsThemeVisuals();
			if (bbsModalElements.postsContainer) {
				bbsModalElements.postsContainer.scrollTop = 0;
			}
			const badge = document.getElementById("spkmod-bbs-btn-badge");
			if (badge) badge.remove();
			fetchBbsPosts();
			if (!lunBbsPollTimer) {
				lunBbsPollTimer = setInterval(() => {
					if (lunHudElements.bbsModal && !lunHudElements.bbsModal.classList.contains("hidden")) {
						fetchBbsPosts(true);
					}
				}, 15000);
			}
		} else {
			lunHudElements.bbsModal.classList.add("hidden");
			if (typeof lunEmojiPreviewTooltip !== "undefined" && lunEmojiPreviewTooltip) {
				lunEmojiPreviewTooltip.style.display = "none";
			}
			if (window.lunEmojiTargetInput === bbsModalElements.input) {
				if (typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel) {
					lunEmojiPickerPanel.remove();
					lunEmojiPickerPanel = null;
				}
				window.lunEmojiTargetInput = null;
			}
			markBbsPostsAsRead();
			if (lunBbsPollTimer) {
				clearInterval(lunBbsPollTimer);
				lunBbsPollTimer = null;
			}
			if (lunBbsSeenTimer) {
				clearTimeout(lunBbsSeenTimer);
				lunBbsSeenTimer = null;
			}
		}
	} catch (err) {
		console.error("[SpeakiMod+] Error in toggleBbsModal:", err);
	}
};

async function fetchBbsPosts(isBackground) {
	if (lunBbsLoading) return;
	if (isBackground && window.spkmodServerHealth && !window.spkmodServerHealth.isAvailable()) return;
	lunBbsLoading = true;
	if (bbsModalElements.refreshBtn) bbsModalElements.refreshBtn.style.opacity = "0.4";

	try {
		const sUrl = getBbsServerUrl();
		const safeFetch = window.spkmodSafeFetch || window.fetch;
		const res = await safeFetch(`${sUrl}/api/bbs/posts?limit=100`, {}, 5000);
		if (res.ok) {
			const data = await res.json();
			if (window.spkmodServerHealth) window.spkmodServerHealth.recordSuccess();
			if (data && data.success && Array.isArray(data.posts)) {
				lunBbsPosts = data.posts;
				renderBbsPosts();
				if (lunHudElements.bbsModal && !lunHudElements.bbsModal.classList.contains("hidden")) {
					markBbsPostsAsRead();
					if (lunBbsSeenTimer) clearTimeout(lunBbsSeenTimer);
					lunBbsSeenTimer = setTimeout(() => {
						if (bbsModalElements.postsContainer) {
							const badges = bbsModalElements.postsContainer.querySelectorAll(".spkmod-bbs-new-badge");
							badges.forEach(b => {
								b.style.transition = "opacity 0.5s ease-out";
								b.style.opacity = "0";
								setTimeout(() => b.remove(), 500);
							});
						}
					}, 4000);
				} else {
					updateBbsUnreadBadge();
				}
			}
		}
	} catch (err) {
		if (window.spkmodServerHealth) window.spkmodServerHealth.recordFailure();
		console.warn("[SpeakiMod+] Failed to fetch BBS posts:", err);
		if (!isBackground && bbsModalElements.postsContainer && lunBbsPosts.length === 0) {
			bbsModalElements.postsContainer.innerHTML = `<div style="text-align: center; color: #f87171; font-size: 11px; padding: 20px 0;">${t("bbsError")}</div>`;
		}
	} finally {
		lunBbsLoading = false;
		if (bbsModalElements.refreshBtn) bbsModalElements.refreshBtn.style.opacity = "0.8";
	}
}

function setBbsReplyTarget(id, username) {
	const me = getMyBbsInfo();
	if (me.level < 3 && !me.isStaff) {
		if (bbsModalElements.statusMsg) {
			bbsModalElements.statusMsg.innerText = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
			bbsModalElements.statusMsg.style.display = "";
			setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3500);
		}
		if (typeof updateBbsComposerState === "function") updateBbsComposerState();
		return;
	}
	if (!id || (lunBbsReplyTarget && lunBbsReplyTarget.id === id)) {
		lunBbsReplyTarget = null;
	} else {
		lunBbsReplyTarget = { id: parseInt(id, 10), username: String(username || "Player") };
	}
	updateBbsReplyBar();
	updateBbsRadioIndicators();
	if (bbsModalElements.input) {
		bbsModalElements.input.focus();
		setTimeout(() => {
			if (bbsModalElements.input) {
				bbsModalElements.input.focus();
			}
		}, 10);
	}
}

function updateBbsRadioIndicators() {
	if (!bbsModalElements.postsContainer) return;
	const radios = bbsModalElements.postsContainer.querySelectorAll(".spkmod-bbs-radio");
	radios.forEach(el => {
		const pId = parseInt(el.getAttribute("data-post-id"), 10);
		const isActive = lunBbsReplyTarget && lunBbsReplyTarget.id === pId;
		el.innerText = isActive ? "● " : "◯ ";
		el.style.color = isActive ? "#38bdf8" : "#64748b";
	});
}

function updateBbsReplyBar() {
	if (!bbsModalElements.replyBar) return;
	if (lunBbsReplyTarget) {
		bbsModalElements.replyBar.style.display = "flex";
		if (bbsModalElements.replyBarText) {
			bbsModalElements.replyBarText.innerText = "↩ " + t("bbsReplyingTo", lunBbsReplyTarget.id, lunBbsReplyTarget.username);
		}
		if (bbsModalElements.replyBarCancel) {
			bbsModalElements.replyBarCancel.innerText = "✕ " + (t("bbsCancelReply") || "Cancel");
		}
	} else {
		bbsModalElements.replyBar.style.display = "none";
	}
}

function insertBbsReply(postId) {
	const post = Array.isArray(lunBbsPosts) && lunBbsPosts.find(p => p.id === postId);
	setBbsReplyTarget(postId, post ? post.username : "Player");
}

function buildBbsTree(posts) {
	const postMap = new Map();
	const roots = [];

	posts.forEach(p => {
		let parentId = (p.replyTo && parseInt(p.replyTo, 10)) || null;
		if (!parentId && typeof p.message === "string") {
			const m = p.message.match(/^>>(\d+)/);
			if (m) {
				parentId = parseInt(m[1], 10);
			}
		}
		postMap.set(p.id, {
			post: p,
			parentId: parentId,
			children: []
		});
	});

	posts.forEach(p => {
		const node = postMap.get(p.id);
		if (node.parentId && postMap.has(node.parentId)) {
			postMap.get(node.parentId).children.push(node);
		} else {
			roots.push(node);
		}
	});

	// Helper to find latest post ID in a thread branch
	const getLatestId = (node) => {
		let max = (node.post && node.post.id) || 0;
		if (Array.isArray(node.children)) {
			node.children.forEach(c => {
				max = Math.max(max, getLatestId(c));
			});
		}
		return max;
	};

	// Top messages should be the newer ones (newest thread / latest activity at top)
	roots.sort((a, b) => getLatestId(b) - getLatestId(a));

	return roots;
}

function countBbsDescendants(node) {
	if (!node || !Array.isArray(node.children)) return 0;
	let total = node.children.length;
	for (const child of node.children) {
		total += countBbsDescendants(child);
	}
	return total;
}

function hasUnreadBbsDescendant(node, unreadCutoff) {
	if (!node || !Array.isArray(node.children)) return false;
	for (const child of node.children) {
		if (child.post && child.post.id && child.post.id > unreadCutoff) return true;
		if (hasUnreadBbsDescendant(child, unreadCutoff)) return true;
	}
	return false;
}

function findRootForPostId(roots, targetId) {
	function hasPost(node, id) {
		if (!node || !node.post) return false;
		if (node.post.id === id) return true;
		if (Array.isArray(node.children)) {
			for (const c of node.children) {
				if (hasPost(c, id)) return true;
			}
		}
		return false;
	}
	if (!Array.isArray(roots)) return null;
	for (const r of roots) {
		if (hasPost(r, targetId)) return r;
	}
	return null;
}

function setBbsStatusMessage(msg, isError = true, durationMs = 4000) {
	if (!bbsModalElements.statusMsg) return;
	bbsModalElements.statusMsg.innerText = msg;
	bbsModalElements.statusMsg.style.color = isError ? "#f87171" : "#4ade80";
	bbsModalElements.statusMsg.style.display = "";
	if (bbsModalElements._statusTimer) clearTimeout(bbsModalElements._statusTimer);
	bbsModalElements._statusTimer = setTimeout(() => {
		if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none";
	}, durationMs);
}

function spkmodPrompt({ title = "Enter Value", label = "", defaultValue = "", placeholder = "", isPassword = false, showClear = false } = {}) {
	return new Promise((resolve) => {
		const existing = document.getElementById("spkmod-custom-dialog-backdrop");
		if (existing) existing.remove();

		const backdrop = document.createElement("div");
		backdrop.id = "spkmod-custom-dialog-backdrop";
		backdrop.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(2px); z-index: 2147483646 !important; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; padding: 12px;";

		const dialog = document.createElement("div");
		dialog.style.cssText = "background: #1e293b; border: 1px solid #475569; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); width: 340px; max-width: 92vw; padding: 16px; color: #f1f5f9; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;";

		const titleRow = document.createElement("div");
		titleRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: bold; color: #38bdf8;";
		const titleText = document.createElement("span");
		titleText.innerText = title;
		titleRow.appendChild(titleText);

		const closeDialog = (val) => {
			window.removeEventListener("keydown", onDialogKey, true);
			backdrop.remove();
			resolve(val);
		};

		const closeX = document.createElement("span");
		closeX.innerText = "✕";
		closeX.style.cssText = "cursor: pointer; color: #94a3b8; font-size: 13px; padding: 0 4px; line-height: 1;";
		closeX.onmouseenter = () => closeX.style.color = "#fff";
		closeX.onmouseleave = () => closeX.style.color = "#94a3b8";
		closeX.onclick = (e) => { e.stopPropagation(); closeDialog(null); };
		titleRow.appendChild(closeX);
		dialog.appendChild(titleRow);

		if (label) {
			const labelEl = document.createElement("div");
			labelEl.style.cssText = "font-size: 11px; color: #cbd5e1; line-height: 1.4;";
			labelEl.innerText = label;
			dialog.appendChild(labelEl);
		}

		const input = document.createElement("input");
		input.type = isPassword ? "password" : "text";
		input.value = defaultValue || "";
		input.placeholder = placeholder || "";
		input.style.cssText = "background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 5px; color: #f8fafc; font-size: 11.5px; padding: 6px 8px; outline: none; width: 100%; box-sizing: border-box;";
		input.onfocus = () => input.style.borderColor = "#38bdf8";
		input.onblur = () => input.style.borderColor = "#334155";
		dialog.appendChild(input);

		const btnRow = document.createElement("div");
		btnRow.style.cssText = "display: flex; justify-content: flex-end; align-items: center; gap: 6px; margin-top: 4px;";

		if (showClear) {
			const clearBtn = document.createElement("button");
			clearBtn.innerText = "Clear Key";
			clearBtn.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 11px; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: auto;";
			clearBtn.onclick = (e) => { e.stopPropagation(); closeDialog(""); };
			btnRow.appendChild(clearBtn);
		}

		const cancelBtn = document.createElement("button");
		cancelBtn.innerText = "Cancel";
		cancelBtn.style.cssText = "background: rgba(148, 163, 184, 0.15); border: 1px solid rgba(148, 163, 184, 0.3); color: #cbd5e1; font-size: 11px; padding: 4px 10px; border-radius: 4px; cursor: pointer;";
		cancelBtn.onclick = (e) => { e.stopPropagation(); closeDialog(null); };
		btnRow.appendChild(cancelBtn);

		const okBtn = document.createElement("button");
		okBtn.innerText = "Save";
		okBtn.style.cssText = "background: #2563eb; border: 1px solid #3b82f6; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 4px; cursor: pointer;";
		okBtn.onclick = (e) => { e.stopPropagation(); closeDialog(input.value); };
		btnRow.appendChild(okBtn);

		dialog.appendChild(btnRow);
		backdrop.appendChild(dialog);
		document.body.appendChild(backdrop);

		dialog.onclick = (e) => e.stopPropagation();
		dialog.onpointerdown = (e) => e.stopPropagation();
		dialog.onmousedown = (e) => e.stopPropagation();

		backdrop.onclick = (e) => { e.stopPropagation(); closeDialog(null); };
		backdrop.onpointerdown = (e) => e.stopPropagation();
		backdrop.onmousedown = (e) => e.stopPropagation();

		input.onkeydown = (e) => {
			e.stopPropagation();
			if (e.key === "Enter") {
				e.preventDefault();
				closeDialog(input.value);
			} else if (e.key === "Escape") {
				e.preventDefault();
				closeDialog(null);
			}
		};
		input.onkeyup = (e) => e.stopPropagation();
		input.onkeypress = (e) => e.stopPropagation();

		const onDialogKey = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				e.preventDefault();
				closeDialog(null);
			}
		};
		window.addEventListener("keydown", onDialogKey, true);

		setTimeout(() => {
			input.focus();
			input.select();
		}, 30);
	});
}
window.spkmodPrompt = spkmodPrompt;

function spkmodConfirm({ title = "Confirm", message = "Are you sure?", confirmText = "Confirm", confirmDanger = true, cancelText = "Cancel" } = {}) {
	return new Promise((resolve) => {
		const existing = document.getElementById("spkmod-custom-dialog-backdrop");
		if (existing) existing.remove();

		const backdrop = document.createElement("div");
		backdrop.id = "spkmod-custom-dialog-backdrop";
		backdrop.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(2px); z-index: 2147483646 !important; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; padding: 12px;";

		const dialog = document.createElement("div");
		dialog.style.cssText = "background: #1e293b; border: 1px solid #475569; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); width: 320px; max-width: 92vw; padding: 16px; color: #f1f5f9; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;";

		const titleRow = document.createElement("div");
		titleRow.style.cssText = "display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: bold; color: " + (confirmDanger ? "#f87171" : "#38bdf8") + ";";
		const titleText = document.createElement("span");
		titleText.innerText = title;
		titleRow.appendChild(titleText);

		const closeDialog = (val) => {
			window.removeEventListener("keydown", onConfirmKey, true);
			backdrop.remove();
			resolve(val);
		};

		const closeX = document.createElement("span");
		closeX.innerText = "✕";
		closeX.style.cssText = "cursor: pointer; color: #94a3b8; font-size: 13px; padding: 0 4px; line-height: 1;";
		closeX.onmouseenter = () => closeX.style.color = "#fff";
		closeX.onmouseleave = () => closeX.style.color = "#94a3b8";
		closeX.onclick = (e) => { e.stopPropagation(); closeDialog(false); };
		titleRow.appendChild(closeX);
		dialog.appendChild(titleRow);

		const msgEl = document.createElement("div");
		msgEl.style.cssText = "font-size: 11.5px; color: #cbd5e1; line-height: 1.4;";
		msgEl.innerText = message;
		dialog.appendChild(msgEl);

		const btnRow = document.createElement("div");
		btnRow.style.cssText = "display: flex; justify-content: flex-end; align-items: center; gap: 6px; margin-top: 4px;";

		const cancelBtn = document.createElement("button");
		cancelBtn.innerText = cancelText;
		cancelBtn.style.cssText = "background: rgba(148, 163, 184, 0.15); border: 1px solid rgba(148, 163, 184, 0.3); color: #cbd5e1; font-size: 11px; padding: 4px 10px; border-radius: 4px; cursor: pointer;";
		cancelBtn.onclick = (e) => { e.stopPropagation(); closeDialog(false); };
		btnRow.appendChild(cancelBtn);

		const confirmBtn = document.createElement("button");
		confirmBtn.innerText = confirmText;
		confirmBtn.style.cssText = confirmDanger
			? "background: #dc2626; border: 1px solid #ef4444; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 4px; cursor: pointer;"
			: "background: #2563eb; border: 1px solid #3b82f6; color: #fff; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 4px; cursor: pointer;";
		confirmBtn.onclick = (e) => { e.stopPropagation(); closeDialog(true); };
		btnRow.appendChild(confirmBtn);

		dialog.appendChild(btnRow);
		backdrop.appendChild(dialog);
		document.body.appendChild(backdrop);

		dialog.onclick = (e) => e.stopPropagation();
		dialog.onpointerdown = (e) => e.stopPropagation();
		dialog.onmousedown = (e) => e.stopPropagation();

		backdrop.onclick = (e) => { e.stopPropagation(); closeDialog(false); };
		backdrop.onpointerdown = (e) => e.stopPropagation();
		backdrop.onmousedown = (e) => e.stopPropagation();

		confirmBtn.focus();
		const onConfirmKey = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				e.preventDefault();
				closeDialog(false);
			} else if (e.key === "Enter") {
				e.stopPropagation();
				e.preventDefault();
				closeDialog(true);
			}
		};
		window.addEventListener("keydown", onConfirmKey, true);
	});
}
window.spkmodConfirm = spkmodConfirm;

function renderBbsPosts() {
	if (!bbsModalElements.postsContainer) return;
	const container = bbsModalElements.postsContainer;
	const me = getMyBbsInfo();
	const curTheme = LUN_BBS_THEMES[lunBbsTheme] || LUN_BBS_THEMES["normal"];
	const baseFs = lunBbsFontSize || 11;
	const smallFs = Math.max(8, Math.round(baseFs * 0.86 * 10) / 10);
	const btnFs = Math.max(7.5, Math.round(baseFs * 0.78 * 10) / 10);

	if (bbsModalElements.countBadge) {
		bbsModalElements.countBadge.innerText = String(lunBbsPosts.length);
	}

	if (lunBbsPosts.length === 0) {
		container.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: ${baseFs}px; padding: 30px 10px;">${t("bbsEmpty")}</div>`;
		return;
	}

	const wasAtTop = container.scrollTop <= 40;
	const prevScrollTop = container.scrollTop;
	container.innerHTML = "";
	const unreadCutoff = lunBbsLastReadId;

	const roots = buildBbsTree(lunBbsPosts);

	function renderNode(node, depth, visited = new Set()) {
		if (visited.has(node.post.id) || depth > 10) return;
		visited.add(node.post.id);

		const post = node.post;
		const postEl = document.createElement("div");
		postEl.id = `spkmod-bbs-post-${post.id}`;
		postEl.dataset.depth = String(depth);

		const indentPx = Math.min(depth, 4) * (curTheme.id === "simple" ? 16 : 22);
		postEl.style.cssText = `background: ${depth > 0 ? curTheme.postReplyBg : curTheme.postRootBg}; border-bottom: ${curTheme.postBorder}; padding: ${curTheme.padding}; margin-left: ${indentPx}px; display: flex; flex-direction: column; gap: 2px; box-sizing: border-box; font-size: ${baseFs}px; line-height: ${curTheme.lineHeight}; border-radius: ${depth > 0 ? '0 4px 4px 0' : '4px'}; ${depth > 0 ? ('border-left: ' + curTheme.replyBorderLeft + ';') : ''}`;

		const lineEl = document.createElement("div");
		lineEl.style.cssText = `display: block; word-break: break-word; font-size: ${baseFs}px;`;

		// Bullet symbol (• for root, ◦ for level 1, ▪ for level 2+)
		const bulletSpan = document.createElement("span");
		bulletSpan.innerText = depth === 0 ? "• " : (depth === 1 ? "◦ " : "▪ ");
		bulletSpan.style.cssText = `color: ${depth === 0 ? curTheme.bulletColorRoot : curTheme.bulletColorChild}; font-weight: bold; margin-right: 2px; user-select: none; font-size: ${baseFs}px;`;
		lineEl.appendChild(bulletSpan);

		// Reply radio circle (◯ or ●)
		const isCurrentReplyTarget = lunBbsReplyTarget && lunBbsReplyTarget.id === post.id;
		const radioSpan = document.createElement("span");
		radioSpan.className = "spkmod-bbs-radio";
		radioSpan.setAttribute("data-post-id", String(post.id));
		radioSpan.innerText = isCurrentReplyTarget ? "● " : "◯ ";
		radioSpan.title = isCurrentReplyTarget ? "Cancel reply selection" : `Reply to #${post.id}`;
		radioSpan.style.cssText = `cursor: pointer; user-select: none; margin-right: 4px; font-size: ${baseFs}px; color: ${isCurrentReplyTarget ? curTheme.anchorColor : curTheme.timeColor};`;
		radioSpan.onpointerdown = (e) => { e.stopPropagation(); };
		radioSpan.onmousedown = (e) => { e.stopPropagation(); };
		radioSpan.onclick = (e) => {
			e.stopPropagation();
			setBbsReplyTarget(post.id, post.username);
		};
		lineEl.appendChild(radioSpan);

		// #ID anchor
		const numSpan = document.createElement("span");
		numSpan.innerText = `#${post.id} `;
		numSpan.style.cssText = `color: ${curTheme.anchorColor}; font-weight: bold; cursor: pointer; user-select: none; margin-right: 3px; font-size: ${baseFs}px;`;
		numSpan.title = `Click to reply to #${post.id}`;
		numSpan.onpointerdown = (e) => { e.stopPropagation(); };
		numSpan.onmousedown = (e) => { e.stopPropagation(); };
		numSpan.onclick = (e) => {
			e.stopPropagation();
			setBbsReplyTarget(post.id, post.username);
		};
		lineEl.appendChild(numSpan);

		// Username
		const nameSpan = document.createElement("span");
		nameSpan.innerText = post.username || "Player";
		nameSpan.style.cssText = `font-weight: 600; color: ${curTheme.nameColor}; margin-right: 2px; font-size: ${baseFs}px;`;
		lineEl.appendChild(nameSpan);

		// Level
		const lvSpan = document.createElement("span");
		lvSpan.innerText = `(Lv.${post.level || 1}): `;
		lvSpan.style.cssText = `color: ${curTheme.levelColor}; margin-right: 4px; font-size: ${baseFs}px;`;
		lineEl.appendChild(lvSpan);

		// Message body - if replying to parent, strip redundant >>parentId prefix
		const msgSpan = document.createElement("span");
		msgSpan.style.cssText = `color: ${curTheme.textColor}; font-weight: 400; white-space: pre-wrap; font-size: ${baseFs}px;`;
		let rawMsg = post.message || "";
		if (node.parentId) {
			const stripped = rawMsg.replace(new RegExp(`^>>${node.parentId}\\s*`), "");
			if (stripped.trim().length > 0) {
				rawMsg = stripped;
			}
		}
		const escapedMsg = escapeBbsHtml(rawMsg);
		let linkedMsg = escapedMsg;
		if (typeof parseCustomEmojisToHtml === "function") {
			linkedMsg = parseCustomEmojisToHtml(linkedMsg);
		}
		linkedMsg = linkedMsg.replace(/&gt;&gt;(\d+)/g, (match, pNum) => {
			return `<span class="spkmod-bbs-quote-anchor" data-target="${pNum}" style="color: ${curTheme.anchorColor}; text-decoration: underline; cursor: pointer; font-weight: 600;">&gt;&gt;${pNum}</span>`;
		});
		msgSpan.innerHTML = linkedMsg;
		lineEl.appendChild(msgSpan);

		// Timestamp
		const timeSpan = document.createElement("span");
		timeSpan.innerText = ` -- ${formatBbsTime(post.createdAt, curTheme.id)}`;
		timeSpan.style.cssText = `color: ${curTheme.timeColor}; font-size: ${smallFs}px; margin-left: 6px; white-space: nowrap;`;
		lineEl.appendChild(timeSpan);

		// New! badge
		if (post.id && post.id > unreadCutoff) {
			const newBadge = document.createElement("span");
			newBadge.className = "spkmod-bbs-new-badge";
			newBadge.innerText = " New!";
			newBadge.style.cssText = `color: #ef4444; font-weight: bold; font-size: ${smallFs}px; margin-left: 2px; white-space: nowrap; cursor: pointer;`;
			newBadge.title = "Click to dismiss";
			newBadge.onclick = (e) => {
				e.stopPropagation();
				newBadge.remove();
				if (window.localStorage) {
					const cur = parseInt(localStorage.getItem("spkmod-bbs-last-read-id") || "0", 10);
					const nextId = Math.max(cur, post.id);
					localStorage.setItem("spkmod-bbs-last-read-id", String(nextId));
					lunBbsLastReadId = nextId;
				}
			};
			lineEl.appendChild(newBadge);
		}

		// Actions
		const actionsSpan = document.createElement("span");
		actionsSpan.style.cssText = "display: inline-flex; align-items: center; gap: 3px; margin-left: 6px; vertical-align: middle; white-space: nowrap;";

		const iconOnly = Boolean(lunBbsIconOnlyActions);

		// Reply button
		const replyBtn = document.createElement("button");
		replyBtn.innerText = iconOnly ? "↩" : ("↩ " + (t("bbsReply") || "Reply"));
		replyBtn.title = "Reply to #" + post.id;
		replyBtn.style.cssText = `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: ${curTheme.anchorColor}; border-radius: 3px; font-size: ${iconOnly ? Math.max(9, baseFs - 1) : btnFs}px; padding: 0 ${iconOnly ? '3px' : '4px'}; height: 16px; cursor: pointer; line-height: 14px;`;
		replyBtn.onpointerdown = (e) => { e.stopPropagation(); };
		replyBtn.onmousedown = (e) => { e.stopPropagation(); };
		replyBtn.onclick = (e) => {
			e.stopPropagation();
			setBbsReplyTarget(post.id, post.username);
		};
		actionsSpan.appendChild(replyBtn);

		// Heart / Like button with counter
		const heartBtn = document.createElement("button");
		heartBtn.className = "spkmod-bbs-heart-btn";
		const heartCount = (typeof post.hearts === "number") ? post.hearts : 0;
		const isHearted = lunBbsHeartedPostIds.has(post.id);
		const heartIcon = isHearted ? "❤️" : "🤍";

		heartBtn.title = isHearted ? (t("bbsUnheart") || "Remove heart") : (t("bbsHeart") || "Heart this reply");
		heartBtn.innerHTML = `<span style="font-size: ${Math.max(8.5, baseFs - 1.5)}px; line-height: 1;">${heartIcon}</span><span style="font-size: ${btnFs}px; font-weight: 600; line-height: 1; margin-left: 2px;">${heartCount}</span>`;

		const heartBg = isHearted ? "rgba(239, 68, 68, 0.22)" : "rgba(255, 255, 255, 0.08)";
		const heartBorder = isHearted ? "rgba(239, 68, 68, 0.45)" : "rgba(255, 255, 255, 0.15)";
		const heartColor = isHearted ? "#fca5a5" : curTheme.anchorColor;

		heartBtn.style.cssText = `background: ${heartBg}; border: 1px solid ${heartBorder}; color: ${heartColor}; border-radius: 3px; font-size: ${btnFs}px; padding: 0 4px; height: 16px; cursor: pointer; line-height: 14px; display: inline-flex; align-items: center; user-select: none; transition: transform 0.12s ease, background 0.15s ease;`;

		heartBtn.onpointerdown = (e) => { e.stopPropagation(); };
		heartBtn.onmousedown = (e) => { e.stopPropagation(); };
		heartBtn.onmouseenter = () => {
			heartBtn.style.transform = "scale(1.08)";
			if (!isHearted) heartBtn.style.background = "rgba(255, 255, 255, 0.14)";
		};
		heartBtn.onmouseleave = () => {
			heartBtn.style.transform = "scale(1)";
			heartBtn.style.background = heartBg;
		};
		heartBtn.onclick = (e) => {
			e.stopPropagation();
			toggleBbsHeart(post.id, heartBtn);
		};
		actionsSpan.appendChild(heartBtn);

		// Translate button
		const transBtn = document.createElement("button");
		const isTranslated = Boolean(lunBbsTranslations[post.id]);
		if (iconOnly) {
			transBtn.innerText = "🌐";
			transBtn.title = isTranslated ? (t("bbsShowOriginal") || "Show original") : (t("bbsTranslateBtn") || "Translate message");
		} else {
			transBtn.innerText = isTranslated ? ("🌐 " + (t("bbsShowOriginal") || "Orig")) : ("🌐 " + (t("bbsTranslateBtn") || "Trans"));
			transBtn.title = isTranslated ? "Show original" : "Translate message";
		}
		const transBg = (iconOnly && isTranslated) ? "rgba(59, 130, 246, 0.3)" : "rgba(255,255,255,0.08)";
		transBtn.style.cssText = `background: ${transBg}; border: 1px solid rgba(255,255,255,0.15); color: ${curTheme.anchorColor}; border-radius: 3px; font-size: ${iconOnly ? Math.max(9, baseFs - 1) : btnFs}px; padding: 0 ${iconOnly ? '3px' : '4px'}; height: 16px; cursor: pointer; line-height: 14px;`;
		transBtn.onclick = async (e) => {
			e.stopPropagation();
			if (lunBbsTranslations[post.id]) {
				delete lunBbsTranslations[post.id];
				renderBbsPosts();
			} else {
				transBtn.innerText = "⏳";
				transBtn.disabled = true;
				let targetLang = (typeof lunTranslateTarget === "string" && lunTranslateTarget) ? lunTranslateTarget : spkmodLang;
				if (targetLang === "en-US") targetLang = "en";
				if (targetLang === "es-419") targetLang = "es";
				if (!targetLang) targetLang = "en";
				try {
					const translated = (typeof translateTextToLang === "function")
						? await translateTextToLang(rawMsg, targetLang)
						: rawMsg;
					lunBbsTranslations[post.id] = { text: translated, lang: targetLang };
				} catch (_) {
					lunBbsTranslations[post.id] = { text: rawMsg, lang: targetLang };
				}
				renderBbsPosts();
			}
		};
		actionsSpan.appendChild(transBtn);

		// Delete button (Staff only)
		if (me.isStaff) {
			const delBtn = document.createElement("button");
			delBtn.innerText = "🗑️";
			delBtn.title = "Delete post (Staff)";
			delBtn.style.cssText = `background: transparent; border: none; cursor: pointer; color: #ef4444; font-size: ${Math.max(9, baseFs - 1)}px; padding: 0 2px; opacity: 0.75; line-height: 1;`;
			delBtn.onmouseenter = () => delBtn.style.opacity = "1";
			delBtn.onmouseleave = () => delBtn.style.opacity = "0.75";
			delBtn.onclick = async (e) => {
				e.stopPropagation();
				const confirmMsg = t("bbsDeleteConfirm", post.id, post.username) || `Delete post #${post.id} by ${post.username}?`;
				const confirmed = await spkmodConfirm({
					title: "🗑️ Delete BBS Post",
					message: confirmMsg,
					confirmText: "Delete",
					confirmDanger: true,
					cancelText: "Cancel"
				});
				if (confirmed) {
					deleteBbsPost(post.id);
				}
			};
			actionsSpan.appendChild(delBtn);
		}

		lineEl.appendChild(actionsSpan);
		postEl.appendChild(lineEl);

		// Translation Box
		if (lunBbsTranslations[post.id]) {
			const transData = lunBbsTranslations[post.id];
			const transStr = (typeof transData === "object" && transData !== null) ? transData.text : transData;
			let transLangCode = (typeof transData === "object" && transData !== null && transData.lang) 
				? transData.lang 
				: ((typeof lunTranslateTarget === "string" && lunTranslateTarget) ? lunTranslateTarget : spkmodLang);
			if (transLangCode === "es-419") transLangCode = "es";
			if (transLangCode === "en-US") transLangCode = "en";

			const transBox = document.createElement("div");
			transBox.style.cssText = `margin-top: 2px; padding: 2px 6px; background: rgba(30, 58, 138, 0.35); border-left: 2px solid ${curTheme.anchorColor}; border-radius: 3px; font-size: ${smallFs}px; color: ${curTheme.textColor}; word-break: break-word;`;
			let transText = escapeBbsHtml(transStr);
			if (typeof parseCustomEmojisToHtml === "function") {
				transText = parseCustomEmojisToHtml(transText);
			}
			transBox.innerHTML = `<span style="font-size: ${Math.max(7.5, smallFs - 1.5)}px; opacity: 0.8; margin-right: 4px;">🌐 [${(transLangCode || 'en').toUpperCase()}]:</span>${transText}`;
			postEl.appendChild(transBox);
		}

		// Quote anchor scroll handler
		postEl.querySelectorAll(".spkmod-bbs-quote-anchor").forEach(anchor => {
			anchor.onclick = (e) => {
				e.stopPropagation();
				const targetId = parseInt(anchor.getAttribute("data-target"), 10);
				let targetEl = document.getElementById(`spkmod-bbs-post-${targetId}`);
				if (!targetEl && lunBbsCollapseReplies && typeof findRootForPostId === "function") {
					const rootNode = findRootForPostId(roots, targetId);
					if (rootNode) {
						lunBbsExpandedThreadIds.add(rootNode.post.id);
						renderBbsPosts();
						targetEl = document.getElementById(`spkmod-bbs-post-${targetId}`);
					}
				}
				if (targetEl && bbsModalElements.postsContainer) {
					const cRect = bbsModalElements.postsContainer.getBoundingClientRect();
					const tRect = targetEl.getBoundingClientRect();
					bbsModalElements.postsContainer.scrollTop += (tRect.top - cRect.top) - 30;
					targetEl.style.transition = "background 0.3s";
					targetEl.style.background = "rgba(59, 130, 246, 0.4)";
					setTimeout(() => {
						targetEl.style.background = targetEl.dataset.depth > 0 ? "rgba(15, 23, 42, 0.28)" : "rgba(15, 23, 42, 0.45)";
					}, 1200);
				}
			};
		});

		// Clicking custom emojis inside post or translation to insert into composer
		postEl.addEventListener("click", (e) => {
			const emojiEl = e.target.closest('.spkmod-custom-emoji');
			if (emojiEl) {
				e.stopPropagation();
				e.preventDefault();
				const tag = emojiEl.getAttribute('title');
				if (tag && typeof insertEmojiIntoChat === 'function') {
					if (bbsModalElements.input) {
						window.lunEmojiTargetInput = bbsModalElements.input;
					}
					insertEmojiIntoChat(tag.endsWith(" ") ? tag : tag + " ");
				}
			}
		});

		container.appendChild(postEl);

		// Render children / replies
		if (Array.isArray(node.children) && node.children.length > 0) {
			if (depth === 0 && lunBbsCollapseReplies) {
				const replyCount = countBbsDescendants(node);
				const isExpanded = lunBbsExpandedThreadIds.has(node.post.id);

				if (!isExpanded) {
					const toggleBtn = document.createElement("button");
					toggleBtn.type = "button";
					toggleBtn.className = "spkmod-bbs-replies-toggle";
					const indentPx = (curTheme.id === "simple" ? 16 : 22);
					toggleBtn.style.cssText = `
						display: inline-flex;
						align-items: center;
						gap: 5px;
						margin-left: ${indentPx}px;
						margin-top: 2px;
						margin-bottom: 3px;
						padding: 2px 8px;
						font-size: ${Math.max(8.5, btnFs)}px;
						background: rgba(255, 255, 255, 0.05);
						border: 1px dashed rgba(255, 255, 255, 0.2);
						border-left: ${curTheme.replyBorderLeft};
						border-radius: 4px;
						color: ${curTheme.anchorColor};
						cursor: pointer;
						user-select: none;
						line-height: 1.4;
						width: fit-content;
						transition: background 0.15s, border-color 0.15s;
					`;
					toggleBtn.onmouseenter = () => { toggleBtn.style.background = "rgba(255, 255, 255, 0.1)"; };
					toggleBtn.onmouseleave = () => { toggleBtn.style.background = "rgba(255, 255, 255, 0.05)"; };

					const hasNew = hasUnreadBbsDescendant(node, unreadCutoff);
					const replyWord = replyCount === 1 ? (t("bbsReplyWordSingle") || "reply") : (t("bbsReplyWordPlural") || "replies");
					toggleBtn.innerHTML = `💬 +${replyCount} ${replyWord}${hasNew ? ' <span style="color: #ef4444; font-weight: bold;">(New!)</span>' : ''} <span style="opacity: 0.8; font-weight: 600;">[▶ ${t("bbsShowReplies") || "Show"}]</span>`;

					toggleBtn.onclick = (e) => {
						e.stopPropagation();
						lunBbsExpandedThreadIds.add(node.post.id);
						renderBbsPosts();
					};
					container.appendChild(toggleBtn);
				} else {
					node.children.forEach(child => {
						renderNode(child, depth + 1, visited);
					});

					const collapseBtn = document.createElement("button");
					collapseBtn.type = "button";
					collapseBtn.className = "spkmod-bbs-replies-toggle";
					const indentPx = (curTheme.id === "simple" ? 16 : 22);
					collapseBtn.style.cssText = `
						display: inline-flex;
						align-items: center;
						gap: 4px;
						margin-left: ${indentPx}px;
						margin-top: 2px;
						margin-bottom: 4px;
						padding: 2px 7px;
						font-size: ${Math.max(8, btnFs - 0.5)}px;
						background: transparent;
						border: 1px dashed rgba(255, 255, 255, 0.15);
						border-radius: 3px;
						color: ${curTheme.timeColor};
						cursor: pointer;
						user-select: none;
						line-height: 1.3;
						opacity: 0.8;
						width: fit-content;
						transition: opacity 0.15s, color 0.15s;
					`;
					collapseBtn.onmouseenter = () => { collapseBtn.style.opacity = "1"; collapseBtn.style.color = curTheme.anchorColor; };
					collapseBtn.onmouseleave = () => { collapseBtn.style.opacity = "0.8"; collapseBtn.style.color = curTheme.timeColor; };
					collapseBtn.innerHTML = `▲ ${t("bbsCollapseReplies") || "Collapse replies"} <span style="opacity: 0.7;">(–${replyCount})</span>`;

					collapseBtn.onclick = (e) => {
						e.stopPropagation();
						lunBbsExpandedThreadIds.delete(node.post.id);
						renderBbsPosts();
					};
					container.appendChild(collapseBtn);
				}
			} else {
				node.children.forEach(child => {
					renderNode(child, depth + 1, visited);
				});
			}
		}
	}

	roots.forEach(root => {
		renderNode(root, 0);
	});

	if (wasAtTop) {
		container.scrollTop = 0;
	} else {
		container.scrollTop = prevScrollTop;
	}
}

async function sendBbsPost() {
	if (!bbsModalElements.input) return;
	const msg = bbsModalElements.input.value.trim();
	if (!msg) return;

	const me = getMyBbsInfo();
	if (me.level < 3 && !me.isStaff) {
		if (bbsModalElements.statusMsg) {
			bbsModalElements.statusMsg.innerText = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
			bbsModalElements.statusMsg.style.display = "";
			setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3500);
		}
		if (typeof updateBbsComposerState === "function") updateBbsComposerState();
		return;
	}

	if (Date.now() < lunBbsCooldownUntil) {
		const waitSec = Math.ceil((lunBbsCooldownUntil - Date.now()) / 1000);
		if (bbsModalElements.statusMsg) {
			bbsModalElements.statusMsg.innerText = t("bbsCooldownMsg", waitSec) || `Wait ${waitSec}s...`;
			bbsModalElements.statusMsg.style.display = "";
			setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 2500);
		}
		return;
	}

	if (bbsModalElements.submitBtn) {
		bbsModalElements.submitBtn.disabled = true;
		bbsModalElements.submitBtn.innerText = t("bbsSending") || "Posting...";
	}

	const replyToId = lunBbsReplyTarget ? lunBbsReplyTarget.id : null;
	const postMessage = replyToId ? `>>${replyToId} ${msg}` : msg;

	try {
		const sUrl = getBbsServerUrl();
		const adminSecret = (me.isStaff && window.localStorage && localStorage.getItem("spkmod-admin-secret")) || "";
		const headers = { "Content-Type": "application/json" };
		if (adminSecret) {
			headers["Authorization"] = `Bearer ${adminSecret}`;
		}
		const bodyPayload = {
			username: me.username,
			playerId: me.playerId,
			level: me.level,
			message: postMessage,
			replyTo: replyToId
		};
		if (adminSecret) {
			bodyPayload.adminSecret = adminSecret;
		}
		const safeFetch = window.spkmodSafeFetch || window.fetch;
		const res = await safeFetch(`${sUrl}/api/bbs/post`, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(bodyPayload)
		});
		const data = await res.json();
		if (data && data.success) {
			bbsModalElements.input.value = "";
			if (bbsModalElements.charCount) bbsModalElements.charCount.innerText = "0/500";
			lunBbsReplyTarget = null;
			if (window.lunEmojiTargetInput === bbsModalElements.input) {
				if (typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel) {
					lunEmojiPickerPanel.remove();
					lunEmojiPickerPanel = null;
				}
				window.lunEmojiTargetInput = null;
			}
			updateBbsReplyBar();
			updateBbsRadioIndicators();
			lunBbsCooldownUntil = Date.now() + 5000;
			startBbsCooldownTimer(5);
			if (replyToId && typeof findRootForPostId === "function") {
				const currentRoots = buildBbsTree(lunBbsPosts);
				const rootNode = findRootForPostId(currentRoots, replyToId);
				if (rootNode) {
					lunBbsExpandedThreadIds.add(rootNode.post.id);
				}
			}
			await fetchBbsPosts();
			const newPostId = data.post && data.post.id;
			if (newPostId && bbsModalElements.postsContainer) {
				const newEl = document.getElementById(`spkmod-bbs-post-${newPostId}`);
				if (newEl) {
					newEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
					newEl.style.transition = "background 0.3s";
					newEl.style.background = "rgba(56, 189, 248, 0.4)";
					setTimeout(() => {
						newEl.style.background = (newEl.dataset.depth && parseInt(newEl.dataset.depth, 10) > 0) ? "rgba(15, 23, 42, 0.28)" : "rgba(15, 23, 42, 0.45)";
					}, 1500);
				} else {
					bbsModalElements.postsContainer.scrollTop = 0;
				}
			}
		} else {
			if (bbsModalElements.statusMsg) {
				bbsModalElements.statusMsg.innerText = data.error || "Failed to post";
				bbsModalElements.statusMsg.style.display = "";
				setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3000);
			}
			if (bbsModalElements.submitBtn) {
				bbsModalElements.submitBtn.disabled = false;
				bbsModalElements.submitBtn.innerText = "📤 " + (t("bbsPostBtn") || "Post");
			}
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Error posting to BBS:", err);
		if (bbsModalElements.statusMsg) {
			bbsModalElements.statusMsg.innerText = t("bbsError") || "Network error";
			bbsModalElements.statusMsg.style.display = "";
			setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3000);
		}
		if (bbsModalElements.submitBtn) {
			bbsModalElements.submitBtn.disabled = false;
			bbsModalElements.submitBtn.innerText = "📤 " + (t("bbsPostBtn") || "Post");
		}
	}
}

function startBbsCooldownTimer(sec) {
	if (!bbsModalElements.submitBtn) return;
	bbsModalElements.submitBtn.disabled = true;
	let left = sec;
	bbsModalElements.submitBtn.innerText = `⏳ (${left}s)`;
	const timer = setInterval(() => {
		left--;
		if (left <= 0) {
			clearInterval(timer);
			if (bbsModalElements.submitBtn) {
				bbsModalElements.submitBtn.disabled = false;
				bbsModalElements.submitBtn.innerText = "📤 " + (t("bbsPostBtn") || "Post");
			}
		} else if (bbsModalElements.submitBtn) {
			bbsModalElements.submitBtn.innerText = `⏳ (${left}s)`;
		}
	}, 1000);
}

async function deleteBbsPost(postId) {
	const me = getMyBbsInfo();
	if (!me.isStaff) return;
	let adminSecret = (window.localStorage && localStorage.getItem("spkmod-admin-secret")) || "";
	if (!adminSecret) {
		const entered = await spkmodPrompt({
			title: "🔑 Staff Admin Secret Required",
			label: "Please enter the Staff Admin Secret Key to delete posts:",
			placeholder: "Secret key...",
			isPassword: true
		});
		if (!entered || !entered.trim()) return;
		adminSecret = entered.trim();
		if (window.localStorage) localStorage.setItem("spkmod-admin-secret", adminSecret);
	}
	try {
		const sUrl = getBbsServerUrl();
		const safeFetch = window.spkmodSafeFetch || window.fetch;
		const res = await safeFetch(`${sUrl}/api/bbs/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${adminSecret}`
			},
			body: JSON.stringify({
				postId,
				username: me.username,
				playerId: me.playerId,
				adminSecret
			})
		});
		const data = await res.json();
		if (data && data.success) {
			lunBbsPosts = lunBbsPosts.filter(p => p.id !== postId);
			renderBbsPosts();
			setBbsStatusMessage(`🗑️ Post #${postId} deleted.`, false);
		} else {
			if (res.status === 401 || res.status === 403 || (data.error && data.error.toLowerCase().includes("secret"))) {
				if (window.localStorage) localStorage.removeItem("spkmod-admin-secret");
				setBbsStatusMessage("Staff authentication failed. Key cleared: " + (data.error || "Unauthorized"), true);
			} else {
				setBbsStatusMessage(data.error || "Failed to delete post", true);
			}
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Failed to delete BBS post:", err);
		setBbsStatusMessage("Failed to delete post (network error)", true);
	}
}

async function toggleBbsHeart(postId, btnEl) {
	const post = Array.isArray(lunBbsPosts) && lunBbsPosts.find(p => p.id === postId);
	if (!post) return;

	const me = getMyBbsInfo();
	const wasHearted = lunBbsHeartedPostIds.has(postId);
	const nextHearted = !wasHearted;

	// 1. Optimistic local UI update
	if (nextHearted) {
		lunBbsHeartedPostIds.add(postId);
		post.hearts = (typeof post.hearts === "number" ? post.hearts : 0) + 1;
	} else {
		lunBbsHeartedPostIds.delete(postId);
		post.hearts = Math.max(0, (typeof post.hearts === "number" ? post.hearts : 1) - 1);
	}
	if (window.localStorage) {
		localStorage.setItem("spkmod-bbs-hearted-ids", JSON.stringify(Array.from(lunBbsHeartedPostIds)));
	}

	if (btnEl) {
		btnEl.style.transform = "scale(1.25)";
		setTimeout(() => { if (btnEl) btnEl.style.transform = "scale(1)"; }, 120);
	}
	renderBbsPosts();

	// 2. Synchronize with BBS server
	try {
		const sUrl = getBbsServerUrl();
		const safeFetch = window.spkmodSafeFetch || window.fetch;
		const res = await safeFetch(`${sUrl}/api/bbs/heart`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				postId: postId,
				username: me.username,
				playerId: me.playerId
			})
		});
		if (res.ok) {
			const data = await res.json();
			if (data && data.success && typeof data.hearts === "number") {
				post.hearts = data.hearts;
				if (data.userHearted) {
					lunBbsHeartedPostIds.add(postId);
				} else {
					lunBbsHeartedPostIds.delete(postId);
				}
				if (window.localStorage) {
					localStorage.setItem("spkmod-bbs-hearted-ids", JSON.stringify(Array.from(lunBbsHeartedPostIds)));
				}
				renderBbsPosts();
			}
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Failed to sync BBS heart reaction:", err);
	}
}

document.body.appendChild(
	lunHudElements.bbsModal = buildElement("div", {
		id: "spkmod-bbs-modal",
		className: "hidden",
		style: "display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; box-sizing: border-box; min-width: 360px; min-height: 280px; max-height: 94vh;"
	}, [
		// Header row
		bbsModalElements.headerRow = buildElement("div", {
			id: "spkmod-bbs-header-row",
			className: "spkmod-panel-cat",
			style: "justify-content: space-between; align-items: center; margin-bottom: 2px; cursor: move; user-select: none; flex-shrink: 0;"
		}, [
			buildElement("div", { style: "display: flex; align-items: center; gap: 6px; cursor: move; user-select: none;" }, [
				bbsModalElements.headerTitle = buildElement("span", {
					innerHTML: (function() {
						const raw = t("bbsTitle");
						const titleStr = (!raw || raw === "bbsTitle") ? ":t_280: DarkNet" : (raw.includes(":t_280:") ? raw : ":t_280: " + raw);
						return typeof renderSpkmodInlineEmojis === "function"
							? renderSpkmodInlineEmojis(titleStr, "height: 18px; width: 18px; object-fit: contain; vertical-align: middle; margin-right: 4px; display: inline-block; pointer-events: none; user-select: none;")
							: titleStr;
					})(),
					style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none; display: inline-flex; align-items: center;"
				}),
				bbsModalElements.countBadge = buildElement("span", {
					innerText: "0",
					style: "font-size: 9.5px; background: rgba(255,255,255,0.12); padding: 1px 6px; border-radius: 8px; color: #94a3b8; font-weight: bold; cursor: move; user-select: none;"
				})
			]),
			buildElement("div", { style: "display: flex; align-items: center; gap: 5px; flex-wrap: wrap;" }, [
				bbsModalElements.staffKeyBtn = buildElement("span", {
					id: "spkmod-bbs-staff-key",
					innerText: "🔑",
					title: "Staff Admin Key",
					style: "cursor: pointer; font-size: 11px; opacity: 0.8; user-select: none; display: none;",
					onpointerdown: (e) => e.stopPropagation(),
					onmousedown: (e) => e.stopPropagation(),
					onclick: async (e) => {
						e.stopPropagation();
						const cur = (window.localStorage && localStorage.getItem("spkmod-admin-secret")) || "";
						const val = await spkmodPrompt({
							title: "🔑 Staff Admin Secret Key",
							label: cur ? "A key is currently configured. Enter a new key, or click 'Clear Key' to remove it:" : "Enter the Staff Admin Secret Key to authorize post deletions:",
							defaultValue: cur,
							placeholder: "Secret key...",
							isPassword: true,
							showClear: !!cur
						});
						if (val !== null) {
							if (val.trim()) {
								if (window.localStorage) localStorage.setItem("spkmod-admin-secret", val.trim());
								setBbsStatusMessage("🔑 Staff Admin Secret saved!", false);
							} else {
								if (window.localStorage) localStorage.removeItem("spkmod-admin-secret");
								setBbsStatusMessage("🔑 Staff Admin Secret cleared.", false);
							}
						}
					}
				}),
				bbsModalElements.themeSelect = buildElement("select", {
					id: "spkmod-bbs-theme-select",
					title: "BBS Theme",
					style: "background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.2); color: #cbd5e1; font-size: 10px; border-radius: 4px; padding: 1px 3px; cursor: pointer; height: 18px; outline: none; line-height: 1;",
					onpointerdown: (e) => e.stopPropagation(),
					onmousedown: (e) => e.stopPropagation(),
					onclick: (e) => e.stopPropagation(),
					onchange: (e) => { e.stopPropagation(); setBbsTheme(e.target.value); }
				}, [
					buildElement("option", { value: "normal", innerText: "🌙 Normal" }),
					buildElement("option", { value: "simple", innerText: "⚡ Simple (Briefer)" }),
					buildElement("option", { value: "retro", innerText: "📜 Retro 2ch" }),
					buildElement("option", { value: "terminal", innerText: "📟 Terminal" }),
					buildElement("option", { value: "amber", innerText: "✨ Cyber Amber" })
				]),
				buildElement("div", {
					id: "spkmod-bbs-font-controls",
					title: "BBS Font Size",
					style: "display: inline-flex; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; height: 18px; padding: 0 2px; gap: 1px;",
					onpointerdown: (e) => e.stopPropagation(),
					onmousedown: (e) => e.stopPropagation()
				}, [
					bbsModalElements.fontMinusBtn = buildElement("button", {
						id: "spkmod-bbs-font-minus",
						innerText: "−",
						title: "Decrease BBS font size",
						style: "background: transparent; border: none; color: #94a3b8; font-size: 11px; font-weight: bold; width: 14px; height: 16px; line-height: 14px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; user-select: none;",
						onmouseenter: (e) => { e.target.style.color = "#fff"; },
						onmouseleave: (e) => { e.target.style.color = "#94a3b8"; },
						onpointerdown: (e) => e.stopPropagation(),
						onmousedown: (e) => e.stopPropagation(),
						onclick: (e) => { e.stopPropagation(); changeBbsFontSize(-1); }
					}),
					bbsModalElements.fontSizeBadge = buildElement("span", {
						id: "spkmod-bbs-font-badge",
						innerText: `${lunBbsFontSize || 11}px`,
						title: "Current BBS font size",
						style: "font-size: 9px; color: #cbd5e1; user-select: none; min-width: 22px; text-align: center; line-height: 18px;"
					}),
					bbsModalElements.fontPlusBtn = buildElement("button", {
						id: "spkmod-bbs-font-plus",
						innerText: "+",
						title: "Increase BBS font size",
						style: "background: transparent; border: none; color: #94a3b8; font-size: 11px; font-weight: bold; width: 14px; height: 16px; line-height: 14px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; user-select: none;",
						onmouseenter: (e) => { e.target.style.color = "#fff"; },
						onmouseleave: (e) => { e.target.style.color = "#94a3b8"; },
						onpointerdown: (e) => e.stopPropagation(),
						onmousedown: (e) => e.stopPropagation(),
						onclick: (e) => { e.stopPropagation(); changeBbsFontSize(+1); }
					})
				]),
				bbsModalElements.iconOnlyContainer = buildElement("label", {
					id: "spkmod-bbs-icon-only-container",
					title: t("bbsIconOnlyTooltip") || "Show only icons for Reply and Translate",
					style: "display: inline-flex; align-items: center; gap: 3px; font-size: 10px; color: #cbd5e1; cursor: pointer; user-select: none; height: 18px; padding: 0 4px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; line-height: 1;",
					onpointerdown: (e) => e.stopPropagation(),
					onmousedown: (e) => e.stopPropagation()
				}, [
					bbsModalElements.iconOnlyCheckbox = buildElement("input", {
						id: "spkmod-bbs-icon-only-checkbox",
						type: "checkbox",
						checked: lunBbsIconOnlyActions,
						style: "cursor: pointer; margin: 0; width: 11px; height: 11px;",
						onpointerdown: (e) => e.stopPropagation(),
						onmousedown: (e) => e.stopPropagation(),
						onclick: (e) => e.stopPropagation(),
						onchange: (e) => setBbsIconOnlyActions(e.target.checked)
					}),
					bbsModalElements.iconOnlyLabel = buildElement("span", {
						innerText: t("bbsIconOnlyLabel") || "Icons only",
						style: "user-select: none; font-size: 9px; line-height: 1;"
					})
				]),
				bbsModalElements.collapseRepliesContainer = buildElement("label", {
					id: "spkmod-bbs-collapse-container",
					title: t("bbsCollapseRepliesTooltip") || "Collapse post replies into expandable buttons",
					style: "display: inline-flex; align-items: center; gap: 3px; font-size: 10px; color: #cbd5e1; cursor: pointer; user-select: none; height: 18px; padding: 0 4px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px; line-height: 1;",
					onpointerdown: (e) => e.stopPropagation(),
					onmousedown: (e) => e.stopPropagation()
				}, [
					bbsModalElements.collapseRepliesCheckbox = buildElement("input", {
						id: "spkmod-bbs-collapse-checkbox",
						type: "checkbox",
						checked: lunBbsCollapseReplies,
						style: "cursor: pointer; margin: 0; width: 11px; height: 11px;",
						onpointerdown: (e) => e.stopPropagation(),
						onmousedown: (e) => e.stopPropagation(),
						onclick: (e) => e.stopPropagation(),
						onchange: (e) => setBbsCollapseReplies(e.target.checked)
					}),
					bbsModalElements.collapseRepliesLabel = buildElement("span", {
						innerText: t("bbsCollapseRepliesLabel") || "Collapse",
						style: "user-select: none; font-size: 9px; line-height: 1;"
					})
				]),
				bbsModalElements.refreshBtn = buildElement("span", {
					id: "spkmod-bbs-refresh",
					innerText: "🔄",
					title: "Refresh posts",
					style: "cursor: pointer; font-size: 11px; opacity: 0.8; user-select: none;",
					onclick: () => { if (window.spkmodServerHealth) window.spkmodServerHealth.forceRetry(); fetchBbsPosts(); }
				}),
				bbsModalElements.closeBtn = buildElement("span", {
					id: "spkmod-bbs-close",
					innerText: "✕",
					style: "cursor: pointer; padding: 0 4px; font-size: 12px; line-height: 1; user-select: none;",
					onclick: () => toggleBbsModal()
				})
			])
		]),
		// Posts container
		bbsModalElements.postsContainer = buildElement("div", {
			id: "spkmod-bbs-posts",
			style: "display: flex; flex-direction: column; gap: 6px; flex: 1 1 auto; min-height: 120px; max-height: none; overflow-y: auto; padding-right: 3px; scrollbar-width: thin;"
		}),
		// Status feedback
		bbsModalElements.statusMsg = buildElement("div", {
			style: "color: #f87171; font-size: 10px; text-align: center; display: none; padding: 2px 0; flex-shrink: 0;"
		}),
		// Composer bottom
		buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;"
		}, [
			buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;" }, [
				bbsModalElements.emojiBtn = buildElement("button", {
					id: "spkmod-bbs-emoji-btn",
					innerText: "😀",
					title: t("bbsEmojiBtnTooltip") || "Insert emoji",
					style: "background: transparent; border: none; cursor: pointer; font-size: 14px; padding: 1px 4px; line-height: 1; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; opacity: 0.85; transition: opacity 0.15s, transform 0.1s;",
					onmouseenter: (e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.1)"; },
					onmouseleave: (e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1)"; },
					onpointerdown: (e) => { e.stopPropagation(); },
					onmousedown: (e) => { e.stopPropagation(); },
					onclick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						if (typeof toggleEmojiPicker === "function") {
							if (typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel) {
								const wasTarget = (window.lunEmojiTargetInput === bbsModalElements.input);
								toggleEmojiPicker();
								if (wasTarget) return;
							}
							window.lunEmojiTargetInput = bbsModalElements.input;
							toggleEmojiPicker(bbsModalElements.emojiBtn);
							if (typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel) {
								lunEmojiPickerPanel.style.setProperty("z-index", "2147483646", "important");
							}
						}
					}
				}),
				bbsModalElements.charCount = buildElement("span", {
					innerText: "0/500",
					style: "color: #64748b; font-size: 9.5px;"
				})
			]),
			bbsModalElements.replyBar = buildElement("div", {
				id: "spkmod-bbs-reply-bar",
				style: "display: none; align-items: center; justify-content: space-between; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 4px; padding: 2px 6px; font-size: 10px; color: #7dd3fc; margin-bottom: 2px;"
			}, [
				bbsModalElements.replyBarText = buildElement("span", {
					innerText: "↩ Replying to #1"
				}),
				bbsModalElements.replyBarCancel = buildElement("span", {
					innerText: "✕ " + (t("bbsCancelReply") || "Cancel"),
					style: "cursor: pointer; color: #f87171; font-weight: bold; margin-left: 8px; font-size: 9.5px;",
					onclick: (e) => {
						e.stopPropagation();
						setBbsReplyTarget(null);
					}
				})
			]),
			bbsModalElements.input = buildElement("textarea", {
				id: "spkmod-bbs-input",
				rows: 2,
				maxLength: 500,
				placeholder: t("bbsPlaceholder") || "Write a message... (Enter to send, Shift+Enter for newline)",
				style: "width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: #fff; padding: 6px; font-size: 11px; resize: none; outline: none; font-family: inherit;",
				onpointerdown: (e) => { e.stopPropagation(); },
				onmousedown: (e) => { e.stopPropagation(); },
				onfocus: () => {
					const me = getMyBbsInfo();
					if (me.level < 3 && !me.isStaff) {
						if (bbsModalElements.statusMsg) {
							bbsModalElements.statusMsg.innerText = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
							bbsModalElements.statusMsg.style.display = "";
							setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3500);
						}
					}
				},
				oninput: () => {
					if (bbsModalElements.charCount && bbsModalElements.input) {
						bbsModalElements.charCount.innerText = `${bbsModalElements.input.value.length}/500`;
					}
				},
				onkeydown: (e) => {
					e.stopPropagation();
					const me = getMyBbsInfo();
					if (me.level < 3 && !me.isStaff) {
						e.preventDefault();
						if (bbsModalElements.statusMsg) {
							bbsModalElements.statusMsg.innerText = t("bbsLevelRequired") || "Your level is not enough to post here (Level 3+ required)";
							bbsModalElements.statusMsg.style.display = "";
							setTimeout(() => { if (bbsModalElements.statusMsg) bbsModalElements.statusMsg.style.display = "none"; }, 3500);
						}
						return;
					}
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						sendBbsPost();
					}
				},
				onkeyup: (e) => {
					e.stopPropagation();
				},
				onkeypress: (e) => {
					e.stopPropagation();
				}
			}),
			bbsModalElements.submitBtn = buildElement("button", {
				id: "spkmod-bbs-submit-btn",
				className: "spkmod-panel-btn",
				innerText: "📤 " + (t("bbsPostBtn") || "Post"),
				style: "width: 100%; height: 26px; padding: 0; background: #2563eb; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; font-weight: bold; font-size: 11px; cursor: pointer;",
				onclick: () => sendBbsPost()
			})
		]),
		// Corner resize handle
		bbsModalElements.resizeHandle = buildElement("div", {
			id: "spkmod-bbs-resize-handle",
			title: t("bbsResizeTooltip") || "Drag to resize window",
			style: "position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; cursor: nwse-resize; user-select: none; z-index: 100; display: flex; align-items: flex-end; justify-content: flex-end; padding: 0 2px 2px 0; touch-action: none;"
		}, [
			buildElement("span", {
				innerHTML: `<svg viewBox="0 0 10 10" width="10" height="10" style="opacity: 0.55; display: block; pointer-events: none;"><path d="M9 1 L1 9 M9 5 L5 9 M9 9 L9 9" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/></svg>`,
				style: "pointer-events: none; display: flex;"
			})
		])
	])
);
if (bbsModalElements.resizeHandle) {
	bbsModalElements.resizeHandle.onmouseenter = () => {
		const p = bbsModalElements.resizeHandle.querySelector("path");
		if (p) p.setAttribute("stroke", "#38bdf8");
	};
	bbsModalElements.resizeHandle.onmouseleave = () => {
		const p = bbsModalElements.resizeHandle.querySelector("path");
		if (p) p.setAttribute("stroke", "#94a3b8");
	};
}
updateBbsComposerState();
applyBbsThemeVisuals();
function updateBbsI18n() {
	if (bbsModalElements.headerTitle) {
		const raw = t("bbsTitle");
		const titleStr = (!raw || raw === "bbsTitle") ? ":t_280: DarkNet" : (raw.includes(":t_280:") ? raw : ":t_280: " + raw);
		if (typeof renderSpkmodInlineEmojis === "function") {
			bbsModalElements.headerTitle.innerHTML = renderSpkmodInlineEmojis(titleStr, "height: 18px; width: 18px; object-fit: contain; vertical-align: middle; margin-right: 4px; display: inline-block; pointer-events: none; user-select: none;");
		} else {
			bbsModalElements.headerTitle.innerText = titleStr;
		}
	}
	if (bbsModalElements.emojiBtn) {
		bbsModalElements.emojiBtn.title = t("bbsEmojiBtnTooltip") || "Insert emoji";
	}
	updateBbsComposerState();
	if (bbsModalElements.submitBtn && (!lunBbsCooldownUntil || Date.now() >= lunBbsCooldownUntil)) {
		bbsModalElements.submitBtn.innerText = "📤 " + (t("bbsPostBtn") || "Post");
	}
	if (typeof lunPanelElements !== "undefined" && lunPanelElements.bbsBtn) {
		const rawTip = t("bbsBtnTooltip");
		const tipStr = (!rawTip || rawTip === "bbsBtnTooltip") ? ":t_280: DarkNet" : (rawTip.includes(":t_280:") ? rawTip : ":t_280: " + rawTip);
		if (typeof setSpkmodRichTooltip === "function") {
			setSpkmodRichTooltip(lunPanelElements.bbsBtn, tipStr);
		} else {
			lunPanelElements.bbsBtn.title = tipStr;
		}
	}
	if (bbsModalElements.iconOnlyLabel) {
		bbsModalElements.iconOnlyLabel.innerText = t("bbsIconOnlyLabel") || "Icons only";
	}
	if (bbsModalElements.iconOnlyContainer) {
		bbsModalElements.iconOnlyContainer.title = t("bbsIconOnlyTooltip") || "Show only icons for Reply and Translate";
	}
	if (bbsModalElements.collapseRepliesLabel) {
		bbsModalElements.collapseRepliesLabel.innerText = t("bbsCollapseRepliesLabel") || "Collapse";
	}
	if (bbsModalElements.collapseRepliesContainer) {
		bbsModalElements.collapseRepliesContainer.title = t("bbsCollapseRepliesTooltip") || "Collapse post replies into expandable buttons";
	}
	if (typeof updateBbsReplyBar === "function") updateBbsReplyBar();
	if (typeof renderBbsPosts === "function") renderBbsPosts();
}

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(() => {
		updateBbsI18n();
	});
}

setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.bbsModal && (bbsModalElements.headerRow || bbsModalElements.headerTitle)) {
		makeDraggable(lunHudElements.bbsModal, [bbsModalElements.headerRow, bbsModalElements.headerTitle].filter(Boolean));
	}
	if (typeof makeResizable === 'function' && lunHudElements.bbsModal && bbsModalElements.resizeHandle) {
		makeResizable(lunHudElements.bbsModal, bbsModalElements.resizeHandle, {
			minWidth: 360,
			minHeight: 280
		});
	}
	if (lunHudElements.bbsModal && !(window.localStorage && localStorage.getItem("spkmod-size-spkmod-bbs-modal"))) {
		lunHudElements.bbsModal.style.width = "520px";
		lunHudElements.bbsModal.style.height = "480px";
	}
	if (lunHudElements.bbsModal) {
		// Prevent scrolling inside the BBS modal from zooming the game camera
		lunHudElements.bbsModal.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
		lunHudElements.bbsModal.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
		lunHudElements.bbsModal.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				if (typeof toggleBbsModal === "function") toggleBbsModal();
				return;
			}
			if (e.key === "F3") {
				if (typeof resetWindowPositions === "function") resetWindowPositions();
				return;
			}
			e.stopPropagation();
		});
		lunHudElements.bbsModal.addEventListener("keyup", e => e.stopPropagation());
		lunHudElements.bbsModal.addEventListener("keypress", e => e.stopPropagation());
	}
	if (bbsModalElements.postsContainer) {
		bbsModalElements.postsContainer.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
		bbsModalElements.postsContainer.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	}
	updateBbsI18n();
	setTimeout(() => {
		fetchBbsPosts(true);
		setInterval(() => {
			fetchBbsPosts(true);
		}, 60000);
	}, 3000);
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
