// ============================================================================
// PUMPKIN CART TEXTURE REPLACEMENT SKINS (:SPK_88:, 1, 2, 3)
// ============================================================================
const SPKMOD_PUMPKIN_CART_ORIG_TEX = "https://speakirpg.overture.io.kr/models/mount_pumpkin_cart_halloween/HW_Map_Body.png";

const SPKMOD_PUMPKIN_CART_SKINS = {
	uifi: { id: "uifi", label: ":SPK_88:", file: "test.png", url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test.png" },
	1: { id: "1", label: "1️⃣", file: "test2.png", url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test2.png" },
	2: { id: "2", label: "2️⃣", file: "test3.png", url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test3.png" },
	3: { id: "3", label: "3️⃣", file: "test4.png", url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/test4.png" },
	4: { id: "4", label: "4️⃣ ", file: "dancing.webp", url: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/assets/dancing.webp" }
};

window.spkmodActivePumpkinSkin = null;
window.spkmodPumpkinCartTexReplaced = false;
const _spkmodCartImages = {};
let _spkmodOriginalCartImage = null;
let _spkmodCartAnimationLoopId = null;
let _spkmodCartAnimFrames = null;
let _spkmodCartAnimCanvas = null;
let _spkmodCartAnimCurrentIndex = 0;

function spkmodStopCartAnimation() {
	if (_spkmodCartAnimationLoopId) {
		clearTimeout(_spkmodCartAnimationLoopId);
		_spkmodCartAnimationLoopId = null;
	}
	if (Array.isArray(_spkmodCartAnimFrames)) {
		for (const frame of _spkmodCartAnimFrames) {
			if (frame && frame.bitmap && typeof frame.bitmap.close === "function") {
				try { frame.bitmap.close(); } catch (_) {}
			}
		}
		_spkmodCartAnimFrames = null;
	}
	_spkmodCartAnimCurrentIndex = 0;
}

function spkmodIsAnimatedUrl(url) {
	if (typeof url !== "string") return false;
	const clean = url.split("?")[0].toLowerCase();
	return clean.endsWith(".webp") || clean.endsWith(".gif") || clean.endsWith(".apng");
}

async function spkmodDecodeAnimatedImage(url) {
	if (typeof window.ImageDecoder === "undefined") {
		throw new Error("ImageDecoder not supported in this environment");
	}
	const res = await fetch(url, { mode: "cors" });
	if (!res.ok) throw new Error(`HTTP error ${res.status}`);
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
			: 83; // default ~12 fps (83ms)
		frames.push({
			bitmap: frameResult.image,
			duration: durationMs,
			width: frameResult.image.displayWidth || 512,
			height: frameResult.image.displayHeight || 512
		});
	}
	return frames;
}

function spkmodStartCartAnimation(frames, skinKey) {
	spkmodStopCartAnimation();
	if (!frames || frames.length === 0) return;

	_spkmodCartAnimFrames = frames;
	const width = frames[0].width || 512;
	const height = frames[0].height || 512;

	if (!_spkmodCartAnimCanvas) {
		_spkmodCartAnimCanvas = document.createElement("canvas");
	}
	_spkmodCartAnimCanvas.width = width;
	_spkmodCartAnimCanvas.height = height;
	const ctx = _spkmodCartAnimCanvas.getContext("2d");

	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(frames[0].bitmap, 0, 0, width, height);
	spkmodApplyPumpkinCartTextureToScene(true, _spkmodCartAnimCanvas);

	if (frames.length <= 1) return;

	_spkmodCartAnimCurrentIndex = 0;
	function tick() {
		if (window.spkmodActivePumpkinSkin !== skinKey) {
			spkmodStopCartAnimation();
			return;
		}
		_spkmodCartAnimCurrentIndex = (_spkmodCartAnimCurrentIndex + 1) % _spkmodCartAnimFrames.length;
		const curFrame = _spkmodCartAnimFrames[_spkmodCartAnimCurrentIndex];
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(curFrame.bitmap, 0, 0, width, height);

		if (typeof gameState !== "undefined" && gameState && gameState.scene) {
			gameState.scene.traverse(child => {
				if (child.isMesh && child.material) {
					const mats = Array.isArray(child.material) ? child.material : [child.material];
					for (const m of mats) {
						if (m && m.map && m.map.image === _spkmodCartAnimCanvas) {
							m.map.needsUpdate = true;
						}
					}
				}
			});
		}

		_spkmodCartAnimationLoopId = setTimeout(tick, curFrame.duration);
	}

	_spkmodCartAnimationLoopId = setTimeout(tick, frames[0].duration);
}

window.spkmodPlayAnimatedCartTexture = function (url, skinKey = "custom_anim") {
	spkmodEnsurePumpkinCartHooks();
	window.spkmodActivePumpkinSkin = skinKey;
	window.spkmodPumpkinCartTexReplaced = true;
	spkmodDecodeAnimatedImage(url).then(frames => {
		if (window.spkmodActivePumpkinSkin === skinKey) {
			spkmodStartCartAnimation(frames, skinKey);
		}
	}).catch(err => {
		console.warn("[SpeakiMod] Animated texture error:", err);
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			if (window.spkmodActivePumpkinSkin === skinKey) {
				spkmodApplyPumpkinCartTextureToScene(true, img);
			}
		};
		img.src = url;
	});
	spkmodUpdatePumpkinCartButtonStyles();
};

function spkmodGetCurrentPumpkinSkinUrl() {
	if (!window.spkmodActivePumpkinSkin) return null;
	const skin = SPKMOD_PUMPKIN_CART_SKINS[window.spkmodActivePumpkinSkin];
	return skin ? skin.url : null;
}

function spkmodEnsurePumpkinCartHooks() {
	if (window.__spkmodPumpkinCartHooksInstalled) return;
	window.__spkmodPumpkinCartHooksInstalled = true;

	const imgProto = typeof HTMLImageElement !== 'undefined' ? HTMLImageElement.prototype : null;
	if (imgProto) {
		const desc = Object.getOwnPropertyDescriptor(imgProto, "src");
		if (desc && desc.set) {
			const origSrcSet = desc.set;
			Object.defineProperty(imgProto, "src", {
				set: function (val) {
					const targetUrl = spkmodGetCurrentPumpkinSkinUrl();
					if (targetUrl && typeof val === "string" && val.includes("HW_Map_Body.png")) {
						val = targetUrl;
					}
					return origSrcSet.call(this, val);
				},
				get: desc.get,
				configurable: true,
				enumerable: true
			});
		}
	}

	if (typeof window.fetch === "function") {
		const origFetch = window.fetch;
		window.fetch = function (resource, config) {
			const targetUrl = spkmodGetCurrentPumpkinSkinUrl();
			if (targetUrl) {
				if (typeof resource === "string" && resource.includes("HW_Map_Body.png")) {
					resource = targetUrl;
				} else if (resource && typeof resource.url === "string" && resource.url.includes("HW_Map_Body.png")) {
					resource = new Request(targetUrl, resource);
				}
			}
			return origFetch.apply(this, arguments);
		};
	}

	if (typeof XMLHttpRequest !== "undefined" && XMLHttpRequest.prototype && XMLHttpRequest.prototype.open) {
		const origXhrOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function (method, url, ...rest) {
			const targetUrl = spkmodGetCurrentPumpkinSkinUrl();
			if (targetUrl && typeof url === "string" && url.includes("HW_Map_Body.png")) {
				url = targetUrl;
			}
			return origXhrOpen.call(this, method, url, ...rest);
		};
	}
}

function spkmodGetCartSkinImage(skinKey, callback) {
	const skin = SPKMOD_PUMPKIN_CART_SKINS[skinKey];
	if (!skin) return;
	if (_spkmodCartImages[skinKey] && _spkmodCartImages[skinKey].complete) {
		callback(_spkmodCartImages[skinKey]);
		return;
	}
	const img = new Image();
	img.crossOrigin = "anonymous";
	img.onload = () => {
		_spkmodCartImages[skinKey] = img;
		callback(img);
	};
	img.src = skin.url;
}

function spkmodGetOriginalCartImage(callback) {
	if (_spkmodOriginalCartImage && _spkmodOriginalCartImage.complete) {
		callback(_spkmodOriginalCartImage);
		return;
	}
	const img = new Image();
	img.crossOrigin = "anonymous";
	img.onload = () => {
		_spkmodOriginalCartImage = img;
		callback(img);
	};
	img.onerror = () => {
		const img2 = new Image();
		img2.onload = () => {
			_spkmodOriginalCartImage = img2;
			callback(img2);
		};
		img2.src = SPKMOD_PUMPKIN_CART_ORIG_TEX;
	};
	img.src = SPKMOD_PUMPKIN_CART_ORIG_TEX;
}

function spkmodApplyPumpkinCartTextureToScene(enable, targetImage) {
	if (typeof gameState === "undefined" || !gameState) return;
	const scene = gameState.scene;
	if (!scene || typeof scene.traverse !== "function") return;

	const applyToMat = (mat, childName) => {
		if (!mat) return;
		const mats = Array.isArray(mat) ? mat : [mat];
		for (const m of mats) {
			if (!m) continue;
			const cName = (childName || "").toLowerCase();
			const mName = (m.name || "").toLowerCase();
			const imgSrc = (m.map && m.map.image && typeof m.map.image.src === "string") ? m.map.image.src : "";
			const isCartMap = (m.map && m.map.image && (
				imgSrc.includes("HW_Map_Body") || imgSrc.includes("test") || imgSrc.includes("mount_pumpkin_cart") ||
				mName.includes("hw_map_body") || mName.includes("pumpkin")
			)) || cName.includes("pumpkin") || cName.includes("hw_map");

			if (isCartMap || (m.__spkmodOrigCartImage !== undefined) || (m.__spkmodOrigCartMap !== undefined)) {
				if (m.__spkmodOrigCartImage === undefined && m.map && m.map.image) {
					m.__spkmodOrigCartImage = m.map.image;
				}
				if (m.__spkmodOrigCartMap === undefined && m.map) {
					m.__spkmodOrigCartMap = m.map;
				}
				if (enable) {
					if (targetImage) {
						if (m.map) {
							m.map.image = targetImage;
							m.map.needsUpdate = true;
						}
					}
					m.needsUpdate = true;
				} else {
					const origImg = m.__spkmodOrigCartImage || _spkmodOriginalCartImage;
					if (origImg && m.map) {
						m.map.image = origImg;
						m.map.needsUpdate = true;
					} else if (m.__spkmodOrigCartMap) {
						m.map = m.__spkmodOrigCartMap;
						if (m.map) m.map.needsUpdate = true;
					}
					m.needsUpdate = true;
				}
			}
		}
	};

	scene.traverse(child => {
		if (child.isMesh && child.material) {
			applyToMat(child.material, child.name);
		}
	});
}

function spkmodUpdatePumpkinCartButtonStyles() {
	if (typeof lunPanelElements === "undefined" || !lunPanelElements) return;
	const btnMap = {
		uifi: lunPanelElements.pumpkinCartTexBtn,
		1: lunPanelElements.pumpkinCartTexBtn1,
		2: lunPanelElements.pumpkinCartTexBtn2,
		3: lunPanelElements.pumpkinCartTexBtn3
	};
	for (const [key, btn] of Object.entries(btnMap)) {
		if (!btn) continue;
		const isCurrent = window.spkmodActivePumpkinSkin === key;
		btn.style.border = isCurrent ? "1px solid #4ade80" : "";
		btn.style.boxShadow = isCurrent ? "0 0 8px rgba(74, 222, 128, 0.45)" : "";
	}
}
window.spkmodUpdatePumpkinCartButtonStyles = spkmodUpdatePumpkinCartButtonStyles;

window.spkmodSelectPumpkinCartSkin = function (skinKey) {
	spkmodEnsurePumpkinCartHooks();

	if (skinKey === null || skinKey === undefined || window.spkmodActivePumpkinSkin === skinKey) {
		window.spkmodActivePumpkinSkin = null;
		window.spkmodPumpkinCartTexReplaced = false;
		spkmodStopCartAnimation();
		if (!_spkmodOriginalCartImage) {
			spkmodGetOriginalCartImage(() => {
				spkmodApplyPumpkinCartTextureToScene(false);
			});
		} else {
			spkmodApplyPumpkinCartTextureToScene(false);
		}
		spkmodUpdatePumpkinCartButtonStyles();
		if (typeof chatLog === "function") {
			chatLog("🎃 Pumpkin Cart Texture: RESTORED (Original)");
		}
		return;
	}

	const skin = SPKMOD_PUMPKIN_CART_SKINS[skinKey];
	if (!skin) return;

	window.spkmodActivePumpkinSkin = skinKey;
	window.spkmodPumpkinCartTexReplaced = true;

	if (spkmodIsAnimatedUrl(skin.url)) {
		spkmodDecodeAnimatedImage(skin.url).then(frames => {
			if (window.spkmodActivePumpkinSkin === skinKey) {
				spkmodStartCartAnimation(frames, skinKey);
			}
		}).catch(err => {
			console.warn("[SpeakiMod] Animated texture decode error, falling back to static:", err);
			spkmodGetCartSkinImage(skinKey, img => {
				if (window.spkmodActivePumpkinSkin === skinKey) {
					spkmodApplyPumpkinCartTextureToScene(true, img);
				}
			});
		});
	} else {
		spkmodStopCartAnimation();
		spkmodGetCartSkinImage(skinKey, img => {
			if (window.spkmodActivePumpkinSkin === skinKey) {
				spkmodApplyPumpkinCartTextureToScene(true, img);
			}
		});
	}
	spkmodUpdatePumpkinCartButtonStyles();

	if (typeof chatLog === "function") {
		chatLog(`🎃 Pumpkin Cart Texture (${skin.label}): INJECTED (${skin.file})`);
	}
};

window.spkmodTogglePumpkinCartTexture = function (forcedState) {
	if (forcedState === false) {
		window.spkmodSelectPumpkinCartSkin(null);
	} else if (forcedState === true) {
		window.spkmodSelectPumpkinCartSkin("uifi");
	} else {
		window.spkmodSelectPumpkinCartSkin(window.spkmodActivePumpkinSkin ? null : "uifi");
	}
};

// ============================================================================
// COOKING ANIMATIONS & PROPS (Chop, Stir, Plate, Serve, Carry)
// ============================================================================

window.spkmodCookingState = {
	active: false,
	type: null,
	props: [],
	savedStaffVisibility: null
};

let _spkmodThreePromise = null;
async function spkmodEnsureThree() {
	if (typeof window.THREE !== 'undefined' && window.THREE.Group && window.THREE.Mesh && window.THREE.BoxGeometry) {
		return window.THREE;
	}
	if (_spkmodThreePromise) return _spkmodThreePromise;

	_spkmodThreePromise = (async () => {
		try {
			const threeMod = await import('https://esm.sh/v135/three@0.185.0');
			window.THREE = Object.assign(window.THREE || {}, threeMod);
			return window.THREE;
		} catch (e) {
			console.warn("[SpeakiMod+] Failed to load Three.js from CDN:", e);
		}
		return window.THREE;
	})();

	return _spkmodThreePromise;
}

// Background prefetch Three.js so props spawn with zero lag
setTimeout(() => {
	spkmodEnsureThree().catch(() => {});
}, 1200);

let _spkmodFBXLoaderClass = null;
async function spkmodEnsureFBXLoader() {
	if (_spkmodFBXLoaderClass) return _spkmodFBXLoaderClass;
	await spkmodEnsureThree();
	if (window.THREE && window.THREE.FBXLoader) {
		_spkmodFBXLoaderClass = window.THREE.FBXLoader;
		return _spkmodFBXLoaderClass;
	}
	try {
		const mod = await import('https://esm.sh/v135/three@0.185.0/examples/jsm/loaders/FBXLoader.js');
		_spkmodFBXLoaderClass = mod.FBXLoader;
		if (window.THREE) window.THREE.FBXLoader = mod.FBXLoader;
		return _spkmodFBXLoaderClass;
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load FBXLoader:", e);
		return null;
	}
}

const _spkmodLoadedCookingClips = {};
async function spkmodLoadCookingAnimation(clipName) {
	const ctrl = gameState?.localAnimationController;
	if (!ctrl) return false;
	if (ctrl.actions) {
		if (ctrl.actions instanceof Map) {
			if (ctrl.actions.has(clipName)) return true;
		} else if (ctrl.actions[clipName]) {
			return true;
		}
	}
	if (_spkmodLoadedCookingClips[clipName]) {
		const clip = _spkmodLoadedCookingClips[clipName];
		if (ctrl && ctrl.mixer) {
			const action = ctrl.mixer.clipAction(clip);
			if (ctrl.actions instanceof Map) {
				ctrl.actions.set(clipName, action);
			}
			ctrl.actions[clipName] = action;
			return true;
		}
	}
	const Loader = await spkmodEnsureFBXLoader();
	if (!Loader) return false;
	const loader = new Loader();
	const url = `/models/speaki/animations/${clipName}.fbx`;
	return new Promise((resolve) => {
		loader.load(url, (fbx) => {
			if (fbx.animations && fbx.animations.length > 0) {
				const clip = fbx.animations[0];
				clip.name = clipName;
				_spkmodLoadedCookingClips[clipName] = clip;
				if (ctrl && ctrl.mixer) {
					const action = ctrl.mixer.clipAction(clip);
					if (ctrl.actions instanceof Map) {
						ctrl.actions.set(clipName, action);
					}
					ctrl.actions[clipName] = action;
					resolve(true);
					return;
				}
			}
			resolve(false);
		}, undefined, (err) => {
			console.warn("[SpeakiMod+] Error loading FBX animation:", clipName, err);
			resolve(false);
		});
	});
}

function spkmodGetAvatarBone(side = 'right') {
	const isRight = (side === 'right' || side === 'rhand' || side === 'righthand');
	const roots = [
		gameState?.localAvatar?.root,
		gameState?.localAvatarPose,
		gameState?.playerContainer
	].filter(Boolean);

	if (roots.length === 0) return null;

	const sanitize = s => (s || '').toLowerCase().replace(/[^a-z]/g, '');
	const targets = isRight ? ['rhand', 'righthand'] : ['lhand', 'lefthand'];
	const fallbackRegex = isRight
		? /right.?hand|r.?hand|bip001.*r.*hand|bone.*009/i
		: /left.?hand|l.?hand|bip001.*l.*hand|bone.*007/i;

	for (const root of roots) {
		// 1. If right hand: check if weapon / staff group is attached to a hand bone
		if (isRight) {
			let foundBone = null;
			root.traverse((child) => {
				if (foundBone) return;
				if (child.userData && child.userData.speakiMagicStaff) {
					if (child.parent && child.parent !== root) {
						foundBone = child.parent;
					}
				}
			});
			if (foundBone) {
				console.log("[SpeakiMod+] Found right hand bone via speakiMagicStaff parent:", foundBone.name);
				return foundBone;
			}
		}

		// 2. Check SkinnedMesh skeleton bones if present
		let foundBone = null;
		root.traverse((child) => {
			if (foundBone) return;
			if (child.skeleton && Array.isArray(child.skeleton.bones)) {
				for (const b of child.skeleton.bones) {
					const s = sanitize(b.name);
					if (targets.some(t => s.includes(t)) && !s.includes('finger')) {
						foundBone = b;
						return;
					}
				}
				if (!foundBone) {
					for (const b of child.skeleton.bones) {
						if (fallbackRegex.test(b.name) && !b.name.toLowerCase().includes('finger')) {
							foundBone = b;
							return;
						}
					}
				}
			}
		});
		if (foundBone) {
			console.log(`[SpeakiMod+] Found ${side} hand bone via SkinnedMesh skeleton:`, foundBone.name);
			return foundBone;
		}

		// 3. Traverse all nodes and collect any Bone or named node
		const candidates = [];
		root.traverse((child) => {
			if (child.isBone || child.type === 'Bone' || child.constructor?.name === 'Bone' || child.name) {
				candidates.push(child);
			}
		});

		// A. Exact game match: sanitize name and check target keywords without finger
		for (const target of targets) {
			const b = candidates.find(c => {
				const s = sanitize(c.name);
				return s.includes(target) && !s.includes('finger');
			});
			if (b) {
				console.log(`[SpeakiMod+] Found ${side} hand bone via sanitized target (${target}):`, b.name);
				return b;
			}
		}

		// B. Fallback regex match
		const regexMatch = candidates.find(c => fallbackRegex.test(c.name) && !c.name.toLowerCase().includes('finger'));
		if (regexMatch) {
			console.log(`[SpeakiMod+] Found ${side} hand bone via fallback regex:`, regexMatch.name);
			return regexMatch;
		}

		// C. Fallback: match any node containing 'hand' and 'right' / 'left'
		const genericMatch = candidates.find(c => {
			const lower = (c.name || '').toLowerCase();
			if (isRight) {
				return lower.includes('hand') && (lower.includes('right') || lower.includes('_r') || lower.includes('.r') || lower.endsWith('r')) && !lower.includes('finger');
			} else {
				return lower.includes('hand') && (lower.includes('left') || lower.includes('_l') || lower.includes('.l') || lower.endsWith('l')) && !lower.includes('finger');
			}
		});
		if (genericMatch) {
			console.log(`[SpeakiMod+] Found ${side} hand bone via generic match:`, genericMatch.name);
			return genericMatch;
		}
	}

	console.warn(`[SpeakiMod+] Could not find ${side} hand bone on avatar!`);
	return null;
}

function spkmodFindAvatarBone(boneName) {
	const lower = (boneName || '').toLowerCase();
	const isLeft = lower.includes('left') || lower.includes('lhand') || lower.includes('_l') || lower.includes('.l');
	return spkmodGetAvatarBone(isLeft ? 'left' : 'right');
}

function spkmodAttachProp(prop, bone, pos, rot) {
	if (!prop || !bone) {
		console.warn("[SpeakiMod+] spkmodAttachProp failed: prop or bone missing", { prop: !!prop, bone: !!bone });
		return null;
	}
	const THREE = window.THREE;
	if (!THREE) {
		console.warn("[SpeakiMod+] spkmodAttachProp failed: THREE not loaded");
		return null;
	}

	// Update matrices so world scale is accurate
	gameState?.playerContainer?.updateMatrixWorld?.(true);
	gameState?.localAvatar?.root?.updateMatrixWorld?.(true);
	bone.updateWorldMatrix?.(true, false);

	const scale = THREE.Vector3 ? bone.getWorldScale(new THREE.Vector3()) : { x: 1 };
	const holder = new THREE.Group();
	holder.name = "spkmod_cooking_prop_holder";
	holder.userData.lunchPropHolder = true;
	holder.userData.spkmodCookingProp = true;
	
	let s = (scale && scale.x > 0.0001 && isFinite(scale.x)) ? scale.x : 1;
	if (s < 0.001 || s > 1000) s = 1;
	holder.scale.setScalar(1 / s);

	if (pos) prop.position.set(pos.x, pos.y, pos.z);
	if (rot) prop.rotation.set(rot.x, rot.y, rot.z);

	prop.userData.lunchPropHolder = true;
	prop.userData.spkmodCookingProp = true;
	prop.traverse((child) => {
		child.userData.lunchPropHolder = true;
		child.userData.spkmodCookingProp = true;
		if (child.isMesh) {
			child.raycast = () => {};
			child.frustumCulled = false;
			if (bone.layers) child.layers.mask = bone.layers.mask;
			if (child.material) {
				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) {
					m.side = THREE.DoubleSide;
					m.depthTest = true;
					m.depthWrite = true;
				}
			}
		}
	});

	holder.add(prop);
	bone.add(holder);
	window.spkmodCookingState.props.push(holder);
	console.log(`[SpeakiMod+] Successfully attached prop "${prop.name}" to bone "${bone.name}" (scale: ${s})`);
	return holder;
}

function spkmodCreateKnifeProp() {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	group.name = "spkmod_prop_knife";

	// Handle: BoxGeometry(0.03, 0.03, 0.14) at z = -0.01, wood brown
	const handleMat = new THREE.MeshBasicMaterial({ color: 0x6b4c2f, side: THREE.DoubleSide });
	const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.14), handleMat);
	handle.position.set(0, 0, -0.01);
	group.add(handle);

	// Blade: BoxGeometry(0.05, 0.008, 0.24) at z = 0.18, steel silver
	const bladeMat = new THREE.MeshBasicMaterial({ color: 0xd0d7de, side: THREE.DoubleSide });
	const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.008, 0.24), bladeMat);
	blade.position.set(0, 0, 0.18);
	group.add(blade);

	// Blade edge: BoxGeometry(0.008, 0.01, 0.24) at x = 0.025, z = 0.18, white bright edge
	const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
	const edge = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.01, 0.24), edgeMat);
	edge.position.set(0.025, 0, 0.18);
	group.add(edge);

	// Game's exact hand alignment
	group.position.x = 0.08;
	return group;
}

