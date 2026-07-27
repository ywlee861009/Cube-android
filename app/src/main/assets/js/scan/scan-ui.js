// 촬영 순서는 scan-orientation.js 가 회전으로 계산한다. 색 이름을 쓰지 않는다.
// 촬영 순서(step)와 내부 면 인덱스(slot)는 서로 다르다 — 슬롯 순서는 [0, 2, 3, 1, 5, 4] 다.
// 둘을 혼동하면 "검증은 통과하는데 실물과 다른 큐브"가 되어 조용히 틀린다.
const SCAN_STEPS = buildScanSequence();

let currentScanStep = 0;
let pendingScanResult = null;
// null 이 아니면 "그 면 하나만 다시 촬영" 모드다. 검토 화면에서 진입한다.
let scanRetakeSlot = null;

function currentScanSlot() {
  return SCAN_STEPS[currentScanStep].slot;
}

function startScanFlow() {
  if (!beginScanSession()) return;
  currentScanStep = 0;
  scanRetakeSlot = null;
  pendingScanResult = null;
  clearScanSamples();
  renderScanStep();
  window.AndroidBridge.startScan();
}

// 센터 색이 잘못 읽히면 팔레트 전체가 틀어지는데 센터는 직접 편집할 수 없다.
// 그 면만 다시 찍어 팔레트를 갱신하는 유일한 복구 경로다.
function startScanFaceRetake(slot) {
  if (!beginScanSession()) return false;
  scanRetakeSlot = slot;
  currentScanStep = SCAN_STEPS.findIndex(step => step.slot === slot);
  renderScanStep();
  setScanMessage('이 면만 다시 촬영합니다. 안내한 방향으로 맞춰 주세요.');
  window.AndroidBridge.startScan();
  return true;
}

function beginScanSession() {
  if (isShuffling || isSolving || isUndoRedo || isScanning) return false;
  if (!window.AndroidBridge?.startScan) {
    setStatus('카메라 스캔은 Android 앱에서 사용할 수 있어요.');
    return false;
  }
  isScanning = true;
  document.body.classList.add('scan-active');
  document.getElementById('scan-overlay').classList.remove('hidden');
  pauseRendering();
  return true;
}

function onScanReady() {
  if (!isScanning) return;
  applyNativeScanGuideRect();
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
}

function onScanCancelled(reason) {
  if (!isScanning) return;
  const wasRetake = scanRetakeSlot !== null;
  scanRetakeSlot = null;
  finishScanUi();
  // 재촬영 중 권한·카메라 문제로 취소되면 기존 6면 결과를 살려 검토로 되돌린다.
  if (wasRetake && pendingScanResult && typeof openScanReview === 'function') {
    openScanReview(pendingScanResult);
  }
  const messages = {
    permission_denied: '카메라 권한이 거부됐어요.',
    permission_permanently_denied: '설정에서 카메라 권한을 허용해 주세요.',
    camera_unavailable: '사용 가능한 카메라가 없어요.',
    camera_error: '카메라를 시작하지 못했어요.',
    back_pressed: '스캔을 취소했어요.',
    app_update_active: '업데이트가 끝난 뒤 다시 시도해 주세요.'
  };
  setStatus(messages[reason] || '스캔을 취소했어요.');
}

function captureCurrentScanFace() {
  if (!isScanning) return;
  document.getElementById('btn-scan-capture').disabled = true;
  setScanMessage('색을 읽고 있어요…');
  captureScanFace(currentScanSlot());
}

function retakePreviousScanFace() {
  if (!isScanning || currentScanStep <= 0) return;
  const undoOps = invertScanOps(SCAN_STEPS[currentScanStep].ops);
  currentScanStep--;
  clearScanFace(currentScanSlot());
  renderScanStep(undoOps.map(op => SCAN_ROTATION_HINTS[op]));
  setScanMessage('한 단계 되돌렸어요. 안내대로 큐브를 되돌린 뒤 촬영하세요.');
}

function cancelScanFlow() {
  if (!isScanning) return;
  window.AndroidBridge?.stopScan?.();
  // 면 단위 재촬영을 취소하면 기존 6면 샘플을 버리지 않고 검토 화면으로 되돌아간다.
  if (scanRetakeSlot !== null) {
    scanRetakeSlot = null;
    finishScanUi();
    if (pendingScanResult) openScanReview(pendingScanResult);
    return;
  }
  clearScanSamples();
  finishScanUi();
  setStatus('스캔을 취소했어요.');
}

window.addEventListener('scan-face-sampled', event => {
  if (!isScanning || event.detail.faceIndex !== currentScanSlot()) return;
  renderRgbPreview(event.detail.samples);
  if (scanRetakeSlot !== null || currentScanStep === SCAN_STEPS.length - 1) {
    finalizeScanCapture();
    return;
  }
  setTimeout(() => {
    if (!isScanning) return;
    currentScanStep++;
    renderScanStep();
  }, 350);
});

