// ============================================================================
// IN-GAME 3D CART SKIN WARDROBE (NORMAL & HALLOWEEN PUMPKIN CARTS + SYNC)
// ============================================================================

const SPKMOD_CART_SKIN_STORAGE_KEYS = {
	enabled: "spkmod-cart-skin-enabled",
	equipped: "spkmod-cart-skin-equipped",
	showRemote: "spkmod-cart-skin-show-remote",
	shareInChat: "spkmod-cart-skin-share-chat",
	unlockAll: "spkmod-cart-skin-unlock-all-test"
};

const SPKMOD_CART_DISCORD_URL = "https://discord.gg/bruZhcwqRx";
const SPKMOD_HW_CART_FBX_URL = "/models/mount_pumpkin_cart_halloween/HW_skin.fbx";
const SPKMOD_HW_CART_ORIG_TEX_URL = "https://speakirpg.overture.io.kr/models/mount_pumpkin_cart_halloween/HW_Map_Body.png";

const SPKMOD_CART_SKIN_CATALOG = [
	{
		id: "uifi",
		code: 1,
		level: 10,
		icon: ":SPK_88:",
		emojiFallback: "🎃",
		accent: "#4ade80",
		file: "test.png",
		defaultName: "Ui Forest Cart",
		animated: false,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test.png"
	},
	{
		id: "1",
		code: 2,
		level: 20,
		icon: "1️⃣",
		accent: "#fbbf24",
		file: "test2.png",
		defaultName: "Wide Speaki Cart",
		animated: false,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test2.png"
	},
	{
		id: "2",
		code: 3,
		level: 30,
		icon: "2️⃣",
		accent: "#818cf8",
		file: "test3.png",
		defaultName: "Dungeon Friends Cart",
		animated: false,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test3.png"
	},
	{
		id: "3",
		code: 4,
		level: 40,
		icon: "3️⃣",
		accent: "#38bdf8",
		file: "test4.png",
		defaultName: "Starry Night Cart",
		animated: false,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test4.png"
	},
	{
		id: "4",
		code: 5,
		level: 50,
		milestone: true,
		icon: "4️⃣",
		accent: "#f472b6",
		file: "dancing.webp",
		defaultName: "Dancing Animated Cart",
		animated: true,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/dancing.webp"
	},
	{
		id: "5",
		code: 6,
		level: 60,
		icon: "5️⃣",
		accent: "#f43f5e",
		file: "yuki.png",
		defaultName: "Yuki Crimson Cart",
		animated: false,
		url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/yuki.png"
	}
];

const SPKMOD_CART_SKINS_BY_ID = new Map(SPKMOD_CART_SKIN_CATALOG.map(s => [s.id, s]));
const SPKMOD_CART_SKINS_BY_CODE = new Map(SPKMOD_CART_SKIN_CATALOG.map(s => [s.code, s]));

// Legacy map alias kept for backward compatibility
const SPKMOD_PUMPKIN_CART_SKINS = Object.fromEntries(SPKMOD_CART_SKIN_CATALOG.map(s => [s.id, {
	id: s.id,
	label: s.icon,
	file: s.file,
	url: s.url
}]));

function spkmodCartSkinIdToCode(skinId) {
	if (!skinId || skinId === "none" || skinId === "off") return 0;
	const key = String(skinId).trim().toLowerCase();
	const found = SPKMOD_CART_SKINS_BY_ID.get(key);
	if (found) return found.code;
	if (/^\d+$/.test(key)) {
		const n = Number(key);
		if (SPKMOD_CART_SKINS_BY_CODE.has(n)) return n;
	}
	return 0;
}

function spkmodCartSkinCodeToId(code) {
	const n = Number(code);
	if (!Number.isInteger(n) || n <= 0) return "none";
	const found = SPKMOD_CART_SKINS_BY_CODE.get(n);
	return found ? found.id : null;
}

if (typeof window !== "undefined") {
	window.spkmodCartSkinIdToCode = spkmodCartSkinIdToCode;
	window.spkmodCartSkinCodeToId = spkmodCartSkinCodeToId;
}

window.spkmodCartSkinSettings = {
	enabled: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_CART_SKIN_STORAGE_KEYS.enabled) !== "false"
		: (window.spkmodCartSkinsSystemEnabled !== false),
	equippedId: (typeof window !== "undefined" && window.localStorage && localStorage.getItem(SPKMOD_CART_SKIN_STORAGE_KEYS.equipped)) || null,
	showRemoteCartSkins: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_CART_SKIN_STORAGE_KEYS.showRemote) !== "false"
		: true,
	shareInChat: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_CART_SKIN_STORAGE_KEYS.shareInChat) !== "false"
		: true,
	unlockAllTest: (typeof window !== "undefined" && window.localStorage)
		? localStorage.getItem(SPKMOD_CART_SKIN_STORAGE_KEYS.unlockAll) === "true"
		: false
};
if (window.spkmodCartSkinSettings.equippedId && !SPKMOD_CART_SKINS_BY_ID.has(window.spkmodCartSkinSettings.equippedId)) {
	window.spkmodCartSkinSettings.equippedId = null;
}
window.spkmodCartSkinsSystemEnabled = window.spkmodCartSkinSettings.enabled !== false;
window.spkmodActivePumpkinSkin = window.spkmodCartSkinSettings.equippedId;
window.spkmodPumpkinCartTexReplaced = !!window.spkmodActivePumpkinSkin;

function spkmodIsCartSkinsSystemEnabled() {
	return window.spkmodCartSkinSettings.enabled !== false && window.spkmodCartSkinsSystemEnabled !== false;
}

function spkmodIsCartSkinChatSharingEnabled() {
	return spkmodIsCartSkinsSystemEnabled() && window.spkmodCartSkinSettings.shareInChat !== false;
}

function spkmodGetCartPlayerLevel() {
	if (typeof gameState !== "undefined" && gameState?.myStat?.level) {
		return Number(gameState.myStat.level) || 1;
	}
	return 1;
}

function spkmodIsCartSkinUnlocked(skin) {
	if (!skin) return false;
	if (window.spkmodCartSkinSettings.unlockAllTest) return true;
	return spkmodGetCartPlayerLevel() >= (skin.level || 1);
}

function spkmodCheckCartRemoteLevelAllowed(requiredLevel, remoteLevel, senderName) {
	if (!requiredLevel || requiredLevel <= 1) return true;
	if (senderName && typeof spkmodIsVipUser === "function" && spkmodIsVipUser(senderName)) {
		return true;
	}
	const lvl = Number(remoteLevel);
	if (!isFinite(lvl) || lvl <= 0) return false;
	return lvl >= requiredLevel;
}

// ============================================================================
// 1. MULTI-LANGUAGE UI STRINGS (translations.json)
// ============================================================================
const SPKMOD_CART_SKIN_UI_FALLBACK_EN = {
	cartSkinsBtnTooltip: "Cart Skins Wardrobe (Alt+C)",
	cartSkinsModalTitle: "🛒 SpeakiMod+ Pumpkin Cart Skins",
	myLevelLabel: "Your Level",
	unlockedLabel: "Unlocked",
	activeLabel: "Active Cart Skin",
	noneEquipped: "Original Cart",
	worksOnBothHint: "Works identically on both Normal & Halloween Pumpkin Carts!",
	btnEquip: "Equip",
	btnEquipped: "Equipped ✓",
	btnUnequip: "Restore Original",
	btnLocked: "Locked (Lv.{0})",
	btnResync: "📡 Sync Map",
	animatedBadge: "🎬 Animated",
	staticBadge: "🖼️ Texture",
	toggleRemoteCartSkins: "👁️ Show Others' Cart Skins",
	toggleShareInChat: "📡 Share My Cart Skin with Other Players",
	shareInChatDisabledToast: "📡 Cart skin sharing is OFF. Enable 'Share My Cart Skin' to sync with others.",
	equippedToast: "🛒 Equipped Cart Skin: {0} (Lv.{1})!",
	unequippedToast: "🛒 Cart skin removed (Original Cart restored).",
	lockedToast: "🔒 Requires Level {0} to equip {1}!",
	broadcastToast: "📡 Broadcasted active cart skin to nearby mod players!",
	unknownCartSkinToast: "❌ Unknown cart skin: {0}",
	testUnlockEnabledToast: "🔓 [Cart Skin Test] All cart skins UNLOCKED for testing!",
	testUnlockDisabledToast: "🔒 [Cart Skin Test] Normal level requirements restored.",
	submissionBannerText: "We're looking for skin submissions! Please join our Support Discord to find the blueprint and tutorial on how to design your own!",
	submissionBannerBtn: "📋 Copy Discord Link",
	submissionBannerCopied: "✅ Copied!",
	submissionBannerCopiedToast: "📋 Support Discord link copied to clipboard: {0}",
	systemDisabledToast: "🛒 Cart Skins System is disabled. Enable it in Settings.",
	systemEnabledToast: "🛒 Cart Skins System enabled."
};

function spkmodGetCartSkinActiveLang() {
	if (typeof spkmodGetActiveLang === "function") return spkmodGetActiveLang();
	const raw = (typeof spkmodLang !== "undefined" && spkmodLang) ? spkmodLang : "en";
	if (typeof spkmodTranslations !== "undefined" && spkmodTranslations[raw]) return raw;
	if (raw === "zh") return "zh-CN";
	if (raw === "es") return "es-419";
	return raw || "en";
}

