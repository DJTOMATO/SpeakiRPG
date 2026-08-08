const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut, clipboard } = require('electron');
const axios = require('axios');
const path = require('path');
const RPC = require('discord-rpc');
const clientId = '861430403955949569';

const rpc = new RPC.Client({ transport: 'ipc' });

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

// async function fetchTjaFile(url) {
//   try {
//     const response = await axios.get(url, { responseType: 'text' });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching TJA file:', error);
//     return null;
//   }
// }

// function extractSongNameFromTja(tjaContent) {
//   const titleLine = tjaContent.split('\n').find(line => line.startsWith('TITLE:'));
//   if (titleLine) {
//     return titleLine.split(':')[1].trim();
//   }
//   return null;
// }

let mainWindow;
let icon;
let statsInterval = null;
let statsTimeout = null;
let clipboardPollInterval = null;
let lastClipboardText = '';
let lastPageStats = { level: null, playerName: null, exp: null };
let lastUpdateTime = 0;
const CLIPBOARD_POLL_MS = 5000; // poll every 5s
const MIN_UPDATE_INTERVAL_MS = 10000; // minimum 10s between updates

function parseGameClipboard(text) {
  if (!text) return { level: null, playerName: null, exp: null, lines: [] };
  const rawLines = text.split(/\r?\n/).map(l => l.replace(/\r|\n/g, '').trim()).filter(l => l.length > 0);
  let level = null;
  let playerName = null;
  let exp = null;

  // Primary heuristic: use line 2 and 3 if available (user-specified)
  if (rawLines.length >= 3) {
    level = rawLines[1] || null;
    playerName = rawLines[2] || null;
  }

  // Fallback: find first numeric-only line and take next line as player name
  if (!level) {
    for (let i = 0; i < rawLines.length; i++) {
      const l = rawLines[i];
      if (/^\d+$/.test(l)) {
        level = l;
        if (i + 1 < rawLines.length) playerName = rawLines[i + 1];
        break;
      }
    }
  }

  // Fallback EXP detection from a fraction-like line
  if (!exp) {
    for (const line of rawLines) {
      const match = line.match(/(\d+\s*\/\s*\d+\s*(?:\(\d+%\))?)/);
      if (match) {
        exp = match[1].replace(/\s+/g, ' ').trim();
        break;
      }
    }
  }

  // Normalize level to digits only if possible
  if (level) {
    const m = String(level).match(/(\d+)/);
    level = m ? m[1] : String(level);
  }

  return { level: level || null, playerName: playerName || null, exp: exp || null, lines: rawLines };
}