function spkmodCreatePanProp() {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	group.name = "spkmod_prop_pan";

	// Handle: BoxGeometry(0.025, 0.02, 0.20) at z = -0.05
	const handleMat = new THREE.MeshBasicMaterial({ color: 0x1f2937, side: THREE.DoubleSide });
	const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.02, 0.20), handleMat);
	handle.position.set(0, 0, -0.05);
	group.add(handle);

	// Pan body: CylinderGeometry(0.12, 0.108, 0.035, 20) at z = -0.21, rotated 90 deg around Z
	const panMat = new THREE.MeshBasicMaterial({ color: 0x3b4252, side: THREE.DoubleSide });
	const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.108, 0.035, 20), panMat);
	pan.position.set(0, 0, -0.21);
	pan.rotation.z = Math.PI / 2;
	group.add(pan);

	// Soup/food in pan
	const soupMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
	const soup = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.01, 16), soupMat);
	soup.position.set(0, 0.01, -0.21);
	soup.rotation.z = Math.PI / 2;
	group.add(soup);

	group.position.x = 0.08;
	return group;
}

function spkmodCreateLadleProp() {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	group.name = "spkmod_prop_ladle";

	// Handle: BoxGeometry(0.02, 0.02, 0.26) at z = -0.05
	const mat = new THREE.MeshBasicMaterial({ color: 0xc4b5fd, side: THREE.DoubleSide });
	const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.26), mat);
	handle.position.set(0, 0, -0.05);
	group.add(handle);

	// Bowl: SphereGeometry(0.055, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2) at (0, 0, -0.2185)
	const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat);
	bowl.position.set(0, 0, -0.2185);
	group.add(bowl);

	group.position.x = 0.08;
	group.quaternion.set(0.5706, -0.3466, -0.127, 0.7336);
	return group;
}

