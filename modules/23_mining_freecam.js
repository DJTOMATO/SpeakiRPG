// ============================================================================
// MINING MINIGAME FREE-CAMERA MODE (F4) — ANTI-CLIPPING & FULL UI HIDE
// ============================================================================
// Toggled via F4 inside the mining minigame:
// - Hides all mining game UI (HUD, crosshair, hotbar, chat, waypoints, 3D
//   viewmodel, highlights, guide wedge, nametags, chat bubbles) AND all
//   SpeakiMod+ UI without disturbing pre-existing F9 / P UI states.
// - Restores everything cleanly when F4 is pressed again or on mining exit.
// - Anti-cheat / anti-clipping physics:
//   * Exact voxel & sub-voxel collision (full blocks, slabs, stairs, fences,
//     glass panes, iron bars, closed doors, bedrock, unknown IDs fail-closed).
//   * Camera clearance half-extent strictly exceeds near-clip corner radius so
//     the near plane can never clip into or see through walls or objects.
//   * Dynamic 3D object AABBs (minecarts, merchant NPC, wooden signs, players).
//   * Continuous sub-stepped swept movement + world.raycastSolid verification
//     + 4-corner near-plane raycast guard + per-frame embedded-block recovery.
//   * Strict loaded-chunk boundary enforcement at ALL Y heights (incl. y>=100)
//     and camera-anchored underground fog so surface fog never leaks into mines.

const SPKMOD_MINING_FREECAM_CONFIG = {
	baseSpeed: 5.5,
	minSpeed: 1.2,
	maxSpeed: 14.0,
	boostMultiplier: 1.75,
	accelRate: 14.0,
	minHalfExtent: 0.28,
	maxHalfExtent: 0.42,
	nearClearanceMargin: 0.12,
	maxSubstepDist: 0.06,
	maxSubstepsPerFrame: 48,
	edgeBufferBlocks: 3.0,
	ceilingAboveBase: 28.0,
	hardMaxY: 97.5,
	eyeHeightStanding: 1.5,
	eyeHeightSeated: 0.9,
	fogBodyEyeOffset: 1.7,
	localAvatarRevealDist: 0.85,
	dragLookSensitivity: 0.005,
	maxPitchRad: (88 * Math.PI) / 180
};

// Exact block solidity & sub-voxel geometry matching SpeakiRPG's mining engine.
// Unknown block IDs (including 255 = unloaded chunk) fail-closed as solid full cubes.
const SPKMOD_MINING_NON_SOLID_IDS = new Set([
	0, // AIR
	5, // TORCH
	7, 8, 9, // RAIL, RAIL_BED, STATION
	58, 59, // CARGO_PILE, CARGO_PILE_PROTECTED
	67, 69 // DOOR_OPEN_LOWER, DOOR_OPEN_UPPER
]);
for (let _railId = 32; _railId <= 57; _railId++) {
	SPKMOD_MINING_NON_SOLID_IDS.add(_railId);
}

const SPKMOD_MINING_BLOCK_SHAPES = new Uint8Array(256);
for (const _id of [128, 136, 144, 152, 160, 176]) SPKMOD_MINING_BLOCK_SHAPES[_id] = 4; // Slabs
for (const _id of [129, 137, 145, 153, 161, 177]) SPKMOD_MINING_BLOCK_SHAPES[_id] = 5; // Stairs
for (const _id of [130, 138, 146, 154, 162, 178]) SPKMOD_MINING_BLOCK_SHAPES[_id] = 6; // Fences
for (const _id of [171, 187]) SPKMOD_MINING_BLOCK_SHAPES[_id] = 7; // Glass panes / Iron bars

const SPKMOD_MINING_FULL_CUBE = [[0, 0, 0, 1, 1, 1]];
const SPKMOD_MINING_META_MASKS = [15, 0, 0, 0, 79, 127, 15, 15, 0, 0];
const SPKMOD_MINING_CARDINAL_DX = [0, 1, 0, -1];
const SPKMOD_MINING_CARDINAL_DZ = [-1, 0, 1, 0];

const SPKMOD_MINING_RAW_BOXES = [
	// Slabs (shape 4)
	[4, 0, 0, 0, 0, 16, 8, 16],
	[4, 4, 0, 8, 0, 16, 16, 16],
	// Stairs (shape 5, orientations 0..7)
	[5, 0, 0, 0, 0, 16, 8, 16], [5, 0, 0, 8, 8, 16, 16, 16],
	[5, 1, 0, 0, 0, 16, 8, 16], [5, 1, 0, 8, 0, 8, 16, 16],
	[5, 2, 0, 0, 0, 16, 8, 16], [5, 2, 0, 8, 0, 16, 16, 8],
	[5, 3, 0, 0, 0, 16, 8, 16], [5, 3, 8, 8, 0, 16, 16, 16],
	[5, 4, 0, 8, 0, 16, 16, 16], [5, 4, 0, 0, 8, 16, 8, 16],
	[5, 5, 0, 8, 0, 16, 16, 16], [5, 5, 0, 0, 0, 8, 8, 16],
	[5, 6, 0, 8, 0, 16, 16, 16], [5, 6, 0, 0, 0, 16, 8, 8],
	[5, 7, 0, 8, 0, 16, 16, 16], [5, 7, 8, 0, 0, 16, 8, 16],
	// Fences (shape 6: 0..3 arms, 4 center post; 1.5m tall = 24/16)
	[6, 0, 6, 0, 0, 10, 24, 6],
	[6, 1, 10, 0, 6, 16, 24, 10],
	[6, 2, 6, 0, 10, 10, 24, 16],
	[6, 3, 0, 0, 6, 6, 24, 10],
	[6, 4, 6, 0, 6, 10, 24, 10],
	// Glass panes / Iron bars (shape 7: 0..3 arms, 4 center post)
	[7, 0, 7, 0, 0, 9, 16, 7],
	[7, 1, 9, 0, 7, 16, 16, 9],
	[7, 2, 7, 0, 9, 9, 16, 16],
	[7, 3, 0, 0, 7, 7, 16, 9],
	[7, 4, 7, 0, 7, 9, 16, 9]
];

const SPKMOD_MINING_ORIENT_BOXES = { 4: [], 5: [] };
const SPKMOD_MINING_CONN_BOXES = { 6: [], 7: [] };

(function _initMiningSubVoxelTables() {
	const toUnit = row => [row[2] / 16, row[3] / 16, row[4] / 16, row[5] / 16, row[6] / 16, row[7] / 16];
	for (const shape of [4, 5]) {
		for (let variant = 0; variant < 8; variant++) {
			const boxes = SPKMOD_MINING_RAW_BOXES
				.filter(r => r[0] === shape && r[1] === variant)
				.map(toUnit);
			SPKMOD_MINING_ORIENT_BOXES[shape][variant] = boxes.length > 0 ? boxes : SPKMOD_MINING_FULL_CUBE;
		}
	}
	for (const shape of [6, 7]) {
		for (let mask = 0; mask < 16; mask++) {
			SPKMOD_MINING_CONN_BOXES[shape][mask] = SPKMOD_MINING_RAW_BOXES
				.filter(r => r[0] === shape && (r[1] === 4 || (mask & (1 << r[1])) !== 0))
				.map(toUnit);
		}
	}
})();

function spkmodMiningIsBlockSolid(blockId) {
	if (typeof blockId !== "number" || !Number.isFinite(blockId)) return true;
	const id = blockId & 255;
	return !SPKMOD_MINING_NON_SOLID_IDS.has(id);
}

function spkmodMiningBlockShape(blockId) {
	if (typeof blockId !== "number" || !Number.isFinite(blockId)) return 0;
	return SPKMOD_MINING_BLOCK_SHAPES[blockId & 255] || 0;
}

function spkmodMiningFenceOrPaneMask(world, shape, bx, by, bz) {
	let mask = 0;
	for (let dir = 0; dir < 4; dir++) {
		const nb = world.blockAt(bx + SPKMOD_MINING_CARDINAL_DX[dir], by, bz + SPKMOD_MINING_CARDINAL_DZ[dir]);
		if (!spkmodMiningIsBlockSolid(nb)) continue;
		const nbShape = spkmodMiningBlockShape(nb);
		if (nbShape === 0 || nbShape === shape) {
			mask |= (1 << dir);
		}
	}
	return mask;
}

