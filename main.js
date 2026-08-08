const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut } = require('electron');
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
let lastUpdateTime = 0;
const MIN_UPDATE_INTERVAL_MS = 10000; // minimum 10s between updates

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
      largeImageText: 'Ogey',
      smallImageKey: 'logo',
      smallImageText: 'Rrat',
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
      if (stats.playerName || stats.level || stats.exp) {
        const now = Date.now();
        if (now - lastUpdateTime > MIN_UPDATE_INTERVAL_MS) {
          lastUpdateTime = now;
          await updateDiscordActivity(stats.level, stats.playerName, stats.exp);
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

