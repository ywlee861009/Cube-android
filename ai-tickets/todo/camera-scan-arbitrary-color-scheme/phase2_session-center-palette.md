# Phase 2 — 센터 RGB 기반 세션 팔레트와 분류 계약

> 상태: **미착수**
> 선행: Phase 1, 기존 카메라 큐브 스캔의 색 분류기
> 검증 주체: Jest

## 문제/목표

현재 `classifyFacelets()`는 센터를 앵커로 사용하지만 `centerMap`은 고정 `[0,1,2,3,4,5]`이고,
검토·렌더링 계층에 실제 촬영 색을 전달하지 않는다. 분류 결과에 스캔 세션의 실제 센터
팔레트와 색 구분도를 포함시킨다.

## 수정 대상

- `app/src/main/assets/js/scan/color-classify.js`
- `app/src/main/assets/js/scan/scan-capture.js`
- `app/src/main/assets/js/scan/scan-ui.js`
- `tests/color-classify.test.js`
- `tests/fixtures/scan-samples/`
- `app/src/main/assets/js/CLAUDE.md`

## API 변경

```js
classifyFacelets(samples) => {
  facelets: Array(54),
  confidence: Array(54),
  palette: [[r,g,b] × 6],
  centerMap: Array(6),
  separation: Array(6),
  warnings: []
}
```

- `facelets`: 내부 U/R/F/D/L/B에 정규화된 `0~5`
- `palette`: 각 내부 면에 대응하는 실제 센터 RGB
- `centerMap`: 촬영 슬롯과 내부 면 인덱스의 대응
- `separation`: 각 센터가 가장 가까운 다른 센터와 떨어진 CIELAB 거리
- `warnings`: 유사색, 과노출, 저조도 등 사용자가 확인해야 할 문제

## 구현 방향

- 촬영된 센터 RGB를 그대로 쓰지 말고 해당 센터 셀의 robust RGB 또는 Lab 값을 대표값으로 사용
- 팔레트 표시는 RGB로, 거리 계산은 CIELAB으로 수행
- 센터 간 최소 Delta E가 임계값 미만이면 `SIMILAR_CENTERS` 경고
- 센터가 과노출되어 여러 색이 흰색에 수렴하면 `CENTER_OVEREXPOSED` 경고
- 경고가 있어도 수동 수정 경로는 유지하되 자동 확정은 금지
- 분류기의 9개 정원 제약과 결정론성은 유지

## 검증

- 보라·분홍·청록을 포함하는 합성 6색 팔레트 분류
- 기본 배색의 인접/반대 관계를 섞은 팔레트에서도 정규화 결과 일치
- 같은 팔레트 입력에 100회 동일 결과
- 팔레트 각 색이 정확히 9개로 배정
- 매우 가까운 두 센터 색에서 `SIMILAR_CENTERS` 경고
- 밝기·색온도 편향 후에도 실제 센터 팔레트와 facelet 매핑 유지
- 최소 3개 비표준 배색 실측 fixture 확보

