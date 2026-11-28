const { contextBridge, ipcRenderer, webFrame } = require('electron');
const fs = require('fs');
const path = require('path');

// Maintain your existing IPC bridge
contextBridge.exposeInMainWorld('electronAPI', {
    loadSite: (url) => ipcRenderer.send('load-site', url),
    setDiscordRpc: (enabled) => ipcRenderer.send('set-discord-rpc', enabled),
    onWindowMinimized: (callback) => {
        ipcRenderer.on('window-minimized', (event, isMin) => {
            if (typeof callback === 'function') callback(isMin);
        });
    }
});
try {
    contextBridge.exposeInMainWorld('spkmodFiles', {
        readBase64: (name) => {
            try {
                const p = path.join(__dirname, 'zonemaps', path.basename(String(name)));
                return fs.existsSync(p) ? fs.readFileSync(p).toString('base64') : null;
            } catch (e) { return null; }
        }
    });
} catch (error) { console.error('Failed to expose spkmodFiles:', error); }

 try {
         contextBridge.exposeInMainWorld('spkmodShot', {
             save: (name, b64) => {
                 try {
                     const dir = path.join(__dirname, 'screenshots');
                     fs.mkdirSync(dir, { recursive: true });
                     const file = path.join(dir, path.basename(String(name)).replace(/[^\w.\-]/g, '_').replace(/(\.png)?$/i, '.png'));
                     fs.writeFileSync(file, Buffer.from(String(b64), 'base64'));
                     return file;
					 } catch (e) { console.error(e); return null; }
             }
         });
     } catch (error) { console.error('Failed to expose spkmodShot:', error); }


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

// Dev mode: SPEAKI_LOCAL_MOD=1 makes the injector use the local SpeakiMod.js instead of the GitHub version
try {
    if (process.env.SPEAKI_LOCAL_MOD === '1') {
        const localModPath = path.join(__dirname, 'SpeakiMod.js');
        const localModCode = fs.readFileSync(localModPath, 'utf8');
        webFrame.executeJavaScript(`window.__speakiLocalModCode = ${JSON.stringify(localModCode)};`).catch(console.error);
        console.log('[SpeakiMod] Using local SpeakiMod.js');
    }
} catch (error) {
    console.error('Failed to load local SpeakiMod.js:', error);
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