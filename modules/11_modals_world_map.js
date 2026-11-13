const mapModalElements = {};
let mapUpdateFrame = null;

// ---- World map viewport (pan / pinch-zoom) ----
// The map is laid out in a fixed logical space (the canvas size, currently 1000x520). On small screens we keep
// that space at a readable scale and show it through a small, pannable window.
let MAP_LW = 1000, MAP_LH = 520; // re-synced from the canvas size right after the map modal is built
// Tune these to change how tall the map window is on small screens.
const MAP_H_RATIO_PORTRAIT = 0.38;  // portrait:  38% of screen height
const MAP_H_RATIO_LANDSCAPE = 0.58; // landscape: 58% of screen height
const MAP_MIN_H = 130;              // never shorter than this (px)
const mapView = { zoom: 1, panX: 0, panY: 0, viewW: MAP_LW, viewH: MAP_LH, dpr: 1, small: false, needCenter: false, needFit: false };

function mapMinZoom() { return Math.min(mapView.viewW / MAP_LW, mapView.viewH / MAP_LH); }

function clampMapPan() {
	const cw = MAP_LW * mapView.zoom, ch = MAP_LH * mapView.zoom, m = 30;
	mapView.panX = cw <= mapView.viewW ? (mapView.viewW - cw) / 2 : Math.max(mapView.viewW - cw - m, Math.min(m, mapView.panX));
	mapView.panY = ch <= mapView.viewH ? (mapView.viewH - ch) / 2 : Math.max(mapView.viewH - ch - m, Math.min(m, mapView.panY));
}

function zoomMapAt(px, py, factor) {
	const nz = Math.max(mapMinZoom(), Math.min(4, mapView.zoom * factor));
	const f = nz / mapView.zoom;
	mapView.panX = px - (px - mapView.panX) * f;
	mapView.panY = py - (py - mapView.panY) * f;
	mapView.zoom = nz;
	clampMapPan();
}

function layoutMapModal() {
	const m = mapModalElements.modalWindow, c = mapModalElements.canvas;
	if (!m || !c) return;
	// Mobile only. On desktop nothing below runs, so the original desktop layout is left untouched.
	const small = typeof spkmodIsMobile === "function" && spkmodIsMobile();
	mapView.small = small;
	if (!small) {
		mapView.viewW = MAP_LW; mapView.viewH = MAP_LH; mapView.dpr = 1;
		mapView.zoom = 1; mapView.panX = 0; mapView.panY = 0;
		return;
	}
	{
		// 📍 / ⤢ buttons and touch-sized close button: mobile only (hidden / original style by default)
		if (mapModalElements.centerBtn) mapModalElements.centerBtn.style.display = "";
		if (mapModalElements.fitBtn) mapModalElements.fitBtn.style.display = "";
		if (mapModalElements.btnRow) mapModalElements.btnRow.style.marginTop = "12px";
		if (mapModalElements.closeBtn) { mapModalElements.closeBtn.style.padding = "8px 20px"; mapModalElements.closeBtn.style.minHeight = "40px"; }
		mapView.dpr = Math.min(window.devicePixelRatio || 1, 2);
		if (window.innerHeight >= window.innerWidth) {
			// Portrait: full width, canvas height = MAP_H_RATIO_PORTRAIT of the screen height.
			mapView.viewW = Math.max(200, Math.min(MAP_LW, window.innerWidth - 24));
			mapView.viewH = Math.max(MAP_MIN_H, Math.min(MAP_LH, Math.round(window.innerHeight * MAP_H_RATIO_PORTRAIT)));
		} else {
			// Landscape: canvas height = MAP_H_RATIO_LANDSCAPE of the screen height, width capped at ~1.92:1.
			mapView.viewH = Math.max(MAP_MIN_H, Math.min(MAP_LH, Math.round(window.innerHeight * MAP_H_RATIO_LANDSCAPE)));
			mapView.viewW = Math.max(200, Math.min(MAP_LW, window.innerWidth - 24, Math.round(mapView.viewH * 1.92)));
		}
		if (mapModalElements.titleLabel) {
			mapModalElements.titleLabel.style.fontSize = "14px";
			mapModalElements.titleLabel.style.marginBottom = "6px";
		}
		m.style.position = "fixed";
		m.style.boxSizing = "border-box";
		m.style.padding = "10px";
		m.style.maxWidth = "calc(100vw - 8px)";
		if (mapView.zoom < mapMinZoom()) mapView.zoom = mapMinZoom();
		clampMapPan();
	}
	c.style.width = mapView.viewW + "px";
	c.style.height = mapView.viewH + "px";
	c.style.maxWidth = "none";
	c.style.touchAction = "none";
	c.width = Math.round(mapView.viewW * mapView.dpr);
	c.height = Math.round(mapView.viewH * mapView.dpr);
	{
		const mw = mapView.viewW + 22;
		if (m.dataset.userDragged !== "true") {
			m.style.left = Math.max(4, (window.innerWidth - mw) / 2) + "px";
			m.style.top = "8px";
		} else {
			const r = m.getBoundingClientRect();
			m.style.left = Math.max(0, Math.min(r.left, window.innerWidth - mw)) + "px";
			m.style.top = Math.max(0, Math.min(r.top, window.innerHeight - 60)) + "px";
		}
	}
}

function initMapGestures() {
	const c = mapModalElements.canvas;
	if (!c || c.__spkmodGestures) return;
	c.__spkmodGestures = true;
	const ptrs = new Map();
	let lastDist = 0, lastMid = null;
	const local = e => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
	const stop = e => { e.stopPropagation(); };
	c.addEventListener("pointerdown", e => {
		if (!mapView.small) return;
		stop(e);
		try { c.setPointerCapture(e.pointerId); } catch (_) {}
		ptrs.set(e.pointerId, local(e));
		lastDist = 0; lastMid = null;
	});
	c.addEventListener("pointermove", e => {
		if (!mapView.small || !ptrs.has(e.pointerId)) return;
		stop(e);
		const prev = ptrs.get(e.pointerId), cur = local(e);
		ptrs.set(e.pointerId, cur);
		if (ptrs.size === 1) {
			mapView.panX += cur.x - prev.x;
			mapView.panY += cur.y - prev.y;
			clampMapPan();
		} else if (ptrs.size === 2) {
			const [a, b] = [...ptrs.values()];
			const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			if (lastDist) {
				mapView.panX += mid.x - lastMid.x;
				mapView.panY += mid.y - lastMid.y;
				zoomMapAt(mid.x, mid.y, dist / lastDist);
			}
			lastDist = dist; lastMid = mid;
		}
	});
	const up = e => { stop(e); ptrs.delete(e.pointerId); lastDist = 0; lastMid = null; };
	c.addEventListener("pointerup", up);
	c.addEventListener("pointercancel", up);
	c.addEventListener("wheel", e => {
		if (!mapView.small) return;
		e.preventDefault(); e.stopPropagation();
		const p = local(e);
		zoomMapAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015));
	}, { passive: false });
}

window.addEventListener("resize", () => {
	if (mapView.small && mapModalElements.modalWindow && mapModalElements.modalWindow.style.display !== "none") {
		layoutMapModal();
		mapView.needCenter = true;
	}
});

function openMapModal() {
	mapModalElements.modalWindow.style.display = "flex";
	layoutMapModal();
	if (mapView.small) {
		initMapGestures();
		mapView.zoom = Math.max(mapMinZoom(), 1);
		mapView.needCenter = true;
	}
	updateMapLoop();
}

function closeMapModal() {
	mapModalElements.modalWindow.style.display = "none";
	if (mapUpdateFrame) cancelAnimationFrame(mapUpdateFrame);
	mapUpdateFrame = null;
}

function toggleMapModal() {
	if (!mapModalElements.modalWindow) return;
	if (mapModalElements.modalWindow.style.display === "none") {
		openMapModal();
	} else {
		closeMapModal();
	}
}

function updateMapLoop() {
	if (!mapModalElements.canvas || mapModalElements.modalWindow.style.display === "none") {
		mapUpdateFrame = null;
		return;
	}
	const ctx = mapModalElements.canvas.getContext("2d");
	const w = MAP_LW;
	const h = MAP_LH;
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, mapModalElements.canvas.width, mapModalElements.canvas.height);
	
	const padding = 20;
	const drawW = w - padding * 2;
	const drawH = h - padding * 2;
	
	const connectedZones = new Set();
	for (const src in Portals) {
		connectedZones.add(parseInt(src));
		for (const tgt in Portals[src]) {
			connectedZones.add(parseInt(tgt));
		}
	}

	let rows = [[], [], [], []];
	const allZones = (typeof window !== "undefined" && window.WorldZones) ? window.WorldZones : (typeof WorldZones !== "undefined" ? WorldZones : []);
	for (const zone of allZones) {
		if (!connectedZones.has(zone.zoneId)) continue;
		const cz = (zone.minZ + zone.maxZ) / 2;
		if (cz < -500) rows[0].push(zone);      // World 4: Thunder/Mist (Zones 301-309, Z ~ -850)
		else if (cz <= 0) rows[1].push(zone);   // World 3: Core/Underground (Zones 201-209, Z ~ -100)
		else if (cz <= 200) rows[2].push(zone); // World 1: Overworld (Zones 1-10, Z ~ 100)
		else rows[3].push(zone);                // World 2: World Tree (Zones 101-108, Z ~ 300)
	}
	
	rows.forEach(r => r.sort((a,b) => ((a.minX+a.maxX)/2) - ((b.minX+b.maxX)/2)));
	
	const zonePos = {};
	const boxW = 66;
	const boxH = 36;
	
	const activeRows = rows.map((r, idx) => ({ row: r, idx })).filter(item => item.row.length > 0);
	const totalActive = activeRows.length || 1;
	const rowSpacingY = totalActive > 1 ? (drawH - boxH) / (totalActive - 1) : 0;
	
	for (let i = 0; i < activeRows.length; i++) {
		const rList = activeRows[i].row;
		let spacingX = drawW / rList.length;
		for (let j = 0; j < rList.length; j++) {
			let z = rList[j];
			zonePos[z.zoneId] = {
				x: padding + j * spacingX + spacingX/2,
				y: padding + boxH/2 + i * rowSpacingY,
				zone: z
			};
		}
	}
	
	const getLogicalPos = (zid, px, pz) => {
		const zp = zonePos[zid];
		if (!zp) return null;
		const z = zp.zone;
		let pctX = (px - z.minX) / (z.maxX - z.minX);
		let pctZ = (pz - z.minZ) / (z.maxZ - z.minZ);
		pctX = Math.max(0, Math.min(1, pctX));
		pctZ = Math.max(0, Math.min(1, pctZ));
		return {
			x: zp.x - boxW/2 + pctX * boxW,
			y: zp.y - boxH/2 + pctZ * boxH
		};
	};

	if (mapView.needFit) {
		mapView.zoom = mapMinZoom();
		mapView.needFit = false;
		clampMapPan();
	}
	if (mapView.needCenter && mapView.small) {
		const cz = gameState && gameState.zoneId ? gameState.zoneId % 10000 : null;
		let target = cz !== null && zonePos[cz] ? zonePos[cz] : null;
		if (target && gameState.playerContainer) {
			const lp = getLogicalPos(cz, gameState.playerContainer.position.x, gameState.playerContainer.position.z);
			if (lp) target = lp;
		}
		if (target) {
			mapView.panX = mapView.viewW / 2 - target.x * mapView.zoom;
			mapView.panY = mapView.viewH / 2 - target.y * mapView.zoom;
			clampMapPan();
		}
		mapView.needCenter = false;
	}
	ctx.setTransform(mapView.dpr * mapView.zoom, 0, 0, mapView.dpr * mapView.zoom, mapView.dpr * mapView.panX, mapView.dpr * mapView.panY);

	ctx.strokeStyle = "rgba(255, 200, 50, 0.4)";
	ctx.lineWidth = 1.5;
	const drawnConnections = new Set();
	for (const src in Portals) {
		for (const tgt in Portals[src]) {
			const pairKey = parseInt(src) < parseInt(tgt) ? `${src}-${tgt}` : `${tgt}-${src}`;
			if (drawnConnections.has(pairKey)) continue;

			if (Portals[tgt] && Portals[tgt][src] && zonePos[src] && zonePos[tgt]) {
				drawnConnections.add(pairKey);
				const p1 = zonePos[src];
				const p2 = zonePos[tgt];
				const pInfo1 = Portals[src][tgt];
				const pInfo2 = Portals[tgt][src];
				
				if (pInfo1 && pInfo2) {
					const lPos1 = getLogicalPos(parseInt(src), pInfo1.pos.x, pInfo1.pos.z);
					const lPos2 = getLogicalPos(parseInt(tgt), pInfo2.pos.x, pInfo2.pos.z);
					
					if (lPos1 && lPos2) {
						ctx.beginPath();
						ctx.moveTo(lPos1.x, lPos1.y);
						
						const dy = Math.abs(p1.y - p2.y);
						if (dy > 10) {
							// If connecting across non-adjacent rows (e.g. World 1 to World 4 skipping over World 3),
							// route through the left margin track so it doesn't slice through intermediate zone boxes!
							if (dy > rowSpacingY * 1.5) {
								const lowerPos = p1.y > p2.y ? lPos1 : lPos2;
								const upperPos = p1.y > p2.y ? lPos2 : lPos1;
								const lowerZone = p1.y > p2.y ? p1 : p2;
								const gapY = lowerZone.y - boxH/2 - (rowSpacingY - boxH) / 2;
								const marginTrackX = 14;

								ctx.lineTo(lowerPos.x, gapY);
								ctx.lineTo(marginTrackX, gapY);
								ctx.lineTo(marginTrackX, upperPos.y);
								ctx.lineTo(upperPos.x, upperPos.y);
							} else {
								const midY = (lPos1.y + lPos2.y) / 2;
								ctx.lineTo(lPos1.x, midY);
								ctx.lineTo(lPos2.x, midY);
								ctx.lineTo(lPos2.x, lPos2.y);
							}
						} else {
							ctx.lineTo(lPos2.x, lPos2.y);
						}
						ctx.stroke();
					}
				}
			}
		}
	}
	

	for (const zid in zonePos) {
		const zp = zonePos[zid];
		const zidNum = parseInt(zid);
		const isCurrent = zidNum === (gameState?.zoneId % 10000);
		const raid = (window.spkmodRaids || []).find(r => r.altarZoneId === zidNum);
		
		const bx = zp.x - boxW/2;
		const by = zp.y - boxH/2;
		
		if (isCurrent) {
			ctx.fillStyle = "rgb(40, 100, 40)";
			ctx.strokeStyle = "rgba(100, 255, 100, 0.8)";
			ctx.lineWidth = 2;
		} else if (raid) {
			ctx.fillStyle = "rgba(45, 25, 25, 0.9)";
			ctx.strokeStyle = "rgba(255, 60, 20, 0.95)";
			ctx.lineWidth = 2.5;
		} else {
			ctx.fillStyle = "rgb(30, 40, 50)";
			ctx.strokeStyle = "rgba(150, 180, 200, 0.6)";
			ctx.lineWidth = 1;
		}
		
		ctx.fillRect(bx, by, boxW, boxH);
		ctx.strokeRect(bx, by, boxW, boxH);
		
		ctx.fillStyle = "white";
		ctx.font = "11px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		let rawName = getZoneName(zid);
		
		let words = rawName.split(" ");
		if (words.length > 1) {
			let mid = Math.ceil(words.length / 2);
			let line1 = words.slice(0, mid).join(" ");
			let line2 = words.slice(mid).join(" ");
			ctx.fillText(line1, zp.x, zp.y - 6);
			ctx.fillText(line2, zp.x, zp.y + 6);
		} else {
			ctx.fillText(rawName, zp.x, zp.y);
		}

		if (raid) {
			const pillW = 50, pillH = 14;
			const pillX = zp.x - pillW / 2;
			const pillY = by - 9;
			const myLvl = (window.gameState?.myStat?.level) || (window.gameState?.playerLevel) || 1;
			const isUnlocked = myLvl >= raid.requiredLevel;

			ctx.save();
			ctx.fillStyle = isUnlocked ? "rgba(180, 20, 20, 0.95)" : "rgba(35, 35, 35, 0.92)";
			ctx.strokeStyle = isUnlocked ? "rgba(255, 160, 40, 0.95)" : "rgba(140, 140, 140, 0.8)";
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			if (ctx.roundRect) ctx.roundRect(pillX, pillY, pillW, pillH, 3);
			else ctx.rect(pillX, pillY, pillW, pillH);
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = isUnlocked ? "#ffd700" : "#bbbbbb";
			ctx.font = "bold 9px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			const reqLvl = raid.requiredLevel || 1;
			const displayLvl = raid.bossLevel || reqLvl;
			ctx.fillText(isUnlocked ? `⚔️ LV${displayLvl}` : `🔒 LV${reqLvl}`, zp.x, pillY + pillH / 2 + 0.5);
			ctx.restore();
		}
	}
	
	for (const src in Portals) {
		for (const tgt in Portals[src]) {
			const pInfo = Portals[src][tgt];
			const lPos = getLogicalPos(parseInt(src), pInfo.pos.x, pInfo.pos.z);
			if (!lPos) continue;
			
			if (pInfo.requiredQuestCode) {
				let isCompleted = false;
				if (gameState && gameState.zoneId && (gameState.zoneId % 10000) === parseInt(tgt)) {
					isCompleted = true;
				}
				if (window.lunCompletedQuests && window.lunCompletedQuests.has(pInfo.requiredQuestCode)) {
					isCompleted = true;
				}
				
				if (!isCompleted) {
					ctx.font = "10px sans-serif";
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("🔒", lPos.x, lPos.y);
					continue;
				}
			}
			
			ctx.fillStyle = "rgba(255, 200, 50, 0.9)";
			ctx.beginPath();
			ctx.arc(lPos.x, lPos.y, 2, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	
	if (gameState && gameState.playerContainer && gameState.zoneId) {
		const pz = gameState.zoneId % 10000;
		if (zonePos[pz]) {
			const lPos = getLogicalPos(pz, gameState.playerContainer.position.x, gameState.playerContainer.position.z);
			if (lPos) {
				ctx.fillStyle = "red";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(lPos.x, lPos.y, 4, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			}
		}
	}
	
	mapUpdateFrame = requestAnimationFrame(updateMapLoop);
}

document.body.appendChild(
	mapModalElements.modalWindow = buildElement("div", {
		id: "spkmod-map-modal",
		style: "display: none; position: absolute; top: 20px; left: calc(100vw - 1060px); background: rgba(20, 20, 25, 0.95); border: 1px solid #444; border-radius: 8px; padding: 20px; color: white; flex-direction: column; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10001;"
	}, [
		mapModalElements.titleLabel = buildElement("div", { style: "font-size: 18px; font-weight: bold; margin-bottom: 15px; cursor: move; width: 100%; text-align: center; user-select: none;", innerText: t("mapModalTitle") }),
		mapModalElements.canvas = buildElement("canvas", {
			width: 1000,
			height: 520,
			style: "border: 1px solid #666; border-radius: 4px; background: #080808; width: 1000px;"
		}),
		mapModalElements.btnRow = buildElement("div", { style: "display: flex; gap: 8px; margin-top: 15px; align-items: center;" }, [
			mapModalElements.centerBtn = buildElement("button", {
				innerText: "📍",
				title: "My position",
				style: "display: none; padding: 8px 14px; min-height: 40px; cursor: pointer; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-weight: bold;",
				onclick: () => { mapView.needCenter = true; }
			}),
			mapModalElements.fitBtn = buildElement("button", {
				innerText: "⤢",
				title: "Fit whole map",
				style: "display: none; padding: 8px 14px; min-height: 40px; cursor: pointer; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-weight: bold;",
				onclick: () => { mapView.needFit = true; }
			}),
			mapModalElements.closeBtn = buildElement("button", {
				innerText: t("closeBtn"),
				style: "padding: 6px 20px; cursor: pointer; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-weight: bold;",
				onclick: () => closeMapModal()
			})
		])
	])
);
// Do NOT add #spkmod-map-modal to the --spkmod-scale transform rule in updateDynamicStyles(), because this window sizes itself
// in layoutMapModal(); pin --spkmod-scale to 1 here so makeDraggable doesn't divide the drag distance by the mobile UI scale (0.55)
mapModalElements.modalWindow.style.setProperty("--spkmod-scale", "1");
// Fucking Important! Logical map size = the canvas size set above, so a future upstream change to it is followed automatically.
MAP_LW = mapModalElements.canvas.width; MAP_LH = mapModalElements.canvas.height;
mapView.viewW = MAP_LW; mapView.viewH = MAP_LH;

document.body.appendChild(
	lunHudElements.eventModal = buildElement("div", {
		id: "spkmod-event-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			eventModalElements.headerTitle = buildElement("span", {
				innerText: t("eventInfoHeader"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-event-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.eventModal.classList.add("hidden")
			})
		]),
		buildElement("div", {
			style: "background: rgba(255, 140, 0, 0.12); border: 1px solid rgba(255, 140, 0, 0.35); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;"
		}, [
			buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
				eventModalElements.titleText = buildElement("span", { style: "font-weight: bold; font-size: 11pt; color: #ffa500;", innerText: "🎃 " + t("eventMinigameTitle") }),
				eventModalElements.statusBadge = buildElement("span", {
					style: "font-size: 9pt; font-weight: bold; padding: 1px 6px; border: 1px solid #4ade80; border-radius: 4px; color: #4ade80;",
					innerText: t("eventStatusActive")
				})
			]),
			eventModalElements.periodText = buildElement("div", {
				style: "font-size: 9pt; color: #bbb;",
				innerText: t("eventLoading")
			}),
			buildElement("div", { style: "display: flex; justify-content: space-between; font-size: 9.5pt; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;" }, [
				eventModalElements.bestScoreText = buildElement("span", {
					style: "font-weight: bold; color: #ffd54a;",
					innerText: t("eventBestScore", "--")
				}),
				eventModalElements.playsRemainingText = buildElement("span", {
					style: "font-weight: bold; color: #fff;",
					innerText: t("eventPlaysToday", "--", "--")
				})
			])
		]),
		buildElement("div", { style: "display: flex; justify-content: flex-end; gap: 6px; margin-top: 2px;" }, [
			eventModalElements.refreshBtn = buildElement("button", {
			className: "spkmod-panel-btn",
			style: "padding: 3px 10px; font-size: 9pt; cursor: pointer;",
			innerText: "🔄 " + t("refreshBtn"),
			onclick: () => fetchMinigameStatus()
		})
		]),
		lunPanelElements.minigameList = buildElement("div", { style: "display: flex; flex-direction: column; gap: 8px; margin-top: 10px;" })
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.eventModal && eventModalElements.headerTitle) {
		makeDraggable(lunHudElements.eventModal, [eventModalElements.headerTitle]);
	}
}, 500);

