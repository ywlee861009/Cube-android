// ─── 각 이동명 → 애니메이션 파라미터 매핑 ─────────────────────────────────
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

  let animRafId = null;
  animRafId = requestAnimationFrame(function step(now) {
    const t     = Math.min((now - startTime) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
    layerAngle  = targetAngle * eased;
    if (layerGroup) layerGroup.rotation[axis] = layerAngle;

    if (t < 1) {
      animRafId = requestAnimationFrame(step);
    } else {
      animRafId = null;
      commitLayerRotation(snaps);
      if (onDone) onDone();
    }
  });
  // cancelFling()과의 충돌을 막기 위해 flingRafId와는 별도로 관리
  // (performAnimatedMove는 isShuffling/isSolving/isUndoRedo로 진입 차단)
}
