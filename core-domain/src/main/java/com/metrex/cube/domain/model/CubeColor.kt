package com.metrex.cube.domain.model

/**
 * 큐브 6면의 색상.
 * [argb]는 렌더링 레이어에서 참조할 수 있도록 노출하되,
 * core-domain 자체는 Android 의존성이 없으므로 Long 원시값으로 보관한다.
 */
enum class CubeColor(val argb: Long) {
    WHITE(0xFFFFFFFF),
    RED(0xFFB71234),
    GREEN(0xFF009B48),
    YELLOW(0xFFFFD500),
    ORANGE(0xFFFF5800),
    BLUE(0xFF0046AD),
}
