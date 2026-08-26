// Global token store
window.speakiAuthToken = window.speakiAuthToken || "";

// Intercept fetch requests to continuously update the Auth Token
if (!window.__speakiFetchHooked) {
	window.__speakiFetchHooked = true;
	const origFetch = window.fetch;
	window.fetch = async function (...args) {
		const [resource, config] = args;
		const headers = config?.headers;
		if (headers) {
			const authHeader = headers.Authorization || headers.authorization || headers.Bearer;
			if (authHeader && authHeader.includes("eyJhb")) {
				window.speakiAuthToken = authHeader.replace("Bearer ", "").trim();
			}
		}
		return origFetch.apply(this, args);
	};
}

const usingDevToolsOrOldSpeakiInjector = !window.speakiInjectorVer;

if (!window.gameState) {
	alert("SpeakiMod is not installed correctly or the game updated! Can't proceed.");
	throw "Injection error...";
}

if (!window.i18n) {
	if (usingDevToolsOrOldSpeakiInjector)
		alert("Warning: SpeakiMod failed to discover 'i18n'. The mod will work, but you will see internal names instead of properly translated ones.\n\nPotential causes:\n- You are using the DevTools injection method\n- Game code changed");
	else
		alert("Warning: SpeakiMod failed to discover 'i18n'. The mod will work, but you will see internal names instead of properly translated ones.\n\nPotential causes:\n- Game code changed");
	window.i18n = e => e;
}

if (!window.questManager) {
	if (usingDevToolsOrOldSpeakiInjector)
		alert("Warning: SpeakiMod failed to discover 'questManager'. The Quest Pinning functionality will be disabled.\n\nPotential causes:\n- You are using the DevTools injection method\n- You are using an outdated version of the SpeakiMod Injector extension");
	else
		alert("Warning: SpeakiMod failed to discover 'questManager'. The Quest Pinning functionality will be disabled.\n\nPotential causes:\n- Game code changed");
}
const socketUrl = gameState.socket?.socket?.url || gameState.socket?.url || "";
// This is needed to make requests to 'gameData', 'channels' and other API endpoints
// NEW (SAFE):
function getAuthToken() {
	// 1. Check if captured via fetch interceptor
	if (window.speakiAuthToken) return window.speakiAuthToken;

	// 2. Safe check on legacy gameState structure (with optional chaining)
	const socketUrl = gameState?.socket?.socket?.url || gameState?.socket?.url || "";
	const match = socketUrl.match(/eyJhb.+?(?=&|$)/);
	if (match) return match[0];

	return "";
}
if (!getAuthToken()) {
	console.warn("[SpeakiMod] AuthToken could not be retrieved yet. Socket connection might not be initialized.");
}
const Emotes = {
	Cry: 1,
	Jump: 2,
	PumpkinJoayo: 3,
	StrokeStart: 4,
	StrokeStage2: 5,
	StrokeBloom: 6,
	StrokeCancel: 7,
	Dance: 8
};