const editsModalElements = {};

const SPKMOD_DYE_COLORS = [
	{ id: "Crimson", key: "dyeColorCrimson", name: "Crimson", hex: "#ff2a4b", emoji: "🔴" },
	{ id: "Blue", key: "dyeColorBlue", name: "Blue", hex: "#2563eb", emoji: "🔵" },
	{ id: "Emerald", key: "dyeColorEmerald", name: "Emerald", hex: "#10b981", emoji: "🟢" },
	{ id: "Gold", key: "dyeColorGold", name: "Gold", hex: "#facc15", emoji: "🟡" },
	{ id: "Purple", key: "dyeColorPurple", name: "Purple", hex: "#8b5cf6", emoji: "🟣" },
	{ id: "HotPink", key: "dyeColorHotPink", name: "Hot Pink", hex: "#ec4899", emoji: "🌸" },
	{ id: "Cyan", key: "dyeColorCyan", name: "Cyan", hex: "#06b6d4", emoji: "💎" },
	{ id: "Orange", key: "dyeColorOrange", name: "Orange", hex: "#f97316", emoji: "🧡" },
	{ id: "Mint", key: "dyeColorMint", name: "Mint", hex: "#14b8a6", emoji: "🌿" },
	{ id: "Amber", key: "dyeColorAmber", name: "Amber", hex: "#d97706", emoji: "🔶" },
	{ id: "Pearl", key: "dyeColorPearl", name: "Pearl", hex: "#ffffff", emoji: "⚪" },
	{ id: "Obsidian", key: "dyeColorObsidian", name: "Obsidian", hex: "#18181b", emoji: "⚫" },
	{ id: "Magenta", key: "dyeColorMagenta", name: "Magenta", hex: "#f43f5e", emoji: "🍇" },
	{ id: "Ice", key: "dyeColorIce", name: "Ice", hex: "#38bdf8", emoji: "🧊" },
	{ id: "Sepia", key: "dyeColorSepia", name: "Sepia", hex: "#b45309", emoji: "☕" },
	{ id: "Lavender", key: "dyeColorLavender", name: "Lavender", hex: "#a78bfa", emoji: "🔮" },
	{ id: "Lime", key: "dyeColorLime", name: "Lime", hex: "#84cc16", emoji: "🍀" },
	{ id: "Indigo", key: "dyeColorIndigo", name: "Indigo", hex: "#4f46e5", emoji: "🌌" }
];