function spkmodMiningGetBlockCollisionBoxes(world, blockId, bx, by, bz) {
	if (!spkmodMiningIsBlockSolid(blockId)) return null;
	const shape = spkmodMiningBlockShape(blockId);
	if (shape === 0) return SPKMOD_MINING_FULL_CUBE;
	if (shape === 4 || shape === 5) {
		const meta = typeof world.metaAt === "function" ? (world.metaAt(bx, by, bz) | 0) : 0;
		const orient = ((meta & (SPKMOD_MINING_META_MASKS[shape] || 0)) >> 4) & 7;
		return SPKMOD_MINING_ORIENT_BOXES[shape][orient] || SPKMOD_MINING_FULL_CUBE;
	}
	if (shape === 6 || shape === 7) {
		const mask = spkmodMiningFenceOrPaneMask(world, shape, bx, by, bz);
		return SPKMOD_MINING_CONN_BOXES[shape][mask] || SPKMOD_MINING_FULL_CUBE;
	}
	return SPKMOD_MINING_FULL_CUBE;
}

function spkmodMiningIsColumnLoaded(world, bx, bz) {
	if (!world || typeof world.blockAt !== "function") return false;
	return world.blockAt(bx, 0, bz) !== 255;
}

function spkmodMiningComputeHalfExtent(camera) {
	const cfg = SPKMOD_MINING_FREECAM_CONFIG;
	const near = Math.max(0.01, Number(camera?.near) || 0.04);
	const fovDeg = Math.max(30, Math.min(130, Number(camera?.fov) || 75));
	const fovRad = (fovDeg * Math.PI) / 180;
	const fallbackAspect = (typeof window !== "undefined" && window.innerHeight > 0)
		? (window.innerWidth / window.innerHeight)
		: (16 / 9);
	const aspect = Math.max(0.5, Number(camera?.aspect) || fallbackAspect);
	const halfH = near * Math.tan(Math.min(Math.PI * 0.48, fovRad * 0.5));
	const halfW = halfH * aspect;
	const nearCornerRadius = Math.hypot(near, halfH, halfW);
	return Math.min(cfg.maxHalfExtent, Math.max(cfg.minHalfExtent, nearCornerRadius + cfg.nearClearanceMargin));
}

function spkmodMiningComputeNearCornerRadius(camera) {
	const near = Math.max(0.01, Number(camera?.near) || 0.04);
	const fovDeg = Math.max(30, Math.min(130, Number(camera?.fov) || 75));
	const fovRad = (fovDeg * Math.PI) / 180;
	const fallbackAspect = (typeof window !== "undefined" && window.innerHeight > 0)
		? (window.innerWidth / window.innerHeight)
		: (16 / 9);
	const aspect = Math.max(0.5, Number(camera?.aspect) || fallbackAspect);
	const halfH = near * Math.tan(Math.min(Math.PI * 0.48, fovRad * 0.5));
	const halfW = halfH * aspect;
	return { near, halfH, halfW, radius: Math.hypot(near, halfH, halfW) };
}

function spkmodMiningIsWithinEdgeBuffer(world, x, z, margin) {
	if (margin <= 0) return true;
	const offsets = [
		[-margin, -margin], [0, -margin], [margin, -margin],
		[-margin, 0], [margin, 0],
		[-margin, margin], [0, margin], [margin, margin]
	];
	for (let i = 0; i < offsets.length; i++) {
		const bx = Math.floor(x + offsets[i][0]);
		const bz = Math.floor(z + offsets[i][1]);
		if (!spkmodMiningIsColumnLoaded(world, bx, bz)) return false;
	}
	return true;
}

function spkmodMiningCollectDynamicBoxes(host, opts) {
	const boxes = [];
	if (!host) return boxes;
	const ignoreLocalBody = !!(opts && opts.ignoreLocalBody);
	const ignoredCartId = opts && opts.ignoredCartId != null ? opts.ignoredCartId : null;

	// 1. Minecarts (rotated horizontal footprint around cart root)
	if (host.cartView && host.cartView.carts && typeof host.cartView.carts.forEach === "function") {
		host.cartView.carts.forEach((entry, cartId) => {
			if (cartId === ignoredCartId) return;
			const root = entry && entry.root;
			if (!root || root.visible === false || !root.position) return;
			const yaw = root.rotation ? (root.rotation.y || 0) : 0;
			const c = Math.abs(Math.cos(yaw));
			const s = Math.abs(Math.sin(yaw));
			const hx = 0.42;
			const hz = 0.58;
			const ex = c * hx + s * hz;
			const ez = s * hx + c * hz;
			const px = root.position.x;
			const py = root.position.y;
			const pz = root.position.z;
			boxes.push([px - ex, py, pz - ez, px + ex, py + 0.72, pz + ez]);
		});
	}

	// 2. Merchant NPC
	if (host.merchantView && host.merchantView.group && host.merchantView.group.visible !== false) {
		const p = host.merchantView.group.position;
		if (p) {
			boxes.push([p.x - 0.45, p.y, p.z - 0.45, p.x + 0.45, p.y + 1.85, p.z + 0.45]);
		}
	}

	// 3. Entrance & Shop wooden signs (meshes only, skipping floating distance sprites)
	const pushSignMeshes = (signObj) => {
		const root = signObj && signObj.root;
		if (!root || root.visible === false) return;
		if (typeof root.updateMatrixWorld === "function") {
			try { root.updateMatrixWorld(true); } catch (_) {}
		}
		if (typeof THREE !== "undefined" && typeof THREE.Box3 === "function" && typeof root.traverse === "function") {
			const tmpBox = new THREE.Box3();
			root.traverse(child => {
				if (!child || !child.isMesh || child.isSprite || child.visible === false) return;
				if (!child.geometry) return;
				try {
					tmpBox.setFromObject(child);
					if (!tmpBox.isEmpty() &&
						Number.isFinite(tmpBox.min.x) && Number.isFinite(tmpBox.max.x)) {
						boxes.push([
							tmpBox.min.x, tmpBox.min.y, tmpBox.min.z,
							tmpBox.max.x, tmpBox.max.y, tmpBox.max.z
						]);
					}
				} catch (_) {}
			});
		} else if (root.position) {
			const p = root.position;
			boxes.push([p.x - 0.35, p.y - 0.5, p.z - 1.6, p.x + 0.35, p.y + 0.5, p.z + 1.6]);
		}
	};
	pushSignMeshes(host.entranceSign);
	pushSignMeshes(host.shopSign);

	// 4. Remote players
	if (host.remotes && typeof host.remotes.forEach === "function") {
		host.remotes.forEach(remote => {
			const g = remote && remote.group;
			if (!g || g.visible === false || !g.position) return;
			const p = g.position;
			boxes.push([p.x - 0.38, p.y, p.z - 0.38, p.x + 0.38, p.y + 1.85, p.z + 0.38]);
		});
	}

	// 5. Local player body (once the camera has moved clear of the local player)
	if (!ignoreLocalBody && host.body) {
		const pos = (host.riding && host.avatar && host.avatar.position) ? host.avatar.position : host.body;
		boxes.push([pos.x - 0.38, pos.y, pos.z - 0.38, pos.x + 0.38, pos.y + 1.85, pos.z + 0.38]);
	}

	return boxes;
}

function spkmodMiningBoxOverlapsList(minX, minY, minZ, maxX, maxY, maxZ, boxes) {
	if (!boxes || boxes.length === 0) return false;
	for (let i = 0; i < boxes.length; i++) {
		const b = boxes[i];
		if (!(b[0] >= maxX || b[3] <= minX || b[1] >= maxY || b[4] <= minY || b[2] >= maxZ || b[5] <= minZ)) {
			return true;
		}
	}
	return false;
}

