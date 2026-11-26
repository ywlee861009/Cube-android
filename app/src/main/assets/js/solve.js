// ─── 솔브 상태 ─────────────────────────────────────────────────────────────
let solutionMoves = null;  // 계산된 솔루션 배열 (null이면 비활성)
let solutionIndex = 0;     // 다음에 실행할 수 인덱스
let pendingSolveRequest = null;

// Android 환경이면 초기에는 광고 필요, 브라우저 테스트는 바로 실행
let _solveAdRequired = !!window.AndroidBridge?.requestSolve;

function _refreshSolveLabel() {
  const button = document.getElementById('btn-solve');
  const hasSteps = !isScanSolve && solutionMoves && solutionIndex < solutionMoves.length;
  if (hasSteps) {
    button.textContent = t('Next move · {step}/{total}', {
      step: solutionIndex + 1,
      total: solutionMoves.length
    });
  } else {
    button.textContent = t(_solveAdRequired ? 'Solve · Ad' : 'Solve');
  }

  const exit = document.getElementById('btn-solve-exit');
  if (exit) {
    exit.hidden = !hasSteps;
    exit.disabled = isSolving;
  }
  document.getElementById('btn-shuffle').hidden = !!hasSteps;
}

function _setSolveBusy(busy) {
  isSolving = busy;
  if (busy) {
    for (const id of ['btn-solve', 'btn-shuffle', 'btn-scan']) {
      document.getElementById(id).disabled = true;
    }
    updateUndoRedoButtons();
  } else {
    enableGameButtons();
  }
  _refreshSolveLabel();
}

function _finishSolveRequest(request) {
  if (pendingSolveRequest !== request) return;
  pendingSolveRequest = null;
  document.getElementById('btn-solve').classList.remove('calculating');
  _setSolveBusy(false);
}

function exitSolution() {
  if (isSolving || isScanSolve || !solutionMoves) return false;
  resetSolution();
  setMoveCount(moveCount);
  return true;
}

// ─── Android 광고 콜백 ──────────────────────────────────────────────────────
window.onSolveDenied = function() {
  if (!pendingSolveRequest?.awaitingAd) return;
  _finishSolveRequest(pendingSolveRequest);
  setStatus('Watch the ad to use the solver.');
};

window.onSolveGranted = function() {
  if (!pendingSolveRequest?.awaitingAd) return;
  _solveAdRequired = false;
  _runSolve(pendingSolveRequest);
};

// ─── 솔브 진입점 ───────────────────────────────────────────────────────────
function solveCube() {
  if (isShuffling || isSolving || isScanning || isUndoRedo || isGuidedSolve ||
      isChallengeActive() || layerGroup !== null || animRafId !== null) return;

  if (solutionMoves && solutionIndex < solutionMoves.length) {
    continueSolution();
    return;
  }
  if (isCubeSolved()) {
    setStatus(isScanSolve ? 'The scanned cube is already solved.' : 'Already solved!');
    return;
  }

  const request = {
    source: facelets,
    facelets: facelets.slice(),
    isScanSolve,
    awaitingAd: !!window.AndroidBridge?.requestSolve
  };
  pendingSolveRequest = request;
  _setSolveBusy(true);

  if (request.awaitingAd) window.AndroidBridge.requestSolve();
  else _runSolve(request);
}

function _solveRequestMatches(request) {
  return pendingSolveRequest === request &&
    request.source === facelets &&
    request.isScanSolve === isScanSolve &&
    request.facelets.every((color, index) => color === facelets[index]);
}

// ─── 솔루션 계산 ───────────────────────────────────────────────────────────
async function _runSolve(request) {
  request.awaitingAd = false;
  try {
    if (!_solveRequestMatches(request)) return;
    const validation = validateFacelets(request.facelets);
    if (!validation.ok) {
      setStatus(localizedValidationMessage(validation));
      return;
    }
    const solver = SolverFactory.create();
    if (!solver.isReady()) {
      setStatus('Solver loading…');
      return;
    }

    setStatus('Calculating…');
    document.getElementById('btn-solve').classList.add('calculating');
    const solverFacelets = validation.normalizedFacelets ?? request.facelets;
    const solution = await solver.solve(solverFacelets.slice());
    if (!_solveRequestMatches(request)) {
      setMoveCount(moveCount);
      return;
    }
    const moves = solution.trim().split(/\s+/).filter(Boolean);
    if (!moves.length || !moves.every(move => Object.prototype.hasOwnProperty.call(MOVE_ANIM_MAP, move))) {
      setStatus('Could not find a solution. Try again.');
      return;
    }

    usedSolver = true;
    solutionMoves = moves;
    solutionIndex = 0;
  } catch (error) {
    console.error('[Solve]', error);
    setStatus('Could not find a solution. Try again.');
    return;
  } finally {
    _finishSolveRequest(request);
  }

  continueSolution();
}

function continueSolution() {
  if (isScanSolve) openGuidedSolve();
  else stepSolution();
}

// ─── 솔루션 1수 실행 (Solve 버튼 탭마다) ───────────────────────────────────
function stepSolution() {
  if (isSolving || !solutionMoves || solutionIndex >= solutionMoves.length) return;

  const moves = solutionMoves;
  const index = solutionIndex;
  _setSolveBusy(true);

  performAnimatedMove(moves[index], () => {
    if (solutionMoves !== moves || solutionIndex !== index) return;
    solutionIndex++;
    if (solutionIndex < moves.length) {
      _setSolveBusy(false);
      setMoveCount(moveCount);
      saveFreePlaySession();
      return;
    }

    const solved = isCubeSolved();
    resetSolution();
    _setSolveBusy(false);
    if (!solved) {
      saveFreePlaySession();
      setStatus('Could not find a solution. Try again.');
      return;
    }

    const elapsed = solveStartTime !== null ? Date.now() - solveStartTime : 0;
    solveStartTime = null;
    stopTimer();
    setMoveCount(0);
    clearFreePlaySession();
    recordSolve(elapsed, moves.length, true);
    showSolvedOverlay(elapsed, moves.length, null);
  });
}

_refreshSolveLabel();
