// ─── 솔브 히스토리 + 통계 (ST-005 / ST-100) ──────────────────────────────
// 스토리지 키: solve_history = JSON 배열 [{t, m, d, s}, ...]
// t=timeMs, m=moves, d=Date.now(), s=usedSolver(bool)
// 최대 1000건 유지 (오래된 것부터 제거)

const HISTORY_KEY = 'solve_history';
const HISTORY_CAP = 1000;

function recordSolve(timeMs, moves, solverUsed) {
  const history = getSolveHistory();
  history.push({ t: timeMs, m: moves, d: Date.now(), s: !!solverUsed });
  if (history.length > HISTORY_CAP) history.splice(0, history.length - HISTORY_CAP);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
}

function getSolveHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) { return []; }
}

// 시간 포맷 — scoring.js의 _updateTimer와 동일 규칙
function _fmtTime(ms) {
  const sec = ms / 1000;
  return sec < 60
    ? sec.toFixed(2) + 's'
    : Math.floor(sec / 60) + ':' + (sec % 60).toFixed(2).padStart(5, '0');
}

// WCA trimmed mean: 최근 n개에서 최고·최저 각 1개 제외 후 평균
// 반환: 평균(ms) 또는 null (데이터 부족)
function _averageOf(sortedAsc, n) {
  if (sortedAsc.length < n) return null;
  const slice = sortedAsc.slice(-n);
  slice.sort(function(a, b) { return a - b; });
  let sum = 0;
  for (let i = 1; i < slice.length - 1; i++) sum += slice[i];
  return sum / (slice.length - 2);
}

// 통계 계산 — 솔버 미사용 솔브(s:false)만 집계
// 반환: {totalCount, count, best, worst, mean, ao5, ao12, ao100}
// 숫자 값은 ms, null이면 데이터 부족
function computeStats() {
  const all = getSolveHistory();
  const legit = all.filter(function(e) { return !e.s; });
  const times = legit.map(function(e) { return e.t; });

  const totalCount = all.length;
  const count = legit.length;
  if (count === 0) {
    return { totalCount: totalCount, count: 0, best: null, worst: null, mean: null, ao5: null, ao12: null, ao100: null };
  }

  const sorted = times.slice().sort(function(a, b) { return a - b; });
  const best  = sorted[0];
  const worst = sorted[sorted.length - 1];
  const mean  = times.reduce(function(s, t) { return s + t; }, 0) / count;

  return {
    totalCount: totalCount,
    count:  count,
    best:   best,
    worst:  worst,
    mean:   mean,
    ao5:    _averageOf(times, 5),
    ao12:   _averageOf(times, 12),
    ao100:  _averageOf(times, 100),
  };
}

function fmtStat(ms) {
  return ms === null ? '—' : _fmtTime(ms);
}