function spkmodMiningIsCameraPosValid(world, x, y, z, halfExtent, dynamicBoxes, bounds) {
	if (!world || typeof world.blockAt !== "function") return false;
	if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return false;

	const minYLimit = bounds && typeof bounds.minY === "number" ? bounds.minY : halfExtent;
	const maxYLimit = bounds && typeof bounds.maxY === "number" ? bounds.maxY : SPKMOD_MINING_FREECAM_CONFIG.hardMaxY;
	if (y < minYLimit || y > maxYLimit) return false;

	const eps = 1e-4;
	const minX = x - halfExtent + eps;
	const maxX = x + halfExtent - eps;
	const minY = y - halfExtent + eps;
	const maxY = y + halfExtent - eps;
	const minZ = z - halfExtent + eps;
	const maxZ = z + halfExtent - eps;

	const bx0 = Math.floor(minX);
	const bx1 = Math.floor(maxX);
	const bz0 = Math.floor(minZ);
	const bz1 = Math.floor(maxZ);
	// Start scanning one block below minY because fences (shape 6) extend 1.5 blocks upward!
	const by0 = Math.floor(minY) - 1;
	const by1 = Math.floor(maxY);

	// 1. Strict loaded-chunk check at ALL Y heights (even y >= 100!)
	for (let bz = bz0; bz <= bz1; bz++) {
		for (let bx = bx0; bx <= bx1; bx++) {
			if (!spkmodMiningIsColumnLoaded(world, bx, bz)) {
				return false;
			}
		}
	}

	// 2. Unloaded-chunk edge buffer (prevents peeking over chunk border cutaways)
	if (bounds && bounds.enforceEdgeBuffer && bounds.edgeMargin > 0) {
		if (!spkmodMiningIsWithinEdgeBuffer(world, x, z, bounds.edgeMargin)) {
			return false;
		}
	}

	// 3. Exact voxel & sub-voxel AABB collision
	for (let by = by0; by <= by1; by++) {
		const isBelowMinCell = by < Math.floor(minY);
		for (let bz = bz0; bz <= bz1; bz++) {
			for (let bx = bx0; bx <= bx1; bx++) {
				const blockId = world.blockAt(bx, by, bz);
				if (!spkmodMiningIsBlockSolid(blockId)) continue;
				const shape = spkmodMiningBlockShape(blockId);
				if (shape === 0) {
					if (isBelowMinCell) continue;
					return false;
				}
				const subBoxes = spkmodMiningGetBlockCollisionBoxes(world, blockId, bx, by, bz);
				if (!subBoxes) continue;
				for (let k = 0; k < subBoxes.length; k++) {
					const sb = subBoxes[k];
					const sx0 = bx + sb[0];
					const sy0 = by + sb[1];
					const sz0 = bz + sb[2];
					const sx1 = bx + sb[3];
					const sy1 = by + sb[4];
					const sz1 = bz + sb[5];
					if (!(sx0 >= maxX || sx1 <= minX || sy0 >= maxY || sy1 <= minY || sz0 >= maxZ || sz1 <= minZ)) {
						return false;
					}
				}
			}
		}
	}

	// 4. Dynamic 3D scene object AABBs (minecarts, merchant, signs, players)
	if (spkmodMiningBoxOverlapsList(minX, minY, minZ, maxX, maxY, maxZ, dynamicBoxes)) {
		return false;
	}

	return true;
}

function spkmodMiningRaycastSegmentBlocked(world, ox, oy, oz, nx, ny, nz, extraMargin) {
	if (!world || typeof world.raycastSolid !== "function") return false;
	const dx = nx - ox;
	const dy = ny - oy;
	const dz = nz - oz;
	const dist = Math.hypot(dx, dy, dz);
	if (dist < 1e-7) return false;
	const dir = { x: dx / dist, y: dy / dist, z: dz / dist };
	const hit = world.raycastSolid({ x: ox, y: oy, z: oz }, dir, dist + (extraMargin || 0));
	return !!hit;
}

function spkmodMiningNearPlaneClear(world, x, y, z, yaw, pitch, camera) {
	if (!world || typeof world.raycastSolid !== "function") return true;
	const nc = spkmodMiningComputeNearCornerRadius(camera);
	const cosP = Math.cos(pitch);
	const sinP = Math.sin(pitch);
	const sinY = Math.sin(yaw);
	const cosY = Math.cos(yaw);

	// Camera basis for YXZ rotation order (matches Three.js PerspectiveCamera)
	const fx = -sinY * cosP;
	const fy = sinP;
	const fz = -cosY * cosP;
	const rx = cosY;
	const ry = 0;
	const rz = -sinY;
	// up = right x forward (camera local +Y)
	const ux = ry * fz - rz * fy;
	const uy = rz * fx - rx * fz;
	const uz = rx * fy - ry * fx;

	const scale = 1.45;
	const origin = { x, y, z };
	const signs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
	for (let i = 0; i < 4; i++) {
		const sx = signs[i][0] * nc.halfW * scale;
		const sy = signs[i][1] * nc.halfH * scale;
		const fn = nc.near * scale;
		const vx = fx * fn + rx * sx + ux * sy;
		const vy = fy * fn + ry * sx + uy * sy;
		const vz = fz * fn + rz * sx + uz * sy;
		const len = Math.hypot(vx, vy, vz);
		if (len < 1e-6) continue;
		const hit = world.raycastSolid(origin, { x: vx / len, y: vy / len, z: vz / len }, len);
		if (hit) return false;
	}
	return true;
}

function spkmodMiningMoveSwept(world, pos, vel, dx, dy, dz, halfExtent, dynamicBoxes, bounds) {
	const totalDist = Math.hypot(dx, dy, dz);
	if (totalDist < 1e-7) return false;

	const cfg = SPKMOD_MINING_FREECAM_CONFIG;
	const steps = Math.min(cfg.maxSubstepsPerFrame, Math.max(1, Math.ceil(totalDist / cfg.maxSubstepDist)));
	const sx = dx / steps;
	const sy = dy / steps;
	const sz = dz / steps;
	const rayLead = Math.max(0, halfExtent - 0.004);
	let moved = false;

	for (let i = 0; i < steps; i++) {
		if (Math.abs(sx) > 1e-8) {
			const nx = pos.x + sx;
			if (spkmodMiningIsCameraPosValid(world, nx, pos.y, pos.z, halfExtent, dynamicBoxes, bounds) &&
				!spkmodMiningRaycastSegmentBlocked(world, pos.x, pos.y, pos.z, nx, pos.y, pos.z, rayLead)) {
				pos.x = nx;
				moved = true;
			} else if (vel) {
				vel.x = 0;
			}
		}
		if (Math.abs(sy) > 1e-8) {
			const ny = pos.y + sy;
			if (spkmodMiningIsCameraPosValid(world, pos.x, ny, pos.z, halfExtent, dynamicBoxes, bounds) &&
				!spkmodMiningRaycastSegmentBlocked(world, pos.x, pos.y, pos.z, pos.x, ny, pos.z, rayLead)) {
				pos.y = ny;
				moved = true;
			} else if (vel) {
				vel.y = 0;
			}
		}
		if (Math.abs(sz) > 1e-8) {
			const nz = pos.z + sz;
			if (spkmodMiningIsCameraPosValid(world, pos.x, pos.y, nz, halfExtent, dynamicBoxes, bounds) &&
				!spkmodMiningRaycastSegmentBlocked(world, pos.x, pos.y, pos.z, pos.x, pos.y, nz, rayLead)) {
				pos.z = nz;
				moved = true;
			} else if (vel) {
				vel.z = 0;
			}
		}
	}
	return moved;
}

// Safely find a nearby valid spot reachable via clear line-of-sight (never pushes THROUGH a wall)
function spkmodMiningFindSafePushOut(world, ox, oy, oz, halfExtent, dynamicBoxes, bounds, maxOffset) {
	if (spkmodMiningIsCameraPosValid(world, ox, oy, oz, halfExtent, dynamicBoxes, bounds)) {
		return { x: ox, y: oy, z: oz };
	}
	const limit = maxOffset || 0.55;
	const radii = [0.12, 0.24, 0.36, 0.48, limit];
	const dirs = [
		[0, 1, 0], [0, -1, 0],
		[1, 0, 0], [-1, 0, 0],
		[0, 0, 1], [0, 0, -1],
		[0.707, 0, 0.707], [-0.707, 0, 0.707], [0.707, 0, -0.707], [-0.707, 0, -0.707],
		[0, 0.707, 0.707], [0, 0.707, -0.707], [0.707, 0.707, 0], [-0.707, 0.707, 0]
	];
	for (let rIdx = 0; rIdx < radii.length; rIdx++) {
		const r = radii[rIdx];
		if (r > limit + 1e-6) continue;
		for (let dIdx = 0; dIdx < dirs.length; dIdx++) {
			const d = dirs[dIdx];
			const nx = ox + d[0] * r;
			const ny = oy + d[1] * r;
			const nz = oz + d[2] * r;
			if (!spkmodMiningIsCameraPosValid(world, nx, ny, nz, halfExtent, dynamicBoxes, bounds)) continue;
			// Verify the push-out path does not jump across a solid wall (start from destination back to origin)
			if (!spkmodMiningRaycastSegmentBlocked(world, nx, ny, nz, ox, oy, oz, 0)) {
				return { x: nx, y: ny, z: nz };
			}
		}
	}
	return null;
}