// This map does NOT have quest locations and Monatium!
const Portals = {
	1: {
		2: {
			portalId: 1,
			pos: {
				x: 95,
				z: 50
			}
		}
	},
	2: {
		1: {
			portalId: 2,
			pos: {
				x: 105,
				z: 50
			}
		},
		5: {
			portalId: 7,
			pos: {
				x: 196,
				z: 100
			}
		}
	},
	5: {
		2: {
			portalId: 8,
			pos: {
				x: 204,
				z: 100
			}
		},
		3: {
			portalId: 3,
			pos: {
				x: 296,
				z: 120
			}
		}
	},
	3: {
		5: {
			portalId: 4,
			pos: {
				x: 306,
				z: 120
			}
		},
		6: {
			portalId: 9,
			pos: {
				x: 426,
				z: 100
			}
		}
	},
	6: {
		3: {
			portalId: 10,
			pos: {
				x: 434,
				z: 100
			}
		},
		4: {
			portalId: 5,
			pos: {
				x: 554,
				z: 100
			}
		}
	},
	4: {
		6: {
			portalId: 6,
			pos: {
				x: 580,
				z: 100
			}
		},
		7: {
			portalId: 11,
			pos: {
				x: 656,
				z: 100
			}
		}
	},
	7: {
		4: {
			portalId: 12,
			pos: {
				x: 664,
				z: 100
			}
		},
		8: {
			portalId: 13,
			pos: {
				x: 756,
				z: 100
			}
		}
	},
	8: {
		7: {
			portalId: 14,
			pos: {
				x: 764,
				z: 100
			}
		},
		9: {
			portalId: 15,
			pos: {
				x: 956,
				z: 100
			}
		}
	},
	9: {
		8: {
			portalId: 16,
			pos: {
				x: 964,
				z: 100
			}
		},
		10: {
			portalId: 17,
			pos: {
				x: 1136,
				z: 100
			}
		}
	},
	10: {
		9: {
			portalId: 18,
			pos: {
				x: 1144,
				z: 100
			}
		}
	}
};
// Very cringe and could be generated automatically but gijfogjifsdogd fuck graph theory
// This won't work btw if I decide to add quest portal support & Monatium
const ZoneSequences = [1, 2, 5, 3, 6, 4, 7, 8, 9, 10];
const Waypoints = {
	5: [
		{
			x: 272,
			z: 106,
			crossed: false
		}
	]
};

var GameData = null;

/*
fetch("https://sr1.overture.io.kr/api/gamedata", {
	"method": "GET",
	"headers": {
		"authorization": "Bearer " + AuthToken
	},
	"mode": "cors"
}).then(async x => {
	if (!x.ok) {
		// TODO: Special case for 429? idk if it will happen or not
		alert("SpeakiMod is outdated or the game servers are down! Failed to fetch gamedata: " + x.status + "\nSome features will be hidden.");
		return;
	}

	GameData = await x.json();

	onGameDataUpdate();
});
*/

function buildElement(tag, characteristics, inner, callback) {
	var elem = document.createElement(tag);
	elem.replaceChildren(...(inner?.filter(t => t) || []));
	for (const _ in (characteristics || {})) {
		elem[_] = characteristics[_];
	}
	if (callback) callback(elem);
	return elem;
}

function setText(elem, text) {
	if (elem && elem.innerText !== text) {
		elem.innerText = text;
	}
}

var lunHudElements = {
	playersNearby: null,
	expTrackerL1: null,
	expTrackerL2: null,
	channelTracker: null,
	zoneId: null,
	pinnedQuest: {
		panel: null,
		content: null,
		pbar: null
	}
};
var lunPanelElements = {
	targetZone: null,
	resetCameraBtn: null,
	walkToPortalBtn: null
};
var lunMenuFoldingLevel = 0;

var lunTickCount = 0;
var lunSleep = 0;
const lunTPS = 20;
const lunExpTrackerWindow = 60000 / lunTPS;
var lunExpTrackerNextTicks = 0;
var lunExpTrackerStartExp = 0;
var lunExpTrackerSpeed = 0;

var lunChannelTrackerWindow = 10000 / lunTPS;
var lunChannelTrackerNextTicks = 0;

var lunWalkToPortal = -1;
var lunAutoTravelTarget = null;
var lunCameraLocked = false;
var lunNametagsHidden = false;
var lunViewClip = false;

const spkmodBorderWidth = "3px";

