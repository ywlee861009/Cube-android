// palette 는 classifyFacelets() 의 세션 팔레트([[r,g,b] × 6]). 생략하면 기본색을 쓴다.
// 검증에 실패하면 facelets 도 팔레트도 건드리지 않는다 — 둘은 원자적으로 함께 바뀐다.
function applyScannedFacelets(scanned, palette) {
  const validation = validateFacelets(scanned);
  if (!validation.ok) return validation;

  facelets = scanned.slice();
  if (palette) setActiveFaceColors(palette);
  else resetActiveFaceColors();
  applyFacelets();
  clearHistory();
  setMoveCount(0);
  solveStartTime = null;
  manualMoveCount = 0;
  usedSolver = false;
  stopTimer();
  isScanSolve = true;
  _solveAdRequired = !!window.AndroidBridge;
  resetSolution();
  window.AndroidBridge?.onScannedStateApplied?.();
  document.getElementById('btn-shuffle').disabled = false;
  document.getElementById('btn-solve').disabled = false;
  document.getElementById('btn-scan').disabled = false;
  setStatus('스캔한 큐브를 적용했어요.');
  return { ok: true };
}

if (typeof module !== 'undefined') {
  module.exports = { applyScannedFacelets };
}
