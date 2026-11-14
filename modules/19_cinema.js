// ============================================================================
// IN-GAME 3D MOVIE THEATER & CINEMA PLAYER (CSS3DRENDERER + YOUTUBE)
// ============================================================================

var SPKMOD_CINEMA_DEFAULT_CONFIG = window.SPKMOD_CINEMA_DEFAULT_CONFIG || {
	enabled: true,
	muted: false,
	volume: 80,
	pos: { x: 75.0, y: 4.2, z: 32.5 },
	rotationY: 1.6000,
	width: 12.8,
	height: 7.2,
	occlusion: true
};

var spkmodCinemaConfig = window.spkmodCinemaConfig || Object.assign({}, SPKMOD_CINEMA_DEFAULT_CONFIG);
window.spkmodCinemaConfig = spkmodCinemaConfig;
if (window.localStorage) {
	try {
		spkmodCinemaConfig.enabled = true;
		localStorage.setItem("spkmod-cinema-enabled", "true");
		const mutedStr = localStorage.getItem("spkmod-cinema-muted");
		if (mutedStr !== null) spkmodCinemaConfig.muted = mutedStr === "true";
		const vol = localStorage.getItem("spkmod-cinema-volume");
		if (vol !== null) spkmodCinemaConfig.volume = parseInt(vol, 10) || 80;
		const occ = localStorage.getItem("spkmod-cinema-occlusion");
		if (occ !== null) spkmodCinemaConfig.occlusion = occ === "true";
		const posStr = localStorage.getItem("spkmod-cinema-pos");
		if (posStr) {
			const parsed = JSON.parse(posStr);
			if (parsed && typeof parsed.x === "number") {
				if ((Math.abs(parsed.x - 44.0) < 0.1 && Math.abs(parsed.z - 62.0) < 0.1) ||
					(Math.abs(parsed.x - 65.0) < 0.1 && Math.abs(parsed.z - 33.5) < 0.1)) {
					spkmodCinemaConfig.pos = { x: 75.0, y: 4.2, z: 32.5 };
					spkmodCinemaConfig.rotationY = 1.6000;
				} else {
					spkmodCinemaConfig.pos = { x: parsed.x, y: parsed.y ?? 4.2, z: parsed.z };
					if (typeof parsed.rotationY === "number") spkmodCinemaConfig.rotationY = parsed.rotationY;
				}
			}
		}
	} catch (_) {}
}

var spkmodCinemaActiveTab = 'movies'; // 'movies' | 'songs'
var spkmodCinemaPlaylists = {
	movies: [],
	songs: []
};
var spkmodCinemaLoadedPlaylist = [];
var spkmodCinemaCurrentVideo = null;
var spkmodCinemaManualTrackIndex = null;
var spkmodCinemaIsPaused = false;
var spkmodCinemaModalEl = null;
var spkmodCinemaModalOpen = false;
var spkmodCinemaModalWasOpenBeforeLeaving = false;

function spkmodIsCinemaModalOpen() {
	return !!(spkmodCinemaModalOpen || (spkmodCinemaModalEl && !spkmodCinemaModalEl.classList.contains('hidden')));
}
var spkmodCinemaRenderer = null;
var spkmodCinemaScene = null;
var spkmodCinemaScreenObject = null;
var spkmodCinemaFrameMesh = null;
var spkmodCinemaContainer = null;
var spkmodCinemaIframe = null;
var spkmodCinemaVideoEl = null;
var spkmodCinemaIsDirectVideo = false;
var spkmodCinemaRenderLoopId = null;
var spkmodCinemaOcclusionRenderer = null;
var spkmodCinemaOcclusionScene = null;
var spkmodCinemaOcclusionCanvas = null;
var spkmodCinemaOccluderMesh = null;
var spkmodCinemaOcclusionAvatarGroup = null;
var spkmodCinemaSilhouetteMat = null;
var spkmodCinemaOcclusionAmbientLight = null;
var spkmodCinemaOcclusionDirLight = null;
var spkmodCinemaModeActive = false;
var spkmodCinemaInZone = false;

function spkmodGetExactCinemaZone() {
	if (typeof gameState === 'undefined' || !gameState) return null;
	if (typeof gameState.zoneId === 'number' && !isNaN(gameState.zoneId)) {
		return (gameState.zoneId % 10000);
	}
	return null;
}
var spkmodCinemaLastVolume = -1;
var spkmodCinemaLastSyncCheckMs = 0;
var spkmodCinemaLastTimeUpdateMs = 0;
window.spkmodCinemaCurrentVideoTimeSec = 0;
var spkmodCinemaLeftZoneTimeMs = 0;
var spkmodCinemaCurrentVideoStartTimeMs = Date.now();
var spkmodCinemaTopBarDismissed = false;
var spkmodCinemaRepeatMode = "all"; // 'all' | 'one' | 'off'
if (window.localStorage) {
	try {
		const r = localStorage.getItem("spkmod-cinema-repeat");
		if (r === "one" || r === "off" || r === "all") spkmodCinemaRepeatMode = r;
	} catch (_) {}
}
window.spkmodCinemaRepeatMode = spkmodCinemaRepeatMode;

function spkmodGetCSS3DClasses() {
	if (window.SPKMOD_CSS3DRenderer && window.SPKMOD_CSS3DObject) {
		return { CSS3DRenderer: window.SPKMOD_CSS3DRenderer, CSS3DObject: window.SPKMOD_CSS3DObject };
	}
	const THREE = window.THREE;
	if (!THREE) return null;

	class CSS3DObject extends THREE.Object3D {
		constructor(element = document.createElement('div')) {
			super();
			this.isCSS3DObject = true;
			this.element = element;
			this.element.style.position = 'absolute';
			this.element.style.pointerEvents = 'auto';
			this.element.style.userSelect = 'none';
			this.element.setAttribute('draggable', false);

			this.addEventListener('removed', function () {
				this.traverse(function (object) {
					if (
						object.element &&
						object.element instanceof object.element.ownerDocument.defaultView.Element &&
						object.element.parentNode !== null
					) {
						object.element.remove();
					}
				});
			});
		}

		copy(source, recursive) {
			super.copy(source, recursive);
			this.element = source.element.cloneNode(true);
			return this;
		}
	}

	class CSS3DRenderer {
		constructor(parameters = {}) {
			const _this = this;
			let _width, _height;
			let _widthHalf, _heightHalf;

			const cache = {
				camera: { style: '' },
				objects: new WeakMap()
			};

			const domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');
			domElement.style.overflow = 'hidden';
			this.domElement = domElement;

			const viewElement = document.createElement('div');
			viewElement.style.transformOrigin = '0 0';
			viewElement.style.pointerEvents = 'none';
			domElement.appendChild(viewElement);

			const cameraElement = document.createElement('div');
			cameraElement.style.transformStyle = 'preserve-3d';
			cameraElement.style.pointerEvents = 'none';
			viewElement.appendChild(cameraElement);

			this.getSize = function () {
				return { width: _width, height: _height };
			};

			this.render = function (scene, camera) {
				const fov = camera.projectionMatrix.elements[5] * _heightHalf;

				if (camera.view && camera.view.enabled) {
					viewElement.style.transform = `translate(${-camera.view.offsetX * (_width / camera.view.width)}px, ${-camera.view.offsetY * (_height / camera.view.height)}px)`;
					viewElement.style.transform += `scale(${camera.view.fullWidth / camera.view.width}, ${camera.view.fullHeight / camera.view.height})`;
				} else {
					viewElement.style.transform = '';
				}

				if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
				if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();

				let tx, ty;
				if (camera.isOrthographicCamera) {
					tx = -(camera.right + camera.left) / 2;
					ty = (camera.top + camera.bottom) / 2;
				}

				const scaleByViewOffset = camera.view && camera.view.enabled ? camera.view.height / camera.view.fullHeight : 1;
				const cameraCSSMatrix = camera.isOrthographicCamera
					? `scale(${scaleByViewOffset}) scale(${fov}) translate(${epsilon(tx)}px, ${epsilon(ty)}px)` + getCameraCSSMatrix(camera.matrixWorldInverse)
					: `scale(${scaleByViewOffset}) translateZ(${fov}px)` + getCameraCSSMatrix(camera.matrixWorldInverse);

				const perspective = camera.isPerspectiveCamera ? 'perspective(' + fov + 'px) ' : '';
				const style = perspective + cameraCSSMatrix + 'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

				if (cache.camera.style !== style) {
					cameraElement.style.transform = style;
					cache.camera.style = style;
				}

				renderObject(scene, scene, camera, cameraCSSMatrix);
			};

			this.setSize = function (width, height) {
				_width = width;
				_height = height;
				_widthHalf = _width / 2;
				_heightHalf = _height / 2;

				domElement.style.width = width + 'px';
				domElement.style.height = height + 'px';

				viewElement.style.width = width + 'px';
				viewElement.style.height = height + 'px';

				cameraElement.style.width = width + 'px';
				cameraElement.style.height = height + 'px';
			};

			function epsilon(value) {
				return Math.abs(value) < 1e-10 ? 0 : value;
			}

			function getCameraCSSMatrix(matrix) {
				const elements = matrix.elements;
				return 'matrix3d(' +
					epsilon(elements[0]) + ',' +
					epsilon(-elements[1]) + ',' +
					epsilon(elements[2]) + ',' +
					epsilon(elements[3]) + ',' +
					epsilon(elements[4]) + ',' +
					epsilon(-elements[5]) + ',' +
					epsilon(elements[6]) + ',' +
					epsilon(elements[7]) + ',' +
					epsilon(elements[8]) + ',' +
					epsilon(-elements[9]) + ',' +
					epsilon(elements[10]) + ',' +
					epsilon(elements[11]) + ',' +
					epsilon(elements[12]) + ',' +
					epsilon(-elements[13]) + ',' +
					epsilon(elements[14]) + ',' +
					epsilon(elements[15]) +
				')';
			}

			function getObjectCSSMatrix(matrix) {
				const elements = matrix.elements;
				const matrix3d = 'matrix3d(' +
					epsilon(elements[0]) + ',' +
					epsilon(elements[1]) + ',' +
					epsilon(elements[2]) + ',' +
					epsilon(elements[3]) + ',' +
					epsilon(-elements[4]) + ',' +
					epsilon(-elements[5]) + ',' +
					epsilon(-elements[6]) + ',' +
					epsilon(-elements[7]) + ',' +
					epsilon(elements[8]) + ',' +
					epsilon(elements[9]) + ',' +
					epsilon(elements[10]) + ',' +
					epsilon(elements[11]) + ',' +
					epsilon(elements[12]) + ',' +
					epsilon(elements[13]) + ',' +
					epsilon(elements[14]) + ',' +
					epsilon(elements[15]) +
				')';
				return 'translate(-50%,-50%)' + matrix3d;
			}

			function hideObject(object) {
				if (object.isCSS3DObject) object.element.style.display = 'none';
				for (let i = 0, l = object.children.length; i < l; i++) {
					hideObject(object.children[i]);
				}
			}

			function renderObject(object, scene, camera, cameraCSSMatrix) {
				if (object.visible === false) {
					hideObject(object);
					return;
				}

				if (object.isCSS3DObject) {
					const visible = (object.layers.test(camera.layers) === true);
					const element = object.element;
					element.style.display = visible === true ? '' : 'none';

					if (visible === true) {
						if (typeof object.onBeforeRender === 'function') object.onBeforeRender(_this, scene, camera);

						const style = getObjectCSSMatrix(object.matrixWorld);
						const cachedObject = cache.objects.get(object);

						if (cachedObject === undefined || cachedObject.style !== style) {
							element.style.transform = style;
							cache.objects.set(object, { style });
						}

						if (element.parentNode !== cameraElement) {
							cameraElement.appendChild(element);
						}

						if (typeof object.onAfterRender === 'function') object.onAfterRender(_this, scene, camera);
					}
				}

				for (let i = 0, l = object.children.length; i < l; i++) {
					renderObject(object.children[i], scene, camera, cameraCSSMatrix);
				}
			}
		}
	}

	window.SPKMOD_CSS3DRenderer = CSS3DRenderer;
	window.SPKMOD_CSS3DObject = CSS3DObject;
	return { CSS3DRenderer, CSS3DObject };
}

function spkmodParseMoviesTxt(text) {
	const lines = text.split(/\r?\n/);
	const list = [];
	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;
		const parts = line.split('|').map(s => s.trim());
		const url = parts[0] || '';
		let title = (parts.length >= 2 && parts[1]) ? parts[1] : '';
		let author = '';
		let dur = null;
		let explicitStream = false;

		if (parts.length >= 4) {
			author = parts[2] || '';
			const parsed = parseInt(parts[3], 10);
			if (!isNaN(parsed)) {
				dur = parsed;
				if (dur === 0) explicitStream = true;
			}
		} else if (parts.length === 3) {
			const parsed = parseInt(parts[2], 10);
			if (!isNaN(parsed) && String(parsed) === parts[2]) {
				dur = parsed;
				if (dur === 0) explicitStream = true;
			} else {
				author = parts[2];
			}
		} else if (parts.length === 2) {
			const parsed = parseInt(parts[1], 10);
			if (!isNaN(parsed) && String(parsed) === parts[1]) {
				dur = parsed;
				title = '';
				if (dur === 0) explicitStream = true;
			}
		}

		if (!author && title) {
			const byMatch = title.match(/^(.*?)\s+by\s+(.*?)$/i);
			if (byMatch) {
				title = byMatch[1].trim();
				author = byMatch[2].trim();
			}
		}

		let channelId = null;
		const chMatch = url.match(/channel[=/](UC[\w-]{22})/i);
		if (chMatch) {
			channelId = chMatch[1];
		} else if (url.includes('@oagemono')) {
			channelId = 'UCgiIsLZFrdZUagCIQDCQX0b';
		}

		if (channelId) {
			const id = 'live_' + channelId;
			const isStream = true;
			const baseDur = (dur && dur > 0) ? dur : 600;
			const item = {
				id: id,
				channelId: channelId,
				title: title || 'oage (Live)',
				author: author || 'oagemono',
				duration: 0,
				baseDuration: baseDur,
				url: url,
				isStream: true,
				isLiveStream: true,
				isChannelLive: true,
				isOffline: false,
				isEnded: false
			};
			list.push(item);
			continue;
		}

		const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
		if (match && match[1]) {
			const id = match[1];

			// Check localStorage cache if duration or metadata was omitted
			let cachedDur = 0;
			try {
				const cVal = localStorage.getItem('spkmod_cinema_dur_' + id);
				if (cVal) cachedDur = parseInt(cVal, 10) || 0;
			} catch (_) {}

			if (dur === null) {
				dur = cachedDur > 0 ? cachedDur : 0;
			}

			if (!title) {
				try {
					title = localStorage.getItem('spkmod_cinema_title_' + id) || 'Movie';
				} catch (_) {
					title = 'Movie';
				}
			}

			if (!author) {
				try {
					author = localStorage.getItem('spkmod_cinema_author_' + id) || '';
				} catch (_) {}
			}

			const isStream = explicitStream || (dur === 0 && url.includes('/live'));
			const baseDur = (dur && dur > 0) ? dur : (isStream ? 600 : 300);
			const item = {
				id: id,
				title: title,
				author: author,
				duration: isNaN(dur) ? 0 : dur,
				baseDuration: baseDur,
				url: url,
				isStream: isStream,
				isLiveStream: isStream
			};
			list.push(item);

			// If title or author is still generic, asynchronously fetch from YouTube oEmbed
			if ((item.title === 'Movie' || !item.author) && typeof fetch === 'function') {
				fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
					.then(r => r.ok ? r.json() : null)
					.then(data => {
						if (!data) return;
						let updated = false;
						if ((item.title === 'Movie' || !item.title) && data.title) {
							item.title = data.title;
							updated = true;
							try { localStorage.setItem('spkmod_cinema_title_' + id, data.title); } catch (_) {}
						}
						if (!item.author && data.author_name) {
							item.author = data.author_name;
							updated = true;
							try { localStorage.setItem('spkmod_cinema_author_' + id, data.author_name); } catch (_) {}
						}
						if (updated) {
							if (typeof spkmodRenderCinemaModalList === 'function' && spkmodIsCinemaModalOpen()) {
								spkmodRenderCinemaModalList();
							}
							if (typeof spkmodUpdateCinemaPlaybackUI === 'function') {
								spkmodUpdateCinemaPlaybackUI();
							}
						}
					})
					.catch(() => {});
			}
		}
	}
	return list;
}

function getCinemaText(key, ...args) {
	if (typeof t === "function") return t(key, ...args);
	const lang = (typeof spkmodLang !== "undefined" && spkmodLang) || "en";
	let str = (typeof spkmodTranslations !== "undefined" && spkmodTranslations[lang] && spkmodTranslations[lang][key])
		|| (typeof spkmodTranslations !== "undefined" && spkmodTranslations.en && spkmodTranslations.en[key])
		|| key;
	args.forEach((a, i) => { str = str.split(`{${i}}`).join(a); });
	return str;
}
window.spkmodGetCinemaText = getCinemaText;

async function spkmodLoadMoviesPlaylist() {
	const defaultList = [
		{ id: "4yJpxyU8VtI", title: "oage", author: "oagemono", duration: 0, baseDuration: 600, isStream: true, isLiveStream: true, url: "https://www.youtube.com/watch?v=4yJpxyU8VtI" },
		{ id: "yaIEanyk6WI", title: "Speaki MMO MV-Don't bully SPEAKI", author: "", duration: 496, baseDuration: 496 },
		{ id: "pu_ULvS0l2k", title: "ｽﾋﾟｷ × バニラ求人 MMOスピキver. スピキMMORPG Speaki 스피키 키우기", author: "", duration: 64, baseDuration: 64 },
		{ id: "ifMMrYSEncM", title: "I interviewed the ONLY Max-Level Speaki in the Game!", author: "Speaki MMO", duration: 735, baseDuration: 735 },
		{ id: "nC1WFWF3G8o", title: "Speaki MMO MV – The Price of Peace", author: "", duration: 98, baseDuration: 98 },
		{ id: "wn069Hag470", title: "speaki cuayo for an hour!", author: "", duration: 3610, baseDuration: 3610 }
	];

	// Load movies.txt directly from GitHub (never fetch relative URL on game server)
	try {
		const url = "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/movies.txt?t=" + Date.now();
		const res = await fetch(url, { cache: "no-store" });
		if (res.ok) {
			const text = await res.text();
			const list = spkmodParseMoviesTxt(text);
			if (list && list.length > 0) {
				spkmodCinemaPlaylists.movies = list;
				if (spkmodCinemaActiveTab === 'movies') {
					spkmodCinemaLoadedPlaylist = list;
				}
				return list;
			}
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load movies.txt from GitHub:", e);
	}

	spkmodCinemaPlaylists.movies = defaultList;
	if (spkmodCinemaActiveTab === 'movies') {
		spkmodCinemaLoadedPlaylist = defaultList;
	}
	return defaultList;
}

async function spkmodLoadSongsPlaylist() {
	// Directly load Bolpop tracks from radio.json ("bolpop": [...])
	const parseBolpopData = (data) => {
		if (!data || !Array.isArray(data.bolpop) || data.bolpop.length === 0) return null;
		return data.bolpop.map(t => {
			const id = Array.isArray(t) ? t[0] : (t.id || t.videoId || "");
			const rawTitle = Array.isArray(t) ? t[1] : (t.title || "");
			const rawAuthor = Array.isArray(t) ? (t[2] || "") : (t.author || "");
			let dur = (Array.isArray(t) && t[3]) ? (parseInt(t[3], 10) || 0) : (t.duration || 0);
			if (!dur || dur <= 0) {
				try {
					const cached = localStorage.getItem('spkmod_cinema_dur_' + id);
					if (cached) dur = parseInt(cached, 10) || 0;
				} catch (_) {}
			}
			if (!dur || dur <= 0) dur = 210;
			return { id, title: rawTitle || id, author: rawAuthor, duration: dur, baseDuration: dur, url: `https://www.youtube.com/watch?v=${id}` };
		}).filter(t => t.id);
	};

	// 1. If window.SPKMOD_BOLPOP_TRACKS is already populated and has duration info, use it
	if (typeof window !== "undefined" && Array.isArray(window.SPKMOD_BOLPOP_TRACKS) && window.SPKMOD_BOLPOP_TRACKS.length > 0) {
		const hasDurations = window.SPKMOD_BOLPOP_TRACKS.some(t => Array.isArray(t) ? (t[3] > 0) : (t.duration > 0));
		if (hasDurations) {
			const list = parseBolpopData({ bolpop: window.SPKMOD_BOLPOP_TRACKS });
			if (list && list.length > 0) {
				spkmodCinemaPlaylists.songs = list;
				if (spkmodCinemaActiveTab === 'songs') {
					spkmodCinemaLoadedPlaylist = list;
				}
				return list;
			}
		}
	}

	// 2. Fetch directly from GitHub (never fetch relative radio.json on game server)
	try {
		const res = await fetch("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/main/assets/radio.json?t=" + Date.now(), { cache: "no-store" });
		if (res.ok) {
			const data = await res.json();
			const list = parseBolpopData(data);
			if (list && list.length > 0) {
				spkmodCinemaPlaylists.songs = list;
				if (spkmodCinemaActiveTab === 'songs') {
					spkmodCinemaLoadedPlaylist = list;
				}
				if (typeof window !== "undefined") {
					window.SPKMOD_BOLPOP_TRACKS = data.bolpop;
					try { localStorage.setItem("spkmod-radio-cache", JSON.stringify(data)); } catch (_) {}
				}
				return list;
			}
		}
	} catch (e) {
		console.warn("[SpeakiMod+] Failed to load remote radio.json from GitHub:", e);
	}

	// 3. Fallback to window.SPKMOD_BOLPOP_TRACKS or localStorage cache
	if (typeof window !== "undefined" && Array.isArray(window.SPKMOD_BOLPOP_TRACKS) && window.SPKMOD_BOLPOP_TRACKS.length > 0) {
		const list = parseBolpopData({ bolpop: window.SPKMOD_BOLPOP_TRACKS });
		if (list && list.length > 0) {
			spkmodCinemaPlaylists.songs = list;
			if (spkmodCinemaActiveTab === 'songs') {
				spkmodCinemaLoadedPlaylist = list;
			}
			return list;
		}
	}

	// 4. Try localStorage radio cache
	try {
		const cached = localStorage.getItem("spkmod-radio-cache");
		if (cached) {
			const data = JSON.parse(cached);
			const list = parseBolpopData(data);
			if (list && list.length > 0) {
				spkmodCinemaPlaylists.songs = list;
				if (spkmodCinemaActiveTab === 'songs') {
					spkmodCinemaLoadedPlaylist = list;
				}
				return list;
			}
		}
	} catch (_) {}

	return [];
}

function spkmodSwitchCinemaTab(tab) {
	if (tab !== 'movies' && tab !== 'songs') return;
	spkmodCinemaActiveTab = tab;

	if (spkmodCinemaPlaylists[tab] && spkmodCinemaPlaylists[tab].length > 0) {
		spkmodCinemaLoadedPlaylist = spkmodCinemaPlaylists[tab];
	}

	if (spkmodCinemaModalEl) {
		if (typeof hideCinemaThumbPreview === "function") hideCinemaThumbPreview();
		const btnMovies = spkmodCinemaModalEl.querySelector("#spkmod-cinema-tab-movies");
		const btnSongs = spkmodCinemaModalEl.querySelector("#spkmod-cinema-tab-songs");
		if (btnMovies && btnSongs) {
			const activeStyle = {
				background: "linear-gradient(135deg, #ffd56b 0%, #e8b84b 100%)",
				color: "#120e1a",
				borderColor: "#ffe28a",
				fontWeight: "800",
				boxShadow: "0 2px 8px rgba(232, 184, 75, 0.45)"
			};
			const inactiveStyle = {
				background: "#261c33",
				color: "#f5e6b3",
				borderColor: "rgba(232, 184, 75, 0.35)",
				fontWeight: "700",
				boxShadow: "none"
			};
			const applyTabStyle = (btn, s) => {
				btn.style.background = s.background;
				btn.style.color = s.color;
				btn.style.borderColor = s.borderColor;
				btn.style.fontWeight = s.fontWeight;
				btn.style.boxShadow = s.boxShadow;
				const span = btn.querySelector("span");
				if (span) span.style.color = s.color;
			};
			if (tab === 'movies') {
				applyTabStyle(btnMovies, activeStyle);
				applyTabStyle(btnSongs, inactiveStyle);
			} else {
				applyTabStyle(btnSongs, activeStyle);
				applyTabStyle(btnMovies, inactiveStyle);
			}
		}
		spkmodRenderCinemaModalList();
		spkmodUpdateCinemaPlaybackUI();
	}

	// In Live / Sync mode, switching tabs immediately tunes the cinema TV to that channel's live broadcast!
	if (spkmodCinemaManualTrackIndex === null) {
		spkmodSyncCinemaPlayback(true);
	}
}
window.spkmodSwitchCinemaTab = spkmodSwitchCinemaTab;

function spkmodGetCinemaSyncedTrack() {
	const currentList = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);
	if (!currentList || currentList.length === 0) return null;

	const tracks = currentList;

	// Scheduled programming with accurate durations to keep timeline continuous and synchronized
	const getDur = (t) => {
		if (t.duration && t.duration > 0) return t.duration;
		if (t.baseDuration && t.baseDuration > 0) return t.baseDuration;
		return (spkmodCinemaActiveTab === 'songs') ? 210 : 300;
	};

	const totalDuration = tracks.reduce((acc, t) => acc + getDur(t), 0);
	if (totalDuration <= 0) {
		return { track: tracks[0], startSec: 0, trackIndex: 0, totalTracks: tracks.length };
	}

	// Spread videos sequentially along universal UTC timezone on an infinite loop
	const nowSec = Math.floor(Date.now() / 1000);
	const channelSeed = (spkmodCinemaActiveTab === 'songs') ? 7919 : 0;
	const cycleTime = ((nowSec + channelSeed) % totalDuration + totalDuration) % totalDuration;

	let accum = 0;
	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		const slotDur = getDur(track);
		if (cycleTime >= accum && cycleTime < accum + slotDur) {
			let startSec = Math.floor(cycleTime - accum);

			// If current track is marked offline or ended, gracefully play next track without shifting the grid
			if (track.isOffline || track.isEnded) {
				const nextI = (i + 1) % tracks.length;
				return { track: tracks[nextI], startSec: 0, trackIndex: nextI, totalTracks: tracks.length };
			}

			// Livestreams are always watched live from current edge (startSec 0)
			if (track.isStream || track.isLiveStream) {
				return { track, startSec: 0, trackIndex: i, totalTracks: tracks.length };
			}

			// Video duration check: if actual video is shorter than its broadcast slot, tune to next track
			const actualDur = (track.duration && track.duration > 0) ? track.duration : slotDur;
			if (actualDur > 0 && startSec >= actualDur) {
				const nextI = (i + 1) % tracks.length;
				return { track: tracks[nextI], startSec: 0, trackIndex: nextI, totalTracks: tracks.length };
			}

			return { track, startSec, trackIndex: i, totalTracks: tracks.length };
		}
		accum += slotDur;
	}

	return { track: tracks[0], startSec: 0, trackIndex: 0, totalTracks: tracks.length };
}

