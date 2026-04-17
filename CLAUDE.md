# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# 전체 빌드
./gradlew assembleDebug

# 디바이스 설치
./gradlew installDebug

# 린트
./gradlew lint

# 클린
./gradlew clean
```

## 모듈 구조

현재 `:app` 단일 모듈만 존재한다. (구 멀티모듈 Compose + Hilt 구조는 WebView 전환 시 제거됨)

```
:app
 ├── MainActivity.kt          — WebView 초기화, Edge-to-Edge, 시스템 인셋, AdMob
 ├── CubeApplication.kt       — Application 클래스 (최소 구성)
 └── assets/
      ├── cube.html            — 진입점, UI 레이아웃 (버튼, 캔버스, 이동 카운터)
      └── js/
           ├── three.min.js        — Three.js r128 로컬 번들 (CDN 불필요)
           ├── constants.js        — 면 색상(RGBA), face 정의, slot 매핑
           ├── logic.js            — 큐브 논리: rotateFaceCW(), cycle4(), 18개 이동 + E/M/S
           ├── scene.js            — Three.js 씬 (카메라, 조명, 렌더 루프)
           ├── cubies.js           — 26개 Cubie 메시 생성 및 applyFacelets()
           ├── animation.js        — performAnimatedMove(), MOVE_ANIM_MAP
           ├── layer-rotation.js   — initLayerRotation(), finishLayerRotation(), commitLayerRotation()
           ├── touch.js            — 터치 이벤트 처리: 레이어/뷰/핀치 dragMode 분기
           ├── actions.js          — shuffle(), reset(), setMoveCount(), applyMove()
           ├── history.js          — undoStack/redoStack, undoCube(), redoCube(), inverseMoveOf()
           ├── solve.js            — solveCube(), stepSolution(), Android 브릿지 연동
           ├── bridge.js           — window.AndroidCube (레거시 인셋 전용)
           ├── lib/
           │    └── cubing-solver.bundle.js  — cubing.js 기반 솔버 번들
           └── solver/
                ├── solver-base.js    — 솔버 추상 클래스 (CubeSolverBase)
                ├── solver-cubing.js  — cubing.js 구현체 (CubingJsSolver)
                └── solver-factory.js — 솔버 팩토리 (SolverFactory.create())
```

## 아키텍처

**현재 스택:** Android WebView + Three.js (WebGL)

```
MainActivity (Kotlin)
  └── WebView
        └── cube.html
              ├── scene.js          — Three.js 씬 관리
              ├── cubies.js         — Cubie 메시 & 색상 갱신
              ├── logic.js          — facelets 상태 & 이동 논리
              ├── animation.js      — 이동 애니메이션 (RAF + ease-out)
              ├── layer-rotation.js — 레이어 드래그 & fling
              ├── touch.js          — 터치 입력 진입점
              ├── actions.js        — shuffle / reset / applyMove
              ├── history.js        — undo / redo
              ├── solve.js          — solver 연동 & step 실행
              └── solver/           — 솔버 레이어 (factory → cubing.js)
```

### JS 스크립트 로딩 순서 (cube.html)

1. `three.min.js`
2. `constants.js`
3. `scene.js`
4. `cubies.js`
5. `logic.js`
6. `cubing-solver.bundle.js`
7. `solver/solver-base.js` → `solver-cubing.js` → `solver-factory.js`
8. `actions.js`
9. `history.js`
10. `solve.js`
11. `animation.js`
12. `layer-rotation.js`
13. `touch.js`
14. `bridge.js` (마지막 — 모든 전역 함수 정의 후)

---

## 핵심 데이터 모델

**facelets (logic.js):**
- `Int32Array(54)`. 인덱스: `faceIndex * 9 + position`
- 완성 상태: 각 원소 = 면 인덱스 (0~5)
- 면 순서: U(0), R(1), F(2), D(3), L(4), B(5)

**MOVES 객체 (logic.js):**
- 18개 표준 이동 (`U/U'/U2`, `R/R'/R2`, …) + 중간 레이어 (`E/M/S`)
- `applyMoveInPlace(name, f)`: move notation 파싱 → `rotateFaceCW` + `cycle4` 적용

---

## 모듈별 상세

### constants.js
- `FACE_COLORS`: 6개 색상 코드 (U=white, R=red, F=green, D=yellow, L=orange, B=blue)
- `FACE_DEFS`: face 별 `fixedAxis`, `fixedVal`, `matIdx`, `slots` (9개 좌표) 정의

### scene.js
- WebGL 렌더러: clear color `#f0f0f0`, antialiasing ON
- PerspectiveCamera 45°, 기본 거리 13
- Ambient(0.8) + Directional(0.5) 조명
- `cubieGroup`: 뷰 회전용 루트 Three.Group
- `updateCamera()`, `animate()` (RAF 렌더 루프)

