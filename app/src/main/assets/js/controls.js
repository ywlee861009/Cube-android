const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ─── 상태 ──────────────────────────────────────────────────────────────────
let isDragging = false;
let dragMode = null; // 'view' or 'layer'
let startX = 0, startY = 0;
let prevX = 0, prevY = 0;

// 레이어 회전 관련
let startCubie = null;
let startNormal = null;
let startPointNDC = new THREE.Vector2();
let moveDirNDC = new THREE.Vector2();
let rotationAxis = null; // Vector3
let rotationAxisName = null; // 'x', 'y', 'z'
let rotationGroup = null;
let currentMoveBase = null; // 'U', 'R', etc.
let totalAngle = 0;

// 카메라/핀치 관련
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
    const normal = intersect.face.normal.clone();
    return { mesh: intersect.object, normal, point: intersect.point };
  }
  return null;
}

let moveDirNDC_local = new THREE.Vector3();

function initLayerRotation(cubie, normal, dx, dy) {
  // 1. 드래그 방향(local) 결정
  const viewDir = new THREE.Vector3(dx, -dy, 0).unproject(camera).sub(new THREE.Vector3(0,0,0).unproject(camera)).normalize();
  const localDir = viewDir.clone().applyQuaternion(cubieGroup.quaternion.clone().invert());
  const dragV = localDir.sub(normal.clone().multiplyScalar(localDir.dot(normal))).normalize();
  moveDirNDC_local = dragV.clone();
  
  // 2. 회전축 결정
  const axisV = new THREE.Vector3().crossVectors(normal, dragV);
  let absX = Math.abs(axisV.x), absY = Math.abs(axisV.y), absZ = Math.abs(axisV.z);
  rotationAxisName = absX > absY && absX > absZ ? 'x' : (absY > absZ ? 'y' : 'z');
  
  const slice = cubie.userData[rotationAxisName];
  if (slice === 0) return false;

  // 3. 무브 베이스 및 부호(방향) 설정
  // Three.js 좌표계 기준: R=+x, U=+y, F=+z
  // 각 축의 양의 방향에서 볼 때 CCW가 양의 회전.
  // 큐브 무브(U, R, F)는 각 면을 볼 때 CW이므로, 축 기준으로는 '음의 회전'이 기본.
  if (rotationAxisName === 'y') currentMoveBase = (slice === 1 ? 'U' : 'D');
  else if (rotationAxisName === 'x') currentMoveBase = (slice === 1 ? 'R' : 'L');
  else if (rotationAxisName === 'z') currentMoveBase = (slice === 1 ? 'F' : 'B');

  // 4. NDC 공간에서의 이동 방향 벡터 계산 (각도 계산용)
  const p1 = cubie.position.clone();
  const p2 = p1.clone().add(dragV);
  const screenP1 = p1.clone().applyMatrix4(cubieGroup.matrixWorld).project(camera);
  const screenP2 = p2.clone().applyMatrix4(cubieGroup.matrixWorld).project(camera);
  moveDirNDC.set(screenP2.x - screenP1.x, screenP2.y - screenP1.y).normalize();
  startPointNDC.set(screenP1.x, screenP1.y);

  // 5. 회전 그룹 설정
  rotationGroup = new THREE.Group();
  cubieGroup.add(rotationGroup);
  cubies.forEach(c => {
    if (c.userData[rotationAxisName] === slice) rotationGroup.add(c.mesh);
  });

  return true;
}

renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    isDragging = true;
    dragMode = null;
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
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const totalDx = x - startX;
    const totalDy = y - startY;

    if (!dragMode) {
      if (Math.hypot(totalDx, totalDy) > 10) {
        if (startCubie && initLayerRotation(startCubie, startNormal, totalDx, totalDy)) {
          dragMode = 'layer';
        } else {
          dragMode = 'view';
        }
      }
    }

    if (dragMode === 'view') {
      cubieGroup.rotation.y += (x - prevX) * 0.01;
      cubieGroup.rotation.x += (y - prevY) * 0.01;
    } else if (dragMode === 'layer') {
      const currentNDC = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
      const dragNDC = currentNDC.clone().sub(startPointNDC);
      const dot = dragNDC.dot(moveDirNDC);
      
      // axisV가 주축과 같은 방향인지 반대 방향인지 확인
      const axisV = new THREE.Vector3().crossVectors(startNormal, moveDirNDC_local); // moveDirNDC_local 저장 필요
      const sign = axisV[rotationAxisName] > 0 ? 1 : -1;
      
      totalAngle = dot * 5 * sign; 
      
      rotationGroup.rotation.set(0, 0, 0);
      rotationGroup.rotation[rotationAxisName] = totalAngle;
    }
    prevX = x; prevY = y;
  } else if (e.touches.length === 2) {
    const dist = getTouchDist(e.touches);
    if (prevPinchDist !== null) {
      camDist *= prevPinchDist / dist;
      camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist));
      updateCamera();
    }
    prevPinchDist = dist;
  }
}, { passive: false });

renderer.domElement.addEventListener('touchend', e => {
  if (dragMode === 'layer') {
    const snaps = Math.round(totalAngle / (Math.PI / 2));
    if (snaps !== 0) {
      let moveName = currentMoveBase;
      // 방향 보정: 각 축과 슬라이스에 따라 CW/CCW 방향이 다르므로 실제 무브와 매칭
      // 기본적으로 큐브 무브(U, R, F)는 시계방향이므로 음의 회전임.
      // (현 로직에서는 totalAngle의 부호에 따라 ' 또는 기본 무브 결정)
      // 축별/슬라이스별 반전 로직이 필요할 수 있으나, 일단 단순 구현
      let reverse = false;
      if (rotationAxisName === 'y' && currentMoveBase === 'U') reverse = true;
      if (rotationAxisName === 'x' && currentMoveBase === 'R') reverse = true;
      if (rotationAxisName === 'z' && currentMoveBase === 'F') reverse = true;
      if (rotationAxisName === 'y' && currentMoveBase === 'D') reverse = false;
      if (rotationAxisName === 'x' && currentMoveBase === 'L') reverse = false;
      if (rotationAxisName === 'z' && currentMoveBase === 'B') reverse = false;

      let finalSnaps = reverse ? -snaps : snaps;
      let finalMove = currentMoveBase;
      if (finalSnaps < 0) finalMove += "'";
      for(let i=0; i<Math.abs(finalSnaps); i++) applyMove(finalMove);
    }
    
    const tempChildren = [...rotationGroup.children];
    tempChildren.forEach(child => {
      cubieGroup.add(child);
      child.rotation.set(0,0,0);
      const c = cubies.find(cb => cb.mesh === child);
      child.position.set(c.cx * GAP, c.cy * GAP, c.cz * GAP);
    });
    cubieGroup.remove(rotationGroup);
    applyFacelets();
  }
  isDragging = false; dragMode = null; prevPinchDist = null; rotationGroup = null;
});
