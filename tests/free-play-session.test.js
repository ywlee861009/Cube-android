const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const scripts = [
  'logic.js',
  'actions.js',
  'history.js',
  'animation.js',
  'scan/cube-validate.js',
  'solve.js',
  'free-play-session.js',
].map(file => fs.readFileSync(path.join(assets, file), 'utf8'));

const sessionKey = 'cubie-free-play-v1';

function loadFreePlay(storage = new Map(), now = 10_000, solverPlan = '') {
  const elements = new Map();
  const pageEvents = new Map();
  const documentEvents = new Map();
  const document = {
    hidden: false,
    addEventListener: (name, handler) => documentEvents.set(name, handler),
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { classList: { add() {}, remove() {} } });
      return elements.get(id);
    },
  };
  const quaternion = {
    values: [0, 0, 0, 1],
    toArray() { return this.values.slice(); },
    fromArray(values) { this.values = Array.from(values); return this; },
    normalize() {
      const length = Math.hypot(...this.values);
      this.values = this.values.map(value => value / length);
      return this;
    },
  };
  const startTimer = jest.fn();
  const updateCamera = jest.fn();
  const context = vm.createContext({
    document,
    window: { addEventListener: (name, handler) => pageEvents.set(name, handler) },
    localStorage: {
      getItem: name => storage.get(name) ?? null,
      setItem: (name, value) => storage.set(name, value),
      removeItem: name => storage.delete(name),
    },
    Date: { now: () => now },
    cubieGroup: { quaternion },
    layerGroup: null,
    isGuidedSolve: false,
    SolverFactory: { create: () => ({ isReady: () => true, solve: () => Promise.resolve(solverPlan) }) },
    startTimer,
    stopTimer() {},
    recordSolve() {},
    showSolvedOverlay() {},
    updateCamera,
    applyFacelets() {},
    checkSolvedAndSubmit() {},
    updateChallengeProgress() {},
    t: message => message,
  });
  vm.runInContext(scripts.join('\n'), context);
  const evaluate = code => vm.runInContext(code, context);
  evaluate(`
    let challengeActive = false;
    function isChallengeActive() { return challengeActive; }
    function isChallengeComplete() { return false; }
    let manualMoveCount = 0;
    let solveStartTime = null;
    let usedSolver = false;
    let camDist = 13;
    const CAM_MIN = 4, CAM_MAX = 20;
    performAnimatedMove = (move, done) => { applyMove(move); done(); };
  `);
  return {
    evaluate,
    startTimer,
    updateCamera,
    hidePage: () => pageEvents.get('pagehide')(),
    setHidden(value) {
      document.hidden = value;
      documentEvents.get('visibilitychange')();
    },
  };
}

function storageWithDraft() {
  const storage = new Map();
  loadFreePlay(storage).evaluate("applyMove('M'); saveFreePlaySession();");
  return storage;
}

test('restores a mixed-slice position, undo and redo, elapsed time, and the camera', () => {
  const storage = new Map();
  const active = loadFreePlay(storage, 10_000);
  active.evaluate(`
    applyMove('M');
    applyMove('E');
    applyMove('S2');
    const beforeUndo = facelets.slice();
    undoCube();
    solveStartTime = 7_000;
    usedSolver = true;
    cubieGroup.quaternion.fromArray([0, 0, 0.6, 0.8]);
    camDist = 9;
  `);
  active.hidePage();
  const saved = JSON.parse(storage.get(sessionKey));
  expect(saved).toMatchObject({
    elapsedMs: 3_000,
    moveCount: 2,
    manualMoveCount: 3,
    usedSolver: true,
    undo: [{ moveName: 'M', moveCount: 0 }, { moveName: 'E', moveCount: 1 }],
    redo: [{ moveName: 'S2', moveCount: 2 }],
  });

  const resumed = loadFreePlay(storage, 90_000);
  expect(resumed.evaluate('restoreFreePlaySession()')).toBe(true);
  expect(resumed.evaluate('({ facelets, moveCount, manualMoveCount, usedSolver })')).toEqual({
    facelets: saved.facelets,
    moveCount: 2,
    manualMoveCount: 3,
    usedSolver: true,
  });
  expect(resumed.evaluate('solveStartTime')).toBe(87_000);
  expect(resumed.startTimer).toHaveBeenCalledTimes(1);
  expect(resumed.evaluate('camDist')).toBe(9);
  expect(resumed.evaluate('cubieGroup.quaternion.toArray()')).toEqual([0, 0, 0.6, 0.8]);
  expect(resumed.updateCamera).toHaveBeenCalledTimes(1);
  resumed.evaluate('redoCube()');
  expect(resumed.evaluate('facelets')).toEqual(active.evaluate('beforeUndo'));
  resumed.evaluate('undoCube()');
  expect(resumed.evaluate('facelets')).toEqual(saved.facelets);
});

