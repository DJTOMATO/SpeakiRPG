function findGameAudioListener() {
	try {
		if (typeof window.getAudioListener === "function") {
			const l = window.getAudioListener();
			if (l && (l.isAudioListener || l.context || l.gain)) return l;
		}
	} catch (_) {}
	try {
		if (window.gameState) {
			if (window.gameState.camera) {
				if (Array.isArray(window.gameState.camera.children)) {
					const l = window.gameState.camera.children.find(c => c && (c.isAudioListener || c.context || c.gain));
					if (l) return l;
				}
				if (typeof window.gameState.camera.traverse === "function") {
					let found = null;
					window.gameState.camera.traverse(c => {
						if (!found && c && (c.isAudioListener || c.context || c.gain)) found = c;
					});
					if (found) return found;
				}
			}
			if (window.gameState.scene) {
				if (Array.isArray(window.gameState.scene.children)) {
					const l = window.gameState.scene.children.find(c => c && (c.isAudioListener || c.context || c.gain));
					if (l) return l;
				}
				if (typeof window.gameState.scene.traverse === "function") {
					let found = null;
					window.gameState.scene.traverse(c => {
						if (!found && c && (c.isAudioListener || c.context || c.gain)) found = c;
					});
					if (found) return found;
				}
			}
		}
	} catch (_) {}
	return null;
}

function applyGameMuteState(muted, isTemporary = false) {
	// 1. Only sync native game settings/checkbox on explicit user toggles, NEVER during temporary minimize/blur!
	if (!isTemporary) {
		const cb = findGameMuteCheckbox();
		if (cb && cb.checked !== !!muted) {
			cb.checked = !!muted;
			cb.dispatchEvent(new Event("change", { bubbles: true }));
		}
		if (typeof window.updateGameSettings === "function") {
			try { window.updateGameSettings({ muteAll: !!muted }); } catch (_) {}
		}
	}

	// 2. Direct Three.js & HTML5 audio output muting:
	try {
		const listener = findGameAudioListener();
		if (listener) {
			if (listener.gain && listener.gain.gain) {
				listener.gain.gain.value = muted ? 0 : 1;
			}
			if (listener.context) {
				if (muted && listener.context.state === "running") {
					try { listener.context.suspend(); } catch (_) {}
				} else if (!muted && listener.context.state === "suspended") {
					try { listener.context.resume(); } catch (_) {}
				}
			}
		}

		// Fallbacks: HTML5 media elements & Howler
		document.querySelectorAll("audio, video").forEach(el => {
			el.muted = !!muted;
		});
		if (typeof window.Howler !== "undefined") {
			if (muted) {
				if (window.__speakiOrigHowlerVol === undefined) window.__speakiOrigHowlerVol = Howler.volume();
				Howler.volume(0);
			} else {
				Howler.volume(window.__speakiOrigHowlerVol !== undefined ? window.__speakiOrigHowlerVol : 1.0);
			}
		}
	} catch (_) {}

	updateMuteButtonUI();
}

function setGameMuted(muted) {
	lunIsMuted = !!muted;
	// Manual user action clears any minimize-override
	isMutedByMinimize = false;
	applyGameMuteState(lunIsMuted, false);
}

function toggleGameMute() {
	setGameMuted(!lunIsMuted);
}

function setMuteMinimized(enabled) {
	lunMuteMinimizedEnabled = !!enabled;
	if (window.localStorage) {
		localStorage.setItem("spkmod-mute-minimized", lunMuteMinimizedEnabled ? "true" : "false");
	}
	if (typeof lunPanelElements !== "undefined" && lunPanelElements.muteMinimizedToggleInput) {
		lunPanelElements.muteMinimizedToggleInput.checked = lunMuteMinimizedEnabled;
	}
	if (!lunMuteMinimizedEnabled && isMutedByMinimize) {
		isMutedByMinimize = false;
		applyGameMuteState(lunIsMuted);
	}
}

function handleMinimizeState(isMinimized) {
	if (!lunMuteMinimizedEnabled) return;
	// Prevent startup window creation or initial blur from accidentally muting on launch
	if (isMinimized && Date.now() - spkmodStartupTime < 3000) return;

	if (isMinimized) {
		if (!lunIsMuted && !isMutedByMinimize) {
			isMutedByMinimize = true;
			applyGameMuteState(true, true);
		}
	} else {
		if (isMutedByMinimize) {
			isMutedByMinimize = false;
			applyGameMuteState(lunIsMuted, true);
		}
	}
}

// Hook visibilitychange for web browser and mobile
if (typeof document !== "undefined") {
	document.addEventListener("visibilitychange", () => {
		handleMinimizeState(document.hidden);
	});
}

// Hook window blur and focus for Alt-Tab / background switching
if (typeof window !== "undefined") {
	window.addEventListener("blur", () => {
		if (document.activeElement && document.activeElement.tagName === "IFRAME") return;
		handleMinimizeState(true);
	});
	window.addEventListener("focus", () => {
		handleMinimizeState(false);
	});
}

// Hook Electron IPC for window minimize/restore
if (typeof window !== "undefined" && window.electronAPI && typeof window.electronAPI.onWindowMinimized === "function") {
	try {
		window.electronAPI.onWindowMinimized((isMin) => {
			handleMinimizeState(isMin);
		});
	} catch (_) {}
}

// Hook game's internal settings updater to keep mod UI synchronized with in-game sound settings
function hookGameSettings() {
	if (typeof window.updateGameSettings === "function" && !window.updateGameSettings.__spkmodHooked) {
		const origUpdate = window.updateGameSettings;
		window.updateGameSettings = function(newSettings) {
			const res = origUpdate.apply(this, arguments);
			if (newSettings && typeof newSettings.muteAll === "boolean" && !isMutedByMinimize) {
				if (lunIsMuted !== newSettings.muteAll) {
					lunIsMuted = newSettings.muteAll;
					updateMuteButtonUI();
				}
			}
			return res;
		};
		window.updateGameSettings.__spkmodHooked = true;
	}
}

// Ensure saved mute preference is applied as soon as game settings become available
setInterval(() => {
	hookGameSettings();
	hookNativeMuteCheckbox();
	if (typeof window.getGameSettings === "function" && !window.__spkmodAudioInitialized) {
		window.__spkmodAudioInitialized = true;
		// Option A: Actively ensure native game settings start unmuted on boot
		if (typeof window.updateGameSettings === "function") {
			try { window.updateGameSettings({ muteAll: false }); } catch (_) {}
		}
		const cb = findGameMuteCheckbox();
		if (cb && cb.checked) {
			cb.checked = false;
			cb.dispatchEvent(new Event("change", { bubbles: true }));
		}
		applyGameMuteState(false, true);
	}
}, 500);

// Global Console Commands for easy testing
window.spkmodMute = function(muted) {
	if (typeof muted === "undefined") muted = !isGameMuted();
	setGameMuted(muted);
	console.log(`[SpeakiMod+] Game audio ${muted ? "MUTED 🔇" : "UNMUTED 🔊"}`);
	return muted;
};
window.toggleGameMute = toggleGameMute;
window.setGameMuted = setGameMuted;
window.isGameMuted = isGameMuted;
window.testMute = function() {
	const cb = findGameMuteCheckbox();
	const listener = findGameAudioListener();
	const report = {
		checkboxFound: !!cb,
		checkboxChecked: cb ? cb.checked : null,
		audioListenerFound: !!listener,
		audioContextState: listener && listener.context ? listener.context.state : null,
		audioGainValue: listener && listener.gain && listener.gain.gain ? listener.gain.gain.value : null,
		lunIsMuted: lunIsMuted,
		isMutedByMinimize: isMutedByMinimize,
		lunMuteMinimizedEnabled: lunMuteMinimizedEnabled,
		updateGameSettingsAvailable: typeof window.updateGameSettings === "function",
		getGameSettingsAvailable: typeof window.getGameSettings === "function",
		getAudioListenerAvailable: typeof window.getAudioListener === "function"
	};
	if (console.table) {
		console.table(report);
	} else {
		console.log("[SpeakiMod+] testMute report:", report);
	}
	const targetState = !isGameMuted();
	window.spkmodMute(targetState);
	return `Result: Toggled audio to ${targetState ? "MUTED" : "UNMUTED"}`;
};

// Ensure the class is added early on load
if (typeof document !== "undefined" && lunPanelLeft) {
    document.body.classList.add("spkmod-panel-left-mode");
}

var lunCurrencyTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-currency-tracker")) !== "false";
function setCurrencyTrackerEnabled(enabled) {
	lunCurrencyTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-currency-tracker", lunCurrencyTrackerEnabled ? "true" : "false");
	if (lunHudElements.currencyTracker) {
		lunHudElements.currencyTracker.style.display = lunCurrencyTrackerEnabled ? "" : "none";
	}
}

var lunSessionGoldTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-session-gold")) === "true";
function setSessionGoldTrackerEnabled(enabled) {
	lunSessionGoldTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-session-gold", lunSessionGoldTrackerEnabled ? "true" : "false");
	if (lunHudElements.sessionGoldTracker) {
		lunHudElements.sessionGoldTracker.style.display = lunSessionGoldTrackerEnabled ? "" : "none";
	}
}

var lunExpRatePerHour = (window.localStorage && localStorage.getItem("spkmod-exp-per-hour")) === "true";
const LUN_EXP_INTERVAL_OPTIONS = [1, 5, 10, 15, 30, 60];
var lunExpIntervalMinutes = parseInt((window.localStorage && localStorage.getItem("spkmod-exp-interval-minutes")) || "1", 10);
if (!LUN_EXP_INTERVAL_OPTIONS.includes(lunExpIntervalMinutes)) lunExpIntervalMinutes = 1;
function resetExpTracker() {
	lunExpTrackerInitialized = false;
	lunExpTrackerSamples = [];
	lunExpTrackerLastSampleTick = 0;
	window.lunExpTrackerIgnoredExp = 0;
	window.lunExpTrackerLastRawExp = undefined;
}
function setExpRatePerHour(enabled) {
	lunExpRatePerHour = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-exp-per-hour", lunExpRatePerHour ? "true" : "false");
	resetExpTracker();
}

function setExpIntervalMinutes(minutes) {
	const parsedMinutes = parseInt(minutes, 10);
	if (!LUN_EXP_INTERVAL_OPTIONS.includes(parsedMinutes)) return;
	lunExpIntervalMinutes = parsedMinutes;
	if (window.localStorage) localStorage.setItem("spkmod-exp-interval-minutes", String(lunExpIntervalMinutes));
	resetExpTracker();
}

var lunFpsPingEnabled = (window.localStorage && localStorage.getItem("spkmod-fps-ping")) === "true";
function setFpsPingEnabled(enabled) {
	lunFpsPingEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-fps-ping", lunFpsPingEnabled ? "true" : "false");
	if (lunHudElements.fpsPingTracker) {
		lunHudElements.fpsPingTracker.style.display = lunFpsPingEnabled ? "" : "none";
	}
	if (lunFpsPingEnabled && typeof performActivePing === 'function') {
		performActivePing();
	}
}

var lunResetTimerEnabled = (window.localStorage && localStorage.getItem("spkmod-reset-timer")) !== "false";
function setResetTimerEnabled(enabled) {
	lunResetTimerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-reset-timer", lunResetTimerEnabled ? "true" : "false");
	if (lunHudElements.resetTimerTracker) {
		lunHudElements.resetTimerTracker.style.display = lunResetTimerEnabled ? "" : "none";
	}
}

var lunMinigameTrackerEnabled = (window.localStorage && localStorage.getItem("spkmod-pumpkin-tracker")) === "true";
var lunMinigameStatus = null;
var lunMinigameTrackerWindow = 60 * lunTPS;
var lunMinigameTrackerNextTicks = 0;

function setMinigameTrackerEnabled(enabled) {
	lunMinigameTrackerEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-pumpkin-tracker", lunMinigameTrackerEnabled ? "true" : "false");
	if (lunHudElements.minigameTracker) {
		lunHudElements.minigameTracker.style.display = lunMinigameTrackerEnabled ? "" : "none";
	}
	if (lunMinigameTrackerEnabled && !lunMinigameStatus) {
		fetchMinigameStatus();
	}
}

let ACTIVE_MINIGAME_ID = null;

function fetchMinigameStatus() {
	const token = getAuthToken();
	if (!token) return;

	let keysToTry = ["pumpkin", "sweep", "nuruling"];
	if (typeof gameState !== "undefined" && gameState && gameState.minigameEntryDialogs) {
		const dynamicKeys = gameState.minigameEntryDialogs.map(d => d.def && d.def.gameKey).filter(Boolean);
		if (dynamicKeys.length > 0) keysToTry = dynamicKeys;
	}

	if (!ACTIVE_MINIGAME_ID) {
		let lastResp = null;
		
		const checkNext = (index) => {
			if (index >= keysToTry.length) {
				if (lastResp) {
					lunMinigameStatus = lastResp;
					updateMinigameUI();
				}
				return;
			}
			const key = keysToTry[index];
			fetch(`https://sr1.overture.io.kr/api/minigame/${key}/status`, {
				"method": "GET",
				"headers": { "authorization": `Bearer ${token}` },
				"mode": "cors"
			})
			.then(res => res.json())
			.then(resp => {
				if (resp && resp.isActive) {
					ACTIVE_MINIGAME_ID = key;
					lunMinigameStatus = resp;
					updateMinigameUI();
				} else {
					if (resp) lastResp = resp;
					checkNext(index + 1);
				}
			})
			.catch(err => {
				checkNext(index + 1);
			});
		};
		checkNext(0);
		return;
	}

	fetch(`https://sr1.overture.io.kr/api/minigame/${ACTIVE_MINIGAME_ID}/status`, {
		"method": "GET",
		"headers": {
			"authorization": `Bearer ${token}`
		},
		"mode": "cors"
	})
		.then(res => res.json())
		.then(resp => {
			if (resp && !resp.isActive) {
				ACTIVE_MINIGAME_ID = null; // reset so it searches again on next tick
			}
			lunMinigameStatus = resp;
			updateMinigameUI();
		})
		.catch(err => {
			console.error("[SpeakiMod] Failed to fetch minigame status:", err);
		});
}

function updateMinigameUI() {
	if (lunHudElements.minigameTracker) {
		if (lunMinigameStatus) {
			if (lunMinigameStatus.isActive) {
				setText(lunHudElements.minigameTracker, t("minigameTrackerText", lunMinigameStatus.remainingPlaysToday ?? 0, lunMinigameStatus.dailyCapPlays ?? 10));
			} else {
				setText(lunHudElements.minigameTracker, t("minigameTrackerInactive"));
			}
		} else {
			setText(lunHudElements.minigameTracker, t("minigameTrackerText", "--", "--"));
		}
	}
	updateEventModalContent();
	updateStatsModalLive();
}

var spkmodTopZIndex = 2147483600;

function bringToFront(element) {
	if (!element) return;
	if (element.id === "spkmod-emoji-picker-v2" || element.id === "spkmod-emoji-picker") {
		element.style.setProperty("z-index", "2147483646", "important");
		return;
	}
	spkmodTopZIndex++;
	if (spkmodTopZIndex >= 2147483640) {
		spkmodTopZIndex = 2147483601;
	}
	element.style.setProperty("z-index", String(spkmodTopZIndex), "important");
	if (typeof lunEmojiPickerPanel !== "undefined" && lunEmojiPickerPanel && lunEmojiPickerPanel.isConnected) {
		lunEmojiPickerPanel.style.setProperty("z-index", "2147483646", "important");
	}
}

