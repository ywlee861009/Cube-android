// A short puzzle uses the same cube, but has its own session and never records a PB.
const DAILY_SCRAMBLES = [
  "F R' U", "R U F'", "U F R'", "F' U' R", "R F' U'", "U' R' F",
  "R' U' F'", "F U R", "U R' F'", "F' R U'", "R' F U", "U' F' R'",
  "U F' R", "R U' F",
  "R F R'", "U R U'", "F U F'", "U' R U", "F' U F", "R' F R",
  "U F U", "F R F", "R U R", "U' F' U'", "F' R' F'", "R' U' R'",
  "R U' R", "F R' F", "U F' U", "F' U' F'",
];
const DAILY_BONUS_SCRAMBLES = [
  "R' F R' F U'", "U R U R' U'", "U' F' U F U'",
  "F' U' R F R", "U R' U R U'", "F U R' U R",
  "U R' F R F'", "R U' F' U' R", "R U R' U' R",
  "F' R' F' R F", "U' R F R F'", "U' R' F' R F'",
  "U R F' R' U'", "R U' F' U' R'", "U' F R U R",
  "F U' F R' F", "U' F U F' U'", "R' F U' R U'",
  "U R U' F U'", "R F' U' F U'", "U R' U F U'",
  "U' R F R' F'", "F' U R' F' U", "U R F U' F'",
  "F' U R' U F", "U R' F' U R'", "U F' U' R' U",
  "F' U F U R'", "U' R F' U R'", "F' U R U F'",
];
const CHALLENGE_KEY = 'cubie-challenge-v1';
const DAY_MS = 86400000;
const LEGACY_DAILY_COUNT = 14;
// Keep earlier dates on their original schedule and lead with the new puzzles.
const DAILY_CATALOG_START = Date.UTC(2026, 10, 15) / DAY_MS;
const LESSON_MOVE = "U'";
const CHALLENGE_FACES = { U: 'top', R: 'right', F: 'front', D: 'bottom', L: 'left', B: 'back' };
const CHALLENGE_TITLES = { lesson: 'Practice', daily: 'Daily 3 Moves', bonus: 'Daily 5 Moves' };
const HOME_MODES = ['play', 'daily', 'scan'];
const challengeButton = document.getElementById('btn-daily');
const bonusButton = document.getElementById('btn-daily-bonus');
const bonusRestartButton = document.getElementById('btn-daily-bonus-restart');
const dailyHistoryDialog = document.getElementById('daily-history');
const lessonButton = document.getElementById('btn-lesson-turn');
const hintButton = document.getElementById('btn-challenge-hint');
const dailyDateFormat = new Intl.DateTimeFormat(uiLocale, {
  month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC',
});

const challengeData = loadChallengeData();
let challenge = null;
let freePlay = null;
let challengeArrow = null;
let homeMode = 'play';

function isChallengeActive() { return challenge !== null; }
function isChallengeComplete() { return !!challenge?.completed; }

function saveChallengeData() {
  try { localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challengeData)); }
  catch (_) { /* Keep the session playable without storage. */ }
}

function dailyDate() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS;
}

function dailyScramble(date) {
  const legacy = date < DAILY_CATALOG_START;
  const length = legacy ? LEGACY_DAILY_COUNT : DAILY_SCRAMBLES.length;
  const index = legacy ? date : date - DAILY_CATALOG_START + LEGACY_DAILY_COUNT;
  return DAILY_SCRAMBLES[((index % length) + length) % length];
}

function dailyBonusScramble(date) {
  const length = DAILY_BONUS_SCRAMBLES.length;
  const index = date - DAILY_CATALOG_START;
  return DAILY_BONUS_SCRAMBLES[((index % length) + length) % length];
}

