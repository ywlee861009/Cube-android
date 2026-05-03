// ─── 축하 오버레이 + 축포 ──────────────────────────────────────────────────

// Worker+OffscreenCanvas는 Android WebView file:// 보안정책으로 실패 → GPU 충돌 유발.
// useWorker:false로 메인스레드 2D 캔버스만 사용.
const _confetti = confetti.create(null, { useWorker: false, resize: true });

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
  pauseRendering();
  _spawnConfetti();
}

function dismissSolvedOverlay() {
  document.getElementById('solved-overlay').classList.add('hidden');
  _confetti.reset();
  resumeRendering();
}

function playAgain() {
  dismissSolvedOverlay();
  shuffleCube();
}

function _spawnConfetti() {
  const colors = ['#ffffff', '#ff3333', '#22cc55', '#ffdd00', '#ff8800', '#3388ff'];
  const opts = { colors: colors, scalar: 1.1, zIndex: 102 };

  _confetti(Object.assign({ particleCount: 80, spread: 70, origin: { y: 0.55 } }, opts));

  setTimeout(function () {
    _confetti(Object.assign({ particleCount: 45, angle: 60,  spread: 58, origin: { x: 0,   y: 0.6 } }, opts));
    _confetti(Object.assign({ particleCount: 45, angle: 120, spread: 58, origin: { x: 1,   y: 0.6 } }, opts));
  }, 180);
}

// 오버레이 배경 탭 → 닫기 (카드 내부 탭 제외)
document.getElementById('solved-overlay').addEventListener('click', function(e) {
  if (e.target === this) dismissSolvedOverlay();
});