function spkmodCreatePlateProp() {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	group.name = "spkmod_prop_plate";

	// White porcelain plate
	const plateMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
	const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.025, 20), plateMat);
	group.add(plate);

	// Food on plate
	const foodMat = new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide });
	const food = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.02, 16), foodMat);
	food.position.set(0, 0.018, 0);
	group.add(food);

	// Green garnish
	const garnishMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
	const garnish = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.04), garnishMat);
	garnish.position.set(0.03, 0.03, 0.02);
	group.add(garnish);

	// Game hand placement
	group.position.set(0.095, -0.03, -0.181);
	return group;
}

function spkmodCreateTrayProp() {
	const THREE = window.THREE;
	if (!THREE) return null;
	const group = new THREE.Group();
	group.name = "spkmod_prop_tray";

	// Wooden meal tray
	const trayMat = new THREE.MeshBasicMaterial({ color: 0x8b5a2b, side: THREE.DoubleSide });
	const tray = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.24), trayMat);
	group.add(tray);

	// White ceramic bowls
	const bowlMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.DoubleSide });
	const bowl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.045, 16), bowlMat);
	bowl1.position.set(-0.08, 0.03, 0);
	group.add(bowl1);

	// Steaming rice
	const riceMat = new THREE.MeshBasicMaterial({ color: 0xfffdf0, side: THREE.DoubleSide });
	const rice = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), riceMat);
	rice.position.set(-0.08, 0.05, 0);
	group.add(rice);

	// Soup bowl
	const bowl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.035, 0.04, 16), bowlMat);
	bowl2.position.set(0.08, 0.028, 0);
	group.add(bowl2);

	// Soup broth
	const soupMat = new THREE.MeshBasicMaterial({ color: 0xc2410c, side: THREE.DoubleSide });
	const soup = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.01, 16), soupMat);
	soup.position.set(0.08, 0.045, 0);
	group.add(soup);

	// Game hand placement
	group.position.set(0.095, -0.03, -0.181);
	return group;
}

