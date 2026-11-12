function hookGameStateOnce() {
	if (typeof gameState === "undefined" || !gameState) return false;
	if (gameState.__speakiGameStateHooked) return true;
	gameState.__speakiGameStateHooked = true;
	window.__gameStateHooked = true;
	if (window.spkmodDebug) spkmodDebug.log("Initializing in-game GameState hooks...");

	if (typeof spkmodEnsureCartWatcher === "function") {
		spkmodEnsureCartWatcher();
	}

	if (typeof gameState.handleQuestProgress === "function" && !gameState.__speakiQuestProgressHooked) {
		gameState.__speakiQuestProgressHooked = true;
		const origHandleQuestProgress = gameState.handleQuestProgress.bind(gameState);
		gameState.handleQuestProgress = function(e) {
			try {
				if (e && Array.isArray(e.quests)) {
					for (const n of e.quests) {
						if (window.__spkmodCachedQuests && window.__spkmodCachedQuests[n.questId]) {
							const cached = window.__spkmodCachedQuests[n.questId];
							if (n.currentAmount !== undefined) cached.currentAmount = n.currentAmount;
							if (n.targetAmount !== undefined) cached.targetAmount = n.targetAmount;
							if (cached.currentAmount >= cached.targetAmount) cached.isCompleted = true;
						}
						if (typeof updateQuestChecklistProgress === "function") {
							updateQuestChecklistProgress(n.questId, n.currentAmount, n.targetAmount);
						}
						if (lunPinnedQuestId && String(n.questId) === String(lunPinnedQuestId)) {
							const cur = n.currentAmount ?? 0;
							const tgt = n.targetAmount ?? 1;
							if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.content) {
								const regex = /\d+\s*\/\s*\d+$/;
								if (regex.test(lunPinnedQuestContent || "")) {
									lunPinnedQuestContent = lunPinnedQuestContent.replace(regex, `${cur}/${tgt}`);
									setText(lunHudElements.pinnedQuest.content, lunPinnedQuestContent);
								} else {
									updatePinnedQuestDisplay({ questId: n.questId, currentAmount: cur, targetAmount: tgt });
								}
							}
							if (lunHudElements && lunHudElements.pinnedQuest && lunHudElements.pinnedQuest.pbar) {
								const pct = Math.min(100, Math.max(0, (cur / tgt) * 100));
								lunHudElements.pinnedQuest.pbar.style.width = `${pct.toFixed(0)}%`;
							}
						}
					}
				}
			} catch (err) {
				console.warn("[SpeakiMod+] Error in gameState quest progress hook:", err);
			}
			return origHandleQuestProgress(e);
		};
	}

	if (gameState.combatAssist && typeof gameState.combatAssist.update === "function" && !gameState.combatAssist.__speakiHooked) {
		const origCombatAssistUpdate = gameState.combatAssist.update.bind(gameState.combatAssist);
		gameState.combatAssist.update = (e) => {
			if (lunAutoTravelTarget) {
				const pp = getPlayerPos();
				return {
					moveDir: normalizeVector(
						lunAutoTravelTarget.x - pp.x,
						lunAutoTravelTarget.z - pp.z
					),
					castSkillId: null
				};
			}

			let baseMove = origCombatAssistUpdate(e);
			
			if (lunDroneModeActive) {
				return { moveDir: { x: 0, z: 0 }, castSkillId: null };
			}
			
			if (gamepadMoveVector) {
				return {
					moveDir: gamepadMoveVector,
					castSkillId: null
				};
			}

			if (window.RitualState > 0 && ritualCenter) {
				const pp = getPlayerPos();
				const dx = pp.x - ritualCenter.x;
				const dz = pp.z - ritualCenter.z;
				let currentAngle = Math.atan2(dx, dz);

				currentAngle += (window.RitualState === 2 ? -0.045 : 0.045);

				const targetX = ritualCenter.x + Math.sin(currentAngle) * RITUAL_RADIUS;
				const targetZ = ritualCenter.z + Math.cos(currentAngle) * RITUAL_RADIUS;

				ritualEmoteTick++;
				if (ritualEmoteTick % 30 === 0) {
					if (ritualEmoteTick % 60 === 0) {
						if (typeof spkmodPerformJump === "function") {
							spkmodPerformJump();
						} else if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Jump);
						}
					} else {
						triggerHearts();
					}
				}

				return {
					moveDir: normalizeVector(targetX - pp.x, targetZ - pp.z),
					castSkillId: null
				};
			}

			if (window.PartnerDanceState > 0 && partnerDanceCenter) {
				const pp = getPlayerPos();
				partnerDanceTick++;
				
				const stateDir = window.PartnerDanceState === 1 ? 1 : -1;
				const phase = partnerDanceIsClockwise ? 0 : Math.PI;
				const scale = DANCE_RADIUS * 1.5;
				
				if (typeof window.pd_t === "undefined" || window.pd_reset) {
					window.pd_t = phase;
					window.pd_lastPos = { x: pp.x, z: pp.z };
					window.pd_reset = false;
				}
				
				const distMoved = Math.hypot(pp.x - window.pd_lastPos.x, pp.z - window.pd_lastPos.z);
				window.pd_lastPos = { x: pp.x, z: pp.z };
				
				let t_advance = distMoved * 0.4;
				if (t_advance < 0.01) t_advance = 0.01;
				
				window.pd_t += t_advance * stateDir;
				
				const t_target = window.pd_t + (0.8 * stateDir);
				
				const rawX_target = (scale * Math.cos(t_target)) / (1 + Math.pow(Math.sin(t_target), 2));
				const rawZ_target = (scale * Math.sin(t_target) * Math.cos(t_target)) / (1 + Math.pow(Math.sin(t_target), 2));
				
				const targetX = partnerDanceCenter.x + rawX_target;
				const targetZ = partnerDanceCenter.z + rawZ_target;
				
				if (partnerDanceTick % 40 === 0) {
					if (partnerDanceTick % 80 === 0) {
						if (typeof spkmodPerformJump === "function") {
							spkmodPerformJump();
						} else if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Jump);
						}
					} else {
						triggerHearts();
					}
				}

				return {
					moveDir: normalizeVector(targetX - pp.x, targetZ - pp.z),
					castSkillId: null
				};
			}

			if (lunFollowTargetName && gameState.remotePlayers && gameState.remotePlayers.remotePlayers) {
				const targetPlayer = Array.from(gameState.remotePlayers.remotePlayers.values()).find(t => t.info && (t.info.name === lunFollowTargetName || t.info.__spkmodOrigName === lunFollowTargetName));
				if (targetPlayer && targetPlayer.container) {
					const pp = getPlayerPos();
					const tp = targetPlayer.container.position;
					const dist = Math.hypot(tp.x - pp.x, tp.z - pp.z);
					if (dist > 2.2) {
						return {
							moveDir: normalizeVector(tp.x - pp.x, tp.z - pp.z),
							castSkillId: null
						};
					}
				} else {
					followPlayer(null);
				}
			}

			return baseMove;
		};
		gameState.combatAssist.__speakiHooked = true;
	}

	if (gameState.cameraController && typeof gameState.cameraController.computeCameraTargetPosition === "function" && !gameState.cameraController.__speakiComputeHooked) {
		const origComputeCameraTargetPosition = gameState.cameraController.computeCameraTargetPosition.bind(gameState.cameraController);
		gameState.cameraController.computeCameraTargetPosition = (pos) => {
			if (lunCameraLocked) return undefined;
			if (lunTrueFirstPersonActive) {
				const playerPos = gameState.playerContainer?.position || gameState.cameraController.target?.position;
				if (playerPos && pos) {
					pos.set(playerPos.x, playerPos.y + 0.95, playerPos.z);
					return pos;
				}
			}
			const targetPos = origComputeCameraTargetPosition(pos);
			if (lunFirstPersonActive && targetPos) {
				targetPos.y = (pos.y || 0) + 1.25; 
			}
			return targetPos;
		};
		gameState.cameraController.__speakiComputeHooked = true;
	}

	if (gameState.cameraController && typeof gameState.cameraController.update === "function" && !gameState.cameraController.__speakiTrueFpHooked) {
		const origCamUpdate = gameState.cameraController.update.bind(gameState.cameraController);
		gameState.cameraController.update = function(dt) {
			origCamUpdate(dt);
			if (lunTrueFirstPersonActive && gameState.playerContainer && this.camera) {
				const eyeHeight = 0.95;
				const px = gameState.playerContainer.position.x;
				const py = gameState.playerContainer.position.y + eyeHeight;
				const pz = gameState.playerContainer.position.z;
				this.camera.position.set(px, py, pz);
				
				const yaw = this.cameraYaw || 0;
				const pitch = this.cameraPitch || 0;
				const lookX = -Math.sin(yaw) * Math.cos(pitch);
				const lookY = -Math.sin(pitch);
				const lookZ = -Math.cos(yaw) * Math.cos(pitch);
				this.camera.lookAt(px + lookX * 10, py + lookY * 10, pz + lookZ * 10);
				
				gameState.playerContainer.rotation.y = yaw;
			}
		};
		gameState.cameraController.__speakiTrueFpHooked = true;
	}

	if (gameState.cameraController && typeof gameState.cameraController.getObstacles === "function" && !gameState.cameraController.__speakiObstaclesHooked) {
		const origGetObstacles = gameState.cameraController.getObstacles.bind(gameState.cameraController);
		gameState.cameraController.getObstacles = () => lunViewClip ? [] : origGetObstacles();
		gameState.cameraController.__speakiObstaclesHooked = true;
	}

	if (typeof gameState.trySendChat === "function" && !gameState.__speakiTrySendChatHooked) {
		const origTrySendChat = gameState.trySendChat.bind(gameState);
		gameState.trySendChat = (msg) => {
			const trimmedMsg = (msg || "").trim();
			const isAniTrigger = trimmedMsg.startsWith("!ani") || trimmedMsg.startsWith("/ani") || trimmedMsg.startsWith(":av") || trimmedMsg.startsWith(":ani");
			if (isAniTrigger) {
				const myName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
				if (!spkmodIsVipUser(myName)) {
					chatLog("❌ You do not have permission to use anniversary commands.");
					return;
				}
				// VIP: send through to server so all players receive it
				return origTrySendChat(msg);
			}

			if (msg && (msg.startsWith("!") || msg.startsWith("/"))) {
				const cmd = msg.substring(1).split(" ");
				const cmdName = (cmd[0] || "").toLowerCase();
				if (window.spkmodDebug) spkmodDebug.log("Chat command executed:", cmdName, cmd.slice(1));
				switch (cmdName) {
					case "watch":
						watchPlayer(cmd[1]);
						break;
					case "follow":
						followPlayer(cmd[1]);
						break;
					case "stare":
						stareAtPlayer(cmd[1]);
						break;
					case "players":
					case "who":
						showPlayersRadar(cmd[1]);
						break;
					case "findbots":
						if (typeof findBotsRadar === "function") findBotsRadar();
						break;
					case "botdebug":
						if (typeof lunActiveBotWaveMinId !== "undefined") {
							chatLog("[Bot Debug] Active Wave Cutoff ID: " + (lunActiveBotWaveMinId === Infinity ? "None" : lunActiveBotWaveMinId));
						}
						break;

					case "pos":
					case "loc":
					case "zone":
						if (gameState && gameState.playerContainer) {
							const pos = gameState.playerContainer.position;
							const zid = gameState.zoneId || "Unknown";
							chatLog(`ZoneID: ${zid} | Pos: X:${Math.round(pos.x)}, Y:${Math.round(pos.y)}, Z:${Math.round(pos.z)}`);
						}
						break;
					case "dance":
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.Dance);
						}
						break;
					case "hearts":
						triggerHearts();
						break;
					case "pet":
					case "pat":
						triggerPetSequence();
						break;
					case "joayo":
					case "chowayo":
						if (typeof gameState !== "undefined" && gameState && typeof gameState.sendEmoteNow === "function") {
							gameState.sendEmoteNow(Emotes.MinigameJoayo);
						}
						break;
					case "cook":
					case "kitchen":
						const cookType = (cmd[1] || "chop").toLowerCase();
						if (cookType === "stop" || cookType === "off") {
							if (window.spkmodStopCooking) window.spkmodStopCooking();
						} else {
							if (window.spkmodStartCooking) window.spkmodStartCooking(cookType);
						}
						break;
					case "trail":
						const trailSub = (cmd[1] || "").toLowerCase();
						if (trailSub === "off" || trailSub === "stop") {
							if (window.spkmodToggleStepTrail) window.spkmodToggleStepTrail(false);
						} else if (trailSub === "stars" || trailSub === "rainbow" || trailSub === "hearts") {
							if (window.spkmodSetTrailType) window.spkmodSetTrailType(trailSub);
						} else {
							if (window.spkmodToggleStepTrail) window.spkmodToggleStepTrail();
						}
						break;
					case "burst":
					case "starburst":
						if (cmd[1] && (cmd[1].toLowerCase() === "spam" || cmd[1].toLowerCase() === "loop" || cmd[1].toLowerCase() === "fast")) {
							if (window.spkmodToggleBurstSpam) window.spkmodToggleBurstSpam();
						} else {
							if (window.spkmodBurstTrail) window.spkmodBurstTrail();
						}
						break;
					case "copter":
					case "hat":
						const copterScope = (cmd[1] || "self").toLowerCase();
						if (window.spkmodToggleCopterHat) window.spkmodToggleCopterHat(copterScope);
						break;
					case "spelldance":
						if (window.spkmodPlaySpellDance) window.spkmodPlaySpellDance();
						break;
					case "gather":
						if (window.spkmodPlayGather) window.spkmodPlayGather();
						break;
					case "uiscale":
						const newScale = parseFloat(cmd[1]);
						if (!isNaN(newScale) && newScale >= 0.5 && newScale <= 2) {
							lunGameUiScale = newScale;
							if (window.localStorage) localStorage.setItem("spkmod-uiscale", newScale);
							const appEl = document.getElementById("app");
							if (appEl) appEl.style.zoom = ""; // Clear old buggy zoom
							if (typeof updateDynamicStyles === "function") updateDynamicStyles();
							if (lunPanelElements.gameUiScaleSlider) lunPanelElements.gameUiScaleSlider.value = newScale;
							chatLog("Game UI scale set to " + newScale);
						} else {
							chatLog("Usage: /uiscale [0.5 - 2.0] (Current: " + (lunGameUiScale || 1) + ")");
						}
						break;
					case "zoom":
						if (!cmd[1]) {
							chatLog(t("zoomUsage1Msg"));
							chatLog(t("zoomUsage2Msg"));
							return;
						}
						chatLog(t("zoomSetMsg", gameState.cameraController.cameraZoomDistance = Number.parseInt(cmd[1], 10) || 12));
						if (typeof updateZoomButtonText === "function") updateZoomButtonText();
						break;
					case "fppitch":
						const newPitch = parseFloat(cmd[1]);
						if (!isNaN(newPitch)) {
							lunFirstPersonPitch = newPitch;
							if (window.localStorage) localStorage.setItem("spkmod-fp-pitch", lunFirstPersonPitch);
							chatLog(t("fpPitchSetMsg", lunFirstPersonPitch));
						} else {
							chatLog(t("fpPitchUsageMsg", lunFirstPersonPitch));
						}
						break;
					case "ritual":
						toggleRitual();
						break;
					case "autojump":
						if (lunPanelElements.autoJumpBtn) lunPanelElements.autoJumpBtn.click();
						break;
					case "autohearts":
						if (lunPanelElements.autoHeartsBtn) lunPanelElements.autoHeartsBtn.click();
						break;
					case "firstperson":
					case "fp":
						if (lunPanelElements.firstPersonBtn) lunPanelElements.firstPersonBtn.click();
						break;
					case "camlock":
						if (lunPanelElements.lockCameraBtn) lunPanelElements.lockCameraBtn.click();
						break;
					case "viewclip":
						if (lunPanelElements.viewClipBtn) lunPanelElements.viewClipBtn.click();
						break;
					case "turntocam":
					case "turn":
						if (lunPanelElements.turnToCameraBtn) lunPanelElements.turnToCameraBtn.click();
						break;
					case "moonwalk":
						if (document.getElementById("spkmod-moonwalk-main-btn")) document.getElementById("spkmod-moonwalk-main-btn").click();
						break;
					case "hypershake":
						if (lunPanelElements.hyperShakeBtn) lunPanelElements.hyperShakeBtn.click();
						break;
					case "beyblade":
						if (document.getElementById("spkmod-beyblade-main-btn")) document.getElementById("spkmod-beyblade-main-btn").click();
						break;
					case "reversebeyblade":
						if (document.getElementById("spkmod-reversebeyblade-main-btn")) document.getElementById("spkmod-reversebeyblade-main-btn").click();
						break;
					case "speed":
						if (cmd[1]) {
							const speed = parseInt(cmd[1], 10);
							if (!isNaN(speed) && speed >= 1 && speed <= 10) {
								window.BeyBladeSpeed = speed;
								if (window.localStorage) localStorage.setItem("spkmod-beyblade-speed", speed);
								if (lunPanelElements.speedValue) setText(lunPanelElements.speedValue, "x" + speed);
								updateBeyBladeButtonText();
								updateReverseBeyBladeButtonText();
								chatLog(t("speedSetMsg", speed));
							} else {
								chatLog(t("speedInvalidMsg"));
							}
						} else {
							chatLog(t("speedUsageMsg"));
						}
						break;
					case "team":
					case "soccer":
					case "jersey":
						if (!cmd[1]) {
							chatLog("Usage: /team [red|blue|none] [name|all]");
							return;
						}
						if (typeof window.spkmodSetTeam === "function") {
							window.spkmodSetTeam(cmd[1], cmd.slice(2).join(" "));
						}
						break;
					case "red":
						if (typeof window.spkmodSetTeam === "function") {
							window.spkmodSetTeam(1, cmd.slice(1).join(" "));
						}
						break;
					case "blue":
						if (typeof window.spkmodSetTeam === "function") {
							window.spkmodSetTeam(2, cmd.slice(1).join(" "));
						}
						break;
					case "none":
					case "noteam":
						if (typeof window.spkmodSetTeam === "function") {
							window.spkmodSetTeam(0, cmd.slice(1).join(" "));
						}
						break;
					case "color":
					case "dye":
						if (!cmd[1]) {
							chatLog("Usage: /color [hex|name] (e.g. /color #ff2a4b or /color crimson, blue, emerald, gold, purple, pink, cyan, orange, mint, amber, pearl, obsidian, magenta, ice, sepia, lavender, lime, indigo)");
							return;
						}
						{
							const colorPresets = {
								crimson: "#ff2a4b", red: "#ff2a4b",
								blue: "#2563eb", royal: "#2563eb",
								emerald: "#10b981", green: "#10b981",
								gold: "#facc15", yellow: "#facc15",
								purple: "#8b5cf6", violet: "#8b5cf6",
								pink: "#ec4899", hotpink: "#ec4899",
								cyan: "#06b6d4", teal: "#06b6d4",
								orange: "#f97316",
								mint: "#14b8a6",
								amber: "#d97706",
								pearl: "#ffffff", white: "#ffffff",
								obsidian: "#18181b", black: "#18181b",
								magenta: "#f43f5e",
								ice: "#38bdf8",
								sepia: "#b45309",
								lavender: "#a78bfa",
								lime: "#84cc16",
								indigo: "#4f46e5"
							};
							const cKey = cmd[1].toLowerCase().replace(/^#/, "");
							const targetColor = colorPresets[cKey] || (cmd[1].startsWith("#") ? cmd[1] : "#" + cmd[1]);
							if (typeof window.spkmodApplyAvatarColor === "function") {
								window.spkmodApplyAvatarColor(targetColor);
							}
						}
						break;
					case "rainbow":
						if (typeof window.spkmodStartRainbowWave === "function") {
							let rainbowMode = false;
							let parsedSpeed = null;
							for (let i = 1; i < cmd.length; i++) {
								const arg = (cmd[i] || "").toLowerCase().trim();
								if (arg === "all" || arg === "*") {
									rainbowMode = true;
								} else if (arg === "random" || arg === "rand" || arg === "desync" || arg === "chaos") {
									rainbowMode = "random";
								} else if (arg === "me" || arg === "self") {
									rainbowMode = false;
								} else {
									const num = parseFloat(arg);
									if (!isNaN(num) && num > 0) {
										parsedSpeed = num;
									}
								}
							}
							if (parsedSpeed !== null) {
								window.spkmodRainbowSpeed = parsedSpeed;
								if (window.localStorage) localStorage.setItem("spkmod-rainbow-speed", parsedSpeed);
								if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
							}
							window.spkmodStartRainbowWave(rainbowMode);
						}
						break;
					case "shadow":
					case "void":
						if (typeof window.spkmodApplyShadowMode === "function") {
							window.spkmodApplyShadowMode();
						}
						break;
					case "badapple":
					case "apple":
						if (typeof window.spkmodToggleBadAppleMode === "function") {
							window.spkmodToggleBadAppleMode();
						} else if (typeof window.spkmodApplyBadAppleMode === "function") {
							window.spkmodApplyBadAppleMode();
						}
						break;
					case "drop":
					case "dropping":
						if (typeof window.spkmodToggleDropping === "function") {
							window.spkmodToggleDropping();
						}
						break;
					case "heartdrop":
					case "heartsdrop":
						if (typeof window.spkmodToggleHeartDropping === "function") {
							window.spkmodToggleHeartDropping();
						}
						break;
					case "resetcolor":
					case "cleardye":
						if (typeof window.spkmodResetAvatarColors === "function") {
							window.spkmodResetAvatarColors();
						}
						break;
					case "night":
					case "nightmode":
						{
							const arg = (cmd[1] || "").toLowerCase().trim();
							if (arg === "on" || arg === "1" || arg === "true") {
								spkmodSetNightMode(true);
								chatLog("🌙 Native Night Mode: ON");
							} else if (arg === "off" || arg === "0" || arg === "false") {
								spkmodSetNightMode(false);
								chatLog("☀️ Native Night Mode: OFF");
							} else {
								spkmodToggleNightMode();
							}
						}
						break;
					default:
						chatLog(t("unknownCmdMsg", cmd[0]));
						chatLog(t("availableCmdsMsg"));
						break;
				}
				return;
			}

			if (typeof msg === "string" && msg.startsWith(".")) {
				const match = msg.match(/^\.([a-zA-Z\-]+)(?::|\s+)(.+)$/s);
				if (match) {
					const prefix = match[1].toLowerCase();
					const targetLang = lunOutgoingLangPrefixes[prefix];
					if (targetLang) {
						const sourceText = match[2].trim();
						if (!sourceText) return;
						const sourceLang = getEffectiveSourceLang(sourceText);
						if (sourceLang === targetLang) {
							return origTrySendChat(sourceText);
						}
						translateChatText(sourceText, sourceLang, targetLang).then(translated => {
							if (translated && translated.trim()) {
								origTrySendChat(translated.trim());
							} else {
								chatLog(t("outgoingTranslateFailed", sourceText));
								origTrySendChat(sourceText);
							}
						}).catch(err => {
							console.warn("[SpeakiMod+] Outgoing translation error:", err);
							chatLog(t("outgoingTranslateFailed", sourceText));
							origTrySendChat(sourceText);
						});
						return;
					}
				}
			}

			return origTrySendChat(msg);
		};
		gameState.__speakiTrySendChatHooked = true;
	}

	if (gameState.chatBox && typeof gameState.chatBox.append === "function" && !gameState.chatBox.__speakiAppendHooked) {
		const origChatBoxAppend = gameState.chatBox.append.bind(gameState.chatBox);
		window.__speakiOrigChatBoxAppend = origChatBoxAppend;
		hkChatBoxAppend = origChatBoxAppend;
		gameState.chatBox.append = (id, name, msg) => {
			const scrollEl = updateChatScrollTracking();
			const wasAtBottom = !lunChatUserScrolledUp && (!scrollEl || (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight <= 45));

			// Intercept Anniversary event commands
			const rawMsg = (msg || "").trim();
			const isAniCommand = rawMsg.startsWith("!ani") || rawMsg.startsWith("/ani") || rawMsg.startsWith(":av") || rawMsg.startsWith(":ani");
			if (isAniCommand) {
				const isSenderVip = spkmodIsVipUser(name);
				if (!isSenderVip) return;
				spkmodHandleAnniversaryCommand(rawMsg, name);
				return;
			}

			let filteredName = filterName(name);
			const filteredMsg = filterName(msg);

			const myName = (typeof gameState !== 'undefined' && (gameState.myPlayerName || gameState.myStat?.name)) || document.querySelector('.sr-player-card__name')?.innerText?.trim() || "";
			let isMention = false;
			if (myName && filteredMsg && id !== -1337 && id !== -1338) {
				const escapedName = myName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				// Use unicode aware boundaries (no letter/number before or after)
				const mentionRegex = new RegExp(`(?<![\\p{L}\\p{N}_])${escapedName}(?![\\p{L}\\p{N}_])`, 'iu');
				if (mentionRegex.test(filteredMsg)) {
					isMention = true;
					if (lunMentionAlertEnabled) chatLog(t("mentionAlertMsg", filteredName, filteredMsg));
					if (typeof lunMentionPingEnabled !== 'undefined' && lunMentionPingEnabled) {
						if (typeof playPingSound === 'function') playPingSound();
					}
				}
			}

			const assignedMsgColor = (id !== -1337 && id !== -1338 && filteredMsg && filteredMsg.trim())
				? resolveChatMessageColor(id, name)
				: null;

			if (filteredMsg && filteredMsg.trim()) {
				observeNextChatNode(filteredMsg, (bodyText, rowNode) => {
					if (isMention) {
						rowNode.classList.add("spkmod-mention-line");
					}

					if (lunGmChatHighlightEnabled && name && name.trim().toUpperCase() === "GMDT") {
						bodyText.classList.add("spkmod-gmdt-line");
					}

					const spkmodAllEmojis = {...(typeof lunCustomEmojis !== "undefined" ? lunCustomEmojis : {}), ...(typeof lunTrickcalEmojis !== "undefined" ? lunTrickcalEmojis : {}), ...(typeof lunTrickcal2Emojis !== "undefined" ? lunTrickcal2Emojis : {}), ...(typeof lunTrickcal3Emojis !== "undefined" ? lunTrickcal3Emojis : {}), ...(typeof lunTrickcal4Emojis !== "undefined" ? lunTrickcal4Emojis : {})};
					if (Object.keys(spkmodAllEmojis).length > 0) {
						let html = bodyText.innerHTML;
						let changed = false;
						for (const [ename, eurl] of Object.entries(spkmodAllEmojis)) {
							const tag = ":" + ename + ":";
							if (html.includes(tag)) {
								html = html.split(tag).join(`<span class="spkmod-custom-emoji" data-name="${ename}" data-url="${eurl}" title="${tag}"><img src="${eurl}" style="height: 1.6em; vertical-align: middle; padding: 0 1px; display: inline-block;" loading="lazy" onerror="this.onerror=null; this.style.opacity='0.4';"></span>`);
								changed = true;
							}
						}
						if (changed) bodyText.innerHTML = html;
					}

					if (id !== -1337 && id !== -1338) {
						if (assignedMsgColor) {
							bodyText.style.setProperty("--spkmod-msg-color", assignedMsgColor);
							bodyText.classList.add("spkmod-colored-msg-el");
						}
						bodyText.classList.add("spkmod-clickable-line");
						bodyText.title = t("clickToTranslateTooltip");
						bodyText.addEventListener("click", (e) => {
							const emojiEl = e.target.closest('.spkmod-custom-emoji');
							if (emojiEl) {
								e.stopPropagation();
								e.preventDefault();
								const tag = emojiEl.getAttribute('title');
								if (tag && typeof insertEmojiIntoChat === 'function') {
									insertEmojiIntoChat(tag);
								}
							} else {
								forceTranslateMessage(name, filteredMsg, assignedMsgColor);
							}
						});
						
						const rowEl = (rowNode && rowNode.closest?.(".sr-chatbox__row")) || bodyText.closest?.(".sr-chatbox__row") || rowNode;
						const senderEl = rowEl?.classList?.contains("sr-chatbox__sender") ? rowEl : rowEl?.querySelector?.(".sr-chatbox__sender");
						if (senderEl) {
							if (lunGmChatHighlightEnabled && name && name.trim().toUpperCase() === "GMDT") {
								senderEl.classList.add("spkmod-gm-sender");
							} else if (typeof lunPartyChatHighlightEnabled !== "undefined" && lunPartyChatHighlightEnabled && isPartyMemberChatSpeaker(id, name)) {
								senderEl.classList.add("spkmod-party-sender");
							} else if (lunFriendChatHighlightEnabled && name && lunFriendNicknames.has(name.trim().toLowerCase())) {
								senderEl.classList.add("spkmod-friend-sender");
							}
							if (assignedMsgColor) {
								senderEl.style.setProperty("--spkmod-msg-color", assignedMsgColor);
								senderEl.classList.add("spkmod-colored-msg-el");
							}
							let currentText = senderEl.innerText;
							
							if (lunChatTimestampsEnabled) {
								const d = new Date();
								const ts = `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}] `;
								currentText = ts + currentText;
							}

							senderEl.innerText = currentText;
						}
					}
					if (wasAtBottom && !lunChatUserScrolledUp && scrollEl) {
						scrollEl.scrollTop = scrollEl.scrollHeight;
					}
				});
			}

			const result = origChatBoxAppend(id, filteredName, filteredMsg);

			if (wasAtBottom && scrollEl) {
				requestAnimationFrame(() => {
					if (!lunChatUserScrolledUp && scrollEl) {
						scrollEl.scrollTop = scrollEl.scrollHeight;
					}
				});
			}

			maybeTranslateChatMessage(id, name, filteredMsg, assignedMsgColor);
			return result;
		};
		gameState.chatBox.__speakiAppendHooked = true;
	}

	hookBlockedUserVoice();
	hookRemotePlayersOnce();
	if (typeof window.hookRemotePlayerRebuildIsolation === "function") window.hookRemotePlayerRebuildIsolation();
	if (typeof window.spkmodSanitizeRemotePlayers === "function") window.spkmodSanitizeRemotePlayers();
	if (typeof refreshI18n === "function") refreshI18n();
	if (window.spkmodDebug) spkmodDebug.log("In-game GameState hooks successfully installed.");
	return true;
}

