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

let scan3DScene, scan3DCamera, scan3DRenderer, scan3DCube;
let scan3DAnimationId = null;

const FACE_TO_MATERIAL_INDEX = { 'R': 0, 'L': 1, 'U': 2, 'D': 3, 'F': 4, 'B': 5 };

function updateScanCubeMaterials() {
  if (!scan3DCube) return;
  // Reset all faces
  scan3DCube.material.forEach((mat, idx) => {
    mat.opacity = 0.4;
    mat.transparent = true;
    mat.emissive.setHex(0x000000);
  });
  
  // Scanned faces
  for (let i = 0; i < currentScanFace; i++) {
    const face = SCAN_FACE_GUIDE[i].face;
    scan3DCube.material[FACE_TO_MATERIAL_INDEX[face]].opacity = 0.8;
  }
  
  // Current face
  if (currentScanFace < 6) {
    const currentFace = SCAN_FACE_GUIDE[currentScanFace].face;
    const currentMat = scan3DCube.material[FACE_TO_MATERIAL_INDEX[currentFace]];
    currentMat.opacity = 1.0;
    // Slight emissive glow for the target face
    currentMat.emissive.copy(currentMat.color).multiplyScalar(0.2);
  }
}


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

function animateScanCubeTransition(faceIndex) {
  if (!scan3DCube) return;
  if (scanCubeAnimId !== null) {
    cancelAnimationFrame(scanCubeAnimId);
    scanCubeAnimId = null;
  }
  if (!scanStartQuat) scanStartQuat = new THREE.Quaternion();
  if (!scanTargetQuat) scanTargetQuat = new THREE.Quaternion();
  
  scanStartQuat.copy(scan3DCube.quaternion);
  const [rx, ry, rz] = SCAN_BASE_ROTATIONS[faceIndex];
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
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }), // Right (R)
    new THREE.MeshStandardMaterial({ color: 0xff8800 }), // Left (L)
    new THREE.MeshStandardMaterial({ color: 0xffffff }), // Top (U)
    new THREE.MeshStandardMaterial({ color: 0xffff00 }), // Bottom (D)
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // Front (F)
    new THREE.MeshStandardMaterial({ color: 0x0000ff })  // Back (B)
  ];

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
  
  initScan3DGuide();
  
  pauseRendering();
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
    pendingScanResult.lowLight = isScanTooDark(allSamples);
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
    `위쪽: ${guide.topColor} 면 (${guide.top})`;
  document.getElementById('scan-rgb-preview').replaceChildren();
  document.getElementById('btn-scan-previous').disabled = currentScanFace === 0;
  document.getElementById('btn-scan-capture').disabled = false;
  setScanMessage('격자에 한 면을 맞춘 뒤 촬영하세요.');
  
  updateScanCubeMaterials();
  animateScanCubeTransition(currentScanFace);
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
