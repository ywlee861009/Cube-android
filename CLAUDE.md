# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# 전체 빌드
./gradlew assembleDebug

# 특정 모듈 빌드
./gradlew :core-domain:build
./gradlew :feature-cube:assembleDebug

# 단위 테스트 전체
./gradlew test

# 특정 모듈 테스트
./gradlew :core-domain:test

# 특정 클래스 테스트
./gradlew :core-domain:test --tests "com.metrex.cube.domain.logic.CubeLogicTest"

# 린트
./gradlew lint
./gradlew :core-domain:lint

# 디바이스 설치
./gradlew installDebug

# 클린
./gradlew clean
```

## 모듈 구조 및 의존성

```
:app  ──────────────────────────────── Hilt 진입점, MainActivity
  └── :feature-cube ─────────────────  MVI 컨테이너, CubeScreen, CubeViewModel
        ├── :core-display ───────────  graphicsLayer 기반 3D 렌더러
        │     └── :core-domain        큐브 논리 모델 (Pure Kotlin)
        ├── :core-domain
        └── :core-solver ────────────  Kociemba 해법 엔진 (Pure Kotlin)
              └── :core-domain
```

의존 방향: `:app` → `:feature-cube` → `:core-display` / `:core-solver` → `:core-domain`

## 아키텍처

**패턴:** MVI (Model-View-Intent)
- `CubeIntent` — 사용자 액션 (레이어 회전, 셔플, 솔브, 리셋)
- `CubeUiState` — 불변 UI 상태 (StateFlow)
- `CubeSideEffect` — 일회성 효과 (Channel → Flow)

**핵심 데이터 모델 (`:core-domain`):**
- `DomainCubeState.facelets`: `IntArray(54)`. `face * 9 + position` 인덱스 규칙.
  - 완성 상태: `IntArray(54) { it / 9 }` (각 원소 = 면 인덱스)
  - 면 순서: U(0), R(1), F(2), D(3), L(4), B(5)
- `Move`: 18개 표준 이동. `U/U'/U2`, `R/R'/R2`, …
- `CubeLogicImpl.applyMove`: `rotateFaceCW` + 인접 면 순환 치환 패턴

**3D 렌더링 전략 (`:core-display`):**
- `Modifier.graphicsLayer { rotationX / rotationY / cameraDistance }` 로 하드웨어 가속 3D 표현
- `RotationState`를 graphicsLayer 람다 내에서 읽어 Recomposition 없이 즉각 반영
- `CubeRenderer`: 터치 → `RotationState` 업데이트 → `CubeFaceLayout` 렌더

## 개발 로드맵

| Phase | 목표 | 주요 파일 |
|-------|------|-----------|
| 1 | 큐브 논리 모델 + 유닛 테스트 | `CubeLogicImpl`, `CubeLogicTest` |
| 2 | graphicsLayer 단일 정육면체 3D + 터치 회전 | `CubeRenderer`, `RotationState` |
| 3 | 27개 Cubie 배치 + 레이어 회전 시각화 | `CubeRenderer`, `CubeFaceLayout` |
| 4 | 스냅 애니메이션 + Fling 관성 | `Animatable`, `CubeViewModel` |
| 5 | Kociemba 솔버 + (검토) 카메라 인식 | `KociembaSolver` |

## Phase 1 주요 TODO

`CubeLogicImpl`의 각 면 회전 함수에서 인접 면 순환 치환을 완성해야 한다.
`cycle3` 헬퍼를 사용하고, `CubeLogicTest` 기준으로 모든 테스트가 통과해야 한다.

## 의존성 관리

모든 버전은 `gradle/libs.versions.toml` (Version Catalog)에서 중앙 관리.
새 라이브러리 추가 시 `[libraries]` → `[versions]`에 먼저 등록 후 `libs.*` 참조.

## 주요 버전

| 도구 | 버전 |
|------|------|
| AGP | 8.7.3 |
| Kotlin | 2.0.21 |
| Gradle | 8.9 |
| Compose BOM | 2024.12.01 |
| Hilt | 2.52 |
| Min SDK | 26 / Target SDK 35 / JVM 17 |
