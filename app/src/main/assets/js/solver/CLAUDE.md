# solver/ — 솔버 아키텍처

## 구조

```
solver-base.js     — CubeSolverBase (추상: solve(facelets), isReady())
solver-cubing.js   — CubingJsSolver (cubing.js 구현체, _ready 캐시)
solver-factory.js  — SolverFactory.create() (교체 시 이 파일만 수정)
../lib/cubing-solver.bundle.js  — cubing.js 솔버 번들
```

## 솔버 교체

`solver-factory.js`의 `create()` 반환값만 변경하면 구현체 교체 가능.

## solve.js 연동 흐름

1. `solveCube()`: 솔루션 계산 완료 상태면 탭마다 `stepSolution()` 호출. 아니면 `AndroidBridge.requestSolve()` → 광고 → `onSolveGranted()` → `_runSolve()`
2. `_runSolve()`: `SolverFactory.create()` → `isReady()` 확인 (미준비 시 1.5s 후 버튼 재활성화) → `solver.solve([...facelets])` → 이동 배열 파싱 → `usedSolver = true` → 첫 수 자동 실행
3. `stepSolution()`: 한 수씩 애니메이션 실행, 완료 후 다음 수 대기 (버튼에 "N / total" 표시), 전부 완료 시 "Solved!" 상태
