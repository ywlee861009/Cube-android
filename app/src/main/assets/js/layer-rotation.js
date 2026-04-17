// ─── 레이어 회전 상태 ─────────────────────────────────────────────────────
let layerGroup    = null;
let layerAxisName = null; // 'x' | 'y' | 'z'
let layerMoveBase = null; // 'U' | 'D' | 'R' | 'L' | 'F' | 'B'
let layerSign     = 1;
let layerAngle    = 0;
const moveDirNDC  = new THREE.Vector2();

// ─── 속도 추적 (EMA) ─────────────────────────────────────────────────────
let layerVelocity  = 0;   // rad/ms
let prevLayerAngle = 0;
let prevLayerTime  = 0;

// ─── Fling RAF ID (레이어 & 뷰 fling 공유) ───────────────────────────────
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

// ─── 레이어 회전 초기화 ──────────────────────────────────────────────────
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

// ─── 레이어 회전 확정 (논리 상태 + 시각 복원) ────────────────────────────
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
  // applyFacelets()는 위 applyMove() 내부에서 이미 호출됨 — 중복 제거
  markDirty();
}

// ─── 스냅 & Fling 애니메이션 ─────────────────────────────────────────────
function finishLayerRotation() {
  if (!layerGroup) return;

  // 손가락 정지 후 들어올린 경우 velocity 무효화
  if (performance.now() - prevLayerTime > 100) layerVelocity = 0;

  const SNAP_UNIT = Math.PI / 2;
  const baseSnap  = Math.round(layerAngle / SNAP_UNIT);

  // 방향 의도 감지: 속도가 있고 같은 방향이면 35°(~38%) 부터 스냅 허용
  const INTENT_THRESHOLD = 0.0004; // rad/ms (낮춰서 가벼운 플릭도 감지)
  let targetSnaps = baseSnap;

  if (Math.abs(layerVelocity) > INTENT_THRESHOLD) {
    // 속도 방향으로 100ms 예측 (최대 ±1칸)
    const projected = layerAngle + layerVelocity * 100;
    const projSnap  = Math.round(projected / SNAP_UNIT);
    targetSnaps = Math.max(baseSnap - 1, Math.min(baseSnap + 1, projSnap));
  } else {
    // 속도 없을 때: 35° (약 38%) 넘었으면 그 방향으로 스냅
    const fraction = layerAngle / SNAP_UNIT - Math.floor(layerAngle / SNAP_UNIT);
    if (fraction > 0.39) targetSnaps = Math.floor(layerAngle / SNAP_UNIT) + 1;
    else if (fraction < -0.39) targetSnaps = Math.ceil(layerAngle / SNAP_UNIT) - 1;
  }

  const startAngle = layerAngle;
  const endAngle   = targetSnaps * SNAP_UNIT;
  const axis       = layerAxisName;

  // 이미 목표 위치면 즉시 확정
  if (Math.abs(endAngle - startAngle) < 0.001) {
    commitLayerRotation(targetSnaps);
    return;
  }

  // 스프링 오버슈트 easing (easeOutBack 변형): "챡" 하고 붙는 느낌
  const OVERSHOOT = 0.25; // 클수록 더 튕김 (0 = 오버슈트 없음)
  function easeOutBack(t) {
    const c1 = OVERSHOOT;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  const DURATION  = 160; // ms (더 빠르고 탄력있게)
  const startTime = performance.now();

  function step(now) {
    const t     = Math.min((now - startTime) / DURATION, 1);
    const eased = easeOutBack(t);
    const angle = startAngle + (endAngle - startAngle) * eased;
    layerAngle  = angle;
    if (layerGroup) layerGroup.rotation[axis] = angle;
    markDirty();

    if (t < 1) {
      flingRafId = requestAnimationFrame(step);
    } else {
      flingRafId = null;
      commitLayerRotation(targetSnaps);
    }
  }

  flingRafId = requestAnimationFrame(step);
}
