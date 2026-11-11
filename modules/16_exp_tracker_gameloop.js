// --- MOD PLAYERS TELEMETRY & HOURLY PING ---
var lunModPlayersCounts = { count1h: null, count24h: null, count7d: null, countAllTime: null };
var lunLastTelemetryPingTime = 0;
var lunTelemetryPingIntervalMs = 10 * 60 * 1000; // 10 minutes

window.spkmodRenderChannelTracker = function() {
	if (!window.__spkmodLastChannelResp || !lunHudElements.channelTracker) return;
	const modLine = (lunModPlayersCounts.count1h !== null)
		? "\n" + t("totalModPlayers", lunModPlayersCounts.count1h)
		: "\n" + t("totalModPlayers", "--");

	setText(lunHudElements.channelTracker,
		window.__spkmodLastChannelResp.map(ch => t("channelTracker", ch.channel, ch.population, ch.capacity)).join("\n")
		+ "\n" + t("totalPlayersOnline", (window.__spkmodLastTotalPop || 0).toLocaleString())
		+ modLine);
};

window.spkmodSendTelemetryPing = function() {
	let saved = (window.localStorage && localStorage.getItem("spkmod-poll-server-url")) || "";
	if (saved.startsWith("http://") || saved.includes("YOUR_RPI")) saved = "";
	const sUrl = (window.spkmodPollServerUrl || saved || "https://spk.lena.moe").replace(/\/+$/, "");
	const consent = window.localStorage ? localStorage.getItem("spkmod-telemetry-consent") : null;

	// Always mark attempt timestamp so failures never trigger repeated pings every second
	lunLastTelemetryPingTime = Date.now();
	const safeFetch = window.spkmodSafeFetch || window.fetch;

	if (consent === "granted") {
		const username = (window.gameState && window.gameState.myPlayerName) ? String(window.gameState.myPlayerName).trim() : (localStorage.getItem("spkmod-last-player-name") || "Player");
		const playerId = (window.gameState && window.gameState.myPlayerId) ? String(window.gameState.myPlayerId) : (localStorage.getItem("spkmod-last-player-id") || "");

		safeFetch(`${sUrl}/api/telemetry/ping`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, playerId })
		}, 4000)
		.then(res => {
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		})
		.then(data => {
			if (window.spkmodServerHealth) window.spkmodServerHealth.recordSuccess();
			if (data && data.success) {
				lunModPlayersCounts = { count1h: data.count1h, count24h: data.count24h, count7d: data.count7d, countAllTime: data.countAllTime };
				window.spkmodRenderChannelTracker();
			}
		})
		.catch(_ => {
			if (window.spkmodServerHealth) window.spkmodServerHealth.recordFailure();
		});
	} else {
		safeFetch(`${sUrl}/api/telemetry/stats`, {}, 4000)
		.then(res => {
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		})
		.then(data => {
			if (window.spkmodServerHealth) window.spkmodServerHealth.recordSuccess();
			if (data && data.success) {
				lunModPlayersCounts = { count1h: data.count1h, count24h: data.count24h, count7d: data.count7d, countAllTime: data.countAllTime };
				window.spkmodRenderChannelTracker();
			}
		})
		.catch(_ => {
			if (window.spkmodServerHealth) window.spkmodServerHealth.recordFailure();
		});
	}
};

window.spkmodCheckTelemetryPing = function() {
	if (window.spkmodServerHealth && !window.spkmodServerHealth.isAvailable()) return;
	if (Date.now() - lunLastTelemetryPingTime >= lunTelemetryPingIntervalMs) {
		window.spkmodSendTelemetryPing();
	}
};

setTimeout(() => {
	if (typeof window.spkmodSendTelemetryPing === "function") {
		window.spkmodSendTelemetryPing();
	}
}, 2500);

if (typeof spkmodI18nRenderers !== 'undefined') {
	spkmodI18nRenderers.push(() => {
		if (typeof window.spkmodRenderChannelTracker === "function") {
			window.spkmodRenderChannelTracker();
		}
	});
}

