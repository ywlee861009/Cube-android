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

  console.log('[Commit] snaps=' + snaps + ' base=' + moveBase + ' isSolving=' + isSolving + ' isShuffling=' + isShuffling);
  if (snaps !== 0) {
    const isURF = ['U', 'R', 'F', 'S'].includes(moveBase);
    const needsPrime = isURF ? snaps > 0 : snaps < 0;
    const moveName = moveBase + (needsPrime ? "'" : "");
    for (let i = 0; i < Math.abs(snaps); i++) applyMove(moveName);
    if (!isShuffling) {
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
