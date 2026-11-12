function updateBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (!mainBtn) return;

	setText(mainBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"));
}

function updateReverseBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-reversebeyblade-main-btn");
	if (!mainBtn) return;

	setText(mainBtn, t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"));
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

function sec(t) {
	return t * lunTPS;
}

function normalizeVector(x, y) {
	const n = Math.sqrt(x * x + y * y);
	return n < 1e-6 ? {
		x: 0,
		z: 0
	} : {
		x: x / n,
		z: y / n
	}
}

function distanceToVector(vec) {
	var ep = getPlayerPos();

	return Math.hypot(vec.x - ep.x, vec.z - ep.z);
}

function getPlayerPos() {
	return (typeof gameState !== "undefined" && gameState && gameState.playerContainer && gameState.playerContainer.position) || { x: 0, y: 0, z: 0 };
}

const lunTranslateCache = new Map(); // `${source}|${target}:${text}` -> translated text
const lunTranslateMaxLen = 480; // MyMemory free tier is ~500 chars/request
const MAX_TRANSLATE_CACHE = 1500;

const lunTranslatePriorityHeap = [];
const lunTranslateHeapNodeByKey = new Map();
let lunTranslateCacheSequence = 0;

function cacheNodeIsLowerPriority(a, b) {
    if (a.priority !== b.priority) {
        return a.priority < b.priority;
    }
    return a.lastUsed < b.lastUsed;
}

function cacheHeapSwap(i, j) {
    const temp = lunTranslatePriorityHeap[i];

    lunTranslatePriorityHeap[i] = lunTranslatePriorityHeap[j];
    lunTranslatePriorityHeap[j] = temp;

    lunTranslatePriorityHeap[i].heapIndex = i;
    lunTranslatePriorityHeap[j].heapIndex = j;
}

function cacheHeapSiftUp(index) {
    while (index > 0) {
        const parent = Math.floor((index - 1) / 2);

        if (!cacheNodeIsLowerPriority(
            lunTranslatePriorityHeap[index],
            lunTranslatePriorityHeap[parent]
        )) {
            break;
        }

        cacheHeapSwap(index, parent);
        index = parent;
    }

    return index;
}

function cacheHeapSiftDown(index) {
    const heap = lunTranslatePriorityHeap;

    while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;

        if (
            left < heap.length &&
            cacheNodeIsLowerPriority(heap[left], heap[smallest])
        ) {
            smallest = left;
        }

        if (
            right < heap.length &&
            cacheNodeIsLowerPriority(heap[right], heap[smallest])
        ) {
            smallest = right;
        }

        if (smallest === index) break;

        cacheHeapSwap(index, smallest);
        index = smallest;
    }

    return index;
}

function cacheHeapFix(index) {
    index = cacheHeapSiftUp(index);
    cacheHeapSiftDown(index);
}

function cacheHeapInsert(node) {
    node.heapIndex = lunTranslatePriorityHeap.length;
    lunTranslatePriorityHeap.push(node);
    cacheHeapSiftUp(node.heapIndex);
}

function cacheHeapPopMin() {
    const heap = lunTranslatePriorityHeap;

    if (heap.length === 0) return null;

    const min = heap[0];
    const last = heap.pop();

    if (heap.length > 0) {
        heap[0] = last;
        last.heapIndex = 0;
        cacheHeapSiftDown(0);
    }

    min.heapIndex = -1;
    return min;
}

function cacheGet(key) {
    if (!lunTranslateCache.has(key)) return undefined;

    const node = lunTranslateHeapNodeByKey.get(key);

    if (node) {
        node.priority++;
        node.lastUsed = ++lunTranslateCacheSequence;
        cacheHeapFix(node.heapIndex);
    }

    return lunTranslateCache.get(key);
}

function cacheSet(key, value) {

    const existing = lunTranslateHeapNodeByKey.get(key);

    if (existing) {
        existing.priority++;
        existing.lastUsed = ++lunTranslateCacheSequence;
        cacheHeapFix(existing.heapIndex);
        return;
    }

    if (lunTranslateCache.size >= MAX_TRANSLATE_CACHE) {
        const victim = cacheHeapPopMin();

        if (victim) {
            lunTranslateCache.delete(victim.key);
            lunTranslateHeapNodeByKey.delete(victim.key);
        }
    }

    lunTranslateCache.set(key, value);

    const node = {
        key,
        priority: 1,
        lastUsed: ++lunTranslateCacheSequence,
        heapIndex: -1
    };

    lunTranslateHeapNodeByKey.set(key, node);
    cacheHeapInsert(node);
}

let lunTranslateQueue = Promise.resolve();
let lunTranslateLastAt = 0;
const lunTranslateMinGapMs = 400;

function guessSourceLang(text) {
	if (/[\uAC00-\uD7A3]/.test(text)) return "ko"; // Hangul (Korean)
	if (/[\u3040-\u30FF]/.test(text)) return "ja"; // Hiragana/Katakana (Japanese)
	if (/[\u4E00-\u9FFF]/.test(text)) return "zh-CN"; // CJK Ideographs (Chinese)
	if (/[\u0400-\u04FF]/.test(text)) return "ru";
	if (/[äöüßÄÖÜ]/.test(text)) return "de"; // German
	if (/[ñ¿¡Ñ]/.test(text)) return "es"; // Spanish
	if (/[ãõÃÕ]/.test(text)) return "pt"; // Portuguese
	if (/[œæçàâêîôûèéŒÆÇÀÂÊÎÔÛÈÉ]/.test(text)) return "fr"; // French

	// Default to English if no unique characters are detected
	return "en";
}