function spkmodGetCartSkinUiText(key, ...args) {
	const lang = spkmodGetCartSkinActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	let str = (tr && tr[lang] && tr[lang].cartSkinUi && tr[lang].cartSkinUi[key])
		|| (tr && tr.en && tr.en.cartSkinUi && tr.en.cartSkinUi[key])
		|| SPKMOD_CART_SKIN_UI_FALLBACK_EN[key]
		|| key;
	args.forEach((a, i) => {
		str = str.split(`{${i}}`).join(a);
	});
	return str;
}
window.spkmodGetCartSkinUiText = spkmodGetCartSkinUiText;

function spkmodGetCartSkinDisplayName(skin) {
	if (!skin) return spkmodGetCartSkinUiText("noneEquipped");
	const lang = spkmodGetCartSkinActiveLang();
	const tr = typeof spkmodTranslations !== "undefined" ? spkmodTranslations : null;
	return (tr && tr[lang] && tr[lang].cartSkinNames && tr[lang].cartSkinNames[skin.id])
		|| (tr && tr.en && tr.en.cartSkinNames && tr.en.cartSkinNames[skin.id])
		|| skin.defaultName
		|| skin.id;
}

// ============================================================================
// 2. TEXTURE & ANIMATED WEBP CACHE (CLEARS PUMPKIN FACE CUTOUT REGION)
// ============================================================================
const _spkmodCartSkinResources = new Map(); // skinId -> { state, canvas, texture, frames, timerId, frameIdx, refCount, listeners }

function spkmodCartClearFaceCutout(ctx, w, h) {
	// Clear Halloween pumpkin face cutout region (x: 0..180, y: 170..320 on 512x512)
	const scaleX = w / 512;
	const scaleY = h / 512;
	ctx.clearRect(0, Math.floor(170 * scaleY), Math.ceil(180 * scaleX), Math.ceil(150 * scaleY));
}

function spkmodCartIsAnimatedUrl(url) {
	if (typeof url !== "string") return false;
	const clean = url.split("?")[0].toLowerCase();
	return clean.endsWith(".webp") || clean.endsWith(".gif") || clean.endsWith(".apng");
}

async function spkmodCartDecodeAnimatedImage(url) {
	if (typeof window === "undefined" || typeof window.ImageDecoder === "undefined") {
		throw new Error("ImageDecoder unavailable");
	}
	const res = await fetch(url, { mode: "cors" });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.arrayBuffer();
	const clean = url.split("?")[0].toLowerCase();
	let type = "image/webp";
	if (clean.endsWith(".gif")) type = "image/gif";
	else if (clean.endsWith(".apng")) type = "image/png";

	const decoder = new window.ImageDecoder({ data, type });
	await decoder.tracks.ready;
	const track = decoder.tracks.selectedTrack;
	const frameCount = (track && track.frameCount) ? track.frameCount : 1;
	const frames = [];
	for (let i = 0; i < frameCount; i++) {
		const frameResult = await decoder.decode({ frameIndex: i });
		const durationMicro = frameResult.image.duration;
		const durationMs = (typeof durationMicro === "number" && durationMicro > 0)
			? Math.max(16, Math.round(durationMicro / 1000))
			: 83;
		frames.push({
			bitmap: frameResult.image,
			duration: durationMs,
			width: frameResult.image.displayWidth || 512,
			height: frameResult.image.displayHeight || 512
		});
	}
	return frames;
}

function spkmodCartCreateThreeTextureFromCanvas(canvas, flipY = true) {
	const T = typeof window !== "undefined" ? window.THREE : null;
	if (!T || !T.CanvasTexture) return null;
	const tex = new T.CanvasTexture(canvas);
	if (T.SRGBColorSpace !== undefined) tex.colorSpace = T.SRGBColorSpace;
	tex.flipY = flipY;
	tex.needsUpdate = true;
	return tex;
}

function spkmodCartGetOrLoadSkinResource(skinId, onReady) {
	const skin = SPKMOD_CART_SKINS_BY_ID.get(skinId);
	if (!skin) return null;

	let res = _spkmodCartSkinResources.get(skinId);
	if (res) {
		if (res.state === "ready") {
			if (typeof onReady === "function") onReady(res);
		} else if (res.state === "loading" && typeof onReady === "function") {
			res.listeners.push(onReady);
		}
		return res;
	}

	res = {
		skinId,
		state: "loading",
		canvas: null,
		ctx: null,
		textureFlipYTrue: null,
		textureFlipYFalse: null,
		frames: null,
		frameIdx: 0,
		timerId: null,
		listeners: typeof onReady === "function" ? [onReady] : []
	};
	_spkmodCartSkinResources.set(skinId, res);

	const finishWithCanvas = (canvas, ctx, frames = null) => {
		res.canvas = canvas;
		res.ctx = ctx;
		res.frames = frames;
		res.state = "ready";
		const cbs = res.listeners.splice(0, res.listeners.length);
		for (const cb of cbs) {
			try { cb(res); } catch (_) {}
		}
		if (frames && frames.length > 1) {
			spkmodCartEnsureAnimTick(res);
		}
	};

	const loadStaticFallback = () => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const w = img.naturalWidth || img.width || 512;
			const h = img.naturalHeight || img.height || 512;
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, w, h);
			spkmodCartClearFaceCutout(ctx, w, h);
			finishWithCanvas(canvas, ctx, null);
		};
		img.onerror = () => {
			res.state = "error";
			res.listeners.length = 0;
			_spkmodCartSkinResources.delete(skinId);
		};
		img.src = skin.url;
	};

	if (skin.animated || spkmodCartIsAnimatedUrl(skin.url)) {
		spkmodCartDecodeAnimatedImage(skin.url).then(frames => {
			if (!frames || frames.length === 0) {
				loadStaticFallback();
				return;
			}
			const w = frames[0].width || 512;
			const h = frames[0].height || 512;
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(frames[0].bitmap, 0, 0, w, h);
			spkmodCartClearFaceCutout(ctx, w, h);
			finishWithCanvas(canvas, ctx, frames);
		}).catch(() => {
			loadStaticFallback();
		});
	} else {
		loadStaticFallback();
	}

	return res;
}

function spkmodCartGetTextureForResource(res, flipY = true) {
	if (!res || !res.canvas) return null;
	if (flipY) {
		if (!res.textureFlipYTrue) {
			res.textureFlipYTrue = spkmodCartCreateThreeTextureFromCanvas(res.canvas, true);
		}
		return res.textureFlipYTrue;
	}
	if (!res.textureFlipYFalse) {
		res.textureFlipYFalse = spkmodCartCreateThreeTextureFromCanvas(res.canvas, false);
	}
	return res.textureFlipYFalse;
}

function spkmodCartIsSkinInUseAnywhere(skinId) {
	if (!spkmodIsCartSkinsSystemEnabled()) return false;
	if (window.spkmodCartSkinSettings.equippedId === skinId) return true;
	if (window.spkmodCartSkinSettings.showRemoteCartSkins !== false) {
		for (const st of _spkmodRemoteCartSkinStates.values()) {
			if (st && st.cartId === skinId) return true;
		}
	}
	return false;
}

function spkmodCartEnsureAnimTick(res) {
	if (!res || !res.frames || res.frames.length <= 1 || res.timerId) return;
	const tick = () => {
		res.timerId = null;
		if (!res.frames || res.frames.length <= 1 || !res.ctx || !res.canvas) return;
		if (!spkmodCartIsSkinInUseAnywhere(res.skinId)) {
			// Pause decoding ticks while nobody is wearing this animated skin; resume on demand
			return;
		}
		if (!document.hidden) {
			res.frameIdx = (res.frameIdx + 1) % res.frames.length;
			const f = res.frames[res.frameIdx];
			res.ctx.clearRect(0, 0, res.canvas.width, res.canvas.height);
			res.ctx.drawImage(f.bitmap, 0, 0, res.canvas.width, res.canvas.height);
			spkmodCartClearFaceCutout(res.ctx, res.canvas.width, res.canvas.height);
			if (res.textureFlipYTrue) res.textureFlipYTrue.needsUpdate = true;
			if (res.textureFlipYFalse) res.textureFlipYFalse.needsUpdate = true;
		}
		const curDur = res.frames[res.frameIdx]?.duration || 83;
		res.timerId = setTimeout(tick, curDur);
	};
	res.timerId = setTimeout(tick, res.frames[0].duration || 83);
}

// ============================================================================
// 3. NORMAL PUMPKIN CART ADAPTATION VIA HW_skin.fbx (SOLO & TANDEM + WHEELS)
// ============================================================================
// Mirrors the exact geometry classification & Z-stretch from game mountRigDefs
// so Normal Pumpkin Cart (50001) renders 100% identically to Halloween Cart (50004).
const SPKMOD_CART_DIMS_SOLO = { bodyLengthM: 1.4, wheelZOffsetM: 0.465 };
const SPKMOD_CART_DIMS_TANDEM = { bodyLengthM: 2.2, wheelZOffsetM: 0.75 };

let _spkmodHwCartTemplate = null;
let _spkmodHwCartTemplatePromise = null;