function makeDraggable(element, handles) {
	if (!element || !handles) return;
	if (element.__spkmodDraggable) return;
	element.__spkmodDraggable = true;

	const posKey = element.id ? "spkmod-pos-" + element.id : null;

	if (window.localStorage && posKey) {
		const savedPos = localStorage.getItem(posKey) || (element.id === "spkmod-hud" ? localStorage.getItem("spkmod-window-pos") : null);
		if (savedPos) {
			try {
				const parsedPos = JSON.parse(savedPos);
				if (parsedPos.top && parsedPos.left) {
					const topNum = parseFloat(parsedPos.top);
					const leftNum = parseFloat(parsedPos.left);
					if (!isNaN(topNum) && !isNaN(leftNum)) {
						const minTop = (element.id === "spkmod-hud" || element.id === "spkmod-cinema-dock") ? 0 : 35;
						const maxTop = Math.max(minTop, window.innerHeight - (element.id === "spkmod-hud" || element.id === "spkmod-cinema-dock" ? 45 : 120));
						const clampedTop = Math.max(minTop, Math.min(topNum, maxTop));
						const clampedLeft = Math.max(0, Math.min(leftNum, window.innerWidth - 60));
						element.style.top = clampedTop + "px";
						element.style.left = clampedLeft + "px";
						element.dataset.userDragged = "true";
					} else {
						element.style.top = parsedPos.top;
						element.style.left = parsedPos.left;
						element.dataset.userDragged = "true";
					}
				}
			} catch (err) {
				console.warn("[SpeakiMod+] Failed to load saved position for " + (element.id || "element"));
			}
		}
	}

	element.addEventListener("mousedown", () => {
		bringToFront(element);
	}, true);

	handles.forEach(handle => {
		if (handle && handle.addEventListener) {
			handle.addEventListener("dragstart", e => e.preventDefault());
		}
	});

	let isDragging = false;
	let startPointerX = 0, startPointerY = 0;
	let startElemLeft = 0, startElemTop = 0;
	let currentScale = 1;
	let hasMovedSignificant = false;

	function onPointerDown(e) {
		if (element.dataset.spkmodLocked === "true") return;
		if (isDragging) return;
		if (e.button !== undefined && e.button !== 0) return;

		const target = e.target;
		const isExplicitDragBtn = target && (target.id === 'spkmod-drag-btn' || target.closest('#spkmod-drag-btn'));

		if (target && !isExplicitDragBtn) {
			const isInteractive = (
				target.tagName === 'BUTTON' ||
				target.tagName === 'INPUT' ||
				target.tagName === 'SELECT' ||
				target.tagName === 'TEXTAREA' ||
				target.tagName === 'A' ||
				target.id?.includes('close') ||
				target.id?.includes('refresh') ||
				target.id?.includes('resize') ||
				target.dataset?.noDrag === 'true' ||
				target.closest('button') ||
				target.closest('input') ||
				target.closest('select') ||
				target.closest('textarea') ||
				target.closest('a') ||
				target.closest('[id*="close"]') ||
				target.closest('[id*="refresh"]') ||
				target.closest('[id*="resize"]') ||
				target.closest('[data-no-drag="true"]')
			);
			if (isInteractive) return;
		}

		const scaleVar = getComputedStyle(element).getPropertyValue('--spkmod-scale');
		currentScale = parseFloat(scaleVar) || 1;

		const rect = element.getBoundingClientRect();
		startElemLeft = parseFloat(element.style.left);
		if (isNaN(startElemLeft)) startElemLeft = rect.left;
		startElemTop = parseFloat(element.style.top);
		if (isNaN(startElemTop)) startElemTop = rect.top;

		startPointerX = e.clientX;
		startPointerY = e.clientY;
		hasMovedSignificant = false;
		isDragging = true;

		if (e.pointerId && target && target.setPointerCapture) {
			try {
				target.setPointerCapture(e.pointerId);
			} catch (_) {}
		}

		window.addEventListener("pointermove", onMove, { passive: false });
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("mousemove", onMove, { passive: false });
		window.addEventListener("mouseup", onUp);
	}

	function onMove(ev) {
		if (!isDragging) return;

		const deltaX = (ev.clientX - startPointerX) / currentScale;
		const deltaY = (ev.clientY - startPointerY) / currentScale;

		if (!hasMovedSignificant && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
			hasMovedSignificant = true;
			element.dataset.userDragged = "true";
			element.dataset.justDragged = "true";
		}

		if (hasMovedSignificant) {
			ev.preventDefault();
			const minTop = (element.id === "spkmod-hud") ? 0 : 35;
			const maxTop = Math.max(minTop, window.innerHeight - 45);
			const maxLeft = Math.max(0, window.innerWidth - 60);
			const newLeft = Math.min(Math.max(0, startElemLeft + deltaX), maxLeft);
			const newTop = Math.min(Math.max(minTop, startElemTop + deltaY), maxTop);

			element.style.left = Math.round(newLeft) + "px";
			element.style.top = Math.round(newTop) + "px";
		}
	}

	function onUp(ev) {
		if (!isDragging) return;
		isDragging = false;

		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerup", onUp);
		window.removeEventListener("pointercancel", onUp);
		window.removeEventListener("mousemove", onMove);
		window.removeEventListener("mouseup", onUp);

		if (ev && ev.pointerId && ev.target && ev.target.releasePointerCapture) {
			try {
				ev.target.releasePointerCapture(ev.pointerId);
			} catch (_) {}
		}

		if (hasMovedSignificant) {
			element.dataset.userDragged = "true";
			if (posKey && window.localStorage) {
				const posData = JSON.stringify({
					top: element.style.top,
					left: element.style.left
				});
				localStorage.setItem(posKey, posData);
				if (element.id === "spkmod-hud") {
					localStorage.setItem("spkmod-window-pos", posData);
				}
			}
			setTimeout(() => {
				element.dataset.justDragged = "false";
			}, 120);
		}
	}

	handles.forEach(handle => {
		if (handle) {
			handle.addEventListener("pointerdown", onPointerDown);
			handle.addEventListener("mousedown", onPointerDown);
		}
	});
}

function makeResizable(element, handle, options = {}) {
	if (!element || !handle) return;
	if (element.__spkmodResizable) return;
	element.__spkmodResizable = true;

	const minW = options.minWidth || 340;
	const minH = options.minHeight || 260;
	const sizeKey = options.storageKey || (element.id ? ("spkmod-size-" + element.id) : null);

	// Restore saved size if available
	if (sizeKey && window.localStorage && options.restoreSize !== false) {
		try {
			const saved = localStorage.getItem(sizeKey);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && parsed.width && parsed.height) {
					const curMaxW = Math.round(window.innerWidth * 0.98);
					const curMaxH = Math.round(window.innerHeight * 0.95);
					const w = Math.max(minW, Math.min(curMaxW, parseInt(parsed.width, 10)));
					const h = Math.max(minH, Math.min(curMaxH, parseInt(parsed.height, 10)));
					element.style.width = w + "px";
					element.style.height = h + "px";
				}
			}
		} catch (_) {}
	}

	let isResizing = false;
	let startPointerX = 0, startPointerY = 0;
	let startWidth = 0, startHeight = 0;
	let currentScale = 1;

	function onPointerDown(e) {
		if (e.button !== undefined && e.button !== 0) return;
		e.stopPropagation();
		e.preventDefault();

		const scaleVar = getComputedStyle(element).getPropertyValue("--spkmod-scale");
		currentScale = parseFloat(scaleVar) || 1;

		const rect = element.getBoundingClientRect();
		startWidth = rect.width / currentScale;
		startHeight = rect.height / currentScale;
		startPointerX = e.clientX;
		startPointerY = e.clientY;
		isResizing = true;

		if (handle.setPointerCapture && e.pointerId) {
			try { handle.setPointerCapture(e.pointerId); } catch (_) {}
		}

		document.body.style.userSelect = "none";
		document.body.style.cursor = "nwse-resize";

		window.addEventListener("pointermove", onPointerMove, true);
		window.addEventListener("pointerup", onPointerUp, true);
		window.addEventListener("pointercancel", onPointerUp, true);
		window.addEventListener("mousemove", onPointerMove, true);
		window.addEventListener("mouseup", onPointerUp, true);
	}

	function onPointerMove(e) {
		if (!isResizing) return;
		e.stopPropagation();
		e.preventDefault();

		const deltaX = (e.clientX - startPointerX) / currentScale;
		const deltaY = (e.clientY - startPointerY) / currentScale;

		const curMaxW = Math.round(window.innerWidth * 0.98);
		const curMaxH = Math.round(window.innerHeight * 0.95);

		const newWidth = Math.round(Math.max(minW, Math.min(curMaxW, startWidth + deltaX)));
		const newHeight = Math.round(Math.max(minH, Math.min(curMaxH, startHeight + deltaY)));

		element.style.width = newWidth + "px";
		element.style.height = newHeight + "px";

		if (typeof options.onResize === "function") {
			options.onResize(newWidth, newHeight);
		}
	}

	function onPointerUp(e) {
		if (!isResizing) return;
		isResizing = false;
		e.stopPropagation();
		e.preventDefault();

		document.body.style.userSelect = "";
		document.body.style.cursor = "";

		window.removeEventListener("pointermove", onPointerMove, true);
		window.removeEventListener("pointerup", onPointerUp, true);
		window.removeEventListener("pointercancel", onPointerUp, true);
		window.removeEventListener("mousemove", onPointerMove, true);
		window.removeEventListener("mouseup", onPointerUp, true);

		if (e && e.pointerId && handle.releasePointerCapture) {
			try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
		}

		if (sizeKey && window.localStorage) {
			const rect = element.getBoundingClientRect();
			const finalW = Math.round(rect.width / currentScale);
			const finalH = Math.round(rect.height / currentScale);
			if (typeof options.saveSize === "function") {
				options.saveSize(finalW, finalH, sizeKey);
			} else {
				localStorage.setItem(sizeKey, JSON.stringify({ width: finalW, height: finalH }));
			}
		}
	}

	handle.addEventListener("pointerdown", onPointerDown);
	handle.addEventListener("mousedown", onPointerDown);
}
window.makeResizable = makeResizable;

function positionModalNicely(modal) {
	if (!modal) return;
	bringToFront(modal);

	const isMobile = (typeof spkmodIsMobile === "function" ? spkmodIsMobile() : false) ||
		(typeof window.speakiMobile !== "undefined") ||
		(typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent));

	const posKey = modal.id ? ("spkmod-pos-" + modal.id) : null;
	const hasSavedPos = !!(posKey && window.localStorage && localStorage.getItem(posKey));
	const hasBeenDragged = modal.dataset.userDragged === "true";

	// Determine accurate target dimensions even when modal is currently hidden
	let targetW = 380;
	let targetH = 300;
	if (modal.id === "spkmod-settings-modal") {
		targetW = isMobile ? Math.min(740, window.innerWidth - 20) : 700;
		targetH = isMobile ? Math.min(500, window.innerHeight - 30) : 540;
	} else if (modal.id === "spkmod-css-modal") {
		targetW = isMobile ? Math.min(600, window.innerWidth - 20) : 580;
		targetH = isMobile ? Math.min(460, window.innerHeight - 30) : 500;
	} else if (modal.id === "spkmod-resource-pack-modal") {
		targetW = isMobile ? Math.min(640, window.innerWidth - 20) : 660;
		targetH = isMobile ? Math.min(480, window.innerHeight - 30) : 540;
	} else if (modal.id === "spkmod-bbs-modal") {
		targetW = isMobile ? Math.min(520, window.innerWidth - 20) : 540;
		targetH = isMobile ? Math.min(460, window.innerHeight - 30) : 500;
	} else if (modal.id === "spkmod-stats-modal") {
		targetW = 240;
		targetH = 280;
	} else if (modal.id === "spkmod-jukebox-modal") {
		targetW = isMobile ? Math.min(360, window.innerWidth - 20) : 380;
		targetH = isMobile ? Math.min(440, window.innerHeight - 30) : 460;
	} else if (modal.id === "spkmod-cinema-modal") {
		targetW = isMobile ? Math.min(380, window.innerWidth - 20) : 400;
		targetH = isMobile ? Math.min(500, window.innerHeight - 30) : 560;
	} else {
		targetW = modal.offsetWidth || 380;
		targetH = modal.offsetHeight || 300;
	}

	const modalW = targetW;
	const modalH = targetH;

	const curTop = parseFloat(modal.style.top);
	const curLeft = parseFloat(modal.style.left);

	// Check if top-left is out of bounds or if modal extends out of bounds on this screen
	const isOffscreen = isNaN(curTop) || isNaN(curLeft) ||
		curTop < 0 || curLeft < 0 ||
		curTop > (window.innerHeight - 50) ||
		curLeft > (window.innerWidth - 50) ||
		(curLeft + Math.min(targetW, 160) > window.innerWidth || curTop + Math.min(targetH, 120) > window.innerHeight);

	if (!isOffscreen && (hasSavedPos || hasBeenDragged) && modal.style.left && modal.style.top) {
		const clampedL = Math.max(10, Math.min(curLeft, window.innerWidth - targetW - 10));
		const maxT = Math.max(10, window.innerHeight - 50);
		const clampedT = Math.max(10, Math.min(curTop, maxT));
		modal.style.left = Math.round(clampedL) + "px";
		modal.style.top = Math.round(clampedT) + "px";
		return;
	}

	// Default placement for centered / dockable modals (custom CSS, resource packs, BBS, Settings on mobile, Cinema playlist)
	if (isMobile || modal === lunHudElements.bbsModal || modal.id === "spkmod-bbs-modal" ||
		modal === lunHudElements.customCssModal || modal.id === "spkmod-css-modal" ||
		modal === lunHudElements.resourcePackModal || modal.id === "spkmod-resource-pack-modal" ||
		modal.id === "spkmod-cinema-modal") {
		const safeLeft = Math.max(10, Math.min(window.innerWidth - targetW - 10, (modal.id === "spkmod-cinema-modal" && !isMobile) ? (window.innerWidth - targetW - 25) : Math.round((window.innerWidth - targetW) / 2)));
		const safeTop = Math.max(15, Math.min(window.innerHeight - targetH - 10, Math.round((window.innerHeight - targetH) / 2)));
		modal.style.left = safeLeft + "px";
		modal.style.top = safeTop + "px";
		return;
	}

	const hudRect = document.querySelector("#spkmod-hud")?.getBoundingClientRect();
	let startLeft = hudRect && hudRect.right > 0 ? Math.round(hudRect.right + 10) : 260;
	const startTop = Math.max(50, hudRect && hudRect.top >= 50 ? Math.round(hudRect.top) : 50);

	const allModals = [
		lunHudElements.settingsModal,
		lunHudElements.statsModal,
		lunHudElements.eventModal,
		lunHudElements.patchNotesModal,
		lunHudElements.effectsModal,
		lunHudElements.editsModal,
		lunHudElements.hotkeysModal
	];

	const visibleModals = allModals.filter(m => m && m !== modal && !m.classList.contains("hidden") && m.offsetParent !== null);

	if (visibleModals.length > 0) {
		let rightmostModal = visibleModals[0];
		let rightmostRect = rightmostModal.getBoundingClientRect();
		for (let i = 1; i < visibleModals.length; i++) {
			const r = visibleModals[i].getBoundingClientRect();
			if (r.right > rightmostRect.right) {
				rightmostModal = visibleModals[i];
				rightmostRect = r;
			}
		}

		const approxWidth = modal.offsetWidth || (modal.id === "spkmod-settings-modal" ? (isMobile ? 380 : 700) : (modal.id === "spkmod-stats-modal" ? 240 : (modal.id === "spkmod-jukebox-modal" ? 380 : 400)));
		let nextLeft = Math.round(rightmostRect.right + 10);
		let nextTop = Math.max(50, Math.round(rightmostRect.top));

		if (nextLeft + approxWidth > window.innerWidth - 10) {
			nextLeft = Math.max(10, Math.min(Math.round(rightmostRect.left + 30), window.innerWidth - approxWidth - 10));
			nextTop = Math.max(40, Math.min(Math.round(rightmostRect.top + 35), window.innerHeight - 100));
		}

		if (nextTop + modalH > window.innerHeight - 20) {
			nextTop = Math.max(30, window.innerHeight - modalH - 20);
		}

		modal.style.left = nextLeft + "px";
		modal.style.top = nextTop + "px";
	} else {
		if (startLeft + modalW > window.innerWidth - 10) {
			startLeft = Math.max(10, window.innerWidth - modalW - 10);
		}
		if (startTop + modalH > window.innerHeight - 20) {
			startTop = Math.max(30, window.innerHeight - modalH - 20);
		}
		modal.style.left = startLeft + "px";
		modal.style.top = startTop + "px";
	}
}

