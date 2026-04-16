// ─── 큐브 상태 ─────────────────────────────────────────────────────────────
let facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
let moveCount = 0;
let isSolving = false;

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

// ─── 솔브 ──────────────────────────────────────────────────────────────────
let solutionMoves = null;  // 계산된 솔루션 배열 (null이면 비활성)
let solutionIndex = 0;     // 다음에 실행할 수 인덱스

function setStatus(msg) {
  document.getElementById('moves').textContent = msg;
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
}

async function solveCube() {
  if (isShuffling || isSolving) return;

  // 솔루션이 이미 계산된 경우 → 다음 한 수 실행
  if (solutionMoves !== null) {
    stepSolution();
    return;
  }

  // 솔루션 새로 계산
  try {
    const solver = SolverFactory.create();
    if (!solver.isReady()) {
      setStatus('Solver loading...');
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

// 솔루션을 한 수씩 실행
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

// ─── 리셋 ──────────────────────────────────────────────────────────────────
function resetCube() {
  if (isSolving) return;
  resetSolution();
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  setMoveCount(0);
  applyFacelets();
  document.getElementById('btn-shuffle').disabled = false;
  document.getElementById('btn-reset').disabled   = false;
}

// 초기 렌더
applyFacelets();