document.body.appendChild(
	lunHudElements.effectsModal = buildElement("div", {
		id: "spkmod-effects-modal",
		className: "hidden",
		style: "width: 960px; min-width: 600px; max-width: 96vw; overflow-x: hidden;"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			lunPanelElements.effectsModalTitle = buildElement("span", {
				innerText: t("localEffectsTitle"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none; touch-action: none; padding: 6px 0; min-height: 24px; display: inline-block; width: 100%;"
			}),
			buildElement("span", {
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px; font-size: 14px;",
				onclick: _ => lunHudElements.effectsModal.classList.add("hidden")
			})
		]),
		buildElement("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-height: 85vh; overflow-y: auto; overflow-x: hidden; padding: 4px; box-sizing: border-box;" }, [
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 8px; flex: 1;" }, [
				lunPanelElements.effectsWarning = buildElement("div", {
					innerText: t("localEffectsWarning"),
					style: "color: #ff9999; font-size: 10px; text-align: center; border-bottom: 1px solid #555; padding-bottom: 6px; margin-bottom: 4px; white-space: pre-line;"
				}),
				lunPanelElements.killEveryoneBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("killEveryoneBtn"),
					onclick: () => window.spkmodTriggerDeathEveryone && window.spkmodTriggerDeathEveryone()
				}),
				lunPanelElements.danceEveryoneBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("danceEveryoneBtn"),
					onclick: () => window.spkmodTriggerDanceEveryone && window.spkmodTriggerDanceEveryone()
				}),
				lunPanelElements.farmEveryoneBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("farmEveryoneBtn"),
					onclick: () => window.spkmodTriggerFarmEveryone && window.spkmodTriggerFarmEveryone()
				}),
				lunPanelElements.hobagiEveryoneBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("hobagiEveryoneBtn"),
					onclick: () => window.spkmodTriggerHobagiEveryone && window.spkmodTriggerHobagiEveryone()
				}),
				lunPanelElements.flyEveryoneBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("flyEveryoneBtn"),
					onclick: () => window.spkmodTriggerFlyEveryone && window.spkmodTriggerFlyEveryone()
				}),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;" }, [
					lunPanelElements.pumpkinCartTexBtn = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerHTML: (typeof renderSpkmodInlineEmojis === "function" ? renderSpkmodInlineEmojis(":SPK_88:", "height: 20px; width: 20px; object-fit: contain; vertical-align: middle; display: inline-block; pointer-events: none;") : "🎃"),
						title: "Pumpkin Cart Skin: Ui (:SPK_88:) (test.png)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("uifi");
						}
					}),
					lunPanelElements.pumpkinCartTexBtn1 = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerText: "1️⃣",
						title: "Pumpkin Cart Skin: 1 (test2.png)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("1");
						}
					}),
					lunPanelElements.pumpkinCartTexBtn2 = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerText: "2️⃣",
						title: "Pumpkin Cart Skin: 2 (test3.png)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("2");
						}
					}),
					lunPanelElements.pumpkinCartTexBtn3 = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerText: "3️⃣",
						title: "Pumpkin Cart Skin: 3 (test4.png)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("3");
						}
					}),
					lunPanelElements.pumpkinCartTexBtn4 = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerText: "4️⃣",
						title: "Pumpkin Cart Skin: 4 (dancing.webp)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("4");
						}
					}),
					lunPanelElements.pumpkinCartTexBtn5 = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; min-height: 28px;",
						innerText: "5️⃣",
						title: "Pumpkin Cart Skin: 5 (yuki.png)",
						onclick: () => {
							if (window.spkmodSelectPumpkinCartSkin) window.spkmodSelectPumpkinCartSkin("5");
						}
					})
				]),

				// 🍳 Cooking & Kitchen Animations
				buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #555; padding-top: 6px;" }, [
					editsModalElements.cookingHeader = buildElement("div", {
						className: "spkmod-panel-cat-header",
						innerText: "🍳 " + (t("cookingHeader") || "Cooking Animations"),
						style: "margin-top: 0px;"
					}),
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px;" }, [
						editsModalElements.cookBtnChop = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center;",
							innerText: t("cookBtnChop") || "🔪 Chop",
							title: "Loop fast chopping animation with kitchen knife",
							onclick: () => window.spkmodStartCooking && window.spkmodStartCooking("chop")
						}),
						editsModalElements.cookBtnStir = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center;",
							innerText: t("cookBtnStir") || "🍳 Stir",
							title: "Loop stirring soup animation with pan & ladle",
							onclick: () => window.spkmodStartCooking && window.spkmodStartCooking("stir")
						}),
						editsModalElements.cookBtnPlate = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center;",
							innerText: t("cookBtnPlate") || "🍽️ Plate",
							title: "Loop plating food animation",
							onclick: () => window.spkmodStartCooking && window.spkmodStartCooking("plate")
						}),
						editsModalElements.cookBtnServe = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center;",
							innerText: t("cookBtnServe") || "🛎️ Serve",
							title: "Play elegant dish presentation one-shot",
							onclick: () => window.spkmodStartCooking && window.spkmodStartCooking("serve")
						}),
						editsModalElements.cookBtnCarry = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center;",
							innerText: t("cookBtnCarry") || "📦 Carry",
							title: "Carry food tray stance while walking or standing",
							onclick: () => window.spkmodStartCooking && window.spkmodStartCooking("carry")
						}),
						editsModalElements.cookBtnStop = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #ffaaaa;",
							innerText: t("cookBtnStop") || "🛑 Stop",
							title: "Stop cooking and restore weapon",
							onclick: () => window.spkmodStopCooking && window.spkmodStopCooking()
						})
					])
				]),

				// 🚁 Copter Hat & Special Poses
				buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #555; padding-top: 6px;" }, [
					editsModalElements.copterHeader = buildElement("div", {
						className: "spkmod-panel-cat-header",
						innerText: "🚁 " + (t("copterHeader") || "Copter Hat & Special Poses"),
						style: "margin-top: 0px;"
					}),
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px;" }, [
						editsModalElements.copterBtnSelf = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #ffd54a; font-weight: bold;",
							innerText: t("copterBtnSelf") || "🚁 Copter (Self)",
							title: "Toggle spinning propeller pumpkin copter hat on yourself",
							onclick: () => window.spkmodToggleCopterHat && window.spkmodToggleCopterHat("self")
						}),
						editsModalElements.copterBtnAll = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #38bdf8; font-weight: bold;",
							innerText: t("copterBtnAll") || "🚁 Copter (ALL)",
							title: "Toggle spinning propeller hats on EVERY player in town!",
							onclick: () => window.spkmodToggleCopterHat && window.spkmodToggleCopterHat("all")
						}),
						editsModalElements.spellDanceBtn = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #c084fc;",
							innerText: t("spellDanceBtn") || "✨🌀 Spell Dance",
							title: "Play magical town return portal dance",
							onclick: () => window.spkmodPlaySpellDance && window.spkmodPlaySpellDance()
						}),
						editsModalElements.gatherAnimBtn = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #84cc16;",
							innerText: t("gatherAnimBtn") || "🌿 Gather Loop",
							title: "Play ground foraging & harvesting loop",
							onclick: () => window.spkmodPlayGather && window.spkmodPlayGather()
						})
					])
				])
			]),
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 8px; border-left: 1px solid #555; padding-left: 10px;" }, [
				// Character Dye & FX
				buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #555; padding-top: 6px;" }, [
					buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
						editsModalElements.avatarDyeHeader = buildElement("div", {
							className: "spkmod-panel-cat-header",
							innerText: "🎨 " + (t("avatarDyeHeader") || "Character Dye & FX (Local Only)"),
							style: "margin-top: 0px;"
						}),
						editsModalElements.dyeScopeBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 3px 6px; font-size: 9px; color: #ffd54a; border-color: #ffd54a;",
							innerText: window.spkmodAvatarColorScope === "body" ? (t("dyeScopeBody") || "Outfit Only") : (t("dyeScopeAll") || "Full Avatar"),
							title: "Toggle whether to color the whole avatar or outfit/body only",
							onclick: () => {
								if (window.spkmodSetAvatarColorScope) {
									window.spkmodSetAvatarColorScope(window.spkmodAvatarColorScope === "body" ? "all" : "body");
								}
							}
						})
					]),
					// Color Grid: 18 vivid colors (3 columns x 6 rows)
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px;" }, [
						...SPKMOD_DYE_COLORS.map(c => {
							const btn = buildElement("button", {
								className: "spkmod-panel-btn",
								style: `padding: 4px 2px; font-size: 9.5px; text-align: center; color: ${c.hex === "#ffffff" ? "#eee" : c.hex}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`,
								innerText: `${c.emoji} ${t(c.key) || c.name}`,
								title: `Apply ${c.name} Dye (${c.hex})`,
								onclick: () => {
									if (window.spkmodAvatarColorMode === "color" && (window.spkmodAvatarColorHex || '').toLowerCase() === c.hex.toLowerCase()) {
										if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
									} else {
										if (window.spkmodApplyAvatarColor) window.spkmodApplyAvatarColor(c.hex);
									}
									updateLocalEditsUI();
								}
							});
							editsModalElements["dyeBtn_" + c.id] = btn;
							editsModalElements["dyeBtn_" + c.name] = btn;
							return btn;
						})
					]),
					// Custom Color Picker row
					buildElement("div", { style: "display: flex; gap: 4px; align-items: center; margin-top: 2px;" }, [
						editsModalElements.customColorLabel = buildElement("span", { style: "font-size: 10px; color: #ccc;", innerText: t("dyeCustomColor") || "Custom Color:" }),
						editsModalElements.dyeColorPicker = buildElement("input", {
							type: "color",
							value: window.spkmodAvatarColorHex || "#ffffff",
							style: "flex: 1; height: 26px; border: 1px solid #555; background: #222; border-radius: 4px; cursor: pointer; padding: 1px;",
							onchange: (e) => {
								if (window.spkmodApplyAvatarColor) window.spkmodApplyAvatarColor(e.target.value);
								updateLocalEditsUI();
							}
						})
					]),
					// Rainbow Speed Slider row
					buildElement("div", { style: "display: flex; flex-direction: column; gap: 2px; margin-top: 3px; background: rgba(0,0,0,0.25); padding: 4px 6px; border-radius: 4px; border: 1px solid #444;" }, [
						buildElement("div", { style: "display: flex; justify-content: space-between; align-items: center;" }, [
							editsModalElements.rainbowSpeedLabel = buildElement("span", { style: "font-size: 10px; color: #ec4899; font-weight: bold;", innerText: t("dyeRainbowSpeed") || "Rainbow Speed:" }),
							editsModalElements.rainbowSpeedValue = buildElement("span", { style: "font-size: 10px; color: #ffd54a; font-weight: bold;", innerText: `x${(typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed : 1.0).toFixed(1)}` })
						]),
						editsModalElements.rainbowSpeedSlider = buildElement("input", {
							type: "range",
							min: "0.2",
							max: "5.0",
							step: "0.1",
							value: typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed : 1.0,
							style: "width: 100%; height: 4px; accent-color: #ec4899; cursor: pointer; margin: 2px 0;",
							oninput: (e) => {
								const val = parseFloat(e.target.value);
								window.spkmodRainbowSpeed = val;
								if (window.localStorage) localStorage.setItem("spkmod-rainbow-speed", val);
								if (editsModalElements.rainbowSpeedValue) setText(editsModalElements.rainbowSpeedValue, `x${val.toFixed(1)}`);
							}
						})
					]),
					// Special FX Controls Row (Rainbow, Rainbow ALL, Random Rainbow, and Void Shadow)
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 2px;" }, [
						editsModalElements.dyeBtnRainbow = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #ec4899; font-weight: bold;",
							innerText: "🌈 " + (t("dyeBtnRainbow") || "Rainbow"),
							title: "Animate real-time smooth cycling through rainbow spectrum",
							onclick: () => {
								if (window.spkmodAvatarColorMode === "rainbow") {
									if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
								} else {
									if (window.spkmodStartRainbowWave) window.spkmodStartRainbowWave(false);
								}
								updateLocalEditsUI();
							}
						}),
						editsModalElements.dyeBtnRainbowAll = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #ffd54a; font-weight: bold;",
							innerText: "🌟 " + (t("dyeBtnRainbowAll") || "Rainbow ALL"),
							title: "Animate real-time rainbow wave on ALL players",
							onclick: () => {
								if (window.spkmodAvatarColorMode === "rainbow_all") {
									if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
								} else {
									if (window.spkmodStartRainbowWave) window.spkmodStartRainbowWave(true);
								}
								updateLocalEditsUI();
							}
						}),
						editsModalElements.dyeBtnRainbowRandom = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #38bdf8; font-weight: bold;",
							innerText: "🔀 " + (t("dyeBtnRainbowRandom") || "Random Rainbow"),
							title: "Animate desynchronized rainbow wave on all players with random colors",
							onclick: () => {
								if (window.spkmodAvatarColorMode === "rainbow_random") {
									if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
								} else {
									if (window.spkmodStartRainbowWave) window.spkmodStartRainbowWave("random");
								}
								updateLocalEditsUI();
							}
						}),
						editsModalElements.dyeBtnShadow = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #c084fc; font-weight: bold;",
							innerText: "👤 " + (t("dyeBtnShadow") || "Void Shadow"),
							title: "Dark obsidian silhouette with subtle void aura",
							onclick: () => {
								if (window.spkmodAvatarColorMode === "shadow") {
									if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
								} else {
									if (window.spkmodApplyShadowMode) window.spkmodApplyShadowMode();
								}
								updateLocalEditsUI();
							}
						}),
						editsModalElements.dyeBtnBadApple = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "grid-column: span 2; padding: 6px 2px; font-size: 10px; text-align: center; color: #ffffff; background: #111111; border: 1px solid #666; font-weight: bold;",
							innerText: "🍎 " + (t("dyeBtnBadApple") || "Bad Apple"),
							title: "Iconic monochrome silhouette mode (pitch-black silhouettes on pure white background)",
							onclick: () => {
								if (window.spkmodAvatarColorMode === "bad_apple") {
									if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
								} else {
									if (window.spkmodApplyBadAppleMode) window.spkmodApplyBadAppleMode();
								}
								updateLocalEditsUI();
							}
						})
					]),
					// Reset Button
					buildElement("div", { style: "display: flex; gap: 4px; margin-top: 2px;" }, [
						editsModalElements.dyeBtnReset = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "width: 100%; padding: 6px; font-size: 10.5px; text-align: center; color: #ffaaaa;",
							innerText: "↺ " + (t("dyeReset") || "Reset Character Dye & FX"),
							title: "Restore avatar to original appearance",
							onclick: () => {
								if (window.spkmodResetAvatarColors) window.spkmodResetAvatarColors();
							}
						})
					]),

					// ⚽ Soccer Uniform
					buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #555; padding-top: 6px; margin-top: 4px;" }, [
						editsModalElements.soccerHeader = buildElement("div", {
							className: "spkmod-panel-cat-header",
							innerText: "⚽ " + (t("soccerHeader") || "Soccer Uniform"),
							style: "margin-top: 0px;"
						}),
						buildElement("div", { style: "display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px;" }, [
							editsModalElements.soccerBtnRed = buildElement("button", {
								className: "spkmod-panel-btn",
								style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #ff5555; font-weight: bold;",
								innerText: "🔴 " + (t("soccerBtnRed") || "Red Team"),
								title: "Set soccer uniform to Red Team (click again to restore)",
								onclick: () => {
									if (window.spkmodActiveSoccerTeam === 1 && !window.spkmodActiveSoccerTeamAll) {
										if (window.spkmodSetTeam) window.spkmodSetTeam("none");
									} else {
										if (window.spkmodSetTeam) window.spkmodSetTeam("red");
									}
									updateLocalEditsUI();
								}
							}),
							editsModalElements.soccerBtnBlue = buildElement("button", {
								className: "spkmod-panel-btn",
								style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #5599ff; font-weight: bold;",
								innerText: "🔵 " + (t("soccerBtnBlue") || "Blue Team"),
								title: "Set soccer uniform to Blue Team (click again to restore)",
								onclick: () => {
									if (window.spkmodActiveSoccerTeam === 2 && !window.spkmodActiveSoccerTeamAll) {
										if (window.spkmodSetTeam) window.spkmodSetTeam("none");
									} else {
										if (window.spkmodSetTeam) window.spkmodSetTeam("blue");
									}
									updateLocalEditsUI();
								}
							}),
							editsModalElements.soccerBtnRedAll = buildElement("button", {
								className: "spkmod-panel-btn",
								style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #ff7777; font-weight: bold;",
								innerText: "🔴 " + (t("soccerBtnRedAll") || "Red ALL"),
								title: "Set soccer uniform to Red Team for ALL players (click again to restore)",
								onclick: () => {
									if (window.spkmodActiveSoccerTeamAll === 1) {
										if (window.spkmodSetTeam) window.spkmodSetTeam("none", "all");
									} else {
										if (window.spkmodSetTeam) window.spkmodSetTeam("red", "all");
									}
									updateLocalEditsUI();
								}
							}),
							editsModalElements.soccerBtnBlueAll = buildElement("button", {
								className: "spkmod-panel-btn",
								style: "padding: 6px 2px; font-size: 10px; text-align: center; color: #77b5ff; font-weight: bold;",
								innerText: "🔵 " + (t("soccerBtnBlueAll") || "Blue ALL"),
								title: "Set soccer uniform to Blue Team for ALL players (click again to restore)",
								onclick: () => {
									if (window.spkmodActiveSoccerTeamAll === 2) {
										if (window.spkmodSetTeam) window.spkmodSetTeam("none", "all");
									} else {
										if (window.spkmodSetTeam) window.spkmodSetTeam("blue", "all");
									}
									updateLocalEditsUI();
								}
							})
						]),
						editsModalElements.soccerBtnNone = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "width: 100%; padding: 5px 2px; font-size: 10px; text-align: center; color: #eeeeee; margin-top: 1px;",
							innerText: "⚪ " + (t("soccerBtnNone") || "Default"),
							title: "Reset soccer uniform to default for everyone",
							onclick: () => {
								if (window.spkmodSetTeam) window.spkmodSetTeam("none", "all");
								updateLocalEditsUI();
							}
						})
					])
				]),
			]),
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 8px; flex: 1; border-left: 1px solid #555; padding-left: 10px;" }, [
				editsModalElements.renameHeader = buildElement("div", { className: "spkmod-panel-cat-header", innerText: t("renameHeader") || "Rename Name Tags", style: "margin-top: 0px;" }),
				(function() {
					const inputs = [
						lunPanelElements.renameTargetInput = buildElement("input", { type: "text", placeholder: t("originalNamePlaceholder") || "Original Name", style: "width: 0; flex: 1; min-width: 0; box-sizing: border-box; padding: 4px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" }),
						lunPanelElements.renameValueInput = buildElement("input", { type: "text", placeholder: t("newNamePlaceholder") || "New Name", style: "width: 0; flex: 1; min-width: 0; box-sizing: border-box; padding: 4px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" })
					];
					
					inputs.push(lunPanelElements.renameLevelInput = buildElement("input", { id: "spkmod-rename-level-input", type: "number", placeholder: "LV", style: "display: none; width: 40px; padding: 4px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" }));
					
					return buildElement("div", { style: "display: flex; flex-direction: column;" }, [
						buildElement("div", { style: "display: flex; gap: 4px;" }, inputs),
						lunPanelElements.renameBtn = buildElement("button", {
							className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px; margin-top: 8px;",
							innerText: t("renameBtn") || "Replace Name",
							onclick: () => window.spkmodRenamePlayer && window.spkmodRenamePlayer(lunPanelElements.renameTargetInput.value, lunPanelElements.renameValueInput.value, lunPanelElements.renameLevelInput.style.display !== "none" ? lunPanelElements.renameLevelInput.value : undefined)
						})
					]);
				})(),
				buildElement("div", { style: "display: flex; gap: 4px; margin-top: 4px;" }, [
					lunPanelElements.savePresetBtn = buildElement("button", {
						className: "spkmod-panel-btn", style: "flex: 1; padding: 6px; font-size: 11px;",
						innerText: t("savePresetBtn") || "Save Replacement",
						onclick: () => window.spkmodSaveNamePreset && window.spkmodSaveNamePreset(lunPanelElements.renameTargetInput.value, lunPanelElements.renameValueInput.value)
					}),
					lunPanelElements.delPresetBtn = buildElement("button", {
						className: "spkmod-panel-btn", style: "flex: 1; padding: 6px; font-size: 11px; background: #5a2e2e;",
						innerText: t("delPresetBtn") || "Delete Replacement",
						onclick: () => window.spkmodDeleteNamePreset && window.spkmodDeleteNamePreset(lunPanelElements.renameTargetInput.value, lunPanelElements.renameValueInput.value)
					})
				]),
				lunPanelElements.presetList = buildElement("div", {
					style: "max-height: 80px; overflow-y: auto; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 4px; margin-top: 4px; padding: 4px; font-size: 10px; display: flex; flex-direction: column; gap: 2px;"
				}),
				lunPanelElements.applyPresetsBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px; margin-top: 4px;",
					innerText: t("applyPresetsBtn") || "Apply Saved Replacements",
					onclick: () => window.spkmodApplyNamePresets && window.spkmodApplyNamePresets()
				}),
				buildElement("div", { style: "height: 5px;" }),
				lunPanelElements.replaceAllValueInput = buildElement("input", { type: "text", placeholder: t("newNameAllPlaceholder") || "New Name for All", style: "width: 100%; padding: 4px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" }),
				lunPanelElements.replaceAllBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px;",
					innerText: t("replaceAllBtn") || "Replace All",
					onclick: () => window.spkmodRenameAll && window.spkmodRenameAll(lunPanelElements.replaceAllValueInput.value)
				}),
				lunPanelElements.resetNamesBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px; margin-top: 4px; background: #5a2e2e;",
					innerText: t("resetNamesBtn") || "Reset All Names",
					onclick: () => window.spkmodResetNames && window.spkmodResetNames()
				}),
				buildElement("div", { style: "display: flex; gap: 4px; margin-top: 4px;" }, [
					lunPanelElements.killTargetInput = buildElement("input", {
						type: "text", placeholder: t("targetPlaceholder"),
						style: "flex: 1; padding: 4px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; min-width: 10px;"
					}),
					lunPanelElements.killTargetBtn = buildElement("button", {
						className: "spkmod-panel-btn", style: "padding: 4px 8px; font-size: 11px;",
						innerText: t("killTargetBtn"),
						onclick: () => {
							if (window.spkmodTriggerDeathTarget) {
								window.spkmodTriggerDeathTarget(lunPanelElements.killTargetInput.value);
								lunPanelElements.killTargetInput.value = "";
							}
						}
					})
				]),
				buildElement("div", { style: "flex: 1;" }),
				lunPanelElements.reviveAllBtn = buildElement("button", {
					className: "spkmod-panel-btn", style: "padding: 6px; font-size: 11px; margin-top: 8px; border-color: #55ff55 !important;",
					innerText: t("reviveAllBtn"),
					onclick: () => window.spkmodReviveAll && window.spkmodReviveAll()
				}),

				// ✨ Step Particle Trail
				buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #555; padding-top: 6px; margin-top: 4px;" }, [
					editsModalElements.stepTrailHeader = buildElement("div", {
						className: "spkmod-panel-cat-header",
						innerText: "✨ " + (t("stepTrailHeader") || "Step Particle Trail"),
						style: "margin-top: 0px;"
					}),
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px;" }, [
						editsModalElements.stepTrailToggleBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 5px 2px; font-size: 10px; text-align: center; font-weight: bold; color: " + (window.spkmodStepTrail?.enabled ? "#55ff55" : "#ffaaaa") + ";",
							innerText: (t("stepTrailToggle") || "Trail: ") + (window.spkmodStepTrail?.enabled ? "ON" : "OFF"),
							title: "Toggle step particle trail behind your character while moving (Right-click to pin outside HUD!)",
							onclick: () => {
								if (window.spkmodToggleStepTrail) window.spkmodToggleStepTrail();
							}
						}),
						editsModalElements.stepTrailBurstBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 5px 2px; font-size: 10px; text-align: center; color: #ffd54a; font-weight: bold;",
							innerText: t("stepTrailBurst") || "💥 Starburst Explosion",
							title: "Trigger 50-star firework burst and avatar squash & stretch (Right-click to pin outside HUD!)",
							onclick: () => {
								if (window.spkmodBurstTrail) window.spkmodBurstTrail();
							}
						}),
						editsModalElements.stepTrailBurstSpamBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 5px 2px; font-size: 10px; text-align: center; font-weight: bold; color: " + (window.spkmodBurstSpamActive ? "#55ff55" : "#ffd54a") + ";",
							innerText: (t("stepTrailBurstSpam") || "⚡ Spam: ") + (window.spkmodBurstSpamActive ? (t("burstSpamOn") || "ON") : (t("burstSpamOff") || "OFF")),
							title: "Pausable / reusable fast burst spam loop (Right-click to pin outside HUD!)",
							onclick: () => {
								if (window.spkmodToggleBurstSpam) window.spkmodToggleBurstSpam();
							}
						})
					]),
					buildElement("div", { style: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px;" }, [
						editsModalElements.stepTrailStarsBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 4px 2px; font-size: 9.5px; text-align: center; color: #ffd700;",
							innerText: t("stepTrailStars") || "⭐ Stars",
							onclick: () => {
								if (window.spkmodSetTrailType) window.spkmodSetTrailType('stars');
							}
						}),
						editsModalElements.stepTrailRainbowBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 4px 2px; font-size: 9.5px; text-align: center; color: #ec4899;",
							innerText: t("stepTrailRainbow") || "🌈 Rainbow",
							onclick: () => {
								if (window.spkmodSetTrailType) window.spkmodSetTrailType('rainbow');
							}
						}),
						editsModalElements.stepTrailHeartsBtn = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 4px 2px; font-size: 9.5px; text-align: center; color: #f43f5e;",
							innerText: t("stepTrailHearts") || "💖 Hearts",
							onclick: () => {
								if (window.spkmodSetTrailType) window.spkmodSetTrailType('hearts');
							}
						})
					])
				])
			])
		])
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.effectsModal && lunPanelElements.effectsModalTitle) {
		const modalW = 960, modalH = 480;
		lunHudElements.effectsModal.style.left = Math.max(10, (window.innerWidth / 2) - (modalW / 2)) + "px";
		lunHudElements.effectsModal.style.top = Math.max(10, window.innerHeight * 0.15) + "px";
		makeDraggable(lunHudElements.effectsModal, [lunPanelElements.effectsModalTitle]);
	}
}, 500);