function resetWindowPositions() {
	if (window.localStorage) {
		try {
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k && (k.startsWith("spkmod-pos-") || k.startsWith("spkmod-size-") || k === "spkmod-window-pos")) {
					keysToRemove.push(k);
				}
			}
			keysToRemove.forEach(k => localStorage.removeItem(k));
		} catch (e) {
			console.warn("[SpeakiMod+] Failed to clear saved positions:", e);
		}
	}

	if (lunHudElements.hud) {
		lunHudElements.hud.style.left = "10px";
		lunHudElements.hud.style.top = "10px";
		delete lunHudElements.hud.dataset.userDragged;
	}

	const sepPanel = document.getElementById("spkmod-panel");
	if (sepPanel) {
		delete sepPanel.dataset.userDragged;
		if (typeof lunSeparatePanel !== "undefined" && lunSeparatePanel && sepPanel.parentElement === document.body) {
			sepPanel.style.right = "10px";
			sepPanel.style.top = "60px";
			sepPanel.style.left = "auto";
		}
	}

	const pqEl = document.getElementById("spkmod-pq");
	if (pqEl) {
		delete pqEl.dataset.userDragged;
		pqEl.style.right = "10px";
		pqEl.style.top = "10px";
		pqEl.style.left = "auto";
	}

	const allKnownModals = [
		lunHudElements.bbsModal,
		lunHudElements.settingsModal,
		lunHudElements.statsModal,
		lunHudElements.eventModal,
		lunHudElements.patchNotesModal,
		lunHudElements.effectsModal,
		lunHudElements.editsModal,
		lunHudElements.hotkeysModal,
		lunHudElements.infoModal,
		lunHudElements.customCssModal,
		lunHudElements.resourcePackModal,
		typeof lunEmojiPickerPanel !== "undefined" ? lunEmojiPickerPanel : null,
		typeof mapModalElements !== "undefined" ? mapModalElements.modalWindow : null,
		typeof spkmodCinemaModalEl !== "undefined" ? spkmodCinemaModalEl : null
	];

	allKnownModals.forEach(m => {
		if (m) {
			delete m.dataset.userDragged;
			m.style.left = "";
			m.style.top = "";
		}
	});

	if (lunHudElements.settingsModal) {
		lunHudElements.settingsModal.style.width = "";
		lunHudElements.settingsModal.style.height = "";
	}

	if (lunHudElements.bbsModal) {
		lunHudElements.bbsModal.style.width = "520px";
		lunHudElements.bbsModal.style.height = "480px";
	}

	if (lunHudElements.customCssModal) {
		lunHudElements.customCssModal.style.width = "580px";
		lunHudElements.customCssModal.style.height = "500px";
	}

	if (lunHudElements.resourcePackModal) {
		lunHudElements.resourcePackModal.style.width = "660px";
		lunHudElements.resourcePackModal.style.height = "540px";
	}

	if (lunHudElements.bbsModal && !lunHudElements.bbsModal.classList.contains("hidden")) {
		const modalWidth = lunHudElements.bbsModal.offsetWidth || 520;
		const safeLeft = Math.max(20, Math.round((window.innerWidth - modalWidth) / 2));
		lunHudElements.bbsModal.style.left = safeLeft + "px";
		lunHudElements.bbsModal.style.top = "60px";
	}

	const otherOpenModals = [
		lunHudElements.settingsModal,
		lunHudElements.statsModal,
		lunHudElements.eventModal,
		lunHudElements.patchNotesModal,
		lunHudElements.effectsModal,
		lunHudElements.editsModal,
		lunHudElements.hotkeysModal,
		lunHudElements.infoModal,
		lunHudElements.customCssModal,
		lunHudElements.resourcePackModal
	];

	otherOpenModals.forEach(m => {
		if (m && !m.classList.contains("hidden")) {
			positionModalNicely(m);
		}
	});

	if (typeof chatLog === "function") {
		chatLog("💬 [SpeakiMod+] " + (t("windowPositionsReset") || "Window positions have been reset."));
	}
}
window.resetWindowPositions = resetWindowPositions;

let lastToggleSettingsTime = 0;
// Only portable preferences belong in settings files. Never include account
// recovery codes, translation email, caches, or unknown future storage keys.
// Keep export and import on the same explicit allowlist.
const SPKMOD_SETTINGS_KEYS = new Set([
	"spkmod-accent-color",
	"spkmod-bbs-collapse-replies",
	"spkmod-bbs-font-size",
	"spkmod-bbs-icon-actions",
	"spkmod-bbs-theme",
	"spkmod-beyblade-speed",
	"spkmod-bg-opacity",
	"spkmod-camera-effect",
	"spkmod-channel-tracker",
	"spkmod-chat-random-colors",
	"spkmod-chat-timestamps",
	"spkmod-currency-tracker",
	"spkmod-custom-font",
	"spkmod-custom-hud-bg",
	"spkmod-custom-hud-unlocked",
	"spkmod-disable-right-click-pinning",
	"spkmod-discord-rpc",
	"spkmod-drone-speed",
	"spkmod-emoji-size",
	"spkmod-exp-interval-minutes",
	"spkmod-exp-per-hour",
	"spkmod-filter-enabled",
	"spkmod-font-preset",
	"spkmod-resolution-override",
	"spkmod-fp-pitch",
	"spkmod-fps-ping",
	"spkmod-friend-highlight-enabled",
	"spkmod-gamepad-config",
	"spkmod-gamepad-rumble",
	"spkmod-gamepad-unlocked",
	"spkmod-gmchat-enabled",
	"spkmod-hide-all-players",
	"spkmod-hide-known-bots",
	"spkmod-hide-player-levels",
	"spkmod-hide-verbose-chat",
	"spkmod-hud-bg",
	"spkmod-hud-locked",
	"spkmod-lang",
	"spkmod-low-hp-warning",
	"spkmod-mention-enabled",
	"spkmod-mention-ping",
	"spkmod-mute-minimized",
	"spkmod-muted",
	"spkmod-name-presets",
	"spkmod-outgoing-source-lang",
	"spkmod-panel-left",
	"spkmod-party-highlight-enabled",
	"spkmod-pos-spkmod-bbs-modal",
	"spkmod-pos-spkmod-effects-modal",
	"spkmod-pos-spkmod-edits-modal",
	"spkmod-pos-spkmod-emoji-picker-v2",
	"spkmod-pos-spkmod-event-modal",
	"spkmod-pos-spkmod-gamepad-modal",
	"spkmod-pos-spkmod-hotkeys-modal",
	"spkmod-pos-spkmod-hud",
	"spkmod-pos-spkmod-map-modal",
	"spkmod-pos-spkmod-panel",
	"spkmod-pos-spkmod-patchnotes-modal",
	"spkmod-pos-spkmod-quests-modal",
	"spkmod-pos-spkmod-settings-modal",
	"spkmod-pos-spkmod-stats-modal",
	"spkmod-pos-spkmod-jukebox-modal",
	"spkmod-jukebox-favorites",
	"spkmod-jukebox-playlist-key",
	"spkmod-jukebox-vol",
	"spkmod-jukebox-shuffle",
	"spkmod-jukebox-repeat",
	"spkmod-jukebox-mini",
	"spkmod-pumpkin-tracker",
	"spkmod-quests-modal-open",
	"spkmod-reset-timer",
	"spkmod-separate-panel",
	"spkmod-session-gold",
	"spkmod-solitude-whitelist",
	"spkmod-translate-enabled",
	"spkmod-translate-target",
	"spkmod-translate-engine",
	"spkmod-ui-scale",
	"spkmod-uiscale",
	"spkmod-window-pos"
]);

function toggleSettingsModal() {
	const now = Date.now();
	if (now - lastToggleSettingsTime < 250) return;
	lastToggleSettingsTime = now;

	if (!lunHudElements.settingsModal) return;
	const isClosed = lunHudElements.settingsModal.classList.contains("hidden");
	if (isClosed) {
		lunHudElements.settingsModal.classList.remove("hidden");
		positionModalNicely(lunHudElements.settingsModal);
		bringToFront(lunHudElements.settingsModal);
		if (typeof updateHudBgDropdown === 'function') {
			updateHudBgDropdown();
		}
	} else {
		lunHudElements.settingsModal.classList.add("hidden");
		if (typeof toggleQuickLoginSettings === "function") {
			toggleQuickLoginSettings(false);
		}
	}
}

function toggleEventModal() {
	if (!lunHudElements.eventModal) return;
	const isClosed = lunHudElements.eventModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.eventModal);
		lunHudElements.eventModal.classList.remove("hidden");
		fetchMinigameStatus();
		populateMinigameList();
	} else {
		lunHudElements.eventModal.classList.add("hidden");
	}
}

function populateMinigameList() {
	if (typeof lunPanelElements === 'undefined' || !lunPanelElements.minigameList) return;
	const listContainer = lunPanelElements.minigameList;
	listContainer.replaceChildren();

	const panels = Array.from(document.querySelectorAll('.sr-minigame-entry-dialog'));
	if (!panels.length) {
		listContainer.appendChild(buildElement("div", { innerText: "No minigames found.", style: "color: #94a3b8; font-size: 9pt; text-align: center;" }));
	} else {
		let activeIndex = -1;
		if (typeof ACTIVE_MINIGAME_ID !== 'undefined' && ACTIVE_MINIGAME_ID && typeof gameState !== 'undefined' && gameState.minigameEntryDialogs) {
			activeIndex = gameState.minigameEntryDialogs.findIndex(d => d.def && d.def.gameKey === ACTIVE_MINIGAME_ID);
		}

		if (activeIndex === -1) {
			listContainer.appendChild(buildElement("div", { innerText: "Loading event data...", style: "color: #94a3b8; font-size: 9pt; text-align: center;" }));
			return;
		}

		panels.forEach((panel, idx) => {
			if (idx !== activeIndex) return; // Only show active

			let titleEl = panel.querySelector('.sr-panel__title, .sr-minigame-entry__greeting-name');
			let title = titleEl ? titleEl.textContent.trim() : "Unknown Minigame";
			listContainer.appendChild(buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "🎮 " + title,
				style: "margin-bottom: 4px;",
				onclick: () => {
					lunHudElements.eventModal.classList.add("hidden");

					const currentPanels = Array.from(
						document.querySelectorAll('.sr-minigame-entry-dialog')
					);

					const currentPanel = panel;
					if (!currentPanel || !document.contains(currentPanel)) return;

					currentPanels.forEach(p => {
						p.style.display = 'none';
						p.classList.remove('sr-panel--open');
					});
					currentPanel.style.display = 'flex';
					currentPanel.classList.add('sr-panel--open');
					currentPanel.hidden = false;
					currentPanel.removeAttribute('aria-hidden');
					currentPanel.querySelectorAll('[class*="guide"], .sr-minigame-entry__guide').forEach(g => g.style.display = 'none');

					// Do not force overwrite the matching state buttons (actions), as this breaks the matchmaking UI when reopening!

					window.lunActiveMinigamePanel = currentPanel;
					window.lunMinigameZoneStarted = typeof gameState !== "undefined" ? gameState.zoneId : null;

					if (!window.lunMinigameCloseHooked) {
						window.lunMinigameCloseHooked = true;
						document.addEventListener('click', (e) => {
							if (e.target.closest('.sr-panel__close') && e.target.closest('.sr-minigame-entry-dialog')) {
								const p = e.target.closest('.sr-minigame-entry-dialog');
								p.classList.remove('sr-panel--open');
								window.lunActiveMinigamePanel = null;
							}
						});
					}
				}
			}));
		});
	}
}

function updateEventModalContent() {
	if (!lunHudElements.eventModal) return;
	if (eventModalElements.headerTitle) setText(eventModalElements.headerTitle, t("eventInfoHeader"));
	if (eventModalElements.titleText) setText(eventModalElements.titleText, "🎃 " + t("eventMinigameTitle"));
	
	if (!lunMinigameStatus) {
		if (eventModalElements.periodText) setText(eventModalElements.periodText, t("eventLoading"));
		return;
	}

	const active = !!lunMinigameStatus.isActive;
	if (eventModalElements.statusBadge) {
		setText(eventModalElements.statusBadge, active ? t("eventStatusActive") : t("eventStatusInactive"));
		eventModalElements.statusBadge.style.color = active ? "#4ade80" : "#f87171";
		eventModalElements.statusBadge.style.borderColor = active ? "#4ade80" : "#f87171";
	}

	if (eventModalElements.periodText) {
		const start = lunMinigameStatus.activeStartDate || "--";
		const end = lunMinigameStatus.activeEndDate || "--";
		setText(eventModalElements.periodText, t("eventPeriod", start, end));
	}

	if (eventModalElements.bestScoreText) {
		setText(eventModalElements.bestScoreText, t("eventBestScore", lunMinigameStatus.myBestScore ?? "--"));
	}

	if (eventModalElements.playsRemainingText) {
		const rem = lunMinigameStatus.remainingPlaysToday ?? 0;
		const cap = lunMinigameStatus.dailyCapPlays ?? 10;
		setText(eventModalElements.playsRemainingText, t("eventPlaysToday", rem, cap));
	}

	if (eventModalElements.refreshBtn) setText(eventModalElements.refreshBtn, "🔄 " + t("refreshBtn"));

	populateMinigameList();
}

var lunPatchNotesData = (() => {
	try {
		const raw = localStorage.getItem("spkmod-patchnotes-data");
		return raw ? JSON.parse(raw) : null;
	} catch (_) {
		return null;
	}
})();
var lunPatchNotesFetched = false;
var lunPatchNotesLoading = false;
var lunPatchNotesTranslatedLang = null;
var lunPatchNotesTranslations = (() => {
	try {
		const raw = localStorage.getItem("spkmod-patchnotes-translations");
		return raw ? JSON.parse(raw) : {};
	} catch (_) {
		return {};
	}
})();

async function translateTextToLang(text, targetLang) {
	if (!text || !text.trim() || !targetLang) return text;
	try {
		const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
		const res = await fetch(url);
		if (res.ok) {
			const data = await res.json();
			if (data && data[0]) {
				const result = data[0].map(chunk => chunk[0] || "").join("");
				if (result && result.trim()) return result;
			}
		}
	} catch (e) {
		try {
			if (typeof translateChatText === "function") {
				const guess = (typeof guessSourceLang === "function") ? guessSourceLang(text) : "auto";
				const translated = await translateChatText(text, guess, targetLang);
				if (translated) return translated;
			}
		} catch (_) {}
	}
	return text;
}

