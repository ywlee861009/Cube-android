// ─── 통계 대시보드 오버레이 (ST-100) ─────────────────────────────────────

const statsDialog = document.getElementById('stats-overlay');

function openDashboard() {
  if (statsDialog.open || isShuffling || isSolving || isUndoRedo || isScanning || isGuidedSolve ||
      animRafId !== null || layerGroup !== null) return;
  _renderDashboard();
  statsDialog.classList.remove('hidden');
  statsDialog.showModal();
  document.getElementById('stats-content').scrollTop = 0;
  pauseRendering();
}

function closeDashboard() {
  if (!statsDialog.open) return;
  statsDialog.close();
  statsDialog.classList.add('hidden');
  resumeRendering();
}

function _renderDashboard() {
  const stats = computeStats();
  const history = getSolveHistory();
  const hasHistory = history.length > 0;
  document.getElementById('stats-grid').hidden = !hasHistory;
  document.getElementById('ds-history').hidden = !hasHistory;
  document.getElementById('ds-empty').hidden = hasHistory;

  // 통계 그리드 값 채우기
  _setText('ds-solves', stats.totalCount);
  _setText('ds-best',   fmtStat(stats.best));
  _setText('ds-ao5',    fmtStat(stats.ao5));
  _setText('ds-ao12',   fmtStat(stats.ao12));
  _setText('ds-ao100',  fmtStat(stats.ao100));
  _setText('ds-mean',   fmtStat(stats.mean));

  _renderSparkline(history);
  _renderHistory(history);
}

function _setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

// 최근 최대 15개 솔브 타임을 막대 스파크라인으로 표시
function _renderSparkline(history) {
  const container = document.getElementById('ds-sparkline');
  const times = history.filter(entry => !entry.s).slice(-15).map(entry => entry.t);
  document.getElementById('ds-sparkline-wrap').hidden = times.length < 2;
  container.replaceChildren();
  if (times.length < 2) return;

  const minTime = Math.min(...times);
  const range = Math.max(...times) - minTime || 1;

  for (const time of times) {
    const percent = 20 + Math.round(((time - minTime) / range) * 75);
    const bar = document.createElement('div');
    bar.className = 'ds-bar';
    bar.style.height = percent + '%';
    container.appendChild(bar);
  }
}

// 최근 20개 솔브 리스트
function _renderHistory(history) {
  const list = document.getElementById('ds-history-list');
  list.replaceChildren();

  for (const entry of history.slice(-20).reverse()) {
    const row = document.createElement('li');
    row.className = 'ds-row';

    const timeEl = document.createElement('span');
    timeEl.className = 'ds-row-time';
    timeEl.textContent = fmtStat(entry.t);

    const movesEl = document.createElement('span');
    movesEl.className = 'ds-row-moves';
    movesEl.textContent = t('{count} moves', { count: entry.m });

    row.append(timeEl, movesEl);
    if (entry.s) {
      const tag = document.createElement('span');
      tag.className = 'ds-row-tag';
      tag.textContent = t('Solver');
      row.appendChild(tag);
    }
    list.appendChild(row);
  }
}

// 배경 탭 → 닫기
statsDialog.addEventListener('click', function(e) {
  if (e.target === this) closeDashboard();
});
statsDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDashboard();
});