var spkmodCinemaYtReady = false;
function spkmodIsDirectVideoUrl(input) {
	if (!input) return false;
	const trimmed = String(input).trim();
	if (!/^https?:\/\//i.test(trimmed)) return false;
	if (/(?:youtube\.com|youtu\.be)/i.test(trimmed)) return false;
	return true;
}
window.spkmodIsDirectVideoUrl = spkmodIsDirectVideoUrl;

function spkmodHasActiveCinemaMedia() {
	if (spkmodCinemaIsDirectVideo) {
		return !!(spkmodCinemaVideoEl && spkmodCinemaVideoEl.getAttribute('src'));
	}
	return !!(spkmodCinemaIframe && spkmodCinemaIframe.src && spkmodCinemaIframe.src !== 'about:blank');
}

function spkmodUnloadCinemaMedia() {
	try {
		spkmodSendYtCommand('pauseVideo');
		spkmodSendYtCommand('stopVideo');
		spkmodSendYtCommand('mute');
	} catch (_) {}
	if (spkmodCinemaIframe) {
		spkmodCinemaIframe.src = 'about:blank';
	}
	if (spkmodCinemaVideoEl) {
		spkmodCinemaVideoEl.pause();
		spkmodCinemaVideoEl.removeAttribute('src');
		spkmodCinemaVideoEl.load();
	}
	spkmodCinemaYtReady = false;
	window.spkmodCinemaLastPlayerState = -1;
}

function spkmodSetCinemaPlayerMode(useDirectVideo) {
	spkmodCinemaIsDirectVideo = !!useDirectVideo;
	if (spkmodCinemaIsDirectVideo) {
		if (spkmodCinemaIframe) {
			try {
				if (spkmodCinemaIframe.contentWindow) {
					spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
					spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
				}
			} catch (_) {}
			spkmodCinemaIframe.src = 'about:blank';
			spkmodCinemaIframe.style.display = 'none';
			spkmodCinemaYtReady = false;
		}
		if (spkmodCinemaVideoEl) {
			spkmodCinemaVideoEl.style.display = 'block';
		}
	} else {
		if (spkmodCinemaVideoEl) {
			spkmodCinemaVideoEl.pause();
			spkmodCinemaVideoEl.removeAttribute('src');
			spkmodCinemaVideoEl.load();
			spkmodCinemaVideoEl.style.display = 'none';
		}
		if (spkmodCinemaIframe) {
			spkmodCinemaIframe.style.display = 'block';
		}
	}
}

function spkmodPlayDirectVideo(url, startSec = 0, loop = false) {
	if (!spkmodCinemaVideoEl || !url) return;
	spkmodSetCinemaPlayerMode(true);
	const isMuted = !!window.spkmodCinemaConfig?.muted;
	const vol = Math.max(0, Math.min(1, (window.spkmodCinemaConfig?.volume ?? 80) / 100));
	spkmodCinemaVideoEl.loop = !!loop;
	spkmodCinemaVideoEl.muted = isMuted || vol === 0;
	spkmodCinemaVideoEl.volume = vol;

	const currentSrc = spkmodCinemaVideoEl.getAttribute('src');
	if (currentSrc !== url) {
		spkmodCinemaVideoEl.src = url;
	}
	if (typeof startSec === 'number' && startSec > 0 && isFinite(startSec)) {
		try { spkmodCinemaVideoEl.currentTime = startSec; } catch (_) {}
	}
	spkmodCinemaVideoEl.play().catch(() => {
		// Fallback to muted autoplay if browser blocks unmuted autoplay before interaction
		if (!spkmodCinemaVideoEl.muted) {
			spkmodCinemaVideoEl.muted = true;
			spkmodCinemaVideoEl.play().catch(() => {});
		}
	});
}

function spkmodSendYtCommand(func, args = []) {
	if (spkmodCinemaIsDirectVideo && spkmodCinemaVideoEl) {
		switch (func) {
			case 'playVideo':
				if (spkmodCinemaInZone) {
					spkmodCinemaVideoEl.play().catch(() => {
						if (!spkmodCinemaVideoEl.muted) {
							spkmodCinemaVideoEl.muted = true;
							spkmodCinemaVideoEl.play().catch(() => {});
						}
					});
				}
				break;
			case 'pauseVideo':
				spkmodCinemaVideoEl.pause();
				break;
			case 'stopVideo':
				spkmodCinemaVideoEl.pause();
				try { spkmodCinemaVideoEl.currentTime = 0; } catch (_) {}
				break;
			case 'mute':
				spkmodCinemaVideoEl.muted = true;
				break;
			case 'unMute':
				spkmodCinemaVideoEl.muted = false;
				break;
			case 'setVolume': {
				const v = Math.max(0, Math.min(1, (Number(args[0]) || 0) / 100));
				spkmodCinemaVideoEl.volume = v;
				if (v === 0) spkmodCinemaVideoEl.muted = true;
				break;
			}
			case 'seekTo':
				if (typeof args[0] === 'number' && isFinite(args[0])) {
					try { spkmodCinemaVideoEl.currentTime = Math.max(0, args[0]); } catch (_) {}
				}
				break;
			case 'getCurrentTime':
				if (isFinite(spkmodCinemaVideoEl.currentTime)) {
					window.spkmodCinemaCurrentVideoTimeSec = spkmodCinemaVideoEl.currentTime;
				}
				break;
			case 'getDuration':
				if (isFinite(spkmodCinemaVideoEl.duration) && spkmodCinemaVideoEl.duration > 0) {
					window.spkmodCinemaVideoDurationSec = spkmodCinemaVideoEl.duration;
				}
				break;
		}
		return;
	}
	if (!spkmodCinemaIframe || !spkmodCinemaIframe.contentWindow) return;
	// Do not send playback queries before YouTube iframe API has initialized,
	// but ALWAYS allow commands that silence, stop, or pause the player!
	if (!spkmodCinemaYtReady && func !== 'listening' && func !== 'mute' && func !== 'unMute' && func !== 'pauseVideo' && func !== 'stopVideo') return;
	try {
		spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({
			event: 'command',
			func: func,
			args: args
		}), '*');
	} catch (_) {}
}

function spkmodCreateCinemaPhysicalFrame() {
	if (!window.THREE || typeof gameState === 'undefined' || !gameState?.scene) return;
	const THREE = window.THREE;

	if (spkmodCinemaFrameMesh) {
		try { gameState.scene.remove(spkmodCinemaFrameMesh); } catch (_) {}
		spkmodCinemaFrameMesh = null;
	}

	const group = new THREE.Group();
	group.name = "spkmodCinemaPhysicalFrame";

	const w = spkmodCinemaConfig.width;
	const h = spkmodCinemaConfig.height;
	const borderThick = 0.35;
	const depth = 0.25;

	const frameMat = new THREE.MeshStandardMaterial({
		color: 0x18181f,
		roughness: 0.7,
		metalness: 0.2
	});

	const backGeo = new THREE.PlaneGeometry(w, h);
	const backMat = new THREE.MeshBasicMaterial({ color: 0x050508, side: THREE.DoubleSide });
	const backMesh = new THREE.Mesh(backGeo, backMat);
	backMesh.position.z = -0.05;
	group.add(backMesh);

	const topBar = new THREE.Mesh(new THREE.BoxGeometry(w + borderThick * 2, borderThick, depth), frameMat);
	topBar.position.set(0, h / 2 + borderThick / 2, 0);
	group.add(topBar);

	const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(w + borderThick * 2, borderThick, depth), frameMat);
	bottomBar.position.set(0, -h / 2 - borderThick / 2, 0);
	group.add(bottomBar);

	const leftBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, h, depth), frameMat);
	leftBar.position.set(-w / 2 - borderThick / 2, 0, 0);
	group.add(leftBar);

	const rightBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, h, depth), frameMat);
	rightBar.position.set(w / 2 + borderThick / 2, 0, 0);
	group.add(rightBar);

	const poleHeight = Math.max(1, spkmodCinemaConfig.pos.y - h / 2);
	const poleGeo = new THREE.CylinderGeometry(0.18, 0.22, poleHeight, 16);
	const poleMat = new THREE.MeshStandardMaterial({ color: 0x33333d, roughness: 0.5, metalness: 0.6 });

	const leftPole = new THREE.Mesh(poleGeo, poleMat);
	leftPole.position.set(-w * 0.42, -h / 2 - poleHeight / 2, 0);
	group.add(leftPole);

	const rightPole = new THREE.Mesh(poleGeo, poleMat);
	rightPole.position.set(w * 0.42, -h / 2 - poleHeight / 2, 0);
	group.add(rightPole);

	group.position.set(spkmodCinemaConfig.pos.x, spkmodCinemaConfig.pos.y, spkmodCinemaConfig.pos.z);
	group.rotation.y = spkmodCinemaConfig.rotationY;
	group.visible = false;

	gameState.scene.add(group);
	spkmodCinemaFrameMesh = group;
}

function spkmodInitCinemaOcclusion() {
	if (typeof window === 'undefined' || !window.THREE) return;
	const THREE = window.THREE;

	if (!spkmodCinemaOcclusionCanvas) {
		spkmodCinemaOcclusionCanvas = document.createElement('canvas');
		spkmodCinemaOcclusionCanvas.id = 'spkmod-cinema-occlusion-canvas';
		spkmodCinemaOcclusionCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 4; display: none;';
		document.body.appendChild(spkmodCinemaOcclusionCanvas);
	}

	if (!spkmodCinemaOcclusionRenderer) {
		try {
			spkmodCinemaOcclusionRenderer = new THREE.WebGLRenderer({
				canvas: spkmodCinemaOcclusionCanvas,
				alpha: true,
				antialias: false,
				stencil: true,
				depth: true,
				powerPreference: 'low-power'
			});
			spkmodCinemaOcclusionRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
			spkmodCinemaOcclusionRenderer.setSize(window.innerWidth, window.innerHeight);
			spkmodCinemaOcclusionRenderer.setClearColor(0x000000, 0);
			spkmodCinemaOcclusionRenderer.autoClear = false;
		} catch (err) {
			console.warn("[SpeakiMod+] WebGL Occlusion Renderer init failed:", err);
			return;
		}
	}

	if (!spkmodCinemaOcclusionScene) {
		spkmodCinemaOcclusionScene = new THREE.Scene();
	}

	if (!spkmodCinemaOcclusionAmbientLight) {
		spkmodCinemaOcclusionAmbientLight = new THREE.AmbientLight(0xffffff, 1.5);
		spkmodCinemaOcclusionScene.add(spkmodCinemaOcclusionAmbientLight);
	}
	if (!spkmodCinemaOcclusionDirLight) {
		spkmodCinemaOcclusionDirLight = new THREE.DirectionalLight(0xffffff, 0.9);
		spkmodCinemaOcclusionDirLight.position.set(0, 20, 20);
		spkmodCinemaOcclusionScene.add(spkmodCinemaOcclusionDirLight);
	}

	if (!spkmodCinemaOccluderMesh) {
		const occluderGeo = new THREE.PlaneGeometry(spkmodCinemaConfig.width, spkmodCinemaConfig.height);
		const occluderMat = new THREE.MeshBasicMaterial({
			color: 0x000000,
			colorWrite: false,
			depthWrite: true,
			depthTest: true,
			stencilWrite: true,
			stencilRef: 1,
			stencilFunc: THREE.AlwaysStencilFunc,
			stencilZPass: THREE.ReplaceStencilOp
		});
		spkmodCinemaOccluderMesh = new THREE.Mesh(occluderGeo, occluderMat);
		spkmodCinemaOccluderMesh.position.set(spkmodCinemaConfig.pos.x, spkmodCinemaConfig.pos.y, spkmodCinemaConfig.pos.z);
		spkmodCinemaOccluderMesh.rotation.y = spkmodCinemaConfig.rotationY;
		spkmodCinemaOcclusionScene.add(spkmodCinemaOccluderMesh);
	}

	if (!spkmodCinemaSilhouetteMat) {
		spkmodCinemaSilhouetteMat = new THREE.MeshBasicMaterial({
			color: 0x14101e,
			skinning: true,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.96,
			depthTest: true,
			depthWrite: false,
			stencilWrite: true,
			stencilRef: 1,
			stencilFunc: THREE.EqualStencilFunc,
			stencilZPass: THREE.KeepStencilOp
		});
	}
}

function spkmodGetAvatarModelRoot(entity) {
	if (!entity) return null;
	if (entity.root && entity.root.isObject3D) return entity.root;
	if (entity.avatar?.root && entity.avatar.root.isObject3D) return entity.avatar.root;
	if (entity.avatar && entity.avatar.isObject3D) return entity.avatar;
	if (entity.children) {
		for (const child of entity.children) {
			const n = (child.name || "").toLowerCase();
			if (n === "root" || n === "avatar" || n === "model") return child;
			if (n.includes("label") || n.includes("shadow") || n.includes("ring") || n.includes("pad")) continue;
			if (child.isSkinnedMesh) return child;
			if (child.children && child.children.some(c => c.isSkinnedMesh)) return child;
		}
	}
	return null;
}

function spkmodRenderCinemaOcclusion() {
	if (!spkmodCinemaConfig.occlusion || !spkmodCinemaOcclusionRenderer || !spkmodCinemaOcclusionScene || !spkmodCinemaOccluderMesh) {
		if (spkmodCinemaOcclusionCanvas && spkmodCinemaOcclusionCanvas.style.display !== 'none') {
			spkmodCinemaOcclusionCanvas.style.display = 'none';
		}
		return;
	}

	const exactZone = spkmodGetExactCinemaZone();
	if (exactZone !== 1 || (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame())) {
		if (spkmodCinemaOcclusionCanvas && spkmodCinemaOcclusionCanvas.style.display !== 'none') {
			spkmodCinemaOcclusionCanvas.style.display = 'none';
		}
		return;
	}

	if (typeof gameState === 'undefined' || !gameState?.camera) return;

	if (spkmodCinemaOcclusionCanvas.style.display !== '') {
		spkmodCinemaOcclusionCanvas.style.display = '';
	}

	const avatarRoots = [];
	const sPos = spkmodCinemaConfig.pos;

	// Local player: pick avatar model root only (exclude nametag & ground shadow)
	if (gameState.playerContainer && gameState.playerContainer.visible !== false) {
		const pos = gameState.playerContainer.position;
		if (pos) {
			const dx = pos.x - sPos.x;
			const dz = pos.z - sPos.z;
			if (dx * dx + dz * dz <= 900) {
				const modelRoot = spkmodGetAvatarModelRoot(gameState.localAvatar) || spkmodGetAvatarModelRoot(gameState.playerContainer);
				if (modelRoot && modelRoot.visible !== false) {
					avatarRoots.push(modelRoot);
				}
			}
		}
	}

	// Remote players: pick avatar model root only
	if (gameState.remotePlayers?.remotePlayers) {
		const rpMap = gameState.remotePlayers.remotePlayers;
		const list = (rpMap instanceof Map) ? rpMap.values() : (Array.isArray(rpMap) ? rpMap : []);
		for (const rp of list) {
			if (!rp) continue;
			if (typeof isSilencedPlayer === 'function' && isSilencedPlayer(rp)) continue;
			const pos = rp.container?.position || (rp.info && rp.info.pos);
			if (pos) {
				const dx = pos.x - sPos.x;
				const dz = pos.z - sPos.z;
				if (dx * dx + dz * dz <= 900) {
					const modelRoot = spkmodGetAvatarModelRoot(rp.avatar) || spkmodGetAvatarModelRoot(rp.container);
					if (modelRoot && modelRoot.visible !== false) {
						avatarRoots.push(modelRoot);
					}
				}
			}
		}
	}

	// Pass 1: Draw screen occluder to write depth & stencil (1)
	spkmodCinemaOcclusionRenderer.clear(true, true, true);

	spkmodCinemaOcclusionScene.overrideMaterial = null;
	spkmodCinemaOcclusionScene.children = [spkmodCinemaOccluderMesh];
	spkmodCinemaOccluderMesh.position.set(spkmodCinemaConfig.pos.x, spkmodCinemaConfig.pos.y, spkmodCinemaConfig.pos.z);
	spkmodCinemaOccluderMesh.rotation.y = spkmodCinemaConfig.rotationY;
	spkmodCinemaOccluderMesh.updateMatrixWorld(true);

	spkmodCinemaOcclusionRenderer.render(spkmodCinemaOcclusionScene, gameState.camera);

	// Pass 2: Draw avatars in full natural color with textures & lighting
	if (avatarRoots.length > 0) {
		const modifiedMaterials = [];
		for (const root of avatarRoots) {
			root.traverse(child => {
				if (!child.isMesh) return;
				const name = (child.name || "").toLowerCase();
				if (name.includes("shadow") || name.includes("pad") || name.includes("label") || name.includes("ring")) return;

				const mats = Array.isArray(child.material) ? child.material : [child.material];
				for (const m of mats) {
					if (!m) continue;
					modifiedMaterials.push({
						mat: m,
						stencilWrite: m.stencilWrite,
						stencilFunc: m.stencilFunc,
						stencilRef: m.stencilRef,
						stencilMask: m.stencilMask
					});
					m.stencilWrite = true;
					m.stencilFunc = THREE.EqualStencilFunc;
					m.stencilRef = 1;
					m.stencilMask = 0xFF;
				}
			});
		}

		spkmodCinemaOcclusionScene.overrideMaterial = null;
		const sceneChildren = [];
		if (spkmodCinemaOcclusionAmbientLight) sceneChildren.push(spkmodCinemaOcclusionAmbientLight);
		if (spkmodCinemaOcclusionDirLight) {
			sceneChildren.push(spkmodCinemaOcclusionDirLight);
			if (gameState.camera) {
				spkmodCinemaOcclusionDirLight.position.copy(gameState.camera.position).add(new THREE.Vector3(0, 5, 0));
			}
		}
		for (const r of avatarRoots) sceneChildren.push(r);
		spkmodCinemaOcclusionScene.children = sceneChildren;

		spkmodCinemaOcclusionRenderer.render(spkmodCinemaOcclusionScene, gameState.camera);

		// Restore original material stencil configurations
		for (const item of modifiedMaterials) {
			item.mat.stencilWrite = item.stencilWrite;
			item.mat.stencilFunc = item.stencilFunc;
			item.mat.stencilRef = item.stencilRef;
			item.mat.stencilMask = item.stencilMask;
		}
	}

	spkmodCinemaOcclusionScene.children = [spkmodCinemaOccluderMesh];
	spkmodCinemaOcclusionScene.overrideMaterial = null;
}

function spkmodToggleCinemaOcclusion(force) {
	if (force !== undefined) {
		spkmodCinemaConfig.occlusion = !!force;
	} else {
		spkmodCinemaConfig.occlusion = !spkmodCinemaConfig.occlusion;
	}
	if (window.localStorage) {
		try {
			localStorage.setItem("spkmod-cinema-occlusion", spkmodCinemaConfig.occlusion ? "true" : "false");
		} catch (_) {}
	}
	if (!spkmodCinemaConfig.occlusion && spkmodCinemaOcclusionCanvas) {
		spkmodCinemaOcclusionCanvas.style.display = 'none';
	}
	spkmodSyncCinemaOcclusionUI();
	if (typeof chatLog === 'function') {
		const stateText = spkmodCinemaConfig.occlusion ? "ON" : "OFF";
		chatLog(`🎬 Spiki Occlusion: ${stateText}`);
	}
	return spkmodCinemaConfig.occlusion;
}
window.spkmodToggleCinemaOcclusion = spkmodToggleCinemaOcclusion;

function spkmodSyncCinemaOcclusionUI() {
	const occBtn = document.getElementById("spkmod-cinema-modal-occlusion-btn");
	if (occBtn) {
		const active = !!spkmodCinemaConfig.occlusion;
		occBtn.style.background = active ? '#4a3b68' : '#261c33';
		occBtn.style.color = active ? '#ffdf79' : '#887c9e';
		occBtn.style.border = '1px solid ' + (active ? '#e8b84b' : '#7c6894');
		occBtn.title = getCinemaText("cinemaOcclusionToggle");
	}
	const chk = document.getElementById("spkmod-cinema-occlusion-checkbox");
	if (chk) {
		chk.checked = !!spkmodCinemaConfig.occlusion;
	}
}
window.spkmodSyncCinemaOcclusionUI = spkmodSyncCinemaOcclusionUI;

function spkmodInitCinema() {
	if (!spkmodCinemaConfig.enabled) return;
	if (typeof gameState === 'undefined' || !gameState?.camera || !window.THREE || !gameState?.scene) return;

	const classes = spkmodGetCSS3DClasses();
	if (!classes) return;

	if (!spkmodCinemaContainer) {
		spkmodCinemaContainer = document.createElement('div');
		spkmodCinemaContainer.id = 'spkmod-cinema-container';
		spkmodCinemaContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; overflow: hidden; z-index: 3; display: none;';
		document.body.appendChild(spkmodCinemaContainer);
	}

	if (!spkmodCinemaRenderer) {
		spkmodCinemaRenderer = new classes.CSS3DRenderer({ element: spkmodCinemaContainer });
		spkmodCinemaRenderer.setSize(window.innerWidth, window.innerHeight);
	}

	if (!spkmodCinemaScene) {
		spkmodCinemaScene = new window.THREE.Scene();
	}

	if (!spkmodCinemaScreenObject) {
		const screenDiv = document.createElement('div');
		screenDiv.id = 'spkmod-cinema-screen';
		screenDiv.style.cssText = 'width: 1280px; height: 720px; background: #000; overflow: hidden; pointer-events: none; border-radius: 4px; box-shadow: 0 0 20px rgba(0,0,0,0.8);';

		spkmodCinemaIframe = document.createElement('iframe');
		spkmodCinemaIframe.id = 'spkmod-cinema-iframe';
		spkmodCinemaIframe.style.cssText = 'width: 100%; height: 100%; border: none; pointer-events: auto;';
		spkmodCinemaIframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
		screenDiv.appendChild(spkmodCinemaIframe);

		spkmodCinemaVideoEl = document.createElement('video');
		spkmodCinemaVideoEl.id = 'spkmod-cinema-video';
		spkmodCinemaVideoEl.style.cssText = 'width: 100%; height: 100%; background: #000; object-fit: contain; display: none; pointer-events: auto;';
		spkmodCinemaVideoEl.playsInline = true;
		spkmodCinemaVideoEl.controls = true;
		spkmodCinemaVideoEl.preload = 'auto';
		spkmodCinemaVideoEl.addEventListener('loadedmetadata', () => {
			if (isFinite(spkmodCinemaVideoEl.duration) && spkmodCinemaVideoEl.duration > 0) {
				window.spkmodCinemaVideoDurationSec = spkmodCinemaVideoEl.duration;
			}
			if (typeof spkmodUpdateCinemaTimeDisplay === 'function') spkmodUpdateCinemaTimeDisplay();
		});
		spkmodCinemaVideoEl.addEventListener('timeupdate', () => {
			if (!spkmodCinemaIsDirectVideo || !spkmodCinemaInZone) return;
			if (isFinite(spkmodCinemaVideoEl.currentTime)) {
				window.spkmodCinemaCurrentVideoTimeSec = spkmodCinemaVideoEl.currentTime;
				spkmodCinemaCurrentVideoStartTimeMs = Date.now() - (spkmodCinemaVideoEl.currentTime * 1000);
			}
		});
		spkmodCinemaVideoEl.addEventListener('play', () => {
			if (!spkmodCinemaInZone) {
				spkmodCinemaVideoEl.pause();
				spkmodCinemaVideoEl.muted = true;
				return;
			}
			window.spkmodCinemaLastPlayerState = 1;
		});
		spkmodCinemaVideoEl.addEventListener('pause', () => {
			window.spkmodCinemaLastPlayerState = 2;
		});
		spkmodCinemaVideoEl.addEventListener('ended', () => {
			window.spkmodCinemaLastPlayerState = 0;
			if (!spkmodCinemaInZone) return;
			if (window.spkmodCinemaAnniversaryLocked) {
				try { spkmodCinemaVideoEl.currentTime = 0; } catch (_) {}
				spkmodCinemaVideoEl.play().catch(() => {});
				spkmodCinemaCurrentVideoStartTimeMs = Date.now();
			} else if (typeof spkmodAdvanceCinemaTrack === 'function') {
				spkmodAdvanceCinemaTrack('ended_event');
			}
		});
		screenDiv.appendChild(spkmodCinemaVideoEl);

		spkmodCinemaScreenObject = new classes.CSS3DObject(screenDiv);
		spkmodCinemaScreenObject.scale.set(0.01, 0.01, 0.01);
		spkmodCinemaScene.add(spkmodCinemaScreenObject);
	}

	spkmodCinemaScreenObject.position.set(spkmodCinemaConfig.pos.x, spkmodCinemaConfig.pos.y, spkmodCinemaConfig.pos.z);
	spkmodCinemaScreenObject.rotation.y = spkmodCinemaConfig.rotationY;

	spkmodCreateCinemaPhysicalFrame();
	if (spkmodCinemaConfig.occlusion !== false) {
		spkmodInitCinemaOcclusion();
	}
}