document.head.appendChild(buildElement(
	"style",
	{
		id: "spkmod-stylesheet",
		innerHTML: `
		#spkmod-hud {
			display: flex;
			flex-direction: row;
			gap: 4px;
			position: absolute;
			top: 225px;
			left: 5px;
			z-index: 500000;
			color: #EEE;
			user-select: none;
		}
		#spkmod-main {
			display: flex;
			flex-direction: column;
			gap: 1px;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 6px;
		}
		#spkmod-panel {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}
		#spkmod-header, #spkmod-texpb, #spkmod-pq-header {
			border-bottom: 1px solid #DDD;
			margin-bottom: 4px;
		}
		.spkmod-panel-btn {
			color: #EEE;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 5px;
			font-size: 11pt;
			cursor: pointer;
			outline: none;
			flex: 1;
		}
		.spkmod-watch-player-btn {
			color: #FFF;
			border-color: #333;
			box-shadow: 0 .1875rem 0 #333;
			background: #000;
		}
		.spkmod-panel-cat {
			display: flex;
			flex-direction: row;
			gap: 2px;
			align-items: center;
		}
		
		.spkmod-panel-btn-small {
			padding: 5px 8px;
			font-size: 10pt;
			flex: 1;
		}
		.spkmod-panel-counter {
			outline: none;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			background: #000C;
			color: #EEE;
			height: min-content;
		}
		.spkmod-panel-counter::-webkit-inner-spin-button, 
		.spkmod-panel-counter::-webkit-outer-spin-button {
			opacity: 1;
		}
		.spkmod-panel-combo {
			outline: none;
			background: #000C;
			color: #EEE;
			border-radius: 8px;
			border: ${spkmodBorderWidth} solid #DDD;
		}
		.spkmod-pq-button {
			background: #000;
			color: var(--sr-color-text-inverse);
			border-color: #333;
			box-shadow: 0 .1875rem 0 #333;
			height: 2.125rem;
			padding: 0 var(--sr-space-3);
			border-radius: var(--sr-radius-md);
			font-size: var(--sr-font-md);
			cursor: var(--sr-cursor-pumpkin);
			user-select: none;
			border: .125rem solid #0000;
			font-weight: 600;
		}
		#spkmod-pq {
			display: flex;
			flex-direction: column;
			position: absolute;
			right: 220px;
			z-index: 600000;
			width: 20%;
			color: #FFF;
			top: 18px;
			background: #000C;
			border: ${spkmodBorderWidth} solid #DDD;
			border-radius: 8px;
			padding: 6px;
		}
		/* honest to god forgot CSS is stupid like that */
		.hidden, #spkmod-pq.hidden {
			display: none;
		}
		#spkmod-pq-pbar {
			margin-top: 2px;
			background: #0F0;
			height: 2px;
		}
		`
		
	}
));