function spkmodClassifyHwCartGeometry(geo) {
	const pos = geo.getAttribute("position");
	const count = pos.count;
	const parent = new Int32Array(count);
	for (let i = 0; i < count; i++) parent[i] = i;
	const find = (i) => {
		while (parent[i] !== i) {
			parent[i] = parent[parent[i]];
			i = parent[i];
		}
		return i;
	};
	const union = (a, b) => { parent[find(a)] = find(b); };

	const byPos = new Map();
	for (let i = 0; i < count; i++) {
		const k = `${Math.round(pos.getX(i) * 1000)},${Math.round(pos.getY(i) * 1000)},${Math.round(pos.getZ(i) * 1000)}`;
		const prev = byPos.get(k);
		if (prev === undefined) byPos.set(k, i);
		else union(i, prev);
	}
	for (let i = 0; i + 2 < count; i += 3) {
		union(i + 1, i);
		union(i + 2, i);
	}

	const comps = new Map();
	for (let i = 0; i < count; i++) {
		const root = find(i);
		let c = comps.get(root);
		if (!c) {
			c = { n: 0, sumX: 0, sumZ: 0 };
			comps.set(root, c);
		}
		c.n++;
		c.sumX += pos.getX(i);
		c.sumZ += pos.getZ(i);
	}

	let mainComp = -1;
	let mainCount = -1;
	for (const [id, c] of comps) {
		if (c.n > mainCount) {
			mainCount = c.n;
			mainComp = id;
		}
	}

	const role = new Uint8Array(count);
	const shiftSign = new Int8Array(count);
	const wheelSlot = new Int8Array(count).fill(-1);
	for (let i = 0; i < count; i++) {
		const root = find(i);
		if (root === mainComp) continue;
		const c = comps.get(root);
		const isWheel = Math.abs(c.sumX / c.n) > 0.5;
		role[i] = isWheel ? 2 : 1;
		shiftSign[i] = (c.sumZ / c.n) >= 0 ? 1 : -1;
		if (isWheel) {
			wheelSlot[i] = ((c.sumX / c.n) >= 0 ? 2 : 0) + (shiftSign[i] > 0 ? 1 : 0);
		}
	}
	return { role, shiftSign, wheelSlot };
}

function spkmodEnsureHwCartTemplate() {
	if (_spkmodHwCartTemplate) return Promise.resolve(_spkmodHwCartTemplate);
	if (_spkmodHwCartTemplatePromise) return _spkmodHwCartTemplatePromise;

	_spkmodHwCartTemplatePromise = (async () => {
		const T = (typeof spkmodEnsureThree === "function") ? await spkmodEnsureThree() : (typeof window !== "undefined" ? window.THREE : null);
		const FBXLoader = (typeof spkmodEnsureFBXLoader === "function") ? await spkmodEnsureFBXLoader() : (T && T.FBXLoader);
		if (!T || !FBXLoader) return null;

		const loader = new FBXLoader();
		const fbx = await new Promise((resolve, reject) => {
			if (typeof loader.loadAsync === "function") {
				loader.loadAsync(SPKMOD_HW_CART_FBX_URL).then(resolve, reject);
			} else {
				loader.load(SPKMOD_HW_CART_FBX_URL, resolve, undefined, reject);
			}
		});

		fbx.updateMatrixWorld(true);
		let mesh = null;
		fbx.traverse(ch => {
			if (!mesh && ch && ch.isMesh && ch.geometry) mesh = ch;
		});
		if (!mesh) return null;

		let geo = mesh.geometry.clone();
		if (geo.index) geo = geo.toNonIndexed();
		geo.applyMatrix4(mesh.matrixWorld);
		geo.rotateY(Math.PI / 2);
		geo.computeBoundingBox();
		geo.computeBoundingSphere();

		const { role, shiftSign, wheelSlot } = spkmodClassifyHwCartGeometry(geo);
		_spkmodHwCartTemplate = {
			geometry: geo,
			vertexRole: role,
			vertexShiftSign: shiftSign,
			vertexWheelSlot: wheelSlot
		};
		return _spkmodHwCartTemplate;
	})().catch(err => {
		console.warn("[SpeakiMod+ CartSkins] Failed to load HW_skin.fbx for Normal Cart adaptation:", err);
		_spkmodHwCartTemplatePromise = null;
		return null;
	});

	return _spkmodHwCartTemplatePromise;
}

function spkmodExtractCartSubGeometry(T, srcGeo, predicate, offsetVec) {
	const posAttr = srcGeo.getAttribute("position");
	const count = posAttr.count;
	const indices = [];
	for (let i = 0; i + 2 < count; i += 3) {
		if (predicate(i)) indices.push(i, i + 1, i + 2);
	}
	const out = new T.BufferGeometry();
	for (const attrName of ["position", "normal", "uv"]) {
		const attr = srcGeo.getAttribute(attrName);
		if (!attr) continue;
		const itemSize = attr.itemSize;
		const arr = new Float32Array(indices.length * itemSize);
		for (let j = 0; j < indices.length; j++) {
			const srcIdx = indices[j];
			for (let k = 0; k < itemSize; k++) {
				arr[j * itemSize + k] = attr.getComponent(srcIdx, k);
			}
		}
		out.setAttribute(attrName, new T.BufferAttribute(arr, itemSize));
	}
	if (offsetVec) out.translate(offsetVec.x, offsetVec.y, offsetVec.z);
	out.computeBoundingBox();
	out.computeBoundingSphere();
	return out;
}

function spkmodBuildHwCartOverlayGroup(template, cartMode, texture) {
	const T = typeof window !== "undefined" ? window.THREE : null;
	if (!T || !template || !template.geometry) return null;

	const dims = cartMode === "tandem" ? SPKMOD_CART_DIMS_TANDEM : SPKMOD_CART_DIMS_SOLO;
	const stretched = template.geometry.clone();
	const deltaLen = dims.bodyLengthM - SPKMOD_CART_DIMS_SOLO.bodyLengthM;
	const deltaWheelZ = dims.wheelZOffsetM - SPKMOD_CART_DIMS_SOLO.wheelZOffsetM;
	if (deltaLen !== 0 || deltaWheelZ !== 0) {
		const halfDelta = deltaLen / 2;
		const centerSpan = 0.3;
		const pos = stretched.getAttribute("position");
		for (let i = 0; i < pos.count; i++) {
			const z = pos.getZ(i);
			const r = template.vertexRole[i];
			const sign = template.vertexShiftSign[i];
			if (r === 2) {
				pos.setZ(i, z + sign * deltaWheelZ);
			} else if (r === 1) {
				pos.setZ(i, z + sign * halfDelta);
			} else if (Math.abs(z) <= centerSpan) {
				pos.setZ(i, z * (centerSpan + halfDelta) / centerSpan);
			} else {
				pos.setZ(i, z + Math.sign(z) * halfDelta);
			}
		}
		pos.needsUpdate = true;
		stretched.computeBoundingBox();
		stretched.computeBoundingSphere();
	}

	const MatCtor = T.MeshToonMaterial || T.MeshLambertMaterial || T.MeshBasicMaterial;
	const mat = new MatCtor({
		color: 0xffffff,
		map: texture,
		transparent: true,
		alphaTest: 0.5,
		depthWrite: true
	});

	const group = new T.Group();
	group.name = "spkmod_cart_skin_overlay";
	const zeroVec = new T.Vector3(0, 0, 0);

	const bodyGeo = spkmodExtractCartSubGeometry(T, stretched, i => template.vertexRole[i] !== 2, zeroVec);
	const bodyMesh = new T.Mesh(bodyGeo, mat);
	bodyMesh.raycast = () => {};
	group.add(bodyMesh);

	const wheels = [];
	for (let slot = 0; slot < 4; slot++) {
		const pred = i => template.vertexWheelSlot[i] === slot;
		const probeGeo = spkmodExtractCartSubGeometry(T, stretched, pred, zeroVec);
		const probePos = probeGeo.getAttribute("position");
		if (!probeGeo.boundingBox || !probePos || probePos.count === 0) {
			probeGeo.dispose();
			continue;
		}
		const center = probeGeo.boundingBox.getCenter(new T.Vector3());
		const size = probeGeo.boundingBox.getSize(new T.Vector3());
		probeGeo.dispose();

		const wheelGeo = spkmodExtractCartSubGeometry(T, stretched, pred, center.clone().negate());
		const wheelMesh = new T.Mesh(wheelGeo, mat);
		wheelMesh.position.copy(center);
		wheelMesh.raycast = () => {};
		group.add(wheelMesh);
		wheels.push({
			mesh: wheelMesh,
			radiusM: Math.max(0.05, Math.max(size.y, size.z) / 2)
		});
	}

	stretched.dispose();
	group.userData = {
		isSpkmodCartOverlay: true,
		material: mat,
		wheels
	};
	return group;
}

function spkmodDisposeCartOverlayGroup(overlay) {
	if (!overlay) return;
	if (overlay.parent) overlay.parent.remove(overlay);
	overlay.traverse(ch => {
		if (ch && ch.isMesh && ch.geometry && typeof ch.geometry.dispose === "function") {
			try { ch.geometry.dispose(); } catch (_) {}
		}
	});
	const mat = overlay.userData?.material;
	if (mat && typeof mat.dispose === "function") {
		try { mat.dispose(); } catch (_) {}
	}
}

// ============================================================================
// 4. PER-CART SKIN APPLICATION & RESTORATION (NORMAL 50001 + HALLOWEEN 50004)
// ============================================================================
function spkmodCartGroupHasTexturedBody(cg) {
	let found = false;
	if (!cg || typeof cg.traverse !== "function") return false;
	cg.traverse(ch => {
		if (found || !ch || !ch.isMesh || ch.userData?.isSpkmodCartOverlay) return;
		let p = ch;
		while (p && p !== cg) {
			if (p.name === "spkmod_cart_skin_overlay") return;
			p = p.parent;
		}
		const origMat = ch.__spkmodOrigCartMat !== undefined ? ch.__spkmodOrigCartMat : ch.material;
		const mats = Array.isArray(origMat) ? origMat : [origMat];
		for (const m of mats) {
			if (m && m.map) {
				found = true;
				break;
			}
		}
	});
	return found;
}