window.hookGameStateOnce = hookGameStateOnce;
hookGameStateOnce();

function appendColoredChatLine(id, name, text, customColor) {
	const scrollEl = updateChatScrollTracking();
	const wasAtBottom = !lunChatUserScrolledUp && (!scrollEl || (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight <= 45));

	observeNextChatNode(text, (bodyText, rowNode) => {
		bodyText.classList.add("spkmod-translated-line");
		if (customColor) {
			bodyText.style.setProperty("--spkmod-msg-color", customColor);
			bodyText.classList.add("spkmod-colored-msg-el");
			const rowEl = (rowNode && rowNode.closest?.(".sr-chatbox__row")) || bodyText.closest?.(".sr-chatbox__row") || rowNode;
			const senderEl = rowEl?.classList?.contains("sr-chatbox__sender") ? rowEl : rowEl?.querySelector?.(".sr-chatbox__sender");
			if (senderEl) {
				senderEl.style.setProperty("--spkmod-msg-color", customColor);
				senderEl.classList.add("spkmod-colored-msg-el");
			}
		}

		const spkmodAllEmojis = {...(typeof lunCustomEmojis !== "undefined" ? lunCustomEmojis : {}), ...(typeof lunTrickcalEmojis !== "undefined" ? lunTrickcalEmojis : {}), ...(typeof lunTrickcal2Emojis !== "undefined" ? lunTrickcal2Emojis : {}), ...(typeof lunTrickcal3Emojis !== "undefined" ? lunTrickcal3Emojis : {}), ...(typeof lunTrickcal4Emojis !== "undefined" ? lunTrickcal4Emojis : {})};
		if (Object.keys(spkmodAllEmojis).length > 0) {
			let html = bodyText.innerHTML;
			let changed = false;
			for (const [ename, eurl] of Object.entries(spkmodAllEmojis)) {
				const tag = ":" + ename + ":";
				if (html.includes(tag)) {
					html = html.split(tag).join(`<span class="spkmod-custom-emoji" data-name="${ename}" data-url="${eurl}" title="${tag}"><img src="${eurl}" style="height: 1.6em; vertical-align: middle; padding: 0 1px; display: inline-block;" loading="lazy" onerror="this.onerror=null; this.style.opacity='0.4';"></span>`);
					changed = true;
				}
			}
			if (changed) bodyText.innerHTML = html;
		}

		if (wasAtBottom && !lunChatUserScrolledUp && scrollEl) {
			scrollEl.scrollTop = scrollEl.scrollHeight;
		}
	});

	hkChatBoxAppend(id, name, text);

	if (wasAtBottom && scrollEl) {
		requestAnimationFrame(() => {
			if (!lunChatUserScrolledUp && scrollEl) {
				scrollEl.scrollTop = scrollEl.scrollHeight;
			}
		});
	}
}

