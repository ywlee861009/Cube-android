const {
  classifyFacelets,
  rgbToLab,
  labToRgb,
  SIMILAR_CENTERS_DELTA_E,
  OVEREXPOSED_L,
  LOW_LIGHT_L
} = require('../app/src/main/assets/js/scan/color-classify');

const COLORS = [
  [255, 255, 255],
  [255, 34, 0],
  [0, 204, 68],
  [255, 221, 0],
  [255, 119, 0],
  [0, 85, 255]
];

// 보라·분홍·청록을 포함하고 기본 배색의 인접/반대 관계와 다른 비표준 팔레트.
const NONSTANDARD_COLORS = [
  [242, 242, 236],
  [138, 43, 226],
  [0, 206, 209],
  [255, 105, 180],
  [255, 140, 0],
  [34, 60, 160]
];

function paletteSamples(palette, transform = value => value) {
  return Array.from({ length: 54 }, (_, index) => {
    const face = Math.floor(index / 9);
    const noise = ((index * 37) % 11) - 5;
    return palette[face].map((value, channel) =>
      Math.max(0, Math.min(255, Math.round(transform(value, channel) + noise)))
    );
  });
}

const warningCodes = result => result.warnings.map(warning => warning.code);

const syntheticSamples = (transform = value => value) => paletteSamples(COLORS, transform);

const EXPECTED = Array.from({ length: 54 }, (_, index) => Math.floor(index / 9));

