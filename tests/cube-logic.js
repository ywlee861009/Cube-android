// ─── Node.js 테스트용 큐브 로직 래퍼 ────────────────────────────────────────
// 브라우저 JS(logic.js, history.js, stats.js)의 순수 함수를 재-export.
// 원본 파일은 전역 스코프에 선언되므로, 여기서 동일 코드를 module.exports로 감싼다.

// ─── logic.js 로직 ──────────────────────────────────────────────────────────

function repeat(n, fn) { for (let i = 0; i < n; i++) fn(); }

function rotateFaceCW(f, faceIndex) {
  const o = faceIndex * 9;
  let tmp = f[o];
  f[o]   = f[o+6]; f[o+6] = f[o+8];
  f[o+8] = f[o+2]; f[o+2] = tmp;
  let tmp2 = f[o+1];
  f[o+1] = f[o+3]; f[o+3] = f[o+7];
  f[o+7] = f[o+5]; f[o+5] = tmp2;
}

function cycle4(f, a0,a1,a2, b0,b1,b2, c0,c1,c2, d0,d1,d2) {
  const t0=f[a0], t1=f[a1], t2=f[a2];
  f[a0]=f[d0]; f[a1]=f[d1]; f[a2]=f[d2];
  f[d0]=f[c0]; f[d1]=f[c1]; f[d2]=f[c2];
  f[c0]=f[b0]; f[c1]=f[b1]; f[c2]=f[b2];
  f[b0]=t0;    f[b1]=t1;    f[b2]=t2;
}

const MOVES = {
  U: f => { rotateFaceCW(f,0); cycle4(f, 18,19,20, 36,37,38, 45,46,47, 9,10,11); },
  R: f => { rotateFaceCW(f,1); cycle4(f, 2,5,8, 51,48,45, 29,32,35, 20,23,26); },
  F: f => { rotateFaceCW(f,2); cycle4(f, 6,7,8, 9,12,15, 29,28,27, 44,41,38); },
  D: f => { rotateFaceCW(f,3); cycle4(f, 24,25,26, 15,16,17, 51,52,53, 42,43,44); },
  L: f => { rotateFaceCW(f,4); cycle4(f, 0,3,6, 18,21,24, 27,30,33, 53,50,47); },
  B: f => { rotateFaceCW(f,5); cycle4(f, 2,1,0, 36,39,42, 33,34,35, 17,14,11); },
  E: f => { cycle4(f, 21,22,23, 12,13,14, 48,49,50, 39,40,41); },
  M: f => { cycle4(f,  1, 4, 7, 19,22,25, 28,31,34, 52,49,46); },
  S: f => { cycle4(f,  3, 4, 5, 10,13,16, 32,31,30, 43,40,37); },
};

const ALL_MOVES = ['U',"U'","U2",'R',"R'","R2",'F',"F'","F2",'D',"D'","D2",'L',"L'","L2",'B',"B'",'B2'];

function applyMoveInPlace(name, f) {
  if (!name) return;
  const base = name[0];
  if (!MOVES[base]) return;
  if (name.endsWith("'")) {
    repeat(3, () => MOVES[base](f));
  } else if (name.endsWith('2')) {
    repeat(2, () => MOVES[base](f));
  } else {
    if (!MOVES[name]) return;
    MOVES[name](f);
  }
}

// ─── actions.js 로직 ────────────────────────────────────────────────────────

function solvedFacelets() {
  return Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
}

function isCubeSolved(facelets) {
  for (let f = 0; f < 6; f++) {
    const base = facelets[f * 9];
    for (let i = 1; i < 9; i++) {
      if (facelets[f * 9 + i] !== base) return false;
    }
  }
  return true;
}

// ─── history.js 로직 ────────────────────────────────────────────────────────

function inverseMoveOf(name) {
  if (name.endsWith("2")) return name;
  return name.endsWith("'") ? name.slice(0, -1) : name + "'";
}

// ─── stats.js 로직 ──────────────────────────────────────────────────────────

function _fmtTime(ms) {
  const sec = ms / 1000;
  return sec < 60
    ? sec.toFixed(2) + 's'
    : Math.floor(sec / 60) + ':' + (sec % 60).toFixed(2).padStart(5, '0');
}

function _averageOf(times, n) {
  if (times.length < n) return null;
  const slice = times.slice(-n);
  slice.sort(function(a, b) { return a - b; });
  let sum = 0;
  for (let i = 1; i < slice.length - 1; i++) sum += slice[i];
  return sum / (slice.length - 2);
}

function computeStats(history) {
  const legit = history.filter(function(e) { return !e.s; });
  const times = legit.map(function(e) { return e.t; });

  const totalCount = history.length;
  const count = legit.length;
  if (count === 0) {
    return { totalCount, count: 0, best: null, worst: null, mean: null, ao5: null, ao12: null, ao100: null };
  }

  const sorted = times.slice().sort(function(a, b) { return a - b; });
  const best  = sorted[0];
  const worst = sorted[sorted.length - 1];
  const mean  = times.reduce(function(s, t) { return s + t; }, 0) / count;

  return { totalCount, count, best, worst, mean, ao5: _averageOf(times, 5), ao12: _averageOf(times, 12), ao100: _averageOf(times, 100) };
}

function fmtStat(ms) {
  return ms === null ? '—' : _fmtTime(ms);
}

module.exports = {
  // logic
  rotateFaceCW, cycle4, MOVES, ALL_MOVES, applyMoveInPlace,
  // actions
  solvedFacelets, isCubeSolved,
  // history
  inverseMoveOf,
  // stats
  _fmtTime, _averageOf, computeStats, fmtStat,
};