const lunTranslateSourceOptions = ["en", "ja", "ko", "zh-CN", "es", "fr", "de", "pt", "ru"];

function showTranslateSourcePicker(guess, onPick) {
	const existing = document.getElementById("spkmod-translate-picker");
	if (existing) existing.remove();

	const picker = buildElement("div", {
		id: "spkmod-translate-picker",
		style: `
			position: fixed; z-index: 2147483647;
			left: 50%; top: 50%; transform: translate(-50%, -50%);
			background: rgba(20,20,20,0.95); border: 1.5px solid #fff;
			border-radius: 8px; padding: 10px 14px; display: flex;
			flex-direction: column; gap: 8px; min-width: 200px;
		`
	}, [
		buildElement("span", {
			innerText: t("clickToTranslatePrompt"),
			style: "color: #fff; font-size: 11px; font-weight: bold;"
		}),
		buildElement("div", { style: "display: flex; flex-wrap: wrap; gap: 6px;" },
			lunTranslateSourceOptions.map(code => buildElement("button", {
				innerText: code,
				className: "spkmod-panel-btn-small",
				style: code === guess ? "outline: 2px solid #ffd54a;" : "",
				onclick: () => {
					picker.remove();
					onPick(code);
				}
			}))
		),
		buildElement("span", {
			innerText: "✕",
			style: "position: absolute; top: 4px; right: 8px; cursor: pointer; color: #aaa; font-size: 11px;",
			onclick: () => picker.remove()
		})
	]);

	document.body.appendChild(picker);
}

