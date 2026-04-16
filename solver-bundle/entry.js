import { experimentalSolve3x3x3IgnoringCenters } from 'cubing/search';
import { KPuzzle, experimentalCube3x3x3KPuzzle } from 'cubing/kpuzzle';
import { Alg } from 'cubing/alg';

/**
 * facelets 배열(54개 Int)을 받아 큐빙 라이브러리로 솔브하고
 * 이동 시퀀스 문자열을 반환한다.
 *
 * @param {number[]} facelets - 54개 원소, face*9+slot, U=0,R=1,F=2,D=3,L=4,B=5
 * @returns {Promise<string>} - 예: "R U R' U'"
 */
async function solveFromFacelets(facelets) {
  const state = faceletsToKPuzzleState(facelets);
  const solution = await experimentalSolve3x3x3IgnoringCenters(state);
  return solution.toString();
}

/**
 * facelets[54] → KPuzzleState ({ CORNERS, EDGES, CENTERS })
 *
 * 면 순서: U=0, R=1, F=2, D=3, L=4, B=5
 *
 * Corner 순서 (cubing.js): 0=UFR, 1=UBR, 2=UBL, 3=UFL, 4=DFR, 5=DFL, 6=DBL, 7=DBR
 * Edge   순서 (cubing.js): 0=UF, 1=UR, 2=UB, 3=UL, 4=DF, 5=DR, 6=DB, 7=DL,
 *                          8=FR, 9=FL, 10=BR, 11=BL
 *
 * 슬롯 순서는 cubing.js 의 orientation 규칙에 맞게 결정됨:
 *   corner ori = (3 - udIdx) % 3  (모든 포지션 동일)
 *   edge   ori = U/D edge: (R/L 색이 primary 슬롯에 있으면 1)
 *               equatorial: (F/B 색이 primary 슬롯에 있으면 1)
 */