function loadChallengeData() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(CHALLENGE_KEY)); }
  catch (_) { /* Storage can be unavailable in a browser preview. */ }

  const { lessonSeen, days, bonusDays, completedDate, draft } = saved ?? {};
  const entries = days && typeof days === 'object' && !Array.isArray(days) ? days : {};
  const bonusEntries = bonusDays && typeof bonusDays === 'object' && !Array.isArray(bonusDays) ? bonusDays : {};
  if (Number.isSafeInteger(completedDate) && !entries[completedDate]) {
    const index = ((completedDate % LEGACY_DAILY_COUNT) + LEGACY_DAILY_COUNT) % LEGACY_DAILY_COUNT;
    entries[completedDate] = { scramble: DAILY_SCRAMBLES[index], best: {} };
  }
  if (Number.isSafeInteger(draft?.date) && DAILY_SCRAMBLES.includes(draft.scramble)) {
    const entry = entries[draft.date] ??= { scramble: draft.scramble };
    entry.draft ??= { moves: draft.moves, hints: draft.hints };
  }
  return { lessonSeen, days: entries, bonusDays: bonusEntries };
}

function challengeBusy() {
  return isShuffling || isSolving || isUndoRedo || isScanning || isGuidedSolve ||
    animRafId !== null || layerGroup !== null || document.getElementById('btn-shuffle').disabled;
}

function startDailyChallenge(date = challenge?.kind === 'daily' ? challenge.date : dailyDate()) {
  return startDailyPuzzle('daily', date);
}

function startDailyBonusChallenge(date = challenge?.kind === 'bonus' ? challenge.date : dailyDate()) {
  if (!challengeData.days[date]?.best) return false;
  return startDailyPuzzle('bonus', date);
}

function dailyEntries(kind) {
  return kind === 'bonus' ? challengeData.bonusDays : challengeData.days;
}

function startDailyPuzzle(kind, date) {
  if (challengeBusy() || (challenge?.kind === 'lesson' && !challenge.completed)) return false;
  if (challenge?.kind === kind && challenge.date === date && !challenge.completed) return true;

  const entry = dailyEntries(kind)[date] ??= {
    scramble: kind === 'bonus' ? dailyBonusScramble(date) : dailyScramble(date),
  };
  const draft = entry.draft;
  const resume = Array.isArray(draft?.moves) &&
    draft.moves.every(move => Object.prototype.hasOwnProperty.call(MOVE_ANIM_MAP, move));
  enterChallenge({
    kind, date, scramble: entry.scramble,
    hints: resume && Number.isSafeInteger(draft.hints) ? Math.max(0, draft.hints) : 0,
  }, resume ? draft.moves : []);
  return true;
}

function restartDailyBonus() {
  if (challenge?.kind !== 'bonus' || challenge.completed || challengeBusy()) return;
  const { date, scramble } = challenge;
  enterChallenge({ kind: 'bonus', date, scramble, hints: 0 });
}

function startLesson() {
  if (challengeBusy() || (challenge?.kind === 'lesson' && !challenge.completed)) return false;
  document.getElementById('app-options').open = false;
  enterChallenge({ kind: 'lesson', scramble: 'U' });
  return true;
}

