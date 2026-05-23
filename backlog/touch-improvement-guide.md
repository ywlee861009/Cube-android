# 터치감 개선 구현 가이드 (CG-016 ~ CG-021)

---

## CG-016: 뷰 회전 관성 개선

**파일**: `app/src/main/assets/js/touch.js`

### 변경 1: EMA 가중치 (line 111-112)

```js
// before
viewVelY = viewVelY * 0.4 + (dRotY / dt) * 0.6;
viewVelX = viewVelX * 0.4 + (dRotX / dt) * 0.6;

// after
viewVelY = viewVelY * 0.7 + (dRotY / dt) * 0.3;
viewVelX = viewVelX * 0.7 + (dRotX / dt) * 0.3;
```

### 변경 2: friction 감쇠 계수 (line 153)

```js
// before
const FRICTION = 0.92;

// after
const FRICTION = 0.96;
```

### 변경 3: 정지 판정 임계값도 조정 (line 167)

```js
// before
if (Math.abs(vx) > 0.00003 || Math.abs(vy) > 0.00003) {

// after
if (Math.abs(vx) > 0.00001 || Math.abs(vy) > 0.00001) {
```

**효과**: 플링 지속 시간 ~200ms → ~800ms, 큐브를 돌려볼 때 자연스러운 관성.

---

## CG-017: 레이어 멀티회전 플링

**파일**: `app/src/main/assets/js/layer-snap.js`

### 변경: finishLayerRotation() 내 플링 로직 (line 26-33)

```js
// before
if (Math.abs(layerVelocity) > INTENT_THRESHOLD) {
  const projected = layerAngle + layerVelocity * 100;
  const projSnap  = Math.round(projected / SNAP_UNIT);
  targetSnaps = Math.max(baseSnap - 1, Math.min(baseSnap + 1, projSnap));
}

// after
if (Math.abs(layerVelocity) > INTENT_THRESHOLD) {
  // 200ms 예측, 속도에 비례한 동적 cap (최대 2칸 = 180도)
  const projected = layerAngle + layerVelocity * 200;
  const projSnap  = Math.round(projected / SNAP_UNIT);
  const maxSnaps  = Math.abs(layerVelocity) > 0.002 ? 2 : 1;
  targetSnaps = Math.max(baseSnap - maxSnaps, Math.min(baseSnap + maxSnaps, projSnap));
}
```

**효과**: 강한 플릭(0.002 rad/ms 이상)으로 180도 회전 가능. 일반 플릭은 기존처럼 90도.

---

## CG-018: 레이어 드래그 축 잠금 (Axis Lock)

**파일**: `app/src/main/assets/js/touch.js`

### 변경 1: 축 잠금 상태 변수 추가 (상단, line 6 부근)

```js
// 기존 변수 아래에 추가
let lockedDragDir = null;   // 축 잠금된 NDC 드래그 방향
```

### 변경 2: touchstart에서 초기화 (line 51 부근)

```js
// layerAngle = prevLayerAngle = 0; 아래에 추가
lockedDragDir = null;
```

### 변경 3: touchmove의 layer 분기에서 축 잠금 적용 (line 115-133)

```js
// before
} else if (dragMode === 'layer' && layerGroup) {
  const s = toNDC(touchStartX, touchStartY);
  const c = toNDC(x, y);
  const progress = new THREE.Vector2(c.x - s.x, c.y - s.y).dot(moveDirNDC);
  const newAngle  = progress * layerSign * Math.PI;

// after
} else if (dragMode === 'layer' && layerGroup) {
  const s = toNDC(touchStartX, touchStartY);
  const c = toNDC(x, y);
  const rawDelta = new THREE.Vector2(c.x - s.x, c.y - s.y);

  // 축 잠금: 첫 유효 드래그 방향을 기록하고 이후 해당 축으로만 투영
  if (!lockedDragDir && rawDelta.length() > 0.01) {
    lockedDragDir = rawDelta.clone().normalize();
  }
  const projectedDelta = lockedDragDir
    ? lockedDragDir.clone().multiplyScalar(rawDelta.dot(lockedDragDir))
    : rawDelta;

  const progress = projectedDelta.dot(moveDirNDC);
  const newAngle  = progress * layerSign * Math.PI;
```

**효과**: 드래그 시작 후 손가락이 비스듬히 움직여도 원래 의도한 축으로만 회전.

---

## CG-019: 90도 근처 자동 완성 (Magnetic Snap)

**파일**: `app/src/main/assets/js/layer-snap.js`

### 변경: finishLayerRotation() 시작 부분 (line 22-23 뒤)

