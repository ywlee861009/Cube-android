package com.metrex.cube.domain.logic

import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move

/**
 * 큐브 회전 로직 구현체.
 *
 * ## 구현 전략 (Phase 1)
 * 각 Move마다 54개 파세렛의 치환(permutation) 테이블을 정의한다.
 * `applyMove`는 해당 테이블대로 새 배열을 생성하여 반환한다.
 *
 * ### 면 회전 인덱스 규칙
 * ```
 * 0 1 2
 * 3 4 5   ← 각 면을 정면에서 바라본 위치
 * 6 7 8
 * ```
 * - CW(시계방향): 0→2→8→6, 1→5→7→3 순환
 * - CCW(반시계방향): CW의 역
 * - 2(180도): CW를 두 번 적용
 *
 * ### 인접 면 파세렛 순환
 * U CW 예시:
 * ```
 * F[0,1,2] → R[0,1,2] → B[0,1,2] → L[0,1,2] → F[0,1,2]
 * (B의 경우 인접 행 인덱스가 반전됨에 주의)
 * ```
 */
class CubeLogicImpl : CubeLogic {

    override fun applyMove(state: DomainCubeState, move: Move): DomainCubeState {
        val next = state.facelets.copyOf()
        when (move) {
            Move.U -> applyU(next)
            Move.U_PRIME -> repeat(3) { applyU(next) }
            Move.U2 -> repeat(2) { applyU(next) }
            Move.R -> applyR(next)
            Move.R_PRIME -> repeat(3) { applyR(next) }
            Move.R2 -> repeat(2) { applyR(next) }
            Move.F -> applyF(next)
            Move.F_PRIME -> repeat(3) { applyF(next) }
            Move.F2 -> repeat(2) { applyF(next) }
            Move.D -> applyD(next)
            Move.D_PRIME -> repeat(3) { applyD(next) }
            Move.D2 -> repeat(2) { applyD(next) }
            Move.L -> applyL(next)
            Move.L_PRIME -> repeat(3) { applyL(next) }
            Move.L2 -> repeat(2) { applyL(next) }
            Move.B -> applyB(next)
            Move.B_PRIME -> repeat(3) { applyB(next) }
            Move.B2 -> repeat(2) { applyB(next) }
        }
        return DomainCubeState(next)
    }

    override fun shuffle(state: DomainCubeState, moveCount: Int): Pair<DomainCubeState, List<Move>> {
        val allMoves = Move.entries
        val moves = mutableListOf<Move>()
        var current = state
        var lastMove: Move? = null
        repeat(moveCount) {
            // 직전 무브와 같은 면의 이동은 제외 (불필요한 중복 방지)
            val next = allMoves.filter { it.name[0] != lastMove?.name?.get(0) }.random()
            moves += next
            current = applyMove(current, next)
            lastMove = next
        }
        return current to moves
    }

    // ──────────────────────────────────────────────────────────────
    // 개별 면 회전 (CW 1회전 인플레이스 변환)
    // TODO(Phase 1): 각 함수의 치환 테이블을 완성한다.
    // ──────────────────────────────────────────────────────────────

    private fun applyU(f: IntArray) {
        rotateFaceCW(f, 0) // U면 자체
        // TODO: F[0,1,2] → R[0,1,2] → B[0,1,2] → L[0,1,2] 순환
    }

    private fun applyR(f: IntArray) {
        rotateFaceCW(f, 1) // R면 자체
        // TODO: U[2,5,8] → B[6,3,0] → D[2,5,8] → F[2,5,8] 순환
    }

    private fun applyF(f: IntArray) {
        rotateFaceCW(f, 2) // F면 자체
        // TODO: U[6,7,8] → R[0,3,6] → D[2,1,0] → L[8,5,2] 순환
    }

    private fun applyD(f: IntArray) {
        rotateFaceCW(f, 3) // D면 자체
        // TODO: F[6,7,8] → L[6,7,8] → B[6,7,8] → R[6,7,8] 순환
    }

    private fun applyL(f: IntArray) {
        rotateFaceCW(f, 4) // L면 자체
        // TODO: U[0,3,6] → F[0,3,6] → D[0,3,6] → B[8,5,2] 순환
    }

    private fun applyB(f: IntArray) {
        rotateFaceCW(f, 5) // B면 자체
        // TODO: U[2,1,0] → L[0,3,6] → D[6,7,8] → R[8,5,2] 순환
    }

    /**
     * [faceIndex]번 면의 9개 파세렛을 시계방향으로 1회 회전한다 (인플레이스).
     * 치환: 0→2→8→6→0, 1→5→7→3→1 (센터[4]는 고정)
     */
    private fun rotateFaceCW(f: IntArray, faceIndex: Int) {
        val o = faceIndex * 9
        val tmp = f[o + 0]
        f[o + 0] = f[o + 6]; f[o + 6] = f[o + 8]
        f[o + 8] = f[o + 2]; f[o + 2] = tmp

        val tmp2 = f[o + 1]
        f[o + 1] = f[o + 3]; f[o + 3] = f[o + 7]
        f[o + 7] = f[o + 5]; f[o + 5] = tmp2
    }

    /** 3개 파세렛 그룹을 순환 치환한다 (a→b→c→a). */
    @Suppress("unused")
    private fun cycle3(f: IntArray, a0: Int, a1: Int, a2: Int,
                       b0: Int, b1: Int, b2: Int,
                       c0: Int, c1: Int, c2: Int) {
        val t0 = f[a0]; val t1 = f[a1]; val t2 = f[a2]
        f[a0] = f[c0]; f[a1] = f[c1]; f[a2] = f[c2]
        f[c0] = f[b0]; f[c1] = f[b1]; f[c2] = f[b2]
        f[b0] = t0;    f[b1] = t1;    f[b2] = t2
    }
}
