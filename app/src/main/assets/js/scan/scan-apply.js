function applyScannedFacelets(scanned) {
  const validation = validateFacelets(scanned);
  if (!validation.ok) return validation;

  facelets = scanned.slice();
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
