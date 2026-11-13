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
	if (typeof syncFaintButtonsForZone === "function") {
		syncFaintButtonsForZone(zoneId);
	}
    
    if (window.lunActiveMinigamePanel && gameState.zoneId !== window.lunMinigameZoneStarted) {
        window.lunActiveMinigamePanel.style.display = '';
        window.lunActiveMinigamePanel.classList.remove('sr-panel--open');
        window.lunActiveMinigamePanel = null;
    }

    var windowSec = lunExpIntervalMinutes * 60;

    var expTrackerL1 = lunExpTrackerDisplayL1 ?? t(lunExpRatePerHour ? "zeroExpPerHour" : "zeroExp");
    var expTrackerL2 = lunExpTrackerDisplayL2 ?? t("nextLevelNA");

    const now = Date.now();

    if (window.lunExpTrackerLastRawExp === undefined) {
        window.lunExpTrackerLastRawExp = playerExp;
        window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;
		window.lunExpTrackerLevelCarry = 0;
    }

	const previousRawExp = window.lunExpTrackerLastRawExp;
    const previousMaxExp = Number(window.lunExpTrackerLastMaxExp) || 0;
    let trueGainedThisFrame = playerExp - previousRawExp;

    if (trueGainedThisFrame < 0) {
        trueGainedThisFrame = (previousMaxExp - previousRawExp) + playerExp;
        window.lunExpTrackerLevelCarry += previousMaxExp;
    }

    if (trueGainedThisFrame > 20000) {
        window.lunExpTrackerIgnoredExp = (window.lunExpTrackerIgnoredExp || 0) + trueGainedThisFrame;
    }

    window.lunExpTrackerLastRawExp = playerExp;
    window.lunExpTrackerLastMaxExp = gameState.myStat.maxExp;

    const currentEffectiveExp = window.lunExpTrackerLevelCarry + playerExp - (window.lunExpTrackerIgnoredExp || 0);

    if (!lunExpTrackerInitialized) {
        lunExpTrackerSamples = [{ time: now, exp: currentEffectiveExp }];
        lunExpTrackerStartExp = currentEffectiveExp;
        lunExpTrackerLastSampleTick = now;
        lunExpTrackerInitialized = true;
    } else {
        const lastSampleExp = lunExpTrackerSamples[lunExpTrackerSamples.length - 1].exp;

        if (lastSampleExp > currentEffectiveExp) {
            lunExpTrackerSamples = [{ time: now, exp: currentEffectiveExp }];
            lunExpTrackerStartExp = currentEffectiveExp;
            lunExpTrackerLastSampleTick = now;
            lunExpTrackerLastCalculationTime = 0;
            lunExpTrackerDisplayL1 = null;
            lunExpTrackerDisplayL2 = null;
        } else if (now - lunExpTrackerLastSampleTick >= 1000) {
            lunExpTrackerSamples.push({ time: now, exp: currentEffectiveExp });
            lunExpTrackerLastSampleTick = now;
        }
    }

    if (now - lunExpTrackerLastCalculationTime >= 1000) {
        lunExpTrackerLastCalculationTime = now;

        const windowMs = windowSec * 1000;
        const cutoffTime = now - windowMs;

        while (lunExpTrackerSamples.length > 1 && lunExpTrackerSamples[1].time <= cutoffTime) {
            lunExpTrackerSamples.shift();
        }

        const oldestSample = lunExpTrackerSamples[0];
        const expGained = oldestSample ? Math.max(0, currentEffectiveExp - oldestSample.exp) : 0;

        lunExpTrackerSpeed = windowSec > 0 ? expGained / windowSec : 0;

        let nextL1 = t(lunExpRatePerHour ? "zeroExpPerHour" : "zeroExp");
        let nextL2 = t("nextLevelNA");

        if (lunExpTrackerSpeed > 0) {
            let displayRate = Math.round(lunExpRatePerHour ? lunExpTrackerSpeed * 3600 : lunExpTrackerSpeed * 60);

            if (displayRate >= 1000000) {
                displayRate = (displayRate / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
            } else if (displayRate >= 1000) {
                displayRate = (displayRate / 1000).toFixed(1).replace(/\.0$/, "") + "k";
            } else {
                displayRate = displayRate.toLocaleString();
            }

            nextL1 = t(lunExpRatePerHour ? "expPerHour" : "expPerMinute", displayRate, "");

            const minutesRemaining = (gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60;

            if (minutesRemaining > 60) {
                const hoursRemaining = (minutesRemaining / 60).toFixed(1);
                nextL2 = t("nextLevelHours", hoursRemaining);
            } else {
                nextL2 = t("nextLevel", minutesRemaining.toFixed(0));
            }
        }

        lunExpTrackerDisplayL1 = nextL1;
        lunExpTrackerDisplayL2 = nextL2;
    }

    expTrackerL1 = lunExpTrackerDisplayL1 ?? expTrackerL1;
    expTrackerL2 = lunExpTrackerDisplayL2 ?? expTrackerL2;

	if (gameState.isDead && lunWalkToPortal != -1) {
		resetWalkToPortal();
		chatLog(t("diedMsg"));
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
	
	if (isSpkmodBeyBladeActive()) {
    	ensureBeyBladeRenderLoop();
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
			const resp = await spkmodReadQuestResponseJson(x);
			if (!Array.isArray(resp)) return;
			const q = resp.find(t => String(t.questId) === String(lunPinnedQuestId));
			if (!q || q.isClaimed) {
				unpinQuest();
				return;
			}
			updatePinnedQuestDisplay(spkmodCacheQuestRecord(q, period));
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

	hookKnownBotHeartEmotes();
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
		
		const path = getSpkmodPortalPath(startZone, endZone);

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


// ============================================================================
// 100-DAY ANNIVERSARY CHAT COMMANDS & VIP AUTHORIZATION
// ============================================================================

const SPKMOD_ANNIVERSARY_I18N = {
	en: "📢 [Anniversary] A special show will begin in {0} minutes in channel 1 throne room!",
	es: "📢 [Aniversario] ¡Un espectáculo especial comenzará en {0} minutos en la sala del trono del canal 1!",
	"es-419": "📢 [Aniversario] ¡Un espectáculo especial comenzará en {0} minutos en la sala del trono del canal 1!",
	ja: "📢 [記念イベント] 特別なショーがチャンネル1の玉座の間で{0}分後に始まります！",
	ko: "📢 [기념일] 1채널 알현실에서 {0}분 후에 특별 쇼가 시작됩니다!",
	zh: "📢 [周年庆] 特别节目将在1频道的王座之厅于{0}分钟后开始！",
	"zh-CN": "📢 [周年庆] 特别节目将在1频道的王座之厅于{0}分钟后开始！",
	"zh-TW": "📢 [週年慶] 特別節目將在1頻道的王座之廳於{0}分鐘後開始！",
	pt: "📢 [Aniversário] Um show especial começará em {0} minutos na sala do trono do canal 1!",
	"pt-BR": "📢 [Aniversário] Um show especial começará em {0} minutos na sala do trono do canal 1!",
	fr: "📢 [Anniversaire] Un spectacle spécial commencera dans {0} minutes dans la salle du trône du canal 1 !",
	de: "📢 [Jubiläum] Eine Sondershow beginnt in {0} Minuten im Thronsaal von Kanal 1!",
	ru: "📢 [Юбилей] Специальное шоу начнется через {0} минут в тронном зале канала 1!"
};

function spkmodIsVipUser(playerName) {
	if (!playerName) return false;
	const n = String(playerName).toLowerCase().trim();
	return n === "glas" || n === "sp1cky" || n === "gmdt" || n === "peiyu" || n === "obagi";
}
window.spkmodIsVipUser = spkmodIsVipUser;

function spkmodMatchesTarget(targetName) {
	if (!targetName || targetName === "all" || targetName === "*") return true;
	const myName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
	return myName.toLowerCase().trim() === targetName.toLowerCase().trim();
}

function spkmodSetNightMode(enabled = true) {
	const shouldEnable = !!enabled;
	let applied = false;

	// 1. Native game engine settings update (updates shaders, lighting, sky)
	if (typeof window.updateGameSettings === "function") {
		try {
			window.updateGameSettings({ nightModeEnabled: shouldEnable });
			applied = true;
		} catch (err) {
			console.warn("[SpeakiMod] Failed to call updateGameSettings for nightMode:", err);
		}
	}

	// 2. Sync DOM settings checkbox if present
	const rows = document.querySelectorAll(".sr-panel__row");
	for (const row of rows) {
		const checkbox = row.querySelector("input[type='checkbox']");
		const span = row.querySelector("span");
		if (checkbox && span) {
			const txt = (span.innerText || "").toLowerCase();
			if (
				txt.includes("night") ||
				txt.includes("darker") ||
				txt.includes("밤") ||
				txt.includes("야간") ||
				txt.includes("夜") ||
				txt.includes("noche") ||
				txt.includes("noite")
			) {
				if (checkbox.checked !== shouldEnable) {
					checkbox.checked = shouldEnable;
					try {
						checkbox.dispatchEvent(new Event("change", { bubbles: true }));
					} catch (_) {
						checkbox.click();
					}
				}
				applied = true;
				break;
			}
		}
	}

	window._spkmodNightModeState = shouldEnable;
	return applied;
}
window.spkmodSetNightMode = spkmodSetNightMode;

function spkmodToggleNightMode() {
	let isCurrentlyNight = false;
	if (typeof window.getGameSettings === "function") {
		try {
			const s = window.getGameSettings();
			if (s && typeof s.nightModeEnabled === "boolean") {
				isCurrentlyNight = s.nightModeEnabled;
			}
		} catch (_) {}
	} else if (typeof window._spkmodNightModeState === "boolean") {
		isCurrentlyNight = window._spkmodNightModeState;
	} else {
		const rows = document.querySelectorAll(".sr-panel__row");
		for (const row of rows) {
			const checkbox = row.querySelector("input[type='checkbox']");
			const span = row.querySelector("span");
			if (checkbox && span) {
				const txt = (span.innerText || "").toLowerCase();
				if (
					txt.includes("night") ||
					txt.includes("darker") ||
					txt.includes("밤") ||
					txt.includes("야간") ||
					txt.includes("夜") ||
					txt.includes("noche") ||
					txt.includes("noite")
				) {
					isCurrentlyNight = !!checkbox.checked;
					break;
				}
			}
		}
	}

	const nextState = !isCurrentlyNight;
	spkmodSetNightMode(nextState);
	if (typeof chatLog === "function") {
		chatLog(nextState ? "🌙 Native Night Mode: ON" : "☀️ Native Night Mode: OFF");
	}
	return nextState;
}
window.spkmodToggleNightMode = spkmodToggleNightMode;

function spkmodHandleAnniversaryCommand(rawMsg, senderName) {
	let clean = rawMsg.trim();
	if (clean.startsWith("!") || clean.startsWith("/")) clean = clean.substring(1);
	clean = clean.replace(/^:av/, "ani").replace(/^:ani/, "ani").replace(/:$/, "");

	const parts = clean.split(/\s+/);
	let mainCmd = (parts[0] || "").toLowerCase();
	let subCmd = (parts[1] || "").toLowerCase();
	let extraArgs = parts.slice(2);

	if (mainCmd === "ani") {
		mainCmd = subCmd;
		subCmd = (extraArgs[0] || "").toLowerCase();
		extraArgs = extraArgs.slice(1);
	} else if (mainCmd.startsWith("ani")) {
		mainCmd = mainCmd.substring(3);
	}

	// 1. Pre-show announcement (e.g. !ani pre 10, !ani pre [player], !ani1 10)
	if (mainCmd === "pre" || mainCmd === "alert" || mainCmd === "1") {
		let minutes = 10;
		let target = null;
		if (/^\d+$/.test(subCmd)) {
			minutes = parseInt(subCmd, 10) || 10;
			target = extraArgs[0] || null;
		} else if (subCmd) {
			target = subCmd;
		}

		if (!spkmodMatchesTarget(target)) return;

		const lang = (typeof spkmodLang !== "undefined" && spkmodLang) || "en";
		const template = SPKMOD_ANNIVERSARY_I18N[lang] || SPKMOD_ANNIVERSARY_I18N.en;
		const alertText = template.replace("{0}", minutes);

		appendColoredChatLine(-1337, "Anniversary", alertText, "#ffd700");
		if (typeof playPingSound === "function") playPingSound();
		return;
	}

	// 2. Movie / Cinema Lockdown (e.g. !ani movie, !ani lock, !ani73)
	if (mainCmd === "movie" || mainCmd === "cinema" || mainCmd === "lock" || mainCmd === "video" || mainCmd === "73") {
		if (subCmd === "resume" || subCmd === "unlock" || subCmd === "off" || subCmd === "stop") {
			const target = extraArgs[0] || null;
			if (!spkmodMatchesTarget(target)) return;
			if (typeof window.spkmodSetCinemaAnniversaryLock === "function") {
				window.spkmodSetCinemaAnniversaryLock(false);
			}
			appendColoredChatLine(-1337, "Anniversary", "🎬 [Anniversary] Theater broadcast resumed.", "#70e28f");
			return;
		}

		const target = subCmd || null;
		if (!spkmodMatchesTarget(target)) return;

		if (typeof window.spkmodSetCinemaAnniversaryLock === "function") {
			window.spkmodSetCinemaAnniversaryLock(true);
		}
		spkmodSetNightMode(true);
		appendColoredChatLine(-1337, "Anniversary", "🎬 [Anniversary] Special broadcast started!", "#ffc94a");
		return;
	}

	// 3. Resume / Unlock (e.g. !ani resume, !ani unlock)
	if (mainCmd === "resume" || mainCmd === "unlock" || mainCmd === "off") {
		const target = subCmd || null;
		if (!spkmodMatchesTarget(target)) return;

		if (typeof window.spkmodSetCinemaAnniversaryLock === "function") {
			window.spkmodSetCinemaAnniversaryLock(false);
		}
		appendColoredChatLine(-1337, "Anniversary", "🎬 [Anniversary] Theater broadcast resumed.", "#70e28f");
		return;
	}

	// 4. Fireworks show (e.g. !ani fire, !ani fire2, !ani fireworks, !ani80)
	const isFire2 = (mainCmd === "fire2" || mainCmd === "firework2" || mainCmd === "fireworks2" || mainCmd === "fw2");
	if (mainCmd === "fire" || mainCmd === "firework" || mainCmd === "fireworks" || mainCmd === "fw" || mainCmd === "80" || isFire2) {
		if (subCmd === "stop" || subCmd === "off") {
			const target = extraArgs[0] || null;
			if (!spkmodMatchesTarget(target)) return;

			if (typeof window.spkmodStopCinemaFireworks === "function") {
				window.spkmodStopCinemaFireworks();
			}
			appendColoredChatLine(-1337, "Anniversary", "🎆 [Anniversary] Fireworks show stopped.", "#ff8888");
			return;
		}

		const target = subCmd || null;
		if (!spkmodMatchesTarget(target)) return;

		const showIndex = isFire2 ? "1" : "0";
		if (typeof window.spkmodLaunchCinemaFireworks === "function") {
			window.spkmodLaunchCinemaFireworks(true, showIndex);
		}
		spkmodSetNightMode(true);
		appendColoredChatLine(-1337, "Anniversary", `🎆 [Anniversary] Fireworks show${isFire2 ? " #2" : ""} started!`, "#ff70d9");
		return;
	}

	// 5. Stop Fireworks shortcut (e.g. !ani stopfire)
	if (mainCmd === "stopfire" || mainCmd === "stopfw") {
		const target = subCmd || null;
		if (!spkmodMatchesTarget(target)) return;

		if (typeof window.spkmodStopCinemaFireworks === "function") {
			window.spkmodStopCinemaFireworks();
		}
		appendColoredChatLine(-1337, "Anniversary", "🎆 [Anniversary] Fireworks show stopped.", "#ff8888");
		return;
	}

	// 6. Remove / Add Cinema screen on demand (e.g. !ani removecinema, !ani addcinema, !ani screen on/off)
	const isRemoveCinema = (mainCmd === "removecinema" || mainCmd === "delcinema" || mainCmd === "hidecinema" || mainCmd === "nocinema" || mainCmd === "screenoff");
	const isAddCinema = (mainCmd === "addcinema" || mainCmd === "showcinema" || mainCmd === "screenon");
	if (isRemoveCinema || isAddCinema || mainCmd === "screen") {
		let desiredState = isAddCinema ? true : (isRemoveCinema ? false : null);
		let target = null;

		if (mainCmd === "screen") {
			if (subCmd === "off" || subCmd === "remove" || subCmd === "hide" || subCmd === "disable" || subCmd === "del") {
				desiredState = false;
				target = extraArgs[0] || null;
			} else if (subCmd === "on" || subCmd === "add" || subCmd === "show" || subCmd === "enable") {
				desiredState = true;
				target = extraArgs[0] || null;
			} else {
				target = subCmd || null;
				desiredState = !(window.spkmodCinemaConfig && window.spkmodCinemaConfig.enabled);
			}
		} else {
			target = subCmd || null;
		}

		if (!spkmodMatchesTarget(target)) return;

		if (typeof window.spkmodSetCinemaEnabled === "function") {
			window.spkmodSetCinemaEnabled(desiredState, true, false);
		}
		appendColoredChatLine(
			-1337,
			"Anniversary",
			desiredState ? "🎬 [Anniversary] Cinema screen added." : "🎬 [Anniversary] Cinema screen removed.",
			desiredState ? "#70e28f" : "#ff8888"
		);
		return;
	}
}
