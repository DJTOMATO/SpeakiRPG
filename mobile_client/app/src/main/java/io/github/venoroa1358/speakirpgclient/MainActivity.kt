package io.github.venoroa1358.speakirpgclient

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import androidx.webkit.JavaScriptReplyProxy
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

private const val GAME_URL = "https://speakirpg.overture.io.kr"
private const val GAME_HOST = "speakirpg.overture.io.kr"

class MainActivity : AppCompatActivity() {
    private data class PendingSaveFile(
        val id: String,
        val filename: String,
        val bytes: ByteArray,
        val reply: JavaScriptReplyProxy
    )

    private lateinit var webView: WebView
    private lateinit var fullscreenButton: TextView
    private var isFullscreen = false
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var pendingSaveFile: PendingSaveFile? = null

    private val fileChooserLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val cb = filePathCallback
            filePathCallback = null
            if (cb == null) return@registerForActivityResult
            if (result.resultCode != Activity.RESULT_OK || result.data == null) {
                cb.onReceiveValue(null)
                return@registerForActivityResult
            }
            val data = result.data!!
            val uris = mutableListOf<Uri>()
            data.clipData?.let { clip ->
                for (i in 0 until clip.itemCount) {
                    clip.getItemAt(i).uri?.let { uris.add(it) }
                }
            }
            if (uris.isEmpty()) {
                data.data?.let { uris.add(it) }
            }
            cb.onReceiveValue(if (uris.isEmpty()) null else uris.toTypedArray())
        }

    private val saveFileLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val pending = pendingSaveFile
            pendingSaveFile = null
            if (pending == null) return@registerForActivityResult
            val uri = if (result.resultCode == Activity.RESULT_OK) result.data?.data else null
            if (uri == null) {
                pending.reply.postMessage(
                    JSONObject().put("id", pending.id).put("cancelled", true).toString()
                )
                return@registerForActivityResult
            }
            lifecycleScope.launch(Dispatchers.IO) {
                val out = JSONObject().put("id", pending.id)
                try {
                    contentResolver.openOutputStream(uri)?.use { stream ->
                        stream.write(pending.bytes)
                    } ?: throw IllegalStateException("Could not open output stream")
                    out.put("ok", true)
                    withContext(Dispatchers.Main) {
                        Toast.makeText(
                            this@MainActivity,
                            "Saved ${pending.filename}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                } catch (e: Exception) {
                    out.put("error", e.message ?: "Failed to save file")
                    withContext(Dispatchers.Main) {
                        Toast.makeText(
                            this@MainActivity,
                            "Save failed: ${e.message ?: "unknown error"}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
                pending.reply.postMessage(out.toString())
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Android 10 and later: Disable the translucent scrim on the navigation bar
        // Really not sure why it stops working after the screen rotates.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isNavigationBarContrastEnforced = false
        }

        // Root container lets the fullscreen control float above the game WebView.
        val root = FrameLayout(this).apply { id = R.id.main }
        webView = WebView(this)

        // Relax the CSP "img-src" in the game main document and remove "Report-Only"
        // It also continues to function as a "WebViewClient" that prevents links from opening in an external browser.
        webView.webViewClient = CspPatchClient()

        // Enable <input type="file"> chooser for XML/PNG/JSON/CSS imports
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                callback: ValueCallback<Array<Uri>>?,
                params: FileChooserParams?
            ): Boolean {
                filePathCallback?.onReceiveValue(null)
                filePathCallback = callback

                val allowMultiple = params?.mode == FileChooserParams.MODE_OPEN_MULTIPLE
                val acceptTypes = params?.acceptTypes
                    ?.map { it.trim() }
                    ?.filter { it.isNotEmpty() }
                    .orEmpty()
                val allImages = acceptTypes.isNotEmpty() && acceptTypes.all {
                    it.startsWith("image/") || it.equals(".png", true) ||
                        it.equals(".jpg", true) || it.equals(".jpeg", true) ||
                        it.equals(".webp", true) || it.equals(".gif", true)
                }

                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = if (allImages) "image/*" else "*/*"
                    if (allowMultiple) putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                }

                return try {
                    fileChooserLauncher.launch(intent)
                    true
                } catch (_: Exception) {
                    filePathCallback?.onReceiveValue(null)
                    filePathCallback = null
                    false
                }
            }
        }

        // Enable JavaScript on the WebView
        webView.settings.javaScriptEnabled = true

        // Enable LocalStorage on the WebView
        webView.settings.domStorageEnabled = true
        // Enable caching for game assets
        webView.settings.databaseEnabled = true
        webView.settings.cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
        // Autoplay-policy: no-user-gesture-required
        webView.settings.mediaPlaybackRequiresUserGesture = false

        root.addView(
            webView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )

        // Floating fullscreen toggle in the bottom-right corner.
        fullscreenButton = TextView(this).apply {
            text = "⤢"
            textSize = 18f
            gravity = Gravity.CENTER
            setTextColor(Color.WHITE)
            contentDescription = "Toggle Fullscreen"
            isClickable = true
            isFocusable = true
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.argb(190, 25, 29, 36))
                setStroke(dp(1), Color.argb(150, 255, 255, 255))
            }
            elevation = dp(5).toFloat()
            setOnClickListener { toggleFullscreen(root) }
        }

        val buttonParams = FrameLayout.LayoutParams(
            dp(32),
            dp(32),
            Gravity.CENTER_VERTICAL or Gravity.END
        ).apply {
            marginEnd = dp(6)
        }

        root.addView(fullscreenButton, buttonParams)
        setContentView(root)

        ViewCompat.setOnApplyWindowInsetsListener(root) { _, insets ->
            val systemBars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars()
            )

            val params =
                fullscreenButton.layoutParams as FrameLayout.LayoutParams

            params.marginEnd = dp(6) +
                if (isFullscreen) 0 else systemBars.right

            params.topMargin = 0
            params.bottomMargin = 0

            fullscreenButton.layoutParams = params
            insets
        }

        // Cookie
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)

        // Handle CORS for /api/ (must be registered before loadUrl!!)
        attachApiProxy(webView)

        // Load SpeakiMod+ injector from GitHub
        lifecycleScope.launch {
            val byPassScript = assets.open("js/initMobileClient.js")
                .bufferedReader()
                .use { it.readText() }
            val injector = try {
                withContext(Dispatchers.IO) {
                    URL("https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main/injector.js")
                        .openStream()
                        .bufferedReader()
                        .use { it.readText() }
                }
            } catch (e: Exception) {
                "console.error('SpeakiMod+ injector failed to load:', e);"
            }
            if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
                WebViewCompat.addDocumentStartJavaScript(
                    webView,
                    byPassScript + "\n" + injector,
                    setOf(GAME_URL)
                )
            }

            // Open SpeakiRPG!
            // Must be loaded after script registration is complete. 
            // Previously, there was a race condition where "loadUrl" could be executed first.
            webView.loadUrl(GAME_URL)
        }
    }

    private fun toggleFullscreen(root: View) {
        val controller = WindowCompat.getInsetsController(window, root)
        isFullscreen = !isFullscreen
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        if (isFullscreen) {
            controller.hide(WindowInsetsCompat.Type.systemBars())
        } else {
            controller.show(WindowInsetsCompat.Type.systemBars())
        }
        ViewCompat.requestApplyInsets(root)
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    override fun onPause() {
        super.onPause()
        // Sync cookies to disk when the app transitions to hidden or closed state
        CookieManager.getInstance().flush()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    // ----- The functions below are intended to port functionality from the desktop code (main.js) for use on mobile. -----

    // /api/ CORS: Relay "JS fetch" requests via native HTTP (Native HTTP does not support CORS)
    private fun attachApiProxy(wv: WebView) {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) return
        WebViewCompat.addWebMessageListener(wv, "SpeakiNative", setOf(GAME_URL)) { _, message, _, _, reply ->
            val raw = message.data ?: return@addWebMessageListener
            val json = try { JSONObject(raw) } catch (_: Exception) { return@addWebMessageListener }
            if (json.optString("action") == "saveFile") {
                lifecycleScope.launch(Dispatchers.Main) {
                    handleSaveFile(json, reply)
                }
            } else {
                lifecycleScope.launch(Dispatchers.IO) {
                    try { proxyApi(json, reply) } catch (_: Exception) {}
                }
            }
        }
    }

    private fun handleSaveFile(msg: JSONObject, reply: JavaScriptReplyProxy) {
        val id = msg.optString("id")
        try {
            val filename = msg.optString("filename", "download").ifBlank { "download" }
            val rawMime = msg.optString("mimeType", "application/octet-stream")
                .substringBefore(';')
                .trim()
                .ifBlank { "application/octet-stream" }
            val base64 = msg.getString("base64")
            val bytes = Base64.decode(base64, Base64.DEFAULT)

            pendingSaveFile?.let { prev ->
                prev.reply.postMessage(
                    JSONObject().put("id", prev.id).put("cancelled", true).toString()
                )
            }
            pendingSaveFile = PendingSaveFile(id, filename, bytes, reply)

            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = rawMime
                putExtra(Intent.EXTRA_TITLE, filename)
            }
            saveFileLauncher.launch(intent)
        } catch (e: Exception) {
            pendingSaveFile = null
            reply.postMessage(
                JSONObject().put("id", id).put("error", e.message ?: "Save failed").toString()
            )
        }
    }

    private fun proxyApi(msg: JSONObject, reply: JavaScriptReplyProxy) {
        val out = JSONObject().put("id", msg.getString("id"))
        try {
            val url = msg.getString("url")
            require(Regex("""^https://[a-z0-9-]+\.overture\.io\.kr/api/""").containsMatchIn(url)) { "blocked url" }
            val method = msg.optString("method", "GET")
            val cookies = CookieManager.getInstance()

            val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = 15_000
                readTimeout = 30_000
                msg.optJSONObject("headers")?.let { h -> h.keys().forEach { k -> setRequestProperty(k, h.getString(k)) } }
                if (msg.optBoolean("credentials")) cookies.getCookie(url)?.let { setRequestProperty("Cookie", it) }
                if (method == "POST" || method == "PUT") {
                    doOutput = true
                    val body = if (msg.isNull("body")) "" else msg.optString("body")
                    outputStream.use { it.write(body.toByteArray()) }
                }
            }

            val status = conn.responseCode
            val stream = if (status >= 400) conn.errorStream else conn.inputStream
            val body = stream?.bufferedReader()?.use { it.readText() } ?: ""

            val headers = JSONObject()
            conn.headerFields.forEach { (k, v) ->
                if (k == null) return@forEach
                if (k.equals("set-cookie", true)) v.forEach { cookies.setCookie(url, it) }
                else headers.put(k, v.joinToString(", "))
            }
            cookies.flush()
            out.put("status", status).put("headers", headers).put("body", body)
        } catch (e: Exception) {
            out.put("error", e.message ?: "native request failed")
        }
        reply.postMessage(out.toString())
    }
}

