package com.metrex.cube.feature.cube

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.metrex.cube.display.CubeRenderer
import com.metrex.cube.feature.cube.mvi.CubeIntent
import com.metrex.cube.feature.cube.mvi.CubeSideEffect

@Composable
fun CubeScreen(
    viewModel: CubeViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    // Side effect 처리
    LaunchedEffect(Unit) {
        viewModel.sideEffects.collect { effect ->
            when (effect) {
                is CubeSideEffect.CubeSolved -> { /* TODO: 축하 애니메이션 */ }
                is CubeSideEffect.SnapFeedback -> { /* TODO: 햅틱 피드백 */ }
                is CubeSideEffect.SolverError -> { /* TODO: 에러 스낵바 */ }
            }
        }
    }

    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = "Moves: ${uiState.moveCount}",
                modifier = Modifier.padding(16.dp),
            )

            if (uiState.isShuffling) {
                CircularProgressIndicator()
            } else {
                CubeRenderer(
                    cubeState = uiState.cubeState,
                    modifier = Modifier.weight(1f),
                    onLayerRotate = { move ->
                        viewModel.processIntent(CubeIntent.RotateLayer(move))
                    },
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                Button(onClick = { viewModel.processIntent(CubeIntent.Shuffle()) }) {
                    Text("Shuffle")
                }
                Button(onClick = { viewModel.processIntent(CubeIntent.Reset) }) {
                    Text("Reset")
                }
            }
        }
    }
}
