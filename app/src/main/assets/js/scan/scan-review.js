const SCAN_FACE_LABELS = ['U', 'R', 'F', 'D', 'L', 'B'];
const SCAN_CENTER_INDICES = new Set([4, 13, 22, 31, 40, 49]);
const SCAN_LOW_CONFIDENCE = 0.35;
const SCAN_WARNING_TEXT = {
  SIMILAR_CENTERS: '두 면의 색이 카메라에서 거의 같게 보여요. 표시된 칸을 직접 확인해 주세요.',
  CENTER_OVEREXPOSED: '반사광으로 여러 면이 하얗게 날아갔어요. 각도를 바꿔 다시 촬영하세요.',
  LOW_LIGHT: '전체적으로 어두워요. 더 밝은 곳에서 다시 촬영하면 정확도가 올라갑니다.'
};

const SCAN_REPEATED_FAILURE_THRESHOLD = 2;

let reviewFacelets = null;
let reviewConfidence = null;
let reviewValidation = null;
// 스캔 세션의 실제 센터 색. 면 미리보기·편집기·팔레트·3D 큐브가 모두 이 값을 쓴다.
let reviewPalette = null;
let reviewWarnings = [];
let reviewSimilarFaces = new Set();
let reviewLowLight = false;
let selectedReviewIndex = 0;
let selectedReviewFace = 0;
// 6면 스캔을 마쳤으나 검증에 실패한 횟수(수동 수정 전 기준). 반복 실패 시 재스캔을 강하게 유도한다.
let scanFailedAttempts = 0;
// 확인 화면에서 손으로 고친 칸 (index → color). 마지막 면 재촬영 후에도 다시 적용한다.
const scanManualOverrides = new Map();

function openScanReview(result) {
  manualScanColors = null;
  reviewFacelets = result.facelets.slice();
  reviewConfidence = result.confidence.slice();
  reviewPalette = (result.palette || []).map(rgb => rgb.slice());
  reviewWarnings = result.warnings ? result.warnings.slice() : [];
  reviewSimilarFaces = new Set(
    reviewWarnings
      .filter(warning => warning.code === 'SIMILAR_CENTERS')
      .flatMap(warning => warning.faces)
  );
  // LOW_LIGHT 경고 배너가 이미 떠 있으면 검증 메시지에 같은 내용을 덧붙이지 않는다.
  reviewLowLight = !!result.lowLight &&
    !reviewWarnings.some(warning => warning.code === 'LOW_LIGHT');
  reviewValidation = validateFacelets(reviewFacelets);
  scanFailedAttempts = reviewValidation.ok ? 0 : scanFailedAttempts + 1;
  scanManualOverrides.forEach((color, index) => {
    reviewFacelets[index] = color;
    reviewConfidence[index] = 1;
  });
  reviewValidation = validateFacelets(reviewFacelets);
  selectedReviewIndex = firstStickerToCheck(0, reviewFacelets.length);
  selectedReviewFace = Math.floor(selectedReviewIndex / 9);
  // 3D 큐브의 팔레트는 건드리지 않는다. 스캔 facelets 가 아직 적용되지 않았으므로
  // 지금 팔레트만 바꾸면 "이전 상태를 새 색으로 칠한" 화면이 되어 오히려 헷갈린다.
  // 검토 UI 는 activeFaceColors 대신 reviewFaceColor() 로 직접 그린다.
  showScanReview();
}

function showScanReview() {
  const dialog = document.getElementById('scan-review-overlay');
  dialog.classList.remove('hidden');
  renderScanReview();
  if (!dialog.open) dialog.showModal();
}

function reviewFaceColor(face) {
  if (reviewPalette && reviewPalette.length === 6) {
    return `rgb(${reviewPalette[face].join(',')})`;
  }
  return FACE_COLORS[face];
}

function reviewFaceLabel(face) {
  return SCAN_STEPS.find(({ slot }) => slot === face)?.faceLabel;
}

function reviewStickerBackground(index) {
  if (!isManualScanReview()) return reviewFaceColor(reviewFacelets[index]);
  const color = manualScanColors[index];
  return color === null ? '' : FACE_COLORS[color];
}