// 6면이 모두 모이면 분류한다. 재촬영이면 한 면만 교체된 상태로 전체를 다시 분류하므로
// 팔레트도 함께 갱신된다 — 수동 수정 내용은 의도적으로 폐기된다.
function finalizeScanCapture() {
  const allSamples = getCollectedScanSamples();
  window.AndroidBridge?.stopScan?.();
  const wasRetake = scanRetakeSlot !== null;
  scanRetakeSlot = null;
  finishScanUi();
  if (!allSamples) {
    setStatus('촬영되지 않은 면이 있어요. 처음부터 다시 스캔해 주세요.');
    return;
  }
  pendingScanResult = classifyFacelets(allSamples);
  pendingScanResult.validation = validateFacelets(pendingScanResult.facelets);
  window.dispatchEvent(new CustomEvent('scan-classified', { detail: pendingScanResult }));
  if (typeof openScanReview === 'function') {
    openScanReview(pendingScanResult);
    if (wasRetake) setStatus('다시 촬영한 면으로 색을 새로 판정했어요.');
  } else {
    setStatus('6면 촬영을 완료했어요.');
  }
}

window.addEventListener('scan-face-sample-failed', event => {
  if (!isScanning || event.detail.faceIndex !== currentScanSlot()) return;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage(
    event.detail.reason === 'frame_unavailable'
      ? '카메라 준비가 끝나면 다시 촬영해 주세요.'
      : '색을 읽지 못했어요. 다시 촬영해 주세요.'
  );
});

function renderScanStep(overrideHints) {
  const step = SCAN_STEPS[currentScanStep];
  const retaking = scanRetakeSlot !== null;
  document.getElementById('scan-progress').textContent = retaking
    ? `${step.faceLabel.long} 다시 촬영`
    : `${currentScanStep + 1} / ${SCAN_STEPS.length} — ${step.faceLabel.long}`;
  document.getElementById('scan-direction').textContent =
    currentScanStep === 0 && !retaking ? '' : `${step.topLabel.long}이 위로 오게 들어주세요`;
  renderScanRotationHints(overrideHints || step.hints);
  document.getElementById('scan-top-face').textContent = `${step.topLabel.short} ↑`;
  document.getElementById('scan-mini-face').textContent = step.faceLabel.short;
  document.getElementById('scan-rgb-preview').replaceChildren();
  // 재촬영 모드에는 "이전 면"이 없다 — 누르면 엉뚱한 슬롯을 지운다.
  document.getElementById('btn-scan-previous').disabled = retaking || currentScanStep === 0;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
}

// 복합 회전(스텝 4)은 칩 2개로 순서를 나눠 보여준다.
function renderScanRotationHints(hints) {
  const container = document.getElementById('scan-rotation');
  container.replaceChildren(...hints.map((hint, index) => {
    const chip = document.createElement('div');
    chip.className = 'scan-rotation-step';
    const glyph = document.createElement('span');
    glyph.className = 'scan-rotation-glyph';
    glyph.textContent = hint.glyph;
    const text = document.createElement('span');
    text.textContent = hints.length > 1 ? `${index + 1}. ${hint.text}` : hint.text;
    chip.append(glyph, text);
    return chip;
  }));
}

function renderRgbPreview(samples) {
  const container = document.getElementById('scan-rgb-preview');
  container.replaceChildren(...samples.map(rgb => {
    const cell = document.createElement('div');
    cell.className = 'scan-rgb-cell';
    cell.style.background = `rgb(${rgb.join(',')})`;
    return cell;
  }));
}

function applyNativeScanGuideRect() {
  if (!window.AndroidBridge?.getScanGuideRect) return;
  try {
    const rect = JSON.parse(window.AndroidBridge.getScanGuideRect());
    const guide = document.getElementById('scan-guide');
    guide.style.left = `${rect.left * 100}%`;
    guide.style.top = `${rect.top * 100}%`;
    guide.style.width = `${(rect.right - rect.left) * 100}%`;
    guide.style.height = `${(rect.bottom - rect.top) * 100}%`;
    guide.style.transform = 'none';
  } catch (_) {
    setScanMessage('가이드 좌표를 불러오지 못했어요.');
  }
}

function finishScanUi() {
  isScanning = false;
  document.body.classList.remove('scan-active');
  document.getElementById('scan-overlay').classList.add('hidden');
  resumeRendering();
  updateUndoRedoButtons();
}

function setScanMessage(message) {
  document.getElementById('scan-message').textContent = message;
}