function toggleEffectsModal() {
	if (!lunHudElements.effectsModal) return;
	const isClosed = lunHudElements.effectsModal.classList.contains("hidden");
	if (isClosed) {
		lunHudElements.effectsModal.classList.remove("hidden");
		if (typeof bringToFront === "function") bringToFront(lunHudElements.effectsModal);
		if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.effectsModal);
		if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
	} else {
		lunHudElements.effectsModal.classList.add("hidden");
	}
}
window.toggleEffectsModal = toggleEffectsModal;

function setCameraEffectLocal(effectKey) {
	if (effectKey && effectKey !== "none" && lunCameraEffect === effectKey) {
		effectKey = "none";
	}
	lunCameraEffect = effectKey || "none";
	if (window.localStorage) localStorage.setItem("spkmod-camera-effect", lunCameraEffect);
	if (typeof updateDynamicStyles === "function") updateDynamicStyles();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements.cameraEffectSelect) {
		lunPanelElements.cameraEffectSelect.value = lunCameraEffect;
	}
	if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
	if (typeof chatLog === "function") chatLog("Camera Effect: " + (lunCameraEffect === "none" ? "OFF (NORMAL)" : lunCameraEffect.toUpperCase()));
}

const SPKMOD_SHADER_UI_LIST = [
	{ key: "none", icon: "", labelKey: "shaderNone", fallback: "Default", color: "" },
	{ key: "hdShadows", icon: "💎 ", labelKey: "shaderHdShadows", fallback: "HD Shadows", color: "#93c5fd" },
	{ key: "comic", icon: "🖊️ ", labelKey: "shaderComic", fallback: "Comic Outlines", color: "#fde047" },
	{ key: "animeCel", icon: "🎨 ", labelKey: "shaderAnimeCel", fallback: "Anime Cel", color: "#f9a8d4" },
	{ key: "golden", icon: "🌅 ", labelKey: "shaderGolden", fallback: "Golden Hour", color: "#fbbf24" },
	{ key: "pastel", icon: "🌸 ", labelKey: "shaderPastel", fallback: "Pastel Daylight", color: "#fbcfe8" },
	{ key: "softBloom", icon: "✨ ", labelKey: "shaderSoftBloom", fallback: "Soft Bloom", color: "#fef08a" },
	{ key: "moonlight", icon: "🌙 ", labelKey: "shaderMoonlight", fallback: "Moonlight", color: "#818cf8" },
	{ key: "depthMist", icon: "🌫️ ", labelKey: "shaderDepthMist", fallback: "Depth Mist", color: "#bae6fd" },
	{ key: "miniature", icon: "📸 ", labelKey: "shaderMiniature", fallback: "Miniature DoF", color: "#6ee7b7" },
	{ key: "retro3d", icon: "🕹️ ", labelKey: "shaderRetro3d", fallback: "Retro 3D", color: "#a7f3d0" },
	{ key: "mangaInk", icon: "🖋️ ", labelKey: "shaderMangaInk", fallback: "Manga Ink", color: "#e5e7eb" }
];

