package com.metrex.cube

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : ComponentActivity() {

    private var lastInsets: WindowInsetsCompat? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            setBackgroundColor(Color.TRANSPARENT)
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    // 페이지 로딩 완료 후 저장된 인셋이 있으면 적용
                    lastInsets?.let { applyInsetsToJs(this@apply, it) }
                }
            }
            loadUrl("file:///android_asset/cube.html")
        }

        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, insets ->
            lastInsets = insets
            applyInsetsToJs(webView, insets)
            insets
        }

        setContentView(webView)
    }

    private fun applyInsetsToJs(webView: WebView, insets: WindowInsetsCompat) {
        val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
        val density = resources.displayMetrics.density
        val top = systemBars.top / density
        val bottom = systemBars.bottom / density
        val left = systemBars.left / density
        val right = systemBars.right / density
        
        val js = "if(window.AndroidCube && window.AndroidCube.setInsets) { window.AndroidCube.setInsets($top, $bottom, $left, $right); }"
        Log.d("MainActivity", "Applying insets to JS: $top, $bottom")
        webView.evaluateJavascript(js, null)
    }
}
