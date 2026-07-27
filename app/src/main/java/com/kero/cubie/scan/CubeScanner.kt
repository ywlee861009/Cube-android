package com.kero.cubie.scan

import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CaptureRequest
import android.util.Log
import androidx.camera.camera2.interop.Camera2CameraInfo
import androidx.camera.camera2.interop.Camera2Interop
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner

@OptIn(ExperimentalCamera2Interop::class)
class CubeScanner(
    private val lifecycleOwner: LifecycleOwner,
    private val previewView: PreviewView
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var active = false
    private var sessionId = 0

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
        cameraProvider?.unbindAll()
    }

    fun resume(onReady: () -> Unit, onError: (String) -> Unit) {
        if (active) start(onReady, onError)
    }

    fun stop() {
        active = false
        sessionId++
        cameraProvider?.unbindAll()
        cameraProvider = null
    }

    fun isActive(): Boolean = active

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
        return provider.bindToLifecycle(
            lifecycleOwner,
            CameraSelector.DEFAULT_BACK_CAMERA,
            preview
        )
    }

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