function updateLocalEditsUI() {
	// Headers & Labels
	if (lunPanelElements.editsModalTitle) setText(lunPanelElements.editsModalTitle, t("localEditsTitle") || "🎨 Local Edits (Creator Mode)");
	if (lunPanelElements.localEditsBtn) setText(lunPanelElements.localEditsBtn, t("localEditsBtn") || "🎨 Local Edits");
	if (editsModalElements.chromaHeader) setText(editsModalElements.chromaHeader, "🎬 " + (t("chromaKeyHeader") || "Chroma Key Skybox (Background)"));
	if (editsModalElements.chromaFloorHeader) setText(editsModalElements.chromaFloorHeader, "🟩 " + (t("chromaFloorHeader") || "Chroma Floor Pad (Stage)"));
	if (editsModalElements.solitudeHeader) setText(editsModalElements.solitudeHeader, "👤 " + (t("solitudeHeader") || "Solitude (Alone Mode)"));
	if (editsModalElements.shadersHeader) setText(editsModalElements.shadersHeader, "✨ " + tCustom("shadersHeader", "Shaders (3D Lighting & Outlines)"));
	if (editsModalElements.facialHeader) setText(editsModalElements.facialHeader, "😊 " + (t("facialExpressionHeader") || "Character Facial Expression"));
	if (editsModalElements.cameraHeader) setText(editsModalElements.cameraHeader, "📷 " + (t("cameraEffectsTitle") || "Camera Filters (Hotkeys)"));
	if (editsModalElements.renameHeader) setText(editsModalElements.renameHeader, t("renameHeader") || "Rename Name Tags");

	// Skybox / Chroma Key Buttons
	if (editsModalElements.chromaBtnNone) setText(editsModalElements.chromaBtnNone, t("chromaKeyColorNone") || "Default");
	if (editsModalElements.chromaBtnGreen) setText(editsModalElements.chromaBtnGreen, "🟢 " + (t("chromaKeyColorGreen") || "Green"));
	if (editsModalElements.chromaBtnBlue) setText(editsModalElements.chromaBtnBlue, "🔵 " + (t("chromaKeyColorBlue") || "Blue"));
	if (editsModalElements.chromaBtnRed) setText(editsModalElements.chromaBtnRed, "🔴 " + (t("chromaKeyColorRed") || "Red"));
	if (editsModalElements.chromaBtnMagenta) setText(editsModalElements.chromaBtnMagenta, "🟣 " + (t("chromaKeyColorMagenta") || "Magenta"));
	if (editsModalElements.chromaBtnBlack) setText(editsModalElements.chromaBtnBlack, "⚫ " + (t("skyColorBlack") || "Black Void"));
	if (editsModalElements.chromaBtnWhite) setText(editsModalElements.chromaBtnWhite, "⚪ " + (t("skyColorWhite") || "White Studio"));
	if (editsModalElements.chromaBtnMidnight) setText(editsModalElements.chromaBtnMidnight, "🌌 " + (t("skyColorMidnight") || "Midnight Navy"));
	if (editsModalElements.chromaBtnSunset) setText(editsModalElements.chromaBtnSunset, "🟪 " + (t("skyColorSunset") || "Sunset Violet"));
	if (editsModalElements.chromaBtnCyber) setText(editsModalElements.chromaBtnCyber, "🔷 " + (t("skyColorCyber") || "Cyber Teal"));
	if (editsModalElements.chromaBtnYellow) setText(editsModalElements.chromaBtnYellow, "🟡 " + (t("skyColorYellow") || "Neon Yellow"));
	if (editsModalElements.chromaBtnOrange) setText(editsModalElements.chromaBtnOrange, "🧡 " + (t("skyColorOrange") || "Vivid Orange"));
	if (editsModalElements.chromaBtnPink) setText(editsModalElements.chromaBtnPink, "🌸 " + (t("skyColorPink") || "Soft Pink"));
	if (editsModalElements.chromaBtnCyan) setText(editsModalElements.chromaBtnCyan, "💎 " + (t("skyColorCyan") || "Electric Cyan"));
	if (editsModalElements.chromaBtnMint) setText(editsModalElements.chromaBtnMint, "🌿 " + (t("skyColorMint") || "Mint Green"));
	if (editsModalElements.chromaBtnPurple) setText(editsModalElements.chromaBtnPurple, "💜 " + (t("skyColorPurple") || "Deep Purple"));
	if (editsModalElements.chromaBtnAmber) setText(editsModalElements.chromaBtnAmber, "🔶 " + (t("skyColorAmber") || "Warm Amber"));
	if (editsModalElements.chromaBtnCrimson) setText(editsModalElements.chromaBtnCrimson, "🍷 " + (t("skyColorCrimson") || "Crimson Wine"));
	if (editsModalElements.chromaBtnSlate) setText(editsModalElements.chromaBtnSlate, "🔘 " + (t("skyColorSlate") || "Studio Slate"));
	if (editsModalElements.chromaBtnSepia) setText(editsModalElements.chromaBtnSepia, "☕ " + (t("skyColorSepia") || "Warm Sepia"));

	const chromaBtns = {
		none: editsModalElements.chromaBtnNone,
		green: editsModalElements.chromaBtnGreen,
		blue: editsModalElements.chromaBtnBlue,
		red: editsModalElements.chromaBtnRed,
		magenta: editsModalElements.chromaBtnMagenta,
		black: editsModalElements.chromaBtnBlack,
		white: editsModalElements.chromaBtnWhite,
		midnight: editsModalElements.chromaBtnMidnight,
		sunset: editsModalElements.chromaBtnSunset,
		cyber: editsModalElements.chromaBtnCyber,
		yellow: editsModalElements.chromaBtnYellow,
		orange: editsModalElements.chromaBtnOrange,
		pink: editsModalElements.chromaBtnPink,
		cyan: editsModalElements.chromaBtnCyan,
		mint: editsModalElements.chromaBtnMint,
		purple: editsModalElements.chromaBtnPurple,
		amber: editsModalElements.chromaBtnAmber,
		crimson: editsModalElements.chromaBtnCrimson,
		slate: editsModalElements.chromaBtnSlate,
		sepia: editsModalElements.chromaBtnSepia
	};
	for (const [key, btn] of Object.entries(chromaBtns)) {
		if (btn) {
			if (lunChromaKeyColor === key) {
				btn.style.borderColor = "var(--spkmod-accent, #ffd54a)";
				btn.style.background = (key === "white" ? "#ffffff" : key === "black" ? "#222222" : "rgba(255, 255, 255, 0.2)");
				btn.style.boxShadow = "0 0 8px var(--spkmod-accent, #ffd54a)";
				btn.style.fontWeight = "bold";
			} else {
				btn.style.borderColor = "#555";
				btn.style.background = (key === "white" ? "#eeeeee" : key === "black" ? "#111111" : "");
				btn.style.boxShadow = "none";
				btn.style.fontWeight = "normal";
			}
		}
	}

	// Chroma Floor Pad Buttons
	if (editsModalElements.chromaFloorBtnOff) setText(editsModalElements.chromaFloorBtnOff, t("chromaFloorOff") || "Off");
	if (editsModalElements.chromaFloorBtnFull) setText(editsModalElements.chromaFloorBtnFull, t("chromaFloorFull") || "Full Floor");
	if (editsModalElements.chromaFloorBtnSquare) setText(editsModalElements.chromaFloorBtnSquare, t("chromaFloorSquare") || "Square");
	if (editsModalElements.chromaFloorBtnWide) setText(editsModalElements.chromaFloorBtnWide, t("chromaFloorWide") || "Wide");
	if (editsModalElements.chromaFloorBtnShort) setText(editsModalElements.chromaFloorBtnShort, t("chromaFloorShort") || "Short");
	if (editsModalElements.chromaFloorBtnCircle) setText(editsModalElements.chromaFloorBtnCircle, t("chromaFloorCircle") || "Circle");
	if (editsModalElements.chromaFloorBtnStar) setText(editsModalElements.chromaFloorBtnStar, "★ " + (t("chromaFloorStar") || "Star"));
	if (editsModalElements.chromaFloorScaleLabel) setText(editsModalElements.chromaFloorScaleLabel, (t("chromaFloorScale") || "Size") + ":");

	const floorShapeBtns = {
		off: editsModalElements.chromaFloorBtnOff,
		full: editsModalElements.chromaFloorBtnFull,
		square: editsModalElements.chromaFloorBtnSquare,
		wide: editsModalElements.chromaFloorBtnWide,
		short: editsModalElements.chromaFloorBtnShort,
		circle: editsModalElements.chromaFloorBtnCircle,
		star: editsModalElements.chromaFloorBtnStar
	};
	for (const [key, btn] of Object.entries(floorShapeBtns)) {
		if (btn) {
			const active = (lunChromaFloorShape === key);
			btn.style.borderColor = active ? "var(--spkmod-accent, #ffd54a)" : "#555";
			btn.style.background = active ? "rgba(255, 255, 255, 0.2)" : "";
			btn.style.boxShadow = active ? "0 0 8px var(--spkmod-accent, #ffd54a)" : "none";
			btn.style.fontWeight = active ? "bold" : "normal";
		}
	}

	[0.75, 1.0, 1.5, 2.0, 3.0].forEach(sc => {
		const btn = editsModalElements["chromaFloorScaleBtn_" + String(sc).replace(".", "_")];
		if (btn) {
			const active = (Math.abs(lunChromaFloorScale - sc) < 0.05);
			btn.style.borderColor = active ? "var(--spkmod-accent, #ffd54a)" : "#555";
			btn.style.background = active ? "rgba(255, 255, 255, 0.2)" : "";
			btn.style.boxShadow = active ? "0 0 8px var(--spkmod-accent, #ffd54a)" : "none";
			btn.style.fontWeight = active ? "bold" : "normal";
		}
	});

	// Solitude Toggle Controls
	if (editsModalElements.solitudeHeader) {
		setText(editsModalElements.solitudeHeader, "👤 " + (t("solitudeHeader") || "Solitude (Alone Mode)"));
	}
	if (editsModalElements.solitudeCheckbox) {
		editsModalElements.solitudeCheckbox.checked = !!lunHideAllOtherPlayers;
	}
	if (editsModalElements.solitudeCheckboxLabel) {
		setText(editsModalElements.solitudeCheckboxLabel, t("solitudeEnabledCheckbox") || "Enable Solitude Mode (Hide all players)");
	}
	if (editsModalElements.solitudeWhitelistLabel) {
		setText(editsModalElements.solitudeWhitelistLabel, t("solitudeWhitelistLabel") || "Whitelist (Names separated by comma):");
	}
	if (editsModalElements.solitudeWhitelistInput) {
		editsModalElements.solitudeWhitelistInput.placeholder = t("solitudeWhitelistPlaceholder") || "e.g. Player1, Player2...";
		if (document.activeElement !== editsModalElements.solitudeWhitelistInput) {
			editsModalElements.solitudeWhitelistInput.value = lunSolitudeWhitelist || "";
		}
	}

	// Shaders Section
	const activeShaderKey = (typeof lunActiveShader !== "undefined" && lunActiveShader) ? lunActiveShader : "none";
	if (editsModalElements.shaderButtons) {
		for (const item of SPKMOD_SHADER_UI_LIST) {
			const btn = editsModalElements.shaderButtons[item.key];
			if (!btn) continue;
			setText(btn, item.icon + tCustom(item.labelKey, item.fallback));
			const active = activeShaderKey === item.key;
			btn.style.borderColor = active ? "var(--spkmod-accent, #ffd54a)" : "#555";
			btn.style.background = active ? "rgba(255, 255, 255, 0.2)" : "";
			btn.style.boxShadow = active ? "0 0 8px var(--spkmod-accent, #ffd54a)" : "none";
			btn.style.fontWeight = active ? "bold" : "normal";
		}
	}

	// Facial Expression Buttons & Controls
	if (editsModalElements.exprBtnDefault) {
		setText(editsModalElements.exprBtnDefault, t("exprDefaultBtn") || "Default (Blinking)");
		editsModalElements.exprBtnDefault.title = t("exprDefault") || "Default (Dynamic Blinking)";
	}
	if (editsModalElements.facialResetBtn) {
		setText(editsModalElements.facialResetBtn, t("exprResetBtn") || "↺ Reset");
		editsModalElements.facialResetBtn.title = t("exprResetTooltip") || "Reset all other players' expressions";
	}
	if (editsModalElements.facialApplyAllBtn) {
		const baseAllText = t("exprApplyAllBtn") || "🌍 Apply to All Players";
		const activeAll = (typeof lunAllPlayersFacialExpression !== "undefined" && lunAllPlayersFacialExpression) || "none";
		if (activeAll !== "none") {
			const badge = (typeof LUN_FACIAL_EXPR_EMOJIS !== "undefined" && LUN_FACIAL_EXPR_EMOJIS[activeAll]) || "";
			setText(editsModalElements.facialApplyAllBtn, badge ? `${baseAllText} (${badge})` : baseAllText);
			editsModalElements.facialApplyAllBtn.style.borderColor = "var(--spkmod-accent, #ffd54a)";
			editsModalElements.facialApplyAllBtn.style.background = "rgba(255, 255, 255, 0.25)";
			editsModalElements.facialApplyAllBtn.style.fontWeight = "bold";
		} else {
			setText(editsModalElements.facialApplyAllBtn, baseAllText);
			editsModalElements.facialApplyAllBtn.style.borderColor = "";
			editsModalElements.facialApplyAllBtn.style.background = "";
			editsModalElements.facialApplyAllBtn.style.fontWeight = "normal";
		}
		editsModalElements.facialApplyAllBtn.title = t("exprApplyAllTooltip") || "Apply selected expression to all other players on the map";
	}
	if (editsModalElements.facialTargetInput) {
		editsModalElements.facialTargetInput.placeholder = t("exprTargetPlaceholder") || "Character Name...";
	}
	if (editsModalElements.facialTargetApplyBtn) {
		const baseTargetBtn = t("exprApplyTargetBtn") || "Apply";
		const targetCount = (typeof lunTargetFacialExpressions !== "undefined" && lunTargetFacialExpressions) ? lunTargetFacialExpressions.size : 0;
		setText(editsModalElements.facialTargetApplyBtn, targetCount > 0 ? `${baseTargetBtn} (${targetCount})` : baseTargetBtn);
		editsModalElements.facialTargetApplyBtn.title = t("exprApplyTargetTooltip") || "Apply selected expression to this character";
		editsModalElements.facialTargetApplyBtn.style.borderColor = targetCount > 0 ? "var(--spkmod-accent, #ffd54a)" : "";
	}
	if (editsModalElements.exprBtnConfident) editsModalElements.exprBtnConfident.title = t("exprConfident") || "Confident / Smug 😏";
	if (editsModalElements.exprBtnCurious) editsModalElements.exprBtnCurious.title = t("exprCurious") || "Curious 🥺";
	if (editsModalElements.exprBtnLashSmile) editsModalElements.exprBtnLashSmile.title = t("exprLashSmile") || "Lash Smile ☺️";
	if (editsModalElements.exprBtnSmile) editsModalElements.exprBtnSmile.title = t("exprSmile") || "Delighted Smile 😄";
	if (editsModalElements.exprBtnGentle) editsModalElements.exprBtnGentle.title = t("exprGentle") || "Gentle Open Smile 😊";
	if (editsModalElements.exprBtnTongueWink) editsModalElements.exprBtnTongueWink.title = t("exprTongueWink") || "Wink & Tongue 😜";
	if (editsModalElements.exprBtnTeasing) editsModalElements.exprBtnTeasing.title = t("exprTeasing") || "Teasing Tongue 😛";
	if (editsModalElements.exprBtnWorried) editsModalElements.exprBtnWorried.title = t("exprWorried") || "Worried Tongue 😨";

	const exprBtns = {
		none: editsModalElements.exprBtnDefault,
		open_confident: editsModalElements.exprBtnConfident,
		open_curious: editsModalElements.exprBtnCurious,
		closed_lash_smile: editsModalElements.exprBtnLashSmile,
		closed_smile: editsModalElements.exprBtnSmile,
		open_gentle: editsModalElements.exprBtnGentle,
		closed_tongue_2: editsModalElements.exprBtnTongueWink,
		open_teasing_tongue: editsModalElements.exprBtnTeasing,
		open_worried_tongue: editsModalElements.exprBtnWorried
	};
	for (const [key, btn] of Object.entries(exprBtns)) {
		if (btn) {
			if ((lunLockedFacialExpression || "none") === key) {
				btn.style.borderColor = "var(--spkmod-accent, #ffd54a)";
				btn.style.background = "rgba(255, 255, 255, 0.25)";
				btn.style.fontWeight = "bold";
			} else {
				btn.style.borderColor = "#555";
				btn.style.background = "";
				btn.style.fontWeight = "normal";
			}
		}
	}

	// Camera Effect Buttons
	if (editsModalElements.camBtnNone) setText(editsModalElements.camBtnNone, (t("effectNone") || "Normal") + " [Ctrl+6]");
	if (editsModalElements.camBtnBw) setText(editsModalElements.camBtnBw, (t("effectBw") || "B&W") + " [Ctrl+7]");
	if (editsModalElements.camBtnSepia) setText(editsModalElements.camBtnSepia, (t("effectSepia") || "Sepia") + " [Ctrl+8]");
	if (editsModalElements.camBtnMorning) setText(editsModalElements.camBtnMorning, (t("effectMorning") || "Morning") + " [Ctrl+9]");
	if (editsModalElements.camBtnDusk) setText(editsModalElements.camBtnDusk, (t("effectDusk") || "Dusk") + " [Ctrl+0]");
	if (editsModalElements.camBtnNight) setText(editsModalElements.camBtnNight, (t("effectNight") || "Night"));
	if (editsModalElements.camBtnVaporwave) setText(editsModalElements.camBtnVaporwave, "🌸 " + (t("effectVaporwave") || "Vaporwave"));
	if (editsModalElements.camBtnChromatic) setText(editsModalElements.camBtnChromatic, "🌈 " + (t("effectChromatic") || "Chromatic Aberration"));
	if (editsModalElements.camBtnUnfocus) setText(editsModalElements.camBtnUnfocus, "🌫️ " + (t("effectUnfocus") || "Dreamy Blur"));
	if (editsModalElements.camBtnFocus) setText(editsModalElements.camBtnFocus, "🔍 " + (t("effectFocus") || "Sharp Clarity"));
	if (editsModalElements.camBtnVhs) setText(editsModalElements.camBtnVhs, "📼 " + (t("effectVhs") || "90s VHS Tape"));
	if (editsModalElements.camBtnCyberpunk) setText(editsModalElements.camBtnCyberpunk, "⚡ " + (t("effectCyberpunk") || "Cyberpunk"));
	if (editsModalElements.camBtnNostalgia) setText(editsModalElements.camBtnNostalgia, "🚂 " + (t("effectNostalgia") || "Dreamy Train"));
	if (editsModalElements.camBtnPastel) setText(editsModalElements.camBtnPastel, "🎀 " + (t("effectPastel") || "Pastel Anime"));
	if (editsModalElements.camBtnWarmVintage) setText(editsModalElements.camBtnWarmVintage, "🎞️ " + (t("effectWarmVintage") || "Vintage Film"));
	if (editsModalElements.camBtnCoolCinema) setText(editsModalElements.camBtnCoolCinema, "🎬 " + (t("effectCoolCinema") || "Cool Cinema"));
	if (editsModalElements.camBtnMatrix) setText(editsModalElements.camBtnMatrix, "🟢 " + (t("effectMatrix") || "Matrix"));
	if (editsModalElements.camBtnInverted) setText(editsModalElements.camBtnInverted, "🔲 " + (t("effectInverted") || "Negative"));
	if (editsModalElements.camBtnGameboy) setText(editsModalElements.camBtnGameboy, "👾 " + (t("effectGameboy") || "Monatium Boy"));
	if (editsModalElements.camBtnBloodMoon) setText(editsModalElements.camBtnBloodMoon, "🩸 " + (t("effectBloodMoon") || "Blood Moon"));
	if (editsModalElements.camBtnSynthwave) setText(editsModalElements.camBtnSynthwave, "🔮 " + (t("effectSynthwave") || "Synthwave"));
	if (editsModalElements.camBtnUnderwater) setText(editsModalElements.camBtnUnderwater, "🌊 " + (t("effectUnderwater") || "Aqua Fantasy"));
	if (editsModalElements.camBtnGoldenHour) setText(editsModalElements.camBtnGoldenHour, "☀️ " + (t("effectGoldenHour") || "Golden Hour"));
	if (editsModalElements.camBtnComicBook) setText(editsModalElements.camBtnComicBook, "💥 " + (t("effectComicBook") || "Comic Book"));
	if (editsModalElements.camBtnArctic) setText(editsModalElements.camBtnArctic, "❄️ " + (t("effectArctic") || "Arctic Frost"));
	if (editsModalElements.camBtnCosmic) setText(editsModalElements.camBtnCosmic, "🌌 " + (t("effectCosmic") || "Cosmic Aurora"));
	if (editsModalElements.camBtnFilmNoir) setText(editsModalElements.camBtnFilmNoir, "🕵️ " + (t("effectFilmNoir") || "Film Noir"));
	if (editsModalElements.camBtnAcidTrip) setText(editsModalElements.camBtnAcidTrip, "🍄 " + (t("effectAcidTrip") || "Acid Trip"));
	if (editsModalElements.camBtnRadioactive) setText(editsModalElements.camBtnRadioactive, "☢️ " + (t("effectRadioactive") || "Radioactive"));
	if (editsModalElements.camBtnDeepFried) setText(editsModalElements.camBtnDeepFried, "🍗 " + (t("effectDeepFried") || "Deep Fried"));
	if (editsModalElements.camBtnAlienAbduction) setText(editsModalElements.camBtnAlienAbduction, "🛸 " + (t("effectAlienAbduction") || "Alien Abduction"));
	if (editsModalElements.camBtnXRay) setText(editsModalElements.camBtnXRay, "💀 " + (t("effectXRay") || "X-Ray Vision"));
	if (editsModalElements.camBtnThermal) setText(editsModalElements.camBtnThermal, "🌡️ " + (t("effectThermal") || "Thermal Vision"));
	if (editsModalElements.camBtnVirtualBoy) setText(editsModalElements.camBtnVirtualBoy, "🕶️ " + (t("effectVirtualBoy") || "Virtual Boy"));
	if (editsModalElements.camBtnEldritch) setText(editsModalElements.camBtnEldritch, "👁️ " + (t("effectEldritch") || "Eldritch Void"));
	if (editsModalElements.camBtnHaunted) setText(editsModalElements.camBtnHaunted, "👻 " + (t("effectHaunted") || "Paranormal Cam"));
	if (editsModalElements.camBtnGlitch) setText(editsModalElements.camBtnGlitch, "⚡ " + (t("effectGlitch") || "Glitch Art"));
	if (editsModalElements.camBtnKaleido) setText(editsModalElements.camBtnKaleido, "🌈 " + (t("effectKaleido") || "Rainbow Prism"));
	if (editsModalElements.camBtnSupernova) setText(editsModalElements.camBtnSupernova, "💥 " + (t("effectSupernova") || "Supernova"));

	const camBtns = {
		none: editsModalElements.camBtnNone,
		bw: editsModalElements.camBtnBw,
		sepia: editsModalElements.camBtnSepia,
		morning: editsModalElements.camBtnMorning,
		dusk: editsModalElements.camBtnDusk,
		night: editsModalElements.camBtnNight,
		vaporwave: editsModalElements.camBtnVaporwave,
		chromatic: editsModalElements.camBtnChromatic,
		unfocus: editsModalElements.camBtnUnfocus,
		focus: editsModalElements.camBtnFocus,
		vhs: editsModalElements.camBtnVhs,
		cyberpunk: editsModalElements.camBtnCyberpunk,
		nostalgia: editsModalElements.camBtnNostalgia,
		pastel: editsModalElements.camBtnPastel,
		warmVintage: editsModalElements.camBtnWarmVintage,
		coolCinema: editsModalElements.camBtnCoolCinema,
		matrix: editsModalElements.camBtnMatrix,
		inverted: editsModalElements.camBtnInverted,
		gameboy: editsModalElements.camBtnGameboy,
		bloodMoon: editsModalElements.camBtnBloodMoon,
		synthwave: editsModalElements.camBtnSynthwave,
		underwater: editsModalElements.camBtnUnderwater,
		goldenHour: editsModalElements.camBtnGoldenHour,
		comicBook: editsModalElements.camBtnComicBook,
		arctic: editsModalElements.camBtnArctic,
		cosmic: editsModalElements.camBtnCosmic,
		filmNoir: editsModalElements.camBtnFilmNoir,
		acidTrip: editsModalElements.camBtnAcidTrip,
		radioactive: editsModalElements.camBtnRadioactive,
		deepFried: editsModalElements.camBtnDeepFried,
		alienAbduction: editsModalElements.camBtnAlienAbduction,
		xRay: editsModalElements.camBtnXRay,
		thermal: editsModalElements.camBtnThermal,
		virtualBoy: editsModalElements.camBtnVirtualBoy,
		eldritch: editsModalElements.camBtnEldritch,
		haunted: editsModalElements.camBtnHaunted,
		glitch: editsModalElements.camBtnGlitch,
		kaleido: editsModalElements.camBtnKaleido,
		supernova: editsModalElements.camBtnSupernova
	};
	for (const [key, btn] of Object.entries(camBtns)) {
		if (btn) {
			if (lunCameraEffect === key) {
				btn.style.borderColor = "var(--spkmod-accent, #ffd54a)";
				btn.style.background = "rgba(255, 255, 255, 0.2)";
				btn.style.boxShadow = "0 0 8px var(--spkmod-accent, #ffd54a)";
				btn.style.fontWeight = "bold";
			} else {
				btn.style.borderColor = "#555";
				btn.style.background = "";
				btn.style.boxShadow = "none";
				btn.style.fontWeight = "normal";
			}
		}
	}


	// Soccer Uniform Buttons
	if (editsModalElements.soccerHeader) setText(editsModalElements.soccerHeader, "⚽ " + (t("soccerHeader") || "Soccer Uniform"));
	if (editsModalElements.soccerBtnRed) setText(editsModalElements.soccerBtnRed, "🔴 " + (t("soccerBtnRed") || "Red Team"));
	if (editsModalElements.soccerBtnBlue) setText(editsModalElements.soccerBtnBlue, "🔵 " + (t("soccerBtnBlue") || "Blue Team"));
	if (editsModalElements.soccerBtnRedAll) setText(editsModalElements.soccerBtnRedAll, "🔴 " + (t("soccerBtnRedAll") || "Red ALL"));
	if (editsModalElements.soccerBtnBlueAll) setText(editsModalElements.soccerBtnBlueAll, "🔵 " + (t("soccerBtnBlueAll") || "Blue ALL"));
	if (editsModalElements.soccerBtnNone) setText(editsModalElements.soccerBtnNone, "⚪ " + (t("soccerBtnNone") || "Default"));

	const myTeam = (typeof gameState !== 'undefined' && gameState ? gameState.mySoccerTeam : 0) || window.spkmodActiveSoccerTeam || 0;
	const allTeam = window.spkmodActiveSoccerTeamAll || 0;

	if (editsModalElements.soccerBtnRed) {
		if (myTeam === 1 && allTeam !== 1) {
			editsModalElements.soccerBtnRed.style.borderColor = "#ff5555";
			editsModalElements.soccerBtnRed.style.background = "rgba(255, 85, 85, 0.25)";
			editsModalElements.soccerBtnRed.style.boxShadow = "0 0 8px #ff5555";
			editsModalElements.soccerBtnRed.style.fontWeight = "bold";
		} else {
			editsModalElements.soccerBtnRed.style.borderColor = "#555";
			editsModalElements.soccerBtnRed.style.background = "";
			editsModalElements.soccerBtnRed.style.boxShadow = "none";
			editsModalElements.soccerBtnRed.style.fontWeight = "normal";
		}
	}
	if (editsModalElements.soccerBtnBlue) {
		if (myTeam === 2 && allTeam !== 2) {
			editsModalElements.soccerBtnBlue.style.borderColor = "#5599ff";
			editsModalElements.soccerBtnBlue.style.background = "rgba(85, 153, 255, 0.25)";
			editsModalElements.soccerBtnBlue.style.boxShadow = "0 0 8px #5599ff";
			editsModalElements.soccerBtnBlue.style.fontWeight = "bold";
		} else {
			editsModalElements.soccerBtnBlue.style.borderColor = "#555";
			editsModalElements.soccerBtnBlue.style.background = "";
			editsModalElements.soccerBtnBlue.style.boxShadow = "none";
			editsModalElements.soccerBtnBlue.style.fontWeight = "normal";
		}
	}
	if (editsModalElements.soccerBtnRedAll) {
		if (allTeam === 1) {
			editsModalElements.soccerBtnRedAll.style.borderColor = "#ff5555";
			editsModalElements.soccerBtnRedAll.style.background = "rgba(255, 85, 85, 0.25)";
			editsModalElements.soccerBtnRedAll.style.boxShadow = "0 0 8px #ff5555";
			editsModalElements.soccerBtnRedAll.style.fontWeight = "bold";
		} else {
			editsModalElements.soccerBtnRedAll.style.borderColor = "#555";
			editsModalElements.soccerBtnRedAll.style.background = "";
			editsModalElements.soccerBtnRedAll.style.boxShadow = "none";
			editsModalElements.soccerBtnRedAll.style.fontWeight = "normal";
		}
	}
	if (editsModalElements.soccerBtnBlueAll) {
		if (allTeam === 2) {
			editsModalElements.soccerBtnBlueAll.style.borderColor = "#5599ff";
			editsModalElements.soccerBtnBlueAll.style.background = "rgba(85, 153, 255, 0.25)";
			editsModalElements.soccerBtnBlueAll.style.boxShadow = "0 0 8px #5599ff";
			editsModalElements.soccerBtnBlueAll.style.fontWeight = "bold";
		} else {
			editsModalElements.soccerBtnBlueAll.style.borderColor = "#555";
			editsModalElements.soccerBtnBlueAll.style.background = "";
			editsModalElements.soccerBtnBlueAll.style.boxShadow = "none";
			editsModalElements.soccerBtnBlueAll.style.fontWeight = "normal";
		}
	}
	if (editsModalElements.soccerBtnNone) {
		if (myTeam === 0 && allTeam === 0) {
			editsModalElements.soccerBtnNone.style.borderColor = "var(--spkmod-accent, #ffd54a)";
			editsModalElements.soccerBtnNone.style.background = "rgba(255, 255, 255, 0.2)";
			editsModalElements.soccerBtnNone.style.boxShadow = "0 0 8px var(--spkmod-accent, #ffd54a)";
			editsModalElements.soccerBtnNone.style.fontWeight = "bold";
		} else {
			editsModalElements.soccerBtnNone.style.borderColor = "#555";
			editsModalElements.soccerBtnNone.style.background = "";
			editsModalElements.soccerBtnNone.style.boxShadow = "none";
			editsModalElements.soccerBtnNone.style.fontWeight = "normal";
		}
	}

	// Character Dye & FX Buttons
	if (editsModalElements.avatarDyeHeader) setText(editsModalElements.avatarDyeHeader, "🎨 " + (t("avatarDyeHeader") || "Character Dye & FX (Local Only)"));
	if (editsModalElements.dyeScopeBtn) {
		setText(editsModalElements.dyeScopeBtn, window.spkmodAvatarColorScope === "body" ? (t("dyeScopeBody") || "Outfit Only") : (t("dyeScopeAll") || "Full Avatar"));
	}
	if (editsModalElements.customColorLabel) {
		setText(editsModalElements.customColorLabel, t("dyeCustomColor") || "Custom Color:");
	}
	if (editsModalElements.dyeBtnReset) setText(editsModalElements.dyeBtnReset, "↺ " + (t("dyeReset") || "Reset Character Dye & FX"));

	// 18 Colors Grid
	if (typeof SPKMOD_DYE_COLORS !== "undefined") {
		SPKMOD_DYE_COLORS.forEach(c => {
			const btn = editsModalElements["dyeBtn_" + c.id] || editsModalElements["dyeBtn_" + c.name];
			if (btn) {
				const localizedName = t(c.key) || c.name;
				setText(btn, `${c.emoji} ${localizedName}`);
				const isSelected = (window.spkmodAvatarColorMode === "color" && 
					(window.spkmodAvatarColorHex || '').toLowerCase() === c.hex.toLowerCase());
				if (isSelected) {
					btn.style.borderColor = c.hex === "#ffffff" ? "#ffd54a" : c.hex;
					btn.style.background = "rgba(255, 255, 255, 0.18)";
					btn.style.boxShadow = `0 0 8px ${c.hex}88`;
				} else {
					btn.style.borderColor = "#555";
					btn.style.background = "";
					btn.style.boxShadow = "";
				}
			}
		});
	}

	if (editsModalElements.dyeBtnRainbow) {
		setText(editsModalElements.dyeBtnRainbow, "🌈 " + (t("dyeBtnRainbow") || "Rainbow"));
		if (window.spkmodAvatarColorMode === "rainbow") {
			editsModalElements.dyeBtnRainbow.style.borderColor = "var(--spkmod-accent, #ffd54a)";
			editsModalElements.dyeBtnRainbow.style.background = "rgba(236, 72, 153, 0.25)";
		} else {
			editsModalElements.dyeBtnRainbow.style.borderColor = "#555";
			editsModalElements.dyeBtnRainbow.style.background = "";
		}
	}
	if (editsModalElements.dyeBtnRainbowAll) {
		setText(editsModalElements.dyeBtnRainbowAll, "🌟 " + (t("dyeBtnRainbowAll") || "Rainbow ALL"));
		if (window.spkmodAvatarColorMode === "rainbow_all") {
			editsModalElements.dyeBtnRainbowAll.style.borderColor = "var(--spkmod-accent, #ffd54a)";
			editsModalElements.dyeBtnRainbowAll.style.background = "rgba(255, 213, 74, 0.35)";
		} else {
			editsModalElements.dyeBtnRainbowAll.style.borderColor = "#555";
			editsModalElements.dyeBtnRainbowAll.style.background = "";
		}
	}
	if (editsModalElements.dyeBtnRainbowRandom) {
		setText(editsModalElements.dyeBtnRainbowRandom, "🔀 " + (t("dyeBtnRainbowRandom") || "Random Rainbow"));
		if (window.spkmodAvatarColorMode === "rainbow_random") {
			editsModalElements.dyeBtnRainbowRandom.style.borderColor = "var(--spkmod-accent, #ffd54a)";
			editsModalElements.dyeBtnRainbowRandom.style.background = "rgba(56, 189, 248, 0.25)";
		} else {
			editsModalElements.dyeBtnRainbowRandom.style.borderColor = "#555";
			editsModalElements.dyeBtnRainbowRandom.style.background = "";
		}
	}
	if (editsModalElements.dyeBtnShadow) {
		setText(editsModalElements.dyeBtnShadow, "👤 " + (t("dyeBtnShadow") || "Void Shadow"));
		if (window.spkmodAvatarColorMode === "shadow") {
			editsModalElements.dyeBtnShadow.style.borderColor = "#c084fc";
			editsModalElements.dyeBtnShadow.style.background = "rgba(192, 132, 252, 0.25)";
		} else {
			editsModalElements.dyeBtnShadow.style.borderColor = "#555";
			editsModalElements.dyeBtnShadow.style.background = "";
		}
	}
	if (editsModalElements.dyeBtnBadApple) {
		setText(editsModalElements.dyeBtnBadApple, "🍎 " + (t("dyeBtnBadApple") || "Bad Apple"));
		if (window.spkmodAvatarColorMode === "bad_apple") {
			editsModalElements.dyeBtnBadApple.style.borderColor = "#ffffff";
			editsModalElements.dyeBtnBadApple.style.background = "#333333";
			editsModalElements.dyeBtnBadApple.style.boxShadow = "0 0 8px rgba(255, 255, 255, 0.6)";
		} else {
			editsModalElements.dyeBtnBadApple.style.borderColor = "#666";
			editsModalElements.dyeBtnBadApple.style.background = "#111111";
			editsModalElements.dyeBtnBadApple.style.boxShadow = "";
		}
	}
	if (editsModalElements.dyeColorPicker && window.spkmodAvatarColorHex) {
		editsModalElements.dyeColorPicker.value = window.spkmodAvatarColorHex;
	}
	if (editsModalElements.rainbowSpeedLabel) {
		setText(editsModalElements.rainbowSpeedLabel, t("dyeRainbowSpeed") || "Rainbow Speed:");
	}
	if (editsModalElements.rainbowSpeedValue) {
		const curSpeed = typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed : 1.0;
		setText(editsModalElements.rainbowSpeedValue, `x${curSpeed.toFixed(1)}`);
	}
	if (editsModalElements.rainbowSpeedSlider) {
		editsModalElements.rainbowSpeedSlider.value = typeof window.spkmodRainbowSpeed === 'number' ? window.spkmodRainbowSpeed : 1.0;
	}

	// Cooking Buttons
	if (editsModalElements.cookingHeader) setText(editsModalElements.cookingHeader, "🍳 " + (t("cookingHeader") || "Cooking Animations"));
	if (editsModalElements.cookBtnChop) setText(editsModalElements.cookBtnChop, t("cookBtnChop") || "🔪 Chop");
	if (editsModalElements.cookBtnStir) setText(editsModalElements.cookBtnStir, t("cookBtnStir") || "🍳 Stir");
	if (editsModalElements.cookBtnPlate) setText(editsModalElements.cookBtnPlate, t("cookBtnPlate") || "🍽️ Plate");
	if (editsModalElements.cookBtnServe) setText(editsModalElements.cookBtnServe, t("cookBtnServe") || "🛎️ Serve");
	if (editsModalElements.cookBtnCarry) setText(editsModalElements.cookBtnCarry, t("cookBtnCarry") || "📦 Carry");
	if (editsModalElements.cookBtnStop) setText(editsModalElements.cookBtnStop, t("cookBtnStop") || "🛑 Stop");

	// Copter & Poses
	if (editsModalElements.copterHeader) setText(editsModalElements.copterHeader, "🚁 " + (t("copterHeader") || "Copter Hat & Special Poses"));
	if (editsModalElements.copterBtnSelf) setText(editsModalElements.copterBtnSelf, t("copterBtnSelf") || "🚁 Copter (Self)");
	if (editsModalElements.copterBtnAll) setText(editsModalElements.copterBtnAll, t("copterBtnAll") || "🚁 Copter (ALL)");
	if (editsModalElements.spellDanceBtn) setText(editsModalElements.spellDanceBtn, t("spellDanceBtn") || "✨🌀 Spell Dance");
	if (editsModalElements.gatherAnimBtn) setText(editsModalElements.gatherAnimBtn, t("gatherAnimBtn") || "🌿 Gather Loop");

	// Step Trail
	if (editsModalElements.stepTrailHeader) setText(editsModalElements.stepTrailHeader, "✨ " + (t("stepTrailHeader") || "Step Particle Trail"));
	if (editsModalElements.stepTrailToggleBtn) {
		const isEnabled = window.spkmodStepTrail?.enabled;
		setText(editsModalElements.stepTrailToggleBtn, (t("stepTrailToggle") || "Trail: ") + (isEnabled ? "ON" : "OFF"));
		editsModalElements.stepTrailToggleBtn.style.color = isEnabled ? "#55ff55" : "#ffaaaa";
		editsModalElements.stepTrailToggleBtn.style.borderColor = isEnabled ? "#55ff55" : "#555";
	}
	if (editsModalElements.stepTrailBurstBtn) setText(editsModalElements.stepTrailBurstBtn, t("stepTrailBurst") || "💥 Starburst Explosion");
	if (editsModalElements.stepTrailBurstSpamBtn) {
		const isSpam = window.spkmodBurstSpamActive;
		setText(editsModalElements.stepTrailBurstSpamBtn, (t("stepTrailBurstSpam") || "⚡ Spam: ") + (isSpam ? (t("burstSpamOn") || "ON") : (t("burstSpamOff") || "OFF")));
		editsModalElements.stepTrailBurstSpamBtn.style.color = isSpam ? "#55ff55" : "#ffd54a";
		editsModalElements.stepTrailBurstSpamBtn.style.borderColor = isSpam ? "#55ff55" : "#555";
		editsModalElements.stepTrailBurstSpamBtn.style.background = isSpam ? "rgba(85, 255, 85, 0.2)" : "";
	}
	if (editsModalElements.spellDanceBtn) {
		const isDancing = window.spkmodSpellDanceActive;
		setText(editsModalElements.spellDanceBtn, isDancing ? "🛑 Stop Dance" : (t("spellDanceBtn") || "✨🌀 Spell Dance"));
		editsModalElements.spellDanceBtn.style.color = isDancing ? "#f87171" : "#c084fc";
		editsModalElements.spellDanceBtn.style.borderColor = isDancing ? "#f87171" : "#555";
	}
	if (editsModalElements.gatherAnimBtn) {
		const isGathering = window.spkmodGatherActive;
		setText(editsModalElements.gatherAnimBtn, isGathering ? "🛑 Stop Gather" : (t("gatherAnimBtn") || "🌿 Gather Loop"));
		editsModalElements.gatherAnimBtn.style.color = isGathering ? "#f87171" : "#84cc16";
		editsModalElements.gatherAnimBtn.style.borderColor = isGathering ? "#f87171" : "#555";
	}
	if (editsModalElements.stepTrailStarsBtn) setText(editsModalElements.stepTrailStarsBtn, t("stepTrailStars") || "⭐ Stars");
	if (editsModalElements.stepTrailRainbowBtn) setText(editsModalElements.stepTrailRainbowBtn, t("stepTrailRainbow") || "🌈 Rainbow");
	if (editsModalElements.stepTrailHeartsBtn) setText(editsModalElements.stepTrailHeartsBtn, t("stepTrailHearts") || "💖 Hearts");
	if (window.spkmodUpdatePumpkinCartButtonStyles) window.spkmodUpdatePumpkinCartButtonStyles();
}

