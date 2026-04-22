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

1. `solveCube()`: `AndroidBridge` 있으면 광고 → `onSolveGranted()` → `_runSolve()`
2. `_runSolve()`: `SolverFactory.create()` → `isReady()` 확인 (미준비 시 1.5s 재시도) → `solver.solve([...facelets])` → 이동 배열 파싱
3. `stepSolution()`: 한 수씩 실행, 버튼에 "N / total" 표시
