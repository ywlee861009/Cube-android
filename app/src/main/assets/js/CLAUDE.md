# assets/js/ — JS 모듈

## 스크립트 로딩 순서 (cube.html)

1. `lib/confetti.min.js` — 축포 이펙트
2. `three.min.js` — Three.js r128 로컬 번들
3. `constants.js` — 면 색상, FACE_DEFS
4. `scene.js` — Three.js 씬
5. `cubies.js` — 26개 Cubie 메시
6. `logic.js` — facelets 상태 & 이동 논리
7. `lib/cubing-solver.bundle.js`
8. `solver/solver-base.js` → `solver-cubing.js` → `solver-factory.js`
9. `actions.js` → `overlay.js` → `stats.js` → `scoring.js` → `history.js` → `scan/cube-validate.js` → `scan/color-classify.js` → `solve.js` → `shuffle.js`
10. `animation.js` → `layer-rotation.js` → `layer-snap.js` → `touch.js` → `guided-solve.js`
11. `bridge.js` → `scan/scan-capture.js` → `scan/scan-orientation.js` → `scan/scan-ui.js` → `scan/scan-review.js` → `scan/scan-apply.js`
12. `theme.js` → `long-press.js` → `dashboard.js`

## 핵심 데이터 모델

**facelets** (`logic.js`): `Array(54)` (일반 배열), 인덱스 = `faceIndex*9 + position`
면 순서: U(0) R(1) F(2) D(3) L(4) B(5). 완성 상태: 각 원소 = 면 인덱스.

**MOVES** (`logic.js`): 18개 표준 이동 + E/M/S 중간 레이어.
`applyMoveInPlace(name, f)` → `rotateFaceCW` + `cycle4` 적용.

## 모듈 요약

| 파일 | 역할 | 핵심 API |
|------|------|----------|
| `constants.js` | 색상·face 정의, 활성 팔레트 상태 | `FACE_COLORS`, `FACE_DEFS`, `setActiveFaceColors()`, `resetActiveFaceColors()` |
| `scene.js` | WebGL 렌더러·카메라·조명 | `updateCamera()`, `animate()`, `setSceneBg()` |
| `cubies.js` | 26개 Cubie 생성·색상 갱신·터치 스티커 피드백 | `applyFacelets()`, `findCubie()`, `highlightTouchedSticker()` |
| `actions.js` | 큐브 상태·무브 적용·완성 감지 | `applyMove()`, `isCubeSolved()`, `setMoveCount()` |
| `overlay.js` | 축하 오버레이·축포 이펙트 | `showSolvedOverlay()`, `dismissSolvedOverlay()` |
| `scoring.js` | PB 기록·타이머·스코어링 | `checkSolvedAndSubmit()`, `_checkAndSavePB()` |
| `history.js` | undo·redo 스택 | `undoCube()`, `redoCube()`, `inverseMoveOf()` |
| `solve.js` | 솔버 연동·step 실행·광고 콜백 | `solveCube()`, `stepSolution()`, `onSolveGranted/Denied()` |
| `shuffle.js` | 셔플·리셋 | `shuffleCube()`, `resetCube()` |
| `animation.js` | 프로그래매틱 이동 애니메이션 (기본 90ms) | `performAnimatedMove(name, cb, duration)` |
| `layer-rotation.js` | 레이어 드래그 감지·회전 확정 | `initLayerRotation()`, `commitLayerRotation()` |
| `layer-snap.js` | 스냅 애니메이션·fling 물리 | `finishLayerRotation()`, `cancelFling()` |
| `touch.js` | 터치 진입점 (layer/view/pinch) | dragMode, CAM_MIN=4/CAM_MAX=20 |
| `guided-solve.js` | 스캔 솔브 따라 하기 (프로토타입): 줄 강조·3D 화살표·반복 미리보기, 탭/스와이프 | `openGuidedSolve()`, `guidedNext()`, `guidedPrev()`, `exitGuidedSolve()` |
| `bridge.js` | Android↔JS 인터페이스 | `window.AndroidCube.{setInsets, applyMove, shuffle, reset, getFacelets}` |
| `scan/scan-capture.js` | 6면 RGB 샘플 수집·재촬영 덮어쓰기 | `captureScanFace()`, `getCollectedScanSamples()`, `clearScanSamples()` |
| `scan/cube-validate.js` | 54칸 조각·방향·패리티 순수 검증 | `validateFacelets()` |
| `scan/color-classify.js` | CIELAB 센터 앵커·9개 제약 색 분류, 세션 팔레트·경고 | `classifyFacelets()`, `labToRgb()` |
| `scan/scan-orientation.js` | 색 이름 없는 회전 기반 촬영 순서 순수 모델 | `buildScanSequence()`, `invertScanOps()` |
| `scan/scan-ui.js` | 6면 촬영 순서·방향·재촬영 가이드, 미니 3D 큐브 가이드(기본 배색 대신 회색/촬영한 센터 색) | `startScanFlow()`, `startScanFaceRetake()`, `resumeScanAtLastFace()`, `cancelScanFlow()` |
| `scan/scan-review.js` | 전개도 확인·경고 표시·수동 색 수정·면 단위 재촬영 | `openScanReview()`, `confirmScanReview()` |
| `scan/scan-apply.js` | 검증된 스캔 상태+팔레트 주입·기록/히스토리 초기화 | `applyScannedFacelets(facelets, palette)` |
| `theme.js` | 다크 모드 토글 (localStorage) | `applyTheme()` |
| `stats.js` | 솔브 히스토리·통계 계산 | `recordSolve()`, `getSolveHistory()`, `computeStats()` |
| `dashboard.js` | 통계 대시보드 오버레이 | `openDashboard()`, `closeDashboard()` |
| `long-press.js` | 셔플 버튼 롱프레스 → 리셋 | 600ms 홀드 감지 |

