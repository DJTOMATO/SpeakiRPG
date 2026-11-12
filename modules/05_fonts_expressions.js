const SPKMOD_VALID_FONT_PRESETS = new Set([
	"default",
	"trickcalPop",
	"oneMobilePop",
	"dfpPop",
	"mochiyPop",
	"knBobohei",
	"serif",
	"rounded",
	"pixel",
	"monospace",
	"custom"
]);

var lunFontPreset = (window.localStorage && localStorage.getItem("spkmod-font-preset")) || "default";
if (!SPKMOD_VALID_FONT_PRESETS.has(lunFontPreset)) lunFontPreset = "default";
var lunCustomFont = (window.localStorage && localStorage.getItem("spkmod-custom-font")) || "";
var lunActiveFontStack = "";
var __spkmodFontRedrawTimer = null;

function sanitizeSpkmodCustomFont(raw) {
	if (!raw || typeof raw !== "string") return "";
	const cleaned = raw.slice(0, 200).replace(/[{};<>\\`\r\n]/g, "");
	const generics = new Set([
		"serif", "sans-serif", "monospace", "cursive", "fantasy",
		"system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded"
	]);
	const parts = cleaned.split(",").map(part => {
		const trimmed = part.trim().replace(/^['"]+|['"]+$/g, "").replace(/['"]/g, "").trim();
		if (!trimmed) return "";
		if (generics.has(trimmed.toLowerCase())) return trimmed.toLowerCase();
		return `"${trimmed}"`;
	}).filter(Boolean);
	if (!parts.length) return "";
	return parts.join(", ") + ", " + SPKMOD_EMOJI_FONT_FALLBACK + ", sans-serif";
}

function buildSpkmodFontStack(preset, customValue) {
	const lang = typeof spkmodLang === "string" ? spkmodLang : "en";
	switch (preset) {
		case "trickcalPop": {
			if (lang === "ja") {
				return `"SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkOneMobilePop", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
			}
			if (lang === "ko") {
				return `"SpkOneMobilePop", "SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
			}
			if (lang === "zh-TW" || lang === "zh-CN") {
				return `"SpkKNBobohei", "SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkOneMobilePop", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
			}
			return `"SpkOneMobilePop", "SpkMochiyPop", "Mochiy Pop One", "SpkDFPPop1W9", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		}
		case "oneMobilePop":
			return `"SpkOneMobilePop", "SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		case "dfpPop":
			return `"SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkOneMobilePop", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		case "mochiyPop":
			return `"SpkMochiyPop", "Mochiy Pop One", "SpkDFPPop1W9", "SpkOneMobilePop", "SpkKNBobohei", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		case "knBobohei":
			return `"SpkKNBobohei", "SpkDFPPop1W9", "SpkMochiyPop", "Mochiy Pop One", "SpkOneMobilePop", ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		case "serif": {
			let cjkOrder = `"Noto Serif JP", "Noto Serif KR", "Noto Serif SC", "Noto Serif TC", "Noto Serif HK", "Yu Mincho", "Hiragino Mincho ProN", "Batang", "PMingLiU", "SimSun"`;
			if (lang === "ko") {
				cjkOrder = `"Noto Serif KR", "Noto Serif JP", "Noto Serif TC", "Noto Serif SC", "Noto Serif HK", "Batang", "Yu Mincho", "Hiragino Mincho ProN", "PMingLiU", "SimSun"`;
			} else if (lang === "zh-TW") {
				cjkOrder = `"Noto Serif TC", "Noto Serif HK", "Noto Serif JP", "Noto Serif KR", "Noto Serif SC", "PMingLiU", "Songti TC", "Yu Mincho", "Batang", "SimSun"`;
			} else if (lang === "zh-CN") {
				cjkOrder = `"Noto Serif SC", "Noto Serif TC", "Noto Serif HK", "Noto Serif JP", "Noto Serif KR", "SimSun", "Songti SC", "PMingLiU", "Yu Mincho", "Batang"`;
			}
			return `${cjkOrder}, "Noto Serif", Georgia, ${SPKMOD_EMOJI_FONT_FALLBACK}, serif`;
		}
		case "rounded": {
			let roundedOrder = `"M PLUS Rounded 1c", "Jua", "ZCOOL KuaiLe", "Hiragino Maru Gothic ProN", "Yu Gothic UI", "Malgun Gothic", "Microsoft JhengHei"`;
			if (lang === "ko") {
				roundedOrder = `"Jua", "M PLUS Rounded 1c", "ZCOOL KuaiLe", "Malgun Gothic", "Apple SD Gothic Neo", "Yu Gothic UI", "Microsoft JhengHei"`;
			} else if (lang === "zh-TW" || lang === "zh-CN") {
				roundedOrder = `"ZCOOL KuaiLe", "M PLUS Rounded 1c", "Jua", "Microsoft JhengHei", "PingFang TC", "PingFang SC", "Yu Gothic UI", "Malgun Gothic"`;
			}
			return `${roundedOrder}, ${SPKMOD_EMOJI_FONT_FALLBACK}, sans-serif`;
		}
		case "pixel": {
			let pixelOrder = `"DotGothic16", "SpkDungGeunMo", "Silkscreen", "MS Gothic", "GulimChe"`;
			if (lang === "ko") {
				pixelOrder = `"SpkDungGeunMo", "DotGothic16", "Silkscreen", "GulimChe", "MS Gothic"`;
			} else if (lang !== "ja" && lang !== "zh-TW" && lang !== "zh-CN") {
				pixelOrder = `"Silkscreen", "SpkDungGeunMo", "DotGothic16", "Consolas", "MS Gothic"`;
			}
			return `${pixelOrder}, ${SPKMOD_EMOJI_FONT_FALLBACK}, monospace`;
		}
		case "monospace":
			return `"JetBrains Mono", Consolas, "SFMono-Regular", "D2Coding", "MS Gothic", "PMingLiU", "SimSun", ${SPKMOD_EMOJI_FONT_FALLBACK}, monospace`;
		case "custom":
			return sanitizeSpkmodCustomFont(customValue);
		default:
			return "";
	}
}

function getSpkmodGoogleFontUrl(preset) {
	switch (preset) {
		case "trickcalPop":
		case "oneMobilePop":
		case "dfpPop":
		case "mochiyPop":
		case "knBobohei":
			return "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap";
		case "serif":
			return "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Serif+KR:wght@400;700&family=Noto+Serif+SC:wght@400;700&family=Noto+Serif+TC:wght@400;700&family=Noto+Serif+HK:wght@400;700&display=swap";
		case "rounded":
			return "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Jua&family=ZCOOL+KuaiLe&display=swap";
		case "pixel":
			return "https://fonts.googleapis.com/css2?family=DotGothic16&family=Silkscreen:wght@400;700&display=swap";
		case "monospace":
			return "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap";
		default:
			return "";
	}
}

function ensureSpkmodFontResources(preset) {
	if (typeof document === "undefined" || !document.head) return;

	const needsPopFaces = (preset === "trickcalPop" || preset === "oneMobilePop" || preset === "dfpPop" || preset === "mochiyPop" || preset === "knBobohei");
	const needsPixelFace = (preset === "pixel");
	let faceStyle = document.getElementById("spkmod-font-faces");

	if (!needsPopFaces && !needsPixelFace) {
		if (faceStyle) faceStyle.remove();
	} else {
		if (!faceStyle) {
			faceStyle = document.createElement("style");
			faceStyle.id = "spkmod-font-faces";
			document.head.appendChild(faceStyle);
		}
		let css = "";
		if (needsPopFaces) {
			css += `
				@font-face {
					font-family: "SpkOneMobilePop";
					src: local("ONE Mobile POP"),
					     local("ONE Mobile POP OTF"),
					     local("ONEMobilePOP"),
					     url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-POP.woff") format("woff"),
					     url("${SPKMOD_REPO_FONTS_BASE}ONE%20Mobile%20POP.ttf") format("truetype");
					font-display: swap;
				}
				@font-face {
					font-family: "SpkDFPPop1W9";
					src: local("DFPop1-W9"),
					     local("DFPPop1-W9"),
					     local("DFP-Pop1-W9"),
					     local("ＤＦＰ人気体W9"),
					     local("DFP人気体W9"),
					     url("${SPKMOD_REPO_FONTS_BASE}DFP-Pop1-W9.ttf") format("truetype");
					font-display: swap;
				}
				@font-face {
					font-family: "SpkMochiyPop";
					src: local("MochiyPopOne-ExtraBold"),
					     url("${SPKMOD_REPO_FONTS_BASE}MochiyPopOne-OTF-ExtraBold.otf") format("opentype"),
					     local("Mochiy Pop One"),
					     local("MochiyPopOne-Regular");
					font-display: swap;
				}
				@font-face {
					font-family: "SpkKNBobohei";
					src: local("KNBobohei-Bold"),
					     local("KNBobohei Bold"),
					     local("KN波波黑-Bold"),
					     local("KN波波黑 Bold"),
					     url("${SPKMOD_REPO_FONTS_BASE}KNBobohei-Bold.ttf") format("truetype");
					font-display: swap;
				}
			`;
		}
		if (needsPixelFace) {
			css += `
				@font-face {
					font-family: "SpkDungGeunMo";
					src: local("DungGeunMo"),
					     local("둥근모꼴"),
					     url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff") format("woff");
					font-display: swap;
				}
			`;
		}
		if (faceStyle.textContent !== css) {
			faceStyle.textContent = css;
		}
	}

	const gFontUrl = getSpkmodGoogleFontUrl(preset);
	let linkEl = document.getElementById("spkmod-google-font-link");
	if (!gFontUrl) {
		if (linkEl) linkEl.remove();
	} else {
		if (!linkEl) {
			linkEl = document.createElement("link");
			linkEl.id = "spkmod-google-font-link";
			linkEl.rel = "stylesheet";
			document.head.appendChild(linkEl);
		}
		if (linkEl.href !== gFontUrl) {
			linkEl.href = gFontUrl;
		}
	}
}

function scheduleSpkmodCanvasFontRefresh() {
	if (__spkmodFontRedrawTimer) clearTimeout(__spkmodFontRedrawTimer);
	__spkmodFontRedrawTimer = setTimeout(() => {
		__spkmodFontRedrawTimer = null;
		if (typeof window.spkmodForceNametagRedraw === "function") {
			window.spkmodForceNametagRedraw();
		}
		if (typeof drawZoneMap === "function" && typeof document !== "undefined") {
			const mapModal = document.getElementById("spkmod-map-modal");
			if (mapModal && !mapModal.classList.contains("hidden")) {
				try { drawZoneMap(); } catch (_) {}
			}
		}
	}, 120);
}

function hookSpkmodCanvasFontOnce() {
	if (typeof window === "undefined" || window.__spkmodCanvasFontHooked) return;
	if (typeof CanvasRenderingContext2D === "undefined" || !CanvasRenderingContext2D.prototype) return;
	const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
	if (!desc || typeof desc.set !== "function" || typeof desc.get !== "function") return;

	Object.defineProperty(CanvasRenderingContext2D.prototype, "font", {
		configurable: true,
		enumerable: desc.enumerable,
		get: function () {
			return desc.get.call(this);
		},
		set: function (value) {
			if (lunActiveFontStack && typeof value === "string") {
				const m = value.match(/^(.*?\b\d+(?:\.\d+)?px(?:\s*\/\s*[^\s]+)?)\s+(.+)$/i);
				if (m) {
					return desc.set.call(this, `${m[1]} ${lunActiveFontStack}`);
				}
			}
			return desc.set.call(this, value);
		}
	});
	window.__spkmodCanvasFontHooked = true;

	if (typeof document !== "undefined" && document.fonts && typeof document.fonts.addEventListener === "function") {
		document.fonts.addEventListener("loadingdone", () => {
			if (lunActiveFontStack) {
				scheduleSpkmodCanvasFontRefresh();
			}
		});
	}
}

function getSpkmodActiveFontStack() {
	return lunActiveFontStack;
}

function applySpkmodFont(preset, customValue, persist = true) {
	if (preset !== undefined) {
		lunFontPreset = SPKMOD_VALID_FONT_PRESETS.has(preset) ? preset : "default";
	}
	if (customValue !== undefined) {
		lunCustomFont = String(customValue);
	}
	if (persist && typeof window !== "undefined" && window.localStorage) {
		localStorage.setItem("spkmod-font-preset", lunFontPreset);
		localStorage.setItem("spkmod-custom-font", lunCustomFont);
	}

	ensureSpkmodFontResources(lunFontPreset);
	lunActiveFontStack = buildSpkmodFontStack(lunFontPreset, lunCustomFont);

	if (typeof updateDynamicStyles === "function") {
		updateDynamicStyles();
	}
	scheduleSpkmodCanvasFontRefresh();

	if (lunActiveFontStack && typeof document !== "undefined" && document.fonts && typeof document.fonts.load === "function") {
		try {
			document.fonts.load(`bold 24px ${lunActiveFontStack}`, "Speaki 스피키 スピキ 測試 123").then(() => {
				scheduleSpkmodCanvasFontRefresh();
			}).catch(() => {});
		} catch (_) {}
	}
}

window.getSpkmodActiveFontStack = getSpkmodActiveFontStack;
window.applySpkmodFont = applySpkmodFont;
hookSpkmodCanvasFontOnce();
applySpkmodFont(lunFontPreset, lunCustomFont, false);
var lunChromaKeyColor = (window.localStorage && localStorage.getItem("spkmod-chroma-key")) || "none";
var lunChromaFloorShape = (window.localStorage && localStorage.getItem("spkmod-chroma-floor-shape")) || "off";
var lunChromaFloorScale = parseFloat((window.localStorage && localStorage.getItem("spkmod-chroma-floor-scale")) || "1.0") || 1.0;
var lunHideAllOtherPlayers = (window.localStorage && localStorage.getItem("spkmod-hide-all-players") === "true") || false;
var lunSolitudeWhitelist = (window.localStorage && localStorage.getItem("spkmod-solitude-whitelist")) || "";
let lunSolitudeWhitelistSet = new Set(lunSolitudeWhitelist.split(",").map(name => name.trim().toLocaleLowerCase()).filter(Boolean));
var lunLockedFacialExpression = (window.localStorage && localStorage.getItem("spkmod-locked-facial-expression")) || "none";
var lunAllPlayersFacialExpression = "none";
var lunTargetFacialExpressions = new Map();
const LUN_FACIAL_EXPR_EMOJIS = {
	open_confident: "😏",
	open_curious: "🥺",
	closed_lash_smile: "☺️",
	closed_smile: "😄",
	open_gentle: "😊",
	closed_tongue_2: "😜",
	open_teasing_tongue: "😛",
	open_worried_tongue: "😨"
};
try { if (typeof window !== "undefined" && window.localStorage) localStorage.removeItem("spkmod-local-skin"); } catch (_) {}

var lunSpeedometerEnabled = window.localStorage ? (localStorage.getItem("spkmod-speedometer") !== "false") : true;

const LUN_CHROMA_COLORS = {
	green: 0x00FF00,
	blue: 0x0000FF,
	red: 0xFF0000,
	magenta: 0xFF00FF,
	black: 0x000000,
	white: 0xFFFFFF,
	midnight: 0x0A0C24,
	sunset: 0x3B1538,
	cyber: 0x051D28,
	yellow: 0xFFFF00,
	orange: 0xFF6600,
	pink: 0xFF69B4,
	cyan: 0x00E5FF,
	mint: 0x00E676,
	purple: 0x5B21B6,
	amber: 0xD97706,
	crimson: 0x881337,
	slate: 0x475569,
	sepia: 0x451A03
};

if (lunChromaKeyColor !== "none" && !LUN_CHROMA_COLORS[lunChromaKeyColor]) {
	lunChromaKeyColor = "none";
}

function applyChromaKeyColor(colorKey, allowToggle = false, silent = false) {
	const prevColor = lunChromaKeyColor;
	if (allowToggle && colorKey !== "none" && prevColor === colorKey) {
		colorKey = "none";
	}
	const nextColor = colorKey || "none";
	const changed = (prevColor !== nextColor);
	lunChromaKeyColor = nextColor;
	if (changed && window.localStorage) {
		localStorage.setItem("spkmod-chroma-key", lunChromaKeyColor);
	}
	if (!silent && changed && typeof chatLog === "function") {
		chatLog("Chroma Skybox: " + (lunChromaKeyColor === "none" ? "OFF (DEFAULT)" : lunChromaKeyColor.toUpperCase()));
	}
	const scene = gameState?.scene;
	if (typeof applyChromaFloorPad === "function" && lunChromaFloorShape !== "off") {
		applyChromaFloorPad(undefined, undefined, true);
	}
	if (!scene) return;

	const hex = LUN_CHROMA_COLORS[lunChromaKeyColor];

	if (hex !== undefined) {
		if (scene.__origBackground === undefined) {
			scene.__origBackground = scene.background || null;
		}
		if (scene.background && typeof scene.background.setHex === "function") {
			scene.background.setHex(hex);
		} else if (scene.children) {
			const anyMesh = scene.children.find(c => c?.material?.color);
			if (anyMesh && anyMesh.material?.color?.constructor) {
				scene.background = new anyMesh.material.color.constructor(hex);
			}
		}

		if (scene.fog) {
			if (scene.__origFogColor === undefined) {
				scene.__origFogColor = scene.fog.color ? scene.fog.color.getHex() : null;
			}
			if (scene.fog.color && typeof scene.fog.color.setHex === "function") {
				scene.fog.color.setHex(hex);
			}
		}

		const handleMesh = (obj) => {
			if (!obj) return;
			if (obj.renderOrder === -1) {
				if (obj.geometry && (obj.geometry.type === "SphereGeometry" || obj.geometry.parameters?.radius === 400 || obj.material?.side === 1)) {
					if (obj.material) {
						if (obj.material.__origMap === undefined) obj.material.__origMap = obj.material.map;
						if (obj.material.__origColor === undefined) obj.material.__origColor = obj.material.color ? obj.material.color.getHex() : 0xffffff;
						if (obj.material.map !== null) {
							obj.material.map = null;
							obj.material.needsUpdate = true;
						}
						if (obj.material.color && typeof obj.material.color.setHex === "function") {
							if (obj.material.color.getHex() !== hex) {
								obj.material.color.setHex(hex);
								obj.material.needsUpdate = true;
							}
						}
					}
					obj.visible = true;
				} else if (obj.geometry && (obj.geometry.type === "CircleGeometry" || obj.geometry.parameters?.radius === 350)) {
					if (obj.__origVisible === undefined) obj.__origVisible = obj.visible;
					obj.visible = false;
				} else if (obj.isInstancedMesh || (obj.geometry && obj.geometry.parameters?.radius === 1)) {
					if (obj.__origVisible === undefined) obj.__origVisible = obj.visible;
					obj.visible = false;
				}
			} else if (obj.name === "racing-environment" || (obj.children && obj.children.some(c => c.renderOrder === -1))) {
				if (obj.children) {
					for (const sub of obj.children) {
						handleMesh(sub);
					}
				}
			}
		};

		if (scene.children) {
			for (const child of scene.children) {
				handleMesh(child);
			}
		}
	} else {
		if (scene.__origBackground !== undefined) {
			scene.background = scene.__origBackground;
		}
		if (scene.fog && scene.__origFogColor !== undefined && scene.__origFogColor !== null) {
			if (scene.fog.color && typeof scene.fog.color.setHex === "function") {
				scene.fog.color.setHex(scene.__origFogColor);
			}
		}

		const restoreMesh = (obj) => {
			if (!obj) return;
			if (obj.renderOrder === -1) {
				if (obj.material && obj.material.__origMap !== undefined) {
					obj.material.map = obj.material.__origMap;
					if (obj.material.__origColor !== undefined && obj.material.color && typeof obj.material.color.setHex === "function") {
						obj.material.color.setHex(obj.material.__origColor);
					}
					obj.material.needsUpdate = true;
				}
				if (obj.__origVisible !== undefined) {
					obj.visible = obj.__origVisible;
				}
			} else if (obj.name === "racing-environment" || (obj.children && obj.children.some(c => c.renderOrder === -1))) {
				if (obj.children) {
					for (const sub of obj.children) {
						restoreMesh(sub);
					}
				}
			}
		};

		if (scene.children) {
			for (const child of scene.children) {
				restoreMesh(child);
			}
		}
	}
}

function applyChromaFloorPad(shape, scale, silent = false) {
	if (shape !== undefined && shape !== null) {
		lunChromaFloorShape = shape;
		if (window.localStorage) localStorage.setItem("spkmod-chroma-floor-shape", lunChromaFloorShape);
	}
	if (scale !== undefined && scale !== null) {
		lunChromaFloorScale = parseFloat(scale) || 1.0;
		if (window.localStorage) localStorage.setItem("spkmod-chroma-floor-scale", String(lunChromaFloorScale));
	}

	const playerContainer = gameState?.playerContainer;
	if (!playerContainer) return;

	let mesh = playerContainer.getObjectByName("spkmod_chroma_floor_pad");

	if (lunChromaFloorShape === "off") {
		if (mesh) mesh.visible = false;
		return;
	}

	const THREE = window.THREE;
	if (!THREE) {
		if (typeof spkmodEnsureThree === "function") {
			spkmodEnsureThree().then(() => applyChromaFloorPad(undefined, undefined, silent));
		}
		return;
	}

	const hex = (typeof LUN_CHROMA_COLORS !== "undefined" && typeof lunChromaKeyColor !== "undefined" && LUN_CHROMA_COLORS[lunChromaKeyColor] !== undefined)
		? LUN_CHROMA_COLORS[lunChromaKeyColor]
		: 0x00ff00;

	function buildGeometry(sName, sc) {
		const s = sc;
		switch (sName) {
			case "full":
				return new THREE.PlaneGeometry(120 * s, 120 * s);
			case "square":
				return new THREE.PlaneGeometry(2.5 * s, 2.5 * s);
			case "wide":
				return new THREE.PlaneGeometry(4.5 * s, 2.5 * s);
			case "short":
				return new THREE.PlaneGeometry(2.5 * s, 1.4 * s);
			case "circle":
				return new THREE.CircleGeometry(1.6 * s, 48);
			case "star": {
				const shapePath = new THREE.Shape();
				const points = 5;
				const outerR = 2.0 * s;
				const innerR = 0.85 * s;
				for (let i = 0; i < points * 2; i++) {
					const r = (i % 2 === 0) ? outerR : innerR;
					const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
					const x = Math.cos(a) * r;
					const y = Math.sin(a) * r;
					if (i === 0) shapePath.moveTo(x, y);
					else shapePath.lineTo(x, y);
				}
				shapePath.closePath();
				return new THREE.ShapeGeometry(shapePath);
			}
			default:
				return new THREE.PlaneGeometry(2.5 * s, 2.5 * s);
		}
	}
	
	const geometryKey = `${lunChromaFloorShape}:${lunChromaFloorScale}`;

	if (!mesh) {
    	const mat = new THREE.MeshBasicMaterial({
        	color: hex,
        	side: THREE.DoubleSide,
        	depthWrite: true
    	});

    	mesh = new THREE.Mesh(buildGeometry(lunChromaFloorShape, lunChromaFloorScale), mat);
    	mesh.name = "spkmod_chroma_floor_pad";
    	mesh.rotation.x = -Math.PI / 2;
    	mesh.position.set(0, 0.02, 0);
    	mesh.userData.spkmodGeometryKey = geometryKey;

    	playerContainer.add(mesh);
	} else {
    	mesh.visible = true;

    	if (!mesh.geometry || mesh.userData.spkmodGeometryKey !== geometryKey) {
        	const oldGeometry = mesh.geometry;

        	mesh.geometry = buildGeometry(lunChromaFloorShape, lunChromaFloorScale);
        	mesh.userData.spkmodGeometryKey = geometryKey;

        	if (oldGeometry) oldGeometry.dispose();
    	}

    	if (mesh.material && typeof mesh.material.color?.setHex === "function") {
        	mesh.material.color.setHex(hex);
    	}
	}
}

function maintainChromaKeyColor() {
	if (lunChromaKeyColor && lunChromaKeyColor !== "none") {
		applyChromaKeyColor(lunChromaKeyColor, false, true);
	}
	if (lunChromaFloorShape && lunChromaFloorShape !== "off") {
		applyChromaFloorPad(undefined, undefined, true);
	}
}

function setHideAllOtherPlayers(enabled) {
	lunHideAllOtherPlayers = !!enabled;
	if (window.localStorage) {
		localStorage.setItem("spkmod-hide-all-players", lunHideAllOtherPlayers ? "true" : "false");
	}
	updateKnownBotVisibility();
	if (typeof updateLocalEditsUI === "function") {
		updateLocalEditsUI();
	}
	if (typeof chatLog === "function") {
		chatLog("Solitude Mode: " + (lunHideAllOtherPlayers ? "ON" : "OFF"));
	}
}

function getSolitudeWhitelistNames() {
    return [...lunSolitudeWhitelistSet];
}

function isSolitudeWhitelisted(name) {
    if (!name || typeof name !== "string") return false;

    const clean = name.trim().toLocaleLowerCase();

    if (!clean) return false;

    return lunSolitudeWhitelistSet.has(clean);
}

function setSolitudeWhitelist(namesStr) {
    lunSolitudeWhitelist = typeof namesStr === "string" ? namesStr : "";
    lunSolitudeWhitelistSet = new Set(lunSolitudeWhitelist.split(",").map(name => name.trim().toLocaleLowerCase()).filter(Boolean));

    if (window.localStorage) {
        localStorage.setItem("spkmod-solitude-whitelist", lunSolitudeWhitelist);
    }

	if (typeof updateKnownBotVisibility === "function") updateKnownBotVisibility();
}

const spkmodFaceExpressionState = new WeakMap();
const spkmodFaceExpressionHooked = new WeakSet();
const spkmodFaceExpressionCacheSafe = new WeakSet();

function hookSpkmodFaceExpression(fe) {
    if (!fe || typeof fe !== "object") return false;

    if (spkmodFaceExpressionHooked.has(fe)) {
        return spkmodFaceExpressionCacheSafe.has(fe);
    }

    spkmodFaceExpressionHooked.add(fe);

    const originalSet = fe.setOverrideExpression;
    const originalEnd = fe.endOverride;

    let setWrapped = false;
    let endWrapped = false;

    if (typeof originalSet === "function") {
        const wrappedSet = function(expr, ...args) {
            const result = originalSet.call(this, expr, ...args);
            spkmodFaceExpressionState.set(this, expr);
            return result;
        };

        try {
            fe.setOverrideExpression = wrappedSet;
            setWrapped = fe.setOverrideExpression === wrappedSet;
        } catch (_) {}
    }

    if (typeof originalEnd === "function") {
        const wrappedEnd = function(...args) {
            const result = originalEnd.apply(this, args);
            spkmodFaceExpressionState.set(this, null);
            return result;
        };

        try {
            fe.endOverride = wrappedEnd;
            endWrapped = fe.endOverride === wrappedEnd;
        } catch (_) {}
    }

    if (setWrapped && endWrapped) {
        spkmodFaceExpressionCacheSafe.add(fe);
    }

    return spkmodFaceExpressionCacheSafe.has(fe);
}

function setAvatarFacialExpression(avatar, exprKey) {
    const fe = avatar?.faceExpression;

    if (!fe) return false;

    const desired = !exprKey || exprKey === "none" ? null : exprKey;
    const cacheSafe = hookSpkmodFaceExpression(fe);

    if (cacheSafe && spkmodFaceExpressionState.has(fe) && spkmodFaceExpressionState.get(fe) === desired) {
        return true;
    }

    if (desired === null) {
        if (typeof fe.endOverride === "function") {
            fe.endOverride();
        }
    } else {
        if (typeof fe.beginOverride === "function") {
            fe.beginOverride();
        }

        if (typeof fe.setOverrideExpression === "function") {
            fe.setOverrideExpression(desired);
        }
    }

    return true;
}

function getRemotePlayerTargetExpression(player) {
	if (!player || !player.info || !lunTargetFacialExpressions || lunTargetFacialExpressions.size === 0) return null;
	const curName = (player.info.name || "").trim().toLowerCase();
	const origName = (player.info.__spkmodOrigName || "").trim().toLowerCase();
	if (curName && lunTargetFacialExpressions.has(curName)) return lunTargetFacialExpressions.get(curName);
	if (origName && lunTargetFacialExpressions.has(origName)) return lunTargetFacialExpressions.get(origName);
	return null;
}

function applyLockedFacialExpression(exprKey) {
	lunLockedFacialExpression = exprKey || "none";
	if (window.localStorage) {
		localStorage.setItem("spkmod-locked-facial-expression", lunLockedFacialExpression);
	}
	setAvatarFacialExpression(gameState?.localAvatar, lunLockedFacialExpression);
	if (typeof updateLocalEditsUI === "function") {
		updateLocalEditsUI();
	}
}

function applyAllPlayersFacialExpression(exprKey) {
	const selected = (typeof exprKey === "string" ? exprKey : lunLockedFacialExpression) || "none";
	if (selected === "none" || lunAllPlayersFacialExpression === selected) {
		lunAllPlayersFacialExpression = "none";
	} else {
		lunAllPlayersFacialExpression = selected;
	}
	if (gameState?.remotePlayers?.remotePlayers) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			const targetExpr = getRemotePlayerTargetExpression(player);
			if (targetExpr) {
				setAvatarFacialExpression(player?.avatar, targetExpr);
			} else {
				setAvatarFacialExpression(player?.avatar, lunAllPlayersFacialExpression);
			}
		}
	}
	if (typeof updateLocalEditsUI === "function") {
		updateLocalEditsUI();
	}
}

function applyTargetPlayerFacialExpression(targetName, exprKey) {
	const cleanLower = String(targetName || "").trim().toLowerCase();
	if (!cleanLower) return 0;
	const selected = (typeof exprKey === "string" ? exprKey : lunLockedFacialExpression) || "none";

	const localName = (
		(typeof gameState !== "undefined" && (gameState?.myPlayerName || gameState?.myStat?.name)) ||
		document.querySelector(".sr-player-card__name")?.innerText ||
		""
	).trim().toLowerCase();
	if (localName && localName === cleanLower) {
		applyLockedFacialExpression(selected);
		return 1;
	}

	if (selected === "none") {
		lunTargetFacialExpressions.delete(cleanLower);
	} else {
		lunTargetFacialExpressions.set(cleanLower, selected);
	}

	let matched = 0;
	if (gameState?.remotePlayers?.remotePlayers) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			const curName = (player?.info?.name || "").trim().toLowerCase();
			const origName = (player?.info?.__spkmodOrigName || "").trim().toLowerCase();
			if (curName === cleanLower || origName === cleanLower) {
				if (selected === "none") {
					if (curName) lunTargetFacialExpressions.delete(curName);
					if (origName) lunTargetFacialExpressions.delete(origName);
					setAvatarFacialExpression(player?.avatar, lunAllPlayersFacialExpression || "none");
				} else {
					setAvatarFacialExpression(player?.avatar, selected);
				}
				matched++;
			}
		}
	}

	if (typeof updateLocalEditsUI === "function") {
		updateLocalEditsUI();
	}
	return matched;
}

function resetRemoteFacialExpressions() {
	lunAllPlayersFacialExpression = "none";
	lunTargetFacialExpressions.clear();
	if (gameState?.remotePlayers?.remotePlayers) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			setAvatarFacialExpression(player?.avatar, "none");
		}
	}
	if (typeof updateLocalEditsUI === "function") {
		updateLocalEditsUI();
	}
}

function maintainLockedFacialExpression() {
	if (lunLockedFacialExpression && lunLockedFacialExpression !== "none") {
		setAvatarFacialExpression(gameState?.localAvatar, lunLockedFacialExpression);
	}
	const hasAll = lunAllPlayersFacialExpression && lunAllPlayersFacialExpression !== "none";
	const hasTargets = lunTargetFacialExpressions && lunTargetFacialExpressions.size > 0;
	if ((hasAll || hasTargets) && gameState?.remotePlayers?.remotePlayers) {
		for (const player of gameState.remotePlayers.remotePlayers.values()) {
			const targetExpr = hasTargets ? getRemotePlayerTargetExpression(player) : null;
			const exprToApply = targetExpr || (hasAll ? lunAllPlayersFacialExpression : null);
			if (exprToApply && exprToApply !== "none") {
				setAvatarFacialExpression(player?.avatar, exprToApply);
			}
		}
	}
}

function toggleStatsModal() {
    if (!lunHudElements.statsModal) return;
    const isClosed = lunHudElements.statsModal.classList.contains("hidden");
    if (isClosed) {
        positionModalNicely(lunHudElements.statsModal);
        lunHudElements.statsModal.classList.remove("hidden");
        ensureFpsLoop();
        if (!lunMinigameStatus) {
            fetchMinigameStatus();
        }
        updateStatsModalLive();
    } else {
        lunHudElements.statsModal.classList.add("hidden");
    }
}

function resetSessionStats() {
	window._lunSessionStartTime = Date.now();
	if (typeof gameState !== 'undefined' && gameState?.myStat?.exp !== undefined) {
		window._lunSessionStartExp = gameState.myStat.exp;
	}
	lunSessionStartGold = lunLastGold;
	lunSessionStartElif = lunLastElif;
	lunSessionStartSpkCoin = lunLastSpkCoin;
	resetExpTracker();
	if (typeof chatLog === 'function') {
		chatLog(t("statsResetConfirm"));
	}
	updateStatsModalLive();
}

function updateStatsModalLive() {
	if (!lunHudElements.statsModal || lunHudElements.statsModal.classList.contains("hidden")) return;

	if (statsModalElements.headerTitle) setText(statsModalElements.headerTitle, "⏱️ " + t("statsHeader"));
	if (statsModalElements.sessionTimeLabel) setText(statsModalElements.sessionTimeLabel, "⏱️ " + t("statsSessionTime"));
	if (statsModalElements.pingLabel) setText(statsModalElements.pingLabel, "📶 " + t("statsPing"));
	if (statsModalElements.dailyResetLabel) setText(statsModalElements.dailyResetLabel, "🌅 " + t("statsDailyReset"));
	if (statsModalElements.minigameLabel) setText(statsModalElements.minigameLabel, "🎃 " + t("statsMinigamePlays"));
	if (statsModalElements.expGainedLabel) setText(statsModalElements.expGainedLabel, "⭐ " + t("statsExpGained"));
	if (statsModalElements.expRateLabel) setText(statsModalElements.expRateLabel, "📈 " + t("statsExpPerHour"));
	if (statsModalElements.timeToLevelLabel) setText(statsModalElements.timeToLevelLabel, "⏳ " + t("statsTimeToNextLevel"));
	if (statsModalElements.currencyLabel) setText(statsModalElements.currencyLabel, "💰 " + t("statsCurrency"));
	if (statsModalElements.goldGainedLabel) setText(statsModalElements.goldGainedLabel, "💰 " + t("statsGoldGained"));
	if (statsModalElements.elifGainedLabel) setText(statsModalElements.elifGainedLabel, "💎 " + t("statsElifGained"));
	if (statsModalElements.spkCoinGainedLabel) setText(statsModalElements.spkCoinGainedLabel, "🟣 " + (t("statsSpkCoinGained") || "Speaki Coin Gained"));
	if (statsModalElements.resetBtn) setText(statsModalElements.resetBtn, "🔄 " + t("statsResetBtn"));

	if (!window._lunSessionStartTime) {
		window._lunSessionStartTime = Date.now();
	}
	const elapsedMs = Math.max(0, Date.now() - window._lunSessionStartTime);
	const totalSec = Math.floor(elapsedMs / 1000);
	const sHours = Math.floor(totalSec / 3600);
	const sMins = Math.floor((totalSec % 3600) / 60);
	const sSecs = totalSec % 60;
	const timeStr = `${sHours.toString().padStart(2, '0')}:${sMins.toString().padStart(2, '0')}:${sSecs.toString().padStart(2, '0')}`;
	if (statsModalElements.sessionTimeVal) {
		setText(statsModalElements.sessionTimeVal, timeStr);
	}

	if (statsModalElements.pingVal) {
		const ping = typeof lunCurrentPing !== 'undefined' ? lunCurrentPing : "--";
		const pingNum = Number(ping);
		let pingColor = "#4ade80";
		if (isNaN(pingNum)) {
			pingColor = "#aaa";
		} else if (pingNum > 250) {
			pingColor = "#f87171";
		} else if (pingNum > 130) {
			pingColor = "#fbbf24";
		}
		statsModalElements.pingVal.innerText = `${ping} ms`;
		statsModalElements.pingVal.style.color = pingColor;
	}
	if (statsModalElements.fpsVal) {
		statsModalElements.fpsVal.innerText = `${typeof lunCurrentFps !== 'undefined' ? lunCurrentFps : "--"} FPS`;
	}

	if (statsModalElements.dailyResetVal) {
		const nowUtc = new Date();
		const kstOffset = 9 * 60 * 60 * 1000;
		const kstNow = new Date(nowUtc.getTime() + kstOffset);
		const kstNextMidnight = new Date(kstNow);
		kstNextMidnight.setUTCHours(24, 0, 0, 0);
		const diffMs = Math.max(0, kstNextMidnight.getTime() - kstNow.getTime());
		const diffTotalSeconds = Math.floor(diffMs / 1000);
		const hours = Math.floor(diffTotalSeconds / 3600);
		const minutes = Math.floor((diffTotalSeconds % 3600) / 60);
		const seconds = diffTotalSeconds % 60;
		statsModalElements.dailyResetVal.innerText = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
	}

	if (statsModalElements.minigameVal) {
		if (lunMinigameStatus) {
			if (lunMinigameStatus.isActive) {
				const remaining = lunMinigameStatus.remainingPlaysToday ?? 0;
				const cap = lunMinigameStatus.dailyCapPlays ?? 10;
				statsModalElements.minigameVal.innerText = `${remaining} / ${cap}`;
				statsModalElements.minigameVal.style.color = remaining > 0 ? "#4ade80" : "#f87171";
			} else {
				statsModalElements.minigameVal.innerText = t("minigameTrackerInactive");
				statsModalElements.minigameVal.style.color = "#aaa";
			}
		} else {
			statsModalElements.minigameVal.innerText = "-- / --";
			statsModalElements.minigameVal.style.color = "#aaa";
		}
	}

	const myStat = (typeof gameState !== 'undefined' && gameState?.myStat) ? gameState.myStat : null;
	const currentExp = myStat?.exp ?? 0;
	const maxExp = myStat?.maxExp ?? 1;
	const currentLevel = myStat?.level ?? 1;

	if (window._lunSessionStartExp === undefined || window._lunSessionStartExp === null) {
		window._lunSessionStartExp = currentExp;
	}

	const expPct = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));
	if (statsModalElements.levelProgressVal) {
		statsModalElements.levelProgressVal.innerText = `Lv. ${currentLevel} (${expPct.toFixed(1)}%)`;
	}
	if (statsModalElements.levelExpNumbers) {
		statsModalElements.levelExpNumbers.innerText = `${currentExp.toLocaleString()} / ${maxExp.toLocaleString()}`;
	}
	if (statsModalElements.levelProgressBar) {
		statsModalElements.levelProgressBar.style.width = `${expPct.toFixed(1)}%`;
	}

	const startExp = window._lunSessionStartExp ?? currentExp;
	const effectiveCurrentExp = currentExp - (window.lunExpTrackerIgnoredExp || 0);
	const expGained = Math.max(0, effectiveCurrentExp - startExp);
	if (statsModalElements.expGainedVal) {
		statsModalElements.expGainedVal.innerText = `+${expGained.toLocaleString()} EXP`;
	}

	const hoursElapsed = elapsedMs / 3600000;
	const expSpeedPerHour = (typeof lunExpTrackerSpeed !== 'undefined' && lunExpTrackerSpeed > 0)
		? (lunExpTrackerSpeed * 3600)
		: (hoursElapsed > 0 ? (expGained / hoursElapsed) : 0);
	if (statsModalElements.expRateVal) {
		let displaySpeed = Math.round(expSpeedPerHour);
		if (displaySpeed >= 1000000) displaySpeed = (displaySpeed / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		else if (displaySpeed >= 1000) displaySpeed = (displaySpeed / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		else displaySpeed = displaySpeed.toLocaleString();
		statsModalElements.expRateVal.innerText = `${displaySpeed} / hr`;
	}

	if (statsModalElements.timeToLevelVal) {
		if (expSpeedPerHour > 0) {
			const expNeeded = Math.max(0, maxExp - currentExp);
			const hoursNeeded = expNeeded / expSpeedPerHour;
			if (hoursNeeded < 1) {
				const mins = Math.max(1, Math.round(hoursNeeded * 60));
				statsModalElements.timeToLevelVal.innerText = `~${mins} min`;
			} else {
				statsModalElements.timeToLevelVal.innerText = `~${hoursNeeded.toFixed(1)} hrs`;
			}
		} else {
			statsModalElements.timeToLevelVal.innerText = t("nextLevelNA");
		}
	}

	const curGold = lunLastGold ?? 0;
	const curElif = lunLastElif ?? 0;
	const curSpkCoin = lunLastSpkCoin ?? 0;
	// Deprecated as event is over | 🟣 ${curSpkCoin.toLocaleString()}
	if (statsModalElements.currencyBalancesVal) {
		
		statsModalElements.currencyBalancesVal.innerText = `💰 ${curGold.toLocaleString()} | 💎 ${curElif.toLocaleString()}`;
	}

	if (lunSessionStartGold === null && lunLastGold !== null) {
		lunSessionStartGold = lunLastGold;
	}
	const goldDiff = lunSessionStartGold !== null ? (curGold - lunSessionStartGold) : 0;
	const goldPerHour = hoursElapsed > 0 ? (goldDiff / hoursElapsed).toFixed(0) : 0;
	const goldPrefix = goldDiff >= 0 ? "+" : "";
	let gphFormatted = Number(goldPerHour).toLocaleString();
	if (Math.abs(goldPerHour) >= 1000) {
		gphFormatted = (goldPerHour / 1000).toFixed(1).replace(/\.0$/, '') + "k";
	}
	if (statsModalElements.goldGainedVal) {
		statsModalElements.goldGainedVal.innerText = `${goldPrefix}${goldDiff.toLocaleString()} (${goldPrefix}${gphFormatted} / hr)`;
		statsModalElements.goldGainedVal.style.color = goldDiff >= 0 ? "#ffd54a" : "#f87171";
	}

	if (lunSessionStartElif === null && lunLastElif !== null) {
		lunSessionStartElif = lunLastElif;
	}
	if (lunSessionStartSpkCoin === null && lunLastSpkCoin !== null) {
		lunSessionStartSpkCoin = lunLastSpkCoin;
	}
	const elifDiff = lunSessionStartElif !== null ? (curElif - lunSessionStartElif) : 0;
	const elifPerHour = hoursElapsed > 0 ? (elifDiff / hoursElapsed).toFixed(1) : "0";
	const elifPrefix = elifDiff >= 0 ? "+" : "";
	if (statsModalElements.elifGainedVal) {
		statsModalElements.elifGainedVal.innerText = `${elifPrefix}${elifDiff.toLocaleString()} (${elifPrefix}${elifPerHour} / hr)`;
		statsModalElements.elifGainedVal.style.color = elifDiff >= 0 ? "#67e8f9" : "#f87171";
	}
	
	const spkCoinDiff = lunSessionStartSpkCoin !== null ? (curSpkCoin - lunSessionStartSpkCoin) : 0;
	const spkCoinPerHour = hoursElapsed > 0 ? (spkCoinDiff / hoursElapsed).toFixed(1) : "0";
	const spkCoinPrefix = spkCoinDiff >= 0 ? "+" : "";
	if (statsModalElements.spkCoinGainedVal) {
		statsModalElements.spkCoinGainedVal.innerText = `${spkCoinPrefix}${spkCoinDiff.toLocaleString()} (${spkCoinPrefix}${spkCoinPerHour} / hr)`;
		statsModalElements.spkCoinGainedVal.style.color = spkCoinDiff >= 0 ? "#a78bfa" : "#f87171";
	}
}