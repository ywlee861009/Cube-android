package com.metrex.cube.display.model

/**
 * 큐브 전체의 3D 회전 상태.
 *
 * [rotationX], [rotationY]: graphicsLayer의 rotationX/rotationY에 직접 대응(도 단위).
 * Arcball 회전을 구현할 때는 쿼터니언으로 누적한 뒤 오일러각으로 변환하여 이 값에 반영한다.
 *
 * [cameraDistance]: 원근감 조정. 값이 클수록 원근 왜곡이 줄어든다.
 *                   권장값: 8 * density (Compose default density 기준).
 */
data class RotationState(
    val rotationX: Float = -25f,
    val rotationY: Float = 45f,
    val cameraDistance: Float = 12f,
)
