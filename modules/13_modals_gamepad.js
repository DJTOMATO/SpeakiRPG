function openGamepadModal() {
	if (lunHudElements.gamepadModal) {
		lunHudElements.gamepadModal.classList.remove("hidden");
		refreshGamepadModalI18n();
	}
}

function refreshGamepadModalI18n() {
	if (gamepadModalElements.headerTitle) setText(gamepadModalElements.headerTitle, t("gamepadHeader"));
	if (gamepadModalElements.deadzoneLabel) setText(gamepadModalElements.deadzoneLabel, t("gamepadDeadzoneLabel"));
	if (gamepadModalElements.sensLabel) setText(gamepadModalElements.sensLabel, t("gamepadSensLabel"));
	if (gamepadModalElements.invertXLabel) setText(gamepadModalElements.invertXLabel, t("gamepadInvertX"));
	if (gamepadModalElements.invertYLabel) setText(gamepadModalElements.invertYLabel, t("gamepadInvertY"));
	if (gamepadModalElements.toggleDiagramBtn) setText(gamepadModalElements.toggleDiagramBtn, window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"));
	if (gamepadModalElements.resetBtn) setText(gamepadModalElements.resetBtn, t("gamepadResetBtn"));
	refreshGamepadBindingsUI();
	renderGamepadDiagram();
}

function refreshGamepadBindingsUI() {
	if (!gamepadModalElements.bindingsContainer) return;
	gamepadModalElements.bindingsContainer.replaceChildren(
		...SPKMOD_GAMEPAD_ACTIONS.map(action => {
			const assignedBtnIdx = Object.keys(spkmodGamepadConfig.bindings).find(k => spkmodGamepadConfig.bindings[k] === action);
			const btnLabel = assignedBtnIdx !== undefined ? (SPKMOD_GAMEPAD_BUTTON_NAMES[assignedBtnIdx] || `Button ${assignedBtnIdx}`) : "Unassigned";

			const isListening = gamepadListeningAction === action;
			const keyBtn = buildElement("span", {
				className: "spkmod-binding-key" + (isListening ? " listening" : ""),
				innerText: isListening ? t("gamepadPressPrompt") : btnLabel,
				onclick: () => {
					if (gamepadListeningAction === action) {
						gamepadListeningAction = null;
					} else {
						gamepadListeningAction = action;
					}
					refreshGamepadBindingsUI();
					renderGamepadDiagram();
				}
			});

			return buildElement("div", { className: "spkmod-binding-row" }, [
				buildElement("span", { innerText: t(`gamepadAction_${action}`) || action }),
				keyBtn
			]);
		})
	);
	renderGamepadDiagram();
}

function renderGamepadDiagram() {
	if (!gamepadModalElements.diagramContainer || !window.__showGamepadDiagram) return;
	
	const b = spkmodGamepadConfig.bindings || {};
	const getActionLabel = (btnIdx) => {
		const act = b[btnIdx];
		if (!act) return "-";
		const loc = t(`gamepadAction_${act}`);
		return (loc && !loc.startsWith("gamepadAction_")) ? loc : act;
	};

	gamepadModalElements.diagramContainer.innerHTML = `
		<svg viewBox="0 0 460 250" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); user-select: none;">
			<defs>
				<linearGradient id="gpBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#2a2a2e" />
					<stop offset="100%" stop-color="#141416" />
				</linearGradient>
			</defs>
			
			<!-- Controller Silhouette Body -->
			<path d="M 120 45 C 170 35, 290 35, 340 45 C 410 60, 445 130, 430 205 C 420 250, 375 245, 345 200 C 315 155, 290 160, 230 160 C 170 160, 145 155, 115 200 C 85 245, 40 250, 30 205 C 15 130, 50 60, 120 45 Z" fill="url(#gpBodyGrad)" stroke="#555" stroke-width="2.5" />
			
			<!-- Triggers & Bumpers -->
			<!-- L2 / LT (Btn 6) -->
			<rect id="spkmod-gp-btn-6" x="65" y="10" width="85" height="24" rx="6" fill="#1e1e24" stroke="#555" stroke-width="1.5" />
			<text x="107" y="26" fill="#ffd54a" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="sans-serif">LT: ${getActionLabel(6)}</text>
			
			<!-- L1 / LB (Btn 4) -->
			<rect id="spkmod-gp-btn-4" x="75" y="38" width="75" height="18" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1.5" />
			<text x="112" y="51" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">LB: ${getActionLabel(4)}</text>

			<!-- R2 / RT (Btn 7) -->
			<rect id="spkmod-gp-btn-7" x="310" y="10" width="85" height="24" rx="6" fill="#1e1e24" stroke="#555" stroke-width="1.5" />
			<text x="352" y="26" fill="#ffd54a" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="sans-serif">RT: ${getActionLabel(7)}</text>
			
			<!-- R1 / RB (Btn 5) -->
			<rect id="spkmod-gp-btn-5" x="310" y="38" width="75" height="18" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1.5" />
			<text x="347" y="51" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">RB: ${getActionLabel(5)}</text>

			<!-- Left Stick (Move) -->
			<circle cx="130" cy="100" r="22" fill="#1a1a1c" stroke="#555" stroke-width="2" />
			<circle id="spkmod-gp-btn-10" cx="130" cy="100" r="16" fill="#333" stroke="#ffd54a" stroke-width="1.5" />
			<text x="130" y="98" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">L-Stick</text>
			<text x="130" y="109" fill="#aaa" font-size="8" text-anchor="middle" font-family="sans-serif">${getActionLabel(10)}</text>

			<!-- D-Pad -->
			<g transform="translate(130, 162)">
				<!-- Up (Btn 12) -->
				<rect id="spkmod-gp-btn-12" x="-8" y="-28" width="16" height="18" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="0" y="-16" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▲</text>
				<!-- Down (Btn 13) -->
				<rect id="spkmod-gp-btn-13" x="-8" y="10" width="16" height="18" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="0" y="22" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▼</text>
				<!-- Left (Btn 14) -->
				<rect id="spkmod-gp-btn-14" x="-28" y="-8" width="18" height="16" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="-19" y="4" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">◀</text>
				<!-- Right (Btn 15) -->
				<rect id="spkmod-gp-btn-15" x="10" y="-8" width="18" height="16" rx="3" fill="#2d2d34" stroke="#555" stroke-width="1" />
				<text x="19" y="4" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">▶</text>
				<!-- Center -->
				<rect x="-8" y="-8" width="16" height="16" fill="#2d2d34" />
			</g>
			<!-- D-Pad Labels -->
			<text x="75" y="145" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▲ ${getActionLabel(12)}</text>
			<text x="75" y="162" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">◀ ${getActionLabel(14)}</text>
			<text x="75" y="179" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▼ ${getActionLabel(13)}</text>
			<text x="75" y="196" fill="#ffd54a" font-size="8.5" text-anchor="end" font-family="sans-serif">▶ ${getActionLabel(15)}</text>

			<!-- Center Buttons (Select & Start) -->
			<!-- Select / Back (Btn 8) -->
			<rect id="spkmod-gp-btn-8" x="188" y="90" width="22" height="12" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1" />
			<text x="199" y="84" fill="#ffd54a" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">Select</text>
			<text x="199" y="114" fill="#aaa" font-size="7.5" text-anchor="middle" font-family="sans-serif">${getActionLabel(8)}</text>

			<!-- Start / Menu (Btn 9) -->
			<rect id="spkmod-gp-btn-9" x="250" y="90" width="22" height="12" rx="4" fill="#2d2d34" stroke="#666" stroke-width="1" />
			<text x="261" y="84" fill="#ffd54a" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">Start</text>
			<text x="261" y="114" fill="#aaa" font-size="7.5" text-anchor="middle" font-family="sans-serif">${getActionLabel(9)}</text>

			<!-- Right Stick (Look / Cam) -->
			<circle cx="280" cy="150" r="22" fill="#1a1a1c" stroke="#555" stroke-width="2" />
			<circle id="spkmod-gp-btn-11" cx="280" cy="150" r="16" fill="#333" stroke="#ffd54a" stroke-width="1.5" />
			<text x="280" y="148" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">R-Stick</text>
			<text x="280" y="159" fill="#aaa" font-size="8" text-anchor="middle" font-family="sans-serif">${getActionLabel(11)}</text>

			<!-- Face Buttons (X, Y, A, B) -->
			<g transform="translate(350, 100)">
				<!-- Y / Triangle (Btn 3) -->
				<circle id="spkmod-gp-btn-3" cx="0" cy="-22" r="11" fill="#222" stroke="#eab308" stroke-width="2" />
				<text x="0" y="-18" fill="#eab308" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">Y</text>
				<!-- X / Square (Btn 2) -->
				<circle id="spkmod-gp-btn-2" cx="-22" cy="0" r="11" fill="#222" stroke="#3b82f6" stroke-width="2" />
				<text x="-22" y="4" fill="#3b82f6" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">X</text>
				<!-- B / Circle (Btn 1) -->
				<circle id="spkmod-gp-btn-1" cx="22" cy="0" r="11" fill="#222" stroke="#ef4444" stroke-width="2" />
				<text x="22" y="4" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">B</text>
				<!-- A / Cross (Btn 0) -->
				<circle id="spkmod-gp-btn-0" cx="0" cy="22" r="11" fill="#222" stroke="#22c55e" stroke-width="2" />
				<text x="0" y="26" fill="#22c55e" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">A</text>
			</g>
			<!-- Face Buttons Labels -->
			<text x="385" y="85" fill="#ffd54a" font-size="8.5" font-family="sans-serif">Y: ${getActionLabel(3)}</text>
			<text x="385" y="103" fill="#ffd54a" font-size="8.5" font-family="sans-serif">X: ${getActionLabel(2)}</text>
			<text x="385" y="121" fill="#ffd54a" font-size="8.5" font-family="sans-serif">B: ${getActionLabel(1)}</text>
			<text x="385" y="139" fill="#ffd54a" font-size="8.5" font-family="sans-serif">A: ${getActionLabel(0)}</text>
		</svg>
	`;
}

function updateGamepadModalLive(gp) {
	if (!lunHudElements.gamepadModal || lunHudElements.gamepadModal.classList.contains("hidden")) return;
	if (gamepadModalElements.statusText) {
		if (gp) {
			gamepadModalElements.statusText.innerText = t("gamepadConnected", gp.id || "Controller");
			gamepadModalElements.statusText.style.color = "#4ade80";
		} else {
			gamepadModalElements.statusText.innerText = t("gamepadDisconnected");
			gamepadModalElements.statusText.style.color = "#f87171";
		}
	}
	if (gp) {
		const pressed = [];
		for (let i = 0; i < gp.buttons.length && i < 16; i++) {
			const b = gp.buttons[i];
			const isDown = typeof b === "object" ? b.pressed : b > 0.5;
			if (isDown) {
				pressed.push(SPKMOD_GAMEPAD_BUTTON_NAMES[i] || `B${i}`);
			}
			const btnEl = document.getElementById(`spkmod-gp-btn-${i}`);
			if (btnEl) {
				btnEl.setAttribute("fill", isDown ? "#ffd54a" : (i <= 3 || i >= 10 ? "#333" : "#2d2d34"));
			}
		}
		if (gamepadModalElements.pressedKeysText) {
			gamepadModalElements.pressedKeysText.innerText = pressed.length ? `Pressed: ${pressed.join(", ")}` : "";
		}
	}
}

document.body.appendChild(
	lunHudElements.gamepadModal = buildElement("div", {
		id: "spkmod-gamepad-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			gamepadModalElements.headerTitle = buildElement("span", { innerText: t("gamepadHeader"), style: "font-weight: bold; font-size: 12px;" }),
			buildElement("span", {
				id: "spkmod-gamepad-close",
				innerText: "✕",
				style: "cursor: pointer;",
				onclick: _ => lunHudElements.gamepadModal.classList.add("hidden")
			})
		]),
		buildElement("div", { style: "display: flex; justify-content: space-between; gap: 8px; align-items: stretch;" }, [
			gamepadModalElements.statusText = buildElement("div", {
				style: "flex: 1; font-size: 11px; padding: 4px 6px; background: #111; border-radius: 4px; border: 1px solid #333;",
				innerText: t("gamepadDisconnected")
			}),
			gamepadModalElements.enableBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "margin: 0; flex: 0 0 auto; padding: 4px 12px; font-weight: bold; color: " + (spkmodGamepadConfig.enabled ? "#4ade80" : "#f87171") + ";",
				innerText: spkmodGamepadConfig.enabled ? "Gamepad: ON" : "Gamepad: OFF",
				onclick: () => {
					spkmodGamepadConfig.enabled = !spkmodGamepadConfig.enabled;
					saveGamepadConfig();
					gamepadModalElements.enableBtn.innerText = spkmodGamepadConfig.enabled ? "Gamepad: ON" : "Gamepad: OFF";
					gamepadModalElements.enableBtn.style.color = spkmodGamepadConfig.enabled ? "#4ade80" : "#f87171";
					if (!spkmodGamepadConfig.enabled) {
						updateGamepadModalLive(null);
					}
				}
			})
		]),
		gamepadModalElements.pressedKeysText = buildElement("div", {
			style: "font-size: 10px; color: #ffd54a; min-height: 14px;"
		}),
		buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border: 1px solid #333; border-radius: 6px; padding: 6px; background: rgba(0,0,0,0.3);" }, [
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 11px;" }, [
				gamepadModalElements.deadzoneLabel = buildElement("span", { innerText: t("gamepadDeadzoneLabel") }),
				gamepadModalElements.deadzoneValue = buildElement("span", { innerText: Math.round((spkmodGamepadConfig.deadzone || 0.15) * 100) + "%" })
			]),
			gamepadModalElements.deadzoneSlider = buildElement("input", {
				type: "range", min: "0.05", max: "0.40", step: "0.01",
				value: spkmodGamepadConfig.deadzone || 0.15,
				style: "width: 100%; height: 3px; accent-color: #ffd54a; cursor: pointer;",
				oninput: e => {
					spkmodGamepadConfig.deadzone = parseFloat(e.target.value);
					gamepadModalElements.deadzoneValue.innerText = Math.round(spkmodGamepadConfig.deadzone * 100) + "%";
					saveGamepadConfig();
				}
			}),
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;" }, [
				gamepadModalElements.sensLabel = buildElement("span", { innerText: t("gamepadSensLabel") }),
				gamepadModalElements.sensValue = buildElement("span", { innerText: (spkmodGamepadConfig.cameraSensitivity || 1.2).toFixed(1) + "x" })
			]),
			gamepadModalElements.sensSlider = buildElement("input", {
				type: "range", min: "0.2", max: "3.0", step: "0.1",
				value: spkmodGamepadConfig.cameraSensitivity || 1.2,
				style: "width: 100%; height: 3px; accent-color: #ffd54a; cursor: pointer;",
				oninput: e => {
					spkmodGamepadConfig.cameraSensitivity = parseFloat(e.target.value);
					gamepadModalElements.sensValue.innerText = spkmodGamepadConfig.cameraSensitivity.toFixed(1) + "x";
					saveGamepadConfig();
				}
			}),
			buildElement("div", { style: "display: flex; gap: 12px; margin-top: 4px; font-size: 11px;" }, [
				buildElement("div", { style: "display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;" }, [
					gamepadModalElements.droneSensLabel = buildElement("span", { innerText: t("gamepadDroneSpeed") || "Free Camera Speed" }),
					buildElement("div", { style: "display: flex; align-items: center; gap: 4px;" }, [
						gamepadModalElements.droneSensValue = buildElement("span", { style: "font-family: monospace; font-weight: bold; width: 30px; text-align: right;", innerText: (spkmodGamepadConfig.droneSpeed || 0.35).toFixed(2) + "x" }),
						gamepadModalElements.droneSensSlider = buildElement("input", {
							type: "range", min: "0.05", max: "1.0", step: "0.05", value: spkmodGamepadConfig.droneSpeed || 0.35, style: "width: 60px;",
							oninput: e => {
								gamepadModalElements.droneSensValue.innerText = Number(e.target.value).toFixed(2) + "x";
							},
							onchange: e => {
								spkmodGamepadConfig.droneSpeed = Number(e.target.value);
								saveGamepadConfig();
							}
						})
					])
				]),
				buildElement("label", { style: "display: flex; align-items: center; gap: 4px; cursor: pointer;" }, [
					gamepadModalElements.invertXCheckbox = buildElement("input", {
						type: "checkbox", checked: !!spkmodGamepadConfig.invertCameraX,
						onchange: e => { spkmodGamepadConfig.invertCameraX = e.target.checked; saveGamepadConfig(); }
					}),
					gamepadModalElements.invertXLabel = buildElement("span", { innerText: t("gamepadInvertX") })
				]),
				buildElement("label", { style: "display: flex; align-items: center; gap: 4px; cursor: pointer;" }, [
					gamepadModalElements.invertYCheckbox = buildElement("input", {
						type: "checkbox", checked: !!spkmodGamepadConfig.invertCameraY,
						onchange: e => { spkmodGamepadConfig.invertCameraY = e.target.checked; saveGamepadConfig(); }
					}),
					gamepadModalElements.invertYLabel = buildElement("span", { innerText: t("gamepadInvertY") })
				])
			])
		]),
		gamepadModalElements.diagramContainer = buildElement("div", {
			id: "spkmod-gamepad-diagram",
			className: "hidden",
			style: "width: 100%; margin: 4px 0; border: 1px solid #333; border-radius: 6px; padding: 4px; background: rgba(0,0,0,0.5); box-sizing: border-box;"
		}),
		gamepadModalElements.bindingsContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 2px; max-height: 200px; overflow-y: auto; padding-right: 4px;"
		}),
		buildElement("div", { style: "display: flex; gap: 6px; margin-top: 4px;" }, [
			gamepadModalElements.toggleDiagramBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 1;",
				innerText: window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"),
				onclick: () => {
					window.__showGamepadDiagram = !window.__showGamepadDiagram;
					if (gamepadModalElements.diagramContainer) {
						gamepadModalElements.diagramContainer.classList.toggle("hidden", !window.__showGamepadDiagram);
					}
					if (gamepadModalElements.toggleDiagramBtn) {
						setText(gamepadModalElements.toggleDiagramBtn, window.__showGamepadDiagram ? t("gamepadHideDiagramBtn") : t("gamepadShowDiagramBtn"));
					}
					renderGamepadDiagram();
				}
			}),
			gamepadModalElements.resetBtn = buildElement("button", {
				className: "spkmod-panel-btn",
				style: "flex: 0 0 auto;",
				innerText: t("gamepadResetBtn"),
				onclick: () => {
					spkmodGamepadConfig = JSON.parse(JSON.stringify(SPKMOD_DEFAULT_GAMEPAD_CONFIG));
					saveGamepadConfig();
					gamepadModalElements.deadzoneSlider.value = spkmodGamepadConfig.deadzone;
					gamepadModalElements.deadzoneValue.innerText = Math.round(spkmodGamepadConfig.deadzone * 100) + "%";
					gamepadModalElements.sensSlider.value = spkmodGamepadConfig.cameraSensitivity;
					gamepadModalElements.droneSensSlider.value = spkmodGamepadConfig.droneSpeed;
					gamepadModalElements.droneSensValue.innerText = spkmodGamepadConfig.droneSpeed.toFixed(2) + "x";
					gamepadModalElements.sensValue.innerText = spkmodGamepadConfig.cameraSensitivity.toFixed(1) + "x";
					gamepadModalElements.invertXCheckbox.checked = false;
					gamepadModalElements.invertYCheckbox.checked = false;
					refreshGamepadBindingsUI();
					renderGamepadDiagram();
				}
			})
		])
	])
);

