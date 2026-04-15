// ─── 레이캐스터 & 상수 ─────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const CAM_MIN = 4, CAM_MAX = 20;

// ─── 터치 상태 ────────────────────────────────────────────────────────────────
let touchStartX = 0, touchStartY = 0, prevX = 0, prevY = 0;
let dragMode = null;      // null | 'layer' | 'view' | 'pinch'
let hitMesh   = null;
let hitNormal = null;     // 큐브 로컬 공간의 면 법선
let prevPinchDist = null;

// 레이어 회전 상태
let layerGroup    = null;
let layerAxisName = null; // 'x' | 'y' | 'z'
let layerMoveBase = null; // 'U' | 'D' | 'R' | 'L' | 'F' | 'B'
let layerSign     = 1;
let layerAngle    = 0;
const moveDirNDC  = new THREE.Vector2();

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
function toNDC(px, py) {
  return new THREE.Vector2(
     px / window.innerWidth  * 2 - 1,
    -py / window.innerHeight * 2 + 1
  );
}

function getTouchDist(t) {
  return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
}

function raycastCubies(px, py) {
  raycaster.setFromCamera(toNDC(px, py), camera);
  const hits = raycaster.intersectObjects(cubieGroup.children, true);
  return hits.length > 0 ? hits[0] : null;
}

// ─── 레이어 회전 초기화 ────────────────────────────────────────────────────────
function initLayerRotation(screenDx, screenDy) {
  if (!hitMesh) return false;

  // 카메라 right / up 벡터 (월드 공간)
  const camRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const camUp    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);

  // 드래그 방향: 스크린 → 월드 → 큐브 로컬
  const worldDrag = camRight.clone().multiplyScalar(screenDx)
                             .addScaledVector(camUp, -screenDy).normalize();
  const localDrag = worldDrag.clone()
                             .applyQuaternion(cubieGroup.quaternion.clone().invert())
                             .normalize();

  // 면 평면에 투영 (법선 성분 제거)
  const n = hitNormal;
  const dragOnFace = localDrag.clone()
                              .sub(n.clone().multiplyScalar(localDrag.dot(n)));
  if (dragOnFace.length() < 0.01) return false;
  dragOnFace.normalize();

  // 회전축 = 법선 × 드래그방향
  const rotAxisVec = new THREE.Vector3().crossVectors(n, dragOnFace);
  const ax = Math.abs(rotAxisVec.x), ay = Math.abs(rotAxisVec.y), az = Math.abs(rotAxisVec.z);
  layerAxisName = ax > ay && ax > az ? 'x' : ay > az ? 'y' : 'z';

  // 슬라이스 & 무브 결정 (mesh.userData = {cx, cy, cz})
  const sliceKey = 'c' + layerAxisName;
  const slice = hitMesh.userData[sliceKey];
  if (slice === undefined || slice === 0) return false;

  if      (layerAxisName === 'y') layerMoveBase = slice > 0 ? 'U' : 'D';
  else if (layerAxisName === 'x') layerMoveBase = slice > 0 ? 'R' : 'L';
  else                            layerMoveBase = slice > 0 ? 'F' : 'B';

  // 회전 방향 부호
  layerSign = rotAxisVec[layerAxisName] > 0 ? 1 : -1;

  // 스크린 → 각도 변환용 NDC 방향 벡터
  cubieGroup.updateMatrixWorld();
  const wp  = hitMesh.position.clone().applyMatrix4(cubieGroup.matrixWorld).project(camera);
  const wp2 = hitMesh.position.clone().add(dragOnFace).applyMatrix4(cubieGroup.matrixWorld).project(camera);
  moveDirNDC.set(wp2.x - wp.x, wp2.y - wp.y).normalize();

  // 해당 슬라이스 큐비들을 임시 그룹으로 묶기
  layerGroup = new THREE.Group();
  cubieGroup.add(layerGroup);
  cubies.forEach(c => {
    if (c[sliceKey] === slice) layerGroup.add(c.mesh);
  });

  return true;
}

