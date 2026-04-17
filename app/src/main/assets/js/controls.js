// ─── 레이캐스터 & 상수 ─────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const CAM_MIN = 4, CAM_MAX = 20;

// ─── 셔플 애니메이션 잠금 ─────────────────────────────────────────────────────
let isShuffling = false;

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

// ─── 속도 추적 (EMA) ─────────────────────────────────────────────────────────
let layerVelocity  = 0;   // rad/ms
let prevLayerAngle = 0;
let prevLayerTime  = 0;

let viewVelX   = 0;       // rad/ms
let viewVelY   = 0;
let prevMoveTime = 0;

// ─── Fling 애니메이션 ─────────────────────────────────────────────────────────
let flingRafId = null;

function cancelFling() {
  if (flingRafId === null) return;
  cancelAnimationFrame(flingRafId);
  flingRafId = null;
  // 레이어 fling 진행 중이면 현재 위치에서 즉시 스냅 확정
  if (layerGroup) {
    commitLayerRotation(Math.round(layerAngle / (Math.PI / 2)));
  }
  viewVelX = viewVelY = 0;
}

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

  // 슬라이스 & 무브 결정
  const sliceKey = 'c' + layerAxisName;
  const slice = hitMesh.userData[sliceKey];
  if (slice === undefined) return false;

  if      (layerAxisName === 'y') layerMoveBase = slice > 0 ? 'U' : slice < 0 ? 'D' : 'E';
  else if (layerAxisName === 'x') layerMoveBase = slice > 0 ? 'R' : slice < 0 ? 'L' : 'M';
  else                            layerMoveBase = slice > 0 ? 'F' : slice < 0 ? 'B' : 'S';

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

// ─── 레이어 회전 확정 (논리 상태 + 시각 복원) ────────────────────────────────
function commitLayerRotation(snaps) {
  if (!layerGroup) return;

  const group    = layerGroup;
  const moveBase = layerMoveBase;
  layerGroup = null; // 재진입 방지

  if (snaps !== 0) {
    const isURF = ['U', 'R', 'F', 'S'].includes(moveBase);
    const needsPrime = isURF ? snaps > 0 : snaps < 0;
    const moveName = moveBase + (needsPrime ? "'" : "");
    for (let i = 0; i < Math.abs(snaps); i++) applyMove(moveName);
    if (!isShuffling) {
      console.log('[Haptic] AndroidBridge exists:', !!window.AndroidBridge, '/ hapticFeedback fn:', typeof window.AndroidBridge?.hapticFeedback);
      window.AndroidBridge?.hapticFeedback();
    }
  }

  [...group.children].forEach(child => {
    cubieGroup.add(child);
    child.rotation.set(0, 0, 0);
    const c = cubies.find(cb => cb.mesh === child);
    if (c) child.position.set(c.cx * GAP, c.cy * GAP, c.cz * GAP);
  });
  cubieGroup.remove(group);
  applyFacelets();
}