function firstStickerToCheck(start, end) {
  const canEdit = index => index >= start && index < end && !SCAN_CENTER_INDICES.has(index);
  const invalid = reviewValidation.badIndices?.find(canEdit);
  if (invalid !== undefined) return invalid;
  const uncertain = reviewConfidence.findIndex((value, index) => canEdit(index) && value < SCAN_LOW_CONFIDENCE);
  return uncertain < 0 ? start : uncertain;
}

function renderScanReview() {
  const manual = isManualScanReview();
  if (!manual && !reviewFacelets) return;
  const input = manual ? getManualScanInput(manualScanColors) : null;
  reviewValidation = input?.validation ?? validateFacelets(reviewFacelets);
  document.getElementById('scan-review-card').classList.toggle('scan-review-manual', manual);
  document.getElementById('scan-review-title').textContent = t(manual ? 'Enter cube colors' : 'Review scan');
  document.getElementById('scan-manual-orientation').hidden = !manual;
  document.getElementById('btn-scan-again').hidden = manual;
  renderScanFacePreviews();
  renderScanFaceEditor();
  renderScanPalette();
  renderScanWarnings();

  const message = document.getElementById('scan-validation-message');
  message.textContent = manual ? renderManualScanSummary(input) : renderCapturedScanSummary();
  message.classList.toggle('valid', reviewValidation.ok);
  message.classList.toggle('invalid', !reviewValidation.ok && reviewValidation.code !== 'INCOMPLETE');
  const apply = document.getElementById('btn-scan-apply');
  apply.hidden = manual && !document.getElementById('btn-scan-retake-face').hidden;
  apply.disabled = !reviewValidation.ok;
}

function renderCapturedScanSummary() {
  const uncertain = reviewConfidence.filter(value => value < SCAN_LOW_CONFIDENCE).length;
  const status = document.getElementById('scan-review-badge');
  status.hidden = uncertain === 0;
  status.textContent = uncertain > 0 ? t('Stickers to check: {count}', { count: uncertain }) : '';
  if (reviewValidation.ok) return t('The cube state is valid. You can start solving.');
  if (scanFailedAttempts >= SCAN_REPEATED_FAILURE_THRESHOLD) {
    return t('Several scans failed. Scan slowly in a brighter place.');
  }
  const validationText = localizedValidationMessage(reviewValidation);
  return reviewLowLight ? t('{message} (Low light)', { message: validationText }) : validationText;
}

function renderScanWarnings() {
  const container = document.getElementById('scan-warnings');
  if (!container) return;
  container.replaceChildren(...reviewWarnings.map(warning => {
    const row = document.createElement('div');
    row.className = 'scan-warning';
    const faces = warning.faces && warning.faces.length
      ? ` (${warning.faces.map(face => t(reviewFaceLabel(face).short)).join(' / ')})`
      : '';
    row.textContent = `${t(SCAN_WARNING_TEXT[warning.code] || warning.code)}${faces}`;
    return row;
  }));
}

function renderScanFacePreviews() {
  const faces = document.getElementById('scan-net');
  faces.replaceChildren(...SCAN_STEPS.map(({ slot, step, faceLabel }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scan-face-preview';
    button.setAttribute('aria-pressed', slot === selectedReviewFace);
    button.setAttribute('aria-label', t(faceLabel.long));
    const preview = document.createElement('span');
    preview.className = 'scan-face-preview-grid';
    preview.setAttribute('aria-hidden', 'true');
    for (let position = 0; position < 9; position++) {
      const index = slot * 9 + position;
      const cell = document.createElement('span');
      cell.className = reviewCellClasses('scan-net-cell', index);
      cell.style.background = reviewStickerBackground(index);
      preview.appendChild(cell);
    }
    const name = document.createElement('span');
    name.textContent = t(faceLabel.short);
    button.appendChild(preview);
    button.appendChild(name);
    button.onclick = () => {
      if (selectedReviewFace === slot) return;
      const start = slot * 9;
      const nextSticker = isManualScanReview() ? nextBlankManualSticker(slot) ?? start + 4
        : firstStickerToCheck(start, start + 9);
      selectReviewCell(nextSticker);
      faces.children[step]?.focus();
    };
    return button;
  }));
}

