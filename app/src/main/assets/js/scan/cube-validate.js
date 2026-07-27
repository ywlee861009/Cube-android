// Sticker tables mirror faceletsToKPuzzleState() in lib/cubing-solver.bundle.js.
const VALIDATE_CORNER_STICKERS = [
  [8, 20, 9], [2, 11, 45], [0, 47, 36], [6, 38, 18],
  [29, 15, 26], [27, 24, 44], [33, 42, 53], [35, 51, 17]
];
const VALIDATE_CORNER_FACE_CYCLES = [
  [0, 2, 1], [0, 1, 5], [0, 5, 4], [0, 4, 2],
  [3, 1, 2], [3, 2, 4], [3, 4, 5], [3, 5, 1]
];
const VALIDATE_EDGE_STICKERS = [
  [7, 19], [5, 10], [1, 46], [3, 37],
  [28, 25], [32, 16], [34, 52], [30, 43],
  [23, 12], [21, 41], [48, 14], [50, 39]
];
const VALIDATE_EDGE_FACE_CYCLES = [
  [0, 2], [0, 1], [0, 5], [0, 4],
  [3, 2], [3, 1], [3, 5], [3, 4],
  [2, 1], [2, 4], [5, 1], [5, 4]
];
const VALIDATE_CENTERS = [4, 13, 22, 31, 40, 49];
const VALIDATE_COLOR_NAMES = ['흰색', '빨강', '초록', '노랑', '주황', '파랑'];

function validationFailure(code, message, badIndices) {
  return { ok: false, code, message, badIndices: [...new Set(badIndices)].sort((a, b) => a - b) };
}

function validateFacelets(f) {
  if (!Array.isArray(f) || f.length !== 54) {
    return validationFailure('LENGTH', '큐브의 54칸을 모두 확인해 주세요.', []);
  }

  const invalid = [];
  for (let i = 0; i < f.length; i++) {
    if (!Number.isInteger(f[i]) || f[i] < 0 || f[i] > 5) invalid.push(i);
  }
  if (invalid.length) {
    return validationFailure('VALUE_RANGE', '알 수 없는 색이 있는 칸을 확인해 주세요.', invalid);
  }

  const counts = Array(6).fill(0);
  f.forEach(color => counts[color]++);
  if (counts.some(count => count !== 9)) {
    const badColors = new Set(counts.flatMap((count, color) => count === 9 ? [] : [color]));
    const badIndices = f.flatMap((color, index) => badColors.has(color) ? [index] : []);
    const summary = counts
      .map((count, color) => `${VALIDATE_COLOR_NAMES[color]} ${count}칸`)
      .join(', ');
    return validationFailure(
      'COLOR_COUNT',
      `색마다 9칸이어야 해요. 현재 ${summary}`,
      badIndices
    );
  }

  const centerColors = VALIDATE_CENTERS.map(index => f[index]);
  if (new Set(centerColors).size !== 6) {
    return validationFailure(
      'CENTER_DUPLICATE',
      '가운데 색 6개가 서로 달라야 해요.',
      VALIDATE_CENTERS
    );
  }

  const cornerPermutation = [];
  const cornerOrientation = [];
  for (let position = 0; position < VALIDATE_CORNER_STICKERS.length; position++) {
    const indices = VALIDATE_CORNER_STICKERS[position];
    const colors = indices.map(index => f[index]);
    const udIndex = colors.findIndex(color => color === 0 || color === 3);
    if (udIndex < 0) {
      return validationFailure(
        'CORNER_PIECES',
        '모서리 조각 하나가 잘못 읽혔어요.',
        indices
      );
    }
    const normalized = [
      colors[udIndex],
      colors[(udIndex + 1) % 3],
      colors[(udIndex + 2) % 3]
    ];
    const piece = VALIDATE_CORNER_FACE_CYCLES.findIndex(cycle =>
      cycle.every((color, index) => color === normalized[index])
    );
    if (piece < 0 || cornerPermutation.includes(piece)) {
      const duplicatePosition = cornerPermutation.indexOf(piece);
      const duplicateIndices =
        duplicatePosition >= 0 ? VALIDATE_CORNER_STICKERS[duplicatePosition] : [];
      return validationFailure(
        'CORNER_PIECES',
        '모서리 조각의 색 조합을 다시 확인해 주세요.',
        indices.concat(duplicateIndices)
      );
    }
    cornerPermutation.push(piece);
    cornerOrientation.push((3 - udIndex) % 3);
  }

  const edgePermutation = [];
  const edgeOrientation = [];
  for (let position = 0; position < VALIDATE_EDGE_STICKERS.length; position++) {
    const indices = VALIDATE_EDGE_STICKERS[position];
    const [color0, color1] = indices.map(index => f[index]);
    let primary;
    if ([color0, color1].some(color => color === 0 || color === 3)) {
      primary = color0 === 0 || color0 === 3 ? color0 : color1;
    } else {
      primary = color0 === 2 || color0 === 5 ? color0 : color1;
    }
    const orientation = primary === color0 ? 0 : 1;
    const normalized = orientation === 0 ? [color0, color1] : [color1, color0];
    const piece = VALIDATE_EDGE_FACE_CYCLES.findIndex(cycle =>
      cycle[0] === normalized[0] && cycle[1] === normalized[1]
    );
    if (piece < 0 || edgePermutation.includes(piece)) {
      const duplicatePosition = edgePermutation.indexOf(piece);
      const duplicateIndices =
        duplicatePosition >= 0 ? VALIDATE_EDGE_STICKERS[duplicatePosition] : [];
      return validationFailure(
        'EDGE_PIECES',
        '가장자리 조각의 색 조합을 다시 확인해 주세요.',
        indices.concat(duplicateIndices)
      );
    }
    edgePermutation.push(piece);
    edgeOrientation.push(orientation);
  }

  if (cornerOrientation.reduce((sum, value) => sum + value, 0) % 3 !== 0) {
    return validationFailure(
      'CORNER_ORIENTATION',
      '모서리 조각 하나의 방향을 다시 확인해 주세요.',
      VALIDATE_CORNER_STICKERS.flat()
    );
  }
  if (edgeOrientation.reduce((sum, value) => sum + value, 0) % 2 !== 0) {
    return validationFailure(
      'EDGE_ORIENTATION',
      '가장자리 조각 하나의 방향을 다시 확인해 주세요.',
      VALIDATE_EDGE_STICKERS.flat()
    );
  }
  if (permutationParity(cornerPermutation) !== permutationParity(edgePermutation)) {
    return validationFailure(
      'PARITY',
      '서로 바뀐 조각이 있는지 다시 확인해 주세요.',
      VALIDATE_CORNER_STICKERS.flat().concat(VALIDATE_EDGE_STICKERS.flat())
    );
  }
  return { ok: true };
}

function permutationParity(permutation) {
  let inversions = 0;
  for (let i = 0; i < permutation.length; i++) {
    for (let j = i + 1; j < permutation.length; j++) {
      if (permutation[i] > permutation[j]) inversions++;
    }
  }
  return inversions % 2;
}

if (typeof module !== 'undefined') {
  module.exports = { validateFacelets };
}