function spkmodSetWeaponsVisible(visible) {
	const roots = [
		gameState?.localAvatar?.root,
		gameState?.localAvatarPose,
		gameState?.playerContainer
	].filter(Boolean);

	for (const root of roots) {
		root.traverse((child) => {
			if (child.userData && (child.userData.speakiMagicStaff || child.name?.toLowerCase().includes("staff") || child.name?.toLowerCase().includes("weapon") || child.name === "speakov-weapon")) {
				child.visible = visible;
			}
		});
	}

	const rHand = spkmodGetAvatarBone('right');
	if (rHand && rHand.children) {
		for (const child of rHand.children) {
			if (!child.isBone && !child.userData?.lunchPropHolder && !child.userData?.spkmodCookingProp) {
				child.visible = visible;
			}
		}
	}
}

function spkmodClearCookingProps() {
	if (window.spkmodCookingState.props.length > 0) {
		for (const p of window.spkmodCookingState.props) {
			if (p && p.parent) p.parent.remove(p);
			if (p && p.traverse) {
				p.traverse((child) => {
					if (child.isMesh) {
						if (child.geometry) child.geometry.dispose();
						if (child.material) {
							if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
							else child.material.dispose();
						}
					}
				});
			}
		}
		window.spkmodCookingState.props = [];
	}

	// Deep cleanup across all avatar roots just in case
	const roots = [
		gameState?.localAvatar?.root,
		gameState?.localAvatarPose,
		gameState?.playerContainer
	].filter(Boolean);
	for (const r of roots) {
		const toRemove = [];
		r.traverse((child) => {
			if (child.userData?.lunchPropHolder || child.userData?.spkmodCookingProp || child.name === "spkmod_cooking_prop_holder") {
				toRemove.push(child);
			}
		});
		for (const obj of toRemove) {
			if (obj.parent) obj.parent.remove(obj);
		}
	}
	spkmodSetWeaponsVisible(true);
}

