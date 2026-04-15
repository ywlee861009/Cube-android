const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ─── 상태 ──────────────────────────────────────────────────────────────────
let isDragging = false;
let dragMode = null; // 'view' or 'layer'
let viewRotationAxis = null; // 'x' or 'y'
let startX = 0, startY = 0;
let prevX = 0, prevY = 0;

let startCubie = null;
let startNormal = null;
let startPointNDC = new THREE.Vector2();
let moveDirNDC = new THREE.Vector2();
let rotationAxisName = null; 
let rotationGroup = null;
let currentMoveBase = null; 
let totalAngle = 0;
let moveDirNDC_local = new THREE.Vector3();

const CAM_MIN = 4, CAM_MAX = 20;
let prevPinchDist = null;

function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function getIntersect(x, y) {
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubieGroup.children);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    return { mesh: intersect.object, normal: intersect.face.normal.clone() };
  }
  return null;
}

function initLayerRotation(cubie, normal, dx, dy) {
  try {
    totalAngle = 0;
    // 1. 드래그 방향 결정 (NDC -> World -> Local)
    const vStart = new THREE.Vector3(startX / window.innerWidth * 2 - 1, -(startY / window.innerHeight) * 2 + 1, 0.5).unproject(camera);
    const vEnd = new THREE.Vector3((startX + dx) / window.innerWidth * 2 - 1, -((startY + dy) / window.innerHeight) * 2 + 1, 0.5).unproject(camera);
    const viewDir = vEnd.sub(vStart).normalize();
    
    const localDir = viewDir.clone().applyQuaternion(cubieGroup.quaternion.clone().invert());
    const dragV = localDir.sub(normal.clone().multiplyScalar(localDir.dot(normal))).normalize();
    moveDirNDC_local.copy(dragV);
    
    // 2. 회전축 결정
    const axisV = new THREE.Vector3().crossVectors(normal, dragV);
    const absX = Math.abs(axisV.x), absY = Math.abs(axisV.y), absZ = Math.abs(axisV.z);
    
    // 주축 결정
    let axisLetter = absX > absY && absX > absZ ? 'x' : (absY > absZ ? 'y' : 'z');
    rotationAxisName = axisLetter;
    
    // userData 키는 cx, cy, cz로 저장되어 있음
    const slice = cubie.userData['c' + axisLetter];
    if (slice === undefined || slice === 0) return false;

    if (axisLetter === 'y') currentMoveBase = (slice === 1 ? 'U' : 'D');
    else if (axisLetter === 'x') currentMoveBase = (slice === 1 ? 'R' : 'L');
    else if (axisLetter === 'z') currentMoveBase = (slice === 1 ? 'F' : 'B');

    // 3. NDC 공간 매핑 (드래그 감도용)
    cubieGroup.updateMatrixWorld();
    const p1 = cubie.position.clone().applyMatrix4(cubieGroup.matrixWorld);
    const p2 = cubie.position.clone().add(dragV).applyMatrix4(cubieGroup.matrixWorld);
    const s1 = p1.project(camera);
    const s2 = p2.project(camera);
    
    moveDirNDC.set(s2.x - s1.x, s2.y - s1.y).normalize();
    startPointNDC.set(s1.x, s1.y);

    // 4. 레이어 그룹화 (cx, cy, cz 사용)
    rotationGroup = new THREE.Group();
    cubieGroup.add(rotationGroup);
    cubies.forEach(c => {
      if (c.userData['c' + axisLetter] === slice) rotationGroup.add(c.mesh);
    });
    return true;
  } catch (e) {
    console.error("initLayerRotation error:", e);
    return false;
  }
}

renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    isDragging = true;
    dragMode = null;
    viewRotationAxis = null;
    startX = prevX = e.touches[0].clientX;
    startY = prevY = e.touches[0].clientY;
    const hit = getIntersect(startX, startY);
    if (hit) {
      startCubie = hit.mesh;
      startNormal = hit.normal;
    } else {
      startCubie = null;
    }
  } else if (e.touches.length === 2) {
    prevPinchDist = getTouchDist(e.touches);
  }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    const x = e.touches[0].clientX, y = e.touches[0].clientY;
    const totalDx = x - startX, totalDy = y - startY;

    if (!dragMode) {
      if (Math.hypot(totalDx, totalDy) > 8) {
        if (startCubie && initLayerRotation(startCubie, startNormal, totalDx, totalDy)) {
          dragMode = 'layer';
        } else {
          dragMode = 'view';
          viewRotationAxis = Math.abs(totalDx) > Math.abs(totalDy) ? 'y' : 'x';
        }
      }
    }

    if (dragMode === 'view') {
      if (viewRotationAxis === 'y') {
        cubieGroup.rotation.y += (x - prevX) * 0.01;
      } else {
        cubieGroup.rotation.x += (y - prevY) * 0.01;
      }
    } else if (dragMode === 'layer' && rotationGroup) {
      const currentNDC = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
      const dot = currentNDC.sub(startPointNDC).dot(moveDirNDC);
      
      const axisV = new THREE.Vector3().crossVectors(startNormal, moveDirNDC_local);
      const sign = axisV[rotationAxisName] > 0 ? 1 : -1;
      
      totalAngle = dot * 4 * sign; 
      rotationGroup.rotation.set(0, 0, 0);
      rotationGroup.rotation[rotationAxisName] = totalAngle;
    }
    prevX = x; prevY = y;
  } else if (e.touches.length === 2 && prevPinchDist !== null) {
    const dist = getTouchDist(e.touches);
    camDist *= prevPinchDist / dist;
    camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist));
    updateCamera();
    prevPinchDist = dist;
  }
}, { passive: false });

renderer.domElement.addEventListener('touchend', () => {
  if (dragMode === 'layer' && rotationGroup) {
    const snaps = Math.round(totalAngle / (Math.PI / 2));
    if (snaps !== 0) {
      let reverse = (rotationAxisName === 'y' && currentMoveBase === 'U') ||
                    (rotationAxisName === 'x' && currentMoveBase === 'R') ||
                    (rotationAxisName === 'z' && currentMoveBase === 'F');
      let moveName = currentMoveBase + ( (reverse ? -snaps : snaps) < 0 ? "'" : "" );
      for(let i=0; i < Math.abs(snaps); i++) applyMove(moveName);
    }
    
    const GAP = 1.04;
    [...rotationGroup.children].forEach(child => {
      cubieGroup.add(child);
      child.rotation.set(0,0,0);
      const c = cubies.find(cb => cb.mesh === child);
      if (c) child.position.set(c.cx * GAP, c.cy * GAP, c.cz * GAP);
    });
    cubieGroup.remove(rotationGroup);
    applyFacelets();
  }
  isDragging = false; dragMode = null; viewRotationAxis = null; rotationGroup = null; startCubie = null;
});
