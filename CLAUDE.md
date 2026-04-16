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
 ├── MainActivity.kt          — WebView 초기화, Edge-to-Edge, 시스템 인셋 처리
 ├── CubeApplication.kt       — Application 클래스 (최소 구성)
 └── assets/
      ├── cube.html            — 진입점, UI 레이아웃 (버튼, 캔버스)
      └── js/
           ├── constants.js    — 면 색상(RGBA), face 정의, slot 매핑
           ├── logic.js        — 큐브 논리: rotateFaceCW(), cycle4(), 18개 이동 + E/M/S
           ├── scene.js        — Three.js 씬 (카메라, 조명, 렌더 루프)
           ├── cubies.js       — 26개 Cubie 메시 생성 및 applyFacelets()
           ├── controls.js     — 터치 처리: 레이어 회전, Fling, 핀치 줌, 뷰 회전
           ├── actions.js      — shuffle(), reset(), moveCount 추적
           └── bridge.js       — Android ↔ JS 브릿지 (window.AndroidCube)
```

## 아키텍처

**현재 스택:** Android WebView + Three.js (WebGL)

```
MainActivity (Kotlin)
  └── WebView
        └── cube.html
              ├── scene.js    — Three.js 씬 관리
              ├── cubies.js   — Cubie 메시 & 색상 갱신
              ├── logic.js    — facelets 상태 & 이동 논리
              ├── controls.js — 터치 입력 & 애니메이션
              └── actions.js  — 사용자 액션 (shuffle / reset)
```

**핵심 데이터 모델 (logic.js):**
- `facelets`: `Int32Array(54)`. `face * 9 + position` 인덱스 규칙.
  - 완성 상태: 각 원소 = 면 인덱스 (0~5)
  - 면 순서: U(0), R(1), F(2), D(3), L(4), B(5)
- `MOVES` 객체: 18개 표준 이동 (`U/U'`, `R/R'`, …) + 중간 레이어 (`E/M/S`)
- `applyMove(name)`: `rotateFaceCW` + `cycle4` 인접 면 순환 치환

**3D 렌더링 (Three.js r128, CDN):**
- 26개 `BoxGeometry` Cubie, 각 면에 6개 `MeshLambertMaterial`
- `cubieGroup`: 전체 큐브 회전용 루트 그룹
- `layerGroup`: 레이어 드래그 시 임시 생성, 스냅 확정 후 해제
- Raycasting으로 터치된 Cubie & 면 법선 검출 → 회전축 결정

**Android ↔ JS 브릿지 (bridge.js):**
- `window.AndroidCube.applyMove(name)` — 이동 적용
- `window.AndroidCube.shuffle()` — 셔플
- `window.AndroidCube.reset()` — 리셋
- `window.AndroidCube.getFacelets()` — 현재 facelets 반환
- `window.AndroidCube.setInsets(top, right, bottom, left)` — 시스템 인셋 전달

---

## 개발 현황

### 완료된 작업 ✅

| Phase | 내용 | 주요 파일 |
|-------|------|-----------|
| 1 | 큐브 논리 모델 (18 이동, cycle4, facelets) | `logic.js`, `constants.js` |
| 2 | Three.js 3D 렌더링 + 뷰 터치 회전 | `scene.js`, `cubies.js` |
| 3 | 26개 Cubie 배치 + 레이어 회전 시각화 | `cubies.js`, `controls.js` |
| 3 | E/M/S 중간 레이어 회전 지원 | `logic.js`, `controls.js` |
| 3 | 핀치 줌 (CAM_MIN=4 ~ CAM_MAX=20) | `controls.js` |
| 4 | 레이어 스냅 시 cubic ease-out 애니메이션 (220ms) | `controls.js` |
| 4 | 레이어 Fling: EMA 속도 추적 → 목표 스냅 예측 | `controls.js` |
| 4 | 뷰 Fling: 관성 감쇠 (FRICTION=0.92/16ms) | `controls.js` |
| 4 | Fling 중 재터치 시 즉시 스냅 확정 (cancelFling) | `controls.js` |
| -  | Edge-to-Edge 레이아웃 + 시스템 인셋 대응 | `MainActivity.kt` |
| -  | Shuffle (랜덤 20수) / Reset 버튼 | `actions.js`, `cube.html` |

---

## 다음에 할 것들 (우선순위 순)

### Phase 5 — 솔버

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **Kociemba 2-phase 솔버** | facelets → 최적 해법 이동 시퀀스 반환. JS 구현 또는 Kotlin 네이티브 후 브릿지로 연결 | 상 |
| **솔브 UI** | "Solve" 버튼 → 이동 시퀀스 한 수씩 자동 적용 (딜레이 애니메이션) | 중 |

### 인터랙션 개선

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **햅틱 피드백** | 레이어 스냅 확정 시 Android 진동 (`HapticFeedbackConstants`) | 하 |
| **Undo / Redo** | 이동 히스토리 스택 유지, 되돌리기 버튼 | 하 |
| **이동 시퀀스 실행** | 알고리즘 문자열 파싱 → 순차 자동 적용 | 중 |
| **제스처 민감도 조정** | Fling 임계값, 애니메이션 속도 설정 UI | 하 |

### 안정성 & 품질

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **Three.js 로컬 번들** | 현재 CDN(`cdnjs.cloudflare.com/r128`) 의존 → 오프라인 미동작 위험. assets에 번들 | 하 |
| **JS 유닛 테스트** | `logic.js` 이동 정확성 검증 (Jest 등) | 중 |
| **facelets 유효성 검사** | shuffle/reset 후 54개 원소 합산 검증 | 하 |
| **멀티터치 엣지 케이스** | 핀치 중 세 번째 손가락 추가 등 비정상 터치 방어 | 중 |

### UX / 비주얼

| 항목 | 내용 | 난이도 |
|------|------|--------|
| **이동 카운터 표시** | 현재 `moveCount` 변수 있음 → 화면에 표시 | 하 |
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
| Three.js | r128 (CDN) |
| Min SDK | 26 / Target SDK 35 / JVM 17 |