async function fetchPatchNotesOnce() {
	if (lunPatchNotesFetched) return;
	const token = getAuthToken();
	if (!token) return;
	lunPatchNotesFetched = true;
	if (!lunPatchNotesData) {
		lunPatchNotesLoading = true;
		renderPatchNotesUI();
	}

	try {
		const res = await fetch("https://sr1.overture.io.kr/api/patchnotes", {
			method: "GET",
			headers: {
				"authorization": `Bearer ${token}`
			},
			mode: "cors"
		});
		if (!res.ok) {
			lunPatchNotesLoading = false;
			renderPatchNotesUI();
			return;
		}
		const data = await res.json();
		const freshNotes = Array.isArray(data) ? data : [];
		const hasChanged = JSON.stringify(freshNotes) !== JSON.stringify(lunPatchNotesData);
		lunPatchNotesData = freshNotes;
		lunPatchNotesLoading = false;

		if (hasChanged) {
			try {
				localStorage.setItem("spkmod-patchnotes-data", JSON.stringify(lunPatchNotesData));
			} catch (_) {}
		}

		await translatePatchNotesToUserLang();
		renderPatchNotesUI();
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to fetch patch notes:", e);
		lunPatchNotesLoading = false;
		renderPatchNotesUI();
	}
}

async function translatePatchNotesToUserLang() {
	if (!lunPatchNotesData || lunPatchNotesData.length === 0) return;
	const targetLang = spkmodLang === "es-419" ? "es" : spkmodLang;
	lunPatchNotesTranslatedLang = targetLang;
	if (targetLang === "ko") return;

	let updatedAny = false;
	for (const note of lunPatchNotesData) {
		if (!lunPatchNotesTranslations[note.id]) lunPatchNotesTranslations[note.id] = {};
		const noteHash = note.updatedAt || `${note.title || ""}:::${note.content || ""}`;
		const cached = lunPatchNotesTranslations[note.id][targetLang];

		if (cached && cached.hash === noteHash && cached.title && cached.content) {
			continue;
		}

		const translatedTitle = await translateTextToLang(note.title, targetLang);
		const translatedContent = await translateTextToLang(note.content, targetLang);
		lunPatchNotesTranslations[note.id][targetLang] = {
			hash: noteHash,
			title: translatedTitle,
			content: translatedContent
		};
		updatedAny = true;
	}

	if (updatedAny) {
		try {
			localStorage.setItem("spkmod-patchnotes-translations", JSON.stringify(lunPatchNotesTranslations));
		} catch (_) {}
	}
}

function togglePatchNotesModal() {
	if (!lunHudElements.patchNotesModal) return;
	const isClosed = lunHudElements.patchNotesModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.patchNotesModal);
		lunHudElements.patchNotesModal.classList.remove("hidden");
		if (!lunPatchNotesFetched) {
			fetchPatchNotesOnce();
		} else {
			renderPatchNotesUI();
		}
	} else {
		lunHudElements.patchNotesModal.classList.add("hidden");
	}
}

function renderPatchNotesUI() {
	if (!patchNotesModalElements.contentContainer) return;
	if (patchNotesModalElements.headerTitle) setText(patchNotesModalElements.headerTitle, "📰 " + t("patchNotesHeader"));
	const container = patchNotesModalElements.contentContainer;
	container.innerHTML = "";

	if (lunPatchNotesLoading) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #aaa; font-size: 10pt;",
			innerText: t("patchNotesLoading")
		}));
		return;
	}

	if (!lunPatchNotesData) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #f87171; font-size: 10pt;",
			innerText: t("patchNotesError")
		}));
		return;
	}

	if (lunPatchNotesData.length === 0) {
		container.appendChild(buildElement("div", {
			style: "text-align: center; padding: 20px 10px; color: #aaa; font-size: 10pt;",
			innerText: t("patchNotesEmpty")
		}));
		return;
	}

	const targetLang = spkmodLang === "es-419" ? "es" : spkmodLang;

	lunPatchNotesData.forEach(item => {
		const trans = lunPatchNotesTranslations[item.id]?.[targetLang];
		const displayTitle = trans?.title || item.title || "Patch Note";
		const displayContent = trans?.content || item.content || "";
		let displayDate = "";
		if (item.createdAt) {
			try {
				displayDate = new Date(item.createdAt).toLocaleDateString(undefined, {
					year: 'numeric', month: 'short', day: 'numeric'
				});
			} catch (_) {
				displayDate = String(item.createdAt).slice(0, 10);
			}
		}

		const card = buildElement("div", {
			style: "background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 4px;"
		}, [
			buildElement("div", { style: "display: flex; justify-content: space-between; align-items: baseline; gap: 8px;" }, [
				buildElement("span", {
					style: "font-weight: bold; font-size: 10.5pt; color: #ffd54a; flex: 1;",
					innerText: displayTitle
				}),
				buildElement("span", {
					style: "font-size: 8.5pt; color: #888; white-space: nowrap;",
					innerText: displayDate
				})
			]),
			buildElement("div", {
				style: "white-space: pre-wrap; font-size: 9.5pt; line-height: 1.5; color: #ddd; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;",
				innerText: displayContent
			})
		]);
		container.appendChild(card);
	});
}

var lunGamepadRumbleEnabled = (window.localStorage && localStorage.getItem("spkmod-gamepad-rumble")) !== "false";
function setGamepadRumbleEnabled(enabled) {
	lunGamepadRumbleEnabled = !!enabled;
	if (window.localStorage) localStorage.setItem("spkmod-gamepad-rumble", lunGamepadRumbleEnabled ? "true" : "false");
}

var lunUiScale = (window.localStorage && localStorage.getItem("spkmod-ui-scale")) || ((typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent))) ? "0.55" : "1.0");
var lunChannelTrackerEnabled = window.localStorage ? (localStorage.getItem("spkmod-channel-tracker") !== "false") : true;
if (typeof window.speakiMobile !== "undefined" || (typeof navigator !== "undefined" && /mobi|android/i.test(navigator.userAgent))) {
    lunChannelTrackerEnabled = window.localStorage && localStorage.getItem("spkmod-channel-tracker") === "true"; // default false on mobile
}
var lunGameUiScale = (window.localStorage && localStorage.getItem("spkmod-uiscale")) || "1.0";
var lunCameraEffect = (window.localStorage && localStorage.getItem("spkmod-camera-effect")) || "none";
var lunDroneSpeed = window.lunDroneSpeed = (window.localStorage && parseFloat(localStorage.getItem("spkmod-drone-speed"))) || 0.10;
var lunViewClip = false;
var lunBgOpacity = (window.localStorage && localStorage.getItem("spkmod-bg-opacity")) || "glass";
var lunAccentColor = (window.localStorage && localStorage.getItem("spkmod-accent-color")) || "#ffd54a";
var lunHudBackground = (window.localStorage && localStorage.getItem("spkmod-hud-bg")) || "none";

const SPKMOD_REPO_FONTS_BASE = "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/fonts/";
const SPKMOD_EMOJI_FONT_FALLBACK = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

// ============================================================================
// Speaki Jukebox: Global YouTube Music Player
// Playlist: https://www.youtube.com/watch?v=8kKIzim7ZqU&list=PLrELCdfutHrSkxmdw2t_KD-8aj4VCclah
// ============================================================================

let SPKMOD_OST_TRACKS = [];
let SPKMOD_BOLPOP_TRACKS = [];

const SPKMOD_RADIO_URL = "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/radio.json";

function applyRadioTrackList(data) {
    if (!data || typeof data !== "object") return;
    let updated = false;

    if (Array.isArray(data.ost) && data.ost.length > 0) {
        SPKMOD_OST_TRACKS = data.ost.map(t => Array.isArray(t) ? t : [t.id || t.videoId || "", t.title || "", t.author || ""]).filter(t => t[0]);
        if (typeof window !== "undefined") window.SPKMOD_OST_TRACKS = SPKMOD_OST_TRACKS;
        updated = true;
    }

    if (Array.isArray(data.bolpop) && data.bolpop.length > 0) {
        SPKMOD_BOLPOP_TRACKS = data.bolpop.map(t => {
            if (Array.isArray(t)) {
                return [t[0], t[1] || "", t[2] || "", (t[3] !== undefined ? (parseInt(t[3], 10) || 0) : 0)];
            }
            return [t.id || t.videoId || "", t.title || "", t.author || "", (t.duration !== undefined ? (parseInt(t.duration, 10) || 0) : 0)];
        }).filter(t => t[0]);
        if (typeof window !== "undefined") window.SPKMOD_BOLPOP_TRACKS = SPKMOD_BOLPOP_TRACKS;
        updated = true;
    }

    if (updated) {
        const state = (typeof window !== "undefined") ? window.__speakiMusicState : null;
        if (state && (!state.currentTrackTitle || state.currentTrackTitle === "Trickcal BGM")) {
            const tracks = (typeof getActiveJukeboxTracks === "function") ? getActiveJukeboxTracks() : null;
            if (tracks && tracks.length > 0) {
                const cur = tracks[state.currentTrackIndex] || tracks[0];
                state.currentTrackTitle = cur[1];
                state.currentTrackAuthor = cur[2] || "";
            }
        }
        const modal = (typeof lunHudElements !== "undefined" && lunHudElements) ? lunHudElements.jukeboxModal : null;
        if (modal) {
            if (typeof populateJukeboxDrawer === "function") populateJukeboxDrawer(modal);
            if (typeof updateJukeboxUI === "function") updateJukeboxUI();
        }
    }
}

// Apply cached radio tracks from localStorage if present
try {
    if (typeof window !== "undefined" && window.localStorage) {
        const cached = localStorage.getItem("spkmod-radio-cache");
        if (cached) {
            applyRadioTrackList(JSON.parse(cached));
        }
    }
} catch (_) {}

// Fetch remote radio tracks from GitHub
async function fetchRemoteRadioTracks() {
    try {
        const res = await fetch(SPKMOD_RADIO_URL + "?t=" + Date.now());
        if (res.ok) {
            const data = await res.json();
            if (data && (Array.isArray(data.ost) || Array.isArray(data.bolpop))) {
                applyRadioTrackList(data);
                if (typeof window !== "undefined" && window.localStorage) {
                    try {
                        localStorage.setItem("spkmod-radio-cache", JSON.stringify(data));
                    } catch (_) {}
                }
                console.log("[SpeakiMod+] Radio tracks synchronized with GitHub (radio.json).");
            }
        }
    } catch (e) {
        console.warn("[SpeakiMod+] Failed to fetch remote radio.json:", e);
    }
}
if (typeof window !== "undefined") {
    window.SPKMOD_OST_TRACKS = SPKMOD_OST_TRACKS;
    window.SPKMOD_BOLPOP_TRACKS = SPKMOD_BOLPOP_TRACKS;
    window.fetchRemoteRadioTracks = fetchRemoteRadioTracks;
}
fetchRemoteRadioTracks();


// --- Jukebox i18n Helpers ---
function getJukeboxText(key) {
    if (typeof t === "function") {
        const val = t(key);
        if (val && val !== key) return val;
    }
    const enFallbacks = {
        jukeboxTitle: "Monatium Radio Station",
        jukeboxBtnTooltip: "Monatium Radio Station (Alt+M)",
        jukeboxPlaylistOst: "OST",
        jukeboxPlaylistBolpop: "Bolpop / MADs",
        jukeboxBolpopTab: "Bolpop",
        jukeboxPlaylistFavorites: "Favorites",
        jukeboxBolpopMessage: "Here's some of my Trickcal favorite songs a few added by friends, I hope you enjoy this curated list. With Love, Glas~<br><mark><b>Some songs might contain spoilers so go at your own risk!</b></mark>",
        jukeboxFavoritesMessage: "Your favorite Trickcal songs playlist. Click ❤️ on any track to add or remove it.",
        jukeboxFavoritesEmpty: "No favorite songs yet! Click ❤️ on any song to add it to this list.",
        jukeboxAddFavorite: "Add to favorites",
        jukeboxRemoveFavorite: "Remove from favorites",
        jukeboxMiniPlayerExpand: "Expand (Double Right-Click to minimize)",
        jukeboxTogglePlaylist: "Toggle Playlist",
        jukeboxClose: "Hide (Alt+M)",
        jukeboxShuffle: "Shuffle / Random",
        jukeboxPrev: "Previous",
        jukeboxPlay: "Play",
        jukeboxPause: "Pause",
        jukeboxNext: "Next",
        jukeboxRepeat: "Repeat Mode",
        jukeboxMiniPlayerHint: "Double right-click to open Mini-player!",
        jukeboxMiniPlayerExpandHint: "Double right-click to expand!",
        jukeboxResizeTooltip: "Drag corner to resize window"
    };
    return enFallbacks[key] || key;
}

// --- Jukebox Thumbnail Preview Tooltip ---
let lunJukeboxThumbPreview = null;
function ensureJukeboxThumbPreview() {
    if (lunJukeboxThumbPreview) return lunJukeboxThumbPreview;
    lunJukeboxThumbPreview = document.createElement("img");
    lunJukeboxThumbPreview.id = "spkmod-jukebox-thumb-preview";
    lunJukeboxThumbPreview.style.cssText = "display: none; position: fixed; width: 380px; height: 214px; max-width: 92vw; max-height: 85vh; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.9); border: 2px solid var(--spkmod-accent, #e8b84b); background: #1a1424; object-fit: cover; z-index: 2147483647 !important; pointer-events: none; transition: opacity 0.15s ease-out;";
    document.body.appendChild(lunJukeboxThumbPreview);
    return lunJukeboxThumbPreview;
}

function positionJukeboxThumbPreview(thumbEl) {
    if (!thumbEl || !lunJukeboxThumbPreview) return;
    const rect = thumbEl.getBoundingClientRect();
    const prevW = 380;
    const prevH = 214;

    let left = rect.left + rect.width / 2 - prevW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - prevW - 12));

    let top = rect.top - prevH - 12;
    if (top < 12) {
        top = rect.bottom + 12;
    }
    if (top + prevH > window.innerHeight - 12) {
        top = Math.max(12, window.innerHeight - prevH - 12);
    }

    lunJukeboxThumbPreview.style.left = Math.round(left) + "px";
    lunJukeboxThumbPreview.style.top = Math.round(top) + "px";
}

function showJukeboxThumbPreview(thumbEl) {
    if (!thumbEl) return;
    const preview = ensureJukeboxThumbPreview();
    const src = thumbEl.src || "";
    if (!src) return;

    const hqSrc = src.replace('/mqdefault.jpg', '/hqdefault.jpg');
    preview.onerror = () => { preview.src = src; };
    preview.src = hqSrc;
    preview.style.display = "block";
    preview.style.opacity = "1";
    positionJukeboxThumbPreview(thumbEl);
}

function hideJukeboxThumbPreview() {
    if (lunJukeboxThumbPreview) {
        lunJukeboxThumbPreview.style.display = "none";
    }
}

// --- Jukebox Floating Hint Toast ---
let lunJukeboxHintToast = null;
let lunJukeboxHintTimeout = null;

