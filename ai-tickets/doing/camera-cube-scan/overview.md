# 티켓: 카메라로 실물 큐브를 스캔해 solve 하기

> 상태: **진행 중**. Phase 1 구현 완료, 통합 검증 대기. 최대 리스크는 Phase 4(색 분류)와
> Phase 8(조명 편차)에 집중되어 있다.

## 목적과 배경

지금 앱은 "완성 상태 → 셔플 → solve" 닫힌 루프만 지원한다. 사용자가 손에 든 실물 큐브를
카메라로 6면 촬영하면 그 상태를 앱에 주입하고, 기존 cubing.js 솔버로 해법을 단계 실행해
따라 돌릴 수 있게 한다.

### 아키텍처 결정 (확정)

**카메라는 CameraX 네이티브, 색 판정·검증·UI는 JS.** 네이티브는 프레임에서 9개 셀의
평균 RGB만 뽑아 브릿지로 넘기고(면당 숫자 27개), 픽셀은 전송하지 않는다.

`getUserMedia`(WebView) 안을 기각한 이유는 두 가지다.

1. **노출 고정.** 6면을 스캔하는 동안 AE/AWB가 자동으로 변하면 같은 흰 스티커가 면마다 다른
   RGB로 찍혀 상대 군집화의 전제가 무너진다. CameraX는 `Camera2Interop`로 잠글 수 있지만
   WebView에는 이 제어권이 없다.
2. **오리진 리스크.** 현재 `MainActivity.kt:112`는 `file:///android_asset/cube.html`을 로드한다.
   `file://`에서 `getUserMedia`가 막히면 `WebViewAssetLoader`(`https://appassets.androidplatform.net/`)
   전환이 유일한 우회로인데, 오리진이 바뀌면 localStorage가 전멸한다 — `pb_time`/`pb_moves`
   (`scoring.js:33-43`), 솔브 히스토리(`stats.js:13`), 테마(`theme.js:6`). 이미 배포된 앱이라
   "안 되면 그때 바꾸자"가 성립하지 않는다.

판정 로직을 JS에 두는 이유는 `npm test`(Jest) 인프라를 쓰기 위해서다. 색 분류와 큐브 검증은
입출력이 명확한 순수 함수라 조명별 RGB 픽스처를 쌓아 회귀 테스트를 붙일 수 있다.

## 스코프

- CameraX 프리뷰 + CAMERA 권한 + AE/AWB lock
- 9셀 평균 RGB 추출과 브릿지 전송
- 54샘플 상대 군집화 기반 색 분류 (절대 HSV 임계값 금지)
- 큐브 상태 유효성 검증 레이어 (솔버 앞단 방어 — 스캔과 무관하게도 필요)
- 6면 스캔 가이드 UI, 인식 결과 확인·수동 수정 UI
- 스캔 상태 주입과 기존 상태 모델(히스토리·기록·광고 게이트) 정합
- 조명 조건별 실기기 검증

## 비스코프

- 실시간(프레임마다) 자동 인식 — 면당 셔터 방식으로 간다
- 스티커리스 큐브 최적화 — Phase 8에서 실측 후 별도 티켓 판단
- 2x2 / 4x4 등 다른 퍼즐
- 스캔 결과 서버 전송·클라우드 처리

## 하위 티켓과 선행 관계

| Phase | 파일 | 한 줄 요약 | 선행 |
| --- | --- | --- | --- |
| 1 | `phase1_camerax-preview-permission.md` | CameraX 의존성·CAMERA 권한·프리뷰 합성·AE/AWB lock | — |
| 2 | `phase2_facelet-rgb-sampling-bridge.md` | 9셀 평균 RGB 추출 → 브릿지로 JS 전달 | 1 |
| 3 | `phase3_cube-state-validation.md` | 큐브 유효성 검증 순수 모듈 + 솔버 앞단 방어 | — |
| 4 | `phase4_color-classifier.md` | 54샘플 상대 군집화 색 분류기 (최대 난관) | 2, 3 |
| 5 | `phase5_scan-guide-ui.md` | 6면 스캔 순서·방향 가이드 HTML 오버레이 | 1, 2 |
| 6 | `phase6_scan-review-correction.md` | 인식 결과 확인·수동 색 수정 UI | 4, 5 |
| 7 | `phase7_state-injection-integration.md` | facelets 주입 + 히스토리·기록·광고 게이트 정합 | 3, 6 |
| 8 | `phase8_lighting-matrix-hardening.md` | 조명 매트릭스 실기기 검증·실패 복구·릴리스 게이트 | 7 |