function faceletsToKPuzzleState(f) {
  // ── corner 스티커 슬롯 [s0, s1, s2] — cubing.js orientation 기준으로 결정된 순서
  const CORNER_STICKERS = [
    [ 8, 20,  9],  // UFR: [U[8], F[2], R[0]]
    [ 2, 11, 45],  // UBR: [U[2], R[2], B[0]]
    [ 0, 47, 36],  // UBL: [U[0], B[2], L[0]]
    [ 6, 38, 18],  // UFL: [U[6], L[2], F[0]]
    [29, 15, 26],  // DFR: [D[2], R[6], F[8]]
    [27, 24, 44],  // DFL: [D[0], F[6], L[8]]
    [33, 42, 53],  // DBL: [D[6], L[6], B[8]]
    [35, 51, 17],  // DBR: [D[8], B[6], R[8]]
  ];

  // 각 corner position 의 solved 상태 face 순서 (piece 식별에 사용)
  const CORNER_FACE_CYCLES = [
    [0, 2, 1],  // UFR: [U, F, R]
    [0, 1, 5],  // UBR: [U, R, B]
    [0, 5, 4],  // UBL: [U, B, L]
    [0, 4, 2],  // UFL: [U, L, F]
    [3, 1, 2],  // DFR: [D, R, F]
    [3, 2, 4],  // DFL: [D, F, L]
    [3, 4, 5],  // DBL: [D, L, B]
    [3, 5, 1],  // DBR: [D, B, R]
  ];

  // ── edge 스티커 슬롯 [primary, secondary]
  //    primary: U/D edge → U/D 면 슬롯,  equatorial → F/B 면 슬롯
  const EDGE_STICKERS = [
    [ 7, 19],  // UF:  U[7],  F[1]
    [ 5, 10],  // UR:  U[5],  R[1]
    [ 1, 46],  // UB:  U[1],  B[1]
    [ 3, 37],  // UL:  U[3],  L[1]
    [28, 25],  // DF:  D[1],  F[7]
    [32, 16],  // DR:  D[5],  R[7]
    [34, 52],  // DB:  D[7],  B[7]
    [30, 43],  // DL:  D[3],  L[7]
    [23, 12],  // FR:  F[5],  R[3]
    [21, 41],  // FL:  F[3],  L[5]
    [48, 14],  // BR:  B[3],  R[5]
    [50, 39],  // BL:  B[5],  L[3]
  ];

  // edge piece 의 solved 상태 face 순서
  const EDGE_FACE_CYCLES = [
    [0, 2], [0, 1], [0, 5], [0, 4],  // UF, UR, UB, UL
    [3, 2], [3, 1], [3, 5], [3, 4],  // DF, DR, DB, DL
    [2, 1], [2, 4], [5, 1], [5, 4],  // FR, FL, BR, BL
  ];

  // ── corner 변환 ─────────────────────────────────────────────────────────
  const cornerPermutation = new Array(8);
  const cornerOrientation = new Array(8);

  for (let pos = 0; pos < 8; pos++) {
    const [s0, s1, s2] = CORNER_STICKERS[pos];
    const colors = [f[s0], f[s1], f[s2]];

    // U/D 색(0=U, 3=D)이 어느 index에 있는지
    const udIdx = colors.findIndex(c => c === 0 || c === 3);

    // cubing.js orientation: (3 - udIdx) % 3  (실험적으로 검증된 공식)
    cornerOrientation[pos] = (3 - udIdx) % 3;

    // U/D 색이 맨 앞에 오도록 정규화하여 piece 식별
    const normColors = [
      colors[udIdx],
      colors[(udIdx + 1) % 3],
      colors[(udIdx + 2) % 3],
    ];

    let pieceIdx = -1;
    for (let p = 0; p < 8; p++) {
      const fc = CORNER_FACE_CYCLES[p];
      if (fc[0] === normColors[0] && fc[1] === normColors[1] && fc[2] === normColors[2]) {
        pieceIdx = p;
        break;
      }
    }
    cornerPermutation[pos] = pieceIdx;
  }

  // ── edge 변환 ───────────────────────────────────────────────────────────
  const edgePermutation = new Array(12);
  const edgeOrientation = new Array(12);

  for (let pos = 0; pos < 12; pos++) {
    const [s0, s1] = EDGE_STICKERS[pos];
    const c0 = f[s0], c1 = f[s1];

    // orientation 결정 (Kociemba 규칙):
    // piece의 "primary color"(U/D색 우선, 없으면 F/B색)가 c0 슬롯에 있으면 ori=0, c1에 있으면 ori=1
    let piecePrimary;
    if (c0 === 0 || c0 === 3 || c1 === 0 || c1 === 3) {
      piecePrimary = (c0 === 0 || c0 === 3) ? c0 : c1;  // U/D 색
    } else {
      piecePrimary = (c0 === 2 || c0 === 5) ? c0 : c1;  // F/B 색
    }
    const ori = (piecePrimary === c0) ? 0 : 1;
    edgeOrientation[pos] = ori;

    // orientation 에 맞게 정규화 후 piece 식별
    const normC0 = ori === 0 ? c0 : c1;
    const normC1 = ori === 0 ? c1 : c0;

    let pieceIdx = -1;
    for (let p = 0; p < 12; p++) {
      if (EDGE_FACE_CYCLES[p][0] === normC0 && EDGE_FACE_CYCLES[p][1] === normC1) {
        pieceIdx = p;
        break;
      }
    }
    edgePermutation[pos] = pieceIdx;
  }

  // ── centers (항상 solved) ───────────────────────────────────────────────
  const centerPermutation = [0, 1, 2, 3, 4, 5];
  const centerOrientation = [0, 0, 0, 0, 0, 0];

  return {
    CORNERS: { permutation: cornerPermutation, orientation: cornerOrientation },
    EDGES:   { permutation: edgePermutation,   orientation: edgeOrientation   },
    CENTERS: { permutation: centerPermutation, orientation: centerOrientation },
  };
}

// 전역 노출 (IIFE 번들용)
self.CubingSolver = { solveFromFacelets };