function renderScanFaceEditor() {
  const manual = isManualScanReview();
  document.getElementById('scan-face-editor-title').textContent = t(reviewFaceLabel(selectedReviewFace).long);
  const editor = document.getElementById('scan-face-editor');
  editor.replaceChildren();
  for (let position = 0; position < 9; position++) {
    const index = selectedReviewFace * 9 + position;
    const cell = createReviewCell('scan-edit-cell', index);
    cell.textContent = manual ? (MANUAL_COLOR_SYMBOLS[manualScanColors[index]] ?? '–')
      : SCAN_FACE_LABELS[reviewFacelets[index]];
    cell.disabled = !manual && SCAN_CENTER_INDICES.has(index);
    editor.appendChild(cell);
  }
  const retake = document.getElementById('btn-scan-retake-face');
  if (retake) {
    retake.textContent = t(manual ? 'Next face' : 'Retake this face');
    retake.hidden = manual && !nextManualScanFace();
    retake.disabled = manual ? nextBlankManualSticker(selectedReviewFace) !== undefined
      : typeof startScanFaceRetake !== 'function';
  }
}

function createReviewCell(className, index) {
  const manual = isManualScanReview();
  const cell = document.createElement('button');
  const color = manual ? manualScanColors[index] : reviewFacelets[index];
  const face = Math.floor(index / 9);
  const faceLabel = t(reviewFaceLabel(face).long);
  const colorLabel = manual ? (color === null ? t('Unassigned') : t(MANUAL_COLOR_NAMES[color]))
    : t(reviewFaceLabel(color)?.long ?? 'Unassigned');
  cell.type = 'button';
  cell.className = reviewCellClasses(className, index);
  cell.style.background = reviewStickerBackground(index);
  cell.setAttribute('aria-pressed', index === selectedReviewIndex);
  cell.setAttribute('aria-label', t('{face}, sticker {index}, current color {color}', {
    face: faceLabel, index: index % 9 + 1, color: colorLabel
  }));
  cell.onclick = () => {
    const parent = cell.parentElement;
    const position = Array.prototype.indexOf.call(parent.children, cell);
    selectReviewCell(index);
    parent.children[position]?.focus();
  };
  return cell;
}

function renderScanPalette() {
  const manual = isManualScanReview();
  const palette = document.getElementById('scan-palette');
  palette.replaceChildren(...SCAN_FACE_LABELS.map((label, face) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scan-palette-color';
    // 유사색은 색만으로 구분되지 않으므로 점선 테두리로 한 번 더 표시한다.
    if (reviewSimilarFaces.has(face)) button.classList.add('similar');
    button.style.background = manual ? FACE_COLORS[face] : reviewFaceColor(face);
    button.textContent = manual ? MANUAL_COLOR_SYMBOLS[face] : label;
    button.setAttribute('aria-label', t(manual ? MANUAL_COLOR_NAMES[face] : reviewFaceLabel(face).long));
    button.disabled = !manual && SCAN_CENTER_INDICES.has(selectedReviewIndex);
    button.onclick = () => setReviewCellColor(face);
    return button;
  }));
}

function reviewCellClasses(base, index) {
  const classes = [base];
  if (isManualScanReview()) {
    if (manualScanColors[index] === null) classes.push('unfilled');
  } else {
    if (reviewConfidence[index] < SCAN_LOW_CONFIDENCE) classes.push('low-confidence');
    if (reviewSimilarFaces.has(reviewFacelets[index])) classes.push('similar');
  }
  if (!reviewValidation.ok && reviewValidation.badIndices.includes(index)) classes.push('invalid');
  if (index === selectedReviewIndex) classes.push('selected');
  return classes.join(' ');
}

function selectReviewCell(index) {
  selectedReviewIndex = index;
  selectedReviewFace = Math.floor(index / 9);
  renderScanReview();
}

