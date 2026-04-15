# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install debug APK on connected device
./gradlew installDebug

# Run all unit tests
./gradlew test

# Run unit tests for a single module
./gradlew :app:testDebugUnitTest

# Run instrumented tests (requires connected device/emulator)
./gradlew connectedAndroidTest

# Run lint
./gradlew lint

# Run lint for app module only
./gradlew :app:lint

# Clean build
./gradlew clean
```

## Architecture

Single-module MVVM app using Jetpack Compose and Hilt for dependency injection.

**Entry points:**
- `CubeApplication` — Hilt entry point (`@HiltAndroidApp`)
- `MainActivity` — single Activity, hosts the entire Compose UI tree
- `CubeApp` — root composable, owns the `NavController`
- `CubeNavHost` — maps `Screen` sealed class routes to composable destinations

**Navigation:** `Screen` sealed class in `navigation/CubeNavHost.kt` defines all routes. Add new screens as `data object` entries and wire them in `NavHost`.

**DI:** Hilt. Annotate Activities with `@AndroidEntryPoint`, ViewModels with `@HiltViewModel`. Modules go under `di/`.

**Theme:** Material 3 with dynamic color (Android 12+). Override colors in `ui/theme/Color.kt`, typography in `ui/theme/Type.kt`.

## Key Versions

| Tool | Version |
|------|---------|
| AGP | 8.7.3 |
| Kotlin | 2.0.21 |
| Gradle | 8.9 |
| Compose BOM | 2024.12.01 |
| Min SDK | 26 |
| Target SDK | 35 |
| JVM target | 17 |

## Dependency Management

All versions are centralized in `gradle/libs.versions.toml` (Version Catalog). Add new dependencies there first, then reference via `libs.*` in `app/build.gradle.kts`.
