package com.metrex.cube.display

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.positionChange
import com.metrex.cube.domain.model.Move
import com.metrex.cube.domain.model.DomainCubeState
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.sign
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

private fun Vec3.transform(m: FloatArray) = Vec3(
    m[0] * x + m[1] * y + m[2] * z,
    m[3] * x + m[4] * y + m[5] * z,
    m[6] * x + m[7] * y + m[8] * z,
)

private fun matMul(a: FloatArray, b: FloatArray): FloatArray {
    val r = FloatArray(9)
    for (i in 0..2) for (j in 0..2) {
        r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]
    }
    return r
}

private fun matRotX(rad: Float): FloatArray {
    val s = sin(rad); val c = cos(rad)
    return floatArrayOf(1f, 0f, 0f,   0f, c, -s,   0f, s, c)
}

private fun matRotY(rad: Float): FloatArray {
    val s = sin(rad); val c = cos(rad)
    return floatArrayOf(c, 0f, s,   0f, 1f, 0f,   -s, 0f, c)
}

private fun matRotZ(rad: Float): FloatArray {
    val s = sin(rad); val c = cos(rad)
    return floatArrayOf(c, -s, 0f,   s, c, 0f,   0f, 0f, 1f)
}

private fun defaultRotMatrix(): FloatArray {
    val toRad = (PI / 180.0).toFloat()
    return matMul(matRotY(45f * toRad), matRotX(-25f * toRad))
}

// ── 면 정의 ──────────────────────────────────────────────────────────────────

private data class FaceDef(
    val idx: Int, val origin: Vec3, val right: Vec3, val down: Vec3, val normal: Vec3,
)

private val FACE_DEFS = listOf(
    FaceDef(0, Vec3(-1f, -1.5f, -1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f,  1f), Vec3( 0f,-1f, 0f)),
    FaceDef(1, Vec3( 1.5f,-1f,  1f), Vec3( 0f, 0f, -1f), Vec3(0f, 1f,  0f), Vec3( 1f, 0f, 0f)),
    FaceDef(2, Vec3(-1f, -1f,  1.5f), Vec3( 1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f, 1f)),
    FaceDef(3, Vec3(-1f,  1.5f, 1f), Vec3( 1f, 0f,  0f), Vec3(0f, 0f, -1f), Vec3( 0f, 1f, 0f)),
    FaceDef(4, Vec3(-1.5f,-1f, -1f), Vec3( 0f, 0f,  1f), Vec3(0f, 1f,  0f), Vec3(-1f, 0f, 0f)),
    FaceDef(5, Vec3( 1f, -1f, -1.5f), Vec3(-1f, 0f,  0f), Vec3(0f, 1f,  0f), Vec3( 0f, 0f,-1f)),
)

private val FACE_CENTERS: List<Vec3> = FACE_DEFS.map { f ->
    f.origin + f.right * 1f + f.down * 1f
}

// ── 색상 ─────────────────────────────────────────────────────────────────────

private val STICKER_COLORS = arrayOf(
    Color(0xFFFFFFFF),
    Color(0xFFB71234),
    Color(0xFF009B48),
    Color(0xFFFFD500),
    Color(0xFFFF5800),
    Color(0xFF0046AD),
)

// ── 레이어 드래그 보조 타입 ──────────────────────────────────────────────────

private enum class RotAxis { X, Y, Z }

private data class LayerInfo(
    val axis: RotAxis,
    val layerCoord: Int,    // -1, 0, +1
    val visualSign: Float,  // +1 or -1: positive angle → CW rotation of this move
)

private data class CubieKey(val lx: Int, val ly: Int, val lz: Int)

private data class LayerDragState(
    val move: Move,
    val layerInfo: LayerInfo,
    val angleRad: Float,
)

// ── 스티커 데이터 ─────────────────────────────────────────────────────────────

private class StickerQuad(
    val color: Color,
    val corners: Array<Vec3>,
    val center: Vec3,  // cube-space 3D center (레이어 소속 판정, 큐비 식별에 사용)
)

