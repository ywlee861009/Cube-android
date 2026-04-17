// ─── Undo / Redo 히스토리 ──────────────────────────────────────────────────
const undoStack = [];  // { moveName, moveCount }
const redoStack = [];
let isUndoRedo = false;

function inverseMoveOf(name) {
  return name.endsWith("'") ? name.slice(0, -1) : name + "'";
}

function undoCube() {
  if (undoStack.length === 0 || isShuffling || isSolving || isUndoRedo) return;
  isUndoRedo = true;
  updateUndoRedoButtons();
  const entry = undoStack.pop();
  performAnimatedMove(inverseMoveOf(entry.moveName), () => {
    setMoveCount(entry.moveCount);
    redoStack.push(entry);
    isUndoRedo = false;
    updateUndoRedoButtons();
  });
}

function redoCube() {
  if (redoStack.length === 0 || isShuffling || isSolving || isUndoRedo) return;
  isUndoRedo = true;
  updateUndoRedoButtons();
  const entry = redoStack.pop();
  performAnimatedMove(entry.moveName, () => {
    undoStack.push(entry);
    isUndoRedo = false;
    updateUndoRedoButtons();
  });
}