async function updateDiscordActivity(level, playerName, exp = null) {
  const setActivity = async () => {
    const detailsText = playerName || 'Unknown Player';
    let stateText = level ? `Level ${String(level)}` : 'In-Game';
    if (exp) {
      stateText += ` • ${exp}`;
    }

    return rpc.setActivity({
      details: detailsText,
      state: stateText,
      startTimestamp: Date.now(),
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
      await setActivity();
      console.log('RPC activity updated after login:', { level, playerName });
    } catch (err2) {
      console.error('Failed to update RPC activity:', err2);
    }
  }
}

function startClipboardWatcher() {
  if (clipboardPollInterval) return;
  try {
    lastClipboardText = clipboard.readText() || '';
  } catch (e) {
    lastClipboardText = '';
  }
  clipboardPollInterval = setInterval(async () => {
    try {
      const pageStats = await capturePageStats();
      const clipboardText = clipboard.readText() || '';
      let changed = false;

      if (pageStats.playerName || pageStats.level || pageStats.exp) {
        if (
          pageStats.playerName !== lastPageStats.playerName ||
          pageStats.level !== lastPageStats.level ||
          pageStats.exp !== lastPageStats.exp
        ) {
          changed = true;
          lastPageStats = {
            level: pageStats.level,
            playerName: pageStats.playerName,
            exp: pageStats.exp
          };
          console.log('Page stats change detected');
        }
      } else if (clipboardText !== lastClipboardText) {
        changed = true;
        lastClipboardText = clipboardText;
        console.log('Clipboard change detected');
      }

      if (changed) {
        if (pageStats.playerName || pageStats.level || pageStats.exp) {
          console.log('Watcher parsed page stats:', pageStats);
          const now = Date.now();
          if (now - lastUpdateTime > MIN_UPDATE_INTERVAL_MS) {
            lastUpdateTime = now;
            await updateDiscordActivity(pageStats.level, pageStats.playerName, pageStats.exp);
          } else {
            console.log('Update throttled; skipping');
          }
        } else {
          const parsed = parseGameClipboard(clipboardText);
          console.log('Watcher parsed clipboard:', parsed);
          const now = Date.now();
          if (now - lastUpdateTime > MIN_UPDATE_INTERVAL_MS) {
            lastUpdateTime = now;
            await updateDiscordActivity(parsed.level, parsed.playerName, parsed.exp);
          } else {
            console.log('Update throttled; skipping');
          }
        }
      }
    } catch (err) {
      console.error('Clipboard/page watcher error:', err);
    }
  }, CLIPBOARD_POLL_MS);
  console.log('Clipboard/page watcher started (polling every', CLIPBOARD_POLL_MS, 'ms)');
}

function stopClipboardWatcher() {
  if (clipboardPollInterval) {
    clearInterval(clipboardPollInterval);
    clipboardPollInterval = null;
    console.log('Clipboard watcher stopped');
  }
}

async function capturePageText() {
  if (!mainWindow || mainWindow.isDestroyed()) return '';
  try {
    const text = await mainWindow.webContents.executeJavaScript(`
      (function() {
        if (typeof document === 'undefined' || !document.body) return '';
        return document.body.innerText || document.documentElement.innerText || '';
      })();
    `, true);
    console.log('Captured page text length:', text ? text.length : 0);
    return text || '';
  } catch (err) {
    console.error('Error capturing page text:', err);
    return '';
  }
}

async function capturePageStats() {
  if (!mainWindow || mainWindow.isDestroyed()) return { level: null, playerName: null, exp: null };
  try {
    return await mainWindow.webContents.executeJavaScript(`
      (function() {
        const nameEl = document.querySelector('.sr-player-card__name');
        const levelEl = document.querySelector('.sr-player-card__portrait-wrap .sr-player-card__lv-badge');
        const expEl = document.querySelector('.sr-player-card__exp-track');
        return {
          playerName: nameEl ? nameEl.innerText.trim() : null,
          level: levelEl ? levelEl.innerText.trim() : null,
          exp: expEl ? expEl.getAttribute('title') || expEl.innerText.trim() : null
        };
      })();
    `, true);
  } catch (err) {
    console.error('Error capturing page stats:', err);
    return { level: null, playerName: null, exp: null };
  }
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
        mainWindow.reload();
      });
      globalShortcut.register('CommandOrControl+R', () => {
        mainWindow.reload();
      });
      globalShortcut.register('CommandOrControl+Shift+D', async () => {
        try {
          const stats = await capturePageStats();
          console.log('Captured page stats shortcut:', stats);
          if (stats.playerName || stats.level || stats.exp) {
            await updateDiscordActivity(stats.level, stats.playerName, stats.exp);
            return;
          }
          const text = await capturePageText();
          const parsed = parseGameClipboard(text);
          console.log('Fallback captured page text:', text);
          console.log('Parsed page text for RPC fallback:', parsed);
          await updateDiscordActivity(parsed.level, parsed.playerName, parsed.exp);
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
      largeImageText: 'Ogey',
      smallImageKey: 'logo',
      smallImageText: 'Rrat',
      instance: false,
    });
  });

  rpc.login({ clientId }).catch(console.error);

  // Allow renderer to send parsed clipboard text via IPC to update RPC activity
  ipcMain.removeAllListeners('update-stats');
  ipcMain.on('update-stats', async (event, text) => {
    try {
      const { level, playerName } = parseGameClipboard(text);
      console.log('IPC update-stats received:', { level, playerName });
      await updateDiscordActivity(level, playerName);
    } catch (err) {
      console.error('Error handling update-stats IPC:', err);
    }
  });

  // clear previous timers if any (on re-load)
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
  }
  if (statsTimeout) {
    clearTimeout(statsTimeout);
    statsTimeout = null;
  }
  // restart clipboard watcher
  stopClipboardWatcher();

  // helper to read clipboard and update RPC
  const triggerStatsUpdate = async () => {
    try {
      const stats = await capturePageStats();
      console.log('Auto capture page stats:', stats);
      if (stats.playerName || stats.level || stats.exp) {
        await updateDiscordActivity(stats.level, stats.playerName, stats.exp);
        return;
      }

      const text = clipboard.readText();
      const parsed = parseGameClipboard(text);
      console.log('No page stats found, auto parsed clipboard:', parsed);
      await updateDiscordActivity(parsed.level, parsed.playerName, parsed.exp);
    } catch (err) {
      console.error('Error in triggerStatsUpdate:', err);
    }
  };

  // schedule: once 30s after load, then every 5 minutes
  statsTimeout = setTimeout(() => {
    triggerStatsUpdate();
    statsTimeout = null;
    statsInterval = setInterval(triggerStatsUpdate, 5 * 60 * 1000);
  }, 30 * 1000);

  // start clipboard watcher to auto-detect copies
  startClipboardWatcher();

  mainWindow.webContents.session.webRequest.onCompleted(async (details) => {
    // if (details.url.endsWith('.tja')) {
    //   console.log(`Detected TJA file request: ${details.url}`);
    //   const tjaContent = await fetchTjaFile(details.url);
    //   if (tjaContent) {
    //     const songName = extractSongNameFromTja(tjaContent);
    //     if (songName) {
    //       console.log(`Playing song: ${songName}`);
    //       rpc.setActivity({
    //         details: 'Hitting all the notes in taiko',
    //         state: `Playing ${songName}`,
    //         startTimestamp: Date.now(),
    //         largeImageKey: 'logo',
    //         largeImageText: 'Ogey',
    //         smallImageKey: 'logo',
    //         smallImageText: 'Rrat',
    //         instance: false,
    //       });
    //     } else {
    //       console.log('Song name not found in TJA file.');
    //     }
    //   } else {
    //     console.log('Failed to fetch TJA file.');
    //   }
    // }
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
  stopClipboardWatcher();
  rpc.destroy();
});

