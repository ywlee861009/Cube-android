// A short puzzle uses the same cube, but has its own session and never records a PB.
const DAILY_SCRAMBLES = [
  "F R' U", "R U F'", "U F R'", "F' U' R", "R F' U'", "U' R' F",
  "R' U' F'", "F U R", "U R' F'", "F' R U'", "R' F U", "U' F' R'",
  "U F' R", "R U' F",
];
const CHALLENGE_KEY = 'cubie-challenge-v1';
const LESSON_MOVE = "U'";
const CHALLENGE_FACES = { U: 'top', R: 'right', F: 'front', D: 'bottom', L: 'left', B: 'back' };
const challengeButton = document.getElementById('btn-daily');
const lessonButton = document.getElementById('btn-lesson-turn');
const hintButton = document.getElementById('btn-challenge-hint');

let challengeData = {};
try {
  const saved = JSON.parse(localStorage.getItem(CHALLENGE_KEY));
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) challengeData = saved;
} catch (_) { /* Storage can be unavailable in a browser preview. */ }

let challenge = null;
let freePlay = null;
let challengeArrow = null;

function isChallengeActive() { return challenge !== null; }
function isChallengeComplete() { return !!challenge?.completed; }

function saveChallengeData() {
  try { localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challengeData)); }
  catch (_) { /* Keep the session playable without storage. */ }
}

function dailyDate() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
}

function challengeBusy() {
  return isShuffling || isSolving || isUndoRedo || isScanning || isGuidedSolve ||
    animRafId !== null || layerGroup !== null || document.getElementById('btn-shuffle').disabled;
}

function startDailyChallenge() {
  if (challengeBusy() || (challenge && !challenge.completed)) return;
  const date = dailyDate();
  const scramble = DAILY_SCRAMBLES[((date % DAILY_SCRAMBLES.length) + DAILY_SCRAMBLES.length) % DAILY_SCRAMBLES.length];
  const draft = challengeData.draft;
  const resume = draft?.date === date && DAILY_SCRAMBLES.includes(draft.scramble) &&
    Array.isArray(draft.moves) && draft.moves.every(move => Object.prototype.hasOwnProperty.call(MOVE_ANIM_MAP, move));
  enterChallenge({
    kind: 'daily', date, scramble: resume ? draft.scramble : scramble,
    hints: resume && Number.isSafeInteger(draft.hints) ? Math.max(0, draft.hints) : 0,
  }, resume ? draft.moves : []);
}

function enterChallenge(next, moves = []) {
  if (!challenge) {
    freePlay = {
      facelets, moveCount, manualMoveCount, solveStartTime, usedSolver, isScanSolve,
      solutionMoves, solutionIndex, colors: activeFaceColors,
      undo: undoStack.slice(), redo: redoStack.slice(),
      rotation: cubieGroup.quaternion.clone(), camDist,
      pausedAt: Date.now(),
    };
  }
  cancelFling();
  clearChallengeArrow();
  challenge = next;
  stopTimer();
  solveStartTime = null;
  usedSolver = false;
  isScanSolve = false;
  resetActiveFaceColors();
  resetSolution();
  facelets = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  next.scramble.split(' ').forEach(move => applyMoveInPlace(move, facelets));
  undoStack.length = 0;
  redoStack.length = 0;
  moves.forEach((moveName, index) => {
    applyMoveInPlace(moveName, facelets);
    undoStack.push({ moveName, moveCount: index });
  });
  manualMoveCount = moves.length;
  setMoveCount(moves.length);
  cubieGroup.rotation.set(0, 0, 0);
  camDist = freePlay.camDist;
  updateCamera();
  applyFacelets();
  updateChallengeProgress();
}

function exitChallenge() {
  if (!challenge || challengeBusy()) return false;
  if (challenge.kind === 'lesson') {
    challengeData.lessonSeen = true;
    saveChallengeData();
  }
  cancelFling();
  clearChallengeArrow();
  challenge = null;
  facelets = freePlay.facelets;
  manualMoveCount = freePlay.manualMoveCount;
  solveStartTime = freePlay.solveStartTime === null
    ? null : freePlay.solveStartTime + Date.now() - freePlay.pausedAt;
  usedSolver = freePlay.usedSolver;
  isScanSolve = freePlay.isScanSolve;
  solutionMoves = freePlay.solutionMoves;
  solutionIndex = freePlay.solutionIndex;
  setActiveFaceColors(freePlay.colors);
  undoStack.splice(0, undoStack.length, ...freePlay.undo);
  redoStack.splice(0, redoStack.length, ...freePlay.redo);
  cubieGroup.quaternion.copy(freePlay.rotation);
  camDist = freePlay.camDist;
  updateCamera();
  setMoveCount(freePlay.moveCount);
  if (solveStartTime !== null) startTimer();
  freePlay = null;
  applyFacelets();
  _refreshSolveLabel();
  renderChallengeControls();
  return true;
}

