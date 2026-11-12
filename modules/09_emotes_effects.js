const lunJumpAnimMs = 500;

const lunFaintAnimMs = 1200;
function autoFaintLoop() {
	if (!window.AutoFaintActive) {
		window.__autoFaintPhase = false;
		return;
	}
	if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
		window.__autoFaintPhase = !window.__autoFaintPhase;
		gameState.sendEmoteNow(window.__autoFaintPhase ? (typeof Emotes !== "undefined" ? Emotes.MinigameJoayo || 3 : 3) : 15);
	}
	window.__autoFaintTimeoutId = setTimeout(autoFaintLoop, lunFaintAnimMs);
}

function spkmodPerformJump() {
	if (typeof gameState !== "undefined" && gameState) {
		if (typeof gameState.tryJump === "function") {
			gameState.tryJump();
		} else if (typeof gameState.sendEmoteNow === "function") {
			gameState.sendEmoteNow(Emotes.Jump);
		}
	}
}

function autoJumpLoop() {
	if (!window.AutoJumpActive) return;
	
	let nextDelay = lunJumpAnimMs;
	
	if (typeof gameState !== "undefined" && gameState?.isLocalOnTrampoline && gameState.isLocalOnTrampoline()) {
		const rhythm = gameState.trampolineRhythm;
		const nowSec = performance.now() / 1000;
		if (rhythm) {
			if (!rhythm.airborne) {
				spkmodPerformJump();
				if (rhythm.airborne && rhythm.landAtSec > nowSec) {
					nextDelay = Math.max(30, Math.floor((rhythm.landAtSec - nowSec) * 1000) - 60);
				} else {
					nextDelay = 100;
				}
			} else {
				const timeToLand = (rhythm.landAtSec - nowSec) * 1000;
				if (timeToLand <= 150) {
					spkmodPerformJump();
					nextDelay = 250;
				} else {
					nextDelay = Math.max(30, Math.floor(timeToLand - 60));
				}
			}
		} else {
			spkmodPerformJump();
		}
	} else {
		spkmodPerformJump();
	}
	
	window.__autoJumpTimeoutId = setTimeout(autoJumpLoop, nextDelay);
}

const lunHeartsAnimMs = 1100; // Debounce window is 1100ms; 1100ms pushes the limit of no dropped packets on server/clients

function triggerHearts() {
	if (gameState && gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === "function") {
		if (gameState.playerContainer) {
			gameState.bloomEffects.spawnHearts(gameState.playerContainer);
		}
		if (lunFollowTargetName && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && (t.info.name === lunFollowTargetName || t.info.__spkmodOrigName === lunFollowTargetName));
			if (tp && tp.container && tp.container !== gameState.playerContainer) {
				gameState.bloomEffects.spawnHearts(tp.container);
			}
		}
	}
	if (gameState && typeof gameState.sendEmoteNow === "function") {
		// If Pet Dance is active, don't interrupt the dance emote with StrokeBloom!
		if (!window.PetDanceActive) {
			gameState.sendEmoteNow(Emotes.StrokeBloom);
		}
	}
}

function autoHeartsLoop() {
	if (!window.AutoHeartsActive) return;
	triggerHearts();
	window.__autoHeartsTimeoutId = setTimeout(autoHeartsLoop, lunHeartsAnimMs);
}

window.AutoChowayoActive = false;
window.__autoChowayoTimeoutId = null;
const lunChowayoAnimMs = 2800; // tuned for sync

function autoChowayoLoop() {
	if (!window.AutoChowayoActive) return;
	if (gameState && typeof gameState.sendEmoteNow === "function") {
		gameState.sendEmoteNow(Emotes.MinigameJoayo);
	}
	window.__autoChowayoTimeoutId = setTimeout(autoChowayoLoop, lunChowayoAnimMs);
}

window.PetDanceActive = false;
let petDanceInterval = null;
let petDanceTick = 0;

function petDanceLoop() {
	if (!window.PetDanceActive) return;
	
	petDanceTick++;
	
	if (petDanceTick % 7 === 0) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeBloom);
		}
	}
	
	if (petDanceTick % 90 === 0) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.Dance);
		}
	}
}

function togglePetDance(btn) {
	window.PetDanceActive = !window.PetDanceActive;
	if (window.PetDanceActive) {
		petDanceTick = 0;
		if (petDanceInterval) clearInterval(petDanceInterval);
		petDanceInterval = setInterval(petDanceLoop, 100);
		
		if (!window.AutoHeartsActive) {
			window.AutoHeartsActive = true;
			chatLog(t("autoHeartsActivatedMsg") || "Auto Hearts activated!");
			if (typeof autoHeartsLoop === "function") autoHeartsLoop();
			const heartsBtn = typeof lunPanelElements !== "undefined" ? lunPanelElements.autoHeartsBtn : null;
			if (heartsBtn) setText(heartsBtn, t("autoHeartsOn") || "Auto Hearts: ON");
		}
		
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.Dance);
		}
		
		chatLog(t("petDanceActivatedMsg") || "Pet Dance combo activated!");
		chatLog(t("petDanceReminderMsg") || "Note: The petting combo is only fully visible to other players!");
	} else {
		if (petDanceInterval) {
			clearInterval(petDanceInterval);
			petDanceInterval = null;
		}
		// Disable auto hearts when pet dance is turned off
		if (window.AutoHeartsActive) {
			window.AutoHeartsActive = false;
			clearTimeout(window.__autoHeartsTimeoutId);
			const heartsBtn = typeof lunPanelElements !== "undefined" ? lunPanelElements.autoHeartsBtn : null;
			if (heartsBtn) setText(heartsBtn, t("autoHeartsOff") || "Auto Hearts: OFF");
		}
		
		chatLog(t("petDanceDeactivatedMsg") || "Pet Dance deactivated.");
	}
	
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.petDanceBtn);
	if (targetBtn) {
		setText(targetBtn, t(window.PetDanceActive ? "petDanceOn" : "petDanceOff") || (window.PetDanceActive ? "Pet Dance: ⏸️" : "Pet Dance: ▶️"));
	}
}

window.JustPetActive = false;
let justPetInterval = null;
let justPetTick = 0;

function justPetLoop() {
	if (!window.JustPetActive) return;
	
	justPetTick++;
	
	// Cycle between StrokeStart (4) and StrokeStage2 (5) every 1.5 seconds to keep the petting face active
	if (justPetTick % 30 === 15) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeStage2);
		}
	} else if (justPetTick % 30 === 0) {
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeStart);
		}
	}
}

function toggleJustPet(btn) {
	window.JustPetActive = !window.JustPetActive;
	if (window.JustPetActive) {
		justPetTick = 0;
		if (justPetInterval) clearInterval(justPetInterval);
		justPetInterval = setInterval(justPetLoop, 100);
		
		// Immediately trigger the petting facial expression (StrokeStart = 4)
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeStart);
		}
		
		chatLog(t("justPetActivatedMsg") || "Just Pet activated!");
	} else {
		if (justPetInterval) {
			clearInterval(justPetInterval);
			justPetInterval = null;
		}
		
		// Send StrokeCancel (7) to return Speaki's facial expression back to normal
		if (typeof gameState !== "undefined" && gameState?.sendEmoteNow) {
			gameState.sendEmoteNow(Emotes.StrokeCancel);
		}
		
		chatLog(t("justPetDeactivatedMsg") || "Just Pet deactivated.");
	}
	
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.justPetBtn);
	if (targetBtn) {
		setText(targetBtn, t(window.JustPetActive ? "justPetOn" : "justPetOff") || (window.JustPetActive ? "Just Pet: ⏸️" : "Just Pet: ▶️"));
	}
}



window.RitualState = 0;
let ritualCenter = null;
let ritualEmoteTick = 0;
const RITUAL_RADIUS = 1.4;

function toggleRitual(btn) {
	window.RitualState = (window.RitualState + 1) % 3;
	if (window.RitualState > 0) {
		if (lunFollowTargetName && typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers) {
			const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && t.info.name === lunFollowTargetName);
			if (tp && tp.container) {
				ritualCenter = tp.container.position;
			}
		}
		if (!ritualCenter) {
			ritualCenter = Object.assign({}, getPlayerPos());
		}
		ritualEmoteTick = 0;
		chatLog(t(window.RitualState === 2 ? "ritualInvertedMsg" : "ritualActivatedMsg") || "Dance ritual activated!");
	} else {
		ritualCenter = null;
		chatLog(t("ritualDeactivatedMsg"));
	}
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.ritualBtn);
	if (targetBtn) {
		let textKey = "ritualOff";
		if (window.RitualState === 1) textKey = "ritualOn";
		if (window.RitualState === 2) textKey = "ritualInverted";
		setText(targetBtn, t(textKey));
	}
}

window.PartnerDanceState = 0;
let partnerDanceCenter = null;
let partnerDanceTick = 0;
let partnerDanceIsClockwise = true;
const DANCE_RADIUS = 2.0;

function togglePartnerDance(btn) {
	window.PartnerDanceState = (window.PartnerDanceState + 1) % 3;
	if (window.PartnerDanceState > 0) {
		if (window.PartnerDanceState === 1) {
			if (lunFollowTargetName && typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers) {
				const tp = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && (t.info.name === lunFollowTargetName || t.info.__spkmodOrigName === lunFollowTargetName));
				if (tp && tp.container) {
					const myPos = getPlayerPos();
					partnerDanceCenter = {
						x: (myPos.x + tp.container.position.x) / 2,
						y: myPos.y,
						z: (myPos.z + tp.container.position.z) / 2
					};
					
					const myName = String(window._lunActiveCharacter || window.myPlayerName || "").toLowerCase();
					const targetName = String(tp.info.name).toLowerCase();
					partnerDanceIsClockwise = (myName >= targetName);
				}
			}
			if (!partnerDanceCenter) {
				const myPos = getPlayerPos();
				partnerDanceCenter = { x: myPos.x, y: myPos.y, z: myPos.z };
				partnerDanceIsClockwise = true;
			}
			partnerDanceTick = 0;
			window.pd_reset = true;
			chatLog(t("partnerDanceActivatedMsg") || "8 Dance activated!");
		} else {
			window.pd_reset = true;
			chatLog(t("partnerDanceInvertedMsg") || "Reverse 8 Dance activated!");
		}
	} else {
		partnerDanceCenter = null;
		chatLog(t("partnerDanceDeactivatedMsg") || "8 Dance deactivated.");
	}
	const targetBtn = btn || (typeof lunPanelElements !== "undefined" && lunPanelElements.partnerDanceBtn);
	if (targetBtn) {
		let textKey = "partnerDanceOff";
		if (window.PartnerDanceState === 1) textKey = "partnerDanceOn";
		if (window.PartnerDanceState === 2) textKey = "partnerDanceInverted";
		setText(targetBtn, t(textKey) || (window.PartnerDanceState === 0 ? "8 Dance: ▶️" : (window.PartnerDanceState === 1 ? "8 Dance: ⏸️" : "Rev 8: ⏸️")));
	}
}

window.TurntableActive = false;

function toggleTurntable(btn) {
	if (!window.TurntableActive) {
		window.TurntableActive = 1;
		chatLog(t("turntableActivatedMsg") || "Camera rotation activated!");
	} else if (window.TurntableActive === 1) {
		window.TurntableActive = 2;
		window._turntableTraveled = 0;
		window._turntableDir = 1;
		chatLog(t("turntableHalfMsg") || "Camera half-rotation activated!");
	} else {
		window.TurntableActive = false;
		chatLog(t("turntableDeactivatedMsg") || "Camera rotation deactivated.");
	}
	if (btn) setText(btn, t(window.TurntableActive === 1 ? "turntableOn" : (window.TurntableActive === 2 ? "turntableHalf" : "turntableOff")));
}