function spkmodClearSkinFromCartGroup(cg) {
	if (!cg || typeof cg.traverse !== "function") return;

	// 1. Remove Normal Cart overlay if present
	if (Array.isArray(cg.children)) {
		for (let i = cg.children.length - 1; i >= 0; i--) {
			const ch = cg.children[i];
			if (ch && (ch.name === "spkmod_cart_skin_overlay" || ch.userData?.isSpkmodCartOverlay)) {
				spkmodDisposeCartOverlayGroup(ch);
			} else if (ch && ch.__spkmodHiddenByCartSkin) {
				ch.visible = ch.__spkmodOrigCartVis !== undefined ? ch.__spkmodOrigCartVis : true;
				delete ch.__spkmodHiddenByCartSkin;
				delete ch.__spkmodOrigCartVis;
			}
		}
	}

	// 2. Restore Halloween Cart cloned materials & cutout visibility
	cg.traverse(ch => {
		if (!ch || !ch.isMesh) return;
		if (ch.__spkmodClonedCartMat) {
			const cloned = ch.__spkmodClonedCartMat;
			if (ch.__spkmodOrigCartMat !== undefined) {
				ch.material = ch.__spkmodOrigCartMat;
			}
			const arr = Array.isArray(cloned) ? cloned : [cloned];
			for (const m of arr) {
				if (m && typeof m.dispose === "function") {
					try { m.dispose(); } catch (_) {}
				}
			}
			delete ch.__spkmodClonedCartMat;
			delete ch.__spkmodOrigCartMat;
		}
		if (ch.__spkmodCartOrigCutoutVis !== undefined) {
			ch.visible = ch.__spkmodCartOrigCutoutVis;
			delete ch.__spkmodCartOrigCutoutVis;
		}
	});

	delete cg.__spkmodAppliedCartSkinId;
	delete cg.__spkmodAppliedCartMode;
	delete cg.__spkmodAppliedCartKind;
	delete cg.__spkmodCartOverlayRef;
}

function spkmodApplySkinToEntry(entry, skinId) {
	if (!entry || !entry.cartGroup) return;
	const cg = entry.cartGroup;
	const mountItemId = Number(entry.mountItemId) || 0;

	// Only apply to Normal Pumpkin Cart (50001) and Halloween Pumpkin Cart (50004)
	// (If mountItemId is unknown/0, only allow if it's a textured HW cart)
	const isHalloween = mountItemId === 50004 || (mountItemId === 0 && spkmodCartGroupHasTexturedBody(cg));
	const isNormal = mountItemId === 50001;
	if (!isHalloween && !isNormal) return;

	if (!skinId || !SPKMOD_CART_SKINS_BY_ID.has(skinId)) {
		if (cg.__spkmodAppliedCartSkinId) {
			spkmodClearSkinFromCartGroup(cg);
		}
		return;
	}

	const cartMode = entry.cartMode === "tandem" ? "tandem" : "solo";
	const hasTexturedMesh = spkmodCartGroupHasTexturedBody(cg);
	const effectiveKind = (isHalloween && hasTexturedMesh) ? "hw" : "normal_overlay";

	if (cg.__spkmodAppliedCartSkinId === skinId && cg.__spkmodAppliedCartMode === cartMode && cg.__spkmodAppliedCartKind === effectiveKind) {
		// Ensure animated texture keeps ticking if this skin is animated
		const res = _spkmodCartSkinResources.get(skinId);
		if (res && res.frames && res.frames.length > 1) {
			spkmodCartEnsureAnimTick(res);
		}
		return;
	}

	const res = spkmodCartGetOrLoadSkinResource(skinId, () => {
		_spkmodCartForceReconcile = true;
	});
	if (!res || res.state !== "ready") return;
	if (res.frames && res.frames.length > 1) {
		spkmodCartEnsureAnimTick(res);
	}

	if (effectiveKind === "hw") {
		// Halloween cart already has HW_skin.fbx geometry; clone material per cart so players never overwrite each other
		spkmodClearSkinFromCartGroup(cg);
		cg.traverse(ch => {
			if (!ch || !ch.isMesh || !ch.material) return;
			const origMat = ch.__spkmodOrigCartMat !== undefined ? ch.__spkmodOrigCartMat : ch.material;
			const isArr = Array.isArray(origMat);
			const origArr = isArr ? origMat : [origMat];
			let hasMap = false;
			for (const m of origArr) {
				if (m && m.map) { hasMap = true; break; }
			}
			if (hasMap) {
				ch.__spkmodOrigCartMat = origMat;
				const clonedArr = origArr.map(m => {
					if (!m || !m.map) return m;
					const flipY = m.map.flipY !== undefined ? !!m.map.flipY : true;
					const skinTex = spkmodCartGetTextureForResource(res, flipY);
					const clone = typeof m.clone === "function" ? m.clone() : m;
					if (skinTex) clone.map = skinTex;
					clone.transparent = true;
					clone.alphaTest = 0.5;
					clone.depthWrite = true;
					clone.needsUpdate = true;
					return clone;
				});
				const nextMat = isArr ? clonedArr : clonedArr[0];
				ch.__spkmodClonedCartMat = nextMat;
				ch.material = nextMat;
			} else {
				const firstM = origArr[0];
				const isFaceCutout = !!(firstM && (firstM.emissive || (ch.geometry && ch.geometry.type === "ShapeGeometry")));
				if (isFaceCutout) {
					if (ch.__spkmodCartOrigCutoutVis === undefined) ch.__spkmodCartOrigCutoutVis = ch.visible;
					ch.visible = false;
				}
			}
		});
		cg.__spkmodAppliedCartSkinId = skinId;
		cg.__spkmodAppliedCartMode = cartMode;
		cg.__spkmodAppliedCartKind = "hw";
		return;
	}

	// Normal Pumpkin Cart (50001) — or Halloween Cart before its FBX finishes loading:
	// Overlay cloned HW_skin.fbx stretched to exact solo/tandem dimensions!
	if (!_spkmodHwCartTemplate) {
		spkmodEnsureHwCartTemplate().then(tpl => {
			if (tpl) _spkmodCartForceReconcile = true;
		});
		return;
	}

	const skinTex = spkmodCartGetTextureForResource(res, true);
	if (!skinTex) return;

	spkmodClearSkinFromCartGroup(cg);
	if (Array.isArray(cg.children)) {
		for (const ch of cg.children) {
			if (!ch || ch.name === "spkmod_cart_skin_overlay") continue;
			ch.__spkmodOrigCartVis = ch.visible;
			ch.__spkmodHiddenByCartSkin = true;
			ch.visible = false;
		}
	}

	const overlay = spkmodBuildHwCartOverlayGroup(_spkmodHwCartTemplate, cartMode, skinTex);
	if (!overlay) return;
	cg.add(overlay);
	cg.__spkmodAppliedCartSkinId = skinId;
	cg.__spkmodAppliedCartMode = cartMode;
	cg.__spkmodAppliedCartKind = "normal_overlay";
	cg.__spkmodCartOverlayRef = overlay;
}

// ============================================================================
// 5. REMOTE CART SKIN SYNC BRIDGE (:m_...c<N>...:)
// ============================================================================
const _spkmodRemoteCartSkinStates = new Map(); // ownerKey -> { playerId, playerName, cartId, updatedAtMs }
let _spkmodCartHadBroadcast = false;
let _spkmodCartNeedsZoneSync = false;
let _spkmodCartLastObservedZoneId = null;
let _spkmodCartLastObservedRemoteCount = 0;
let _spkmodCartForceReconcile = false;

window.spkmodGetActiveCartSkinBroadcastState = function() {
	const enabled = spkmodIsCartSkinsSystemEnabled();
	const shareInChat = spkmodIsCartSkinChatSharingEnabled();
	const cartId = (enabled && window.spkmodCartSkinSettings.equippedId) || null;
	return {
		enabled,
		shareInChat,
		cartId,
		hadBroadcastCart: _spkmodCartHadBroadcast
	};
};

window.spkmodMarkCartSkinBroadcastSent = function(hasCart) {
	_spkmodCartHadBroadcast = !!hasCart;
	_spkmodCartNeedsZoneSync = false;
};

function spkmodTriggerCartSkinSyncBroadcast(opts = {}) {
	if (!spkmodIsCartSkinChatSharingEnabled()) return;
	const hasActive = !!window.spkmodCartSkinSettings.equippedId;
	const rCount = (typeof gameState !== "undefined" && gameState?.remotePlayers?.remotePlayers?.size) || 0;
	if (hasActive && rCount === 0) {
		_spkmodCartNeedsZoneSync = true;
	}
	if (typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
		window.spkmodQueueUnifiedModSyncBroadcast(Object.assign({
			includeCartState: true,
			reason: "cart_skin"
		}, opts));
	}
}

function spkmodResolveRemotePlayerForCart(playerId, playerName) {
	if (typeof gameState === "undefined" || !gameState?.remotePlayers?.remotePlayers) return null;
	const rMap = gameState.remotePlayers.remotePlayers;
	if (playerId != null && typeof playerId !== "object") {
		const rawStr = String(playerId).trim();
		const stripped = rawStr.replace(/^(?:remote|player|user|bubble)[_:-]+/i, "");
		for (const k of [playerId, Number(playerId), rawStr, stripped, Number(stripped)]) {
			if (k === "" || (typeof k === "number" && Number.isNaN(k))) continue;
			const byId = rMap.get(k);
			if (byId) return { key: String(k), rp: byId };
		}
	}
	const lower = typeof playerName === "string" ? playerName.trim().toLowerCase() : "";
	if (lower) {
		for (const [k, rp] of rMap) {
			const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim().toLowerCase();
			if (rName && rName === lower) return { key: String(k), rp };
		}
	}
	return null;
}