function spkmodSyncCinemaPlayback(force = false) {
	const syncData = spkmodGetCinemaSyncedTrack();
	if (!syncData) return;
	const { track, startSec } = syncData;

	const videoId = track.id;
	spkmodCinemaManualTrackIndex = null;
	spkmodCinemaIsPaused = false;

	const isDirect = spkmodIsDirectVideoUrl(track.url || track.id);
	const directUrl = isDirect ? (spkmodIsDirectVideoUrl(track.id) ? track.id : track.url) : null;
	const isSameVideo = isDirect
		? (spkmodCinemaIsDirectVideo && spkmodCinemaCurrentVideo === videoId && spkmodCinemaVideoEl && spkmodCinemaVideoEl.getAttribute('src') === directUrl)
		: (!spkmodCinemaIsDirectVideo && spkmodCinemaCurrentVideo === videoId && spkmodCinemaIframe && spkmodCinemaIframe.src && spkmodCinemaIframe.src.includes(videoId));

	spkmodCinemaCurrentVideo = videoId;
	spkmodCinemaCurrentVideoStartTimeMs = Date.now() - (startSec * 1000);
	window.spkmodCinemaCurrentVideoTimeSec = startSec;
	window.spkmodCurrentCinemaTitle = track.title || "Monatium Cinema";

	if (typeof spkmodRenderCinemaModalList === 'function' && spkmodIsCinemaModalOpen()) {
		spkmodRenderCinemaModalList();
	}
	if (typeof spkmodUpdateCinemaPlaybackUI === "function") spkmodUpdateCinemaPlaybackUI();
	if (typeof spkmodUpdateCinemaTimeDisplay === "function") spkmodUpdateCinemaTimeDisplay();

	// NEVER load or start playback in iframe if player is outside cinema seats!
	if (!spkmodCinemaInZone) {
		spkmodCinemaIsPaused = true;
		return;
	}

	if (isSameVideo) {
		// Video is already loaded: seamlessly seek to sync time without reloading
		const effectiveStart = (track.isStream || track.isLiveStream) ? 0 : startSec;
		spkmodSendYtCommand('seekTo', [effectiveStart, true]);
		spkmodSendYtCommand('playVideo');
	} else if (isDirect && directUrl) {
		const effectiveStart = (track.isStream || track.isLiveStream) ? 0 : startSec;
		spkmodPlayDirectVideo(directUrl, effectiveStart, spkmodCinemaRepeatMode === 'one');
	} else {
		// New video or initial load
		spkmodSetCinemaPlayerMode(false);
		if (spkmodCinemaIframe) {
			const isMuted = !!window.spkmodCinemaConfig?.muted;
			const loopParam = (spkmodCinemaRepeatMode === 'one') ? `&loop=1&playlist=${videoId}` : '';
			const effectiveStart = (track.isStream || track.isLiveStream) ? 0 : startSec;
			const ytUrl = track.isChannelLive
				? `https://www.youtube.com/embed/live_stream?channel=${track.channelId}&enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&origin=${encodeURIComponent(location.origin)}`
				: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&start=${effectiveStart}&origin=${encodeURIComponent(location.origin)}${loopParam}`;
			spkmodCinemaYtReady = false;
			spkmodCinemaIframe.src = ytUrl;
			spkmodCinemaIframe.onload = () => {
				try {
					spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
				} catch (_) {}
			};
			setTimeout(() => {
				try {
					spkmodCinemaIframe?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
				} catch (_) {}
				spkmodSendYtCommand('getDuration');
			}, 500);
			setTimeout(() => { spkmodSendYtCommand('getDuration'); }, 1500);
			setTimeout(() => { spkmodSendYtCommand('getDuration'); }, 3000);
		}
	}
}

function spkmodIsInMinigame() {
	if (typeof gameState !== 'undefined') {
		if (gameState?.selfMinigameRing) return true;
		if (gameState?.minigame || gameState?.inMinigame) return true;
		const zid = (gameState?.zoneId !== undefined && typeof gameState.zoneId === 'number' && !isNaN(gameState.zoneId)) ? (gameState.zoneId % 10000) : null;
		if (zid !== null && zid >= 900 && zid <= 999) return true;
	}
	if (typeof window !== 'undefined' && window.lunActiveMinigamePanel) return true;
	if (typeof document !== 'undefined') {
		if (document.querySelector('.sr-minigame, .sr-minigame-game, .sr-minigame-canvas, .sr-minigame-entry-dialog.sr-panel--open')) {
			return true;
		}
	}
	return false;
}
window.spkmodIsInMinigame = spkmodIsInMinigame;

function spkmodIsPlayerInCinemaSeats(playerPos) {
	if (!playerPos) return false;
	if (spkmodIsInMinigame()) return false;
	const curZone = spkmodGetExactCinemaZone();
	if (curZone !== 1) return false;

	// Seats bounding box expanded by 10m on each side around amphitheater seat coordinates:
	// Base points: (83.72, 42.44), (89.28, 42.27), (89.28, 24.83), (83.66, 24.31)
	return playerPos.x >= 73.3 && playerPos.x <= 99.6 &&
	       playerPos.z >= 14.0 && playerPos.z <= 52.8;
}
window.spkmodIsPlayerInCinemaSeats = spkmodIsPlayerInCinemaSeats;

function spkmodSyncCinemaVolumeUI() {
	const cfg = window.spkmodCinemaConfig;
	if (!cfg) return;
	const isMuted = !!cfg.muted;
	const vol = typeof cfg.volume === 'number' ? cfg.volume : 80;

	// 1. Floating Pill / Dock Controls
	const muteBtn = document.getElementById("spkmod-cinema-mute-btn");
	if (muteBtn) {
		muteBtn.innerText = (isMuted || vol === 0) ? "🔇" : (vol > 50 ? "🔊" : "🔉");
		const titleText = isMuted
			? (typeof t === "function" ? t("cinemaUnmute", "Unmute") : "Unmute")
			: (typeof t === "function" ? t("cinemaMute", "Mute") : "Mute");
		muteBtn.title = titleText;
	}
	const volSlider = document.getElementById("spkmod-cinema-vol-slider");
	if (volSlider) {
		volSlider.value = String(vol);
		volSlider.style.opacity = isMuted ? "0.55" : "1";
	}
	const volLabel = document.getElementById("spkmod-cinema-vol-label");
	if (volLabel) {
		volLabel.innerText = isMuted ? "0%" : `${vol}%`;
	}

	// 2. Fullscreen Cinema Mode Top HUD Bar Controls
	const hudMuteBtn = document.getElementById("spkmod-cinema-hud-mute-btn");
	if (hudMuteBtn) {
		hudMuteBtn.innerText = (isMuted || vol === 0) ? "🔇" : (vol > 50 ? "🔊" : "🔉");
		hudMuteBtn.title = isMuted ? "Unmute" : "Mute";
	}
	const hudVolSlider = document.getElementById("spkmod-cinema-hud-vol-slider");
	if (hudVolSlider) {
		hudVolSlider.value = String(vol);
		hudVolSlider.style.opacity = isMuted ? "0.55" : "1";
	}
	const hudVolLabel = document.getElementById("spkmod-cinema-hud-vol-label");
	if (hudVolLabel) {
		hudVolLabel.innerText = isMuted ? "0%" : `${vol}%`;
	}

	// 3. Mod Settings Panel Controls
	const panelMuteBtn = document.getElementById("spkmod-cinema-panel-mute-btn");
	if (panelMuteBtn) {
		panelMuteBtn.innerText = (isMuted || vol === 0) ? "🔇" : (vol > 50 ? "🔊" : "🔉");
		panelMuteBtn.title = isMuted ? "Unmute" : "Mute";
	}
	if (window.lunPanelElements?.cinemaVolumeInput) {
		window.lunPanelElements.cinemaVolumeInput.value = String(vol);
	}

	// 4. Cinema Modal Controls
	if (spkmodCinemaModalEl) {
		const modalMute = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-mute-btn");
		if (modalMute) {
			modalMute.innerText = (isMuted || vol === 0) ? "🔇" : (vol > 50 ? "🔊" : "🔉");
			modalMute.title = isMuted ? "Unmute" : "Mute";
		}
		const modalSlider = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-vol-slider");
		if (modalSlider) {
			modalSlider.value = String(vol);
			modalSlider.style.opacity = isMuted ? "0.55" : "1";
		}
		const modalLabel = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-vol-label");
		if (modalLabel) {
			modalLabel.innerText = isMuted ? "0%" : `${vol}%`;
		}
	}
}
window.spkmodSyncCinemaVolumeUI = spkmodSyncCinemaVolumeUI;

window.spkmodSetCinemaVolume = function(vol, isMuted) {
	if (typeof vol === 'number') {
		vol = Math.max(0, Math.min(100, Math.round(vol)));
		window.spkmodCinemaConfig.volume = vol;
		try { localStorage.setItem("spkmod-cinema-volume", String(vol)); } catch (_) {}
	}
	if (typeof isMuted === 'boolean') {
		window.spkmodCinemaConfig.muted = isMuted;
		try { localStorage.setItem("spkmod-cinema-muted", isMuted ? "true" : "false"); } catch (_) {}
	}

	const effectiveVol = window.spkmodCinemaConfig.muted ? 0 : window.spkmodCinemaConfig.volume;
	if (window.spkmodCinemaConfig.muted || effectiveVol === 0) {
		spkmodSendYtCommand('mute');
		spkmodSendYtCommand('setVolume', [0]);
		if (typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(false, "cinema");
		}
	} else {
		spkmodSendYtCommand('unMute');
		spkmodSendYtCommand('setVolume', [effectiveVol]);
		if (spkmodCinemaInZone && !spkmodCinemaIsPaused && typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(true, "cinema");
		}
	}
	spkmodCinemaLastVolume = effectiveVol;
	spkmodSyncCinemaVolumeUI();
};

window.spkmodToggleCinemaMute = function() {
	const newMuted = !window.spkmodCinemaConfig.muted;
	if (!newMuted && window.spkmodCinemaConfig.volume === 0) {
		window.spkmodCinemaConfig.volume = 50;
	}
	window.spkmodSetCinemaVolume(window.spkmodCinemaConfig.volume, newMuted);
};

// ============================================================================
// PLAYLIST VIEW & PLAYBACK TRANSPORT CONTROLS (PLAY, BACK, PAUSE, NEXT)
// ============================================================================

function spkmodFormatDuration(sec, isSong = false, isEnded = false, isStream = false) {
	if (isEnded) return "⚪ Stream Ended";
	if (typeof sec === 'number' && !isNaN(sec) && sec >= 0) {
		const totalSec = Math.floor(sec);
		const h = Math.floor(totalSec / 3600);
		const m = Math.floor((totalSec % 3600) / 60);
		const s = Math.floor(totalSec % 60);
		if (h > 0) {
			return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
		}
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	}
	if (isSong) return `🎵 ${getCinemaText("cinemaTabSongs")}`;
	if (isStream) return "🔴 LIVE";
	return "--:--";
}

function spkmodGetCinemaCurrentTrackIndex() {
	const currentList = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);
	if (!currentList || currentList.length === 0) return 0;
	if (spkmodCinemaCurrentVideo) {
		const idx = currentList.findIndex(t => t.id === spkmodCinemaCurrentVideo);
		if (idx >= 0) return idx;
	}
	if (spkmodCinemaManualTrackIndex !== null && spkmodCinemaManualTrackIndex >= 0 && spkmodCinemaManualTrackIndex < currentList.length) {
		return spkmodCinemaManualTrackIndex;
	}
	return 0;
}
window.spkmodGetCinemaCurrentTrackIndex = spkmodGetCinemaCurrentTrackIndex;

function spkmodPlayCinemaTrackIndex(index, startSec = 0, isManual = true) {
	try {
		if (window.spkmodCinemaAnniversaryLocked && isManual) {
			if (typeof chatLog === 'function') chatLog("🎬 Cinema is locked for the Anniversary broadcast!");
			return;
		}
		const currentList = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
			? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
			: (spkmodCinemaLoadedPlaylist || []);
		if (!currentList || currentList.length === 0) return;
		const count = currentList.length;
		index = ((index % count) + count) % count;

		spkmodCinemaLoadedPlaylist = currentList;
		spkmodCinemaManualTrackIndex = isManual ? index : null;
		spkmodCinemaIsPaused = false;
		const track = currentList[index];
		if (!track) return;

		spkmodCinemaCurrentVideo = track.id;
		spkmodCinemaCurrentVideoStartTimeMs = Date.now() - (startSec * 1000);
		window.spkmodCinemaCurrentVideoTimeSec = startSec;
		window.spkmodCurrentCinemaTitle = track.title || "Monatium Cinema";

		// NEVER load or start playback in iframe if player is outside cinema seats!
		if (!spkmodCinemaInZone) {
			spkmodCinemaIsPaused = true;
			if (typeof spkmodUpdateCinemaPlaybackUI === "function") spkmodUpdateCinemaPlaybackUI();
			return;
		}

		if (spkmodIsDirectVideoUrl(track.url || track.id)) {
			const directUrl = spkmodIsDirectVideoUrl(track.id) ? track.id : track.url;
			const effectiveStart = (track.isStream || track.isLiveStream || track.duration === 0) ? 0 : startSec;
			spkmodPlayDirectVideo(directUrl, effectiveStart, spkmodCinemaRepeatMode === 'one');
		} else if (spkmodCinemaIframe) {
			spkmodSetCinemaPlayerMode(false);
			const isMuted = !!window.spkmodCinemaConfig?.muted;
			const loopParam = (spkmodCinemaRepeatMode === 'one') ? `&loop=1&playlist=${track.id}` : '';
			const effectiveStart = (track.isStream || track.isLiveStream || track.duration === 0) ? 0 : startSec;
			const ytUrl = track.isChannelLive
				? `https://www.youtube.com/embed/live_stream?channel=${track.channelId}&enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&origin=${encodeURIComponent(location.origin)}`
				: `https://www.youtube.com/embed/${track.id}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&start=${effectiveStart}&origin=${encodeURIComponent(location.origin)}${loopParam}`;
			spkmodCinemaYtReady = false;
			spkmodCinemaIframe.src = ytUrl;
			spkmodCinemaIframe.onload = () => {
				try {
					spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
				} catch (_) {}
			};
			setTimeout(() => {
				try {
					spkmodCinemaIframe?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
				} catch (_) {}
				spkmodSendYtCommand('getDuration');
			}, 500);
			setTimeout(() => { spkmodSendYtCommand('getDuration'); }, 1500);
			setTimeout(() => { spkmodSendYtCommand('getDuration'); }, 3000);
		}

		spkmodUpdateCinemaSpatialAudio();
		spkmodUpdateCinemaPlaybackUI();
	} catch (err) {
		console.error("[SpeakiMod+] Error playing cinema track at index:", index, err);
	}
}
window.spkmodPlayCinemaTrackIndex = spkmodPlayCinemaTrackIndex;

var spkmodCinemaLastAdvanceMs = 0;
function spkmodAdvanceCinemaTrack(reason = "ended") {
	if (!spkmodCinemaInZone) return; // Never advance or autoplay when player is outside cinema!

	const now = Date.now();
	if (now - spkmodCinemaLastAdvanceMs < 2000) return; // Prevent double trigger
	spkmodCinemaLastAdvanceMs = now;

	const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);
	if (!list || list.length === 0) return;

	const curIdx = spkmodGetCinemaCurrentTrackIndex();
	const curTrack = list[curIdx];
	if (curTrack && (curTrack.isLiveStream || (curTrack.isStream && curTrack.duration === 0))) {
		if (reason === "ended_event") {
			curTrack.isOffline = true;
			curTrack.isEnded = true;
			console.log(`[SpeakiMod+] Stream ${curTrack.title || curTrack.id} ended. Advancing...`);
		}
	}

	const isManual = spkmodCinemaManualTrackIndex !== null;

	if (!isManual) {
		console.log(`[SpeakiMod+] Synced cinema track ended (${reason}). Auto-tuning to broadcast schedule...`);
		const synced = spkmodGetCinemaSyncedTrack();
		if (synced && synced.track.id === curTrack?.id && (reason === "ended_event" || reason === "at_end_time")) {
			const nextIdx = (synced.trackIndex + 1) % list.length;
			spkmodPlayCinemaTrackIndex(nextIdx, 0, false);
		} else {
			spkmodSyncCinemaPlayback(false);
		}
		return;
	}

	// IN MANUAL PLAYLIST MODE: Advance sequentially
	let nextIdx = curIdx + 1;
	if (spkmodCinemaRepeatMode === 'one') {
		nextIdx = curIdx;
	} else if (spkmodCinemaRepeatMode === 'off') {
		if (curIdx >= list.length - 1) {
			spkmodCinemaIsPaused = true;
			if (typeof spkmodUpdateCinemaPlaybackUI === 'function') spkmodUpdateCinemaPlaybackUI();
			return;
		}
	}

	console.log(`[SpeakiMod+] Advancing manual cinema track (${reason}): #${curIdx + 1} -> #${((nextIdx % list.length) + list.length) % list.length + 1}`);
	spkmodPlayCinemaTrackIndex(nextIdx, 0, true);
	if (typeof spkmodRenderCinemaModalList === 'function' && spkmodIsCinemaModalOpen()) {
		spkmodRenderCinemaModalList();
	}
	if (typeof spkmodUpdateCinemaPlaybackUI === 'function') {
		spkmodUpdateCinemaPlaybackUI();
	}
}
window.spkmodAdvanceCinemaTrack = spkmodAdvanceCinemaTrack;

window.spkmodCinemaPlay = function() {
	if (!spkmodCinemaInZone) return;
	spkmodCinemaIsPaused = false;
	spkmodSendYtCommand('playVideo');
	if (spkmodCinemaInZone && !window.spkmodCinemaConfig?.muted && typeof window.spkmodSuppressGameBgm === 'function') {
		window.spkmodSuppressGameBgm(true, "cinema");
	}
	spkmodUpdateCinemaPlaybackUI();
};

window.spkmodCinemaPause = function() {
	spkmodCinemaIsPaused = true;
	spkmodSendYtCommand('pauseVideo');
	if (typeof window.spkmodSuppressGameBgm === 'function') {
		window.spkmodSuppressGameBgm(false, "cinema");
	}
	spkmodUpdateCinemaPlaybackUI();
};

window.spkmodCinemaTogglePlayPause = function() {
	if (!spkmodCinemaInZone) return;
	if (spkmodCinemaIsPaused) {
		window.spkmodCinemaPlay();
	} else {
		window.spkmodCinemaPause();
	}
};

window.spkmodCinemaPrev = function() {
	if (!spkmodCinemaInZone || window.spkmodCinemaAnniversaryLocked) return;
	const cur = spkmodGetCinemaCurrentTrackIndex();
	spkmodPlayCinemaTrackIndex(cur - 1, 0, true);
};

window.spkmodCinemaNext = function() {
	if (!spkmodCinemaInZone || window.spkmodCinemaAnniversaryLocked) return;
	const cur = spkmodGetCinemaCurrentTrackIndex();
	spkmodPlayCinemaTrackIndex(cur + 1, 0, true);
};

window.spkmodCinemaToggleRepeat = function() {
	if (spkmodCinemaRepeatMode === "all") spkmodCinemaRepeatMode = "one";
	else if (spkmodCinemaRepeatMode === "one") spkmodCinemaRepeatMode = "off";
	else spkmodCinemaRepeatMode = "all";
	window.spkmodCinemaRepeatMode = spkmodCinemaRepeatMode;
	try {
		if (window.localStorage) localStorage.setItem("spkmod-cinema-repeat", spkmodCinemaRepeatMode);
	} catch (_) {}
	spkmodUpdateCinemaPlaybackUI();
};

window.spkmodCinemaSyncSchedule = function() {
	if (window.spkmodCinemaAnniversaryLocked) return;
	spkmodCinemaManualTrackIndex = null;
	spkmodCinemaIsPaused = false;
	spkmodSyncCinemaPlayback(true);
	spkmodUpdateCinemaPlaybackUI();
};

// --- Monatium Cinema Thumbnail Preview Tooltip ---
let spkmodCinemaThumbPreview = null;
function ensureCinemaThumbPreview() {
	if (spkmodCinemaThumbPreview) return spkmodCinemaThumbPreview;
	spkmodCinemaThumbPreview = document.createElement("img");
	spkmodCinemaThumbPreview.id = "spkmod-cinema-thumb-preview";
	spkmodCinemaThumbPreview.style.cssText = "display: none; position: fixed; width: 380px; height: 214px; max-width: 92vw; max-height: 85vh; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.9); border: 2px solid #e8b84b; background: #1a1424; object-fit: cover; z-index: 2147483647 !important; pointer-events: none; transition: opacity 0.15s ease-out;";
	document.body.appendChild(spkmodCinemaThumbPreview);

	window.addEventListener("scroll", hideCinemaThumbPreview, true);
	window.addEventListener("resize", hideCinemaThumbPreview, { passive: true });
	window.addEventListener("touchstart", hideCinemaThumbPreview, { passive: true, capture: true });
	return spkmodCinemaThumbPreview;
}

function positionCinemaThumbPreview(thumbEl) {
	if (!thumbEl || !spkmodCinemaThumbPreview) return;
	const rect = thumbEl.getBoundingClientRect();
	const prevW = 380;
	const prevH = 214;

	const modalRect = spkmodCinemaModalEl ? spkmodCinemaModalEl.getBoundingClientRect() : rect;

	let left, top;
	if (modalRect.left > prevW + 16) {
		left = modalRect.left - prevW - 10;
		top = Math.max(12, Math.min(rect.top - 20, window.innerHeight - prevH - 12));
	} else if (window.innerWidth - modalRect.right > prevW + 16) {
		left = modalRect.right + 10;
		top = Math.max(12, Math.min(rect.top - 20, window.innerHeight - prevH - 12));
	} else {
		left = Math.max(12, Math.min(rect.left + rect.width / 2 - prevW / 2, window.innerWidth - prevW - 12));
		top = rect.top - prevH - 10;
		if (top < 12) {
			top = rect.bottom + 10;
		}
		if (top + prevH > window.innerHeight - 12) {
			top = Math.max(12, window.innerHeight - prevH - 12);
		}
	}

	spkmodCinemaThumbPreview.style.left = Math.round(left) + "px";
	spkmodCinemaThumbPreview.style.top = Math.round(top) + "px";
}

function showCinemaThumbPreview(thumbEl) {
	if (!thumbEl) return;
	const preview = ensureCinemaThumbPreview();
	const src = thumbEl.src || "";
	if (!src) return;

	const hqSrc = src.replace('/mqdefault.jpg', '/hqdefault.jpg');
	preview.onerror = () => { preview.src = src; };
	preview.src = hqSrc;
	preview.style.display = "block";
	preview.style.opacity = "1";
	positionCinemaThumbPreview(thumbEl);
}

function hideCinemaThumbPreview() {
	if (spkmodCinemaThumbPreview) {
		spkmodCinemaThumbPreview.style.display = "none";
	}
}

function spkmodGetTrackThumbnail(track) {
	if (!track) return "";
	if (track.liveVideoId) return `https://i.ytimg.com/vi/${track.liveVideoId}/mqdefault.jpg`;
	if (track.id && !track.id.startsWith("live_") && track.id.length === 11) {
		return `https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`;
	}
	return "data:image/svg+xml;utf8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2788%27%20height=%2760%27%20viewBox=%270%200%2088%2060%27%3E%3Crect%20width=%2788%27%20height=%2760%27%20fill=%27%231a1025%27/%3E%3Ccircle%20cx=%2726%27%20cy=%2730%27%20r=%276%27%20fill=%27%23ff3344%27/%3E%3Ctext%20x=%2738%27%20y=%2735%27%20fill=%27%23fff%27%20font-family=%27sans-serif%27%20font-size=%2713%27%20font-weight=%27bold%27%3ELIVE%3C/text%3E%3C/svg%3E";
}