### cubies.js
- GAP=1.04 간격으로 26개 `BoxGeometry` Cubie 생성
- 각 Cubie: `userData.{cx,cy,cz}` 좌표 (-1~1), 6개 `MeshStandardMaterial`
- `applyFacelets()`: facelets → 큐비 재질 색상 갱신
- `findCubie(cx, cy, cz)`: 위치로 큐비 객체 반환

### animation.js
- `MOVE_ANIM_MAP`: 18개 이동 → `{axis, sliceKey, slice, snaps}` 매핑
- `performAnimatedMove(moveName, onDone)`:
  - 대상 레이어 cubies → `layerGroup` 임시 이관
  - RAF 90ms cubic ease-out 회전
  - 완료 시 `commitLayerRotation(snaps)` 호출

### layer-rotation.js
- `initLayerRotation(screenDx, screenDy)`:
  - 드래그 방향 → 회전축(x/y/z) 결정
  - hit mesh 위치에서 slice 좌표 추출
  - `layerGroup`에 대상 cubies 이관
- `finishLayerRotation()`:
  - EMA 속도 기반 fling 판단 (임계: 0.0015 rad/ms)
  - 목표 스냅(90° 단위) 계산 → 220ms cubic ease-out 애니메이션
  - `commitLayerRotation(targetSnaps)` 호출
- `commitLayerRotation(snaps)`:
  - `applyMove()` 로 논리 상태 갱신
  - 큐비 로컬 회전 초기화 후 `cubieGroup`에 재이관
  - Android haptic 트리거

### touch.js
- dragMode: `null | 'layer' | 'view' | 'pinch'`
- `touchstart`: 플링 취소 → raycast → hitMesh/hitNormal 저장
- `touchmove`:
  - 핀치(2포인터): camDist 조정
  - 레이어(1포인터, 큐비 hit, 12px 임계): `initLayerRotation()` + EMA 속도 추적
  - 뷰(1포인터, 빈 공간): `cubieGroup.rotation` 갱신 + EMA 속도 추적
- `touchend`:
  - 레이어: `finishLayerRotation()` (fling 포함)
  - 뷰: 관성 감쇠 fling (FRICTION=0.92 / 16ms)
- CAM_MIN=4, CAM_MAX=20 줌 범위

### actions.js
- `applyMove(name)`: 수동 입력 시 undoStack push → `applyMoveInPlace()` → `applyFacelets()`
- `shuffleCube()`: 25수 랜덤 이동(연속 같은 면 방지) → `performAnimatedMove()` 순차 실행
- `resetCube()`: facelets 완성 상태로 초기화
- `isShuffling / isSolving / isUndoRedo`: 동시 진행 차단 플래그

### history.js
- `undoStack / redoStack`: `{moveName, moveCount}` 엔트리
- `inverseMoveOf(name)`: `U2`→`U2`, `U'`→`U`, `U`→`U'`
- `undoCube() / redoCube()`: 플래그 확인 → `performAnimatedMove(inverse)` → 스택 조작

### solve.js
- `solveCube()`:
  - `window.AndroidBridge` 존재 시: `AndroidBridge.requestSolve()` 호출 (Android가 광고 처리)
  - 없으면: `_runSolve()` 직접 실행 (브라우저 테스트 모드)
- `_runSolve()`:
  - `SolverFactory.create()` → `solver.isReady()` 확인 (미준비 시 1.5s 재시도)
  - `solver.solve([...facelets])` → 이동 배열 파싱
- `stepSolution()`: 이동 한 수 실행 → "N / total" 버튼 텍스트 갱신
- `window.onSolveDenied()`: 광고 거부 콜백 → 버튼 재활성
- `window.onSolveGranted()`: 광고 수락/미표시 콜백 → 솔브 실행

### bridge.js
- `window.AndroidCube` 객체 (인셋 전달 전용):
  - `setInsets(top, bottom, left, right)`: CSS 변수 `--safe-*` 갱신

---

## Android ↔ JS 브릿지

### JS → Android (`window.AndroidBridge`, MainActivity.kt CubeBridge)

| 메서드 | 설명 |
|--------|------|
| `AndroidBridge.hapticFeedback()` | `webView.performHapticFeedback()` 호출 |
| `AndroidBridge.requestSolve()` | AdMob 광고 처리 후 `onSolveGranted()` / `onSolveDenied()` 콜백 |

### Android → JS

| 호출 | 설명 |
|------|------|
| `window.AndroidCube.setInsets(top, bottom, left, right)` | 시스템 인셋 dp 값 전달 |
| `window.onSolveGranted()` | 광고 후 솔브 허용 |
| `window.onSolveDenied()` | 광고 거부/실패 시 솔브 차단 |

---

## AdMob 통합 (MainActivity.kt)