function followPlayer(name) {
	if (name && name !== lunFollowTargetName) {
		lunFollowTargetName = name;
		chatLog(t("followStartMsg", name));
	} else {
		lunFollowTargetName = null;
		chatLog(t("followStopMsg"));
	}
	if (lunPanelElements.panelFollowBtn) {
		setText(lunPanelElements.panelFollowBtn, lunFollowTargetName ? t("stopFollowing") : t("follow"));
	}
}

function findBestTarget(cycle = false) {
	if (!gameState || !gameState.monsters || !gameState.monsters.monsters) return null;
	const monsters = Array.from(gameState.monsters.monsters.values())
		.filter(m => m && m.info && (m.info.currentHp === undefined || m.info.currentHp > 0) && m.container);
	if (!monsters.length) return null;

	const pp = getPlayerPos();
	const maxMeleeDist = 3.5; // Strictly adjacent melee enemies only

	const nearby = monsters.map(m => {
		const mp = m.container.position;
		const dx = mp.x - pp.x;
		const dz = mp.z - pp.z;
		const dist = Math.hypot(dx, dz);
		return { monster: m, id: m.info.monsterInstanceId, dist };
	}).filter(item => item.dist <= maxMeleeDist).sort((a, b) => a.dist - b.dist);

	if (!nearby.length) return null;

	let targetId = nearby[0].id;
	if (cycle && nearby.length > 1) {
		const currentIdx = nearby.findIndex(s => s.id === gameState.targetMonsterId);
		if (currentIdx !== -1) {
			targetId = nearby[(currentIdx + 1) % nearby.length].id;
		}
	}

	gameState.setTarget(targetId);
	gameState.combatAssist.autoAttackActive = true;
	return targetId;
}

function showPlayersRadar(levelFilter) {
	if (!gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	let players = Array.from(gameState.remotePlayers.remotePlayers.values());
	
	if (levelFilter && !isNaN(parseInt(levelFilter))) {
		const targetLevel = parseInt(levelFilter);
		players = players.filter(p => p.info?.level === targetLevel);
	}
	
	if (!players.length) {
		chatLog(t("playersRadarNone"));
		return;
	}

	const list = players.map(p => {
		const dist = p.container ? distanceToVector(p.container.position).toFixed(1) : "?";
		return {
			name: p.info?.name || "Unknown",
			level: p.info?.level ?? "?",
			// id: p.info?.playerId ?? "?", // ID removed per request
			dist: dist
		};
	}).sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

	chatLog(t("playersRadarHeader", list.length) + "\n" + list.map(p => t("playersRadarRow", p.name, p.level, p.dist)).join("\n"));
}

function findBotsRadar(auto = false) {
	if (!gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	const players = Array.from(gameState.remotePlayers.remotePlayers.values());
	
	const level1s = players.filter(p => p.info?.level === 1 && p.container?.position && !lunKnownBotNameSet.has((p.info?.name || "").trim().toLocaleLowerCase()));
	
	const nearbyCounts = new Uint32Array(level1s.length);
	
	for (let i = 0; i < level1s.length; i++) {
        const p = level1s[i];
        const px = p.container.position.x;
        const pz = p.container.position.z;

        for (let j = i + 1; j < level1s.length; j++) {
            const other = level1s[j];
            const dx = px - other.container.position.x;
            const dz = pz - other.container.position.z;

            if (dx * dx + dz * dz < 25) {
                nearbyCounts[i]++;
                nearbyCounts[j]++;
            }
        }
    }

    const suspiciousBots = [];

    for (let i = 0; i < level1s.length; i++) {
        if (nearbyCounts[i] >= 4) {
            const p = level1s[i];

            suspiciousBots.push({
                name: p.info?.name,
                id: parseInt(p.info?.playerId) || 0,
                clusterSize: nearbyCounts[i]
            });
        }
    }
	
	if (!suspiciousBots.length) {
		if (!auto && typeof gameState !== "undefined" && gameState && (gameState.myPlayerName === "Glas" || gameState.myStat?.name === "Glas")) {
			chatLog("No clustered Level 1 bots found nearby.");
		}
		return;
	}
	
	let addedCount = 0;
	suspiciousBots.forEach(b => {
		const lowerName = (b.name || "").trim().toLowerCase();
		if (lowerName && typeof lunAutoBannedLevel1s !== "undefined" && !lunAutoBannedLevel1s.has(lowerName)) {
			lunAutoBannedLevel1s.add(lowerName);
			if (typeof lunActiveBotWaveMinId !== "undefined" && b.id > 0) {
				lunActiveBotWaveMinId = Math.min(lunActiveBotWaveMinId, b.id);
			}
			addedCount++;
		}
	});

	if (addedCount > 0 && typeof updateKnownBotVisibility === "function") {
		updateKnownBotVisibility();
	}
	
	const isGlas = typeof gameState !== "undefined" && gameState && (gameState.myPlayerName === "Glas" || gameState.myStat?.name === "Glas");
	
	if (isGlas && addedCount > 0) {
		const botNames = suspiciousBots.map(b => `"${b.name}"`);
		chatLog(`[Debug] Auto-banned ${addedCount} clustered bots: ${botNames.join(", ")}`);
		console.log("[SpeakiMod] Auto-banned bots:", botNames);
	} else if (!auto && !suspiciousBots.length && isGlas) {
		chatLog("No clustered Level 1 bots found nearby.");
	}
}

const SPKMOD_GAMEPAD_CONFIG_KEY = "spkmod-gamepad-config";

const SPKMOD_DEFAULT_GAMEPAD_CONFIG = {
	version: 3,
	enabled: false,
	deadzone: 0.15,
	cameraSensitivity: 1.2,
	droneSpeed: 0.35,
	invertCameraX: false,
	invertCameraY: false,
	bindings: {
		0: "potion",            // A / Cross (Heal / Potion)
		1: "interact",          // B / Circle (Interact / Portal - F key)
		2: "jump",              // X / Square (Jump)
		3: "hobagiCar",         // Y / Triangle (Hobagi Car - = key)
		5: "zoomIn",            // RB / R1 (Zoom In)
		7: "zoomOut",           // RT / R2 (Zoom Out)
		8: "town",              // Back / View / Select (Back to Town)
		9: "toggleSettings",    // Start / Menu
		10: "autoJump",         // L3 (Toggle Autojump)
		11: "lockCamera",       // R3 (Lock Camera)
		12: "dance",            // D-Pad Up (Dance Emote)
		13: "chowayo",          // D-Pad Down (Chowayo Emote)
		14: "beyblade",         // D-Pad Left (Left Spin)
		15: "reversebeyblade"   // D-Pad Right (Right Spin)
	}
};

const SPKMOD_GAMEPAD_ACTIONS = [
	"jump", "interact", "hobagiCar", "potion",
	"beyblade", "reversebeyblade", "dance", "chowayo", "hearts", "town",
	"zoomIn", "zoomOut", "lockCamera", "autoJump", "toggleSettings"
];

const SPKMOD_GAMEPAD_BUTTON_NAMES = [
	"A / ✕", "B / ◯", "X / ▢", "Y / △", "LB / L1", "RB / R1", "LT / L2", "RT / R2",
	"Back / View / Select", "Start / Menu", "L3 (Left Stick Click)", "R3 (Right Stick Click)",
	"D-Pad Up", "D-Pad Down", "D-Pad Left", "D-Pad Right"
];

let spkmodGamepadConfig = (() => {
	try {
		const raw = localStorage.getItem(SPKMOD_GAMEPAD_CONFIG_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (parsed.version === 4) {
				return Object.assign({}, SPKMOD_DEFAULT_GAMEPAD_CONFIG, parsed);
			} else if (parsed.version === 3) {
				parsed.version = 4;
				parsed.bindings = parsed.bindings || {};
				if (!parsed.bindings[1]) parsed.bindings[1] = "interact";
				if (!parsed.bindings[3]) parsed.bindings[3] = "hobagiCar";
				return Object.assign({}, SPKMOD_DEFAULT_GAMEPAD_CONFIG, parsed);
			}
		}
	} catch (e) {}
	return JSON.parse(JSON.stringify(SPKMOD_DEFAULT_GAMEPAD_CONFIG));
})();

function saveGamepadConfig() {
	try {
		localStorage.setItem(SPKMOD_GAMEPAD_CONFIG_KEY, JSON.stringify(spkmodGamepadConfig));
	} catch (e) {}
}

let gamepadMoveVector = null;
let gamepadPrevButtons = new Array(16).fill(false);
let gamepadListeningAction = null;

function executeGamepadAction(actionName) {
	switch (actionName) {
		case "jump":
			spkmodPerformJump();
			break;
		case "interact":
			if (typeof gameState !== "undefined" && gameState && typeof gameState.tryUsePortal === "function") {
				gameState.tryUsePortal();
			}
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "f", code: "KeyF", keyCode: 70, which: 70, bubbles: true }));
			window.dispatchEvent(new KeyboardEvent("keyup", { key: "f", code: "KeyF", keyCode: 70, bubbles: true }));
			break;
		case "hobagiCar":
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "=", code: "Equal", keyCode: 187, which: 187, bubbles: true }));
			window.dispatchEvent(new KeyboardEvent("keyup", { key: "=", code: "Equal", keyCode: 187, bubbles: true }));
			break;


		case "potion":
			if (gameState.tryUsePotion) gameState.tryUsePotion();
			break;
		case "target":

			break;
		case "beyblade":
			window.BeyBladeActive = !window.BeyBladeActive;
			if (window.BeyBladeActive) {
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
				window.MoonwalkActive = false;
				window.ReverseBeyBladeActive = false;
				chatLog(t("beybladeActivatedMsg", window.BeyBladeSpeed || 1));
			} else {
				chatLog(t("beybladeDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "reversebeyblade":
			window.ReverseBeyBladeActive = !window.ReverseBeyBladeActive;
			if (window.ReverseBeyBladeActive) {
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
				window.MoonwalkActive = false;
				window.BeyBladeActive = false;
				chatLog(t("reversebeybladeActivatedMsg", window.BeyBladeSpeed || 1));
			} else {
				chatLog(t("reversebeybladeDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "dance":
			gameState.sendEmoteNow(Emotes.Dance);
			break;
		case "chowayo":
			gameState.sendEmoteNow(Emotes.MinigameJoayo);
			break;
		case "hearts":
			triggerHearts();
			break;
		case "moonwalk":
			window.MoonwalkActive = !window.MoonwalkActive;
			if (window.MoonwalkActive) {
				window.BeyBladeActive = false;
				window.ShakeActive = false;
				window.SuperShakeActive = false;
				window.HyperShakeActive = false;
				if (window.vibrateTimer) { clearInterval(window.vibrateTimer); window.vibrateTimer = null; }
				window.ReverseBeyBladeActive = false;
				if (gameState.playerContainer) {
					window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
				}
				chatLog(t("moonwalkActivatedMsg"));
			} else {
				window.moonwalkLockedYaw = null;
				if (gameState.playerContainer && gameState.cameraController) {
					gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
					gameState.moveSendAccumulator = 1;
				}
				chatLog(t("moonwalkDeactivatedMsg"));
			}
			updateMovementButtonsUI();
			break;
		case "town":
			if (typeof gameState.tryReturnToTown === "function") {
				gameState.tryReturnToTown();
			} else if (typeof gameState.returnToTown === "function") {
				gameState.returnToTown();
			} else {
				if (lunWalkToPortal !== 1) {
					lunWalkToPortal = 1;
					if (lunPanelElements.walkToPortalBtn) setText(lunPanelElements.walkToPortalBtn, t("stopWalking"));
					chatLog(t("walkingToMsg", "Yggdrasil", 1));
				} else {
					resetWalkToPortal();
					chatLog(t("stoppedWalkingMsg"));
				}
			}
			break;
		case "lockCamera":
			lunCameraLocked = !lunCameraLocked;
			if (lunPanelElements.lockCameraBtn) {
				lunPanelElements.lockCameraBtn.innerText = lunCameraLocked ? t("unlockCamera") : t("lockCamera");
			}
			break;
		case "resetCamera":
			watchPlayer();
			stopStare();
			break;
		case "zoomIn":
			if (gameState.cameraController) {
				gameState.cameraController.cameraZoomDistance = Math.max(3, (gameState.cameraController.cameraZoomDistance || 12) - 1);
				if (typeof updateZoomButtonText === "function") updateZoomButtonText();
			}
			break;
		case "zoomOut":
			if (gameState.cameraController) {
				gameState.cameraController.cameraZoomDistance = Math.min(18, (gameState.cameraController.cameraZoomDistance || 12) + 1);
				if (typeof updateZoomButtonText === "function") updateZoomButtonText();
			}
			break;
		case "autoJump":
			window.AutoJumpActive = !window.AutoJumpActive;
			if (lunPanelElements.autoJumpBtn) setText(lunPanelElements.autoJumpBtn, t(window.AutoJumpActive ? "autoJumpOn" : "autoJumpOff"));
			if (window.AutoJumpActive) { autoJumpLoop(); } else { clearTimeout(window.__autoJumpTimeoutId); }
			break;
		case "toggleSettings":
			toggleSettingsModal();
			break;
	}
}



// --- SpeakiMod+ Local Effects (Code by Chan, adapted) ---
const lunDeathControllerStates = new WeakMap();
const lunDeathLocks = new WeakSet();

function spkmodPatchControllerForDeath(controller) {
	if (!controller || typeof controller !== 'object') return;
	let state = lunDeathControllerStates.get(controller);
	if (!state) {
		const originalSetLocomotion = controller.setLocomotion;
		if (typeof originalSetLocomotion !== 'function') return;
		state = { originalSetLocomotion };
		lunDeathControllerStates.set(controller, state);
		controller.setLocomotion = function (...args) {
			if (lunDeathLocks.has(this)) return;
			return originalSetLocomotion.apply(this, args);
		};
	}
}

function spkmodPlayDeath(targetController, targetName) {
	if (!targetController || typeof targetController.playDeath !== 'function') {
		console.warn("[SpeakiMod+ Local Effects] Target does not have a valid controller or playDeath function.", targetName);
		return false;
	}
	try {
		spkmodPatchControllerForDeath(targetController);
		lunDeathLocks.add(targetController);
		targetController.playDeath();
		console.log(`[SpeakiMod+ Local Effects] "${targetName}" DEATH animation played.`);
		return true;
	} catch (err) {
		console.error("[SpeakiMod+ Local Effects] playDeath error:", err);
		lunDeathLocks.delete(targetController);
		return false;
	}
}

window.spkmodTriggerDeathSelf = function() {
	if (typeof gameState !== "undefined" && gameState.localAvatar?.animationController) {
		spkmodPlayDeath(gameState.localAvatar?.animationController, "Self");
	}
};

function spkmodPlayDance(targetController, targetName) {
	if (!targetController || (typeof targetController.playFreeDance !== 'function' && typeof targetController.playStageDance !== 'function')) {
		console.warn("[SpeakiMod+ Local Effects] Target does not have a valid controller or dance function.", targetName);
		return false;
	}
	try {
		spkmodPatchControllerForDeath(targetController);
		lunDeathLocks.add(targetController);
		if (typeof targetController.playFreeDance === 'function') {
			targetController.playFreeDance();
		} else {
			targetController.playStageDance();
		}
		console.log(`[SpeakiMod+ Local Effects] "${targetName}" DANCE animation played.`);
		return true;
	} catch (err) {
		console.error("[SpeakiMod+ Local Effects] playDance error:", err);
		lunDeathLocks.delete(targetController);
		return false;
	}
}

function spkmodPlayFarm(targetController, targetName) {
	if (!targetController || typeof targetController.playGatherAnim !== 'function') {
		console.warn("[SpeakiMod+ Local Effects] Target does not have a valid controller or playGatherAnim function.", targetName);
		return false;
	}
	try {
		spkmodPatchControllerForDeath(targetController);
		lunDeathLocks.add(targetController);
		targetController.playGatherAnim();
		console.log(`[SpeakiMod+ Local Effects] "${targetName}" FARM animation played.`);
		return true;
	} catch (err) {
		console.error("[SpeakiMod+ Local Effects] playFarm error:", err);
		lunDeathLocks.delete(targetController);
		return false;
	}
}

function spkmodPlayFly(targetController, targetName) {
	if (!targetController || typeof targetController.enterKnockbackPose !== 'function') {
		console.warn("[SpeakiMod+ Local Effects] Target does not have a valid controller or enterKnockbackPose function.", targetName);
		return false;
	}
	try {
		spkmodPatchControllerForDeath(targetController);
		lunDeathLocks.add(targetController);
		targetController.enterKnockbackPose();
		console.log(`[SpeakiMod+ Local Effects] "${targetName}" FLY animation played.`);
		return true;
	} catch (err) {
		console.error("[SpeakiMod+ Local Effects] playFly error:", err);
		lunDeathLocks.delete(targetController);
		return false;
	}
}

function spkmodPlayHobagi(targetController, targetName) {
	if (!targetController || (typeof targetController.playStageDance !== 'function' && typeof targetController.playEmote !== 'function')) {
		console.warn("[SpeakiMod+ Local Effects] Target does not have a valid controller or playStageDance function.", targetName);
		return false;
	}
	try {
		spkmodPatchControllerForDeath(targetController);
		lunDeathLocks.add(targetController);
		if (typeof targetController.playStageDance === 'function') {
			targetController.playStageDance();
		} else {
			targetController.playEmote(8);
		}
		console.log(`[SpeakiMod+ Local Effects] "${targetName}" HOBAGI animation played.`);
		return true;
	} catch (err) {
		console.error("[SpeakiMod+ Local Effects] playHobagi error:", err);
		lunDeathLocks.delete(targetController);
		return false;
	}
}

window.spkmodTriggerDanceEveryone = function() {
	let count = 0;
	// Clear all loops and reset states/buttons
	if (window.lunEffectIntervals) {
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			if (typeof lunPanelElements !== 'undefined') {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = typeof t === 'function' ? t('killEveryoneBtn') : 'killEveryoneBtn'; }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = typeof t === 'function' ? t('farmEveryoneBtn') : 'farmEveryoneBtn'; }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = typeof t === 'function' ? t('danceEveryoneBtn') : 'danceEveryoneBtn'; }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = typeof t === 'function' ? t('hobagiEveryoneBtn') : 'hobagiEveryoneBtn'; }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = typeof t === 'function' ? t('flyEveryoneBtn') : 'flyEveryoneBtn'; }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}

	if (typeof gameState !== "undefined") {
		if (gameState.localAvatar?.animationController) {
			if (spkmodPlayDance(gameState.localAvatar?.animationController, "Self")) count++;
		}
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl && spkmodPlayDance(ctrl, player.info?.name || "Unknown")) count++;
			}
		}
	}
	console.log(`[SpeakiMod+ Local Effects] Forced ${count} players to dance.`);
};

