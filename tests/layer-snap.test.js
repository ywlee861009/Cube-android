const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/js/layer-snap.js'), 'utf8');

function releaseLayer(angle, velocity = 0, elapsed = 0) {
  let frame;
  const commitLayerRotation = jest.fn();
  const context = vm.createContext({
    layerAngle: angle * Math.PI / 180,
    layerGroup: { rotation: {} },
    layerAxisName: 'x',
    layerVelocity: velocity,
    prevLayerTime: 200 - elapsed,
    performance: { now: () => 200 },
    commitLayerRotation,
    markDirty() {},
    requestAnimationFrame: callback => {
      frame = callback;
      return 1;
    },
  });

  vm.runInContext(source, context);
  vm.runInContext('finishLayerRotation()', context);
  frame?.(360);
  expect(commitLayerRotation).toHaveBeenCalledTimes(1);
  return commitLayerRotation.mock.calls[0][0];
}

test.each([
  [-40, -1],
  [40, 1],
  [-34, 0],
  [34, 0],
])('a resting release at %d degrees snaps by %d turns', (angle, turns) => {
  expect(releaseLayer(angle)).toBe(turns);
  expect(releaseLayer(angle, 0.02, 101)).toBe(turns);
});

test.each([-1, 1])('a flick projected exactly halfway snaps in direction %d', direction => {
  const halfwayPerMillisecond = Math.PI / 4 / 100;
  expect(releaseLayer(0, direction * halfwayPerMillisecond)).toBe(direction);
});
