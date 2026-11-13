// CORS headers for mobile
// MainActivity must inject this before injector.js is injected!!
window.speakiMobile = true;

(() => {
  const native = window.SpeakiNative; // Object injected by NativeBridge.attach()
  if (!native) return;                // If WebView is not supported, maintain the existing behavior.

  const API = /^https:\/\/[a-z0-9-]+\.overture\.io\.kr\/api\//;
  const pending = new Map();
  let seq = 0;

  native.onmessage = (e) => {
    let m; try { m = JSON.parse(e.data); } catch (_) { return; }
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    if (m.error) return p.reject(new TypeError(m.error));
    if (p.kind === 'saveFile') return p.resolve(m);
    const nullBody = [101, 204, 205, 304].includes(m.status);
    p.resolve(new Response(nullBody ? null : m.body, { status: m.status, headers: m.headers }));
  };

  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const req = new Request(input, init);
    if (!API.test(req.url)) return origFetch(input, init);

    const headers = {};
    req.headers.forEach((v, k) => { headers[k] = v; });
    const body = ['GET', 'HEAD'].includes(req.method) ? null : await req.text();

    return new Promise((resolve, reject) => {
      const id = String(++seq);
      pending.set(id, { resolve, reject, kind: 'fetch' });
      send({ id, url: req.url, method: req.method, headers, body,
             credentials: req.credentials === 'include' });
    });
  };

  // Bridge blob:/data: <a download> exports to Android's native Save-As picker
  const blobUrls = new Map();
  const origCreateObjectURL = URL.createObjectURL.bind(URL);
  const origRevokeObjectURL = URL.revokeObjectURL.bind(URL);

  URL.createObjectURL = (obj) => {
    const url = origCreateObjectURL(obj);
    if (obj instanceof Blob) blobUrls.set(url, obj);
    return url;
  };

  URL.revokeObjectURL = (url) => {
    setTimeout(() => {
      blobUrls.delete(url);
      origRevokeObjectURL(url);
    }, 5000);
  };

  function readBlobAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  }

  function parseDataUrl(dataUrl) {
    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1) throw new Error('Invalid data URL');
    const meta = dataUrl.slice(5, commaIdx);
    const payload = dataUrl.slice(commaIdx + 1);
    const isBase64 = /;base64$/i.test(meta) || meta.toLowerCase().includes(';base64;');
    const mimeType = meta.replace(/;base64/ig, '').split(';')[0].trim() || 'application/octet-stream';
    return { mimeType, payload, isBase64 };
  }

  async function handleNativeDownload(href, filename) {
    let dataUrl = href;
    let explicitMime = '';

    if (href.startsWith('blob:')) {
      const blob = blobUrls.get(href) || await (await origFetch(href)).blob();
      explicitMime = (blob.type || '').split(';')[0].trim();
      dataUrl = await readBlobAsDataUrl(blob);
    }

    let { mimeType, payload, isBase64 } = parseDataUrl(dataUrl);
    if (!isBase64) {
      const text = decodeURIComponent(payload);
      const blob = new Blob([text], { type: mimeType });
      dataUrl = await readBlobAsDataUrl(blob);
      ({ mimeType, payload } = parseDataUrl(dataUrl));
    }

    const cleanMime = explicitMime || mimeType || 'application/octet-stream';
    const id = String(++seq);
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject, kind: 'saveFile' });
      send({
        id,
        action: 'saveFile',
        filename: filename || 'download',
        mimeType: cleanMime,
        base64: payload
      });
    });
  }

  const origAnchorClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    const href = this.getAttribute('href') || this.href || '';
    const hasDownload = this.hasAttribute('download') || Boolean(this.download);
    if (hasDownload && (href.startsWith('blob:') || href.startsWith('data:'))) {
      handleNativeDownload(href, this.download || 'download').catch((err) => {
        console.error('[SpeakiMobile] Download failed:', err);
      });
      return;
    }
    return origAnchorClick.apply(this, arguments);
  };

  function send(m) { native.postMessage(JSON.stringify(m)); }
})();