window.spkmodHandleIncomingCartSkinState = function(playerId, playerName, cartIdRaw) {
	if (playerId != null && typeof playerId === "object") {
		if (!playerName) playerName = playerId.info?.__spkmodOrigName || playerId.info?.name || playerId.name || "";
		playerId = playerId.info?.playerId ?? playerId.info?.id ?? playerId.playerId ?? playerId.id ?? null;
	}
	let cleanName = typeof playerName === "string" ? playerName.trim() : "";
	let cleanId = (playerId != null && String(playerId).trim() !== "") ? playerId : null;

	const resolved = spkmodResolveRemotePlayerForCart(cleanId, cleanName);
	if (resolved) {
		cleanId = resolved.key;
		const rName = (resolved.rp?.info?.__spkmodOrigName || resolved.rp?.info?.name || "").trim();
		if (rName) cleanName = rName;
	}
	const lowerName = cleanName.toLowerCase();
	const ownerKey = (cleanId != null && String(cleanId).trim() !== "")
		? String(cleanId).trim()
		: (lowerName ? `name:${lowerName}` : "");
	if (!ownerKey) return;

	// Evict stale alias keys for the same player
	for (const [k, st] of [..._spkmodRemoteCartSkinStates.entries()]) {
		if (k === ownerKey || !st) continue;
		const stLower = (st.playerName || "").trim().toLowerCase();
		if ((lowerName && stLower && stLower === lowerName) || (cleanId != null && st.playerId != null && String(st.playerId) === String(cleanId))) {
			_spkmodRemoteCartSkinStates.delete(k);
		}
	}

	const norm = (!cartIdRaw || cartIdRaw === "none" || cartIdRaw === "off") ? null : String(cartIdRaw).trim().toLowerCase();
	const validId = (norm && SPKMOD_CART_SKINS_BY_ID.has(norm)) ? norm : null;

	if (!validId) {
		_spkmodRemoteCartSkinStates.delete(ownerKey);
	} else {
		_spkmodRemoteCartSkinStates.set(ownerKey, {
			playerId: cleanId,
			playerName: cleanName,
			cartId: validId,
			updatedAtMs: Date.now()
		});
	}
	_spkmodCartForceReconcile = true;
};

function spkmodResolveDesiredCartSkinForDriver(driverKey) {
	if (!spkmodIsCartSkinsSystemEnabled()) return null;
	const myId = typeof gameState !== "undefined" ? gameState?.myPlayerId : null;
	const isLocal = (myId != null && String(driverKey) === String(myId));
	if (isLocal) {
		const eq = window.spkmodCartSkinSettings.equippedId || null;
		if (!eq) return null;
		const skin = SPKMOD_CART_SKINS_BY_ID.get(eq);
		return (skin && spkmodIsCartSkinUnlocked(skin)) ? skin.id : null;
	}
	if (window.spkmodCartSkinSettings.showRemoteCartSkins === false) return null;

	const keyStr = String(driverKey);
	const rMap = typeof gameState !== "undefined" ? gameState?.remotePlayers?.remotePlayers : null;
	const rp = rMap ? (rMap.get(driverKey) || rMap.get(Number(driverKey)) || rMap.get(keyStr)) : null;
	const rName = (rp?.info?.__spkmodOrigName || rp?.info?.name || "").trim();
	const rLower = rName.toLowerCase();
	const rLevel = rp?.info?.level ?? rp?.level ?? 0;

	const validate = (cartId, fallbackName) => {
		if (!cartId) return null;
		const skin = SPKMOD_CART_SKINS_BY_ID.get(cartId);
		if (!skin) return null;
		return spkmodCheckCartRemoteLevelAllowed(skin.level, rLevel, rName || fallbackName) ? skin.id : null;
	};

	const direct = _spkmodRemoteCartSkinStates.get(keyStr);
	if (direct && direct.cartId) return validate(direct.cartId, direct.playerName);

	if (rLower) {
		const byName = _spkmodRemoteCartSkinStates.get(`name:${rLower}`);
		if (byName && byName.cartId) {
			_spkmodRemoteCartSkinStates.delete(`name:${rLower}`);
			_spkmodRemoteCartSkinStates.set(keyStr, Object.assign({}, byName, { playerId: keyStr }));
			return validate(byName.cartId, byName.playerName);
		}
		for (const st of _spkmodRemoteCartSkinStates.values()) {
			if (st && st.cartId && st.playerName && st.playerName.trim().toLowerCase() === rLower) {
				return validate(st.cartId, st.playerName);
			}
		}
	}
	return null;
}

// ============================================================================
// 6. MASTER RECONCILE & WHEEL ROLLING LOOP
// ============================================================================
let _spkmodCartLoopRafId = null;
let _spkmodCartLastReconcileMs = 0;

function spkmodReconcileAllCartSkins() {
	if (typeof gameState === "undefined" || !gameState) return;
	const mv = gameState.mountVisuals;
	if (!mv || !mv.entries || typeof mv.entries.entries !== "function") return;

	if (!mv.__spkmodCartSkinsHooked) {
		mv.__spkmodCartSkinsHooked = true;
		if (typeof mv.setMount === "function") {
			const origSetMount = mv.setMount;
			mv.setMount = function(...args) {
				const res = origSetMount.apply(this, args);
				_spkmodCartForceReconcile = true;
				setTimeout(() => { _spkmodCartForceReconcile = true; }, 80);
				setTimeout(() => { _spkmodCartForceReconcile = true; }, 300);
				return res;
			};
		}
		if (typeof mv.attachCartIfNeeded === "function") {
			const origAttach = mv.attachCartIfNeeded;
			mv.attachCartIfNeeded = function(...args) {
				const res = origAttach.apply(this, args);
				_spkmodCartForceReconcile = true;
				setTimeout(() => { _spkmodCartForceReconcile = true; }, 80);
				setTimeout(() => { _spkmodCartForceReconcile = true; }, 300);
				return res;
			};
		}
	}

	for (const [driverKey, entry] of mv.entries.entries()) {
		if (!entry || !entry.cartGroup) continue;
		const desired = spkmodResolveDesiredCartSkinForDriver(driverKey);
		spkmodApplySkinToEntry(entry, desired);
	}
}

function spkmodCartSkinsMasterLoop(nowMs) {
	_spkmodCartLoopRafId = null;
	if (!spkmodIsCartSkinsSystemEnabled()) return;

	if (!document.hidden && typeof gameState !== "undefined" && gameState) {
		// 1. Reconcile carts + zone/remote-join sync every 150ms (or immediately on state change)
		if (_spkmodCartForceReconcile || (nowMs - _spkmodCartLastReconcileMs >= 150)) {
			_spkmodCartForceReconcile = false;
			_spkmodCartLastReconcileMs = nowMs;

			// Zone change cleanup & broadcast
			if (gameState.zoneId != null && gameState.zoneId !== _spkmodCartLastObservedZoneId) {
				_spkmodCartLastObservedZoneId = gameState.zoneId;
				_spkmodRemoteCartSkinStates.clear();
				if (window.spkmodCartSkinSettings.equippedId && spkmodIsCartSkinChatSharingEnabled()) {
					_spkmodCartNeedsZoneSync = true;
					spkmodTriggerCartSkinSyncBroadcast({
						priority: "passive",
						delayMs: 1900,
						forceResend: true,
						reason: "cart_zone"
					});
				}
			}

			const rCount = (gameState.remotePlayers?.remotePlayers?.size) || 0;
			if (rCount > 0 && window.spkmodCartSkinSettings.equippedId && spkmodIsCartSkinChatSharingEnabled()) {
				const inMinigame = (typeof spkmodIsInIsolatedMinigame === "function") ? spkmodIsInIsolatedMinigame() : false;
				if (!inMinigame) {
					if (_spkmodCartNeedsZoneSync) {
						_spkmodCartNeedsZoneSync = false;
						spkmodTriggerCartSkinSyncBroadcast({
							priority: "passive",
							delayMs: 1900,
							forceResend: true,
							reason: "cart_zone"
						});
					} else if (rCount > _spkmodCartLastObservedRemoteCount) {
						spkmodTriggerCartSkinSyncBroadcast({
							priority: "passive",
							delayMs: 2500,
							forceResend: true,
							reason: "remote_join"
						});
					}
				}
			}
			_spkmodCartLastObservedRemoteCount = rCount;

			spkmodReconcileAllCartSkins();
		}

		// 2. Smoothly roll the 4 wheels on any Normal Cart HW_skin.fbx overlay
		const mv = gameState.mountVisuals;
		if (mv && mv.entries) {
			for (const entry of mv.entries.values()) {
				const overlay = entry?.cartGroup?.__spkmodCartOverlayRef;
				if (!overlay || !overlay.userData?.wheels?.length) continue;
				const container = entry.cartGroup.parent;
				const pos = container?.position;
				if (!pos) continue;
				if (overlay.userData.lastX !== undefined && overlay.userData.lastZ !== undefined) {
					const dist = Math.hypot(pos.x - overlay.userData.lastX, pos.z - overlay.userData.lastZ);
					if (dist > 0.0005 && dist < 4.0) {
						for (const w of overlay.userData.wheels) {
							w.mesh.rotation.x += dist / w.radiusM;
						}
					}
				}
				overlay.userData.lastX = pos.x;
				overlay.userData.lastZ = pos.z;
			}
		}
	}

	_spkmodCartLoopRafId = requestAnimationFrame(spkmodCartSkinsMasterLoop);
}

function spkmodStartCartSkinsLoopIfEnabled() {
	if (!spkmodIsCartSkinsSystemEnabled()) return;
	if (_spkmodCartLoopRafId !== null) return;
	_spkmodCartLoopRafId = requestAnimationFrame(spkmodCartSkinsMasterLoop);
}

