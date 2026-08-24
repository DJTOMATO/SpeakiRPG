const { contextBridge, ipcRenderer, webFrame } = require('electron');
const fs = require('fs');
const path = require('path');

// Maintain your existing IPC bridge
contextBridge.exposeInMainWorld('electronAPI', {
    loadSite: (url) => ipcRenderer.send('load-site', url)
});

// Read and inject the SpeakiMod script into the main world
try {
    const injectorPath = path.join(__dirname, 'injector.js');
    const injectorCode = fs.readFileSync(injectorPath, 'utf8');

    // executeJavaScript runs the code in the actual page's window context
    // This allows it to set window.injectSpeakiMod and observe the DOM early
    webFrame.executeJavaScript(injectorCode).catch(console.error);
} catch (error) {
    console.error('Failed to load injector.js:', error);
}