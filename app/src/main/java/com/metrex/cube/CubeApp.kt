package com.metrex.cube

import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.metrex.cube.navigation.CubeNavHost

@Composable
fun CubeApp() {
    val navController = rememberNavController()
    CubeNavHost(navController = navController)
}