```js
// before
const SNAP_UNIT = Math.PI / 2;
const baseSnap  = Math.round(layerAngle / SNAP_UNIT);

// 방향 의도 감지: 속도가 있고 같은 방향이면 35°(~38%) 부터 스냅 허용
const INTENT_THRESHOLD = 0.0004;
let targetSnaps = baseSnap;

// after
const SNAP_UNIT = Math.PI / 2;
const baseSnap  = Math.round(layerAngle / SNAP_UNIT);

// Magnetic snap: 80도(~89%) 이상이면 속도 무관하게 즉시 완성
const fraction = Math.abs(layerAngle / SNAP_UNIT - Math.round(layerAngle / SNAP_UNIT));
if (fraction < 0.11) { // 90도 기준 ±10도 이내 (= 80도 이상 진행)
  const startAngle = layerAngle;
  const endAngle   = baseSnap * SNAP_UNIT;
  if (Math.abs(endAngle - startAngle) < 0.001) {
    commitLayerRotation(baseSnap);
    return;
  }
  // 빠른 자동 완성 (100ms)
  const DURATION = 100;
  const startTime = performance.now();
  function magSnap(now) {
    const t = Math.min((now - startTime) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 2); // easeOutQuad
    layerAngle = startAngle + (endAngle - startAngle) * eased;
    if (layerGroup) layerGroup.rotation[layerAxisName] = layerAngle;
    markDirty();
    if (t < 1) flingRafId = requestAnimationFrame(magSnap);
    else { flingRafId = null; commitLayerRotation(baseSnap); }
  }
  flingRafId = requestAnimationFrame(magSnap);
  return;
}

const INTENT_THRESHOLD = 0.0004;
let targetSnaps = baseSnap;
```

**효과**: 80도 이상 드래그하면 속도/의도 판단 없이 자동으로 나머지 10도를 완성. 정밀 조작 부담 감소.

---

## CG-020: 핀치 줌 이징

**파일**: `app/src/main/assets/js/touch.js`

### 변경 1: 줌 목표 변수 추가 (상단, line 3 부근)

```js
// before
const CAM_MIN = 4, CAM_MAX = 20;

// after
const CAM_MIN = 4, CAM_MAX = 20;
let targetCamDist = null; // 핀치 줌 목표 거리
let zoomRafId     = null; // 줌 보간 RAF
```

### 변경 2: 핀치 줌 로직 교체 (line 75-84)

```js
// before
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

// after
if (e.touches.length === 2) {
  dragMode = 'pinch';
  const dist = getTouchDist(e.touches);
  if (prevPinchDist) {
    // 목표 거리 계산 (즉시 반영하지 않고 lerp로 보간)
    targetCamDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist * prevPinchDist / dist));
    if (!zoomRafId) {
      function zoomStep() {
        camDist += (targetCamDist - camDist) * 0.25; // lerp factor
        if (Math.abs(camDist - targetCamDist) < 0.01) {
          camDist = targetCamDist;
          zoomRafId = null;
        } else {
          zoomRafId = requestAnimationFrame(zoomStep);
        }
        updateCamera();
        markDirty();
      }
      zoomRafId = requestAnimationFrame(zoomStep);
    }
  }
  prevPinchDist = dist;
  return;
}
```

### 변경 3: touchend에서 줌 RAF 정리 (line 177 부근, dragMode 초기화 직전)

```js
// 기존 if (e.touches.length === 0) 블록 안에 추가
if (zoomRafId) { cancelAnimationFrame(zoomRafId); zoomRafId = null; }
targetCamDist = null;
```

**효과**: 줌이 프레임 단위로 25%씩 보간되어 부드럽게 전환. 기기 성능과 무관하게 일관된 느낌.

---

## CG-021: 뷰 속도 EMA 가중치 최적화

**파일**: `app/src/main/assets/js/touch.js`, `app/src/main/assets/js/layer-rotation.js` (추가로 `layer-snap.js`)

### 변경 1: 뷰 회전 EMA (touch.js line 111-112) — CG-016에서 이미 처리

```js
viewVelY = viewVelY * 0.7 + (dRotY / dt) * 0.3;
viewVelX = viewVelX * 0.7 + (dRotX / dt) * 0.3;
```

### 변경 2: 레이어 회전 EMA (touch.js line 124-125)

```js
// before
const instantVel = (newAngle - prevLayerAngle) / dt;
layerVelocity = layerVelocity * 0.4 + instantVel * 0.6;

// after
const instantVel = (newAngle - prevLayerAngle) / dt;
layerVelocity = layerVelocity * 0.7 + instantVel * 0.3;
```

### 변경 3: 레이어 intent threshold 보정 (layer-snap.js line 26)

EMA 가중치를 올리면 전체 속도값이 낮아지므로 threshold도 함께 낮춤:

```js
// before
const INTENT_THRESHOLD = 0.0004;

// after
const INTENT_THRESHOLD = 0.0002; // EMA 0.7/0.3 보정
```

**효과**: 순간적인 속도 튐이 줄어들고, 드래그 모멘텀이 자연스럽게 누적. 레이어/뷰 모두 일관된 관성감.

---

## 적용 순서 권장

1. **CG-016 + CG-021** 함께 (EMA 가중치가 겹침, 같이 적용해야 일관성 확보)
2. **CG-019** (magnetic snap — 독립적, 부작용 없음)
3. **CG-020** (핀치 줌 이징 — 독립적)
4. **CG-017** (멀티회전 플링 — CG-021의 threshold 보정 후 적용)
5. **CG-018** (축 잠금 — 가장 큰 로직 변경, 마지막에 테스트)

---
*Created: 2026-05-24*