function forceTranslateMessage(name, msg, assignedColor) {
	const guess = guessSourceLang(msg);
	showTranslateSourcePicker(guess, source => {
		translateChatText(msg, source, lunTranslateTarget).then(translated => {
			if (!translated) {
				chatLog(t("translateFailedMsg"));
				return;
			}
			appendColoredChatLine(-1338, `↳ ${name}`, translated, assignedColor);
		});
	});
}
function hookRemotePlayersOnce() {
	if (typeof gameState === 'undefined' || !gameState?.remotePlayers?.remotePlayers) return;
	if (gameState.remotePlayers.remotePlayers.__speakiHooked) return;
	gameState.remotePlayers.remotePlayers.__speakiHooked = true;

	const hkRemotePlayersSet = gameState.remotePlayers.remotePlayers.set.bind(gameState.remotePlayers.remotePlayers);
	gameState.remotePlayers.remotePlayers.set = function (key, value) {
		if (value && value.info && typeof value.info.name === "string") {
			value.info.name = filterName(value.info.name);
		}
		hookKnownBotPlayerEmotes(value);
		if (typeof window.spkmodSanitizeRemotePlayers === "function") {
			window.spkmodSanitizeRemotePlayers();
		}
		return hkRemotePlayersSet(key, value);
	};

	gameState.remotePlayers.remotePlayers.forEach(v => {
		if (v && v.info && typeof v.info.name === "string") {
			v.info.name = filterName(v.info.name);
		}
	});
	hookKnownBotHeartEmotes();
	hookKnownBotPlayerEmotesForAll();
	if (typeof window.hookRemotePlayerRebuildIsolation === "function") window.hookRemotePlayerRebuildIsolation();
	if (typeof window.spkmodSanitizeRemotePlayers === "function") window.spkmodSanitizeRemotePlayers();
}
hookRemotePlayersOnce();