function toggleLocalEditsModal() {
	if (!lunHudElements.editsModal) return;
	const isClosed = lunHudElements.editsModal.classList.contains("hidden");
	if (isClosed) {
		if (typeof bringToFront === "function") bringToFront(lunHudElements.editsModal);
		if (typeof positionModalNicely === "function") positionModalNicely(lunHudElements.editsModal);
		lunHudElements.editsModal.classList.remove("hidden");
		if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
	} else {
		lunHudElements.editsModal.classList.add("hidden");
	}
}
window.toggleLocalEditsModal = toggleLocalEditsModal;

document.body.appendChild(
	lunHudElements.editsModal = buildElement("div", {
		id: "spkmod-edits-modal",
		className: "hidden",
		style: "position: fixed; z-index: 600000; width: fit-content; min-width: 420px; max-width: 95vw; overflow-x: hidden; box-sizing: border-box;"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			lunPanelElements.editsModalTitle = buildElement("span", {
				innerText: t("localEditsTitle") || "🎨 Local Edits (Creator Mode)",
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none; touch-action: none; padding: 6px 0; min-height: 24px; display: inline-block; width: 100%;"
			}),
			buildElement("span", {
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px; font-size: 14px;",
				onclick: _ => lunHudElements.editsModal.classList.add("hidden")
			})
		]),
		buildElement("div", { style: "display: flex; flex-direction: column; gap: 10px; max-height: 80vh; overflow-y: auto; overflow-x: hidden; padding: 4px; box-sizing: border-box;" }, [
			// Section 1: Skybox & Background
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid #555; padding-bottom: 8px;" }, [
				editsModalElements.chromaHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "🎬 " + (t("chromaKeyHeader") || "Skybox & Background"),
					style: "margin-top: 0px;"
				}),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;" }, [
					editsModalElements.chromaBtnNone = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaKeyColorNone") || "Default",
						onclick: () => { applyChromaKeyColor("none"); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnGreen = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #00ff00;",
						innerText: "🟢 " + (t("chromaKeyColorGreen") || "Green"),
						onclick: () => { applyChromaKeyColor("green", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnBlue = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #5599ff;",
						innerText: "🔵 " + (t("chromaKeyColorBlue") || "Blue"),
						onclick: () => { applyChromaKeyColor("blue", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnRed = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff5555;",
						innerText: "🔴 " + (t("chromaKeyColorRed") || "Red"),
						onclick: () => { applyChromaKeyColor("red", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnMagenta = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff55ff;",
						innerText: "🟣 " + (t("chromaKeyColorMagenta") || "Magenta"),
						onclick: () => { applyChromaKeyColor("magenta", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnBlack = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ffffff; background: #111;",
						innerText: "⚫ " + (t("skyColorBlack") || "Black Void"),
						onclick: () => { applyChromaKeyColor("black", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnWhite = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #333333; background: #eee;",
						innerText: "⚪ " + (t("skyColorWhite") || "White Studio"),
						onclick: () => { applyChromaKeyColor("white", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnMidnight = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #8faaff;",
						innerText: "🌌 " + (t("skyColorMidnight") || "Midnight Navy"),
						onclick: () => { applyChromaKeyColor("midnight", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnSunset = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff99ff;",
						innerText: "🟪 " + (t("skyColorSunset") || "Sunset Violet"),
						onclick: () => { applyChromaKeyColor("sunset", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnCyber = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #00ffff;",
						innerText: "🔷 " + (t("skyColorCyber") || "Cyber Teal"),
						onclick: () => { applyChromaKeyColor("cyber", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnYellow = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ffff33;",
						innerText: "🟡 " + (t("skyColorYellow") || "Neon Yellow"),
						onclick: () => { applyChromaKeyColor("yellow", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnOrange = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff8833;",
						innerText: "🧡 " + (t("skyColorOrange") || "Vivid Orange"),
						onclick: () => { applyChromaKeyColor("orange", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnPink = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff80bf;",
						innerText: "🌸 " + (t("skyColorPink") || "Soft Pink"),
						onclick: () => { applyChromaKeyColor("pink", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnCyan = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #38bdf8;",
						innerText: "💎 " + (t("skyColorCyan") || "Electric Cyan"),
						onclick: () => { applyChromaKeyColor("cyan", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnMint = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #34d399;",
						innerText: "🌿 " + (t("skyColorMint") || "Mint Green"),
						onclick: () => { applyChromaKeyColor("mint", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnPurple = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #c084fc;",
						innerText: "💜 " + (t("skyColorPurple") || "Deep Purple"),
						onclick: () => { applyChromaKeyColor("purple", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnAmber = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #fbbf24;",
						innerText: "🔶 " + (t("skyColorAmber") || "Warm Amber"),
						onclick: () => { applyChromaKeyColor("amber", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnCrimson = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #fb7185;",
						innerText: "🍷 " + (t("skyColorCrimson") || "Crimson Wine"),
						onclick: () => { applyChromaKeyColor("crimson", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnSlate = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #94a3b8;",
						innerText: "🔘 " + (t("skyColorSlate") || "Studio Slate"),
						onclick: () => { applyChromaKeyColor("slate", true); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaBtnSepia = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #d97706;",
						innerText: "☕ " + (t("skyColorSepia") || "Warm Sepia"),
						onclick: () => { applyChromaKeyColor("sepia", true); updateLocalEditsUI(); }
					})
				])
			]),

			// Section 1.5: Chroma Floor Pad
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid #555; padding-bottom: 8px;" }, [
				editsModalElements.chromaFloorHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "🟩 " + (t("chromaFloorHeader") || "Chroma Floor Pad (Stage)"),
					style: "margin-top: 0px;"
				}),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;" }, [
					editsModalElements.chromaFloorBtnOff = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaFloorOff") || "Off",
						onclick: () => { applyChromaFloorPad("off", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnFull = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #4ade80;",
						innerText: t("chromaFloorFull") || "Full Floor",
						onclick: () => { applyChromaFloorPad("full", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnSquare = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaFloorSquare") || "Square",
						onclick: () => { applyChromaFloorPad("square", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnWide = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaFloorWide") || "Wide",
						onclick: () => { applyChromaFloorPad("wide", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnShort = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaFloorShort") || "Short",
						onclick: () => { applyChromaFloorPad("short", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnCircle = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: t("chromaFloorCircle") || "Circle",
						onclick: () => { applyChromaFloorPad("circle", null); updateLocalEditsUI(); }
					}),
					editsModalElements.chromaFloorBtnStar = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ffd54a;",
						innerText: "★ " + (t("chromaFloorStar") || "Star"),
						onclick: () => { applyChromaFloorPad("star", null); updateLocalEditsUI(); }
					})
				]),
				buildElement("div", { style: "display: flex; gap: 4px; align-items: center; margin-top: 2px;" }, [
					editsModalElements.chromaFloorScaleLabel = buildElement("span", {
						style: "font-size: 10px; color: #aaa; flex-shrink: 0; margin-right: 2px;",
						innerText: (t("chromaFloorScale") || "Size") + ":"
					}),
					...[0.75, 1.0, 1.5, 2.0, 3.0].map(sc => {
						const key = "chromaFloorScaleBtn_" + String(sc).replace(".", "_");
						return editsModalElements[key] = buildElement("button", {
							className: "spkmod-panel-btn",
							style: "padding: 3px 5px; font-size: 9.5px; flex: 1; text-align: center;",
							innerText: sc + "x",
							onclick: () => { applyChromaFloorPad(null, sc); updateLocalEditsUI(); }
						});
					})
				])
			]),

			// Section 2: Solitude Mode (Alone Mode)
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 6px; border-bottom: 1px solid #555; padding-bottom: 8px;" }, [
				editsModalElements.solitudeHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "👤 " + (t("solitudeHeader") || "Solitude (Alone Mode)"),
					style: "margin-top: 0px;"
				}),
				buildElement("label", { style: "display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 11px; font-weight: bold; color: #fff;" }, [
					editsModalElements.solitudeCheckbox = buildElement("input", {
						type: "checkbox",
						checked: !!lunHideAllOtherPlayers,
						style: "cursor: pointer; width: 14px; height: 14px; accent-color: #ffd54a; margin: 0;",
						onchange: (e) => {
							setHideAllOtherPlayers(e.target.checked);
						}
					}),
					editsModalElements.solitudeCheckboxLabel = buildElement("span", {
						innerText: t("solitudeEnabledCheckbox") || "Enable Solitude Mode (Hide all players)"
					})
				]),
				buildElement("div", { style: "display: flex; flex-direction: column; gap: 3px; margin-top: 2px;" }, [
					editsModalElements.solitudeWhitelistLabel = buildElement("span", {
						style: "font-size: 10px; color: #bbb;",
						innerText: t("solitudeWhitelistLabel") || "Whitelist (Names separated by comma):"
					}),
					editsModalElements.solitudeWhitelistInput = buildElement("input", {
						type: "text",
						placeholder: t("solitudeWhitelistPlaceholder") || "e.g. Player1, Player2...",
						value: lunSolitudeWhitelist || "",
						style: "width: 100%; box-sizing: border-box; padding: 4px 6px; font-size: 11px; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff;",
						oninput: (e) => {
							setSolitudeWhitelist(e.target.value);
						}
					})
				])
			]),

			// Section 2.5: Shaders (3D Lighting & Post-Processing)
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid #555; padding-bottom: 8px;" }, [
				editsModalElements.shadersHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "✨ " + tCustom("shadersHeader", "Shaders (3D Lighting & Outlines)"),
					style: "margin-top: 0px;"
				}),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;" },
					SPKMOD_SHADER_UI_LIST.map(item => {
						if (!editsModalElements.shaderButtons) editsModalElements.shaderButtons = {};
						const colorCss = item.color ? ` color: ${item.color};` : "";
						return editsModalElements.shaderButtons[item.key] = buildElement("button", {
							className: "spkmod-panel-btn",
							style: `padding: 5px 2px; font-size: 9.5px; text-align: center;${colorCss}`,
							innerText: item.icon + tCustom(item.labelKey, item.fallback),
							onclick: () => {
								if (typeof setShaderPreset === "function") setShaderPreset(item.key);
							}
						});
					})
				)
			]),

			// Section 3: Facial Expression Lock
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px; border-bottom: 1px solid #555; padding-bottom: 8px;" }, [
				editsModalElements.facialHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "😊 " + (t("facialExpressionHeader") || "Character Facial Expression"),
					style: "margin-top: 0px;"
				}),
				buildElement("div", { style: "display: flex; gap: 4px;" }, [
					editsModalElements.exprBtnDefault = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "flex: 1; padding: 5px 6px; font-size: 11px; text-align: center;",
						innerText: t("exprDefaultBtn") || "Default (Blinking)",
						title: t("exprDefault") || "Default (Dynamic Blinking)",
						onclick: () => applyLockedFacialExpression("none")
					}),
					editsModalElements.facialResetBtn = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 10px; font-size: 11px; text-align: center;",
						innerText: t("exprResetBtn") || "↺ Reset",
						title: t("exprResetTooltip") || "Reset all other players' expressions",
						onclick: () => resetRemoteFacialExpressions()
					})
				]),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px;" }, [
					editsModalElements.exprBtnConfident = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😏",
						title: t("exprConfident") || "Confident / Smug 😏",
						onclick: () => applyLockedFacialExpression("open_confident")
					}),
					editsModalElements.exprBtnCurious = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "🥺",
						title: t("exprCurious") || "Curious 🥺",
						onclick: () => applyLockedFacialExpression("open_curious")
					}),
					editsModalElements.exprBtnLashSmile = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "☺️",
						title: t("exprLashSmile") || "Lash Smile ☺️",
						onclick: () => applyLockedFacialExpression("closed_lash_smile")
					}),
					editsModalElements.exprBtnSmile = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😄",
						title: t("exprSmile") || "Delighted Smile 😄",
						onclick: () => applyLockedFacialExpression("closed_smile")
					}),
					editsModalElements.exprBtnGentle = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😊",
						title: t("exprGentle") || "Gentle Open Smile 😊",
						onclick: () => applyLockedFacialExpression("open_gentle")
					}),
					editsModalElements.exprBtnTongueWink = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😜",
						title: t("exprTongueWink") || "Wink & Tongue 😜",
						onclick: () => applyLockedFacialExpression("closed_tongue_2")
					}),
					editsModalElements.exprBtnTeasing = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😛",
						title: t("exprTeasing") || "Teasing Tongue 😛",
						onclick: () => applyLockedFacialExpression("open_teasing_tongue")
					}),
					editsModalElements.exprBtnWorried = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 6px 0; font-size: 16px; text-align: center; line-height: 1.1;",
						innerText: "😨",
						title: t("exprWorried") || "Worried Tongue 😨",
						onclick: () => applyLockedFacialExpression("open_worried_tongue")
					})
				]),
				editsModalElements.facialApplyAllBtn = buildElement("button", {
					className: "spkmod-panel-btn",
					style: "width: 100%; padding: 5px 6px; font-size: 11px; text-align: center;",
					innerText: t("exprApplyAllBtn") || "🌍 Apply to All Players",
					title: t("exprApplyAllTooltip") || "Apply selected expression to all other players on the map",
					onclick: () => applyAllPlayersFacialExpression()
				}),
				buildElement("div", { style: "display: flex; gap: 4px;" }, [
					editsModalElements.facialTargetInput = buildElement("input", {
						type: "text",
						placeholder: t("exprTargetPlaceholder") || "Character Name...",
						style: "flex: 1; min-width: 0; box-sizing: border-box; padding: 4px 6px; font-size: 11px; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff;",
						onkeydown: (e) => {
							e.stopPropagation();
							if (e.key === "Enter") {
								e.preventDefault();
								if (editsModalElements.facialTargetApplyBtn) editsModalElements.facialTargetApplyBtn.click();
							}
						},
						onkeyup: (e) => e.stopPropagation(),
						onkeypress: (e) => e.stopPropagation()
					}),
					editsModalElements.facialTargetApplyBtn = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 4px 12px; font-size: 11px; text-align: center; flex-shrink: 0;",
						innerText: t("exprApplyTargetBtn") || "Apply",
						title: t("exprApplyTargetTooltip") || "Apply selected expression to this character",
						onclick: () => {
							const nameVal = editsModalElements.facialTargetInput ? editsModalElements.facialTargetInput.value : "";
							if (!nameVal || !nameVal.trim()) {
								if (editsModalElements.facialTargetInput) {
									editsModalElements.facialTargetInput.style.borderColor = "#ff5555";
									setTimeout(() => {
										if (editsModalElements.facialTargetInput) editsModalElements.facialTargetInput.style.borderColor = "#555";
									}, 700);
								}
								return;
							}
							applyTargetPlayerFacialExpression(nameVal);
							if (editsModalElements.facialTargetApplyBtn) {
								editsModalElements.facialTargetApplyBtn.style.borderColor = "#55ff55";
								setTimeout(() => {
									if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
								}, 600);
							}
						}
					})
				])
			]),

			// Section 4: Camera Effects (Filters & Hotkeys)
			buildElement("div", { style: "display: flex; flex-direction: column; gap: 4px;" }, [
				editsModalElements.cameraHeader = buildElement("div", {
					className: "spkmod-panel-cat-header",
					innerText: "📷 " + (t("cameraEffectsTitle") || "Camera Filters (Hotkeys)"),
					style: "margin-top: 0px;"
				}),
				buildElement("div", { style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;" }, [
					editsModalElements.camBtnNone = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectNone") || "Normal") + " [Ctrl+6]",
						onclick: () => setCameraEffectLocal("none")
					}),
					editsModalElements.camBtnBw = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectBw") || "B&W") + " [Ctrl+7]",
						onclick: () => setCameraEffectLocal("bw")
					}),
					editsModalElements.camBtnSepia = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectSepia") || "Sepia") + " [Ctrl+8]",
						onclick: () => setCameraEffectLocal("sepia")
					}),
					editsModalElements.camBtnMorning = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectMorning") || "Morning") + " [Ctrl+9]",
						onclick: () => setCameraEffectLocal("morning")
					}),
					editsModalElements.camBtnDusk = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectDusk") || "Dusk") + " [Ctrl+0]",
						onclick: () => setCameraEffectLocal("dusk")
					}),
					editsModalElements.camBtnNight = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center;",
						innerText: (t("effectNight") || "Night"),
						onclick: () => setCameraEffectLocal("night")
					}),
					editsModalElements.camBtnVaporwave = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff77c6;",
						innerText: "🌸 " + (t("effectVaporwave") || "Vaporwave"),
						onclick: () => setCameraEffectLocal("vaporwave")
					}),
					editsModalElements.camBtnChromatic = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #00ffcc;",
						innerText: "🌈 " + (t("effectChromatic") || "Chromatic Aberration"),
						onclick: () => setCameraEffectLocal("chromatic")
					}),
					editsModalElements.camBtnUnfocus = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #c4d8e2;",
						innerText: "🌫️ " + (t("effectUnfocus") || "Dreamy Blur"),
						onclick: () => setCameraEffectLocal("unfocus")
					}),
					editsModalElements.camBtnFocus = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ffffff;",
						innerText: "🔍 " + (t("effectFocus") || "Sharp Clarity"),
						onclick: () => setCameraEffectLocal("focus")
					}),
					editsModalElements.camBtnVhs = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #39ff14;",
						innerText: "📼 " + (t("effectVhs") || "90s VHS Tape"),
						onclick: () => setCameraEffectLocal("vhs")
					}),
					editsModalElements.camBtnCyberpunk = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #00ffff;",
						innerText: "⚡ " + (t("effectCyberpunk") || "Cyberpunk"),
						onclick: () => setCameraEffectLocal("cyberpunk")
					}),
					editsModalElements.camBtnNostalgia = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #f4d06f;",
						innerText: "🚂 " + (t("effectNostalgia") || "Dreamy Train"),
						onclick: () => setCameraEffectLocal("nostalgia")
					}),
					editsModalElements.camBtnPastel = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ffb7b2;",
						innerText: "🎀 " + (t("effectPastel") || "Pastel Anime"),
						onclick: () => setCameraEffectLocal("pastel")
					}),
					editsModalElements.camBtnWarmVintage = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #e29578;",
						innerText: "🎞️ " + (t("effectWarmVintage") || "Vintage Film"),
						onclick: () => setCameraEffectLocal("warmVintage")
					}),
					editsModalElements.camBtnCoolCinema = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #83c5be;",
						innerText: "🎬 " + (t("effectCoolCinema") || "Cool Cinema"),
						onclick: () => setCameraEffectLocal("coolCinema")
					}),
					editsModalElements.camBtnMatrix = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #00ff66;",
						innerText: "🟢 " + (t("effectMatrix") || "Matrix"),
						onclick: () => setCameraEffectLocal("matrix")
					}),
					editsModalElements.camBtnInverted = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #e0e0e0;",
						innerText: "🔲 " + (t("effectInverted") || "Negative"),
						onclick: () => setCameraEffectLocal("inverted")
					}),
					editsModalElements.camBtnGameboy = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #8bac0f;",
						innerText: "👾 " + (t("effectGameboy") || "Monatium Boy"),
						onclick: () => setCameraEffectLocal("gameboy")
					}),
					editsModalElements.camBtnBloodMoon = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ff4d4d;",
						innerText: "🩸 " + (t("effectBloodMoon") || "Blood Moon"),
						onclick: () => setCameraEffectLocal("bloodMoon")
					}),
					editsModalElements.camBtnSynthwave = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #e056fd;",
						innerText: "🔮 " + (t("effectSynthwave") || "Synthwave"),
						onclick: () => setCameraEffectLocal("synthwave")
					}),
					editsModalElements.camBtnUnderwater = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #22d3ee;",
						innerText: "🌊 " + (t("effectUnderwater") || "Aqua Fantasy"),
						onclick: () => setCameraEffectLocal("underwater")
					}),
					editsModalElements.camBtnGoldenHour = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #f59e0b;",
						innerText: "☀️ " + (t("effectGoldenHour") || "Golden Hour"),
						onclick: () => setCameraEffectLocal("goldenHour")
					}),
					editsModalElements.camBtnComicBook = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #f43f5e;",
						innerText: "💥 " + (t("effectComicBook") || "Comic Book"),
						onclick: () => setCameraEffectLocal("comicBook")
					}),
					editsModalElements.camBtnArctic = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #93c5fd;",
						innerText: "❄️ " + (t("effectArctic") || "Arctic Frost"),
						onclick: () => setCameraEffectLocal("arctic")
					}),
					editsModalElements.camBtnCosmic = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #c084fc;",
						innerText: "🌌 " + (t("effectCosmic") || "Cosmic Aurora"),
						onclick: () => setCameraEffectLocal("cosmic")
					}),
					editsModalElements.camBtnFilmNoir = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #e2e8f0;",
						innerText: "🕵️ " + (t("effectFilmNoir") || "Film Noir"),
						onclick: () => setCameraEffectLocal("filmNoir")
					}),
					editsModalElements.camBtnAcidTrip = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #a855f7;",
						innerText: "🍄 " + (t("effectAcidTrip") || "Acid Trip"),
						onclick: () => setCameraEffectLocal("acidTrip")
					}),
					editsModalElements.camBtnRadioactive = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #84cc16;",
						innerText: "☢️ " + (t("effectRadioactive") || "Radioactive"),
						onclick: () => setCameraEffectLocal("radioactive")
					}),
					editsModalElements.camBtnDeepFried = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #f97316;",
						innerText: "🍗 " + (t("effectDeepFried") || "Deep Fried"),
						onclick: () => setCameraEffectLocal("deepFried")
					}),
					editsModalElements.camBtnAlienAbduction = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #10b981;",
						innerText: "🛸 " + (t("effectAlienAbduction") || "Alien Abduction"),
						onclick: () => setCameraEffectLocal("alienAbduction")
					}),
					editsModalElements.camBtnXRay = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #38bdf8;",
						innerText: "💀 " + (t("effectXRay") || "X-Ray Vision"),
						onclick: () => setCameraEffectLocal("xRay")
					}),
					editsModalElements.camBtnThermal = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ef4444;",
						innerText: "🌡️ " + (t("effectThermal") || "Thermal Vision"),
						onclick: () => setCameraEffectLocal("thermal")
					}),
					editsModalElements.camBtnVirtualBoy = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #dc2626;",
						innerText: "🕶️ " + (t("effectVirtualBoy") || "Virtual Boy"),
						onclick: () => setCameraEffectLocal("virtualBoy")
					}),
					editsModalElements.camBtnEldritch = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #9333ea;",
						innerText: "👁️ " + (t("effectEldritch") || "Eldritch Void"),
						onclick: () => setCameraEffectLocal("eldritch")
					}),
					editsModalElements.camBtnHaunted = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #a3e635;",
						innerText: "👻 " + (t("effectHaunted") || "Paranormal Cam"),
						onclick: () => setCameraEffectLocal("haunted")
					}),
					editsModalElements.camBtnGlitch = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #06b6d4;",
						innerText: "⚡ " + (t("effectGlitch") || "Glitch Art"),
						onclick: () => setCameraEffectLocal("glitch")
					}),
					editsModalElements.camBtnKaleido = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #ec4899;",
						innerText: "🌈 " + (t("effectKaleido") || "Rainbow Prism"),
						onclick: () => setCameraEffectLocal("kaleido")
					}),
					editsModalElements.camBtnSupernova = buildElement("button", {
						className: "spkmod-panel-btn",
						style: "padding: 5px 2px; font-size: 9.5px; text-align: center; color: #fde047;",
						innerText: "💥 " + (t("effectSupernova") || "Supernova"),
						onclick: () => setCameraEffectLocal("supernova")
					})
				])
			])
		])
	])
);
if (lunHudElements.editsModal) {
	const modalW = lunHudElements.editsModal.offsetWidth || 440;
	lunHudElements.editsModal.style.left = Math.max(10, Math.round((window.innerWidth / 2) - (modalW / 2))) + "px";
	lunHudElements.editsModal.style.top = Math.max(10, Math.round(window.innerHeight * 0.15)) + "px";
	if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();
}
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.editsModal && lunPanelElements.editsModalTitle) {
		makeDraggable(lunHudElements.editsModal, [lunPanelElements.editsModalTitle]);
	}
}, 500);


document.body.appendChild(
	lunHudElements.patchNotesModal = buildElement("div", {
		id: "spkmod-patchnotes-modal",
		className: "hidden"
	}, [
		buildElement("div", { className: "spkmod-panel-cat", style: "justify-content: space-between;" }, [
			patchNotesModalElements.headerTitle = buildElement("span", {
				innerText: "📰 " + t("patchNotesHeader"),
				style: "font-weight: bold; font-size: 12px; cursor: move; user-select: none;"
			}),
			buildElement("span", {
				id: "spkmod-patchnotes-close",
				innerText: "✕",
				style: "cursor: pointer; padding: 0 4px;",
				onclick: _ => lunHudElements.patchNotesModal.classList.add("hidden")
			})
		]),
		patchNotesModalElements.contentContainer = buildElement("div", {
			style: "display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto; padding-right: 2px;"
		})
	])
);
setTimeout(() => {
	if (typeof makeDraggable === 'function' && lunHudElements.patchNotesModal && patchNotesModalElements.headerTitle) {
		makeDraggable(lunHudElements.patchNotesModal, [patchNotesModalElements.headerTitle]);
	}
}, 500);
