package com.metrex.cube.domain.logic

import com.metrex.cube.domain.model.DomainCubeState
import com.metrex.cube.domain.model.Move
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class CubeLogicTest {

    private lateinit var logic: CubeLogic

    @Before
    fun setUp() {
        logic = CubeLogicImpl()
    }

    @Test
    fun `solved state is solved`() {
        assertTrue(DomainCubeState().isSolved())
    }

    @Test
    fun `U followed by U_PRIME returns to solved`() {
        val state = DomainCubeState()
        val after = logic.applyMoves(state, listOf(Move.U, Move.U_PRIME))
        assertTrue("U + U' should restore solved state", after.isSolved())
    }

    @Test
    fun `U applied 4 times returns to solved`() {
        val state = DomainCubeState()
        val after = logic.applyMoves(state, List(4) { Move.U })
        assertTrue("U×4 should restore solved state", after.isSolved())
    }

    @Test
    fun `R applied 4 times returns to solved`() {
        val state = DomainCubeState()
        val after = logic.applyMoves(state, List(4) { Move.R })
        assertTrue("R×4 should restore solved state", after.isSolved())
    }

    @Test
    fun `shuffle produces non-solved state`() {
        val (shuffled, _) = logic.shuffle(DomainCubeState(), moveCount = 20)
        assertFalse("Shuffled cube should not be solved", shuffled.isSolved())
    }

    @Test
    fun `inverse moves restore original state`() {
        val moves = listOf(Move.U, Move.R, Move.F, Move.D, Move.L, Move.B)
        val state = DomainCubeState()
        val scrambled = logic.applyMoves(state, moves)
        val restored = logic.applyMoves(scrambled, moves.reversed().map { it.inverse() })
        assertEquals("Applying inverse moves should restore original state", state, restored)
    }

    @Test
    fun `U2 equals U applied twice`() {
        val state = DomainCubeState()
        val u2 = logic.applyMove(state, Move.U2)
        val uuApplied = logic.applyMoves(state, listOf(Move.U, Move.U))
        assertEquals(u2, uuApplied)
    }
}
