# Phase 3 — 실제 색 기반 검토·수정·3D 렌더링

> 상태: **구현 완료 · 실기기 UI 확인 대기**
> 선행: Phase 2
> 검증 주체: 실기기 UI 확인 + Jest

## 문제/목표

현재 검토 화면과 3D 큐브는 `FACE_COLORS` 고정 팔레트를 사용한다. 보라색 스티커를 촬영해도
주황색 등 앱 기본색으로 보이면 사용자가 오인식을 확인하기 어렵다. 스캔 세션 동안 실제 센터
팔레트를 표시하고, 일반 셔플·리셋 흐름에서는 기본 팔레트로 안전하게 복원한다.

## 수정 대상

- `app/src/main/assets/js/scan/scan-review.js`
- `app/src/main/assets/js/scan/scan-apply.js`
- `app/src/main/assets/js/scan/scan-ui.js` — 면 단위 재촬영 진입점
- `app/src/main/assets/js/cubies.js`
- `app/src/main/assets/js/actions.js`
- `app/src/main/assets/js/shuffle.js`
- `app/src/main/assets/js/constants.js`
- `app/src/main/assets/css/cube.css`
- `app/src/main/assets/js/CLAUDE.md`
- 관련 Jest 테스트

## 구현 방향

### 팔레트 상태 분리

```js
const DEFAULT_FACE_COLORS = [...];
let activeFaceColors = DEFAULT_FACE_COLORS.slice();
```

- 일반 게임 모드: `activeFaceColors = DEFAULT_FACE_COLORS`
- 스캔 검토/스캔 Solve: `activeFaceColors = scanResult.palette`
- `applyFacelets()`는 `activeFaceColors`를 사용
- 셔플·리셋·새 일반 게임 시작 시 기본 팔레트 복원

### 검토·수정 화면

- 전개도, 면 편집기, 수동 수정 팔레트 모두 `scanResult.palette` 사용
- 색약 및 유사색 대응을 위해 실제 색과 함께 A/B/C/D/E/F 또는 내부 면 기호 표시
- `warnings`가 있으면 상단에 구체적 안내 표시
- 유사색 경고가 있는 두 색은 팔레트에서 테두리 패턴이나 문자로 구분

### 센터 수정 불가 정책의 예외 — 면 단위 재촬영 (필수)

`scan-review.js:73,86`은 센터 6칸의 수정을 막는다. 표준 배색에서는 센터가 서로 멀어
오인식이 드무니 문제가 없었지만, **임의 팔레트에서는 센터 RGB가 곧 팔레트의 정의**다.
과노출로 흰 센터가 연노랑으로 읽히면 팔레트 전체가 틀어지는데, 지금 사용자에게 있는 수단은
`restartScanFromReview()`(6면 전체 재촬영)뿐이다. `retakePreviousScanFace()`는 촬영 중
직전 스텝에만 동작하고 검토 화면에서는 쓸 수 없다.

- 센터 색 직접 편집은 **계속 금지**한다 (팔레트 정합이 깨진다)
- 대신 검토 화면에서 **특정 한 면만 재촬영**하는 경로를 추가한다
- 재촬영한 면의 9개 샘플만 교체하고 전체를 재분류한다 — 팔레트가 함께 갱신되어야 한다
- 이 경로가 없으면 Phase 4의 "수동 수정 후 Solve 진입 100%" 게이트를 센터 오인식
  케이스에서 충족할 수 없다

### 상태 수명

- 검토 취소: 기존 3D 팔레트와 facelets 모두 유지
- 다시 스캔 / 면 단위 재촬영: 이전 세션 팔레트 폐기 또는 갱신
- 스캔 적용: facelets와 팔레트를 원자적으로 함께 적용
- 광고 거부: 스캔 facelets와 팔레트 모두 유지
- 셔플·리셋: 기본 facelets 흐름과 기본 팔레트 복원
- **Undo/Redo**: `applyScannedFacelets()`가 `clearHistory()`를 부르므로 적용 시점의 스택은
  비어 있지만, 이후 수동 무브의 undo는 스캔 팔레트를 유지해야 한다
- **페이지 재로드 / 프로세스 재시작**: 팔레트는 메모리에만 두고 영속화하지 않는다.
  `facelets`도 영속화되지 않으므로 재시작 시 기본 팔레트 + 완성 상태로 일관되게 복귀한다

### 터치 하이라이트 대비 (회귀 주의)

`cubies.js:50` `highlightTouchedSticker()`는 스티커 색을 흰색으로 0.5 lerp 한다. 파스텔이나
밝은 커스텀 팔레트에서는 피드백이 거의 보이지 않는다. 최근 추가된 기능(`4b1f948`)이라
회귀 대상이다.

