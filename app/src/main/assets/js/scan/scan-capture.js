// CameraX에서 전달된 면별 RGB 샘플을 보관한다. 색 판정은 color-classifier의 책임이다.
const scanFaceSamples = Array(6).fill(null);

function onFaceSampled(faceIndex, rgbJson) {
  if (!Number.isInteger(faceIndex) || faceIndex < 0 || faceIndex >= 6) return;
  try {
    const samples = JSON.parse(rgbJson);
    if (!Array.isArray(samples) || samples.length !== 9 ||
        samples.some(rgb => !Array.isArray(rgb) || rgb.length !== 3 ||
          rgb.some(channel => !Number.isInteger(channel) || channel < 0 || channel > 255))) {
      throw new Error('Invalid RGB sample payload');
    }
    scanFaceSamples[faceIndex] = samples.map(rgb => rgb.slice());
    window.dispatchEvent(new CustomEvent('scan-face-sampled', {
      detail: { faceIndex, samples: scanFaceSamples[faceIndex] }
    }));
  } catch (error) {
    onFaceSampleFailed(faceIndex, 'invalid_payload');
  }
}

function onFaceSampleFailed(faceIndex, reason) {
  window.dispatchEvent(new CustomEvent('scan-face-sample-failed', {
    detail: { faceIndex, reason }
  }));
}

function captureScanFace(faceIndex) {
  if (!window.AndroidBridge?.captureFace) {
    onFaceSampleFailed(faceIndex, 'bridge_unavailable');
    return;
  }
  AndroidBridge.captureFace(faceIndex);
}

function getCollectedScanSamples() {
  if (scanFaceSamples.some(face => face === null)) return null;
  return scanFaceSamples.flatMap(face => face.map(rgb => rgb.slice()));
}

function clearScanSamples() {
  scanFaceSamples.fill(null);
}

if (typeof module !== 'undefined') {
  module.exports = {
    onFaceSampled,
    getCollectedScanSamples,
    clearScanSamples,
    scanFaceSamples
  };
}
