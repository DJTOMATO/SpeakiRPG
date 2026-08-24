const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut } = require('electron');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const RPC = require('discord-rpc');
const clientId = '861430403955949569';

const rpc = new RPC.Client({ transport: 'ipc' });
const rpcTimestamp = Date.now()

const faviconUrl = 'https://bae.lena.moe/NZK9hLUtkKij.png';

async function fetchFavicon(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}

let mainWindow;
let icon;
let statsInterval = null;
let statsTimeout = null;
let lastUpdateTime = 0;
const MIN_UPDATE_INTERVAL_MS = 10000; // minimum 10s between updates

async function updateDiscordActivity(level, playerName, exp = null, location = null, channel = null) {
  const setActivity = async () => {
    const detailsText = playerName ? (location ? `${playerName} • ${location}` : playerName) : (location ? `Unknown Player • ${location}` : 'Unknown Player');
    let stateText = level ? `Level ${String(level)}` : 'In-Game';
    if (exp) {
      stateText += ` • ${exp}`;
    }

    return rpc.setActivity({
      details: detailsText,
      state: stateText,
      startTimestamp: rpcTimestamp,
      largeImageKey: 'logo',
      largeImageText: 'Speaki RPG',
      smallImageKey: 'logo',
      smallImageText: 'RPG',
      instance: false,
      buttons: [
        { label: 'Play Speaki MMO', url: 'https://speakirpg.overture.io.kr/' },
        { label: 'Download Client', url: 'https://github.com/DJTOMATO/SpeakiRPG/releases' }
      ]
    });
  };

  try {
    await setActivity();
    console.log('RPC activity updated:', { level, playerName, channel });
  } catch (err) {
    console.error('RPC setActivity failed, attempting login...', err);
    // try to login and set activity if rpc wasn't ready
    try {
      await rpc.login({ clientId });
      await setActivity();
      console.log('RPC activity updated after login:', { level, playerName, channel });
    } catch (err2) {
      console.error('Failed to update RPC activity:', err2);
    }
  }
}

async function capturePageStats() {
  if (!mainWindow || mainWindow.isDestroyed()) return { level: null, playerName: null, exp: null, location: null };
  try {
    return await mainWindow.webContents.executeJavaScript(`
      (function() {
        const nameEl = document.querySelector('.sr-player-card__name');
        const levelEl = document.querySelector('.sr-player-card__portrait-wrap .sr-player-card__lv-badge');
        const expEl = document.querySelector('.sr-player-card__exp-track');
        const locationEl = document.querySelector('.sr-minimap-frame__caption');

        // Find current channel
        let channel = null;
        const channelItems = document.querySelectorAll('.sr-list-item');
        for (const item of channelItems) {
          const actionBtn = item.querySelector('.sr-list-item__action button');
          if (actionBtn && actionBtn.innerText.trim().toLowerCase() === 'current') {
            const titleEl = item.querySelector('.sr-list-item__title');
            if (titleEl) {
              // Extracts the number from "Channel 1", etc.
              const match = titleEl.innerText.match(/\\d+/);
              if (match) {
                channel = match[0] + ' Ch';
              }
            }
            break;
          }
        }

        return {
          playerName: nameEl ? nameEl.innerText.trim() : null,
          level: levelEl ? levelEl.innerText.trim() : null,
          exp: expEl ? expEl.getAttribute('title') || expEl.innerText.trim() : null,
          location: locationEl ? locationEl.innerText.trim() : null,
          channel: channel
        };
      })();
    `, true);
  } catch (err) {
    console.error('Error capturing page stats:', err);
    return { level: null, playerName: null, exp: null, location: null, channel: null };
  }
}

// ---------------------------------------------------------------------------
// SpeakiMod injection
// ---------------------------------------------------------------------------

const SPEAKI_SCRIPT_RE = /\/index-[^/]+\.js(?:\?.*)?$/;
const SPEAKI_CONNECT_PATTERN = 'k.connect(';
const SPEAKI_INJECT_DELAY_MS = 3000;

let speakiMessageHandlerRegistered = false;
let speakiPollerRunning = false;

function speakiDebugger() {
  if (!mainWindow || mainWindow.isDestroyed()) return null;
  return mainWindow.webContents.debugger;
}

// Returns [{ lineNumber, columnNumber }] for every occurrence of `k.connect(` in the bundle.
function speakiFindConnectLocations(source) {
  const locations = [];
  let index = source.indexOf(SPEAKI_CONNECT_PATTERN);
  while (index !== -1) {
    let line = 0;
    let lastNewline = -1;
    for (let i = 0; i < index; i++) {
      if (source.charCodeAt(i) === 10) {
        line++;
        lastNewline = i;
      }
    }
    locations.push({ lineNumber: line, columnNumber: index - lastNewline - 1 });
    index = source.indexOf(SPEAKI_CONNECT_PATTERN, index + 1);
  }
  return locations;
}

