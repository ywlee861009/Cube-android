// ─── 스캔 솔브 가이드 모드 (프로토타입) ──────────────────────────────────────
// 글 설명 없이 "보고 따라 하기": 움직일 줄만 밝게 + 3D 화살표 + 회전 반복 재생.
// 탭/왼쪽 스와이프 = 다음 수, 오른쪽 스와이프 = 이전 수.
// solutionMoves / solutionIndex(solve.js)를 그대로 쓰고, 시점은 표준 각도로 고정한다.

let isGuidedSolve = false;

const GUIDED_ARROW_COLOR = 0xff2d8a;   // 큐브 스티커에 없는 색
const GUIDED_ARROW_RADIUS = 2.55;      // 큐브 모서리(≈2.1) 바깥
const GUIDED_ARC_SPAN = Math.PI * 0.75;
const GUIDED_DIM = 0.3;                // 움직이지 않는 조각 밝기
const GUIDED_MOVE_MS = 260;            // 실제 수 확정 애니메이션
const GUIDED_PREVIEW_MS = 750;         // 90° 미리보기 1회
const GUIDED_HOLD_MS = 450;
const GUIDED_REST_MS = 350;
const GUIDED_SWIPE_PX = 40;
const GUIDED_CAM_DIST_PORTRAIT = 17;  // 화살표(반경 2.55)가 세로 화면 밖으로 잘리지 않는 거리
const GUIDED_CAM_DIST_LANDSCAPE = 14;

let guidedPreviewGroup = null;
let guidedArrow = null;
let guidedRafId = null;
let guidedBusy = false;
let guidedPointer = null;

// ─── 진입 / 종료 ─────────────────────────────────────────────────────────
function openGuidedSolve() {
  isGuidedSolve = true;
  guidedBusy = false;
  isSolving = false;
  cancelFling();
  cubieGroup.rotation.set(0, 0, 0);
  camDist = window.innerWidth < window.innerHeight ? GUIDED_CAM_DIST_PORTRAIT : GUIDED_CAM_DIST_LANDSCAPE;
  updateCamera();

  document.body.classList.add('guided-active');
  document.getElementById('guided-layer').classList.remove('hidden');
  document.getElementById('guided-hint').classList.remove('hidden');
  renderGuidedProgress();
  startGuidedPreview();
}

function closeGuidedSolve() {
  stopGuidedPreview();
  isGuidedSolve = false;
  guidedBusy = false;
  document.body.classList.remove('guided-active');
  document.getElementById('guided-layer').classList.add('hidden');
  camDist = 13;
  updateCamera();
  markDirty();
  resetButtons();
  setMoveCount(moveCount);
}

function exitGuidedSolve() {
  if (!isGuidedSolve || guidedBusy) return;
  closeGuidedSolve();
  setStatus('Solve를 누르면 이어서 볼 수 있어요.');
}

// ─── 진행 ────────────────────────────────────────────────────────────────
function guidedNext() {
  if (!isGuidedSolve || guidedBusy || !solutionMoves) return;
  if (solutionIndex >= solutionMoves.length) return;
  hideGuidedHint();
  runGuidedMove(solutionMoves[solutionIndex], () => {
    solutionIndex++;
    if (solutionIndex >= solutionMoves.length) {
      const total = solutionMoves.length;
      closeGuidedSolve();
      setStatus('Solved!');
      setMoveCount(0);
      showSolvedOverlay(null, total, null);
      return;
    }
    renderGuidedProgress();
    startGuidedPreview();
  });
}

function guidedPrev() {
  if (!isGuidedSolve || guidedBusy || !solutionMoves || solutionIndex === 0) return;
  hideGuidedHint();
  runGuidedMove(inverseMoveOf(solutionMoves[solutionIndex - 1]), () => {
    solutionIndex--;
    renderGuidedProgress();
    startGuidedPreview();
  });
}

function runGuidedMove(moveName, onDone) {
  guidedBusy = true;
  stopGuidedPreview();
  // isSolving=true → applyMove가 수동 이동으로 취급하지 않음(솔루션 유지·undo 미기록)
  isSolving = true;
  performAnimatedMove(moveName, () => {
    isSolving = false;
    guidedBusy = false;
    window.AndroidBridge?.hapticFeedback?.();
    onDone();
  }, GUIDED_MOVE_MS);
}

function renderGuidedProgress() {
  const total = solutionMoves ? solutionMoves.length : 0;
  const ratio = total ? solutionIndex / total : 0;
  document.getElementById('guided-progress-fill').style.width = (ratio * 100) + '%';
}

function hideGuidedHint() {
  document.getElementById('guided-hint').classList.add('hidden');
}

