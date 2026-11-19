const SCAN_DRAFT_KEY = 'cubie-physical-cube-v1';
const MAX_SAVED_GUIDE_MOVES = 100;
let savedScan = loadSavedScan();

function loadSavedScan() {
  try {
    return validateSavedScan(JSON.parse(localStorage.getItem(SCAN_DRAFT_KEY)));
  } catch (_) {
    return null;
  }
}

function validateSavedScan(draft) {
  if (draft?.kind === 'capture' || draft?.kind === 'review') {
    const { samples, overrides } = draft;
    if (!Array.isArray(samples) || samples.length !== 6 || !samples.some(isScanRgbFace) ||
        !samples.every(face => face === null || isScanRgbFace(face))) return null;
    const kind = samples.includes(null) ? 'capture' : 'review';
    const colors = Array.isArray(overrides) ? overrides.filter(isSavedScanOverride) : [];
    return { kind, samples, overrides: colors };
  }
  if (draft?.kind !== 'guide' || !validateFacelets(draft.facelets).ok ||
      !isSavedScanPalette(draft.palette)) return null;

  const { facelets: position, palette, moves, index } = draft;
  if (!isSavedGuidePlan(position, moves, index)) {
    return { kind: 'guide', facelets: position, palette, moves: null, index: 0 };
  }
  return { kind: 'guide', facelets: position, palette, moves, index };
}

function isSavedScanOverride(entry) {
  return Array.isArray(entry) && entry.length === 2 && entry.every(Number.isInteger) &&
    entry[0] >= 0 && entry[0] < 54 && !SCAN_CENTER_INDICES.has(entry[0]) &&
    entry[1] >= 0 && entry[1] < 6;
}

function isSavedScanPalette(palette) {
  return Array.isArray(palette) && palette.length === 6 && palette.every(color => {
    if (typeof color !== 'string') return false;
    if (/^#[0-9a-f]{6}$/i.test(color)) return true;
    const channels = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/.exec(color);
    return channels !== null && channels.slice(1).every(channel => Number(channel) <= 255);
  });
}

function isSavedGuidePlan(position, moves, index) {
  if (!Array.isArray(moves) || moves.length > MAX_SAVED_GUIDE_MOVES ||
      !Number.isInteger(index) || index < 0 || index >= moves.length ||
      !moves.every(move => typeof move === 'string' &&
        Object.prototype.hasOwnProperty.call(MOVE_ANIM_MAP, move))) return false;

  const projected = position.slice();
  moves.slice(index).forEach(move => applyMoveInPlace(move, projected));
  return projected.every((color, i) => color === projected[i - i % 9]);
}

function writeSavedScan(draft) {
  savedScan = draft;
  try {
    if (draft) localStorage.setItem(SCAN_DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(SCAN_DRAFT_KEY);
  } catch (_) {
    // Continue in memory if the device cannot write local storage.
  }
  refreshScanResumeControls();
}

function hasSavedScan() {
  return savedScan !== null;
}

function refreshScanResumeControls() {
  const row = document.getElementById('scan-resume-controls');
  if (!row) return;
  row.hidden = !savedScan || isChallengeActive();
  if (row.hidden) return;
  const labels = {
    capture: 'Resume scan',
    review: 'Review saved scan',
    guide: 'Resume cube guide'
  };
  document.getElementById('btn-scan-resume').textContent = t(labels[savedScan.kind]);
}

function saveCapturedScanProgress() {
  if (!scanFaceSamples.some(face => face !== null)) return;
  writeSavedScan({
    kind: scanFaceSamples.includes(null) ? 'capture' : 'review',
    samples: scanFaceSamples.slice(),
    overrides: [...scanManualOverrides]
  });
}

function saveScanGuideProgress(replaceCapture = false) {
  if (!isScanSolve || (!replaceCapture && savedScan && savedScan.kind !== 'guide')) return;
  if (isCubeSolved()) {
    writeSavedScan(null);
    return;
  }
  writeSavedScan({
    kind: 'guide',
    facelets: facelets.slice(),
    palette: activeFaceColors.slice(),
    moves: solutionMoves?.slice() ?? null,
    index: solutionIndex
  });
}

function resumeSavedScan() {
  if (!savedScan || !canOpenScanFlow()) return false;
  const draft = savedScan;
  if (draft.kind === 'guide') {
    if (!isScanSolve && typeof saveFreePlaySession === 'function') saveFreePlaySession();
    const result = applyScannedFacelets(draft.facelets, draft.palette);
    if (!result.ok) return false;
    solutionMoves = draft.moves;
    solutionIndex = draft.index;
    solveCube();
    return true;
  }

  clearScanSamples();
  draft.samples.forEach((face, slot) => { scanFaceSamples[slot] = face; });
  clearScanManualOverrides();
  draft.overrides.forEach(([index, color]) => { scanManualOverrides.set(index, color); });
  if (draft.kind === 'review') {
    reviewCapturedScan();
    return true;
  }

  if (!beginScanSession()) return false;
  pendingScanResult = null;
  scanRetakeSlot = null;
  currentScanStep = SCAN_STEPS.findIndex(step => scanFaceSamples[step.slot] === null);
  startScanCamera(true);
  return true;
}

function discardSavedScan() {
  if (!savedScan || !canOpenScanFlow()) return;
  if (savedScan.kind === 'guide' && isScanSolve) {
    resetCube({ preserveFreePlay: true });
    restoreFreePlaySession();
  }
  writeSavedScan(null);
  clearScanSamples();
  clearScanManualOverrides();
  pendingScanResult = null;
  setStatus('Saved cube setup discarded.');
}

document.addEventListener('DOMContentLoaded', refreshScanResumeControls);