function spkmodIsEditableEventTarget(e) {
	try {
		if (e && typeof e.composedPath === "function") {
			const path = e.composedPath();
			for (let i = 0; i < path.length; i++) {
				const el = path[i];
				if (!el || typeof el.matches !== "function") continue;
				if (el.isContentEditable || el.matches("input, textarea, select")) return true;
			}
		}
	} catch (_) {}
	try {
		const active = typeof document !== "undefined" ? document.activeElement : null;
		if (active) {
			const tag = active.tagName ? active.tagName.toLowerCase() : "";
			if (tag === "input" || tag === "textarea" || tag === "select" || active.isContentEditable) return true;
		}
	} catch (_) {}
	return false;
}
if (typeof window !== "undefined") {
	window.spkmodIsEditableEventTarget = spkmodIsEditableEventTarget;
}

// ============================================================================
// RUNTIME CONTROLLER (HOOKS, UI HIDING, INPUT, LOCAL AVATAR, LIFECYCLE)
// ============================================================================

const spkmodMiningFreeCamState = {
	active: false,
	host: null,
	pos: { x: 0, y: 0, z: 0 },
	lastSafePos: { x: 0, y: 0, z: 0 },
	vel: { x: 0, y: 0, z: 0 },
	speed: SPKMOD_MINING_FREECAM_CONFIG.baseSpeed,
	savedYawRad: 0,
	savedPitchRad: 0,
	savedFacingYaw: 0,
	savedBodyGrounded: true,
	enforceEdgeBuffer: true,
	maxY: SPKMOD_MINING_FREECAM_CONFIG.hardMaxY,
	leftLocalBody: false,
	ignoredCartId: null,
	localAvatar: null,
	mySkinItemId: 0,
	lastFrameMs: 0,
	keys: {
		w: false, s: false, a: false, d: false,
		up: false, down: false, boost: false
	},
	drag: {
		active: false,
		pointerId: null,
		lastX: 0,
		lastY: 0,
		moved: 0,
		button: -1
	},
	hiddenSprites: new Map(),
	savedGuideWedgeVisible: false,
	watchdogId: null
};

const SPKMOD_MINING_BLOCKED_KEYS = new Set([
	"KeyW", "KeyA", "KeyS", "KeyD",
	"ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
	"Space", "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight",
	"KeyC", "KeyF", "KeyR", "KeyT", "KeyE", "KeyQ", "KeyX", "KeyH",
	"KeyB", "KeyO", "KeyG", "KeyV", "KeyL", "KeyP", "KeyN",
	"Digit0", "Digit1", "Digit2", "Digit3", "Digit4",
	"Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
	"Enter", "NumpadEnter", "Escape", "F2", "F3", "F9"
]);

function spkmodGetActiveMiningHost() {
	const gs = (typeof window !== "undefined" && window.gameState)
		? window.gameState
		: (typeof gameState !== "undefined" ? gameState : null);
	const host = gs && gs.miningHost ? gs.miningHost : null;
	if (host && typeof host.isActive === "function" && host.isActive()) return host;
	return null;
}

function spkmodEnsureMiningFreeCamDocStyles() {
	if (typeof document === "undefined" || !document.head) return;
	let style = document.getElementById("spkmod-mining-freecam-doc-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "spkmod-mining-freecam-doc-style";
		style.textContent = `
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active > [id^="spkmod-"]:not(#spkmod-yt-iframe-container):not(#spkmod-fx-svg):not(svg):not(style),
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active > .spkmod-floating-button,
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active > .spkmod-music-modal,
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active > .spkmod-music-floating-btn,
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active .sr-chatbox,
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active .sr-chatbox__block-menu,
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active [slot="speakov-chat"],
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active [slot="mining-waypoint"],
			html body.spkmod-mining-freecam-active.spkmod-mining-freecam-active .sr-hud {
				display: none !important;
				visibility: hidden !important;
				pointer-events: none !important;
			}
		`;
		document.head.appendChild(style);
	}
}

function spkmodEnsureMiningFreeCamShadowStyles(host) {
	if (!host || !host.shadow || typeof document === "undefined") return;
	if (host.shadow.getElementById && host.shadow.getElementById("spkmod-mining-freecam-shadow-style")) return;
	if (typeof host.shadow.querySelector === "function" && host.shadow.querySelector("#spkmod-mining-freecam-shadow-style")) return;
	const style = document.createElement("style");
	style.id = "spkmod-mining-freecam-shadow-style";
	style.textContent = `
		:host(.spkmod-mining-freecam) > :not(canvas):not(style) {
			display: none !important;
			visibility: hidden !important;
			pointer-events: none !important;
		}
		:host(.spkmod-mining-freecam) ::slotted(*) {
			display: none !important;
			visibility: hidden !important;
			pointer-events: none !important;
		}
	`;
	host.shadow.appendChild(style);
}

function spkmodMiningHideSpriteTree(root) {
	if (!root || typeof root.traverse !== "function") return;
	const map = spkmodMiningFreeCamState.hiddenSprites;
	root.traverse(obj => {
		if (obj && obj.isSprite) {
			if (!map.has(obj)) {
				map.set(obj, obj.visible);
			}
			obj.visible = false;
		}
	});
}

function spkmodMiningEnforce3DOverlaysHidden(host) {
	if (!host) return;
	if (host.highlight) host.highlight.visible = false;
	if (host.placeHighlight) host.placeHighlight.visible = false;
	if (host.viewmodel && typeof host.viewmodel.setVisible === "function") {
		host.viewmodel.setVisible(false);
	}
	if (host.guideMarker && host.guideMarker.wedge) {
		host.guideMarker.wedge.visible = false;
	}
	if (host.remotes && typeof host.remotes.forEach === "function") {
		host.remotes.forEach(remote => {
			if (remote && remote.group) spkmodMiningHideSpriteTree(remote.group);
		});
	}
	if (host.merchantView && host.merchantView.group) {
		spkmodMiningHideSpriteTree(host.merchantView.group);
	}
	if (host.entranceSign && host.entranceSign.root) {
		spkmodMiningHideSpriteTree(host.entranceSign.root);
	}
	if (host.chatBubbles && host.chatBubbles.bubbles && typeof host.chatBubbles.bubbles.forEach === "function") {
		host.chatBubbles.bubbles.forEach(entry => {
			if (entry && entry.sprite) {
				if (!spkmodMiningFreeCamState.hiddenSprites.has(entry.sprite)) {
					spkmodMiningFreeCamState.hiddenSprites.set(entry.sprite, entry.sprite.visible);
				}
				entry.sprite.visible = false;
			}
		});
	}
}

function spkmodMiningRestore3DOverlays(host) {
	const map = spkmodMiningFreeCamState.hiddenSprites;
	map.forEach((wasVisible, sprite) => {
		try {
			if (sprite) sprite.visible = wasVisible;
		} catch (_) {}
	});
	map.clear();

	if (host) {
		if (host.viewmodel && typeof host.viewmodel.setVisible === "function") {
			host.viewmodel.setVisible(host.riding === null);
		}
		if (host.guideMarker && host.guideMarker.wedge) {
			host.guideMarker.wedge.visible = host.guideMarker.target !== null;
		}
	}
}

function spkmodMiningClearKeysAndDrag() {
	const st = spkmodMiningFreeCamState;
	st.keys.w = false;
	st.keys.s = false;
	st.keys.a = false;
	st.keys.d = false;
	st.keys.up = false;
	st.keys.down = false;
	st.keys.boost = false;
	st.drag.active = false;
	st.drag.pointerId = null;
	st.drag.button = -1;
	st.drag.moved = 0;
}