function showJukeboxHint(text, x, y) {
    if (!lunJukeboxHintToast) {
        lunJukeboxHintToast = document.createElement("div");
        lunJukeboxHintToast.id = "spkmod-jukebox-hint-toast";
        lunJukeboxHintToast.style.cssText = "position: fixed; z-index: 2147483647 !important; pointer-events: none; display: none; align-items: center; gap: 6px; background: rgba(26, 20, 36, 0.96); color: #ffdf79; border: 1px solid var(--spkmod-accent, #e8b84b); border-radius: 8px; padding: 6px 12px; font-size: 11px; font-weight: 700; box-shadow: 0 8px 24px rgba(0,0,0,0.85); white-space: nowrap; transition: opacity 0.2s, transform 0.2s; transform: translate(-50%, -100%); font-family: Pretendard, system-ui, sans-serif;";
        document.body.appendChild(lunJukeboxHintToast);
    }
    lunJukeboxHintToast.innerHTML = `🖱️ ${text}`;
    lunJukeboxHintToast.style.display = "inline-flex";
    lunJukeboxHintToast.style.opacity = "1";

    const prevW = lunJukeboxHintToast.offsetWidth || 180;
    const prevH = lunJukeboxHintToast.offsetHeight || 32;
    let clampedX = Math.max(prevW / 2 + 10, Math.min(x || (window.innerWidth / 2), window.innerWidth - prevW / 2 - 10));
    let clampedY = Math.max(prevH + 10, (y || 100) - 8);

    lunJukeboxHintToast.style.left = Math.round(clampedX) + "px";
    lunJukeboxHintToast.style.top = Math.round(clampedY) + "px";

    if (lunJukeboxHintTimeout) clearTimeout(lunJukeboxHintTimeout);
    lunJukeboxHintTimeout = setTimeout(() => {
        if (lunJukeboxHintToast) {
            lunJukeboxHintToast.style.opacity = "0";
            setTimeout(() => {
                if (lunJukeboxHintToast) lunJukeboxHintToast.style.display = "none";
            }, 200);
        }
    }, 2000);
}

function hideJukeboxHint() {
    if (lunJukeboxHintTimeout) clearTimeout(lunJukeboxHintTimeout);
    if (lunJukeboxHintToast) {
        lunJukeboxHintToast.style.display = "none";
    }
}

if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
        hideJukeboxThumbPreview();
        hideJukeboxHint();
    }, true);
    window.addEventListener("touchstart", () => {
        hideJukeboxThumbPreview();
        hideJukeboxHint();
    }, { passive: true, capture: true });
}

function updateJukeboxI18n() {
    const modal = lunHudElements && lunHudElements.jukeboxModal;
    if (!modal) return;
    const state = window.__speakiMusicState;

    const titleEl = modal.querySelector('#spkmod-jukebox-header-title');
    if (titleEl) {
        titleEl.innerHTML = `<span style="font-size:15px;">🎵</span> ${getJukeboxText("jukeboxTitle")}`;
    }

    const tabOst = modal.querySelector('#spkmod-jukebox-tab-ost');
    if (tabOst) {
        tabOst.textContent = `💿 ${getJukeboxText("jukeboxPlaylistOst")}`;
        tabOst.title = `Trickcal ${getJukeboxText("jukeboxPlaylistOst")}`;
    }

    const tabBolpop = modal.querySelector('#spkmod-jukebox-tab-bolpop');
    if (tabBolpop) {
        tabBolpop.textContent = `🎬 ${getJukeboxText("jukeboxBolpopTab")}`;
        tabBolpop.title = getJukeboxText("jukeboxPlaylistBolpop");
    }

    const tabFav = modal.querySelector('#spkmod-jukebox-tab-fav');
    if (tabFav) {
        tabFav.title = getJukeboxText("jukeboxPlaylistFavorites");
    }

    const drawerBtn = modal.querySelector('#spkmod-jukebox-drawer-btn');
    if (drawerBtn) {
        drawerBtn.title = getJukeboxText("jukeboxTogglePlaylist");
    }

    const closeBtn = modal.querySelector('#spkmod-jukebox-close-btn');
    if (closeBtn) {
        closeBtn.title = getJukeboxText("jukeboxClose");
    }

    const miniExpandBtn = modal.querySelector('#spkmod-jukebox-mini-expand');
    if (miniExpandBtn) {
        miniExpandBtn.title = getJukeboxText("jukeboxMiniPlayerExpand");
    }

    const btnShuffle = modal.querySelector('#spkmod-jukebox-shuffle');
    if (btnShuffle) {
        btnShuffle.title = getJukeboxText("jukeboxShuffle");
    }

    const btnPrev = modal.querySelector('#spkmod-jukebox-prev');
    if (btnPrev) {
        btnPrev.title = getJukeboxText("jukeboxPrev");
    }

    const btnPlay = modal.querySelector('#spkmod-jukebox-play');
    if (btnPlay) {
        btnPlay.title = (state && state.isPlaying) ? getJukeboxText("jukeboxPause") : getJukeboxText("jukeboxPlay");
    }

    const btnNext = modal.querySelector('#spkmod-jukebox-next');
    if (btnNext) {
        btnNext.title = getJukeboxText("jukeboxNext");
    }

    const btnRepeat = modal.querySelector('#spkmod-jukebox-repeat');
    if (btnRepeat) {
        btnRepeat.title = getJukeboxText("jukeboxRepeat");
    }

    const msgCard = modal.querySelector('#spkmod-jukebox-bolpop-msg');
    if (msgCard) {
        msgCard.innerHTML = `💌 <i>${getJukeboxText("jukeboxBolpopMessage")}</i>`;
    }

    const favMsg = modal.querySelector('#spkmod-jukebox-fav-msg');
    if (favMsg) {
        favMsg.innerHTML = `❤️ <i>${getJukeboxText("jukeboxFavoritesMessage")}</i>`;
    }

    const favEmpty = modal.querySelector('#spkmod-jukebox-fav-empty');
    if (favEmpty) {
        favEmpty.innerHTML = `🤍 <i>${getJukeboxText("jukeboxFavoritesEmpty")}</i>`;
    }

    const curVid = state && getActiveJukeboxTracks()[state.currentTrackIndex]?.[0];
    const heartBtn = modal.querySelector('#spkmod-jukebox-heart-btn');
    if (heartBtn && curVid) {
        const isFav = isJukeboxTrackFavorite(curVid);
        heartBtn.textContent = isFav ? '❤️' : '🤍';
        heartBtn.title = isFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");
    }

    const rowHearts = modal.querySelectorAll('.spkmod-jb-row-heart');
    rowHearts.forEach(btn => {
        const isFav = btn.textContent === '❤️';
        btn.title = isFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");
    });

    const hintText = (state && state.isMiniMode) ? getJukeboxText("jukeboxMiniPlayerExpandHint") : getJukeboxText("jukeboxMiniPlayerHint");
    const header = modal.querySelector('#spkmod-jukebox-header');
    const trackInfo = modal.querySelector('#spkmod-jukebox-track-info');
    if (header) {
        header.title = hintText;
        if (typeof setSpkmodRichTooltip === 'function') {
            setSpkmodRichTooltip(header, '🖱️ ' + hintText);
        }
    }
    if (trackInfo) {
        trackInfo.title = hintText;
        if (typeof setSpkmodRichTooltip === 'function') {
            setSpkmodRichTooltip(trackInfo, '🖱️ ' + hintText);
        }
    }

    const resizeHandle = modal.querySelector('#spkmod-jukebox-resize-handle');
    if (resizeHandle) {
        resizeHandle.title = getJukeboxText("jukeboxResizeTooltip");
    }

    if (typeof updateHudIconTooltips === "function") {
        updateHudIconTooltips();
    }
}

if (typeof spkmodI18nRenderers !== "undefined") {
    spkmodI18nRenderers.push(() => {
        updateJukeboxI18n();
    });
}

window.__speakiMusicState = window.__speakiMusicState || {
    player: null,
    isReady: false,
    isPlaying: false,
    activePlaylistKey: (window.localStorage && localStorage.getItem("spkmod-jukebox-playlist-key")) || "ost",
    currentTrackIndex: 0,
    currentTrackTitle: "",
    currentTrackAuthor: "",
    duration: 0,
    currentTime: 0,
    volume: (window.localStorage && parseInt(localStorage.getItem("spkmod-jukebox-vol"), 10)) || 75,
    savedBgmVolume: null,
    isBgmSuppressed: false,
    isSuppressingBgmInternal: false,
    isChangingTrack: false,
    changeTrackTimeout: null,
    shuffle: (window.localStorage && localStorage.getItem("spkmod-jukebox-shuffle") === "true") || false,
    repeatMode: (window.localStorage && localStorage.getItem("spkmod-jukebox-repeat")) || "all",
    updateInterval: null,
    modalVisible: (window.localStorage && localStorage.getItem("spkmod-jukebox-visible") === "true") || false,
    isMiniMode: (window.localStorage && localStorage.getItem("spkmod-jukebox-mini") === "true") || false
};

// --- Jukebox Favorites Management ---
let lunJukeboxFavoriteIds = new Set();

function loadJukeboxFavorites() {
    try {
        const raw = (window.localStorage && localStorage.getItem("spkmod-jukebox-favorites"));
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
                lunJukeboxFavoriteIds = new Set(list.map(item => Array.isArray(item) ? item[0] : (item && item.vid ? item.vid : item)));
                return;
            }
        }
    } catch (_) {}
    lunJukeboxFavoriteIds = new Set();
}
loadJukeboxFavorites();

// Clean up suppressed state if player closed tab or reloaded mid-song
try {
    const wasSuppressed = (window.localStorage && localStorage.getItem("spkmod-is-bgm-suppressed") === "true");
    const rawSaved = (window.localStorage && localStorage.getItem("spkmod-user-bgm-volume"));
    if (rawSaved !== null && rawSaved !== "") {
        const n = Number(rawSaved);
        if (Number.isFinite(n) && n >= 0 && n <= 100) {
            window.__speakiMusicState.savedBgmVolume = n;
        }
    }
    if (wasSuppressed && typeof window.__speakiMusicState.savedBgmVolume === "number") {
        const raw = (window.localStorage && localStorage.getItem('sr1_settings'));
        if (raw) {
            const s = JSON.parse(raw);
            if (s && s.bgmVolume === 0 && window.__speakiMusicState.savedBgmVolume > 0) {
                s.bgmVolume = window.__speakiMusicState.savedBgmVolume;
                localStorage.setItem('sr1_settings', JSON.stringify(s));
            }
        }
		const restoreVol = window.__speakiMusicState.savedBgmVolume;
        if (restoreVol > 0) {
            let tries = 0;
            const timer = setInterval(() => {
                tries++;
                if (typeof window.updateGameSettings === "function") {
                    clearInterval(timer);
                    try { window.updateGameSettings({ bgmVolume: restoreVol }); } catch (_) {}
                } else if (tries > 50) {
                    clearInterval(timer);
                }
            }, 200);
        }
        localStorage.setItem("spkmod-is-bgm-suppressed", "false");
    }
} catch (_) {}

function findJukeboxTrackByVid(vid) {
    if (!vid) return null;
    for (const t of SPKMOD_BOLPOP_TRACKS) {
        if (t[0] === vid) return t;
    }
    for (const t of SPKMOD_OST_TRACKS) {
        if (t[0] === vid) return [t[0], t[1], t[2] || ""];
    }
    return null;
}

function getJukeboxFavoriteTracks() {
    try {
        const raw = (window.localStorage && localStorage.getItem("spkmod-jukebox-favorites"));
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
                return list.map(item => {
                    if (Array.isArray(item)) return [item[0], item[1], item[2] || ""];
                    if (item && item.vid) return [item.vid, item.title, item.author || ""];
                    const found = findJukeboxTrackByVid(item);
                    return found || [item, "Favorite Track", ""];
                });
            }
        }
    } catch (_) {}
    return [];
}

function isJukeboxTrackFavorite(vid) {
    if (!vid) return false;
    return lunJukeboxFavoriteIds.has(vid);
}

function toggleJukeboxFavorite(track) {
    if (!track) return false;
    const vid = Array.isArray(track) ? track[0] : (track.vid || track);
    if (!vid) return false;

    let favorites = getJukeboxFavoriteTracks();
    const isFav = lunJukeboxFavoriteIds.has(vid);

    if (isFav) {
        favorites = favorites.filter(t => t[0] !== vid);
        lunJukeboxFavoriteIds.delete(vid);
    } else {
        const found = findJukeboxTrackByVid(vid);
        const title = found ? found[1] : (Array.isArray(track) ? track[1] : (track.title || "Track"));
        const author = found ? (found[2] || "") : (Array.isArray(track) ? (track[2] || "") : (track.author || ""));
        favorites.push([vid, title, author]);
        lunJukeboxFavoriteIds.add(vid);
    }

    try {
        if (window.localStorage) {
            localStorage.setItem("spkmod-jukebox-favorites", JSON.stringify(favorites));
        }
    } catch (_) {}

    return !isFav;
}

function getActiveJukeboxTracks() {
    const state = window.__speakiMusicState;
    if (state.activePlaylistKey === "favorites") {
        return getJukeboxFavoriteTracks();
    }
    return (state.activePlaylistKey === "bolpop") ? SPKMOD_BOLPOP_TRACKS : SPKMOD_OST_TRACKS;
}

// Initial track metadata
(function() {
    const state = window.__speakiMusicState;
    const tracks = getActiveJukeboxTracks();
    if (!state.currentTrackTitle && tracks && tracks.length > 0) {
        state.currentTrackTitle = tracks[0][1];
        state.currentTrackAuthor = tracks[0][2] || "";
    }
})();

function cleanJukeboxTitle(title) {
    if (!title) return 'Track';
    return title
        .replace(/^\[?\s*Trickc?al\s+Revive\s+Soundtrack\s*\]?\s*/i, '')
        .replace(/[-–—]?\s*ddocchi\s*/gi, '')
        .replace(/[-–—]?\s*ddochi\s*/gi, '')
        .trim();
}

function findJukeboxBgmNodes() {
    const nodes = [];
    try {
        const gs = window.gameState || (typeof gameState !== 'undefined' ? gameState : null);
        const checkChild = (child) => {
            if (child && (child.isAudio || child.type === 'Audio' || child.type === 'PositionalAudio') && child.loop) {
                nodes.push(child);
            }
        };
        const camera = gs?.camera || gs?.speakovHost?.camera || gs?.miningHost?.camera;
        if (camera && typeof camera.traverse === "function") {
            camera.traverse(checkChild);
        }
        if (gs?.scene && typeof gs.scene.traverse === "function") {
            gs.scene.traverse(checkChild);
        }
    } catch (_) {}
    return nodes;
}

function getUserActualBgmVolume() {
    const state = window.__speakiMusicState;
    if (typeof state.savedBgmVolume === "number" && Number.isFinite(state.savedBgmVolume) && state.savedBgmVolume >= 0 && state.savedBgmVolume <= 100) {
        return state.savedBgmVolume;
    }
    try {
        if (window.localStorage) {
            const raw = localStorage.getItem("spkmod-user-bgm-volume");
            if (raw !== null && raw !== "") {
                const n = Number(raw);
                if (Number.isFinite(n) && n >= 0 && n <= 100) {
                    state.savedBgmVolume = n;
                    return n;
                }
            }
        }
    } catch (_) {}
    return null;
}

function setUserActualBgmVolume(vol) {
    if (typeof vol !== "number" || !Number.isFinite(vol)) return;
    const clamped = Math.max(0, Math.min(100, Math.round(vol)));
    const state = window.__speakiMusicState;
    state.savedBgmVolume = clamped;
    try {
        if (window.localStorage) {
            localStorage.setItem("spkmod-user-bgm-volume", String(clamped));
        }
    } catch (_) {}
}

