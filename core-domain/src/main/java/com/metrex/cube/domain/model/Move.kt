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
    B, B_PRIME, B2;

    /** 역방향 무브를 반환한다 (솔버에서 역추적 시 사용). */
    fun inverse(): Move = when (this) {
        U -> U_PRIME; U_PRIME -> U; U2 -> U2
        R -> R_PRIME; R_PRIME -> R; R2 -> R2
        F -> F_PRIME; F_PRIME -> F; F2 -> F2
        D -> D_PRIME; D_PRIME -> D; D2 -> D2
        L -> L_PRIME; L_PRIME -> L; L2 -> L2
        B -> B_PRIME; B_PRIME -> B; B2 -> B2
    }
}