window.spkmodTriggerFarmEveryone = function() {
	let count = 0;
	// Clear all loops and reset states/buttons
	if (window.lunEffectIntervals) {
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			if (typeof lunPanelElements !== 'undefined') {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = typeof t === 'function' ? t('killEveryoneBtn') : 'killEveryoneBtn'; }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = typeof t === 'function' ? t('farmEveryoneBtn') : 'farmEveryoneBtn'; }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = typeof t === 'function' ? t('danceEveryoneBtn') : 'danceEveryoneBtn'; }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = typeof t === 'function' ? t('hobagiEveryoneBtn') : 'hobagiEveryoneBtn'; }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = typeof t === 'function' ? t('flyEveryoneBtn') : 'flyEveryoneBtn'; }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}

	if (typeof gameState !== "undefined") {
		if (gameState.localAvatar?.animationController) {
			if (spkmodPlayFarm(gameState.localAvatar?.animationController, "Self")) count++;
		}
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl && spkmodPlayFarm(ctrl, player.info?.name || "Unknown")) count++;
			}
		}
	}
	console.log(`[SpeakiMod+ Local Effects] Forced ${count} players to farm.`);
};

window.spkmodTriggerFlyEveryone = function() {
	let count = 0;
	// Clear all loops and reset states/buttons
	if (window.lunEffectIntervals) {
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			if (typeof lunPanelElements !== 'undefined') {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = typeof t === 'function' ? t('killEveryoneBtn') : 'killEveryoneBtn'; }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = typeof t === 'function' ? t('farmEveryoneBtn') : 'farmEveryoneBtn'; }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = typeof t === 'function' ? t('danceEveryoneBtn') : 'danceEveryoneBtn'; }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = typeof t === 'function' ? t('hobagiEveryoneBtn') : 'hobagiEveryoneBtn'; }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = typeof t === 'function' ? t('flyEveryoneBtn') : 'flyEveryoneBtn'; }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}

	if (typeof gameState !== "undefined") {
		if (gameState.localAvatar?.animationController) {
			if (spkmodPlayFly(gameState.localAvatar?.animationController, "Self")) count++;
		}
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl && spkmodPlayFly(ctrl, player.info?.name || "Unknown")) count++;
			}
		}
	}
	console.log(`[SpeakiMod+ Local Effects] Forced ${count} players to fly.`);
};

window.spkmodTriggerHobagiEveryone = function() {
	let count = 0;
	// Clear all loops and reset states/buttons
	if (window.lunEffectIntervals) {
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			if (typeof lunPanelElements !== 'undefined') {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = typeof t === 'function' ? t('killEveryoneBtn') : 'killEveryoneBtn'; }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = typeof t === 'function' ? t('farmEveryoneBtn') : 'farmEveryoneBtn'; }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = typeof t === 'function' ? t('danceEveryoneBtn') : 'danceEveryoneBtn'; }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = typeof t === 'function' ? t('hobagiEveryoneBtn') : 'hobagiEveryoneBtn'; }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = typeof t === 'function' ? t('flyEveryoneBtn') : 'flyEveryoneBtn'; }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}

	if (typeof gameState !== "undefined") {
		if (gameState.localAvatar?.animationController) {
			if (spkmodPlayHobagi(gameState.localAvatar?.animationController, "Self")) count++;
		}
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl && spkmodPlayHobagi(ctrl, player.info?.name || "Unknown")) count++;
			}
		}
	}
	console.log(`[SpeakiMod+ Local Effects] Forced ${count} players to hobagi.`);
};

window.lunEffectStates = { death: 0, farm: 0, dance: 0, hobagi: 0, fly: 0 };
window.lunEffectIntervals = {};

