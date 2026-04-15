package com.metrex.cube.display

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChange
import com.metrex.cube.domain.model.CubeFace
import com.metrex.cube.domain.model.DomainCubeState
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

// ── 3D 벡터 ──────────────────────────────────────────────────────────────────

private data class Vec3(val x: Float, val y: Float, val z: Float) {
    operator fun plus(o: Vec3) = Vec3(x + o.x, y + o.y, z + o.z)
    operator fun times(s: Float) = Vec3(x * s, y * s, z * s)
}

private fun Vec3.project(scale: Float, camZ: Float, cx: Float, cy: Float): Offset {
    val depth = camZ + z
    val f = if (depth > 0.01f) scale * camZ / depth else scale
    return Offset(cx + x * f, cy + y * f)
}

// ── 회전 행렬 (행우선 3×3) ────────────────────────────────────────────────────
//
// 저장 형식: FloatArray(9), m[i*3+j] = row i, col j
// 변환:     v' = M * v  →  v'.x = m[0]*v.x + m[1]*v.y + m[2]*v.z, …
//
// 드래그마다 화면(world) 좌표계에서 증분 회전을 앞에서 곱한다:
//   M_new = Ry(dx) * Rx(dy) * M_current
// → "위 스와이프 = 항상 위로 회전"이 큐브 방향과 무관하게 유지된다.

/** v' = M * v */
private fun Vec3.transform(m: FloatArray) = Vec3(
    m[0] * x + m[1] * y + m[2] * z,
    m[3] * x + m[4] * y + m[5] * z,
    m[6] * x + m[7] * y + m[8] * z,
)

/** A * B (행렬 곱) */
private fun matMul(a: FloatArray, b: FloatArray): FloatArray {
    val r = FloatArray(9)
    for (i in 0..2) for (j in 0..2) {
        r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]
    }
    return r
}

/** X축 회전 행렬 (라디안) */
private fun matRotX(rad: Float): FloatArray {
    val s = sin(rad); val c = cos(rad)
    return floatArrayOf(1f, 0f, 0f,   0f, c, -s,   0f, s, c)
}

/** Y축 회전 행렬 (라디안) */
private fun matRotY(rad: Float): FloatArray {
    val s = sin(rad); val c = cos(rad)
    return floatArrayOf(c, 0f, s,   0f, 1f, 0f,   -s, 0f, c)
}

/** 초기 회전: rotX(-25°) 적용 후 rotY(45°) 적용과 동일한 행렬 */
private fun defaultRotMatrix(): FloatArray {
    val toRad = (PI / 180.0).toFloat()
    return matMul(matRotY(45f * toRad), matRotX(-25f * toRad))
}

// ── 면 정의 ──────────────────────────────────────────────────────────────────
// 큐브는 각 축 -1.5 ~ +1.5 (총 3 단위). 스티커 간격 = 1 단위.

private data class FaceDef(
    val idx: Int, val origin: Vec3, val right: Vec3, val down: Vec3, val normal: Vec3,
)

private val FACE_DEFS = listOf(
    // U (0): y=-1.5, 위에서 내려다봄. row→+z(F쪽), col→+x(R쪽)
    FaceDef(0, Vec3(-1f, -1.5f, -1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f,  1f), Vec3( 0f,-1f, 0f)),
    // R (1): x=+1.5, 오른쪽에서 봄.  col→-z(B쪽), row→+y(D쪽)
    FaceDef(1, Vec3( 1.5f,-1f,  1f), Vec3( 0f, 0f, -1f), Vec3(0f, 1f,  0f), Vec3( 1f, 0f, 0f)),
    // F (2): z=+1.5, 정면에서 봄.   col→+x(R쪽), row→+y(D쪽)
    FaceDef(2, Vec3(-1f, -1f,  1.5f), Vec3( 1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f, 1f)),
    // D (3): y=+1.5, 아래에서 봄.  col→+x(R쪽), row→-z(B쪽)
    FaceDef(3, Vec3(-1f,  1.5f, 1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f, -1f), Vec3( 0f, 1f, 0f)),
    // L (4): x=-1.5, 왼쪽에서 봄.  col→+z(F쪽), row→+y(D쪽)
    FaceDef(4, Vec3(-1.5f,-1f, -1f), Vec3( 0f, 0f,  1f), Vec3(0f, 1f,  0f), Vec3(-1f, 0f, 0f)),
    // B (5): z=-1.5, 뒤에서 봄.   col→-x(L쪽), row→+y(D쪽)
    FaceDef(5, Vec3( 1f, -1f, -1.5f), Vec3(-1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f,-1f)),
)