window.spkmodStartCooking = async function(type = 'chop') {
	const ctrl = gameState?.localAnimationController;
	if (!ctrl) {
		if (typeof chatLog === 'function') chatLog("[Cooking] Error: Game animation controller not ready.");
		return;
	}

	// Toggle off if already cooking this exact action (second press stops loop)
	if (window.spkmodCookingState.active && window.spkmodCookingState.type === type) {
		window.spkmodStopCooking();
		return;
	}

	spkmodClearCookingProps();
	spkmodSetWeaponsVisible(false);

	window.spkmodCookingState.active = true;
	window.spkmodCookingState.type = type;

	// 1. Ensure Three.js core is loaded
	await spkmodEnsureThree();

	// 2. Play animation and attach props
	if (type === 'chop') {
		const clipName = 'lunch_chop';
		await spkmodLoadCookingAnimation(clipName);
		ctrl.playCastLoop(clipName);
		const rHand = spkmodGetAvatarBone('right');
		if (rHand) {
			const knife = spkmodCreateKnifeProp();
			spkmodAttachProp(knife, rHand);
		}
		if (typeof chatLog === 'function') chatLog("🔪 Fast chopping animation loop started!");
	} else if (type === 'stir') {
		const clipName = 'lunch_stir';
		await spkmodLoadCookingAnimation(clipName);
		ctrl.playCastLoop(clipName);
		const lHand = spkmodGetAvatarBone('left');
		if (lHand) {
			const pan = spkmodCreatePanProp();
			spkmodAttachProp(pan, lHand);
		}
		const rHand = spkmodGetAvatarBone('right');
		if (rHand) {
			const ladle = spkmodCreateLadleProp();
			spkmodAttachProp(ladle, rHand);
		}
		if (typeof chatLog === 'function') chatLog("🍳 Soup stirring animation loop started!");
	} else if (type === 'plate') {
		const clipName = 'lunch_plate';
		await spkmodLoadCookingAnimation(clipName);
		ctrl.playCastLoop(clipName);
		const lHand = spkmodGetAvatarBone('left');
		if (lHand) {
			const plate = spkmodCreatePlateProp();
			spkmodAttachProp(plate, lHand);
		}
		const rHand = spkmodGetAvatarBone('right');
		if (rHand) {
			const ladle = spkmodCreateLadleProp();
			spkmodAttachProp(ladle, rHand);
		}
		if (typeof chatLog === 'function') chatLog("🍽️ Plating dish animation loop started!");
	} else if (type === 'serve') {
		const clipName = 'lunch_serve';
		await spkmodLoadCookingAnimation(clipName);
		const rHand = spkmodGetAvatarBone('right');
		if (rHand) {
			const dish = spkmodCreatePlateProp();
			spkmodAttachProp(dish, rHand);
		}
		if (typeof ctrl.playLunchServe === 'function') {
			ctrl.playLunchServe();
		} else {
			ctrl.playOneShot(clipName, 'emote');
		}
		if (typeof chatLog === 'function') chatLog("🛎️ Serving delicious meal!");
	} else if (type === 'carry') {
		await Promise.all([
			spkmodLoadCookingAnimation('lunch_carry_idle'),
			spkmodLoadCookingAnimation('lunch_carry_run')
		]);
		const rHand = spkmodGetAvatarBone('right');
		if (rHand) {
			const tray = spkmodCreateTrayProp();
			spkmodAttachProp(tray, rHand);
		}
		ctrl.setCarrying(true);
		if (typeof ctrl.crossFadeToLocomotion === 'function') {
			ctrl.crossFadeToLocomotion();
		}
		if (typeof chatLog === 'function') chatLog("📦 Carrying food tray stance activated!");
	}
};