function setReviewCellColor(color) {
  const palette = document.getElementById('scan-palette');
  const restorePaletteFocus = palette.contains(document.activeElement);
  if (isManualScanReview()) {
    setManualStickerColor(color);
  } else {
    if (SCAN_CENTER_INDICES.has(selectedReviewIndex)) return;
    reviewFacelets[selectedReviewIndex] = color;
    reviewConfidence[selectedReviewIndex] = 1;
    scanManualOverrides.set(selectedReviewIndex, color);
    saveCapturedScanProgress();
    renderScanReview();
  }
  if (restorePaletteFocus) palette.children[color]?.focus();
}

// 센터 색은 직접 편집할 수 없다 — 센터가 곧 팔레트의 정의라서 편집하면 정합이 깨진다.
// 대신 그 면만 다시 촬영해 팔레트를 통째로 갱신한다.
// 카메라 시작에 실패하면 검토 화면을 그대로 둔다 — 먼저 닫으면 돌아갈 곳이 없어진다.
function retakeSelectedScanFace() {
  if (isManualScanReview()) {
    advanceManualScanFace();
    return;
  }
  if (typeof startScanFaceRetake !== 'function') return;
  if (startScanFaceRetake(selectedReviewFace)) hideScanReviewOverlay();
}

function restartScanFromReview() {
  closeScanReview();
  writeSavedScan(null);
  startScanFlow();
}

function backFromScanReview() {
  cancelScanReview();
}

function dropScanManualOverridesForFace(face) {
  [...scanManualOverrides.keys()]
    .filter(index => Math.floor(index / 9) === face)
    .forEach(index => scanManualOverrides.delete(index));
}

function clearScanManualOverrides() {
  scanManualOverrides.clear();
}

function cancelScanReview() {
  closeScanReview();
  pendingScanResult = null;
  setStatus(hasSavedScan() ? 'Cube setup saved.' : 'Scan discarded.');
}

function confirmScanReview() {
  const input = isManualScanReview() ? getManualScanInput(manualScanColors) : {
    validation: validateFacelets(reviewFacelets),
    facelets: reviewFacelets,
    palette: reviewPalette?.length === 6 ? reviewPalette : null
  };
  reviewValidation = input.validation;
  if (!reviewValidation.ok) {
    renderScanReview();
    return;
  }
  if (typeof applyScannedFacelets === 'function') {
    if (!isScanSolve && typeof saveFreePlaySession === 'function') saveFreePlaySession();
    const result = applyScannedFacelets(input.facelets, input.palette);
    if (!result.ok) {
      document.getElementById('scan-validation-message').textContent = localizedValidationMessage(result);
      return;
    }
    saveScanGuideProgress(true);
    scanFailedAttempts = 0;
    clearScanManualOverrides();
    closeScanReview();
    solveCube();
  } else {
    pendingScanResult = {
      facelets: input.facelets.slice(),
      confidence: reviewConfidence?.slice() ?? Array(54).fill(1),
      palette: input.palette,
      validation: reviewValidation
    };
    setStatus('스캔 상태 적용 기능을 준비하고 있어요.');
  }
}

function hideScanReviewOverlay() {
  const dialog = document.getElementById('scan-review-overlay');
  dialog.close();
  dialog.classList.add('hidden');
}

function clearScanReviewState() {
  manualScanColors = null;
  reviewFacelets = null;
  reviewConfidence = null;
  reviewValidation = null;
  reviewPalette = null;
  reviewWarnings = [];
  reviewSimilarFaces = new Set();
}

// 검토 취소는 아무것도 바꾸지 않는다. 3D 큐브의 facelets 도 팔레트도 그대로 둔다
// (직전 스캔으로 이미 적용된 팔레트가 있다면 그것도 유지된다).
function closeScanReview() {
  hideScanReviewOverlay();
  clearScanReviewState();
}

document.getElementById('scan-review-overlay').addEventListener('cancel', event => {
  event.preventDefault();
  cancelScanReview();
});