function spkmodRenderCinemaModalList() {
	if (!spkmodCinemaModalEl) return;
	const listEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-list");
	const countEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-count-label");
	if (!listEl) return;

	const playlist = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);

	const tabLabel = (spkmodCinemaActiveTab === 'movies') ? getCinemaText('cinemaTabMovies') : getCinemaText('cinemaTabSongs');
	if (countEl) countEl.innerText = `${tabLabel} (${playlist.length})`;

	const curIdx = spkmodCinemaCurrentVideo ? playlist.findIndex(t => t.id === spkmodCinemaCurrentVideo) : -1;

	if (playlist.length === 0) {
		listEl.innerHTML = `<div style="text-align:center;padding:20px;color:#888;font-size:12px;">${getCinemaText("cinemaNoEntries", tabLabel)}</div>`;
		listEl.dataset.renderedKey = "";
		return;
	}

	const renderedKey = `${spkmodCinemaActiveTab}_${playlist.length}`;

	// If list items already exist and match current playlist, update highlight IN-PLACE without destroying elements
	if (listEl.dataset.renderedKey === renderedKey && listEl.children.length === playlist.length) {
		for (let i = 0; i < listEl.children.length; i++) {
			const item = listEl.children[i];
			const isActive = (i === curIdx);
			item.style.background = isActive ? 'rgba(232, 184, 75, 0.18)' : 'rgba(255, 255, 255, 0.04)';
			item.style.borderColor = isActive ? '#e8b84b' : 'rgba(255, 255, 255, 0.08)';
			item.dataset.active = isActive ? 'true' : 'false';

			const numSpan = item.querySelector(".spkmod-cinema-num");
			if (numSpan) numSpan.style.color = isActive ? '#e8b84b' : '#888';

			const titleSpan = item.querySelector(".spkmod-cinema-title");
			if (titleSpan) {
				titleSpan.style.fontWeight = isActive ? '700' : '600';
				titleSpan.style.color = isActive ? '#ffc94a' : '#fff';
			}

			const durRow = item.querySelector(".spkmod-cinema-dur-row");
			if (durRow) {
				durRow.style.color = isActive ? '#e8b84b' : '#7c6894';
				const durSpan = durRow.querySelector("span:first-child");
				if (durSpan) {
					durSpan.innerText = spkmodFormatDuration(playlist[i].duration, spkmodCinemaActiveTab === 'songs', playlist[i].isOffline || playlist[i].isEnded, playlist[i].isStream || playlist[i].isLiveStream);
				}
			}

			const badge = item.querySelector(".spkmod-cinema-badge");
			if (badge) badge.style.display = isActive ? 'inline-block' : 'none';
		}
		return;
	}

	// Full re-render when tab or playlist length changes
	listEl.dataset.renderedKey = renderedKey;
	listEl.innerHTML = "";

	playlist.forEach((track, i) => {
		const isActive = (i === curIdx);
		const item = document.createElement("div");
		item.className = "spkmod-cinema-list-item";
		item.setAttribute("data-no-drag", "true");
		item.dataset.active = isActive ? 'true' : 'false';
		item.style.cssText = `display:flex;align-items:center;gap:8px;padding:6px 9px;border-radius:8px;cursor:pointer;user-select:none;-webkit-user-select:none;transition:background 0.12s, border-color 0.12s;background:${isActive ? 'rgba(232, 184, 75, 0.18)' : 'rgba(255, 255, 255, 0.04)'};border:1.5px solid ${isActive ? '#e8b84b' : 'rgba(255, 255, 255, 0.08)'};pointer-events:auto;`;

		item.onmouseenter = () => {
			if (item.dataset.active !== 'true') item.style.background = "rgba(232, 184, 75, 0.1)";
		};
		item.onmouseleave = () => {
			if (item.dataset.active !== 'true') item.style.background = "rgba(255, 255, 255, 0.04)";
			hideCinemaThumbPreview();
		};

		item.onpointerdown = e => e.stopPropagation();
		item.onmousedown = e => e.stopPropagation();
		item.onclick = e => {
			e.preventDefault();
			e.stopPropagation();
			hideCinemaThumbPreview();
			if (window.spkmodCinemaAnniversaryLocked) {
				if (typeof chatLog === 'function') chatLog("🎬 Cinema is locked for the Anniversary broadcast!");
				return;
			}
			spkmodPlayCinemaTrackIndex(i);
		};

		const dur = spkmodFormatDuration(track.duration, spkmodCinemaActiveTab === 'songs', track.isOffline || track.isEnded, track.isStream || track.isLiveStream);
		item.innerHTML = `
			<span class="spkmod-cinema-num" style="font-size:11px;font-weight:700;color:${isActive ? '#e8b84b' : '#888'};min-width:18px;pointer-events:none;">#${i + 1}</span>
			<img class="spkmod-cinema-row-thumb" src="${spkmodGetTrackThumbnail(track)}" style="width:44px;height:30px;border-radius:4px;object-fit:cover;border:1px solid rgba(232,184,75,0.3);flex-shrink:0;background:#0d0a14;cursor:pointer;pointer-events:auto;transition:transform 0.12s ease;">
			<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;pointer-events:none;">
				<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
					<span class="spkmod-cinema-title" style="font-size:12px;font-weight:${isActive ? '700' : '600'};color:${isActive ? '#ffc94a' : '#fff'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">
						${track.title || "Untitled Video"}
					</span>
					${track.author ? `<span style="font-size:10px;color:#baa7d1;opacity:0.9;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;">${track.author}</span>` : ''}
				</div>
				<div class="spkmod-cinema-dur-row" style="font-size:10px;color:${isActive ? '#e8b84b' : '#7c6894'};display:flex;align-items:center;gap:6px;">
					<span>${dur}</span>
					<span class="spkmod-cinema-badge" style="display:${isActive ? 'inline-block' : 'none'};background:#e8b84b;color:#120e1a;font-size:9px;font-weight:800;padding:1px 4px;border-radius:3px;">▶ ${getCinemaText("cinemaPlayingBadge")}</span>
				</div>
			</div>
		`;

		const rowThumb = item.querySelector(".spkmod-cinema-row-thumb");
		if (rowThumb) {
			rowThumb.addEventListener("mouseenter", (e) => {
				e.stopPropagation();
				showCinemaThumbPreview(rowThumb);
			});
			rowThumb.addEventListener("mouseleave", (e) => {
				e.stopPropagation();
				hideCinemaThumbPreview();
			});
		}

		listEl.appendChild(item);
	});
}

function spkmodUpdateCinemaTimeDisplay() {
	const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);
	const curIdx = spkmodGetCinemaCurrentTrackIndex();
	const track = list[curIdx];
	if (!track) return;

	let curSec = 0;
	if (spkmodCinemaIsPaused) {
		curSec = Math.floor(window.spkmodCinemaCurrentVideoTimeSec || 0);
	} else if (spkmodCinemaCurrentVideoStartTimeMs > 0) {
		curSec = Math.max(0, Math.floor((Date.now() - spkmodCinemaCurrentVideoStartTimeMs) / 1000));
	} else if (window.spkmodCinemaCurrentVideoTimeSec !== undefined && window.spkmodCinemaCurrentVideoTimeSec > 0) {
		curSec = Math.floor(window.spkmodCinemaCurrentVideoTimeSec);
	}

	const totalDur = (track.duration && track.duration > 0) ? track.duration : (track.baseDuration || 0);
	if (totalDur > 0 && curSec > totalDur) {
		curSec = totalDur;
	}

	const isStream = track.isStream || track.isLiveStream || track.duration === 0;
	const durStr = spkmodFormatDuration(totalDur, spkmodCinemaActiveTab === 'songs', track.isOffline || track.isEnded, isStream);
	const timeText = isStream
		? "🔴 LIVE"
		: `${spkmodFormatDuration(curSec)} / ${durStr}`;

	// 1. Update Cinema Modal subtitle
	if (spkmodCinemaModalEl && !spkmodCinemaModalEl.classList.contains("hidden")) {
		const subEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-sub");
		if (subEl) {
			const mode = (spkmodCinemaManualTrackIndex === null) ? `🔴 ${getCinemaText("cinemaModeSynced")}` : getCinemaText("cinemaModeManual");
			subEl.innerText = getCinemaText("cinemaTrackSub", curIdx + 1, list.length, timeText, mode);
		}
		// Update active row duration in playlist drawer
		const listEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-list");
		if (listEl && listEl.children[curIdx]) {
			const activeItem = listEl.children[curIdx];
			const durSpan = activeItem.querySelector(".spkmod-cinema-dur-row span:first-child");
			if (durSpan) {
				durSpan.innerText = isStream ? "🔴 LIVE" : `${spkmodFormatDuration(curSec)} / ${durStr}`;
			}
		}
	}

	// 2. Update Top HUD Bar
	const hudTime = document.getElementById("spkmod-cinema-hud-time");
	if (hudTime) {
		hudTime.innerText = `(${timeText})`;
	}

	// 3. Update Bottom Floating Dock
	const dockTime = document.getElementById("spkmod-cinema-dock-time");
	if (dockTime) {
		dockTime.innerText = isStream ? "🔴 LIVE" : `(${spkmodFormatDuration(curSec)} / ${durStr})`;
	}
}
window.spkmodUpdateCinemaTimeDisplay = spkmodUpdateCinemaTimeDisplay;

function spkmodUpdateCinemaPlaybackUI() {
	const curIdx = spkmodGetCinemaCurrentTrackIndex();
	const playlist = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
		? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
		: (spkmodCinemaLoadedPlaylist || []);
	const track = playlist[curIdx] || { id: "wn069Hag470", title: "speaki cuayo for an hour!", author: "", duration: 999 };

	window.spkmodCurrentCinemaTitle = track.title || "Monatium Cinema";

	const repText = (spkmodCinemaRepeatMode === "one")
		? getCinemaText("cinemaRepeatOne")
		: (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"));

	// 1. Update Cinema Modal
	if (spkmodCinemaModalEl) {
		const thumb = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-thumb");
		if (thumb) {
			thumb.src = spkmodGetTrackThumbnail(track);
			if (spkmodCinemaThumbPreview && spkmodCinemaThumbPreview.style.display === "block") {
				showCinemaThumbPreview(thumb);
			}
		}
		const titleEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-title");
		if (titleEl) titleEl.innerText = track.title || "Monatium Cinema";
		const authorEl = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-author");
		if (authorEl) {
			authorEl.innerText = track.author || "";
			authorEl.style.display = track.author ? "block" : "none";
		}
		spkmodUpdateCinemaTimeDisplay();
		const syncBtn = spkmodCinemaModalEl.querySelector("#spkmod-cinema-modal-sync-btn");
		if (syncBtn) {
			if (window.spkmodCinemaAnniversaryLocked) {
				syncBtn.style.background = "#4a1212";
				syncBtn.style.color = "#ff9e9e";
				syncBtn.style.borderColor = "#ff4444";
				syncBtn.style.fontWeight = "800";
				syncBtn.style.boxShadow = "0 0 10px rgba(255, 68, 68, 0.4)";
				syncBtn.style.cursor = "not-allowed";
				syncBtn.title = "🔒 Locked for Anniversary Broadcast";
				const syncSpan = syncBtn.querySelector("#spkmod-cinema-sync-label");
				if (syncSpan) {
					syncSpan.innerText = "🔒 Locked";
					syncSpan.style.color = "#ff9e9e";
				}
			} else {
				const isSynced = (spkmodCinemaManualTrackIndex === null);
				syncBtn.style.background = isSynced ? "linear-gradient(135deg, #e53935 0%, #c62828 100%)" : "#261c33";
				syncBtn.style.color = isSynced ? "#ffffff" : "#f5e6b3";
				syncBtn.style.borderColor = isSynced ? "#ff7b7b" : "rgba(232, 184, 75, 0.35)";
				syncBtn.style.fontWeight = isSynced ? "800" : "600";
				syncBtn.style.boxShadow = isSynced ? "0 0 10px rgba(229, 57, 53, 0.55)" : "none";
				syncBtn.style.cursor = "pointer";
				syncBtn.title = getCinemaText("cinemaSyncSchedule");
				const syncSpan = syncBtn.querySelector("#spkmod-cinema-sync-label");
				if (syncSpan) {
					syncSpan.innerText = getCinemaText("cinemaSyncSchedule");
					syncSpan.style.color = isSynced ? "#ffffff" : "#f5e6b3";
				}
			}
		}
		const playBtn = spkmodCinemaModalEl.querySelector("#spkmod-cinema-ctrl-play");
		const pauseBtn = spkmodCinemaModalEl.querySelector("#spkmod-cinema-ctrl-pause");
		if (playBtn && pauseBtn) {
			if (spkmodCinemaIsPaused) {
				playBtn.style.background = "#e8b84b";
				playBtn.style.color = "#120e1a";
				playBtn.style.borderColor = "#e8b84b";
				pauseBtn.style.background = "#3e3052";
				pauseBtn.style.color = "#ffdf79";
				pauseBtn.style.borderColor = "#7c6894";
			} else {
				playBtn.style.background = "#3e3052";
				playBtn.style.color = "#ffdf79";
				playBtn.style.borderColor = "#7c6894";
				pauseBtn.style.background = "#e8b84b";
				pauseBtn.style.color = "#120e1a";
				pauseBtn.style.borderColor = "#e8b84b";
			}
		}
		const modalRepeat = spkmodCinemaModalEl.querySelector("#spkmod-cinema-ctrl-repeat");
		if (modalRepeat) {
			modalRepeat.innerText = (spkmodCinemaRepeatMode === "one" ? "🔂" : "🔁");
			modalRepeat.style.background = (spkmodCinemaRepeatMode !== "off" ? "#e8b84b" : "#3e3052");
			modalRepeat.style.color = (spkmodCinemaRepeatMode !== "off" ? "#120e1a" : "#ffdf79");
			modalRepeat.style.borderColor = (spkmodCinemaRepeatMode !== "off" ? "#e8b84b" : "#7c6894");
			modalRepeat.title = repText;
		}
		spkmodRenderCinemaModalList();
	}

	// 2. Update Fullscreen HUD Bar
	const hudTitle = document.getElementById("spkmod-cinema-hud-title");
	if (hudTitle) {
		if (track.author) {
			hudTitle.innerHTML = `${track.title} <span style="font-weight:normal;color:#baa7d1;font-size:11px;">(${track.author})</span>`;
		} else {
			hudTitle.innerText = track.title || "Monatium Cinema";
		}
	}
	const hudPlayBtn = document.getElementById("spkmod-cinema-hud-play-btn");
	if (hudPlayBtn) hudPlayBtn.innerText = spkmodCinemaIsPaused ? "▶️" : "⏸️";
	const hudRepeatBtn = document.getElementById("spkmod-cinema-hud-repeat-btn");
	if (hudRepeatBtn) {
		hudRepeatBtn.innerText = (spkmodCinemaRepeatMode === "one" ? "🔂" : "🔁");
		hudRepeatBtn.style.color = (spkmodCinemaRepeatMode !== "off" ? "#ffc94a" : "#7c6894");
		hudRepeatBtn.title = repText;
	}

	// 3. Update Floating Dock
	const dockPlayBtn = document.getElementById("spkmod-cinema-dock-play-btn");
	if (dockPlayBtn) dockPlayBtn.innerText = spkmodCinemaIsPaused ? "▶️" : "⏸️";
	const dockRepeatBtn = document.getElementById("spkmod-cinema-dock-repeat-btn");
	if (dockRepeatBtn) {
		dockRepeatBtn.innerText = (spkmodCinemaRepeatMode === "one" ? "🔂" : "🔁");
		dockRepeatBtn.style.color = (spkmodCinemaRepeatMode !== "off" ? "#e8b84b" : "#66557a");
		dockRepeatBtn.title = repText;
	}

	if (typeof spkmodSyncCinemaVolumeUI === "function") {
		spkmodSyncCinemaVolumeUI();
	}
	if (typeof spkmodSyncCinemaOcclusionUI === "function") {
		spkmodSyncCinemaOcclusionUI();
	}
}
window.spkmodUpdateCinemaPlaybackUI = spkmodUpdateCinemaPlaybackUI;

function spkmodBuildCinemaModal() {
	if (spkmodCinemaModalEl) return spkmodCinemaModalEl;

	let initLeft = Math.max(10, Math.round(window.innerWidth / 2 - 190));
	let initTop = Math.max(10, Math.round(window.innerHeight / 2 - 240));
	try {
		const raw = localStorage.getItem("spkmod-pos-spkmod-cinema-modal");
		if (raw) {
			const p = JSON.parse(raw);
			const l = parseFloat(p.left);
			const t = parseFloat(p.top);
			if (!isNaN(l) && !isNaN(t)) {
				initLeft = Math.min(Math.max(10, l), window.innerWidth - 80);
				initTop = Math.min(Math.max(10, t), window.innerHeight - 80);
			}
		}
	} catch (_) {}

	const modal = document.createElement("div");
	modal.id = "spkmod-cinema-modal";
	modal.className = "spkmod-panel hidden";
	modal.style.cssText = `position: fixed; left: ${initLeft}px; top: ${initTop}px; width: 380px; max-width: 95vw; max-height: 85vh; background: linear-gradient(180deg, #251b33 0%, #15101f 100%); border: 2px solid #e8b84b; border-radius: 16px; box-shadow: 0 12px 36px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.12); font-family: Pretendard, system-ui, -apple-system, sans-serif; color: #fff; z-index: 2147483600; padding: 14px 16px; box-sizing: border-box; user-select: none; display: flex; flex-direction: column; gap: 10px; overflow: hidden;`;

	const isMuted = !!window.spkmodCinemaConfig?.muted;
	const vol = window.spkmodCinemaConfig?.volume ?? 80;

	modal.innerHTML = `
		<style>
			#spkmod-cinema-modal button:hover { filter: brightness(1.18); }
		</style>
		<div id="spkmod-cinema-modal-header" style="display:flex;justify-content:space-between;align-items:center;cursor:move;border-bottom:1px solid rgba(232,184,75,0.3);padding-bottom:8px;">
			<div style="display:flex;align-items:center;gap:6px;font-weight:700;font-size:14px;color:#ffc94a;">
				<span style="font-size:16px;">🎬</span> <span id="spkmod-cinema-modal-header-title">${getCinemaText("cinemaPlaylistTitle")}</span>
			</div>
			<div style="display:flex;align-items:center;gap:5px;">
				<button id="spkmod-cinema-modal-sync-btn" title="${getCinemaText("cinemaSyncSchedule")}" style="background:${spkmodCinemaManualTrackIndex === null ? 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' : '#261c33'};color:${spkmodCinemaManualTrackIndex === null ? '#ffffff' : '#f5e6b3'};border:1.5px solid ${spkmodCinemaManualTrackIndex === null ? '#ff7b7b' : 'rgba(232, 184, 75, 0.35)'};border-radius:6px;cursor:pointer;padding:2px 8px;font-size:11px;font-weight:${spkmodCinemaManualTrackIndex === null ? '800' : '600'};box-shadow:${spkmodCinemaManualTrackIndex === null ? '0 0 10px rgba(229, 57, 53, 0.55)' : 'none'};transition:all 0.15s ease;">🔴 <span id="spkmod-cinema-sync-label" style="color:inherit;">${getCinemaText("cinemaSyncSchedule")}</span></button>
				<button id="spkmod-cinema-modal-occlusion-btn" title="${getCinemaText("cinemaOcclusionToggle")}" style="background:${spkmodCinemaConfig.occlusion ? '#4a3b68' : '#261c33'};color:${spkmodCinemaConfig.occlusion ? '#ffdf79' : '#887c9e'};border:1px solid ${spkmodCinemaConfig.occlusion ? '#e8b84b' : '#7c6894'};border-radius:6px;cursor:pointer;padding:2px 6px;font-size:11px;transition:all 0.15s ease;">👥</button>
				<button id="spkmod-cinema-modal-reload-btn" title="${getCinemaText("cinemaReloadPlaylist")}" style="background:#3e3052;color:#ffdf79;border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:2px 6px;font-size:11px;transition:all 0.15s ease;">🔄</button>
				<button id="spkmod-cinema-modal-close-btn" title="Close" style="background:transparent;border:none;color:#aaa;cursor:pointer;font-size:16px;line-height:1;padding:0 3px;">✕</button>
			</div>
		</div>

		<div id="spkmod-cinema-modal-tabs" style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
			<button id="spkmod-cinema-tab-movies" style="flex:1;padding:6px 10px;font-size:12px;font-weight:${spkmodCinemaActiveTab === 'movies' ? '800' : '700'};border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;border:1.5px solid ${spkmodCinemaActiveTab === 'movies' ? '#ffe28a' : 'rgba(232, 184, 75, 0.35)'};background:${spkmodCinemaActiveTab === 'movies' ? 'linear-gradient(135deg, #ffd56b 0%, #e8b84b 100%)' : '#261c33'};color:${spkmodCinemaActiveTab === 'movies' ? '#120e1a' : '#f5e6b3'};box-shadow:${spkmodCinemaActiveTab === 'movies' ? '0 2px 8px rgba(232, 184, 75, 0.45)' : 'none'};transition:all 0.15s ease;">
				🎬 <span id="spkmod-cinema-tab-movies-label" style="color:inherit;">${getCinemaText("cinemaTabMovies")}</span>
			</button>
			<button id="spkmod-cinema-tab-songs" style="flex:1;padding:6px 10px;font-size:12px;font-weight:${spkmodCinemaActiveTab === 'songs' ? '800' : '700'};border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;border:1.5px solid ${spkmodCinemaActiveTab === 'songs' ? '#ffe28a' : 'rgba(232, 184, 75, 0.35)'};background:${spkmodCinemaActiveTab === 'songs' ? 'linear-gradient(135deg, #ffd56b 0%, #e8b84b 100%)' : '#261c33'};color:${spkmodCinemaActiveTab === 'songs' ? '#120e1a' : '#f5e6b3'};box-shadow:${spkmodCinemaActiveTab === 'songs' ? '0 2px 8px rgba(232, 184, 75, 0.45)' : 'none'};transition:all 0.15s ease;">
				🎵 <span id="spkmod-cinema-tab-songs-label" style="color:inherit;">${getCinemaText("cinemaTabSongs")}</span>
			</button>
		</div>

		<div id="spkmod-cinema-modal-now-card" style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.38);padding:9px 11px;border-radius:10px;border:1px solid rgba(232,184,75,0.25);cursor:move;flex-shrink:0;">
			<img id="spkmod-cinema-modal-thumb" src="" style="width:58px;height:42px;border-radius:6px;object-fit:cover;border:1px solid rgba(232,184,75,0.4);background:#100d16;flex-shrink:0;cursor:pointer;pointer-events:auto;transition:transform 0.12s ease;">
			<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;justify-content:center;">
				<div id="spkmod-cinema-modal-title" style="font-size:13px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.2;">-</div>
				<div id="spkmod-cinema-modal-author" style="font-size:11px;color:#baa7d1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:none;"></div>
				<div id="spkmod-cinema-modal-sub" style="font-size:11px;color:#e8b84b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">-</div>
			</div>
		</div>

		<div id="spkmod-cinema-modal-controls" style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.25);padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);flex-shrink:0;">
			<div style="display:flex;align-items:center;gap:6px;">
				<button id="spkmod-cinema-ctrl-prev" title="${getCinemaText("cinemaPrev")}" style="background:#3e3052;color:#ffdf79;border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:4px 9px;font-size:13px;transition:all 0.15s ease;">⏮️</button>
				<button id="spkmod-cinema-ctrl-play" title="${getCinemaText("cinemaPlay")}" style="background:#e8b84b;color:#120e1a;border:1.5px solid #e8b84b;border-radius:6px;cursor:pointer;padding:4px 10px;font-size:13px;font-weight:bold;transition:all 0.15s ease;">▶️</button>
				<button id="spkmod-cinema-ctrl-pause" title="${getCinemaText("cinemaPause")}" style="background:#3e3052;color:#ffdf79;border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:4px 10px;font-size:13px;font-weight:bold;transition:all 0.15s ease;">⏸️</button>
				<button id="spkmod-cinema-ctrl-next" title="${getCinemaText("cinemaNext")}" style="background:#3e3052;color:#ffdf79;border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:4px 9px;font-size:13px;transition:all 0.15s ease;">⏭️</button>
				<button id="spkmod-cinema-ctrl-repeat" title="${(spkmodCinemaRepeatMode === "one") ? getCinemaText("cinemaRepeatOne") : (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"))}" style="background:#3e3052;color:#ffdf79;border:1px solid #7c6894;border-radius:6px;cursor:pointer;padding:4px 9px;font-size:13px;transition:all 0.15s ease;">🔁</button>
			</div>
			<div style="display:flex;align-items:center;gap:6px;">
				<button id="spkmod-cinema-modal-mute-btn" title="${isMuted ? getCinemaText("cinemaUnmute") : getCinemaText("cinemaMute")}" style="background:none;border:none;color:#e8b84b;font-size:15px;cursor:pointer;padding:2px 3px;">${isMuted || vol === 0 ? "🔇" : "🔊"}</button>
				<input id="spkmod-cinema-modal-vol-slider" type="range" min="0" max="100" value="${vol}" style="width:65px;height:5px;accent-color:#e8b84b;cursor:pointer;">
				<span id="spkmod-cinema-modal-vol-label" style="font-size:11px;font-weight:bold;color:#e8b84b;min-width:26px;text-align:right;">${isMuted ? "0%" : vol + "%"}</span>
			</div>
		</div>

		<div style="display:flex;justify-content:space-between;align-items:center;padding:0 2px;font-size:11px;color:#aaa;">
			<span id="spkmod-cinema-modal-count-label">Videos (${spkmodCinemaLoadedPlaylist.length})</span>
			<span id="spkmod-cinema-modal-hint-label" style="font-size:10px;color:#7c6894;">${getCinemaText("cinemaClickToPlay")}</span>
		</div>

		<div id="spkmod-cinema-modal-list" style="flex:1;min-height:160px;max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px;">
		</div>
	`;

	document.body.appendChild(modal);
	spkmodCinemaModalEl = modal;
	if (typeof lunHudElements !== "undefined") {
		lunHudElements.cinemaModal = modal;
	}

	const header = modal.querySelector("#spkmod-cinema-modal-header");
	const nowCard = modal.querySelector("#spkmod-cinema-modal-now-card");
	const listEl = modal.querySelector("#spkmod-cinema-modal-list");
	if (listEl) {
		listEl.setAttribute("data-no-drag", "true");
		listEl.onpointerdown = e => e.stopPropagation();
		listEl.onmousedown = e => e.stopPropagation();
		listEl.addEventListener("wheel", e => e.stopPropagation(), { passive: true });
		listEl.addEventListener("touchmove", e => e.stopPropagation(), { passive: true });
		listEl.addEventListener("scroll", hideCinemaThumbPreview, { passive: true });
	}

	const scrollDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 33 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY));
	modal.addEventListener("wheel", e => {
		e.stopPropagation();
		if (listEl && e.target !== listEl && !listEl.contains(e.target)) {
			listEl.scrollTop += scrollDelta(e);
		}
	}, { passive: true });
	modal.addEventListener("touchmove", e => e.stopPropagation(), { passive: true });
	modal.addEventListener("mouseenter", () => {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
	});

	modal.addEventListener("pointerdown", e => {
		if (header && nowCard && !header.contains(e.target) && !nowCard.contains(e.target)) {
			e.stopPropagation();
		}
	});
	modal.addEventListener("mousedown", e => {
		if (header && nowCard && !header.contains(e.target) && !nowCard.contains(e.target)) {
			e.stopPropagation();
		}
	});

	if (typeof makeDraggable === "function") {
		makeDraggable(modal, [header, nowCard]);
	}

	modal.querySelector("#spkmod-cinema-modal-close-btn").onclick = () => window.spkmodToggleCinemaModal(false);
	modal.querySelector("#spkmod-cinema-tab-movies").onclick = () => spkmodSwitchCinemaTab("movies");
	modal.querySelector("#spkmod-cinema-tab-songs").onclick = () => spkmodSwitchCinemaTab("songs");
	modal.querySelector("#spkmod-cinema-ctrl-prev").onclick = () => window.spkmodCinemaPrev();
	modal.querySelector("#spkmod-cinema-ctrl-play").onclick = () => window.spkmodCinemaPlay();
	modal.querySelector("#spkmod-cinema-ctrl-pause").onclick = () => window.spkmodCinemaPause();
	modal.querySelector("#spkmod-cinema-ctrl-next").onclick = () => window.spkmodCinemaNext();
	modal.querySelector("#spkmod-cinema-ctrl-repeat").onclick = () => window.spkmodCinemaToggleRepeat();
	modal.querySelector("#spkmod-cinema-modal-sync-btn").onclick = () => window.spkmodCinemaSyncSchedule();
	const occBtn = modal.querySelector("#spkmod-cinema-modal-occlusion-btn");
	if (occBtn) occBtn.onclick = () => window.spkmodToggleCinemaOcclusion();
	modal.querySelector("#spkmod-cinema-modal-mute-btn").onclick = () => window.spkmodToggleCinemaMute();

	const volSlider = modal.querySelector("#spkmod-cinema-modal-vol-slider");
	volSlider.oninput = e => {
		const val = parseInt(e.target.value, 10) || 0;
		window.spkmodSetCinemaVolume(val, val === 0 ? true : false);
	};

	modal.querySelector("#spkmod-cinema-modal-reload-btn").onclick = () => {
		Promise.all([spkmodLoadMoviesPlaylist(), spkmodLoadSongsPlaylist()]).then(() => {
			spkmodRenderCinemaModalList();
			spkmodUpdateCinemaPlaybackUI();
		});
	};

	const mainThumb = modal.querySelector("#spkmod-cinema-modal-thumb");
	if (mainThumb) {
		mainThumb.addEventListener("mouseenter", () => showCinemaThumbPreview(mainThumb));
		mainThumb.addEventListener("mouseleave", hideCinemaThumbPreview);
	}

	modal.addEventListener("mouseleave", hideCinemaThumbPreview);

	spkmodRenderCinemaModalList();
	spkmodUpdateCinemaPlaybackUI();

	return modal;
}

