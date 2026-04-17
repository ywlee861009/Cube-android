package com.kero.cubie

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.HapticFeedbackConstants
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.gms.games.PlayGames

private const val AD_UNIT_ID = "ca-app-pub-2103375309908918/6311668222"

// TODO: Play Console > 게임 서비스 > 리더보드 생성 후 실제 ID로 교체
private const val LEADERBOARD_TIME  = "CgkI_REPLACE_TIME_ID"
private const val LEADERBOARD_MOVES = "CgkI_REPLACE_MOVES_ID"

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var lastInsets: WindowInsetsCompat? = null

    private var rewardedAd: RewardedAd? = null
    private var isAdLoading = false
    private var solveGranted = false  // 광고 시청 후 true, 셔플/리셋 시 false

    private val leaderboardLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { /* no-op */ }

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
         * - 이미 광고 허가된 상태면 바로 onSolveGranted()
         * - 아니면 광고 표시 후 허가
         */
        @JavascriptInterface
        fun requestSolve() {
            if (solveGranted) {
                runOnUiThread { callJs("window.onSolveGranted()") }
            } else {
                runOnUiThread { showRewardedAd() }
            }
        }

        /**
         * 셔플 또는 리셋 시 JS에서 호출 → 광고 허가 초기화
         */
        @JavascriptInterface
        fun onShuffleOrReset() {
            solveGranted = false
        }

        /**
         * 큐브를 직접 풀었을 때 JS에서 호출 (솔버 미사용 조건).
         * @param timeMs   셔플 완료 ~ 완성까지 경과 시간 (ms)
         * @param moves    사용자가 직접 입력한 이동 수
         */
        @JavascriptInterface
        fun submitScore(timeMs: Long, moves: Int) {
            PlayGames.getGamesSignInClient(this@MainActivity).isAuthenticated
                .addOnCompleteListener { task ->
                    if (task.isSuccessful && task.result.isAuthenticated) {
                        val lb = PlayGames.getLeaderboardsClient(this@MainActivity)
                        lb.submitScore(LEADERBOARD_TIME, timeMs)
                        lb.submitScore(LEADERBOARD_MOVES, moves.toLong())
                        Log.d("PlayGames", "Score submitted: ${timeMs}ms, ${moves} moves")
                    } else {
                        Log.w("PlayGames", "Not authenticated, score not submitted")
                    }
                }
        }

        /**
         * 리더보드 UI 표시.
         * @param which  "time" | "moves"
         */
        @JavascriptInterface
        fun showLeaderboard(which: String) {
            val leaderboardId = if (which == "time") LEADERBOARD_TIME else LEADERBOARD_MOVES
            PlayGames.getLeaderboardsClient(this@MainActivity)
                .getLeaderboardIntent(leaderboardId)
                .addOnSuccessListener { intent ->
                    runOnUiThread { leaderboardLauncher.launch(intent) }
                }
                .addOnFailureListener { e ->
                    Log.w("PlayGames", "Failed to open leaderboard: ${e.message}")
                }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        MobileAds.initialize(this)
        loadRewardedAd()

        // Play Games 로그인 (자동 처리, 사용자 개입 없음)
        PlayGames.getGamesSignInClient(this).signIn()

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

    private fun showRewardedAd() {
        val ad = rewardedAd
        if (ad == null) {
            Log.w("AdMob", "Ad not ready, denying solve")
            callJs("window.onSolveDenied()")
            loadRewardedAd()
            return
        }

        var rewarded = false
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                rewardedAd = null
                loadRewardedAd()
                if (rewarded) {
                    solveGranted = true
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