window.spkmodCycleEffect = function(effectName, playFunc, btnElem, btnLabelKey) {
	const wasOff = (window.lunEffectStates[effectName] || 0) === 0;
	
	// If it was off, we are turning it on, so reset ALL other effects first
	if (wasOff) {
		window.spkmodReviveAll && window.spkmodReviveAll(); // Clean slate
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			// Reset button texts of others
			if (key !== effectName) {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = t('killEveryoneBtn'); }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = t('farmEveryoneBtn'); }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = t('danceEveryoneBtn'); }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = t('hobagiEveryoneBtn'); }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = t('flyEveryoneBtn'); }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}
	
	window.lunEffectStates[effectName] = ((window.lunEffectStates[effectName] || 0) + 1) % 3;
	const state = window.lunEffectStates[effectName];
	
	if (window.lunEffectIntervals[effectName]) {
		clearInterval(window.lunEffectIntervals[effectName]);
		window.lunEffectIntervals[effectName] = null;
	}
	
	const baseText = typeof t === 'function' ? t(btnLabelKey) : btnLabelKey;
	if (btnElem) {
		if (state === 1) btnElem.innerText = baseText + " (Single)";
		else if (state === 2) btnElem.innerText = baseText + " (Loop)";
		else btnElem.innerText = baseText;
	}
	
	const applyToAll = () => {
		if (typeof gameState === "undefined") return;
		if (gameState.localAvatar?.animationController) {
			playFunc(gameState.localAvatar.animationController, "Self");
		}
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl) playFunc(ctrl, player.info?.name || "Unknown");
			}
		}
	};
	
	if (state === 1) {
		applyToAll();
	} else if (state === 2) {
		applyToAll();
		window.lunEffectIntervals[effectName] = setInterval(applyToAll, 1000);
	} else if (state === 0) {
		window.spkmodReviveAll && window.spkmodReviveAll();
	}
};

window.spkmodTriggerDeathEveryone = () => window.spkmodCycleEffect('death', spkmodPlayDeath, lunPanelElements.killEveryoneBtn, 'killEveryoneBtn');
window.spkmodTriggerFarmEveryone = () => window.spkmodCycleEffect('farm', spkmodPlayFarm, lunPanelElements.farmEveryoneBtn, 'farmEveryoneBtn');
window.spkmodTriggerDanceEveryone = () => window.spkmodCycleEffect('dance', spkmodPlayDance, lunPanelElements.danceEveryoneBtn, 'danceEveryoneBtn');
window.spkmodTriggerHobagiEveryone = () => window.spkmodCycleEffect('hobagi', spkmodPlayHobagi, lunPanelElements.hobagiEveryoneBtn, 'hobagiEveryoneBtn');
window.spkmodTriggerFlyEveryone = () => window.spkmodCycleEffect('fly', spkmodPlayFly, lunPanelElements.flyEveryoneBtn, 'flyEveryoneBtn');

window.spkmodReviveAll = function() {
	let count = 0;
	
	const reviveCtrl = (controller, player) => {
		if (!controller || !lunDeathLocks.has(controller)) return;
		lunDeathLocks.delete(controller);
		try {
			if (typeof controller.setAlive === 'function') controller.setAlive();
			else if (typeof controller.revive === 'function') controller.revive();
			else if (typeof controller.reset === 'function') controller.reset();
			
			if (typeof controller.forceReleasePoseHold === 'function') controller.forceReleasePoseHold();

			if (player) {
				const animState = player.animState ?? 0;
				const mountDriverId = player.mountDriverId ?? 0;

				if (animState === 3 && typeof controller.playStageDance === 'function') controller.playStageDance();
				else if (animState === 6 && typeof controller.playFreeDance === 'function') controller.playFreeDance();
				else if (animState === 1 && typeof controller.playReturnCastDance === 'function') controller.playReturnCastDance();
				else if (animState === 2 && typeof controller.enterAffectionHold === 'function') controller.enterAffectionHold();
				else if (animState === 4 && typeof controller.enterEmoteIdle === 'function') controller.enterEmoteIdle();
				else if (animState === 5 && typeof controller.enterFallDownHold === 'function') controller.enterFallDownHold();
				else if (animState === 7 && typeof controller.playReviveDance === 'function') controller.playReviveDance();

				if (mountDriverId && mountDriverId !== 0 && typeof controller.enterMountPose === 'function') {
					const mountItemId = player.mountItemId ?? 0;
					const mountSeatIndex = player.mountSeatIndex ?? 0;
					controller.enterMountPose([mountDriverId, mountItemId, mountSeatIndex]);
				}
			}

			const state = lunDeathControllerStates.get(controller);
			if (state && typeof state.originalSetLocomotion === 'function') {
				state.originalSetLocomotion.call(controller, false);
			}
			count++;
		} catch (e) {
			console.error("[SpeakiMod+ Local Effects] revive error:", e);
		}
	};

	// Clear all loops and reset states/buttons
	if (window.lunEffectIntervals) {
		for (const key of Object.keys(window.lunEffectIntervals)) {
			if (window.lunEffectIntervals[key]) {
				clearInterval(window.lunEffectIntervals[key]);
				window.lunEffectIntervals[key] = null;
			}
			window.lunEffectStates[key] = 0;
			
			if (typeof lunPanelElements !== 'undefined') {
				let otherBtn = null;
				let otherBase = "";
				if (key === 'death') { otherBtn = lunPanelElements.killEveryoneBtn; otherBase = typeof t === 'function' ? t('killEveryoneBtn') : 'killEveryoneBtn'; }
				else if (key === 'farm') { otherBtn = lunPanelElements.farmEveryoneBtn; otherBase = typeof t === 'function' ? t('farmEveryoneBtn') : 'farmEveryoneBtn'; }
				else if (key === 'dance') { otherBtn = lunPanelElements.danceEveryoneBtn; otherBase = typeof t === 'function' ? t('danceEveryoneBtn') : 'danceEveryoneBtn'; }
				else if (key === 'hobagi') { otherBtn = lunPanelElements.hobagiEveryoneBtn; otherBase = typeof t === 'function' ? t('hobagiEveryoneBtn') : 'hobagiEveryoneBtn'; }
				else if (key === 'fly') { otherBtn = lunPanelElements.flyEveryoneBtn; otherBase = typeof t === 'function' ? t('flyEveryoneBtn') : 'flyEveryoneBtn'; }
				if (otherBtn) otherBtn.innerText = otherBase;
			}
		}
	}

	if (typeof gameState !== "undefined") {
		if (gameState.localAvatar?.animationController) reviveCtrl(gameState.localAvatar?.animationController, null);
		if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const player of gameState.remotePlayers.remotePlayers.values()) {
				const ctrl = player?.avatar?.animationController || player?.container?.controller;
				if (ctrl) reviveCtrl(ctrl, player);
			}
		}
	}
	if (typeof gameState !== 'undefined' && gameState && gameState.remotePlayers && typeof gameState.applyVisualState === 'function') {
		for (const player of gameState.remotePlayers.values()) {
			try {
				if (player && player.avatar) {
					gameState.applyVisualState(player);
				}
			} catch(e) {}
		}
	}

	console.log(`[SpeakiMod+ Local Effects] Revived ${count} players and restored native animStates.`);
};


window.lunInvisibilityActive = false;
window.lunInvisibilityInterval = null;
window.spkmodToggleInvisibility = function() {
	window.lunInvisibilityActive = !window.lunInvisibilityActive;
	
	if (window.lunInvisibilityInterval) {
		clearInterval(window.lunInvisibilityInterval);
		window.lunInvisibilityInterval = null;
	}
	
	const applyInv = () => {
		if (typeof gameState !== 'undefined' && gameState.playerContainer) {
			gameState.playerContainer.visible = !window.lunInvisibilityActive;
		}
	};
	
	if (window.lunInvisibilityActive) {
		window.lunInvisibilityInterval = setInterval(applyInv, 100);
	} else {
		applyInv(); // restore immediately
	}
	
	if (lunPanelElements.invisibleBtn) {
				if (window.lunInvisibilityActive) {
			lunPanelElements.invisibleBtn.style.setProperty("background", "#5a2e2e", "important");
		} else {
			lunPanelElements.invisibleBtn.style.removeProperty("background");
		}
	}
};



function hijackAndRename(player, newName, newLevel) {
	if (!player || !player.container) return false;
	
	// Update internal name so hover/party features know the new name
	if (player.info) {
		if (typeof player.info.__spkmodOrigName === 'undefined') {
			player.info.__spkmodOrigName = player.info.name;
		}
		player.info.name = newName;
		
		if (newLevel) {
			if (typeof player.info.__spkmodOrigLevel === 'undefined') {
				player.info.__spkmodOrigLevel = player.info.level;
			}
			player.info.level = parseInt(newLevel, 10);
		}
	}
	
	if (player.avatar && typeof player.avatar.setLabel === 'function') {
		let lvl = (player.info && player.info.level) ? player.info.level : 1;
		
		// Fix WebGL Texture Remnant Bug: 
		// If the new name is shorter, shrinking the canvas leaves old pixels in the GPU buffer.
		// We must explicitly dispose the old map to force three.js to reallocate a fresh one.
		if (!player.avatar.__spkmodLabelPatched) {
			player.container.traverse(obj => {
				if (obj && obj.isSprite && obj.material && obj.material.map && obj.position && obj.position.y > 1.0) {
					obj.material.map.dispose();
				}
			});
		}
		
		// The game natively splits and formats "LV<level> <name>"
		player.avatar.setLabel("LV" + lvl + " " + newName);
	}

	// Refresh nametag visibility after renaming.
    if (player.__spkmodNametagManaged) applyPlayerNametagVisibility(player);
	updateKnownBotVisibility();
	
	return true;
}

window.spkmodRenamePlayer = function(oldName, newName, newLevel) {
	if (!oldName || !newName || typeof gameState === 'undefined') return;
	const oldLower = oldName.toLowerCase().trim();
	let count = 0;
	
	function processMap(map) {
		if (!map || typeof map.values !== 'function') return;
		for (const entity of map.values()) {
			if (entity.info) {
				const currentName = (entity.info.name || "").toLowerCase().trim();
				const origName = (entity.info.__spkmodOrigName || "").toLowerCase().trim();
				if (currentName === oldLower || origName === oldLower) {
					if (hijackAndRename(entity, newName, newLevel)) count++;
				}
			}
		}
	}
	
	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) processMap(gameState.remotePlayers.remotePlayers);
	if (gameState.remotePetRegistry) processMap(gameState.remotePetRegistry);
	if (gameState.remoteDroneCoreRegistry) processMap(gameState.remoteDroneCoreRegistry);
	
	console.log(`[SpeakiMod+] Renamed ${count} entities to ${newName}`);
};

window.spkmodRenameAll = function(newName) {
	if (!newName || typeof gameState === 'undefined') return;
	let count = 0;
	
	function processMap(map) {
		if (!map || typeof map.values !== 'function') return;
		for (const entity of map.values()) {
			if (hijackAndRename(entity, newName)) count++;
		}
	}
	
	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) processMap(gameState.remotePlayers.remotePlayers);
	if (gameState.remotePetRegistry) processMap(gameState.remotePetRegistry);
	if (gameState.remoteDroneCoreRegistry) processMap(gameState.remoteDroneCoreRegistry);
	
	console.log(`[SpeakiMod+] Renamed ALL ${count} remote entities to ${newName}`);
};


window.spkmodTriggerDeathTarget = function(name) {
	if (!name || typeof gameState === 'undefined') return;
	const lowerName = name.toLowerCase().trim();
	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			if (player.info) {
				const currentName = (player.info.name || "").toLowerCase().trim();
				const origName = (player.info.__spkmodOrigName || "").toLowerCase().trim();
				if (currentName === lowerName || origName === lowerName) {
					if (player.avatar && player.avatar.animationController) {
						spkmodPlayDeath(player.avatar.animationController, player.info.name);
					}
				}
			}
		}
	}
};

