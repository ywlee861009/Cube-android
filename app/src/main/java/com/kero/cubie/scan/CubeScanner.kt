package com.kero.cubie.scan

import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CaptureRequest
import android.util.Log
import androidx.camera.camera2.interop.Camera2CameraInfo
import androidx.camera.camera2.interop.Camera2Interop
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.util.concurrent.Executors

class CubeScanner(
    private val lifecycleOwner: LifecycleOwner,
    private val previewView: PreviewView
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var active = false
    private var sessionId = 0
    @Volatile private var latestFrame: FaceSampler.RgbaFrame? = null
    private val analysisExecutor = Executors.newSingleThreadExecutor()

    fun start(onReady: () -> Unit, onError: (String) -> Unit) {
        active = true
        val currentSession = ++sessionId
        val future = ProcessCameraProvider.getInstance(previewView.context)
        future.addListener({
            if (!active || currentSession != sessionId) return@addListener
            try {
                val provider = future.get()
                cameraProvider = provider
                val camera = bindPreview(provider, lockAe = false, lockAwb = false)
                val (aeLockSupported, awbLockSupported) = lockSupport(camera)
                Log.i(
                    TAG,
                    "AE lock supported=$aeLockSupported, AWB lock supported=$awbLockSupported"
                )
                if (!aeLockSupported || !awbLockSupported) {
                    Log.w(TAG, "Camera does not support every requested lock; scan will continue")
                }

                // Let auto-exposure and auto-white-balance converge before freezing them.
                previewView.postDelayed({
                    if (!active || currentSession != sessionId) return@postDelayed
                    try {
                        bindPreview(provider, aeLockSupported, awbLockSupported)
                        onReady()
                    } catch (error: Exception) {
                        Log.e(TAG, "Unable to lock camera preview", error)
                        stop()
                        onError("camera_error")
                    }
                }, LOCK_CONVERGENCE_MS)
            } catch (error: Exception) {
                Log.e(TAG, "Unable to start camera preview", error)
                stop()
                onError("camera_error")
            }
        }, ContextCompat.getMainExecutor(previewView.context))
    }

    fun pause() {
        sessionId++
        latestFrame = null
        cameraProvider?.unbindAll()
    }

    fun resume(onReady: () -> Unit, onError: (String) -> Unit) {
        if (active) start(onReady, onError)
    }

    fun stop() {
        active = false
        sessionId++
        latestFrame = null
        cameraProvider?.unbindAll()
        cameraProvider = null
    }

    fun isActive(): Boolean = active

    fun capture(onSampled: (List<List<Int>>) -> Unit, onError: (String) -> Unit) {
        val frame = latestFrame
        if (!active || frame == null) {
            onError("frame_unavailable")
            return
        }
        analysisExecutor.execute {
            try {
                onSampled(FaceSampler.sample(frame))
            } catch (error: Exception) {
                Log.e(TAG, "Face sampling failed", error)
                onError("sampling_failed")
            }
        }
    }

    fun release() {
        stop()
        analysisExecutor.shutdown()
    }

    @androidx.annotation.OptIn(markerClass = [ExperimentalCamera2Interop::class])
    private fun bindPreview(
        provider: ProcessCameraProvider,
        lockAe: Boolean,
        lockAwb: Boolean
    ): Camera {
        provider.unbindAll()
        if (!provider.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA)) {
            throw IllegalStateException("Back camera is unavailable")
        }

        val previewBuilder = Preview.Builder()
        val interop = Camera2Interop.Extender(previewBuilder)
        if (lockAe) {
            interop.setCaptureRequestOption(CaptureRequest.CONTROL_AE_LOCK, true)
        }
        if (lockAwb) {
            interop.setCaptureRequestOption(CaptureRequest.CONTROL_AWB_LOCK, true)
        }

        val preview = previewBuilder.build().also {
            it.setSurfaceProvider(previewView.surfaceProvider)
        }
        val analysis = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
            .build()
            .also { it.setAnalyzer(analysisExecutor, ::cacheFrame) }
        return provider.bindToLifecycle(
            lifecycleOwner,
            CameraSelector.DEFAULT_BACK_CAMERA,
            preview,
            analysis
        )
    }

    private fun cacheFrame(image: ImageProxy) {
        try {
            val plane = image.planes.firstOrNull() ?: return
            val buffer = plane.buffer
            buffer.rewind()
            val bytes = ByteArray(buffer.remaining())
            buffer.get(bytes)
            latestFrame = FaceSampler.RgbaFrame(
                bytes = bytes,
                width = image.width,
                height = image.height,
                rowStride = plane.rowStride,
                pixelStride = plane.pixelStride,
                rotationDegrees = image.imageInfo.rotationDegrees
            )
        } finally {
            image.close()
        }
    }

    @androidx.annotation.OptIn(markerClass = [ExperimentalCamera2Interop::class])
    private fun lockSupport(camera: Camera): Pair<Boolean, Boolean> {
        val camera2Info = Camera2CameraInfo.from(camera.cameraInfo)
        val aeLockSupported = camera2Info.getCameraCharacteristic(
            CameraCharacteristics.CONTROL_AE_LOCK_AVAILABLE
        ) == true
        val awbLockSupported = camera2Info.getCameraCharacteristic(
            CameraCharacteristics.CONTROL_AWB_LOCK_AVAILABLE
        ) == true
        return aeLockSupported to awbLockSupported
    }

    private companion object {
        const val TAG = "CubeScanner"
        const val LOCK_CONVERGENCE_MS = 1_200L
    }
}
