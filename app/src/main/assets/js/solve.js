// ─── 솔브 상태 ─────────────────────────────────────────────────────────────
let solutionMoves = null;  // 계산된 솔루션 배열 (null이면 비활성)
let solutionIndex = 0;     // 다음에 실행할 수 인덱스

// ─── Android 광고 콜백 ──────────────────────────────────────────────────────
// 광고 거부/실패 → 솔브 차단
window.onSolveDenied = function() {
  setStatus('광고를 시청해야 Solve를 사용할 수 있어요.');
  document.getElementById('btn-solve').disabled   = false;
  document.getElementById('btn-shuffle').disabled = false;
};

// 광고 허가 후 실행 — 솔루션 계산 후 전체 자동 실행
window.onSolveGranted = function() {
  _runSolve();
};

// ─── 솔브 진입점 ───────────────────────────────────────────────────────────
function solveCube() {
  if (isShuffling || isSolving) return;

  // 솔루션이 이미 계산된 상태 → 탭할 때마다 1수씩 실행
  if (solutionMoves && solutionIndex < solutionMoves.length) {
    stepSolution();
    return;
  }

  document.getElementById('btn-solve').disabled   = true;
  document.getElementById('btn-shuffle').disabled = true;

  if (window.AndroidBridge && window.AndroidBridge.requestSolve) {
    AndroidBridge.requestSolve();
  } else {
    // 브릿지 없음 (브라우저 테스트 환경) → 바로 실행
    _runSolve();
  }
}

// ─── 솔루션 계산 ───────────────────────────────────────────────────────────
async function _runSolve() {
  if (isSolving) return;  // ad callback 이중 호출 등으로 인한 중복 실행 방지
  try {
    const solver = SolverFactory.create();
    if (!solver.isReady()) {
      setStatus('Solver loading...');
      // btn-solve는 비활성 유지 — 준비 완료 후 자동 재활성화
      document.getElementById('btn-shuffle').disabled = false;
      setTimeout(() => {
        if (!isSolving && !isShuffling) {
          document.getElementById('btn-solve').disabled = false;
          setMoveCount(moveCount);
        }
      }, 1500);
      return;
    }

    document.getElementById('btn-solve').disabled   = true;
    document.getElementById('btn-shuffle').disabled = true;
    setStatus('Calculating...');

    const solution = await solver.solve([...facelets]);
    const moves = solution.trim().split(/\s+/).filter(Boolean);

    if (moves.length === 0) {
      setStatus('Already solved!');
      document.getElementById('btn-solve').disabled   = false;
      document.getElementById('btn-shuffle').disabled = false;
      return;
    }

    usedSolver = true;  // 솔루션이 실제로 셋업될 때만 플래그 설정
    solutionMoves = moves;
    solutionIndex = 0;
    stepSolution();  // 광고 소비 직후 첫 수 자동 실행
  } catch (e) {
    setStatus('Error: ' + e.message);
    resetButtons();
  }
}

// ─── 솔루션 전체 자동 실행 ─────────────────────────────────────────────────
function stepSolution() {
  if (!solutionMoves || solutionIndex >= solutionMoves.length) {
    setStatus('Solved!');
    setMoveCount(0);
    resetButtons();
    return;
  }

  const moveName = solutionMoves[solutionIndex];
  const step     = solutionIndex + 1;
  const total    = solutionMoves.length;
  solutionIndex++;

  isSolving = true;
  document.getElementById('btn-solve').disabled   = true;
  document.getElementById('btn-shuffle').disabled = true;
  setStatus(step + ' / ' + total + '  ' + moveName);

  performAnimatedMove(moveName, () => {
    isSolving = false;
    if (solutionIndex >= solutionMoves.length) {
      const solverMoves = solutionMoves.length;
      const elapsed = solveStartTime !== null ? Date.now() - solveStartTime : 0;
      solveStartTime = null;
      setStatus('Solved!');
      setMoveCount(0);
      resetButtons();
      showSolvedOverlay(elapsed, solverMoves, null);
    } else {
      // 다음 수 대기: 버튼에 진행 상황 표시 후 탭 대기
      document.getElementById('btn-solve').textContent = (solutionIndex + 1) + ' / ' + total;
      document.getElementById('btn-solve').disabled = false;
      setMoveCount(moveCount);
    }
  });
}