window.spkmodStopCooking = function() {
	window.spkmodCookingState.active = false;
	window.spkmodCookingState.type = null;
	window.spkmodSpellDanceActive = false;
	window.spkmodGatherActive = false;
	spkmodClearCookingProps();
	const ctrl = gameState?.localAnimationController;
	if (ctrl) {
		ctrl.stopCastLoop();
		ctrl.setCarrying(false);
		if (typeof ctrl.crossFadeToLocomotion === 'function') {
			ctrl.crossFadeToLocomotion();
		}
	}
	if (typeof chatLog === 'function') chatLog("🛑 Stopped cooking & restored weapon.");
};

// ============================================================================
// HELICOPTER COPTER HAT & SPECIAL POSES
// ============================================================================

window.spkmodCopterHatActive = false;
window.spkmodCopterHatAllActive = false;

window.spkmodToggleCopterHat = function(scope = 'self') {
	const ctrl = gameState?.localAnimationController;
	if (scope === 'all') {
		window.spkmodCopterHatAllActive = !window.spkmodCopterHatAllActive;
		if (window.spkmodCopterHatAllActive) {
			ctrl?.showReviveHat();
			if (gameState?.remotePlayers?.remotePlayers) {
				for (const [id, rp] of gameState.remotePlayers.remotePlayers) {
					rp.avatar?.animationController?.showReviveHat();
				}
			}
			if (typeof chatLog === 'function') chatLog("🚁 Propeller copter hats given to EVERYONE in town!");
		} else {
			ctrl?.hideReviveHat();
			if (gameState?.remotePlayers?.remotePlayers) {
				for (const [id, rp] of gameState.remotePlayers.remotePlayers) {
					rp.avatar?.animationController?.hideReviveHat();
				}
			}
			if (typeof chatLog === 'function') chatLog("🚁 Removed all copter hats.");
		}
	} else {
		window.spkmodCopterHatActive = !window.spkmodCopterHatActive;
		if (window.spkmodCopterHatActive) {
			ctrl?.showReviveHat();
			if (typeof chatLog === 'function') chatLog("🚁 Propeller copter hat equipped!");
		} else {
			ctrl?.hideReviveHat();
			if (typeof chatLog === 'function') chatLog("🚁 Propeller copter hat removed.");
		}
	}
};

