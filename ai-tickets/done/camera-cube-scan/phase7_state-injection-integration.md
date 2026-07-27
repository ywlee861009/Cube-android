# Phase 7 — facelets 주입과 기존 상태 모델 정합

> 상태: **구현 완료 · 통합 검증 대기** (2026-07-27)
> 선행: Phase 3 (검증), Phase 6 (확정된 facelets)
> 검증 주체: 실기기 + `npm test`

## 문제/목표

확정된 54칸을 앱 상태에 주입하고 기존 solve 플로우에 연결한다.

앱 전체가 **"완성 상태에서 시작해 알려진 move로만 변형된다"** 는 전제 위에 서 있다.
임의 상태를 주입하면 이 전제를 공유하는 모든 모듈이 어긋난다. 이 phase는 새 기능을 만드는
게 아니라 **깨지는 곳을 전부 찾아 막는 일**이다.

## 깨지는 지점 목록

### 1. 히스토리 (`history.js`)

`undoStack`/`redoStack`이 주입 이전 상태를 가리킨다. 주입 직후 되돌리기를 누르면
실물과 무관한 상태로 간다. **양쪽 스택을 비우고 `updateUndoRedoButtons()` 호출.**

### 2. 기록·통계 (`scoring.js`, `stats.js`)

`solve.js:130`의 `recordSolve(elapsed, solverMoves, true)`가 스캔 solve에도 실행되면
솔브 히스토리와 PB가 오염된다. 스캔은 앱 안에서 큐브를 푼 게 아니다.

- `recordSolve()` 호출 경로를 스캔 여부로 분기해 **기록하지 않는다**
- `_checkAndSavePB()`(`scoring.js:42`)로 `pb_time`/`pb_moves`가 갱신되지 않도록 차단
- `showSolvedOverlay()`의 "New Best!" 표시도 스캔 경로에서는 억제

`isScanSolve` 같은 플래그를 `actions.js`에 두고, 셔플/리셋 시 해제한다.

### 3. 무브 카운트·타이머 (`actions.js`, `scoring.js`)

`moveCount`를 0으로, `solveStartTime`을 `null`로 초기화한다.
스캔 상태에서 "몇 수 만에 풀었나"는 의미가 없다.

### 4. 광고 게이트 (`MainActivity.kt`, `solve.js:6`)

현재 `onShuffleOrReset()`이 `solveGranted = false`로 리셋하고, JS 측 `_solveAdRequired`가
버튼 라벨을 결정한다(`solve.js:9`). **스캔도 셔플과 동일하게 취급해 리워드 광고를 요구할지
결정이 필요하다.**

- 요구한다 → 수익 일관성. 다만 스캔은 이미 6면 촬영이라는 긴 작업 뒤라 이탈 위험
- 면제한다 → UX는 좋지만 "스캔하면 광고 없이 solve" 우회로가 생김

**권장: 셔플과 동일하게 광고를 요구한다.** solve 자체가 광고 게이트의 대상이지 그 앞의
상태 설정 방법이 대상이 아니기 때문이다. 다만 광고 타이밍은 스캔 완료 후 "Solve 시작"을
누른 시점이어야 하고, 광고 거부(`onSolveDenied`) 시에도 **스캔한 상태는 유지**되어야 한다 —
여기서 상태를 날리면 사용자는 6면을 다시 찍어야 한다.

### 5. 완성 감지 (`actions.js:41` `isCubeSolved`)

스캔한 큐브가 이미 완성 상태일 수 있다. `solve.js:39`가 "Already solved!"로 처리하므로
동작은 하지만, 스캔 문맥에 맞는 메시지가 나은지 확인.

### 6. 솔루션 상태 (`solve.js`)

`resetSolution()`으로 `solutionMoves`/`solutionIndex`를 초기화하고 버튼 라벨을 갱신한다.

### 7. 3D 렌더링 (`cubies.js`)

`applyFacelets()`를 호출해 주입 상태를 씬에 반영한다.
애니메이션 없이 즉시 적용되는지 확인.

## 수정 대상

- 신규 `app/src/main/assets/js/scan/scan-apply.js` — 주입 진입점
- `app/src/main/assets/js/actions.js` — `isScanning`, `isScanSolve` 플래그
- `app/src/main/assets/js/history.js` — 스택 초기화 경로
- `app/src/main/assets/js/scoring.js` — 스캔 solve의 PB·타이머 차단
- `app/src/main/assets/js/stats.js` — `recordSolve` 분기
- `app/src/main/assets/js/solve.js` — 검증 통합 확인, 광고 거부 시 상태 보존
- `app/src/main/java/com/kero/cubie/MainActivity.kt` — 광고 게이트 정책 반영
- `tests/cube-logic.js`, `tests/cube-logic.test.js` — 필요 시 갱신
- `app/CLAUDE.md`, `app/src/main/assets/js/CLAUDE.md` — 브릿지·모듈 표 갱신
- `PROJECT_STATUS.md` — 기능 목록 갱신

## 구현 방향

```js
// scan-apply.js
function applyScannedFacelets(scanned) {
  const v = validateFacelets(scanned);
  if (!v.ok) return v;              // Phase 6에서 이미 걸렀지만 이중 방어

  facelets = scanned.slice();
  applyFacelets();                  // cubies.js — 3D 반영
  clearHistory();                   // history.js
  setMoveCount(0);
  solveStartTime = null;
  resetSolution();
  isScanSolve = true;               // 기록 차단 플래그
  return { ok: true };
}
```

`isScanSolve`는 셔플·리셋 시 반드시 해제한다. 안 하면 이후 정상 solve의 기록까지 계속 막힌다.

## 검증

- 스캔 → 주입 → solve → 해법 단계 실행 → "Solved!" 정상 도달
- 주입 직후 undo 버튼 비활성
- 스캔 solve 후 `stats.js` 솔브 히스토리에 항목이 **추가되지 않음**
- 스캔 solve 후 `pb_time`/`pb_moves`가 **변하지 않음** (localStorage 직접 확인)
- 스캔 solve 후 셔플 → 정상 solve → 이때는 기록이 **정상 저장됨** (플래그 해제 확인)
- 광고 거부 시 스캔 상태가 유지되고 재시도 가능
- 이미 완성된 큐브를 스캔했을 때 적절한 안내
- 검증을 통과하지 못한 상태가 솔버까지 도달하지 않음
- `npm test` 통과, 기존 셔플→solve 경로 회귀 없음