private fun buildStickers(facelets: IntArray, halfSize: Float = 0.46f): Map<Int, List<StickerQuad>> =
    FACE_DEFS.associate { face ->
        face.idx to buildList {
            for (row in 0..2) {
                for (col in 0..2) {
                    val color = STICKER_COLORS[facelets[face.idx * 9 + row * 3 + col]]
                    val center = face.origin + face.right * col.toFloat() + face.down * row.toFloat()
                    val r = face.right * halfSize
                    val d = face.down  * halfSize
                    add(StickerQuad(
                        color = color,
                        corners = arrayOf(
                            center + r * -1f + d * -1f,
                            center + r *  1f + d * -1f,
                            center + r *  1f + d *  1f,
                            center + r * -1f + d *  1f,
                        ),
                        center = center,
                    ))
                }
            }
        }
    }

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

// ── 레이어 드래그 헬퍼 함수 ──────────────────────────────────────────────────

/** cube-space 좌표를 레이어 인덱스 -1/0/+1 로 반올림 */
private fun Float.roundToLayer(): Int = when {
    this < -0.5f -> -1
    this >  0.5f ->  1
    else         ->  0
}

/**
 * Move → (회전 축, 레이어 좌표, visualSign)
 * visualSign: +1이면 positive angleRad → 해당 Move의 CW 방향 시각 회전
 */
private fun Move.toLayerInfo(): LayerInfo = when (this) {
    Move.U       -> LayerInfo(RotAxis.Y, -1, +1f)
    Move.U_PRIME -> LayerInfo(RotAxis.Y, -1, -1f)
    Move.E       -> LayerInfo(RotAxis.Y,  0, -1f)  // E는 D 방향(Y 음수)
    Move.E_PRIME -> LayerInfo(RotAxis.Y,  0, +1f)
    Move.D       -> LayerInfo(RotAxis.Y, +1, -1f)
    Move.D_PRIME -> LayerInfo(RotAxis.Y, +1, +1f)
    Move.R       -> LayerInfo(RotAxis.X, +1, +1f)
    Move.R_PRIME -> LayerInfo(RotAxis.X, +1, -1f)
    Move.M       -> LayerInfo(RotAxis.X,  0, -1f)  // M은 L 방향(X 음수)
    Move.M_PRIME -> LayerInfo(RotAxis.X,  0, +1f)
    Move.L       -> LayerInfo(RotAxis.X, -1, -1f)
    Move.L_PRIME -> LayerInfo(RotAxis.X, -1, +1f)
    Move.F       -> LayerInfo(RotAxis.Z, +1, +1f)
    Move.F_PRIME -> LayerInfo(RotAxis.Z, +1, -1f)
    Move.S       -> LayerInfo(RotAxis.Z,  0, +1f)  // S는 F 방향
    Move.S_PRIME -> LayerInfo(RotAxis.Z,  0, -1f)
    Move.B       -> LayerInfo(RotAxis.Z, -1, -1f)
    Move.B_PRIME -> LayerInfo(RotAxis.Z, -1, +1f)
    else         -> LayerInfo(RotAxis.Y, -1, +1f)  // _2 무브 드래그 미사용
}

/** 스티커가 주어진 레이어에 속하는지 (center 좌표 기준) */
private fun StickerQuad.isInLayer(layer: LayerInfo): Boolean {
    val coord = when (layer.axis) {
        RotAxis.X -> center.x
        RotAxis.Y -> center.y
        RotAxis.Z -> center.z
    }
    return coord.roundToLayer() == layer.layerCoord
}

/** (faceIdx, row, col) → 해당 스티커가 속한 큐비의 고유 키 */
private fun cubieKeyOf(faceIdx: Int, row: Int, col: Int): CubieKey {
    val face = FACE_DEFS[faceIdx]
    val c = face.origin + face.right * col.toFloat() + face.down * row.toFloat()
    return CubieKey(c.x.roundToLayer(), c.y.roundToLayer(), c.z.roundToLayer())
}

// ── 히트 테스트 ───────────────────────────────────────────────────────────────

private data class HitResult(val faceIdx: Int, val row: Int, val col: Int)

