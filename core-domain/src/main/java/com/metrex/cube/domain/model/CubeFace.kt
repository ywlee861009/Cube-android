package com.metrex.cube.domain.model

/**
 * 54개 파세렛 배열에서 각 면의 시작 인덱스를 정의한다.
 * 순서: U(0-8), R(9-17), F(18-26), D(27-35), L(36-44), B(45-53)
 *
 * 각 면의 파세렛 레이아웃 (정면에서 바라본 기준):
 * ```
 * 0 1 2
 * 3 4 5
 * 6 7 8
 * ```
 */
enum class CubeFace(val index: Int, val solvedColor: CubeColor) {
    UP(0, CubeColor.WHITE),
    RIGHT(1, CubeColor.RED),
    FRONT(2, CubeColor.GREEN),
    DOWN(3, CubeColor.YELLOW),
    LEFT(4, CubeColor.ORANGE),
    BACK(5, CubeColor.BLUE);

    val offset: Int get() = index * 9
}
