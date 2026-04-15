package com.metrex.cube.solver

import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move

/**
 * 큐브 해법 엔진 인터페이스.
 * [solve]는 주어진 상태에서 완성까지의 무브 시퀀스를 반환한다.
 *
 * Phase 5에서 Kociemba 알고리즘(Two-Phase)으로 교체 예정.
 */
interface CubeSolver {
    /**
     * [state]를 완성 상태로 만드는 최적 또는 준최적 무브 목록을 반환한다.
     * 이미 완성된 경우 빈 목록을 반환한다.
     *
     * @throws IllegalStateException 풀 수 없는 상태인 경우
     */
    suspend fun solve(state: DomainCubeState): List<Move>
}