setInterval(tick, 50);

const hudWindow = document.getElementById("spkmod-hud");
if (hudWindow) {
	const dragHandle = document.getElementById("spkmod-drag-btn");
	const footerHandle = document.getElementById("spkmod-footer");
	const headerRow = document.getElementById("spkmod-header-row");
	const headerBtn = document.getElementById("spkmod-header");
	const mainCard = document.getElementById("spkmod-main");
	makeDraggable(hudWindow, [hudWindow, mainCard, headerRow, headerBtn, dragHandle, footerHandle].filter(Boolean));
}

let lunLastFrameTime = performance.now();
lunCurrentFps = 0;
lunCurrentPing = "--";
let lunLastPingTime = performance.now() + 3000; // 3s initial delay on boot
let lunPingInFlight = false;
let lunPingBackoffUntil = 0;
const LUN_PING_INTERVAL_MS = 5000; // Sample every 5 seconds

function updatePingMeasurement(sampleMs) {
	if (typeof sampleMs !== 'number' || isNaN(sampleMs) || sampleMs <= 0) return;
	const rounded = Math.round(sampleMs);
	if (lunCurrentPing === "--") {
		lunCurrentPing = rounded;
	} else {
		lunCurrentPing = Math.round(rounded * 0.6 + Number(lunCurrentPing) * 0.4);
	}
	lunLastPingTime = performance.now();
	if (lunFpsPingEnabled && lunHudElements.fpsPingTracker) {
		setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
	}
}

const originalFetch = window.fetch;

// We dynamically track which endpoint the game is using by snooping on fetch requests
let lunActivePingEndpoint = "https://sr1.overture.io.kr";
window.lunActiveApiEndpoint = lunActivePingEndpoint;

window.fetch = async function(...args) {
	const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url ? args[0].url : "");
	
	// If the game is fetching from the relay API, switch our ping target to the relay
	if (url.includes("relay.overture.io.kr/api/")) {
		lunActivePingEndpoint = "https://relay.overture.io.kr";
        window.lunActiveApiEndpoint = lunActivePingEndpoint;
	} else if (url.includes("sr1.overture.io.kr/api/")) {
		lunActivePingEndpoint = "https://sr1.overture.io.kr";
        window.lunActiveApiEndpoint = lunActivePingEndpoint;
	}
	
	return originalFetch.apply(this, args);
};

// We no longer override window.fetch to measure ping because the browser's 
// CORS preflight (OPTIONS) requests double the measured time for authenticated API calls.

async function performActivePing() {
	const now = performance.now();
	if (lunPingInFlight || now < lunPingBackoffUntil) return;
	if (typeof document !== 'undefined' && document.hidden) return;

	const isHudActive = !!(lunFpsPingEnabled && lunHudElements.fpsPingTracker && lunHudElements.fpsPingTracker.style.display !== "none");
	const isStatsModalActive = !!(typeof lunHudElements !== 'undefined' && lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden"));
	if (!isHudActive && !isStatsModalActive) return;

	if (now - lunLastPingTime < LUN_PING_INTERVAL_MS) return;

	lunPingInFlight = true;
	const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
	const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;
	const start = performance.now();

	try {
		const res = await originalFetch(`${lunActivePingEndpoint}/health/live`, {
			method: "GET",
			cache: "no-store",
			signal: controller ? controller.signal : undefined
		});
		if (timeoutId) clearTimeout(timeoutId);
		if (res.ok || res.status === 204 || res.status === 401) {
			updatePingMeasurement(performance.now() - start);
		} else if (res.status >= 500) {
			lunPingBackoffUntil = performance.now() + 10000;
		}
	} catch (e) {
		if (timeoutId) clearTimeout(timeoutId);
		lunPingBackoffUntil = performance.now() + 5000;
	} finally {
		lunPingInFlight = false;
	}
}

const spkmodFpsState = {
	enabled: false,
	drawn: false,
	frames: 0
};

let lunFpsLastRenderedFrames = 0;

function spkmodResetFpsBaseline() {
	lunLastFrameTime = performance.now();
	lunFpsLastRenderedFrames = spkmodFpsState.frames;
	spkmodFpsState.drawn = false;
}

document.addEventListener("visibilitychange", spkmodResetFpsBaseline);
// We no longer need to rely on a specific class named "sr-game-canvas"
const spkmodGameGl = new WeakSet();

function spkmodIsGameGl(gl) {
	if (!gl) return false;

	// If already identified as a game rendering context
	if (spkmodGameGl.has(gl)) return true;

	const canvas = gl.canvas;

	// Verify if it is an actual HTML Canvas
	if (!canvas || !canvas.isConnected || typeof canvas.getBoundingClientRect !== "function") return false;

	// Check if there are any bounds that are reflected on the screen
	const rect = canvas.getBoundingClientRect();

	if (rect.width <= 0 || rect.height <= 0) {
		return false;
	}

	// Exclude canvases that are not displayed on screen
	const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);

	if (style && (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0)) return false;

	// Registering Game Rendering Context
	spkmodGameGl.add(gl);

	return true;
}

(function installGameFpsHooks() {
	const methods = ["drawArrays", "drawElements", "drawRangeElements", "drawArraysInstanced", "drawElementsInstanced"];
	const prototypes = [
		window.WebGLRenderingContext && window.WebGLRenderingContext.prototype,
		window.WebGL2RenderingContext && window.WebGL2RenderingContext.prototype
	].filter(Boolean);

	for (const proto of new Set(prototypes)) {
		for (const name of methods) {
			const descriptor = Object.getOwnPropertyDescriptor(proto, name);
			if (!descriptor || typeof descriptor.value !== "function") continue;

			const original = descriptor.value;
			if (original.__spkmodActualFpsHook) continue;

			const wrapped = function () {
				if (spkmodFpsState.enabled && spkmodIsGameGl(this)) {
					spkmodFpsState.drawn = true;
				}
				return original.apply(this, arguments);
			};
			wrapped.__spkmodActualFpsHook = true;

			try {
				Object.defineProperty(proto, name, { ...descriptor, value: wrapped });
			} catch (_) {}
		}
	}
})();

