// ─── 큐브 상태 ─────────────────────────────────────────────────────────────
let facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
let moveCount = 0;
let isShuffling = false;
let isSolving = false;

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
  _refreshSolveLabel();
}

function resetButtons() {
  isSolving = false;
  resetSolution();
  document.getElementById('btn-solve').disabled   = false;
  document.getElementById('btn-shuffle').disabled = false;
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

// ─── 단일 무브 적용 ────────────────────────────────────────────────────────
function applyMove(name) {
  const f = [...facelets];
  if (!name || (!MOVES[name[0]])) return;
  if (!isShuffling && !isSolving && !isUndoRedo) {
    if (solutionMoves) resetSolution();  // 솔브 진행 중 수동 이동 → 솔루션 무효화
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

// 초기 렌더
applyFacelets();
