const {
  sampleLstar,
  meanScanLstar,
  isScanTooDark,
  SCAN_DARK_LSTAR
} = require('../app/src/main/assets/js/scan/scan-capture');

// 표준 배색 6색 (constants.js FACE_COLORS와 동일)
const COLORS = [
  [255, 255, 255],
  [255, 34, 0],
  [0, 204, 68],
  [255, 221, 0],
  [255, 119, 0],
  [0, 85, 255]
];

function fullCube(transform = value => value) {
  return Array.from({ length: 54 }, (_, index) => {
    const face = Math.floor(index / 9);
    return COLORS[face].map(value => Math.max(0, Math.min(255, Math.round(transform(value)))));
  });
}

describe('sampleLstar', () => {
  test('흰색은 L*가 100 근처', () => {
    expect(sampleLstar([255, 255, 255])).toBeCloseTo(100, 0);
  });

  test('검정은 L*가 0', () => {
    expect(sampleLstar([0, 0, 0])).toBeCloseTo(0, 5);
  });

  test('밝을수록 L*가 커진다', () => {
    expect(sampleLstar([200, 200, 200])).toBeGreaterThan(sampleLstar([60, 60, 60]));
  });
});

describe('meanScanLstar', () => {
  test('빈 입력은 0', () => {
    expect(meanScanLstar([])).toBe(0);
    expect(meanScanLstar(null)).toBe(0);
  });
});

describe('isScanTooDark', () => {
  test('정상 조명의 완성 큐브는 어둡다고 보지 않는다', () => {
    expect(isScanTooDark(fullCube())).toBe(false);
  });

  test('20%로 어두워진 큐브는 저조도로 판정한다', () => {
    expect(isScanTooDark(fullCube(value => value * 0.2))).toBe(true);
  });

  test('임계값 경계 동작', () => {
    const dim = fullCube(value => value * 0.5);
    expect(isScanTooDark(dim, 100)).toBe(true);
    expect(isScanTooDark(dim, 0)).toBe(false);
    expect(SCAN_DARK_LSTAR).toBeGreaterThan(0);
  });
});
