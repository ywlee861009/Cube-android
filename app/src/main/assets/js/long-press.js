// ─── 셔플 버튼 롱프레스 → 리셋 ─────────────────────────────────────────────
(function () {
  var LONG_PRESS_MS = 600;
  var btn = document.getElementById('btn-shuffle');
  var timer = null;
  var triggered = false;

  function startLongPress(e) {
    triggered = false;
    timer = setTimeout(function () {
      triggered = true;
      btn.classList.add('long-press-active');
      setTimeout(function () { btn.classList.remove('long-press-active'); }, 200);
      resetCube();
    }, LONG_PRESS_MS);
  }

  function cancelLongPress() {
    clearTimeout(timer);
    timer = null;
  }

  btn.addEventListener('touchstart', startLongPress, { passive: true });
  btn.addEventListener('touchend', cancelLongPress);
  btn.addEventListener('touchcancel', cancelLongPress);
  btn.addEventListener('touchmove', cancelLongPress, { passive: true });

  // Prevent normal click firing after long-press triggered
  btn.addEventListener('click', function (e) {
    if (triggered) { e.stopImmediatePropagation(); triggered = false; }
  }, true);
})();
