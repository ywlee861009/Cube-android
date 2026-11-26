// ─── renderer ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ─── scene / camera ────────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const sidePanelLayout = window.matchMedia('(min-width: 620px) and (min-aspect-ratio: 6/5)');
const gameHeader = document.getElementById('game-header');
const gameControls = document.getElementById('ui');

let camDist = 13;
const camDir = new THREE.Vector3(4.5, 4, 5.5).normalize();

function updateCamera() {
  camera.position.copy(camDir.clone().multiplyScalar(camDist));
  camera.lookAt(0, 0, 0);
}
updateCamera();

function updateHomeCubeViewport() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const controls = gameControls.getBoundingClientRect();
  if (controls.height > 0) {
    const header = gameHeader.getBoundingClientRect();
    const besideControls = sidePanelLayout.matches;
    const left = header.left;
    const right = besideControls ? controls.left - 12 : header.right;
    const top = header.bottom + 12;
    const safeBottom = parseFloat(getComputedStyle(gameHeader).getPropertyValue('--safe-bottom')) || 0;
    const bottom = besideControls ? height - safeBottom - 12 : controls.top - 12;
    camera.zoom = Math.min(1, Math.max(1, right - left) / (height * 0.57),
      Math.max(1, bottom - top) / (height * 0.58));
    camera.setViewOffset(width, height, (width - left - right) / 2,
      (height - top - bottom) / 2, width, height);
  } else {
    camera.zoom = 1;
    camera.clearViewOffset();
  }
  markDirty();
}

// ─── 조명 ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

// ─── cubie 그룹 ────────────────────────────────────────────────────────────
const cubieGroup = new THREE.Group();
scene.add(cubieGroup);

// ─── 리사이즈 ──────────────────────────────────────────────────────────────
let _vpW = window.innerWidth, _vpH = window.innerHeight;
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  const changed = w !== _vpW || h !== _vpH;
  console.log('[Resize] w=' + w + ' h=' + h + ' changed=' + changed);
  if (changed) {
    _vpW = w; _vpH = h;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    updateHomeCubeViewport();
  }
});

// ─── WebGL context 소실/복구 추적 ─────────────────────────────────────────
renderer.domElement.addEventListener('webglcontextlost', () => {
  console.log('[GL] context LOST t=' + performance.now().toFixed(0));
});
renderer.domElement.addEventListener('webglcontextrestored', () => {
  console.log('[GL] context RESTORED t=' + performance.now().toFixed(0));
});

// ─── 렌더 루프 ─────────────────────────────────────────────────────────────
let _needsRender = true;
let _renderPaused = false;
function markDirty() { _needsRender = true; }
function pauseRendering() {
  _renderPaused = true;
  renderer.domElement.style.opacity = '0';
}
function resumeRendering() {
  _renderPaused = false;
  renderer.domElement.style.opacity = '';
  renderer.render(scene, camera);  // 즉시 1프레임 렌더하여 복원 보장
  markDirty();
}

function animate() {
  requestAnimationFrame(animate);
  if (_renderPaused || !_needsRender) return;
  _needsRender = false;
  renderer.render(scene, camera);
}
const gameLayoutObserver = new ResizeObserver(updateHomeCubeViewport);
gameLayoutObserver.observe(gameHeader);
gameLayoutObserver.observe(gameControls);
updateHomeCubeViewport();
animate();
