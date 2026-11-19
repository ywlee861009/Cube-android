const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const THREE = require(path.join(assets, 'three.min.js'));
const scripts = ['constants.js', 'cubies.js', 'layer-rotation.js', 'layer-snap.js', 'touch.js']
  .map(file => fs.readFileSync(path.join(assets, file), 'utf8'));

function dragLayer() {
  const handlers = new Map();
  const canvas = {
    addEventListener: (type, listener) => handlers.set(type, listener),
  };
  const cubieGroup = new THREE.Group();
  const camera = new THREE.PerspectiveCamera(45, 400 / 800, 0.1, 100);
  camera.position.set(4.5, 4, 5.5).setLength(13);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const applyMove = jest.fn();
  const context = vm.createContext({
    THREE, camera, cubieGroup, performance, applyMove,
    console: { log() {} },
    renderer: { domElement: canvas },
    document: { elementFromPoint: () => canvas },
    window: { innerWidth: 400, innerHeight: 800 },
    facelets: Array.from({ length: 54 }, (_, index) => Math.floor(index / 9)),
    isShuffling: false,
    isSolving: false,
    isUndoRedo: false,
    animRafId: null,
    camDist: 13,
    isChallengeComplete: () => false,
    markDirty() {},
    updateCamera() {},
  });
  for (const script of scripts) vm.runInContext(script, context);
  vm.runInContext('cubieGroup.updateMatrixWorld(true); applyFacelets();', context);

  function touch(type, ...points) {
    const touches = points.map(([clientX, clientY]) => ({ clientX, clientY }));
    handlers.get(type)({ touches, changedTouches: touches, preventDefault() {} });
  }

  touch('touchstart', [200, 400]);
  touch('touchmove', [245, 400]);
  expect(vm.runInContext('dragMode', context)).toBe('layer');
  expect(vm.runInContext('layerGroup', context)).not.toBeNull();

  function expectRolledBack() {
    expect(vm.runInContext('layerGroup', context)).toBeNull();
    expect(vm.runInContext('cubies.every(({ mesh }) => mesh.parent === cubieGroup)', context)).toBe(true);
    expect(applyMove).not.toHaveBeenCalled();
  }

  return { touch, expectRolledBack, context };
}

test('adding a second finger rolls a layer back before zooming', () => {
  const { touch, expectRolledBack, context } = dragLayer();
  touch('touchstart', [245, 400], [280, 430]);
  touch('touchmove', [240, 400], [286, 430]);
  expect(context.camDist).toBeLessThan(13);

  touch('touchend', [240, 400]);
  touch('touchmove', [200, 460]);
  touch('touchend');

  expectRolledBack();
  expect(context.cubieGroup.rotation.toArray().slice(0, 3)).toEqual([0, 0, 0]);
});

test('releasing the second finger without moving either finger does not commit a turn', () => {
  const { touch, expectRolledBack } = dragLayer();
  touch('touchstart', [245, 400], [280, 430]);
  touch('touchend', [245, 400]);
  touch('touchend');
  expectRolledBack();
});

test('cancelling an active touch restores all cubies without applying the drag', () => {
  const { touch, expectRolledBack } = dragLayer();
  touch('touchcancel');
  expectRolledBack();
});