## 스캔 촬영 순서 (scan-orientation.js)

사용자가 고른 **기준면이 정의상 내부 U 슬롯**이다. 색 이름을 쓰지 않고 물리 회전만 안내한다.

| 스텝 | 조작 | 슬롯 | 화면 위쪽 |
|------|------|------|-----------|
| 1 | 기준면을 정면에, 위 방향을 정한다 | U (0) | B |
| 2 | 방금 촬영한 면이 위로 가도록 굴린다 | F (2) | U |
| 3 | 같은 방향으로 한 번 더 | D (3) | F |
| 4 | 되돌린 뒤 오른쪽 면을 정면으로 (복합) | R (1) | U |
| 5 | 같은 방향으로 한 번 더 | B (5) | U |
| 6 | 같은 방향으로 한 번 더 | L (4) | U |

**촬영 순서(step)와 면 슬롯(slot)은 다르다.** 슬롯 순서는 `[0, 2, 3, 1, 5, 4]`.
`scan-ui.js`의 `currentScanStep`과 `currentScanSlot()`을 혼동하면 검증은 통과하지만
실물과 다른 큐브가 되어 조용히 틀린다. 화면 위쪽 면 규약과 `FACE_DEFS.slots`의 row-major
순서는 바뀌지 않았다.

## 면 팔레트 (constants.js)

`FACE_COLORS` 는 **기본값 원본**이고 절대 변형하지 않는다. 렌더링은 `activeFaceColors` 를 쓴다.

| 상황 | 팔레트 |
|------|--------|
| 일반 게임 모드 | `FACE_COLORS` |
| 스캔 적용 후 (`applyScannedFacelets`) | `scanResult.palette` (촬영한 센터 색) |
| 셔플·리셋 | `resetActiveFaceColors()` 로 기본 복원 |
| 검토 화면 | **바꾸지 않는다** — 검토 UI 는 `reviewFaceColor()` 로 직접 그린다 |

검토 중에 3D 팔레트를 바꾸면 아직 적용되지 않은 색으로 이전 facelets 를 칠하게 된다.
facelets 와 팔레트는 `applyScannedFacelets()` 에서 원자적으로 함께 바뀐다.

## 스캔 분류 결과 (color-classify.js)

```js
classifyFacelets(samples) => {
  facelets,    // Array(54), 내부 U/R/F/D/L/B 정규화 0~5
  confidence,  // Array(54), 0~1
  palette,     // [[r,g,b] × 6] — 최종 군집 중심(= 실제 촬영 색). 검토·3D 표시에 쓴다
  separation,  // Array(6) — 각 센터와 최근접 타 센터의 CIELAB 거리
  warnings     // [{ code, faces, detail }] — SIMILAR_CENTERS / CENTER_OVEREXPOSED / LOW_LIGHT
}
```

경고 임계값(`SIMILAR_CENTERS_DELTA_E` 등)은 **잠정값**이며 실기기 실측으로 확정한다.
기준선: 기본 `FACE_COLORS` 최소 쌍거리 ΔE 31.8(빨/주), 흰 제외 최대 L\* 88.4(노랑),
평균 L\* 70.7. **표준 배색에서 경고가 뜨면 회귀다.**

fixture 는 `tests/fixtures/scan-samples/*.json` 에 두면 테스트가 자동으로 읽는다.

## 동시 진행 차단 플래그 (actions.js)

`isShuffling` (`actions.js`), `isSolving` (`actions.js`), `isUndoRedo` (`history.js`),
`isScanning` (`actions.js`) — 하나라도 true면 다른 작업 거부.