window.spkmodSpellDanceActive = false;
window.spkmodPlaySpellDance = function() {
	const ctrl = gameState?.localAnimationController;
	if (!ctrl) return;
	window.spkmodSpellDanceActive = !window.spkmodSpellDanceActive;
	if (window.spkmodSpellDanceActive) {
		if (typeof ctrl.playReturnCastDance === 'function') {
			ctrl.playReturnCastDance();
		}
		if (typeof chatLog === 'function') chatLog("✨🌀 Magical portal spell dance activated!");
	} else {
		if (typeof ctrl.stopCastLoop === 'function') {
			ctrl.stopCastLoop();
		}
		if (typeof ctrl.crossFadeToLocomotion === 'function') {
			ctrl.crossFadeToLocomotion();
		}
		if (typeof chatLog === 'function') chatLog("✨ Spell dance stopped.");
	}
};

window.spkmodGatherActive = false;
window.spkmodPlayGather = function() {
	const ctrl = gameState?.localAnimationController;
	if (!ctrl) return;
	window.spkmodGatherActive = !window.spkmodGatherActive;
	if (window.spkmodGatherActive) {
		if (typeof ctrl.playGatherAnim === 'function') {
			ctrl.playGatherAnim();
		}
		if (typeof chatLog === 'function') chatLog("🌿 Foraging / gathering loop activated! (Press again or move to stop)");
	} else {
		if (typeof ctrl.exitGatherAnim === 'function') {
			ctrl.exitGatherAnim();
		} else if (typeof ctrl.stopCastLoop === 'function') {
			ctrl.stopCastLoop();
		}
		if (typeof ctrl.crossFadeToLocomotion === 'function') {
			ctrl.crossFadeToLocomotion();
		}
		if (typeof chatLog === 'function') chatLog("🌿 Gathering loop stopped.");
	}
};

// ============================================================================
// STEP PARTICLE TRAIL (Stars, Rainbow, Hearts)
// ============================================================================

const _spkSavedTrailEnabled = (typeof window !== 'undefined' && window.localStorage)
	? localStorage.getItem('spkmod-step-trail-enabled') === 'true'
	: false;
const _spkSavedTrailType = (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('spkmod-step-trail-type')) || 'stars';

window.spkmodStepTrail = {
	enabled: _spkSavedTrailEnabled,
	type: ['stars', 'rainbow', 'hearts'].includes(_spkSavedTrailType) ? _spkSavedTrailType : 'stars',
	distAccum: 0,
	lastPos: null,
	animId: null
};

const SPKMOD_RAINBOW_TRAIL_COLORS = ['#ff0055', '#ff8800', '#ffd700', '#00ff88', '#00d4ff', '#b347ff'];
let spkmodRainbowTrailIdx = 0;

