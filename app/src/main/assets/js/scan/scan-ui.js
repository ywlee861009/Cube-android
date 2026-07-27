const SCAN_FACE_GUIDE = [
  { face: 'U', color: '흰색', top: 'B', topColor: '파랑' },
  { face: 'R', color: '빨강', top: 'U', topColor: '흰색' },
  { face: 'F', color: '초록', top: 'U', topColor: '흰색' },
  { face: 'D', color: '노랑', top: 'F', topColor: '초록' },
  { face: 'L', color: '주황', top: 'U', topColor: '흰색' },
  { face: 'B', color: '파랑', top: 'U', topColor: '흰색' }
];

let currentScanFace = 0;
let pendingScanResult = null;

function startScanFlow() {
  if (isShuffling || isSolving || isUndoRedo || isScanning) return;
  if (!window.AndroidBridge?.startScan) {
    setStatus('카메라 스캔은 Android 앱에서 사용할 수 있어요.');
    return;
  }
  isScanning = true;
  currentScanFace = 0;
  pendingScanResult = null;
  clearScanSamples();
  document.body.classList.add('scan-active');
  document.getElementById('scan-overlay').classList.remove('hidden');
  pauseRendering();
  applyNativeScanGuideRect();
  renderScanStep();
  window.AndroidBridge.startScan();
}

function onScanReady() {
  if (!isScanning) return;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
}

function onScanCancelled(reason) {
  if (!isScanning) return;
  finishScanUi();
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
  captureScanFace(currentScanFace);
}

function retakePreviousScanFace() {
  if (!isScanning || currentScanFace <= 0) return;
  currentScanFace--;
  clearScanFace(currentScanFace);
  renderScanStep();
  setScanMessage('이전 면을 다시 촬영하세요.');
}

function cancelScanFlow() {
  if (!isScanning) return;
  window.AndroidBridge?.stopScan?.();
  clearScanSamples();
  finishScanUi();
  setStatus('스캔을 취소했어요.');
}

window.addEventListener('scan-face-sampled', event => {
  if (!isScanning || event.detail.faceIndex !== currentScanFace) return;
  renderRgbPreview(event.detail.samples);
  if (currentScanFace === 5) {
    const allSamples = getCollectedScanSamples();
    pendingScanResult = classifyFacelets(allSamples);
    pendingScanResult.validation = validateFacelets(pendingScanResult.facelets);
    window.AndroidBridge?.stopScan?.();
    finishScanUi();
    window.dispatchEvent(new CustomEvent('scan-classified', { detail: pendingScanResult }));
    if (typeof openScanReview === 'function') {
      openScanReview(pendingScanResult);
    } else {
      setStatus('6면 촬영을 완료했어요.');
    }
    return;
  }
  setTimeout(() => {
    if (!isScanning) return;
    currentScanFace++;
    renderScanStep();
  }, 350);
});

window.addEventListener('scan-face-sample-failed', event => {
  if (!isScanning || event.detail.faceIndex !== currentScanFace) return;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage(
    event.detail.reason === 'frame_unavailable'
      ? '카메라 준비가 끝나면 다시 촬영해 주세요.'
      : '색을 읽지 못했어요. 다시 촬영해 주세요.'
  );
});

function renderScanStep() {
  const guide = SCAN_FACE_GUIDE[currentScanFace];
  document.getElementById('scan-progress').textContent =
    `${currentScanFace + 1} / 6 — ${guide.color} 면 (${guide.face})`;
  document.getElementById('scan-direction').textContent =
    `${guide.topColor} 면(${guide.top})이 위로 오게 들어주세요`;
  document.getElementById('scan-top-face').textContent = `${guide.top} ↑`;
  document.getElementById('scan-mini-face').textContent = guide.face;
  document.getElementById('scan-rgb-preview').replaceChildren();
  document.getElementById('btn-scan-previous').disabled = currentScanFace === 0;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
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
