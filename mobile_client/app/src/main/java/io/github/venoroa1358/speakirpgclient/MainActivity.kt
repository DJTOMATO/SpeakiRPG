package io.github.venoroa1358.speakirpgclient

import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.URL

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        webView = WebView(this)
        
        // Prevent opening links in external browser
        webView.webViewClient = android.webkit.WebViewClient()

        // enable JavaScript on the WebView
        webView.settings.javaScriptEnabled = true

        // enable LocalStorage on the WebView
        webView.settings.domStorageEnabled = true

        // enable Caching for game assets
        webView.settings.databaseEnabled = true
        webView.settings.cacheMode = android.webkit.WebSettings.LOAD_DEFAULT

        // Cookie
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)

        // load SpeakiMod+ injector from GitHub
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

            if (WebViewFeature.isFeatureSupported(
                    WebViewFeature.DOCUMENT_START_SCRIPT
                )
            ) {
                WebViewCompat.addDocumentStartJavaScript(
                    webView,
                    byPassScript + injector,
                    setOf("https://speakirpg.overture.io.kr")
                )
            }
        }

        // open SpeakiRPG!
        webView.loadUrl("https://speakirpg.overture.io.kr")

        setContentView(webView)
    }

    override fun onPause() {
        super.onPause()
        // sync cookies to disk when the app transitions to hidden or closed state
        CookieManager.getInstance().flush()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}