window.spkmodToggleCinemaModal = function(forceState) {
	const modal = spkmodBuildCinemaModal();
	if (!modal) return;
	const isCurrentlyHidden = modal.classList.contains("hidden");
	const shouldShow = (forceState !== undefined) ? !!forceState : isCurrentlyHidden;

	if (shouldShow) {
		modal.classList.remove("hidden");
		spkmodCinemaModalOpen = true;
		spkmodCinemaModalWasOpenBeforeLeaving = true;
		if (typeof positionModalNicely === "function") {
			positionModalNicely(modal);
		}
		spkmodRenderCinemaModalList();
		spkmodUpdateCinemaPlaybackUI();
	} else {
		modal.classList.add("hidden");
		spkmodCinemaModalOpen = false;
		if (forceState === false) {
			spkmodCinemaModalWasOpenBeforeLeaving = false;
		}
		hideCinemaThumbPreview();
	}
};
window.spkmodOpenCinemaModal = () => window.spkmodToggleCinemaModal(true);

// ============================================================================
// CINEMA MODE FLOATING PILL & VOLUME DOCK (NEAR THEATER TRIGGER)
// ============================================================================
let spkmodCinemaPillEl = null;

function spkmodUpdateCinemaFloatingPill(visible, dist) {
    if (!visible) {
        if (spkmodCinemaPillEl) spkmodCinemaPillEl.style.display = "none";
        return;
    }
    const getCinemaText = (key, fallback) => {
        if (typeof window.spkmodGetCinemaText === "function") return window.spkmodGetCinemaText(key);
        return typeof t === "function" ? t(key) : (fallback || key);
    };
    if (!spkmodCinemaPillEl) {
        const isMobile = (typeof window.speakiMobile !== "undefined") ||
            (typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent)) ||
            (window.innerWidth <= 800);

        let initLeft = isMobile ? Math.max(10, window.innerWidth - 300) : Math.max(10, window.innerWidth - 440);
        let initTop = isMobile ? Math.max(10, window.innerHeight - 50) : Math.max(10, window.innerHeight - 84);
        try {
            const raw = localStorage.getItem("spkmod-pos-spkmod-cinema-dock");
            if (raw) {
                const p = JSON.parse(raw);
                const l = parseFloat(p.left);
                const t = parseFloat(p.top);
                if (!isNaN(l) && !isNaN(t)) {
                    initLeft = Math.min(Math.max(0, l), window.innerWidth - 60);
                    initTop = Math.min(Math.max(0, t), window.innerHeight - 40);
                }
            }
        } catch (_) {}

        const dock = document.createElement("div");
        dock.id = "spkmod-cinema-dock";
        dock.className = "spkmod-floating-btn";
        dock.style.cssText = `position: fixed; left: ${initLeft}px; top: ${initTop}px; z-index: 2147483640; padding: ${isMobile ? '2px 8px' : '5px 12px'}; font-size: ${isMobile ? 11 : 13}px; font-weight: bold; background: rgba(26, 20, 36, 0.94); color: #e8b84b; border: 1.5px solid #e8b84b; border-radius: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.55); display: flex; align-items: center; gap: ${isMobile ? 4 : 8}px; backdrop-filter: blur(8px); user-select: none; -webkit-user-select: none; touch-action: none; cursor: default; white-space: nowrap; max-width: calc(100vw - 16px);`;

        // Prevent native HTML5 text selection & drag-and-drop ghosting
        dock.ondragstart = (e) => { e.preventDefault(); return false; };
        dock.addEventListener("dragstart", (e) => e.preventDefault());
        dock.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
        dock.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: true });

        // 0. Dedicated Drag Anchor Handle
        const anchorBtn = document.createElement("span");
        anchorBtn.id = "spkmod-cinema-dock-anchor";
        anchorBtn.innerText = "⚓";
        anchorBtn.title = (typeof t === "function" ? t("dragMenuTooltip") : "Drag to move") || "Drag to move";
        anchorBtn.style.cssText = `font-size: ${isMobile ? 12 : 14}px; cursor: grab; display: inline-flex; align-items: center; justify-content: center; padding: 1px 2px; user-select: none; -webkit-user-select: none; line-height: 1; transition: transform 0.12s ease; flex-shrink: 0;`;
        anchorBtn.onmouseenter = () => { anchorBtn.style.transform = "scale(1.2)"; };
        anchorBtn.onmouseleave = () => { anchorBtn.style.transform = "scale(1)"; };
        anchorBtn.ondragstart = (e) => { e.preventDefault(); return false; };
        dock.appendChild(anchorBtn);

        // 1. Cinema Mode Label / Button (Clickable to enter cinema)
        const modeBtn = document.createElement("span");
        modeBtn.id = "spkmod-cinema-mode-btn";
        modeBtn.style.cssText = `color: #e8b84b; font-size: ${isMobile ? 11 : 13}px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 1px 3px; transition: transform 0.12s ease; user-select: none; -webkit-user-select: none; white-space: nowrap;`;
        modeBtn.onmouseenter = () => { modeBtn.style.transform = "scale(1.04)"; };
        modeBtn.onmouseleave = () => { modeBtn.style.transform = "scale(1)"; };
        modeBtn.ondragstart = (e) => { e.preventDefault(); return false; };
        modeBtn.innerHTML = isMobile ? "🎬 Cinema" : (getCinemaText("cinemaModeBtn") || "🎬 Monatium Cinema");
        dock.appendChild(modeBtn);

        const dockTime = document.createElement("span");
        dockTime.id = "spkmod-cinema-dock-time";
        dockTime.style.cssText = `color: #ffc94a; font-size: ${isMobile ? 10 : 11}px; font-variant-numeric: tabular-nums; opacity: 0.9; margin: 0 1px;`;
        dock.appendChild(dockTime);

        // 2. Playlist Modal Button
        const plBtn = document.createElement("button");
        plBtn.id = "spkmod-cinema-dock-pl-btn";
        plBtn.title = getCinemaText("cinemaPlaylistTitle", "Monatium Cinema Playlist");
        plBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 11 : 13}px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: ${isMobile ? '1px 2px' : '2px 3px'}; transition: transform 0.12s ease;`;
        plBtn.innerText = "📋";
        plBtn.onmouseenter = () => { plBtn.style.transform = "scale(1.15)"; };
        plBtn.onmouseleave = () => { plBtn.style.transform = "scale(1)"; };
        plBtn.onpointerdown = e => e.stopPropagation();
        plBtn.onmousedown = e => e.stopPropagation();
        plBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodToggleCinemaModal === "function") {
                window.spkmodToggleCinemaModal();
            }
        };
        dock.appendChild(plBtn);

        // 3. Playback Controls (Back, Play/Pause, Next, Repeat)
        const prevBtn = document.createElement("button");
        prevBtn.id = "spkmod-cinema-dock-prev-btn";
        prevBtn.title = getCinemaText("cinemaPrev", "Back");
        prevBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 11 : 12}px; cursor: pointer; padding: ${isMobile ? '1px 2px' : '2px 3px'}; transition: transform 0.12s ease;`;
        prevBtn.innerText = "⏮️";
        prevBtn.onmouseenter = () => { prevBtn.style.transform = "scale(1.2)"; };
        prevBtn.onmouseleave = () => { prevBtn.style.transform = "scale(1)"; };
        prevBtn.onpointerdown = e => e.stopPropagation();
        prevBtn.onmousedown = e => e.stopPropagation();
        prevBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodCinemaPrev === "function") window.spkmodCinemaPrev();
        };
        dock.appendChild(prevBtn);

        const playBtn = document.createElement("button");
        playBtn.id = "spkmod-cinema-dock-play-btn";
        playBtn.title = "Play / Pause";
        playBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 11 : 13}px; cursor: pointer; padding: ${isMobile ? '1px 2px' : '2px 3px'}; transition: transform 0.12s ease;`;
        playBtn.innerText = (window.spkmodCinemaIsPaused ? "▶️" : "⏸️");
        playBtn.onmouseenter = () => { playBtn.style.transform = "scale(1.2)"; };
        playBtn.onmouseleave = () => { playBtn.style.transform = "scale(1)"; };
        playBtn.onpointerdown = e => e.stopPropagation();
        playBtn.onmousedown = e => e.stopPropagation();
        playBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodCinemaTogglePlayPause === "function") window.spkmodCinemaTogglePlayPause();
        };
        dock.appendChild(playBtn);

        const nextBtn = document.createElement("button");
        nextBtn.id = "spkmod-cinema-dock-next-btn";
        nextBtn.title = getCinemaText("cinemaNext", "Next");
        nextBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 11 : 12}px; cursor: pointer; padding: ${isMobile ? '1px 2px' : '2px 3px'}; transition: transform 0.12s ease;`;
        nextBtn.innerText = "⏭️";
        nextBtn.onmouseenter = () => { nextBtn.style.transform = "scale(1.2)"; };
        nextBtn.onmouseleave = () => { nextBtn.style.transform = "scale(1)"; };
        nextBtn.onpointerdown = e => e.stopPropagation();
        nextBtn.onmousedown = e => e.stopPropagation();
        nextBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodCinemaNext === "function") window.spkmodCinemaNext();
        };
        dock.appendChild(nextBtn);

        const repeatBtn = document.createElement("button");
        repeatBtn.id = "spkmod-cinema-dock-repeat-btn";
        repeatBtn.title = getCinemaText("cinemaRepeat", "Repeat");
        repeatBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 11 : 12}px; cursor: pointer; padding: ${isMobile ? '1px 2px' : '2px 3px'}; transition: transform 0.12s ease;`;
        repeatBtn.innerText = (window.spkmodCinemaRepeatMode === "one" ? "🔂" : "🔁");
        repeatBtn.onmouseenter = () => { repeatBtn.style.transform = "scale(1.2)"; };
        repeatBtn.onmouseleave = () => { repeatBtn.style.transform = "scale(1)"; };
        repeatBtn.onpointerdown = e => e.stopPropagation();
        repeatBtn.onmousedown = e => e.stopPropagation();
        repeatBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodCinemaToggleRepeat === "function") window.spkmodCinemaToggleRepeat();
        };
        dock.appendChild(repeatBtn);

        // 4. Vertical Divider
        const sep = document.createElement("div");
        sep.style.cssText = `width: 1px; height: ${isMobile ? 12 : 16}px; background: rgba(232, 184, 75, 0.35); flex-shrink: 0;`;
        dock.appendChild(sep);

        // 5. Mute / Unmute Button
        const muteBtn = document.createElement("button");
        muteBtn.id = "spkmod-cinema-mute-btn";
        muteBtn.style.cssText = `background: none; border: none; color: #e8b84b; font-size: ${isMobile ? 12 : 14}px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: ${isMobile ? '1px 2px' : '2px 4px'}; transition: transform 0.12s ease; flex-shrink: 0;`;
        muteBtn.onmouseenter = () => { muteBtn.style.transform = "scale(1.2)"; };
        muteBtn.onmouseleave = () => { muteBtn.style.transform = "scale(1)"; };
        muteBtn.onpointerdown = e => e.stopPropagation();
        muteBtn.onmousedown = e => e.stopPropagation();
        muteBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.spkmodToggleCinemaMute === "function") {
                window.spkmodToggleCinemaMute();
            }
        };
        dock.appendChild(muteBtn);

        // 6. Volume Slider
        const volSlider = document.createElement("input");
        volSlider.id = "spkmod-cinema-vol-slider";
        volSlider.type = "range";
        volSlider.min = "0";
        volSlider.max = "100";
        volSlider.value = String(window.spkmodCinemaConfig?.volume ?? 80);
        volSlider.style.cssText = `width: ${isMobile ? 38 : 70}px; height: 5px; accent-color: #e8b84b; cursor: pointer; border-radius: 3px; outline: none; flex-shrink: 0;`;
        volSlider.onpointerdown = e => e.stopPropagation();
        volSlider.onmousedown = e => e.stopPropagation();
        volSlider.onclick = e => e.stopPropagation();
        volSlider.oninput = e => {
            e.stopPropagation();
            const val = parseInt(e.target.value, 10) || 0;
            if (typeof window.spkmodSetCinemaVolume === "function") {
                window.spkmodSetCinemaVolume(val, val === 0 ? true : false);
            }
        };
        dock.appendChild(volSlider);

        // 7. Volume % Label
        const volLabel = document.createElement("span");
        volLabel.id = "spkmod-cinema-vol-label";
        volLabel.style.cssText = `font-size: ${isMobile ? 10 : 11}px; font-weight: bold; color: #e8b84b; min-width: ${isMobile ? 22 : 28}px; text-align: right; flex-shrink: 0;`;
        dock.appendChild(volLabel);

        // Dedicated robust dragging & click distinction for the dock
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;
        let dragMoved = false;

        function onPointerMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 2) {
                dragMoved = true;
            }
            if (dragMoved) {
                const newLeft = Math.max(0, Math.min(window.innerWidth - dock.offsetWidth, initialLeft + dx));
                const newTop = Math.max(0, Math.min(window.innerHeight - dock.offsetHeight, initialTop + dy));
                dock.style.left = Math.round(newLeft) + "px";
                dock.style.top = Math.round(newTop) + "px";
                dock.style.right = "auto";
                dock.style.bottom = "auto";
            }
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            isDragging = false;
            anchorBtn.style.cursor = "grab";
            document.body.style.cursor = "";

            window.removeEventListener("pointermove", onPointerMove, { passive: false });
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            window.removeEventListener("mousemove", onPointerMove, { passive: false });
            window.removeEventListener("mouseup", onPointerUp);

            if (e && e.pointerId && dock.releasePointerCapture) {
                try { dock.releasePointerCapture(e.pointerId); } catch (_) {}
            }

            if (dragMoved) {
                try {
                    localStorage.setItem("spkmod-pos-spkmod-cinema-dock", JSON.stringify({
                        left: dock.style.left,
                        top: dock.style.top
                    }));
                } catch (_) {}
            } else {
                if (e && e.target && (e.target === modeBtn || modeBtn.contains(e.target))) {
                    if (typeof window.spkmodToggleCinemaMode === "function") {
                        window.spkmodToggleCinemaMode(true);
                    }
                }
            }
        }

        function onPointerDown(e) {
            if (e.target.closest('#spkmod-cinema-dock-pl-btn, #spkmod-cinema-dock-prev-btn, #spkmod-cinema-dock-play-btn, #spkmod-cinema-dock-next-btn, #spkmod-cinema-dock-repeat-btn, #spkmod-cinema-mute-btn, #spkmod-cinema-vol-slider')) {
                return;
            }
            if (e.button !== undefined && e.button !== 0) return;

            e.preventDefault();
            isDragging = true;
            dragMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = dock.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            anchorBtn.style.cursor = "grabbing";
            document.body.style.cursor = "grabbing";

            if (e.pointerId && dock.setPointerCapture) {
                try { dock.setPointerCapture(e.pointerId); } catch (_) {}
            }

            window.addEventListener("pointermove", onPointerMove, { passive: false });
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);
            window.addEventListener("mousemove", onPointerMove, { passive: false });
            window.addEventListener("mouseup", onPointerUp);
        }

        dock.addEventListener("pointerdown", onPointerDown);
        dock.addEventListener("mousedown", onPointerDown);

        document.body.appendChild(dock);
        spkmodCinemaPillEl = dock;
    }

    const modeBtn = document.getElementById("spkmod-cinema-mode-btn");
    if (modeBtn) {
        const btnText = getCinemaText("cinemaModeBtn", "🎬 Monatium Cinema");
        modeBtn.innerText = btnText;
    }

    if (typeof window.spkmodSyncCinemaVolumeUI === "function") {
        window.spkmodSyncCinemaVolumeUI();
    }

    spkmodCinemaPillEl.style.display = "flex";
}

window.spkmodUpdateCinemaFloatingPill = spkmodUpdateCinemaFloatingPill;



function spkmodUpdateCinemaSpatialAudio() {
	if (!spkmodCinemaConfig.enabled || !spkmodCinemaIframe) return;

	const curZone = spkmodGetExactCinemaZone();
	if (curZone !== 1 || (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame())) {
		if (spkmodCinemaLastVolume !== 0) {
			spkmodCinemaLastVolume = 0;
			spkmodSendYtCommand('setVolume', [0]);
			spkmodSendYtCommand('mute');
		}
		spkmodCinemaTopBarDismissed = false;
		spkmodUpdateCinemaTopBar(false);
		if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
			window.spkmodUpdateCinemaFloatingPill(false);
		} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
			spkmodUpdateCinemaFloatingPill(false);
		}
		return;
	}

	const playerPos = (typeof gameState !== 'undefined' && gameState?.playerContainer?.position)
		? gameState.playerContainer.position
		: null;

	if (!playerPos) return;

	const inSeats = spkmodIsPlayerInCinemaSeats(playerPos);
	if (!inSeats) {
		if (spkmodCinemaLastVolume !== 0) {
			spkmodCinemaLastVolume = 0;
			spkmodSendYtCommand('setVolume', [0]);
			spkmodSendYtCommand('mute');
		}
		spkmodCinemaTopBarDismissed = false;
		spkmodUpdateCinemaTopBar(false);
		if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
			window.spkmodUpdateCinemaFloatingPill(false);
		} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
			spkmodUpdateCinemaFloatingPill(false);
		}
		return;
	}

	const targetVol = spkmodCinemaConfig.muted ? 0 : spkmodCinemaConfig.volume;
	if (targetVol !== spkmodCinemaLastVolume) {
		spkmodCinemaLastVolume = targetVol;
		if (targetVol > 0) {
			spkmodSendYtCommand('unMute');
			spkmodSendYtCommand('setVolume', [targetVol]);
		} else {
			spkmodSendYtCommand('setVolume', [0]);
			spkmodSendYtCommand('mute');
		}
	}

	const dist = Math.hypot(playerPos.x - spkmodCinemaConfig.pos.x, playerPos.z - spkmodCinemaConfig.pos.z);
	if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
		window.spkmodUpdateCinemaFloatingPill(true, dist);
	} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
		spkmodUpdateCinemaFloatingPill(true, dist);
	}
}