function fpsLoop() {
	const now = performance.now();

	const fpsWanted = lunFpsPingEnabled || !!(lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden"));
	if (fpsWanted !== spkmodFpsState.enabled) {
		spkmodFpsState.enabled = fpsWanted;
		spkmodResetFpsBaseline();
	}

	if (spkmodFpsState.drawn) {
		spkmodFpsState.frames++;
		spkmodFpsState.drawn = false;
	}

	if (now - lunLastFrameTime >= 1000) {
		if (spkmodFpsState.enabled) {
			lunCurrentFps = Math.round((spkmodFpsState.frames - lunFpsLastRenderedFrames) * 1000 / (now - lunLastFrameTime));
		}
		lunFpsLastRenderedFrames = spkmodFpsState.frames;

		if (lunFpsPingEnabled && lunHudElements.fpsPingTracker) {
			setText(lunHudElements.fpsPingTracker, t("fpsPingText", lunCurrentFps, lunCurrentPing));
		}

		if (lunResetTimerEnabled && lunHudElements.resetTimerTracker) {
			const nowUtc = new Date();
			const kstOffset = 9 * 60 * 60 * 1000;
			const kstNow = new Date(nowUtc.getTime() + kstOffset);
			const kstNextMidnight = new Date(kstNow);
			kstNextMidnight.setUTCHours(24, 0, 0, 0); // Next midnight in KST
			const diffMs = kstNextMidnight.getTime() - kstNow.getTime();
			const diffTotalSeconds = Math.floor(diffMs / 1000);
			const hours = Math.floor(diffTotalSeconds / 3600);
			const minutes = Math.floor((diffTotalSeconds % 3600) / 60);
			const seconds = diffTotalSeconds % 60;
			setText(lunHudElements.resetTimerTracker, t("resetTimerText",
				String(hours).padStart(2, '0'),
				String(minutes).padStart(2, '0'),
				String(seconds).padStart(2, '0')
			));
		}

		if (typeof updateStatsModalLive === 'function' && lunHudElements.statsModal && !lunHudElements.statsModal.classList.contains("hidden")) {
			updateStatsModalLive();
		}

		performActivePing();

		lunLastFrameTime = now;
	}

	requestAnimationFrame(fpsLoop);
}
requestAnimationFrame(fpsLoop);

setTimeout(() => {
	fetchPatchNotesOnce();
}, 2500);

setTimeout(() => {
	if (typeof window !== "undefined" && window.__speakiErpin) {
		const cleanSignature = window.__speakiErpin.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
		console.log(cleanSignature);
		return;
	}
	fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/erpin.html")
		.then(res => res.text())
		.then(signature => {
			const cleanSignature = signature.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
			console.log(cleanSignature);
		})
		.catch(err => console.error("[SpeakiMod+] Failed to load signature:", err));
}, 15000);

function parseSemver(verStr) {
	if (!verStr || typeof verStr !== "string") return [0, 0, 0];
	const match = verStr.trim().replace(/^[vV]/, "").match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
	if (!match) return [0, 0, 0];
	return [
		parseInt(match[1] || "0", 10),
		parseInt(match[2] || "0", 10),
		parseInt(match[3] || "0", 10)
	];
}

function isNewerVersion(remote, local) {
	const [rMaj, rMin, rPat] = parseSemver(remote);
	const [lMaj, lMin, lPat] = parseSemver(local);
	if (rMaj !== lMaj) return rMaj > lMaj;
	if (rMin !== lMin) return rMin > lMin;
	return rPat > lPat;
}

function getClientBuildVersion() {
	if (typeof window !== "undefined" && window.__speakiBuildVersion) {
		return String(window.__speakiBuildVersion).trim();
	}
	const isElectron = typeof window !== "undefined" && (
		typeof window.electronAPI !== "undefined" ||
		(typeof navigator !== "undefined" && /electron/i.test(navigator.userAgent || ""))
	);
	if (isElectron) {
		return "1.0.8";
	}
	return null;
}

let speakiNewsChecked = false;
window.speakiNewsChecked = false;

function showNewsModal(remoteVer, htmlBody, stylesHtml = "") {
	let backdrop = document.getElementById("spkmod-news-modal");
	if (backdrop) {
		backdrop.style.display = "flex";
		return;
	}

	backdrop = document.createElement("div");
	backdrop.id = "spkmod-news-modal";
	backdrop.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.72); z-index: 700000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);";

	const dialog = document.createElement("div");
	dialog.className = "spkmod-news-dialog";
	dialog.style.cssText = "background: #0f172a; border: 1px solid #334155; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); width: 540px; max-width: 92vw; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";

	const header = document.createElement("div");
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1e293b; border-bottom: 1px solid #334155;";

	const headerTitle = document.createElement("div");
	headerTitle.style.cssText = "display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #f8fafc;";
	headerTitle.innerHTML = `<span>📢</span> <span>${t("newsModalTitle")}</span>`;

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 4px; line-height: 1;";
	closeBtn.onmouseenter = () => { closeBtn.style.color = "#ffffff"; closeBtn.style.background = "#334155"; };
	closeBtn.onmouseleave = () => { closeBtn.style.color = "#94a3b8"; closeBtn.style.background = "transparent"; };
	closeBtn.onclick = () => { backdrop.style.display = "none"; };

	header.appendChild(headerTitle);
	header.appendChild(closeBtn);

	const content = document.createElement("div");
	content.style.cssText = "padding: 16px; overflow-y: auto; flex: 1; max-height: 48vh; font-size: 13px; line-height: 1.5;";
	content.innerHTML = (stylesHtml || "") + htmlBody;

	const langTabs = content.querySelectorAll(".spk-lang-tab");
	const langSections = content.querySelectorAll(".spk-news-section");

	function setModalNewsLang(targetLang) {
		if (targetLang === "zh") targetLang = "zh-CN";
		if (targetLang === "es") targetLang = "es-419";
		let matched = false;
		langTabs.forEach(tab => {
			const isMatch = tab.getAttribute("data-target-lang") === targetLang;
			if (isMatch) matched = true;
			tab.classList.toggle("active", isMatch);
		});
		langSections.forEach(sec => {
			sec.classList.toggle("active", sec.getAttribute("data-lang") === targetLang);
		});
		if (!matched && targetLang !== "en") {
			setModalNewsLang("en");
		}
	}

	langTabs.forEach(tab => {
		tab.addEventListener("click", () => {
			const lang = tab.getAttribute("data-target-lang");
			if (lang) setModalNewsLang(lang);
		});
	});

	const initialLang = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	setModalNewsLang(initialLang);

	content.querySelectorAll("a").forEach(a => {
		a.addEventListener("click", e => {
			e.preventDefault();
		});
	});

	const copySection = document.createElement("div");
	copySection.style.cssText = "padding: 12px 16px; background: rgba(15, 23, 42, 0.95); border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b;";

	const copyLabel = document.createElement("div");
	copyLabel.style.cssText = "font-size: 11px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;";
	copyLabel.innerText = t("patchNotesReleasesLink");

	const copyRow = document.createElement("div");
	copyRow.style.cssText = "display: flex; gap: 8px; align-items: center;";

	const copyInput = document.createElement("input");
	copyInput.type = "text";
	copyInput.readOnly = true;
	copyInput.value = "https://github.com/DJTOMATO/SpeakiRPG/releases";
	copyInput.style.cssText = "flex: 1; background: #020617; border: 1px solid #334155; border-radius: 6px; padding: 7px 10px; color: #38bdf8; font-family: monospace; font-size: 12px; outline: none; cursor: text;";
	copyInput.onclick = () => copyInput.select();

	const copyBtn = document.createElement("button");
	copyBtn.type = "button";
	copyBtn.style.cssText = "background: linear-gradient(135deg, #3b82f6, #2563eb); border: none; border-radius: 6px; color: #ffffff; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; white-space: nowrap; transition: all 0.15s ease;";
	copyBtn.innerHTML = `<span class="spkmod-news-icon">📋</span><span class="spkmod-news-btn-text">${t("newsCopyLinkBtn")}</span>`;

	copyBtn.onclick = () => {
		const url = copyInput.value;
		const handleSuccess = () => {
			const iconEl = copyBtn.querySelector(".spkmod-news-icon");
			const textEl = copyBtn.querySelector(".spkmod-news-btn-text");
			if (iconEl) iconEl.innerText = "✓";
			if (textEl) textEl.innerText = t("newsCopied");
			copyBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
			setTimeout(() => {
				if (iconEl) iconEl.innerText = "📋";
				if (textEl) textEl.innerText = t("newsCopyLinkBtn");
				copyBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
			}, 2500);
		};

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(handleSuccess).catch(() => {
				copyInput.select();
				document.execCommand("copy");
				handleSuccess();
			});
		} else {
			copyInput.select();
			document.execCommand("copy");
			handleSuccess();
		}
	};

	copyRow.appendChild(copyInput);
	copyRow.appendChild(copyBtn);
	copySection.appendChild(copyLabel);
	copySection.appendChild(copyRow);

	const footer = document.createElement("div");
	footer.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1e293b;";

	const dismissBtn = document.createElement("button");
	dismissBtn.type = "button";
	dismissBtn.innerText = t("newsDismissBtn");
	dismissBtn.style.cssText = "background: transparent; border: 1px solid #475569; border-radius: 6px; color: #94a3b8; padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.15s ease;";
	dismissBtn.onmouseenter = () => { dismissBtn.style.color = "#ffffff"; dismissBtn.style.borderColor = "#64748b"; };
	dismissBtn.onmouseleave = () => { dismissBtn.style.color = "#94a3b8"; dismissBtn.style.borderColor = "#475569"; };
	dismissBtn.onclick = () => {
		try {
			localStorage.setItem("spkmod-dismissed-news-version", remoteVer);
		} catch (_) {}
		backdrop.style.display = "none";
	};

	const closeFooterBtn = document.createElement("button");
	closeFooterBtn.type = "button";
	closeFooterBtn.innerText = "✕";
	closeFooterBtn.style.cssText = "background: #334155; border: none; border-radius: 6px; color: #f8fafc; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;";
	closeFooterBtn.onclick = () => { backdrop.style.display = "none"; };

	footer.appendChild(dismissBtn);
	footer.appendChild(closeFooterBtn);

	dialog.appendChild(header);
	dialog.appendChild(content);
	dialog.appendChild(copySection);
	dialog.appendChild(footer);
	backdrop.appendChild(dialog);

	backdrop.addEventListener("click", e => {
		if (e.target === backdrop) {
			backdrop.style.display = "none";
		}
	});

	document.body.appendChild(backdrop);
}

