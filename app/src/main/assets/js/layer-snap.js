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
