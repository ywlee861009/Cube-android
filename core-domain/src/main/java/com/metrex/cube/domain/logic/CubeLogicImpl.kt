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
 * 3 4 5   ← 각 면을 외부에서 바라본 위치 (face * 9 + position)
 * 6 7 8
 * ```
 * - CW(시계방향): rotateFaceCW — 0←6←8←2←0, 1←3←7←5←1
 *
 * ### 면 오프셋
 * U=0, R=9, F=18, D=27, L=36, B=45
 *
 * ### 인접 면 치환 (cycle4 방향: a→b→c→d→a)
 * U CW : F[0,1,2]→R[0,1,2]→B[0,1,2]→L[0,1,2]
 * R CW : U[2,5,8]→B[6,3,0]→D[2,5,8]→F[2,5,8]
 * F CW : U[6,7,8]→R[0,3,6]→D[2,1,0]→L[8,5,2]
 * D CW : F[6,7,8]→L[6,7,8]→B[6,7,8]→R[6,7,8]
 * L CW : U[0,3,6]→F[0,3,6]→D[0,3,6]→B[8,5,2]
 * B CW : U[2,1,0]→L[0,3,6]→D[6,7,8]→R[8,5,2]
 */
class CubeLogicImpl : CubeLogic {

    override fun applyMove(state: DomainCubeState, move: Move): DomainCubeState {
        val next = state.facelets.copyOf()
        when (move) {
            Move.U       -> applyU(next)
            Move.U_PRIME -> repeat(3) { applyU(next) }
            Move.U2      -> repeat(2) { applyU(next) }
            Move.R       -> applyR(next)
            Move.R_PRIME -> repeat(3) { applyR(next) }
            Move.R2      -> repeat(2) { applyR(next) }
            Move.F       -> applyF(next)
            Move.F_PRIME -> repeat(3) { applyF(next) }
            Move.F2      -> repeat(2) { applyF(next) }
            Move.D       -> applyD(next)
            Move.D_PRIME -> repeat(3) { applyD(next) }
            Move.D2      -> repeat(2) { applyD(next) }
            Move.L       -> applyL(next)
            Move.L_PRIME -> repeat(3) { applyL(next) }
            Move.L2      -> repeat(2) { applyL(next) }
            Move.B       -> applyB(next)
            Move.B_PRIME -> repeat(3) { applyB(next) }
            Move.B2      -> repeat(2) { applyB(next) }
        }
        return DomainCubeState(next)
    }

    override fun shuffle(state: DomainCubeState, moveCount: Int): Pair<DomainCubeState, List<Move>> {
        val allMoves = Move.entries
        val moves = mutableListOf<Move>()
        var current = state
        var lastMove: Move? = null
        repeat(moveCount) {
            val next = allMoves.filter { it.name[0] != lastMove?.name?.get(0) }.random()
            moves += next
            current = applyMove(current, next)
            lastMove = next
        }
        return current to moves
    }

    // ──────────────────────────────────────────────────────────────
    // 개별 면 회전 (CW 1회전 인플레이스)
    // ──────────────────────────────────────────────────────────────

    private fun applyU(f: IntArray) {
        rotateFaceCW(f, 0)
        // F[0,1,2] → R[0,1,2] → B[0,1,2] → L[0,1,2]
        cycle4(f,
            18, 19, 20,   // F top row
             9, 10, 11,   // R top row
            45, 46, 47,   // B top row
            36, 37, 38,   // L top row
        )
    }

    private fun applyR(f: IntArray) {
        rotateFaceCW(f, 1)
        // U[2,5,8] → B[6,3,0] → D[2,5,8] → F[2,5,8]  (B는 인덱스 역순)
        cycle4(f,
             2,  5,  8,   // U right col
            51, 48, 45,   // B left col reversed
            29, 32, 35,   // D right col
            20, 23, 26,   // F right col
        )
    }

    private fun applyF(f: IntArray) {
        rotateFaceCW(f, 2)
        // U[6,7,8] → R[0,3,6] → D[2,1,0] → L[8,5,2]
        cycle4(f,
             6,  7,  8,   // U bottom row
             9, 12, 15,   // R left col
            29, 28, 27,   // D top row reversed
            44, 41, 38,   // L right col reversed
        )
    }

    private fun applyD(f: IntArray) {
        rotateFaceCW(f, 3)
        // F[6,7,8] → L[6,7,8] → B[6,7,8] → R[6,7,8]
        cycle4(f,
            24, 25, 26,   // F bottom row
            42, 43, 44,   // L bottom row
            51, 52, 53,   // B bottom row
            15, 16, 17,   // R bottom row
        )
    }

    private fun applyL(f: IntArray) {
        rotateFaceCW(f, 4)
        // U[0,3,6] → F[0,3,6] → D[0,3,6] → B[8,5,2]  (B는 인덱스 역순)
        cycle4(f,
             0,  3,  6,   // U left col
            18, 21, 24,   // F left col
            27, 30, 33,   // D left col
            53, 50, 47,   // B right col reversed
        )
    }

    private fun applyB(f: IntArray) {
        rotateFaceCW(f, 5)
        // U[2,1,0] → L[0,3,6] → D[6,7,8] → R[8,5,2]  (U,R는 인덱스 역순)
        cycle4(f,
             2,  1,  0,   // U top row reversed
            36, 39, 42,   // L left col
            33, 34, 35,   // D bottom row
            17, 14, 11,   // R right col reversed
        )
    }

    // ──────────────────────────────────────────────────────────────
    // 헬퍼 함수
    // ──────────────────────────────────────────────────────────────

    /**
     * [faceIndex]번 면의 9개 파세렛을 시계방향으로 1회 회전한다 (인플레이스).
     * 코너: 0←6←8←2←0 / 엣지: 1←3←7←5←1 (센터[4] 고정)
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

    /**
     * 4개 파세렛 그룹을 순환 치환한다 (a→b→c→d→a).
     * a의 값이 b로, b의 값이 c로, c의 값이 d로, d의 값이 a로 이동한다.
     */
    private fun cycle4(
        f: IntArray,
        a0: Int, a1: Int, a2: Int,
        b0: Int, b1: Int, b2: Int,
        c0: Int, c1: Int, c2: Int,
        d0: Int, d1: Int, d2: Int,
    ) {
        val t0 = f[a0]; val t1 = f[a1]; val t2 = f[a2]
        f[a0] = f[d0]; f[a1] = f[d1]; f[a2] = f[d2]
        f[d0] = f[c0]; f[d1] = f[c1]; f[d2] = f[c2]
        f[c0] = f[b0]; f[c1] = f[b1]; f[c2] = f[b2]
        f[b0] = t0;    f[b1] = t1;    f[b2] = t2
    }
}
