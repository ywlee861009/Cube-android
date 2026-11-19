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

  test.each(['E', 'M', 'S', "M U E F' S2"])('중간 층 회전 %s 이후 현재 센터로 색을 정규화한다', sequence => {
    const facelets = solved();
    sequence.split(' ').forEach(move => applyMoveInPlace(move, facelets));
    const original = facelets.slice();
    const { ok, normalizedFacelets } = validateFacelets(facelets);
    expect(ok).toBe(true);
    expect(facelets).toEqual(original);
    expect([4, 13, 22, 31, 40, 49].map(index => normalizedFacelets[index])).toEqual([0, 1, 2, 3, 4, 5]);
    expect(validateFacelets(normalizedFacelets)).toEqual({ ok: true });
  });

  test.each([
    ['인접한 두 색 센터 교체', 4, 13],
    ['좌우 색 센터의 거울 배치', 13, 40],
  ])('%s를 거부한다', (_, first, second) => {
    const facelets = solved();
    [facelets[first], facelets[second]] = [facelets[second], facelets[first]];
    expect(validateFacelets(facelets).code).toBe('CENTER_ORIENTATION');
  });

  test('센터 회전 뒤에도 엣지 교환으로 인한 패리티 위반을 찾는다', () => {
    const facelets = solved();
    applyMoveInPlace('M', facelets);
    swapPieces(facelets, [7, 19], [5, 10]);
    expect(validateFacelets(facelets).code).toBe('PARITY');
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