// Same as "onHeadersReceived" function in "main.js"
// Removing "CSP-Report-Only" from the game main document response and adding "https:/blob:/data:" to the "CSP img-src"
private class CspPatchClient : WebViewClient() {
    override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
        val uri = request.url
        if (!request.isForMainFrame || request.method != "GET" || uri.host != GAME_HOST) return null
        return try {
            val url = uri.toString()
            val cookies = CookieManager.getInstance()
            val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                instanceFollowRedirects = false
                connectTimeout = 15_000
                readTimeout = 30_000
                request.requestHeaders.forEach { (k, v) ->
                    if (!k.equals("accept-encoding", true)) setRequestProperty(k, v) // Compression is handled by HttpURLConnection
                }
                cookies.getCookie(url)?.let { setRequestProperty("Cookie", it) }
            }

            val status = conn.responseCode
            if (status in 300..399) { conn.disconnect(); return null } // Redirects are handled by WebView

            val headers = HashMap<String, String>()
            var mime = "text/html"
            var charset = "utf-8"
            conn.headerFields.forEach { (k, values) ->
                if (k == null) return@forEach
                when (k.lowercase()) {
                    "set-cookie" -> values.forEach { cookies.setCookie(url, it) }
                    "content-encoding", "content-length", "transfer-encoding",
                    "content-security-policy-report-only" -> Unit
                    "content-security-policy" -> headers[k] = values.joinToString(", ") { widenImgSrc(it) }
                    "content-type" -> {
                        val parts = values.first().split(";").map { it.trim() }
                        mime = parts.first()
                        parts.drop(1).firstOrNull { it.startsWith("charset=", true) }
                            ?.let { charset = it.substringAfter("=").trim('"') }
                    }
                    else -> headers[k] = values.joinToString(", ")
                }
            }
            cookies.flush()

            val stream = if (status >= 400) conn.errorStream else conn.inputStream
            val reason = conn.responseMessage?.takeIf { it.isNotBlank() } ?: "OK"
            WebResourceResponse(mime, charset, status, reason, headers, stream)
        } catch (_: Exception) {
            null // If it fails, WebView will load it directly as usual
        }
    }

    private fun widenImgSrc(csp: String): String =
        if (csp.contains("img-src") && !csp.contains("i.imgur.com"))
            csp.replace(Regex("""img-src\s+([^;]+)""")) { "img-src ${it.groupValues[1]} https: blob: data:" }
        else csp
}