const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const scripts = ['logic.js', 'actions.js', 'history.js', 'challenge.js']
  .map(file => fs.readFileSync(path.join(assets, file), 'utf8'));
const day = date => Date.parse(date) / 86400000;

function loadChallenge(saved = { lessonSeen: true }) {
  let stored = JSON.stringify(saved);
  const context = vm.createContext({
    document: {
      getElementById: () => ({}),
      addEventListener() {},
    },
    uiLocale: 'en',
    t: message => message,
    applyFacelets() {},
    localStorage: {
      getItem: () => stored,
      setItem: (_, value) => { stored = value; },
    },
  });
  vm.runInContext(scripts.join('\n'), context);
  return {
    evaluate: code => vm.runInContext(code, context),
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
