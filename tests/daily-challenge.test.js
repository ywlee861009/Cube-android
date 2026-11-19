const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const scripts = ['constants.js', 'logic.js', 'actions.js', 'history.js', 'animation.js', 'challenge.js']
  .map(file => fs.readFileSync(path.join(assets, file), 'utf8'));
const day = date => Date.parse(date) / 86400000;
const TODAY = day('2026-11-19');

function loadChallenge(saved = { lessonSeen: true }) {
  let stored = JSON.stringify(saved);
  const elements = new Map();
  const button = id => {
    if (!elements.has(id)) elements.set(id, {});
    return elements.get(id);
  };
  const showSolvedOverlay = jest.fn();
  const checkSolvedAndSubmit = jest.fn();
  const context = vm.createContext({
    document: {
      getElementById: button,
      addEventListener() {},
    },
    uiLocale: 'en',
    t: (message, params = {}) => message.replace(/\{(\w+)\}/g, (token, key) => params[key] ?? token),
    restoreFreePlaySession: () => false,
    saveScanGuideProgress() {},
    refreshScanResumeControls() {},
    applyFacelets() {},
    saveFreePlaySession() {},
    _refreshSolveLabel() {},
    updateCamera() {},
    markDirty() {},
    cancelFling() {},
    startTimer() {},
    stopTimer() {},
    getSolveHistory: () => [],
    buildGuidedArrow: () => ({ traverse() {} }),
    showSolvedOverlay,
    checkSolvedAndSubmit,
    isGuidedSolve: false,
    layerGroup: null,
    GAP: 1.04,
    camDist: 13,
    manualMoveCount: 0,
    solveStartTime: null,
    usedSolver: false,
    solutionMoves: null,
    solutionIndex: 0,
    cubieGroup: {
      quaternion: { clone: () => ({}), copy() {} },
      rotation: { set() {} },
      add() {},
      remove() {},
    },
    localStorage: {
      getItem: () => stored,
      setItem: (_, value) => { stored = value; },
    },
  });
  vm.runInContext(scripts.join('\n'), context);
  const evaluate = code => vm.runInContext(code, context);
  evaluate(`dailyDate = () => ${TODAY}; renderChallengeControls();`);
  return {
    evaluate,
    button,
    showSolvedOverlay,
    checkSolvedAndSubmit,
    saved: () => JSON.parse(stored),
  };
}

test('the new cycle serves 30 distinct puzzles that each require exactly three moves', () => {
  const { evaluate } = loadChallenge();
  const results = evaluate(`
    const solved = facelets.slice();
    const moves = Object.keys(MOVES).flatMap(move => [move, move + "'", move + '2']);
    Array.from({ length: 30 }, (_, index) => {
      const puzzle = dailyScramble(DAILY_CATALOG_START + index).split(' ');
      const scrambled = solved.slice();
      puzzle.forEach(move => applyMoveInPlace(move, scrambled));

      function solves(sequence) {
        facelets = scrambled.slice();
        sequence.forEach(move => applyMoveInPlace(move, facelets));
        return isCubeSolved();
      }

      const quicker = solves([]) || moves.some(first =>
        solves([first]) || moves.some(second => solves([first, second])));
      return {
        state: scrambled.join(''),
        exactlyThree: puzzle.length === 3 && !quicker && solves(puzzle.reverse().map(inverseMoveOf)),
      };
    });
  `);
  expect(new Set(results.map(result => result.state)).size).toBe(30);
  expect(results.every(result => result.exactlyThree)).toBe(true);
});

test('legacy dates retain their puzzles, completion markers, and unfinished attempts', () => {
  const completedDate = day('2026-11-13');
  const draftDate = day('2026-11-14');
  const draft = { hints: 1, moves: ['U'] };
  const { evaluate } = loadChallenge({
    lessonSeen: true,
    completedDate,
    draft: { date: draftDate, scramble: "F' R U'", ...draft },
  });
  expect(evaluate(`dailyScramble(${draftDate})`)).toBe("F' R U'");
  expect(evaluate('challengeData.days')).toEqual({
    [completedDate]: { scramble: "U R' F'", best: {} },
    [draftDate]: { scramble: "F' R U'", draft },
  });
});

test('a replay keeps the best move count and updates hint usage on a better tie', () => {
  const date = day('2026-11-15');
  const yesterday = date - 1;
  const otherDraft = { hints: 1, moves: ['R'] };
  const { evaluate, saved } = loadChallenge({
    lessonSeen: true,
    days: {
      [yesterday]: { scramble: "F' R U'", draft: otherDraft },
      [date]: { scramble: "R F R'", best: { moves: 3, hints: 1 }, draft: { hints: 0, moves: [] } },
    },
  });
  evaluate(`
    challenge = { date: ${date}, hints: 0 };
    moveCount = 5;
    recordDailyCompletion();
    saveChallengeData();
  `);
  expect(saved().days[date].best).toEqual({ moves: 3, hints: 1 });

  evaluate('moveCount = 3; recordDailyCompletion(); saveChallengeData();');
  expect(saved().days[date]).toEqual({ scramble: "R F R'", best: { moves: 3, hints: 0 } });
  expect(saved().days[yesterday].draft).toEqual(otherDraft);
});

