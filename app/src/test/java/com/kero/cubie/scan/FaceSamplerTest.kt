package com.kero.cubie.scan

import org.junit.Assert.assertEquals
import org.junit.Test

class FaceSamplerTest {
    @Test
    fun samplesNineCellsInRowMajorOrderForEveryRotation() {
        for (rotation in listOf(0, 90, 180, 270)) {
            val frame = patternedFrame(rotation)
            val samples = FaceSampler.sample(frame)
            val expected = List(9) { index ->
                listOf(20 + index, 60 + index, 100 + index)
            }
            assertEquals("rotation=$rotation", expected, samples)
        }
    }

    @Test
    fun medianRejectsSparseSpecularHighlights() {
        val frame = patternedFrame(rotation = 0, addHighlights = true)
        val samples = FaceSampler.sample(frame)
        assertEquals(listOf(20, 60, 100), samples.first())
    }

    private fun patternedFrame(
        rotation: Int,
        addHighlights: Boolean = false
    ): FaceSampler.RgbaFrame {
        val width = 90
        val height = 90
        val pixelStride = 4
        val rowStride = width * pixelStride + 12
        val bytes = ByteArray(rowStride * height)
        val left = (width * FaceSampler.GUIDE_LEFT).toInt()
        val top = (height * FaceSampler.GUIDE_TOP).toInt()
        val guideWidth = (width * (FaceSampler.GUIDE_RIGHT - FaceSampler.GUIDE_LEFT)).toInt()
        val guideHeight = (height * (FaceSampler.GUIDE_BOTTOM - FaceSampler.GUIDE_TOP)).toInt()

        for (y in top until top + guideHeight) {
            for (x in left until left + guideWidth) {
                val column = ((x - left) * 3 / guideWidth).coerceAtMost(2)
                val row = ((y - top) * 3 / guideHeight).coerceAtMost(2)
                val index = row * 3 + column
                val highlight = addHighlights && index == 0 &&
                    (x + y) % 11 == 0
                val rgb = if (highlight) {
                    listOf(255, 255, 255)
                } else {
                    listOf(20 + index, 60 + index, 100 + index)
                }
                val (sourceX, sourceY) = sourceCoordinates(width, height, rotation, x, y)
                val offset = sourceY * rowStride + sourceX * pixelStride
                bytes[offset] = rgb[0].toByte()
                bytes[offset + 1] = rgb[1].toByte()
                bytes[offset + 2] = rgb[2].toByte()
                bytes[offset + 3] = 0xff.toByte()
            }
        }
        return FaceSampler.RgbaFrame(
            bytes,
            width,
            height,
            rowStride,
            pixelStride,
            rotation
        )
    }

    private fun sourceCoordinates(
        width: Int,
        height: Int,
        rotation: Int,
        x: Int,
        y: Int
    ): Pair<Int, Int> = when (rotation) {
        0 -> x to y
        90 -> y to (height - 1 - x)
        180 -> (width - 1 - x) to (height - 1 - y)
        270 -> (width - 1 - y) to x
        else -> error("unsupported rotation")
    }
}
