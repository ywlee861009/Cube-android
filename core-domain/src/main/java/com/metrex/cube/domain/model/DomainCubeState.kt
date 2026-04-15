package com.metrex.cube.domain.model

/**
 * 큐브 논리 상태.
 *
 * [facelets]: 크기 54의 IntArray. 각 원소는 [CubeFace.index] 값(0-5)으로,
 *             해당 파세렛의 현재 색상을 나타낸다.
 *             인덱스 규칙: face * 9 + position (position: 0=좌상단, 8=우하단).
 *
 * IntArray를 사용하여 data class의 equals/copy 비용을 최소화한다.
 * MVI State에서 불변성을 유지하려면 항상 [copy]를 통해 새 인스턴스를 생성한다.
 */
data class DomainCubeState(
    val facelets: IntArray = solvedFacelets(),
) {
    fun isSolved(): Boolean = facelets.contentEquals(solvedFacelets())

    fun copy(facelets: IntArray = this.facelets.copyOf()) = DomainCubeState(facelets)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is DomainCubeState) return false
        return facelets.contentEquals(other.facelets)
    }

    override fun hashCode(): Int = facelets.contentHashCode()

    companion object {
        /** 완성 상태: 각 면의 9개 파세렛이 모두 해당 면의 색상으로 채워진 배열. */
        fun solvedFacelets(): IntArray = IntArray(54) { it / 9 }
    }
}