function spkmodCinemaTick() {
	const curZone = spkmodGetExactCinemaZone();
	if (curZone !== 1 || (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame())) {
		if (typeof spkmodFwStop === 'function' && typeof spkmodFw !== 'undefined' && spkmodFw) {
			spkmodFwStop();
		}
		if (spkmodCinemaContainer && spkmodCinemaContainer.style.display !== 'none') {
			spkmodCinemaContainer.style.display = 'none';
		}
		if (spkmodCinemaOcclusionCanvas && spkmodCinemaOcclusionCanvas.style.display !== 'none') {
			spkmodCinemaOcclusionCanvas.style.display = 'none';
		}
		if (spkmodCinemaFrameMesh && spkmodCinemaFrameMesh.visible) {
			spkmodCinemaFrameMesh.visible = false;
		}
		spkmodCinemaTopBarDismissed = false;
		spkmodUpdateCinemaTopBar(false);
		if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
			window.spkmodUpdateCinemaFloatingPill(false);
		} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
			spkmodUpdateCinemaFloatingPill(false);
		}
		if (spkmodCinemaInZone) {
			spkmodCinemaInZone = false;
			spkmodCinemaLeftZoneTimeMs = Date.now();
			spkmodSendYtCommand('pauseVideo');
			spkmodSendYtCommand('mute');
			spkmodSendYtCommand('setVolume', [0]);
			spkmodCinemaLastVolume = 0;
			if (typeof window.spkmodSuppressGameBgm === 'function') {
				window.spkmodSuppressGameBgm(false, "cinema");
			}
			if (spkmodCinemaModeActive && typeof window.spkmodToggleCinemaMode === 'function') {
				window.spkmodToggleCinemaMode(false);
			}
			if (spkmodCinemaModalEl && !spkmodCinemaModalEl.classList.contains('hidden')) {
				spkmodCinemaModalWasOpenBeforeLeaving = true;
				spkmodCinemaModalEl.classList.add('hidden');
				spkmodCinemaModalOpen = false;
			}
		}
		if (spkmodHasActiveCinemaMedia()) {
			spkmodUnloadCinemaMedia();
		}
		return;
	}

	const playerPos = (typeof gameState !== 'undefined' && gameState?.playerContainer?.position)
		? gameState.playerContainer.position
		: null;

	const inSeats = spkmodIsPlayerInCinemaSeats(playerPos);
	const shouldBeActive = spkmodCinemaConfig.enabled && inSeats;

	if (!shouldBeActive) {
		spkmodCinemaTopBarDismissed = false;
		spkmodUpdateCinemaTopBar(false);
		if (spkmodCinemaOcclusionCanvas && spkmodCinemaOcclusionCanvas.style.display !== 'none') {
			spkmodCinemaOcclusionCanvas.style.display = 'none';
		}
		if (spkmodCinemaInZone) {
			spkmodCinemaInZone = false;
			spkmodCinemaLeftZoneTimeMs = Date.now();
			if (spkmodCinemaContainer) spkmodCinemaContainer.style.display = 'none';
			if (spkmodCinemaFrameMesh) spkmodCinemaFrameMesh.visible = false;
			spkmodSendYtCommand('pauseVideo');
			spkmodSendYtCommand('mute');
			spkmodSendYtCommand('setVolume', [0]);
			spkmodCinemaLastVolume = 0;
			if (typeof window.spkmodSuppressGameBgm === 'function') {
				window.spkmodSuppressGameBgm(false, "cinema");
			}
			if (spkmodCinemaModeActive && typeof window.spkmodToggleCinemaMode === 'function') {
				window.spkmodToggleCinemaMode(false);
			}
			if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
				window.spkmodUpdateCinemaFloatingPill(false);
			} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
				spkmodUpdateCinemaFloatingPill(false);
			}
			if (spkmodCinemaModalEl && !spkmodCinemaModalEl.classList.contains('hidden')) {
				spkmodCinemaModalWasOpenBeforeLeaving = true;
				spkmodCinemaModalEl.classList.add('hidden');
				spkmodCinemaModalOpen = false;
			}
		} else {
			if (spkmodCinemaContainer && spkmodCinemaContainer.style.display !== 'none') {
				spkmodCinemaContainer.style.display = 'none';
			}
			if (spkmodCinemaFrameMesh && spkmodCinemaFrameMesh.visible) {
				spkmodCinemaFrameMesh.visible = false;
			}
		}

		// When outside cinema seats (in minigame, other map, or walked away):
		const curZone = spkmodGetExactCinemaZone();
		const isOutsideZone1OrMinigame = curZone !== 1 || spkmodIsInMinigame();
		const isLongAway = spkmodCinemaLeftZoneTimeMs > 0 && (Date.now() - spkmodCinemaLeftZoneTimeMs >= 60000);

		// If player transitioned to another map/minigame or has been away for > 60s, completely unload the player
		if ((isOutsideZone1OrMinigame || isLongAway) && spkmodHasActiveCinemaMedia()) {
			spkmodUnloadCinemaMedia();
		} else if ((spkmodCinemaIframe || spkmodCinemaVideoEl) && (window.spkmodCinemaLastPlayerState === 1 || window.spkmodCinemaLastPlayerState === 3)) {
			// Enforce pause & mute if still playing or buffering in background
			spkmodSendYtCommand('pauseVideo');
			spkmodSendYtCommand('mute');
			spkmodSendYtCommand('setVolume', [0]);
			spkmodCinemaLastVolume = 0;
		}
		return;
	}

	if (!spkmodCinemaScreenObject) {
		if (window.THREE && typeof gameState !== 'undefined' && gameState?.camera && gameState?.scene) {
			spkmodInitCinema();
		}
		return;
	}

	if (!spkmodCinemaInZone) {
		spkmodCinemaInZone = true;
		if (spkmodCinemaContainer) spkmodCinemaContainer.style.display = '';
		if (spkmodCinemaFrameMesh) spkmodCinemaFrameMesh.visible = true;
		if (spkmodCinemaOcclusionCanvas && spkmodCinemaConfig.occlusion) {
			spkmodCinemaOcclusionCanvas.style.display = '';
		}

		// 1. Resume existing track without restarting or re-seeking if briefly stepped away (< 60s) in Zone 1
		const curZone = spkmodGetExactCinemaZone();
		const wasInSameMap = curZone === 1 && !spkmodIsInMinigame();
		const wasBrieflyAway = wasInSameMap && spkmodCinemaLeftZoneTimeMs > 0 && (Date.now() - spkmodCinemaLeftZoneTimeMs < 60000);
		if (window.spkmodCinemaAnniversaryLocked) {
			window.spkmodSetCinemaAnniversaryLock(true);
		} else if (spkmodCinemaCurrentVideo && spkmodHasActiveCinemaMedia() && wasBrieflyAway) {
			spkmodSendYtCommand('playVideo');
		} else {
			spkmodSyncCinemaPlayback(true);
		}

		// 2. Unmute and restore volume immediately
		const isMuted = !!window.spkmodCinemaConfig?.muted;
		const vol = isMuted ? 0 : (window.spkmodCinemaConfig?.volume ?? 80);
		if (!isMuted) {
			spkmodSendYtCommand('unMute');
			spkmodSendYtCommand('setVolume', [vol]);
		} else {
			spkmodSendYtCommand('mute');
			spkmodSendYtCommand('setVolume', [0]);
		}
		spkmodCinemaLastVolume = vol;

		// 3. Mute game BGM while in cinema
		if (!isMuted && typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(true, "cinema");
		}

		// 4. Remember & restore playlist modal if it was open before leaving
		if (spkmodCinemaModalWasOpenBeforeLeaving) {
			window.spkmodToggleCinemaModal(true);
		}
	}

	const now = Date.now();
	if (now - spkmodCinemaLastSyncCheckMs > 1000) {
		spkmodCinemaLastSyncCheckMs = now;
		if (spkmodHasActiveCinemaMedia()) {
			spkmodSendYtCommand('getCurrentTime');
		}

		if (window.spkmodCinemaAnniversaryLocked) {
			// In lockdown mode: if anniversary video ends or unloads, keep it looping
			if (!spkmodCinemaCurrentVideo || !spkmodHasActiveCinemaMedia()) {
				window.spkmodSetCinemaAnniversaryLock(true);
			} else if (window.spkmodCinemaLastPlayerState === 0) {
				spkmodSendYtCommand('seekTo', [0, true]);
				spkmodSendYtCommand('playVideo');
				spkmodCinemaCurrentVideoStartTimeMs = Date.now();
			}
		} else if (spkmodCinemaManualTrackIndex === null) {
			// SYNC MODE: Auto-tune when schedule transitions to next track
			if (!spkmodCinemaCurrentVideo || !spkmodHasActiveCinemaMedia()) {
				spkmodSyncCinemaPlayback(true);
			} else {
				const synced = spkmodGetCinemaSyncedTrack();
				if (synced && synced.track.id !== spkmodCinemaCurrentVideo) {
					console.log(`[SpeakiMod+] Broadcast schedule transitioned from ${spkmodCinemaCurrentVideo} to ${synced.track.id}. Auto-tuning...`);
					spkmodSyncCinemaPlayback(false);
				}
			}
		} else {
			// MANUAL MODE: Watchdog for frozen/stalled playback past track duration
			if (!spkmodCinemaIsPaused && spkmodCinemaCurrentVideo) {
				const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
					? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
					: (spkmodCinemaLoadedPlaylist || []);
				const curIdx = spkmodGetCinemaCurrentTrackIndex();
				const curTrack = list[curIdx];
				const dur = (curTrack && curTrack.duration > 0) ? curTrack.duration : (curTrack?.baseDuration || (spkmodCinemaActiveTab === 'songs' ? 210 : 300));
				const elapsedSec = (now - spkmodCinemaCurrentVideoStartTimeMs) / 1000;
				const isYtPlaying = (window.spkmodCinemaLastPlayerState === 1);
				if (!curTrack?.isLiveStream && !curTrack?.isStream && !isYtPlaying && elapsedSec > (dur + 2)) {
					console.log(`[SpeakiMod+] Watchdog: ${curTrack?.title || 'track'} exceeded duration (${elapsedSec}s > ${dur}s). Advancing naturally...`);
					spkmodAdvanceCinemaTrack("watchdog");
				}
			}
		}
	}

	if (now - spkmodCinemaLastTimeUpdateMs > 500) {
		spkmodCinemaLastTimeUpdateMs = now;
		if (typeof spkmodUpdateCinemaTimeDisplay === 'function') {
			spkmodUpdateCinemaTimeDisplay();
		}
	}

	spkmodUpdateCinemaSpatialAudio();

	// Automatically show top HUD bar inside cinema area unless dismissed by player
	if (!spkmodCinemaTopBarDismissed) {
		spkmodUpdateCinemaTopBar(true);
	}

	if (spkmodCinemaRenderer && spkmodCinemaScene && gameState?.camera) {
		spkmodCinemaScene.updateMatrixWorld(true);
		if (gameState.camera.parent === null) {
			gameState.camera.updateMatrixWorld();
		} else {
			gameState.camera.updateWorldMatrix(true, false);
		}
		if (gameState.camera.matrixWorldInverse) {
			gameState.camera.matrixWorldInverse.copy(gameState.camera.matrixWorld).invert();
		}
		spkmodCinemaRenderer.render(spkmodCinemaScene, gameState.camera);
		if (spkmodCinemaConfig.occlusion && typeof spkmodRenderCinemaOcclusion === 'function') {
			spkmodRenderCinemaOcclusion();
		} else if (spkmodCinemaOcclusionCanvas && spkmodCinemaOcclusionCanvas.style.display !== 'none') {
			spkmodCinemaOcclusionCanvas.style.display = 'none';
		}
	}
}

function spkmodStartCinemaLoop() {
	if (spkmodCinemaRenderLoopId) return;
	function loop() {
		spkmodCinemaTick();
		spkmodCinemaRenderLoopId = requestAnimationFrame(loop);
	}
	spkmodCinemaRenderLoopId = requestAnimationFrame(loop);
}

function spkmodUpdateCinemaTopBar(visible) {
	let hudBar = document.getElementById('spkmod-cinema-hud-bar');
	if (!visible) {
		if (hudBar) hudBar.style.display = 'none';
		return;
	}
	if (!hudBar) {
		const isMobile = (typeof window.speakiMobile !== "undefined") ||
			(typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent)) ||
			(window.innerWidth <= 800);

		hudBar = document.createElement('div');
		hudBar.id = 'spkmod-cinema-hud-bar';
		hudBar.style.cssText = `position: fixed; top: ${isMobile ? 6 : 14}px; left: 50%; transform: translateX(-50%); z-index: 2147483640; background: rgba(18, 14, 26, 0.94); backdrop-filter: blur(8px); border: 1px solid rgba(232, 184, 75, 0.6); border-radius: 8px; padding: ${isMobile ? '3px 8px' : '5px 12px'}; display: flex; align-items: center; gap: ${isMobile ? 5 : 8}px; box-shadow: 0 4px 18px rgba(0,0,0,0.6); color: #fff; font-size: ${isMobile ? 11 : 12}px; font-weight: bold; pointer-events: auto; max-width: calc(100vw - 16px); white-space: nowrap; overflow: hidden;`;
		document.body.appendChild(hudBar);

		const title = window.spkmodCurrentCinemaTitle || "Monatium Cinema";
		const isMuted = !!window.spkmodCinemaConfig?.muted;
		const vol = window.spkmodCinemaConfig?.volume ?? 80;
		const repText = (spkmodCinemaRepeatMode === "one")
			? getCinemaText("cinemaRepeatOne")
			: (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"));
		hudBar.innerHTML = `
			<span id="spkmod-cinema-hud-now-playing-container" style="display:inline-flex;align-items:center;gap:4px;min-width:0;max-width:${isMobile ? 'min(150px, 20vw)' : 'min(240px, 28vw)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:1;">🎬 <strong id="spkmod-cinema-hud-now-playing-label" style="flex-shrink:0;">${getCinemaText("cinemaNowPlaying")}:</strong> <span id="spkmod-cinema-hud-title" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</span></span>
			<span id="spkmod-cinema-hud-time" style="color:#e8b84b;font-size:${isMobile ? 10 : 11}px;margin:0 2px;flex-shrink:0;font-variant-numeric:tabular-nums;font-weight:700;"></span>
			<div style="width: 1px; height: 14px; background: rgba(232, 184, 75, 0.4); margin: 0 2px; flex-shrink: 0;"></div>
			<button id="spkmod-cinema-hud-prev-btn" title="${getCinemaText("cinemaPrev")}" style="background:none;border:none;color:#ffc94a;font-size:${isMobile ? 11 : 13}px;cursor:pointer;padding:2px 3px;flex-shrink:0;">⏮️</button>
			<button id="spkmod-cinema-hud-play-btn" title="Play / Pause" style="background:none;border:none;color:#ffc94a;font-size:${isMobile ? 11 : 13}px;cursor:pointer;padding:2px 3px;flex-shrink:0;">${spkmodCinemaIsPaused ? "▶️" : "⏸️"}</button>
			<button id="spkmod-cinema-hud-next-btn" title="${getCinemaText("cinemaNext")}" style="background:none;border:none;color:#ffc94a;font-size:${isMobile ? 11 : 13}px;cursor:pointer;padding:2px 3px;flex-shrink:0;">⏭️</button>
			<button id="spkmod-cinema-hud-repeat-btn" title="${repText}" style="background:none;border:none;color:${spkmodCinemaRepeatMode !== 'off' ? '#ffc94a' : '#7c6894'};font-size:${isMobile ? 11 : 13}px;cursor:pointer;padding:2px 3px;flex-shrink:0;">${spkmodCinemaRepeatMode === 'one' ? '🔂' : '🔁'}</button>
			<button id="spkmod-cinema-hud-playlist-btn" title="${getCinemaText("cinemaPlaylistBtn")}" style="background:#3e3052;color:#ffdf79;border:1.5px solid #e8b84b;border-radius:6px;cursor:pointer;padding:${isMobile ? '1px 5px' : '2px 7px'};font-size:${isMobile ? 10 : 11}px;font-weight:700;white-space:nowrap;flex-shrink:0;transition:all 0.15s ease;">📋 <span id="spkmod-cinema-hud-playlist-text">${getCinemaText("cinemaPlaylistBtn")}</span></button>
			<div style="width: 1px; height: 14px; background: rgba(232, 184, 75, 0.4); margin: 0 2px; flex-shrink: 0;"></div>
			<button id="spkmod-cinema-hud-mute-btn" title="${isMuted ? getCinemaText("cinemaUnmute") : getCinemaText("cinemaMute")}" style="background:none;border:none;color:#e8b84b;font-size:${isMobile ? 12 : 14}px;cursor:pointer;padding:2px 2px;flex-shrink:0;">${(isMuted || vol === 0) ? "🔇" : "🔊"}</button>
			<input id="spkmod-cinema-hud-vol-slider" type="range" min="0" max="100" value="${vol}" style="width:${isMobile ? 38 : 65}px;height:5px;accent-color:#e8b84b;cursor:pointer;flex-shrink:0;">
			<span id="spkmod-cinema-hud-vol-label" style="font-size:${isMobile ? 10 : 11}px;color:#e8b84b;min-width:${isMobile ? 22 : 26}px;flex-shrink:0;">${isMuted ? "0%" : vol + "%"}</span>
			<button id="spkmod-cinema-exit-btn" style="padding:${isMobile ? '2px 7px' : '3px 10px'}; font-size:${isMobile ? 11 : 12}px; cursor: pointer; background: #e8b84b; color: #120e1a; font-weight: bold; border-radius: 6px; border: 1.5px solid #ffd56b; margin-left: 2px; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition:all 0.15s ease;">${isMobile ? "✕ Exit" : getCinemaText("cinemaExitBtn")}</button>
		`;

		hudBar.addEventListener("wheel", e => e.stopPropagation(), { passive: true });
		hudBar.addEventListener("touchmove", e => e.stopPropagation(), { passive: true });

		const exitBtn = hudBar.querySelector('#spkmod-cinema-exit-btn');
		if (exitBtn) {
			exitBtn.onclick = () => {
				spkmodCinemaTopBarDismissed = true;
				spkmodUpdateCinemaTopBar(false);
				if (spkmodCinemaModeActive) {
					window.spkmodToggleCinemaMode(false);
				}
			};
		}
		const hudMute = hudBar.querySelector('#spkmod-cinema-hud-mute-btn');
		if (hudMute) hudMute.onclick = () => window.spkmodToggleCinemaMute();
		const hudSlider = hudBar.querySelector('#spkmod-cinema-hud-vol-slider');
		if (hudSlider) {
			hudSlider.oninput = e => {
				const val = parseInt(e.target.value, 10) || 0;
				window.spkmodSetCinemaVolume(val, val === 0 ? true : false);
			};
		}
		const hudPrev = hudBar.querySelector('#spkmod-cinema-hud-prev-btn');
		if (hudPrev) hudPrev.onclick = () => window.spkmodCinemaPrev();
		const hudPlay = hudBar.querySelector('#spkmod-cinema-hud-play-btn');
		if (hudPlay) hudPlay.onclick = () => window.spkmodCinemaTogglePlayPause();
		const hudNext = hudBar.querySelector('#spkmod-cinema-hud-next-btn');
		if (hudNext) hudNext.onclick = () => window.spkmodCinemaNext();
		const hudRepeat = hudBar.querySelector('#spkmod-cinema-hud-repeat-btn');
		if (hudRepeat) hudRepeat.onclick = () => window.spkmodCinemaToggleRepeat();
		const hudPl = hudBar.querySelector('#spkmod-cinema-hud-playlist-btn');
		if (hudPl) hudPl.onclick = () => window.spkmodToggleCinemaModal();
	}
	if (hudBar.style.display !== 'flex') {
		hudBar.style.display = 'flex';
		spkmodUpdateCinemaPlaybackUI();
	}
}
window.spkmodUpdateCinemaTopBar = spkmodUpdateCinemaTopBar;

window.spkmodToggleCinemaMode = function(explicit) {
	spkmodCinemaModeActive = explicit !== undefined ? explicit : !spkmodCinemaModeActive;

	if (spkmodCinemaContainer) {
		spkmodCinemaContainer.style.pointerEvents = spkmodCinemaModeActive ? 'auto' : 'none';
	}
	const screenEl = document.getElementById('spkmod-cinema-screen');
	if (screenEl) {
		screenEl.style.pointerEvents = spkmodCinemaModeActive ? 'auto' : 'none';
	}

	if (spkmodCinemaModeActive) {
		if (document.pointerLockElement) {
			try { document.exitPointerLock(); } catch (_) {}
		}
		spkmodCinemaTopBarDismissed = false;
		spkmodUpdateCinemaTopBar(true);
		if (!window.spkmodCinemaConfig?.muted && typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(true, "cinema");
		}
	} else {
		spkmodCinemaTopBarDismissed = true;
		spkmodUpdateCinemaTopBar(false);
		if (!spkmodCinemaInZone && typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(false, "cinema");
		}
	}
};

window.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		if (spkmodCinemaModeActive) {
			window.spkmodToggleCinemaMode(false);
		} else {
			spkmodCinemaTopBarDismissed = true;
			spkmodUpdateCinemaTopBar(false);
		}
		if (spkmodCinemaModalEl && !spkmodCinemaModalEl.classList.contains('hidden')) {
			window.spkmodToggleCinemaModal(false);
		}
	}
});

window.addEventListener('message', e => {
	try {
		const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
		if (!data) return;
		spkmodCinemaYtReady = true;

		// 1. Capture dynamic duration & metadata from YouTube player delivery
		let ytDur = 0;
		let ytVid = null;
		let ytTitle = null;
		let ytAuthor = null;

		if (data.info && typeof data.info === 'object') {
			if (typeof data.info.duration === 'number' && data.info.duration > 0) {
				ytDur = Math.round(data.info.duration);
			}
			if (data.info.videoData) {
				ytVid = data.info.videoData.video_id || null;
				ytTitle = data.info.videoData.title || null;
				ytAuthor = data.info.videoData.author || null;
			}
		}

		if (ytDur > 0 || ytTitle || ytVid) {
			const targetId = ytVid || spkmodCinemaCurrentVideo;
			if (targetId) {
				const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
					? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
					: (spkmodCinemaLoadedPlaylist || []);
				const targetTrack = list.find(t => t.id === targetId || (t.isChannelLive && spkmodCinemaCurrentVideo === t.id));
				if (targetTrack) {
					let changed = false;
					if (ytVid && targetTrack.isChannelLive && targetTrack.liveVideoId !== ytVid) {
						targetTrack.liveVideoId = ytVid;
						changed = true;
					}
					if (ytDur > 0 && !targetTrack.isLiveStream) {
						if (!targetTrack.duration || targetTrack.duration <= 0 || Math.abs(targetTrack.duration - ytDur) > 3) {
							targetTrack.duration = ytDur;
							targetTrack.baseDuration = ytDur;
							targetTrack.isStream = false;
							changed = true;
							try { localStorage.setItem('spkmod_cinema_dur_' + targetTrack.id, String(ytDur)); } catch (_) {}
						}
					}
					if (ytTitle && (!targetTrack.title || targetTrack.title === 'Movie' || targetTrack.title === targetTrack.id)) {
						targetTrack.title = ytTitle;
						changed = true;
						try { localStorage.setItem('spkmod_cinema_title_' + targetTrack.id, ytTitle); } catch (_) {}
					}
					if (ytAuthor && !targetTrack.author) {
						targetTrack.author = ytAuthor;
						changed = true;
						try { localStorage.setItem('spkmod_cinema_author_' + targetTrack.id, ytAuthor); } catch (_) {}
					}
					if (changed) {
						window.spkmodCurrentCinemaTitle = targetTrack.title || "Monatium Cinema";
						if (typeof spkmodRenderCinemaModalList === 'function' && spkmodIsCinemaModalOpen()) {
							spkmodRenderCinemaModalList();
						}
						if (typeof spkmodUpdateCinemaPlaybackUI === 'function') {
							spkmodUpdateCinemaPlaybackUI();
						}
					}
				}
			}
		}

		// 2. Extract playerState and currentTime from both onStateChange and infoDelivery
		let playerState = null;
		if (data.event === 'onStateChange') {
			if (typeof data.info === 'number') {
				playerState = data.info;
			} else if (data.info && typeof data.info.playerState === 'number') {
				playerState = data.info.playerState;
			}
		} else if (data.event === 'infoDelivery' && data.info && typeof data.info.playerState === 'number') {
			playerState = data.info.playerState;
		}

		if (playerState !== null) {
			window.spkmodCinemaLastPlayerState = playerState;
		}

		// When player is outside cinema seats (e.g. minigame, other map, or walked away),
		// strictly prevent background playback, time counting, and auto-advancing:
		if (!spkmodCinemaInZone) {
			if (playerState === 1 || playerState === 3 || data.event === 'onReady' || data.event === 'initialDelivery') {
				spkmodSendYtCommand('pauseVideo');
				spkmodSendYtCommand('mute');
				spkmodSendYtCommand('setVolume', [0]);
				spkmodCinemaLastVolume = 0;
			}
			return; // Drop playback advance and UI updates while outside the cinema
		}

		// Ensure YouTube is unmuted and volume applied as soon as player initializes or starts playing
		if (data.event === 'onReady' || data.event === 'initialDelivery' || playerState === 1) {
			if (spkmodCinemaInZone && !window.spkmodCinemaConfig?.muted) {
				spkmodSendYtCommand('unMute');
				const vol = window.spkmodCinemaConfig?.volume ?? 80;
				spkmodSendYtCommand('setVolume', [vol]);
				spkmodCinemaLastVolume = vol;
			}
			try {
				spkmodCinemaIframe?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
			} catch (_) {}
			spkmodSendYtCommand('getDuration');
		}

		if (data.event === 'onError') {
			const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
				? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
				: (spkmodCinemaLoadedPlaylist || []);
			const curIdx = spkmodGetCinemaCurrentTrackIndex();
			const curTrack = list[curIdx];
			if (curTrack) {
				curTrack.isOffline = true;
				curTrack.isEnded = true;
				console.log(`[SpeakiMod+] Track ${curTrack.title || curTrack.id} (${curTrack.id}) error. Advancing to next track...`);
			}
			spkmodAdvanceCinemaTrack("error");
			return;
		}

		const curTime = (data.info && typeof data.info.currentTime === 'number') ? data.info.currentTime : null;
		const durTime = (data.info && typeof data.info.duration === 'number') ? data.info.duration : null;

		if (curTime !== null && curTime >= 0) {
			window.spkmodCinemaCurrentVideoTimeSec = curTime;
			spkmodCinemaCurrentVideoStartTimeMs = Date.now() - (curTime * 1000);
			if (typeof spkmodUpdateCinemaTimeDisplay === 'function') {
				spkmodUpdateCinemaTimeDisplay();
			}
		}

		const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
			? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
			: (spkmodCinemaLoadedPlaylist || []);
		const curIdx = spkmodGetCinemaCurrentTrackIndex();
		const curTrack = list[curIdx];
		const isStreamTrack = !!(curTrack && (curTrack.isStream || curTrack.isLiveStream || curTrack.duration === 0));
		const knownDur = (durTime && durTime > 0) ? durTime : ((curTrack && curTrack.duration > 0) ? curTrack.duration : (curTrack?.baseDuration || 0));

		// Livestreams do NOT have a fixed end time; never treat a stream as ended via isAtEnd
		const isAtEnd = !isStreamTrack && (curTime !== null && knownDur > 2 && curTime >= (knownDur - 1.0));

		if (playerState === 0 || isAtEnd || (playerState === 2 && isAtEnd)) { // ENDED
			spkmodAdvanceCinemaTrack(playerState === 0 ? "ended_event" : "at_end_time");
			return;
		} else if (playerState === 1) { // PLAYING
			const list = (spkmodCinemaPlaylists[spkmodCinemaActiveTab] && spkmodCinemaPlaylists[spkmodCinemaActiveTab].length > 0)
				? spkmodCinemaPlaylists[spkmodCinemaActiveTab]
				: (spkmodCinemaLoadedPlaylist || []);
			const curIdx = spkmodGetCinemaCurrentTrackIndex();
			const curTrack = list[curIdx];
			if (curTrack && (curTrack.duration === 0 || curTrack.isStream)) {
				curTrack.isActiveLive = true;
				curTrack.isOffline = false;
				curTrack.isEnded = false;
			}
			if (spkmodCinemaIsPaused) {
				spkmodCinemaIsPaused = false;
				spkmodUpdateCinemaPlaybackUI();
			}
		} else if (playerState === 2) { // PAUSED
			if (!spkmodCinemaIsPaused) {
				spkmodCinemaIsPaused = true;
				spkmodUpdateCinemaPlaybackUI();
			}
		}
	} catch (_) {}
});

window.addEventListener('resize', () => {
	if (spkmodCinemaRenderer) {
		spkmodCinemaRenderer.setSize(window.innerWidth, window.innerHeight);
	}
	if (spkmodCinemaOcclusionRenderer) {
		spkmodCinemaOcclusionRenderer.setSize(window.innerWidth, window.innerHeight);
	}
});

window.spkmodLoadMoviesPlaylist = spkmodLoadMoviesPlaylist;
window.spkmodLoadSongsPlaylist = spkmodLoadSongsPlaylist;
window.spkmodSwitchCinemaTab = spkmodSwitchCinemaTab;
window.spkmodSendYtCommand = spkmodSendYtCommand;
window.spkmodSyncCinemaPlayback = spkmodSyncCinemaPlayback;
window.spkmodInitCinema = spkmodInitCinema;
window.spkmodCinemaConfig = spkmodCinemaConfig;

window.spkmodSetCinema = function(x = 75.0, y = 4.2, z = 32.5, rotY = 1.6000) {
	if (typeof x === "number") window.spkmodCinemaConfig.pos.x = x;
	if (typeof y === "number") window.spkmodCinemaConfig.pos.y = y;
	if (typeof z === "number") window.spkmodCinemaConfig.pos.z = z;
	if (typeof rotY === "number") window.spkmodCinemaConfig.rotationY = rotY;
	localStorage.setItem("spkmod-cinema-pos", JSON.stringify({
		x: window.spkmodCinemaConfig.pos.x,
		y: window.spkmodCinemaConfig.pos.y,
		z: window.spkmodCinemaConfig.pos.z,
		rotationY: window.spkmodCinemaConfig.rotationY
	}));
	if (spkmodCinemaScreenObject) {
		spkmodCinemaScreenObject.position.set(window.spkmodCinemaConfig.pos.x, window.spkmodCinemaConfig.pos.y, window.spkmodCinemaConfig.pos.z);
		spkmodCinemaScreenObject.rotation.y = window.spkmodCinemaConfig.rotationY;
	}
	if (spkmodCinemaFrameMesh) {
		spkmodCinemaFrameMesh.position.set(window.spkmodCinemaConfig.pos.x, window.spkmodCinemaConfig.pos.y, window.spkmodCinemaConfig.pos.z);
		spkmodCinemaFrameMesh.rotation.y = window.spkmodCinemaConfig.rotationY;
	}
	if (spkmodCinemaOccluderMesh) {
		spkmodCinemaOccluderMesh.position.set(window.spkmodCinemaConfig.pos.x, window.spkmodCinemaConfig.pos.y, window.spkmodCinemaConfig.pos.z);
		spkmodCinemaOccluderMesh.rotation.y = window.spkmodCinemaConfig.rotationY;
	}
	if (typeof chatLog === "function") {
		chatLog(`🎬 Cinema moved to (${window.spkmodCinemaConfig.pos.x}, ${window.spkmodCinemaConfig.pos.y}, ${window.spkmodCinemaConfig.pos.z})`);
	}
	console.log("[Cinema] Position updated:", window.spkmodCinemaConfig.pos, "RotY:", window.spkmodCinemaConfig.rotationY);
};

