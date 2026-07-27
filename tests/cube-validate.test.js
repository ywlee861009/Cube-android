const { validateFacelets } = require(
  '../app/src/main/assets/js/scan/cube-validate'
);
const {
  applyMoveInPlace,
  ALL_MOVES,
  solvedFacelets
} = require('./cube-logic');

function solved() {
  return solvedFacelets();
}

function swapPieces(facelets, first, second) {
  for (let i = 0; i < first.length; i++) {
    [facelets[first[i]], facelets[second[i]]] =
      [facelets[second[i]], facelets[first[i]]];
  }
}

describe('validateFacelets', () => {
  test('완성 상태를 허용한다', () => {
    expect(validateFacelets(solved())).toEqual({ ok: true });
  });

  test('정당한 무브로 만든 100개 상태를 허용한다', () => {
    const facelets = solved();
    for (let i = 0; i < 100; i++) {
      applyMoveInPlace(ALL_MOVES[(i * 17 + 5) % ALL_MOVES.length], facelets);
      expect(validateFacelets(facelets)).toEqual({ ok: true });
    }
  });

  test('색 개수 위반을 찾는다', () => {
    const facelets = solved();
    facelets[0] = 1;
    const result = validateFacelets(facelets);
    expect(result.code).toBe('COLOR_COUNT');
    expect(result.badIndices).toContain(0);
  });

  test('코너 하나만 비튼 상태를 거부한다', () => {
    const facelets = solved();
    [facelets[8], facelets[20], facelets[9]] =
      [facelets[20], facelets[9], facelets[8]];
    expect(validateFacelets(facelets).code).toBe('CORNER_ORIENTATION');
  });

  test('엣지 하나만 뒤집은 상태를 거부한다', () => {
    const facelets = solved();
    [facelets[7], facelets[19]] = [facelets[19], facelets[7]];
    expect(validateFacelets(facelets).code).toBe('EDGE_ORIENTATION');
  });

  test('코너 두 개만 바꾼 패리티 위반을 찾는다', () => {
    const facelets = solved();
    swapPieces(facelets, [8, 20, 9], [2, 11, 45]);
    expect(validateFacelets(facelets).code).toBe('PARITY');
  });

  test('엣지 두 개만 바꾼 패리티 위반을 찾는다', () => {
    const facelets = solved();
    swapPieces(facelets, [7, 19], [5, 10]);
    expect(validateFacelets(facelets).code).toBe('PARITY');
  });

  test('불가능한 코너 색 조합과 해당 위치를 찾는다', () => {
    const facelets = solved();
    [facelets[20], facelets[29]] = [facelets[29], facelets[20]];
    const result = validateFacelets(facelets);
    expect(result.code).toBe('CORNER_PIECES');
    expect(result.badIndices).toEqual(expect.arrayContaining([8, 20, 9]));
  });

  test.each([
    [[], 'LENGTH'],
    [Array(54).fill(0), 'COLOR_COUNT'],
    [solved().map((value, index) => index === 8 ? 6 : value), 'VALUE_RANGE']
  ])('형식 오류를 거부한다', (facelets, code) => {
    expect(validateFacelets(facelets).code).toBe(code);
  });
});