Phase 3은 다른 phase에 의존하지 않으므로 Phase 1과 병렬로 착수해도 된다.

## 진행 상태

| Phase | 상태 | 비고 |
| --- | --- | --- |
| 1 | 구현 완료 · 검증 대기 | CameraX 프리뷰, 지연 후 AE/AWB lock, 권한/생명주기 브릿지 |
| 2~8 | 미착수 | Phase별 구현 후 마지막에 통합 검증 |

## 전체 수용 기준

- 실내 형광등·주광·따뜻한 백열등 3개 조명 조건에서 6면 스캔 → 유효 큐브 판정 성공
- 오인식이 발생해도 확인 UI에서 수동 수정 후 정상 solve 진입 가능
- 잘못된 큐브 상태가 절대 솔버에 도달하지 않음 (검증 실패 시 명확한 안내)
- 스캔 solve가 PB·솔브 히스토리를 오염시키지 않음
- 기존 셔플→solve 플로우와 localStorage 데이터에 회귀 없음
- `npm test` 통과, 색 분류·검증 로직에 Jest 커버리지 존재

## 공통 참조

### facelets 데이터 모델

`Array(54)`, 인덱스 = `faceIndex * 9 + position`. 면 순서 **U(0) R(1) F(2) D(3) L(4) B(5)**.
값은 면 인덱스(0~5). 완성 상태는 각 원소가 자기 면 인덱스. (`actions.js:2`)

### 기본 색 대응 (`constants.js:2`)

| 면 | 인덱스 | 기본 색 | HEX |
| --- | --- | --- | --- |
| U | 0 | 흰 | `#FFFFFF` |
| R | 1 | 빨 | `#FF2200` |
| F | 2 | 초 | `#00CC44` |
| D | 3 | 노 | `#FFDD00` |
| L | 4 | 주 | `#FF7700` |
| B | 5 | 파 | `#0055FF` |

빨(`#FF2200`)과 주(`#FF7700`)의 구분이 색 분류의 최대 난관이다.

### 스캔 방향 규약 (전 phase 공통, 어기면 조용히 틀린다)

각 면을 카메라에 향하게 들 때 **어느 면이 화면 위쪽에 오는지**를 고정한다.

| 순서 | 촬영 면 | 화면 위쪽에 오는 면 |
| --- | --- | --- |
| 1 | U | B |
| 2 | R | U |
| 3 | F | U |
| 4 | D | F |
| 5 | L | U |
| 6 | B | U |

각 면의 9칸은 그 방향으로 봤을 때 **좌상단부터 행 우선(row-major)** 으로 0~8이며,
`FACE_DEFS`(`constants.js:7`)의 `slots` 순서와 일치해야 한다.

> 규약이 어긋나면 "유효하지만 실물과 다른 큐브"가 되어 Phase 3 검증도 통과한다.
> Phase 5의 온스크린 가이드가 유일한 방어선이다.

### 테스트 인프라 제약

`tests/cube-logic.js`는 `app/src/main/assets/js/`의 순수 함수를 **복사해서** 재-export 하는
구조다(원본이 전역 스코프 선언이라). 색 분류기처럼 자주 튜닝되는 모듈에 이 패턴을 쓰면
복사본이 즉시 썩는다. 신규 스캔 모듈은 파일 끝에
`if (typeof module !== 'undefined') module.exports = {...}` 를 붙여 **Jest가 원본을 직접
require** 하도록 작성한다. 브라우저에서는 이 줄이 무시되므로 기존 로딩 순서에 영향이 없다.
