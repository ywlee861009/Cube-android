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

function checkSolvedAndSubmit() {
  if (!isCubeSolved()) return;
  if (usedSolver || solveStartTime === null) return;

  const elapsed = Date.now() - solveStartTime;
  solveStartTime = null;

  const pbResult = _checkAndSavePB(elapsed, manualMoveCount);
  showSolvedOverlay(elapsed, manualMoveCount, pbResult);

  manualMoveCount = 0;
}

// ─── 축하 오버레이 ──────────────────────────────────────────────────────────
function showSolvedOverlay(elapsedMs, moves, pbResult) {
  console.log('[Overlay] showSolvedOverlay called t=' + performance.now().toFixed(0));
  document.getElementById('s-time').textContent  = (elapsedMs / 1000).toFixed(1) + 's';
  document.getElementById('s-moves').textContent = moves;

  // New Best 배지
  const badge = document.getElementById('solved-new-best');
  badge.classList.toggle('hidden', !(pbResult && pbResult.isNew));

  // PB 행: pbResult가 있으면 항상 표시 (첫 솔브 포함)
  const pbSection = document.getElementById('solved-pb');
  if (pbResult) {
    const pbTimeEl  = document.getElementById('s-pb-time');
    const pbMovesEl = document.getElementById('s-pb-moves');

    pbTimeEl.textContent  = (pbResult.pbTime  / 1000).toFixed(1) + 's';
    pbMovesEl.textContent = pbResult.pbMoves;

    pbTimeEl.classList.toggle('pb-new',  pbResult.isNewTime);
    pbMovesEl.classList.toggle('pb-new', pbResult.isNewMoves);

    pbSection.classList.remove('hidden');
  } else {
    pbSection.classList.add('hidden');
  }

  document.getElementById('solved-overlay').classList.remove('hidden');
  _spawnConfetti();
}

function dismissSolvedOverlay() {
  document.getElementById('solved-overlay').classList.add('hidden');
  confetti.reset();
}

function playAgain() {
  dismissSolvedOverlay();
  shuffleCube();
}

function _spawnConfetti() {
  const colors = ['#ffffff', '#ff3333', '#22cc55', '#ffdd00', '#ff8800', '#3388ff'];
  const opts = { colors: colors, scalar: 1.1, zIndex: 102 };

  confetti(Object.assign({ particleCount: 80, spread: 70, origin: { y: 0.55 } }, opts));

  setTimeout(function () {
    confetti(Object.assign({ particleCount: 45, angle: 60,  spread: 58, origin: { x: 0,   y: 0.6 } }, opts));
    confetti(Object.assign({ particleCount: 45, angle: 120, spread: 58, origin: { x: 1,   y: 0.6 } }, opts));
  }, 180);
}

// 오버레이 배경 탭 → 닫기 (카드 내부 탭 제외)
document.getElementById('solved-overlay').addEventListener('click', function(e) {
  if (e.target === this) dismissSolvedOverlay();
});

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

// ─── 셔플 ──────────────────────────────────────────────────────────────────
function shuffleCube() {
  if (isShuffling) return;
  cancelFling();                           // 진행 중인 fling RAF 취소 + flingGroup 정리
  if (layerGroup) commitLayerRotation(0);  // mid-drag 상태 정리 (fling 없는 경우)
  if (window.AndroidBridge && window.AndroidBridge.onShuffleOrReset) {
    AndroidBridge.onShuffleOrReset();
  }
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

// 초기 렌더
applyFacelets();
