const { app, BrowserWindow, ipcMain, nativeImage, globalShortcut} = require('electron');
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
  "Completing quests ayo"
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
  rpc.destroy();
});