// Automates the README's manual breakpoint: set a breakpoint on `k.connect(` with
// condition `!(window.gameState = k)` so the game state is captured on next load.
async function armSpeakiBreakpoint() {
  const dbg = speakiDebugger();
  if (!dbg) return;

  if (!speakiMessageHandlerRegistered) {
    speakiMessageHandlerRegistered = true;
    dbg.on('message', async (event, method, params) => {
      if (method !== 'Debugger.scriptParsed') return;
      if (!SPEAKI_SCRIPT_RE.test(params.url || '')) return;

      let source;
      try {
        const res = await dbg.sendCommand('Debugger.getScriptSource', { scriptId: params.scriptId });
        source = res.scriptSource;
      } catch (err) {
        return;
      }

      if (!source || !source.includes(SPEAKI_CONNECT_PATTERN)) return;

      const locations = speakiFindConnectLocations(source);
      for (const loc of locations) {
        try {
          await dbg.sendCommand('Debugger.setBreakpointByUrl', {
            lineNumber: loc.lineNumber,
            columnNumber: loc.columnNumber,
            url: params.url,
            condition: '!(window.gameState = k)'
          });
        } catch (err) {
          console.error('[SpeakiMod] setBreakpointByUrl failed:', err);
        }
      }
      console.log('[SpeakiMod] Breakpoint armed on', params.url, 'at', locations.length, 'location(s)');
    });
  }

  try {
    if (!dbg.isAttached()) {
      dbg.attach('1.3');
    }
    await dbg.sendCommand('Debugger.enable');
    console.log('[SpeakiMod] Debugger enabled');
  } catch (err) {
    console.error('[SpeakiMod] Debugger attach/enable failed:', err);
  }
}

// Reads the local SpeakiMod.js and injects it into the game page.
function injectSpeakiMod(force = false) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const modPath = path.join(__dirname, 'SpeakiMod.js');
  let mod;
  try {
    mod = fs.readFileSync(modPath, 'utf8');
  } catch (err) {
    console.error('[SpeakiMod] Could not read SpeakiMod.js:', err);
    return;
  }

  const injection = `
    (() => {
      if (window.__SPEAKIMOD_LOADED__ && !${force}) {
        console.log('[SpeakiMod] Already loaded');
        return;
      }
      if (!window.gameState) {
        console.error('[SpeakiMod] gameState is not available');
        return;
      }
      window.speakiInjectorVer = 'electron';
      const __spkAlert = window.alert;
      window.alert = (...args) => console.warn('[SpeakiMod alert]', ...args);
      try {
        ${mod}
        window.__SPEAKIMOD_LOADED__ = true;
        console.log('[SpeakiMod] Loaded!');
      } catch (err) {
        console.error('[SpeakiMod] Injection error:', err);
      } finally {
        window.alert = __spkAlert;
      }
    })();
  `;

  mainWindow.webContents.executeJavaScript(injection, true)
    .then(() => console.log('[SpeakiMod] Injection dispatched'))
    .catch((err) => console.error('[SpeakiMod] Injection failed:', err));
}

// Floating top-right reload button (injected into the game page).
function addSpeakiModMenu() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const menu = `
    (() => {
      if (document.getElementById('speakimod-menu')) return;
      const wrap = document.createElement('div');
      wrap.id = 'speakimod-menu';
      wrap.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999999;display:flex;gap:6px;';
      const btn = document.createElement('button');
      btn.innerText = '↻ Reload SpeakiMod';
      btn.style.cssText = 'background:rgba(0,0,0,.8);color:#eee;border:3px solid #ddd;border-radius:8px;padding:5px 10px;font-size:13px;cursor:pointer;';
      btn.onclick = () => { if (window.electronAPI) window.electronAPI.reloadSpeakiMod(); };
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
    })();
  `;

  mainWindow.webContents.executeJavaScript(menu, true)
    .catch((err) => console.error('[SpeakiMod] Menu injection failed:', err));
}

// Polls until `window.gameState` is available, then injects the mod.
function startSpeakiPoller() {
  if (speakiPollerRunning) return;
  speakiPollerRunning = true;

  const startedAt = Date.now();
  const POLL_MS = 1000;
  const TIMEOUT_MS = 60000;

  const check = async () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      speakiPollerRunning = false;
      return;
    }

    let hasState = false;
    try {
      hasState = await mainWindow.webContents.executeJavaScript('!!window.gameState', true);
    } catch (err) {
      /* navigation in progress, retry */
    }

    if (hasState) {
      speakiPollerRunning = false;
      console.log('[SpeakiMod] gameState detected, injecting in', SPEAKI_INJECT_DELAY_MS, 'ms');
      setTimeout(() => {
        injectSpeakiMod(false);
        addSpeakiModMenu();
      }, SPEAKI_INJECT_DELAY_MS);
      return;
    }

    if (Date.now() - startedAt > TIMEOUT_MS) {
      speakiPollerRunning = false;
      console.error('[SpeakiMod] Timed out waiting for gameState');
      addSpeakiModMenu();
      return;
    }

    setTimeout(check, POLL_MS);
  };

  check();
}