window.spkmodGetCinemaStatus = function() {
	const playerPos = (typeof gameState !== 'undefined' && gameState?.playerContainer?.position) ? gameState.playerContainer.position : null;
	const dist = playerPos ? Math.hypot(playerPos.x - window.spkmodCinemaConfig.pos.x, playerPos.z - window.spkmodCinemaConfig.pos.z) : null;
	const inSeats = spkmodIsPlayerInCinemaSeats(playerPos);
	const curIdx = spkmodGetCinemaCurrentTrackIndex();
	const status = {
		playerPos: playerPos ? { x: Number(playerPos.x.toFixed(2)), y: Number(playerPos.y.toFixed(2)), z: Number(playerPos.z.toFixed(2)) } : null,
		cinemaPos: window.spkmodCinemaConfig.pos,
		rotationY: window.spkmodCinemaConfig.rotationY,
		distToCinema: dist !== null ? Number(dist.toFixed(2)) + "m" : "unknown",
		enabled: window.spkmodCinemaConfig.enabled,
		muted: !!window.spkmodCinemaConfig.muted,
		volume: window.spkmodCinemaConfig.volume,
		inSeats: inSeats,
		inPillRange: inSeats && window.spkmodCinemaConfig.enabled,
		inRenderRange: inSeats && window.spkmodCinemaConfig.enabled,
		screenObjectCreated: !!spkmodCinemaScreenObject,
		cinemaModeActive: spkmodCinemaModeActive,
		repeatMode: spkmodCinemaRepeatMode,
		currentVideo: spkmodCinemaCurrentVideo,
		currentTrackIndex: curIdx,
		isPaused: spkmodCinemaIsPaused,
		isManual: spkmodCinemaManualTrackIndex !== null,
		activeTab: spkmodCinemaActiveTab,
		playlistCount: spkmodCinemaLoadedPlaylist ? spkmodCinemaLoadedPlaylist.length : 0
	};
	console.table(status);
	return status;
};

window.spkmodToggleCinemaModal = spkmodToggleCinemaModal;
window.spkmodOpenCinemaModal = spkmodOpenCinemaModal;
window.spkmodUpdateCinemaTopBar = spkmodUpdateCinemaTopBar;
window.spkmodCinemaToggleRepeat = spkmodCinemaToggleRepeat;
window.spkmodPlayCinemaTrackIndex = spkmodPlayCinemaTrackIndex;
window.spkmodCinemaPlay = spkmodCinemaPlay;
window.spkmodCinemaPause = spkmodCinemaPause;
window.spkmodCinemaTogglePlayPause = spkmodCinemaTogglePlayPause;
window.spkmodCinemaPrev = spkmodCinemaPrev;
window.spkmodCinemaNext = spkmodCinemaNext;
window.spkmodCinemaSyncSchedule = spkmodCinemaSyncSchedule;
window.spkmodRenderCinemaModalList = spkmodRenderCinemaModalList;
window.spkmodUpdateCinemaPlaybackUI = spkmodUpdateCinemaPlaybackUI;

