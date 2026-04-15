// ─── 큐브 상태 ─────────────────────────────────────────────────────────────
let facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
let moveCount = 0;

function setMoveCount(n) {
  moveCount = n;
  document.getElementById('moves').textContent = 'Moves: ' + moveCount;
}

// ─── 단일 무브 적용 ────────────────────────────────────────────────────────
function applyMove(name) {
  console.log(`[ACTIONS] applyMove("${name}") called. Current moveCount: ${moveCount}`);
  const f = [...facelets];
  if (!name || (!MOVES[name[0]])) {
    console.error(`[ACTIONS] Invalid move name: ${name}`);
    return;
  }
  applyMoveInPlace(name, f);
  facelets = f;
  setMoveCount(moveCount + 1);
  applyFacelets();
  console.log(`[ACTIONS] applyMove("${name}") finished.`);
}

// ─── 셔플 ──────────────────────────────────────────────────────────────────
function shuffleCube() {
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  let last = '';
  for (let i = 0; i < 20; i++) {
    const candidates = ALL_MOVES.filter(m => m[0] !== last[0]);
    const m = candidates[Math.floor(Math.random() * candidates.length)];
    applyMoveInPlace(m, facelets);
    last = m;
  }
  setMoveCount(0);
  applyFacelets();
}

// ─── 리셋 ──────────────────────────────────────────────────────────────────
function resetCube() {
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
  applyFacelets();
}

// 초기 렌더
applyFacelets();
