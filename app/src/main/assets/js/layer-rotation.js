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
}

// ─── 스냅 & Fling 애니메이션 ─────────────────────────────────────────────
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