function spkmodUpdateCinemaI18n() {
	// 1. Settings Panel elements (if created)
	if (typeof lunPanelElements !== "undefined") {
		if (lunPanelElements.cinemaToggleLabel) {
			lunPanelElements.cinemaToggleLabel.innerText = "🎬 " + getCinemaText("cinemaTitle");
			lunPanelElements.cinemaToggleLabel.title = getCinemaText("cinemaDesc");
		}
		if (lunPanelElements.cinemaMuteBtn) {
			const isMuted = !!window.spkmodCinemaConfig?.muted;
			lunPanelElements.cinemaMuteBtn.title = isMuted ? getCinemaText("cinemaUnmute") : getCinemaText("cinemaMute");
		}
		if (lunPanelElements.cinemaVolumeLabel) {
			lunPanelElements.cinemaVolumeLabel.innerText = "🔊 " + getCinemaText("cinemaVolumeLabel") + ":";
		}
		if (lunPanelElements.cinemaReloadBtn) {
			lunPanelElements.cinemaReloadBtn.innerText = "🔄 " + getCinemaText("cinemaReloadPlaylist");
			lunPanelElements.cinemaReloadBtn.title = getCinemaText("cinemaReloadPlaylist");
		}
		if (lunPanelElements.cinemaOcclusionLabel) {
			lunPanelElements.cinemaOcclusionLabel.innerText = "👥 " + (getCinemaText("cinemaOcclusionToggle") || "Spiki Occlusion (Avatars block screen)");
		}
	}

	// 2. Floating Dock (spkmod-cinema-dock)
	const anchorBtn = document.getElementById("spkmod-cinema-dock-anchor");
	if (anchorBtn) {
		anchorBtn.title = (typeof t === "function" ? t("dragMenuTooltip") : "Drag to move") || "Drag to move";
	}
	const modeBtn = document.getElementById("spkmod-cinema-mode-btn");
	if (modeBtn) {
		modeBtn.innerText = getCinemaText("cinemaModeBtn");
	}
	const dockPlBtn = document.getElementById("spkmod-cinema-dock-pl-btn");
	if (dockPlBtn) dockPlBtn.title = getCinemaText("cinemaPlaylistTitle");
	const dockPrevBtn = document.getElementById("spkmod-cinema-dock-prev-btn");
	if (dockPrevBtn) dockPrevBtn.title = getCinemaText("cinemaPrev");
	const dockNextBtn = document.getElementById("spkmod-cinema-dock-next-btn");
	if (dockNextBtn) dockNextBtn.title = getCinemaText("cinemaNext");
	const dockRepeatBtn = document.getElementById("spkmod-cinema-dock-repeat-btn");
	if (dockRepeatBtn) {
		const repText = (spkmodCinemaRepeatMode === "one") ? getCinemaText("cinemaRepeatOne") : (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"));
		dockRepeatBtn.title = repText;
	}
	const dockMuteBtn = document.getElementById("spkmod-cinema-mute-btn");
	if (dockMuteBtn) {
		const isMuted = !!window.spkmodCinemaConfig?.muted;
		dockMuteBtn.title = isMuted ? getCinemaText("cinemaUnmute") : getCinemaText("cinemaMute");
	}

	// 3. Top HUD Bar (spkmod-cinema-hud-bar)
	const hudNowPlayingLabel = document.getElementById("spkmod-cinema-hud-now-playing-label");
	if (hudNowPlayingLabel) {
		hudNowPlayingLabel.innerText = getCinemaText("cinemaNowPlaying") + ":";
	}
	const hudPlBtn = document.getElementById("spkmod-cinema-hud-playlist-btn");
	if (hudPlBtn) {
		hudPlBtn.title = getCinemaText("cinemaPlaylistBtn");
		const plText = document.getElementById("spkmod-cinema-hud-playlist-text");
		if (plText) {
			plText.innerText = getCinemaText("cinemaPlaylistBtn");
		} else {
			hudPlBtn.innerHTML = `📋 <span id="spkmod-cinema-hud-playlist-text">${getCinemaText("cinemaPlaylistBtn")}</span>`;
		}
	}
	const exitBtn = document.getElementById("spkmod-cinema-exit-btn");
	if (exitBtn) {
		const isMobile = (typeof window.speakiMobile !== "undefined") ||
			(typeof navigator !== "undefined" && /mobi|android|iphone|ipad|ipod/i.test(navigator.userAgent)) ||
			(window.innerWidth <= 800);
		exitBtn.innerText = isMobile ? "✕ Exit" : getCinemaText("cinemaExitBtn");
		exitBtn.style.setProperty("background", "#e8b84b", "important");
		exitBtn.style.setProperty("color", "#120e1a", "important");
	}
	const hudPrevBtn = document.getElementById("spkmod-cinema-hud-prev-btn");
	if (hudPrevBtn) hudPrevBtn.title = getCinemaText("cinemaPrev");
	const hudNextBtn = document.getElementById("spkmod-cinema-hud-next-btn");
	if (hudNextBtn) hudNextBtn.title = getCinemaText("cinemaNext");
	const hudRepeatBtn = document.getElementById("spkmod-cinema-hud-repeat-btn");
	if (hudRepeatBtn) {
		const repText = (spkmodCinemaRepeatMode === "one") ? getCinemaText("cinemaRepeatOne") : (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"));
		hudRepeatBtn.title = repText;
	}
	const hudMuteBtn = document.getElementById("spkmod-cinema-hud-mute-btn");
	if (hudMuteBtn) {
		const isMuted = !!window.spkmodCinemaConfig?.muted;
		hudMuteBtn.title = isMuted ? getCinemaText("cinemaUnmute") : getCinemaText("cinemaMute");
	}

	// 4. Cinema Modal (spkmod-cinema-modal)
	if (spkmodCinemaModalEl) {
		const modalHeader = document.getElementById("spkmod-cinema-modal-header-title");
		if (modalHeader) modalHeader.innerText = getCinemaText("cinemaPlaylistTitle");
		const syncLabel = document.getElementById("spkmod-cinema-sync-label");
		if (syncLabel) syncLabel.innerText = getCinemaText("cinemaSyncSchedule");
		const syncBtn = document.getElementById("spkmod-cinema-modal-sync-btn");
		if (syncBtn) syncBtn.title = getCinemaText("cinemaSyncSchedule");
		const reloadBtn = document.getElementById("spkmod-cinema-modal-reload-btn");
		if (reloadBtn) reloadBtn.title = getCinemaText("cinemaReloadPlaylist");
		const occBtn = document.getElementById("spkmod-cinema-modal-occlusion-btn");
		if (occBtn) occBtn.title = getCinemaText("cinemaOcclusionToggle");

		const tabMoviesLabel = document.getElementById("spkmod-cinema-tab-movies-label");
		if (tabMoviesLabel) tabMoviesLabel.innerText = getCinemaText("cinemaTabMovies");
		const tabSongsLabel = document.getElementById("spkmod-cinema-tab-songs-label");
		if (tabSongsLabel) tabSongsLabel.innerText = getCinemaText("cinemaTabSongs");

		const hintLabel = document.getElementById("spkmod-cinema-modal-hint-label");
		if (hintLabel) hintLabel.innerText = getCinemaText("cinemaClickToPlay");

		const prevCtrl = document.getElementById("spkmod-cinema-ctrl-prev");
		if (prevCtrl) prevCtrl.title = getCinemaText("cinemaPrev");
		const playCtrl = document.getElementById("spkmod-cinema-ctrl-play");
		if (playCtrl) playCtrl.title = getCinemaText("cinemaPlay");
		const pauseCtrl = document.getElementById("spkmod-cinema-ctrl-pause");
		if (pauseCtrl) pauseCtrl.title = getCinemaText("cinemaPause");
		const nextCtrl = document.getElementById("spkmod-cinema-ctrl-next");
		if (nextCtrl) nextCtrl.title = getCinemaText("cinemaNext");
		const repCtrl = document.getElementById("spkmod-cinema-ctrl-repeat");
		if (repCtrl) {
			const repText = (spkmodCinemaRepeatMode === "one") ? getCinemaText("cinemaRepeatOne") : (spkmodCinemaRepeatMode === "all" ? getCinemaText("cinemaRepeatAll") : getCinemaText("cinemaRepeatOff"));
			repCtrl.title = repText;
		}

		spkmodRenderCinemaModalList();
		spkmodUpdateCinemaPlaybackUI();
	}
}
window.spkmodUpdateCinemaI18n = spkmodUpdateCinemaI18n;

if (typeof spkmodI18nRenderers !== "undefined") {
	spkmodI18nRenderers.push(spkmodUpdateCinemaI18n);
}

// ============================================================================
// 100-DAY ANNIVERSARY CINEMA LOCKDOWN & FIREWORKS ENGINE
// ============================================================================

window.spkmodCinemaAnniversaryLocked = false;
window.spkmodCinemaAnniversaryVideo = {
	id: "nYhe1Rwd8oE",
	title: "SpeakiRPG 100-Day Anniversary",
	author: "SpeakiRPG",
	duration: 0,
	url: "https://www.youtube.com/watch?v=nYhe1Rwd8oE"
};

window.spkmodSetCinemaAnniversaryLock = function(locked, customVideoId) {
	window.spkmodCinemaAnniversaryLocked = !!locked;
	if (customVideoId) {
		const isDirect = spkmodIsDirectVideoUrl(customVideoId);
		window.spkmodCinemaAnniversaryVideo.id = customVideoId;
		window.spkmodCinemaAnniversaryVideo.url = isDirect ? customVideoId : `https://www.youtube.com/watch?v=${customVideoId}`;
	}
	const videoId = customVideoId || window.spkmodCinemaAnniversaryVideo.id;

	if (locked) {
		if (!spkmodCinemaConfig.enabled && typeof window.spkmodSetCinemaEnabled === "function") {
			window.spkmodSetCinemaEnabled(true, true, false);
		}
		spkmodCinemaConfig.enabled = true;
		if (typeof window.spkmodSetNightMode === "function") {
			window.spkmodSetNightMode(true);
		}
		if (window.localStorage) {
			try { localStorage.setItem("spkmod-cinema-enabled", "true"); } catch (_) {}
		}
		spkmodCinemaManualTrackIndex = null;
		spkmodCinemaIsPaused = false;
		spkmodCinemaCurrentVideo = videoId;
		spkmodCinemaCurrentVideoStartTimeMs = Date.now();
		window.spkmodCinemaCurrentVideoTimeSec = 0;
		window.spkmodCurrentCinemaTitle = window.spkmodCinemaAnniversaryVideo.title;

		if (spkmodCinemaInZone) {
			if (spkmodIsDirectVideoUrl(videoId)) {
				spkmodPlayDirectVideo(videoId, 0, true);
			} else if (spkmodCinemaIframe) {
				spkmodSetCinemaPlayerMode(false);
				const isMuted = !!window.spkmodCinemaConfig?.muted;
				const ytUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&start=0&loop=1&playlist=${videoId}&origin=${encodeURIComponent(location.origin)}`;
				spkmodCinemaYtReady = false;
				spkmodCinemaIframe.src = ytUrl;
				spkmodCinemaIframe.onload = () => {
					try { spkmodCinemaIframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*'); } catch (_) {}
				};
			}
		}
	} else {
		// Unlock and resume regular schedule
		spkmodSetCinemaPlayerMode(false);
		window.spkmodCinemaSyncSchedule();
	}

	if (typeof spkmodUpdateCinemaPlaybackUI === "function") spkmodUpdateCinemaPlaybackUI();
	if (typeof spkmodRenderCinemaModalList === "function" && spkmodIsCinemaModalOpen()) spkmodRenderCinemaModalList();
};

// ------------- Procedural Web Audio Sound Synthesizer -------------
var spkmodFwAudioCtx = null;
var spkmodFwMasterGain = null;
function spkmodGetFwAudioContext() {
	if (!spkmodFwAudioCtx || spkmodFwAudioCtx.state === 'closed') {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (AudioCtx) {
			spkmodFwAudioCtx = new AudioCtx();
			spkmodFwMasterGain = null;
		}
	}
	if (spkmodFwAudioCtx && spkmodFwAudioCtx.state === 'suspended') {
		spkmodFwAudioCtx.resume().catch(() => {});
	}
	if (spkmodFwAudioCtx && !spkmodFwMasterGain) {
		try {
			spkmodFwMasterGain = spkmodFwAudioCtx.createGain();
			spkmodFwMasterGain.gain.setValueAtTime(1, spkmodFwAudioCtx.currentTime);
			spkmodFwMasterGain.connect(spkmodFwAudioCtx.destination);
		} catch (_) {}
	}
	return spkmodFwAudioCtx;
}

function spkmodGetFwVolumeScale(sourceX, sourceY, sourceZ) {
	// If player is outside Zone 1 (Monatium) or in minigame, silence completely!
	const curZone = spkmodGetExactCinemaZone();
	if (curZone !== 1) return 0;
	if (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame()) return 0;
	if (typeof isGameMuted === 'function' && isGameMuted()) return 0;
	if (typeof lunIsMuted !== 'undefined' && lunIsMuted) return 0;

	const cam = (typeof gameState !== 'undefined' && gameState?.camera) ? gameState.camera : null;
	if (!cam) return 0.7;
	const dx = (cam.position?.x ?? 0) - sourceX;
	const dy = (cam.position?.y ?? 0) - sourceY;
	const dz = (cam.position?.z ?? 0) - sourceZ;
	const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
	const minD = 12, maxD = 120;
	if (dist <= minD) return 0.85;
	if (dist >= maxD) return 0.12;
	return Math.max(0.12, 0.85 * (1 - (dist - minD) / (maxD - minD)));
}

function spkmodPlayFwLaunchSound(x, y, z, durationSec) {
	const ctx = spkmodGetFwAudioContext();
	if (!ctx) return;
	const vol = spkmodGetFwVolumeScale(x, y, z);
	if (vol <= 0.01) return;

	const t = ctx.currentTime;
	const dur = Math.min(2.5, Math.max(0.6, durationSec || 1.2));

	const bufferSize = Math.floor(ctx.sampleRate * dur);
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = (Math.random() * 2 - 1);
	}
	const noise = ctx.createBufferSource();
	noise.buffer = buffer;

	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.Q.value = 4.5;
	filter.frequency.setValueAtTime(320, t);
	filter.frequency.exponentialRampToValueAtTime(1350, t + dur);

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.005, t);
	gain.gain.linearRampToValueAtTime(vol * 0.22, t + 0.12);
	gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(spkmodFwMasterGain || ctx.destination);

	noise.start(t);
	noise.stop(t + dur);
}

function spkmodPlayFwBurstSound(x, y, z, isText = false) {
	const ctx = spkmodGetFwAudioContext();
	if (!ctx) return;
	const vol = spkmodGetFwVolumeScale(x, y, z);
	if (vol <= 0.01) return;

	const t = ctx.currentTime;
	const effectiveVol = isText ? vol * 1.25 : vol;

	// 1. Deep resonant sub-bass boom
	const osc = ctx.createOscillator();
	osc.type = "sine";
	const startFreq = isText ? 175 : 135;
	const endFreq = isText ? 28 : 36;
	const boomDur = isText ? 1.5 : 0.85;
	osc.frequency.setValueAtTime(startFreq, t);
	osc.frequency.exponentialRampToValueAtTime(endFreq, t + boomDur);

	const oscGain = ctx.createGain();
	oscGain.gain.setValueAtTime(effectiveVol * 0.75, t);
	oscGain.gain.exponentialRampToValueAtTime(0.001, t + boomDur);

	osc.connect(oscGain);
	oscGain.connect(spkmodFwMasterGain || ctx.destination);
	osc.start(t);
	osc.stop(t + boomDur);

	// 2. Punchy explosion noise thud
	const noiseDur = isText ? 0.65 : 0.42;
	const bufferSize = Math.floor(ctx.sampleRate * noiseDur);
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = (Math.random() * 2 - 1);
	}
	const noise = ctx.createBufferSource();
	noise.buffer = buffer;

	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.setValueAtTime(isText ? 1300 : 850, t);
	filter.frequency.exponentialRampToValueAtTime(110, t + noiseDur);

	const noiseGain = ctx.createGain();
	noiseGain.gain.setValueAtTime(effectiveVol * 0.55, t);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, t + noiseDur);

	noise.connect(filter);
	filter.connect(noiseGain);
	noiseGain.connect(spkmodFwMasterGain || ctx.destination);

	noise.start(t);
	noise.stop(t + noiseDur);

	// 3. Shimmer fanfare chords for "100" text burst!
	if (isText) {
		const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
		chord.forEach((freq, idx) => {
			const tone = ctx.createOscillator();
			tone.type = "triangle";
			tone.frequency.setValueAtTime(freq, t + 0.05);

			const toneGain = ctx.createGain();
			toneGain.gain.setValueAtTime(0.001, t);
			toneGain.gain.linearRampToValueAtTime(vol * 0.16, t + 0.1 + idx * 0.04);
			toneGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8 + idx * 0.12);

			tone.connect(toneGain);
			toneGain.connect(spkmodFwMasterGain || ctx.destination);
			tone.start(t + 0.05);
			tone.stop(t + 2.2);
		});
	}
}

function spkmodPlayFwCrackleSound(x, y, z) {
	const ctx = spkmodGetFwAudioContext();
	if (!ctx) return;
	const vol = spkmodGetFwVolumeScale(x, y, z);
	if (vol <= 0.01) return;

	const t = ctx.currentTime;
	const count = 7;
	for (let i = 0; i < count; i++) {
		const delay = Math.random() * 0.6;
		const pop = ctx.createOscillator();
		pop.type = "triangle";
		pop.frequency.setValueAtTime(1700 + Math.random() * 1400, t + delay);

		const gain = ctx.createGain();
		gain.gain.setValueAtTime(vol * (0.04 + Math.random() * 0.06), t + delay);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.05);

		pop.connect(gain);
		gain.connect(spkmodFwMasterGain || ctx.destination);
		pop.start(t + delay);
		pop.stop(t + delay + 0.06);
	}
}

function spkmodPlayFwSparkleSound(x, y, z) {
	const ctx = spkmodGetFwAudioContext();
	if (!ctx) return;
	const vol = spkmodGetFwVolumeScale(x, y, z);
	if (vol <= 0.01) return;

	const t = ctx.currentTime;
	const notes = [1567.98, 1760.0, 2093.0, 2349.32, 2637.02, 3135.96]; // G6, A6, C7, D7, E7, G7
	const count = 9;
	for (let i = 0; i < count; i++) {
		const delay = 0.08 + i * 0.11 + Math.random() * 0.05;
		const freq = notes[(Math.random() * notes.length) | 0] * (0.995 + Math.random() * 0.01);
		const chime = ctx.createOscillator();
		chime.type = "sine";
		chime.frequency.setValueAtTime(freq, t + delay);

		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0.0001, t + delay);
		gain.gain.linearRampToValueAtTime(vol * (0.06 + Math.random() * 0.04), t + delay + 0.015);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.45);

		chime.connect(gain);
		gain.connect(spkmodFwMasterGain || ctx.destination);
		chime.start(t + delay);
		chime.stop(t + delay + 0.48);
	}
}

// ------------- Firework Visual Choreography (fireworks_final) -------------
// Array of firework shows: [0] = first 10s show (!ani fire), [1] = second show after movies (!ani fire2)
// [0] = Time start, [1] = "normal" | "fountain" | shape name, [2] angle, [3] Height, [4] Color, [5] offset to side (z), [6] optional offset x, [7] optional duration, [8] optional particles, [9] optional burstSize
var SPKMOD_FW_SHOW = [
	[
		[0.0, "text100", 0, 6, "yellow", 0, 0, 0, 200],
		[1.0, "textDays", 0, 2, "yellow", 0, 0, 0, 200]
	],
	[
		[4.0, "normal", 0, 8.5, "yellow", 0, 0, 0, 200, 7],
		[6.5, "normal", -25, 11, "red", 0, 0, 0, 100, 6],
		[6.6, "normal", 25, 11, "green", 0, 0, 0, 100, 6],
		[6.7, "normal", 0, 11, "cyan", 0, 0, 0, 130, 6],

		[11, "normal", 0, 8, "yellow", 0, 0, 0, 100, 5],
		[11, "normal", 0, 8, "yellow", -5, 0, 0, 100, 5],
		[11, "normal", 0, 8, "yellow", -10, 0, 0, 100, 5],
		[11, "normal", 0, 8, "yellow", 5, 0, 0, 100, 5],
		[11, "normal", 0, 8, "yellow", 10, 0, 0, 100, 5],

		[11.5, "normal", 0, 12, "blue", 0, 0, 0, 100, 8],
		[11.25, "normal", -35, 10, "blue", 0, 0, 0, 100, 9],
		[12, "normal", -15, 11, "blue", 0, -5, 0, 100, 8],
		[12.25, "normal", 35, 10, "blue", 0, 0, 0, 100, 9],
		[12.4, "normal", 15, 11, "blue", 0, 5, 0, 100, 8],

		[14.5, "normal", 40, 9, "orange", -10, 0, 0, 100, 7],
		[15, "normal", -40, 8, "red", 10, 0, 0, 100, 7],
		[15.5, "normal", 30, 9, "red", -10, 0, 0, 130, 8],
		[15.5, "normal", -30, 10, "orange", 10, 0, 0, 130, 8],
		[15.8, "normal", 20, 8, "orange", -10, 0, 0, 130, 6],
		[15.8, "normal", -20, 10, "red", 10, 0, 0, 130, 6],
		[16, "normal", 40, 9, "orange", -10, 0, 0, 130, 6],
		[16, "normal", -40, 12, "red", 10, 0, 0, 130, 6],

		[18, "normal", 0, 6, "yellow", -12, 0, 0, 30, 6],
		[18, "normal", 0, 6, "yellow", 12, 0, 0, 30, 6],
		[18.2, "normal", 0, 7, "yellow", -10, 0, 0, 30, 6],
		[18.2, "normal", 0, 7, "yellow", 10, 0, 0, 30, 6],
		[18.4, "normal", 0, 8, "yellow", -8, 0, 0, 30, 6],
		[18.4, "normal", 0, 8, "yellow", 8, 0, 0, 30, 6],
		[18.6, "normal", 0, 9, "yellow", -5, 0, 0, 30, 6],
		[18.6, "normal", 0, 9, "yellow", 5, 0, 0, 30, 6],
		[18.8, "normal", 0, 10, "yellow", -2, 0, 0, 30, 6],
		[18.8, "normal", 0, 10, "yellow", 2, 0, 0, 30, 6],
		[19, "normal", 0, 11, "yellow", 0, 0, 0, 30, 6],
		[19, "normal", 0, 12, "yellow", 0, 0, 0, 30, 6],

		[20.5, "normal", 0, 10, "yellow", -12, 0, 0, 30, 6],
		[20.5, "normal", 0, 10, "yellow", 12, 0, 0, 30, 6],
		[20.7, "normal", 0, 11, "yellow", -10, 0, 0, 30, 6],
		[20.7, "normal", 0, 11, "yellow", 10, 0, 0, 30, 6],
		[20.9, "normal", 0, 12, "yellow", -8, 0, 0, 30, 6],
		[20.9, "normal", 0, 12, "yellow", 8, 0, 0, 30, 6],
		[21.1, "normal", 0, 13, "yellow", -5, 0, 0, 30, 6],
		[21.1, "normal", 0, 13, "yellow", 5, 0, 0, 30, 6],
		[21.3, "normal", 0, 14, "yellow", -2, 0, 0, 30, 6],
		[21.3, "normal", 0, 14, "yellow", 2, 0, 0, 60, 6],
		[21.5, "normal", 0, 15, "yellow", 0, 0, 0, 60, 6],
		[22.4, "normal", 40, 9, "rainbow", -10, 0, 0, 130, 6],
		[22.4, "normal", -40, 9, "rainbow", 10, 0, 0, 130, 6],
		[22.4, "normal", -45, 9, "rainbow", 10, 0, 0, 200, 8],

		[26, "textSpeaki", 0, 9, "yellow", 0],
		[27, "textMMO", 0, 6, "yellow", 0],

		[27.5, "normal", 40, 9, "blue", 0, 0, 0, 100],
		[27.8, "normal", 10, 13, "red", 0, -5, 0, 150],
		[28.3, "normal", -30, 11, "pink", 0],
		[28.5, "normal", -10, 15, "green", 0],
		[29.3, "normal", 10, 16, "blue", 0],

		[29.5, "normal", -40, 11, "red", 0, 0, 0, 100],
		[30, "normal", 15, 14, "blue", 0, 5],
		[30.5, "normal", 40, 8, "cyan", 0],
		[30.7, "normal", -10, 12, "green", -5],
		[31, "normal", 15, 10, "pink", -5],
		[31.3, "normal", 10, 11, "blue", 0],
		[31.6, "normal", -30, 12, "blue", -5],
		[31.9, "normal", 30, 11, "cyan", 0, 0, 0, 100],
		[32.3, "normal", -40, 9, "green", 0, 0, 0, 100],
		[32.5, "normal", 10, 16, "blue", 0, -5, 0, 150],
		[32.7, "normal", 15, 15, "red", 0, 5],
		[32.9, "normal", -30, 11, "pink", 0],
		[33.4, "normal", -24, 12, "green", 0],
		[33.6, "normal", 40, 13, "blue", 0],
		[34, "normal", 25, 11, "red", 0],
		[34.3, "normal", 0, 9, "white", 0, 0, 0, 50, 4],
		[39, "textGMDT", 0, 9, "yellow", 0],
		[39, "heart", 0, 9, "yellow", 0]
	]
];

var sparklerPositions = [
	[-1.9, -8.4, 1.6],
	[-9.7, -7,   1.6],
	[-8.75, -2.6, 2.0],
	[-7.23, -1.82, 2.45],
	[1.9, -8.4, 1.6],
	[9.7, -7,   1.6],
	[8.75, -2.6, 2.0],
	[7.23, -1.82, 2.45]
];

// Add sparkler waves automatically at the start of show #2 (0.0s - 3.0s)
const _fwAa = 0.8;
const _fwBb = _fwAa / 4; 
for (let group = 0; group < 4; group++) {
	for (let i = 0; i < sparklerPositions.length; i++) {
		const time = group * _fwAa + (i % 4) * _fwBb;
		const pos = sparklerPositions[i];
		SPKMOD_FW_SHOW[1].push([
			time,
			"fountain",
			0,
			pos[2],
			"yellow",
			pos[0],
			pos[1],
			0.2,
			80
		]);
	}
}

var SPKMOD_FW_COLORS = {
	white: [255, 255, 255], yellow: [255, 214, 10], red: [255, 60, 50], green: [70, 255, 110],
	blue: [70, 130, 255], pink: [255, 90, 200], orange: [255, 150, 30], cyan: [60, 235, 255]
};

const fireworkSpawnOffset = [
	{ x: 0, y: 0, z: 0 },   // show 1 (index 0)
	{ x: 16, y: 0, z: 1 }   // show 2 (index 1)
];

const SPKMOD_FW_ADJ = {
	burstSparkCount: 150,
	textBurstSparkCount: 400, 
	riserShotSize: 1.6,
	riserShotSizeTail: 0.8,
	normalParticleSize: 0.8, 
	textParticleSize: 0.5
};

const SPKMOD_FW_TIMES = {
	fwClimbSpeed: 8,
	textPause: 1.5,
	normalPause: 0.1,
	textBurst: 1.3,
	textHold: 10,
	textFadeDelayMax: 1,
	textFade: 4,
	normalLife: 5
};

var SPKMOD_FW_FOUNTAIN = {
	rate: 100,
	coneDeg: 25,
	speedMin: 5,
	speedMax: 15,
	gravity: 25,
	life: 0.8,
	size: 0.7
};

var SPKMOD_FW_SHAPES = {
	text100: {
		worldWidth: 11, particles: 250, colors: ["white", "yellow"], canvasScale: 2,
		draw: (ctx, w, h) => { 
			const thicknessFont = "900";
			const heightText = "200px";
			ctx.font = thicknessFont + " " + heightText + " Arial, sans-serif";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff"; 
			ctx.strokeStyle = "#fff"; 
			ctx.lineWidth = 10;   
			ctx.lineJoin = "round";
			ctx.strokeText("100", w / 2, h / 2);
		}
	},
	textDays: {
		worldWidth: 10, particles: 200, colors: ["white", "yellow"], canvasScale: 3,
		draw: (ctx, w, h) => { 
			const thicknessFont = "900";
			const heightText = "150px";
			ctx.font = thicknessFont + " " + heightText + " Arial, sans-serif";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff"; 
			ctx.strokeStyle = "#fff"; 
			ctx.lineWidth = 8;   
			ctx.lineJoin = "round";
			ctx.strokeText("DAYS", w / 2, h / 2);
		}
	},
	textSpeaki: {
		worldWidth: 15, particles: 300, colors: ["white", "yellow"], canvasScale: 3,
		draw: (ctx, w, h) => { 
			const thicknessFont = "900";
			const heightText = "150px";
			ctx.font = thicknessFont + " " + heightText + " Arial, sans-serif";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff"; 
			ctx.strokeStyle = "#fff"; 
			ctx.lineWidth = 8;   
			ctx.lineJoin = "round";
			ctx.strokeText("SPEAKI", w / 2, h / 2);
		}
	},
	textMMO: {
		worldWidth: 9, particles: 180, colors: ["white", "yellow"], canvasScale: 3,
		draw: (ctx, w, h) => { 
			const thicknessFont = "900";
			const heightText = "150px";
			ctx.font = thicknessFont + " " + heightText + " Arial, sans-serif";
			ctx.textAlign = "center"; 
			ctx.letterSpacing = "20px";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff"; 
			ctx.strokeStyle = "#fff"; 
			ctx.lineWidth = 5;   
			ctx.lineJoin = "round";
			ctx.strokeText("MMO", w / 2, h / 2);
		}
	},
	textGMDT: {
		worldWidth: 15, particles: 400, colors: ["white", "yellow"], canvasScale: 3,
		draw: (ctx, w, h) => { 
			const thicknessFont = "900";
			const heightText = "200px";
			ctx.font = thicknessFont + " " + heightText + " Arial, sans-serif";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff"; 
			ctx.strokeStyle = "#fff"; 
			ctx.lineWidth = 10;   
			ctx.lineJoin = "round";
			ctx.strokeText("GMDT", w / 2, h / 2);
		}
	},
	heart: {
		worldWidth: 15, particles: 300, colors: ["red", "pink"], canvasScale: 1,
		draw: (ctx, w, h) => {
			ctx.lineWidth = 15;
			ctx.strokeStyle = "#fff";
			ctx.fillStyle = "#fff";
			const cx = w / 2, cy = h / 2;
			ctx.beginPath();
			ctx.moveTo(cx, cy + 72);
			ctx.bezierCurveTo(cx - 140, cy - 10, cx - 70, cy - 110, cx, cy - 40);
			ctx.bezierCurveTo(cx + 70, cy - 110, cx + 140, cy - 10, cx, cy + 72);
			ctx.stroke();
		}
	}
};

var spkmodFw = null;
var spkmodFwSprites = {};
var spkmodFwShapeCache = {};

function spkmodFwSprite(colorName) {
	if (spkmodFwSprites[colorName]) return spkmodFwSprites[colorName];
	const color = (SPKMOD_FW_COLORS[colorName] || SPKMOD_FW_COLORS.white).join(",");
	const canvas = document.createElement("canvas");
	const size = 24;
	const halfsize = size / 2;
	canvas.width = canvas.height = size;
	const context = canvas.getContext("2d");
	const gradient = context.createRadialGradient(halfsize, halfsize, 0, halfsize, halfsize, halfsize);
	gradient.addColorStop(0, "rgba(255,255,255,1)");
	gradient.addColorStop(0.12, "rgba(" + color + ",0.95)");
	gradient.addColorStop(0.3, "rgba(" + color + ",0.5)");
	gradient.addColorStop(0.6, "rgba(" + color + ",0.14)"); 
	gradient.addColorStop(1, "rgba(" + color + ",0)");
	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);
	return (spkmodFwSprites[colorName] = canvas);
}

function spkmodFwShapePoints(name) {
	if (spkmodFwShapeCache[name]) return spkmodFwShapeCache[name];
	const shape = SPKMOD_FW_SHAPES[name];
	if (!shape) return [];
	const realWorldTextScale = shape.worldWidth;

	const cv = document.createElement("canvas");
	const ctx = cv.getContext("2d");
	const width = 360 * shape.canvasScale;
	const height = 240; 
	cv.width = width;
	cv.height = height; 
	shape.draw(ctx, width, height);                       
	
	const imageDataPoint = ctx.getImageData(0, 0, width, height).data;
	function spkmodFwCheckPixel(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) return false;
		const pixel = Math.floor(y) * width + Math.floor(x);
		const alpha = imageDataPoint[pixel * 4 + 3];                   
		return alpha > 128;
	}
	let minX = width, maxX = 0, area = 0;
	for (let y = 0; y < height; y += 2) {
		for (let x = 0; x < width; x += 2) {
			if (spkmodFwCheckPixel(x, y)) {
				area++; 
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x);
			}
		}
	}
	if (maxX <= minX) return (spkmodFwShapeCache[name] = []);
	area *= 4; 
	const particleInterval = Math.max(2, Math.sqrt(area / shape.particles)); 
	const scaleFactorRealWorld = realWorldTextScale / (maxX - minX);
	const textMiddle = (minX + maxX) / 2;
	const pts = [];
	
	for (let y = 0, row = 0; y < height; y += particleInterval, row++) {  
		for (let x = (row % 2) * particleInterval / 2; x < width; x += particleInterval) {  
			const fwPosX = x + (Math.random() - 0.5) * particleInterval * 0.5;
			const fwPosY = y + (Math.random() - 0.5) * particleInterval * 0.5;
			if (spkmodFwCheckPixel(fwPosX, fwPosY)) {
				pts.push({ 
					u: (fwPosX - textMiddle) * scaleFactorRealWorld,
					v: (height / 2 - fwPosY) * scaleFactorRealWorld
				});
			}
		}
	}
	return (spkmodFwShapeCache[name] = pts);
}

function spkmodFwTextPoints() {
	return spkmodFwShapePoints("text100");
}

var spkmodFwHiddenCinema = false;

window.spkmodSetCinemaEnabled = function(enabled, persist = true, fromFirework = false) {
	if (!fromFirework) {
		spkmodFwHiddenCinema = false;
	}
	const nextEnabled = !!enabled;
	spkmodCinemaConfig.enabled = nextEnabled;
	if (persist && window.localStorage) {
		try { localStorage.setItem("spkmod-cinema-enabled", nextEnabled ? "true" : "false"); } catch (_) {}
	}
	if (typeof lunPanelElements !== "undefined" && lunPanelElements && lunPanelElements.cinemaToggleInput) {
		lunPanelElements.cinemaToggleInput.checked = nextEnabled;
	}
	if (!nextEnabled) {
		spkmodCinemaInZone = false;
		spkmodSendYtCommand('pauseVideo');
		spkmodSendYtCommand('mute');
		spkmodSendYtCommand('setVolume', [0]);
		spkmodCinemaLastVolume = 0;
		if (spkmodCinemaContainer) spkmodCinemaContainer.style.display = 'none';
		if (spkmodCinemaFrameMesh) spkmodCinemaFrameMesh.visible = false;
		if (spkmodCinemaOcclusionCanvas) spkmodCinemaOcclusionCanvas.style.display = 'none';
		if (typeof window.spkmodSuppressGameBgm === 'function') {
			window.spkmodSuppressGameBgm(false, "cinema");
		}
		if (spkmodCinemaModeActive && typeof window.spkmodToggleCinemaMode === 'function') {
			window.spkmodToggleCinemaMode(false);
		}
		if (typeof spkmodUpdateCinemaTopBar === 'function') spkmodUpdateCinemaTopBar(false);
		if (typeof window.spkmodUpdateCinemaFloatingPill === 'function') {
			window.spkmodUpdateCinemaFloatingPill(false);
		} else if (typeof spkmodUpdateCinemaFloatingPill === 'function') {
			spkmodUpdateCinemaFloatingPill(false);
		}
	} else {
		if (!spkmodCinemaScreenObject && typeof spkmodInitCinema === 'function') {
			spkmodInitCinema();
		}
	}
	if (typeof spkmodUpdateCinemaPlaybackUI === "function") spkmodUpdateCinemaPlaybackUI();
};

function spkmodFwStop() {
	if (spkmodFw) {
		cancelAnimationFrame(spkmodFw.raf);
		if (spkmodFw.canvas && spkmodFw.canvas.parentNode) {
			spkmodFw.canvas.remove();
		}
		spkmodFw = null;
	}
	// Immediately silence and disconnect all active or decaying firework sounds
	if (spkmodFwMasterGain && spkmodFwAudioCtx) {
		try {
			spkmodFwMasterGain.gain.setValueAtTime(0, spkmodFwAudioCtx.currentTime);
			spkmodFwMasterGain.disconnect();
		} catch (_) {}
		spkmodFwMasterGain = null;
	}
	// Restore cinema screen if it was automatically hidden for the first firework show
	if (spkmodFwHiddenCinema) {
		spkmodFwHiddenCinema = false;
		if (typeof window.spkmodSetCinemaEnabled === "function") {
			window.spkmodSetCinemaEnabled(true, false, true);
		}
	}
}
window.spkmodStopCinemaFireworks = spkmodFwStop;

window.spkmodLaunchCinemaFireworks = function(arg1 = 0, arg2 = 0) {
	let loop = false;
	let idx = 0;
	if (typeof arg1 === "boolean") {
		loop = arg1 === true;
		idx = parseInt(arg2, 10) || 0;
	} else {
		idx = parseInt(arg1, 10) || 0;
		loop = arg2 === true;
	}
	if (spkmodFw) {
		const wasSameShow = spkmodFw.showIndex === idx;
		spkmodFwStop();
		if (wasSameShow) return;
	}
	spkmodGetFwAudioContext();
	if (typeof window.spkmodSetNightMode === "function") {
		window.spkmodSetNightMode(true);
	}
	const THREE = window.THREE;
	const cam = typeof gameState !== "undefined" && gameState ? gameState.camera : null;
	const zid = spkmodGetExactCinemaZone();
	if (zid !== 1 || (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame())) {
		if (typeof chatLog === 'function') chatLog("🎆 Fireworks show can only be viewed in Zone 1 (Monatium)!");
		return;
	}

	// Disable the cinema screen (blackscreen) during the first firework show
	if (idx === 0 && spkmodCinemaConfig.enabled) {
		spkmodFwHiddenCinema = true;
		window.spkmodSetCinemaEnabled(false, false, true);
	}

	const spawnOffset = fireworkSpawnOffset[idx] || fireworkSpawnOffset[0] || { x: 0, y: 0, z: 0 };
	var fwStartPos = Object.assign({}, spkmodCinemaConfig.pos);
	fwStartPos = {
		x: fwStartPos.x + spawnOffset.x,
		y: fwStartPos.y + spawnOffset.y,
		z: fwStartPos.z + spawnOffset.z
	};
	if (!THREE || !cam || !fwStartPos) return;

	const canvas = document.createElement("canvas"); 
	canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 5;"; 
	document.body.appendChild(canvas);
	const ctx = canvas.getContext("2d");
	const names = Object.keys(SPKMOD_FW_COLORS);
	const v = new THREE.Vector3();
	let t0 = performance.now();

	const showData = Array.isArray(SPKMOD_FW_SHOW[idx]) ? SPKMOD_FW_SHOW[idx] : (SPKMOD_FW_SHOW[0] || []);
	const buildShots = () => showData.map(r => {
		const h = r[3];
		const angle = r[2];
		const angleInRadians = angle * Math.PI / 180;
		const off = h * Math.tan(angleInRadians);
		return {
			start: r[0], 
			text: r[1] === "text", 
			pts: null,  
			color: r[4],
			x: fwStartPos.x + (r[6] != null ? r[6] : 0),
			y: h, 
			z: fwStartPos.z + (r[5] != null ? r[5] : 0), 
			offset: off,
			rise: (h / Math.cos(angleInRadians)) / SPKMOD_FW_TIMES.fwClimbSpeed,
			type: r[1],
			isShape: !!SPKMOD_FW_SHAPES[r[1]],
			duration: (r[7] != null ? r[7] : 5),
			particles: (r[8] != null ? r[8] : 100),
			burstSize: (r[9] != null ? r[9] : 6),
			soundLaunched: false,
			sparks: null
		};
	});

	let shots = buildShots();

	const glow = (x, y, z, size, alpha, sprite, focal, W, H) => {
		if (alpha <= 0.003) return;
		v.set(x, y, z).applyMatrix4(cam.matrixWorldInverse); 
		const depth = -v.z;
		if (depth < 0.5) return;
		v.set(x, y, z).project(cam);
		const px = Math.max(3, Math.min(900, size * focal / depth));
		ctx.globalAlpha = Math.min(1, alpha);
		ctx.drawImage(sprite, (v.x * 0.5 + 0.5) * W - px / 2, (-v.y * 0.5 + 0.5) * H - px / 2, px, px);
	};

	const frame = now => {
		// Stop immediately and cut audio if player changes map or enters minigame
		const curZone = spkmodGetExactCinemaZone();
		if (curZone !== 1 || (typeof spkmodIsInMinigame === "function" && spkmodIsInMinigame())) {
			spkmodFwStop();
			return;
		}

		const t = (now - t0) / 1000;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const W = canvas.width, H = canvas.height;
		ctx.globalCompositeOperation = "lighter";
		cam.updateWorldMatrix(true, false);
		cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
		const focal = (H / 2) / Math.tan((cam.fov || 50) * Math.PI / 360);
		let alive = false;

		for (const s of shots) {
			const a = t - s.start;
			if (a < 0) { alive = true; continue; }

			// Ground sparklers / fountains
			if (s.type === "fountain") {
				const F = SPKMOD_FW_FOUNTAIN;
				const dur = s.duration;
				if (a > dur + F.life) continue;
				alive = true;
				if (!s.soundBursted) {
					s.soundBursted = true;
					spkmodPlayFwCrackleSound(s.x, s.y, s.z);
				}
				if (!s.sparks) {
					s.sparks = [];
					const n = Math.floor(s.particles * dur);
					for (let i = 0; i < n; i++) {
						const tilt = Math.random() * F.coneDeg * Math.PI / 180;
						const around = Math.random() * Math.PI * 2;
						const speed = F.speedMin + Math.random() * (F.speedMax - F.speedMin);
						s.sparks.push({
							t0: (i + Math.random()) / s.particles,
							vx: Math.sin(tilt) * Math.cos(around) * speed,
							vy: Math.cos(tilt) * speed,
							vz: Math.sin(tilt) * Math.sin(around) * speed,
							life: F.life * (0.7 + Math.random() * 0.3)
						});
					}
				}

				const sprite = spkmodFwSprite(s.color);
				for (const p of s.sparks) {
					const age = a - p.t0;
					if (age < 0 || age > p.life) continue;
					const y = s.y + p.vy * age - 0.5 * F.gravity * age * age;
					glow(s.x + p.vx * age, y, s.z + p.vz * age, F.size, 1 - age / p.life, sprite, focal, W, H);
				}
				continue;
			}

			const endPos = s.z + s.offset;
			const startPos = s.z;
			
			// Rising sound effect
			if (!s.soundLaunched) {
				s.soundLaunched = true;
				spkmodPlayFwLaunchSound(s.x, 0, startPos, s.rise);
			}

			const T = SPKMOD_FW_TIMES;
			const pause = s.isShape ? T.textPause : T.normalPause;
			const b = a - s.rise - pause;
			const shotLength = s.isShape ? T.textBurst + T.textHold + T.textFadeDelayMax + T.textFade : T.normalLife; 
			if (b > shotLength) continue;
			alive = true;

			// Rocket trail climb
			if (a < s.rise + 0.25) {
				const fade = a < s.rise ? 1 : 1 - (a - s.rise) / 0.25;
				for (let i = 0; i < 5; i++) {
					const p = Math.max(0, Math.min(1, (a - i * 0.018) / s.rise));
					glow((fwStartPos.x + (s.x - fwStartPos.x) * p), s.y * p, startPos + (endPos - startPos) * p,
						i ? SPKMOD_FW_ADJ.riserShotSizeTail * (1 - i / 14) : SPKMOD_FW_ADJ.riserShotSize, (i ? 0.55 * (1 - i / 10) : 1) * fade, spkmodFwSprite("orange"), focal, W, H);
				}
				continue;
			}
			if (b < 0) continue;

			// Shape burst ("100", "GMDT", "heart", etc.)
			if (s.isShape) {
				if (!s.pts) {
					spkmodPlayFwBurstSound(s.x, s.y, endPos, true);
					spkmodPlayFwCrackleSound(s.x, s.y, endPos);
					spkmodPlayFwSparkleSound(s.x, s.y, endPos);
					const colors = SPKMOD_FW_SHAPES[s.type]?.colors || ["white", "yellow"];
					s.pts = spkmodFwShapePoints(s.type).map(p => ({
						u: (s.type === "text100" || s.type === "textDays" ? -p.u : p.u), v: p.v, tw: Math.random() * 6.28, fd: Math.random(),
						c: colors[(Math.random() * colors.length) | 0]
					}));
				}
				const e = 1 - Math.pow(1 - Math.min(1, b / 1.3), 3);
				const k = e * (b > 1.3 ? 1 + 0.012 * (b - 1.3) : 1);
				for (const p of s.pts) {
					const al = b > 9.3 + p.fd ? 1 - (b - 9.3 - p.fd) / 2.5 : 1;
					glow(s.x, s.y + p.v * k, endPos + p.u * k,
						SPKMOD_FW_ADJ.normalParticleSize, al * (0.8 + 0.2 * Math.sin(now * 0.012 + p.tw)), spkmodFwSprite(p.c), focal, W, H);
				}
			} else {
				// Normal burst
				if (!s.pts) {
					spkmodPlayFwBurstSound(s.x, s.y, endPos, false);
					if (s.color === "rainbow" || Math.random() < 0.45) {
						spkmodPlayFwCrackleSound(s.x, s.y, endPos);
					}
					s.pts = [];
					for (let i = 0; i < s.particles; i++) {
						const zz = Math.random() * 2 - 1, th = Math.random() * 6.28, r = Math.sqrt(1 - zz * zz), sp = s.burstSize;
						s.pts.push({
							vx: r * Math.cos(th) * sp, vy: zz * sp, vz: r * Math.sin(th) * sp, tw: Math.random() * 6.28, life: 0.6 + Math.random() * 0.4,
							c: s.color === "rainbow" ? names[(Math.random() * names.length) | 0] : (Math.random() < 0.2 ? "white" : s.color)
						});
					}
				}
				const f = (1 - Math.exp(-1.7 * b)) / 1.7;
				if (b < 0.25) glow(s.x, s.y, endPos, 3, 1 - b / 0.25, spkmodFwSprite("white"), focal, W, H);
				for (const p of s.pts) {
					const L = 3.2 * p.life, x = b / L;
					if (x > 1) continue;
					const al = (x < 0.25 ? 1 : Math.pow(1 - (x - 0.25) / 0.75, 1.6)) * Math.min(1, b / 0.08) * (0.75 + 0.25 * Math.sin(now * 0.015 + p.tw));
					glow(s.x + p.vx * f, s.y + (p.vy + 1.4) * f - 1.4 * b, endPos + p.vz * f, SPKMOD_FW_ADJ.normalParticleSize, al, spkmodFwSprite(p.c), focal, W, H);
				}
			}
		}

		if (shots.length === 0) {
			spkmodFwStop();
			return;
		}
		if (!alive) {
			if (loop && spkmodFw) {
				t0 = performance.now();
				shots = buildShots();
				spkmodFw.raf = requestAnimationFrame(frame);
				return;
			}
			spkmodFwStop();
			return;
		}
		spkmodFw.raf = requestAnimationFrame(frame);
	};

	spkmodFw = { canvas: canvas, raf: requestAnimationFrame(frame), showIndex: idx };
};

// Start cinema loop immediately
spkmodStartCinemaLoop();

// Load playlists and initialize
Promise.all([spkmodLoadMoviesPlaylist(), spkmodLoadSongsPlaylist()]).then(() => {
	if (typeof gameState !== 'undefined' && gameState?.camera && gameState?.scene && window.THREE) {
		spkmodInitCinema();
	}
}).catch(() => {});