function pollGamepadLoop() {
	const gamepads = typeof navigator.getGamepads === "function" ? navigator.getGamepads() : [];
	let gp = null;
	for (let i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && gamepads[i].connected) {
			gp = gamepads[i];
			break;
		}
	}

	if (lunPanelElements.freeCamBtn) {
		const isConnected = !!gp;
		const display = isConnected ? "" : "none";
		if (lunPanelElements.freeCamBtn.style.display !== display) {
			lunPanelElements.freeCamBtn.style.display = display;
		}
	}

	if (gp) {
		updateGamepadModalLive(gp);

		if (spkmodGamepadConfig.enabled) {
			const deadzone = spkmodGamepadConfig.deadzone || 0.15;
			const sens = spkmodGamepadConfig.cameraSensitivity || 1.2;

		let lx = gp.axes[0] || 0;
		let ly = gp.axes[1] || 0;
		const lMag = Math.hypot(lx, ly);

		if (lMag > deadzone) {
			const camYaw = gameState?.cameraController ? gameState.cameraController.cameraYaw : 0;
			const worldX = lx * Math.cos(camYaw) + ly * Math.sin(camYaw);
			const worldZ = -lx * Math.sin(camYaw) + ly * Math.cos(camYaw);
			gamepadMoveVector = normalizeVector(worldX, worldZ);
		} else {
			gamepadMoveVector = null;
		}

		let rx = gp.axes[2] || 0;
		let ry = gp.axes[3] || 0;

		if (Math.abs(rx) > deadzone && gameState?.cameraController && !lunCameraLocked) {
			const invX = spkmodGamepadConfig.invertCameraX ? -1 : 1;
			gameState.cameraController.cameraYaw += rx * sens * invX * 0.05;
		}
		if (Math.abs(ry) > deadzone && gameState?.cameraController && !lunCameraLocked && !lunFirstPersonActive) {
			const invY = spkmodGamepadConfig.invertCameraY ? -1 : 1;
			const deltaPitch = ry * 0.03 * sens * invY;
			if (gameState.cameraController.cameraPitch !== undefined) {
				gameState.cameraController.cameraPitch = Math.max(-0.5, Math.min(1.2, gameState.cameraController.cameraPitch - deltaPitch));
			} else if (gameState.cameraController.pitch !== undefined) {
				gameState.cameraController.pitch = Math.max(-0.5, Math.min(1.2, gameState.cameraController.pitch - deltaPitch));
			} else if (gameState.cameraController.cameraElevation !== undefined) {
				gameState.cameraController.cameraElevation = Math.max(0.1, Math.min(2.5, gameState.cameraController.cameraElevation - deltaPitch));
			} else if (gameState.cameraController.cameraOffsetY !== undefined) {
				gameState.cameraController.cameraOffsetY = Math.max(0, Math.min(10, gameState.cameraController.cameraOffsetY - deltaPitch * 5));
			}
		}

		for (let b = 0; b < gp.buttons.length && b < 16; b++) {
			const btnObj = gp.buttons[b];
			const isPressed = typeof btnObj === "object" ? btnObj.pressed : btnObj > 0.5;
			const wasPressed = gamepadPrevButtons[b];

			if (isPressed && !wasPressed) {
				if (gamepadListeningAction) {
					spkmodGamepadConfig.bindings[b] = gamepadListeningAction;
					saveGamepadConfig();
					gamepadListeningAction = null;
					refreshGamepadBindingsUI();
				} else {
					const action = spkmodGamepadConfig.bindings[b];
					if (action) executeGamepadAction(action);
				}
			}

			gamepadPrevButtons[b] = isPressed;
		}
		} else {
			gamepadMoveVector = null;
		}
	} else {
		gamepadMoveVector = null;
		updateGamepadModalLive(null);
	}

	requestAnimationFrame(pollGamepadLoop);
}

