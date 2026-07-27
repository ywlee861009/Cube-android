// 색 이름 없이 물리 회전만으로 6면 촬영 순서를 정의하는 순수 모델.
//
// 카메라 좌표계: x = 오른쪽, y = 위, z = 화면 밖(사용자 쪽)
// 큐브 로컬 우수계: X = R, Y = U, Z = F  →  항상 R = U × F 를 만족한다.
//
// 사용자가 고른 기준면이 정의상 내부 U 슬롯이다. 이후 회전이 나머지 5면의 공간 관계와
// 방향을 확정하므로 샘플 순열은 발생하지 않는다. 각 스텝의 slot 을 그대로
// captureFace(slot) 에 넘기면 scanFaceSamples 가 내부 면 순서로 채워진다.

const SCAN_FACE_LETTERS = ['U', 'R', 'F', 'D', 'L', 'B'];
const SCAN_OPPOSITE_FACE = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' };

// camera-cube-scan 의 스캔 방향 규약. 면을 카메라에 향하게 들 때 화면 위쪽에 오는 면.
// FACE_DEFS.slots 의 row-major 순서와 묶여 있으므로 바꾸지 않는다.
const SCAN_ORIENTATION_CONVENTION = {
  U: 'B', R: 'U', F: 'U', D: 'F', L: 'U', B: 'U'
};

// 90도 회전. 정수 행렬로 두어 부동소수 오차를 만들지 않는다.
// 부호 반전으로 생기는 -0 은 0 으로 정규화한다 (=== 로는 같지만 Object.is / toEqual 로는 다르다).
const unsign = v => v.map(component => (component === 0 ? 0 : component));
const SCAN_ROTATIONS = {
  'pitch+': v => unsign([v[0], -v[2], v[1]]),
  'pitch-': v => unsign([v[0], v[2], -v[1]]),
  'yaw+': v => unsign([v[2], v[1], -v[0]]),
  'yaw-': v => unsign([-v[2], v[1], v[0]]),
  'roll+': v => unsign([-v[1], v[0], v[2]]),
  'roll-': v => unsign([v[1], -v[0], v[2]])
};

// 조작 안내는 색이 아니라 "직전에 촬영한 면"과 "지금 옆에 있는 면"으로만 표현한다.
const SCAN_ROTATION_HINTS = {
  'pitch+': { glyph: '↓', text: '위쪽 면이 정면으로 오도록 굴리세요' },
  'pitch-': { glyph: '↑', text: '방금 촬영한 면이 위로 가도록 굴리세요' },
  'yaw+': { glyph: '→', text: '왼쪽 면이 정면으로 오도록 돌리세요' },
  'yaw-': { glyph: '←', text: '오른쪽 면이 정면으로 오도록 돌리세요' },
  'roll+': { glyph: '↺', text: '화면 안에서 반시계로 90도 돌리세요' },
  'roll-': { glyph: '↻', text: '화면 안에서 시계로 90도 돌리세요' }
};

const SCAN_REFERENCE_HINT = {
  glyph: '◎',
  text: '기준으로 삼을 면을 정면에 두세요. 위 방향을 정하면 끝까지 유지하세요'
};

// 기준면을 정면에 든 최초 자세에서 각 면이 놓이는 위치. 안내 문구에 쓴다.
const SCAN_RELATION_LABELS = {
  '0,0,1': { long: '기준면', short: '기준' },
  '0,0,-1': { long: '기준면 반대편', short: '반대' },
  '1,0,0': { long: '오른쪽 면', short: '오른쪽' },
  '-1,0,0': { long: '왼쪽 면', short: '왼쪽' },
  '0,1,0': { long: '위쪽 면', short: '위' },
  '0,-1,0': { long: '아래쪽 면', short: '아래' }
};

// 확정 시퀀스. 복합 전이는 스텝 4 하나뿐이며 이것이 이론적 최소다.
// 규약 6자세의 단일 90도 인접 그래프에서 U^B 와 D^F 가 모두 F^U 에만 붙은 차수 1
// 노드라 6면을 단일 회전만으로 한 번씩 도는 경로는 존재하지 않는다.
const SCAN_SEQUENCE_OPS = [
  [],
  ['pitch-'],
  ['pitch-'],
  ['pitch+', 'yaw-'],
  ['yaw-'],
  ['yaw-']
];

