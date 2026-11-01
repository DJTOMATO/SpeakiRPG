package io.github.venoroa1358.speakirpgclient

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
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
    private lateinit var webView: WebView
    private lateinit var fullscreenButton: TextView
    private var isFullscreen = false

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
            lifecycleScope.launch(Dispatchers.IO) {
                try { proxyApi(JSONObject(raw), reply) } catch (_: Exception) {}
            }
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