// 각 면의 3D 중심 (sticker grid 중앙 = row=1, col=1 위치)
private val FACE_CENTERS: List<Vec3> = FACE_DEFS.map { f ->
    f.origin + f.right * 1f + f.down * 1f
}

// ── 색상 매핑 (CubeColor.argb 기준) ─────────────────────────────────────────

private val STICKER_COLORS = arrayOf(
    Color(0xFFFFFFFF), // 0 = U = White
    Color(0xFFB71234), // 1 = R = Red
    Color(0xFF009B48), // 2 = F = Green
    Color(0xFFFFD500), // 3 = D = Yellow
    Color(0xFFFF5800), // 4 = L = Orange
    Color(0xFF0046AD), // 5 = B = Blue
)

// ── 스티커 데이터 ─────────────────────────────────────────────────────────────

private class StickerQuad(val color: Color, val corners: Array<Vec3>)

/**
 * 면별로 9개 스티커 quad를 생성한다.
 * [halfSize] = 스티커 중심에서 모서리까지의 거리 (단위: cube unit).
 * 스티커 간격 = 1.0 unit이므로 gap = 1.0 - 2*halfSize.
 * halfSize=0.46 → gap=0.08 (검은 배경이 보이는 얇은 테두리).
 */
private fun buildStickers(facelets: IntArray, halfSize: Float = 0.46f): Map<Int, List<StickerQuad>> =
    FACE_DEFS.associate { face ->
        face.idx to buildList {
            for (row in 0..2) {
                for (col in 0..2) {
                    val color = STICKER_COLORS[facelets[face.idx * 9 + row * 3 + col]]
                    val center = face.origin +
                        face.right * col.toFloat() +
                        face.down  * row.toFloat()
                    val r = face.right * halfSize
                    val d = face.down  * halfSize
                    add(StickerQuad(color, arrayOf(
                        center + r * -1f + d * -1f,
                        center + r *  1f + d * -1f,
                        center + r *  1f + d *  1f,
                        center + r * -1f + d *  1f,
                    )))
                }
            }
        }
    }

/** 면 전체를 덮는 검은 배경 quad의 4 꼭짓점 (halfSize=1.5 → 스티커 외곽까지 커버). */
private fun faceBackgroundCorners(face: FaceDef): Array<Vec3> {
    val center = FACE_CENTERS[face.idx]
    val r = face.right * 1.5f
    val d = face.down  * 1.5f
    return arrayOf(
        center + r * -1f + d * -1f,
        center + r *  1f + d * -1f,
        center + r *  1f + d *  1f,
        center + r * -1f + d *  1f,
    )
}

// ── 렌더링 ────────────────────────────────────────────────────────────────────

