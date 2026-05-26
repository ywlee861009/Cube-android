// ─── 통계 대시보드 오버레이 (ST-100) ─────────────────────────────────────

function openDashboard() {
  _renderDashboard();
  document.getElementById('stats-overlay').classList.remove('hidden');
  pauseRendering();
}

function closeDashboard() {
  document.getElementById('stats-overlay').classList.add('hidden');
  resumeRendering();
}

function _renderDashboard() {
  const stats = computeStats();

  // 통계 그리드 값 채우기
  _setText('ds-solves', stats.totalCount);
  _setText('ds-best',   fmtStat(stats.best));
  _setText('ds-ao5',    fmtStat(stats.ao5));
  _setText('ds-ao12',   fmtStat(stats.ao12));
  _setText('ds-ao100',  fmtStat(stats.ao100));
  _setText('ds-mean',   fmtStat(stats.mean));

  _renderSparkline(stats);
  _renderHistory();
}

function _setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

// 최근 최대 15개 솔브 타임을 막대 스파크라인으로 표시
function _renderSparkline(stats) {
  var container = document.getElementById('ds-sparkline');
  if (!container) return;
  container.innerHTML = '';

  var all = getSolveHistory();
  var legit = all.filter(function(e) { return !e.s; }).slice(-15);
  if (legit.length < 2) {
    container.innerHTML = '<span class="ds-spark-empty">Need more solves</span>';
    return;
  }

  var times = legit.map(function(e) { return e.t; });
  var minT  = Math.min.apply(null, times);
  var maxT  = Math.max.apply(null, times);
  var range = maxT - minT || 1;

  times.forEach(function(t) {
    var pct = 20 + Math.round(((t - minT) / range) * 75); // 20%~95% height
    var bar = document.createElement('div');
    bar.className = 'ds-bar';
    bar.style.height = pct + '%';
    container.appendChild(bar);
  });
}

// 최근 20개 솔브 리스트
function _renderHistory() {
  var list = document.getElementById('ds-history-list');
  if (!list) return;
  list.innerHTML = '';

  var all = getSolveHistory();
  if (all.length === 0) {
    list.innerHTML = '<div class="ds-empty">No solves yet</div>';
    return;
  }

  var recent = all.slice(-20).reverse();
  recent.forEach(function(entry, i) {
    var row = document.createElement('div');
    row.className = 'ds-row' + (entry.s ? ' ds-row-solver' : '');

    var numEl = document.createElement('span');
    numEl.className = 'ds-row-num';
    numEl.textContent = all.length - i;

    var timeEl = document.createElement('span');
    timeEl.className = 'ds-row-time';
    timeEl.textContent = fmtStat(entry.t);

    var movesEl = document.createElement('span');
    movesEl.className = 'ds-row-moves';
    movesEl.textContent = entry.m + ' moves';

    var tagEl = document.createElement('span');
    tagEl.className = 'ds-row-tag';
    tagEl.textContent = entry.s ? 'solver' : '';

    row.appendChild(numEl);
    row.appendChild(timeEl);
    row.appendChild(movesEl);
    row.appendChild(tagEl);
    list.appendChild(row);
  });
}

// 배경 탭 → 닫기
document.getElementById('stats-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeDashboard();
});
