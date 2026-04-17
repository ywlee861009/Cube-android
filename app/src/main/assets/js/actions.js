// ─── 큐브 상태 ─────────────────────────────────────────────────────────────
let facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
let moveCount = 0;
let isShuffling = false;
let isSolving = false;

// ─── 리더보드 스코어링 상태 ────────────────────────────────────────────────
let solveStartTime  = null;   // 셔플 완료 시각 (ms), null이면 타이머 비활성
let manualMoveCount = 0;      // 사용자가 직접 입력한 이동 수 (셔플/솔버 제외)
let usedSolver      = false;  // 솔버 사용 여부 — true면 점수 제출 안 함

// ─── UI 헬퍼 ───────────────────────────────────────────────────────────────
function setMoveCount(n) {
  moveCount = n;
  document.getElementById('moves').textContent = 'Moves: ' + moveCount;
}

function setStatus(msg) {
  document.getElementById('moves').textContent = msg;
}

function updateUndoRedoButtons() {
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const busy = isShuffling || isSolving || isUndoRedo;
  if (btnUndo) btnUndo.disabled = undoStack.length === 0 || busy;
  if (btnRedo) btnRedo.disabled = redoStack.length === 0 || busy;
}

function resetSolution() {
  solutionMoves = null;
  solutionIndex = 0;
  document.getElementById('btn-solve').textContent = 'Solve';
}

function resetButtons() {
  isSolving = false;
  resetSolution();
  document.getElementById('btn-solve').disabled   = false;
  document.getElementById('btn-shuffle').disabled = false;
  document.getElementById('btn-reset').disabled   = false;
  updateUndoRedoButtons();
}

// ─── 완성 감지 ─────────────────────────────────────────────────────────────
function isCubeSolved() {
  for (let f = 0; f < 6; f++) {
    const base = facelets[f * 9];
    for (let i = 1; i < 9; i++) {
      if (facelets[f * 9 + i] !== base) return false;
    }
  }
  return true;
}

function checkSolvedAndSubmit() {
  if (!isCubeSolved()) return;
  if (usedSolver || solveStartTime === null) return;

  const elapsed = Date.now() - solveStartTime;
  solveStartTime = null;

  const secs = (elapsed / 1000).toFixed(1);
  setStatus('Solved!  ' + secs + 's  ' + manualMoveCount + ' moves');

  if (window.AndroidBridge && window.AndroidBridge.submitScore) {
    AndroidBridge.submitScore(elapsed, manualMoveCount);
  }

  manualMoveCount = 0;
}

// ─── 리더보드 열기 ─────────────────────────────────────────────────────────
function showLeaderboard(which) {
  if (window.AndroidBridge && window.AndroidBridge.showLeaderboard) {
    AndroidBridge.showLeaderboard(which);
  }
}

// ─── 단일 무브 적용 ────────────────────────────────────────────────────────
function applyMove(name) {
  const f = [...facelets];
  if (!name || (!MOVES[name[0]])) return;
  if (!isShuffling && !isSolving && !isUndoRedo) {
    undoStack.push({ moveName: name, moveCount });
    redoStack.length = 0;
    updateUndoRedoButtons();
    manualMoveCount++;
  }
  applyMoveInPlace(name, f);
  facelets = f;
  setMoveCount(moveCount + 1);
  applyFacelets();
  if (!isShuffling && !isSolving) checkSolvedAndSubmit();
}

// ─── 셔플 ──────────────────────────────────────────────────────────────────
function shuffleCube() {
  if (isShuffling) return;
  isShuffling = true;
  document.getElementById('btn-shuffle').disabled = true;
  document.getElementById('btn-reset').disabled   = true;

  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
  undoStack.length = 0;
  redoStack.length = 0;
  updateUndoRedoButtons();
  applyFacelets();

  // 랜덤 무브 시퀀스 생성 (같은 면 연속 방지)
  const moves = [];
  let last = '';
  for (let i = 0; i < 25; i++) {
    const candidates = ALL_MOVES.filter(m => m[0] !== last[0]);
    const m = candidates[Math.floor(Math.random() * candidates.length)];
    moves.push(m);
    last = m;
  }

  // 한 수씩 순차 애니메이션
  function next(i) {
    if (i >= moves.length) {
      setMoveCount(0);
      isShuffling = false;
      // 셔플 완료 → 타이머/카운터 초기화 후 시작
      solveStartTime  = Date.now();
      manualMoveCount = 0;
      usedSolver      = false;
      document.getElementById('btn-shuffle').disabled = false;
      document.getElementById('btn-reset').disabled   = false;
      updateUndoRedoButtons();
      return;
    }
    performAnimatedMove(moves[i], () => next(i + 1));
  }
  next(0);
}

// ─── 리셋 ──────────────────────────────────────────────────────────────────
function resetCube() {
  if (isShuffling || isSolving) return;
  resetSolution();
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
  undoStack.length = 0;
  redoStack.length = 0;
  solveStartTime  = null;
  manualMoveCount = 0;
  usedSolver      = false;
  applyFacelets();
  document.getElementById('btn-shuffle').disabled = false;
  document.getElementById('btn-reset').disabled   = false;
  updateUndoRedoButtons();
}

// 초기 렌더
applyFacelets();
