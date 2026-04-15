package com.metrex.cube.feature.cube.mvi

/** 한 번만 소비되는 일회성 부수 효과. */
sealed interface CubeSideEffect {
    /** 레이어 회전 완료 후 스냅 피드백 (Phase 4). */
    data object SnapFeedback : CubeSideEffect

    /** 큐브 완성 시 햅틱 + 축하 애니메이션 트리거. */
    data object CubeSolved : CubeSideEffect

    /** 솔버 실패 또는 오류 메시지. */
    data class SolverError(val message: String) : CubeSideEffect
}
