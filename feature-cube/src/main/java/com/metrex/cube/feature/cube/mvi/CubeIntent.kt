package com.metrex.cube.feature.cube.mvi

import com.metrex.cube.domain.model.CubeFace
import com.metrex.cube.domain.model.Move

/** 사용자 또는 시스템이 ViewModel에 전달하는 의도. */
sealed interface CubeIntent {
    /** 특정 레이어 회전 (터치 스와이프 완료 시). */
    data class RotateLayer(val move: Move) : CubeIntent

    /** 큐브를 랜덤 셔플. */
    data class Shuffle(val moveCount: Int = 20) : CubeIntent

    /** 자동 해법 시작. */
    data object Solve : CubeIntent

    /** 완성 상태로 리셋. */
    data object Reset : CubeIntent
}
