package com.metrex.cube.feature.cube.di

import com.metrex.cube.domain.logic.CubeLogic
import com.metrex.cube.domain.logic.CubeLogicImpl
import com.metrex.cube.solver.CubeSolver
import com.metrex.cube.solver.KociembaSolver
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DomainModule {

    @Provides
    @Singleton
    fun provideCubeLogic(): CubeLogic = CubeLogicImpl()

    @Provides
    @Singleton
    fun provideCubeSolver(logic: CubeLogic): CubeSolver = KociembaSolver(logic)
}