requestAnimationFrame(pollGamepadLoop);

document.body.appendChild(
	lunHudElements.hotkeysModal = buildElement("div", {
		id: "spkmod-hotkeys-modal",
		className: "hidden",
		style: "position: absolute; top: 15%; left: 50%; transform: translateX(-50%); width: 350px; background: rgba(15, 23, 42, 0.95); border: 1px solid #1e293b; border-radius: 8px; z-index: 9999; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #f8fafc;"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between; align-items: center;" }, [
			hotkeysModalElements.headerTitle = buildElement("span", {
				innerText: "⌨️ " + (typeof t === 'function' && t("hotkeysModalTitle") ? t("hotkeysModalTitle") : "Hotkeys"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-hotkeys-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.hotkeysModal.classList.add("hidden")
			})
		]),
		hotkeysModalElements.contentContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto; padding: 6px; font-size: 11px;"
		})
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.hotkeysModal && hotkeysModalElements.headerTitle) {
		makeDraggable(lunHudElements.hotkeysModal, [hotkeysModalElements.headerTitle]);
	}
}, 500);

function toggleHotkeysModal() {
	if (!lunHudElements.hotkeysModal) return;
	const isClosed = lunHudElements.hotkeysModal.classList.contains("hidden");
	if (isClosed) {
		positionModalNicely(lunHudElements.hotkeysModal);
		lunHudElements.hotkeysModal.classList.remove("hidden");
		renderHotkeysUI();
	} else {
		lunHudElements.hotkeysModal.classList.add("hidden");
	}
}

