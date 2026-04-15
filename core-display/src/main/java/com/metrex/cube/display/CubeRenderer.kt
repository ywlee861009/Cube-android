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
import com.metrex.cube.domain.model.Move
import com.metrex.cube.domain.model.DomainCubeState
import kotlin.math.PI
import kotlin.math.abs
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

// ── 스티커 데이터 ─────────────────────────────────────────────────────────────

private class StickerQuad(val color: Color, val corners: Array<Vec3>)

private fun buildStickers(facelets: IntArray, halfSize: Float = 0.46f): Map<Int, List<StickerQuad>> =
    FACE_DEFS.associate { face ->
        face.idx to buildList {
            for (row in 0..2) {
                for (col in 0..2) {
                    val color = STICKER_COLORS[facelets[face.idx * 9 + row * 3 + col]]
                    val center = face.origin + face.right * col.toFloat() + face.down * row.toFloat()
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

/** cube-space 좌표 (-1.5~+1.5)를 레이어 인덱스 -1/0/+1 로 반올림 */
private fun Float.roundToLayer(): Int = when {
    this < -0.5f -> -1
    this >  0.5f ->  1
    else         ->  0
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
) {
    val scale = size.minDimension * 0.12f
    val camZ  = cameraDistance * scale
    val cx    = size.width  / 2f
    val cy    = size.height / 2f

    fun Vec3.rot()  = transform(rotMatrix)
    fun Vec3.proj() = project(scale, camZ, cx, cy)

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

private const val LAYER_DRAG_THRESHOLD_PX = 20f  // 레이어 회전 인식 최소 드래그 거리

/**
 * 전체 큐브를 3D로 렌더링한다.
 *
 * ## 터치 동작
 * - 빈 영역 드래그: 큐브 전체 회전 (world-space 행렬 누적)
 * - 스티커 터치 후 드래그: 해당 레이어 회전 → [onLayerRotate] 호출
 *
 * TODO(Phase 4): Fling + Animatable 스냅 애니메이션
 */
@Composable
fun CubeRenderer(
    cubeState: DomainCubeState,
    modifier: Modifier = Modifier,
    onLayerRotate: (Move) -> Unit = {},
) {
    var rotMatrix by remember { mutableStateOf(defaultRotMatrix()) }
    val stickers   = remember(cubeState) { buildStickers(cubeState.facelets) }

    // 히트 테스트에 필요한 투영 파라미터를 Composable 범위에서 캡처하기 위해 별도 상태로 관리
    var canvasSize by remember { mutableStateOf(Pair(0f, 0f)) }

    Canvas(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                val sensitivity = 0.4f * (PI / 180.0).toFloat()

                awaitEachGesture {
                    val down = awaitFirstDown()
                    val touchPt = down.position

                    // 터치 다운 시점의 투영 파라미터 계산
                    val (w, h) = canvasSize
                    val scale = minOf(w, h) * 0.12f
                    val camZ  = 12f * scale
                    val cx    = w / 2f
                    val cy    = h / 2f

                    // 히트 테스트
                    val hit = hitTest(touchPt, rotMatrix, scale, camZ, cx, cy)

                    var totalDrag = Offset.Zero
                    var layerMoved = false

                    do {
                        val event = awaitPointerEvent()
                        val delta = event.changes.firstOrNull()?.positionChange() ?: break
                        totalDrag += delta

                        if (hit == null) {
                            // 스티커 밖 → 큐브 전체 회전
                            val rx = matRotX(-delta.y * sensitivity)
                            val ry = matRotY( delta.x * sensitivity)
                            rotMatrix = matMul(ry, matMul(rx, rotMatrix))
                        } else if (!layerMoved &&
                            (abs(totalDrag.x) >= LAYER_DRAG_THRESHOLD_PX ||
                             abs(totalDrag.y) >= LAYER_DRAG_THRESHOLD_PX)
                        ) {
                            // 충분히 드래그했을 때 레이어 회전 1회 발동
                            gestureToMove(hit, totalDrag, rotMatrix)?.let { move ->
                                onLayerRotate(move)
                            }
                            layerMoved = true
                        }

                        event.changes.forEach { it.consume() }
                    } while (event.changes.any { it.pressed })
                }
            },
    ) {
        canvasSize = size.width to size.height
        drawCube(stickers, rotMatrix, cameraDistance = 12f)
    }
}