window.spkmodResetNames = function() {
	if (typeof gameState === 'undefined') return;
	let count = 0;
	function processMap(map) {
		if (!map || typeof map.values !== 'function') return;
		for (const entity of map.values()) {
			if (entity.info && typeof entity.info.__spkmodOrigName !== 'undefined') {
				const origName = entity.info.__spkmodOrigName;
				entity.info.name = origName;
				delete entity.info.__spkmodOrigName;
				
				if (entity.avatar && typeof entity.avatar.setLabel === 'function') {
					let lvl = (entity.info && entity.info.level) ? entity.info.level : 1;
					
					if (entity.container && !entity.avatar.__spkmodLabelPatched) {
						entity.container.traverse(obj => {
							if (obj && obj.isSprite && obj.material && obj.material.map && obj.position && obj.position.y > 1.0) {
								obj.material.map.dispose();
							}
						});
					}
					
					entity.avatar.setLabel("LV" + lvl + " " + origName);
					count++;
				}
				if (entity.__spkmodNametagManaged) applyPlayerNametagVisibility(entity);
			}
		}
	}
	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) processMap(gameState.remotePlayers.remotePlayers);
	if (gameState.remotePetRegistry) processMap(gameState.remotePetRegistry);
	if (gameState.remoteDroneCoreRegistry) processMap(gameState.remoteDroneCoreRegistry);
	updateKnownBotVisibility();
	console.log(`[SpeakiMod+] Reset ${count} names to their original values`);
};

window.spkmodActiveSoccerTeam = window.spkmodActiveSoccerTeam || 0;
window.spkmodActiveSoccerTeamAll = window.spkmodActiveSoccerTeamAll || 0;
window.spkmodSetTeam = function(team, targetPlayer) {
	if (typeof gameState === 'undefined' || !gameState) {
		if (typeof chatLog === 'function') chatLog("[Soccer] Game is not loaded yet.");
		return;
	}

	let teamNum = 0;
	if (typeof team === 'number') {
		teamNum = team;
	} else if (typeof team === 'string') {
		const s = team.trim().toLowerCase();
		if (s === 'red' || s === '1' || s === 'r' || s === 'redteam') teamNum = 1;
		else if (s === 'blue' || s === '2' || s === 'b' || s === 'blueteam') teamNum = 2;
		else if (s === 'none' || s === '0' || s === 'off' || s === 'reset' || s === 'clear' || s === 'default') teamNum = 0;
		else {
			const parsed = parseInt(s, 10);
			if (!isNaN(parsed)) teamNum = parsed;
			else {
				if (typeof chatLog === 'function') chatLog("[Soccer] Unknown team. Options: red (1), blue (2), none (0)");
				return;
			}
		}
	}

	const teamNames = { 0: "Default (None)", 1: "Red Team", 2: "Blue Team" };
	const label = teamNames[teamNum] || ("Team " + teamNum);

	// If targeting a specific remote player or all players
	if (targetPlayer && typeof targetPlayer === 'string' && targetPlayer.trim()) {
		const targetLower = targetPlayer.trim().toLowerCase();
		let affectedCount = 0;

		if (targetLower === "all" || targetLower === "*") {
			// Apply to local player
			window.spkmodActiveSoccerTeam = teamNum;
			window.spkmodActiveSoccerTeamAll = teamNum;
			if (typeof gameState.setLocalSoccerTeam === 'function') {
				gameState.setLocalSoccerTeam(teamNum);
				affectedCount++;
			}
			// Apply to all remote players locally
			if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
				for (const [id] of gameState.remotePlayers.remotePlayers.entries()) {
					if (typeof gameState.remotePlayers.applySoccerTeam === 'function') {
						gameState.remotePlayers.applySoccerTeam(id, teamNum);
						affectedCount++;
					}
				}
			}
			if (typeof chatLog === 'function') chatLog(`[Soccer] Applied ${label} to all players locally (${affectedCount}).`);
			if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
			return;
		}

		const myName = ((gameState.myPlayerName || gameState.myStat?.name) || "").toLowerCase().trim();
		if (targetLower !== "me" && targetLower !== "self" && (!myName || myName !== targetLower)) {
			if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
				for (const [id, rp] of gameState.remotePlayers.remotePlayers.entries()) {
					const curName = (rp.info && rp.info.name ? rp.info.name : "").toLowerCase().trim();
					const origName = (rp.info && rp.info.__spkmodOrigName ? rp.info.__spkmodOrigName : "").toLowerCase().trim();
					if (curName === targetLower || origName === targetLower || String(id) === targetLower) {
						if (typeof gameState.remotePlayers.applySoccerTeam === 'function') {
							gameState.remotePlayers.applySoccerTeam(id, teamNum);
							affectedCount++;
							if (typeof chatLog === 'function') chatLog(`[Soccer] Set ${rp.info?.name || id} to ${label} locally.`);
						}
					}
				}

				if (affectedCount === 0) {
					for (const [id, rp] of gameState.remotePlayers.remotePlayers.entries()) {
						const curName = (rp.info && rp.info.name ? rp.info.name : "").toLowerCase().trim();
						const origName = (rp.info && rp.info.__spkmodOrigName ? rp.info.__spkmodOrigName : "").toLowerCase().trim();
						if ((curName && curName.includes(targetLower)) || (origName && origName.includes(targetLower))) {
							if (typeof gameState.remotePlayers.applySoccerTeam === 'function') {
								gameState.remotePlayers.applySoccerTeam(id, teamNum);
								affectedCount++;
								if (typeof chatLog === 'function') chatLog(`[Soccer] Set ${rp.info?.name || id} to ${label} locally.`);
							}
						}
					}
				}
			}

			if (affectedCount === 0 && typeof chatLog === 'function') {
				chatLog(`[Soccer] Player "${targetPlayer}" not found.`);
			}
			return;
		}
	}

	// Target is Local Player (Me):
	window.spkmodActiveSoccerTeam = teamNum;
	window.spkmodActiveSoccerTeamAll = 0;

	// Apply locally for instant visual rendering
	if (typeof gameState.setLocalSoccerTeam === 'function') {
		gameState.setLocalSoccerTeam(teamNum);
	}

	// Hook handleSoccerTeam to prevent server from wiping the uniform if user locked it
	if (typeof gameState.handleSoccerTeam === 'function' && !gameState.__spkmodHandleSoccerTeamHooked) {
		gameState.__spkmodHandleSoccerTeamHooked = true;
		const origHandleSoccerTeam = gameState.handleSoccerTeam.bind(gameState);
		gameState.handleSoccerTeam = function(e) {
			const tVal = e.team ?? 0;
			if (window.spkmodActiveSoccerTeamAll && tVal === 0) {
				return;
			}
			if (e.playerId === this.myPlayerId && window.spkmodActiveSoccerTeam && tVal === 0) {
				return; // Preserve user's active uniform
			}
			return origHandleSoccerTeam(e);
		};
	}

	if (typeof chatLog === 'function') {
		chatLog(`[Soccer] Uniform set to ${label} (Local).`);
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodUpdatePresetListUI = function() {
    if (typeof lunPanelElements === 'undefined' || !lunPanelElements.presetList) return;
    let presets = JSON.parse(localStorage.getItem('spkmod-name-presets') || '{}');
    lunPanelElements.presetList.innerHTML = '';
    
    let keys = Object.keys(presets);
    if (keys.length === 0) {
        lunPanelElements.presetList.innerText = typeof t !== 'undefined' ? (t("noPresetsSaved") || "No presets saved.") : "No presets saved.";
        lunPanelElements.presetList.style.color = "#aaa";
        lunPanelElements.presetList.style.textAlign = "center";
        return;
    }
    
    lunPanelElements.presetList.style.color = "#fff";
    lunPanelElements.presetList.style.textAlign = "left";
    
    for (let orig of keys) {
        let row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #333; padding: 2px 4px; border-radius: 2px; cursor: pointer; user-select: none;";
        
        let textSpan = document.createElement("span");
        textSpan.style.flex = "1";
        textSpan.innerText = `${orig} ➔ ${presets[orig]}`;
        textSpan.title = "Click to autofill";
        textSpan.onclick = () => {
            if (typeof lunPanelElements !== 'undefined') {
                if (lunPanelElements.renameTargetInput) lunPanelElements.renameTargetInput.value = orig;
                if (lunPanelElements.renameValueInput) lunPanelElements.renameValueInput.value = presets[orig];
            }
        };
        
        let delSpan = document.createElement("span");
        delSpan.innerText = "✖";
        delSpan.style.cssText = "color: #ff5555; cursor: pointer; padding: 0 4px; font-weight: bold;";
        delSpan.title = "Delete";
        delSpan.onclick = (e) => {
            e.stopPropagation();
            if (window.spkmodDeleteNamePreset) window.spkmodDeleteNamePreset(orig, "");
        };
        
        row.appendChild(textSpan);
        row.appendChild(delSpan);
        
        row.onmouseenter = () => row.style.background = "#444";
        row.onmouseleave = () => row.style.background = "#333";
        
        lunPanelElements.presetList.appendChild(row);
    }
};

window.spkmodSaveNamePreset = function(origName, newName) {
    if (!origName || !newName) {
        if (typeof chatLog !== 'undefined') chatLog(typeof t !== 'undefined' ? t("presetNeedBoth") || "Need both Original and New name!" : "Need both names!");
        return;
    }
    let presets = JSON.parse(localStorage.getItem('spkmod-name-presets') || '{}');
    presets[origName.toLowerCase().trim()] = newName;
    localStorage.setItem('spkmod-name-presets', JSON.stringify(presets));
    if (typeof chatLog !== 'undefined') chatLog(`Saved name preset: ${origName} -> ${newName}`);
    if (window.spkmodUpdatePresetListUI) window.spkmodUpdatePresetListUI();
};

window.spkmodDeleteNamePreset = function(origName, newName) {
    let presets = JSON.parse(localStorage.getItem('spkmod-name-presets') || '{}');
    let deleted = false;
    
    if (origName && presets[origName.toLowerCase().trim()]) {
        delete presets[origName.toLowerCase().trim()];
        deleted = true;
    }
    
    if (!deleted && newName) {
        let lowerNew = newName.toLowerCase().trim();
        for (let k in presets) {
            if (presets[k].toLowerCase().trim() === lowerNew) {
                delete presets[k];
                deleted = true;
            }
        }
    }
    
    if (deleted) {
        localStorage.setItem('spkmod-name-presets', JSON.stringify(presets));
        if (typeof chatLog !== 'undefined') chatLog(`Deleted name preset.`);
        if (window.spkmodUpdatePresetListUI) window.spkmodUpdatePresetListUI();
    } else {
        if (typeof chatLog !== 'undefined') chatLog(`No preset found to delete.`);
    }
};

window.spkmodApplyNamePresets = function() {
    let presets = JSON.parse(localStorage.getItem('spkmod-name-presets') || '{}');
    let keys = Object.keys(presets);
    if (keys.length === 0) {
        if (typeof chatLog !== 'undefined') chatLog("No name presets saved!");
        return;
    }
    
    let count = 0;
    for (let orig of keys) {
        window.spkmodRenamePlayer(orig, presets[orig]);
        count++;
    }
    if (typeof chatLog !== 'undefined') chatLog(`Applied ${count} name presets.`);
};

// ==========================================
// Local Avatar Custom Dye & Special FX Engine
// ==========================================
window.spkmodAvatarColorMode = window.spkmodAvatarColorMode || "none"; // "color", "rainbow", "shadow", "none"
window.spkmodAvatarColorHex = window.spkmodAvatarColorHex || "#ffffff";
window.spkmodAvatarColorScope = window.spkmodAvatarColorScope || "all"; // "all" or "body"
window.spkmodAvatarDroppingActive = Boolean(window.spkmodAvatarDroppingActive);
window.spkmodAvatarHeartDropActive = Boolean(window.spkmodAvatarHeartDropActive);
window.__spkmodRainbowAnimId = null;

// Registry of pristine base materials snapshot (to prevent shared FBX template pollution)
window.__spkmodBasePristineMaterials = window.__spkmodBasePristineMaterials || new Map();
window.spkmodActiveDyedMaterials = window.spkmodActiveDyedMaterials || new Map();

// Safely ensure Material.prototype has a resilient userData getter/setter to prevent OutlineEffect crashes
function spkmodEnsureMaterialPrototypeSafety(sampleMat) {
	if (!sampleMat || window.__spkmodMaterialSafetyHooked) return;
	try {
		const targetMat = Array.isArray(sampleMat) ? sampleMat[0] : sampleMat;
		if (!targetMat) return;
		let proto = Object.getPrototypeOf(targetMat);
		let baseProto = null;
		while (proto && proto !== Object.prototype) {
			baseProto = proto;
			proto = Object.getPrototypeOf(proto);
		}
		if (baseProto && !baseProto.__spkmodUserDataHooked) {
			baseProto.__spkmodUserDataHooked = true;
			Object.defineProperty(baseProto, 'userData', {
				get() {
					if (!this.__spkmodUserData) this.__spkmodUserData = {};
					return this.__spkmodUserData;
				},
				set(val) {
					this.__spkmodUserData = (val && typeof val === 'object') ? val : {};
				},
				configurable: true,
				enumerable: true
			});
			window.__spkmodMaterialSafetyHooked = true;
		}
	} catch (_) {}
}

function spkmodIsOutlineMaterial(mat) {
	if (!mat) return false;
	const arr = Array.isArray(mat) ? mat : [mat];
	return arr.some(m => m && (m.type === 'OutlineEffect' || m.name === 'OutlineEffect'));
}

function spkmodCloneMaterialSafely(mat) {
	if (!mat) return mat;
	if (Array.isArray(mat)) {
		return mat.map(m => spkmodCloneMaterialSafely(m) || m);
	}
	if (typeof mat !== 'object' || typeof mat.clone !== 'function') {
		return mat; // Non-cloneable or custom material, keep reference safely
	}
	if (mat.type === 'OutlineEffect' || mat.name === 'OutlineEffect') {
		return null; // Do not clone temporary OutlineEffect materials
	}
	spkmodEnsureMaterialPrototypeSafety(mat);
	try {
		const cloned = mat.clone();
		if (cloned) {
			if (!cloned.userData) cloned.userData = {};
			if (!mat.userData) mat.userData = {};
			if (mat.userData.outlineParameters) {
				try {
					cloned.userData.outlineParameters = Object.assign({}, mat.userData.outlineParameters);
				} catch (_) {}
			}
			return cloned;
		}
	} catch (_) {}
	return mat;
}

function spkmodEnsurePristineMaterials() {
	if (typeof gameState === 'undefined' || !gameState || !gameState.localAvatar || !gameState.localAvatar.root) return;
	gameState.localAvatar.root.traverse(child => {
		if (child.isMesh && child.material && !child.userData.__spkmodClonedMat) {
			if (spkmodIsOutlineMaterial(child.material)) return;
			spkmodEnsureMaterialPrototypeSafety(child.material);
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			for (const m of mats) if (m && !m.userData) m.userData = {};
			if (!window.__spkmodBasePristineMaterials.has(child.name)) {
				window.__spkmodBasePristineMaterials.set(child.name, mats.map(m => spkmodCloneMaterialSafely(m) || m));
			}
		}
	});
}

function spkmodSetFbxMaterialsPristine(isPristine) {
	if (typeof gameState === 'undefined' || !gameState || !gameState.localAvatar || !gameState.localAvatar.root) return;
	gameState.localAvatar.root.traverse(child => {
		if (!child.isMesh) return;
		if (isPristine) {
			if (child.userData.__spkmodOrigMat) {
				child.material = child.userData.__spkmodOrigMat;
			} else if (child.userData.__spkmodBadAppleOrigMat) {
				child.material = child.userData.__spkmodBadAppleOrigMat;
			} else if (window.__spkmodBasePristineMaterials.has(child.name)) {
				const mats = window.__spkmodBasePristineMaterials.get(child.name);
				child.material = Array.isArray(child.material) ? mats.map(m => spkmodCloneMaterialSafely(m) || m) : (spkmodCloneMaterialSafely(mats[0]) || mats[0]);
			}
		} else {
			if (window.spkmodActiveDyedMaterials.has(child)) {
				child.material = window.spkmodActiveDyedMaterials.get(child);
			}
		}
		if (child.material) {
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			for (const m of mats) if (m && !m.userData) m.userData = {};
		}
	});
}

window.spkmodSanitizeRemotePlayers = function() {
	if (window.spkmodAvatarColorMode === "rainbow_all" || 
	    window.spkmodAvatarColorMode === "rainbow_random" || 
	    window.spkmodAvatarColorMode === "bad_apple") return;
	if (typeof gameState === 'undefined' || !gameState || !gameState.remotePlayers || !gameState.remotePlayers.remotePlayers) return;
	for (const rp of gameState.remotePlayers.remotePlayers.values()) {
		if (!rp) continue;
		delete rp.__spkmodRainbowOffset;
		if (!rp.avatar || !rp.avatar.root) continue;
		rp.avatar.root.traverse(child => {
			if (!child.isMesh) return;
			if (child.userData.__spkmodClonedMat || child.userData.__spkmodOrigMat) {
				if (child.userData.__spkmodOrigMat) {
					const orig = child.userData.__spkmodOrigMat;
					const current = child.material;
					child.material = orig;
					if (current && current !== orig) {
						const arr = Array.isArray(current) ? current : [current];
						const origArr = Array.isArray(orig) ? orig : [orig];
						for (const c of arr) {
							if (c && !origArr.includes(c) && typeof c.dispose === 'function') {
								try { c.dispose(); } catch (_) {}
							}
						}
					}
				}
				delete child.userData.__spkmodClonedMat;
				delete child.userData.__spkmodOrigMat;
			}
			if (child.material) {
				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) if (m && !m.userData) m.userData = {};
			}
		});
	}
};