function crossProduct(a, b) {
  return unsign([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]);
}

function sameVector(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

// {front, up} 로부터 6면 → 카메라축 배치를 만든다. 남은 두 면은 R = U × F 를
// 만족하는 쪽으로만 배치되므로 거울상(카이랄리티 반전) 자세가 생기지 않는다.
function scanPoseFrom(front, up) {
  if (SCAN_OPPOSITE_FACE[front] === up || front === up) {
    throw new Error(`front/up must be adjacent faces: ${front}/${up}`);
  }
  const pose = {};
  pose[front] = [0, 0, 1];
  pose[SCAN_OPPOSITE_FACE[front]] = [0, 0, -1];
  pose[up] = [0, 1, 0];
  pose[SCAN_OPPOSITE_FACE[up]] = [0, -1, 0];

  const remaining = SCAN_FACE_LETTERS.filter(face => !(face in pose));
  for (const sign of [1, -1]) {
    const candidate = Object.assign({}, pose);
    candidate[remaining[0]] = [sign, 0, 0];
    candidate[remaining[1]] = [-sign, 0, 0];
    if (sameVector(crossProduct(candidate.U, candidate.F), candidate.R)) return candidate;
  }
  throw new Error(`no right-handed placement for ${front}/${up}`);
}

// "이전 면" 으로 되돌아갈 때 필요한 조작. 스텝 N 의 ops 를 그대로 다시 보여주면
// 이미 수행한 정방향 회전을 또 하라는 안내가 되어 틀린다.
function invertScanOps(ops) {
  return ops
    .slice()
    .reverse()
    .map(op => (op.endsWith('+') ? `${op.slice(0, -1)}-` : `${op.slice(0, -1)}+`));
}

function applyScanRotation(pose, op) {
  const rotate = SCAN_ROTATIONS[op];
  if (!rotate) throw new Error(`unknown rotation: ${op}`);
  const next = {};
  for (const face of SCAN_FACE_LETTERS) next[face] = rotate(pose[face]);
  return next;
}

function scanPoseFaceAt(pose, axis) {
  return SCAN_FACE_LETTERS.find(face => sameVector(pose[face], axis));
}

function describeScanPose(pose) {
  return { front: scanPoseFaceAt(pose, [0, 0, 1]), up: scanPoseFaceAt(pose, [0, 1, 0]) };
}

// 최초 자세 기준의 관계 명칭. 색 이름을 쓰지 않기 위한 유일한 호칭 체계다.
function scanRelationLabel(face) {
  const base = scanPoseFrom('U', 'B');
  return SCAN_RELATION_LABELS[base[face].join(',')];
}

// 6개 촬영 스텝을 실제 회전으로 계산해서 만든다. 순서를 문자열 배열로 하드코딩하지 않는다.
function buildScanSequence() {
  let pose = scanPoseFrom('U', 'B');
  return SCAN_SEQUENCE_OPS.map((ops, step) => {
    ops.forEach(op => { pose = applyScanRotation(pose, op); });
    const { front, up } = describeScanPose(pose);
    if (SCAN_ORIENTATION_CONVENTION[front] !== up) {
      throw new Error(`step ${step + 1} breaks the orientation convention: ${front}^${up}`);
    }
    return {
      step,
      slot: SCAN_FACE_LETTERS.indexOf(front),
      front,
      up,
      ops: ops.slice(),
      faceLabel: scanRelationLabel(front),
      topLabel: scanRelationLabel(up),
      hints: ops.length ? ops.map(op => SCAN_ROTATION_HINTS[op]) : [SCAN_REFERENCE_HINT]
    };
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    SCAN_FACE_LETTERS,
    SCAN_OPPOSITE_FACE,
    SCAN_ORIENTATION_CONVENTION,
    SCAN_ROTATIONS,
    SCAN_ROTATION_HINTS,
    SCAN_REFERENCE_HINT,
    SCAN_SEQUENCE_OPS,
    crossProduct,
    scanPoseFrom,
    invertScanOps,
    applyScanRotation,
    describeScanPose,
    scanRelationLabel,
    buildScanSequence
  };
}
