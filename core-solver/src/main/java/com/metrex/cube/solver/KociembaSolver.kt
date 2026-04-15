package com.metrex.cube.solver

import com.metrex.cube.domain.logic.CubeLogic
import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move

/**
 * Kociemba Two-Phase 알고리즘 기반 솔버 (Phase 5 구현 예정).
 *
 * ## 구현 계획
 * - Phase 1: G1 부분군(edge orientation, corner orientation)으로 환원
 * - Phase 2: 완성 상태로 환원
 * - 탐색 깊이 제한 + IDA* 사용 → 최대 20수 보장
 *
 * ## 현재 상태
 * 플레이스홀더: 이미 완성된 경우만 처리. 나머지는 TODO.
 */
class KociembaSolver(
    private val cubeLogic: CubeLogic,
) : CubeSolver {

    override suspend fun solve(state: DomainCubeState): List<Move> {
        if (state.isSolved()) return emptyList()
        // TODO(Phase 5): Kociemba Two-Phase 알고리즘 구현
        throw NotImplementedError("KociembaSolver is not yet implemented")
    }
}
