const {
  SCAN_FACE_LETTERS,
  SCAN_ORIENTATION_CONVENTION,
  SCAN_ROTATIONS,
  SCAN_ROTATION_HINTS,
  SCAN_SEQUENCE_OPS,
  crossProduct,
  scanPoseFrom,
  invertScanOps,
  applyScanRotation,
  describeScanPose,
  scanRelationLabel,
  buildScanSequence
} = require('../app/src/main/assets/js/scan/scan-orientation');

// camera-cube-scan 방향 규약의 6자세. 이 목록은 FACE_DEFS.slots 와 묶여 있다.
const CONVENTION_POSES = [
  ['U', 'B'], ['R', 'U'], ['F', 'U'], ['D', 'F'], ['L', 'U'], ['B', 'U']
];

describe('scanPoseFrom', () => {
  test.each(CONVENTION_POSES)('%s^%s 자세가 우수계를 유지한다', (front, up) => {
    const pose = scanPoseFrom(front, up);
    expect(crossProduct(pose.U, pose.F)).toEqual(pose.R);
    expect(pose[front]).toEqual([0, 0, 1]);
    expect(pose[up]).toEqual([0, 1, 0]);
  });

  test('6면이 서로 다른 축을 차지한다', () => {
    const pose = scanPoseFrom('U', 'B');
    const axes = SCAN_FACE_LETTERS.map(face => pose[face].join(','));
    expect(new Set(axes).size).toBe(6);
  });

  test('마주보는 면을 front/up 으로 주면 거부한다', () => {
    expect(() => scanPoseFrom('U', 'D')).toThrow();
    expect(() => scanPoseFrom('R', 'R')).toThrow();
  });
});

describe('applyScanRotation', () => {
  test.each(Object.keys(SCAN_ROTATIONS))('%s 회전 후에도 우수계가 유지된다', op => {
    const pose = applyScanRotation(scanPoseFrom('U', 'B'), op);
    expect(crossProduct(pose.U, pose.F)).toEqual(pose.R);
  });

  test('같은 회전 4번이면 제자리로 돌아온다', () => {
    for (const op of Object.keys(SCAN_ROTATIONS)) {
      let pose = scanPoseFrom('F', 'U');
      for (let i = 0; i < 4; i++) pose = applyScanRotation(pose, op);
      expect(pose).toEqual(scanPoseFrom('F', 'U'));
    }
  });

  test('pitch+ 와 pitch- 는 서로의 역회전이다', () => {
    const start = scanPoseFrom('F', 'U');
    expect(applyScanRotation(applyScanRotation(start, 'pitch-'), 'pitch+')).toEqual(start);
    expect(applyScanRotation(applyScanRotation(start, 'yaw-'), 'yaw+')).toEqual(start);
  });

  test('알 수 없는 회전은 거부한다', () => {
    expect(() => applyScanRotation(scanPoseFrom('U', 'B'), 'twist')).toThrow();
  });
});