// ─── 스냅 & 논리 상태 적용 ─────────────────────────────────────────────────────
function finishLayerRotation() {
  if (!layerGroup) return;

  const snaps = Math.round(layerAngle / (Math.PI / 2));
  if (snaps !== 0) {
    // Three.js: 양의 회전 = +축 방향에서 봤을 때 CCW
    // U/R/F = CW from outside = 음의 회전(snaps<0) → base move
    // D/L/B = CW from outside = 양의 회전(snaps>0) → base move
    const isURF = ['U', 'R', 'F'].includes(layerMoveBase);
    const needsPrime = isURF ? snaps > 0 : snaps < 0;
    const moveName = layerMoveBase + (needsPrime ? "'" : "");
    for (let i = 0; i < Math.abs(snaps); i++) applyMove(moveName);
  }

  // 큐비들을 원래 그룹으로 복원
  [...layerGroup.children].forEach(child => {
    cubieGroup.add(child);
    child.rotation.set(0, 0, 0);
    const c = cubies.find(cb => cb.mesh === child);
    if (c) child.position.set(c.cx * GAP, c.cy * GAP, c.cz * GAP);
  });
  cubieGroup.remove(layerGroup);
  layerGroup = null;
  applyFacelets();
}

// ─── touchstart ───────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    touchStartX = prevX = e.touches[0].clientX;
    touchStartY = prevY = e.touches[0].clientY;
    dragMode = null;
    layerAngle = 0;
    prevPinchDist = null;

    const hit = raycastCubies(touchStartX, touchStartY);
    if (hit) {
      hitMesh   = hit.object;
      // face.normal은 mesh 로컬 공간 (= cubieGroup 로컬, mesh 회전 없음)
      hitNormal = hit.face.normal.clone();
    } else {
      hitMesh = null;
    }
  } else if (e.touches.length === 2) {
    prevPinchDist = getTouchDist(e.touches);
  }
}, { passive: false });

// ─── touchmove ────────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchmove', e => {
  e.preventDefault();

  // 핀치 줌
  if (e.touches.length === 2) {
    dragMode = 'pinch';
    const dist = getTouchDist(e.touches);
    if (prevPinchDist) {
      camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist * prevPinchDist / dist));
      updateCamera();
    }
    prevPinchDist = dist;
    return;
  }

  if (e.touches.length !== 1 || dragMode === 'pinch') return;
  const x = e.touches[0].clientX, y = e.touches[0].clientY;

  // 드래그 모드 결정 (12px 임계값)
  if (!dragMode) {
    const dx = x - touchStartX, dy = y - touchStartY;
    if (Math.hypot(dx, dy) > 12) {
      dragMode = (hitMesh && initLayerRotation(dx, dy)) ? 'layer' : 'view';
    }
  }

  if (dragMode === 'view') {
    cubieGroup.rotation.y += (x - prevX) * 0.01;
    cubieGroup.rotation.x += (y - prevY) * 0.01;
  } else if (dragMode === 'layer' && layerGroup) {
    const s = toNDC(touchStartX, touchStartY);
    const c = toNDC(x, y);
    const progress = new THREE.Vector2(c.x - s.x, c.y - s.y).dot(moveDirNDC);
    layerAngle = progress * layerSign * Math.PI * 2;
    layerGroup.rotation.set(0, 0, 0);
    layerGroup.rotation[layerAxisName] = layerAngle;
  }

  prevX = x; prevY = y;
}, { passive: false });

// ─── touchend ─────────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchend', e => {
  if (dragMode === 'layer') finishLayerRotation();

  if (e.touches.length === 0) {
    dragMode = null; hitMesh = null; prevPinchDist = null;
  } else if (e.touches.length === 1) {
    if (dragMode === 'pinch') dragMode = null;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    prevPinchDist = null;
  }
});
