// ============================================================================
// 3D WebGL Shaders Engine (Post-Processing, Shadows & Atmosphere)
// ============================================================================

const SPKMOD_SHADER_PRESETS = {
	none: { labelKey: "shaderNone", fallback: "Default" },
	hdShadows: {
		labelKey: "shaderHdShadows",
		fallback: "HD Shadows",
		keepNativeLights: true,
		softShadows: true,
		shadowRadius: 1.5,
		exposure: 1.02,
		contrast: 1.06,
		saturation: 1.06,
	},
	comic: {
		labelKey: "shaderComic",
		fallback: "Comic Outlines",
		softShadows: true,
		shadowRadius: 1.2,
		outline: 1.0,
		depthThresh: 0.14,
		normalThresh: 0.36,
		outlineStrength: 0.88,
		outlineColor: [0.03, 0.03, 0.04],
		exposure: 1.04,
		contrast: 1.04,
		saturation: 1.14,
		sunCol: 0xfffcf2,
		sunInt: 1.25,
		sunOffset: [36, 52, 26],
		hemiSky: 0xe6f4ff,
		hemiGround: 0x7ca658,
		hemiInt: 0.95,
		ambientCol: 0xffffff,
		ambientInt: 0.72,
	},
	animeCel: {
		labelKey: "shaderAnimeCel",
		fallback: "Anime Cel",
		mode: 1.0,
		softShadows: true,
		shadowRadius: 1.4,
		outline: 1.0,
		depthThresh: 0.16,
		normalThresh: 0.40,
		outlineStrength: 0.62,
		outlineColor: [0.10, 0.07, 0.14],
		exposure: 1.05,
		contrast: 1.06,
		saturation: 1.18,
		bloomThresh: 0.78,
		bloomStrength: 0.18,
		sunCol: 0xfff6e5,
		sunInt: 1.3,
		sunOffset: [38, 50, 28],
		hemiSky: 0xdff2ff,
		hemiGround: 0x86a374,
		hemiInt: 0.92,
		ambientCol: 0xfff8f0,
		ambientInt: 0.68,
	},
	golden: {
		labelKey: "shaderGolden",
		fallback: "Golden Hour",
		softShadows: true,
		shadowRadius: 2.2,
		exposure: 1.06,
		contrast: 1.05,
		saturation: 1.12,
		warmth: 0.22,
		bloomThresh: 0.72,
		bloomStrength: 0.24,
		mistStrength: 0.22,
		mistColor: [0.95, 0.72, 0.48],
		mistStart: 24.0,
		mistDensity: 0.008,
		sunCol: 0xffb874,
		sunInt: 1.45,
		sunOffset: [55, 22, 35],
		hemiSky: 0xffd9b3,
		hemiGround: 0x7b8db8,
		hemiInt: 0.95,
		ambientCol: 0x92a4d4,
		ambientInt: 0.68,
		fogColor: 0xe8cfa8,
	},
	pastel: {
		labelKey: "shaderPastel",
		fallback: "Pastel Daylight",
		softShadows: true,
		shadowRadius: 2.0,
		exposure: 1.08,
		contrast: 0.98,
		saturation: 1.06,
		warmth: 0.10,
		bloomThresh: 0.70,
		bloomStrength: 0.26,
		mistStrength: 0.18,
		mistColor: [0.96, 0.94, 0.84],
		mistStart: 28.0,
		mistDensity: 0.007,
		sunCol: 0xfff3d4,
		sunInt: 1.32,
		sunOffset: [38, 46, 30],
		hemiSky: 0xf0f8ff,
		hemiGround: 0xc5cb96,
		hemiInt: 0.96,
		ambientCol: 0xfff9ec,
		ambientInt: 0.72,
	},
	softBloom: {
		labelKey: "shaderSoftBloom",
		fallback: "Soft Bloom",
		keepNativeLights: true,
		softShadows: true,
		shadowRadius: 2.0,
		exposure: 1.03,
		contrast: 1.03,
		saturation: 1.08,
		bloomThresh: 0.68,
		bloomStrength: 0.36,
		vignette: 0.14,
	},
	moonlight: {
		labelKey: "shaderMoonlight",
		fallback: "Moonlight",
		softShadows: true,
		shadowRadius: 2.4,
		exposure: 0.92,
		contrast: 1.08,
		saturation: 0.94,
		warmth: -0.35,
		bloomThresh: 0.56,
		bloomStrength: 0.42,
		mistStrength: 0.42,
		mistColor: [0.09, 0.14, 0.30],
		mistStart: 16.0,
		mistDensity: 0.012,
		vignette: 0.22,
		sunCol: 0xa4cbff,
		sunInt: 1.15,
		sunOffset: [-42, 42, 28],
		hemiSky: 0x5c7ec2,
		hemiGround: 0x263254,
		hemiInt: 0.85,
		ambientCol: 0x455c96,
		ambientInt: 0.62,
		fogColor: 0x1d2b4f,
	},
	depthMist: {
		labelKey: "shaderDepthMist",
		fallback: "Depth Mist",
		keepNativeLights: true,
		softShadows: true,
		shadowRadius: 1.8,
		exposure: 1.03,
		contrast: 1.04,
		saturation: 1.08,
		bloomThresh: 0.76,
		bloomStrength: 0.18,
		mistStrength: 0.58,
		mistColor: [0.76, 0.89, 0.99],
		mistStart: 14.0,
		mistDensity: 0.014,
	},
	miniature: {
		labelKey: "shaderMiniature",
		fallback: "Miniature DoF",
		keepNativeLights: true,
		softShadows: true,
		shadowRadius: 1.6,
		mode: 2.0,
		fullBlur: 1.0,
		exposure: 1.05,
		contrast: 1.08,
		saturation: 1.24,
		vignette: 0.18,
	},
	retro3d: {
		labelKey: "shaderRetro3d",
		fallback: "Retro 3D",
		keepNativeLights: true,
		softShadows: false,
		shadowRadius: 1.0,
		mode: 3.0,
		pixelSize: 3.2,
		exposure: 1.02,
		contrast: 1.08,
		saturation: 1.12,
	},
	mangaInk: {
		labelKey: "shaderMangaInk",
		fallback: "Manga Ink",
		mode: 4.0,
		softShadows: false,
		shadowRadius: 1.0,
		outline: 1.0,
		depthThresh: 0.13,
		normalThresh: 0.30,
		outlineStrength: 0.98,
		outlineColor: [0.02, 0.02, 0.03],
		exposure: 1.08,
		contrast: 1.15,
		sunCol: 0xffffff,
		sunInt: 1.35,
		sunOffset: [42, 48, 28],
		hemiSky: 0xf4f4f4,
		hemiGround: 0x8a8a8a,
		hemiInt: 0.85,
		ambientCol: 0xffffff,
		ambientInt: 0.65,
	},
};