document.body.appendChild(
	buildElement("div", {
		id: "spkmod-hud"
	}, [
		buildElement("div", {
			id: "spkmod-main"
		}, [
			buildElement("span", {
				id: "spkmod-header",
				innerText: "SpeakiMod v5.1",
				onclick: _ => {
					lunMenuFoldingLevel = (lunMenuFoldingLevel + 1) % 4;
					switch (lunMenuFoldingLevel) {
						case 0:
							document.querySelector("#spkmod-panel").style.display = "";
							lunHudElements.channelTracker.style.display = "";
							document.querySelector("#spkmod-hud").style.opacity = "";
							lunChannelTrackerNextTicks = 0;
							break;
						case 1:
							document.querySelector("#spkmod-panel").style.display = "none";
							break;
						case 2:
							lunHudElements.channelTracker.style.display = "none";
							break;
						case 3:
							document.querySelector("#spkmod-hud").style.opacity = "10%";
							break;
					}
				}
			}),
			lunHudElements.playersNearby = buildElement("span", {
				innerText: "Players nearby: 0"
			}),
			lunHudElements.zoneId = buildElement("span", {
				innerText: "Zone ID: N/A"
			}),
			lunHudElements.expTrackerL1 = buildElement("span", {
				innerText: "0 EXP per minute"
			}),
			lunHudElements.expTrackerL2 = buildElement("span", {
				id: "spkmod-texpb",
				innerText: "Until next level: N/A"
			}),
			lunHudElements.channelTracker = buildElement("span", {
				innerText: "Channel tracker: N/A"
			})
		]),
		buildElement("div", {
			id: "spkmod-panel"
		}, [
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "Dance",
				value: "",
				onclick: _ => {
					window.wasDancing = true; // Track dance state
					gameState.sendEmoteNow(Emotes.Dance);
				}
			}),
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "Chowayo",
				value: "",
				onclick: _ => {
					gameState.sendEmoteNow(Emotes.PumpkinJoayo);
				}
			}),
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "Turn to Camera",
				value: "",
				onclick: _ => {
					gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
					gameState.moveSendAccumulator = 1;
				}
			}),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				buildElement("button", {
					id: "spkmod-beyblade-main-btn",
					className: "spkmod-panel-btn",
					style: "flex: 2;",
					innerText: "BeyBlade: OFF",
					value: "",
					onclick: e => {
						window.BeyBladeActive = !window.BeyBladeActive;
						updateBeyBladeButtonText();

						if (window.BeyBladeActive) {
							chatLog(`BeyBlade activated at x${window.BeyBladeSpeed || 1}!`);
						} else {
							// 1. Reset character rotation to face the camera
							if (gameState.playerContainer && gameState.cameraController) {
								gameState.playerContainer.rotation.y = gameState.cameraController.cameraYaw;
								gameState.moveSendAccumulator = 1;
							}

							// 2. Resume dancing if dance was active before BeyBlade
							if (window.wasDancing) {
								setTimeout(() => {
									gameState.sendEmoteNow(Emotes.Dance);
								}, 100); // Brief delay so camera rotation finishes applying first
							}

							chatLog("BeyBlade deactivated.");
						}
					}
				}),
				buildElement("button", {
					className: "spkmod-panel-btn spkmod-panel-btn-small",
					innerText: "x1",
					value: "",
					onclick: _ => {
						window.BeyBladeSpeed = 1;
						updateBeyBladeButtonText();
						chatLog("BeyBlade speed set to x1");
					}
				}),
				buildElement("button", {
					className: "spkmod-panel-btn spkmod-panel-btn-small",
					innerText: "x3.5",
					value: "",
					onclick: _ => {
						window.BeyBladeSpeed = 3.5;
						updateBeyBladeButtonText();
						chatLog("BeyBlade speed set to x3.5");
					}
				}),
				buildElement("button", {
					className: "spkmod-panel-btn spkmod-panel-btn-small",
					innerText: "x5",
					value: "",
					onclick: _ => {
						window.BeyBladeSpeed = 5;
						updateBeyBladeButtonText();
						chatLog("BeyBlade speed set to x5");
					}
				})
			]),
			lunPanelElements.resetCameraBtn = buildElement("button", {
				className: "spkmod-panel-btn hidden",
				innerText: "Reset Camera",
				value: "",
				onclick: _ => {
					watchPlayer();
				}
			}),
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "Lock Camera",
				value: "",
				onclick: e => {
					lunCameraLocked = !lunCameraLocked;
					e.target.innerText = lunCameraLocked ? "Unlock Camera" : "Lock Camera";
				}
			}),
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "Hide Nametags",
				value: "",
				onclick: e => {
					lunNametagsHidden = !lunNametagsHidden;
					e.target.innerText = lunNametagsHidden ? "Show Nametags" : "Hide Nametags";
				}
			}),
			buildElement("button", {
				className: "spkmod-panel-btn",
				innerText: "ViewClip OFF",
				value: "",
				onclick: e => {
					lunViewClip = !lunViewClip;
					e.target.innerText = lunViewClip ? "ViewClip ON" : "ViewClip OFF";
				}
			}),
			buildElement("div", {
				className: "spkmod-panel-cat"
			}, [
				lunPanelElements.walkToPortalBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					innerText: "Walk to Portal",
					value: "",
					onclick: e => {
						if (lunWalkToPortal == -1) {
							lunWalkToPortal = lunPanelElements.targetZone.value - 0;
							setText(e.target, "Stop Walking");
							chatLog(`Walking to ${lunPanelElements.targetZone.options[lunPanelElements.targetZone.selectedIndex].innerText} (${lunWalkToPortal}).`);
						} else {
							resetWalkToPortal();
							chatLog("Stopped autowalking.");
						}

						e.target.blur();
						lunPanelElements.targetZone.blur();
					}
				}),
				lunPanelElements.targetZone = buildElement("select", {
					className: "spkmod-panel-combo"
				}, Object.keys(Portals).map(zoneId => buildElement("option", {
					value: zoneId - 0,
					innerText: i18n(`content.zone.${zoneId}.name`)
				})))
			])
		])
	])
);