// ─── 스냅 & Fling 애니메이션 ─────────────────────────────────────────────────
function finishLayerRotation() {
  if (!layerGroup) return;

  // 손가락 정지 후 들어올린 경우 velocity 무효화
  if (performance.now() - prevLayerTime > 100) layerVelocity = 0;

  // fling 속도를 고려한 목표 스냅 계산
  const FLING_THRESHOLD = 0.0015; // rad/ms
  const baseSnap  = Math.round(layerAngle / (Math.PI / 2));
  let targetSnaps = baseSnap;

  if (Math.abs(layerVelocity) > FLING_THRESHOLD) {
    // 150ms 앞을 예측해 스냅 목표 결정 (최대 ±1칸)
    const projected = layerAngle + layerVelocity * 150;
    const projSnap  = Math.round(projected / (Math.PI / 2));
    targetSnaps = Math.max(baseSnap - 1, Math.min(baseSnap + 1, projSnap));
  }

  const startAngle = layerAngle;
  const endAngle   = targetSnaps * Math.PI / 2;
  const axis       = layerAxisName;

  // 이미 목표 위치면 즉시 확정
  if (Math.abs(endAngle - startAngle) < 0.001) {
    commitLayerRotation(targetSnaps);
    return;
  }

  // Cubic ease-out 으로 목표 위치까지 애니메이션
  const DURATION  = 220; // ms
  const startTime = performance.now();

  function step(now) {
    const t     = Math.min((now - startTime) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const angle = startAngle + (endAngle - startAngle) * eased;
    layerAngle  = angle;
    if (layerGroup) layerGroup.rotation[axis] = angle;

    if (t < 1) {
      flingRafId = requestAnimationFrame(step);
    } else {
      flingRafId = null;
      commitLayerRotation(targetSnaps);
    }
  }

  flingRafId = requestAnimationFrame(step);
}

// ─── touchstart ───────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (isShuffling || isSolving) return; // 애니메이션 중 터치 차단
  cancelFling(); // 진행 중인 fling 즉시 중단

  if (e.touches.length === 1) {
    touchStartX = prevX = e.touches[0].clientX;
    touchStartY = prevY = e.touches[0].clientY;
    dragMode = null;
    layerAngle = prevLayerAngle = 0;
    layerVelocity = 0;
    prevLayerTime = 0;
    viewVelX = viewVelY = 0;
    prevMoveTime = 0;
    prevPinchDist = null;

    const hit = raycastCubies(touchStartX, touchStartY);
    if (hit) {
      hitMesh   = hit.object;
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
  const now = performance.now();

  // 드래그 모드 결정 (12px 임계값)
  if (!dragMode) {
    const dx = x - touchStartX, dy = y - touchStartY;
    if (Math.hypot(dx, dy) > 12) {
      dragMode       = (hitMesh && initLayerRotation(dx, dy)) ? 'layer' : 'view';
      prevLayerAngle = 0;
      prevLayerTime  = now;
      prevMoveTime   = now;
    }
  }

  if (dragMode === 'view') {
    const dRotY = (x - prevX) * 0.01;
    const dRotX = (y - prevY) * 0.01;
    cubieGroup.rotation.y += dRotY;
    cubieGroup.rotation.x += dRotX;
    const dt = now - prevMoveTime;
    if (dt > 0) {
      // EMA 스무딩으로 속도 추적
      viewVelY = viewVelY * 0.4 + (dRotY / dt) * 0.6;
      viewVelX = viewVelX * 0.4 + (dRotX / dt) * 0.6;
    }
    prevMoveTime = now;
  } else if (dragMode === 'layer' && layerGroup) {
    const s = toNDC(touchStartX, touchStartY);
    const c = toNDC(x, y);
    const progress = new THREE.Vector2(c.x - s.x, c.y - s.y).dot(moveDirNDC);
    const newAngle  = progress * layerSign * Math.PI;

    const dt = now - prevLayerTime;
    if (dt > 0) {
      // EMA 스무딩으로 속도 추적
      const instantVel = (newAngle - prevLayerAngle) / dt;
      layerVelocity = layerVelocity * 0.4 + instantVel * 0.6;
    }
    prevLayerAngle = newAngle;
    prevLayerTime  = now;

    layerAngle = newAngle;
    layerGroup.rotation.set(0, 0, 0);
    layerGroup.rotation[layerAxisName] = layerAngle;
  }

  prevX = x; prevY = y;
}, { passive: false });

// ─── touchend ─────────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchend', e => {
  if (dragMode === 'layer') {
    finishLayerRotation(); // fling 포함 스냅 애니메이션 시작
  } else if (dragMode === 'view') {
    // 손가락 정지 후 들어올린 경우 velocity 무효화
    if (performance.now() - prevMoveTime > 100) { viewVelX = viewVelY = 0; }

    const FLING_THRESHOLD = 0.0003; // rad/ms
    if (Math.abs(viewVelX) > FLING_THRESHOLD || Math.abs(viewVelY) > FLING_THRESHOLD) {
      const FRICTION = 0.92; // 16ms당 감쇠 계수
      let vx = viewVelX, vy = viewVelY;
      let lastTime = performance.now();

      function viewFling(now) {
        const dt     = Math.min(now - lastTime, 50);
        lastTime     = now;
        const factor = Math.pow(FRICTION, dt / 16);
        vx *= factor;
        vy *= factor;
        cubieGroup.rotation.x += vx * dt;
        cubieGroup.rotation.y += vy * dt;

        if (Math.abs(vx) > 0.00003 || Math.abs(vy) > 0.00003) {
          flingRafId = requestAnimationFrame(viewFling);
        } else {
          flingRafId = null;
        }
      }
      flingRafId = requestAnimationFrame(viewFling);
    }
  }

  if (e.touches.length === 0) {
    dragMode = null; hitMesh = null; prevPinchDist = null;
  } else if (e.touches.length === 1) {
    if (dragMode === 'pinch') dragMode = null;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    prevPinchDist = null;
  }
});