const spkmodShaderRuntime = {
	THREE: null,
	renderer: null,
	scene: null,
	camera: null,
	origRender: null,
	origShadowEnabled: null,
	origShadowType: null,
	hooked: false,
	insideRender: false,
	capturing: false,
	initPromise: null,
	activeKey: "none",
	activeCfg: null,
	dirLight: null,
	customDirLight: null,
	savedLights: new Map(),
	savedMeshes: new Map(),
	lastSyncMs: 0,
	lastZoneId: null,
	colorRT: null,
	depthTex: null,
	normalRT: null,
	bloomRT1: null,
	bloomRT2: null,
	normalMat: null,
	brightMat: null,
	blurMat: null,
	postMat: null,
	quadCam: null,
	quadScene: null,
	quadMesh: null,
	sizeVec: null,
};

function spkmodShouldHideInNormalPass(obj) {
	if (!obj || !obj.visible) return false;
	if (obj.isSprite || obj.isLine || obj.isPoints) return true;
	if (obj.renderOrder !== 0) return true;
	if (!obj.isMesh || !obj.material) return false;
	const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
	let allTransparentOrOverlay = true;
	for (const m of mats) {
		if (!m) continue;
		const isOut = typeof spkmodIsOutlineMaterial === "function" && spkmodIsOutlineMaterial(m);
		const isTransparentQuad =
			isOut ||
			m.depthWrite === false ||
			(m.transparent && (!m.alphaTest || m.alphaTest <= 0)) ||
			(typeof m.opacity === "number" && m.opacity < 0.98);
		if (!isTransparentQuad) {
			allTransparentOrOverlay = false;
			break;
		}
	}
	return allTransparentOrOverlay;
}

function spkmodSceneHasOutlineEffect(sc) {
	if (!sc || typeof sc.traverse !== "function") return false;
	let found = false;
	sc.traverse((obj) => {
		if (found || !obj.visible || !obj.isMesh || !obj.material) return;
		if (typeof spkmodIsOutlineMaterial === "function" && spkmodIsOutlineMaterial(obj.material)) {
			found = true;
			return;
		}
		const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
		for (const m of mats) {
			if (m && (m.type === "OutlineEffect" || m.name === "OutlineEffect")) {
				found = true;
				return;
			}
		}
	});
	return found;
}

function spkmodCaptureRenderer(scene) {
	if (spkmodShaderRuntime.renderer) return Promise.resolve(spkmodShaderRuntime.renderer);
	if (spkmodShaderRuntime.capturing) return spkmodShaderRuntime.initPromise;
	spkmodShaderRuntime.capturing = true;
	spkmodShaderRuntime.initPromise = new Promise((resolve, reject) => {
		const prevAfter = scene.onAfterRender;
		const timer = setTimeout(() => {
			scene.onAfterRender = prevAfter;
			spkmodShaderRuntime.capturing = false;
			reject(new Error("[SpeakiMod Shaders] Timed out waiting for a rendered frame."));
		}, 4000);
		scene.onAfterRender = function (r) {
			if (typeof prevAfter === "function") {
				try {
					prevAfter.apply(this, arguments);
				} catch (_) {}
			}
			if (r && typeof r.render === "function" && r.shadowMap) {
				clearTimeout(timer);
				scene.onAfterRender = prevAfter;
				spkmodShaderRuntime.capturing = false;
				spkmodShaderRuntime.renderer = r;
				resolve(r);
			}
		};
	});
	return spkmodShaderRuntime.initPromise;
}