document.body.appendChild(
	lunHudElements.pinnedQuest.panel = buildElement("div", {
		id: "spkmod-pq",
		className: "hidden"
	}, [
		buildElement("span", {
			id: "spkmod-pq-header",
			innerText: "Pinned Quest"
		}),
		lunHudElements.pinnedQuest.content = buildElement("span", {
			id: "spkmod-pq-content",
			innerText: "Pin a quest to be displayed here until completion."
		}),
		lunHudElements.pinnedQuest.pbar = buildElement("div", {
			id: "spkmod-pq-pbar"
		})
	])
)

function updateBeyBladeButtonText() {
	const mainBtn = document.querySelector("#spkmod-beyblade-main-btn");
	if (!mainBtn) return;

	const speed = window.BeyBladeSpeed || 1;
	if (window.BeyBladeActive) {
		setText(mainBtn, `BeyBlade: ON (x${speed})`);
	} else {
		setText(mainBtn, `BeyBlade: OFF (x${speed})`);
	}
}

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
	return gameState.playerContainer.position;
}

function chatLog(msg) {
	gameState.chatBox.append(-1337, "SpeakiMod", msg);
}

function watchPlayer(name) {
	if (name) {
		const pi = Object.values(Object.fromEntries(gameState.remotePlayers.remotePlayers)).find(t => t.info.name == name);
		if (pi) {
			gameState.cameraController.target = pi.container;
			lunPanelElements.resetCameraBtn.classList.remove("hidden");
			chatLog(`The camera will be following ${name} now.`);
			return;
		} else {
			chatLog("Couldn't find the target player. The camera will be following you now.");
		}
	} else {
		chatLog("The camera will be following you now.");
	}

	lunPanelElements.resetCameraBtn.classList.add("hidden");
	gameState.cameraController.target = gameState.playerContainer;
}

var hPartyTarget = document.querySelector(".sr-party-target");
if (hPartyTarget) {
	hPartyTarget.insertBefore(
		buildElement("button", {
			className: "sr-btn sr-party-target__btn spkmod-watch-player-btn",
			innerText: "[SM] Watch",
			value: "",
			onclick: e => {
				watchPlayer(e.target.parentElement.querySelector(".sr-party-target__name").innerText);
			}
		}),
		hPartyTarget.querySelector(".sr-party-target__close")
	)
} else {
	alert("Warning: Couldn't find party target element. The Watch functionality will only be available through chat commands. Mod loaded too early?");
}

const lunPinnedQuestInterval = sec(2);
var lunPinnedQuestPeriod = null;
var lunPinnedQuestId = 0;
var lunPinnedQuestContent = null;
var lunPinnedQuestNextQueryTick = 0;

function updatePinnedQuestDisplay(quest) {
	lunPinnedQuestContent = `${i18n(`content.quest.${quest.code}.description`)} ${quest.currentAmount} / ${quest.targetAmount}`;
	setText(lunHudElements.pinnedQuest.content, lunPinnedQuestContent);
	lunHudElements.pinnedQuest.pbar.style.width = `${((quest.currentAmount / quest.targetAmount) * 100).toFixed(0)}%`;
}

function unpinQuest() {
	lunHudElements.pinnedQuest.panel.className = "hidden";

	lunPinnedQuestContent = null;
	lunPinnedQuestPeriod = null;
	lunPinnedQuestId = 0;
	lunPinnedQuestNextQueryTick = 0;
}

function pinQuest(quest) {
	lunPinnedQuestPeriod = quest.period;
	lunPinnedQuestId = quest.questId;
	lunPinnedQuestNextQueryTick = lunTickCount + sec(1);

	updatePinnedQuestDisplay(quest);

	lunHudElements.pinnedQuest.panel.className = "";
}

if (window.questManager) {
	const hkRenderRow = questManager.prototype.renderRow;
	questManager.prototype.renderRow = function (quest) {
		var questElm = hkRenderRow.apply(this, [quest]);

		if (!quest.isCompleted) {
			questElm.querySelector(".sr-list-item__subtitle")
				.replaceWith(
					buildElement("button", {
						value: "",
						className: "spkmod-pq-button",
						innerText: "Pin Quest",
						onclick: _ => {
							pinQuest(quest, questElm);
						}
					})
				);
		}

		return questElm;
	};
}

function onGameDataUpdate() {

}

