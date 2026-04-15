package com.metrex.cube.display

import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChange
import androidx.compose.ui.unit.dp
import com.metrex.cube.display.model.RotationState
import com.metrex.cube.domain.model.CubeFace
import com.metrex.cube.domain.model.DomainCubeState

/**
 * 전체 큐브를 3D 렌더링하는 최상위 컴포저블.
 *
 * ## 렌더링 전략 (Phase 2/3)
 * - graphicsLayer를 각 면에 적용해 rotationX/rotationY로 3D 배치
 * - [RotationState]를 상위에서 주입받아 Recomposition 없이
 *   graphicsLayer 람다 내에서 즉각 반영 (Zero-lag)
 *
 * ## 터치 전략 (Phase 2)
 * - 큐브 전체 드래그 → [RotationState] 업데이트 (Arcball 회전)
 * - 특정 레이어 스와이프 → [onLayerRotate] 콜백 (Phase 3)
 *
 * TODO(Phase 2): Arcball(쿼터니언) 회전 구현
 * TODO(Phase 3): 27개 Cubie 배치 및 레이어별 회전 분리
 * TODO(Phase 4): Fling + Animatable 스냅 애니메이션
 */
@Composable
fun CubeRenderer(
    cubeState: DomainCubeState,
    modifier: Modifier = Modifier,
    onLayerRotate: (face: CubeFace, clockwise: Boolean) -> Unit = { _, _ -> },
) {
    var rotation by remember { mutableStateOf(RotationState()) }

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitEachGesture {
                    awaitFirstDown()
                    do {
                        val event = awaitPointerEvent()
                        val delta = event.changes.firstOrNull()?.positionChange() ?: break
                        // TODO(Phase 2): 터치 델타를 Arcball 회전으로 변환
                        rotation = rotation.copy(
                            rotationX = (rotation.rotationX - delta.y * 0.3f).coerceIn(-90f, 90f),
                            rotationY = rotation.rotationY + delta.x * 0.3f,
                        )
                        event.changes.forEach { it.consume() }
                    } while (event.changes.any { it.pressed })
                }
            },
    ) {
        // TODO(Phase 3): 27개 Cubie 분리. 현재는 6면 직접 배치로 단순 구현.
        CubeFaceLayout(
            cubeState = cubeState,
            rotation = rotation,
        )
    }
}

/**
 * 6개의 면을 3D 공간에 배치한다.
 *
 * TODO(Phase 2/3): 각 면의 실제 3D 위치·회전·zIndex 계산 구현.
 *                  현재는 UI면만 평면으로 표시.
 */
@Composable
private fun CubeFaceLayout(
    cubeState: DomainCubeState,
    rotation: RotationState,
) {
    val facelets = cubeState.facelets
    val faceSize = 160.dp

    Box(
        modifier = Modifier
            .size(faceSize)
            .graphicsLayer {
                rotationX = rotation.rotationX
                rotationY = rotation.rotationY
                cameraDistance = rotation.cameraDistance * density
            },
    ) {
        // FRONT면만 임시 렌더링 — Phase 3에서 6면 전개로 교체
        CubeFaceView(
            faceColors = IntArray(9) { facelets[CubeFace.FRONT.offset + it] },
            modifier = Modifier.fillMaxSize(),
        )
    }
}
