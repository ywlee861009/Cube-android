# Phase 2 — 센터 RGB 기반 세션 팔레트와 분류 계약

> 상태: **구현 완료 · 실측 fixture 미확보**
> 선행: Phase 1, `camera-cube-scan`의 Phase 4 (색 분류기)
> 검증 주체: Jest

## 문제/목표

`classifyFacelets()`(`color-classify.js:5`)는 센터를 앵커로 쓰지만 검토·렌더링 계층에 실제
촬영 색을 전혀 전달하지 않는다. 분류 결과에 스캔 세션의 실제 센터 팔레트와 색 구분도를
포함시킨다.

## 수정 대상

- `app/src/main/assets/js/scan/color-classify.js`
- `app/src/main/assets/js/scan/scan-ui.js` — 결과 소비부
- `tests/color-classify.test.js`
- 신규 `tests/fixtures/scan-samples/` (현재 존재하지 않음)
- `app/src/main/assets/js/CLAUDE.md`

`scan-capture.js`는 변경하지 않는다. Phase 1 결정 2에 따라 순열이 없다.

## API 변경

```js
classifyFacelets(samples) => {
  facelets: Array(54),      // 내부 U/R/F/D/L/B에 정규화된 0~5
  confidence: Array(54),
  palette: [[r,g,b] × 6],   // 내부 면 인덱스별 실제 센터 RGB
  separation: Array(6),     // 각 센터와 최근접 타 센터의 CIELAB 거리
  warnings: []              // { code, faces, detail }
}
```

`centerMap`은 **제거한다.** overview 결정 2에 따라 촬영 슬롯이 곧 내부 면 인덱스이므로
항등 배열이며, 남겨두면 "여기서 순열이 일어난다"는 잘못된 신호를 준다.
현재 `centerMap`을 읽는 소비자는 없다.

## 구현 방향

- 센터 RGB를 그대로 쓰지 말고 해당 센터 셀의 robust 대표값을 사용
  (네이티브가 이미 9셀 중앙값을 보내므로 이중 평활 주의)
- 팔레트 표시는 RGB로, 거리 계산은 CIELAB으로. `rgbToLab()`는 이미 있다
- `separation[i]` = `min(ΔE(center_i, center_j))` for `j ≠ i`
- 경고 코드
  - `SIMILAR_CENTERS` — 최소 ΔE가 임계 미만
  - `CENTER_OVEREXPOSED` — 여러 센터가 L\* 상한에 수렴
  - `LOW_LIGHT` — 54샘플 L\* 평균이 하한 미만
- 경고가 있어도 수동 수정 경로는 유지하되 **자동 확정은 금지**
- 9개 정원 제약(Hungarian)과 결정론성은 유지

### 임계값은 이 phase에서 확정하지 않는다

기본 `FACE_COLORS`의 이상적 hex 기준 쌍거리를 계산하면 다음과 같다.

| 쌍 | ΔE (CIE76) |
| --- | --- |
| 빨 `#FF2200` / 주 `#FF7700` | **31.8** ← 최소 |
| 노 / 주 | 59.0 |
| 나머지 전부 | > 74 |

즉 임계값을 30 근처로 잡으면 **표준 배색 큐브가 매번 유사색 경고를 띄워** overview의 회귀
금지 기준을 위반한다. 반대로 너무 낮추면 진짜 구별 불가능한 팔레트를 통과시킨다. 게다가 위
수치는 이상적 hex 값이고, 전구색 조명에서 실측 빨/주 거리는 이보다 크게 좁아진다.

**따라서 이 phase는 배관만 깐다.**

```js
const SIMILAR_CENTERS_DELTA_E = 18;   // 잠정값. Phase 4 실측으로 확정한다.
const OVEREXPOSED_L = 92;             // 잠정값
const LOW_LIGHT_L = 25;               // 잠정값
```

- 세 상수를 모듈 상단에 모아 노출하고 테스트에서 상수를 참조한다(숫자 리터럴 금지)
- 임계값 확정 책임은 Phase 4가 진다
- 잠정값이 표준 배색에서 경고를 내지 않는다는 것만 이 phase에서 보장한다

