const MANUAL_COLOR_NAMES = ['White', 'Red', 'Green', 'Yellow', 'Orange', 'Blue'];
const MANUAL_COLOR_SYMBOLS = ['W', 'R', 'G', 'Y', 'O', 'B'];
const MANUAL_STICKER_ORDER = [4, 0, 1, 2, 3, 5, 6, 7, 8];
let manualScanColors = null;

function isManualScanReview() {
  return manualScanColors !== null;
}

function startManualScanFlow() {
  if (!canOpenScanFlow()) return false;
  if (hasSavedScan()) {
    setStatus('Resume or discard your saved cube setup first.');
    return false;
  }
  openManualScanReview(Array(54).fill(null));
  return true;
}

function openManualScanReview(colors) {
  clearScanReviewState();
  manualScanColors = colors.slice();
  const step = SCAN_STEPS.find(({ slot }) => nextBlankManualSticker(slot) !== undefined) ?? SCAN_STEPS[0];
  selectedReviewFace = step.slot;
  selectedReviewIndex = nextBlankManualSticker(step.slot) ?? step.slot * 9 + 4;
  showScanReview();
}

function nextBlankManualSticker(face) {
  return MANUAL_STICKER_ORDER
    .map(position => face * 9 + position)
    .find(index => manualScanColors[index] === null);
}

function nextManualScanFace() {
  const position = SCAN_STEPS.findIndex(step => step.slot === selectedReviewFace);
  return SCAN_STEPS.slice(position + 1).concat(SCAN_STEPS.slice(0, position))
    .find(({ slot }) => nextBlankManualSticker(slot) !== undefined);
}

function advanceManualScanFace() {
  const next = nextManualScanFace();
  if (next) selectReviewCell(nextBlankManualSticker(next.slot));
}

function setManualStickerColor(color) {
  const index = selectedReviewIndex;
  const wasBlank = manualScanColors[index] === null;
  manualScanColors[index] = color;
  if (wasBlank) selectedReviewIndex = nextBlankManualSticker(selectedReviewFace) ?? index;
  writeSavedScan({ kind: 'manual', colors: manualScanColors.slice() });
  const restorePaletteFocus = document.getElementById('scan-palette').contains(document.activeElement);
  renderScanReview();
  if (restorePaletteFocus) document.getElementById('scan-palette').children[color]?.focus();
}

function getManualScanInput(colors) {
  const centers = Array.from({ length: 6 }, (_, face) => colors[face * 9 + 4]);
  const duplicates = centers.flatMap((color, face) => (
    color !== null && centers.indexOf(color) !== centers.lastIndexOf(color) ? [face * 9 + 4] : []
  ));
  if (duplicates.length) {
    const validation = validationFailure('CENTER_DUPLICATE', 'All six center colors must be different.', duplicates);
    return { validation };
  }
  if (colors.includes(null)) return { validation: validationFailure('INCOMPLETE', '', []) };

  const facelets = colors.map(color => centers.indexOf(color));
  const palette = centers.map(color => FACE_COLORS[color]);
  const validation = validateFacelets(facelets);
  return { validation, facelets, palette, centers };
}

function renderManualScanSummary(input) {
  const orientation = document.getElementById('scan-manual-orientation');
  const step = SCAN_STEPS.find(({ slot }) => slot === selectedReviewFace);
  const topSlot = SCAN_FACE_LABELS.indexOf(step.up);
  const frontColor = manualScanColors[selectedReviewFace * 9 + 4];
  const topColor = manualScanColors[topSlot * 9 + 4];
  const face = frontColor === null ? t(step.faceLabel.long) : t(MANUAL_COLOR_NAMES[frontColor]);
  const top = topColor === null ? t(step.topLabel.long) : t(MANUAL_COLOR_NAMES[topColor]);
  orientation.textContent = step.step === 0 && topColor === null
    ? t('Pick a starting face. Keep track of which edge is on top.')
    : t('Hold {face} in front and {top} on top.', { face, top });
  document.getElementById('scan-review-badge').textContent =
    t('{count}/54 stickers entered', { count: manualScanColors.filter(color => color !== null).length });

  if (input.validation.code === 'INCOMPLETE') {
    if (SCAN_CENTER_INDICES.has(selectedReviewIndex)) return t('Choose the center sticker color.');
    if (nextBlankManualSticker(selectedReviewFace) === undefined) {
      return t('This face is filled. Continue to the next face.');
    }
    return t('Choose a color for sticker {index}.', { index: selectedReviewIndex % 9 + 1 });
  }
  if (input.validation.code === 'COLOR_COUNT') {
    const counts = input.validation.counts.map((count, face) =>
      `${t(MANUAL_COLOR_NAMES[input.centers[face]])} ${count}`
    ).join(', ');
    return t('Each color needs nine stickers. Counts: {counts}', { counts });
  }
  return input.validation.ok ? t('The cube state is valid. You can start solving.')
    : localizedValidationMessage(input.validation);
}