- 패키지: `com.kero.cubie`
- AdMob App ID: `ca-app-pub-2103375309908918~1118005116` (AndroidManifest.xml)
- `AD_INTERVAL = 5`: 5회 솔브마다 리워드 광고 노출
- `requestSolve()`: SharedPreferences에서 카운트 읽기 → `count % AD_INTERVAL == 4`이면 광고 표시
- `loadRewardedAd()` / `showRewardedAd()`: 비동기 광고 로드/표시, 리워드 후 `onSolveGranted()` 콜백

---

## 솔버 아키텍처 (solver/)

- `CubeSolverBase`: `solve(facelets)`, `isReady()` 추상 인터페이스
- `CubingJsSolver`: `CubingSolver.solveFromFacelets(facelets)` 래핑, `_ready` 캐시
- `SolverFactory.create()`: 현재 구현체 반환 (교체 시 이 파일만 수정)
- 솔버 교체: `solver-factory.js`의 `create()` 반환값만 변경

---

## 개발 현황

### 완료된 작업 ✅

| Phase | 내용 | 주요 파일 |
|-------|------|-----------|
| 1 | 큐브 논리 모델 (18 이동, cycle4, facelets) | `logic.js`, `constants.js` |
| 2 | Three.js 3D 렌더링 + 뷰 터치 회전 | `scene.js`, `cubies.js` |
| 3 | 26개 Cubie 배치 + 레이어 회전 시각화 | `cubies.js`, `layer-rotation.js` |
| 3 | E/M/S 중간 레이어 회전 지원 | `logic.js`, `layer-rotation.js` |
| 3 | 핀치 줌 (CAM_MIN=4 ~ CAM_MAX=20) | `touch.js` |
| 4 | 레이어 스냅 cubic ease-out 애니메이션 (220ms) | `layer-rotation.js` |
| 4 | 레이어 Fling: EMA 속도 추적 → 목표 스냅 예측 | `layer-rotation.js` |
| 4 | 뷰 Fling: 관성 감쇠 (FRICTION=0.92/16ms) | `touch.js` |
| 4 | Fling 중 재터치 시 즉시 스냅 확정 (cancelFling) | `touch.js` |
| 4 | JS 모듈 분리 (controls.js → animation/layer-rotation/touch) | 모든 JS |
| -  | Edge-to-Edge 레이아웃 + 시스템 인셋 대응 | `MainActivity.kt` |
| -  | Shuffle (랜덤 25수, 연속 같은 면 방지) / Reset 버튼 | `actions.js`, `cube.html` |
| -  | Three.js r128 로컬 번들링 (CDN 의존성 제거) | `js/three.min.js` |
| -  | 이동 카운터 표시 (`Moves: N`) | `cube.html`, `actions.js` |
| -  | Undo / Redo (↩/↪ 버튼, 이동 히스토리 스택) | `history.js`, `cube.html` |
| 5  | cubing.js 기반 솔버 + 팩토리 패턴 | `solver/`, `lib/cubing-solver.bundle.js` |
| 5  | Solve UI: 한 수씩 step 실행 (N/total 표시) | `solve.js`, `cube.html` |
| 5  | AdMob 리워드 광고 통합 (5회마다 노출) | `MainActivity.kt` |
| 5  | 레이어 스냅 햅틱 피드백 | `layer-rotation.js`, `MainActivity.kt` |
| 5  | 패키지명 변경 (com.metrex.cube → com.kero.cubie) | `build.gradle.kts` |

---

## 다음에 할 것들 (우선순위 순)

### 인터랙션 개선

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **이동 시퀀스 실행** | 알고리즘 문자열 파싱 → 순차 자동 적용 | 중 |
| **제스처 민감도 조정** | Fling 임계값, 애니메이션 속도 설정 UI | 하 |

### 안정성 & 품질

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **JS 유닛 테스트** | `logic.js` 이동 정확성 검증 (Jest 등) | 중 |
| **facelets 유효성 검사** | shuffle/reset 후 54개 원소 합산 검증 | 하 |
| **멀티터치 엣지 케이스** | 핀치 중 세 번째 손가락 추가 등 비정상 터치 방어 | 중 |

### UX / 비주얼

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **솔브 타이머** | 첫 번째 이동부터 완성까지 경과 시간 측정 | 하 |
| **큐브 완성 감지 & 축하 연출** | facelets 완성 상태 체크 → 파티클 또는 애니메이션 | 중 |
| **다크/라이트 테마** | 배경색, 버튼 스타일 Android 시스템 테마 연동 | 하 |

---

## 의존성 관리

모든 버전은 `gradle/libs.versions.toml` (Version Catalog)에서 중앙 관리.
새 라이브러리 추가 시 `[libraries]` → `[versions]`에 먼저 등록 후 `libs.*` 참조.

## 주요 버전

| 도구 | 버전 |
|------|------|
| AGP | 8.7.3 |
| Kotlin | 2.0.21 |
| Gradle | 8.9 |
| Three.js | r128 (로컬 번들) |
| AdMob SDK | play-services-ads 23.6.0 |
| Min SDK | 26 / Target SDK 35 / JVM 17 |