window.hookRemotePlayerRebuildIsolation = function() {
	if (typeof gameState === 'undefined' || !gameState || !gameState.remotePlayers) return;
	if (typeof gameState.remotePlayers.rebuildAvatar !== 'function') return;
	if (gameState.remotePlayers.__spkmodRebuildIsolated) return;
	gameState.remotePlayers.__spkmodRebuildIsolated = true;

	const origRebuild = gameState.remotePlayers.rebuildAvatar.bind(gameState.remotePlayers);
	gameState.remotePlayers.rebuildAvatar = function(id) {
		if (window.spkmodAvatarColorMode && window.spkmodAvatarColorMode !== "none") {
			spkmodSetFbxMaterialsPristine(true);
			try {
				return origRebuild(id);
			} finally {
				Promise.resolve().then(() => {
					spkmodSetFbxMaterialsPristine(false);
					if (window.spkmodAvatarColorMode === "bad_apple") {
						window.spkmodApplyBadAppleMode();
					} else if (window.spkmodAvatarColorMode !== "rainbow_all" && window.spkmodAvatarColorMode !== "rainbow_random") {
						window.spkmodSanitizeRemotePlayers();
					}
				});
			}
		}
		return origRebuild(id);
	};
};

window.spkmodSetAvatarColorScope = function(scope) {
	window.spkmodAvatarColorScope = scope === "body" ? "body" : "all";
	if (typeof chatLog === 'function') {
		chatLog(`[FX] Color scope set to: ${window.spkmodAvatarColorScope === "body" ? "Outfit/Body Only" : "Full Avatar"}`);
	}
	// Re-apply current mode if active
	if (window.spkmodAvatarColorMode === "color" && window.spkmodAvatarColorHex) {
		window.spkmodApplyAvatarColor(window.spkmodAvatarColorHex);
	} else if (window.spkmodAvatarColorMode === "rainbow") {
		window.spkmodStartRainbowWave(false);
	} else if (window.spkmodAvatarColorMode === "rainbow_all") {
		window.spkmodStartRainbowWave(true);
	} else if (window.spkmodAvatarColorMode === "rainbow_random") {
		window.spkmodStartRainbowWave("random");
	} else if (window.spkmodAvatarColorMode === "shadow") {
		window.spkmodApplyShadowMode();
	} else if (window.spkmodAvatarColorMode === "bad_apple") {
		window.spkmodApplyBadAppleMode();
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodApplyAvatarColor = function(hexColor, allowToggle = false) {
	if (typeof gameState === 'undefined' || !gameState || !gameState.localAvatar) {
		if (typeof chatLog === 'function') chatLog("[FX] Game avatar is not loaded yet.");
		return;
	}

	if (allowToggle && window.spkmodAvatarColorMode === "color" && (window.spkmodAvatarColorHex || '').toLowerCase() === (hexColor || '').toLowerCase()) {
		window.spkmodResetAvatarColors();
		return;
	}

	window.hookRemotePlayerRebuildIsolation();
	spkmodEnsurePristineMaterials();

	if (window.__spkmodRainbowAnimId) {
		cancelAnimationFrame(window.__spkmodRainbowAnimId);
		window.__spkmodRainbowAnimId = null;
	}

	window.spkmodAvatarColorMode = "color";
	window.spkmodAvatarColorHex = hexColor || "#ffffff";
	window.spkmodActiveDyedMaterials.clear();

	const root = gameState.localAvatar.root;
	if (!root) return;

	root.traverse(child => {
		if (!child.isMesh) return;
		if (spkmodIsOutlineMaterial(child.material)) return;
		spkmodEnsureMaterialPrototypeSafety(child.material);
		const mats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of mats) if (m && !m.userData) m.userData = {};
		
		const matName = (mats[0]?.name || "").toLowerCase();
		const meshName = (child.name || "").toLowerCase();
		if (window.spkmodAvatarColorScope === "body") {
			const isBody = matName.includes("body") || meshName.includes("body") || matName.includes("costume");
			if (!isBody) {
				// Restore if it was previously tinted
				if (child.userData.__spkmodOrigMat) {
					child.material = child.userData.__spkmodOrigMat;
					delete child.userData.__spkmodOrigMat;
					delete child.userData.__spkmodClonedMat;
				}
				return;
			}
		}

		if (!child.userData.__spkmodOrigMat) {
			child.userData.__spkmodOrigMat = child.material;
		}

		if (!child.userData.__spkmodClonedMat) {
			child.material = Array.isArray(child.material) 
				? child.material.map(m => spkmodCloneMaterialSafely(m) || m) 
				: (spkmodCloneMaterialSafely(child.material) || child.material);
			child.userData.__spkmodClonedMat = true;
		}

		const currentMats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of currentMats) {
			if (m && m.color && typeof m.color.set === 'function') {
				m.color.set(hexColor);
			}
			if (m && m.emissive && typeof m.emissive.set === 'function') {
				m.emissive.set(hexColor).multiplyScalar(0.18);
			}
		}
		window.spkmodActiveDyedMaterials.set(child, child.material);
	});

	window.spkmodSanitizeRemotePlayers();
	if (typeof chatLog === 'function') chatLog(`[FX] Applied color dye: ${hexColor}`);
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodRainbowSpeed = (function() {
	try {
		if (window.localStorage) {
			const s = parseFloat(localStorage.getItem("spkmod-rainbow-speed"));
			if (!isNaN(s) && s > 0) return s;
		}
	} catch(_) {}
	return 1.0;
})();

window.spkmodStartRainbowWave = function(targetMode, customSpeed, allowToggle = false) {
	if (typeof gameState === 'undefined' || !gameState || !gameState.localAvatar) {
		if (typeof chatLog === 'function') chatLog("[FX] Game avatar is not loaded yet.");
		return;
	}

	if (typeof customSpeed === 'number' && customSpeed > 0) {
		window.spkmodRainbowSpeed = customSpeed;
		if (window.localStorage) localStorage.setItem("spkmod-rainbow-speed", customSpeed);
	}

	window.hookRemotePlayerRebuildIsolation();
	spkmodEnsurePristineMaterials();

	if (window.__spkmodRainbowAnimId) {
		cancelAnimationFrame(window.__spkmodRainbowAnimId);
		window.__spkmodRainbowAnimId = null;
	}

	const isRandom = targetMode === "random" || targetMode === "rand";
	const isAll = !isRandom && (targetMode === true || targetMode === "all");
	const targetModeName = isRandom ? "rainbow_random" : (isAll ? "rainbow_all" : "rainbow");

	if (allowToggle && window.spkmodAvatarColorMode === targetModeName) {
		window.spkmodResetAvatarColors();
		return;
	}

	window.spkmodAvatarColorMode = targetModeName;
	window.spkmodActiveDyedMaterials.clear();

	if (isRandom) {
		window.__spkmodLocalRainbowOffset = Math.random();
		if (gameState && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const rp of gameState.remotePlayers.remotePlayers.values()) {
				if (rp) rp.__spkmodRainbowOffset = Math.random();
			}
		}
	} else {
		delete window.__spkmodLocalRainbowOffset;
		if (gameState && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const rp of gameState.remotePlayers.remotePlayers.values()) {
				if (rp) delete rp.__spkmodRainbowOffset;
			}
		}
	}

	const root = gameState.localAvatar.root;
	if (root) {
		root.traverse(child => {
			if (!child.isMesh || !child.material) return;
			if (spkmodIsOutlineMaterial(child.material)) return;
			spkmodEnsureMaterialPrototypeSafety(child.material);
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			for (const m of mats) if (m && !m.userData) m.userData = {};
			const matName = (mats[0]?.name || "").toLowerCase();
			const meshName = (child.name || "").toLowerCase();
			if (window.spkmodAvatarColorScope === "body") {
				const isBody = matName.includes("body") || meshName.includes("body") || matName.includes("costume");
				if (!isBody) {
					if (child.userData.__spkmodOrigMat) {
						child.material = child.userData.__spkmodOrigMat;
						delete child.userData.__spkmodOrigMat;
						delete child.userData.__spkmodClonedMat;
					}
					return;
				}
			}
			if (!child.userData.__spkmodOrigMat) child.userData.__spkmodOrigMat = child.material;
			if (!child.userData.__spkmodClonedMat) {
				child.material = Array.isArray(child.material) 
					? child.material.map(m => spkmodCloneMaterialSafely(m) || m) 
					: (spkmodCloneMaterialSafely(child.material) || child.material);
				child.userData.__spkmodClonedMat = true;
			}
			window.spkmodActiveDyedMaterials.set(child, child.material);
		});
	}

	if (!isAll && !isRandom) {
		window.spkmodSanitizeRemotePlayers();
	}

	window.spkmodRainbowLastTime = performance.now();
	function rainbowLoop() {
		if (window.spkmodAvatarColorMode !== "rainbow" && 
			window.spkmodAvatarColorMode !== "rainbow_all" && 
			window.spkmodAvatarColorMode !== "rainbow_random") return;
		const now = performance.now();
		const dt = Math.min((now - (window.spkmodRainbowLastTime || now)) / 1000, 0.1);
		window.spkmodRainbowLastTime = now;
		const speed = typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed : 1.0;
		window.spkmodRainbowPhase = ((window.spkmodRainbowPhase || 0) + dt * 0.6 * speed) % 1.0;

		const isRand = window.spkmodAvatarColorMode === "rainbow_random";
		const localHue = isRand
			? ((window.spkmodRainbowPhase + (window.__spkmodLocalRainbowOffset || 0)) % 1.0)
			: window.spkmodRainbowPhase;

		// 1. Local avatar
		if (gameState && gameState.localAvatar && gameState.localAvatar.root) {
			gameState.localAvatar.root.traverse(child => {
				if (!child.isMesh || !child.material || !child.userData.__spkmodClonedMat) return;
				if (spkmodIsOutlineMaterial(child.material)) return;
				const currentMats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of currentMats) {
					if (m && m.color && typeof m.color.setHSL === 'function') {
						m.color.setHSL(localHue, 1.0, 0.65);
					}
					if (m && m.emissive && typeof m.emissive.setHSL === 'function') {
						m.emissive.setHSL(localHue, 1.0, 0.25);
					}
				}
			});
		}

		// 2. Remote avatars if rainbow_all or rainbow_random
		if ((window.spkmodAvatarColorMode === "rainbow_all" || isRand) && gameState && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
			for (const rp of gameState.remotePlayers.remotePlayers.values()) {
				if (!rp || !rp.avatar || !rp.avatar.root) continue;
				if (isRand && typeof rp.__spkmodRainbowOffset !== 'number') {
					rp.__spkmodRainbowOffset = Math.random();
				}
				const rpHue = isRand
					? ((window.spkmodRainbowPhase + rp.__spkmodRainbowOffset) % 1.0)
					: window.spkmodRainbowPhase;

				rp.avatar.root.traverse(child => {
					if (!child.isMesh || !child.material) return;
					if (spkmodIsOutlineMaterial(child.material)) return;
					spkmodEnsureMaterialPrototypeSafety(child.material);
					if (!child.userData.__spkmodClonedMat) {
						if (!child.userData.__spkmodOrigMat) child.userData.__spkmodOrigMat = child.material;
						child.material = Array.isArray(child.material) 
							? child.material.map(m => spkmodCloneMaterialSafely(m) || m) 
							: (spkmodCloneMaterialSafely(child.material) || child.material);
						child.userData.__spkmodClonedMat = true;
					}
					const currentMats = Array.isArray(child.material) ? child.material : [child.material];
					for (const m of currentMats) {
						if (m && m.color && typeof m.color.setHSL === 'function') {
							m.color.setHSL(rpHue, 1.0, 0.65);
						}
						if (m && m.emissive && typeof m.emissive.setHSL === 'function') {
							m.emissive.setHSL(rpHue, 1.0, 0.25);
						}
					}
				});
			}
		}

		window.__spkmodRainbowAnimId = requestAnimationFrame(rainbowLoop);
	}
	window.__spkmodRainbowAnimId = requestAnimationFrame(rainbowLoop);
	if (typeof chatLog === 'function') {
		const spd = typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed.toFixed(1) : "1.0";
		if (isRandom) {
			chatLog(`[FX] 🔀 Random Rainbow activated! (${spd}x)`);
		} else if (isAll) {
			chatLog(`[FX] 🌟 Rainbow ALL activated! (${spd}x)`);
		} else {
			chatLog(`[FX] 🌈 Rainbow Wave activated! (${spd}x)`);
		}
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodApplyShadowMode = function(allowToggle = false) {
	if (typeof gameState === 'undefined' || !gameState || !gameState.localAvatar) {
		if (typeof chatLog === 'function') chatLog("[FX] Game avatar is not loaded yet.");
		return;
	}

	if (allowToggle && window.spkmodAvatarColorMode === "shadow") {
		window.spkmodResetAvatarColors();
		return;
	}

	window.hookRemotePlayerRebuildIsolation();
	spkmodEnsurePristineMaterials();

	if (window.__spkmodRainbowAnimId) {
		cancelAnimationFrame(window.__spkmodRainbowAnimId);
		window.__spkmodRainbowAnimId = null;
	}

	window.spkmodAvatarColorMode = "shadow";
	window.spkmodActiveDyedMaterials.clear();

	const root = gameState.localAvatar.root;
	if (!root) return;

	root.traverse(child => {
		if (!child.isMesh || !child.material) return;
		if (spkmodIsOutlineMaterial(child.material)) return;
		spkmodEnsureMaterialPrototypeSafety(child.material);
		const mats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of mats) if (m && !m.userData) m.userData = {};

		if (!child.userData.__spkmodOrigMat) child.userData.__spkmodOrigMat = child.material;
		if (!child.userData.__spkmodClonedMat) {
			child.material = Array.isArray(child.material) 
				? child.material.map(m => spkmodCloneMaterialSafely(m) || m) 
				: (spkmodCloneMaterialSafely(child.material) || child.material);
			child.userData.__spkmodClonedMat = true;
		}

		const currentMats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of currentMats) {
			if (m && m.color && typeof m.color.setHex === 'function') {
				m.color.setHex(0x0a0a0a);
			}
			if (m && m.emissive && typeof m.emissive.setHex === 'function') {
				m.emissive.setHex(0x1a0628); // Subtle dark eldritch purple aura
			}
			if (m && m.roughness !== undefined) m.roughness = 0.95;
		}
		window.spkmodActiveDyedMaterials.set(child, child.material);
	});

	window.spkmodSanitizeRemotePlayers();
	if (typeof chatLog === 'function') chatLog("[FX] 👤 Void Shadow Mode activated!");
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodApplyBadAppleMode = function(allowToggle = false) {
	if (typeof gameState === 'undefined' || !gameState || !gameState.scene) {
		if (typeof chatLog === 'function') chatLog("[FX] Game scene is not loaded yet.");
		return;
	}

	if (allowToggle && window.spkmodAvatarColorMode === "bad_apple") {
		window.spkmodResetAvatarColors();
		return;
	}

	const wasAlreadyActive = window.spkmodAvatarColorMode === "bad_apple";

	window.hookRemotePlayerRebuildIsolation();
	spkmodEnsurePristineMaterials();

	if (window.__spkmodRainbowAnimId) {
		cancelAnimationFrame(window.__spkmodRainbowAnimId);
		window.__spkmodRainbowAnimId = null;
	}

	window.spkmodAvatarColorMode = "bad_apple";
	window.spkmodActiveDyedMaterials.clear();

	const scene = gameState.scene;

	// 1. Scene Background, Fog & Renderer Clear Color
	if (scene.__spkmodBadAppleOrigBg === undefined) {
		scene.__spkmodBadAppleOrigBg = scene.background || null;
	}
	if (scene.__spkmodBadAppleOrigFog === undefined) {
		scene.__spkmodBadAppleOrigFog = scene.fog && scene.fog.color ? scene.fog.color.getHex() : null;
	}
	if (scene.background && typeof scene.background.setHex === 'function') {
		scene.background.setHex(0xffffff);
	} else if (scene.children) {
		const anyMesh = scene.children.find(c => c?.material?.color);
		if (anyMesh && anyMesh.material?.color?.constructor) {
			scene.background = new anyMesh.material.color.constructor(0xffffff);
		}
	}
	if (scene.fog && scene.fog.color && typeof scene.fog.color.setHex === 'function') {
		scene.fog.color.setHex(0xffffff);
	}
	if (gameState.renderer && typeof gameState.renderer.setClearColor === 'function') {
		if (gameState.renderer.__spkmodOrigClearColor === undefined) {
			try {
				const col = scene.background ? new (scene.background.constructor)() : null;
				if (col) {
					gameState.renderer.getClearColor(col);
					gameState.renderer.__spkmodOrigClearColor = col.getHex();
				} else {
					gameState.renderer.__spkmodOrigClearColor = null;
				}
			} catch (_) {
				gameState.renderer.__spkmodOrigClearColor = null;
			}
		}
		try { gameState.renderer.setClearColor(0xffffff, 1); } catch (_) {}
	}

	// Helper to silhouette a mesh into solid black
	const makeMeshSilhouette = (child) => {
		if (!child.isMesh || !child.material) return;
		if (spkmodIsOutlineMaterial(child.material)) return;
		spkmodEnsureMaterialPrototypeSafety(child.material);

		if (child.renderOrder === -1) {
			// Skybox dome / background mesh - make pure white
			const mats = Array.isArray(child.material) ? child.material : [child.material];
			for (const m of mats) {
				if (!m) continue;
				if (m.__spkmodBadAppleOrigMap === undefined) m.__spkmodBadAppleOrigMap = m.map;
				if (m.__spkmodBadAppleOrigColor === undefined && m.color) m.__spkmodBadAppleOrigColor = m.color.getHex();
				m.map = null;
				if (m.color && typeof m.color.setHex === 'function') m.color.setHex(0xffffff);
				m.needsUpdate = true;
			}
			child.visible = true;
			return;
		}

		if (!child.userData.__spkmodBadAppleOrigMat) {
			child.userData.__spkmodBadAppleOrigMat = child.material;
		}
		if (!child.userData.__spkmodBadAppleCloned) {
			child.material = Array.isArray(child.material) 
				? child.material.map(m => spkmodCloneMaterialSafely(m) || m) 
				: (spkmodCloneMaterialSafely(child.material) || child.material);
			child.userData.__spkmodBadAppleCloned = true;
		}

		const currentMats = Array.isArray(child.material) ? child.material : [child.material];
		for (const m of currentMats) {
			if (!m) continue;
			if (!m.userData) m.userData = {};
			if (m.color && typeof m.color.setHex === 'function') {
				m.color.setHex(0x000000);
			}
			if (m.emissive && typeof m.emissive.setHex === 'function') {
				m.emissive.setHex(0x000000);
			}
			m.map = null;
			if (m.roughness !== undefined) m.roughness = 1.0;
			if (m.metalness !== undefined) m.metalness = 0.0;
			m.needsUpdate = true;
		}
		window.spkmodActiveDyedMaterials.set(child, child.material);
	};

	// 2. Apply to entire scene (scenery, ferris wheel, ground, environment)
	scene.traverse(makeMeshSilhouette);

	// 3. Ensure local avatar & all remote avatars are also traversed
	if (gameState.localAvatar && gameState.localAvatar.root) {
		gameState.localAvatar.root.traverse(makeMeshSilhouette);
	}
	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
		for (const rp of gameState.remotePlayers.remotePlayers.values()) {
			if (rp && rp.avatar && rp.avatar.root) {
				rp.avatar.root.traverse(makeMeshSilhouette);
			}
		}
	}

	if (!wasAlreadyActive && typeof chatLog === 'function') {
		chatLog("[FX] 🍎 Bad Apple Monochrome Mode activated!");
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodToggleBadAppleMode = function() {
	if (window.spkmodAvatarColorMode === "bad_apple") {
		window.spkmodResetAvatarColors();
	} else {
		window.spkmodApplyBadAppleMode();
	}
};

window.spkmodToggleDropping = function(enabled) {
	if (enabled === undefined) {
		window.spkmodAvatarDroppingActive = !window.spkmodAvatarDroppingActive;
	} else {
		window.spkmodAvatarDroppingActive = Boolean(enabled);
	}
	if (typeof chatLog === 'function') {
		chatLog(`[FX] ✨ Dropping Trail: ${window.spkmodAvatarDroppingActive ? "ON" : "OFF"}`);
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodToggleHeartDropping = function(enabled) {
	if (enabled === undefined) {
		window.spkmodAvatarHeartDropActive = !window.spkmodAvatarHeartDropActive;
	} else {
		window.spkmodAvatarHeartDropActive = Boolean(enabled);
	}
	if (typeof chatLog === 'function') {
		chatLog(`[FX] 💖 Heart Dropper: ${window.spkmodAvatarHeartDropActive ? "ON" : "OFF"}`);
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodEmitDropParticle = function() {
	if (typeof gameState === 'undefined' || !gameState || !gameState.playerContainer) return;
	const pos = gameState.playerContainer.position;
	if (!pos) return;

	if (gameState.skillParticles && typeof gameState.skillParticles.emit === 'function') {
		let dropColor = window.spkmodAvatarColorHex || '#ffdd44';
		if (window.spkmodAvatarColorMode === 'rainbow' || window.spkmodAvatarColorMode === 'rainbow_all' || window.spkmodAvatarColorMode === 'rainbow_random') {
			dropColor = `hsl(${Math.round((performance.now() * 0.08) % 360)}, 100%, 65%)`;
		} else if (window.spkmodAvatarColorMode === 'shadow') {
			dropColor = '#8b5cf6';
		}
		try {
			gameState.skillParticles.emit({
				count: 2,
				texture: 'star4',
				color: dropColor,
				speedMinMps: 0.1,
				speedMaxMps: 0.6,
				gravityMps2: 4.2,
				sizeM: 0.26,
				lifeSecMin: 0.5,
				lifeSecMax: 1.0,
				spawnJitterSec: 0.04
			}, {
				x: pos.x + (Math.random() - 0.5) * 0.35,
				y: (pos.y || 0) + 0.75,
				z: pos.z + (Math.random() - 0.5) * 0.35
			});
		} catch (e) {}
	}
};

window.spkmodResetAvatarColors = function() {
	if (window.__spkmodRainbowAnimId) {
		cancelAnimationFrame(window.__spkmodRainbowAnimId);
		window.__spkmodRainbowAnimId = null;
	}
	window.spkmodAvatarColorMode = "none";
	window.spkmodAvatarColorHex = "#ffffff";
	delete window.__spkmodLocalRainbowOffset;
	window.spkmodAvatarDroppingActive = false;
	window.spkmodAvatarHeartDropActive = false;
	if (window.spkmodActiveDyedMaterials) window.spkmodActiveDyedMaterials.clear();

	// 0. Restore Bad Apple scene modifications if active or present
	if (typeof gameState !== 'undefined' && gameState && gameState.scene) {
		const scene = gameState.scene;
		if (scene.__spkmodBadAppleOrigBg !== undefined) {
			scene.background = scene.__spkmodBadAppleOrigBg;
			delete scene.__spkmodBadAppleOrigBg;
		}
		if (scene.fog && scene.__spkmodBadAppleOrigFog !== undefined) {
			if (scene.__spkmodBadAppleOrigFog !== null && scene.fog.color && typeof scene.fog.color.setHex === 'function') {
				scene.fog.color.setHex(scene.__spkmodBadAppleOrigFog);
			}
			delete scene.__spkmodBadAppleOrigFog;
		}
		if (gameState.renderer && gameState.renderer.__spkmodOrigClearColor !== undefined) {
			try {
				if (gameState.renderer.__spkmodOrigClearColor !== null && typeof gameState.renderer.setClearColor === 'function') {
					gameState.renderer.setClearColor(gameState.renderer.__spkmodOrigClearColor, 1);
				}
			} catch (_) {}
			delete gameState.renderer.__spkmodOrigClearColor;
		}

		scene.traverse(child => {
			if (!child.isMesh) return;
			if (child.renderOrder === -1 && child.material) {
				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) {
					if (!m) continue;
					if (m.__spkmodBadAppleOrigMap !== undefined) {
						m.map = m.__spkmodBadAppleOrigMap;
						delete m.__spkmodBadAppleOrigMap;
					}
					if (m.__spkmodBadAppleOrigColor !== undefined && m.color && typeof m.color.setHex === 'function') {
						m.color.setHex(m.__spkmodBadAppleOrigColor);
						delete m.__spkmodBadAppleOrigColor;
					}
					m.needsUpdate = true;
				}
			}
			if (child.userData.__spkmodBadAppleOrigMat) {
				const orig = child.userData.__spkmodBadAppleOrigMat;
				const cloned = child.material;
				child.material = orig;
				delete child.userData.__spkmodBadAppleOrigMat;
				delete child.userData.__spkmodBadAppleCloned;
				if (cloned && cloned !== orig) {
					const arr = Array.isArray(cloned) ? cloned : [cloned];
					const origArr = Array.isArray(orig) ? orig : [orig];
					for (const c of arr) {
						if (c && !origArr.includes(c) && typeof c.dispose === 'function') {
							try { c.dispose(); } catch (_) {}
						}
					}
				}
			}
		});
	}

	// 1. Reset local avatar
	if (typeof gameState !== 'undefined' && gameState && gameState.localAvatar && gameState.localAvatar.root) {
		gameState.localAvatar.root.traverse(child => {
			if (!child.isMesh) return;
			if (child.userData.__spkmodOrigMat) {
				const orig = child.userData.__spkmodOrigMat;
				const cloned = child.material;
				child.material = orig;
				delete child.userData.__spkmodOrigMat;
				delete child.userData.__spkmodClonedMat;
				if (cloned && cloned !== orig) {
					const arr = Array.isArray(cloned) ? cloned : [cloned];
					const origArr = Array.isArray(orig) ? orig : [orig];
					for (const c of arr) {
						if (c && !origArr.includes(c) && typeof c.dispose === 'function') {
							try { c.dispose(); } catch (_) {}
						}
					}
				}
			} else if (window.__spkmodBasePristineMaterials && window.__spkmodBasePristineMaterials.has(child.name)) {
				const prist = window.__spkmodBasePristineMaterials.get(child.name);
				child.material = Array.isArray(child.material) ? prist.map(m => spkmodCloneMaterialSafely(m) || m) : (spkmodCloneMaterialSafely(prist[0]) || prist[0]);
				delete child.userData.__spkmodClonedMat;
			}
			if (child.material) {
				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) if (m && !m.userData) m.userData = {};
			}
		});
	}

	// 2. Restore all remote players (materials + uniforms)
	if (typeof gameState !== 'undefined' && gameState && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
		for (const [id, rp] of gameState.remotePlayers.remotePlayers.entries()) {
			if (typeof gameState.remotePlayers.applySoccerTeam === 'function' && window.spkmodActiveSoccerTeam) {
				try { gameState.remotePlayers.applySoccerTeam(id, 0); } catch(e) {}
			}
			if (rp && rp.avatar && rp.avatar.root) {
				rp.avatar.root.traverse(child => {
					if (!child.isMesh) return;
					if (child.userData.__spkmodOrigMat) {
						const orig = child.userData.__spkmodOrigMat;
						const cloned = child.material;
						child.material = orig;
						delete child.userData.__spkmodOrigMat;
						delete child.userData.__spkmodClonedMat;
						if (cloned && cloned !== orig) {
							const arr = Array.isArray(cloned) ? cloned : [cloned];
							const origArr = Array.isArray(orig) ? orig : [orig];
							for (const c of arr) {
								if (c && !origArr.includes(c) && typeof c.dispose === 'function') {
									try { c.dispose(); } catch (_) {}
								}
							}
						}
					}
					if (child.material) {
						const mats = Array.isArray(child.material) ? child.material : [child.material];
						for (const m of mats) if (m && !m.userData) m.userData = {};
					}
				});
			}
		}
	}
	if (window.spkmodActiveSoccerTeam) {
		window.spkmodActiveSoccerTeam = 0;
		if (typeof gameState.setLocalSoccerTeam === 'function') gameState.setLocalSoccerTeam(0);
	}

	window.spkmodSanitizeRemotePlayers();
	if (typeof window.spkmodTogglePumpkinCartTexture === 'function') {
		window.spkmodTogglePumpkinCartTexture(false);
	}
	if (typeof chatLog === 'function') chatLog("[FX] Reset all avatar custom dyes and effects (Self + Other players).");
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};