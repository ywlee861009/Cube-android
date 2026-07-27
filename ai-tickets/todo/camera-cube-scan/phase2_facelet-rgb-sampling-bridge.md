# Phase 2 — 9셀 평균 RGB 추출과 브릿지 전달

> 상태: **미착수**
> 선행: Phase 1
> 검증 주체: 실기기 + Logcat/DevTools 수치 확인

## 문제/목표

프리뷰 프레임에서 3×3 격자 각 셀의 대표 RGB를 뽑아 JS로 넘긴다. **픽셀은 넘기지 않는다** —
면당 숫자 27개만 전송한다. 이 phase의 산출물은 "믿을 수 있는 27개 숫자"이지 색 이름이 아니다.
분류는 Phase 4의 일이다.

## 수정 대상

- `app/src/main/java/com/kero/cubie/scan/CubeScanner.kt` — `ImageAnalysis` 유스케이스 추가
- 신규 `app/src/main/java/com/kero/cubie/scan/FaceSampler.kt` — 격자 샘플링 순수 로직
- `MainActivity.kt` — `CubeBridge.captureFace(faceIndex)` 추가
- 신규 `app/src/main/assets/js/scan/scan-capture.js` — 면별 샘플 수집·누적
- `app/src/main/assets/cube.html` — 스크립트 로딩 순서에 추가
- `app/src/main/assets/js/CLAUDE.md`, `app/CLAUDE.md` — 표 갱신
- `app/src/test/java/com/kero/cubie/scan/FaceSamplerTest.kt` — JVM 단위 테스트

## 구현 방향

### 격자 좌표

가이드 박스를 화면 정규화 좌표(0.0~1.0)로 정의하고, 그 안을 3×3으로 나눈다.
각 셀에서 **중앙 60% 영역만** 샘플링한다 — 가장자리는 스티커 경계·검은 플라스틱 프레임·
그림자가 섞여 오염된다.

### 대표값 계산

셀 영역 픽셀의 **단순 평균이 아니라 중앙값(median) 또는 트림 평균**을 쓴다.
광택 큐브의 정반사 하이라이트가 몇 픽셀만 있어도 평균은 흰색으로 끌려간다.
채널별로 독립 계산하면 충분하다.

### 색공간

`ImageAnalysis`는 기본이 `YUV_420_888`이다. 선택지 둘:

- `OUTPUT_IMAGE_FORMAT_RGBA_8888` 설정 (CameraX 1.3+) — 단순하지만 변환 비용
- YUV에서 직접 샘플링 후 RGB 변환 — 빠르지만 plane stride 처리 필요

**RGBA_8888 권장.** 면당 1회 셔터 방식이라 성능이 병목이 아니고, stride 버그는 디버깅이 고통스럽다.

### 회전 보정

`ImageProxy.imageInfo.rotationDegrees`를 반드시 반영한다. 이걸 빼먹으면 9칸 순서가
90도 돌아간 채로 나가고, **Phase 3 검증은 통과하면서 실물과 다른 큐브**가 된다.
가장 찾기 어려운 종류의 버그이므로 `FaceSamplerTest`에서 4가지 회전 모두 고정 테스트할 것.

### 셀 순서

`overview.md`의 스캔 방향 규약에 따라, 화면에 보이는 대로 **좌상단부터 행 우선** 0~8.
`FACE_DEFS`(`constants.js:7`)의 `slots` 순서와 일치해야 한다.

### 브릿지 계약

JS → Android:

| 메서드 | 동작 |
| --- | --- |
| `captureFace(faceIndex)` | 현재 프레임에서 9셀 샘플링 → `onFaceSampled` 콜백 |

Android → JS:

| 호출 | 동작 |
| --- | --- |
| `window.onFaceSampled(faceIndex, rgbJson)` | `rgbJson` = `[[r,g,b] × 9]` 직렬화 문자열 |
| `window.onFaceSampleFailed(faceIndex, reason)` | 프레임 없음·분석 실패 |

`evaluateJavascript` 문자열 이스케이프를 피하기 위해 JSON 문자열 하나로 넘기고 JS에서 파싱한다.

### JS 측 (`scan-capture.js`)

- 6면 샘플을 `Array(6)` 슬롯에 누적
- 같은 면 재촬영 시 덮어쓰기 허용 (Phase 5 UI에서 "다시 찍기")
- 전체 수집 완료 시 54×RGB 배열을 평탄화해 Phase 4 분류기에 넘길 준비만 한다
- **여기서 색 이름을 정하지 않는다** — 관심사 분리

## 디버그 지원

전체 수집 완료 시 54개 RGB를 JSON으로 Logcat에 덤프하는 디버그 경로를 남긴다.
Phase 4의 Jest 픽스처는 이 덤프에서 만든다. 릴리스 빌드에서는 `BuildConfig.DEBUG` 가드.

## 검증

- `FaceSamplerTest` (JVM): 인공 이미지로 9셀 위치 정확도, 4가지 회전, 하이라이트 픽셀
  섞인 셀에서 중앙값이 정상 동작
- 실기기: 완성된 큐브를 6면 촬영 → 덤프한 RGB가 같은 면 내에서 9개 모두 근접
- 빨간 면과 주황 면의 RGB 덤프를 나란히 비교 — **얼마나 가까운지 실측 기록**.
  Phase 4의 난이도 판단 근거가 된다
- 서로 다른 3개 조명에서 완성 큐브 덤프를 남겨 Phase 4 픽스처로 저장
