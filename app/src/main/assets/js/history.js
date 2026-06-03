// ─── Undo / Redo 히스토리 ──────────────────────────────────────────────────
const undoStack = [];  // { moveName, moveCount }
const redoStack = [];
let isUndoRedo = false;

function inverseMoveOf(name) {
  if (name.endsWith("2")) return name;          // U2의 역은 U2
  return name.endsWith("'") ? name.slice(0, -1) : name + "'";
}

function undoCube() {
  if (undoStack.length === 0 || isShuffling || isSolving || isUndoRedo) return;
  isUndoRedo = true;
  updateUndoRedoButtons();
  const entry = undoStack.pop();
  performAnimatedMove(inverseMoveOf(entry.moveName), () => {
    try {
      setMoveCount(entry.moveCount);
      redoStack.push(entry);
    } finally {
      isUndoRedo = false;
      updateUndoRedoButtons();
    }
  });
}

function redoCube() {
  if (redoStack.length === 0 || isShuffling || isSolving || isUndoRedo) return;
  isUndoRedo = true;
  updateUndoRedoButtons();
  const entry = redoStack.pop();
  performAnimatedMove(entry.moveName, () => {
    try {
      undoStack.push(entry);
    } finally {
      isUndoRedo = false;
      updateUndoRedoButtons();
    }
  });
}
