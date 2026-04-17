// ─── 솔브 상태 ─────────────────────────────────────────────────────────────
let solutionMoves = null;  // 계산된 솔루션 배열 (null이면 비활성)
let solutionIndex = 0;     // 다음에 실행할 수 인덱스

// ─── Android 광고 콜백 ──────────────────────────────────────────────────────
// 광고 거부/실패 → 솔브 차단
window.onSolveDenied = function() {
  setStatus('광고를 시청해야 Solve를 사용할 수 있어요.');
  document.getElementById('btn-solve').disabled   = false;
  document.getElementById('btn-shuffle').disabled = false;
  document.getElementById('btn-reset').disabled   = false;
};

// 광고 허가 후 실행 — 진행 중인 솔루션이 있으면 step, 없으면 새로 계산
window.onSolveGranted = function() {
  if (solutionMoves !== null) {
    stepSolution();
  } else {
    _runSolve();
  }
};

// ─── 솔브 진입점 ───────────────────────────────────────────────────────────
function solveCube() {
  if (isShuffling || isSolving) return;

  // 모든 탭을 Android에 위임 — 광고 여부는 Android가 판단
  if (window.AndroidBridge && window.AndroidBridge.requestSolve) {
    document.getElementById('btn-solve').disabled   = true;
    document.getElementById('btn-shuffle').disabled = true;
    document.getElementById('btn-reset').disabled   = true;
    AndroidBridge.requestSolve();
  } else {
    // 브릿지 없음 (브라우저 테스트 환경) → 바로 실행
    _runSolveStep();
  }
}

// ─── 솔루션 계산 ───────────────────────────────────────────────────────────
async function _runSolve() {
  try {
    const solver = SolverFactory.create();
    if (!solver.isReady()) {
      setStatus('Solver loading...');
      document.getElementById('btn-solve').disabled   = false;
      document.getElementById('btn-shuffle').disabled = false;
      document.getElementById('btn-reset').disabled   = false;
      return;
    }

    document.getElementById('btn-solve').disabled   = true;
    document.getElementById('btn-shuffle').disabled = true;
    document.getElementById('btn-reset').disabled   = true;
    setStatus('Calculating...');

    const solution = await solver.solve([...facelets]);
    const moves = solution.trim().split(/\s+/).filter(Boolean);

    if (moves.length === 0) {
      setStatus('Already solved!');
      document.getElementById('btn-solve').disabled   = false;
      document.getElementById('btn-shuffle').disabled = false;
      document.getElementById('btn-reset').disabled   = false;
      return;
    }

    solutionMoves = moves;
    solutionIndex = 0;
    document.getElementById('btn-solve').disabled = false;

    stepSolution(); // 첫 번째 수 즉시 실행
  } catch (e) {
    setStatus('Error: ' + e.message);
    resetButtons();
  }
}

// ─── 솔루션 한 수씩 실행 ───────────────────────────────────────────────────
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
  document.getElementById('btn-reset').disabled   = true;
  setStatus(step + ' / ' + total + '  ' + moveName);

  performAnimatedMove(moveName, () => {
    isSolving = false;

    if (solutionIndex >= solutionMoves.length) {
      setStatus('Solved!');
      setMoveCount(0);
      resetButtons();
    } else {
      document.getElementById('btn-solve').textContent = 'Next  ' + (solutionIndex + 1) + '/' + total;
      document.getElementById('btn-solve').disabled   = false;
      document.getElementById('btn-shuffle').disabled = true;
      document.getElementById('btn-reset').disabled   = false;
    }
  });
}
