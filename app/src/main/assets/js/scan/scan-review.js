const SCAN_FACE_NAMES = ['흰색', '빨강', '초록', '노랑', '주황', '파랑'];
const SCAN_FACE_LETTERS = ['U', 'R', 'F', 'D', 'L', 'B'];
const SCAN_CENTER_INDICES = new Set([4, 13, 22, 31, 40, 49]);
const SCAN_LOW_CONFIDENCE = 0.35;
const SCAN_NET_ORIGINS = [
  [3, 0], [6, 3], [3, 3], [3, 6], [0, 3], [9, 3]
];

let reviewFacelets = null;
let reviewConfidence = null;
let reviewValidation = null;
let selectedReviewIndex = 0;
let selectedReviewFace = 0;

function openScanReview(result) {
  reviewFacelets = result.facelets.slice();
  reviewConfidence = result.confidence.slice();
  reviewValidation = validateFacelets(reviewFacelets);
  selectedReviewFace = 0;
  selectedReviewIndex = 0;
  document.getElementById('scan-review-overlay').classList.remove('hidden');
  renderScanReview();
}

function renderScanReview() {
  if (!reviewFacelets) return;
  reviewValidation = validateFacelets(reviewFacelets);
  renderScanNet();
  renderScanFaceEditor();
  renderScanPalette();

  const uncertain = reviewConfidence.filter(value => value < SCAN_LOW_CONFIDENCE).length;
  document.getElementById('scan-review-badge').textContent =
    `확인이 필요한 칸 ${uncertain}개`;
  const message = document.getElementById('scan-validation-message');
  message.textContent = reviewValidation.ok
    ? '큐브 상태가 올바릅니다. Solve를 시작할 수 있어요.'
    : reviewValidation.message;
  message.classList.toggle('valid', reviewValidation.ok);
  document.getElementById('btn-scan-apply').disabled = !reviewValidation.ok;
}

function renderScanNet() {
  const net = document.getElementById('scan-net');
  net.replaceChildren();
  for (let face = 0; face < 6; face++) {
    const [originColumn, originRow] = SCAN_NET_ORIGINS[face];
    for (let position = 0; position < 9; position++) {
      const index = face * 9 + position;
      const cell = document.createElement('button');
      cell.className = reviewCellClasses('scan-net-cell', index);
      cell.style.background = FACE_COLORS[reviewFacelets[index]];
      cell.style.gridColumn = originColumn + (position % 3) + 1;
      cell.style.gridRow = originRow + Math.floor(position / 3) + 1;
      cell.setAttribute('aria-label', `${SCAN_FACE_NAMES[face]} 면 ${position + 1}번 칸`);
      cell.onclick = () => selectReviewCell(index);
      net.appendChild(cell);
    }
  }
}

function renderScanFaceEditor() {
  document.getElementById('scan-face-editor-title').textContent =
    `${SCAN_FACE_NAMES[selectedReviewFace]} 면 (${SCAN_FACE_LETTERS[selectedReviewFace]})`;
  const editor = document.getElementById('scan-face-editor');
  editor.replaceChildren();
  for (let position = 0; position < 9; position++) {
    const index = selectedReviewFace * 9 + position;
    const cell = document.createElement('button');
    cell.className = reviewCellClasses('scan-edit-cell', index);
    cell.style.background = FACE_COLORS[reviewFacelets[index]];
    cell.textContent = SCAN_FACE_LETTERS[reviewFacelets[index]];
    cell.disabled = SCAN_CENTER_INDICES.has(index);
    cell.onclick = () => selectReviewCell(index);
    editor.appendChild(cell);
  }
}

function renderScanPalette() {
  const palette = document.getElementById('scan-palette');
  palette.replaceChildren(...FACE_COLORS.map((color, face) => {
    const button = document.createElement('button');
    button.className = 'scan-palette-color';
    button.style.background = color;
    button.textContent = SCAN_FACE_LETTERS[face];
    button.disabled = SCAN_CENTER_INDICES.has(selectedReviewIndex);
    button.onclick = () => setReviewCellColor(face);
    return button;
  }));
}

function reviewCellClasses(base, index) {
  const classes = [base];
  if (reviewConfidence[index] < SCAN_LOW_CONFIDENCE) classes.push('low-confidence');
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
  if (SCAN_CENTER_INDICES.has(selectedReviewIndex)) return;
  reviewFacelets[selectedReviewIndex] = color;
  reviewConfidence[selectedReviewIndex] = 1;
  renderScanReview();
}

function restartScanFromReview() {
  closeScanReview();
  startScanFlow();
}

function cancelScanReview() {
  closeScanReview();
  pendingScanResult = null;
  setStatus('스캔 결과를 적용하지 않았어요.');
}

function confirmScanReview() {
  reviewValidation = validateFacelets(reviewFacelets);
  if (!reviewValidation.ok) {
    renderScanReview();
    return;
  }
  if (typeof applyScannedFacelets === 'function') {
    const result = applyScannedFacelets(reviewFacelets);
    if (!result.ok) {
      document.getElementById('scan-validation-message').textContent = result.message;
      return;
    }
    closeScanReview();
  } else {
    pendingScanResult = {
      facelets: reviewFacelets.slice(),
      confidence: reviewConfidence.slice(),
      validation: reviewValidation
    };
    setStatus('스캔 상태 적용 기능을 준비하고 있어요.');
  }
}

function closeScanReview() {
  document.getElementById('scan-review-overlay').classList.add('hidden');
  reviewFacelets = null;
  reviewConfidence = null;
  reviewValidation = null;
}