function resetWalkToPortal() {
	lunWalkToPortal = -1;
	Object.values(Waypoints).forEach(t => t.forEach(w => w.crossed = false));
	setText(lunPanelElements.walkToPortalBtn, "Walk to Portal");
}

window.beyBladeAngle = window.beyBladeAngle || 0;
window.__beyBladeLastTime = window.__beyBladeLastTime || performance.now();

if (!window.__beyBladeLoopRunning) {
	window.__beyBladeLoopRunning = true;

	function beyBladeRenderLoop(currentTime) {
		if (window.BeyBladeActive && gameState && gameState.playerContainer) {
			const delta = (currentTime - window.__beyBladeLastTime) / 1000;
			const clampedDelta = Math.min(delta, 0.1);
			const speedMultiplier = window.BeyBladeSpeed || 3;
			const baseSpeed = 15.0;

			window.beyBladeAngle += baseSpeed * speedMultiplier * clampedDelta;
			gameState.playerContainer.rotation.y = window.beyBladeAngle;

			if (Math.random() < 0.2) {
				gameState.moveSendAccumulator = 1;
			}
		}

		window.__beyBladeLastTime = currentTime;
		requestAnimationFrame(beyBladeRenderLoop);
	}

	requestAnimationFrame(beyBladeRenderLoop);
}

