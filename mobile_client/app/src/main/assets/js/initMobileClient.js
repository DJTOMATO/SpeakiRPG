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
      pending.set(id, { resolve, reject });
      send({ id, url: req.url, method: req.method, headers, body,
             credentials: req.credentials === 'include' });
    });
  };

  function send(m) { native.postMessage(JSON.stringify(m)); }
})();