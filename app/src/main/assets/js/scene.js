// ─── renderer ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xf0f0f0, 1);

function setSceneBg(hex) {
  renderer.setClearColor(hex, 1);
  markDirty();
}
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ─── scene / camera ────────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

let camDist = 13;
const camDir = new THREE.Vector3(4.5, 4, 5.5).normalize();

function updateCamera() {
  camera.position.copy(camDir.clone().multiplyScalar(camDist));
  camera.lookAt(0, 0, 0);
}
updateCamera();

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
    camera.updateProjectionMatrix();
    markDirty();
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
  renderer.domElement.style.visibility = 'hidden';
}
function resumeRendering() {
  _renderPaused = false;
  renderer.domElement.style.visibility = '';
  markDirty();
}

function animate() {
  requestAnimationFrame(animate);
  if (_renderPaused || !_needsRender) return;
  _needsRender = false;
  renderer.render(scene, camera);
}
animate();
