// ─── renderer ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff, 1);
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
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ─── 렌더 루프 ─────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