## 검증

### 합성 fixture로 가능 (이 phase에서 완료)

- 보라·분홍·청록을 포함하는 합성 6색 팔레트 분류
- 기본 배색의 인접/반대 관계를 섞은 팔레트에서도 정규화 결과 일치
- 같은 입력에 100회 동일 결과 (결정론성)
- 팔레트 각 색이 정확히 9개로 배정
- 인위적으로 붙인 두 센터 색에서 `SIMILAR_CENTERS` 발생
- **표준 `FACE_COLORS` 팔레트에서 어떤 경고도 발생하지 않음** (회귀 가드)
- 밝기·색온도 편향 후에도 팔레트와 facelet 매핑 유지
- `centerMap` 제거 후 소비자 없음 확인

### 실측 fixture (조달 차단 시 Phase 4로 이월)

- 최소 3개 비표준 배색 실측 fixture 확보

`tests/fixtures/`는 아직 없고 `camera-cube-scan` Phase 4도 실측 대기 상태다. 실물 큐브가
없으면 이 항목만 미완으로 남기고 나머지로 phase를 종료한다. 그 경우 `tests/fixtures/`에
합성 fixture만 두고, 미확보 사실을 이 파일 하단 진행 기록에 남긴다.

## 진행 기록

- 2026-07-27: 구현 완료. 전체 Jest 192개 통과 (Phase 1 종료 시점 150개 → +42)
  - `classifyFacelets()` 반환값에 `palette` / `separation` / `warnings` 추가,
    `centerMap` 제거
  - `labToRgb()` 추가 — 6색 전부 왕복 무손실 확인
  - 경고 3종: `SIMILAR_CENTERS`(쌍 단위), `CENTER_OVEREXPOSED`(2면 이상 동시),
    `LOW_LIGHT`(54칸 평균 L\*)
- **팔레트 대표값은 원본 센터 픽셀이 아니라 최종 군집 중심을 쓴다.** 같은 색 9칸의 평균이라
  셀 하나의 반사광에 덜 흔들리고, 분류기가 실제로 사용한 색과 표시색이 일치한다.
  네이티브가 이미 셀 단위 중앙값을 보내므로 원본 센터를 또 쓰면 이중 평활이 된다.
- 임계값 잠정 확정과 근거 수치 (표준 배색에서 오탐하지 않을 것)

  | 상수 | 값 | 표준 배색 기준선 | 여유 |
  | --- | --- | --- | --- |
  | `SIMILAR_CENTERS_DELTA_E` | 18 | 최소 쌍거리 31.8 (빨/주) | 13.8 |
  | `OVEREXPOSED_L` | 95 | 흰 제외 최대 L\* 88.4 (노랑) | 6.6 |
  | `LOW_LIGHT_L` | 25 | 평균 L\* 70.7 | 45.7 |

  `OVEREXPOSED_L` 의 여유 6.6이 가장 얇다. 밝은 조명에서 노란 센터가 95를 넘을 수 있으므로
  2면 이상 동시 조건(`OVEREXPOSED_MIN_FACES`)을 함께 걸어 단독 오탐을 막았다.
  Phase 4에서 실측 후 재조정한다.
- `tests/fixtures/scan-samples/` 신설. 디렉터리의 모든 `*.json` 을 테스트가 자동으로 읽으므로
  **실측 fixture 는 파일만 떨어뜨리면 커버리지가 늘어난다.** 형식과 `adb logcat -s CubeScanner`
  로 실측 샘플을 뽑는 절차는 같은 디렉터리 `README.md` 에 적었다.

## 미완 (Phase 4로 이월)

- **최소 3개 비표준 배색 실측 fixture 확보** — 현재 합성 3종만 있다.
  합성 RGB는 카메라 노이즈·정반사·화이트밸런스 드리프트를 재현하지 못한다.
- 세 임계 상수의 최종 확정
