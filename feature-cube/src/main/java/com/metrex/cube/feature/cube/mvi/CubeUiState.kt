package com.metrex.cube.feature.cube.mvi

import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move

/** CubeScreen에 노출되는 불변 UI 상태. */
data class CubeUiState(
    val cubeState: DomainCubeState = DomainCubeState(),
    val isSolving: Boolean = false,
    val isShuffling: Boolean = false,
    val solutionMoves: List<Move> = emptyList(),
    val moveCount: Int = 0,
)
