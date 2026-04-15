package com.metrex.cube

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : ComponentActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            webViewClient = WebViewClient()
            loadUrl("file:///android_asset/cube.html")
        }

        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            // JS의 AndroidCube.setInsets(top, bottom, left, right) 호출
            // density를 고려하여 px -> dp로 전달 (웹에서는 px이 dp와 비슷하게 동작하도록 viewport 설정됨)
            val density = resources.displayMetrics.density
            val top = systemBars.top / density
            val bottom = systemBars.bottom / density
            val left = systemBars.left / density
            val right = systemBars.right / density
            
            webView.evaluateJavascript("AndroidCube.setInsets($top, $bottom, $left, $right)", null)
            
            insets
        }

        setContentView(webView)
    }
}
