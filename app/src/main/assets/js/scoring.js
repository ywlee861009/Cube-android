// ─── 스코어링 상태 ────────────────────────────────────────────────────────
let solveStartTime  = null;   // 셔플 완료 시각 (ms), null이면 타이머 비활성
let manualMoveCount = 0;      // 사용자가 직접 입력한 이동 수 (셔플/솔버 제외)
let usedSolver      = false;  // 솔버 사용 여부 — true면 PB 기록 제외
let _timerRAF       = null;   // 실시간 타이머 RAF ID

// ─── 실시간 타이머 ────────────────────────────────────────────────────────
function _updateTimer() {
  if (solveStartTime === null) return;
  const el = document.getElementById('timer');
  const sec = (Date.now() - solveStartTime) / 1000;
  el.textContent = sec < 60
    ? sec.toFixed(1) + 's'
    : Math.floor(sec / 60) + ':' + (sec % 60).toFixed(1).padStart(4, '0');
  _timerRAF = requestAnimationFrame(_updateTimer);
}

function startTimer() {
  const el = document.getElementById('timer');
  el.classList.add('active');
  el.textContent = '0.0s';
  if (_timerRAF) cancelAnimationFrame(_timerRAF);
  _timerRAF = requestAnimationFrame(_updateTimer);
}

function stopTimer() {
  if (_timerRAF) { cancelAnimationFrame(_timerRAF); _timerRAF = null; }
  document.getElementById('timer').classList.remove('active');
}

// ─── 개인 최고 기록 (PB) ───────────────────────────────────────────────────
function _checkAndSavePB(timeMs, moves) {
  const _t = parseInt(localStorage.getItem('pb_time'),  10);
  const _m = parseInt(localStorage.getItem('pb_moves'), 10);
  const pbTime  = Number.isFinite(_t) ? _t : null;
  const pbMoves = Number.isFinite(_m) ? _m : null;

  const isNewTime  = pbTime  === null || timeMs < pbTime;
  const isNewMoves = pbMoves === null || moves  < pbMoves;

  if (isNewTime)  localStorage.setItem('pb_time',  String(timeMs));
  if (isNewMoves) localStorage.setItem('pb_moves', String(moves));

  return {
    isNew:      isNewTime || isNewMoves,
    isNewTime,
    isNewMoves,
    pbTime:     isNewTime  ? timeMs : pbTime,
    pbMoves:    isNewMoves ? moves  : pbMoves,
  };
}

// ─── 완성 감지 + 결과 처리 ─────────────────────────────────────────────────
function checkSolvedAndSubmit() {
  if (!isCubeSolved()) return;
  if (solveStartTime === null) return;

  const elapsed = Date.now() - solveStartTime;
  solveStartTime = null;
  stopTimer();

  if (usedSolver) {
    // 솔버 사용 후 수동 마무리 → 축하 오버레이는 표시, PB 기록 제외
    showSolvedOverlay(elapsed, manualMoveCount, null);
  } else {
    const pbResult = _checkAndSavePB(elapsed, manualMoveCount);
    showSolvedOverlay(elapsed, manualMoveCount, pbResult);
  }

  manualMoveCount = 0;
}