describe('classifyFacelets', () => {
  test.each([
    ['기본 노이즈', value => value],
    ['밝기 70%', value => value * 0.7],
    ['따뜻한 색온도', (value, channel) => value * (channel === 0 ? 1.15 : channel === 2 ? 0.85 : 1)]
  ])('%s 합성 샘플을 분류한다', (_, transform) => {
    const result = classifyFacelets(syntheticSamples(transform));
    expect(result.facelets).toEqual(EXPECTED);
    expect(result.confidence).toHaveLength(54);
    expect(result.confidence.every(value => value >= 0 && value <= 1)).toBe(true);
  });

  test('centerMap 을 더 이상 반환하지 않는다', () => {
    // 촬영 슬롯이 곧 내부 면 인덱스라 항등 배열이었다. 남겨두면 여기서 순열이
    // 일어난다는 잘못된 신호를 준다 (overview 결정 2).
    expect(classifyFacelets(syntheticSamples())).not.toHaveProperty('centerMap');
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

describe('labToRgb', () => {
  test.each([...COLORS, ...NONSTANDARD_COLORS, [0, 0, 0], [128, 128, 128]])(
    '%p 를 왕복 변환해도 값이 보존된다',
    (...rgb) => {
      expect(labToRgb(rgbToLab(rgb))).toEqual(rgb);
    }
  );

  test('범위를 벗어나는 Lab 도 0~255 로 클램프한다', () => {
    labToRgb([150, 200, -200]).forEach(channel => {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
      expect(Number.isInteger(channel)).toBe(true);
    });
  });
});

describe('세션 팔레트', () => {
  test('팔레트가 촬영한 센터 색을 근사한다', () => {
    const result = classifyFacelets(paletteSamples(NONSTANDARD_COLORS));
    expect(result.palette).toHaveLength(6);
    result.palette.forEach((rgb, face) => {
      rgb.forEach((channel, index) => {
        expect(Math.abs(channel - NONSTANDARD_COLORS[face][index])).toBeLessThan(12);
      });
    });
  });

  test('보라·분홍·청록 팔레트를 정규화한다', () => {
    expect(classifyFacelets(paletteSamples(NONSTANDARD_COLORS)).facelets).toEqual(EXPECTED);
  });

  test('비표준 팔레트도 각 색을 정확히 9개로 배정한다', () => {
    const counts = Array(6).fill(0);
    classifyFacelets(paletteSamples(NONSTANDARD_COLORS)).facelets.forEach(c => counts[c]++);
    expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
  });

  test('밝기·색온도 편향 후에도 팔레트와 매핑이 유지된다', () => {
    const warm = classifyFacelets(
      paletteSamples(NONSTANDARD_COLORS, (v, ch) => v * (ch === 0 ? 1.15 : ch === 2 ? 0.85 : 1))
    );
    expect(warm.facelets).toEqual(EXPECTED);
    expect(warm.palette).toHaveLength(6);
  });

  test('separation 은 각 센터와 최근접 타 센터의 거리다', () => {
    const { separation } = classifyFacelets(syntheticSamples());
    expect(separation).toHaveLength(6);
    separation.forEach(value => expect(value).toBeGreaterThan(0));
    // 기본 배색의 최소 쌍은 빨(1)/주(4) 이고 서로 같은 값을 가져야 한다
    expect(separation[1]).toBeCloseTo(separation[4], 5);
    expect(Math.min(...separation)).toBeCloseTo(separation[1], 5);
  });

  test('결정론성이 유지된다 (팔레트·경고 포함)', () => {
    const samples = paletteSamples(NONSTANDARD_COLORS);
    const first = classifyFacelets(samples);
    for (let i = 0; i < 100; i++) {
      expect(classifyFacelets(samples)).toEqual(first);
    }
  });
});

describe('경고', () => {
  test('표준 배색에서는 어떤 경고도 발생하지 않는다 (회귀 가드)', () => {
    expect(classifyFacelets(syntheticSamples()).warnings).toEqual([]);
  });

  test('비표준 팔레트에서도 경고가 없다', () => {
    expect(classifyFacelets(paletteSamples(NONSTANDARD_COLORS)).warnings).toEqual([]);
  });

  test('구분이 어려운 두 센터에 SIMILAR_CENTERS 를 낸다', () => {
    const tight = NONSTANDARD_COLORS.map(c => c.slice());
    tight[4] = [140, 46, 222]; // 보라(면 1)와 거의 같은 색
    const result = classifyFacelets(paletteSamples(tight));
    expect(warningCodes(result)).toContain('SIMILAR_CENTERS');
    const warning = result.warnings.find(w => w.code === 'SIMILAR_CENTERS');
    expect(warning.faces.sort()).toEqual([1, 4]);
    expect(warning.detail.deltaE).toBeLessThan(SIMILAR_CENTERS_DELTA_E);
  });

  test('여러 센터가 흰색에 수렴하면 CENTER_OVEREXPOSED 를 낸다', () => {
    const washed = [
      [255, 255, 255], [252, 250, 252], [250, 253, 251],
      [255, 119, 0], [0, 85, 255], [0, 204, 68]
    ];
    const result = classifyFacelets(paletteSamples(washed));
    const warning = result.warnings.find(w => w.code === 'CENTER_OVEREXPOSED');
    expect(warning).toBeDefined();
    expect(warning.faces.length).toBeGreaterThanOrEqual(2);
    warning.detail.lightness.forEach(l => expect(l).toBeGreaterThanOrEqual(OVEREXPOSED_L));
  });

  test('흰 면 하나만 밝은 것은 과노출이 아니다', () => {
    expect(warningCodes(classifyFacelets(syntheticSamples())))
      .not.toContain('CENTER_OVEREXPOSED');
  });

  test('전체가 어두우면 LOW_LIGHT 를 낸다', () => {
    const result = classifyFacelets(syntheticSamples(value => value * 0.12));
    const warning = result.warnings.find(w => w.code === 'LOW_LIGHT');
    expect(warning).toBeDefined();
    expect(warning.detail.meanLightness).toBeLessThan(LOW_LIGHT_L);
  });

  test('임계값은 상수로 노출되며 표준 배색 기준선 아래에 있다', () => {
    // 기본 FACE_COLORS 최소 쌍거리 31.8, 흰 제외 최대 L* 88.4, 평균 L* 70.7
    expect(SIMILAR_CENTERS_DELTA_E).toBeLessThan(31.8);
    expect(OVEREXPOSED_L).toBeGreaterThan(88.4);
    expect(LOW_LIGHT_L).toBeLessThan(70.7);
  });
});

// tests/fixtures/scan-samples/*.json 을 전부 읽는다. 실측 fixture 를 확보하면
// 파일만 떨어뜨려도 커버리지가 늘어난다 — 이 파일은 고치지 않는다.
describe('fixture', () => {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, 'fixtures', 'scan-samples');
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.json'));

  test('fixture 가 최소 1개 있다', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  describe.each(files)('%s', file => {
    const fixture = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));

    test('형식이 올바르다', () => {
      expect(fixture.samples).toHaveLength(54);
      expect(fixture.expectedFacelets).toHaveLength(54);
      expect(['synthetic', 'device']).toContain(fixture.source);
      expect(typeof fixture.note).toBe('string');
    });

    test('기대한 facelets 로 정규화된다', () => {
      expect(classifyFacelets(fixture.samples).facelets).toEqual(fixture.expectedFacelets);
    });

    test('각 색이 정확히 9개다', () => {
      const counts = Array(6).fill(0);
      classifyFacelets(fixture.samples).facelets.forEach(color => counts[color]++);
      expect(counts).toEqual([9, 9, 9, 9, 9, 9]);
    });

    test('기대한 경고만 발생한다', () => {
      expect(warningCodes(classifyFacelets(fixture.samples)).sort())
        .toEqual((fixture.expectWarnings || []).slice().sort());
    });
  });
});