function cleanTranslatedText(text) {
	if (!text || typeof text !== "string") return "";
	let cleaned = text;


	cleaned = cleaned.replace(/&lt;\/?[a-zA-Z0-9_\-:]+(?:\s+[^&>]*?)?&gt;/gi, "");
	cleaned = cleaned.replace(/<\/?[a-zA-Z0-9_\-:]+(?:\s+[^>]*?)?>/gi, "");


	try {
		const doc = new DOMParser().parseFromString(cleaned, "text/html");
		if (doc && doc.body) cleaned = doc.body.textContent || cleaned;
	} catch (e) {
		cleaned = cleaned
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&apos;/g, "'")
			.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
			.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
	}
	cleaned = cleaned.replace(/<\/?[a-zA-Z0-9_\-:]+(?:\s+[^>]*?)?>/gi, "");
	cleaned = cleaned.replace(/<[^>]*>/g, "");

	if (/^(\[.*?\]\s*)?\//.test(cleaned)) {
		cleaned = cleaned.replace(/\([a-z0-9\-,\s]+\)\s*/gi, "");
		cleaned = cleaned.replace(/^\//, "");
		cleaned = cleaned.replace(/^(\[.*?\]\s*)\//, "$1");
		cleaned = cleaned.replace(/\/$/, "");
		cleaned = cleaned.replace(/\//g, ", ");
	}

	return cleaned.trim();
}

async function translateChatText(text, source, target) {
	if (!text || !text.trim() || source === target) return null;
	if (text.length > lunTranslateMaxLen) text = text.slice(0, lunTranslateMaxLen);

	// Strip all :emoji_name: patterns completely from translation input
	let safeText = text.replace(/:[a-zA-Z0-9_]+:/g, '').trim().replace(/\s+/g, " ");
	
	// If the message was entirely composed of emojis (or left empty), don't translate it
	if (!safeText) return null;

	const normalized = safeText.toLowerCase();
	const cacheKey = `${source}|${target}:${normalized}`;
	const cached = cacheGet(cacheKey);
	if (cached !== undefined) return cached;

	const run = lunTranslateQueue.then(async () => {
		const wait = lunTranslateLastAt + lunTranslateMinGapMs - Date.now();
		if (wait > 0) await new Promise(r => setTimeout(r, wait));
		lunTranslateLastAt = Date.now();

		try {
			let translated = null;
			let apiStatus = 200;

			const engine = (typeof lunTranslateEngine === "string" && lunTranslateEngine === "mymemory") ? "mymemory" : "google";

			const isMyMemoryQuotaHit = (typeof lunMyMemoryQuotaHit !== "undefined" && lunMyMemoryQuotaHit) ||
				(window.localStorage && localStorage.getItem("spkmod-mymemory-quota") === new Date().toDateString());

			const isGoogleQuotaHit = (typeof lunGoogleQuotaHit !== "undefined" && lunGoogleQuotaHit) ||
				(window.localStorage && localStorage.getItem("spkmod-google-quota") === new Date().toDateString());

			const callGoogle = async () => {
				try {
					const gtTarget = (target === "es-419") ? "es" : target;
					const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(gtTarget)}&dt=t&q=${encodeURIComponent(safeText)}`;
					const gtRes = await fetch(gtUrl);
					if (gtRes.ok) {
						const gtData = await gtRes.json();
						if (gtData && gtData[0]) {
							let resText = "";
							for (let i = 0; i < gtData[0].length; i++) {
								if (gtData[0][i] && gtData[0][i][0]) resText += gtData[0][i][0];
							}
							resText = cleanTranslatedText(resText);
							if (resText) return { text: resText, status: 200 };
						}
						return { text: null, status: 200 };
					}
					if (gtRes.status === 429) {
						lunGoogleQuotaHit = true;
						if (typeof window !== "undefined") window.lunGoogleQuotaHit = true;
						if (window.localStorage) localStorage.setItem("spkmod-google-quota", new Date().toDateString());
						console.log("[SpeakiMod+] Google Translate quota reached (HTTP 429); seamlessly falling back to MyMemory.");
					}
					return { text: null, status: gtRes.status };
				} catch (err) {
					console.warn("[SpeakiMod+] Google Translate request error:", err);
					return { text: null, status: 0 };
				}
			};

			const callMyMemory = async () => {
				try {
					const params = new URLSearchParams({ q: safeText, langpair: `${source}|${target}` });
					if (lunTranslateEmail) params.set("de", lunTranslateEmail);
					if (window.localStorage && localStorage.getItem("spkmod-translate-email")) params.set("de", localStorage.getItem("spkmod-translate-email"));
					
					const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
					if (!res.ok) {
						if (res.status === 429 || res.status === 403) {
							lunMyMemoryQuotaHit = true;
							if (typeof window !== "undefined") window.lunMyMemoryQuotaHit = true;
							if (window.localStorage) localStorage.setItem("spkmod-mymemory-quota", new Date().toDateString());
							console.log("[SpeakiMod+] MyMemory daily quota reached (HTTP " + res.status + "); seamlessly falling back to Google Translate.");
						}
						return { text: null, status: res.status };
					}
					const data = await res.json();
					if (data?.responseStatus === 429 || data?.responseStatus === 403) {
						lunMyMemoryQuotaHit = true;
						if (typeof window !== "undefined") window.lunMyMemoryQuotaHit = true;
						if (window.localStorage) localStorage.setItem("spkmod-mymemory-quota", new Date().toDateString());
						console.log("[SpeakiMod+] MyMemory daily quota reached; seamlessly falling back to Google Translate.");
						return { text: null, status: data.responseStatus };
					}
					const resText = cleanTranslatedText(data?.responseData?.translatedText);
					if (!resText || data.responseStatus !== 200) {
						return { text: null, status: data?.responseStatus || 200 };
					}
					return { text: resText, status: 200 };
				} catch (err) {
					console.warn("[SpeakiMod+] MyMemory request error:", err);
					return { text: null, status: 0 };
				}
			};

			if (engine === "mymemory") {
				// Primary: MyMemory
				if (!isMyMemoryQuotaHit) {
					const mmRes = await callMyMemory();
					if (mmRes.text) {
						translated = mmRes.text;
					} else {
						if (mmRes.status === 429 || mmRes.status === 403) apiStatus = mmRes.status;
					}
				}
				// Fallback: Google Translate
				if (!translated && !isGoogleQuotaHit) {
					const gtRes = await callGoogle();
					if (gtRes.text) {
						translated = gtRes.text;
					} else {
						if (gtRes.status === 429) apiStatus = 429;
					}
				}
			} else {
				// Primary: Google Translate
				if (!isGoogleQuotaHit) {
					const gtRes = await callGoogle();
					if (gtRes.text) {
						translated = gtRes.text;
					} else {
						if (gtRes.status === 429) apiStatus = 429;
					}
				}
				// Fallback: MyMemory
				if (!translated && !isMyMemoryQuotaHit) {
					const mmRes = await callMyMemory();
					if (mmRes.text) {
						translated = mmRes.text;
					} else {
						if (mmRes.status === 429 || mmRes.status === 403) apiStatus = mmRes.status;
					}
				}
			}

			if (!translated) {
				if (apiStatus === 429 || (isGoogleQuotaHit && isMyMemoryQuotaHit)) {
					setTranslateEnabled(false);
					chatLog(t("translateQuotaHitMsg"));
				}
				return null;
			}
			// Check against the stripped text, so it doesn't just re-translate identical text
			if (translated.trim().toLowerCase() === safeText.toLowerCase()) return null;

			cacheSet(cacheKey, translated);
			return translated;
		} catch (err) {
			console.warn("[SpeakiMod+] Translation request failed:", err);
			return null;
		}
	});

	lunTranslateQueue = run.catch(() => { });
	return run;
}

const LUN_CHAT_PLAYER_PALETTE = [
	"#ff9eaa", // Soft Rose
	"#ffd54a", // Warm Gold
	"#90caf9", // Soft Sky Blue
	"#ce93d8", // Light Orchid
	"#ffab91", // Peach Apricot
	"#fff59d", // Lemon Cream
	"#9fa8da", // Soft Periwinkle
	"#f48fb1", // Bubblegum Pink
	"#d1c4e9", // Lavender Mist
	"#ffcc80"  // Warm Amber
];
const LUN_CHAT_FRIEND_COLOR = "#4dd0e1";
const LUN_CHAT_PARTY_COLOR = "#69f0ae";
const lunChatPlayerColorMap = new Map();
let lunLastChatSpeaker = null;
let lunLastChatColor = null;

function isPartyMemberChatSpeaker(id, name) {
	if (id === -1337 || id === -1338) return false;
	const cleanName = typeof name === "string" ? name.trim() : "";
	if (!cleanName) return false;
	if (typeof gameState !== "undefined" && gameState?.myPlayerId != null && id != null && id === gameState.myPlayerId) {
		return false;
	}
	const lowerKey = cleanName.toLowerCase();
	const myName = ((typeof gameState !== "undefined" && (gameState.myPlayerName || gameState.myStat?.name)) || (typeof document !== "undefined" ? document.querySelector(".sr-player-card__name")?.innerText : "") || "").trim().toLowerCase();
	if (myName && lowerKey === myName) return false;
	if (typeof document === "undefined") return false;
	const partyEls = document.querySelectorAll(".sr-party__name");
	if (!partyEls || partyEls.length === 0) return false;

	let altKey = "";
	if (id != null && typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.get) {
		const rp = gameState.remotePlayers.remotePlayers.get(id);
		if (rp?.info) {
			const rpName = (rp.info.name || "").trim().toLowerCase();
			const rpOrig = (rp.info.__spkmodOrigName || "").trim().toLowerCase();
			if (rpName && rpName !== lowerKey) altKey = rpName;
			else if (rpOrig && rpOrig !== lowerKey) altKey = rpOrig;
		}
	}

	for (let i = 0; i < partyEls.length; i++) {
		const pName = (partyEls[i].innerText || partyEls[i].textContent || "").trim().toLowerCase();
		if (pName && (pName === lowerKey || (altKey && pName === altKey))) return true;
	}
	return false;
}

function resolveChatMessageColor(id, name) {
	if (id === -1337 || id === -1338) return null;
	const cleanName = typeof name === "string" ? name.trim() : "";
	if (!cleanName) return null;
	const lowerKey = cleanName.toLowerCase();

	if (typeof lunGmChatHighlightEnabled !== "undefined" && lunGmChatHighlightEnabled && cleanName.toUpperCase() === "GMDT") {
		lunLastChatSpeaker = lowerKey;
		lunLastChatColor = "#ffa726";
		return "#ffa726";
	}

	if (typeof lunPartyChatHighlightEnabled !== "undefined" && lunPartyChatHighlightEnabled && isPartyMemberChatSpeaker(id, cleanName)) {
		lunLastChatSpeaker = lowerKey;
		lunLastChatColor = LUN_CHAT_PARTY_COLOR;
		return LUN_CHAT_PARTY_COLOR;
	}

	if (typeof lunFriendChatHighlightEnabled !== "undefined" && lunFriendChatHighlightEnabled && typeof lunFriendNicknames !== "undefined" && lunFriendNicknames.has(lowerKey)) {
		lunLastChatSpeaker = lowerKey;
		lunLastChatColor = LUN_CHAT_FRIEND_COLOR;
		return LUN_CHAT_FRIEND_COLOR;
	}

	if (lunLastChatSpeaker === lowerKey && lunLastChatColor && lunLastChatColor !== LUN_CHAT_PARTY_COLOR && lunLastChatColor !== LUN_CHAT_FRIEND_COLOR && lunLastChatColor !== "#ffa726") {
		return lunLastChatColor;
	}

	let color = lunChatPlayerColorMap.get(lowerKey);
	if (!color || color === lunLastChatColor) {
		const candidates = LUN_CHAT_PLAYER_PALETTE.filter(c => c !== lunLastChatColor);
		color = candidates[Math.floor(Math.random() * candidates.length)];
		lunChatPlayerColorMap.set(lowerKey, color);
	}

	lunLastChatSpeaker = lowerKey;
	lunLastChatColor = color;
	return color;
}

if (typeof lunChatRandomColorsEnabled !== "undefined" && lunChatRandomColorsEnabled && typeof document !== "undefined" && document.body) {
	document.body.classList.add("spkmod-chat-player-colors-on");
}

function maybeTranslateChatMessage(id, name, msg, assignedColor) {
	if (!lunTranslateEnabled) return;
	if (id === -1337 || id === -1338) return; // skip SpeakiMod's own system/translation lines
	if (typeof msg !== "string" || !msg.trim()) return;
	if (msg.trim().length < 2) return;

	const source = guessSourceLang(msg);
	translateChatText(msg, source, lunTranslateTarget).then(translated => {
		if (!translated) return;
		appendColoredChatLine(-1338, `↳ ${name}`, translated, assignedColor);
	});
}	

let lunChatObserver = null;
let lunChatObserverTarget = null;
const lunPendingChatCallbacks = [];

function ensureChatObserver() {
	const chatLogEl = document.querySelector(".sr-chatbox__log");
	if (!chatLogEl) return null;

	if (lunChatObserver && lunChatObserverTarget === chatLogEl) {
		return chatLogEl;
	}

	if (lunChatObserver) {
		lunChatObserver.disconnect();
	}

	lunChatObserverTarget = chatLogEl;
	lunChatObserver = new MutationObserver(mutations => {
		if (lunPendingChatCallbacks.length === 0) return;
		const now = Date.now();

		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== 1) continue;
				const bodyText = node.classList?.contains("sr-chatbox__body-text")
					? node
					: node.querySelector?.(".sr-chatbox__body-text");
				if (!bodyText || !bodyText.textContent) continue;

				const text = bodyText.textContent;
				for (let i = 0; i < lunPendingChatCallbacks.length; i++) {
					const item = lunPendingChatCallbacks[i];
					if (text.includes(item.matchText)) {
						item.callback(bodyText, node);
						lunPendingChatCallbacks.splice(i, 1);
						i--;
						break;
					}
				}
			}
		}

		for (let i = lunPendingChatCallbacks.length - 1; i >= 0; i--) {
			if (lunPendingChatCallbacks[i].expire < now) {
				lunPendingChatCallbacks.splice(i, 1);
			}
		}
	});

	lunChatObserver.observe(chatLogEl, { childList: true, subtree: true });
	return chatLogEl;
}

function observeNextChatNode(matchText, callback) {
	if (!matchText || !matchText.trim()) return;
	const chatLogEl = ensureChatObserver();
	if (!chatLogEl) return;

	const now = Date.now();
	for (let i = lunPendingChatCallbacks.length - 1; i >= 0; i--) {
		if (lunPendingChatCallbacks[i].expire < now) {
			lunPendingChatCallbacks.splice(i, 1);
		}
	}

	lunPendingChatCallbacks.push({
		matchText,
		callback,
		expire: now + 2000
	});
}

function chatLog(msg) {
	if (typeof lunHideVerboseChat !== "undefined" && lunHideVerboseChat) return;
	try {
		if (typeof gameState !== "undefined" && gameState?.chatBox?.append) {
			gameState.chatBox.append(-1337, "SpeakiMod+", msg);
		} else if (typeof hkChatBoxAppend === "function") {
			hkChatBoxAppend(-1337, "SpeakiMod+", msg);
		} else {
			console.log("[SpeakiMod+]", msg);
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to append chat message:", e);
	}
}

function watchPlayer(name) {
	if (name) {
		const pi = Object.values(Object.fromEntries(gameState.remotePlayers.remotePlayers)).find(t => t.info.name == name);
		if (pi) {
			gameState.cameraController.target = pi.container;
			lunPanelElements.resetCameraBtn.classList.remove("hidden");
			chatLog(t("watchFollowingMsg", name));
			return;
		} else {
			chatLog(t("watchNotFoundMsg"));
		}
	} else {
		chatLog(t("watchFollowingSelfMsg"));
	}

	if (!window._stareActive) {
		lunPanelElements.resetCameraBtn.classList.add("hidden");
	}
	gameState.cameraController.target = gameState.playerContainer;
}

function stareAtPlayer(targetName) {
	if (!targetName) {
		stopStare();
		return;
	}
	if (window._stareActive && window._stareTargetName === targetName) {
		stopStare();
		return;
	}
	if (window._stareAnim) {
		cancelAnimationFrame(window._stareAnim);
		window._stareAnim = null;
	}
	if (window._stareNetSync) {
		clearInterval(window._stareNetSync);
		window._stareNetSync = null;
	}
	
	window._stareActive = true;
	window._stareTargetName = targetName;
	let currentAngle = gameState?.playerContainer?.rotation?.y || 0;
	
	function updateStare() {
		if (!window._stareActive) {
			if (window._stareAnim) {
				cancelAnimationFrame(window._stareAnim);
				window._stareAnim = null;
			}
			return;
		}

		if (gameState?.remotePlayers?.remotePlayers && gameState?.playerContainer) {
			const players = Array.from(gameState.remotePlayers.remotePlayers.values());
			const target = players.find(p => p.info?.name?.toLowerCase() === targetName.toLowerCase());

			if (target && target.container) {
				const pp = gameState.playerContainer.position;
				const tp = target.container.position;
				
				const targetAngle = Math.atan2(tp.x - pp.x, tp.z - pp.z);
				
				let diff = (targetAngle - currentAngle) % (2 * Math.PI);
				if (diff < -Math.PI) diff += 2 * Math.PI;
				if (diff > Math.PI) diff -= 2 * Math.PI;

				currentAngle += diff * 0.35;

				gameState.playerContainer.rotation.y = currentAngle;
			}
		}
		window._stareAnim = requestAnimationFrame(updateStare);
	}

	window._stareAnim = requestAnimationFrame(updateStare);

	window._stareNetSync = setInterval(() => {
		if (window._stareActive && gameState) {
			gameState.moveSendAccumulator = 1;
		}
	}, 50);

	if (lunPanelElements.resetCameraBtn) {
		lunPanelElements.resetCameraBtn.classList.remove("hidden");
	}

	console.log(`%c[SpeakiMod] Smooth Stare Lock active on: "${targetName}"`, "color: #4CAF50; font-weight: bold;");
	chatLog(t("stareActivatedMsg", targetName));
}

function stopStare() {
	if (window._stareAnim) {
		cancelAnimationFrame(window._stareAnim);
		window._stareAnim = null;
	}
	if (window._stareNetSync) {
		clearInterval(window._stareNetSync);
		window._stareNetSync = null;
	}
	if (!window._stareActive) return;
	window._stareActive = false;
	window._stareTargetName = null;
	if (gameState && gameState.playerContainer && gameState.cameraController) {
		gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
		gameState.moveSendAccumulator = 1;
	}
	if (!gameState?.cameraController?.target || gameState.cameraController.target === gameState.playerContainer) {
		if (lunPanelElements.resetCameraBtn) {
			lunPanelElements.resetCameraBtn.classList.add("hidden");
		}
	}
	console.log("%c[SpeakiMod] Stare Lock stopped.", "color: #f44336; font-weight: bold;");
	chatLog(t("stareDeactivatedMsg"));
}

function hookPartyTargetElement() {
	const hPartyTarget = document.querySelector(".sr-party-target");
	if (!hPartyTarget) return false;
	if (hPartyTarget.querySelector(".spkmod-watch-player-btn")) return true;

	const closeBtn = hPartyTarget.querySelector(".sr-party-target__close");
	if (!closeBtn) return false;

	lunPanelElements.followBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		style: "margin-right: 4px;",
		innerText: t("followBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			followPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.followBtn, closeBtn);

	lunPanelElements.watchBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		style: "margin-right: 4px;",
		innerText: t("watchBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			watchPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.watchBtn, closeBtn);

	lunPanelElements.stareBtn = buildElement("button", {
		className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
		innerText: t("stareBtn"),
		value: "",
		onclick: e => {
			const name = e.target.parentElement.querySelector(".sr-party-target__name")?.innerText;
			stareAtPlayer(name);
		}
	});
	hPartyTarget.insertBefore(lunPanelElements.stareBtn, closeBtn);
	return true;
}
hookPartyTargetElement();


function updateMovementButtonsUI() {
	const shakeBtn = document.querySelector("#spkmod-shake-main-btn");
	if (shakeBtn) setText(shakeBtn, window.ShakeActive ? t("shakeOn") : t("shakeOff"));

	const superShakeBtn = document.querySelector("#spkmod-supershake-main-btn");
	if (superShakeBtn) setText(superShakeBtn, window.SuperShakeActive ? t("superShakeOn") : t("superShakeOff"));

	const hyperShakeBtn = document.querySelector("#spkmod-hypershake-main-btn");
	if (hyperShakeBtn) setText(hyperShakeBtn, window.HyperShakeActive ? t("hyperShakeOn") : t("hyperShakeOff"));

	const moonwalkBtn = document.querySelector("#spkmod-moonwalk-main-btn");
	if (moonwalkBtn) setText(moonwalkBtn, window.MoonwalkActive ? t("moonwalkOn") : t("moonwalkOff"));

	const beybladeBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (beybladeBtn) setText(beybladeBtn, t(window.BeyBladeActive ? "beybladeOn" : "beybladeOff"));

	const revBeybladeBtn = document.querySelector("#spkmod-reversebeyblade-main-btn");
	if (revBeybladeBtn) setText(revBeybladeBtn, t(window.ReverseBeyBladeActive ? "reversebeybladeOn" : "reversebeybladeOff"));
}

spkmodI18nRenderers.push(() => {
	if (lunPanelElements.targetZone) {
		const currentVal = lunPanelElements.targetZone.value;
		lunPanelElements.targetZone.innerHTML = "";
		Object.keys(Portals).forEach(zoneId => {
			let n = getZoneName(zoneId);
			lunPanelElements.targetZone.appendChild(buildElement("option", {
				value: zoneId - 0,
				innerText: n
			}));
		});
		if (currentVal) lunPanelElements.targetZone.value = currentVal;
	}
});

spkmodI18nRenderers.push(() => {
	setText(lunPanelElements.headerBtn, t("header"));
	const sepHeaderSpan = document.querySelector("#spkmod-sep-header-row > span");
	if (sepHeaderSpan) setText(sepHeaderSpan, "≡ " + (t("header") || "SpeakiMod+ Actions"));
	if (lunPanelElements.localEffectsBtn) setText(lunPanelElements.localEffectsBtn, t("localEffectsBtn"));
	if (lunPanelElements.effectsModalTitle) setText(lunPanelElements.effectsModalTitle, t("localEffectsTitle"));
	if (lunPanelElements.effectsWarning) setText(lunPanelElements.effectsWarning, t("localEffectsWarning"));
	if (lunPanelElements.killSelfBtn) setText(lunPanelElements.killSelfBtn, t("killSelfBtn"));
	if (lunPanelElements.killEveryoneBtn) setText(lunPanelElements.killEveryoneBtn, t("killEveryoneBtn"));
	if (lunPanelElements.danceEveryoneBtn) setText(lunPanelElements.danceEveryoneBtn, t("danceEveryoneBtn"));
	if (lunPanelElements.farmEveryoneBtn) setText(lunPanelElements.farmEveryoneBtn, t("farmEveryoneBtn"));
	if (lunPanelElements.hobagiEveryoneBtn) setText(lunPanelElements.hobagiEveryoneBtn, t("hobagiEveryoneBtn"));
	if (lunPanelElements.flyEveryoneBtn) setText(lunPanelElements.flyEveryoneBtn, t("flyEveryoneBtn"));
	if (lunPanelElements.invisibleBtn) lunPanelElements.invisibleBtn.title = t("invisibleBtn");
	if (lunPanelElements.renameTargetInput) lunPanelElements.renameTargetInput.placeholder = t("originalNamePlaceholder");
	if (lunPanelElements.renameValueInput) lunPanelElements.renameValueInput.placeholder = t("newNamePlaceholder");
	if (lunPanelElements.renameBtn) setText(lunPanelElements.renameBtn, t("renameBtn"));
	if (lunPanelElements.replaceAllValueInput) lunPanelElements.replaceAllValueInput.placeholder = t("newNameAllPlaceholder");
	if (lunPanelElements.replaceAllBtn) setText(lunPanelElements.replaceAllBtn, t("replaceAllBtn"));
	if (lunPanelElements.resetNamesBtn) setText(lunPanelElements.resetNamesBtn, t("resetNamesBtn"));
	if (lunPanelElements.savePresetBtn) setText(lunPanelElements.savePresetBtn, t("savePresetBtn"));
	if (lunPanelElements.delPresetBtn) setText(lunPanelElements.delPresetBtn, t("delPresetBtn"));
	if (lunPanelElements.applyPresetsBtn) setText(lunPanelElements.applyPresetsBtn, t("applyPresetsBtn"));
	if (lunPanelElements.killAllButSelfBtn) setText(lunPanelElements.killAllButSelfBtn, t("killAllButSelfBtn"));
	if (lunPanelElements.killTargetBtn) setText(lunPanelElements.killTargetBtn, t("killTargetBtn"));
	if (lunPanelElements.reviveAllBtn) setText(lunPanelElements.reviveAllBtn, t("reviveAllBtn"));
	if (lunPanelElements.killTargetInput) lunPanelElements.killTargetInput.placeholder = t("targetPlaceholder");
		setText(lunPanelElements.danceBtn, t("dance"));
	if (lunPanelElements.faintBtn) setText(lunPanelElements.faintBtn, t("faintOn"));
	if (lunPanelElements.autoFaintBtn) setText(lunPanelElements.autoFaintBtn, t(window.AutoFaintActive ? "aFaintOn" : "aFaintOff"));
	setText(lunPanelElements.chowayoBtn, t(window.AutoChowayoActive ? "autoChowayoOn" : "chowayo"));
	setText(lunPanelElements.heartsBtn, t("hearts"));
	setText(lunPanelElements.autoHeartsBtn, t(window.AutoHeartsActive ? "autoHeartsOn" : "autoHeartsOff"));
	if (lunPanelElements.petDanceBtn) setText(lunPanelElements.petDanceBtn, t(window.PetDanceActive ? "petDanceOn" : "petDanceOff") || (window.PetDanceActive ? "Pet Dance: ⏸️" : "Pet Dance: ▶️"));
	if (lunPanelElements.justPetBtn) setText(lunPanelElements.justPetBtn, t(window.JustPetActive ? "justPetOn" : "justPetOff") || (window.JustPetActive ? "Just Pet: ⏸️" : "Just Pet: ▶️"));
	setText(lunPanelElements.ritualBtn, t(window.RitualState === 0 ? "ritualOff" : (window.RitualState === 1 ? "ritualOn" : "ritualInverted")));
	if (lunPanelElements.partnerDanceBtn) setText(lunPanelElements.partnerDanceBtn, t(window.PartnerDanceState === 1 ? "partnerDanceOn" : (window.PartnerDanceState === 2 ? "partnerDanceInverted" : "partnerDanceOff")) || (window.PartnerDanceState === 0 ? "8 Dance: ▶️" : (window.PartnerDanceState === 1 ? "8 Dance: ⏸️" : "Rev 8: ⏸️")));
	setText(lunPanelElements.turntableBtn, t(window.TurntableActive === 1 ? "turntableOn" : (window.TurntableActive === 2 ? "turntableHalf" : "turntableOff")));
	setText(lunHudElements.discordBtn, t("discordBtn"));
	setText(lunPanelElements.autoJumpBtn, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
	setText(lunPanelElements.speedLabel, t("speedLabel"));
	if (lunPanelElements.panelLeftLabel) setText(lunPanelElements.panelLeftLabel, t("panelLeftToggleLabel"));
	setText(lunPanelElements.turnToCameraBtn, t("turnToCamera"));

	setText(lunPanelElements.resetCameraBtn, t("resetCamera"));
	setText(lunPanelElements.lockCameraBtn, lunCameraLocked ? t("unlockCamera") : t("lockCamera"));
	setText(lunPanelElements.nametagsBtn, t(NAMETAG_MODES[lunNametagMode] + "Btn"));
	setText(lunPanelElements.viewClipBtn, lunViewClip ? t("viewClipOn") : t("viewClipOff"));
	setText(lunPanelElements.walkToPortalBtn, lunWalkToPortal == -1 ? t("goTo") : t("stopWalking"));
	setText(lunPanelElements.watchBtn, t("watchBtn"));
	setText(lunPanelElements.followBtn, t("followBtn"));
	setText(lunPanelElements.stareBtn, t("stareBtn"));
	if (lunPanelElements.panelFollowBtn) setText(lunPanelElements.panelFollowBtn, lunFollowTargetName ? t("stopFollowing") : t("follow"));
	setText(lunPanelElements.gamepadSettingsBtn, t("gamepadBtn"));
	setText(lunPanelElements.pinnedQuestHeader, t("pinnedQuestHeader"));
	if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.panel) {
		lunHudElements.pinnedQuest.panel.title = t("pinnedQuestTooltip") || "Double-click to unpin";
	}
	setText(lunHudElements.footerMsg, t("footerMsg"));
	setText(lunPanelElements.settingsHeader, t("settingsHeader"));
	if (lunPanelElements.filterToggleLabel) setText(lunPanelElements.filterToggleLabel, t("filterToggleLabel"));
	if (lunPanelElements.verboseChatToggleLabel) setText(lunPanelElements.verboseChatToggleLabel, t("hideVerboseChatToggleLabel") || "Hide Mod Chat Messages");
	if (lunPanelElements.resolutionOverrideLabel && typeof lunResolutionOverrideLabel === "function") setText(lunPanelElements.resolutionOverrideLabel, lunResolutionOverrideLabel());
	if (lunPanelElements.gmChatToggleLabel) setText(lunPanelElements.gmChatToggleLabel, t("gmChatToggleLabel"));
	if (lunPanelElements.friendChatToggleLabel) setText(lunPanelElements.friendChatToggleLabel, t("friendChatToggleLabel"));
	if (lunPanelElements.partyChatToggleLabel) {
		const s = t("partyChatToggleLabel");
		setText(lunPanelElements.partyChatToggleLabel, (!s || s === "partyChatToggleLabel") ? "Highlight Party Members in Chat" : s);
	}
	if (lunPanelElements.chatRandomColorsLabel) {
		const s = t("chatRandomColorsToggleLabel");
		setText(lunPanelElements.chatRandomColorsLabel, (!s || s === "chatRandomColorsToggleLabel") ? "Colorize Player Messages" : s);
	}
	if (lunPanelElements.mentionAlertToggleLabel) setText(lunPanelElements.mentionAlertToggleLabel, t("mentionAlertToggleLabel"));
	if (lunPanelElements.mentionPingToggleLabel) setText(lunPanelElements.mentionPingToggleLabel, t("mentionPingToggleLabel"));
	if (lunPanelElements.hideKnownBotsLabel) setText(lunPanelElements.hideKnownBotsLabel, t("hideKnownBotsToggleLabel"));
	if (lunPanelElements.chatTimestampLabel) setText(lunPanelElements.chatTimestampLabel, t("chatTimestampToggleLabel"));
	if (lunPanelElements.fpPitchLabel) setText(lunPanelElements.fpPitchLabel, t("firstPersonPitchLabel"));
	if (lunPanelElements.firstPersonBtn) setText(lunPanelElements.firstPersonBtn, t(lunFirstPersonActive ? "firstPersonOn" : "firstPersonOff"));
	if (lunPanelElements.trueFirstPersonBtn) setText(lunPanelElements.trueFirstPersonBtn, t(lunTrueFirstPersonActive ? "trueFirstPersonOn" : "trueFirstPersonOff"));
	if (lunPanelElements.speedometerToggleLabel) setText(lunPanelElements.speedometerToggleLabel, t("speedometerToggleLabel"));

	if (lunPanelElements.freeCamBtn) setText(lunPanelElements.freeCamBtn, t(lunDroneModeActive ? "freeCamOn" : "freeCamOff"));
	if (lunPanelElements.lowHpLabel) setText(lunPanelElements.lowHpLabel, t("lowHpWarningToggleLabel"));
	if (lunPanelElements.sessionGoldLabel) setText(lunPanelElements.sessionGoldLabel, t("sessionGoldToggleLabel"));
	if (lunPanelElements.expRateUnitLabel) setText(lunPanelElements.expRateUnitLabel, t("expRateUnitToggleLabel"));
	if (lunPanelElements.expRateIntervalLabel) setText(lunPanelElements.expRateIntervalLabel, t("expRateIntervalLabel"));
	if (lunPanelElements.expRateIntervalSelect && lunPanelElements.expRateIntervalSelect.options) {
		LUN_EXP_INTERVAL_OPTIONS.forEach((minutes, index) => {
			if (lunPanelElements.expRateIntervalSelect.options[index]) {
				lunPanelElements.expRateIntervalSelect.options[index].innerText = t("expRateIntervalOption", minutes);
			}
		});
		lunPanelElements.expRateIntervalSelect.value = String(lunExpIntervalMinutes);
	}
	if (lunPanelElements.fpsPingLabel) setText(lunPanelElements.fpsPingLabel, t("fpsPingToggleLabel"));
	if (lunPanelElements.currencyTrackerLabel) setText(lunPanelElements.currencyTrackerLabel, t("currencyTrackerToggleLabel"));
	if (lunPanelElements.resetTimerLabel) setText(lunPanelElements.resetTimerLabel, t("resetTimerToggleLabel"));
	if (lunPanelElements.minigameTrackerLabel) setText(lunPanelElements.minigameTrackerLabel, t("minigameTrackerToggleLabel"));
	if (lunPanelElements.settingsCatGeneral) setText(lunPanelElements.settingsCatGeneral, "💬 " + t("settingsCatGeneral"));
	if (lunPanelElements.settingsCatHUD) setText(lunPanelElements.settingsCatHUD, "📊 " + t("settingsCatHUD"));
	if (typeof updateHudIconTooltips === "function") {
		updateHudIconTooltips();
	}
	if (typeof mapModalElements !== "undefined" && mapModalElements.titleLabel) mapModalElements.titleLabel.innerText = t("mapModalTitle");
	if (window.questsModalElements && window.questsModalElements.headerTitle) {
		window.questsModalElements.headerTitle.innerText = "📋 " + (t("questsModalTitle") || "Quests Checklist");
	}
	if (lunHudElements && lunHudElements.questsModal && !lunHudElements.questsModal.classList.contains("hidden") && typeof renderQuestChecklist === "function") {
		renderQuestChecklist();
	}
	const qlBtn = document.getElementById("spkmod-settings-accounts-btn");
	if (qlBtn) {
		qlBtn.innerText = "🔑 " + t("quickLoginTitle");
		qlBtn.title = t("accountMgrBtnTooltip");
	}
	if (lunPanelElements.accentColorConfirmBtn) setText(lunPanelElements.accentColorConfirmBtn, t("confirmBtn") || "OK");
	updateMinigameUI();
	if (lunPatchNotesData && lunPatchNotesTranslatedLang !== (spkmodLang === "es-419" ? "es" : spkmodLang)) {
		translatePatchNotesToUserLang().then(() => renderPatchNotesUI());
	} else {
		renderPatchNotesUI();
	}
	if (lunPanelElements.gamepadRumbleLabel) setText(lunPanelElements.gamepadRumbleLabel, t("gamepadRumbleToggleLabel"));
	if (lunPanelElements.separatePanelLabel) setText(lunPanelElements.separatePanelLabel, t("separatePanel") || "Separate Action Panel (Mobile)");
	if (lunPanelElements.hidePlayerLevelsLabel) setText(lunPanelElements.hidePlayerLevelsLabel, t("hidePlayerLevelsLabel"));
	if (lunPanelElements.channelTrackerToggleLabel) setText(lunPanelElements.channelTrackerToggleLabel, t("channelTrackerToggleLabel"));
	if (lunPanelElements.telemetryToggleLabel) setText(lunPanelElements.telemetryToggleLabel, t("telemetrySettingLabel"));
	if (lunPanelElements.muteMinimizedLabel) setText(lunPanelElements.muteMinimizedLabel, t("muteMinimizedToggleLabel") || "Mute Game when Minimized");
	if (lunPanelElements.outgoingTranslateSelect && lunPanelElements.outgoingTranslateSelect.options && lunPanelElements.outgoingTranslateSelect.options[0]) {
		lunPanelElements.outgoingTranslateSelect.options[0].innerText = t("outgoingTranslateAuto");
	}
	if (lunPanelElements.disableRightClickPinningLabel) setText(lunPanelElements.disableRightClickPinningLabel, t("disableRightClickPinningLabel") || "Disable Double Right-Click Pinning");
	if (lunPanelElements.discordRpcLabel) setText(lunPanelElements.discordRpcLabel, t("discordRpcToggleLabel") || "Discord Activity (RPC)");
	if (lunPanelElements.uiScaleLabel) setText(lunPanelElements.uiScaleLabel, t("uiScaleLabel"));
	if (lunPanelElements.gameUiScaleLabel) setText(lunPanelElements.gameUiScaleLabel, t("gameUiScaleLabel") || "Game UI Scale");
	if (lunPanelElements.droneSpeedLabel) setText(lunPanelElements.droneSpeedLabel, t("droneSpeedLabel") || "Drone Speed");
	if (lunPanelElements.hotkeysBtn) lunPanelElements.hotkeysBtn.title = t("hotkeysModalTitle") || "Hotkeys";
	if (typeof hotkeysModalElements !== "undefined" && hotkeysModalElements.headerTitle) {
		hotkeysModalElements.headerTitle.innerText = "⌨️ " + (t("hotkeysModalTitle") || "Hotkeys");
	}
	if (lunPanelElements.localEditsBtn) setText(lunPanelElements.localEditsBtn, t("localEditsBtn") || "🎨 Local Edits");
	if (lunPanelElements.editsModalTitle) setText(lunPanelElements.editsModalTitle, t("localEditsTitle") || "🎨 Local Edits (Creator Mode)");
	if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
	if (lunPanelElements.cameraEffectLabel) setText(lunPanelElements.cameraEffectLabel, t("cameraEffectLabel") || "Camera Effect");
	if (lunPanelElements.cameraEffectSelect && lunPanelElements.cameraEffectSelect.options) {
		if (lunPanelElements.cameraEffectSelect.options[0]) lunPanelElements.cameraEffectSelect.options[0].innerText = t("effectNone") || "Normal";
		if (lunPanelElements.cameraEffectSelect.options[1]) lunPanelElements.cameraEffectSelect.options[1].innerText = t("effectBw") || "Black & White";
		if (lunPanelElements.cameraEffectSelect.options[2]) lunPanelElements.cameraEffectSelect.options[2].innerText = t("effectSepia") || "Sepia";
		if (lunPanelElements.cameraEffectSelect.options[3]) lunPanelElements.cameraEffectSelect.options[3].innerText = t("effectMorning") || "Morning";
		if (lunPanelElements.cameraEffectSelect.options[4]) lunPanelElements.cameraEffectSelect.options[4].innerText = t("effectDusk") || "Dusk / Dawn";
		if (lunPanelElements.cameraEffectSelect.options[5]) lunPanelElements.cameraEffectSelect.options[5].innerText = t("effectNight") || "Night";
		if (lunPanelElements.cameraEffectSelect.options[6]) lunPanelElements.cameraEffectSelect.options[6].innerText = t("effectVaporwave") || "Vaporwave";
		if (lunPanelElements.cameraEffectSelect.options[7]) lunPanelElements.cameraEffectSelect.options[7].innerText = t("effectChromatic") || "Chromatic Aberration";
		if (lunPanelElements.cameraEffectSelect.options[8]) lunPanelElements.cameraEffectSelect.options[8].innerText = t("effectUnfocus") || "Dreamy Blur";
		if (lunPanelElements.cameraEffectSelect.options[9]) lunPanelElements.cameraEffectSelect.options[9].innerText = t("effectFocus") || "Sharp Clarity";
		if (lunPanelElements.cameraEffectSelect.options[10]) lunPanelElements.cameraEffectSelect.options[10].innerText = t("effectVhs") || "90s VHS Tape";
		if (lunPanelElements.cameraEffectSelect.options[11]) lunPanelElements.cameraEffectSelect.options[11].innerText = t("effectCyberpunk") || "Cyberpunk";
		if (lunPanelElements.cameraEffectSelect.options[12]) lunPanelElements.cameraEffectSelect.options[12].innerText = t("effectNostalgia") || "Dreamy Train";
		if (lunPanelElements.cameraEffectSelect.options[13]) lunPanelElements.cameraEffectSelect.options[13].innerText = t("effectPastel") || "Pastel Anime";
		if (lunPanelElements.cameraEffectSelect.options[14]) lunPanelElements.cameraEffectSelect.options[14].innerText = t("effectWarmVintage") || "Vintage Film";
		if (lunPanelElements.cameraEffectSelect.options[15]) lunPanelElements.cameraEffectSelect.options[15].innerText = t("effectCoolCinema") || "Cool Cinema";
		if (lunPanelElements.cameraEffectSelect.options[16]) lunPanelElements.cameraEffectSelect.options[16].innerText = t("effectMatrix") || "Matrix";
		if (lunPanelElements.cameraEffectSelect.options[17]) lunPanelElements.cameraEffectSelect.options[17].innerText = t("effectInverted") || "Negative";
		if (lunPanelElements.cameraEffectSelect.options[18]) lunPanelElements.cameraEffectSelect.options[18].innerText = t("effectGameboy") || "Monatium Boy";
		if (lunPanelElements.cameraEffectSelect.options[19]) lunPanelElements.cameraEffectSelect.options[19].innerText = t("effectBloodMoon") || "Blood Moon";
		if (lunPanelElements.cameraEffectSelect.options[20]) lunPanelElements.cameraEffectSelect.options[20].innerText = t("effectSynthwave") || "Synthwave";
		if (lunPanelElements.cameraEffectSelect.options[21]) lunPanelElements.cameraEffectSelect.options[21].innerText = t("effectUnderwater") || "Aqua Fantasy";
		if (lunPanelElements.cameraEffectSelect.options[22]) lunPanelElements.cameraEffectSelect.options[22].innerText = t("effectGoldenHour") || "Golden Hour";
		if (lunPanelElements.cameraEffectSelect.options[23]) lunPanelElements.cameraEffectSelect.options[23].innerText = t("effectComicBook") || "Comic Book";
		if (lunPanelElements.cameraEffectSelect.options[24]) lunPanelElements.cameraEffectSelect.options[24].innerText = t("effectArctic") || "Arctic Frost";
		if (lunPanelElements.cameraEffectSelect.options[25]) lunPanelElements.cameraEffectSelect.options[25].innerText = t("effectCosmic") || "Cosmic Aurora";
		if (lunPanelElements.cameraEffectSelect.options[26]) lunPanelElements.cameraEffectSelect.options[26].innerText = t("effectFilmNoir") || "Film Noir";
		if (lunPanelElements.cameraEffectSelect.options[27]) lunPanelElements.cameraEffectSelect.options[27].innerText = t("effectAcidTrip") || "Acid Trip";
		if (lunPanelElements.cameraEffectSelect.options[28]) lunPanelElements.cameraEffectSelect.options[28].innerText = t("effectRadioactive") || "Radioactive";
		if (lunPanelElements.cameraEffectSelect.options[29]) lunPanelElements.cameraEffectSelect.options[29].innerText = t("effectDeepFried") || "Deep Fried";
		if (lunPanelElements.cameraEffectSelect.options[30]) lunPanelElements.cameraEffectSelect.options[30].innerText = t("effectAlienAbduction") || "Alien Abduction";
		if (lunPanelElements.cameraEffectSelect.options[31]) lunPanelElements.cameraEffectSelect.options[31].innerText = t("effectXRay") || "X-Ray Vision";
		if (lunPanelElements.cameraEffectSelect.options[32]) lunPanelElements.cameraEffectSelect.options[32].innerText = t("effectThermal") || "Thermal Vision";
		if (lunPanelElements.cameraEffectSelect.options[33]) lunPanelElements.cameraEffectSelect.options[33].innerText = t("effectVirtualBoy") || "Virtual Boy";
		if (lunPanelElements.cameraEffectSelect.options[34]) lunPanelElements.cameraEffectSelect.options[34].innerText = t("effectEldritch") || "Eldritch Void";
		if (lunPanelElements.cameraEffectSelect.options[35]) lunPanelElements.cameraEffectSelect.options[35].innerText = t("effectHaunted") || "Paranormal Cam";
		if (lunPanelElements.cameraEffectSelect.options[36]) lunPanelElements.cameraEffectSelect.options[36].innerText = t("effectGlitch") || "Glitch Art";
		if (lunPanelElements.cameraEffectSelect.options[37]) lunPanelElements.cameraEffectSelect.options[37].innerText = t("effectKaleido") || "Rainbow Prism";
		if (lunPanelElements.cameraEffectSelect.options[38]) lunPanelElements.cameraEffectSelect.options[38].innerText = t("effectSupernova") || "Supernova";
	}

	if (lunPanelElements.bgOpacityLabel) setText(lunPanelElements.bgOpacityLabel, t("bgOpacityLabel"));
	if (lunPanelElements.bgOpacitySelect && lunPanelElements.bgOpacitySelect.options) {
		if (lunPanelElements.bgOpacitySelect.options[0]) lunPanelElements.bgOpacitySelect.options[0].innerText = t("bgOpacitySolid");
		if (lunPanelElements.bgOpacitySelect.options[1]) lunPanelElements.bgOpacitySelect.options[1].innerText = t("bgOpacityTransparent");
		if (lunPanelElements.bgOpacitySelect.options[2]) lunPanelElements.bgOpacitySelect.options[2].innerText = t("bgOpacitySuperTransparent") || "Super Transparent";
		if (lunPanelElements.bgOpacitySelect.options[3]) lunPanelElements.bgOpacitySelect.options[3].innerText = t("bgOpacityGlass");
		if (lunPanelElements.bgOpacitySelect.options[4]) lunPanelElements.bgOpacitySelect.options[4].innerText = t("bgOpacityLightGlass") || "Light Glass";
		if (lunPanelElements.bgOpacitySelect.options[5]) lunPanelElements.bgOpacitySelect.options[5].innerText = t("bgOpacityHeavyGlass") || "Heavy Glass";
	}
	if (lunPanelElements.hudBgLabel) setText(lunPanelElements.hudBgLabel, t("hudBackgroundLabel"));
	if (lunPanelElements.fontPresetLabel) setText(lunPanelElements.fontPresetLabel, t("fontPresetLabel") || "Game Font");
	if (lunPanelElements.fontPresetSelect && lunPanelElements.fontPresetSelect.options) {
		const opts = lunPanelElements.fontPresetSelect.options;
		if (opts[0]) opts[0].innerText = t("fontPresetDefault") || "Default";
		if (opts[1]) opts[1].innerText = t("fontPresetTrickcalPop") || "Pop (Auto CJK)";
		if (opts[6]) opts[6].innerText = t("fontPresetSerif") || "Serif (Mincho)";
		if (opts[7]) opts[7].innerText = t("fontPresetRounded") || "Rounded (Maru)";
		if (opts[8]) opts[8].innerText = t("fontPresetPixel") || "Pixel / Retro";
		if (opts[9]) opts[9].innerText = t("fontPresetMonospace") || "Monospace";
		if (opts[10]) opts[10].innerText = t("fontPresetCustom") || "Custom OS Font...";
	}
	if (lunPanelElements.customFontInputLabel) setText(lunPanelElements.customFontInputLabel, t("customFontInputLabel") || "Font:");
	if (lunPanelElements.customFontInput) lunPanelElements.customFontInput.placeholder = t("customFontPlaceholder") || "Meiryo, Yu Mincho...";
	if (lunPanelElements.accentColorLabel) setText(lunPanelElements.accentColorLabel, t("accentColorLabel"));
	if (lunPanelElements.exportSettingsBtn) setText(lunPanelElements.exportSettingsBtn, t("exportSettingsBtn"));
	if (lunPanelElements.importSettingsBtn) setText(lunPanelElements.importSettingsBtn, t("importSettingsBtn"));
	if (lunPanelElements.resetPositionsBtn) setText(lunPanelElements.resetPositionsBtn, "🔄 " + (t("resetPositionsBtn") || "Reset Window Positions (F3)"));
	if (lunPanelElements.creditsLabel) setText(lunPanelElements.creditsLabel, t("credits"));
	if (lunHudElements.totalPlayersOnline) setText(lunHudElements.totalPlayersOnline, t("totalPlayersOnline"));
	
	refreshGamepadModalI18n();
	if (typeof updateHudBgDropdown === 'function') updateHudBgDropdown();

	
	// ORIGINAL EVENT CODE - KEEP FOR WHEN EVENT COMES BACK
	setText(lunHudElements.currencyTracker, lunLastGold === null
		? t("currencyTracker", "--", "--", "--")
		: t("currencyTracker", lunLastGold.toLocaleString(), lunLastElif.toLocaleString(), typeof lunLastSpkCoin !== 'undefined' && lunLastSpkCoin !== null ? lunLastSpkCoin.toLocaleString() : "--"));
	
	// setText(lunHudElements.currencyTracker, lunLastGold === null
	// 	? t("currencyTracker", "--", "--", "--").replace(/ \| 🟣.*/, "")
	// 	: t("currencyTracker", lunLastGold.toLocaleString(), lunLastElif.toLocaleString(), "").replace(/ \| 🟣.*/, ""));
	setText(lunHudElements.sessionGoldTracker, t("sessionGoldText", "--", "--"));
	if (!lunPinnedQuestId) setText(lunHudElements.pinnedQuest.content, t("pinnedQuestDefault"));

	updateMovementButtonsUI();

	if (lunPanelElements.translateToggleLabel) setText(lunPanelElements.translateToggleLabel, t("translateToggleLabel"));
	if (lunPanelElements.translateEngineLabel) setText(lunPanelElements.translateEngineLabel, t("translateEngineLabel"));
	if (lunPanelElements.translateEmailInput) lunPanelElements.translateEmailInput.placeholder = t("translateEmailPlaceholder");
	if (lunPanelElements.translateEmailInfo) lunPanelElements.translateEmailInfo.innerText = t("translateEmailTooltip");
	if (lunPanelElements.outgoingTranslateLabel) setText(lunPanelElements.outgoingTranslateLabel, t("outgoingTranslateLabel"));
	if (lunPanelElements.outgoingTranslateSelect && lunPanelElements.outgoingTranslateSelect.options && lunPanelElements.outgoingTranslateSelect.options[0]) {
		lunPanelElements.outgoingTranslateSelect.options[0].innerText = t("outgoingTranslateAuto");
	}
	document.querySelectorAll(".spkmod-clickable-line").forEach(node => {
		node.title = t("clickToTranslateTooltip");
	});
});

if (typeof refreshI18n === "function") {
	refreshI18n();
}

const lunPinnedQuestInterval = sec(60); // [SpeakiMod+] 60s periodic refresh
var lunPinnedQuestPeriod = null;
var lunPinnedQuestId = 0;
var lunPinnedQuestContent = null;
var lunPinnedQuestNextQueryTick = 0;