function hookNativeSettingsVolume() {
    const state = window.__speakiMusicState;
    if (typeof window.updateGameSettings === "function" && !window.updateGameSettings.__spkmodBgmHooked) {
        const origUpdate = window.updateGameSettings;
        const wrapped = function(patch) {
            if (patch && typeof patch.bgmVolume === "number" && Number.isFinite(patch.bgmVolume)) {
                if (!state.isSuppressingBgmInternal) {
                    setUserActualBgmVolume(patch.bgmVolume);
                }
            }
            return origUpdate.apply(this, arguments);
        };
        wrapped.__spkmodBgmHooked = true;
        window.updateGameSettings = wrapped;
    }
}

function findNativeBgmSlider() {
    const inputs = Array.from(document.querySelectorAll('input[type="range"]'));
    for (const input of inputs) {
        if (input.id && input.id.startsWith('spkmod-')) continue;
        const row = input.closest('.sr-panel__row') || input.parentElement;
        const text = (row?.textContent || '').toLowerCase();
        if (text.includes('bgm') || text.includes('music') || text.includes('배경음') || text.includes('音楽') || text.includes('音樂')) {
            if (!input.__spkmodBgmHooked) {
                input.__spkmodBgmHooked = true;
                input.addEventListener('input', () => {
                    const val = Number(input.value);
                    if (Number.isFinite(val) && !window.__speakiMusicState.isSuppressingBgmInternal) {
                        setUserActualBgmVolume(val);
                    }
                });
            }
            return input;
        }
    }
    return null;
}

var spkmodBgmSuppressSources = {
    jukebox: false,
    cinema: false
};

function spkmodSuppressGameBgm(mute, source = "cinema") {
    spkmodBgmSuppressSources[source] = !!mute;
    const shouldMute = !!(spkmodBgmSuppressSources.jukebox || spkmodBgmSuppressSources.cinema);
    suppressGameBgm(shouldMute);
}
window.spkmodSuppressGameBgm = spkmodSuppressGameBgm;

