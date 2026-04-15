package com.metrex.cube.domain.model

/**
 * 18개의 표준 큐브 이동.
 * 각 면에 대해 시계방향(CW), 반시계방향(CCW, _PRIME), 180도(_2) 회전.
 */
enum class Move {
    U, U_PRIME, U2,
    R, R_PRIME, R2,
    F, F_PRIME, F2,
    D, D_PRIME, D2,
    L, L_PRIME, L2,
    B, B_PRIME, B2,
    // 중간 슬라이스 (터치 레이어 회전용)
    M, M_PRIME, M2,   // L/R 사이 세로 슬라이스 (L 방향 기준)
    E, E_PRIME, E2,   // U/D 사이 가로 슬라이스 (D 방향 기준)
    S, S_PRIME, S2;   // F/B 사이 앞뒤 슬라이스 (F 방향 기준)

    /** 역방향 무브를 반환한다 (솔버에서 역추적 시 사용). */
    fun inverse(): Move = when (this) {
        U -> U_PRIME; U_PRIME -> U; U2 -> U2
        R -> R_PRIME; R_PRIME -> R; R2 -> R2
        F -> F_PRIME; F_PRIME -> F; F2 -> F2
        D -> D_PRIME; D_PRIME -> D; D2 -> D2
        L -> L_PRIME; L_PRIME -> L; L2 -> L2
        B -> B_PRIME; B_PRIME -> B; B2 -> B2
        M -> M_PRIME; M_PRIME -> M; M2 -> M2
        E -> E_PRIME; E_PRIME -> E; E2 -> E2
        S -> S_PRIME; S_PRIME -> S; S2 -> S2
    }
}
