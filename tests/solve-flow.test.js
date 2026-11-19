const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const scripts = [
  'logic.js',
  'actions.js',
  'history.js',
  'scan/cube-validate.js',
  'animation.js',
  'solve.js',
].map(file => fs.readFileSync(path.join(assets, file), 'utf8'));
const settleSolver = () => new Promise(resolve => setImmediate(resolve));

function loadSolve({ bridge, solve = () => Promise.resolve("R' U'") } = {}) {
  const buttons = new Map();
  const queuedMoves = [];
  const document = {
    getElementById(id) {
      if (!buttons.has(id)) {
        const classes = new Set();
        buttons.set(id, {
          textContent: '',
          classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
        });
      }
      return buttons.get(id);
    },
  };
  const recordSolve = jest.fn();
  const showSolvedOverlay = jest.fn();
  const context = vm.createContext({
    document,
    window: { AndroidBridge: bridge },
    layerGroup: null,
    isGuidedSolve: false,
    solveStartTime: null,
    manualMoveCount: 0,
    usedSolver: false,
    isChallengeActive: () => false,
    isChallengeComplete: () => false,
    checkSolvedAndSubmit() {},
    applyFacelets() {},
    updateChallengeProgress() {},
    stopTimer() {},
    t: (message, values = {}) => message.replace(/\{(\w+)\}/g, (_, key) => values[key]),
    recordSolve,
    showSolvedOverlay,
    queuedMoves,
    SolverFactory: { create: () => ({ isReady: () => true, solve }) },
  });
  vm.runInContext(scripts.join('\n'), context);
  const evaluate = code => vm.runInContext(code, context);
  evaluate(`
    performAnimatedMove = (move, done) => queuedMoves.push(() => {
      applyMove(move);
      done();
    });
  `);
  return {
    evaluate,
    button: id => document.getElementById(id),
    finishMove: () => queuedMoves.shift()(),
    queuedMoves,
    recordSolve,
    showSolvedOverlay,
  };
}

test('ad and step animation reserve the cube, then restore controls between moves', async () => {
  const requestSolve = jest.fn();
  const flow = loadSolve({ bridge: { requestSolve } });
  flow.evaluate("applyMoveInPlace('U', facelets); applyMove('R'); solveCube(); solveCube();");
  expect(requestSolve).toHaveBeenCalledTimes(1);
  for (const id of ['btn-solve', 'btn-shuffle', 'btn-scan', 'btn-undo']) {
    expect(flow.button(id).disabled).toBe(true);
  }

  flow.evaluate('window.onSolveGranted(); window.onSolveGranted();');
  await settleSolver();
  expect(flow.queuedMoves).toHaveLength(1);
  flow.finishMove();
  for (const id of ['btn-solve', 'btn-shuffle', 'btn-scan', 'btn-undo']) {
    expect(flow.button(id).disabled).toBe(false);
  }
  expect(flow.button('btn-solve').textContent).toBe('Next move · 2/2');
  expect(flow.button('btn-solve-exit').hidden).toBe(false);

  flow.evaluate('solveCube(); solveCube();');
  expect(flow.queuedMoves).toHaveLength(1);
  flow.finishMove();
  expect(flow.evaluate('isCubeSolved()')).toBe(true);
  expect(flow.recordSolve).toHaveBeenCalledTimes(1);
  expect(flow.showSolvedOverlay).toHaveBeenCalledTimes(1);
  expect(flow.button('btn-solve-exit').hidden).toBe(true);
});

test.each([
  ['Undo', "applyMoveInPlace('U', facelets); applyMove('R');", 'undoCube()'],
  ['Redo', "applyMoveInPlace('U', facelets); applyMoveInPlace('R', facelets); applyMove('F'); undoCube();", 'redoCube()'],
  ['exit', "applyMoveInPlace('U', facelets); applyMove('R');", 'exitSolution()'],
])('%s discards the remaining plan after one solver step', async (_, prepare, action) => {
  const flow = loadSolve();
  flow.evaluate(prepare);
  if (flow.queuedMoves.length) flow.finishMove();
  flow.evaluate('solveCube()');
  await settleSolver();
  flow.finishMove();
  flow.evaluate(action);
  if (flow.queuedMoves.length) flow.finishMove();
  expect(flow.evaluate('solutionMoves')).toBeNull();
  expect(flow.button('btn-solve-exit').hidden).toBe(true);
  expect(flow.showSolvedOverlay).not.toHaveBeenCalled();
});

test('a solver result is discarded when cube state changed during calculation', async () => {
  let finishSolve;
  const flow = loadSolve({ solve: () => new Promise(resolve => { finishSolve = resolve; }) });
  flow.evaluate("applyMove('R'); solveCube(); applyMove('U');");
  finishSolve("R'");
  await settleSolver();
  expect(flow.queuedMoves).toHaveLength(0);
  expect(flow.evaluate('solutionMoves')).toBeNull();
  expect(flow.button('btn-shuffle').disabled).toBe(false);
});

test('exhausting an incorrect plan never records or celebrates a solve', async () => {
  const flow = loadSolve({ solve: () => Promise.resolve('F') });
  flow.evaluate("applyMove('R'); solveCube();");
  await settleSolver();
  flow.finishMove();
  expect(flow.evaluate('isCubeSolved()')).toBe(false);
  expect(flow.evaluate('solutionMoves')).toBeNull();
  expect(flow.recordSolve).not.toHaveBeenCalled();
  expect(flow.showSolvedOverlay).not.toHaveBeenCalled();
  expect(flow.button('btn-shuffle').disabled).toBe(false);
});
