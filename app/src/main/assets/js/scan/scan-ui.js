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

// 미니 큐브 가이드. 색 이름을 전제하지 않으므로 기본 배색을 칠하지 않는다.
// 아직 안 찍은 면은 회색, 지금 찍을 면은 밝게, 찍은 면은 실제 촬영한 센터 색으로 칠한다.
let scan3DScene, scan3DCamera, scan3DRenderer, scan3DCube;
let scan3DAnimationId = null;

// BoxGeometry 재질 순서는 +x,-x,+y,-y,+z,-z = R,L,U,D,F,B 다. 슬롯(U,R,F,D,L,B) → 재질 인덱스.
const SCAN_SLOT_TO_MATERIAL_INDEX = [2, 0, 4, 3, 1, 5];
const SCAN_GUIDE_PENDING_COLOR = 0x8a8f98;
const SCAN_GUIDE_TARGET_COLOR = 0xffffff;

function updateScanCubeMaterials() {
  if (!scan3DCube) return;
  const targetSlot = currentScanSlot();
  for (let slot = 0; slot < 6; slot++) {
    const mat = scan3DCube.material[SCAN_SLOT_TO_MATERIAL_INDEX[slot]];
    const center = scanFaceSamples[slot] && scanFaceSamples[slot][4];
    mat.transparent = true;
    mat.emissive.setHex(0x000000);
    if (slot === targetSlot) {
      mat.color.setHex(SCAN_GUIDE_TARGET_COLOR);
      mat.opacity = 1.0;
      mat.emissive.copy(mat.color).multiplyScalar(0.2);
    } else if (center) {
      mat.color.setRGB(center[0] / 255, center[1] / 255, center[2] / 255);
      mat.opacity = 0.85;
    } else {
      mat.color.setHex(SCAN_GUIDE_PENDING_COLOR);
      mat.opacity = 0.4;
    }
  }
}

// 슬롯별로 그 면이 정면, 방향 규약의 면이 위쪽에 오는 자세 (U^B, R^U, F^U, D^F, L^U, B^U).
const SCAN_BASE_ROTATIONS = [
  [Math.PI/2, 0, 0],   // U
  [0, -Math.PI/2, 0],  // R
  [0, 0, 0],           // F
  [-Math.PI/2, 0, 0],  // D
  [0, Math.PI/2, 0],   // L
  [0, Math.PI, 0]      // B
];
let scanCubeAnimId = null;
let scanStartQuat = null;
let scanTargetQuat = null;
let scanAnimStartTime = 0;

function animateScanCubeTransition(slot) {
  if (!scan3DCube) return;
  if (scanCubeAnimId !== null) {
    cancelAnimationFrame(scanCubeAnimId);
    scanCubeAnimId = null;
  }
  if (!scanStartQuat) scanStartQuat = new THREE.Quaternion();
  if (!scanTargetQuat) scanTargetQuat = new THREE.Quaternion();
  
  scanStartQuat.copy(scan3DCube.quaternion);
  const [rx, ry, rz] = SCAN_BASE_ROTATIONS[slot];
  scanTargetQuat.setFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ'));
  scanAnimStartTime = performance.now();
  
  const DURATION = 600;
  function step(now) {
    let t = (now - scanAnimStartTime) / DURATION;
    if (t > 1) t = 1;
    const eased = 1 - Math.pow(1 - t, 3);
    scan3DCube.quaternion.slerpQuaternions(scanStartQuat, scanTargetQuat, eased);
    if (t < 1) {
      scanCubeAnimId = requestAnimationFrame(step);
    } else {
      scanCubeAnimId = null;
    }
  }
  scanCubeAnimId = requestAnimationFrame(step);
}

