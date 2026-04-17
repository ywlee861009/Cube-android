package com.kero.cubie

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.HapticFeedbackConstants
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

private const val AD_UNIT_ID = "ca-app-pub-2103375309908918/6311668222"
private const val PREF_NAME = "cube_prefs"
private const val KEY_SOLVE_COUNT = "solve_count"
private const val AD_INTERVAL = 5  // 5번마다 광고

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var lastInsets: WindowInsetsCompat? = null

    private var rewardedAd: RewardedAd? = null
    private var isAdLoading = false

    inner class CubeBridge(private val webView: WebView) {

        @JavascriptInterface
        fun hapticFeedback() {
            webView.post {
                webView.performHapticFeedback(
                    HapticFeedbackConstants.VIRTUAL_KEY,
                    HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING
                )
            }
        }

        /**
         * JS의 solveCube()에서 호출.
         * - (count % AD_INTERVAL == AD_INTERVAL - 1) 이면 광고 표시
         * - 아니면 바로 onSolveGranted() 콜백
         */
        @JavascriptInterface
        fun requestSolve() {
            val prefs = getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val count = prefs.getInt(KEY_SOLVE_COUNT, 0)

            if (count % AD_INTERVAL == AD_INTERVAL - 1) {
                // 광고 필요
                runOnUiThread { showRewardedAd(prefs, count) }
            } else {
                // 광고 불필요 → 바로 진행
                prefs.edit().putInt(KEY_SOLVE_COUNT, count + 1).apply()
                runOnUiThread { callJs("window.onSolveGranted()") }
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        MobileAds.initialize(this)
        loadRewardedAd()

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            setBackgroundColor(Color.TRANSPARENT)
            addJavascriptInterface(CubeBridge(this), "AndroidBridge")
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    lastInsets?.let { applyInsetsToJs(this@apply, it) }
                }
            }
            loadUrl("file:///android_asset/cube.html")
        }

        ViewCompat.setOnApplyWindowInsetsListener(webView) { _, insets ->
            lastInsets = insets
            applyInsetsToJs(webView, insets)
            insets
        }

        setContentView(webView)
    }

    // ── RewardedAd 로드 ──────────────────────────────────────────────────────

    private fun loadRewardedAd() {
        if (isAdLoading || rewardedAd != null) return
        isAdLoading = true
        RewardedAd.load(this, AD_UNIT_ID, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    isAdLoading = false
                    Log.d("AdMob", "RewardedAd loaded")
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedAd = null
                    isAdLoading = false
                    Log.w("AdMob", "RewardedAd load failed: ${error.message}")
                }
            })
    }

    // ── RewardedAd 표시 ──────────────────────────────────────────────────────

    private fun showRewardedAd(prefs: android.content.SharedPreferences, currentCount: Int) {
        val ad = rewardedAd
        if (ad == null) {
            // 광고 미준비 → 거부와 동일 처리
            Log.w("AdMob", "Ad not ready, denying solve")
            callJs("window.onSolveDenied()")
            loadRewardedAd()
            return
        }

        var rewarded = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                rewardedAd = null
                loadRewardedAd()  // 다음 광고 미리 로드
                if (rewarded) {
                    prefs.edit().putInt(KEY_SOLVE_COUNT, currentCount + 1).apply()
                    callJs("window.onSolveGranted()")
                } else {
                    callJs("window.onSolveDenied()")
                }
            }
            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                rewardedAd = null
                loadRewardedAd()
                callJs("window.onSolveDenied()")
            }
        }

        ad.show(this) { rewarded = true }
    }

    // ── 유틸 ─────────────────────────────────────────────────────────────────

    private fun callJs(js: String) {
        webView.evaluateJavascript(js, null)
    }

    private fun applyInsetsToJs(webView: WebView, insets: WindowInsetsCompat) {
        val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
        val density = resources.displayMetrics.density
        val top    = systemBars.top    / density
        val bottom = systemBars.bottom / density
        val left   = systemBars.left   / density
        val right  = systemBars.right  / density
        val js = "if(window.AndroidCube && window.AndroidCube.setInsets) { window.AndroidCube.setInsets($top, $bottom, $left, $right); }"
        webView.evaluateJavascript(js, null)
    }
}
