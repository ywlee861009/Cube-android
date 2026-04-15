package com.metrex.cube.display

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.metrex.cube.domain.model.CubeColor
import com.metrex.cube.domain.model.CubeFace

/**
 * 큐브의 단일 면(3×3 그리드)을 렌더링하는 컴포저블.
 *
 * [faceColors]: 9개 원소. 인덱스 0=좌상단, 8=우하단.
 * [modifier]: graphicsLayer 변환이 외부에서 적용된다.
 */
@Composable
fun CubeFaceView(
    faceColors: IntArray,
    modifier: Modifier = Modifier,
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(3),
        modifier = modifier
            .aspectRatio(1f)
            .padding(1.dp),
        userScrollEnabled = false,
    ) {
        items(9) { index ->
            val color = CubeFace.entries[faceColors[index]].solvedColor.toComposeColor()
            Box(
                modifier = Modifier
                    .aspectRatio(1f)
                    .padding(1.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .background(color)
                    .border(0.5.dp, Color.Black.copy(alpha = 0.3f), RoundedCornerShape(3.dp))
            )
        }
    }
}

private fun CubeColor.toComposeColor(): Color = Color(argb)