function spkmodMiningGetLocalSkinItemId() {
	if (spkmodMiningFreeCamState.mySkinItemId > 0) return spkmodMiningFreeCamState.mySkinItemId;
	const gs = (typeof window !== "undefined" && window.gameState)
		? window.gameState
		: (typeof gameState !== "undefined" ? gameState : null);
	return Number(gs?.myStat?.skinItemId || gs?.localAvatar?.skinItemId || gs?.character?.skinItemId || 0) || 0;
}

function spkmodMiningSpawnLocalAvatar(host) {
	if (!host || !host.pickaxeKit || typeof host.createMiningAvatar !== "function") return null;
	if (spkmodMiningFreeCamState.localAvatar && !spkmodMiningFreeCamState.localAvatar.disposed) {
		return spkmodMiningFreeCamState.localAvatar;
	}
	try {
		const skinItemId = spkmodMiningGetLocalSkinItemId();
		// Pass null for labelText so no floating nameplate is shown during F4 free-cam
		const avatar = host.createMiningAvatar(skinItemId, null, 0xffa050, host.myObjectId);
		if (avatar && avatar.group) {
			avatar.group.name = "__spkmodMiningFreeCamLocalAvatar";
			avatar.group.visible = false;
			spkmodMiningFreeCamState.localAvatar = avatar;
			return avatar;
		}
	} catch (err) {
		console.warn("[SpeakiMod+] Mining free-cam local avatar spawn skipped:", err);
	}
	return null;
}

function spkmodMiningDisposeLocalAvatar() {
	const av = spkmodMiningFreeCamState.localAvatar;
	spkmodMiningFreeCamState.localAvatar = null;
	if (!av) return;
	try {
		if (typeof av.dispose === "function") {
			av.dispose();
		} else if (av.group && typeof av.group.removeFromParent === "function") {
			av.group.removeFromParent();
		}
	} catch (_) {}
}

function spkmodMiningSyncLocalAvatar(host, dt) {
	const st = spkmodMiningFreeCamState;
	const av = st.localAvatar;
	if (!av || av.disposed || !av.group || !host || !host.body) return;

	const anchor = (host.riding && host.avatar && host.avatar.position) ? host.avatar.position : host.body;
	const yaw = host.riding ? (host.avatar?.rotation?.y ?? st.savedFacingYaw) : st.savedFacingYaw;
	av.group.position.set(anchor.x, anchor.y, anchor.z);
	av.group.rotation.y = yaw;
	if (typeof av.setMoving === "function") av.setMoving(false);
	if (typeof av.setRiding === "function") av.setRiding(host.riding !== null);

	const distFromBody = Math.hypot(
		st.pos.x - anchor.x,
		st.pos.y - (anchor.y + 0.9),
		st.pos.z - anchor.z
	);
	if (!st.leftLocalBody && distFromBody > SPKMOD_MINING_FREECAM_CONFIG.localAvatarRevealDist) {
		st.leftLocalBody = true;
	}
	av.group.visible = st.leftLocalBody && distFromBody > SPKMOD_MINING_FREECAM_CONFIG.localAvatarRevealDist;

	if (typeof av.update === "function") {
		try { av.update(dt, host.brightnessProbe); } catch (_) {}
	}
}

function spkmodMiningUpdateFreeCamFrame(host) {
	const st = spkmodMiningFreeCamState;
	if (!st.active || st.host !== host) return;
	if (!host.isActive || !host.isActive() || !host.world || !host.miningCamera || !host.camera || !host.body) {
		spkmodExitMiningFreeCam(host);
		return;
	}

	const now = performance.now();
	const dt = st.lastFrameMs > 0 ? Math.min(0.05, Math.max(0.001, (now - st.lastFrameMs) / 1000)) : 0.016;
	st.lastFrameMs = now;

	const world = host.world;
	const mc = host.miningCamera;
	const cam = host.camera;
	const halfExtent = spkmodMiningComputeHalfExtent(cam);
	const bounds = {
		minY: halfExtent,
		maxY: st.maxY,
		enforceEdgeBuffer: st.enforceEdgeBuffer,
		edgeMargin: SPKMOD_MINING_FREECAM_CONFIG.edgeBufferBlocks
	};

	// Check if camera has cleared the ridden cart (if started while seated)
	if (st.ignoredCartId != null && host.cartView && host.cartView.carts) {
		const cartBoxes = spkmodMiningCollectDynamicBoxes(host, { ignoreLocalBody: true, ignoredCartId: null });
		const eps = 1e-4;
		const overlapsAnyCart = spkmodMiningBoxOverlapsList(
			st.pos.x - halfExtent + eps, st.pos.y - halfExtent + eps, st.pos.z - halfExtent + eps,
			st.pos.x + halfExtent - eps, st.pos.y + halfExtent - eps, st.pos.z + halfExtent - eps,
			cartBoxes
		);
		if (!overlapsAnyCart) {
			st.ignoredCartId = null;
		}
	}

	const dynamicBoxes = spkmodMiningCollectDynamicBoxes(host, {
		ignoreLocalBody: !st.leftLocalBody,
		ignoredCartId: st.ignoredCartId
	});

	// Anti-X-Ray embedded-block guard: if a block was placed / door closed / cart moved on camera
	if (!spkmodMiningIsCameraPosValid(world, st.pos.x, st.pos.y, st.pos.z, halfExtent, dynamicBoxes, bounds)) {
		const pushed = spkmodMiningFindSafePushOut(world, st.pos.x, st.pos.y, st.pos.z, halfExtent, dynamicBoxes, bounds, 0.55);
		if (pushed) {
			st.pos.x = pushed.x;
			st.pos.y = pushed.y;
			st.pos.z = pushed.z;
		} else if (spkmodMiningIsCameraPosValid(world, st.lastSafePos.x, st.lastSafePos.y, st.lastSafePos.z, halfExtent, dynamicBoxes, bounds)) {
			st.pos.x = st.lastSafePos.x;
			st.pos.y = st.lastSafePos.y;
			st.pos.z = st.lastSafePos.z;
		} else {
			// Fallback to player's eye position (guaranteed safe)
			const eyeH = host.riding ? SPKMOD_MINING_FREECAM_CONFIG.eyeHeightSeated : SPKMOD_MINING_FREECAM_CONFIG.eyeHeightStanding;
			const anchor = (host.riding && host.avatar && host.avatar.position) ? host.avatar.position : host.body;
			st.pos.x = anchor.x;
			st.pos.y = anchor.y + eyeH;
			st.pos.z = anchor.z;
			st.leftLocalBody = false;
		}
		st.vel.x = 0;
		st.vel.y = 0;
		st.vel.z = 0;
	} else {
		st.lastSafePos.x = st.pos.x;
		st.lastSafePos.y = st.pos.y;
		st.lastSafePos.z = st.pos.z;
	}

	// Compute desired 3D velocity from keyboard + optional gamepad
	const yaw = mc.shownYawRad || 0;
	const pitch = mc.shownPitchRad || 0;
	const cosP = Math.cos(pitch);
	const sinP = Math.sin(pitch);
	const sinY = Math.sin(yaw);
	const cosY = Math.cos(yaw);

	const fx = -sinY * cosP;
	const fy = sinP;
	const fz = -cosY * cosP;
	const rx = cosY;
	const rz = -sinY;

	let fwd = (st.keys.w ? 1 : 0) - (st.keys.s ? 1 : 0);
	let strafe = (st.keys.d ? 1 : 0) - (st.keys.a ? 1 : 0);
	let vert = (st.keys.up ? 1 : 0) - (st.keys.down ? 1 : 0);

	// Optional gamepad stick flight when a controller is connected
	if (typeof navigator !== "undefined" && typeof navigator.getGamepads === "function") {
		try {
			const gps = navigator.getGamepads();
			for (let i = 0; i < gps.length; i++) {
				const gp = gps[i];
				if (!gp || !gp.connected) continue;
				const dz = 0.16;
				const lx = Math.abs(gp.axes[0] || 0) > dz ? gp.axes[0] : 0;
				const ly = Math.abs(gp.axes[1] || 0) > dz ? gp.axes[1] : 0;
				const rxAxis = Math.abs(gp.axes[2] || 0) > dz ? gp.axes[2] : 0;
				const ryAxis = Math.abs(gp.axes[3] || 0) > dz ? gp.axes[3] : 0;
				if (lx !== 0) strafe += lx;
				if (ly !== 0) fwd -= ly;
				if (gp.buttons && gp.buttons[0]?.pressed) vert += 1; // A / Cross ascend
				if (gp.buttons && gp.buttons[1]?.pressed) vert -= 1; // B / Circle descend
				if ((rxAxis !== 0 || ryAxis !== 0) && host.input && typeof host.input.addLookDelta === "function") {
					host.input.addLookDelta(rxAxis * 14, ryAxis * 14);
				}
				break;
			}
		} catch (_) {}
	}

	let dirX = fx * fwd + rx * strafe;
	let dirY = fy * fwd + vert;
	let dirZ = fz * fwd + rz * strafe;
	const dirMag = Math.hypot(dirX, dirY, dirZ);
	if (dirMag > 1) {
		dirX /= dirMag;
		dirY /= dirMag;
		dirZ /= dirMag;
	}

	const effSpeed = st.speed * (st.keys.boost ? SPKMOD_MINING_FREECAM_CONFIG.boostMultiplier : 1.0);
	const targetVX = dirX * effSpeed;
	const targetVY = dirY * effSpeed;
	const targetVZ = dirZ * effSpeed;

	const blend = 1 - Math.exp(-SPKMOD_MINING_FREECAM_CONFIG.accelRate * dt);
	st.vel.x += (targetVX - st.vel.x) * blend;
	st.vel.y += (targetVY - st.vel.y) * blend;
	st.vel.z += (targetVZ - st.vel.z) * blend;
	if (Math.abs(st.vel.x) < 1e-4) st.vel.x = 0;
	if (Math.abs(st.vel.y) < 1e-4) st.vel.y = 0;
	if (Math.abs(st.vel.z) < 1e-4) st.vel.z = 0;

	const prevX = st.pos.x;
	const prevY = st.pos.y;
	const prevZ = st.pos.z;

	spkmodMiningMoveSwept(
		world, st.pos, st.vel,
		st.vel.x * dt, st.vel.y * dt, st.vel.z * dt,
		halfExtent, dynamicBoxes, bounds
	);

	// Belt-and-suspenders near-clip 4-corner raycast guard (protects against any unknown future block shape)
	if (!spkmodMiningNearPlaneClear(world, st.pos.x, st.pos.y, st.pos.z, yaw, pitch, cam)) {
		st.pos.x = prevX;
		st.pos.y = prevY;
		st.pos.z = prevZ;
		st.vel.x = 0;
		st.vel.y = 0;
		st.vel.z = 0;
	} else {
		st.lastSafePos.x = st.pos.x;
		st.lastSafePos.y = st.pos.y;
		st.lastSafePos.z = st.pos.z;
	}

	cam.position.set(st.pos.x, st.pos.y, st.pos.z);
	cam.rotation.set(pitch, yaw, 0);

	spkmodMiningSyncLocalAvatar(host, dt);
}

