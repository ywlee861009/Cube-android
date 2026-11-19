const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const assets = path.join(__dirname, '../app/src/main/assets/js');
const scripts = [
  'constants.js', 'logic.js', 'scan/cube-validate.js', 'scan/scan-orientation.js',
  'scan/scan-review.js', 'scan/scan-persistence.js', 'scan/scan-manual.js'
].map(file => fs.readFileSync(path.join(assets, file), 'utf8'));

function loadManualScan(storage = new Map()) {
  const elements = new Map();
  const document = { activeElement: null };
  function createElement() {
    return {
      children: [], properties: {}, style: {},
      classList: { add() {}, remove() {}, toggle() {} },
      appendChild(child) {
        this.children.push(child);
        child.parentElement = this;
      },
      replaceChildren(...children) {
        this.children = [];
        children.forEach(child => this.appendChild(child));
      },
      setAttribute(name, value) { this.properties[name] = value; },
      addEventListener(type, handler) { this[type] = handler; },
      contains(child) { return this.children.includes(child); },
      focus() { document.activeElement = this; },
      showModal() { this.open = true; },
      close() { this.open = false; }
    };
  }
  Object.assign(document, {
    createElement,
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElement());
      return elements.get(id);
    },
    addEventListener() {}
  });
  const applyScan = jest.fn(() => ({ ok: true }));
  const solve = jest.fn();
  const context = vm.createContext({
    document,
    t: (key, values = {}) => key.replace(/\{(\w+)\}/g, (_, name) => values[name]),
    localizedValidationMessage: result => result.message,
    canOpenScanFlow: () => true,
    isChallengeActive: () => false,
    isScanSolve: false,
    pendingScanResult: null,
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    applyScannedFacelets: applyScan,
    solveCube: solve,
    setStatus() {}
  });
  const evaluate = code => vm.runInContext(code, context);
  evaluate(scripts.join('\n'));
  evaluate('const SCAN_STEPS = buildScanSequence();');
  return { evaluate, document, storage, applyScan, solve };
}

test('manual entry needs no camera and restores the first entered sticker with palette focus', () => {
  const editor = loadManualScan();
  const { evaluate, document } = editor;
  expect(evaluate('startManualScanFlow()')).toBe(true);
  expect(document.getElementById('scan-review-overlay').open).toBe(true);
  expect(evaluate('selectedReviewIndex')).toBe(4);
  expect(document.getElementById('btn-scan-apply').disabled).toBe(true);

  const palette = document.getElementById('scan-palette');
  palette.children[2].focus();
  palette.children[2].onclick();
  expect(document.activeElement).toBe(palette.children[2]);
  expect(evaluate('selectedReviewIndex')).toBe(0);
  expect(evaluate('manualScanColors[4]')).toBe(2);
  document.getElementById('scan-review-overlay').cancel({ preventDefault() {} });
  expect(document.getElementById('scan-review-overlay').open).toBe(false);

  const reopened = loadManualScan(editor.storage);
  expect(reopened.evaluate('resumeSavedScan()')).toBe(true);
  expect(reopened.evaluate('manualScanColors[4]')).toBe(2);
  expect(reopened.evaluate('selectedReviewIndex')).toBe(0);
  expect(reopened.document.getElementById('scan-review-badge').textContent).toBe('1/54 stickers entered');
});

test('the next face uses the scan orientation sequence after nine stickers', () => {
  const editor = loadManualScan();
  editor.evaluate('startManualScanFlow()');
  const nextFace = editor.document.getElementById('btn-scan-retake-face');
  expect(nextFace.disabled).toBe(true);
  editor.evaluate('for (let i = 0; i < 9; i++) setReviewCellColor(0);');
  expect(nextFace.disabled).toBe(false);
  nextFace.onclick = () => editor.evaluate('retakeSelectedScanFace()');
  nextFace.onclick();
  expect(editor.evaluate('selectedReviewFace')).toBe(2);
  expect(editor.evaluate('selectedReviewIndex')).toBe(22);
});

test('a valid scramble is mapped by chosen centers before passing to the guided solver', () => {
  const editor = loadManualScan();
  const position = editor.evaluate(`
    const scrambled = Array.from({ length: 54 }, (_, i) => Math.floor(i / 9));
    applyMoveInPlace('R', scrambled);
    applyMoveInPlace('U', scrambled);
    const colors = [5, 0, 4, 1, 3, 2];
    openManualScanReview(scrambled.map(color => colors[color]));
    scrambled;
  `);
  expect(editor.document.getElementById('btn-scan-apply').disabled).toBe(false);
  editor.evaluate('confirmScanReview()');
  expect(editor.applyScan).toHaveBeenCalledWith(position, [
    '#0055FF', '#FFFFFF', '#FF7700', '#FF2200', '#FFDD00', '#00CC44'
  ]);
  expect(editor.solve).toHaveBeenCalledTimes(1);
});

test('duplicate center colors are highlighted and cannot be submitted', () => {
  const editor = loadManualScan();
  editor.evaluate(`
    openManualScanReview(Array(54).fill(null));
    selectReviewCell(4);
    setReviewCellColor(0);
    selectReviewCell(13);
    setReviewCellColor(0);
    confirmScanReview();
  `);
  expect(editor.evaluate('reviewValidation.badIndices')).toEqual([4, 13]);
  expect(editor.document.getElementById('btn-scan-apply').disabled).toBe(true);
  expect(editor.applyScan).not.toHaveBeenCalled();
  expect(editor.solve).not.toHaveBeenCalled();
});