function tick() {
	if (window.__spkmodPauseTick) return;
	if (lunTickCount % 20 === 0) spkmodAvatarController.sync();
	if (!window.__gameStateHooked && typeof gameState !== "undefined" && gameState) {
		if (typeof hookGameStateOnce === "function") {
			hookGameStateOnce();
		}
	}

	if (typeof __spkmodSpriteProtoHooked !== "undefined" && !__spkmodSpriteProtoHooked && gameState?.playerContainer?.traverse) {
		gameState.playerContainer.traverse(obj => {
			if (obj && obj.isSprite && typeof hookSpritePrototypeOnce === "function") {
				hookSpritePrototypeOnce(obj);
			}
		});
	}

	const currentNick = (typeof gameState !== "undefined" && gameState && (gameState.myPlayerName || gameState.myStat?.name)) || "";
	if (!currentNick || !gameState || !gameState.myStat) return;

	if (lunTickCount % 20 === 0 && typeof hookPartyTargetElement === "function") {
		hookPartyTargetElement();
	}
	if (lunTickCount % 20 === 0 && typeof hookChatEmojiButton === "function") {
		hookChatEmojiButton();
	}
	if (lunTickCount % 1800 === 0 && typeof window.spkmodCheckTelemetryPing === "function") {
		window.spkmodCheckTelemetryPing();
	}

	// Local Avatar Special FX Loops
	if (window.spkmodAvatarDroppingActive && lunTickCount % 8 === 0) {
		if (typeof window.spkmodEmitDropParticle === 'function') {
			window.spkmodEmitDropParticle();
		}
	}
	if (window.spkmodAvatarHeartDropActive && lunTickCount % 45 === 0) {
		if (gameState.bloomEffects && typeof gameState.bloomEffects.spawnHearts === 'function' && gameState.playerContainer) {
			gameState.bloomEffects.spawnHearts(gameState.playerContainer);
		}
	}

	if (lunTickCount % (lunTPS * 5) === 0 && typeof findBotsRadar === "function") {
		findBotsRadar(true);
	}

	const hp = gameState.myStat.hp || 0;
	const maxHp = gameState.myStat.maxHp || 1;
	const hpRatio = hp / maxHp;

		if (lunFirstPersonActive && gameState.cameraController) {
			gameState.cameraController.cameraZoomDistance = 3;
			gameState.cameraController.cameraPitch = lunFirstPersonPitch;
			if (lunTickCount % 50 === 0) {
				console.log("[SpeakiMod+] First Person Camera Info:", {
					pitch: gameState.cameraController.cameraPitch,
					zoom: gameState.cameraController.cameraZoomDistance,
					yaw: gameState.cameraController.cameraYaw,
					targetY: gameState.cameraController.target?.position?.y,
					camY: gameState.cameraController.camera?.position?.y
				});
			}
		}

		if (lunTrueFirstPersonActive && gameState.cameraController) {
			gameState.cameraController.cameraZoomDistance = 0.05;
		}

		// Speedometer calculation
		if (gameState?.playerContainer) {
			const now = performance.now();
			const currentPos = gameState.playerContainer.position;
			if (!window._lunLastSpeedPos) {
				window._lunLastSpeedPos = { x: currentPos.x, y: currentPos.y, z: currentPos.z, t: now };
			} else {
				const dtSec = (now - window._lunLastSpeedPos.t) / 1000;
				if (dtSec >= 0.08) {
					const dx = currentPos.x - window._lunLastSpeedPos.x;
					const dy = currentPos.y - window._lunLastSpeedPos.y;
					const dz = currentPos.z - window._lunLastSpeedPos.z;
					const dist = Math.hypot(dx, dy, dz);
					const instantSpeed = dist / dtSec;
					lunCurrentSpeedMps = lunCurrentSpeedMps * 0.7 + instantSpeed * 0.3;
					window._lunLastSpeedPos = { x: currentPos.x, y: currentPos.y, z: currentPos.z, t: now };
					if (lunSpeedometerEnabled && lunHudElements.speedometerTracker) {
						setText(lunHudElements.speedometerTracker, t("speedometerText", lunCurrentSpeedMps.toFixed(1)));
					}
				}
			}
		}

	if (lunLowHpWarningEnabled) {
		if (hpRatio <= 0.3) {
			if (lunHudElements.lowHpOverlay.style.opacity !== "1") {
				lunHudElements.lowHpOverlay.style.opacity = "1";
				if (!lunHudElements.lowHpOverlay.classList.contains("spkmod-low-hp-pulse")) {
					lunHudElements.lowHpOverlay.classList.add("spkmod-low-hp-pulse");
				}
			}
		} else if (lunHudElements.lowHpOverlay.style.opacity !== "0") {
			lunHudElements.lowHpOverlay.classList.remove("spkmod-low-hp-pulse");
			lunHudElements.lowHpOverlay.style.opacity = "0";
		}
	}

		window._lunLastHp = window._lunLastHp || hp;
		if (lunGamepadRumbleEnabled && hp < window._lunLastHp && (window._lunLastHp - hp) > (maxHp * 0.05)) {
			try {
				const gp = navigator.getGamepads().find(g => g && g.vibrationActuator);
				if (gp) gp.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: 250, weakMagnitude: 0.8, strongMagnitude: 0.8 });
			} catch (e) {}
		}
		window._lunLastHp = hp;


	if (gameState.chatBubbles && typeof gameState.chatBubbles.show === "function" && !gameState.chatBubbles.__speakiHooked) {
		var hkChatBubblesShow = gameState.chatBubbles.show.bind(gameState.chatBubbles);
		gameState.chatBubbles.show = (e, t, n) => {
			if (lunHideAllOtherPlayers) {
				const isLocal = (e === gameState.playerContainer || e === gameState.localAvatar || e === gameState.myPlayerId);
				const isWhitelisted = typeof isSolitudeWhitelistedBubbleSource === "function" && isSolitudeWhitelistedBubbleSource(e);
				if (!isLocal && !isWhitelisted) return;
			}
			if (lunHideKnownBotsEnabled && isKnownBotBubbleSource(e)) return;
			if (typeof isBlockedUserBubbleSource === 'function' && isBlockedUserBubbleSource(e)) return;
			return hkChatBubblesShow(e, t, filterName(n));
		};
		gameState.chatBubbles.__speakiHooked = true; // 
		console.log("[SpeakiMod+] Successfully hooked chatBubbles.show!");
	}
	var playerExp = gameState.myStat.exp;
	if (typeof playerExp !== "number" || isNaN(playerExp)) return;

	if (window._lunActiveCharacter && window._lunActiveCharacter !== currentNick) {
		window._lunActiveCharacter = currentNick;
		window._lunSessionStartExp = playerExp;
		window._lunSessionStartTime = Date.now();
		lunSessionStartGold = lunLastGold;
		lunSessionStartElif = lunLastElif;
		resetExpTracker();
	} else if (!window._lunActiveCharacter) {
		window._lunActiveCharacter = currentNick;
		if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
			window._lunSessionStartExp = playerExp;
			window._lunSessionStartTime = Date.now();
		}
	}

	if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
		window._lunSessionStartExp = playerExp;
		window._lunSessionStartTime = Date.now();
	}
	var zoneId = gameState.zoneId % 10000;
    
    if (window.lunActiveMinigamePanel && gameState.zoneId !== window.lunMinigameZoneStarted) {
        window.lunActiveMinigamePanel.style.display = '';
        window.lunActiveMinigamePanel.classList.remove('sr-panel--open');
        window.lunActiveMinigamePanel = null;
    }

	var windowSec = lunExpIntervalMinutes * 60;
	var windowTicks = windowSec * lunTPS;

	var sampleIntervalTicks = lunTPS;
	
	var expTrackerL1 = t(lunExpRatePerHour ? "zeroExpPerHour" : "zeroExp");
	var expTrackerL2 = t("nextLevelNA");

	const now = Date.now();
	if (window.lunExpTrackerLastRawExp === undefined) {
		window.lunExpTrackerLastRawExp = playerExp;
		window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;
	}

	let trueGainedThisFrame = playerExp - window.lunExpTrackerLastRawExp;
	if (trueGainedThisFrame < 0) {
		// Leveled up!
		trueGainedThisFrame = (window.lunExpTrackerLastMaxExp - window.lunExpTrackerLastRawExp) + playerExp;
	}
	
	if (trueGainedThisFrame > 20000) {
		window.lunExpTrackerIgnoredExp = (window.lunExpTrackerIgnoredExp || 0) + trueGainedThisFrame;
	}

	window.lunExpTrackerLastRawExp = playerExp;
	window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;

	const currentEffectiveExp = playerExp - (window.lunExpTrackerIgnoredExp || 0);
	
	if (!lunExpTrackerInitialized) {
		lunExpTrackerSamples = [{ time: now, exp: currentEffectiveExp }];
		lunExpTrackerStartExp = playerExp;
		lunExpTrackerLastSampleTick = now;
		lunExpTrackerInitialized = true;
	} else {
		const lastSampleExp = lunExpTrackerSamples[lunExpTrackerSamples.length - 1].exp;
		if (lastSampleExp > currentEffectiveExp) {
			resetExpTracker();
			lunExpTrackerSamples = [{ time: now, exp: playerExp }];
			lunExpTrackerStartExp = playerExp;
			lunExpTrackerLastSampleTick = now;
			lunExpTrackerInitialized = true;
		} else {
			if (now - lunExpTrackerLastSampleTick >= 1000) {
				lunExpTrackerSamples.push({ time: now, exp: currentEffectiveExp });
				lunExpTrackerLastSampleTick = now;
			}
		}
	}

	const windowMs = windowSec * 1000;
	const cutoffTime = now - windowMs;
	while (lunExpTrackerSamples.length > 1 && lunExpTrackerSamples[1].time <= cutoffTime) {
		lunExpTrackerSamples.shift();
	}
	const oldestSample = lunExpTrackerSamples[0];
	const elapsedSec = oldestSample ? Math.max(1, (now - oldestSample.time) / 1000) : 1;
	const expGained = oldestSample ? Math.max(0, currentEffectiveExp - oldestSample.exp) : 0;
	
	const divisor = windowSec;
	lunExpTrackerSpeed = divisor > 0 ? expGained / divisor : 0;
	
	const timerDisplay = (windowSec / 60) + "m avg";

	if (lunExpTrackerSpeed > 0) {
		let displayRate = Math.round(lunExpRatePerHour ? lunExpTrackerSpeed * 3600 : lunExpTrackerSpeed * 60);
		if (displayRate >= 1000000) displayRate = (displayRate / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		else if (displayRate >= 1000) displayRate = (displayRate / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		else displayRate = displayRate.toLocaleString();
		
		expTrackerL1 = t(lunExpRatePerHour ? "expPerHour" : "expPerMinute", displayRate, "");

		var minutesRemaining = (gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60;
		if (minutesRemaining > 60) {
			var hoursRemaining = (minutesRemaining / 60).toFixed(1);
			expTrackerL2 = t("nextLevelHours", hoursRemaining);
		} else {
			expTrackerL2 = t("nextLevel", minutesRemaining.toFixed(0));
		}
	}

	if (gameState.isDead && lunWalkToPortal != -1) {
		resetWalkToPortal();
		chatLog(t("diedMsg"));
	}

	if (window.MoonwalkActive && gameState && gameState.playerContainer) {
		if (window.moonwalkLockedYaw === undefined || window.moonwalkLockedYaw === null) {
			window.moonwalkLockedYaw = gameState.playerContainer.rotation.y;
		}
		gameState.playerContainer.rotation.y = window.moonwalkLockedYaw;
		gameState.moveSendAccumulator = 1;
	}

	if (window.TurntableActive && gameState && gameState.cameraController && !lunCameraLocked) {
		if (window.TurntableActive === 2) {
			if (window._turntableDir === undefined) window._turntableDir = 1;
			if (window._turntableTraveled === undefined) window._turntableTraveled = 0;
			
			const speed = 0.010;
			gameState.cameraController.cameraYaw += speed * window._turntableDir;
			window._turntableTraveled += speed * window._turntableDir;
			
			if (window._turntableTraveled >= Math.PI / 2) {
				window._turntableDir = -1;
			} else if (window._turntableTraveled <= -Math.PI / 2) {
				window._turntableDir = 1;
			}
		} else {
			gameState.cameraController.cameraYaw += 0.015;
		}
	}

	window.shakeBaseAngle = window.shakeBaseAngle || 0;
	if ((window.ShakeActive || window.SuperShakeActive) && gameState && gameState.playerContainer && gameState.cameraController) {
		const currentBaseYaw = gameState.cameraController.cameraYaw;
		const isSuper = !!window.SuperShakeActive;
		const shakeSpeed = isSuper ? 160 : 80;   // Jitter frequency
		const shakeAmount = isSuper ? 0.35 : 0.05; // Jitter amplitude (radians)
		const offset = Math.sin(performance.now() * 0.001 * shakeSpeed) * shakeAmount;

		gameState.playerContainer.rotation.y = currentBaseYaw + offset;
		gameState.moveSendAccumulator = 1;
	}

	if ((window.BeyBladeActive || window.ReverseBeyBladeActive) && gameState.playerContainer) {
		if (!window.beyBladeNextJumpTick) {
			window.beyBladeNextJumpTick = lunTickCount + 50;
		}
		if (lunTickCount >= window.beyBladeNextJumpTick) {
			const nextInterval = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
			window.beyBladeNextJumpTick = lunTickCount + nextInterval;
		}
	} else {
		window.beyBladeNextJumpTick = 0;
	}
	lunAutoTravelTarget = null;
	lunTickCount++;
	lunSleep--;

	setText(lunHudElements.playersNearby, t("playersNearby", gameState.remotePlayers?.remotePlayers?.size ?? 0));
	setText(lunHudElements.zoneId, t("zoneId", zoneId));
	setText(lunHudElements.expTrackerL1, expTrackerL1);
	setText(lunHudElements.expTrackerL2, expTrackerL2);

	if (lunChannelTrackerEnabled && lunMenuFoldingLevel < 2 && lunTickCount >= lunChannelTrackerNextTicks) {
		const token = getAuthToken();
		if (!token) {
			lunChannelTrackerNextTicks = lunTickCount + (5000 / lunTPS);
		} else {
			fetch("https://sr1.overture.io.kr/api/realtime/channels", {
				"method": "GET",
				"headers": {
					"authorization": `Bearer ${token}`
				},
				"mode": "cors"
			}).then(async x => {
				if (!x.ok) {
					setText(lunHudElements.channelTracker, t("channelTrackerError", x.status));
					return;
				}
				var resp = (await x.json());
				if (!Array.isArray(resp)) {
					setText(lunHudElements.channelTracker, t("channelTrackerError", "Format"));
					return;
				}
				var totalPop = resp.reduce((sum, ch) => sum + (ch.population || 0), 0);
				window.__spkmodLastChannelResp = resp;
				window.__spkmodLastTotalPop = totalPop;
				var modLine = (lunModPlayersCounts.count1h !== null)
					? "\n" + t("totalModPlayers", lunModPlayersCounts.count1h)
					: "\n" + t("totalModPlayers", "--");

				setText(lunHudElements.channelTracker,
					resp.map(ch => t("channelTracker", ch.channel, ch.population, ch.capacity)).join("\n")
					+ "\n" + t("totalPlayersOnline", totalPop.toLocaleString())
					+ modLine);
			}).catch(err => {
				console.warn("[SpeakiMod+] Channel tracker fetch failed:", err);
				setText(lunHudElements.channelTracker, t("channelTrackerError", "Net"));
			});

			lunChannelTrackerNextTicks = lunTickCount + lunChannelTrackerWindow;
		}
	}
	if (lunMenuFoldingLevel < 2 && lunTickCount >= lunCurrencyTrackerNextTicks) {
		fetch("https://sr1.overture.io.kr/api/items/inventory", {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			if (!x.ok) {
				setText(lunHudElements.currencyTracker, t("currencyTrackerError", x.status));
				return;
			}

			var resp = (await x.json());
			lunLastGold = resp.find(i => i.itemId === 1)?.quantity ?? 0;
			lunLastElif = resp.find(i => i.itemId === 2)?.quantity ?? 0;
			lunLastSpkCoin = resp.find(i => i.itemId === 5)?.quantity ?? 0;

			const formatCurrency = (num) => {
				if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
				if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
				return num.toLocaleString();
			};

			/*
			// ORIGINAL EVENT CODE - KEEP FOR WHEN EVENT COMES BACK
			setText(lunHudElements.currencyTracker, t("currencyTracker", formatCurrency(lunLastGold), formatCurrency(lunLastElif), formatCurrency(lunLastSpkCoin)));
			*/
			setText(lunHudElements.currencyTracker, t("currencyTracker", formatCurrency(lunLastGold), formatCurrency(lunLastElif), formatCurrency(lunLastSpkCoin)));
			// To disable
			// setText(lunHudElements.currencyTracker, t("currencyTracker", formatCurrency(lunLastGold), formatCurrency(lunLastElif), "").replace(/ \| 🟣.*/, ""));

			if (lunSessionStartGold === null) {
				lunSessionStartGold = lunLastGold;
				window._lunSessionStartTime = window._lunSessionStartTime || Date.now();
			}
			if (lunSessionStartElif === null) {
				lunSessionStartElif = lunLastElif;
			}
			if (lunSessionStartSpkCoin === null) {
				lunSessionStartSpkCoin = lunLastSpkCoin;
			}
			const diff = lunLastGold - lunSessionStartGold;
			const hours = (Date.now() - window._lunSessionStartTime) / 3600000;
			const gph = hours > 0 ? (diff / hours).toFixed(0) : 0;
			const prefix = diff >= 0 ? "+" : "";
			let gphStr = Number(gph).toLocaleString();
			if (Math.abs(gph) >= 1000) {
				gphStr = (gph / 1000).toFixed(1).replace(/\.0$/, '') + "k";
			}
			setText(lunHudElements.sessionGoldTracker, t("sessionGoldText", `${prefix}${diff.toLocaleString()}`, `${prefix}${gphStr}`));
		});

		lunCurrencyTrackerNextTicks = lunTickCount + lunCurrencyTrackerWindow;
	}

	if (lunPinnedQuestId && lunTickCount >= lunPinnedQuestNextQueryTick) {
		lunPinnedQuestNextQueryTick = lunTickCount + lunPinnedQuestInterval;
		const period = lunPinnedQuestPeriod || "daily";
		const token = (typeof window.getNativeAuthToken === "function" ? window.getNativeAuthToken() : "") ||
		              (typeof getAuthToken === "function" ? getAuthToken() : "");
		const headers = {};
		if (token) headers["authorization"] = `Bearer ${token.replace(/^Bearer /i, "")}`;

		const endpoint = window.lunActiveApiEndpoint ||
		                 (window.speakiServerEndpoint ? window.speakiServerEndpoint : "") ||
		                 "https://sr1.overture.io.kr";
		fetch(`${endpoint}/api/quests?period=${period}`, {
			method: "GET",
			headers: headers,
			mode: "cors"
		}).then(async x => {
			if (!x.ok) {
				if (x.status === 404) {
					lunPinnedQuestNextQueryTick = lunTickCount + (lunPinnedQuestInterval * 5);
					if (window.__spkmodCachedQuests && window.__spkmodCachedQuests[lunPinnedQuestId]) {
						updatePinnedQuestDisplay(window.__spkmodCachedQuests[lunPinnedQuestId]);
					}
					return;
				}
				console.warn(`[SpeakiMod+] Pinned quest query returned HTTP ${x.status}`);
				return;
			}
			const resp = await x.json();
			if (!Array.isArray(resp)) return;
			const q = resp.find(t => String(t.questId) === String(lunPinnedQuestId));
			if (!q || q.isClaimed) {
				unpinQuest();
				return;
			}
			updatePinnedQuestDisplay(q);
		}).catch(err => {
			lunPinnedQuestNextQueryTick = lunTickCount + (lunPinnedQuestInterval * 2);
		});
	}

	if ((lunMinigameTrackerEnabled || (lunHudElements.eventModal && !lunHudElements.eventModal.classList.contains("hidden")) || (lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden"))) && lunTickCount >= lunMinigameTrackerNextTicks) {
		fetchMinigameStatus();
		lunMinigameTrackerNextTicks = lunTickCount + lunMinigameTrackerWindow;
	}


window.spkmodForceNametagRedraw = function() {
	if (typeof gameState === 'undefined' || !gameState) return;

	const redrawAvatar = (entity) => {
		if (!entity || !entity.avatar || typeof entity.avatar.setLabel !== 'function') return;
		hookAvatarLabel(entity);
		if (entity.info && entity.info.name) {
			const lvl = entity.info.__spkmodOrigLevel || entity.info.level || 1;
			entity.avatar.setLabel("LV" + lvl + " " + entity.info.name);
		} else if (typeof entity.avatar.__spkmodLastRawLabel === "string" && entity.avatar.__spkmodLastRawLabel) {
			entity.avatar.setLabel(entity.avatar.__spkmodLastRawLabel);
		}
	};

	if (gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
		gameState.remotePlayers.remotePlayers.forEach(redrawAvatar);
	}
	if (gameState.remotePetRegistry && gameState.remotePetRegistry.pets) {
		gameState.remotePetRegistry.pets.forEach(redrawAvatar);
	}
	if (gameState.remoteDroneCoreRegistry && gameState.remoteDroneCoreRegistry.droneCores) {
		gameState.remoteDroneCoreRegistry.droneCores.forEach(redrawAvatar);
	}

	const lvl = (gameState.myStat && gameState.myStat.level) ? gameState.myStat.level : 1;
	const name = (gameState.myPlayerName || (gameState.myStat && gameState.myStat.name)) || "";
	if (gameState.playerContainer && gameState.playerContainer.avatar && typeof gameState.playerContainer.avatar.setLabel === 'function') {
		hookAvatarLabel(gameState.playerContainer, gameState.playerContainer);
		if (name) gameState.playerContainer.avatar.setLabel("LV" + lvl + " " + name);
	}
	if (gameState.localAvatar && typeof gameState.localAvatar.setLabel === 'function') {
		hookAvatarLabel({ avatar: gameState.localAvatar, container: gameState.playerContainer, isLocalPlayer: true }, gameState.playerContainer);
		if (name) gameState.localAvatar.setLabel("LV" + lvl + " " + name);
	}
};

function hookAvatarLabel(entity, explicitContainer) {
	if (!entity || !entity.avatar) return;
	const avatar = entity.avatar;
	if (typeof avatar.setLabel !== 'function' || avatar.__spkmodLabelPatched) return;

	const resolveContainer = () => explicitContainer || entity.container || entity.root || avatar.root || (typeof entity.traverse === 'function' ? entity : null);

	const origSetLabel = avatar.setLabel;
	avatar.setLabel = function(text, ...args) {
		if (typeof text === 'string' && text.length > 0 && (!lunHidePlayerLevels || text.startsWith("LV"))) {
			avatar.__spkmodLastRawLabel = text;
		}
		if (lunHidePlayerLevels && typeof text === 'string' && text.startsWith("LV")) {
			const spaceIdx = text.indexOf(" ");
			if (spaceIdx !== -1) {
				text = text.substring(spaceIdx + 1); // remove "LVxxx "
			}
		}

		try {
			const targetContainer = resolveContainer();
			if (targetContainer && typeof targetContainer.traverse === 'function') {
				targetContainer.traverse(obj => {
					// Position check ensures we only hit the floating nametag sprite above the player
					if (obj && obj.isSprite && obj.material && obj.material.map && obj.position && obj.position.y > 1.0) {
						obj.material.map.dispose();

						if (obj.material.map.image && typeof obj.material.map.image.getContext === 'function') {
							const ctx = obj.material.map.image.getContext('2d');
							ctx.clearRect(0, 0, obj.material.map.image.width, obj.material.map.image.height);
						}
					}
				});
			}
		} catch(e) {}

		return origSetLabel.call(this, text, ...args);
	};
	avatar.__spkmodLabelPatched = true;

	// Force redraw with current text if level-hiding or a custom font is active
	if (lunHidePlayerLevels || (typeof lunFontPreset !== "undefined" && lunFontPreset !== "default")) {
		if (entity.info && entity.info.name) {
			const lvl = entity.info.__spkmodOrigLevel || entity.info.level || 1;
			avatar.setLabel("LV" + lvl + " " + entity.info.name);
		} else if (entity === gameState.playerContainer || entity.isLocalPlayer) {
			const lvl = (gameState.myStat && gameState.myStat.level) ? gameState.myStat.level : 1;
			const name = (gameState.myPlayerName || (gameState.myStat && gameState.myStat.name)) || "";
			if (name) avatar.setLabel("LV" + lvl + " " + name);
		}
	}
}


	if (lunPanelElements.renameLevelInput && lunPanelElements.renameLevelInput.style.display === "none") {
		let isVip = false;
		const playerName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
		if (playerName) {
			const n = playerName.toLowerCase();
			isVip = n === "glas" || n === "sp1cky" || n === "gmdt" || n === "peiyu" || n === "obagi";
			if (isVip) {
				lunPanelElements.renameLevelInput.style.display = "";
			}
		}
	}

	if (lunNametagMode === 2 || lunFriendChatHighlightEnabled) {
		fetchFriendsList();
	}

	if (gameState.playerContainer && gameState.playerContainer.avatar) {
		hookAvatarLabel(gameState.playerContainer, gameState.playerContainer);
	}
	if (gameState.localAvatar && typeof gameState.localAvatar.setLabel === 'function') {
		hookAvatarLabel({ avatar: gameState.localAvatar, container: gameState.playerContainer, isLocalPlayer: true }, gameState.playerContainer);
	}

	let partyNames = null;
	if (gameState?.remotePlayers?.remotePlayers) {
		gameState.remotePlayers.remotePlayers.forEach(t => {
			if (t.avatar) hookAvatarLabel(t);
			if (!t.container) return;

			delete t.container.__spkmodNametagSprite;

			let shouldBeVisible = true;
			if (lunNametagMode === 0) {
				shouldBeVisible = true;
			} else if (lunNametagMode === 3) {
				shouldBeVisible = false;
			} else if (lunNametagMode === 1) {
				if (partyNames === null) {
					partyNames = new Set(Array.from(gameState?.partyMemberNamesBySlot?.values?.() ?? []).map(name => String(name ?? "").trim().toLowerCase()).filter(Boolean));
				}
				const pName = (t.info?.name || "").trim().toLowerCase();
				const origName = (t.info?.__spkmodOrigName || "").trim().toLowerCase();
				shouldBeVisible = partyNames.has(pName) || (Boolean(origName) && partyNames.has(origName));
			} else if (lunNametagMode === 2) {
				const pName = (t.info?.name || "").trim().toLowerCase();
				const origName = (t.info?.__spkmodOrigName || "").trim().toLowerCase();
				shouldBeVisible = lunFriendNicknames.has(pName) || (Boolean(origName) && lunFriendNicknames.has(origName));
			}

			if (typeof t.container.traverse === "function") {
				t.container.traverse(obj => {
					if (obj && obj.isSprite) {
						if (typeof hookSpritePrototypeOnce === "function") hookSpritePrototypeOnce(obj);
						if (obj.position && obj.position.y > 0.5) {
							obj.visible = shouldBeVisible;
						}
					}
				});
			}
		});
	}
	updateKnownBotVisibility();
	hookKnownBotHeartEmotes();
	hookKnownBotPlayerEmotesForAll();
	if (typeof hookBlockedUserVoice === "function") hookBlockedUserVoice();
	if (((typeof lunChromaKeyColor !== "undefined" && lunChromaKeyColor !== "none") || (typeof lunChromaFloorShape !== "undefined" && lunChromaFloorShape !== "off")) && typeof maintainChromaKeyColor === "function") {
		if (lunTickCount % 20 === 0) {
			maintainChromaKeyColor();
		}
	}
	if (typeof maintainLockedFacialExpression === "function") {
		maintainLockedFacialExpression();
	}

	if (gameState && gameState.myStat) {
		const currentLevel = gameState.myStat.level;
		const currentName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
		if (window._lunLastLevel !== currentLevel || window._lunLastName !== currentName) {
			window._lunLastLevel = currentLevel;
			window._lunLastName = currentName;
			updateDynamicStyles();
			if (typeof updateHudBgDropdown === "function") updateHudBgDropdown();
		}
	}

	

	if (lunWalkToPortal != -1 && zoneId) {
		const startZone = (zoneId - 0) % 10000;
		const endZone = (lunWalkToPortal - 0) % 10000;
		
		let path = null;
		if (startZone === endZone) {
			path = [];
		} else {
			let queue = [startZone];
			let visited = new Set();
			visited.add(startZone);
			let parentMap = {};
			
			while (queue.length > 0) {
				let curr = queue.shift();
				if (curr === endZone) {
					path = [];
					let trace = endZone;
					while (trace !== startZone) {
						path.unshift(trace);
						trace = parentMap[trace];
					}
					break;
				}
				let neighbors = Portals[curr];
				if (neighbors) {
					for (let n in neighbors) {
						let nz = parseInt(n);
						if (!visited.has(nz)) {
							visited.add(nz);
							parentMap[nz] = curr;
							queue.push(nz);
						}
					}
				}
			}
		}

		if (path === null) {
			chatLog(t("noPathMsg", startZone, -1, endZone, -1));
			resetWalkToPortal();
			return;
		}

		if (path.length === 0) {
			resetWalkToPortal();
			chatLog(t("arrivedMsg"));
			return;
		} else {
			const targetZone = path[0];

			const portals = Portals[zoneId];
			if (!portals) {
				resetWalkToPortal();
				chatLog(t("noPortalsMsg"));
				return;
			}

			const targetPortal = portals[targetZone];
			if (!targetPortal) {
				resetWalkToPortal();
				chatLog(t("missingPortalMsg"));
				return;
			}

			const wps = Waypoints[zoneId];
			if (wps) {
				const wp = wps.find(t => !t.crossed);
				if (wp) {
					if (distanceToVector(wp) > 2) {
						lunAutoTravelTarget = wp;
						return;
					} else {
						wp.crossed = true;
					}
				}
			}

			lunAutoTravelTarget = targetPortal.pos;


			const dvk = distanceToVector(lunAutoTravelTarget);
			if (dvk < 2.9) {
				if (lunSleep < 0) {
					gameState.tryUsePortal()
					lunSleep = sec(0.5);
				}

				if (dvk <= 1.5) // humanize
					lunAutoTravelTarget = null;
			}
		}
	}
}

let lunChatScrollEl = null;
let lunChatUserScrolledUp = false;

function getChatScrollContainer() {
	const log = document.querySelector(".sr-chatbox__log");
	if (!log) return null;
	if (log.scrollHeight > log.clientHeight || log.scrollTop > 0) return log;
	if (log.parentElement && (log.parentElement.scrollHeight > log.parentElement.clientHeight || log.parentElement.scrollTop > 0)) {
		return log.parentElement;
	}
	return log;
}

function updateChatScrollTracking() {
	const el = getChatScrollContainer();
	if (el && el !== lunChatScrollEl) {
		lunChatScrollEl = el;
		lunChatScrollEl.addEventListener("scroll", () => {
			const distFromBottom = lunChatScrollEl.scrollHeight - lunChatScrollEl.scrollTop - lunChatScrollEl.clientHeight;
			lunChatUserScrolledUp = distFromBottom > 45;
		}, { passive: true });
	}
	return el;
}

var hkChatBoxAppend = (id, name, msg) => {
	if (window.__speakiOrigChatBoxAppend) return window.__speakiOrigChatBoxAppend(id, name, msg);
	if (typeof gameState !== "undefined" && gameState?.chatBox?.append) return gameState.chatBox.append(id, name, msg);
};