async function checkAndShowNewsPopup(force = false) {
	if (typeof window !== "undefined" && typeof window.speakiNewsChecked !== "undefined") {
		speakiNewsChecked = Boolean(window.speakiNewsChecked);
	}
	if (speakiNewsChecked && !force) return;
	const clientVer = getClientBuildVersion();
	if (!clientVer && !force) return;
	speakiNewsChecked = true;
	if (typeof window !== "undefined") window.speakiNewsChecked = true;

	try {
		const res = await fetch(`https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/news.html?_t=${Date.now()}`, {
			cache: "no-store"
		});
		if (!res.ok) {
			console.warn("[SpeakiMod+] News fetch HTTP error:", res.status);
			return;
		}
		const htmlText = await res.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, "text/html");
		const metaEl = doc.querySelector('meta[name="min-build-version"]');
		const remoteVer = metaEl ? metaEl.getAttribute("content") : null;
		if (!remoteVer) {
			console.warn("[SpeakiMod+] News meta min-build-version not found in remote news.html");
			return;
		}

		if (!force) {
			try {
				const dismissedVer = localStorage.getItem("spkmod-dismissed-news-version");
				if (dismissedVer && dismissedVer === remoteVer) {
					console.log(`[SpeakiMod+] News for version ${remoteVer} was already dismissed.`);
					return;
				}
			} catch (_) {}

			if (!isNewerVersion(remoteVer, clientVer)) {
				console.log(`[SpeakiMod+] Client version (${clientVer}) is up to date with remote (${remoteVer}). No popup needed.`);
				return;
			}
		}

		const styleEl = doc.head ? doc.head.querySelector("style") : null;
		const stylesHtml = styleEl ? styleEl.outerHTML : "";
		const bodyHtml = doc.body ? doc.body.innerHTML : htmlText;
		showNewsModal(remoteVer, bodyHtml, stylesHtml);
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to check news/update:", e);
	}
}
window.checkAndShowNewsPopup = checkAndShowNewsPopup;
window.showNewsModal = showNewsModal;

setTimeout(() => {
	if (typeof gameState !== "undefined" && gameState) {
		checkAndShowNewsPopup();
	}
}, 4500);

window.addEventListener("keydown", e => {
	if (e.key !== "p" && e.key !== "P" && e.code !== "KeyP") return;
	if (e.ctrlKey || e.altKey || e.metaKey) return;

	const active = document.activeElement;
	if (active) {
		const tag = active.tagName ? active.tagName.toLowerCase() : "";
		if (tag === "input" || tag === "textarea" || active.isContentEditable) {
			return;
		}
	}

	e.preventDefault();
	const isHidden = document.body.classList.toggle("spkmod-ui-hidden");
	chatLog(t(isHidden ? "uiHiddenMsg" : "uiShownMsg"));
});

window.addEventListener("keydown", e => {
	if (e.key !== "F2" && e.code !== "F2") return;
	if (e.ctrlKey || e.altKey || e.metaKey) return;

	const active = document.activeElement;
	if (active) {
		const tag = active.tagName ? active.tagName.toLowerCase() : "";
		if (tag === "input" || tag === "textarea" || active.isContentEditable) {
			return;
		}
	}

	e.preventDefault();
	if (typeof toggleSettingsModal === "function") {
		toggleSettingsModal();
	}
});

window.addEventListener("keydown", e => {
	if (e.altKey && (e.key === "m" || e.key === "M" || e.code === "KeyM")) {
		const active = document.activeElement;
		if (active) {
			const tag = active.tagName ? active.tagName.toLowerCase() : "";
			if (tag === "input" || tag === "textarea" || active.isContentEditable) {
				return;
			}
		}
		e.preventDefault();
		if (typeof toggleMusicPlayer === "function") {
			toggleMusicPlayer();
		}
	}
});

window.addEventListener("keydown", e => {
	if (e.key !== "Escape" && e.code !== "Escape") return;

	const newsModal = document.getElementById("spkmod-news-modal");
	if (newsModal && newsModal.style.display !== "none") {
		e.preventDefault();
		newsModal.style.display = "none";
		return;
	}

	const picker = document.getElementById("spkmod-translate-picker");
	if (picker) {
		e.preventDefault();
		picker.remove();
		return;
	}

	if (typeof mapModalElements !== "undefined" && mapModalElements.modalWindow && mapModalElements.modalWindow.style.display !== "none") {
		e.preventDefault();
		if (typeof closeMapModal === "function") {
			closeMapModal();
		} else {
			mapModalElements.modalWindow.style.display = "none";
		}
		return;
	}

	if (typeof lunHudElements !== "undefined") {
		const candidateModals = [
			lunHudElements.settingsModal,
			lunHudElements.gamepadModal,
			lunHudElements.patchNotesModal,
			lunHudElements.bbsModal,
			lunHudElements.eventModal,
			lunHudElements.statsModal,
			lunHudElements.jukeboxModal,
			lunHudElements.customCssModal,
			lunHudElements.resourcePackModal
		].filter(m => m && !m.classList.contains("hidden"));

		if (candidateModals.length > 0) {
			e.preventDefault();
			candidateModals.sort((a, b) => {
				const za = parseInt(a.style.zIndex || window.getComputedStyle(a).zIndex, 10) || 0;
				const zb = parseInt(b.style.zIndex || window.getComputedStyle(b).zIndex, 10) || 0;
				return zb - za;
			});
			const closedModal = candidateModals[0];
			closedModal.classList.add("hidden");
			if (closedModal === lunHudElements.settingsModal && typeof toggleQuickLoginSettings === "function") {
				toggleQuickLoginSettings(false);
			}
			return;
		}
	}
});

// Global hover preview for custom emojis (avoids chatbox overflow clipping)
let lunEmojiPreviewTooltip = null;
let lunEmojiPreviewCurrentTarget = null;

function positionEmojiTooltip(target) {
	if (!target || !lunEmojiPreviewTooltip) return;
	const rect = target.getBoundingClientRect();
	const naturalH = lunEmojiPreviewTooltip.naturalHeight || 0;
	const naturalW = lunEmojiPreviewTooltip.naturalWidth || 0;
	const previewH = naturalH > 0 ? Math.min(naturalH, 250) : (lunEmojiPreviewTooltip.offsetHeight || 250);
	const previewW = naturalW > 0 ? Math.min(naturalW, 250) : (lunEmojiPreviewTooltip.offsetWidth || 250);

	// Horizontal centering with screen margin clamp (at least 10px from edges)
	const halfW = previewW / 2;
	let centerX = rect.left + rect.width / 2;
	centerX = Math.max(10 + halfW, Math.min(centerX, window.innerWidth - 10 - halfW));
	lunEmojiPreviewTooltip.style.left = Math.round(centerX) + "px";
	lunEmojiPreviewTooltip.style.transform = "translateX(-50%)";

	// Vertical positioning: default 10px above emoji, clamped to viewport top
	let top = rect.top - previewH - 10;
	if (top < 10) {
		// If near top of screen and there is room below the emoji, show below it
		if (rect.top < 100 && rect.bottom + 10 + previewH <= window.innerHeight - 10) {
			top = rect.bottom + 10;
		} else {
			top = 10;
		}
	}
	lunEmojiPreviewTooltip.style.top = Math.round(top) + "px";
	lunEmojiPreviewTooltip.style.bottom = "auto";
}