function tick() {
	if (gameState.isDead && lunWalkToPortal != -1) {
		resetWalkToPortal();
		chatLog("Stopped autowalking because you died (lol)");
	}
	// Schedule next jump tick target reliably
	if (window.BeyBladeActive && gameState.playerContainer) {
		if (!window.beyBladeNextJumpTick) {
			window.beyBladeNextJumpTick = lunTickCount + 50;
		}

		if (lunTickCount >= window.beyBladeNextJumpTick) {
			// gameState.sendEmoteNow(Emotes.Jump);
			// Disabled for now, testing
			// Re-roll random jump delay between 25 and 100 ticks (0.5s - 2.0s)
			const nextInterval = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
			window.beyBladeNextJumpTick = lunTickCount + nextInterval;
		}
	} else {
		window.beyBladeNextJumpTick = 0;
	}
	lunAutoTravelTarget = null;
	lunTickCount++;
	lunSleep--;

	var playerExp = gameState.myStat.exp;
	var zoneId = gameState.zoneId % 10000;

	setText(lunHudElements.playersNearby, `Players nearby: ${gameState.remotePlayers.remotePlayers.size}`);
	setText(lunHudElements.zoneId, `Zone ID: ${zoneId}`);

	if (lunExpTrackerStartExp > playerExp || lunTickCount >= lunExpTrackerNextTicks) {
		lunExpTrackerSpeed = (playerExp - lunExpTrackerStartExp) / lunExpTrackerWindow * (1000 / lunTPS);

		lunExpTrackerNextTicks = lunTickCount + lunExpTrackerWindow;
		lunExpTrackerStartExp = playerExp;
	}

	var expTrackerL1 = "0 EXP per minute";
	var expTrackerL2 = "Until next level: N/A";
	if (lunExpTrackerSpeed > 0) {
		expTrackerL1 = `${(lunExpTrackerSpeed * 60).toFixed(2)} EXP per minute`;
		expTrackerL2 = `Until next level: ~${((gameState.myStat.maxExp - playerExp) / lunExpTrackerSpeed / 60).toFixed(2)} min`;
	}
	expTrackerL1 += ` (${((lunExpTrackerNextTicks - lunTickCount) * lunTPS / 1000).toFixed(0)}s)`;

	setText(lunHudElements.expTrackerL1, expTrackerL1);
	setText(lunHudElements.expTrackerL2, expTrackerL2);

	if (lunMenuFoldingLevel < 2 && lunTickCount >= lunChannelTrackerNextTicks) {
		fetch("https://sr1.overture.io.kr/api/realtime/channels", {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			var resp = (await x.json());
			if (!x.ok) {
				setText(lunHudElements.channelTracker, `Channel tracker: Error ${x.status}`);
				return;
			}

			setText(lunHudElements.channelTracker, resp.map(t => `Channel ${t.channel}: ${t.population}/${t.capacity}`).join("\n"));
		});

		lunChannelTrackerNextTicks = lunTickCount + lunChannelTrackerWindow;
	}

	if (lunPinnedQuestId && lunTickCount >= lunPinnedQuestNextQueryTick) {
		fetch(`https://sr1.overture.io.kr/api/quests?period=${lunPinnedQuestPeriod}`, {
			"method": "GET",
			"headers": {
				"authorization": `Bearer ${getAuthToken()}`
			},
			"mode": "cors"
		}).then(async x => {
			var resp = (await x.json());
			if (!x.ok) {
				setText(lunHudElements.pinnedQuest.content, `Failed to update quest info: ${x.status}`);
				return;
			}

			var q = resp.find(t => t.questId == lunPinnedQuestId);
			if (!q || q.isClaimed) {
				unpinQuest();
				return;
			}

			updatePinnedQuestDisplay(q);
		});

		lunPinnedQuestNextQueryTick += lunPinnedQuestInterval;
	}

	gameState.remotePlayers.remotePlayers.forEach(t => t.container.children[0].children[1].visible = !lunNametagsHidden);

	if (lunWalkToPortal != -1 && zoneId) {
		const currentIndex = ZoneSequences.indexOf(zoneId - 0);
		const targetIndex = ZoneSequences.indexOf(lunWalkToPortal - 0);

		if (currentIndex == -1 || targetIndex == -1) {
			chatLog(`Stopped autowalking because there doesn't seem to be a way to get to the specified zone (z ${zoneId} -> ${currentIndex}, lw ${lunWalkToPortal} -> ${targetIndex}).`);
			resetWalkToPortal();
			return;
		}

		const sg = Math.sign(targetIndex - currentIndex);

		if (sg == 0) {
			resetWalkToPortal();
			chatLog("You've arrived!");
			return;
		} else {
			const targetZone = ZoneSequences[currentIndex + sg];

			const portals = Portals[zoneId];
			if (!portals) {
				resetWalkToPortal();
				chatLog("Stopped autowalking because the current zone has no portals registered.");
				return;
			}

			const targetPortal = portals[targetZone];
			if (!targetPortal) {
				resetWalkToPortal();
				chatLog("Stopped autowalking because it seems there is a portal missing.");
				return;
			}

			// might look a bit jerky without `while` on a zone with multiple wps
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

			// tryUsePortal thankfully automatically handles transition delays (for now at least)
			// this logic HEAVILY relies on that function returning 'true' during transitions
			// and not sending off anything unnecessary to the server (thanks to gs.findNearbyPortal())
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

var hkCombatAssistUpdate = gameState.combatAssist.update.bind(gameState.combatAssist);
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

	return hkCombatAssistUpdate(e);
}

var hkComputeCameraTargetPosition = gameState.cameraController.computeCameraTargetPosition.bind(gameState.cameraController);
gameState.cameraController.computeCameraTargetPosition = (pos) => {
	if (!lunCameraLocked)
		return hkComputeCameraTargetPosition(pos);
}

var hkCameraControllerGetObstacles = gameState.cameraController.getObstacles.bind(gameState.cameraController);
gameState.cameraController.getObstacles = () => lunViewClip ? [] : hkCameraControllerGetObstacles()

var hkTrySendChat = gameState.trySendChat.bind(gameState);
gameState.trySendChat = (msg) => {
	if (msg.startsWith("!")) {
		const cmd = msg.substring(1).split(" ");
		switch (cmd[0]) {
			case "watch":
				watchPlayer(cmd[1]);
				break;
			case "zoom":
				if (!cmd[1]) {
					chatLog("Usage: !zoom [number]");
					chatLog("Legitimate values range from 3 to 12. Higher value = farther camera.");
					return;
				}

				chatLog(`Set camera zoom to ${gameState.cameraController.cameraZoomDistance = Number.parseInt(cmd[1], 10) || 12}!`);
				break;
			default:
				chatLog(`Unknown command: ${cmd[0]}`);
				chatLog("Available commands: watch, zoom");
				break;
		}
		return;
	}

	return hkTrySendChat(msg);
}

setInterval(tick, 50);