function spkmodStopCartSkinsLoop() {
	if (_spkmodCartLoopRafId !== null) {
		cancelAnimationFrame(_spkmodCartLoopRafId);
		_spkmodCartLoopRafId = null;
	}
}

// ============================================================================
// 7. EQUIP / UNEQUIP / SYSTEM MASTER TOGGLE
// ============================================================================
function spkmodEquipLocalCartSkin(skinId, broadcast = true, silentToast = false) {
	if (!spkmodIsCartSkinsSystemEnabled()) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetCartSkinUiText("systemDisabledToast"));
		}
		return false;
	}

	if (skinId === null || skinId === undefined || skinId === "" || skinId === "none" || skinId === "off") {
		const hadPrev = !!window.spkmodCartSkinSettings.equippedId;
		window.spkmodCartSkinSettings.equippedId = null;
		window.spkmodActivePumpkinSkin = null;
		window.spkmodPumpkinCartTexReplaced = false;
		if (typeof window !== "undefined" && window.localStorage) {
			try { localStorage.removeItem(SPKMOD_CART_SKIN_STORAGE_KEYS.equipped); } catch (_) {}
		}
		_spkmodCartForceReconcile = true;
		spkmodReconcileAllCartSkins();
		if (broadcast && hadPrev && spkmodIsCartSkinChatSharingEnabled()) {
			spkmodTriggerCartSkinSyncBroadcast({
				priority: "explicit",
				delayMs: 900,
				forceResend: true,
				includeCartState: true,
				reason: "cart_unequip"
			});
		}
		if (!silentToast && hadPrev && typeof chatLog === "function") {
			chatLog(spkmodGetCartSkinUiText("unequippedToast"));
		}
		spkmodRefreshCartSkinsModalUI();
		return true;
	}

	const norm = String(skinId).trim().toLowerCase();
	const skin = SPKMOD_CART_SKINS_BY_ID.get(norm) || SPKMOD_CART_SKINS_BY_CODE.get(Number(norm));
	if (!skin) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetCartSkinUiText("unknownCartSkinToast", skinId));
		}
		return false;
	}

	if (!spkmodIsCartSkinUnlocked(skin)) {
		if (!silentToast && typeof chatLog === "function") {
			chatLog(spkmodGetCartSkinUiText("lockedToast", skin.level, spkmodGetCartSkinDisplayName(skin)));
		}
		return false;
	}

	// Preload texture & FBX template immediately
	spkmodCartGetOrLoadSkinResource(skin.id, () => {
		_spkmodCartForceReconcile = true;
	});
	spkmodEnsureHwCartTemplate().then(() => {
		_spkmodCartForceReconcile = true;
	});

	window.spkmodCartSkinSettings.equippedId = skin.id;
	window.spkmodActivePumpkinSkin = skin.id;
	window.spkmodPumpkinCartTexReplaced = true;
	if (typeof window !== "undefined" && window.localStorage) {
		try { localStorage.setItem(SPKMOD_CART_SKIN_STORAGE_KEYS.equipped, skin.id); } catch (_) {}
	}
	_spkmodCartForceReconcile = true;
	spkmodReconcileAllCartSkins();

	if (broadcast && spkmodIsCartSkinChatSharingEnabled()) {
		spkmodTriggerCartSkinSyncBroadcast({
			priority: "explicit",
			delayMs: 900,
			forceResend: true,
			includeCartState: true,
			reason: "cart_equip"
		});
	}
	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetCartSkinUiText("equippedToast", spkmodGetCartSkinDisplayName(skin), skin.level));
	}
	spkmodRefreshCartSkinsModalUI();
	return true;
}

// Backward-compatible legacy API aliases
window.spkmodSelectPumpkinCartSkin = function(skinKey) {
	if (skinKey === null || skinKey === undefined || window.spkmodCartSkinSettings.equippedId === String(skinKey)) {
		return spkmodEquipLocalCartSkin(null, true, false);
	}
	return spkmodEquipLocalCartSkin(skinKey, true, false);
};
window.spkmodTogglePumpkinCartTexture = function(forcedState) {
	if (forcedState === false) return spkmodEquipLocalCartSkin(null, true, true);
	if (forcedState === true) return spkmodEquipLocalCartSkin("uifi", true, false);
	return spkmodEquipLocalCartSkin(window.spkmodCartSkinSettings.equippedId ? null : "uifi", true, false);
};

function spkmodSyncCartSkinsSystemUIState() {
	const enabled = spkmodIsCartSkinsSystemEnabled();
	if (typeof lunPanelElements !== "undefined" && lunPanelElements) {
		if (lunPanelElements.cartSkinsSystemToggleInput) {
			lunPanelElements.cartSkinsSystemToggleInput.checked = enabled;
		}
		if (lunPanelElements.cartSkinsBtn) {
			lunPanelElements.cartSkinsBtn.classList.toggle("hidden", !enabled);
		}
	}
	const btn = document.getElementById("spkmod-cart-skins-btn");
	if (btn) btn.classList.toggle("hidden", !enabled);
}

window.spkmodSetCartSkinsSystemEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	window.spkmodCartSkinSettings.enabled = enabled;
	window.spkmodCartSkinsSystemEnabled = enabled;
	if (typeof window !== "undefined" && window.localStorage) {
		try { localStorage.setItem(SPKMOD_CART_SKIN_STORAGE_KEYS.enabled, enabled ? "true" : "false"); } catch (_) {}
	}
	spkmodSyncCartSkinsSystemUIState();

	if (!enabled) {
		spkmodStopCartSkinsLoop();
		if (typeof gameState !== "undefined" && gameState?.mountVisuals?.entries) {
			for (const entry of gameState.mountVisuals.entries.values()) {
				if (entry && entry.cartGroup) spkmodClearSkinFromCartGroup(entry.cartGroup);
			}
		}
		if (_spkmodCartHadBroadcast && typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
			window.spkmodQueueUnifiedModSyncBroadcast({
				priority: "explicit",
				delayMs: 500,
				forceResend: true,
				includeCartState: true,
				reason: "cart_disable"
			});
		}
		const modal = document.getElementById("spkmod-cart-skins-modal");
		if (modal) modal.classList.add("hidden");
	} else {
		_spkmodCartLastObservedZoneId = null;
		_spkmodCartLastObservedRemoteCount = 0;
		_spkmodCartForceReconcile = true;
		spkmodStartCartSkinsLoopIfEnabled();
	}

	if (!silentToast && typeof chatLog === "function") {
		chatLog(spkmodGetCartSkinUiText(enabled ? "systemEnabledToast" : "systemDisabledToast"));
	}
	return enabled;
};

