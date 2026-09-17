const { contextBridge, ipcRenderer, webFrame } = require('electron');
const fs = require('fs');
const path = require('path');

// Maintain your existing IPC bridge
contextBridge.exposeInMainWorld('electronAPI', {
    loadSite: (url) => ipcRenderer.send('load-site', url),
    getSpeakiModJs: async () => ipcRenderer.invoke('get-speaki-mod-js')
});

// Expose client build version from package.json
try {
    const pkgPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg && pkg.version) {
            webFrame.executeJavaScript(`window.__speakiBuildVersion = ${JSON.stringify(pkg.version)};`).catch(console.error);
        }
    }
} catch (error) {
    console.error('Failed to load build version:', error);
}

// Expose local erpin.html signature
try {
    const erpinPath = path.join(__dirname, 'erpin.html');
    if (fs.existsSync(erpinPath)) {
        const erpinCode = fs.readFileSync(erpinPath, 'utf8');
        webFrame.executeJavaScript(`window.__speakiErpin = ${JSON.stringify(erpinCode)};`).catch(console.error);
    }
} catch (error) {
    console.error('Failed to load erpin.html:', error);
}

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