function spkmodInitShaderPipeline(THREE, renderer, scene, camera) {
	const rt = spkmodShaderRuntime;
	if (rt.postMat && rt.scene === scene && rt.camera === camera) return;

	rt.THREE = THREE;
	rt.renderer = renderer;
	rt.scene = scene;
	rt.camera = camera;
	if (!rt.origRender) rt.origRender = renderer.render.bind(renderer);
	if (rt.origShadowEnabled === null) rt.origShadowEnabled = renderer.shadowMap.enabled;
	if (rt.origShadowType === null) rt.origShadowType = renderer.shadowMap.type;

	rt.sizeVec = new THREE.Vector2();
	renderer.getDrawingBufferSize(rt.sizeVec);
	const w = Math.max(1, rt.sizeVec.x);
	const h = Math.max(1, rt.sizeVec.y);
	const bw = Math.max(1, Math.floor(w / 4));
	const bh = Math.max(1, Math.floor(h / 4));

	const supportsHalfFloat = !!(
		renderer.capabilities?.isWebGL2 &&
		(renderer.extensions?.get?.("EXT_color_buffer_float") || renderer.extensions?.get?.("EXT_color_buffer_half_float"))
	);
	const rtType = supportsHalfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType;
	rt.depthTex = new THREE.DepthTexture(w, h);
	rt.colorRT = new THREE.WebGLRenderTarget(w, h, {
		type: rtType,
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		depthBuffer: true,
		depthTexture: rt.depthTex,
	});
	rt.normalRT = new THREE.WebGLRenderTarget(w, h, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		depthBuffer: true,
	});
	rt.bloomRT1 = new THREE.WebGLRenderTarget(bw, bh, {
		type: rtType,
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		depthBuffer: false,
	});
	rt.bloomRT2 = new THREE.WebGLRenderTarget(bw, bh, {
		type: rtType,
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		depthBuffer: false,
	});
	rt.normalMat = new THREE.MeshNormalMaterial();

	const fullscreenVert = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position.xy, 0.0, 1.0);
		}
	`;

	rt.brightMat = new THREE.ShaderMaterial({
		depthTest: false,
		depthWrite: false,
		uniforms: {
			tColor: { value: rt.colorRT.texture },
			uTexel: { value: new THREE.Vector2(1 / w, 1 / h) },
			uBloomThresh: { value: 0.72 },
			uFullBlur: { value: 0.0 },
		},
		vertexShader: fullscreenVert,
		fragmentShader: `
			uniform sampler2D tColor;
			uniform vec2 uTexel;
			uniform float uBloomThresh;
			uniform float uFullBlur;
			varying vec2 vUv;
			void main() {
				vec3 c = (
					texture2D(tColor, vUv + vec2(-uTexel.x, -uTexel.y)).rgb +
					texture2D(tColor, vUv + vec2( uTexel.x, -uTexel.y)).rgb +
					texture2D(tColor, vUv + vec2(-uTexel.x,  uTexel.y)).rgb +
					texture2D(tColor, vUv + vec2( uTexel.x,  uTexel.y)).rgb
				) * 0.25;
				if (uFullBlur > 0.5) {
					gl_FragColor = vec4(c, 1.0);
				} else {
					float br = dot(c, vec3(0.2126, 0.7152, 0.0722));
					float knee = clamp(max(br - uBloomThresh, 0.0) / max(br, 0.0001), 0.0, 2.0);
					gl_FragColor = vec4(c * knee, 1.0);
				}
			}
		`,
	});

	rt.blurMat = new THREE.ShaderMaterial({
		depthTest: false,
		depthWrite: false,
		uniforms: {
			tInput: { value: rt.bloomRT1.texture },
			uDir: { value: new THREE.Vector2(1 / bw, 0) },
		},
		vertexShader: fullscreenVert,
		fragmentShader: `
			uniform sampler2D tInput;
			uniform vec2 uDir;
			varying vec2 vUv;
			void main() {
				vec3 sum = texture2D(tInput, vUv).rgb * 0.227027;
				sum += texture2D(tInput, vUv + uDir * 1.384615).rgb * 0.316216;
				sum += texture2D(tInput, vUv - uDir * 1.384615).rgb * 0.316216;
				sum += texture2D(tInput, vUv + uDir * 3.230769).rgb * 0.070270;
				sum += texture2D(tInput, vUv - uDir * 3.230769).rgb * 0.070270;
				gl_FragColor = vec4(sum, 1.0);
			}
		`,
	});

	const needsGamma = renderer.outputColorSpace === THREE.SRGBColorSpace;
	rt.postMat = new THREE.ShaderMaterial({
		depthTest: false,
		depthWrite: false,
		uniforms: {
			tColor: { value: rt.colorRT.texture },
			tDepth: { value: rt.depthTex },
			tNormal: { value: rt.normalRT.texture },
			tBloom: { value: rt.bloomRT1.texture },
			uRes: { value: new THREE.Vector2(w, h) },
			uNear: { value: camera.near },
			uFar: { value: camera.far },
			uMode: { value: 0.0 },
			uOutline: { value: 0.0 },
			uDepthThresh: { value: 0.14 },
			uNormalThresh: { value: 0.36 },
			uOutlineStrength: { value: 0.88 },
			uOutlineColor: { value: new THREE.Vector3(0.03, 0.03, 0.04) },
			uExposure: { value: 1.0 },
			uContrast: { value: 1.0 },
			uSaturation: { value: 1.0 },
			uWarmth: { value: 0.0 },
			uBloomStrength: { value: 0.0 },
			uMistStrength: { value: 0.0 },
			uMistColor: { value: new THREE.Vector3(0.76, 0.89, 0.99) },
			uMistStart: { value: 18.0 },
			uMistDensity: { value: 0.01 },
			uVignette: { value: 0.0 },
			uPixelSize: { value: 1.0 },
			uApplyGamma: { value: needsGamma ? 1.0 : 0.0 },
		},
		vertexShader: fullscreenVert,
		fragmentShader: `
			uniform sampler2D tColor;
			uniform sampler2D tDepth;
			uniform sampler2D tNormal;
			uniform sampler2D tBloom;
			uniform vec2 uRes;
			uniform float uNear;
			uniform float uFar;
			uniform float uMode;
			uniform float uOutline;
			uniform float uDepthThresh;
			uniform float uNormalThresh;
			uniform float uOutlineStrength;
			uniform vec3 uOutlineColor;
			uniform float uExposure;
			uniform float uContrast;
			uniform float uSaturation;
			uniform float uWarmth;
			uniform float uBloomStrength;
			uniform float uMistStrength;
			uniform vec3 uMistColor;
			uniform float uMistStart;
			uniform float uMistDensity;
			uniform float uVignette;
			uniform float uPixelSize;
			uniform float uApplyGamma;
			varying vec2 vUv;

			float linDepthRaw(float d) {
				float z = d * 2.0 - 1.0;
				return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
			}

			float linDepth(vec2 uv) {
				return linDepthRaw(texture2D(tDepth, uv).x);
			}

			vec3 linearToSRGB(vec3 c) {
				c = max(c, vec3(0.0));
				vec3 lo = c * 12.92;
				vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
				return mix(lo, hi, step(vec3(0.0031308), c));
			}

			float bayer4(vec2 p) {
				vec2 c = floor(mod(p, 4.0));
				vec2 m2 = mod(c, 2.0);
				vec2 m4 = floor(c * 0.5);
				float b1 = mod(m2.x * 2.0 + m2.y * 3.0, 4.0);
				float b2 = mod(m4.x * 2.0 + m4.y * 3.0, 4.0);
				return (b1 * 4.0 + b2) / 16.0 - 0.5;
			}

			void main() {
				vec2 uv = vUv;
				if (uMode > 2.5 && uMode < 3.5 && uPixelSize > 1.0) {
					vec2 grid = max(uRes / uPixelSize, vec2(64.0));
					uv = (floor(vUv * grid) + 0.5) / grid;
				}

				vec3 col = texture2D(tColor, uv).rgb;
				float dRaw = texture2D(tDepth, uv).x;
				float d0 = linDepthRaw(dRaw);

				// Miniature Tilt-Shift / Depth of Field (Mode 2)
				if (uMode > 1.5 && uMode < 2.5) {
					vec3 blurred = texture2D(tBloom, uv).rgb;
					float dFocus = linDepth(vec2(0.5, 0.5));
					float depthDiff = abs(d0 - dFocus) / max(dFocus, 4.0);
					float tiltDiff = abs(vUv.y - 0.5) * 1.15;
					float coc = smoothstep(0.18, 0.72, mix(tiltDiff, depthDiff, 0.55));
					if (dRaw >= 0.9999) coc = smoothstep(0.08, 0.45, abs(vUv.y - 0.5));
					col = mix(col, blurred, clamp(coc, 0.0, 0.92));
				}

				col *= uExposure;
				col = max((col - 0.18) * uContrast + 0.18, vec3(0.0));
				float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
				col = mix(vec3(luma), col, uSaturation);

				if (uWarmth > 0.0) {
					col.r *= 1.0 + uWarmth * 0.16;
					col.g *= 1.0 + uWarmth * 0.04;
					col.b *= 1.0 - uWarmth * 0.14;
				} else if (uWarmth < 0.0) {
					float cool = -uWarmth;
					col.r *= 1.0 - cool * 0.18;
					col.g *= 1.0 - cool * 0.04;
					col.b *= 1.0 + cool * 0.22;
				}

				// Anime Cel Luminance Banding (Mode 1)
				if (uMode > 0.5 && uMode < 1.5 && dRaw < 0.9999) {
					float v = max(dot(col, vec3(0.2126, 0.7152, 0.0722)), 0.0001);
					float s = pow(v, 0.45);
					float stepped = floor(s * 4.5 + 0.35) / 4.5;
					float targetV = pow(max(stepped, 0.02), 2.22);
					col *= mix(1.0, clamp(targetV / v, 0.55, 1.45), 0.55);
				}

				// Depth-based Atmospheric Mist
				if (uMistStrength > 0.001 && dRaw < 0.9999) {
					float mist = 1.0 - exp(-pow(max(d0 - uMistStart, 0.0) * uMistDensity, 1.25));
					col = mix(col, uMistColor, clamp(mist * uMistStrength, 0.0, 0.85));
				}

				// Soft Highlight Bloom (all modes except DoF)
				if (uBloomStrength > 0.001 && (uMode < 1.5 || uMode > 2.5)) {
					col += texture2D(tBloom, uv).rgb * uBloomStrength;
				}

				// Manga Ink Paper + Cross-Hatching (Mode 4)
				if (uMode > 3.5 && uMode < 4.5) {
					float paper = pow(clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0), 0.45);
					float tone = smoothstep(0.18, 0.88, paper);
					float hatch1 = step(0.0, sin((gl_FragCoord.x + gl_FragCoord.y) * 1.05));
					float hatch2 = step(0.0, sin((gl_FragCoord.x - gl_FragCoord.y) * 1.05));
					float shaded = tone;
					if (tone < 0.52) shaded = mix(0.45, 0.88, hatch1);
					if (tone < 0.26) shaded = mix(0.18, shaded, hatch2);
					if (dRaw >= 0.9999) shaded = mix(0.86, 1.0, tone);
					col = pow(vec3(0.95, 0.93, 0.88) * shaded, vec3(2.2));
				}

				// Screen-Space Depth + Normal Outlines
				if (uOutline > 0.5) {
					vec2 px = 1.0 / uRes;
					float dL = linDepth(uv - vec2(px.x, 0.0));
					float dR = linDepth(uv + vec2(px.x, 0.0));
					float dU = linDepth(uv + vec2(0.0, px.y));
					float dD = linDepth(uv - vec2(0.0, px.y));
					float dEdge = (abs(dL + dR - 2.0 * d0) + abs(dU + dD - 2.0 * d0)) / max(d0 * 0.25, 0.06);
					dEdge *= smoothstep(uFar * 0.55, 8.0, d0);

					vec3 n0 = texture2D(tNormal, uv).rgb;
					vec3 nL = texture2D(tNormal, uv - vec2(px.x, 0.0)).rgb;
					vec3 nR = texture2D(tNormal, uv + vec2(px.x, 0.0)).rgb;
					vec3 nU = texture2D(tNormal, uv + vec2(0.0, px.y)).rgb;
					vec3 nD = texture2D(tNormal, uv - vec2(0.0, px.y)).rgb;
					float nEdge = length(nL - n0) + length(nR - n0) + length(nU - n0) + length(nD - n0);
					if (dRaw >= 0.9999) nEdge = 0.0;

					float edge = max(
						smoothstep(uDepthThresh, uDepthThresh * 1.75, dEdge),
						smoothstep(uNormalThresh, uNormalThresh * 1.75, nEdge)
					);
					col = mix(col, uOutlineColor, edge * uOutlineStrength);
				}

				// Gentle highlight rolloff above 0.88 so bright colors never crush
				col = min(col, 0.88 + max(col - 0.88, vec3(0.0)) / (1.0 + max(col - 0.88, vec3(0.0))));

				if (uVignette > 0.001) {
					float dist = length(vUv - 0.5);
					col *= 1.0 - smoothstep(0.42, 0.88, dist) * uVignette;
				}

				if (uApplyGamma > 0.5) {
					col = linearToSRGB(col);
				}

				// Retro 3D Ordered Bayer Dither in display space (Mode 3)
				if (uMode > 2.5 && uMode < 3.5) {
					float levels = 24.0;
					col = clamp(floor(col * levels + bayer4(gl_FragCoord.xy) + 0.5) / levels, 0.0, 1.0);
				}

				gl_FragColor = vec4(col, 1.0);
			}
		`,
	});

	rt.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	rt.quadScene = new THREE.Scene();
	rt.quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), rt.postMat);
	rt.quadScene.add(rt.quadMesh);
}

function spkmodRestoreLightsAndFog() {
	const rt = spkmodShaderRuntime;
	for (const [obj, s] of rt.savedLights) {
		if (obj.color && s.color !== null) obj.color.setHex(s.color);
		if (obj.groundColor && s.groundColor !== null) obj.groundColor.setHex(s.groundColor);
		obj.intensity = s.intensity;
		obj.castShadow = s.castShadow;
		if (obj.position && s.pos) obj.position.copy(s.pos);
	}
	if (rt.customDirLight && rt.scene) {
		rt.scene.remove(rt.customDirLight.target);
		rt.scene.remove(rt.customDirLight);
		rt.customDirLight = null;
	}
	const chromaActive = typeof lunChromaKeyColor !== "undefined" && lunChromaKeyColor !== "none";
	if (!chromaActive && rt.scene && rt.scene.__spkShaderOrigFogColor !== undefined) {
		if (rt.scene.fog && rt.scene.fog.color && rt.scene.__spkShaderOrigFogColor !== null) {
			rt.scene.fog.color.setHex(rt.scene.__spkShaderOrigFogColor);
		}
		delete rt.scene.__spkShaderOrigFogColor;
	}
	rt.dirLight = null;
}

function spkmodSyncSceneLightingAndShadows(cfg) {
	const rt = spkmodShaderRuntime;
	const { THREE, renderer, scene } = rt;
	if (!THREE || !renderer || !scene || !cfg) return;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = cfg.softShadows === false ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
	renderer.shadowMap.needsUpdate = true;

	let dirLight = null;
	scene.traverse((obj) => {
		if (obj.isLight) {
			if (!rt.savedLights.has(obj)) {
				rt.savedLights.set(obj, {
					color: obj.color ? obj.color.getHex() : null,
					groundColor: obj.groundColor ? obj.groundColor.getHex() : null,
					intensity: obj.intensity,
					castShadow: obj.castShadow,
					pos: obj.position ? obj.position.clone() : null,
				});
			}
			if (obj.isDirectionalLight && !dirLight) dirLight = obj;
			if (!cfg.keepNativeLights) {
				if (obj.isHemisphereLight) {
					if (cfg.hemiSky !== undefined) obj.color.setHex(cfg.hemiSky);
					if (cfg.hemiGround !== undefined) obj.groundColor.setHex(cfg.hemiGround);
					if (cfg.hemiInt !== undefined) obj.intensity = cfg.hemiInt;
				}
				if (obj.isAmbientLight) {
					if (cfg.ambientCol !== undefined) obj.color.setHex(cfg.ambientCol);
					if (cfg.ambientInt !== undefined) obj.intensity = cfg.ambientInt;
				}
			}
		} else if (obj.isMesh && obj.renderOrder === 0 && !spkmodShouldHideInNormalPass(obj)) {
			if (!rt.savedMeshes.has(obj)) {
				rt.savedMeshes.set(obj, { cast: obj.castShadow, recv: obj.receiveShadow });
			}
			obj.castShadow = true;
			obj.receiveShadow = true;
		}
	});

	if (!dirLight) {
		dirLight = new THREE.DirectionalLight(cfg.sunCol || 0xffffff, cfg.sunInt || 1.2);
		scene.add(dirLight);
		scene.add(dirLight.target);
		rt.customDirLight = dirLight;
	}

	if (!cfg.keepNativeLights) {
		if (cfg.sunCol !== undefined) dirLight.color.setHex(cfg.sunCol);
		if (cfg.sunInt !== undefined) dirLight.intensity = cfg.sunInt;
	}

	dirLight.castShadow = true;
	if (dirLight.shadow.mapSize.width !== 2048 || dirLight.shadow.mapSize.height !== 2048) {
		dirLight.shadow.mapSize.set(2048, 2048);
		if (dirLight.shadow.map) {
			dirLight.shadow.map.dispose();
			dirLight.shadow.map = null;
		}
	}
	dirLight.shadow.bias = -0.0007;
	dirLight.shadow.normalBias = 0.055;
	dirLight.shadow.radius = cfg.shadowRadius ?? 1.5;

	const d = 55;
	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;
	dirLight.shadow.camera.near = 1;
	dirLight.shadow.camera.far = 180;
	dirLight.shadow.camera.updateProjectionMatrix();

	const chromaActive = typeof lunChromaKeyColor !== "undefined" && lunChromaKeyColor !== "none";
	if (!chromaActive && scene.fog && scene.fog.color) {
		if (cfg.fogColor !== undefined) {
			if (scene.__spkShaderOrigFogColor === undefined) {
				scene.__spkShaderOrigFogColor = scene.fog.color.getHex();
			}
			scene.fog.color.setHex(cfg.fogColor);
		} else if (scene.__spkShaderOrigFogColor !== undefined) {
			scene.fog.color.setHex(scene.__spkShaderOrigFogColor);
			delete scene.__spkShaderOrigFogColor;
		}
	}

	rt.dirLight = dirLight;
}

function spkmodResizeShaderTargets() {
	const rt = spkmodShaderRuntime;
	rt.renderer.getDrawingBufferSize(rt.sizeVec);
	const nw = Math.max(1, rt.sizeVec.x);
	const nh = Math.max(1, rt.sizeVec.y);
	if (rt.colorRT.width !== nw || rt.colorRT.height !== nh) {
		const bw = Math.max(1, Math.floor(nw / 4));
		const bh = Math.max(1, Math.floor(nh / 4));
		rt.colorRT.setSize(nw, nh);
		rt.normalRT.setSize(nw, nh);
		rt.bloomRT1.setSize(bw, bh);
		rt.bloomRT2.setSize(bw, bh);
		rt.postMat.uniforms.uRes.value.set(nw, nh);
		rt.brightMat.uniforms.uTexel.value.set(1 / nw, 1 / nh);
	}
}

function spkmodApplyPresetUniforms(cfg) {
	const rt = spkmodShaderRuntime;
	const u = rt.postMat.uniforms;
	const bu = rt.brightMat.uniforms;

	u.uMode.value = cfg.mode ?? 0.0;
	u.uOutline.value = cfg.outline ?? 0.0;
	u.uDepthThresh.value = cfg.depthThresh ?? 0.14;
	u.uNormalThresh.value = cfg.normalThresh ?? 0.36;
	u.uOutlineStrength.value = cfg.outlineStrength ?? 0.88;
	const oc = cfg.outlineColor || [0.03, 0.03, 0.04];
	u.uOutlineColor.value.set(oc[0], oc[1], oc[2]);
	u.uExposure.value = cfg.exposure ?? 1.0;
	u.uContrast.value = cfg.contrast ?? 1.0;
	u.uSaturation.value = cfg.saturation ?? 1.0;
	u.uWarmth.value = cfg.warmth ?? 0.0;
	u.uBloomStrength.value = cfg.bloomStrength ?? 0.0;
	u.uMistStrength.value = cfg.mistStrength ?? 0.0;
	const mc = cfg.mistColor || [0.76, 0.89, 0.99];
	u.uMistColor.value.set(mc[0], mc[1], mc[2]);
	u.uMistStart.value = cfg.mistStart ?? 18.0;
	u.uMistDensity.value = cfg.mistDensity ?? 0.01;
	u.uVignette.value = cfg.vignette ?? 0.0;
	u.uPixelSize.value = cfg.pixelSize ?? 1.0;

	bu.uBloomThresh.value = cfg.bloomThresh ?? 0.72;
	bu.uFullBlur.value = cfg.fullBlur ?? 0.0;
}

function spkmodEnableShaderHook() {
	const rt = spkmodShaderRuntime;
	if (rt.hooked || !rt.renderer) return;
	rt.hooked = true;

	rt.renderer.render = function (sc, cam) {
		const gs = typeof gameState !== "undefined" ? gameState : window.gameState;
		if (rt.insideRender || !gs || sc !== rt.scene || cam !== rt.camera || sc.overrideMaterial) {
			return rt.origRender(sc, cam);
		}
		rt.insideRender = true;
		const prevRT = rt.renderer.getRenderTarget();

		try {
			const isOutlinePass2 = !rt.renderer.autoClear && spkmodSceneHasOutlineEffect(sc);
			const u = rt.postMat.uniforms;
			u.uNear.value = cam.near;
			u.uFar.value = cam.far;
			u.uApplyGamma.value = (prevRT === null && rt.renderer.outputColorSpace === rt.THREE.SRGBColorSpace) ? 1.0 : 0.0;

			if (isOutlinePass2) {
				// Game's native OutlineEffect Pass 2: draw inverted-hull outlines onto Pass 1's colorRT + depth buffer
				const prevShadowAuto = rt.renderer.shadowMap.autoUpdate;
				rt.renderer.shadowMap.autoUpdate = false;
				try {
					rt.renderer.setRenderTarget(rt.colorRT);
					rt.origRender(sc, cam);
				} finally {
					rt.renderer.shadowMap.autoUpdate = prevShadowAuto;
				}
			} else {
				const now = Date.now();
				const curZone = gs.zoneId ?? null;
				if (now - rt.lastSyncMs > 750 || curZone !== rt.lastZoneId) {
					rt.lastSyncMs = now;
					rt.lastZoneId = curZone;
					spkmodSyncSceneLightingAndShadows(rt.activeCfg);
				}

				spkmodResizeShaderTargets();

				if (rt.dirLight && rt.activeCfg && rt.activeCfg.sunOffset) {
					const targetPos = gs.playerContainer ? gs.playerContainer.position : null;
					const tx = targetPos ? targetPos.x : 0;
					const ty = targetPos ? targetPos.y : 0;
					const tz = targetPos ? targetPos.z : 0;
					const [ox, oy, oz] = rt.activeCfg.sunOffset;
					rt.dirLight.position.set(tx + ox, ty + oy, tz + oz);
					rt.dirLight.target.position.set(tx, ty, tz);
					rt.dirLight.target.updateMatrixWorld();
				}

				// 1. Optional Normal Pass (hiding transparent/sprite overlays to prevent quad boxes)
				if (u.uOutline.value > 0.5) {
					const prevOverride = sc.overrideMaterial;
					const prevBg = sc.background;
					const prevFog = sc.fog;
					const prevClearCol = new rt.THREE.Color();
					rt.renderer.getClearColor(prevClearCol);
					const prevClearAlpha = rt.renderer.getClearAlpha();
					const hiddenObjs = [];

					sc.traverse((obj) => {
						if (spkmodShouldHideInNormalPass(obj)) {
							obj.visible = false;
							hiddenObjs.push(obj);
						}
					});

					try {
						sc.overrideMaterial = rt.normalMat;
						sc.background = null;
						sc.fog = null;
						rt.renderer.setRenderTarget(rt.normalRT);
						rt.renderer.setClearColor(0x8080ff, 1);
						rt.renderer.clear();
						rt.origRender(sc, cam);
					} finally {
						for (const obj of hiddenObjs) obj.visible = true;
						sc.overrideMaterial = prevOverride;
						sc.background = prevBg;
						sc.fog = prevFog;
						rt.renderer.setClearColor(prevClearCol, prevClearAlpha);
					}
				}

				// 2. Main Scene Color + Depth Pass
				rt.renderer.setRenderTarget(rt.colorRT);
				if (!rt.renderer.autoClear) rt.renderer.clear(true, true, true);
				rt.origRender(sc, cam);
			}

			// 3. Optional Quarter-Res Bloom / DoF Blur Passes
			const needsBlur = u.uBloomStrength.value > 0.001 || (u.uMode.value > 1.5 && u.uMode.value < 2.5);
			if (needsBlur) {
				const bw = rt.bloomRT1.width;
				const bh = rt.bloomRT1.height;

				rt.quadMesh.material = rt.brightMat;
				rt.renderer.setRenderTarget(rt.bloomRT1);
				rt.origRender(rt.quadScene, rt.quadCam);

				const blurPasses = u.uMode.value > 1.5 && u.uMode.value < 2.5 ? 2 : 1;
				rt.quadMesh.material = rt.blurMat;
				for (let p = 0; p < blurPasses; p++) {
					rt.blurMat.uniforms.tInput.value = rt.bloomRT1.texture;
					rt.blurMat.uniforms.uDir.value.set(1.25 / bw, 0);
					rt.renderer.setRenderTarget(rt.bloomRT2);
					rt.origRender(rt.quadScene, rt.quadCam);

					rt.blurMat.uniforms.tInput.value = rt.bloomRT2.texture;
					rt.blurMat.uniforms.uDir.value.set(0, 1.25 / bh);
					rt.renderer.setRenderTarget(rt.bloomRT1);
					rt.origRender(rt.quadScene, rt.quadCam);
				}
				rt.quadMesh.material = rt.postMat;
			}

			// 4. Final Composite to Screen
			rt.renderer.setRenderTarget(prevRT);
			rt.origRender(rt.quadScene, rt.quadCam);
		} catch (err) {
			console.warn("[SpeakiMod Shaders] Render error, falling back:", err);
			rt.renderer.setRenderTarget(prevRT);
			rt.origRender(sc, cam);
		} finally {
			rt.insideRender = false;
		}
	};
}

function resetShaderEngine() {
	const rt = spkmodShaderRuntime;
	if (rt.hooked && rt.renderer && rt.origRender) {
		rt.renderer.render = rt.origRender;
		rt.hooked = false;
	}
	if (rt.renderer) {
		if (rt.origShadowEnabled !== null) rt.renderer.shadowMap.enabled = rt.origShadowEnabled;
		if (rt.origShadowType !== null) rt.renderer.shadowMap.type = rt.origShadowType;
	}
	spkmodRestoreLightsAndFog();
	for (const [obj, s] of rt.savedMeshes) {
		obj.castShadow = s.cast;
		obj.receiveShadow = s.recv;
	}
	rt.savedLights.clear();
	rt.savedMeshes.clear();
	rt.activeCfg = null;
	rt.activeKey = "none";
}

async function setShaderPreset(presetKey, silent = false) {
	const targetKey = (presetKey && SPKMOD_SHADER_PRESETS[presetKey]) ? presetKey : "none";
	const nextKey = (!silent && targetKey !== "none" && lunActiveShader === targetKey) ? "none" : targetKey;

	lunActiveShader = nextKey;
	if (typeof window !== "undefined" && window.localStorage) {
		localStorage.setItem("spkmod-shader", lunActiveShader);
	}
	if (typeof updateLocalEditsUI === "function") updateLocalEditsUI();

	if (lunActiveShader === "none") {
		resetShaderEngine();
		if (!silent && typeof chatLog === "function") {
			chatLog("Shader: OFF (Default)");
		}
		return;
	}

	const gs = typeof gameState !== "undefined" ? gameState : window.gameState;
	if (!gs || !gs.scene || !gs.camera) return;

	try {
		const THREE = typeof spkmodEnsureThree === "function"
			? await spkmodEnsureThree()
			: (window.THREE || await import("https://esm.sh/v135/three@0.185.0"));
		if (!THREE || !THREE.WebGLRenderTarget || !THREE.ShaderMaterial) return;

		const renderer = await spkmodCaptureRenderer(gs.scene);
		if (lunActiveShader === "none") return;

		const cfg = SPKMOD_SHADER_PRESETS[lunActiveShader];
		if (!cfg) return;

		spkmodInitShaderPipeline(THREE, renderer, gs.scene, gs.camera);
		spkmodRestoreLightsAndFog();
		spkmodShaderRuntime.activeKey = lunActiveShader;
		spkmodShaderRuntime.activeCfg = cfg;
		spkmodShaderRuntime.lastSyncMs = Date.now();
		spkmodShaderRuntime.lastZoneId = gs.zoneId ?? null;

		spkmodSyncSceneLightingAndShadows(cfg);
		spkmodApplyPresetUniforms(cfg);
		spkmodEnableShaderHook();

		if (!silent && typeof chatLog === "function") {
			const label = typeof tCustom === "function" ? tCustom(cfg.labelKey, cfg.fallback) : cfg.fallback;
			chatLog("Shader: " + label);
		}
	} catch (err) {
		console.warn("[SpeakiMod Shaders] Failed to apply shader:", err);
	}
}

window.spkShader = {
	apply: (key) => setShaderPreset(key, true),
	reset: () => setShaderPreset("none", true),
	get uniforms() {
		return spkmodShaderRuntime.postMat ? spkmodShaderRuntime.postMat.uniforms : null;
	},
	get runtime() {
		return spkmodShaderRuntime;
	},
};

// Restore saved shader once the game scene & camera are initialized
if (lunActiveShader && lunActiveShader !== "none") {
	let spkmodShaderBootTries = 0;
	const spkmodShaderBootTimer = setInterval(() => {
		spkmodShaderBootTries++;
		const gs = typeof gameState !== "undefined" ? gameState : window.gameState;
		if (gs && gs.scene && gs.camera) {
			clearInterval(spkmodShaderBootTimer);
			if (lunActiveShader && lunActiveShader !== "none") {
				setShaderPreset(lunActiveShader, true);
			}
		} else if (spkmodShaderBootTries > 120) {
			clearInterval(spkmodShaderBootTimer);
		}
	}, 500);
}