// ============================================================================
// 8. DEDICATED CART SKINS WARDROBE MODAL UI (#spkmod-cart-skins-modal)
// ============================================================================
function spkmodBuildCartSkinsModal() {
	let existing = document.getElementById("spkmod-cart-skins-modal");
	if (existing) return existing;

	if (!document.getElementById("spkmod-cart-skins-styles")) {
		const styleEl = document.createElement("style");
		styleEl.id = "spkmod-cart-skins-styles";
		styleEl.textContent = `
			#spkmod-cart-skins-modal {
				position: fixed;
				width: min(680px, calc(100vw - 24px));
				height: min(520px, calc(100vh - 32px));
				background: var(--spkmod-bg, rgba(15, 23, 42, 0.94));
				backdrop-filter: var(--spkmod-blur, blur(10px));
				border: 2px solid var(--spkmod-accent, #ffd54a);
				border-radius: 12px;
				color: #f8fafc;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				box-shadow: 0 16px 42px rgba(0, 0, 0, 0.65);
				z-index: 2147483645;
				font-family: Pretendard, system-ui, -apple-system, sans-serif;
			}
			#spkmod-cart-skins-modal.hidden { display: none !important; }
			body.spkmod-ui-hidden #spkmod-cart-skins-modal { display: none !important; }
			.spkmod-cart-grid-scroll {
				flex: 1 1 auto;
				min-height: 0;
				overflow-y: auto;
				padding: 12px 14px 16px;
				overscroll-behavior: contain;
				-webkit-overflow-scrolling: touch;
			}
			.spkmod-cart-grid-scroll::-webkit-scrollbar { width: 7px; }
			.spkmod-cart-grid-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.22); border-radius: 4px; }
			.spkmod-cart-grid-scroll::-webkit-scrollbar-thumb { background: rgba(255,213,74,0.45); border-radius: 4px; }
			.spkmod-cart-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
				gap: 10px;
			}
			.spkmod-cart-card {
				position: relative;
				background: rgba(30, 41, 59, 0.78);
				border: 1.5px solid rgba(148, 163, 184, 0.25);
				border-radius: 10px;
				padding: 10px;
				display: flex;
				flex-direction: column;
				gap: 7px;
				cursor: pointer;
				transition: transform 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease;
			}
			.spkmod-cart-card:hover {
				transform: translateY(-2px);
				border-color: var(--spkmod-accent, #ffd54a);
				box-shadow: 0 6px 18px rgba(0,0,0,0.35);
			}
			.spkmod-cart-card.equipped {
				border-color: #4ade80;
				background: rgba(20, 83, 45, 0.35);
				box-shadow: 0 0 14px rgba(74, 222, 128, 0.28);
			}
			.spkmod-cart-card.locked {
				opacity: 0.62;
				cursor: not-allowed;
			}
			.spkmod-cart-card.locked:hover {
				transform: none;
				border-color: rgba(148, 163, 184, 0.25);
				box-shadow: none;
			}
			.spkmod-cart-thumb-wrap {
				position: relative;
				width: 100%;
				height: 92px;
				border-radius: 8px;
				background: rgba(15, 23, 42, 0.85);
				border: 1px solid rgba(255,255,255,0.08);
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.spkmod-cart-thumb-wrap img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center top;
				display: block;
			}
		`;
		document.head.appendChild(styleEl);
	}

	const modal = document.createElement("div");
	modal.id = "spkmod-cart-skins-modal";
	modal.className = "spkmod-modal hidden";

	const header = document.createElement("div");
	header.id = "spkmod-cart-skins-header";
	header.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.12); cursor: move; user-select: none;";

	const titleEl = document.createElement("div");
	titleEl.id = "spkmod-cart-skins-title";
	titleEl.style.cssText = "font-size: 14px; font-weight: 800; color: var(--spkmod-accent, #ffd54a); display: flex; align-items: center; gap: 8px;";
	titleEl.innerText = spkmodGetCartSkinUiText("cartSkinsModalTitle");

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.innerText = "✕";
	closeBtn.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; border-radius: 6px; width: 26px; height: 26px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;";
	closeBtn.onclick = () => modal.classList.add("hidden");

	header.appendChild(titleEl);
	header.appendChild(closeBtn);

	const statusBar = document.createElement("div");
	statusBar.id = "spkmod-cart-skins-status-bar";
	statusBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(30, 41, 59, 0.65); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px;";

	const controlsBar = document.createElement("div");
	controlsBar.id = "spkmod-cart-skins-controls-bar";
	controlsBar.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 14px; background: rgba(15, 23, 42, 0.75); border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11.5px;";

	const gridScroll = document.createElement("div");
	gridScroll.className = "spkmod-cart-grid-scroll";
	const grid = document.createElement("div");
	grid.id = "spkmod-cart-skins-grid";
	grid.className = "spkmod-cart-grid";
	gridScroll.appendChild(grid);

	const footerBanner = document.createElement("div");
	footerBanner.id = "spkmod-cart-skins-footer";
	footerBanner.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 14px; background: linear-gradient(135deg, rgba(88, 101, 242, 0.22), rgba(245, 158, 11, 0.16)); border-top: 1px solid rgba(129, 140, 248, 0.45); font-size: 11.5px; color: #e2e8f0;";

	const resizeHandle = document.createElement("div");
	resizeHandle.id = "spkmod-cart-skins-resize";
	resizeHandle.style.cssText = "position: absolute; right: 2px; bottom: 2px; width: 16px; height: 16px; cursor: nwse-resize; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px; user-select: none;";
	resizeHandle.innerText = "◢";

	modal.appendChild(header);
	modal.appendChild(statusBar);
	modal.appendChild(controlsBar);
	modal.appendChild(gridScroll);
	modal.appendChild(footerBanner);
	modal.appendChild(resizeHandle);
	document.body.appendChild(modal);

	if (typeof lunHudElements !== "undefined") {
		lunHudElements.cartSkinsModal = modal;
	}
	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header]);
	}
	if (typeof makeResizable === "function") {
		makeResizable(modal, resizeHandle, 340, 320);
	}

	gridScroll.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	gridScroll.addEventListener("touchmove", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("wheel", (e) => { e.stopPropagation(); }, { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});
	for (const el of [statusBar, controlsBar, gridScroll, footerBanner]) {
		el.addEventListener("pointerdown", (e) => e.stopPropagation());
		el.addEventListener("mousedown", (e) => e.stopPropagation());
	}

	spkmodRefreshCartSkinsModalUI();
	return modal;
}

