package com.kero.cubie.scan

object FaceSampler {
    const val GUIDE_SIZE_FRACTION = 0.60f
    private const val CELL_SAMPLE_FRACTION = 0.60f

    data class GuideRect(
        val left: Float,
        val top: Float,
        val right: Float,
        val bottom: Float
    )

    data class RgbaFrame(
        val bytes: ByteArray,
        val width: Int,
        val height: Int,
        val rowStride: Int,
        val pixelStride: Int,
        val rotationDegrees: Int
    )

    fun sample(frame: RgbaFrame): List<List<Int>> {
        require(frame.width > 0 && frame.height > 0)
        require(frame.pixelStride >= 3)
        require(frame.rotationDegrees in setOf(0, 90, 180, 270))

        val orientedWidth =
            if (frame.rotationDegrees % 180 == 0) frame.width else frame.height
        val orientedHeight =
            if (frame.rotationDegrees % 180 == 0) frame.height else frame.width
        val guide = guideRect(orientedWidth, orientedHeight)
        val guideLeft = (orientedWidth * guide.left).toInt()
        val guideTop = (orientedHeight * guide.top).toInt()
        val guideWidth = (orientedWidth * (guide.right - guide.left)).toInt()
        val guideHeight = (orientedHeight * (guide.bottom - guide.top)).toInt()

        return List(9) { index ->
            val column = index % 3
            val row = index / 3
            val cellLeft = guideLeft + guideWidth * column / 3
            val cellRight = guideLeft + guideWidth * (column + 1) / 3
            val cellTop = guideTop + guideHeight * row / 3
            val cellBottom = guideTop + guideHeight * (row + 1) / 3
            medianRgb(
                frame,
                insetStart(cellLeft, cellRight),
                insetEnd(cellLeft, cellRight),
                insetStart(cellTop, cellBottom),
                insetEnd(cellTop, cellBottom)
            )
        }
    }

    fun guideRect(width: Int, height: Int): GuideRect {
        require(width > 0 && height > 0)
        val side = minOf(width, height) * GUIDE_SIZE_FRACTION
        val horizontalInset = (width - side) / 2f
        val verticalInset = (height - side) / 2f
        return GuideRect(
            left = horizontalInset / width,
            top = verticalInset / height,
            right = (horizontalInset + side) / width,
            bottom = (verticalInset + side) / height
        )
    }

    private fun insetStart(start: Int, end: Int): Int =
        start + ((end - start) * (1f - CELL_SAMPLE_FRACTION) / 2f).toInt()

    private fun insetEnd(start: Int, end: Int): Int =
        end - ((end - start) * (1f - CELL_SAMPLE_FRACTION) / 2f).toInt()

    private fun medianRgb(
        frame: RgbaFrame,
        left: Int,
        right: Int,
        top: Int,
        bottom: Int
    ): List<Int> {
        val red = IntArray(256)
        val green = IntArray(256)
        val blue = IntArray(256)
        var count = 0
        for (y in top until bottom) {
            for (x in left until right) {
                val (sourceX, sourceY) = sourceCoordinates(frame, x, y)
                val offset = sourceY * frame.rowStride + sourceX * frame.pixelStride
                red[frame.bytes[offset].toInt() and 0xff]++
                green[frame.bytes[offset + 1].toInt() and 0xff]++
                blue[frame.bytes[offset + 2].toInt() and 0xff]++
                count++
            }
        }
        require(count > 0) { "Sampling region is empty" }
        return listOf(median(red, count), median(green, count), median(blue, count))
    }

    private fun sourceCoordinates(frame: RgbaFrame, x: Int, y: Int): Pair<Int, Int> =
        when (frame.rotationDegrees) {
            0 -> x to y
            90 -> y to (frame.height - 1 - x)
            180 -> (frame.width - 1 - x) to (frame.height - 1 - y)
            270 -> (frame.width - 1 - y) to x
            else -> error("Unsupported rotation")
        }

    private fun median(histogram: IntArray, count: Int): Int {
        val target = (count - 1) / 2
        var seen = 0
        for (value in histogram.indices) {
            seen += histogram[value]
            if (seen > target) return value
        }
        error("Empty histogram")
    }
}