// ─── 미리보기: 줄 강조 + 화살표 + 반복 회전 ───────────────────────────────
function startGuidedPreview() {
  stopGuidedPreview();
  const info = MOVE_ANIM_MAP[solutionMoves[solutionIndex]];
  if (!info) return;
  const { axis, sliceKey, slice, snaps } = info;

  applyFacelets();
  cubies.forEach(c => {
    if (c[sliceKey] !== slice) c.mesh.material.forEach(m => m.color.multiplyScalar(GUIDED_DIM));
  });

  guidedPreviewGroup = new THREE.Group();
  cubieGroup.add(guidedPreviewGroup);
  cubies.forEach(c => {
    if (c[sliceKey] === slice) guidedPreviewGroup.add(c.mesh);
  });

  guidedArrow = buildGuidedArrow(axis, slice * GAP, Math.sign(snaps), Math.abs(snaps));
  cubieGroup.add(guidedArrow);

  const target = snaps * Math.PI / 2;
  const turnMs = GUIDED_PREVIEW_MS * (Math.abs(snaps) === 2 ? 1.5 : 1);
  const cycle = turnMs + GUIDED_HOLD_MS + GUIDED_REST_MS;
  const start = performance.now() + GUIDED_REST_MS;

  guidedRafId = requestAnimationFrame(function step(now) {
    const t = ((now - start) % cycle + cycle) % cycle;
    let angle = 0;
    if (now >= start && t < turnMs) {
      const p = t / turnMs;
      angle = target * (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    } else if (now >= start && t < turnMs + GUIDED_HOLD_MS) {
      angle = target;
    }
    guidedPreviewGroup.rotation.set(0, 0, 0);
    guidedPreviewGroup.rotation[axis] = angle;
    markDirty();
    guidedRafId = requestAnimationFrame(step);
  });
}

function stopGuidedPreview() {
  if (guidedRafId !== null) {
    cancelAnimationFrame(guidedRafId);
    guidedRafId = null;
  }
  if (guidedPreviewGroup) {
    const group = guidedPreviewGroup;
    guidedPreviewGroup = null;
    [...group.children].forEach(child => {
      cubieGroup.add(child);
      child.rotation.set(0, 0, 0);
      const c = cubies.find(cb => cb.mesh === child);
      if (c) child.position.set(c.cx * GAP, c.cy * GAP, c.cz * GAP);
    });
    cubieGroup.remove(group);
  }
  if (guidedArrow) {
    cubieGroup.remove(guidedArrow);
    guidedArrow.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    guidedArrow = null;
  }
  applyFacelets();
}

// ─── 3D 곡선 화살표 ──────────────────────────────────────────────────────
// 회전축 둘레의 원호 위 한 점. φ가 증가하는 방향 = 축 기준 +회전(오른손 법칙).
function guidedArcPoint(axis, offset, radius, phi) {
  const a = radius * Math.cos(phi), b = radius * Math.sin(phi);
  if (axis === 'x') return new THREE.Vector3(offset, a, b);
  if (axis === 'y') return new THREE.Vector3(b, offset, a);
  return new THREE.Vector3(a, b, offset);
}

// 카메라 쪽을 향하는 원호의 중심각 — 화살표가 항상 보이는 쪽에 그려지도록.
function guidedFacingPhi(axis) {
  const dir = camera.position.clone().applyQuaternion(cubieGroup.quaternion.clone().invert());
  if (axis === 'x') return Math.atan2(dir.z, dir.y);
  if (axis === 'y') return Math.atan2(dir.x, dir.z);
  return Math.atan2(dir.y, dir.x);
}

function buildGuidedArrow(axis, offset, direction, turns) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: GUIDED_ARROW_COLOR });
  const span = GUIDED_ARC_SPAN * (turns === 2 ? 1.4 : 1);
  const center = guidedFacingPhi(axis);
  const from = center - direction * span / 2;
  const to = center + direction * span / 2;

  const points = [];
  const SEGMENTS = 32;
  for (let i = 0; i <= SEGMENTS; i++) {
    points.push(guidedArcPoint(axis, offset, GUIDED_ARROW_RADIUS, from + (to - from) * i / SEGMENTS));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.07, 8, false), material));

  const headLength = 0.42;
  const tip = guidedArcPoint(axis, offset, GUIDED_ARROW_RADIUS, to);
  const tangent = curve.getTangent(1).normalize();
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, headLength, 16), material);
  head.position.copy(tip).addScaledVector(tangent, headLength / 2);
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  group.add(head);

  // 180° 회전은 화살촉을 두 개 겹쳐 "두 번"을 표시
  if (turns === 2) {
    const second = head.clone();
    second.position.addScaledVector(tangent, -headLength * 0.75);
    group.add(second);
  }
  return group;
}

// ─── 입력: 탭 / 스와이프 ─────────────────────────────────────────────────
(function initGuidedInput() {
  const layer = document.getElementById('guided-layer');
  if (!layer) return;

  layer.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    guidedPointer = { x: e.clientX, y: e.clientY };
  });
  layer.addEventListener('pointerup', e => {
    if (!guidedPointer) return;
    const dx = e.clientX - guidedPointer.x;
    const dy = e.clientY - guidedPointer.y;
    guidedPointer = null;
    if (Math.abs(dx) > GUIDED_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) guidedPrev(); else guidedNext();
    } else if (Math.hypot(dx, dy) < GUIDED_SWIPE_PX) {
      guidedNext();
    }
  });
  layer.addEventListener('pointercancel', () => { guidedPointer = null; });
})();