describe('buildScanSequence', () => {
  const sequence = buildScanSequence();

  test('6개 슬롯을 중복 없이 한 번씩 방문한다', () => {
    expect(sequence).toHaveLength(6);
    expect(new Set(sequence.map(s => s.slot)).size).toBe(6);
    expect(sequence.map(s => s.slot).sort()).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('슬롯 순서가 [0, 2, 3, 1, 5, 4] 다 — scan-ui 가 이 값을 신뢰한다', () => {
    expect(sequence.map(s => s.slot)).toEqual([0, 2, 3, 1, 5, 4]);
  });

  test('각 스텝의 front/up 이 방향 규약과 일치한다', () => {
    sequence.forEach(({ front, up }) => {
      expect(SCAN_ORIENTATION_CONVENTION[front]).toBe(up);
    });
  });

  test('선언된 front/up 이 회전을 실제로 적용한 결과와 같다', () => {
    let pose = scanPoseFrom('U', 'B');
    sequence.forEach(({ ops, front, up }) => {
      ops.forEach(op => { pose = applyScanRotation(pose, op); });
      expect(describeScanPose(pose)).toEqual({ front, up });
    });
  });

  test('첫 스텝은 기준면이고 회전이 없다', () => {
    expect(sequence[0].ops).toEqual([]);
    expect(sequence[0].slot).toBe(0);
    expect(sequence[0].faceLabel.long).toBe('기준면');
    expect(sequence[0].hints).toHaveLength(1);
    expect(sequence[0].hints[0].text).toContain('기준으로 삼을 면');
  });

  test('복합 회전은 스텝 4 하나뿐이며 그 앞 절반이 되돌리기다', () => {
    const compound = sequence.filter(s => s.ops.length > 1);
    expect(compound).toHaveLength(1);
    expect(compound[0].step).toBe(3);
    expect(compound[0].ops).toEqual(['pitch+', 'yaw-']);
    expect(sequence[2].ops).toEqual(['pitch-']);
  });

  test('총 물리 회전 수가 6회다', () => {
    expect(sequence.reduce((sum, s) => sum + s.ops.length, 0)).toBe(6);
  });

  test('안내 문구에 제조사 색 이름이 없다', () => {
    const text = sequence
      .flatMap(s => [
        ...s.hints.map(hint => hint.text),
        s.faceLabel.long, s.faceLabel.short, s.topLabel.long
      ])
      .join(' ');
    ['흰색', '빨강', '초록', '노랑', '주황', '파랑'].forEach(color => {
      expect(text).not.toContain(color);
    });
  });

  test('모든 스텝이 회전 안내 문구와 도식 글리프를 가진다', () => {
    sequence.slice(1).forEach(({ ops, hints }) => {
      expect(hints).toHaveLength(ops.length);
    });
    sequence.forEach(({ hints }) => {
      expect(hints.length).toBeGreaterThan(0);
      hints.forEach(hint => {
        expect(typeof hint.text).toBe('string');
        expect(typeof hint.glyph).toBe('string');
      });
    });
  });

  test('결정론적이다', () => {
    expect(buildScanSequence()).toEqual(sequence);
  });
});

describe('invertScanOps', () => {
  test('순서를 뒤집고 각 회전을 반대로 만든다', () => {
    expect(invertScanOps(['pitch+', 'yaw-'])).toEqual(['yaw+', 'pitch-']);
    expect(invertScanOps(['pitch-'])).toEqual(['pitch+']);
    expect(invertScanOps([])).toEqual([]);
  });

  test('원본을 변형하지 않는다', () => {
    const ops = ['pitch-', 'yaw-'];
    invertScanOps(ops);
    expect(ops).toEqual(['pitch-', 'yaw-']);
  });

  test('모든 스텝에서 역회전이 직전 자세로 정확히 되돌린다', () => {
    const sequence = buildScanSequence();
    let pose = scanPoseFrom('U', 'B');
    sequence.slice(1).forEach(({ ops }) => {
      const before = pose;
      let after = before;
      ops.forEach(op => { after = applyScanRotation(after, op); });
      let restored = after;
      invertScanOps(ops).forEach(op => { restored = applyScanRotation(restored, op); });
      expect(restored).toEqual(before);
      pose = after;
    });
  });

  test('역회전 안내에 대응하는 문구가 모두 존재한다', () => {
    buildScanSequence().slice(1).forEach(({ ops }) => {
      invertScanOps(ops).forEach(op => {
        expect(SCAN_ROTATION_HINTS[op]).toBeDefined();
      });
    });
  });
});

describe('scanRelationLabel', () => {
  test('기준면과 반대편을 구분한다', () => {
    expect(scanRelationLabel('U').long).toBe('기준면');
    expect(scanRelationLabel('D').long).toBe('기준면 반대편');
  });

  test('6면 모두 서로 다른 명칭을 가진다', () => {
    const labels = SCAN_FACE_LETTERS.map(face => scanRelationLabel(face).long);
    expect(new Set(labels).size).toBe(6);
  });
});

describe('단일 90도 인접 그래프 (시퀀스 최적성 근거)', () => {
  const key = ({ front, up }) => `${front}^${up}`;
  const targets = new Set(CONVENTION_POSES.map(([f, u]) => `${f}^${u}`));

  const degree = ([front, up]) => {
    const pose = scanPoseFrom(front, up);
    return Object.keys(SCAN_ROTATIONS)
      .map(op => key(describeScanPose(applyScanRotation(pose, op))))
      .filter(k => targets.has(k) && k !== `${front}^${up}`)
      .length;
  };

  test('U^B 와 D^F 가 차수 1 이라 해밀턴 경로가 없다', () => {
    expect(degree(['U', 'B'])).toBe(1);
    expect(degree(['D', 'F'])).toBe(1);
    // 두 리프가 모두 F^U 하나에만 붙어 있다 → 끝점 2개를 만들 수 없다
    const leafNeighbour = ([front, up]) => {
      const pose = scanPoseFrom(front, up);
      return Object.keys(SCAN_ROTATIONS)
        .map(op => key(describeScanPose(applyScanRotation(pose, op))))
        .find(k => targets.has(k) && k !== `${front}^${up}`);
    };
    expect(leafNeighbour(['U', 'B'])).toBe('F^U');
    expect(leafNeighbour(['D', 'F'])).toBe('F^U');
  });

  test('SCAN_SEQUENCE_OPS 는 복합 전이 1회로 최소다', () => {
    expect(SCAN_SEQUENCE_OPS.filter(ops => ops.length > 1)).toHaveLength(1);
  });
});
