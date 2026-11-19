const FREE_PLAY_SESSION_KEY = 'cubie-free-play-v1';

function clearFreePlaySession() {
  try { localStorage.removeItem(FREE_PLAY_SESSION_KEY); }
  catch (_) { /* Play remains available when storage is restricted. */ }
}

function saveFreePlaySession() {
  if (isChallengeActive() || isScanSolve || isScanning || isShuffling || isSolving || isUndoRedo) return;
  if (isCubeSolved()) {
    clearFreePlaySession();
    return;
  }

  const saved = {
    facelets,
    moveCount,
    manualMoveCount,
    elapsedMs: solveStartTime === null ? null : Math.max(0, Date.now() - solveStartTime),
    usedSolver,
    undo: undoStack,
    redo: redoStack,
    rotation: cubieGroup.quaternion.toArray(),
    camDist,
  };
  try { localStorage.setItem(FREE_PLAY_SESSION_KEY, JSON.stringify(saved)); }
  catch (_) { /* Keep the current session active when storage is full. */ }
}

function restoreFreePlaySession() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(FREE_PLAY_SESSION_KEY)); }
  catch (_) { clearFreePlaySession(); }
  if (!saved) return false;

  const isCount = count => Number.isSafeInteger(count) && count >= 0;
  const validHistory = stack => Array.isArray(stack) && stack.every(entry =>
    entry && isCount(entry.moveCount) && Object.prototype.hasOwnProperty.call(MOVE_ANIM_MAP, entry.moveName));
  const rotationLength = Array.isArray(saved.rotation) && saved.rotation.length === 4 &&
    saved.rotation.every(Number.isFinite) ? Math.hypot(...saved.rotation) : 0;
  if (!validateFacelets(saved.facelets).ok || !isCount(saved.moveCount) || !isCount(saved.manualMoveCount) ||
      !(saved.elapsedMs === null || isCount(saved.elapsedMs)) || typeof saved.usedSolver !== 'boolean' ||
      !validHistory(saved.undo) || !validHistory(saved.redo) || !rotationLength || !Number.isFinite(rotationLength) ||
      !Number.isFinite(saved.camDist)) {
    clearFreePlaySession();
    return false;
  }

  facelets = saved.facelets;
  manualMoveCount = saved.manualMoveCount;
  solveStartTime = saved.elapsedMs === null ? null : Date.now() - saved.elapsedMs;
  usedSolver = saved.usedSolver;
  undoStack.push(...saved.undo);
  redoStack.push(...saved.redo);
  cubieGroup.quaternion.fromArray(saved.rotation).normalize();
  camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, saved.camDist));
  updateCamera();
  setMoveCount(saved.moveCount);
  updateUndoRedoButtons();
  if (solveStartTime !== null) startTimer();
  applyFacelets();
  return true;
}

window.addEventListener('pagehide', saveFreePlaySession);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveFreePlaySession();
});
