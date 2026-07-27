const {
  classifyFacelets,
  rgbToLab
} = require('../app/src/main/assets/js/scan/color-classify');

const COLORS = [
  [255, 255, 255],
  [255, 34, 0],
  [0, 204, 68],
  [255, 221, 0],
  [255, 119, 0],
  [0, 85, 255]
];

function syntheticSamples(transform = value => value) {
  return Array.from({ length: 54 }, (_, index) => {
    const face = Math.floor(index / 9);
    const noise = ((index * 37) % 11) - 5;
    return COLORS[face].map((value, channel) =>
      Math.max(0, Math.min(255, Math.round(transform(value, channel) + noise)))
    );
  });
}

const EXPECTED = Array.from({ length: 54 }, (_, index) => Math.floor(index / 9));

describe('classifyFacelets', () => {
  test.each([
    ['기본 노이즈', value => value],
    ['밝기 70%', value => value * 0.7],
    ['따뜻한 색온도', (value, channel) => value * (channel === 0 ? 1.15 : channel === 2 ? 0.85 : 1)]
  ])('%s 합성 샘플을 분류한다', (_, transform) => {
    const result = classifyFacelets(syntheticSamples(transform));
    expect(result.facelets).toEqual(EXPECTED);
    expect(result.centerMap).toEqual([0, 1, 2, 3, 4, 5]);
    expect(result.confidence).toHaveLength(54);
    expect(result.confidence.every(value => value >= 0 && value <= 1)).toBe(true);
  });

  test('각 색을 정확히 9개로 제약한다', () => {
    const result = classifyFacelets(syntheticSamples());
    const counts = Array(6).fill(0);
    result.facelets.forEach(color => counts[color]++);
    expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
  });

  test('같은 입력에 결정적이다', () => {
    const samples = syntheticSamples();
    const first = classifyFacelets(samples);
    for (let i = 0; i < 100; i++) {
      expect(classifyFacelets(samples)).toEqual(first);
    }
  });

  test('비표준 물리 배색도 촬영 면 센터를 기준으로 정규화한다', () => {
    const order = [3, 5, 1, 0, 2, 4];
    const samples = Array.from({ length: 54 }, (_, index) =>
      COLORS[order[Math.floor(index / 9)]].slice()
    );
    expect(classifyFacelets(samples).facelets).toEqual(EXPECTED);
  });

  test('RGB를 CIELAB으로 유한 변환한다', () => {
    expect(rgbToLab([255, 255, 255]).every(Number.isFinite)).toBe(true);
    expect(rgbToLab([0, 0, 0]).every(Number.isFinite)).toBe(true);
  });
});