function renderChallengeControls() {
  const lesson = challenge?.kind === 'lesson';
  const playing = challenge && !challenge.completed;
  const date = dailyDate();
  const resume = challengeData.draft?.date === date;
  const dailyLabel = resume ? 'Resume Daily 3 Moves'
    : challengeData.completedDate === date ? 'Daily 3 Moves · Completed' : 'Daily 3 Moves';
  challengeButton.hidden = !!playing;
  challengeButton.textContent = t(challenge?.kind === 'daily' ? 'Try again' : dailyLabel);
  document.getElementById('free-play-controls').hidden = !!challenge;
  document.getElementById('btn-scan').hidden = !!challenge && !lesson;
  document.getElementById('challenge-controls').hidden = !challenge;
  lessonButton.hidden = !lesson || !playing;
  lessonButton.disabled = undoStack.length !== 0;
  hintButton.hidden = lesson || !playing;
  document.getElementById('btn-challenge-exit').textContent = t(lesson && playing ? 'Skip' : 'Free play');
  updateUndoRedoButtons();
}

function scanFromHome() {
  if (!challenge || (challenge.kind === 'lesson' && exitChallenge())) startScanFlow();
}

function setChallengeMessage(message, values) {
  document.getElementById('challenge-message').textContent = t(message, values);
}

function updateChallengeProgress() {
  if (!challenge || challenge.completed) return;
  clearChallengeArrow();
  const lesson = challenge.kind === 'lesson';
  const solved = isCubeSolved();
  if (solved) {
    challenge.completed = true;
    if (lesson) challengeData.lessonSeen = true;
    else {
      challengeData.completedDate = challenge.date;
      delete challengeData.draft;
    }
    saveChallengeData();
    setChallengeMessage(lesson ? 'Try today’s puzzle next.' : 'A new puzzle arrives tomorrow.');
    showSolvedOverlay(null, moveCount, null, {
      title: lesson ? 'Your first solve!' : 'Today’s cube is solved!',
      detail: lesson ? t('Try today’s puzzle next.') : [
        challenge.hints ? t('Hints used: {count}', { count: challenge.hints }) : t('No hints used'),
        t('A new puzzle arrives tomorrow.'),
      ].join(' · '),
      action: lesson ? 'Daily 3 Moves' : 'Try again',
      onAgain: startDailyChallenge,
    });
  } else if (lesson) {
    const firstMove = undoStack.length === 0;
    setChallengeMessage(firstMove ? 'One turn to go! Follow the arrow on the top layer.'
      : 'Undo the last move to get back on track.');
    drawChallengeArrow(firstMove ? LESSON_MOVE : inverseMoveOf(undoStack[undoStack.length - 1].moveName));
  } else {
    saveDailyDraft();
    setChallengeMessage('Solve the cube in three moves.');
  }
  renderChallengeControls();
}

function saveDailyDraft() {
  challengeData.draft = {
    date: challenge.date, scramble: challenge.scramble, hints: challenge.hints,
    moves: undoStack.map(entry => entry.moveName),
  };
  saveChallengeData();
}

function turnLessonLayer() {
  if (challenge?.kind !== 'lesson' || challenge.completed || undoStack.length || challengeBusy()) return;
  performAnimatedMove(LESSON_MOVE, null, 220);
}

function showChallengeHint() {
  if (challenge?.kind !== 'daily' || challenge.completed || challengeArrow || challengeBusy()) return;
  const solution = challenge.scramble.split(' ').reverse().map(inverseMoveOf);
  const position = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
  challenge.scramble.split(' ').forEach(move => applyMoveInPlace(move, position));
  const nextMove = solution.find(move => {
    if (position.every((color, index) => color === facelets[index])) return true;
    applyMoveInPlace(move, position);
    return false;
  });
  if (nextMove) {
    setChallengeMessage(nextMove.endsWith("'") ? 'Turn the {face} face counterclockwise.'
      : 'Turn the {face} face clockwise.', { face: t(CHALLENGE_FACES[nextMove[0]]) });
    drawChallengeArrow(nextMove);
  } else if (undoStack.length) {
    setChallengeMessage('Undo the last move to get back on track.');
    drawChallengeArrow(inverseMoveOf(undoStack[undoStack.length - 1].moveName));
  }
  challenge.hints++;
  saveDailyDraft();
}

function drawChallengeArrow(move) {
  const { axis, slice, snaps } = MOVE_ANIM_MAP[move];
  challengeArrow = buildGuidedArrow(axis, slice * GAP, Math.sign(snaps), Math.abs(snaps));
  challengeArrow.traverse(object => { if (object.isMesh) object.raycast = () => {}; });
  cubieGroup.add(challengeArrow);
  markDirty();
}

function clearChallengeArrow() {
  if (!challengeArrow) return;
  cubieGroup.remove(challengeArrow);
  const materials = new Set();
  challengeArrow.traverse(object => {
    object.geometry?.dispose();
    if (object.material) materials.add(object.material);
  });
  materials.forEach(material => material.dispose());
  challengeArrow = null;
  markDirty();
}

// Returning to a home screen that stayed open across midnight updates its CTA.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !challenge) renderChallengeControls();
});

const options = document.getElementById('app-options');
document.addEventListener('pointerdown', event => {
  if (!options.contains(event.target)) options.open = false;
});

if (!challengeData.lessonSeen && !getSolveHistory().length) {
  enterChallenge({ kind: 'lesson', scramble: 'U' });
} else {
  renderChallengeControls();
}
