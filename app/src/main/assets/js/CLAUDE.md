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
9. `actions.js` → `overlay.js` → `scoring.js` → `history.js` → `solve.js` → `shuffle.js`
10. `animation.js` → `layer-rotation.js` → `layer-snap.js` → `touch.js`
11. `bridge.js`
12. `theme.js` → `long-press.js`

## 핵심 데이터 모델

**facelets** (`logic.js`): `Array(54)` (일반 배열), 인덱스 = `faceIndex*9 + position`
면 순서: U(0) R(1) F(2) D(3) L(4) B(5). 완성 상태: 각 원소 = 면 인덱스.

**MOVES** (`logic.js`): 18개 표준 이동 + E/M/S 중간 레이어.
`applyMoveInPlace(name, f)` → `rotateFaceCW` + `cycle4` 적용.

## 모듈 요약

| 파일 | 역할 | 핵심 API |
|------|------|----------|
| `constants.js` | 색상·face 정의 | `FACE_COLORS`, `FACE_DEFS` |
| `scene.js` | WebGL 렌더러·카메라·조명 | `updateCamera()`, `animate()`, `setSceneBg()` |
| `cubies.js` | 26개 Cubie 생성·색상 갱신 | `applyFacelets()`, `findCubie()` |
| `actions.js` | 큐브 상태·무브 적용·완성 감지 | `applyMove()`, `isCubeSolved()`, `setMoveCount()` |
| `overlay.js` | 축하 오버레이·축포 이펙트 | `showSolvedOverlay()`, `dismissSolvedOverlay()` |
| `scoring.js` | PB 기록·타이머·스코어링 | `checkSolvedAndSubmit()`, `_checkAndSavePB()` |
| `history.js` | undo·redo 스택 | `undoCube()`, `redoCube()`, `inverseMoveOf()` |
| `solve.js` | 솔버 연동·step 실행·광고 콜백 | `solveCube()`, `stepSolution()`, `onSolveGranted/Denied()` |
| `shuffle.js` | 셔플·리셋 | `shuffleCube()`, `resetCube()` |
| `animation.js` | 프로그래매틱 이동 애니메이션 (90ms) | `performAnimatedMove(name, cb)` |
| `layer-rotation.js` | 레이어 드래그 감지·회전 확정 | `initLayerRotation()`, `commitLayerRotation()` |
| `layer-snap.js` | 스냅 애니메이션·fling 물리 | `finishLayerRotation()`, `cancelFling()` |
| `touch.js` | 터치 진입점 (layer/view/pinch) | dragMode, CAM_MIN=4/CAM_MAX=20 |
| `bridge.js` | Android↔JS 인터페이스 | `window.AndroidCube.{setInsets, applyMove, shuffle, reset, getFacelets}` |
| `theme.js` | 다크 모드 토글 (localStorage) | `applyTheme()` |
| `long-press.js` | 셔플 버튼 롱프레스 → 리셋 | 600ms 홀드 감지 |

## 동시 진행 차단 플래그 (actions.js)

`isShuffling` (`actions.js`), `isSolving` (`actions.js`), `isUndoRedo` (`history.js`) — 하나라도 true면 다른 작업 거부.
