const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut, session } = require('electron');
const axios = require('axios');
const path = require('path');

// Allow Web Audio to play immediately on launch without waiting for user interaction
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
const RPC = require('discord-rpc');
const clientId = '861430403955949569';

const rpc = new RPC.Client({ transport: 'ipc' });
const rpcTimestamp = Date.now()

const faviconUrl = 'https://bae.lena.moe/NZK9hLUtkKij.png';

async function fetchFavicon(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 2000 });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    console.warn('Could not fetch remote favicon, using local fallback:', error.message || error);
    return null;
  }
}


let mainWindow;
let icon;
let statsInterval = null;
let statsTimeout = null;
let lastUpdateTime = 0;
const MIN_UPDATE_INTERVAL_MS = 10000; // minimum 10s between updates
let discordRpcEnabled = true;
let rpcReadyRegistered = false;

async function clearDiscordActivity() {
  try {
    if (rpc) {
      await rpc.clearActivity();
      console.log('Discord RPC activity cleared.');
    }
  } catch (err) {
    console.error('Failed to clear Discord activity:', err);
  }
}

async function updateDiscordActivity(level, playerName, exp = null, location = null) {
  if (!discordRpcEnabled) return;

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
    console.log('RPC activity updated:', { level, playerName });
  } catch (err) {
    console.error('RPC setActivity failed, attempting login...', err);
    // try to login and set activity if rpc wasn't ready
    try {
      await rpc.login({ clientId });
      if (discordRpcEnabled) {
        await setActivity();
        console.log('RPC activity updated after login:', { level, playerName });
      }
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
        let rpcSetting = true;
        try {
          if (window.localStorage && localStorage.getItem('spkmod-discord-rpc') === 'false') {
            rpcSetting = false;
          }
        } catch (_) {}
        return {
          playerName: nameEl ? nameEl.innerText.trim() : null,
          level: levelEl ? levelEl.innerText.trim() : null,
          exp: expEl ? expEl.getAttribute('title') || expEl.innerText.trim() : null,
          location: locationEl ? locationEl.innerText.trim() : null,
          discordRpcEnabled: rpcSetting
        };
      })();
    `, true);
  } catch (err) {
    console.error('Error capturing page stats:', err);
    return { level: null, playerName: null, exp: null, location: null };
  }
}

async function triggerStatsUpdate(force = false) {
  try {
    const stats = await capturePageStats();
    if (stats.discordRpcEnabled !== undefined && stats.discordRpcEnabled !== discordRpcEnabled) {
      discordRpcEnabled = stats.discordRpcEnabled;
      if (!discordRpcEnabled) {
        await clearDiscordActivity();
        return;
      }
    }

    if (!discordRpcEnabled) return;

    console.log('Auto capture page stats:', stats);
    if (stats.playerName || stats.level || stats.exp || stats.location) {
      const now = Date.now();
      if (force || now - lastUpdateTime > MIN_UPDATE_INTERVAL_MS) {
        lastUpdateTime = now;
        await updateDiscordActivity(stats.level, stats.playerName, stats.exp, stats.location);
      } else {
        console.log('Update throttled; skipping');
      }
      return;
    }

    console.log('No player stats were found in the DOM.');
    if (force) {
      try {
        await rpc.setActivity({
          details: activity,
          state: 'Main Menu',
          startTimestamp: rpcTimestamp,
          largeImageKey: 'logo',
          largeImageText: 'Auuu',
          smallImageKey: 'logo',
          smallImageText: 'Auuuuuuuuuuuuuuuuuuuuuuu',
          instance: false,
        });
      } catch (_) {}
    }
  } catch (err) {
    console.error('Error in triggerStatsUpdate:', err);
  }
}

ipcMain.on('set-discord-rpc', async (event, enabled) => {
  discordRpcEnabled = !!enabled;
  console.log('Discord RPC toggled via IPC:', discordRpcEnabled);
  if (!discordRpcEnabled) {
    await clearDiscordActivity();
  } else {
    await triggerStatsUpdate(true);
  }
});

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
      sandbox: false
    },
    autoHideMenuBar: true,
    icon: icon
  });

  const registerShortcuts = () => {
    globalShortcut.register('F5', () => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.reload();
    });
    globalShortcut.register('CommandOrControl+R', () => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.reload();
    });
    globalShortcut.register('F2', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.executeJavaScript(`
          (function() {
            const active = document.activeElement;
            if (active) {
              const tag = active.tagName ? active.tagName.toLowerCase() : "";
              if (tag === "input" || tag === "textarea" || active.isContentEditable) {
                return;
              }
            }
            if (typeof toggleSettingsModal === "function") {
              toggleSettingsModal();
            } else {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "F2", code: "F2", keyCode: 113, which: 113, bubbles: true, cancelable: true }));
            }
          })();
        `).catch(() => {});
      }
    });
    globalShortcut.register('CommandOrControl+Shift+D', async () => {
      try {
        if (!discordRpcEnabled) {
          console.log('Discord RPC is disabled, skipping manual refresh.');
          return;
        }
        const stats = await capturePageStats();
        console.log('Captured page stats shortcut:', stats);
        if (stats.playerName || stats.level || stats.exp || stats.location) {
          await updateDiscordActivity(stats.level, stats.playerName, stats.exp, stats.location);
        } else {
          console.log('No player stats were found in the DOM for the manual refresh.');
        }
      } catch (err) {
        console.error('Error updating RPC from page stats:', err);
      }
    });
  };

  mainWindow.on('focus', () => {
    registerShortcuts();
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-minimized', false);
      }
    } catch (_) {}
  });

  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll();
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (!mainWindow.webContents.isDevToolsFocused()) {
          mainWindow.webContents.send('window-minimized', true);
        }
      }
    } catch (_) {}
  });

  mainWindow.on('minimize', () => {
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-minimized', true);
      }
    } catch (_) {}
  });

  mainWindow.on('restore', () => {
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-minimized', false);
      }
    } catch (_) {}
  });

  mainWindow.on('hide', () => {
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-minimized', true);
      }
    } catch (_) {}
  });

  mainWindow.on('show', () => {
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('window-minimized', false);
      }
    } catch (_) {}
  });

  mainWindow.on('closed', () => {
    globalShortcut.unregisterAll();
    mainWindow = null;
  });

  registerShortcuts();
    // Intercept and strip Content-Security-Policy-Report-Only headers to permanently eliminate
  // report-only console spam for custom emojis (Imgur, GitHub, etc.)
  const filter = { urls: ['*://*/*'] };
  const removeCspReportOnly = (details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    let modified = false;
    for (const key of Object.keys(responseHeaders)) {
      const lower = key.toLowerCase();
      if (lower === 'content-security-policy-report-only') {
        delete responseHeaders[key];
        modified = true;
      } else if (lower === 'content-security-policy') {
        responseHeaders[key] = responseHeaders[key].map(csp => {
          let updated = csp;
          if (updated.includes('img-src') && !updated.includes('i.imgur.com')) {
            updated = updated.replace(/img-src\s+([^;]+)/, "img-src $1 https: blob: data:");
          }
          if (details.url && (details.url.includes('youtube.com') || details.url.includes('speakirpg.overture.io.kr')) && updated.includes('script-src') && !updated.includes('data:')) {
            updated = updated.replace(/script-src\s+([^;]+)/, "script-src $1 data:");
          }
          return updated;
        });
        modified = true;
      }
    }
    // Ensure CORS headers allow requests to /api/ without credentials blocking
    if (details.url && details.url.includes('/api/')) {
      responseHeaders['access-control-allow-origin'] = ['https://speakirpg.overture.io.kr'];
      responseHeaders['access-control-allow-credentials'] = ['true'];
      responseHeaders['access-control-allow-headers'] = ['authorization, content-type, *'];
      responseHeaders['access-control-allow-methods'] = ['GET, POST, PUT, DELETE, OPTIONS, HEAD'];
      modified = true;
    }
    callback({ cancel: false, responseHeaders: modified ? responseHeaders : details.responseHeaders });
  };
  session.defaultSession.webRequest.onHeadersReceived(filter, removeCspReportOnly);

  // Stub unreachable DoubleClick & Cloudflare Insights requests to prevent ERR_ADDRESS_UNREACHABLE spam
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ['*://*.doubleclick.net/*', '*://*.cloudflareinsights.com/*'] },
    (details, callback) => {
      const redirectURL = details.resourceType === 'script'
        ? 'data:application/javascript,'
        : 'data:text/plain,';
      callback({ redirectURL });
    }
  );

  mainWindow.loadFile('index.html');
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

  if (!rpcReadyRegistered) {
    rpcReadyRegistered = true;
    rpc.on('ready', () => {
      if (discordRpcEnabled) {
        rpc.setActivity({
          details: activity,
          state: 'Main Menu',
          startTimestamp: Date.now(),
          largeImageKey: 'logo',
          largeImageText: 'Auuu',
          smallImageKey: 'logo',
          smallImageText: 'Auuuuuuuuuuuuuuuuuuuuuuu',
          instance: false,
        }).catch(() => {});
      }
    });

    rpc.login({ clientId }).catch(console.error);
  }

  // clear previous timers if any (on re-load)
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
  if (statsTimeout) {
    clearTimeout(statsTimeout);
    statsTimeout = null;
  }

  // schedule: once 30s after load, then every 5 minutes
  statsTimeout = setTimeout(() => {
    triggerStatsUpdate();
    statsTimeout = null;
    statsInterval = setInterval(triggerStatsUpdate, 5 * 60 * 1000);
  }, 30 * 1000);

  mainWindow.webContents.session.webRequest.onCompleted(async (details) => {
 //pass
  });
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
  rpc.destroy();
});

