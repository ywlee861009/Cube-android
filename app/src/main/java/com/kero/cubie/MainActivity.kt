package com.kero.cubie

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.content.IntentSender
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.HapticFeedbackConstants
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.kero.cubie.scan.CubeScanner
import com.kero.cubie.scan.FaceSampler
import org.json.JSONArray
import org.json.JSONObject

private const val AD_UNIT_ID = "ca-app-pub-2103375309908918/6311668222"

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var previewView: PreviewView
    private lateinit var cubeScanner: CubeScanner
    private lateinit var appUpdateManager: AppUpdateManager
    private var lastInsets: WindowInsetsCompat? = null

    private var rewardedAd: RewardedAd? = null
    private var isAdLoading = false
    private var solveGranted = false  // 광고 시청 후 true, 셔플/리셋 시 false
    private var isUpdateFlowActive = false
    private var cameraPermissionRequested = false
    private val capturedFaces = arrayOfNulls<List<List<Int>>>(6)

    private val cameraPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) {
                beginCameraPreview()
            } else {
                val permanentlyDenied =
                    cameraPermissionRequested &&
                        !shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)
                cancelScan(
                    if (permanentlyDenied) "permission_permanently_denied"
                    else "permission_denied"
                )
                if (permanentlyDenied) showCameraSettingsDialog()
            }
            cameraPermissionRequested = true
            getPreferences(MODE_PRIVATE)
                .edit()
                .putBoolean(CAMERA_PERMISSION_REQUESTED_KEY, true)
                .apply()
        }

    private val appUpdateResultLauncher =
        registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
            isUpdateFlowActive = false
            if (result.resultCode != Activity.RESULT_OK) {
                Log.w("InAppUpdate", "Immediate update flow ended: ${result.resultCode}")
            }
        }

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

        @JavascriptInterface
        fun startScan() {
            runOnUiThread { requestCameraAndStartScan() }
        }

        @JavascriptInterface
        fun stopScan() {
            runOnUiThread { stopCameraPreview() }
        }

        @JavascriptInterface
        fun captureFace(faceIndex: Int) {
            if (faceIndex !in 0..5) {
                runOnUiThread { notifyFaceSampleFailed(faceIndex, "invalid_face_index") }
                return
            }
            cubeScanner.capture(
                onSampled = { samples ->
                    capturedFaces[faceIndex] = samples
                    if (BuildConfig.DEBUG && capturedFaces.all { it != null }) {
                        Log.d("CubeScanner", "RGB fixture=${JSONArray(capturedFaces.toList())}")
                    }
                    runOnUiThread {
                        val json = JSONArray(samples).toString()
                        callJs(
                            "window.onFaceSampled && " +
                                "window.onFaceSampled($faceIndex,${JSONObject.quote(json)})"
                        )
                    }
                },
                onError = { reason ->
                    runOnUiThread { notifyFaceSampleFailed(faceIndex, reason) }
                }
            )
        }

        @JavascriptInterface
        fun getScanGuideRect(): String = JSONObject()
            .put("left", FaceSampler.GUIDE_LEFT)
            .put("top", FaceSampler.GUIDE_TOP)
            .put("right", FaceSampler.GUIDE_RIGHT)
            .put("bottom", FaceSampler.GUIDE_BOTTOM)
            .toString()

    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        cameraPermissionRequested = getPreferences(MODE_PRIVATE)
            .getBoolean(CAMERA_PERMISSION_REQUESTED_KEY, false)

        appUpdateManager = AppUpdateManagerFactory.create(this)
        checkForAppUpdate()

        MobileAds.initialize(this)
        loadRewardedAd()

        setContentView(R.layout.activity_main)
        previewView = findViewById(R.id.camera_preview)
        cubeScanner = CubeScanner(this, previewView)
        webView = findViewById<WebView>(R.id.cube_web_view).apply {
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

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (cubeScanner.isActive()) {
                    stopCameraPreview()
                    callJs("window.onScanCancelled && window.onScanCancelled('back_pressed')")
                } else {
                    finishAndRemoveTask()
                }
            }
        })
    }

    // ── Camera scan ─────────────────────────────────────────────────────────

    private fun requestCameraAndStartScan() {
        if (cubeScanner.isActive()) return
        if (isUpdateFlowActive) {
            cancelScan("app_update_active")
            return
        }
        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)) {
            cancelScan("camera_unavailable")
            return
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            beginCameraPreview()
        } else {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun beginCameraPreview() {
        previewView.visibility = View.VISIBLE
        webView.setBackgroundColor(Color.TRANSPARENT)
        cubeScanner.start(
            onReady = { callJs("window.onScanReady && window.onScanReady()") },
            onError = { reason -> cancelScan(reason) }
        )
    }

    private fun stopCameraPreview() {
        cubeScanner.stop()
        capturedFaces.fill(null)
        previewView.visibility = View.GONE
        webView.setBackgroundColor(Color.TRANSPARENT)
    }

    private fun cancelScan(reason: String) {
        stopCameraPreview()
        callJs("window.onScanCancelled && window.onScanCancelled('$reason')")
    }

    private fun notifyFaceSampleFailed(faceIndex: Int, reason: String) {
        callJs(
            "window.onFaceSampleFailed && " +
                "window.onFaceSampleFailed($faceIndex,${JSONObject.quote(reason)})"
        )
    }

    private fun showCameraSettingsDialog() {
        if (isFinishing || isDestroyed) return
        AlertDialog.Builder(this)
            .setTitle("카메라 권한이 필요해요")
            .setMessage("큐브를 스캔하려면 앱 설정에서 카메라 권한을 허용해 주세요.")
            .setNegativeButton("취소", null)
            .setPositiveButton("설정 열기") { _, _ ->
                startActivity(
                    Intent(
                        Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        Uri.parse("package:$packageName")
                    )
                )
            }
            .show()
    }

    // ── In-App Update ───────────────────────────────────────────────────────

    private fun checkForAppUpdate() {
        appUpdateManager.appUpdateInfo
            .addOnSuccessListener { appUpdateInfo ->
                if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
                    appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
                ) {
                    startImmediateUpdate(appUpdateInfo)
                }
            }
            .addOnFailureListener { error ->
                Log.w("InAppUpdate", "Failed to check app update", error)
            }
    }

    private fun resumeInProgressAppUpdate() {
        appUpdateManager.appUpdateInfo
            .addOnSuccessListener { appUpdateInfo ->
                if (appUpdateInfo.updateAvailability() ==
                    UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS
                ) {
                    startImmediateUpdate(appUpdateInfo)
                }
            }
            .addOnFailureListener { error ->
                Log.w("InAppUpdate", "Failed to resume app update", error)
            }
    }

    private fun startImmediateUpdate(appUpdateInfo: AppUpdateInfo) {
        if (isUpdateFlowActive) return

        isUpdateFlowActive = true
        try {
            val started = appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                appUpdateResultLauncher,
                AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
            )
            if (!started) {
                isUpdateFlowActive = false
                Log.w("InAppUpdate", "Immediate update flow was not started")
            }
        } catch (error: IntentSender.SendIntentException) {
            isUpdateFlowActive = false
            Log.w("InAppUpdate", "Failed to start immediate update", error)
        }
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
            Log.w("AdMob", "Ad not ready, granting solve without ad")
            solveGranted = true
            callJs("window.onSolveGranted()")
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
                Log.w("AdMob", "Ad failed to show, granting solve: ${error.message}")
                solveGranted = true
                callJs("window.onSolveGranted()")
            }
        }

        ad.show(this) { rewarded = true }
    }

    // ── 생명주기 ──────────────────────────────────────────────────────────────

    override fun onDestroy() {
        cubeScanner.release()
        rewardedAd?.fullScreenContentCallback = null
        rewardedAd = null
        webView.removeJavascriptInterface("AndroidBridge")
        webView.destroy()
        super.onDestroy()
    }

    override fun onPause() {
        if (::cubeScanner.isInitialized && cubeScanner.isActive()) cubeScanner.pause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        resumeInProgressAppUpdate()
        if (::cubeScanner.isInitialized && cubeScanner.isActive()) {
            cubeScanner.resume(
                onReady = { callJs("window.onScanReady && window.onScanReady()") },
                onError = { reason -> cancelScan(reason) }
            )
        }
    }

    // ── 유틸 ─────────────────────────────────────────────────────────────────

    private fun callJs(js: String) {
        if (isDestroyed || isFinishing) return
        webView.evaluateJavascript(js, null)
    }

    private fun applyInsetsToJs(webView: WebView, insets: WindowInsetsCompat) {
        // IF-020: Android 15 와이드스크린/디스플레이 컷아웃 대응 —
        // systemBars 뿐 아니라 displayCutout 영역까지 합집합으로 회피한다.
        val safeInsets = insets.getInsets(
            WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
        )
        val density = resources.displayMetrics.density
        val top    = safeInsets.top    / density
        val bottom = safeInsets.bottom / density
        val left   = safeInsets.left   / density
        val right  = safeInsets.right  / density
        val js = "if(window.AndroidCube && window.AndroidCube.setInsets) { window.AndroidCube.setInsets($top, $bottom, $left, $right); }"
        webView.evaluateJavascript(js, null)
    }
}

private const val CAMERA_PERMISSION_REQUESTED_KEY = "camera_permission_requested"