// ─── 프로그래매틱 레이어 회전 (셔플 애니메이션용) ──────────────────────────────

// 각 이동명 → { 회전축, 슬라이스, commitLayerRotation에 넘길 snaps } 매핑
const MOVE_ANIM_MAP = {
  'U':  { axis: 'y', sliceKey: 'cy', slice:  1, snaps: -1 },
  "U'": { axis: 'y', sliceKey: 'cy', slice:  1, snaps:  1 },
  'U2': { axis: 'y', sliceKey: 'cy', slice:  1, snaps: -2 },
  'D':  { axis: 'y', sliceKey: 'cy', slice: -1, snaps:  1 },
  "D'": { axis: 'y', sliceKey: 'cy', slice: -1, snaps: -1 },
  'D2': { axis: 'y', sliceKey: 'cy', slice: -1, snaps:  2 },
  'R':  { axis: 'x', sliceKey: 'cx', slice:  1, snaps: -1 },
  "R'": { axis: 'x', sliceKey: 'cx', slice:  1, snaps:  1 },
  'R2': { axis: 'x', sliceKey: 'cx', slice:  1, snaps: -2 },
  'L':  { axis: 'x', sliceKey: 'cx', slice: -1, snaps:  1 },
  "L'": { axis: 'x', sliceKey: 'cx', slice: -1, snaps: -1 },
  'L2': { axis: 'x', sliceKey: 'cx', slice: -1, snaps:  2 },
  'F':  { axis: 'z', sliceKey: 'cz', slice:  1, snaps: -1 },
  "F'": { axis: 'z', sliceKey: 'cz', slice:  1, snaps:  1 },
  'F2': { axis: 'z', sliceKey: 'cz', slice:  1, snaps: -2 },
  'B':  { axis: 'z', sliceKey: 'cz', slice: -1, snaps:  1 },
  "B'": { axis: 'z', sliceKey: 'cz', slice: -1, snaps: -1 },
  'B2': { axis: 'z', sliceKey: 'cz', slice: -1, snaps:  2 },
  // 중간 레이어
  'E':  { axis: 'y', sliceKey: 'cy', slice:  0, snaps:  1 },
  "E'": { axis: 'y', sliceKey: 'cy', slice:  0, snaps: -1 },
  'E2': { axis: 'y', sliceKey: 'cy', slice:  0, snaps:  2 },
  'M':  { axis: 'x', sliceKey: 'cx', slice:  0, snaps:  1 },
  "M'": { axis: 'x', sliceKey: 'cx', slice:  0, snaps: -1 },
  'M2': { axis: 'x', sliceKey: 'cx', slice:  0, snaps:  2 },
  'S':  { axis: 'z', sliceKey: 'cz', slice:  0, snaps: -1 },
  "S'": { axis: 'z', sliceKey: 'cz', slice:  0, snaps:  1 },
  'S2': { axis: 'z', sliceKey: 'cz', slice:  0, snaps: -2 },
};

// moveName 하나를 애니메이션으로 실행하고 끝나면 onDone 호출
function performAnimatedMove(moveName, onDone) {
  const info = MOVE_ANIM_MAP[moveName];
  if (!info) { if (onDone) onDone(); return; }

  const { axis, sliceKey, slice, snaps } = info;

  // commitLayerRotation이 참조하는 전역 상태 세팅
  layerAxisName = axis;
  if      (axis === 'y') layerMoveBase = slice > 0 ? 'U' : slice < 0 ? 'D' : 'E';
  else if (axis === 'x') layerMoveBase = slice > 0 ? 'R' : slice < 0 ? 'L' : 'M';
  else                   layerMoveBase = slice > 0 ? 'F' : slice < 0 ? 'B' : 'S';
  layerAngle = 0;

  // 해당 슬라이스 큐비를 임시 그룹으로 묶기
  layerGroup = new THREE.Group();
  cubieGroup.add(layerGroup);
  cubies.forEach(c => {
    if (c[sliceKey] === slice) layerGroup.add(c.mesh);
  });

  const targetAngle = snaps * Math.PI / 2;
  const DURATION    = 90; // ms (25수 × 90ms ≈ 2.3초)
  const startTime   = performance.now();

  (function step(now) {
    const t     = Math.min((now - startTime) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
    layerAngle  = targetAngle * eased;
    if (layerGroup) layerGroup.rotation[axis] = layerAngle;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      commitLayerRotation(snaps);
      if (onDone) onDone();
    }
  })(performance.now());
}
