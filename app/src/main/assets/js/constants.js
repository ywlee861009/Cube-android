// 면 순서: U(0)=흰, R(1)=빨, F(2)=초, D(3)=노, L(4)=주, B(5)=파
const FACE_COLORS = ['#FFFFFF', '#FF2200', '#00CC44', '#FFDD00', '#FF7700', '#0055FF'];

// 실제로 렌더링에 쓰는 팔레트. 스캔 세션 동안에는 촬영한 센터 색으로 바뀐다.
// FACE_COLORS 는 기본값 원본이므로 절대 변형하지 않는다.
let activeFaceColors = FACE_COLORS.slice();

function setActiveFaceColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 6) {
    throw new TypeError('face palette must contain 6 colors');
  }
  activeFaceColors = colors.map(color =>
    Array.isArray(color) ? `rgb(${color[0]},${color[1]},${color[2]})` : color
  );
}

function resetActiveFaceColors() {
  activeFaceColors = FACE_COLORS.slice();
}

function isDefaultFacePalette() {
  return activeFaceColors.every((color, index) => color === FACE_COLORS[index]);
}

if (typeof module !== 'undefined') {
  module.exports = {
    FACE_COLORS,
    setActiveFaceColors,
    resetActiveFaceColors,
    isDefaultFacePalette,
    getActiveFaceColors: () => activeFaceColors.slice()
  };
}

// Three.js BoxGeometry materialIndex 순서: +x, -x, +y, -y, +z, -z
// 좌표계: R=+x, L=-x, U=+y, D=-y, F=+z, B=-z
// face별 파세렛 → cubie 위치 매핑
const FACE_DEFS = [
  // U: y=+1, materialIndex=2
  { fixedAxis: 'y', fixedVal: +1, matIdx: 2, slots: [
    [-1,-1],[0,-1],[+1,-1],
    [-1, 0],[0, 0],[+1, 0],
    [-1,+1],[0,+1],[+1,+1],
  ]},
  // R: x=+1, materialIndex=0
  { fixedAxis: 'x', fixedVal: +1, matIdx: 0, slots: [
    [+1,+1],[0,+1],[-1,+1],
    [+1, 0],[0, 0],[-1, 0],
    [+1,-1],[0,-1],[-1,-1],
  ]},
  // F: z=+1, materialIndex=4
  { fixedAxis: 'z', fixedVal: +1, matIdx: 4, slots: [
    [-1,+1],[0,+1],[+1,+1],
    [-1, 0],[0, 0],[+1, 0],
    [-1,-1],[0,-1],[+1,-1],
  ]},
  // D: y=-1, materialIndex=3
  { fixedAxis: 'y', fixedVal: -1, matIdx: 3, slots: [
    [-1,+1],[0,+1],[+1,+1],
    [-1, 0],[0, 0],[+1, 0],
    [-1,-1],[0,-1],[+1,-1],
  ]},
  // L: x=-1, materialIndex=1
  { fixedAxis: 'x', fixedVal: -1, matIdx: 1, slots: [
    [-1,+1],[0,+1],[+1,+1],
    [-1, 0],[0, 0],[+1, 0],
    [-1,-1],[0,-1],[+1,-1],
  ]},
  // B: z=-1, materialIndex=5
  { fixedAxis: 'z', fixedVal: -1, matIdx: 5, slots: [
    [+1,+1],[0,+1],[-1,+1],
    [+1, 0],[0, 0],[-1, 0],
    [+1,-1],[0,-1],[-1,-1],
  ]},
];
