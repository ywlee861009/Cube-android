// ─── 레이캐스터 & 줌 상수 ────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const CAM_MIN = 4, CAM_MAX = 20;

// ─── 터치 상태 ────────────────────────────────────────────────────────────
let touchStartX = 0, touchStartY = 0, prevX = 0, prevY = 0;
let dragMode = null;      // null | 'layer' | 'view' | 'pinch'
let hitMesh   = null;
let hitNormal = null;     // 큐브 로컬 공간의 면 법선
let prevPinchDist = null;

// ─── 뷰 회전 속도 (EMA) ──────────────────────────────────────────────────
let viewVelX   = 0;       // rad/ms
let viewVelY   = 0;
let prevMoveTime = 0;

// ─── 유틸 ────────────────────────────────────────────────────────────────
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

// ─── touchstart ──────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (isShuffling || isSolving || isUndoRedo) return; // 애니메이션 중 터치 차단
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

// ─── touchmove ───────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchmove', e => {
  e.preventDefault();

  // 핀치 줌
  if (e.touches.length === 2) {
    dragMode = 'pinch';
    const dist = getTouchDist(e.touches);
    if (prevPinchDist) {
      camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist * prevPinchDist / dist));
      updateCamera();
      markDirty();
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
    markDirty();
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
    markDirty();
  }

  prevX = x; prevY = y;
}, { passive: false });

// ─── touchend ────────────────────────────────────────────────────────────
renderer.domElement.addEventListener('touchend', e => {
  if (isShuffling || isSolving) { // 애니메이션 중 레이어 확정 차단
    if (e.touches.length === 0) { dragMode = null; hitMesh = null; prevPinchDist = null; }
    return;
  }
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
        markDirty();

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