function spkmodEmitStepTrailFx(pos) {
	if (!gameState?.skillParticles) return;
	const type = window.spkmodStepTrail.type || 'stars';

	if (type === 'stars') {
		gameState.skillParticles.emit({
			count: 14,
			texture: 'star4',
			color: '#ffd700',
			axis: 'sphere',
			coneAngleDeg: 80,
			speedMinMps: 0.6,
			speedMaxMps: 1.8,
			gravityMps2: 2.0,
			sizeM: 0.28,
			lifeSecMin: 0.4,
			lifeSecMax: 0.8,
			spawnJitterSec: 0.02
		}, pos);
	} else if (type === 'rainbow') {
		const color = SPKMOD_RAINBOW_TRAIL_COLORS[spkmodRainbowTrailIdx++ % SPKMOD_RAINBOW_TRAIL_COLORS.length];
		gameState.skillParticles.emit({
			count: 16,
			texture: 'star4',
			color: color,
			axis: 'up',
			coneAngleDeg: 55,
			speedMinMps: 1.0,
			speedMaxMps: 2.5,
			gravityMps2: 2.5,
			sizeM: 0.32,
			lifeSecMin: 0.5,
			lifeSecMax: 1.0,
			spawnJitterSec: 0.02
		}, pos);
	} else if (type === 'hearts') {
		if (gameState.bloomEffects?.spawnHearts && gameState.playerContainer) {
			gameState.bloomEffects.spawnHearts(gameState.playerContainer);
		}
	}
}

function spkmodStepTrailLoop() {
	if (!window.spkmodStepTrail.enabled) return;
	const curPos = gameState?.playerContainer?.position;
	if (curPos) {
		const st = window.spkmodStepTrail;
		if (st.lastPos) {
			const dist = Math.hypot(curPos.x - st.lastPos.x, curPos.z - st.lastPos.z);
			st.distAccum += dist;
			if (st.distAccum >= 0.6) {
				st.distAccum = 0;
				spkmodEmitStepTrailFx(curPos);
			}
		} else {
			st.lastPos = curPos.clone();
		}
		st.lastPos.copy(curPos);
	}
	window.spkmodStepTrail.animId = requestAnimationFrame(spkmodStepTrailLoop);
}

window.spkmodToggleStepTrail = function(enabled, type) {
	if (type) window.spkmodStepTrail.type = type;
	if (enabled !== undefined) {
		window.spkmodStepTrail.enabled = enabled;
	} else {
		window.spkmodStepTrail.enabled = !window.spkmodStepTrail.enabled;
	}

	if (window.localStorage) {
		try {
			localStorage.setItem('spkmod-step-trail-enabled', window.spkmodStepTrail.enabled ? 'true' : 'false');
			localStorage.setItem('spkmod-step-trail-type', window.spkmodStepTrail.type || 'stars');
		} catch (_) {}
	}

	if (window.spkmodStepTrail.animId) {
		cancelAnimationFrame(window.spkmodStepTrail.animId);
		window.spkmodStepTrail.animId = null;
	}

	if (window.spkmodStepTrail.enabled) {
		window.spkmodStepTrail.distAccum = 0;
		window.spkmodStepTrail.lastPos = null;
		window.spkmodStepTrail.animId = requestAnimationFrame(spkmodStepTrailLoop);
		if (typeof chatLog === 'function') chatLog(`👣 Step Particle Trail ENABLED (${window.spkmodStepTrail.type})! Walk around to see sparkles.`);
	} else {
		if (typeof chatLog === 'function') chatLog("🛑 Step Particle Trail DISABLED.");
	}
	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};

window.spkmodSetTrailType = function(type) {
	window.spkmodStepTrail.type = type;
	if (window.localStorage) {
		try {
			localStorage.setItem('spkmod-step-trail-type', type);
		} catch (_) {}
	}
	if (!window.spkmodStepTrail.enabled) {
		window.spkmodToggleStepTrail(true, type);
	} else {
		if (typeof chatLog === 'function') chatLog(`✨ Step trail switched to: ${type.toUpperCase()}`);
		if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
	}
};

if (window.spkmodStepTrail.enabled && !window.spkmodStepTrail.animId) {
	window.spkmodStepTrail.animId = requestAnimationFrame(spkmodStepTrailLoop);
}

window.spkmodBurstSpamActive = false;
window.spkmodBurstSpamInterval = null;

window.spkmodBurstTrail = function(silent = false) {
	if (!gameState?.playerContainer?.position) return;
	if (gameState.skillParticles) {
		gameState.skillParticles.emit({
			count: silent ? 35 : 50,
			texture: 'star4',
			color: '#ffd700',
			axis: 'sphere',
			speedMinMps: 1.5,
			speedMaxMps: 4.2,
			gravityMps2: 2.5,
			sizeM: 0.38,
			lifeSecMin: 0.6,
			lifeSecMax: 1.5,
			spawnJitterSec: 0.04
		}, gameState.playerContainer.position);
	}
	if (gameState.bloomEffects && gameState.localAvatar?.root) {
		gameState.bloomEffects.burst(gameState.localAvatar.root);
	}
	if (!silent && typeof chatLog === 'function') chatLog("💥 Starburst Explosion triggered!");
};

window.spkmodToggleBurstSpam = function(forceState) {
	const newState = forceState !== undefined ? forceState : !window.spkmodBurstSpamActive;
	window.spkmodBurstSpamActive = newState;

	if (window.spkmodBurstSpamInterval) {
		clearInterval(window.spkmodBurstSpamInterval);
		window.spkmodBurstSpamInterval = null;
	}

	if (window.spkmodBurstSpamActive) {
		// Immediately fire first burst
		window.spkmodBurstTrail(true);
		// Fast loop: every 110ms
		window.spkmodBurstSpamInterval = setInterval(() => {
			if (!window.spkmodBurstSpamActive) {
				clearInterval(window.spkmodBurstSpamInterval);
				window.spkmodBurstSpamInterval = null;
				return;
			}
			window.spkmodBurstTrail(true);
		}, 110);
		if (typeof chatLog === 'function') chatLog("⚡ Starburst fast spam loop ACTIVATED! (Click again to pause)");
	} else {
		if (typeof chatLog === 'function') chatLog("⏸️ Starburst fast spam loop PAUSED.");
	}

	if (typeof updateLocalEditsUI === 'function') updateLocalEditsUI();
};