function spkmodRefreshCartSkinsModalUI() {
	const modal = document.getElementById("spkmod-cart-skins-modal");
	if (!modal) return;

	const titleEl = document.getElementById("spkmod-cart-skins-title");
	if (titleEl) titleEl.innerText = spkmodGetCartSkinUiText("cartSkinsModalTitle");

	const activeSkin = window.spkmodCartSkinSettings.equippedId
		? SPKMOD_CART_SKINS_BY_ID.get(window.spkmodCartSkinSettings.equippedId)
		: null;

	// Status bar
	const statusBar = document.getElementById("spkmod-cart-skins-status-bar");
	if (statusBar) {
		statusBar.innerHTML = "";
		const lvl = spkmodGetCartPlayerLevel();
		const unlockedCount = SPKMOD_CART_SKIN_CATALOG.filter(spkmodIsCartSkinUnlocked).length;
		const infoDiv = document.createElement("div");
		infoDiv.style.cssText = "display: flex; flex-direction: column; gap: 3px;";
		const activeRow = document.createElement("div");
		activeRow.style.cssText = "display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-weight: 700;";
		activeRow.innerHTML = `
			<span>⭐ ${spkmodGetCartSkinUiText("myLevelLabel")}: <strong style="color:#ffd54a;">Lv.${lvl}</strong></span>
			<span>🔓 ${spkmodGetCartSkinUiText("unlockedLabel")}: <strong style="color:#7dd3fc;">${unlockedCount}/${SPKMOD_CART_SKIN_CATALOG.length}</strong></span>
			<span><span style="color:#94a3b8;">${spkmodGetCartSkinUiText("activeLabel")}:</span> <strong style="color:${activeSkin ? "#4ade80" : "#cbd5e1"};">${activeSkin ? spkmodGetCartSkinDisplayName(activeSkin) : spkmodGetCartSkinUiText("noneEquipped")}</strong></span>
		`;
		const hintRow = document.createElement("div");
		hintRow.style.cssText = "font-size: 10.5px; color: #94a3b8;";
		hintRow.innerText = "✨ " + spkmodGetCartSkinUiText("worksOnBothHint");
		infoDiv.appendChild(activeRow);
		infoDiv.appendChild(hintRow);

		const actions = document.createElement("div");
		actions.style.cssText = "display: flex; align-items: center; gap: 6px;";

		if (activeSkin) {
			const unequipBtn = document.createElement("button");
			unequipBtn.type = "button";
			unequipBtn.className = "spkmod-panel-btn";
			unequipBtn.style.cssText = "padding: 4px 10px; font-size: 11px; color: #fca5a5; cursor: pointer;";
			unequipBtn.innerText = "✕ " + spkmodGetCartSkinUiText("btnUnequip");
			unequipBtn.onclick = () => spkmodEquipLocalCartSkin(null, true, false);
			actions.appendChild(unequipBtn);
		}

		const syncBtn = document.createElement("button");
		syncBtn.type = "button";
		syncBtn.className = "spkmod-panel-btn";
		syncBtn.style.cssText = "padding: 4px 10px; font-size: 11px; color: #38bdf8; cursor: pointer;";
		syncBtn.innerText = spkmodGetCartSkinUiText("btnResync");
		syncBtn.onclick = () => {
			if (!spkmodIsCartSkinChatSharingEnabled()) {
				if (typeof chatLog === "function") chatLog(spkmodGetCartSkinUiText("shareInChatDisabledToast"));
				return;
			}
			spkmodTriggerCartSkinSyncBroadcast({
				priority: "explicit",
				delayMs: 250,
				forceResend: true,
				includeCartState: true,
				reason: "cart_manual_sync"
			});
			if (typeof chatLog === "function") chatLog(spkmodGetCartSkinUiText("broadcastToast"));
		};
		actions.appendChild(syncBtn);

		statusBar.appendChild(infoDiv);
		statusBar.appendChild(actions);
	}

	// Controls bar (Remote visibility + Chat sharing toggles)
	const controlsBar = document.getElementById("spkmod-cart-skins-controls-bar");
	if (controlsBar) {
		controlsBar.innerHTML = "";
		const makeToggle = (labelText, checked, onChange) => {
			const lbl = document.createElement("label");
			lbl.style.cssText = "display: inline-flex; align-items: center; gap: 6px; cursor: pointer; color: #e2e8f0; user-select: none;";
			const cb = document.createElement("input");
			cb.type = "checkbox";
			cb.checked = !!checked;
			cb.onchange = (e) => onChange(e.target.checked);
			const sp = document.createElement("span");
			sp.innerText = labelText;
			lbl.appendChild(cb);
			lbl.appendChild(sp);
			return lbl;
		};

		controlsBar.appendChild(makeToggle(
			spkmodGetCartSkinUiText("toggleRemoteCartSkins"),
			window.spkmodCartSkinSettings.showRemoteCartSkins !== false,
			(val) => {
				window.spkmodCartSkinSettings.showRemoteCartSkins = !!val;
				if (window.localStorage) localStorage.setItem(SPKMOD_CART_SKIN_STORAGE_KEYS.showRemote, val ? "true" : "false");
				_spkmodCartForceReconcile = true;
				spkmodReconcileAllCartSkins();
			}
		));

		controlsBar.appendChild(makeToggle(
			spkmodGetCartSkinUiText("toggleShareInChat"),
			window.spkmodCartSkinSettings.shareInChat !== false,
			(val) => {
				window.spkmodCartSkinSettings.shareInChat = !!val;
				if (window.localStorage) localStorage.setItem(SPKMOD_CART_SKIN_STORAGE_KEYS.shareInChat, val ? "true" : "false");
				if (val && window.spkmodCartSkinSettings.equippedId) {
					spkmodTriggerCartSkinSyncBroadcast({
						priority: "explicit",
						delayMs: 500,
						forceResend: true,
						includeCartState: true,
						reason: "cart_share_on"
					});
				} else if (!val && _spkmodCartHadBroadcast && typeof window.spkmodQueueUnifiedModSyncBroadcast === "function") {
					window.spkmodQueueUnifiedModSyncBroadcast({
						priority: "explicit",
						delayMs: 500,
						forceResend: true,
						includeCartState: true,
						reason: "cart_share_off"
					});
				}
			}
		));
	}

	// Skins grid
	const grid = document.getElementById("spkmod-cart-skins-grid");
	if (grid) {
		grid.innerHTML = "";
		for (const skin of SPKMOD_CART_SKIN_CATALOG) {
			const unlocked = spkmodIsCartSkinUnlocked(skin);
			const isEquipped = window.spkmodCartSkinSettings.equippedId === skin.id;
			const card = document.createElement("div");
			card.className = "spkmod-cart-card" + (isEquipped ? " equipped" : "") + (!unlocked ? " locked" : "");

			const thumbWrap = document.createElement("div");
			thumbWrap.className = "spkmod-cart-thumb-wrap";
			const img = document.createElement("img");
			img.src = skin.url;
			img.alt = spkmodGetCartSkinDisplayName(skin);
			img.loading = "lazy";
			if (!unlocked) img.style.filter = "grayscale(0.6) brightness(0.65)";
			thumbWrap.appendChild(img);

			const lvlBadge = document.createElement("span");
			lvlBadge.style.cssText = `position: absolute; top: 5px; left: 5px; padding: 2px 6px; border-radius: 6px; font-size: 9.5px; font-weight: 800; background: rgba(15,23,42,0.88); color: ${unlocked ? "#7dd3fc" : "#f87171"}; border: 1px solid rgba(255,255,255,0.16);`;
			lvlBadge.innerText = `Lv.${skin.level || 1}` + (skin.milestone ? " ★" : "");
			thumbWrap.appendChild(lvlBadge);

			const badge = document.createElement("span");
			badge.style.cssText = `position: absolute; top: 5px; right: 5px; padding: 2px 6px; border-radius: 6px; font-size: 9.5px; font-weight: 800; background: rgba(15,23,42,0.85); color: ${skin.animated ? "#f472b6" : "#94a3b8"}; border: 1px solid rgba(255,255,255,0.14);`;
			badge.innerText = spkmodGetCartSkinUiText(skin.animated ? "animatedBadge" : "staticBadge");
			thumbWrap.appendChild(badge);

			const nameRow = document.createElement("div");
			nameRow.style.cssText = "display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: #f8fafc;";
			const iconSpan = document.createElement("span");
			if (skin.icon.startsWith(":") && skin.icon.endsWith(":") && typeof renderSpkmodInlineEmojis === "function") {
				iconSpan.innerHTML = renderSpkmodInlineEmojis(skin.icon, "height: 18px; width: 18px; object-fit: contain; vertical-align: middle;");
			} else {
				iconSpan.innerText = skin.emojiFallback || skin.icon;
			}
			const nameSpan = document.createElement("span");
			nameSpan.style.cssText = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
			nameSpan.innerText = spkmodGetCartSkinDisplayName(skin);
			nameRow.appendChild(iconSpan);
			nameRow.appendChild(nameSpan);

			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "spkmod-panel-btn";
			btn.style.cssText = isEquipped
				? "width: 100%; padding: 5px 8px; font-size: 11px; font-weight: 800; color: #bbf7d0; border-color: #4ade80; background: rgba(22, 163, 74, 0.35); cursor: pointer;"
				: (unlocked
					? "width: 100%; padding: 5px 8px; font-size: 11px; font-weight: 700; color: #f8fafc; cursor: pointer;"
					: "width: 100%; padding: 5px 8px; font-size: 10.5px; font-weight: 700; color: #94a3b8; cursor: not-allowed;");
			btn.innerText = !unlocked
				? spkmodGetCartSkinUiText("btnLocked", skin.level || 1)
				: spkmodGetCartSkinUiText(isEquipped ? "btnEquipped" : "btnEquip");

			const onSelect = (e) => {
				if (e) e.stopPropagation();
				if (!unlocked) {
					if (typeof chatLog === "function") chatLog(spkmodGetCartSkinUiText("lockedToast", skin.level || 1, spkmodGetCartSkinDisplayName(skin)));
					return;
				}
				if (isEquipped) {
					spkmodEquipLocalCartSkin(null, true, false);
				} else {
					spkmodEquipLocalCartSkin(skin.id, true, false);
				}
			};
			btn.onclick = onSelect;
			card.onclick = onSelect;

			card.appendChild(thumbWrap);
			card.appendChild(nameRow);
			card.appendChild(btn);
			grid.appendChild(card);
		}
	}

	// Community submission Discord footer banner
	const footerBanner = document.getElementById("spkmod-cart-skins-footer");
	if (footerBanner) {
		footerBanner.innerHTML = "";
		const msg = document.createElement("div");
		msg.style.cssText = "flex: 1 1 260px; line-height: 1.35; font-weight: 600;";
		msg.innerText = "🎨 " + spkmodGetCartSkinUiText("submissionBannerText");

		const discordBtn = document.createElement("button");
		discordBtn.type = "button";
		discordBtn.className = "spkmod-panel-btn";
		discordBtn.style.cssText = "padding: 5px 12px; font-size: 11px; font-weight: 800; color: #ffffff; background: #5865F2; border-color: #818cf8; border-radius: 7px; cursor: pointer; white-space: nowrap;";
		discordBtn.innerText = spkmodGetCartSkinUiText("submissionBannerBtn");
		discordBtn.title = SPKMOD_CART_DISCORD_URL;
		discordBtn.onclick = () => {
			const onCopied = () => {
				discordBtn.innerText = spkmodGetCartSkinUiText("submissionBannerCopied");
				discordBtn.style.background = "#16a34a";
				discordBtn.style.borderColor = "#4ade80";
				if (typeof chatLog === "function") {
					chatLog(spkmodGetCartSkinUiText("submissionBannerCopiedToast", SPKMOD_CART_DISCORD_URL));
				}
				setTimeout(() => {
					discordBtn.innerText = spkmodGetCartSkinUiText("submissionBannerBtn");
					discordBtn.style.background = "#5865F2";
					discordBtn.style.borderColor = "#818cf8";
				}, 2000);
			};
			const fallbackCopy = () => {
				try {
					const ta = document.createElement("textarea");
					ta.value = SPKMOD_CART_DISCORD_URL;
					ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;";
					document.body.appendChild(ta);
					ta.focus();
					ta.select();
					document.execCommand("copy");
					document.body.removeChild(ta);
				} catch (_) {}
				onCopied();
			};
			if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
				navigator.clipboard.writeText(SPKMOD_CART_DISCORD_URL).then(onCopied, fallbackCopy);
			} else {
				fallbackCopy();
			}
		};

		footerBanner.appendChild(msg);
		footerBanner.appendChild(discordBtn);
	}
}
window.spkmodRefreshCartSkinsModalUI = spkmodRefreshCartSkinsModalUI;

window.spkmodToggleCartSkinsModal = function(forceState) {
	if (!spkmodIsCartSkinsSystemEnabled()) {
		if (typeof chatLog === "function") chatLog(spkmodGetCartSkinUiText("systemDisabledToast"));
		return;
	}
	const modal = spkmodBuildCartSkinsModal();
	const isHidden = modal.classList.contains("hidden");
	const shouldOpen = forceState !== undefined ? !!forceState : isHidden;
	if (shouldOpen) {
		modal.classList.remove("hidden");
		spkmodRefreshCartSkinsModalUI();
		if (typeof positionModalNicely === "function") positionModalNicely(modal);
		if (typeof bringToFront === "function") bringToFront(modal);
	} else {
		modal.classList.add("hidden");
	}
};

// Hotkey Alt+C to toggle Cart Skins Wardrobe
if (typeof document !== "undefined" && !window.__spkmodCartSkinsHotkeyInstalled) {
	window.__spkmodCartSkinsHotkeyInstalled = true;
	document.addEventListener("keydown", (e) => {
		if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "c" || e.key === "C" || e.code === "KeyC")) {
			const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (!spkmodIsCartSkinsSystemEnabled()) return;
			e.preventDefault();
			window.spkmodToggleCartSkinsModal();
		}
	});
}

// Public API for console, chat commands & unit tests
window.spkmodCartSkins = {
	catalog: SPKMOD_CART_SKIN_CATALOG,
	byId: SPKMOD_CART_SKINS_BY_ID,
	equip: (id) => spkmodEquipLocalCartSkin(id, true, false),
	unequip: () => spkmodEquipLocalCartSkin(null, true, false),
	toggleModal: (force) => window.spkmodToggleCartSkinsModal(force),
	reconcile: () => spkmodReconcileAllCartSkins(),
	setEnabled: (val) => window.spkmodSetCartSkinsSystemEnabled(val),
	unlockAll: (force) => {
		const next = force !== undefined ? !!force : !window.spkmodCartSkinSettings.unlockAllTest;
		window.spkmodCartSkinSettings.unlockAllTest = next;
		if (typeof window !== "undefined" && window.localStorage) {
			try { localStorage.setItem(SPKMOD_CART_SKIN_STORAGE_KEYS.unlockAll, next ? "true" : "false"); } catch (_) {}
		}
		if (typeof chatLog === "function") {
			chatLog(spkmodGetCartSkinUiText(next ? "testUnlockEnabledToast" : "testUnlockDisabledToast"));
		}
		_spkmodCartForceReconcile = true;
		spkmodRefreshCartSkinsModalUI();
		return next;
	}
};

// Auto-start loop if enabled & preload saved skin
if (typeof window !== "undefined") {
	spkmodSyncCartSkinsSystemUIState();
	if (window.spkmodCartSkinSettings.equippedId) {
		spkmodCartGetOrLoadSkinResource(window.spkmodCartSkinSettings.equippedId);
	}
	if (typeof requestAnimationFrame === "function" && spkmodIsCartSkinsSystemEnabled()) {
		spkmodStartCartSkinsLoopIfEnabled();
	}
}