function renderHotkeysUI() {
	if (!hotkeysModalElements.contentContainer) return;
	const c = hotkeysModalElements.contentContainer;
	c.innerHTML = "";
	
	const hotkeys = [
		{ k: "P", d: (typeof t === 'function' ? t("hkDescToggleUI") : "") || "Toggle UI Visibility" },
		{ k: "F2", d: (typeof t === 'function' ? t("hkDescModSettings") : "") || "Open Mod Settings" },
		{ k: "F3", d: (typeof t === 'function' ? t("hkDescResetPositions") : "") || "Reset Window Positions" },
		{ k: "F4", d: (typeof t === 'function' ? t("hkDescDroneMode") : "") || "Toggle Drone Camera Mode" },
		{ k: "N", d: (typeof t === 'function' ? t("hkDescNightMode") : "") || "Toggle Native Night Mode" },
		{ k: "Ctrl + U", d: (typeof t === 'function' ? t("hkDescResetUIScale") : "") || "Reset Game UI Scale" },
		{ k: "Ctrl + 6", d: (typeof t === 'function' ? t("hkDescCamNormal") : "") || "Camera Effect: None" },
		{ k: "Ctrl + 7", d: (typeof t === 'function' ? t("hkDescCamBW") : "") || "Camera Effect: B&W" },
		{ k: "Ctrl + 8", d: (typeof t === 'function' ? t("hkDescCamSepia") : "") || "Camera Effect: Sepia" },
		{ k: "Ctrl + 9", d: (typeof t === 'function' ? t("hkDescCamMorning") : "") || "Camera Effect: Morning" },
		{ k: "Ctrl + 0", d: (typeof t === 'function' ? t("hkDescCamDusk") : "") || "Camera Effect: Dusk" },
		{ k: "W, A, S, D", d: (typeof t === 'function' ? t("hkDescDroneMove") : "") || "Drone Mode: Move" },
		{ k: "Space", d: (typeof t === 'function' ? t("hkDescDroneAscend") : "") || "Drone Mode: Ascend" },
		{ k: "Left Ctrl", d: (typeof t === 'function' ? t("hkDescDroneDescend") : "") || "Drone Mode: Descend" },
		{ k: "Numpad +", d: (typeof t === 'function' ? t("hkDescDroneSpeedUp") : "") || "Drone Mode: Speed Up" },
		{ k: "Numpad -", d: (typeof t === 'function' ? t("hkDescDroneSpeedDown") : "") || "Drone Mode: Speed Down" }
	];
	
	hotkeys.forEach(hk => {
		c.appendChild(buildElement("div", {
			style: "display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;"
		}, [
			buildElement("span", { innerText: hk.k, style: "font-weight: bold; color: #ffeb3b;" }),
			buildElement("span", { innerText: hk.d })
		]));
	});
}

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(() => {
		if (lunHudElements && lunHudElements.hotkeysModal && !lunHudElements.hotkeysModal.classList.contains("hidden")) {
			renderHotkeysUI();
		}
		if (typeof updateLocalEditsUI === "function") {
			updateLocalEditsUI();
		}
	});
}

if (typeof window.spkmodUpdatePresetListUI === 'function') window.spkmodUpdatePresetListUI();
if (typeof window.spkmodRestoreFloatingButtons === 'function') {
	setTimeout(window.spkmodRestoreFloatingButtons, 100);
}