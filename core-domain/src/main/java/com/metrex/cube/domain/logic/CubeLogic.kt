package com.metrex.cube.domain.logic

import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move

interface CubeLogic {
    /** [move]를 [state]에 적용한 새 상태를 반환한다 (불변). */
    fun applyMove(state: DomainCubeState, move: Move): DomainCubeState

    /** [moves] 시퀀스를 순서대로 적용한 최종 상태를 반환한다. */
    fun applyMoves(state: DomainCubeState, moves: List<Move>): DomainCubeState =
        moves.fold(state, ::applyMove)

    /** [moveCount]번 랜덤 무브를 적용한 (셔플된 상태, 적용된 무브 목록) 쌍을 반환한다. */
    fun shuffle(state: DomainCubeState, moveCount: Int = 20): Pair<DomainCubeState, List<Move>>
}
