// ─── 드래그 + 핀치줌 ───────────────────────────────────────────────────────
const CAM_MIN = 4, CAM_MAX = 20;
let prevX = 0, prevY = 0;
let prevPinchDist = null;

function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    prevPinchDist = null;
  } else if (e.touches.length === 2) {
    prevPinchDist = getTouchDist(e.touches);
  }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && prevPinchDist === null) {
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    cubieGroup.rotation.y += dx * 0.01;
    cubieGroup.rotation.x += dy * 0.01;
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
  if (e.touches.length < 2) prevPinchDist = null;
  if (e.touches.length === 1) {
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  }
});