- 스티커의 L\*에 따라 밝은 색은 어둡게, 어두운 색은 밝게 섞는 방향으로 바꾼다
- `clearTouchedStickerHighlight()`가 `applyFacelets()`를 호출하므로 복원은
  `activeFaceColors` 전환만으로 자동 정합된다

## 검증

- 보라색 포함 팔레트가 검토 전개도·수정 팔레트·3D 큐브에 동일하게 표시
- 검토 취소 시 기존 상태와 팔레트가 바뀌지 않음
- 광고 거부 후 재시도해도 스캔 팔레트 유지
- 스캔 Solve 후 셔플·리셋 시 기본 `FACE_COLORS` 복원
- 스캔 큐브에서 수동 무브 후 undo/redo 시 팔레트 유지
- 면 단위 재촬영 후 팔레트와 facelets가 함께 갱신되고 재검증됨
- 밝은 팔레트에서도 터치 하이라이트가 육안으로 식별 가능
- PB·솔브 히스토리 차단 정책 회귀 없음 (`isScanSolve` 경로)
- 다크/라이트 모드에서 흰색·어두운색 스티커 경계가 명확함

## 진행 기록

- 2026-07-27: 구현 완료. 전체 Jest 199개 통과 (Phase 2 종료 시점 192개 → +7)
  - `constants.js`: `activeFaceColors` + `setActiveFaceColors()` /
    `resetActiveFaceColors()` / `isDefaultFacePalette()`. `FACE_COLORS` 는 불변 원본
  - `cubies.js` `applyFacelets()` 가 `activeFaceColors` 를 읽는다
  - `shuffle.js` 의 `shuffleCube()` / `resetCube()` 에서 기본 팔레트 복원
  - `scan-apply.js` `applyScannedFacelets(facelets, palette)` — 검증 실패 시 둘 다 안 바꾼다
  - `scan-review.js` 전면 개편: `reviewPalette` 기반 렌더링, 경고 배너,
    유사색 점선 표시, 색 이름(`흰색`/`빨강`…) 제거 → 내부 면 기호
  - 신규 `tests/face-palette.test.js` 7개
- **설계 수정: 검토 중에는 3D 팔레트를 바꾸지 않는다.** 원래 티켓은 "스캔 검토/스캔 Solve 중
  실제 팔레트 표시"였는데, 검토 시점에는 스캔 facelets 가 아직 적용되지 않았다. 이때
  팔레트만 바꾸면 **이전 큐브 상태를 새 색으로 칠한** 화면이 되어 대조에 오히려 방해가 된다.
  검토 UI 는 `reviewFaceColor()` 로 직접 그리고, 3D 팔레트는 적용 시점에만 바뀐다.
  이 덕분에 "검토 취소 시 기존 상태 유지"가 코드상 자명해졌다(되돌릴 것이 없다).
- 면 단위 재촬영 구현: `startScanFaceRetake(slot)`. 기존 6면 샘플 중 해당 슬롯만 교체하고
  54칸을 전체 재분류하므로 팔레트도 함께 갱신된다. 수동 수정 내용은 의도적으로 폐기한다.
  - 카메라 시작 실패 시 검토 화면을 닫지 않는다 (먼저 닫으면 돌아갈 곳이 없다)
  - 재촬영 취소·권한 거부 시 기존 결과를 살려 검토로 복귀한다
  - 재촬영 모드에서는 "이전 면" 버튼을 막는다 (엉뚱한 슬롯을 지운다)
- 터치 하이라이트: 무조건 흰색 50% 혼합 → 스티커 휘도에 따라 밝으면 검정, 어두우면 흰색을
  섞도록 변경. 파스텔 팔레트에서 피드백이 사라지던 문제를 막는다
- 전역 재선언 충돌 검사: `cube.html` 로딩 순서대로 전체 스크립트를 이어붙여 `node --check`
  통과 (`scan-orientation.js` 의 `SCAN_FACE_LETTERS` 와 겹치지 않도록 `scan-review.js` 는
  `SCAN_FACE_LABELS` 로 명명)
- `npm test` 199개 통과, `./gradlew assembleDebug` 성공

## 범위 조정

- **전개도(net) 칸에는 면 기호를 넣지 않았다.** 12칸 폭 격자에서 글자가 판독 불가능해진다.
  대신 (a) 면 편집기와 팔레트에 기호 표시, (b) 유사색 점선 테두리,
  (c) net 각 칸의 `aria-label` 에 현재 배정된 면 기호 포함으로 대체했다.

## 남은 확인 (실기기)

- 보라 포함 팔레트가 검토 전개도·편집기·3D 큐브에 같은 색으로 보이는지
- 스캔 Solve 후 셔플·리셋 시 기본 팔레트 복원
- 광고 거부 후 재시도해도 스캔 팔레트 유지
- 밝은 팔레트에서 터치 하이라이트 식별 가능 여부
- 다크/라이트 모드에서 경고 배너와 스티커 경계 대비

