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
import com.metrex.cube.display.model.RotationState
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

private fun Vec3.rotX(s: Float, c: Float) = Vec3(x, y * c - z * s, y * s + z * c)
private fun Vec3.rotY(s: Float, c: Float) = Vec3(x * c + z * s, y, -x * s + z * c)

private fun Vec3.project(scale: Float, camZ: Float, cx: Float, cy: Float): Offset {
    val depth = camZ + z
    val f = if (depth > 0.01f) scale * camZ / depth else scale
    return Offset(cx + x * f, cy + y * f)
}

// ── 면 정의 ──────────────────────────────────────────────────────────────────
// 큐브는 각 축 -1.5 ~ +1.5 (총 3 단위). 스티커 간격 = 1 단위.
//
// origin = sticker[row=0, col=0] 의 3D 중심 (면 외부에서 바라봤을 때 좌상단)
// right  = col 증가 방향 (단위 벡터)
// down   = row 증가 방향 (단위 벡터)
// normal = 면 외부 법선벡터
//
// 면별 sticker 인접 관계 (CubeLogicImpl TODO 주석과 일치):
//   U CW : F[0,1,2]→R[0,1,2]→B[0,1,2]→L[0,1,2]
//   R CW : U[2,5,8]→B[6,3,0]→D[2,5,8]→F[2,5,8]
//   F CW : U[6,7,8]→R[0,3,6]→D[2,1,0]→L[8,5,2]
//   D CW : F[6,7,8]→L[6,7,8]→B[6,7,8]→R[6,7,8]  (아래서 CW = 위서 CCW)
//   L CW : U[0,3,6]→F[0,3,6]→D[0,3,6]→B[8,5,2]
//   B CW : U[2,1,0]→L[0,3,6]→D[6,7,8]→R[8,5,2]

private data class FaceDef(
    val idx: Int, val origin: Vec3, val right: Vec3, val down: Vec3, val normal: Vec3,
)

private val FACE_DEFS = listOf(
    // U (0): y=-1.5, 위에서 내려다봄. row→+z(F쪽), col→+x(R쪽)
    FaceDef(0, Vec3(-1f, -1.5f, -1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f,  1f), Vec3( 0f,-1f, 0f)),
    // R (1): x=+1.5, 오른쪽에서 봄. col→-z(B쪽), row→+y(D쪽)
    FaceDef(1, Vec3( 1.5f,-1f,  1f), Vec3( 0f, 0f, -1f), Vec3(0f, 1f,  0f), Vec3( 1f, 0f, 0f)),
    // F (2): z=+1.5, 정면에서 봄.   col→+x(R쪽), row→+y(D쪽)
    FaceDef(2, Vec3(-1f, -1f,  1.5f), Vec3( 1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f, 1f)),
    // D (3): y=+1.5, 아래에서 봄.  col→+x(R쪽), row→-z(B쪽)
    FaceDef(3, Vec3(-1f,  1.5f, 1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f, -1f), Vec3( 0f, 1f, 0f)),
    // L (4): x=-1.5, 왼쪽에서 봄.  col→+z(F쪽), row→+y(D쪽)
    FaceDef(4, Vec3(-1.5f,-1f, -1f), Vec3( 0f, 0f,  1f), Vec3(0f, 1f,  0f), Vec3(-1f, 0f, 0f)),
    // B (5): z=-1.5, 뒤에서 봄.    col→-x(L쪽), row→+y(D쪽)
    FaceDef(5, Vec3( 1f, -1f, -1.5f), Vec3(-1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f,-1f)),
)

// ── 색상 매핑 (CubeColor.argb 기준) ─────────────────────────────────────────

private val STICKER_COLORS = arrayOf(
    Color(0xFFFFFFFF), // 0 = U = White
    Color(0xFFB71234), // 1 = R = Red
    Color(0xFF009B48), // 2 = F = Green
    Color(0xFFFFD500), // 3 = D = Yellow
    Color(0xFFFF5800), // 4 = L = Orange
    Color(0xFF0046AD), // 5 = B = Blue
)

// ── 스티커 쿼드 ───────────────────────────────────────────────────────────────

private class StickerQuad(val color: Color, val corners: Array<Vec3>)

private class Proj(val color: Color, val pts: Array<Offset>, val avgZ: Float)