test('restoring an untimed session leaves its timer stopped', () => {
  const storage = storageWithDraft();
  const resumed = loadFreePlay(storage);
  expect(resumed.evaluate('restoreFreePlaySession()')).toBe(true);
  expect(resumed.evaluate('solveStartTime')).toBeNull();
  expect(resumed.startTimer).not.toHaveBeenCalled();
});

test.each([
  ['unreadable JSON', () => '{'],
  ['out-of-range color', saved => JSON.stringify({ ...saved, facelets: [8, ...saved.facelets.slice(1)] })],
  ['one flipped edge with all color counts intact', saved => {
    const { facelets } = saved;
    [facelets[7], facelets[19]] = [facelets[19], facelets[7]];
    return JSON.stringify(saved);
  }],
  ['invalid history move', saved => JSON.stringify({ ...saved, undo: [{ moveName: 'constructor', moveCount: 0 }] })],
  ['negative elapsed time', saved => JSON.stringify({ ...saved, elapsedMs: -100 })],
  ['zero camera quaternion', saved => JSON.stringify({ ...saved, rotation: [0, 0, 0, 0] })],
])('drops a saved session containing %s', (_, corrupt) => {
  const storage = storageWithDraft();
  storage.set(sessionKey, corrupt(JSON.parse(storage.get(sessionKey))));
  const resumed = loadFreePlay(storage);
  expect(resumed.evaluate('restoreFreePlaySession()')).toBe(false);
  expect(resumed.evaluate('isCubeSolved()')).toBe(true);
  expect(storage.has(sessionKey)).toBe(false);
});

test.each([
  ['a challenge', 'challengeActive = true'],
  ['an applied scan', 'isScanSolve = true'],
  ['an in-progress scan', 'isScanning = true'],
  ['a shuffle animation', 'isShuffling = true'],
  ['a solver animation', 'isSolving = true'],
  ['an undo animation', 'isUndoRedo = true'],
])('backgrounding during %s preserves the existing free-play draft', (_, enterMode) => {
  const storage = storageWithDraft();
  const originalDraft = storage.get(sessionKey);
  const active = loadFreePlay(storage);
  active.evaluate(`applyMoveInPlace('F', facelets); ${enterMode};`);
  active.setHidden(true);
  expect(storage.get(sessionKey)).toBe(originalDraft);
});

test('clears the draft once free play is completed', () => {
  const storage = storageWithDraft();
  const resumed = loadFreePlay(storage);
  expect(resumed.evaluate('restoreFreePlaySession()')).toBe(true);
  resumed.evaluate(`applyMove("M'");`);
  expect(resumed.evaluate('isCubeSolved()')).toBe(true);
  expect(storage.has(sessionKey)).toBe(false);
});

test('saves partial solver progress and clears the draft on the final step', async () => {
  const storage = new Map();
  const flow = loadFreePlay(storage, 10_000, "F' R' U'");
  flow.evaluate("applyMove('U'); applyMove('R'); applyMove('F'); solveCube();");
  await new Promise(resolve => setImmediate(resolve));
  expect(flow.evaluate('solutionIndex')).toBe(1);
  expect(JSON.parse(storage.get(sessionKey)).facelets).toEqual(flow.evaluate('facelets'));
  flow.evaluate('solveCube()');
  expect(JSON.parse(storage.get(sessionKey)).facelets).toEqual(flow.evaluate('facelets'));
  flow.evaluate('solveCube()');
  expect(flow.evaluate('isCubeSolved()')).toBe(true);
  expect(storage.has(sessionKey)).toBe(false);
});
