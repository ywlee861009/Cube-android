const {
  FACE_COLORS,
  setActiveFaceColors,
  resetActiveFaceColors,
  isDefaultFacePalette,
  getActiveFaceColors
} = require('../app/src/main/assets/js/constants');

const SCAN_PALETTE = [
  [242, 242, 236], [138, 43, 226], [0, 206, 209],
  [255, 105, 180], [255, 140, 0], [34, 60, 160]
];

beforeEach(() => resetActiveFaceColors());

describe('activeFaceColors', () => {
  test('기본값은 FACE_COLORS 와 같다', () => {
    expect(getActiveFaceColors()).toEqual(FACE_COLORS);
    expect(isDefaultFacePalette()).toBe(true);
  });

  test('RGB 배열 팔레트를 CSS 색 문자열로 바꾼다', () => {
    setActiveFaceColors(SCAN_PALETTE);
    expect(getActiveFaceColors()[1]).toBe('rgb(138,43,226)');
    expect(isDefaultFacePalette()).toBe(false);
  });

  test('CSS 문자열 팔레트도 그대로 받는다', () => {
    setActiveFaceColors(['#111111', '#222222', '#333333', '#444444', '#555555', '#666666']);
    expect(getActiveFaceColors()[0]).toBe('#111111');
  });

  test('리셋하면 기본 팔레트로 돌아온다', () => {
    setActiveFaceColors(SCAN_PALETTE);
    resetActiveFaceColors();
    expect(getActiveFaceColors()).toEqual(FACE_COLORS);
    expect(isDefaultFacePalette()).toBe(true);
  });

  test('FACE_COLORS 원본을 변형하지 않는다', () => {
    setActiveFaceColors(SCAN_PALETTE);
    resetActiveFaceColors();
    expect(FACE_COLORS).toEqual(['#FFFFFF', '#FF2200', '#00CC44', '#FFDD00', '#FF7700', '#0055FF']);
  });

  test('6색이 아니면 거부한다', () => {
    expect(() => setActiveFaceColors(SCAN_PALETTE.slice(0, 5))).toThrow(TypeError);
    expect(() => setActiveFaceColors(null)).toThrow(TypeError);
    expect(getActiveFaceColors()).toEqual(FACE_COLORS);
  });

  test('반환값을 바꿔도 내부 상태가 오염되지 않는다', () => {
    const snapshot = getActiveFaceColors();
    snapshot[0] = '#000000';
    expect(getActiveFaceColors()[0]).toBe(FACE_COLORS[0]);
  });
});