/** 2D 스크린 좌표 pt 가 볼록 사각형 quad 안에 있는지 검사 (cross product 부호 일치). */
private fun pointInQuad(pt: Offset, quad: Array<Offset>): Boolean {
    fun cross(o: Offset, a: Offset, b: Offset) =
        (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
    val s0 = cross(quad[0], quad[1], pt) >= 0f
    val s1 = cross(quad[1], quad[2], pt) >= 0f
    val s2 = cross(quad[2], quad[3], pt) >= 0f
    val s3 = cross(quad[3], quad[0], pt) >= 0f
    return s0 == s1 && s1 == s2 && s2 == s3
}

/**
 * 터치 포인트가 어느 스티커 위에 있는지 반환한다.
 * 앞쪽(z 큰) 면부터 검사해 가장 먼저 히트되는 스티커를 반환.
 */
private fun hitTest(
    pt: Offset,
    rotMatrix: FloatArray,
    scale: Float,
    camZ: Float,
    cx: Float,
    cy: Float,
): HitResult? {
    fun Vec3.rot()  = transform(rotMatrix)
    fun Vec3.proj() = project(scale, camZ, cx, cy)

    // 앞→뒤 순서로 정렬된 가시 면만 검사 (뒤집어서 앞쪽 면이 먼저)
    val visibleFaces = FACE_DEFS
        .filter { face -> face.normal.rot().z > 0f }
        .sortedByDescending { face -> FACE_CENTERS[face.idx].rot().z }

    for (face in visibleFaces) {
        for (row in 0..2) {
            for (col in 0..2) {
                val center = face.origin + face.right * col.toFloat() + face.down * row.toFloat()
                val r = face.right * 0.5f
                val d = face.down  * 0.5f
                val quad = arrayOf(
                    (center + r * -1f + d * -1f).rot().proj(),
                    (center + r *  1f + d * -1f).rot().proj(),
                    (center + r *  1f + d *  1f).rot().proj(),
                    (center + r * -1f + d *  1f).rot().proj(),
                )
                if (pointInQuad(pt, quad)) return HitResult(face.idx, row, col)
            }
        }
    }
    return null
}

// ── 제스처 → Move 매핑 ───────────────────────────────────────────────────────
//
// 스티커 위치(face, row, col) + 드래그 방향(screen dx/dy) → Move
//
// 원리:
//   face.right / face.down 벡터를 회전 행렬로 스크린 좌표로 투영한 뒤,
//   드래그 벡터가 두 방향 중 어느 쪽에 더 가까운지 판단한다.
//   - 드래그 ∥ face.right → sticker의 ROW 슬라이스 회전 (axis = face.down 방향)
//   - 드래그 ∥ face.down  → sticker의 COL 슬라이스 회전 (axis = face.right 방향)
//
// 각 face별 ROW 슬라이스(행) 드래그 → y좌표로 레이어 결정:
//   y ≈ -1 → U, y ≈ 0 → E, y ≈ +1 → D
//
// 각 face별 COL 슬라이스(열) 드래그 → x 또는 z 좌표로 레이어 결정:
//   x ≈ -1 → L, x ≈ 0 → M, x ≈ +1 → R
//   z ≈ -1 → B, z ≈ 0 → S, z ≈ +1 → F

private fun gestureToMove(
    hit: HitResult,
    dragScreen: Offset,       // 스크린 드래그 벡터
    rotMatrix: FloatArray,
): Move? {
    val face = FACE_DEFS[hit.faceIdx]

    // face.right / face.down 을 스크린 2D로 투영 (z 무시)
    val fRight3 = face.right.transform(rotMatrix)
    val fDown3  = face.down.transform(rotMatrix)
    val fRight2 = Offset(fRight3.x, fRight3.y)
    val fDown2  = Offset(fDown3.x,  fDown3.y)

    // 드래그와의 내적으로 어느 축인지 판단
    fun dot(a: Offset, b: Offset) = a.x * b.x + a.y * b.y
    val dotRight = dot(dragScreen, fRight2)
    val dotDown  = dot(dragScreen, fDown2)

    return if (abs(dotRight) >= abs(dotDown)) {
        // ── ROW 슬라이스 회전 ─────────────────────────────────────
        // 어느 y-레이어인지 → 스티커의 cube-space y 좌표
        val stickerPos = face.origin + face.right * hit.col.toFloat() + face.down * hit.row.toFloat()
        val posAlongDown = when {
            face.down.y != 0f -> stickerPos.y   // F,R,L,B: down=(0,±1,0)
            face.down.z != 0f -> stickerPos.z   // U: down=(0,0,1)
            else              -> stickerPos.x   // 사용 안 됨
        }
        // face.down이 Y인 경우: y ≈ -1→U, 0→E, +1→D
        // face.down이 Z인 경우(U face): z ≈ -1→B, 0→S, +1→F
        val posSigned = posAlongDown.roundToLayer() // -1, 0, +1
        val dragPositive = dotRight > 0f

        if (face.down.y != 0f) {
            // Y-axis slice: U/E/D
            yAxisMove(posSigned, dragPositive, face)
        } else {
            // Z-axis slice (U face row drag): B/S/F
            zAxisMove(posSigned, dragPositive, face)
        }

    } else {
        // ── COL 슬라이스 회전 ─────────────────────────────────────
        val stickerPos = face.origin + face.right * hit.col.toFloat() + face.down * hit.row.toFloat()
        val posAlongRight = when {
            face.right.x != 0f -> stickerPos.x   // U,F,D,B: right=(±1,0,0)
            face.right.z != 0f -> stickerPos.z   // R,L: right=(0,0,±1)
            else               -> stickerPos.y
        }
        val posSigned = posAlongRight.roundToLayer()
        val dragPositive = dotDown > 0f

        if (face.right.x != 0f) {
            // X-axis slice: L/M/R
            xAxisMove(posSigned, dragPositive, face)
        } else {
            // Z-axis slice (R/L face col drag): B/S/F
            zAxisMove(posSigned, dragPositive, face)
        }
    }
}

/**
 * Y축 슬라이스 (U / E / D)
 * layer: y ≈ -1 → U, y ≈ 0 → E, y ≈ +1 → D
 * dragPositive: face.right 방향으로 드래그 중인지
 */
private fun yAxisMove(layer: Int, dragPositive: Boolean, face: FaceDef): Move {
    // F face에서 rightward drag → U CW (layer=-1, dp=true)
    // 각 face마다 "오른쪽" 드래그의 U-layer 방향이 다를 수 있으므로 face.right.x 부호로 보정
    val rightIsPositiveX = face.right.x > 0f || face.right.z < 0f  // F,U / R 방향
    val effectiveCw = if (rightIsPositiveX) dragPositive else !dragPositive

    return when (layer) {
        -1 -> if (effectiveCw) Move.U       else Move.U_PRIME
         0 -> if (effectiveCw) Move.E_PRIME else Move.E       // E는 D 기준이라 방향 반전
         1 -> if (effectiveCw) Move.D_PRIME else Move.D
        else -> if (effectiveCw) Move.U else Move.U_PRIME
    }
}

/**
 * X축 슬라이스 (L / M / R)
 * layer: x ≈ -1 → L, x ≈ 0 → M, x ≈ +1 → R
 */
private fun xAxisMove(layer: Int, dragPositive: Boolean, face: FaceDef): Move {
    // F face에서 downward drag → R CW (layer=+1, dp=true)
    val downIsPositiveY = face.down.y > 0f
    val effectiveCw = if (downIsPositiveY) dragPositive else !dragPositive

    return when (layer) {
        -1 -> if (effectiveCw) Move.L_PRIME else Move.L
         0 -> if (effectiveCw) Move.M       else Move.M_PRIME
         1 -> if (effectiveCw) Move.R       else Move.R_PRIME
        else -> if (effectiveCw) Move.R else Move.R_PRIME
    }
}

/**
 * Z축 슬라이스 (B / S / F)
 * layer: z ≈ -1 → B, z ≈ 0 → S, z ≈ +1 → F
 */
private fun zAxisMove(layer: Int, dragPositive: Boolean, face: FaceDef): Move {
    // U face에서 rightward drag → F layer (layer=+1)
    val rightIsPositiveX = face.right.x > 0f
    val downIsPositiveZ  = face.down.z  > 0f
    // 어느 쪽 드래그인지에 따라 기준 방향 결정
    val effectiveCw = when {
        face.down.z  != 0f -> if (rightIsPositiveX == dragPositive) true else false  // U face row drag
        face.right.z != 0f -> if (downIsPositiveZ  == dragPositive) true else false  // R/L face col drag
        else               -> dragPositive
    }

    return when (layer) {
        -1 -> if (effectiveCw) Move.B_PRIME else Move.B
         0 -> if (effectiveCw) Move.S       else Move.S_PRIME
         1 -> if (effectiveCw) Move.F       else Move.F_PRIME
        else -> if (effectiveCw) Move.F else Move.F_PRIME
    }
}

// ── 렌더링 ────────────────────────────────────────────────────────────────────

private fun DrawScope.drawCube(
    stickers: Map<Int, List<StickerQuad>>,
    rotMatrix: FloatArray,
    cameraDistance: Float,
    highlightedCubie: CubieKey? = null,
    layerDrag: LayerDragState? = null,
) {
    val scale = size.minDimension * 0.12f
    val camZ  = cameraDistance * scale
    val cx    = size.width  / 2f
    val cy    = size.height / 2f

    fun Vec3.rot()  = transform(rotMatrix)
    fun Vec3.proj() = project(scale, camZ, cx, cy)

    // 드래그 중 레이어 사전 회전 행렬 (cube-space에서 적용)
    val layerRotMat: FloatArray? = layerDrag?.let { drag ->
        val angle = drag.angleRad * drag.layerInfo.visualSign
        when (drag.layerInfo.axis) {
            RotAxis.X -> matRotX(angle)
            RotAxis.Y -> matRotY(angle)
            RotAxis.Z -> matRotZ(angle)
        }
    }

    // ── Phase 1: 면 배경 (원래 보이는 면만, 정적) ────────────────────────────
    val visibleFaces = FACE_DEFS
        .filter { face -> face.normal.rot().z > 0f }
        .sortedBy  { face -> FACE_CENTERS[face.idx].rot().z }

    val path = Path()

    for (face in visibleFaces) {
        val bgProj = faceBackgroundCorners(face).map { it.rot().proj() }
        path.reset()
        path.moveTo(bgProj[0].x, bgProj[0].y)
        for (i in 1..3) path.lineTo(bgProj[i].x, bgProj[i].y)
        path.close()
        drawPath(path, Color.Black)
    }

    // ── Phase 2: 6면 전체 스티커 수집 (레이어 회전 적용 + 가시성 판정) ─────
    // 기존에는 visibleFaces만 순회했기 때문에 뒷면 레이어 스티커가 누락되었음.
    // 이제 ALL 면의 스티커를 처리하되, 면 법선(레이어 회전 포함) 기반으로 가시성을 체크.
    data class Projected(val color: Color, val highlighted: Boolean, val pts: Array<Offset>, val z: Float)
    val projected = mutableListOf<Projected>()

    for (face in FACE_DEFS) {
        val faceStickers = stickers[face.idx] ?: continue

        for (q in faceStickers) {
            val inDragLayer = layerDrag != null && q.isInLayer(layerDrag.layerInfo)

            // 이 스티커가 속한 면의 법선 → 레이어 회전 적용 후 카메라 방향인지 체크
            val faceNormal = if (inDragLayer && layerRotMat != null)
                face.normal.transform(layerRotMat).transform(rotMatrix)
            else
                face.normal.transform(rotMatrix)

            // 카메라를 향하지 않는 면의 스티커 → 스킵
            if (faceNormal.z <= 0f) continue

            // ── 스티커 셀 배경 (검정, 레이어 회전과 함께 이동) ──
            val bgR = face.right * 0.5f
            val bgD = face.down  * 0.5f
            val bgCorners = arrayOf(
                q.center + bgR * -1f + bgD * -1f,
                q.center + bgR *  1f + bgD * -1f,
                q.center + bgR *  1f + bgD *  1f,
                q.center + bgR * -1f + bgD *  1f,
            )
            val bgRot = Array(4) { i ->
                val v = bgCorners[i]
                if (inDragLayer && layerRotMat != null)
                    v.transform(layerRotMat).transform(rotMatrix)
                else
                    v.transform(rotMatrix)
            }
            val bgAvgZ = (bgRot[0].z + bgRot[1].z + bgRot[2].z + bgRot[3].z) / 4f
            projected.add(Projected(Color.Black, false, Array(4) { bgRot[it].proj() }, bgAvgZ - 0.001f))

            val isHighlighted = highlightedCubie != null &&
                CubieKey(
                    q.center.x.roundToLayer(),
                    q.center.y.roundToLayer(),
                    q.center.z.roundToLayer()
                ) == highlightedCubie

            val rot = Array(4) { i ->
                val v = q.corners[i]
                if (inDragLayer && layerRotMat != null)
                    v.transform(layerRotMat).transform(rotMatrix)
                else
                    v.transform(rotMatrix)
            }
            val avgZ = (rot[0].z + rot[1].z + rot[2].z + rot[3].z) / 4f
            projected.add(Projected(q.color, isHighlighted, Array(4) { rot[it].proj() }, avgZ))
        }
    }

    // ── Phase 3: 깊이순 정렬 후 그리기 (back → front) ────────────────────────
    projected.sortBy { it.z }
    for ((color, isHighlighted, pts, _) in projected) {
        path.reset()
        path.moveTo(pts[0].x, pts[0].y)
        for (i in 1..3) path.lineTo(pts[i].x, pts[i].y)
        path.close()
        drawPath(path, color)
        if (isHighlighted) {
            drawPath(path, Color.White.copy(alpha = 0.35f))
        }
    }
}

// ── 공개 컴포저블 ──────────────────────────────────────────────────────────────

private const val LAYER_DRAG_THRESHOLD_PX = 20f  // 레이어 회전 인식 최소 드래그 거리

/**
 * 전체 큐브를 3D로 렌더링한다.
 *
 * ## 터치 동작
 * - 빈 영역 드래그: 큐브 전체 회전 (world-space 행렬 누적)
 * - 스티커 터치: 해당 큐비 하이라이트
 * - 스티커 터치 후 드래그: 해당 레이어가 손가락을 따라 실시간 부분 회전
 * - 손가락 뗌: 가장 가까운 90°로 스냅 애니메이션 후 Move 커밋
 */
@Composable
fun CubeRenderer(
    cubeState: DomainCubeState,
    modifier: Modifier = Modifier,
    onLayerRotate: (Move) -> Unit = {},
) {
    var rotMatrix by remember { mutableStateOf(defaultRotMatrix()) }
    val stickers   = remember(cubeState) { buildStickers(cubeState.facelets) }

    var canvasSize by remember { mutableStateOf(Pair(0f, 0f)) }
    var highlightedCubie by remember { mutableStateOf<CubieKey?>(null) }
    var layerDrag        by remember { mutableStateOf<LayerDragState?>(null) }
    val coroutineScope   = rememberCoroutineScope()

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                val sensitivity = 0.4f * (PI / 180.0).toFloat()
                // 이전 스냅 애니메이션 Job 추적 (새 제스처 시 취소용)
                var animJob: Job? = null

                awaitEachGesture {
                    val down = awaitFirstDown()

                    // awaitFirstDown() 이후에 취소해야 함:
                    // awaitEachGesture는 block() 리턴 후 잔여 이벤트를 소비하며 즉시 재진입하기 때문에,
                    // awaitFirstDown() 전에 cancel()하면 방금 launch한 스냅 애니메이션이 즉시 취소됨.
                    animJob?.cancel()
                    animJob = null
                    layerDrag = null

                    val touchPt = down.position

                    val (w, h) = canvasSize
                    val scale = minOf(w, h) * 0.12f
                    val camZ  = 12f * scale
                    val cx    = w / 2f
                    val cy    = h / 2f
                    // 드래그 거리(픽셀) → 회전 각도(라디안) 감도: 3*scale 픽셀 = 90°
                    val dragSensitivity = if (scale > 0f) (PI.toFloat() / 2f) / (3f * scale) else 0.005f

                    val hit = hitTest(touchPt, rotMatrix, scale, camZ, cx, cy)

                    // 터치 다운: 스티커에 닿았으면 즉시 큐비 하이라이트
                    if (hit != null) {
                        highlightedCubie = cubieKeyOf(hit.faceIdx, hit.row, hit.col)
                    }

                    var totalDrag = Offset.Zero
                    var dominantAxisWasRight = true  // 임계값 도달 시점에 캡처

                    do {
                        val event = awaitPointerEvent()
                        val delta = event.changes.firstOrNull()?.positionChange() ?: break
                        totalDrag += delta

                        if (hit == null) {
                            // 스티커 밖 → 큐브 전체 회전
                            val rx = matRotX(-delta.y * sensitivity)
                            val ry = matRotY( delta.x * sensitivity)
                            rotMatrix = matMul(ry, matMul(rx, rotMatrix))
                        } else {
                            val currentDrag = layerDrag

                            if (currentDrag == null) {
                                // 아직 임계값 미도달: 임계값 도달 시 LayerDragState 수립
                                if (abs(totalDrag.x) >= LAYER_DRAG_THRESHOLD_PX ||
                                    abs(totalDrag.y) >= LAYER_DRAG_THRESHOLD_PX
                                ) {
                                    val move = gestureToMove(hit, totalDrag, rotMatrix)
                                    if (move != null) {
                                        // 주 드래그 축 결정 (face 로컬 좌표 기반 내적)
                                        val face = FACE_DEFS[hit.faceIdx]
                                        val fRight2 = face.right.transform(rotMatrix).let { Offset(it.x, it.y) }
                                        val fDown2  = face.down.transform(rotMatrix).let  { Offset(it.x, it.y) }
                                        fun dotOf(a: Offset, b: Offset) = a.x * b.x + a.y * b.y
                                        dominantAxisWasRight = abs(dotOf(totalDrag, fRight2)) >= abs(dotOf(totalDrag, fDown2))

                                        layerDrag = LayerDragState(
                                            move      = move,
                                            layerInfo = move.toLayerInfo(),
                                            angleRad  = 0f,
                                        )
                                    }
                                }
                            } else {
                                // 레이어 드래그 진행 중: 각도를 손가락 이동에 따라 실시간 업데이트
                                val face = FACE_DEFS[hit.faceIdx]
                                val fRight2 = face.right.transform(rotMatrix).let { Offset(it.x, it.y) }
                                val fDown2  = face.down.transform(rotMatrix).let  { Offset(it.x, it.y) }
                                fun dotOf(a: Offset, b: Offset) = a.x * b.x + a.y * b.y
                                val rawComponent = if (dominantAxisWasRight)
                                    dotOf(delta, fRight2) else dotOf(delta, fDown2)

                                layerDrag = currentDrag.copy(
                                    angleRad = currentDrag.angleRad + rawComponent * dragSensitivity
                                )
                            }
                        }

                        event.changes.forEach { it.consume() }
                    } while (event.changes.any { it.pressed })

                    // ── 손가락 뗌: restricted scope 밖에서 스냅 애니메이션 실행 ──
                    // AwaitPointerEventScope는 restricted 코루틴 스코프이므로
                    // Animatable.animateTo()는 rememberCoroutineScope()에서 launch해야 함
                    val finalDrag = layerDrag
                    if (finalDrag != null) {
                        val angle = finalDrag.angleRad
                        val halfPi = PI.toFloat() / 2f
                        // 50% 기준: 45° 이상이면 90°까지 완주, 미만이면 원위치 복귀
                        val snapTarget = if (abs(angle) >= halfPi / 2f) halfPi * sign(angle) else 0f
                        val shouldCommit = abs(snapTarget) > 0.01f

                        animJob = coroutineScope.launch {
                            val anim = Animatable(angle)
                            anim.animateTo(
                                targetValue   = snapTarget,
                                animationSpec = spring(stiffness = 400f, dampingRatio = 0.8f),
                            ) {
                                // 매 프레임마다 angleRad 갱신 → Canvas 리드로우
                                layerDrag = finalDrag.copy(angleRad = value)
                            }
                            // 스냅 완료 후: Move 커밋 및 상태 초기화
                            layerDrag        = null
                            highlightedCubie = null
                            if (shouldCommit) {
                                onLayerRotate(finalDrag.move)
                            }
                        }
                    } else {
                        // 레이어 드래그 미시작(임계값 미도달)으로 끝난 경우
                        highlightedCubie = null
                    }
                }
            },
    ) {
        canvasSize = size.width to size.height
        drawCube(
            stickers         = stickers,
            rotMatrix        = rotMatrix,
            cameraDistance   = 12f,
            highlightedCubie = highlightedCubie,
            layerDrag        = layerDrag,
        )
    }
}