/**
 * 현재 큐브 상태([facelets])로부터 54개의 스티커 3D 사각형을 생성한다.
 * [halfSize]: 스티커 반변 길이 (간격 포함 0.5에서 약간 줄임).
 */
private fun buildStickers(facelets: IntArray, halfSize: Float = 0.42f): List<StickerQuad> =
    buildList {
        for (face in FACE_DEFS) {
            for (row in 0..2) {
                for (col in 0..2) {
                    val color = STICKER_COLORS[facelets[face.idx * 9 + row * 3 + col]]
                    val center = face.origin +
                        face.right * col.toFloat() +
                        face.down  * row.toFloat()
                    val r = face.right * halfSize
                    val d = face.down  * halfSize
                    add(StickerQuad(color, arrayOf(
                        center + r * -1f + d * -1f, // 좌상
                        center + r *  1f + d * -1f, // 우상
                        center + r *  1f + d *  1f, // 우하
                        center + r * -1f + d *  1f, // 좌하
                    )))
                }
            }
        }
    }

// ── 렌더링 ────────────────────────────────────────────────────────────────────

private fun DrawScope.drawCube(stickers: List<StickerQuad>, rotation: RotationState) {
    val toRad = (PI / 180.0).toFloat()
    val sX = sin(rotation.rotationX * toRad)
    val cX = cos(rotation.rotationX * toRad)
    val sY = sin(rotation.rotationY * toRad)
    val cY = cos(rotation.rotationY * toRad)

    val scale = size.minDimension * 0.12f
    val camZ  = rotation.cameraDistance * scale
    val cx    = size.width  / 2f
    val cy    = size.height / 2f

    // 1) 회전 · 투영
    val projected = stickers.map { q ->
        val rot = Array(4) { q.corners[it].rotX(sX, cX).rotY(sY, cY) }
        val avgZ = (rot[0].z + rot[1].z + rot[2].z + rot[3].z) / 4f
        Proj(q.color, Array(4) { rot[it].project(scale, camZ, cx, cy) }, avgZ)
    }

    // 2) Painter's algorithm: Z 오름차순 (뒤→앞)
    val sorted = projected.sortedBy { it.avgZ }

    val path = Path()
    for (p in sorted) {
        // 검은 테두리: 쿼드 전체를 검정으로
        path.reset()
        path.moveTo(p.pts[0].x, p.pts[0].y)
        for (i in 1..3) path.lineTo(p.pts[i].x, p.pts[i].y)
        path.close()
        drawPath(path, Color.Black)

        // 스티커 색: 중심 기준 88% 축소 (검은 테두리 노출)
        val qcx = (p.pts[0].x + p.pts[1].x + p.pts[2].x + p.pts[3].x) / 4f
        val qcy = (p.pts[0].y + p.pts[1].y + p.pts[2].y + p.pts[3].y) / 4f
        path.reset()
        for (i in 0..3) {
            val px = qcx + (p.pts[i].x - qcx) * 0.88f
            val py = qcy + (p.pts[i].y - qcy) * 0.88f
            if (i == 0) path.moveTo(px, py) else path.lineTo(px, py)
        }
        path.close()
        drawPath(path, p.color)
    }
}

// ── 공개 컴포저블 ──────────────────────────────────────────────────────────────

/**
 * 전체 큐브를 3D로 렌더링한다.
 *
 * - Canvas에 수동 3D 투영(원근법)으로 6면 × 9 스티커를 그린다.
 * - 드래그로 rotationX/Y를 갱신하여 시점을 변경할 수 있다.
 * - Painter's algorithm으로 깊이 정렬 → Z-fighting 없이 올바른 면 노출.
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
    var rotation by remember { mutableStateOf(RotationState()) }
    val stickers  = remember(cubeState) { buildStickers(cubeState.facelets) }

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitEachGesture {
                    awaitFirstDown()
                    do {
                        val event = awaitPointerEvent()
                        val delta = event.changes.firstOrNull()?.positionChange() ?: break
                        rotation = rotation.copy(
                            rotationX = (rotation.rotationX - delta.y * 0.4f).coerceIn(-90f, 90f),
                            rotationY = rotation.rotationY + delta.x * 0.4f,
                        )
                        event.changes.forEach { it.consume() }
                    } while (event.changes.any { it.pressed })
                }
            },
    ) {
        drawCube(stickers, rotation)
    }
}
