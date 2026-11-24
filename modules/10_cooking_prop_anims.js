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

let _spkmodGLTFLoaderClass = null;
let _spkmodMeshoptDecoder = null;
async function spkmodEnsureGLTFLoader() {
	if (_spkmodGLTFLoaderClass) return _spkmodGLTFLoaderClass;
	await spkmodEnsureThree();
	if (window.THREE && window.THREE.GLTFLoader && window.THREE.MeshoptDecoder) {
		_spkmodGLTFLoaderClass = window.THREE.GLTFLoader;
		_spkmodMeshoptDecoder = window.THREE.MeshoptDecoder;
		return _spkmodGLTFLoaderClass;
	}
	try {
		const [mod, meshoptMod] = await Promise.all([
			import('https://esm.sh/v135/three@0.185.0/examples/jsm/loaders/GLTFLoader.js'),
			import('https://esm.sh/v135/three@0.185.0/examples/jsm/libs/meshopt_decoder.module.js').catch(() => null)
		]);
		_spkmodGLTFLoaderClass = mod.GLTFLoader;
		_spkmodMeshoptDecoder = meshoptMod?.MeshoptDecoder || null;
		if (window.THREE) {
			window.THREE.GLTFLoader = mod.GLTFLoader;
			if (_spkmodMeshoptDecoder) window.THREE.MeshoptDecoder = _spkmodMeshoptDecoder;
		}
		return _spkmodGLTFLoaderClass;
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load GLTFLoader:", e);
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
// BURGER SHOP BIG-ORDER WIDE ("FAT") CUSTOMERS
// ============================================================================
var spkmodCA = {
	on: typeof window !== "undefined" ? window.spkmodBurgerFatCustomersEnabled !== false : true,
	fx: 2,
	fz: 2,
	list: [],
	t: 0,
	tScan: 0,
	bubbles: [],
	need: ["Burger_Basic", "Potato_Cooked", "Drink_Prepped"],
	sprites: 1,
	visible: true,
	every: 100,
	window: 3000,
	log: false,
	pelvis: /pelvis|hip/i,
	head: /head/i,
	spine: /spine/i
};
if (typeof window !== "undefined") window.spkmodCA = spkmodCA;

let _spkmodCAMatH1 = null;
let _spkmodCAMatInv = null;
const _spkmodCAPropMats = [];

function spkmodCACollectHandProps(e) {
	const out = [];
	const hands = e && e.hands;
	if (!hands) return out;
	for (let i = 0; i < hands.length; i++) {
		const hb = hands[i];
		const ch = hb && hb.children;
		if (!ch) continue;
		for (let j = 0; j < ch.length; j++) {
			const c = ch[j];
			if (c && c.userData && c.userData.lunchPropHolder === true) {
				out.push(c);
			}
		}
	}
	return out;
}

function spkmodCARestorePropHolders(e) {
	const props = spkmodCACollectHandProps(e);
	for (let i = 0; i < props.length; i++) {
		const h = props[i];
		h.matrixAutoUpdate = true;
		h.updateMatrix();
	}
}

function spkmodCAContainers() {
	const gs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
	const c = gs && gs.burgerShop && gs.burgerShop.customers;
	if (!c) return [];
	const list = Array.isArray(c) ? c : (typeof c.values === "function" ? [...c.values()] : Object.values(c));
	return list.map(e => e && e.container).filter(Boolean);
}

function spkmodCAAxes(bone, cont) {
	const B = bone.matrixWorld.elements, C = cont.matrixWorld.elements;
	const n = (e, o) => {
		const l = Math.hypot(e[o], e[o + 1], e[o + 2]) || 1;
		return [e[o] / l, e[o + 1] / l, e[o + 2] / l];
	};
	const axes = ["x", "y", "z"];
	const cx = n(C, 0), cy = n(C, 4), cz = n(C, 8);
	const pick = (c, exclude) => {
		let best = "x", bd = -1;
		for (let k = 0; k < 3; k++) {
			const a = axes[k];
			if (a === exclude) continue;
			const b = n(B, k * 4);
			const d = Math.abs(b[0] * c[0] + b[1] * c[1] + b[2] * c[2]);
			if (d > bd) { bd = d; best = a; }
		}
		return best;
	};
	let ax = pick(cx);
	let az = pick(cz);
	if (ax === az) {
		const ay = pick(cy);
		ax = pick(cx, ay);
		az = pick(cz, ax === ay ? ay : ax);
		if (az === ay) az = axes.find(a => a !== ax && a !== ay) || az;
	}
	return { x: ax, z: az };
}

function spkmodCAVisible(o, stop) {
	let hitStop = false;
	for (let x = o; x; x = x.parent) {
		if (x === stop) { hitStop = true; break; }
		if (!x.visible) return false;
	}
	return stop ? hitStop : true;
}

function spkmodCARead(e, scene) {
	const S = spkmodCA, names = new Set();
	let sprites = 0;
	const walk = root => root.traverse(o => {
		if (S.visible && !spkmodCAVisible(o, scene)) return;
		if (o.isSprite) sprites++;
		else if (o.isMesh && o.name) names.add(o.name);
	});
	walk(e.cont);
	for (const b of (e.bub || [])) walk(b);
	return { names, sprites };
}

function spkmodCAInside(o, r) {
	for (let x = o; x; x = x.parent) {
		if (x === r) return true;
	}
	return false;
}

function spkmodCARelease(e) {
	if (!e || e.rel) return;
	e.rel = true;
	if (e.pel) {
		e.pel.scale[e.ap.x] = e.p0.x;
		e.pel.scale[e.ap.z] = e.p0.z;
		e.pel.updateMatrix();
	}
	if (e.head) {
		e.head.matrixAutoUpdate = true;
		e.head.updateMatrix();
	}
	spkmodCARestorePropHolders(e);
	if (e.cont) {
		e.cont.updateMatrixWorld(true);
	}
}

function spkmodCAReleaseAll() {
	const S = spkmodCA;
	for (const e of S.list) spkmodCARelease(e);
	S.list = [];
	S.bubbles = [];
	S.tScan = 0;
}

function spkmodCASync(scene) {
	const S = spkmodCA, now = performance.now();
	const conts = spkmodCAContainers();
	if (conts.length === 0) {
		if (S.list.length > 0 || S.bubbles.length > 0) spkmodCAReleaseAll();
		return;
	}
	if (now - S.tScan > 1000) {
		S.tScan = now;
		S.bubbles = [];
		const byRoot = new Map();
		scene.traverse(o => {
			if (o.isMesh && o.geometry && o.geometry.type === "ShapeGeometry" && o.parent && o.parent.parent && o.parent.parent.parent) {
				const r = o.parent.parent.parent;
				let entry = byRoot.get(r);
				if (!entry) {
					entry = { root: r, shapes: [] };
					byRoot.set(r, entry);
					S.bubbles.push(entry);
				}
				entry.shapes.push(o);
			}
		});
	}
	const own = new Map();
	const hasBubbleSet = new Set();
	for (const b of S.bubbles) {
		const root = b.root;
		if (!spkmodCAInside(root, scene)) continue;
		const bVis = !S.visible || b.shapes.some(sh => spkmodCAVisible(sh, scene));
		let nested = false;
		for (const c of conts) {
			if (spkmodCAInside(root, c)) {
				nested = true;
				if (bVis) hasBubbleSet.add(c);
				break;
			}
			if (spkmodCAInside(c, root)) {
				nested = true;
				break;
			}
		}
		if (nested) continue;
		let best = null, bd = 1.2;
		const a = root.matrixWorld.elements;
		for (const c of conts) {
			const m = c.matrixWorld.elements;
			const d = Math.hypot(a[12] - m[12], a[14] - m[14]);
			if (d < bd) { bd = d; best = c; }
		}
		if (best) {
			if (!own.has(best)) own.set(best, []);
			own.get(best).push(root);
			if (bVis) hasBubbleSet.add(best);
		}
	}
	const keep = [];
	for (const cont of conts) {
		let e = S.list.find(x => x.cont === cont);
		if (!e) {
			const B = [];
			cont.traverse(o => { if (o.isBone) B.push(o); });
			const pel = B.find(b => S.pelvis.test(b.name)) || B.find(b => S.spine.test(b.name));
			const head = B.find(b => S.head.test(b.name) && !/nub/i.test(b.name));
			if (!pel || !head || pel === head || !head.parent) continue;
			const hands = B.filter(b => /hand/i.test(b.name) && !/nub/i.test(b.name));
			cont.updateMatrixWorld(true);
			const ap = spkmodCAAxes(pel, cont);
			const px = pel.scale[ap.x], pz = pel.scale[ap.z];
			if (!px || !pz || !isFinite(px) || !isFinite(pz)) continue;
			e = { cont, pel, head, hands, ap, p0: { x: px, z: pz }, M: head.matrix.constructor, want: false, rel: true, seen: null, decided: false, born: now, bubbleSeenAt: null };
		}
		if (!e.decided) {
			cont.updateMatrixWorld(true);
			e.bub = own.get(cont) || [];
			const r = spkmodCARead(e, scene);
			e.seen = r;
			const hit = S.need.every(n => r.names.has(n)) && r.sprites >= S.sprites;
			if (hit) {
				e.decided = true;
				e.want = true;
				if (S.log) console.log("[SpeakiMod] customer decided: WIDE", [...r.names].filter(n => !/^(Mesh_|geometry_|Cap|Rotor|world)/.test(n)).join("+"), "sprites", r.sprites);
			} else {
				const hasBubbleOrOrder = hasBubbleSet.has(cont) || S.need.some(n => r.names.has(n));
				if (hasBubbleOrOrder) {
					if (e.bubbleSeenAt === null) e.bubbleSeenAt = now;
					if (now - e.bubbleSeenAt > S.window) {
						e.decided = true;
						e.want = false;
						if (S.log) console.log("[SpeakiMod] customer decided: normal", [...r.names].filter(n => !/^(Mesh_|geometry_|Cap|Rotor|world)/.test(n)).join("+"), "sprites", r.sprites);
					}
				}
			}
		}
		keep.push(e);
	}
	for (const e of S.list) {
		if (keep.indexOf(e) < 0) spkmodCARelease(e);
	}
	S.list = keep;
}

function spkmodCAApply() {
	const S = spkmodCA;
	for (const e of S.list) {
		const props = spkmodCACollectHandProps(e);
		if (!S.on || !e.want || e.ap.x === e.ap.z) {
			spkmodCARelease(e);
			// Even on normal customers, repair hand tray/food holders whose scale was baked while container.scale < 1 (pop-in race)
			if (S.on && props.length > 0 && e.cont) {
				const ce = e.cont.matrixWorld.elements;
				const contScale = Math.hypot(ce[0], ce[1], ce[2]) || 1;
				for (let i = 0; i < props.length; i++) {
					const h = props[i];
					const hand = h.parent;
					if (!hand) continue;
					const pe = hand.matrixWorld.elements;
					const l0 = Math.hypot(pe[0], pe[1], pe[2]);
					if (l0 > 1e-6 && (Math.abs(h.scale.x * l0 - contScale) > 0.05 * contScale ||
						Math.abs(h.scale.y * l0 - contScale) > 0.05 * contScale ||
						Math.abs(h.scale.z * l0 - contScale) > 0.05 * contScale)) {
						const s = contScale / l0;
						h.scale.x = s;
						h.scale.y = s;
						h.scale.z = s;
						h.updateMatrix();
						h.updateMatrixWorld(true);
					}
				}
			}
			continue;
		}
		const pel = e.pel, head = e.head, neck = head.parent;
		if (!pel || !head || !neck) continue;
		if (!_spkmodCAMatH1 || _spkmodCAMatH1.constructor !== e.M) {
			_spkmodCAMatH1 = new e.M();
			_spkmodCAMatInv = new e.M();
			_spkmodCAPropMats.length = 0;
		}
		e.rel = false;
		head.matrixAutoUpdate = true;
		for (let i = 0; i < props.length; i++) {
			props[i].matrixAutoUpdate = true;
		}
		pel.scale[e.ap.x] = e.p0.x;
		pel.scale[e.ap.z] = e.p0.z;
		pel.updateMatrix();
		e.cont.updateMatrixWorld(true);
		_spkmodCAMatH1.copy(head.matrixWorld);

		// Snapshot rigid unstretched world transforms for hand-held trays / food (child of pelvis -> arm -> hand)
		const ce = e.cont.matrixWorld.elements;
		const contScale = Math.hypot(ce[0], ce[1], ce[2]) || 1;
		let propCount = 0;
		for (let i = 0; i < props.length; i++) {
			const h = props[i];
			const hand = h.parent;
			if (!hand) continue;
			const pe = hand.matrixWorld.elements;
			const l0 = Math.hypot(pe[0], pe[1], pe[2]);
			const l1 = Math.hypot(pe[4], pe[5], pe[6]);
			const l2 = Math.hypot(pe[8], pe[9], pe[10]);
			if (l0 <= 1e-6 || l1 <= 1e-6 || l2 <= 1e-6) continue;
			const idealScale = contScale / l0;
			if (Math.abs(h.scale.x * l0 - contScale) > 0.05 * contScale ||
				Math.abs(h.scale.y * l0 - contScale) > 0.05 * contScale ||
				Math.abs(h.scale.z * l0 - contScale) > 0.05 * contScale) {
				h.scale.x = idealScale;
				h.scale.y = idealScale;
				h.scale.z = idealScale;
				h.updateMatrix();
			}
			let pm = _spkmodCAPropMats[propCount];
			if (!pm || pm.constructor !== e.M) {
				pm = new e.M();
				_spkmodCAPropMats[propCount] = pm;
			}
			const me = pm.elements;
			const s0 = contScale / l0, s1 = contScale / l1, s2 = contScale / l2;
			me[0] = pe[0] * s0; me[1] = pe[1] * s0; me[2] = pe[2] * s0; me[3] = 0;
			me[4] = pe[4] * s1; me[5] = pe[5] * s1; me[6] = pe[6] * s1; me[7] = 0;
			me[8] = pe[8] * s2; me[9] = pe[9] * s2; me[10] = pe[10] * s2; me[11] = 0;
			me[12] = pe[12];    me[13] = pe[13];    me[14] = pe[14];    me[15] = 1;
			props[propCount] = h;
			propCount++;
		}

		pel.scale[e.ap.x] = e.p0.x * S.fx;
		pel.scale[e.ap.z] = e.p0.z * S.fz;
		pel.updateMatrix();
		e.cont.updateMatrixWorld(true);

		const ne = neck.matrixWorld;
		if (typeof ne.determinant !== "function" || Math.abs(ne.determinant()) >= 1e-10) {
			const he = head.matrixWorld.elements;
			_spkmodCAMatH1.elements[12] = he[12];
			_spkmodCAMatH1.elements[13] = he[13];
			_spkmodCAMatH1.elements[14] = he[14];
			head.matrix.copy(_spkmodCAMatInv.copy(ne).invert().multiply(_spkmodCAMatH1));
			head.matrixAutoUpdate = false;
			head.updateMatrixWorld(true);
		}

		for (let i = 0; i < propCount; i++) {
			const h = props[i];
			const hand = h.parent;
			if (!hand) continue;
			const hm = hand.matrixWorld;
			if (typeof hm.determinant === "function" && Math.abs(hm.determinant()) < 1e-10) {
				continue;
			}
			const pm = _spkmodCAPropMats[i];
			const he = hm.elements;
			pm.elements[12] = he[12];
			pm.elements[13] = he[13];
			pm.elements[14] = he[14];
			h.matrix.copy(_spkmodCAMatInv.copy(hm).invert().multiply(pm));
			h.matrixAutoUpdate = false;
			h.updateMatrixWorld(true);
		}
	}
}

function spkmodCARestoreAfterRender() {
	const S = spkmodCA;
	for (const e of S.list) {
		if (!e.rel) {
			spkmodCARelease(e);
		}
	}
}

function spkmodEnsureBurgerFatSceneHook() {
	const gs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
	const scene = gs && gs.scene;
	if (!scene) return false;
	if (!scene.__spkmodCABeforeHooked) {
		scene.__spkmodCABeforeHooked = true;
		const prevBefore = scene.onBeforeRender;
		scene.onBeforeRender = function(renderer, sc, camera, ...rest) {
			if (typeof prevBefore === "function") {
				try { prevBefore.call(this, renderer, sc, camera, ...rest); } catch (_) {}
			}
			const curGs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
			const S = spkmodCA;
			if (!curGs || sc !== curGs.scene || (!S.on && S.list.length === 0)) return;
			try {
				if (!S.on) {
					spkmodCAReleaseAll();
					return;
				}
				const now = performance.now();
				// Skip order-bubble sync during shader overrideMaterial normal pass (which hides sprites)
				if (!sc.overrideMaterial && now - S.t >= S.every) {
					S.t = now;
					spkmodCASync(sc);
				}
				spkmodCAApply();
			} catch (_) {}
		};
	}
	if (!scene.__spkmodCAAfterFn || scene.onAfterRender !== scene.__spkmodCAAfterFn) {
		// Avoid re-wrapping while shaders or bloom guard temporarily wrap onAfterRender if ours is already in the chain
		const curAfter = scene.onAfterRender;
		if (!curAfter || !curAfter.__spkmodCAInChain) {
			const prevAfter = curAfter;
			const wrappedAfter = function(renderer, sc, camera, ...rest) {
				if (typeof prevAfter === "function") {
					try { prevAfter.call(this, renderer, sc, camera, ...rest); } catch (_) {}
				}
				const curGs = typeof gameState !== "undefined" ? gameState : (typeof window !== "undefined" ? window.gameState : null);
				if (!curGs || sc !== curGs.scene || spkmodCA.list.length === 0) return;
				try {
					spkmodCARestoreAfterRender();
				} catch (_) {}
			};
			wrappedAfter.__spkmodCAInChain = true;
			scene.__spkmodCAAfterFn = wrappedAfter;
			scene.onAfterRender = wrappedAfter;
		}
	}
	return true;
}

window.spkmodSetBurgerFatCustomersEnabled = function(nextEnabled, silentToast = false) {
	const enabled = !!nextEnabled;
	if (typeof window !== "undefined") {
		window.spkmodBurgerFatCustomersEnabled = enabled;
		if (window.localStorage) {
			try {
				localStorage.setItem("spkmod-burger-fat-customers", enabled ? "true" : "false");
			} catch (_) {}
		}
	}
	spkmodCA.on = enabled;
	if (typeof lunPanelElements !== "undefined" && lunPanelElements && lunPanelElements.burgerFatCustomersToggleInput) {
		lunPanelElements.burgerFatCustomersToggleInput.checked = enabled;
	}
	if (enabled) {
		spkmodCA.t = 0;
		spkmodCA.tScan = 0;
		spkmodEnsureBurgerFatSceneHook();
	} else {
		spkmodCAReleaseAll();
	}
	if (!silentToast && typeof chatLog === "function") {
		const msg = enabled
			? (typeof tCustom === "function" ? tCustom("burgerFatCustomersEnabledToast", "🍔 Fat Burger Shop Customers enabled.") : "🍔 Fat Burger Shop Customers enabled.")
			: (typeof tCustom === "function" ? tCustom("burgerFatCustomersDisabledToast", "🍔 Fat Burger Shop Customers disabled.") : "🍔 Fat Burger Shop Customers disabled.");
		chatLog(msg);
	}
	return enabled;
};

function spkmodCustomerAuto(on, fx, fz) {
	if (fx) {
		spkmodCA.fx = fx;
		spkmodCA.fz = fz || fx;
	}
	window.spkmodSetBurgerFatCustomersEnabled(!!on, true);
}
if (typeof window !== "undefined") window.spkmodCustomerAuto = spkmodCustomerAuto;

spkmodEnsureBurgerFatSceneHook();