private fun DrawScope.drawCube(
    stickers: Map<Int, List<StickerQuad>>,
    rotMatrix: FloatArray,
    cameraDistance: Float,
) {
    val scale = size.minDimension * 0.12f
    val camZ  = cameraDistance * scale
    val cx    = size.width  / 2f
    val cy    = size.height / 2f

    // 로컬 확장 함수: 회전 · 투영
    fun Vec3.rot()  = transform(rotMatrix)
    fun Vec3.proj() = project(scale, camZ, cx, cy)

    // ① 백페이스 컬링: 법선 Z > 0 인 면만 표시
    //    (카메라 방향으로 향하는 면만 렌더링 → 뒷면 완전히 제거)
    val visibleFaces = FACE_DEFS
        .filter { face -> face.normal.rot().z > 0f }
        .sortedBy  { face -> FACE_CENTERS[face.idx].rot().z }  // 뒤→앞 순서

    val path = Path()

    for (face in visibleFaces) {
        // ② 검은 배경: 면 전체를 먼저 채워 스티커 틈새가 보이지 않게 한다
        val bgProj = faceBackgroundCorners(face).map { it.rot().proj() }
        path.reset()
        path.moveTo(bgProj[0].x, bgProj[0].y)
        for (i in 1..3) path.lineTo(bgProj[i].x, bgProj[i].y)
        path.close()
        drawPath(path, Color.Black)

        // ③ 스티커: Z 오름차순 정렬 후 면 색상 그리기
        val faceStickers = stickers[face.idx] ?: continue
        val sorted = faceStickers.map { q ->
            val rot = Array(4) { q.corners[it].rot() }
            val avgZ = (rot[0].z + rot[1].z + rot[2].z + rot[3].z) / 4f
            Triple(q.color, Array(4) { rot[it].proj() }, avgZ)
        }.sortedBy { it.third }

        for ((color, pts, _) in sorted) {
            path.reset()
            path.moveTo(pts[0].x, pts[0].y)
            for (i in 1..3) path.lineTo(pts[i].x, pts[i].y)
            path.close()
            drawPath(path, color)
        }
    }
}

// ── 공개 컴포저블 ──────────────────────────────────────────────────────────────

/**
 * 전체 큐브를 3D로 렌더링한다.
 *
 * ## 렌더링 전략
 * - 백페이스 컬링: 카메라를 향하는 3개 면만 렌더링 (뒷면 완전 제거)
 * - 면 배경: 각 면을 검은색으로 먼저 채워 스티커 틈새 투과 차단
 * - 스티커: halfSize=0.46 (gap=0.08), 검은 배경이 얇은 테두리로 보임
 * - 면 순서: 뒤→앞 (Painter's algorithm, 면 단위)
 * - 회전: 3×3 행렬 누적 (world-space 증분 회전) → 방향 일관성 보장
 *
 * TODO(Phase 3): 레이어 스와이프 감지 → [onLayerRotate] 콜백 연결
 * TODO(Phase 4): Fling + Animatable 스냅 애니메이션
 */
@Composable
fun CubeRenderer(
    cubeState: DomainCubeState,
    modifier: Modifier = Modifier,
    onLayerRotate: (face: CubeFace, clockwise: Boolean) -> Unit = { _, _ -> },
) {
    var rotMatrix by remember { mutableStateOf(defaultRotMatrix()) }
    val stickers   = remember(cubeState) { buildStickers(cubeState.facelets) }

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                val sensitivity = 0.4f * (PI / 180.0).toFloat()
                awaitEachGesture {
                    awaitFirstDown()
                    do {
                        val event = awaitPointerEvent()
                        val delta = event.changes.firstOrNull()?.positionChange() ?: break
                        // 화면(world) 좌표계에서 증분 회전을 앞에서 곱한다:
                        //   M_new = Ry(dx) * Rx(-dy) * M
                        // → 큐브가 어느 방향을 향하든 "위 스와이프 = 위로 회전"
                        val rx = matRotX(-delta.y * sensitivity)
                        val ry = matRotY( delta.x * sensitivity)
                        rotMatrix = matMul(ry, matMul(rx, rotMatrix))
                        event.changes.forEach { it.consume() }
                    } while (event.changes.any { it.pressed })
                }
            },
    ) {
        drawCube(stickers, rotMatrix, cameraDistance = 12f)
    }
}
