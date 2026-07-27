const SCAN_FACE_LABELS = ['U', 'R', 'F', 'D', 'L', 'B'];
const SCAN_CENTER_INDICES = new Set([4, 13, 22, 31, 40, 49]);
const SCAN_LOW_CONFIDENCE = 0.35;
const SCAN_NET_ORIGINS = [
  [3, 0], [6, 3], [3, 3], [3, 6], [0, 3], [9, 3]
];
const SCAN_WARNING_TEXT = {
  SIMILAR_CENTERS: '두 면의 색이 카메라에서 거의 같게 보여요. 표시된 칸을 직접 확인해 주세요.',
  CENTER_OVEREXPOSED: '반사광으로 여러 면이 하얗게 날아갔어요. 각도를 바꿔 다시 촬영하세요.',
  LOW_LIGHT: '전체적으로 어두워요. 더 밝은 곳에서 다시 촬영하면 정확도가 올라갑니다.'
};

let reviewFacelets = null;
let reviewConfidence = null;
let reviewValidation = null;
// 스캔 세션의 실제 센터 색. 전개도·편집기·팔레트·3D 큐브가 모두 이 값을 쓴다.
let reviewPalette = null;
let reviewWarnings = [];
let reviewSimilarFaces = new Set();
let selectedReviewIndex = 0;
let selectedReviewFace = 0;

function openScanReview(result) {
  reviewFacelets = result.facelets.slice();
  reviewConfidence = result.confidence.slice();
  reviewPalette = (result.palette || []).map(rgb => rgb.slice());
  reviewWarnings = result.warnings ? result.warnings.slice() : [];
  reviewSimilarFaces = new Set(
    reviewWarnings
      .filter(warning => warning.code === 'SIMILAR_CENTERS')
      .flatMap(warning => warning.faces)
  );
  reviewValidation = validateFacelets(reviewFacelets);
  selectedReviewFace = 0;
  selectedReviewIndex = 0;
  // 3D 큐브의 팔레트는 건드리지 않는다. 스캔 facelets 가 아직 적용되지 않았으므로
  // 지금 팔레트만 바꾸면 "이전 상태를 새 색으로 칠한" 화면이 되어 오히려 헷갈린다.
  // 검토 UI 는 activeFaceColors 대신 reviewFaceColor() 로 직접 그린다.
  document.getElementById('scan-review-overlay').classList.remove('hidden');
  renderScanReview();
}

function reviewFaceColor(face) {
  if (reviewPalette && reviewPalette.length === 6) {
    return `rgb(${reviewPalette[face].join(',')})`;
  }
  return FACE_COLORS[face];
}

function renderScanReview() {
  if (!reviewFacelets) return;
  reviewValidation = validateFacelets(reviewFacelets);
  renderScanNet();
  renderScanFaceEditor();
  renderScanPalette();
  renderScanWarnings();

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

function renderScanWarnings() {
  const container = document.getElementById('scan-warnings');
  if (!container) return;
  container.replaceChildren(...reviewWarnings.map(warning => {
    const row = document.createElement('div');
    row.className = 'scan-warning';
    const faces = warning.faces && warning.faces.length
      ? ` (${warning.faces.map(face => SCAN_FACE_LABELS[face]).join(' / ')})`
      : '';
    row.textContent = `${SCAN_WARNING_TEXT[warning.code] || warning.code}${faces}`;
    return row;
  }));
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
      cell.style.background = reviewFaceColor(reviewFacelets[index]);
      cell.style.gridColumn = originColumn + (position % 3) + 1;
      cell.style.gridRow = originRow + Math.floor(position / 3) + 1;
      cell.setAttribute(
        'aria-label',
        `${SCAN_FACE_LABELS[face]} 면 ${position + 1}번 칸, 현재 ${SCAN_FACE_LABELS[reviewFacelets[index]]}`
      );
      cell.onclick = () => selectReviewCell(index);
      net.appendChild(cell);
    }
  }
}

function renderScanFaceEditor() {
  document.getElementById('scan-face-editor-title').textContent =
    `${SCAN_FACE_LABELS[selectedReviewFace]} 면`;
  const editor = document.getElementById('scan-face-editor');
  editor.replaceChildren();
  for (let position = 0; position < 9; position++) {
    const index = selectedReviewFace * 9 + position;
    const cell = document.createElement('button');
    cell.className = reviewCellClasses('scan-edit-cell', index);
    cell.style.background = reviewFaceColor(reviewFacelets[index]);
    cell.textContent = SCAN_FACE_LABELS[reviewFacelets[index]];
    cell.disabled = SCAN_CENTER_INDICES.has(index);
    cell.onclick = () => selectReviewCell(index);
    editor.appendChild(cell);
  }
  const retake = document.getElementById('btn-scan-retake-face');
  if (retake) {
    retake.textContent = `${SCAN_FACE_LABELS[selectedReviewFace]} 면 다시 촬영`;
    retake.disabled = typeof startScanFaceRetake !== 'function';
  }
}

function renderScanPalette() {
  const palette = document.getElementById('scan-palette');
  palette.replaceChildren(...SCAN_FACE_LABELS.map((label, face) => {
    const button = document.createElement('button');
    button.className = 'scan-palette-color';
    // 유사색은 색만으로 구분되지 않으므로 점선 테두리로 한 번 더 표시한다.
    if (reviewSimilarFaces.has(face)) button.classList.add('similar');
    button.style.background = reviewFaceColor(face);
    button.textContent = label;
    button.disabled = SCAN_CENTER_INDICES.has(selectedReviewIndex);
    button.onclick = () => setReviewCellColor(face);
    return button;
  }));
}

function reviewCellClasses(base, index) {
  const classes = [base];
  if (reviewConfidence[index] < SCAN_LOW_CONFIDENCE) classes.push('low-confidence');
  if (reviewSimilarFaces.has(reviewFacelets[index])) classes.push('similar');
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

// 센터 색은 직접 편집할 수 없다 — 센터가 곧 팔레트의 정의라서 편집하면 정합이 깨진다.
// 대신 그 면만 다시 촬영해 팔레트를 통째로 갱신한다.
// 카메라 시작에 실패하면 검토 화면을 그대로 둔다 — 먼저 닫으면 돌아갈 곳이 없어진다.
function retakeSelectedScanFace() {
  if (typeof startScanFaceRetake !== 'function') return;
  if (startScanFaceRetake(selectedReviewFace)) hideScanReviewOverlay();
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
    const palette = reviewPalette && reviewPalette.length === 6 ? reviewPalette : null;
    const result = applyScannedFacelets(reviewFacelets, palette);
    if (!result.ok) {
      document.getElementById('scan-validation-message').textContent = result.message;
      return;
    }
    hideScanReviewOverlay();
    clearScanReviewState();
    solveCube();
  } else {
    pendingScanResult = {
      facelets: reviewFacelets.slice(),
      confidence: reviewConfidence.slice(),
      palette: reviewPalette,
      validation: reviewValidation
    };
    setStatus('스캔 상태 적용 기능을 준비하고 있어요.');
  }
}

function hideScanReviewOverlay() {
  document.getElementById('scan-review-overlay').classList.add('hidden');
}

function clearScanReviewState() {
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
