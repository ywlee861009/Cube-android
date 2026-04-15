package com.metrex.cube.feature.cube

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.metrex.cube.domain.logic.CubeLogic
import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.feature.cube.mvi.CubeIntent
import com.metrex.cube.feature.cube.mvi.CubeSideEffect
import com.metrex.cube.feature.cube.mvi.CubeUiState
import com.metrex.cube.solver.CubeSolver
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CubeViewModel @Inject constructor(
    private val cubeLogic: CubeLogic,
    private val cubeSolver: CubeSolver,
) : ViewModel() {

    private val _uiState = MutableStateFlow(CubeUiState())
    val uiState: StateFlow<CubeUiState> = _uiState.asStateFlow()

    private val _sideEffects = Channel<CubeSideEffect>(Channel.BUFFERED)
    val sideEffects = _sideEffects.receiveAsFlow()

    fun processIntent(intent: CubeIntent) {
        when (intent) {
            is CubeIntent.RotateLayer -> rotateLayer(intent)
            is CubeIntent.Shuffle -> shuffle(intent.moveCount)
            is CubeIntent.Solve -> solve()
            is CubeIntent.Reset -> reset()
        }
    }

    private fun rotateLayer(intent: CubeIntent.RotateLayer) {
        _uiState.update { state ->
            val newCubeState = cubeLogic.applyMove(state.cubeState, intent.move)
            state.copy(
                cubeState = newCubeState,
                moveCount = state.moveCount + 1,
            )
        }
        if (_uiState.value.cubeState.isSolved()) {
            viewModelScope.launch { _sideEffects.send(CubeSideEffect.CubeSolved) }
        } else {
            viewModelScope.launch { _sideEffects.send(CubeSideEffect.SnapFeedback) }
        }
    }

    private fun shuffle(moveCount: Int) {
        _uiState.update { it.copy(isShuffling = true) }
        viewModelScope.launch {
            val (shuffled, _) = cubeLogic.shuffle(DomainCubeState(), moveCount)
            _uiState.update { it.copy(cubeState = shuffled, isShuffling = false, moveCount = 0) }
        }
    }

    private fun solve() {
        _uiState.update { it.copy(isSolving = true) }
        viewModelScope.launch {
            runCatching { cubeSolver.solve(_uiState.value.cubeState) }
                .onSuccess { moves ->
                    _uiState.update { it.copy(solutionMoves = moves, isSolving = false) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isSolving = false) }
                    _sideEffects.send(CubeSideEffect.SolverError(e.message ?: "Unknown error"))
                }
        }
    }

    private fun reset() {
        _uiState.update { CubeUiState() }
    }
}