function suppressGameBgm(mute) {
    const state = window.__speakiMusicState;
    hookNativeSettingsVolume();
    const slider = findNativeBgmSlider();
    const nodes = findJukeboxBgmNodes();

    if (mute) {
        if (state.isBgmSuppressed) return;

        // 1. Determine and save user's actual volume
        let currentVol = null;
		if (typeof window.getGameSettings === "function") {
			try {
				const s = window.getGameSettings();
				if (s && typeof s.bgmVolume === "number" && Number.isFinite(s.bgmVolume)) {
					currentVol = Math.max(0, Math.min(100, s.bgmVolume));
				}
			} catch (_) {}
		}
		if (currentVol === null && slider && slider.value !== '') {
			const n = Number(slider.value);
			if (Number.isFinite(n)) currentVol = Math.max(0, Math.min(100, n));
		}
		if (currentVol === null) {
			try {
				const raw = localStorage.getItem('sr1_settings');
                if (raw) {
					const s = JSON.parse(raw);
					if (typeof s.bgmVolume === "number" && Number.isFinite(s.bgmVolume)) {
						currentVol = Math.max(0, Math.min(100, s.bgmVolume));
					}
				}
			} catch (_) {}
		}
		if (currentVol === null || currentVol <= 0) currentVol = getUserActualBgmVolume() ?? 70; // Native game default is 70
		if (currentVol <= 0) currentVol = 70;

        setUserActualBgmVolume(currentVol);
        state.isBgmSuppressed = true;
        try {
            if (window.localStorage) localStorage.setItem("spkmod-is-bgm-suppressed", "true");
        } catch (_) {}

        state.isSuppressingBgmInternal = true;
        try {
            if (slider) {
                slider.value = '0';
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (typeof window.updateGameSettings === "function") {
                try { window.updateGameSettings({ bgmVolume: 0 }); } catch (_) {}
            } else {
                try {
                    const raw = localStorage.getItem('sr1_settings');
                    if (raw) {
                        const s = JSON.parse(raw);
                        s.bgmVolume = 0;
                        localStorage.setItem('sr1_settings', JSON.stringify(s));
                    }
                } catch (_) {}
            }
        } finally {
            state.isSuppressingBgmInternal = false;
        }

        nodes.forEach(node => {
            if (node.gain?.gain) {
                if (node.__savedGain === undefined || node.__savedGain === 0) {
                    node.__savedGain = node.gain.gain.value > 0 ? node.gain.gain.value : (currentVol / 100);
                }
                node.gain.gain.value = 0;
            }
        });

        document.querySelectorAll("audio").forEach(el => {
            if (!el.id?.startsWith("spkmod-") && !el.closest("#spkmod-")) {
                if (el.__savedVolume === undefined) el.__savedVolume = el.volume;
                el.volume = 0;
            }
        });
    } else {
        state.isBgmSuppressed = false;
        try {
            if (window.localStorage) localStorage.setItem("spkmod-is-bgm-suppressed", "false");
        } catch (_) {}

        let restoreVol = getUserActualBgmVolume();
        if (restoreVol === null || !Number.isFinite(restoreVol) || restoreVol <= 0) {
            restoreVol = 70;
        }
        restoreVol = Math.max(0, Math.min(100, restoreVol));

        state.isSuppressingBgmInternal = true;
        try {
            if (slider) {
                slider.value = String(restoreVol);
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (typeof window.updateGameSettings === "function") {
                try { window.updateGameSettings({ bgmVolume: restoreVol }); } catch (_) {}
            } else {
                try {
                    const raw = localStorage.getItem('sr1_settings');
                    if (raw) {
                        const s = JSON.parse(raw);
                        s.bgmVolume = restoreVol;
                        localStorage.setItem('sr1_settings', JSON.stringify(s));
                    }
                } catch (_) {}
            }
        } finally {
            state.isSuppressingBgmInternal = false;
        }

        nodes.forEach(node => {
            if (node.gain?.gain) {
                node.gain.gain.value = (node.__savedGain !== undefined && node.__savedGain > 0)
                    ? node.__savedGain
                    : (restoreVol / 100);
            }
            if (node.isPlaying === false && typeof node.play === "function") {
                try { node.play(); } catch (_) {}
            }
        });

        document.querySelectorAll("audio").forEach(el => {
            if (!el.id?.startsWith("spkmod-") && !el.closest("#spkmod-")) {
                if (el.__savedVolume !== undefined) {
                    el.volume = el.__savedVolume;
                } else {
                    el.volume = restoreVol / 100;
                }
                if (el.paused && el.loop) {
                    try { el.play(); } catch (_) {}
                }
            }
        });
    }
}

function initYouTubeApi(cb) {
    if (window.YT && window.YT.Player) {
        cb();
        return;
    }
    const origReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
        if (typeof origReady === 'function') origReady();
        cb();
    };
    if (!document.getElementById('__yt_iframe_api_script')) {
        const tag = document.createElement('script');
        tag.id = '__yt_iframe_api_script';
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }
}

function createYtContainer() {
    let container = document.getElementById('spkmod-yt-iframe-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'spkmod-yt-iframe-container';
        container.style.cssText = 'position:fixed;bottom:-500px;left:-500px;width:240px;height:160px;opacity:0.01;pointer-events:none;z-index:-1000;';
        container.innerHTML = '<div id="spkmod-yt-player-target"></div>';
        document.body.appendChild(container);
    }
    return 'spkmod-yt-player-target';
}

function formatJukeboxTime(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function playTrackAtIndex(idx, userInitiated = true) {
    const state = window.__speakiMusicState;
    const tracks = getActiveJukeboxTracks();
    if (!tracks || tracks.length === 0) return;

    idx = (idx + tracks.length) % tracks.length;
    state.currentTrackIndex = idx;
    const item = tracks[idx];
    state.currentTrackTitle = item[1];
    state.currentTrackAuthor = item[2] || "";

    state.isChangingTrack = true;
    spkmodSuppressGameBgm(true, "jukebox");
    if (state.changeTrackTimeout) clearTimeout(state.changeTrackTimeout);
    state.changeTrackTimeout = setTimeout(() => {
        if (state.isChangingTrack && !state.isPlaying) {
            state.isChangingTrack = false;
            spkmodSuppressGameBgm(false, "jukebox");
        }
    }, 10000);

    updateJukeboxUI();

    if (state.player && state.isReady) {
        try {
            state.player.loadVideoById({
                videoId: item[0],
                startSeconds: 0
            });
        } catch (_) {}
    }
}

function playNext() {
    const state = window.__speakiMusicState;
    const tracks = getActiveJukeboxTracks();
    if (!tracks || tracks.length === 0) return;

    if (state.shuffle) {
        let randIdx = Math.floor(Math.random() * tracks.length);
        if (tracks.length > 1 && randIdx === state.currentTrackIndex) {
            randIdx = (randIdx + 1) % tracks.length;
        }
        playTrackAtIndex(randIdx);
    } else {
        playTrackAtIndex(state.currentTrackIndex + 1);
    }
}

function playPrev() {
    const state = window.__speakiMusicState;
    playTrackAtIndex(state.currentTrackIndex - 1);
}

function toggleMiniPlayer(forceMini) {
    const modal = lunHudElements.jukeboxModal;
    if (!modal) return;
    const state = window.__speakiMusicState;

    state.isMiniMode = (typeof forceMini === "boolean") ? forceMini : !state.isMiniMode;
    if (state.isMiniMode) {
        modal.classList.add("spkmod-mini-mode");
    } else {
        modal.classList.remove("spkmod-mini-mode");
    }
    if (window.localStorage) {
        localStorage.setItem("spkmod-jukebox-mini", state.isMiniMode ? "true" : "false");
    }
    hideJukeboxHint();
    hideJukeboxThumbPreview();
    updateJukeboxI18n();
}

function switchJukeboxPlaylist(key, autoPlay = false) {
    const state = window.__speakiMusicState;
    if (state.activePlaylistKey === key && !autoPlay) return;

    state.activePlaylistKey = key;
    state.currentTrackIndex = 0;
    if (window.localStorage) localStorage.setItem("spkmod-jukebox-playlist-key", key);

    const tracks = getActiveJukeboxTracks();
    const item = tracks[0] || ["", getJukeboxText(key === 'favorites' ? "jukeboxFavoritesEmpty" : "jukeboxNoTracks"), ""];
    state.currentTrackTitle = item[1];
    state.currentTrackAuthor = item[2] || "";

    if (key === 'favorites' && (!tracks || tracks.length === 0)) {
        if (state.changeTrackTimeout) clearTimeout(state.changeTrackTimeout);
        state.isChangingTrack = false;
        state.isPlaying = false;
        if (state.player && state.isReady) {
            try { state.player.stopVideo(); } catch (_) {}
        }
        spkmodSuppressGameBgm(false, "jukebox");
    } else if (autoPlay) {
        state.isChangingTrack = true;
        spkmodSuppressGameBgm(true, "jukebox");
    }

    const modal = lunHudElements.jukeboxModal;
    if (modal) {
        const tabOst = modal.querySelector('#spkmod-jukebox-tab-ost');
        const tabBolpop = modal.querySelector('#spkmod-jukebox-tab-bolpop');
        const tabFav = modal.querySelector('#spkmod-jukebox-tab-fav');
        const msgCard = modal.querySelector('#spkmod-jukebox-bolpop-msg');
        const favMsgCard = modal.querySelector('#spkmod-jukebox-fav-msg');

        if (tabOst) {
            tabOst.style.background = (key === 'ost') ? '#e8b84b' : '#3e3052';
            tabOst.style.color = (key === 'ost') ? '#1a1424' : '#ffc94a';
        }
        if (tabBolpop) {
            tabBolpop.style.background = (key === 'bolpop') ? '#e8b84b' : '#3e3052';
            tabBolpop.style.color = (key === 'bolpop') ? '#1a1424' : '#ffc94a';
        }
        if (tabFav) {
            tabFav.style.background = (key === 'favorites') ? '#e8b84b' : '#3e3052';
            tabFav.style.color = (key === 'favorites') ? '#1a1424' : '#ff4d6d';
        }
        if (msgCard) {
            msgCard.style.display = (key === 'bolpop') ? 'block' : 'none';
            msgCard.innerHTML = `💌 <i>${getJukeboxText("jukeboxBolpopMessage")}</i>`;
        }
        if (favMsgCard) {
            favMsgCard.style.display = (key === 'favorites' && tracks.length > 0) ? 'block' : 'none';
            favMsgCard.innerHTML = `❤️ <i>${getJukeboxText("jukeboxFavoritesMessage")}</i>`;
        }
        populateJukeboxDrawer(modal);
    }
    updateJukeboxUI();

    if (autoPlay && state.player && state.isReady && tracks.length > 0) {
        playTrackAtIndex(0);
    }
}

function buildJukeboxUI() {
    if (lunHudElements.jukeboxModal) return lunHudElements.jukeboxModal;

    const state = window.__speakiMusicState;

    // Restore saved dimensions & drawer state
    let savedW = 380;
    let savedH = 420;
    try {
        const rawSize = localStorage.getItem("spkmod-size-spkmod-jukebox-modal");
        if (rawSize) {
            const sz = JSON.parse(rawSize);
            if (sz.width) savedW = Math.max(340, Math.min(Math.round(window.innerWidth * 0.98), parseInt(sz.width, 10)));
            if (sz.height) savedH = Math.max(260, Math.min(Math.round(window.innerHeight * 0.95), parseInt(sz.height, 10)));
        }
    } catch (_) {}

    let isDrawerOpen = false;
    try {
        isDrawerOpen = localStorage.getItem("spkmod-jukebox-drawer-open") === "true";
    } catch (_) {}

    // Load persisted coordinates or default nicely without setting bottom/right
    let initLeft = Math.max(10, window.innerWidth - (savedW + 30));
    let initTop = Math.max(10, window.innerHeight - (isDrawerOpen ? savedH + 30 : 280));
    try {
        const raw = localStorage.getItem("spkmod-pos-spkmod-jukebox-modal");
        if (raw) {
            const p = JSON.parse(raw);
            const l = parseFloat(p.left);
            const t = parseFloat(p.top);
            if (!isNaN(l) && !isNaN(t)) {
                initLeft = Math.min(Math.max(10, l), window.innerWidth - 80);
                initTop = Math.min(Math.max(10, t), window.innerHeight - 80);
            }
        }
    } catch (_) {}

    const modal = buildElement("div", {
        id: "spkmod-jukebox-modal",
        className: "spkmod-music-modal" + (state.modalVisible ? "" : " hidden") + (state.isMiniMode ? " spkmod-mini-mode" : ""),
        style: `position: fixed; left: ${initLeft}px; top: ${initTop}px; bottom: auto !important; right: auto !important; width: ${savedW}px; height: ${isDrawerOpen ? savedH + 'px' : 'auto'}; max-width: 98vw; max-height: 95vh; background: linear-gradient(180deg, #2a2038 0%, #1a1424 100%); border: 2px solid var(--spkmod-accent, #e8b84b); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15); font-family: Pretendard, system-ui, -apple-system, sans-serif; color: #fff; z-index: 2147483600 !important; padding: 14px 16px; box-sizing: border-box; user-select: none; display: flex; flex-direction: column; gap: 10px; overflow: hidden;`
    });

    const activeTracks = getActiveJukeboxTracks();
    const curVid = activeTracks[state.currentTrackIndex]?.[0] || '8kKIzim7ZqU';

    modal.innerHTML = `
        <div id="spkmod-jukebox-header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid rgba(232,184,75,0.3);padding-bottom:8px;">
            <div id="spkmod-jukebox-header-title" style="display:flex;align-items:center;gap:6px;font-weight:700;font-size:13px;color:#ffc94a;">
                <span style="font-size:15px;">🎵</span> ${getJukeboxText("jukeboxTitle")}
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
                <button id="spkmod-jukebox-tab-ost" title="Trickcal ${getJukeboxText('jukeboxPlaylistOst')}" style="background:${state.activePlaylistKey === 'ost' ? '#e8b84b' : '#3e3052'};color:${state.activePlaylistKey === 'ost' ? '#1a1424' : '#ffc94a'};border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:2px 6px;font-size:11px;font-weight:700;">💿 ${getJukeboxText('jukeboxPlaylistOst')}</button>
                <button id="spkmod-jukebox-tab-bolpop" title="${getJukeboxText('jukeboxPlaylistBolpop')}" style="background:${state.activePlaylistKey === 'bolpop' ? '#e8b84b' : '#3e3052'};color:${state.activePlaylistKey === 'bolpop' ? '#1a1424' : '#ffc94a'};border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:2px 6px;font-size:11px;font-weight:700;">🎬 ${getJukeboxText('jukeboxBolpopTab')}</button>
                <button id="spkmod-jukebox-tab-fav" title="${getJukeboxText('jukeboxPlaylistFavorites')}" style="background:${state.activePlaylistKey === 'favorites' ? '#e8b84b' : '#3e3052'};color:${state.activePlaylistKey === 'favorites' ? '#1a1424' : '#ff4d6d'};border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:2px 7px;font-size:11px;font-weight:700;">❤️</button>
                <button id="spkmod-jukebox-drawer-btn" title="${getJukeboxText('jukeboxTogglePlaylist')}" style="background:#3e3052;border:1px solid #7c6894;color:#ffc94a;border-radius:6px;cursor:pointer;padding:2px 6px;font-size:11px;">📜</button>
                <button id="spkmod-jukebox-close-btn" title="${getJukeboxText('jukeboxClose')}" style="background:transparent;border:none;color:#aaa;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;">✕</button>
            </div>
        </div>

        <div id="spkmod-jukebox-track-info" style="display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.32);padding:10px 12px;border-radius:12px;overflow:hidden;cursor:move;flex-shrink:0;min-height:62px;box-sizing:border-box;">
            <button class="spkmod-mini-expand-btn" id="spkmod-jukebox-mini-expand" title="${getJukeboxText('jukeboxMiniPlayerExpand')}" style="background:#e8b84b;border:none;color:#1a1424;border-radius:6px;width:24px;height:24px;cursor:pointer;font-size:12px;display:none;align-items:center;justify-content:center;flex-shrink:0;">⛶</button>
            <img id="spkmod-jukebox-thumb" src="https://img.youtube.com/vi/${curVid}/mqdefault.jpg" style="width:52px;height:52px;border-radius:8px;object-fit:cover;border:1px solid rgba(232,184,75,0.4);flex-shrink:0;background:#1a1424;cursor:zoom-in;pointer-events:auto;">
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;justify-content:center;">
                <div id="spkmod-jukebox-title" style="font-size:13.5px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;">
                    ${state.currentTrackTitle}
                </div>
                <div id="spkmod-jukebox-author" style="font-size:11.5px;color:#e8b84b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:${state.currentTrackAuthor ? 'block' : 'none'};line-height:1.2;">
                    ${state.currentTrackAuthor}
                </div>
            </div>
            <button id="spkmod-jukebox-heart-btn" title="${isJukeboxTrackFavorite(curVid) ? getJukeboxText('jukeboxRemoveFavorite') : getJukeboxText('jukeboxAddFavorite')}" style="background:transparent;border:none;cursor:pointer;font-size:18px;line-height:1;padding:6px;display:flex;align-items:center;justify-content:center;transition:transform 0.15s;flex-shrink:0;">${isJukeboxTrackFavorite(curVid) ? '❤️' : '🤍'}</button>
        </div>

        <div id="spkmod-jukebox-seek-row" style="display:flex;flex-direction:column;gap:4px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <span id="spkmod-jukebox-time-cur" style="font-size:11px;color:#aaa;min-width:34px;">00:00</span>
                <input id="spkmod-jukebox-seek" type="range" min="0" max="100" value="0" style="flex:1;height:5px;accent-color:#e8b84b;cursor:pointer;">
                <span id="spkmod-jukebox-time-dur" style="font-size:11px;color:#aaa;min-width:34px;text-align:right;">00:00</span>
            </div>
        </div>

        <div id="spkmod-jukebox-controls-row" style="display:flex;align-items:center;justify-content:space-between;padding:2px 4px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <button id="spkmod-jukebox-shuffle" title="${getJukeboxText('jukeboxShuffle')}" style="background:${state.shuffle ? '#e8b84b' : '#3b2d4f'};border:1px solid #5a4675;color:${state.shuffle ? '#1a1424' : '#bbb'};border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;">🔀</button>
                <button id="spkmod-jukebox-prev" title="${getJukeboxText('jukeboxPrev')}" style="background:#3b2d4f;border:1px solid #5a4675;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">⏮</button>
                <button id="spkmod-jukebox-play" title="${state.isPlaying ? getJukeboxText('jukeboxPause') : getJukeboxText('jukeboxPlay')}" style="background:#e8b84b;border:none;color:#1a1424;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:17px;font-weight:bold;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(232,184,75,0.4);">▶</button>
                <button id="spkmod-jukebox-next" title="${getJukeboxText('jukeboxNext')}" style="background:#3b2d4f;border:1px solid #5a4675;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">⏭</button>
                <button id="spkmod-jukebox-repeat" title="${getJukeboxText('jukeboxRepeat')}" style="background:${state.repeatMode !== 'off' ? '#e8b84b' : '#3b2d4f'};border:1px solid #5a4675;color:${state.repeatMode !== 'off' ? '#1a1424' : '#bbb'};border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;">${state.repeatMode === 'one' ? '🔂' : '🔁'}</button>
            </div>
            <div id="spkmod-jukebox-vol-box" style="display:flex;align-items:center;gap:6px;background:rgba(0,0,0,0.25);padding:4px 8px;border-radius:12px;">
                <span id="spkmod-jukebox-vol-icon" style="font-size:13px;">🔊</span>
                <input id="spkmod-jukebox-vol" type="range" min="0" max="100" value="${state.volume}" style="width:65px;height:4px;accent-color:#e8b84b;cursor:pointer;">
            </div>
        </div>

        <div id="spkmod-jukebox-drawer" style="display:${isDrawerOpen ? 'block' : 'none'};flex:1 1 auto;min-height:100px;overflow-y:auto;background:rgba(0,0,0,0.35);border:1px solid #4a3861;border-radius:8px;padding:6px;font-size:12px;margin-top:4px;">
            <div id="spkmod-jukebox-bolpop-msg" style="background:rgba(232,184,75,0.12);border:1px solid rgba(232,184,75,0.35);border-radius:8px;padding:8px 10px;margin-bottom:8px;font-size:11px;color:#ffdf79;line-height:1.45;display:${state.activePlaylistKey === 'bolpop' ? 'block' : 'none'};">
                💌 <i>${getJukeboxText("jukeboxBolpopMessage")}</i>
            </div>
            <div id="spkmod-jukebox-fav-msg" style="background:rgba(255,77,109,0.12);border:1px solid rgba(255,77,109,0.35);border-radius:8px;padding:8px 10px;margin-bottom:8px;font-size:11px;color:#ff9ebb;line-height:1.45;display:${(state.activePlaylistKey === 'favorites' && activeTracks.length > 0) ? 'block' : 'none'};">
                ❤️ <i>${getJukeboxText("jukeboxFavoritesMessage")}</i>
            </div>
            <div id="spkmod-jukebox-items" style="display:flex;flex-direction:column;gap:3px;"></div>
        </div>
    `;
    document.body.appendChild(modal);
    lunHudElements.jukeboxModal = modal;

    const header = modal.querySelector('#spkmod-jukebox-header');
    const trackInfo = modal.querySelector('#spkmod-jukebox-track-info');
    if (typeof makeDraggable === 'function') {
        makeDraggable(modal, [header, trackInfo]);
    }

    // Corner resize handle
    const resizeHandle = buildElement("div", {
        id: "spkmod-jukebox-resize-handle",
        title: getJukeboxText("jukeboxResizeTooltip") || "Drag corner to resize window",
        style: "position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; cursor: nwse-resize; user-select: none; z-index: 100; display: flex; align-items: flex-end; justify-content: flex-end; padding: 0 2px 2px 0; touch-action: none;"
    }, [
        buildElement("span", {
            innerHTML: `<svg viewBox="0 0 10 10" width="10" height="10" style="opacity: 0.65; display: block; pointer-events: none;"><path d="M9 1 L1 9 M9 5 L5 9 M9 9 L9 9" stroke="#e8b84b" stroke-width="1.2" stroke-linecap="round"/></svg>`
        })
    ]);
    modal.appendChild(resizeHandle);

    if (typeof makeResizable === 'function') {
        makeResizable(modal, resizeHandle, {
            minWidth: 340,
            minHeight: 260,
            restoreSize: false,
            onResize: (newW, newH) => {
                savedW = newW;
                if (drawer.style.display === 'none' && newH > 220) {
                    drawer.style.display = 'block';
                    if (window.localStorage) localStorage.setItem("spkmod-jukebox-drawer-open", "true");
                }
                if (drawer.style.display !== 'none') {
                    savedH = newH;
                }
            },
            saveSize: (finalW, finalH, key) => {
                savedW = finalW;
                if (drawer.style.display !== 'none') {
                    savedH = finalH;
                    if (window.localStorage) {
                        localStorage.setItem(key, JSON.stringify({ width: finalW, height: finalH }));
                    }
                } else {
                    if (window.localStorage) {
                        localStorage.setItem(key, JSON.stringify({ width: finalW, height: savedH }));
                    }
                }
            }
        });
    }

    // Double right-click toggle mini player (single right-click shows hint)
    let lastRightClickTime = 0;
    modal.addEventListener('contextmenu', (e) => {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        const now = Date.now();
        if (now - lastRightClickTime < 450) {
            lastRightClickTime = 0;
            hideJukeboxHint();
            toggleMiniPlayer();
        } else {
            lastRightClickTime = now;
            const hint = state.isMiniMode ? getJukeboxText("jukeboxMiniPlayerExpandHint") : getJukeboxText("jukeboxMiniPlayerHint");
            showJukeboxHint(hint, e.clientX, e.clientY);
        }
    });

    modal.addEventListener("mouseleave", () => {
        hideJukeboxThumbPreview();
    });

    modal.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener("keydown", (e) => { e.stopPropagation(); });

    // Buttons
    const btnPlay = modal.querySelector('#spkmod-jukebox-play');
    const btnPrev = modal.querySelector('#spkmod-jukebox-prev');
    const btnNext = modal.querySelector('#spkmod-jukebox-next');
    const btnShuffle = modal.querySelector('#spkmod-jukebox-shuffle');
    const btnRepeat = modal.querySelector('#spkmod-jukebox-repeat');
    const seekBar = modal.querySelector('#spkmod-jukebox-seek');
    const volSlider = modal.querySelector('#spkmod-jukebox-vol');
    const drawerBtn = modal.querySelector('#spkmod-jukebox-drawer-btn');
    const closeBtn = modal.querySelector('#spkmod-jukebox-close-btn');
    const drawer = modal.querySelector('#spkmod-jukebox-drawer');
    const tabOst = modal.querySelector('#spkmod-jukebox-tab-ost');
    const tabBolpop = modal.querySelector('#spkmod-jukebox-tab-bolpop');
    const tabFav = modal.querySelector('#spkmod-jukebox-tab-fav');
    const miniExpandBtn = modal.querySelector('#spkmod-jukebox-mini-expand');
    const nowPlayingHeartBtn = modal.querySelector('#spkmod-jukebox-heart-btn');

    btnPlay.addEventListener('click', () => {
        if (!state.player || !state.isReady) return;
        if (state.isPlaying) {
            state.isChangingTrack = false;
            if (state.changeTrackTimeout) clearTimeout(state.changeTrackTimeout);
            state.isPlaying = false;
            state.player.pauseVideo();
            spkmodSuppressGameBgm(false, "jukebox");
		} else {
			state.isChangingTrack = false;
			const tracks = getActiveJukeboxTracks();
			const wantVid = tracks[state.currentTrackIndex]?.[0];
			let loadedVid = null;
			try { loadedVid = state.player.getVideoData()?.video_id; } catch (_) {}
			if (wantVid && loadedVid !== wantVid) {
				playTrackAtIndex(state.currentTrackIndex);
			} else {
				spkmodSuppressGameBgm(true, "jukebox");
				state.player.playVideo();
			}
		}
    });

    btnPrev.addEventListener('click', () => {
        playPrev();
    });

    btnNext.addEventListener('click', () => {
        playNext();
    });

    btnShuffle.addEventListener('click', () => {
        state.shuffle = !state.shuffle;
        btnShuffle.style.background = state.shuffle ? '#e8b84b' : '#3b2d4f';
        btnShuffle.style.color = state.shuffle ? '#1a1424' : '#bbb';
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-shuffle", state.shuffle ? "true" : "false");
    });

    btnRepeat.addEventListener('click', () => {
        if (state.repeatMode === 'all') state.repeatMode = 'one';
        else if (state.repeatMode === 'one') state.repeatMode = 'off';
        else state.repeatMode = 'all';

        btnRepeat.textContent = (state.repeatMode === 'one' ? '🔂' : '🔁');
        btnRepeat.style.background = (state.repeatMode !== 'off' ? '#e8b84b' : '#3b2d4f');
        btnRepeat.style.color = (state.repeatMode !== 'off' ? '#1a1424' : '#bbb');
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-repeat", state.repeatMode);
    });

    seekBar.addEventListener('input', () => {
        if (!state.player || !state.duration) return;
        state.player.seekTo((seekBar.value / 100) * state.duration, true);
    });

    volSlider.addEventListener('input', () => {
        state.volume = Number(volSlider.value);
        if (state.player && state.isReady) state.player.setVolume(state.volume);
        modal.querySelector('#spkmod-jukebox-vol-icon').textContent = state.volume === 0 ? '🔇' : (state.volume < 50 ? '🔉' : '🔊');
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-vol", String(state.volume));
    });

    drawerBtn.addEventListener('click', () => {
        const isCurrentlyOpen = drawer.style.display !== 'none';
        if (isCurrentlyOpen) {
            drawer.style.display = 'none';
            modal.style.height = 'auto';
            if (window.localStorage) localStorage.setItem("spkmod-jukebox-drawer-open", "false");
        } else {
            drawer.style.display = 'block';
            modal.style.height = savedH + 'px';
            if (window.localStorage) localStorage.setItem("spkmod-jukebox-drawer-open", "true");
        }
    });

    closeBtn.addEventListener('click', () => {
        hideJukeboxHint();
        hideJukeboxThumbPreview();
        modal.classList.add('hidden');
        state.modalVisible = false;
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-visible", "false");

        const isMobile = (typeof spkmodIsMobile === "function" ? spkmodIsMobile() : false) ||
            (typeof window.speakiMobile !== "undefined") ||
            (typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent));

        if (isMobile) {
            if (state.player && typeof state.player.pauseVideo === 'function') {
                try { state.player.pauseVideo(); } catch (_) {}
            }
            state.isPlaying = false;
            state.isChangingTrack = false;
            spkmodSuppressGameBgm(false, "jukebox");
            updateJukeboxUI();
        } else if (!state.isPlaying) {
            spkmodSuppressGameBgm(false, "jukebox");
        }
    });

    const thumbImg = modal.querySelector('#spkmod-jukebox-thumb');
    if (thumbImg) {
        thumbImg.addEventListener('mouseenter', () => {
            showJukeboxThumbPreview(thumbImg);
        });
        thumbImg.addEventListener('mouseleave', () => {
            hideJukeboxThumbPreview();
        });
    }

    if (tabOst) {
        tabOst.addEventListener('click', () => {
            switchJukeboxPlaylist('ost', state.isPlaying);
        });
    }

    if (tabBolpop) {
        tabBolpop.addEventListener('click', () => {
            switchJukeboxPlaylist('bolpop', state.isPlaying);
        });
    }

    if (tabFav) {
        tabFav.addEventListener('click', () => {
            switchJukeboxPlaylist('favorites', state.isPlaying);
        });
    }

    if (nowPlayingHeartBtn) {
        nowPlayingHeartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tracks = getActiveJukeboxTracks();
            const cur = tracks[state.currentTrackIndex] || findJukeboxTrackByVid(state.player?.getVideoData()?.video_id) || [state.player?.getVideoData()?.video_id, state.currentTrackTitle, state.currentTrackAuthor];
            if (!cur[0]) return;
            const isNowFav = toggleJukeboxFavorite(cur);
            nowPlayingHeartBtn.textContent = isNowFav ? '❤️' : '🤍';
            nowPlayingHeartBtn.title = isNowFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");

            if (state.activePlaylistKey === 'favorites') {
                const updatedTracks = getActiveJukeboxTracks();
                if (state.currentTrackIndex >= updatedTracks.length) {
                    state.currentTrackIndex = Math.max(0, updatedTracks.length - 1);
                }
                const scroll = drawer ? drawer.scrollTop : 0;
                populateJukeboxDrawer(modal);
                if (drawer) drawer.scrollTop = scroll;
                updateJukeboxUI();
            } else {
                const rows = modal.querySelectorAll('.spkmod-pl-item');
                const row = rows[state.currentTrackIndex];
                if (row) {
                    const rowHeart = row.querySelector('.spkmod-jb-row-heart');
                    if (rowHeart) {
                        rowHeart.textContent = isNowFav ? '❤️' : '🤍';
                        rowHeart.title = isNowFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");
                    }
                }
            }
        });
        nowPlayingHeartBtn.addEventListener('mouseenter', () => { nowPlayingHeartBtn.style.transform = 'scale(1.25)'; });
        nowPlayingHeartBtn.addEventListener('mouseleave', () => { nowPlayingHeartBtn.style.transform = 'scale(1)'; });
    }

    if (miniExpandBtn) {
        miniExpandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideJukeboxHint();
            hideJukeboxThumbPreview();
            toggleMiniPlayer(false);
        });
    }

    populateJukeboxDrawer(modal);
    updateJukeboxI18n();
    return modal;
}