function enterChallenge(next, moves = []) {
  if (!challenge) {
    saveFreePlaySession();
    saveScanGuideProgress();
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
  selectHomeMode('play');
  renderChallengeControls();
  return true;
}

function selectHomeMode(mode, focusTab = false) {
  if (challenge || !HOME_MODES.includes(mode)) return;
  if (mode !== homeMode) {
    homeMode = mode;
    for (const name of HOME_MODES) {
      const tab = document.getElementById(`btn-mode-${name}`);
      tab.setAttribute('aria-selected', String(name === mode));
      tab.tabIndex = name === mode ? 0 : -1;
    }
    renderHomeMode();
  }
  if (focusTab) document.getElementById(`btn-mode-${mode}`).focus();
}

function renderHomeMode() {
  document.getElementById('home-mode-tabs').hidden = !!challenge;
  document.getElementById('free-play-controls').hidden = !!challenge || homeMode !== 'play';
  document.getElementById('daily-panel').hidden = challenge ? !challenge.completed : homeMode !== 'daily';
  document.getElementById('scan-panel').hidden = !!challenge || homeMode !== 'scan';
}

function renderChallengeControls() {
  const lesson = challenge?.kind === 'lesson';
  const playing = challenge && !challenge.completed;
  const date = dailyDate();
  const today = challengeData.days[date];
  const dailyLabel = today?.draft ? 'Resume Daily 3 Moves'
    : today?.best ? 'Daily 3 Moves · Completed' : 'Daily 3 Moves';
  challengeButton.hidden = !!playing;
  challengeButton.textContent = t(challenge?.kind === 'daily' ? 'Try again' : dailyLabel);
  bonusButton.hidden = !today?.best || !!playing || (challenge?.date != null && challenge.date !== date);
  bonusButton.textContent = t(dailyBonusLabel(date));
  bonusRestartButton.hidden = !(playing && challenge.kind === 'bonus');
  document.getElementById('game-title').textContent = t(CHALLENGE_TITLES[challenge?.kind] ?? 'Cubie');
  document.getElementById('challenge-controls').hidden = !challenge;
  document.getElementById('btn-lesson-scan').hidden = !lesson || !playing;
  lessonButton.hidden = !lesson || !playing;
  lessonButton.disabled = undoStack.length !== 0;
  hintButton.hidden = lesson || !playing;
  document.getElementById('btn-reset').hidden = !!challenge;
  document.getElementById('btn-practice').hidden = lesson && !!playing;
  renderHomeMode();
  refreshScanResumeControls();
  updateUndoRedoButtons();
}

function dailyBonusLabel(date) {
  const bonus = challengeData.bonusDays[date];
  if (bonus?.draft) return 'Resume Daily 5 Moves';
  return bonus?.best ? 'Replay Daily 5 Moves' : 'Daily 5 Moves';
}

function scanFromHome(start = startScanFlow) {
  if (!challenge || (challenge.kind === 'lesson' && exitChallenge())) {
    saveFreePlaySession();
    start();
  }
}

function setChallengeMessage(message, values) {
  document.getElementById('challenge-message').textContent = t(message, values);
}

function showDailyCompletion() {
  const { kind, date, hints } = challenge;
  const today = date === dailyDate();
  const bonus = kind === 'bonus';
  const offerBonus = !bonus && today;
  const message = offerBonus ? 'Try today’s 5-move challenge.'
    : today ? 'A new puzzle arrives tomorrow.' : 'Puzzle completed.';
  setChallengeMessage(message);

  const details = [hints ? t('Hints used: {count}', { count: hints }) : t('No hints used')];
  if (bonus) details.push(t('Best · {count} moves', { count: challengeData.bonusDays[date].best.moves }));
  if (today) details.push(t(message));

  let actions = { action: 'Try again', onAgain: () => startDailyChallenge(date) };
  if (bonus) {
    actions = {
      action: 'Replay Daily 5 Moves',
      onAgain: () => startDailyBonusChallenge(date),
      secondary: { label: 'Free play', onClick: exitChallenge },
    };
  } else if (offerBonus) {
    actions = {
      action: dailyBonusLabel(date),
      onAgain: () => startDailyBonusChallenge(date),
      secondary: { label: 'Replay Daily 3 Moves', onClick: () => startDailyChallenge(date) },
    };
  }
  showSolvedOverlay(null, moveCount, null, {
    title: bonus ? 'Daily 5 Moves complete!' : today ? 'Today’s cube is solved!' : 'Puzzle solved!',
    detail: details.join(' · '),
    ...actions,
  });
}

function updateChallengeProgress() {
  if (!challenge || challenge.completed) return;
  clearChallengeArrow();
  const lesson = challenge.kind === 'lesson';
  const solved = isCubeSolved();
  if (solved) {
    challenge.completed = true;
    if (lesson) challengeData.lessonSeen = true;
    else recordDailyCompletion();
    saveChallengeData();
    if (lesson) {
      const message = 'Try today’s puzzle next.';
      setChallengeMessage(message);
      showSolvedOverlay(null, moveCount, null, {
        title: 'Your first solve!',
        detail: t(message),
        action: 'Daily 3 Moves',
        onAgain: startDailyChallenge,
      });
    } else {
      showDailyCompletion();
    }
  } else if (lesson) {
    const firstMove = undoStack.length === 0;
    setChallengeMessage(firstMove ? 'One turn to go! Follow the arrow on the top layer.'
      : 'Undo the last move to get back on track.');
    drawChallengeArrow(firstMove ? LESSON_MOVE : inverseMoveOf(undoStack[undoStack.length - 1].moveName));
  } else {
    saveDailyDraft();
    if (challenge.kind === 'bonus') setChallengeMessage('Solve the cube in five moves.');
    else if (challenge.date === dailyDate()) setChallengeMessage('Solve the cube in three moves.');
    else setChallengeMessage('Puzzle for {date} · Solve the cube in three moves.', {
      date: dailyDateFormat.format(challenge.date * DAY_MS),
    });
  }
  renderChallengeControls();
}

function saveDailyDraft() {
  dailyEntries(challenge.kind)[challenge.date].draft = {
    hints: challenge.hints,
    moves: undoStack.map(entry => entry.moveName),
  };
  saveChallengeData();
}

function recordDailyCompletion() {
  const entry = dailyEntries(challenge.kind)[challenge.date];
  const best = entry.best;
  if (best?.moves === undefined || moveCount < best.moves ||
      (moveCount === best.moves && challenge.hints < best.hints)) {
    entry.best = { moves: moveCount, hints: challenge.hints };
  }
  delete entry.draft;
}

function openDailyHistory() {
  if (challengeBusy() || dailyHistoryDialog.open) return;
  renderDailyHistory();
  dailyHistoryDialog.showModal();
}

function closeDailyHistory() {
  if (!dailyHistoryDialog.open) return false;
  dailyHistoryDialog.close();
  return true;
}

function renderDailyHistory() {
  const today = dailyDate();
  const list = document.getElementById('daily-history-list');
  list.replaceChildren();
  for (let date = today; date > today - 7; date--) {
    const entry = challengeData.days[date];
    const best = entry?.best;
    const calendarDate = new Date(date * DAY_MS);
    const dateLabel = dailyDateFormat.format(calendarDate);
    const time = document.createElement('time');
    time.dateTime = calendarDate.toISOString().slice(0, 10);
    time.textContent = date === today ? t('Today · {date}', { date: dateLabel }) : dateLabel;

    const status = document.createElement('span');
    status.className = 'daily-history-status';
    if (best?.moves !== undefined) {
      status.textContent = [
        t('Best · {count} moves', { count: best.moves }),
        t(best.hints ? 'Hint used' : 'No hints used'),
      ].join(' · ');
    } else if (best) {
      status.textContent = t('Completed · Details unavailable');
    } else {
      status.textContent = t(entry?.draft ? 'In progress' : 'Not solved');
    }

    const info = document.createElement('span');
    info.append(time, status);
    const action = document.createElement('span');
    action.className = 'daily-history-action';
    action.textContent = t(entry?.draft ? 'Resume puzzle' : best ? 'Replay puzzle' : 'Play puzzle');

    const button = document.createElement('button');
    button.type = 'button';
    button.append(info, action);
    button.addEventListener('click', () => {
      if (startDailyChallenge(date)) closeDailyHistory();
    });
    const item = document.createElement('li');
    item.append(button);
    list.append(item);
  }
}

function turnLessonLayer() {
  if (challenge?.kind !== 'lesson' || challenge.completed || undoStack.length || challengeBusy()) return;
  performAnimatedMove(LESSON_MOVE, null, 220);
}

function showChallengeHint() {
  if (!challenge || challenge.kind === 'lesson' || challenge.completed || challengeArrow || challengeBusy()) return;
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
  if (!document.hidden && dailyHistoryDialog.open) renderDailyHistory();
});

const options = document.getElementById('app-options');
document.addEventListener('pointerdown', event => {
  if (!options.contains(event.target)) options.open = false;
});

document.addEventListener('keydown', event => {
  const current = HOME_MODES.indexOf(homeMode);
  if (event.target !== document.getElementById(`btn-mode-${homeMode}`)) return;
  const offsets = { ArrowLeft: -1, ArrowRight: 1 };
  let next;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = HOME_MODES.length - 1;
  else if (event.key in offsets) next = (current + offsets[event.key] + HOME_MODES.length) % HOME_MODES.length;
  else return;
  event.preventDefault();
  selectHomeMode(HOME_MODES[next], true);
});

if (restoreFreePlaySession()) {
  renderChallengeControls();
} else if (!challengeData.lessonSeen && !getSolveHistory().length) {
  startLesson();
} else {
  renderChallengeControls();
}
