# assets/js/ — JS 모듈

## 스크립트 로딩 순서 (cube.html)

1. `three.min.js` — Three.js r128 로컬 번들
2. `constants.js` — 면 색상, FACE_DEFS
3. `scene.js` — Three.js 씬
4. `cubies.js` — 26개 Cubie 메시
5. `logic.js` — facelets 상태 & 이동 논리
6. `lib/cubing-solver.bundle.js`
7. `solver/solver-base.js` → `solver-cubing.js` → `solver-factory.js`
8. `actions.js` → `history.js` → `solve.js`
9. `animation.js` → `layer-rotation.js` → `touch.js`
10. `bridge.js` (마지막)

## 핵심 데이터 모델

**facelets** (`logic.js`): `Array(54)` (일반 배열), 인덱스 = `faceIndex*9 + position`
면 순서: U(0) R(1) F(2) D(3) L(4) B(5). 완성 상태: 각 원소 = 면 인덱스.

**MOVES** (`logic.js`): 18개 표준 이동 + E/M/S 중간 레이어.
`applyMoveInPlace(name, f)` → `rotateFaceCW` + `cycle4` 적용.

## 모듈 요약

| 파일 | 역할 | 핵심 API |
|------|------|----------|
| `constants.js` | 색상·face 정의 | `FACE_COLORS`, `FACE_DEFS` |
| `scene.js` | WebGL 렌더러·카메라·조명 | `updateCamera()`, `animate()` |
| `cubies.js` | 26개 Cubie 생성·색상 갱신 | `applyFacelets()`, `findCubie()` |
| `animation.js` | 이동 애니메이션 (90ms ease-out) | `performAnimatedMove(name, cb)` |
| `layer-rotation.js` | 레이어 드래그·fling·스냅 (220ms) | `initLayerRotation()`, `finishLayerRotation()`, `commitLayerRotation()` |
| `touch.js` | 터치 진입점 (layer/view/pinch) | dragMode, CAM_MIN=4/CAM_MAX=20 |
| `actions.js` | shuffle·reset·applyMove·PB·축하오버레이 | `shuffleCube()`, `resetCube()`, `applyMove()`, `checkSolvedAndSubmit()` |
| `history.js` | undo·redo 스택, `isUndoRedo` 플래그 | `undoCube()`, `redoCube()`, `inverseMoveOf()` |
| `solve.js` | 솔버 연동·step 실행·광고 콜백 | `solveCube()`, `stepSolution()`, `onSolveGranted/Denied()` |
| `bridge.js` | Android↔JS 인터페이스 | `window.AndroidCube.{setInsets, applyMove, shuffle, reset, getFacelets}` |

## 동시 진행 차단 플래그 (actions.js)

`isShuffling` (`actions.js`), `isSolving` (`actions.js`), `isUndoRedo` (`history.js`) — 하나라도 true면 다른 작업 거부.