function populateJukeboxDrawer(modal) {
    modal = modal || lunHudElements.jukeboxModal;
    if (!modal) return;
    const listContainer = modal.querySelector('#spkmod-jukebox-items');
    if (!listContainer) return;
    const drawer = modal.querySelector('#spkmod-jukebox-drawer');
    const nowPlayingHeartBtn = modal.querySelector('#spkmod-jukebox-heart-btn');
    listContainer.innerHTML = '';

    const state = window.__speakiMusicState;
    const tracks = getActiveJukeboxTracks();

    if (state.activePlaylistKey === 'favorites' && (!tracks || tracks.length === 0)) {
        const emptyDiv = document.createElement('div');
        emptyDiv.id = 'spkmod-jukebox-fav-empty';
        emptyDiv.style.cssText = 'padding:16px 12px;text-align:center;color:#bcaecf;font-size:11.5px;line-height:1.5;';
        emptyDiv.innerHTML = `🤍 <i>${getJukeboxText("jukeboxFavoritesEmpty")}</i>`;
        listContainer.appendChild(emptyDiv);
        return;
    }

    tracks.forEach(([vid, title, author], idx) => {
        const row = document.createElement('div');
        row.className = 'spkmod-pl-item';
        row.style.cssText = 'padding:5px 8px;border-radius:5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:background 0.15s;display:flex;align-items:center;justify-content:space-between;gap:6px;';

        const titleSpan = document.createElement('span');
        titleSpan.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;';
        titleSpan.textContent = `${idx + 1}. ${title}`;
        row.appendChild(titleSpan);

        if (author) {
            const authorSpan = document.createElement('span');
            authorSpan.style.cssText = 'font-size:10px;color:#ffc94a;opacity:0.9;white-space:nowrap;margin-right:2px;max-width:110px;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;';
            authorSpan.textContent = author;
            row.appendChild(authorSpan);
        }

        const isFav = isJukeboxTrackFavorite(vid);
        const rowHeartBtn = document.createElement('button');
        rowHeartBtn.className = 'spkmod-jb-row-heart';
        rowHeartBtn.style.cssText = 'background:transparent;border:none;cursor:pointer;font-size:13px;padding:1px 4px;line-height:1;display:inline-flex;align-items:center;justify-content:center;transition:transform 0.15s;flex-shrink:0;';
        rowHeartBtn.textContent = isFav ? '❤️' : '🤍';
        rowHeartBtn.title = isFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");

        rowHeartBtn.addEventListener('mouseenter', () => { rowHeartBtn.style.transform = 'scale(1.25)'; });
        rowHeartBtn.addEventListener('mouseleave', () => { rowHeartBtn.style.transform = 'scale(1)'; });
        rowHeartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isNowFav = toggleJukeboxFavorite([vid, title, author]);
            rowHeartBtn.textContent = isNowFav ? '❤️' : '🤍';
            rowHeartBtn.title = isNowFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");

            // Sync now-playing heart if this track is currently active
            const curTracks = getActiveJukeboxTracks();
            if (curTracks[state.currentTrackIndex]?.[0] === vid && nowPlayingHeartBtn) {
                nowPlayingHeartBtn.textContent = isNowFav ? '❤️' : '🤍';
                nowPlayingHeartBtn.title = isNowFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");
            }

            if (state.activePlaylistKey === 'favorites') {
                const updatedTracks = getActiveJukeboxTracks();
                if (state.currentTrackIndex >= updatedTracks.length) {
                    state.currentTrackIndex = Math.max(0, updatedTracks.length - 1);
                }
                const scroll = drawer ? drawer.scrollTop : 0;
                populateJukeboxDrawer(modal);
                if (drawer) drawer.scrollTop = scroll;
                updateJukeboxUI();
            }
        });
        row.appendChild(rowHeartBtn);

        row.title = title + (author ? ' - ' + author : '');
        row.addEventListener('click', () => {
            playTrackAtIndex(idx);
        });
        listContainer.appendChild(row);
    });
}

function updateJukeboxUI() {
    const modal = lunHudElements.jukeboxModal;
    if (!modal) return;
    const state = window.__speakiMusicState;
    const tracks = getActiveJukeboxTracks();
    const curVid = tracks[state.currentTrackIndex]?.[0] || '';

    const btnPlay = modal.querySelector('#spkmod-jukebox-play');
    const titleEl = modal.querySelector('#spkmod-jukebox-title');
    const authorEl = modal.querySelector('#spkmod-jukebox-author');
    const thumbImg = modal.querySelector('#spkmod-jukebox-thumb');
    const timeCur = modal.querySelector('#spkmod-jukebox-time-cur');
    const timeDur = modal.querySelector('#spkmod-jukebox-time-dur');
    const seekBar = modal.querySelector('#spkmod-jukebox-seek');
    const heartBtn = modal.querySelector('#spkmod-jukebox-heart-btn');

    if (btnPlay) {
        btnPlay.textContent = state.isPlaying ? '⏸' : '▶';
        btnPlay.title = state.isPlaying ? getJukeboxText("jukeboxPause") : getJukeboxText("jukeboxPlay");
    }
    if (titleEl && state.currentTrackTitle) titleEl.textContent = state.currentTrackTitle;
    if (authorEl) {
        authorEl.textContent = state.currentTrackAuthor || '';
        authorEl.style.display = state.currentTrackAuthor ? 'block' : 'none';
    }
    if (heartBtn && curVid) {
        const isFav = isJukeboxTrackFavorite(curVid);
        heartBtn.textContent = isFav ? '❤️' : '🤍';
        heartBtn.title = isFav ? getJukeboxText("jukeboxRemoveFavorite") : getJukeboxText("jukeboxAddFavorite");
    }

    const favMsg = modal.querySelector('#spkmod-jukebox-fav-msg');
    if (favMsg) {
        favMsg.style.display = (state.activePlaylistKey === 'favorites' && tracks.length > 0) ? 'block' : 'none';
    }
    if (thumbImg && curVid) {
        const targetSrc = `https://img.youtube.com/vi/${curVid}/mqdefault.jpg`;
        if (thumbImg.src !== targetSrc) {
            thumbImg.src = targetSrc;
            if (lunJukeboxThumbPreview && lunJukeboxThumbPreview.style.display === "block") {
                showJukeboxThumbPreview(thumbImg);
            }
        }
    }
    if (timeCur) timeCur.textContent = formatJukeboxTime(state.currentTime);
    if (timeDur) timeDur.textContent = formatJukeboxTime(state.duration);
    if (seekBar && state.duration > 0 && !seekBar.matches(':active')) {
        seekBar.value = Math.min(100, Math.floor((state.currentTime / state.duration) * 100));
    }

    const drawerItems = modal.querySelectorAll('.spkmod-pl-item');
    drawerItems.forEach((el, idx) => {
        if (idx === state.currentTrackIndex) {
            el.style.background = '#e8b84b';
            el.style.color = '#1a1424';
            el.style.fontWeight = 'bold';
        } else {
            el.style.background = 'transparent';
            el.style.color = '#ddd';
            el.style.fontWeight = 'normal';
        }
    });
}

function initJukeboxPlayer() {
    const targetId = createYtContainer();
    buildJukeboxUI();
    const state = window.__speakiMusicState;
    const initialTracks = getActiveJukeboxTracks();
    const firstVid = initialTracks[state.currentTrackIndex]?.[0] || '8kKIzim7ZqU';

    initYouTubeApi(() => {
        state.player = new YT.Player(targetId, {
            height: '160',
            width: '240',
            videoId: firstVid,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                enablejsapi: 1,
                origin: window.location.origin
            },
            events: {
                onReady: () => {
                    state.isReady = true;
                    state.player.setVolume(state.volume);
                },
                onError: (e) => {
                    console.warn("[SpeakiMod+] Jukebox player error:", e.data);
                    state.isChangingTrack = false;
                    if (state.changeTrackTimeout) {
                        clearTimeout(state.changeTrackTimeout);
                        state.changeTrackTimeout = null;
                    }
                    if (state.isPlaying) {
                        playNext();
                    } else {
                        spkmodSuppressGameBgm(false, "jukebox");
                    }
                },
                onStateChange: (e) => {
                    if (e.data === 1) { // Playing
                        state.isChangingTrack = false;
                        if (state.changeTrackTimeout) {
                            clearTimeout(state.changeTrackTimeout);
                            state.changeTrackTimeout = null;
                        }
                        state.isPlaying = true;
                        spkmodSuppressGameBgm(true, "jukebox");

                        const curVid = state.player.getVideoData()?.video_id;
                        const tracks = getActiveJukeboxTracks();
                        const foundIdx = curVid ? tracks.findIndex(t => t[0] === curVid) : -1;
                        if (foundIdx !== -1) {
                            state.currentTrackIndex = foundIdx;
                            state.currentTrackTitle = tracks[foundIdx][1];
                            state.currentTrackAuthor = tracks[foundIdx][2] || '';
                        } else {
                            const data = state.player.getVideoData();
                            state.currentTrackTitle = cleanJukeboxTitle(data?.title || 'Trickcal BGM');
                            state.currentTrackAuthor = (state.activePlaylistKey === 'ost') ? '' : (data?.author || '');
                        }
                        state.duration = state.player.getDuration() || 0;

                        if (!state.updateInterval) {
                            state.updateInterval = setInterval(() => {
                                if (state.player && state.isPlaying) {
                                    state.currentTime = state.player.getCurrentTime() || 0;
                                    state.duration = state.player.getDuration() || state.duration;
                                    updateJukeboxUI();
                                }
                            }, 300);
                        }
                    } else if (e.data === 2) { // Paused
                        if (state.isChangingTrack) {
                            return;
                        }
                        state.isPlaying = false;
                        spkmodSuppressGameBgm(false, "jukebox");
                        if (state.updateInterval) {
                            clearInterval(state.updateInterval);
                            state.updateInterval = null;
                        }
                    } else if (e.data === 3 || e.data === -1) { // Buffering or Unstarted
                        if (state.isChangingTrack || state.isPlaying) {
                            spkmodSuppressGameBgm(true, "jukebox");
                        }
                    } else if (e.data === 0) { // Track Ended
                        if (state.repeatMode === 'one') {
                            state.player.seekTo(0, true);
                            state.player.playVideo();
                        } else if (state.shuffle) {
                            playNext();
                        } else if (state.repeatMode === 'all') {
                            playNext();
                        } else if (state.repeatMode === 'off' && state.currentTrackIndex < getActiveJukeboxTracks().length - 1) {
                            playNext();
                        } else {
                            state.isChangingTrack = false;
                            if (state.changeTrackTimeout) {
                                clearTimeout(state.changeTrackTimeout);
                                state.changeTrackTimeout = null;
                            }
                            state.isPlaying = false;
                            spkmodSuppressGameBgm(false, "jukebox");
                        }
                    }
                    updateJukeboxUI();
                }
            }
        });
    });
}

function toggleMusicPlayer(forceState) {
    if (!lunHudElements.jukeboxModal) {
        initJukeboxPlayer();
    }
    const modal = lunHudElements.jukeboxModal;
    if (!modal) return;
    const state = window.__speakiMusicState;

    const isHidden = modal.classList.contains("hidden");
    const targetShow = (typeof forceState === "boolean") ? forceState : isHidden;

    if (targetShow) {
        modal.classList.remove("hidden");
        state.modalVisible = true;
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-visible", "true");
    } else {
        modal.classList.add("hidden");
        state.modalVisible = false;
        if (window.localStorage) localStorage.setItem("spkmod-jukebox-visible", "false");

        const isMobile = (typeof spkmodIsMobile === "function" ? spkmodIsMobile() : false) ||
            (typeof window.speakiMobile !== "undefined") ||
            (typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent));

        if (isMobile) {
            if (state.player && typeof state.player.pauseVideo === 'function') {
                try { state.player.pauseVideo(); } catch (_) {}
            }
            state.isPlaying = false;
            state.isChangingTrack = false;
            spkmodSuppressGameBgm(false, "jukebox");
            updateJukeboxUI();
        } else if (!state.isPlaying) {
            spkmodSuppressGameBgm(false, "jukebox");
        }
    }
}
window.toggleMusicPlayer = toggleMusicPlayer;

// Auto-restore modal if user left it open on previous session
setTimeout(() => {
    try {
        const wasOpen = localStorage.getItem("spkmod-jukebox-visible") === "true";
        if (wasOpen) {
            toggleMusicPlayer(true);
        }
    } catch (_) {}
}, 1500);





