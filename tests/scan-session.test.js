const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const scanDirectory = path.join(__dirname, '../app/src/main/assets/js/scan');
const scripts = ['scan-orientation.js', 'scan-capture.js', 'scan-ui.js']
  .map(file => fs.readFileSync(path.join(scanDirectory, file), 'utf8'));
const rgbFace = value => Array.from({ length: 9 }, () => [value, 30, 10]);

function loadScanner() {
  const nodes = new Map();
  const createElement = () => ({
    classList: { add() {}, remove() {} }, style: {},
    append() {}, replaceChildren() {}
  });
  const startScan = jest.fn();
  const captureFace = jest.fn();
  const review = jest.fn();
  const timers = [];
  const context = vm.createContext({
    window: {
      AndroidBridge: { startScan, captureFace, stopScan() {} },
      dispatchEvent() {}
    },
    document: {
      getElementById(id) {
        if (id === 'scan-3d-guide') return null;
        if (!nodes.has(id)) nodes.set(id, createElement());
        return nodes.get(id);
      },
      createElement,
      body: createElement()
    },
    CustomEvent: class {},
    t: key => key,
    setTimeout(callback) { return timers.push(callback); },
    // Invoke even cleared callbacks below to cover work already queued for the old step.
    clearTimeout() {},
    requestAnimationFrame() { return 1; },
    isScanning: false,
    isShuffling: false,
    isSolving: false,
    isUndoRedo: false,
    isChallengeActive() { return false; },
    pauseRendering() {},
    resumeRendering() {},
    dropScanManualOverridesForFace() {},
    updateUndoRedoButtons() {},
    classifyFacelets(samples) { return { facelets: samples }; },
    validateFacelets() { return { ok: true }; },
    openScanReview: review,
    setStatus() {}
  });
  const evaluate = code => vm.runInContext(code, context);
  evaluate(scripts.join('\n'));
  return { nodes, evaluate, startScan, captureFace, review, timers };
}

function begin(scanner) {
  scanner.evaluate('startScanFlow()');
  const [sessionId] = scanner.startScan.mock.lastCall;
  scanner.evaluate(`onScanReady(${sessionId})`);
  return sessionId;
}

function capture(scanner) {
  scanner.evaluate('captureCurrentScanFace()');
  return scanner.captureFace.mock.lastCall;
}

function deliver(scanner, [sessionId, captureId, faceIndex], value) {
  const payload = JSON.stringify(rgbFace(value));
  scanner.evaluate(`onFaceSampled(${sessionId}, ${captureId}, ${faceIndex}, '${payload}')`);
}

test('going back cancels queued advance while keeping photos of the other faces', () => {
  const scanner = loadScanner();
  begin(scanner);
  deliver(scanner, capture(scanner), 10);
  scanner.timers.shift()();
  expect(scanner.evaluate('currentScanStep')).toBe(1);
  deliver(scanner, capture(scanner), 20);
  expect(scanner.nodes.get('btn-scan-capture').disabled).toBe(true);

  scanner.evaluate('retakePreviousScanFace()');
  scanner.timers.shift()();
  expect(scanner.evaluate('currentScanStep')).toBe(0);
  expect(scanner.nodes.get('btn-scan-capture').disabled).toBe(false);
  deliver(scanner, capture(scanner), 30);
  scanner.timers.shift()();
  expect(scanner.evaluate('currentScanStep')).toBe(2);
  expect(scanner.evaluate('scanFaceSamples[SCAN_STEPS[1].slot][0][0]')).toBe(20);
});

test('reopening scan rejects old ready, sample, and cancellation callbacks for the same face', () => {
  const scanner = loadScanner();
  const oldSession = begin(scanner);
  const oldCapture = capture(scanner);
  scanner.evaluate('cancelScanFlow(); startScanFlow()');
  const [newSession] = scanner.startScan.mock.lastCall;
  scanner.evaluate(`onScanReady(${oldSession})`);
  expect(scanner.nodes.get('btn-scan-capture').disabled).toBe(true);

  scanner.evaluate(`onScanReady(${newSession})`);
  const newCapture = capture(scanner);
  deliver(scanner, oldCapture, 10);
  scanner.evaluate(`onScanCancelled(${oldSession}, 'camera_error')`);
  expect(scanner.evaluate('isScanning')).toBe(true);
  expect(scanner.evaluate('scanFaceSamples[0]')).toBeNull();
  expect(scanner.nodes.get('btn-scan-capture').disabled).toBe(true);

  deliver(scanner, newCapture, 20);
  expect(scanner.evaluate('scanFaceSamples[0][0][0]')).toBe(20);
});

test('a duplicate response from an old capture cannot overwrite a later retake', () => {
  const scanner = loadScanner();
  begin(scanner);
  deliver(scanner, capture(scanner), 10);
  scanner.timers.shift()();
  const discarded = capture(scanner);
  scanner.evaluate('retakePreviousScanFace()');
  deliver(scanner, capture(scanner), 30);
  scanner.timers.shift()();
  const inProgress = capture(scanner);

  deliver(scanner, discarded, 20);
  scanner.evaluate(`onFaceSampleFailed(${discarded.join(',')}, 'frame_unavailable')`);
  expect(scanner.evaluate('scanFaceSamples[currentScanSlot()]')).toBeNull();
  expect(scanner.nodes.get('btn-scan-capture').disabled).toBe(true);

  deliver(scanner, inProgress, 40);
  expect(scanner.evaluate('scanFaceSamples[currentScanSlot()][0][0]')).toBe(40);
});

test('after the last step, only a missing face needs to be captured', () => {
  const scanner = loadScanner();
  begin(scanner);
  scanner.evaluate(`
    SCAN_STEPS.forEach(({ slot }, step) => {
      if (step !== 1 && step !== 5) scanFaceSamples[slot] = Array(9).fill([slot, 0, 0]);
    });
    currentScanStep = 5;
  `);
  deliver(scanner, capture(scanner), 60);
  scanner.timers.shift()();
  expect(scanner.evaluate('currentScanStep')).toBe(1);
  expect(scanner.nodes.get('scan-message').textContent).toBe('Capture the missing face.');

  deliver(scanner, capture(scanner), 90);
  expect(scanner.review).toHaveBeenCalledTimes(1);
  expect(scanner.review.mock.lastCall[0].facelets).toHaveLength(54);
  expect(scanner.evaluate('isScanning')).toBe(false);
});
