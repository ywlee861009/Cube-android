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

function clearScanFace(faceIndex) {
  if (Number.isInteger(faceIndex) && faceIndex >= 0 && faceIndex < 6) {
    scanFaceSamples[faceIndex] = null;
  }
}

// 저조도 판정용 CIELAB 명도(L*) 계산. color-classify의 rgbToLab와 같은 sRGB→L* 경로를
// 자립적으로 계산해 Jest에서 단독으로 검증할 수 있게 한다.
// SCAN_DARK_LSTAR은 실기기 조명 매트릭스(Phase 8) 실측 후 보정할 잠정 임계값이다.
const SCAN_DARK_LSTAR = 32;

function sampleLstar(rgb) {
  const linear = rgb.map(value => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  const y = linear[0] * 0.2126729 + linear[1] * 0.7151522 + linear[2] * 0.0721750;
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.2963 * y;
}

function meanScanLstar(samples) {
  if (!Array.isArray(samples) || samples.length === 0) return 0;
  const total = samples.reduce((sum, rgb) => sum + sampleLstar(rgb), 0);
  return total / samples.length;
}

function isScanTooDark(samples, threshold = SCAN_DARK_LSTAR) {
  return meanScanLstar(samples) < threshold;
}

if (typeof module !== 'undefined') {
  module.exports = {
    onFaceSampled,
    getCollectedScanSamples,
    clearScanSamples,
    clearScanFace,
    scanFaceSamples,
    sampleLstar,
    meanScanLstar,
    isScanTooDark,
    SCAN_DARK_LSTAR
  };
}