// One-shot setup: once the page finishes loading, arm the breakpoint, then reload so
// it fires and captures gameState.
async function setupSpeakiMod() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const run = async () => {
    await armSpeakiBreakpoint();
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.reload();
      }
    }, 1000);
    startSpeakiPoller();
  };

  // Wait for the current navigation to settle before attaching the debugger.
  if (mainWindow.webContents.isLoading()) {
    mainWindow.webContents.once('did-finish-load', run);
  } else {
    run();
  }
}

// Reload the game page and re-inject SpeakiMod. Used by the reload button and F5/Ctrl+R.
async function reloadSpeakiMod() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  console.log('[SpeakiMod] Reloading and re-injecting');
  await armSpeakiBreakpoint();
  mainWindow.reload();
  startSpeakiPoller();
}

async function createWindow() {
  const faviconBase64 = await fetchFavicon(faviconUrl);
  icon = faviconBase64 ? nativeImage.createFromDataURL(`data:image/png;base64,${faviconBase64}`) : null;

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    icon: icon
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    app.on('browser-window-focus', () => {
      globalShortcut.register('F5', () => {
        reloadSpeakiMod();
      });
      globalShortcut.register('CommandOrControl+R', () => {
        reloadSpeakiMod();
      });
      globalShortcut.register('CommandOrControl+Shift+D', async () => {
        try {
          const stats = await capturePageStats();
          console.log('Captured page stats shortcut:', stats);
          if (stats.playerName || stats.level || stats.exp || stats.location || stats.channel) {
            await updateDiscordActivity(stats.level, stats.playerName, stats.exp, stats.location, stats.channel);
          } else {
            console.log('No player stats were found in the DOM for the manual refresh.');
          }
        } catch (err) {
          console.error('Error updating RPC from page stats:', err);
        }
      });
    })

    app.on('browser-window-blur', () => {
      globalShortcut.unregisterAll()
    })
  });
}

app.whenReady().then(createWindow);


const activities = [
  "Playing Speaki RPG",
  "Exploring the world chowa chowa",
  "Fighting monsters cuayo",
  "Completing quests ayo",
  "Watching SPEAKIGOD dead at the entrance",
  "AUUUUUUUUUUUUUUUU",
  "SUPIKI",
  "SPK",
  "Looking for the house deed",
  "I am 2 kilobytes"
];

activity = activities[Math.floor(Math.random() * activities.length)];

ipcMain.on('load-site', async (event, url) => {
  mainWindow.loadURL(url);

  rpc.on('ready', () => {
    rpc.setActivity({
      details: activity,
      state: 'Main Menu',
      startTimestamp: Date.now(),
      largeImageKey: 'logo',
      largeImageText: 'Auuu',
      smallImageKey: 'logo',
      smallImageText: 'Spk',
      instance: false,
    });
  });

  rpc.login({ clientId }).catch(console.error);

  // clear previous timers if any (on re-load)
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
  if (statsTimeout) {
    clearTimeout(statsTimeout);
    statsTimeout = null;
  }

  // helper to update RPC from the current page DOM
  const triggerStatsUpdate = async () => {
    try {
      const stats = await capturePageStats();
      console.log('Auto capture page stats:', stats);
      if (stats.playerName || stats.level || stats.exp || stats.location || stats.channel) {
        const now = Date.now();
        if (now - lastUpdateTime > MIN_UPDATE_INTERVAL_MS) {
          lastUpdateTime = now;
          await updateDiscordActivity(stats.level, stats.playerName, stats.exp, stats.location, stats.channel);
        } else {
          console.log('Update throttled; skipping');
        }
        return;
      }

      console.log('No player stats were found in the DOM.');
    } catch (err) {
      console.error('Error in triggerStatsUpdate:', err);
    }
  };

  // schedule: once 20s after load, then every 4 minutes
  statsTimeout = setTimeout(() => {
    triggerStatsUpdate();
    statsTimeout = null;
    statsInterval = setInterval(triggerStatsUpdate, 4 * 60 * 1000);
  }, 20 * 1000);

  mainWindow.webContents.session.webRequest.onCompleted(async (details) => {
 //pass
  });

  // Inject the local SpeakiMod.js once the game state is captured.
  setupSpeakiMod();
});

// Reload button: reload the page and re-inject the mod.
ipcMain.on('reload-speaki-mod', () => {
  reloadSpeakiMod();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    
  }
});

app.on('before-quit', () => {
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
  if (statsTimeout) {
    clearTimeout(statsTimeout);
    statsTimeout = null;
  }
  try {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents.debugger.isAttached()) {
      mainWindow.webContents.debugger.detach();
    }
  } catch (err) {
    /* ignore */
  }
  try {
    rpc.destroy();
  } catch (err) {
    console.log('[RPC] Already disconnected');
  }
});

