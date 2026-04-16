// ─── 큐브 상태 ─────────────────────────────────────────────────────────────
let facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
let moveCount = 0;

function setMoveCount(n) {
  moveCount = n;
  document.getElementById('moves').textContent = 'Moves: ' + moveCount;
}

// ─── 단일 무브 적용 ────────────────────────────────────────────────────────
function applyMove(name) {
  const f = [...facelets];
  if (!name || (!MOVES[name[0]])) return;
  applyMoveInPlace(name, f);
  facelets = f;
  setMoveCount(moveCount + 1);
  applyFacelets();
}

// ─── 셔플 ──────────────────────────────────────────────────────────────────
function shuffleCube() {
  if (isShuffling) return;
  isShuffling = true;
  document.getElementById('btn-shuffle').disabled = true;
  document.getElementById('btn-reset').disabled   = true;

  // 완성 상태에서 시작
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
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
      document.getElementById('btn-shuffle').disabled = false;
      document.getElementById('btn-reset').disabled   = false;
      return;
    }
    performAnimatedMove(moves[i], () => next(i + 1));
  }
  next(0);
}

// ─── 리셋 ──────────────────────────────────────────────────────────────────
function resetCube() {
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
  applyFacelets();
}

// 초기 렌더
applyFacelets();
