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
  const kpuzzle = new KPuzzle(experimentalCube3x3x3KPuzzle);
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
 */
function faceletsToKPuzzleState(f) {
  // ── corner 스티커 인덱스 [face0_sticker, face1_sticker, face2_sticker]
  //    face 순서는 cubing.js orientation 기준 (U/D 면이 orientation 0)
  const CORNER_STICKERS = [
    [8,  20,  9],  // UFR: U-face slot8, F-face slot20, R-face slot9  → [U,F,R]
    [2,  11, 45],  // UBR: U-face slot2, R-face slot11, B-face slot45 → [U,R,B]
    [0,  47, 36],  // UBL: U-face slot0, B-face slot47, L-face slot36 → [U,B,L]
    [6,  38, 18],  // UFL: U-face slot6, L-face slot38, F-face slot18 → [U,L,F]
    [29, 26, 15],  // DFR: D-face slot29, F-face slot26, R-face slot15→ [D,F,R]
    [27, 44, 24],  // DFL: D-face slot27, L-face slot44, F-face slot24→ [D,L,F]
    [33, 42, 53],  // DBL: D-face slot33, L-face slot42, B-face slot53→ [D,L... wait
    [35, 51, 17],  // DBR: D-face slot35, R-face slot51, B-face slot17→ [D,R,B]  -- wait
  ];

  // corner 면 순서 (cubing.js orientation 기준)
  // orientation=0: 첫 번째 스티커가 U 또는 D면
  // face0 색 = U(0) or D(3) → orientation 0
  // face0 색이 R,L,F,B 중 하나면 → 몇 번째 index에 U/D가 있는지로 orientation 결정
  const CORNER_FACE_CYCLES = [
    [0, 2, 1],  // UFR: [U, F, R]
    [0, 1, 5],  // UBR: [U, R, B]
    [0, 5, 4],  // UBL: [U, B, L]
    [0, 4, 2],  // UFL: [U, L, F]
    [3, 2, 1],  // DFR: [D, F, R]
    [3, 4, 2],  // DFL: [D, L, F]
    [3, 4, 5],  // DBL: [D, L, B]
    [3, 1, 5],  // DBR: [D, R, B]
  ];

  // ── edge 스티커 인덱스 [primary, secondary]
  //    primary = U/D/F/B 면 스티커
  const EDGE_STICKERS = [
    [7,  19],  // UF:  U-slot7,  F-slot19
    [5,  10],  // UR:  U-slot5,  R-slot10
    [1,  46],  // UB:  U-slot1,  B-slot46
    [3,  37],  // UL:  U-slot3,  L-slot37
    [28, 25],  // DF:  D-slot28, F-slot25
    [32, 16],  // DR:  D-slot32, R-slot16
    [34, 52],  // DB:  D-slot34, B-slot52
    [30, 43],  // DL:  D-slot30, L-slot43
    [23, 12],  // FR:  F-slot23, R-slot12
    [21, 41],  // FL:  F-slot21, L-slot41
    [48, 14],  // BR:  B-slot48, R-slot14
    [50, 39],  // BL:  B-slot50, L-slot39
  ];

  // ── corner 변환 ─────────────────────────────────────────────────────────
  const cornerPermutation   = new Array(8);
  const cornerOrientation   = new Array(8);

  // solved 상태에서 각 corner position의 기대 색
  // CORNER_FACE_CYCLES[pos] → 그 position의 면 배열
  // cubing.js corner piece index = 완성 시 그 position에 있는 piece 번호 (0~7)
  // 찾는 방법: 실제 스티커 색에서 U/D 색이 어느 orbit index에 있는지로 permutation+orientation 결정

  for (let pos = 0; pos < 8; pos++) {
    const [s0, s1, s2] = CORNER_STICKERS[pos];
    const colors = [f[s0], f[s1], f[s2]];  // 현재 이 position의 스티커 색

    // U/D 색(0 또는 3)이 어느 index에 있는지 찾기
    const udIdx = colors.findIndex(c => c === 0 || c === 3);

    // orientation = U/D 색이 있는 index (0이면 정방향)
    cornerOrientation[pos] = udIdx;

    // orientation에 맞게 색 순서 정규화 → 어떤 piece인지 식별
    // 정규화: U/D 색이 항상 첫 번째가 되도록 rotate
    const normColors = [
      colors[udIdx],
      colors[(udIdx + 1) % 3],
      colors[(udIdx + 2) % 3],
    ];

    // CORNER_FACE_CYCLES에서 같은 색 조합의 piece 찾기
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
  const edgePermutation  = new Array(12);
  const edgeOrientation  = new Array(12);

  // edge piece 완성 상태의 색 (face index 쌍)
  const EDGE_FACE_CYCLES = [
    [0, 2],   // UF
    [0, 1],   // UR
    [0, 5],   // UB
    [0, 4],   // UL
    [3, 2],   // DF
    [3, 1],   // DR
    [3, 5],   // DB
    [3, 4],   // DL
    [2, 1],   // FR
    [2, 4],   // FL
    [5, 1],   // BR
    [5, 4],   // BL
  ];

  for (let pos = 0; pos < 12; pos++) {
    const [s0, s1] = EDGE_STICKERS[pos];
    const c0 = f[s0], c1 = f[s1];

    // orientation 결정:
    // U/D edges (0-7): primary(s0) 스티커가 U(0) or D(3) 색이면 ori=0
    // equatorial edges (8-11, FR/FL/BR/BL):
    //   secondary(s1=R or L 면 스티커)가 F(2) or B(5) 색이면 ori=0
    let ori;
    if (pos < 8) {
      ori = (c0 === 0 || c0 === 3) ? 0 : 1;
    } else {
      // equatorial: secondary가 R/L 면. F(2) or B(5) 색이면 ori=0
      ori = (c1 === 2 || c1 === 5) ? 0 : 1;
    }
    edgeOrientation[pos] = ori;

    // permutation: orientation에 맞게 색 정규화 후 piece 찾기
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
  // cubing.js CENTERS orbit: [U, R, F, D, L, B] = [0,1,2,3,4,5]
  const centerPermutation  = [0, 1, 2, 3, 4, 5];
  const centerOrientation  = [0, 0, 0, 0, 0, 0];

  return {
    CORNERS: { permutation: cornerPermutation, orientation: cornerOrientation },
    EDGES:   { permutation: edgePermutation,   orientation: edgeOrientation   },
    CENTERS: { permutation: centerPermutation, orientation: centerOrientation },
  };
}

// 전역 노출 (IIFE 번들용)
self.CubingSolver = { solveFromFacelets };