function spkmodInstallMiningFreeCamHooks(host) {
	if (!host) return;

	// Hook host-level methods once per host instance
	if (!host.__spkmodMiningFreeCamHostHooked) {
		host.__spkmodMiningFreeCamHostHooked = true;

		if (typeof host.exit === "function") {
			const origExit = host.exit.bind(host);
			host.exit = function() {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) {
					spkmodExitMiningFreeCam(host);
				}
				return origExit();
			};
		}

		if (typeof host.applyPlayerSpawn === "function") {
			const origApplySpawn = host.applyPlayerSpawn.bind(host);
			host.applyPlayerSpawn = function(players) {
				try {
					if (Array.isArray(players)) {
						for (let i = 0; i < players.length; i++) {
							const p = players[i];
							if (p && p.playerId === host.myObjectId && p.skinItemId) {
								spkmodMiningFreeCamState.mySkinItemId = p.skinItemId;
							}
						}
					}
				} catch (_) {}
				return origApplySpawn(players);
			};
		}

		if (typeof host.stepLocalBody === "function") {
			const origStepLocalBody = host.stepLocalBody.bind(host);
			host.stepLocalBody = function(input, yaw, dt) {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) {
					// Freeze player horizontal movement & facing yaw; only allow gentle landing if mid-air
					const savedYaw = spkmodMiningFreeCamState.savedFacingYaw;
					host.localMoving = false;
					host.facingYaw = savedYaw;
					if (host.world && host.body && !host.body.grounded && typeof host.world.stepPhysics === "function") {
						host.world.stepPhysics(host.body, { moveVx: 0, moveVz: 0, jump: false }, dt);
					}
					if (host.avatar && host.avatar.position && host.body) {
						host.avatar.position.set(host.body.x, host.body.y, host.body.z);
						host.avatar.rotation.y = savedYaw;
					}
					return;
				}
				return origStepLocalBody(input, yaw, dt);
			};
		}

		if (typeof host.updateFog === "function") {
			const origUpdateFog = host.updateFog.bind(host);
			host.updateFog = function(world, dt) {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host && host.body && host.camera) {
					// Evaluate sky-lit / underground fog at CAMERA position so surface fog never leaks underground
					const bx = host.body.x;
					const by = host.body.y;
					const bz = host.body.z;
					try {
						host.body.x = spkmodMiningFreeCamState.pos.x;
						host.body.y = spkmodMiningFreeCamState.pos.y - SPKMOD_MINING_FREECAM_CONFIG.fogBodyEyeOffset;
						host.body.z = spkmodMiningFreeCamState.pos.z;
						return origUpdateFog(world, dt);
					} finally {
						host.body.x = bx;
						host.body.y = by;
						host.body.z = bz;
					}
				}
				return origUpdateFog(world, dt);
			};
		}

		if (typeof host.updateTargetAndBreak === "function") {
			const origUpdateTarget = host.updateTargetAndBreak.bind(host);
			host.updateTargetAndBreak = function(nowMs) {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) {
					if (host.highlight) host.highlight.visible = false;
					if (host.placeHighlight) host.placeHighlight.visible = false;
					if (typeof host.cancelBreakRequest === "function") host.cancelBreakRequest();
					return;
				}
				return origUpdateTarget(nowMs);
			};
		}

		if (typeof host.tryPlace === "function") {
			const origTryPlace = host.tryPlace.bind(host);
			host.tryPlace = function() {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) return;
				return origTryPlace();
			};
		}

		if (typeof host.performAction === "function") {
			const origPerformAction = host.performAction.bind(host);
			host.performAction = function(action) {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) return;
				return origPerformAction(action);
			};
		}

		if (typeof host.updateViewmodel === "function") {
			const origUpdateViewmodel = host.updateViewmodel.bind(host);
			host.updateViewmodel = function(dt) {
				if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) {
					// Runs right before renderer.render(): enforce all 3D overlays/sprites stay hidden
					spkmodMiningEnforce3DOverlaysHidden(host);
					return;
				}
				return origUpdateViewmodel(dt);
			};
		}
	}

	// Hook miningCamera.update (recreated on each host.enter())
	if (host.miningCamera && !host.miningCamera.__spkmodFreeCamHooked) {
		host.miningCamera.__spkmodFreeCamHooked = true;
		const mc = host.miningCamera;
		const origCamUpdate = mc.update.bind(mc);
		mc.update = function() {
			if (spkmodMiningFreeCamState.active && spkmodMiningFreeCamState.host === host) {
				spkmodMiningUpdateFreeCamFrame(host);
				return;
			}
			return origCamUpdate();
		};
	}
}

