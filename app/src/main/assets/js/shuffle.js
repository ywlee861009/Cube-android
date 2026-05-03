// ─── 셔플 ──────────────────────────────────────────────────────────────────
function shuffleCube() {
  if (isShuffling) return;
  cancelFling();                           // 진행 중인 fling RAF 취소 + flingGroup 정리
  if (layerGroup) commitLayerRotation(0);  // mid-drag 상태 정리 (fling 없는 경우)
  if (window.AndroidBridge && window.AndroidBridge.onShuffleOrReset) {
    AndroidBridge.onShuffleOrReset();
  }
  _solveAdRequired = true;  // 셔플 후 다음 솔브는 다시 광고 필요
  resetSolution();  // 진행 중인 솔브 초기화
  isShuffling = true;
  document.getElementById('btn-shuffle').disabled = true;
  document.getElementById('btn-solve').disabled   = true;

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
      document.getElementById('btn-solve').disabled   = false;
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
  if (window.AndroidBridge && window.AndroidBridge.onShuffleOrReset) {
    AndroidBridge.onShuffleOrReset();
  }
  _solveAdRequired = true;  // 리셋 후 다음 솔브는 다시 광고 필요
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
  updateUndoRedoButtons();
}