test('the bonus cycle offers 30 distinct puzzles that each require exactly five moves', () => {
  const { evaluate } = loadChallenge();
  const puzzles = evaluate(`
    const solved = facelets.slice();
    const moves = Object.keys(MOVES).flatMap(move => [move, move + "'", move + '2']);
    function moved(state, move) {
      const next = state.slice();
      applyMoveInPlace(move, next);
      return next;
    }
    // Normalize color labels from the six centers to account for all solved orientations.
    function stateKey(state) {
      const centers = Array.from({ length: 6 }, (_, face) => state[face * 9 + 4]);
      return state.map(color => centers.indexOf(color)).join('');
    }
    function withinTwo(state) {
      const states = new Set([stateKey(state)]);
      for (const first of moves) {
        const next = moved(state, first);
        states.add(stateKey(next));
        for (const second of moves) states.add(stateKey(moved(next, second)));
      }
      return states;
    }
    const nearSolved = withinTwo(solved);
    Array.from({ length: 30 }, (_, index) => {
      const scramble = dailyBonusScramble(DAILY_CATALOG_START + index).split(' ');
      const state = scramble.reduce(moved, solved);
      const quicker = [...withinTwo(state)].some(key => nearSolved.has(key));
      facelets = scramble.slice().reverse().map(inverseMoveOf).reduce(moved, state);
      return { key: stateKey(state), exact: scramble.length === 5 && !quicker && isCubeSolved() };
    });
  `);
  expect(new Set(puzzles.map(puzzle => puzzle.key)).size).toBe(30);
  expect(puzzles.every(puzzle => puzzle.exact)).toBe(true);
});

const solveChallenge = `challenge.scramble.split(' ').reverse().map(inverseMoveOf).forEach(applyMove);`;

test('the bonus unlocks from today’s completion and keeps the Daily 3 replay action', () => {
  const game = loadChallenge();
  expect(game.evaluate('startDailyBonusChallenge()')).toBe(false);
  expect(game.button('btn-daily-bonus').hidden).toBe(true);
  game.evaluate(`startDailyChallenge(${TODAY - 1}); ${solveChallenge}`);
  expect(game.showSolvedOverlay.mock.lastCall[3].action).toBe('Try again');
  expect(game.evaluate('startDailyBonusChallenge()')).toBe(false);

  game.evaluate(`startDailyChallenge(${TODAY}); ${solveChallenge}`);
  const result = game.showSolvedOverlay.mock.lastCall[3];
  expect(result.action).toBe('Daily 5 Moves');
  expect(result.secondary.label).toBe('Replay Daily 3 Moves');
  expect(game.button('btn-daily-bonus').hidden).toBe(false);
  expect(game.saved().bonusDays).toEqual({});

  result.secondary.onClick();
  expect(game.evaluate('challenge.kind')).toBe('daily');
  expect(game.evaluate('moveCount')).toBe(0);
  game.evaluate(solveChallenge);
  game.showSolvedOverlay.mock.lastCall[3].onAgain();
  expect(game.evaluate('challenge.kind')).toBe('bonus');
  expect(game.button('btn-daily-bonus-restart').hidden).toBe(false);
});

test('bonus hints, restart, exit, resume and replay keep bonus progress separate', () => {
  const days = { [TODAY]: { scramble: "R F R'", best: { moves: 3, hints: 0 } } };
  const game = loadChallenge({ lessonSeen: true, days });
  const freePlayState = game.evaluate(`applyMoveInPlace('U', facelets); facelets.join('');`);
  game.evaluate('startDailyBonusChallenge(); showChallengeHint(); showChallengeHint();');
  expect(game.button('challenge-message').textContent).toMatch(/^Turn the /);
  game.evaluate(`applyMove(inverseMoveOf(challenge.scramble.split(' ').at(-1)));`);
  const draftState = game.evaluate("facelets.join('')");
  expect(game.saved().bonusDays[TODAY].draft).toMatchObject({ hints: 1 });

  expect(game.evaluate('exitChallenge()')).toBe(true);
  expect(game.evaluate("facelets.join('')")).toBe(freePlayState);
  expect(game.button('btn-daily-bonus').textContent).toBe('Resume Daily 5 Moves');
  const resumed = loadChallenge(game.saved());
  resumed.evaluate('startDailyBonusChallenge();');
  expect(resumed.evaluate("facelets.join('')")).toBe(draftState);
  expect(resumed.evaluate('moveCount')).toBe(1);
  expect(resumed.evaluate('challenge.hints')).toBe(1);

  resumed.evaluate(`restartDailyBonus(); applyMove('D'); showChallengeHint();`);
  expect(resumed.button('challenge-message').textContent).toBe('Undo the last move to get back on track.');
  resumed.evaluate('restartDailyBonus();');
  expect(resumed.saved().bonusDays[TODAY].draft).toEqual({ moves: [], hints: 0 });
  resumed.evaluate(solveChallenge);
  expect(resumed.saved().days).toEqual(days);
  expect(resumed.saved().bonusDays[TODAY]).toEqual({
    scramble: resumed.evaluate('dailyBonusScramble(dailyDate())'),
    best: { moves: 5, hints: 0 },
  });
  expect(resumed.checkSolvedAndSubmit).not.toHaveBeenCalled();
  const [time, moves, pb, result] = resumed.showSolvedOverlay.mock.lastCall;
  expect([time, moves, pb]).toEqual([null, 5, null]);
  expect(result.detail).toContain('Best · 5 moves');
  expect(result.action).toBe('Replay Daily 5 Moves');
  result.onAgain();
  expect(resumed.evaluate('moveCount')).toBe(0);
  resumed.evaluate(`showChallengeHint(); ${solveChallenge}`);
  expect(resumed.saved().bonusDays[TODAY].best).toEqual({ moves: 5, hints: 0 });
  resumed.showSolvedOverlay.mock.lastCall[3].secondary.onClick();
  expect(resumed.evaluate('isChallengeActive()')).toBe(false);
  expect(resumed.button('btn-daily-bonus').textContent).toBe('Replay Daily 5 Moves');
});