function ensureEmojiTooltip() {
	if (lunEmojiPreviewTooltip) return;
	lunEmojiPreviewTooltip = document.createElement("img");
	lunEmojiPreviewTooltip.id = "spkmod-global-emoji-preview";
	lunEmojiPreviewTooltip.style.cssText = "display: none; position: fixed; max-height: 250px; max-width: 250px; z-index: 2147483647; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.8); pointer-events: none; border: 2px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.8);";
	document.body.appendChild(lunEmojiPreviewTooltip);

	lunEmojiPreviewTooltip.onload = () => {
		if (lunEmojiPreviewCurrentTarget && lunEmojiPreviewTooltip.style.display === "block") {
			positionEmojiTooltip(lunEmojiPreviewCurrentTarget);
		}
	};

	document.addEventListener("mouseover", (e) => {
		if (typeof spkmodIsMobile === "function" && spkmodIsMobile()) return;
		if (typeof window.speakiMobile !== "undefined") return;
		if (typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches && (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)) return;

		const target = e.target.closest('.spkmod-custom-emoji');
		if (target) {
			const url = target.getAttribute("data-url");
			if (!url) return;
			lunEmojiPreviewCurrentTarget = target;
			lunEmojiPreviewTooltip.src = url;
			lunEmojiPreviewTooltip.style.display = "block";
			lunEmojiPreviewTooltip.style.zIndex = "2147483647";
			if (document.body.lastElementChild !== lunEmojiPreviewTooltip) {
				document.body.appendChild(lunEmojiPreviewTooltip);
			}
			positionEmojiTooltip(target);
		}
	});

	document.addEventListener("mouseout", (e) => {
		const target = e.target.closest('.spkmod-custom-emoji');
		if (target) {
			if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.spkmod-custom-emoji') === target) {
				return;
			}
			lunEmojiPreviewCurrentTarget = null;
			lunEmojiPreviewTooltip.style.display = "none";
		}
	});

	window.addEventListener("touchstart", () => {
		if (lunEmojiPreviewTooltip) {
			lunEmojiPreviewCurrentTarget = null;
			lunEmojiPreviewTooltip.style.display = "none";
		}
	}, { passive: true, capture: true });

	window.addEventListener("scroll", () => {
		if (lunEmojiPreviewTooltip) {
			lunEmojiPreviewCurrentTarget = null;
			lunEmojiPreviewTooltip.style.display = "none";
		}
	}, true);
}
ensureEmojiTooltip();

// Right-click rendered emojis in chat to add/remove from favorites
document.addEventListener("contextmenu", (e) => {
	const target = e.target.closest('.spkmod-custom-emoji');
	if (!target) return;
	if (target.closest("#spkmod-emoji-picker, #spkmod-emoji-picker-v2")) return;

	e.preventDefault();
	e.stopPropagation();

	let name = target.getAttribute("data-name");
	if (!name) {
		const title = target.getAttribute("title") || "";
		name = title.replace(/^:|:$/g, "").trim();
	}
	if (name && typeof toggleFavoriteEmoji === "function") {
		toggleFavoriteEmoji(name);
	}
}, true);

// ==========================================
// EMOJI COOLDOWN SYSTEM
// ==========================================
let lunLastEmojiSentTime = 0;
let lunEmojiCdInterval = null;
const lunEmojiCooldownMs = 20000;

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const active = document.activeElement;
        if (active && (active.classList.contains("sr-chatbox__input") || (active.placeholder && active.placeholder.toLowerCase().includes("chat")))) {
            let val = active.value;
            if (!val || typeof lunCustomEmojis === 'undefined') return;
            
            const emojiRegex = /:[a-zA-Z0-9_]+:/g;
            const matches = val.match(emojiRegex);
            if (!matches) return;
            
            let hasCustomEmoji = false;
            for (const match of matches) {
                const name = match.slice(1, -1);
                if (lunCustomEmojis[name] || (typeof lunTrickcalEmojis !== 'undefined' && lunTrickcalEmojis[name]) || (typeof lunTrickcal2Emojis !== 'undefined' && lunTrickcal2Emojis[name]) || (typeof lunTrickcal3Emojis !== 'undefined' && lunTrickcal3Emojis[name]) || (typeof lunTrickcal4Emojis !== 'undefined' && lunTrickcal4Emojis[name])) {
                    hasCustomEmoji = true;
                    break;
                }
            }
            
            if (hasCustomEmoji) {
                const now = Date.now();
                const elapsed = now - lunLastEmojiSentTime;
                
                if (elapsed < lunEmojiCooldownMs) {
                    // Cooldown ACTIVE
                    for (const name of Object.keys(lunCustomEmojis)) {
                        val = val.split(`:${name}:`).join("");
                    }
                    if (typeof lunTrickcalEmojis !== 'undefined') {
                        for (const name of Object.keys(lunTrickcalEmojis)) {
                            val = val.split(`:${name}:`).join("");
                        }
                    }
                    if (typeof lunTrickcal2Emojis !== 'undefined') {
                        for (const name of Object.keys(lunTrickcal2Emojis)) {
                            val = val.split(`:${name}:`).join("");
                        }
                    }
                    if (typeof lunTrickcal3Emojis !== 'undefined') {
                        for (const name of Object.keys(lunTrickcal3Emojis)) {
                            val = val.split(`:${name}:`).join("");
                        }
                    }
                    if (typeof lunTrickcal4Emojis !== 'undefined') {
                        for (const name of Object.keys(lunTrickcal4Emojis)) {
                            val = val.split(`:${name}:`).join("");
                        }
                    }
                    val = val.replace(/\s+/g, " ").trim();
                    
                    if (val === "") {
                        // Emoji only -> Block entirely
                        e.stopPropagation();
                        e.preventDefault();
                        
                        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                        if (nativeSetter) {
                            nativeSetter.call(active, "");
                            active.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            active.value = "";
                        }
                        
                        const remaining = Math.ceil((lunEmojiCooldownMs - elapsed) / 1000);
                        chatLog(t("emojiCooldownWait", remaining));
                        return; // Done
                    } else {
                        // Text + Emoji -> Strip emojis and send text
                        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                        if (nativeSetter) {
                            nativeSetter.call(active, val);
                            active.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            active.value = val;
                        }
                        chatLog(t("emojiCooldownStripped"));
                    }
                } else {
                    // Cooldown INACTIVE -> Allow and start cooldown
                    lunLastEmojiSentTime = now;
                    startEmojiCooldownUI();
                }
            }
        }
    }
}, true); // Use capture phase

function startEmojiCooldownUI() {
    if (lunEmojiCdInterval) clearInterval(lunEmojiCdInterval);
    const chatInput = document.querySelector(".sr-chatbox__input, .sr-chatbox input, input[placeholder*='chat']");
    const originalPlaceholder = chatInput ? chatInput.placeholder.split(" (")[0] : "Press Enter to chat";
    const emojiBtn = document.getElementById("spkmod-emoji-btn");
    
    // Add badge
    if (emojiBtn) {
        let badge = document.getElementById("spkmod-emoji-btn-cd");
        if (!badge) {
            badge = document.createElement("div");
            badge.id = "spkmod-emoji-btn-cd";
            badge.style.cssText = "position: absolute; top: -5px; right: -5px; background: red; color: white; border-radius: 50%; font-size: 10px; width: 14px; height: 14px; display: flex; justify-content: center; align-items: center; font-weight: bold;";
            emojiBtn.appendChild(badge);
        }
    }
    
    lunEmojiCdInterval = setInterval(() => {
        const remaining = Math.ceil((lunEmojiCooldownMs - (Date.now() - lunLastEmojiSentTime)) / 1000);
        if (remaining <= 0) {
            clearInterval(lunEmojiCdInterval);
            lunEmojiCdInterval = null;
            if (chatInput) chatInput.placeholder = originalPlaceholder;
            const badge = document.getElementById("spkmod-emoji-btn-cd");
            if (badge) badge.remove();
        } else {
            if (chatInput) chatInput.placeholder = `${originalPlaceholder} (CD: ${remaining}s)`;
            const badge = document.getElementById("spkmod-emoji-btn-cd");
            if (badge) badge.innerText = remaining;
        }
    }, 500);
}

// Emoji Picker Language Mutator
if (typeof spkmodI18nRenderers !== 'undefined') {
    spkmodI18nRenderers.push(() => {
        if (typeof lunEmojiPickerPanel !== 'undefined' && lunEmojiPickerPanel && typeof renderEmojiGrid === 'function') {
            renderEmojiGrid();
        }
    });
}