function spkmodEnterMiningFreeCam(host) {
	const targetHost = host || spkmodGetActiveMiningHost();
	if (!targetHost || !targetHost.isActive || !targetHost.isActive()) return false;
	if (!targetHost.ready || !targetHost.world || !targetHost.miningCamera || !targetHost.camera || !targetHost.body) return false;
	if (targetHost.body.embedded) return false; // Never allow entering free-cam while embedded in solid blocks

	if (spkmodMiningFreeCamState.active) {
		if (spkmodMiningFreeCamState.host === targetHost) return true;
		spkmodExitMiningFreeCam(spkmodMiningFreeCamState.host);
	}

	spkmodInstallMiningFreeCamHooks(targetHost);

	// Close any open mining HUD panels so hidden panels cannot trap input
	if (targetHost.hud && targetHost.hud.anyPanelOpen && typeof targetHost.hud.closePanels === "function") {
		try { targetHost.hud.closePanels(); } catch (_) {}
	}
	if (typeof targetHost.cancelBreakRequest === "function") {
		try { targetHost.cancelBreakRequest(); } catch (_) {}
	}
	// Clear held movement/break keys without releasing pointer lock
	if (targetHost.input) {
		try { targetHost.input.keys?.clear?.(); } catch (_) {}
		try { targetHost.input.setPrimaryHeld?.(false); } catch (_) {}
	}
	if (typeof lunDroneModeActive !== "undefined" && lunDroneModeActive) {
		lunDroneModeActive = false;
	}

	const st = spkmodMiningFreeCamState;
	const mc = targetHost.miningCamera;
	const world = targetHost.world;
	const cam = targetHost.camera;
	const halfExtent = spkmodMiningComputeHalfExtent(cam);

	const eyeH = targetHost.riding
		? SPKMOD_MINING_FREECAM_CONFIG.eyeHeightSeated
		: SPKMOD_MINING_FREECAM_CONFIG.eyeHeightStanding;
	const anchor = (targetHost.riding && targetHost.avatar && targetHost.avatar.position)
		? targetHost.avatar.position
		: targetHost.body;

	const startX = Number.isFinite(cam.position?.x) ? cam.position.x : anchor.x;
	const startY = Number.isFinite(cam.position?.y) ? cam.position.y : (anchor.y + eyeH);
	const startZ = Number.isFinite(cam.position?.z) ? cam.position.z : anchor.z;

	const entranceY = Number(targetHost.snapshot?.entranceY);
	const baseY = Math.max(Number.isFinite(entranceY) ? entranceY : 64, anchor.y);
	const maxY = Math.min(SPKMOD_MINING_FREECAM_CONFIG.hardMaxY, baseY + SPKMOD_MINING_FREECAM_CONFIG.ceilingAboveBase);
	const enforceEdgeBuffer = spkmodMiningIsWithinEdgeBuffer(world, startX, startZ, SPKMOD_MINING_FREECAM_CONFIG.edgeBufferBlocks);
	const bounds = {
		minY: halfExtent,
		maxY,
		enforceEdgeBuffer,
		edgeMargin: SPKMOD_MINING_FREECAM_CONFIG.edgeBufferBlocks
	};
	const ignoredCartId = targetHost.riding ? targetHost.riding.cartId : null;
	const dynamicBoxes = spkmodMiningCollectDynamicBoxes(targetHost, {
		ignoreLocalBody: true,
		ignoredCartId
	});

	const safeStart = spkmodMiningFindSafePushOut(world, startX, startY, startZ, halfExtent, dynamicBoxes, bounds, 0.45);
	if (!safeStart) {
		return false; // Refuse activation if camera cannot be placed cleanly outside all solid geometry
	}

	st.active = true;
	st.host = targetHost;
	st.pos.x = safeStart.x;
	st.pos.y = safeStart.y;
	st.pos.z = safeStart.z;
	st.lastSafePos.x = safeStart.x;
	st.lastSafePos.y = safeStart.y;
	st.lastSafePos.z = safeStart.z;
	st.vel.x = 0;
	st.vel.y = 0;
	st.vel.z = 0;
	st.savedYawRad = mc.yawRad || 0;
	st.savedPitchRad = mc.lookPitchRad || 0;
	st.savedFacingYaw = targetHost.facingYaw || 0;
	st.enforceEdgeBuffer = enforceEdgeBuffer;
	st.maxY = maxY;
	st.leftLocalBody = false;
	st.ignoredCartId = ignoredCartId;
	st.lastFrameMs = performance.now();
	spkmodMiningClearKeysAndDrag();

	// Hide both Game UI (mining shadow DOM + chat + waypoints + 3D overlays/sprites) and Mod UI
	spkmodEnsureMiningFreeCamDocStyles();
	spkmodEnsureMiningFreeCamShadowStyles(targetHost);
	if (typeof document !== "undefined" && document.body) {
		document.body.classList.add("spkmod-mining-freecam-active");
	}
	if (targetHost.host && targetHost.host.classList) {
		targetHost.host.classList.add("spkmod-mining-freecam");
	}
	spkmodMiningEnforce3DOverlaysHidden(targetHost);

	// Spawn 3D local character avatar so player can see themselves when flying around
	spkmodMiningSpawnLocalAvatar(targetHost);
	spkmodMiningSyncLocalAvatar(targetHost, 0.016);

	if (st.watchdogId) clearInterval(st.watchdogId);
	st.watchdogId = setInterval(() => {
		if (!st.active) {
			clearInterval(st.watchdogId);
			st.watchdogId = null;
			return;
		}
		if (!st.host || !st.host.isActive || !st.host.isActive()) {
			spkmodExitMiningFreeCam(st.host);
		}
	}, 400);

	return true;
}

function spkmodExitMiningFreeCam(host) {
	const st = spkmodMiningFreeCamState;
	const targetHost = host || st.host;
	const wasActive = st.active;

	st.active = false;
	st.host = null;
	st.vel.x = 0;
	st.vel.y = 0;
	st.vel.z = 0;
	st.leftLocalBody = false;
	st.ignoredCartId = null;
	spkmodMiningClearKeysAndDrag();

	if (st.watchdogId) {
		clearInterval(st.watchdogId);
		st.watchdogId = null;
	}

	// Restore Game UI & Mod UI
	if (typeof document !== "undefined" && document.body) {
		document.body.classList.remove("spkmod-mining-freecam-active");
	}
	if (targetHost && targetHost.host && targetHost.host.classList) {
		targetHost.host.classList.remove("spkmod-mining-freecam");
	}

	// Remove temporary 3D local avatar and restore 3D overlays / viewmodel / sprites
	spkmodMiningDisposeLocalAvatar();
	spkmodMiningRestore3DOverlays(targetHost);

	// Restore first-person camera to player's original eye position & orientation
	if (wasActive && targetHost && targetHost.isActive && targetHost.isActive()) {
		if (targetHost.miningCamera) {
			targetHost.miningCamera.yawRad = st.savedYawRad;
			targetHost.miningCamera.lookPitchRad = st.savedPitchRad;
			targetHost.miningCamera.shownYawRad = st.savedYawRad;
			targetHost.miningCamera.shownPitchRad = st.savedPitchRad;
			if (typeof targetHost.miningCamera.snapToTarget === "function") {
				targetHost.miningCamera.snapToTarget();
			}
		}
		if (targetHost.input && targetHost.input.keys) {
			try { targetHost.input.keys.clear(); } catch (_) {}
		}
	}

	return true;
}

function spkmodToggleMiningFreeCam(host) {
	const activeHost = host || spkmodGetActiveMiningHost();
	if (spkmodMiningFreeCamState.active) {
		spkmodExitMiningFreeCam(spkmodMiningFreeCamState.host || activeHost);
		return false;
	}
	if (!activeHost) return false;
	return spkmodEnterMiningFreeCam(activeHost);
}

function spkmodHandleMiningFreeCamF4(e) {
	const activeHost = spkmodGetActiveMiningHost();
	if (!activeHost && !spkmodMiningFreeCamState.active) return false;
	if (e) {
		e.preventDefault();
		e.stopPropagation();
		if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
	}
	spkmodToggleMiningFreeCam(activeHost);
	return true;
}

// ============================================================================
// CAPTURE-PHASE INPUT HANDLERS WHILE MINING FREE-CAM IS ACTIVE
// ============================================================================

function spkmodMiningApplyLookDelta(host, dx, dy) {
	if (!host) return;
	const settings = typeof window.getGameSettings === "function" ? window.getGameSettings() : null;
	const sens = Number(settings?.miningMouseSensitivity) || 1.0;
	if (host.input && typeof host.input.addLookDelta === "function") {
		host.input.addLookDelta(dx * sens, dy * sens);
		return;
	}
	if (host.miningCamera) {
		const inv = settings?.miningInvertY ? -1 : 1;
		const k = SPKMOD_MINING_FREECAM_CONFIG.dragLookSensitivity;
		host.miningCamera.yawRad -= dx * sens * k;
		host.miningCamera.lookPitchRad = Math.max(
			-SPKMOD_MINING_FREECAM_CONFIG.maxPitchRad,
			Math.min(SPKMOD_MINING_FREECAM_CONFIG.maxPitchRad, host.miningCamera.lookPitchRad - dy * sens * inv * k)
		);
	}
}

