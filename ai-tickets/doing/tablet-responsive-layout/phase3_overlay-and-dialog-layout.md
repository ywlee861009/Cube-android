# Phase 3 — 오버레이·다이얼로그 재배치

> 상태: 미착수
> 선행: Phase 1

## 문제/목표

`≥600px`에서 오버레이가 풀블리드/바텀시트로 지나치게 커지거나 허전해지지 않도록,
**중앙 정렬 max-width 다이얼로그**로 재배치한다.

## 수정 대상

- `app/src/main/assets/css/cube.css`
  - `#solved-overlay` / `#solved-card` (완성 축하)
  - `#stats-overlay` / `#stats-card` / `#stats-grid` (통계 대시보드)
  - `#scan-review-overlay` / `#scan-review-card` (스캔 결과 확인 — 현재 하단 바텀시트,
    `cube.css:296~`)
- `cube.html`의 해당 오버레이 마크업은 **구조 변경 없이** CSS로만 재배치.

## 구현 방향 (`≥600px` 블록 안에서만)

1. **중앙 다이얼로그화.** 바텀시트/풀폭 카드를 `--dialog-max-width` 상한을 가진 중앙 정렬
   카드로 바꾼다. `#scan-review-overlay`는 `align-items: flex-end`(바텀시트)를 태블릿에서
   `center`로 오버라이드하고 `border-radius`를 사방 둥글게.
2. **통계 그리드 확대.** `#stats-grid`(현재 6셀)를 넓은 화면에서 열 수를 늘려(예: 3열 → 더 넓게)
   가로 공간을 활용. `#ds-history-list`·`#ds-sparkline`도 넓은 폭에 맞춰 정돈.
3. **스크롤/최대 높이.** 다이얼로그가 화면보다 커지지 않도록 `max-height: calc(100vh - safe)` +
   내부 스크롤 유지. 태블릿에서 세로 여백이 충분하므로 바텀시트 전용 높이 계산을 재검토.
4. **딤 배경 유지.** 모달 딤(반투명 배경)은 그대로 두되 중앙 정렬로만 바꾼다.

## 주의

- `#scan-review-overlay`는 방금 완료된 스캔 기능의 일부다. 재배치가 저확신 강조/팔레트/
  전개도(`scan-review.js`가 채우는 `#scan-net`·`#scan-face-editor`·`#scan-palette`)의 클릭
  영역을 깨지 않는지 확인.
- JS는 수정하지 않는다.

## 검증

- `≥600px`: 각 오버레이가 중앙 적정 폭으로 표시, 겹침·잘림 없음, 내부 스크롤 정상.
- 스캔 리뷰에서 칸 선택·색 수정·다시스캔·Solve 시작 버튼 정상 동작.
- `<600px` 폰 회귀 0(바텀시트/풀폭 그대로).
- `./gradlew lint` 통과, `npm test` 통과.
