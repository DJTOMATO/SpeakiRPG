

const spkmodSnowPlane = (function () {
	
	const KEY = Symbol.for("spkmod.snowplane.instance");
	if (typeof window[KEY] === "function") { try { window[KEY](); } catch (e) {} }

	const PLANE = { x: 69.8, z: 82.8, w: 16.5, h: 10.5 }, PLANE_TOL = 0.3, PLANE_POS_TOL = 2;
	const SNOW_H = 0.5, EDGE_W = 0.5, CELL = 0.15, BIAS = 0.003, TEXEL = 0.2, FADE = 8, TRAIL_COLOR = "#cfd8e8";
	const RANGE = 15, HEIGHT_TOL = 2, CART_DIAMETER = 2.6, CHAR_R_MAX = 2.0, TRAIL_R = 0.8, BALL_NAME = "snow-ball-hull", CHECK_MS = 500;
	const ZONE_ID = 1;
	const START_ENABLED = false;                                                                       // off until spkmodSnowPlane(true) is called
	const inZone = () => { const gs = window.gameState; return !!gs && gs.zoneId != null && Number(gs.zoneId) % 10000 === ZONE_ID; };
	let S = null, enabled = START_ENABLED, building = false, DTClass = null, warned = false;
	const radii = new WeakMap(), mounts = new WeakMap();
	let vec = null;


	const f = n => n.toFixed(4);
	const TRAIL_GLSL = [
		"uniform sampler2D uTrailMap;",
		"uniform vec2 uTrailSize;",
		"vec4 snowCubic(float v) { vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v; vec4 s = n * n * n; float x = s.x, y = s.y - 4.0 * s.x, z = s.z - 4.0 * s.y + 6.0 * s.x; return vec4(x, y, z, 6.0 - x - y - z) * (1.0 / 6.0); }",
		"float snowTrailUV(vec2 uv) {",                                                                
		"	vec2 tc = uv * uTrailSize - 0.5, fr = fract(tc);",
		"	tc -= fr;",
		"	vec4 xc = snowCubic(fr.x), yc = snowCubic(fr.y);",
		"	vec4 c = tc.xxyy + vec2(-0.5, 1.5).xyxy;",
		"	vec4 s = vec4(xc.xz + xc.yw, yc.xz + yc.yw);",
		"	vec4 o = (c + vec4(xc.yw, yc.yw) / s) / uTrailSize.xxyy;",
		"	float sx = s.x / (s.x + s.y), sy = s.z / (s.z + s.w);",
		"	return mix(mix(texture2D(uTrailMap, o.yw).r, texture2D(uTrailMap, o.xw).r, sx), mix(texture2D(uTrailMap, o.yz).r, texture2D(uTrailMap, o.xz).r, sx), sy);",
		"}"
	].join("\n");
	const VS_DECL = [TRAIL_GLSL, "uniform vec2 uMin, uMax, uScale;", "uniform float uZ;", "varying vec2 vTrailUV;"].join("\n");
	const VS_NORMAL = "vec3 objectNormal = vec3(0.0, 0.0, 1.0);";                                     
	const VS_BODY = [
		"vec2 snUV = (position.xy - uMin) / (uMax - uMin);",
		"float snD = min(min(position.x - uMin.x, uMax.x - position.x) * uScale.x, min(position.y - uMin.y, uMax.y - position.y) * uScale.y);",  
		"float snH = smoothstep(0.0, " + f(EDGE_W) + ", snD) * " + f(SNOW_H) + " * (1.0 - snowTrailUV(snUV));",                                 
		"vec3 transformed = vec3(position.xy, uZ * (snH + " + f(BIAS) + "));",
		"vTrailUV = snUV;"
	].join("\n");
	const FS_DECL = [TRAIL_GLSL, "uniform vec3 uTrailColor;", "varying vec2 vTrailUV;"].join("\n");
	const FS_BODY = ["#include <color_fragment>", "diffuseColor.rgb = mix(diffuseColor.rgb, uTrailColor, clamp(snowTrailUV(vTrailUV), 0.0, 1.0));"].join("\n");


	function inv4(m) {
		const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11], a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
		const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
		const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
		let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
		if (!det) return null;
		det = 1 / det;
		return [
			(a11 * b11 - a12 * b10 + a13 * b09) * det, (a02 * b10 - a01 * b11 - a03 * b09) * det, (a31 * b05 - a32 * b04 + a33 * b03) * det, (a22 * b04 - a21 * b05 - a23 * b03) * det,
			(a12 * b08 - a10 * b11 - a13 * b07) * det, (a00 * b11 - a02 * b08 + a03 * b07) * det, (a32 * b02 - a30 * b05 - a33 * b01) * det, (a20 * b05 - a22 * b02 + a23 * b01) * det,
			(a10 * b10 - a11 * b08 + a13 * b06) * det, (a01 * b08 - a00 * b10 - a03 * b06) * det, (a30 * b04 - a31 * b02 + a33 * b00) * det, (a21 * b02 - a20 * b04 - a23 * b00) * det,
			(a11 * b07 - a10 * b09 - a12 * b06) * det, (a00 * b09 - a01 * b07 + a02 * b06) * det, (a31 * b01 - a30 * b03 - a32 * b00) * det, (a20 * b03 - a21 * b01 + a22 * b00) * det
		];
	}
	function mul4(a, b) {
		const r = new Array(16).fill(0);
		for (let c = 0; c < 4; c++) for (let row = 0; row < 4; row++) for (let k = 0; k < 4; k++) r[c * 4 + row] += a[k * 4 + row] * b[c * 4 + k];
		return r;
	}
	function planeInfo(orig) {
		orig.updateWorldMatrix(true, false);
		const g = orig.geometry;
		if (!g.boundingBox) g.computeBoundingBox();
		const b = g.boundingBox, e = Array.from(orig.matrixWorld.elements), inv = inv4(e);
		if (!inv) return null;
		const sx = Math.hypot(e[0], e[1], e[2]), sy = Math.hypot(e[4], e[5], e[6]), sz = Math.hypot(e[8], e[9], e[10]) || 1;
		return { e: e, inv: inv, min: [b.min.x, b.min.y], max: [b.max.x, b.max.y], sx: sx, sy: sy, sz: sz, sign: e[9] >= 0 ? 1 : -1,
			W: (b.max.x - b.min.x) * sx, H: (b.max.y - b.min.y) * sy };
	}
	function grid(info) {
		let nx = Math.max(2, Math.round(info.W / CELL)), ny = Math.max(2, Math.round(info.H / CELL));
		while ((nx + 1) * (ny + 1) > 160000) { nx = Math.ceil(nx / 2); ny = Math.ceil(ny / 2); }
		const vx = nx + 1, pos = new Float32Array(vx * (ny + 1) * 3), uv = new Float32Array(vx * (ny + 1) * 2), idx = [];
		const dx = (info.max[0] - info.min[0]) / nx, dy = (info.max[1] - info.min[1]) / ny;
		for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
			const n = j * vx + i; pos[n * 3] = info.min[0] + i * dx; pos[n * 3 + 1] = info.min[1] + j * dy;
			uv[n * 2] = i / nx; uv[n * 2 + 1] = j / ny;
		}
		for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = j * vx + i, b = a + 1, c = a + vx, d = c + 1; idx.push(a, b, c, b, d, c); }
		return { pos: pos, uv: uv, idx: idx, nx: nx, ny: ny, vertices: vx * (ny + 1) };
	}
	function rgb(s, ColorClass) {
		if (ColorClass) { const c = new ColorClass(); c.set(s); return [c.r, c.g, c.b]; }
		const n = parseInt(s.replace("#", ""), 16), g = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
		return [g((n >> 16) & 255), g((n >> 8) & 255), g(n & 255)];
	}


	function trailCreate(DT, info) {
		const W = Math.max(4, Math.ceil(info.W / TEXEL)), H = Math.max(4, Math.ceil(info.H / TEXEL));
		const bytes = new Uint8Array(W * H * 4);
		for (let j = 3; j < bytes.length; j += 4) bytes[j] = 255;
		const tex = new DT(bytes, W, H, 1023, 1009, 300, 1001, 1001, 1006, 1006);                   
		tex.needsUpdate = true;
		return { W: W, H: H, cx: info.W / W, cy: info.H / H, dep: new Float32Array(W * H), bytes: bytes, tex: tex, last: performance.now(), live: false };
	}
	function ballDepth(d, R, H) {                                                                      
		if (d >= R) return 0;
		const hs = Math.min(H, R - Math.sqrt(R * R - d * d));                                           
		return hs >= H ? 0 : Math.min(1, (H - Math.max(0, hs)) / H);
	}
	function trailStep(T, info, ents, dt) {
		const dep = T.dep, W = T.W, H = T.H, inv = info.inv;
		let live = false;
		if (T.live) { const k = dt / FADE; for (let i = 0; i < dep.length; i++) { let d = dep[i]; if (d > 0) { d = Math.max(0, d - k); dep[i] = d; if (d > 0) live = true; } } }   
		for (let n = 0; n < ents.length; n++) {
			const p = ents[n];
			const lx = inv[0] * p.x + inv[4] * p.y + inv[8] * p.z + inv[12], ly = inv[1] * p.x + inv[5] * p.y + inv[9] * p.z + inv[13], lz = inv[2] * p.x + inv[6] * p.y + inv[10] * p.z + inv[14];
			const ball = !!p.ball, rr = p.r, h = lz * info.sz;
			if (Math.abs(ball ? h - rr : h) > HEIGHT_TOL) continue;                                     
			const u = (lx - info.min[0]) * info.sx, v = (ly - info.min[1]) * info.sy;
			if (u < -rr || v < -rr || u > info.W + rr || v > info.H + rr) continue;
			const ci = Math.floor(u / T.cx), cj = Math.floor(v / T.cy), rx = Math.ceil(rr / T.cx), ry = Math.ceil(rr / T.cy);
			for (let j = Math.max(0, cj - ry); j <= Math.min(H - 1, cj + ry); j++) for (let i = Math.max(0, ci - rx); i <= Math.min(W - 1, ci + rx); i++) {
				const ex = (i + 0.5) * T.cx - u, ez = (j + 0.5) * T.cy - v, d = Math.sqrt(ex * ex + ez * ez);
				if (d >= rr) continue;
				let val;
				if (ball) val = ballDepth(d, rr, SNOW_H);
				else { const t = 1 - d / rr; val = t * t * (3 - 2 * t); }
				if (val > dep[j * W + i]) { dep[j * W + i] = val; live = true; }
			}
		}
		if (live || T.live) {                                                                          
			const b = T.bytes;
			for (let i = 0, j = 0; i < dep.length; i++, j += 4) b[j] = Math.round(dep[i] * 255);
			T.tex.needsUpdate = true;
		}
		T.live = live;
	}

	
	function measure(c, R) {                                                                          
		c.updateWorldMatrix(true, true);
		const ci = inv4(Array.from(c.matrixWorld.elements));
		if (!ci) return;
		let best = 0, any = false, all = 0;
		R.pels = [];
		const attached = o => { for (let p = o; p && p !== c.parent; p = p.parent) if (p.userData && (p.userData.spkmodSkinAttachment || p.userData.spkmodSkinHandProp)) return true; return false; };
		c.traverse(o => {
			if (o.isBone && /pelvis/i.test(o.name || "")) R.pels.push(o);                          
			if (!o.isMesh || !o.geometry || attached(o)) return;
			const g = o.geometry; if (!g.boundingBox && g.computeBoundingBox) g.computeBoundingBox();
			const b = g.boundingBox; if (!b) return;
			const rel = mul4(ci, Array.from(o.matrixWorld.elements));
			let m = 0;
			for (let i = 0; i < 8; i++) {
				const x = i & 1 ? b.max.x : b.min.x, y = i & 2 ? b.max.y : b.min.y, z = i & 4 ? b.max.z : b.min.z;
				m = Math.max(m, Math.abs(rel[0] * x + rel[4] * y + rel[8] * z + rel[12]), Math.abs(rel[2] * x + rel[6] * y + rel[10] * z + rel[14]));
			}
			all = Math.max(all, m);
			if (/^mesh_(body|head|face)/i.test(o.name || "")) { best = Math.max(best, m); any = true; }
		});
		R.base = any ? best : all;
	}
	function charRadius(c, now) {                                                                      
		let R = radii.get(c);
		if (!R) radii.set(c, R = { base: 0, pels: [], at: -1e9 });
		if (now - R.at > CHECK_MS) {
			R.at = now;
			const keep = R.base;
			try { measure(c, R); } catch (e) { R.base = keep; }
			if (!(R.base > 0)) R.base = keep;                                                        
		}
		if (!(R.base > 0)) return TRAIL_R;
		let pf = 1, dev = 0;
		for (const b of R.pels) { const w = Math.max(b.scale.x, b.scale.z), d = Math.abs(w - 1); if (d > dev) { dev = d; pf = w; } }
		const e = c.matrixWorld.elements, sc = Math.max(Math.hypot(e[0], e[1], e[2]), Math.hypot(e[8], e[9], e[10]));
		return Math.min(CHAR_R_MAX, Math.max(0.1, R.base * sc * pf));
	}
	function mounted(c, id, getCtrl, now) {                                                             
		let M = mounts.get(c);
		if (!M) mounts.set(c, M = { v: false, at: -1e9 });
		if (now - M.at <= CHECK_MS) return M.v;
		M.at = now;
		let v = false;
		try {
			const en = window.gameState.mountVisuals && window.gameState.mountVisuals.entries;          
			if (en) {
				if (id != null && (en.has(id) || en.has(Number(id)) || en.has(String(id)))) v = true;
				else for (const e of en.values()) if (e && e.cartGroup && e.cartGroup.parent === c) { v = true; break; }
			}
			if (!v) { const ctrl = getCtrl(); if (ctrl && ctrl.mountSitPlaying) v = true; }
			if (!v && typeof spkmodRemoteCarInstances !== "undefined" && spkmodRemoteCarInstances) for (const e of spkmodRemoteCarInstances.values()) if (e && e.root && e.root.parent === c) { v = true; break; }   
			if (!v && typeof _lunBurgerCarState !== "undefined" && _lunBurgerCarState && _lunBurgerCarState.root && _lunBurgerCarState.root.parent === c) v = true;
		} catch (e) {}
		return M.v = v;
	}
	const localCtrl = () => (typeof spkmodGetLocalAnimController === "function" ? spkmodGetLocalAnimController() : null);

	
	function balls(now) {                                                                               
		const scene = window.gameState.scene;
		if (!S.balls || now - S.ballsAt > CHECK_MS) { S.balls = []; S.ballsAt = now; scene.traverse(o => { if (o.name && o.name.indexOf(BALL_NAME) >= 0 && o.geometry) S.balls.push(o); }); }
		return S.balls;
	}


	function entities(now) {
		const gs = window.gameState, out = [], pc = gs && gs.playerContainer;
		if (!pc) return out;
		if (!vec) vec = new pc.position.constructor();
		const pp = pc.getWorldPosition(vec), px = pp.x, py = pp.y, pz = pp.z, inv = S.info.inv, info = S.info;
		const u = (inv[0] * px + inv[4] * py + inv[8] * pz + inv[12] - info.min[0]) * info.sx, v = (inv[1] * px + inv[5] * py + inv[9] * pz + inv[13] - info.min[1]) * info.sy;
		const du = Math.max(-u, 0, u - info.W), dv = Math.max(-v, 0, v - info.H);
		if (du * du + dv * dv > (RANGE + CHAR_R_MAX) * (RANGE + CHAR_R_MAX)) return out;             
		const r2 = RANGE * RANGE, near = (x, z) => (x - px) * (x - px) + (z - pz) * (z - pz) <= r2;
		out.push({ x: px, y: py, z: pz, r: mounted(pc, gs.myPlayerId, localCtrl, now) ? CART_DIAMETER / 2 : charRadius(pc, now) });
		const reg = gs.remotePlayers && gs.remotePlayers.remotePlayers;
		if (reg instanceof Map) for (const [pid, pl] of reg) {
			const c = pl && pl.container; if (!c) continue;
			const p = c.position; if (!near(p.x, p.z)) continue;
			out.push({ x: p.x, y: p.y, z: p.z, r: mounted(c, pid, () => (pl.avatar && pl.avatar.animationController) || c.controller || null, now) ? CART_DIAMETER / 2 : charRadius(c, now) });
		}
		for (const o of balls(now)) {
			let root = o; while (root.parent) root = root.parent;
			if (root !== gs.scene) continue;                                                           
			const e = o.matrixWorld.elements, g = o.geometry, sc = Math.max(Math.hypot(e[0], e[1], e[2]), Math.hypot(e[4], e[5], e[6]), Math.hypot(e[8], e[9], e[10]));
			let R0 = g.parameters && g.parameters.radius;
			if (!R0) { if (!g.boundingSphere) g.computeBoundingSphere(); R0 = g.boundingSphere ? g.boundingSphere.radius : 0; }
			const R = R0 * sc;
			if (R > 0 && near(e[12], e[14])) out.push({ x: e[12], y: e[13], z: e[14], r: R, ball: true });
		}
		return out;
	}


	async function dtClass(scene) {
		if (DTClass) return DTClass;
		scene.traverse(o => {
			if (!o.isMesh || DTClass) return;
			for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
				if (!m) continue;
				for (const t of [m.map, m.gradientMap, m.emissiveMap, m.alphaMap]) if (t && t.isDataTexture && !DTClass) DTClass = t.constructor;
			}
		});
		if (!DTClass && typeof spkmodGetDataTextureClass === "function") { try { DTClass = await spkmodGetDataTextureClass(); } catch (_) {} }
		if (!DTClass) {                                                                                
			const re = /\bisDataTexture\s*=\s*(!0|true)/, seen = new Set();
			for (let i = 0; i < 30 && !DTClass; i++) {
				const urls = performance.getEntriesByType("resource").map(r => r.name).filter(u => /\.m?js(\?|$)/.test(u) && !seen.has(u)).sort((x, y) => (/three/.test(y) ? 1 : 0) - (/three/.test(x) ? 1 : 0));
				for (const url of urls) {
					seen.add(url);
					let mod; try { mod = await import(url); } catch (e) { continue; }
					for (const fn of Object.values(mod)) {
						if (typeof fn !== "function") continue;
						let src; try { src = Function.prototype.toString.call(fn); } catch (_) { continue; }
						if (re.test(src)) { DTClass = fn; break; }
					}
					if (DTClass) break;
				}
				if (i > 3 && !urls.length) break;
				if (!DTClass) await new Promise(r => setTimeout(r, 100));
			}
		}
		return DTClass;
	}


	function findPlane(scene) {
		let best = null, bd = 1e9;
		const wl = Math.max(PLANE.w, PLANE.h), ws = Math.min(PLANE.w, PLANE.h);
		scene.traverse(o => {
			if (!o.isMesh || !o.geometry || o.geometry.type !== "PlaneGeometry" || o.name === "spkmod_snowplane") return;
			const pr = o.geometry.parameters || {}, e = o.matrixWorld.elements;
			const a = (pr.width || 0) * Math.hypot(e[0], e[1], e[2]), b = (pr.height || 0) * Math.hypot(e[4], e[5], e[6]);
			if (Math.abs(Math.max(a, b) - wl) > PLANE_TOL || Math.abs(Math.min(a, b) - ws) > PLANE_TOL) return;
			const d = Math.hypot(e[12] - PLANE.x, e[14] - PLANE.z);
			if (d > PLANE_POS_TOL || d >= bd) return;
			for (let p = o.parent; p; p = p.parent) if (p.visible === false) return;
			bd = d; best = o;
		});
		return best;
	}


	function teardown() {
		const s = S; S = null;
		if (!s) return;
		if (s.mesh.parent) s.mesh.parent.remove(s.mesh);
		s.geo.dispose(); s.mat.dispose(); s.trail.tex.dispose();
		if (s.orig) s.orig.visible = s.hid;
	}
	async function build() {
		const gs = window.gameState, scene = gs && gs.scene;
		if (!scene || building || S || !inZone()) return;
		building = true;
		try {
			const orig = findPlane(scene);
			if (!orig) { if (!warned) { warned = true; console.log("[snowplane] waiting for the rectangle at " + PLANE.x + " / " + PLANE.z); } return; }
			const info = planeInfo(orig);
			if (!info) return;
			const DT = await dtClass(scene);
			if (!DT) { if (!warned) { warned = true; console.warn("[snowplane] no DataTexture class found"); } return; }
			if (!enabled || S) return;                                                                 
			const srcMat = Array.isArray(orig.material) ? orig.material[0] : orig.material;
			if (!srcMat || srcMat.isShaderMaterial || typeof srcMat.clone !== "function") { if (!warned) { warned = true; console.warn("[snowplane] the material of the plane cannot be copied"); } return; }
			const trail = trailCreate(DT, info), g = grid(info), geo = orig.geometry.clone();
			geo.setIndex(null); geo.clearGroups(); geo.morphAttributes = {};
			for (const n of Object.keys(geo.attributes)) geo.deleteAttribute(n);
			const AttrClass = orig.geometry.attributes.position.constructor;
			geo.setAttribute("position", new AttrClass(g.pos, 3));
			geo.setAttribute("uv", new AttrClass(g.uv, 2));
			geo.setIndex(g.idx);
			geo.boundingBox = null; geo.boundingSphere = null;
			const U = { uTrailMap: { value: trail.tex }, uTrailSize: { value: [trail.W, trail.H] }, uMin: { value: info.min }, uMax: { value: info.max }, uScale: { value: [info.sx, info.sy] },
				uZ: { value: info.sign / info.sz }, uTrailColor: { value: rgb(TRAIL_COLOR, srcMat.color ? srcMat.color.constructor : null) } };
			const mat = srcMat.clone();                                                                
			mat.side = 2;
			mat.polygonOffset = true; mat.polygonOffsetFactor = -1; mat.polygonOffsetUnits = -1;
			mat.userData = mat.userData || {};
			mat.userData.outlineParameters = { visible: false };
			mat.customProgramCacheKey = () => "spkmod-snowplane-final-" + mat.type;
			mat.onBeforeCompile = sh => {
				Object.assign(sh.uniforms, U);
				sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\n" + VS_DECL).replace("#include <beginnormal_vertex>", VS_NORMAL).replace("#include <begin_vertex>", VS_BODY);
				sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\n" + FS_DECL).replace("#include <color_fragment>", FS_BODY);
			};
			const mesh = new orig.constructor(geo, mat);
			mesh.name = "spkmod_snowplane";
			mesh.matrixAutoUpdate = false;
			mesh.matrix.copy(orig.matrixWorld); mesh.matrixWorld.copy(mesh.matrix);
			mesh.frustumCulled = false;
			Object.defineProperty(mesh, "castShadow", { get: () => false, set: () => {} });
			Object.defineProperty(mesh, "receiveShadow", { get: () => false, set: () => {} });
			mesh.onBeforeRender = () => {
				const s = S; if (!s || s.mesh !== mesh) return;
				const now = performance.now();
				if (now - trail.last < 5) return;                                                       
				const dt = Math.min(30, (now - trail.last) / 1000);
				trail.last = now;
				try { trailStep(trail, info, entities(now), dt); } catch (e) { if (!trail.err) { trail.err = true; console.error("[snowplane]", e); } }
			};
			scene.add(mesh);
			S = { mesh: mesh, orig: orig, info: info, trail: trail, geo: geo, mat: mat, hid: orig.visible, balls: null, ballsAt: -1e9 };
			orig.visible = false;                                                                      
			warned = false;
			console.log("[snowplane] on: " + info.W.toFixed(1) + " x " + info.H.toFixed(1) + " units, " + g.nx + " x " + g.ny + " cells, trail map " + trail.W + " x " + trail.H);
		} catch (e) { console.error("[snowplane]", e); }
		finally { building = false; }
	}


	
	function setEnabled(on) {
		enabled = on === undefined ? !enabled : !!on;
		if (enabled) build(); else { teardown(); warned = false; }
		return enabled;
	}

	
	const timer = setInterval(() => {
		if (!enabled) return;
		const scene = window.gameState && window.gameState.scene;
		if (!S) { if (scene && inZone()) build(); return; }
		let p = S.orig; while (p && p.parent) p = p.parent;
		if (!scene || p !== scene || !inZone()) { S.orig = null; teardown(); }  
	}, 2000);
	window[KEY] = function () { enabled = false; clearInterval(timer); teardown(); };                 
	if (enabled) build();

	return setEnabled;
})();