if (typeof window !== "undefined" && !window.__spkmodMiningFreeCamListenersInstalled) {
	window.__spkmodMiningFreeCamListenersInstalled = true;

	window.addEventListener("keydown", e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active) return;

		// F4 exits mining free-cam cleanly (handled here too in case event order differs)
		if ((e.key === "F4" || e.code === "F4") && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
			if (e.repeat) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				return;
			}
			spkmodHandleMiningFreeCamF4(e);
			return;
		}

		// Speed adjustment (+/- or Numpad +/-)
		if (e.code === "NumpadAdd" || e.code === "Equal" || e.key === "+") {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			st.speed = Math.min(SPKMOD_MINING_FREECAM_CONFIG.maxSpeed, +(st.speed * 1.15).toFixed(3));
			return;
		}
		if (e.code === "NumpadSubtract" || e.code === "Minus" || e.key === "-") {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			st.speed = Math.max(SPKMOD_MINING_FREECAM_CONFIG.minSpeed, +(st.speed / 1.15).toFixed(3));
			return;
		}

		// Flight controls
		let consumed = false;
		if (e.code === "KeyW" || e.code === "ArrowUp") { st.keys.w = true; consumed = true; }
		else if (e.code === "KeyS" || e.code === "ArrowDown") { st.keys.s = true; consumed = true; }
		else if (e.code === "KeyA" || e.code === "ArrowLeft") { st.keys.a = true; consumed = true; }
		else if (e.code === "KeyD" || e.code === "ArrowRight") { st.keys.d = true; consumed = true; }
		else if (e.code === "Space") { st.keys.up = true; consumed = true; }
		else if (e.code === "ControlLeft" || e.code === "ControlRight") { st.keys.down = true; consumed = true; }
		else if (e.code === "ShiftLeft" || e.code === "ShiftRight") { st.keys.boost = true; consumed = true; }

		// Block all mining gameplay / UI / chat / F9 / P shortcuts while in free-cam
		const hudToggleKey = (
			typeof window.getGameSettings === "function"
				? window.getGameSettings()?.keybindOverrides?.hudToggle
				: null
		) || "f9";
		if (consumed || SPKMOD_MINING_BLOCKED_KEYS.has(e.code) || (e.key && e.key.toLowerCase() === hudToggleKey.toLowerCase())) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}, { capture: true });

	window.addEventListener("keyup", e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active) return;
		let consumed = false;
		if (e.code === "KeyW" || e.code === "ArrowUp") { st.keys.w = false; consumed = true; }
		else if (e.code === "KeyS" || e.code === "ArrowDown") { st.keys.s = false; consumed = true; }
		else if (e.code === "KeyA" || e.code === "ArrowLeft") { st.keys.a = false; consumed = true; }
		else if (e.code === "KeyD" || e.code === "ArrowRight") { st.keys.d = false; consumed = true; }
		else if (e.code === "Space") { st.keys.up = false; consumed = true; }
		else if (e.code === "ControlLeft" || e.code === "ControlRight") { st.keys.down = false; consumed = true; }
		else if (e.code === "ShiftLeft" || e.code === "ShiftRight") { st.keys.boost = false; consumed = true; }

		if (consumed || SPKMOD_MINING_BLOCKED_KEYS.has(e.code)) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}, { capture: true });

	window.addEventListener("wheel", e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active) return;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		const factor = e.deltaY < 0 ? 1.15 : (1 / 1.15);
		st.speed = Math.max(
			SPKMOD_MINING_FREECAM_CONFIG.minSpeed,
			Math.min(SPKMOD_MINING_FREECAM_CONFIG.maxSpeed, +(st.speed * factor).toFixed(3))
		);
	}, { capture: true, passive: false });

	window.addEventListener("pointerdown", e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active || !st.host) return;
		// Block mining break/place clicks completely while in free-cam
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();

		const locked = !!(st.host.input && typeof st.host.input.isCanvasLocked === "function" && st.host.input.isCanvasLocked());
		if (locked) return;

		if (e.pointerType === "mouse") {
			// Start smooth drag-look AND request pointer lock on left click for effortless FPS look
			st.drag.active = true;
			st.drag.pointerId = e.pointerId;
			st.drag.lastX = e.clientX;
			st.drag.lastY = e.clientY;
			st.drag.moved = 0;
			st.drag.button = e.button;
			if (e.button === 0 && st.host.canvas && typeof st.host.canvas.requestPointerLock === "function") {
				try {
					const p = st.host.canvas.requestPointerLock();
					if (p && typeof p.catch === "function") p.catch(() => {});
				} catch (_) {}
			}
		} else {
			st.drag.active = true;
			st.drag.pointerId = e.pointerId;
			st.drag.lastX = e.clientX;
			st.drag.lastY = e.clientY;
			st.drag.moved = 0;
			st.drag.button = 0;
		}
	}, { capture: true });

	window.addEventListener("pointermove", e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active || !st.host) return;
		const locked = !!(st.host.input && typeof st.host.input.isCanvasLocked === "function" && st.host.input.isCanvasLocked());
		if (locked) return;
		if (st.drag.active && st.drag.pointerId === e.pointerId) {
			const dx = e.clientX - st.drag.lastX;
			const dy = e.clientY - st.drag.lastY;
			st.drag.lastX = e.clientX;
			st.drag.lastY = e.clientY;
			st.drag.moved += Math.hypot(dx, dy);
			spkmodMiningApplyLookDelta(st.host, dx, dy);
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}, { capture: true });

	const _endDrag = e => {
		const st = spkmodMiningFreeCamState;
		if (!st.active) return;
		if (st.drag.active && (e.pointerId == null || st.drag.pointerId === e.pointerId)) {
			st.drag.active = false;
			st.drag.pointerId = null;
			st.drag.button = -1;
		}
		e.stopPropagation();
		e.stopImmediatePropagation();
	};
	window.addEventListener("pointerup", _endDrag, { capture: true });
	window.addEventListener("pointercancel", _endDrag, { capture: true });
	window.addEventListener("contextmenu", e => {
		if (!spkmodMiningFreeCamState.active) return;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	}, { capture: true });

	window.addEventListener("blur", () => {
		if (spkmodMiningFreeCamState.active) spkmodMiningClearKeysAndDrag();
	});
	if (typeof document !== "undefined") {
		document.addEventListener("visibilitychange", () => {
			if (document.hidden && spkmodMiningFreeCamState.active) spkmodMiningClearKeysAndDrag();
		});
		document.addEventListener("pointerlockchange", () => {
			if (spkmodMiningFreeCamState.active) {
				spkmodMiningFreeCamState.drag.active = false;
				spkmodMiningFreeCamState.drag.pointerId = null;
				spkmodMiningFreeCamState.drag.button = -1;
			}
		});
	}
}

if (typeof window !== "undefined") {
	window.spkmodHandleMiningFreeCamF4 = spkmodHandleMiningFreeCamF4;
	window.spkmodMiningFreeCam = {
		config: SPKMOD_MINING_FREECAM_CONFIG,
		state: spkmodMiningFreeCamState,
		isActive: () => !!spkmodMiningFreeCamState.active,
		enter: spkmodEnterMiningFreeCam,
		exit: spkmodExitMiningFreeCam,
		toggle: spkmodToggleMiningFreeCam,
		// Pure collision & geometry helpers exposed for verification/testing
		isBlockSolid: spkmodMiningIsBlockSolid,
		blockShape: spkmodMiningBlockShape,
		getBlockCollisionBoxes: spkmodMiningGetBlockCollisionBoxes,
		isColumnLoaded: spkmodMiningIsColumnLoaded,
		computeHalfExtent: spkmodMiningComputeHalfExtent,
		computeNearCornerRadius: spkmodMiningComputeNearCornerRadius,
		collectDynamicBoxes: spkmodMiningCollectDynamicBoxes,
		isCameraPosValid: spkmodMiningIsCameraPosValid,
		nearPlaneClear: spkmodMiningNearPlaneClear,
		moveSwept: spkmodMiningMoveSwept,
		findSafePushOut: spkmodMiningFindSafePushOut
	};
}