function initScan3DGuide() {
  const container = document.getElementById('scan-3d-guide');
  if (!container || scan3DRenderer) return;

  scan3DScene = new THREE.Scene();
  scan3DCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  scan3DCamera.position.set(0, 0, 5);

  scan3DRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  scan3DRenderer.setPixelRatio(window.devicePixelRatio);
  scan3DRenderer.setSize(100, 100);
  container.appendChild(scan3DRenderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scan3DScene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(10, 20, 10);
  scan3DScene.add(dirLight);

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const materials = Array.from({ length: 6 }, () =>
    new THREE.MeshStandardMaterial({ color: SCAN_GUIDE_PENDING_COLOR })
  );

  scan3DCube = new THREE.Mesh(geometry, materials);
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
  scan3DCube.add(line);
  scan3DScene.add(scan3DCube);

  // Isometric-ish view for the scene so the cube shows multiple faces
  scan3DScene.rotation.x = Math.PI / 6;
  scan3DScene.rotation.y = -Math.PI / 4;
}

function renderScan3DLoop() {
  if (!isScanning) {
    scan3DAnimationId = null;
    return;
  }
  if (scan3DRenderer) {
    scan3DRenderer.render(scan3DScene, scan3DCamera);
  }
  scan3DAnimationId = requestAnimationFrame(renderScan3DLoop);
}

function startScanFlow() {
  if (!beginScanSession()) return;
  currentScanStep = 0;
  scanRetakeSlot = null;
  pendingScanResult = null;
  clearScanSamples();
  if (typeof clearScanManualOverrides === 'function') clearScanManualOverrides();
  startScanCamera();
}

// 스캔 결과 확인에서 뒤로 가기: 앞 5면 샘플은 유지하고 마지막 스텝의 면만 다시 찍는다.
// 면 단위 재촬영과 달리 일반 진행 모드라 다시 뒤로 가면 스캔을 빠져나간다.
function resumeScanAtLastFace() {
  if (!beginScanSession()) return false;
  currentScanStep = SCAN_STEPS.length - 1;
  scanRetakeSlot = null;
  pendingScanResult = null;
  clearScanFace(currentScanSlot());
  startScanCamera();
  return true;
}

// 촬영 순서상 마지막 면의 슬롯. 슬롯 순서가 [0,2,3,1,5,4] 라 B(5)가 아니다.
function lastScanStepSlot() {
  return SCAN_STEPS[SCAN_STEPS.length - 1].slot;
}

// 센터 색이 잘못 읽히면 팔레트 전체가 틀어지는데 센터는 직접 편집할 수 없다.
// 그 면만 다시 찍어 팔레트를 갱신하는 유일한 복구 경로다.
function startScanFaceRetake(slot) {
  if (!beginScanSession()) return false;
  scanRetakeSlot = slot;
  currentScanStep = SCAN_STEPS.findIndex(step => step.slot === slot);
  startScanCamera();
  setScanMessage('이 면만 다시 촬영합니다. 안내한 방향으로 맞춰 주세요.');
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
  initScan3DGuide();
  pauseRendering();
  return true;
}

function startScanCamera() {
  renderScanStep();
  window.AndroidBridge.startScan();
  if (!scan3DAnimationId) {
    renderScan3DLoop();
  }
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
// 팔레트도 함께 갱신된다. 확인 화면의 수동 수정은 다시 찍은 면의 것만 버리고 재적용한다.
function finalizeScanCapture() {
  const allSamples = getCollectedScanSamples();
  window.AndroidBridge?.stopScan?.();
  const wasRetake = scanRetakeSlot !== null;
  // 다시 찍은 면의 수동 수정은 버린다 — 새 촬영 결과를 덮어쓰면 재촬영한 의미가 없다.
  // 재촬영을 취소하면 여기까지 오지 않으므로 수정이 그대로 남는다.
  if (wasRetake && typeof dropScanManualOverridesForFace === 'function') {
    dropScanManualOverridesForFace(scanRetakeSlot);
  }
  scanRetakeSlot = null;
  finishScanUi();
  if (!allSamples) {
    setStatus('촬영되지 않은 면이 있어요. 처음부터 다시 스캔해 주세요.');
    return;
  }
  pendingScanResult = classifyFacelets(allSamples);
  pendingScanResult.validation = validateFacelets(pendingScanResult.facelets);
  pendingScanResult.lowLight = isScanTooDark(allSamples);
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
  document.getElementById('scan-rgb-preview').replaceChildren();
  // 재촬영 모드에는 "이전 면"이 없다 — 누르면 엉뚱한 슬롯을 지운다.
  document.getElementById('btn-scan-previous').disabled = retaking || currentScanStep === 0;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
  
  updateScanCubeMaterials();
  animateScanCubeTransition(step.slot);
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
