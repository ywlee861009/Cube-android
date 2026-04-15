// 면 순서: U(0)=흰, R(1)=빨, F(2)=초, D(3)=노, L(4)=주, B(5)=파
const FACE_COLORS = ['#FFFFFF', '#FF2200', '#00CC44', '#FFDD00', '#FF7700', '#0055FF'];

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
