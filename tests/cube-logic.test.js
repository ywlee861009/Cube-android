const {
  applyMoveInPlace, MOVES, ALL_MOVES,
  solvedFacelets, isCubeSolved,
  inverseMoveOf,
  _fmtTime, _averageOf, computeStats, fmtStat,
} = require('./cube-logic');

// ═══════════════════════════════════════════════════════════════════════════
// 헬퍼
// ═══════════════════════════════════════════════════════════════════════════

function solved() { return solvedFacelets(); }

function applySequence(f, moves) {
  moves.forEach(m => applyMoveInPlace(m, f));
  return f;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. 큐브 상태 & 완성 감지
// ═══════════════════════════════════════════════════════════════════════════

describe('isCubeSolved', () => {
  test('초기 상태는 완성', () => {
    expect(isCubeSolved(solved())).toBe(true);
  });

  test('한 무브 적용 후 미완성', () => {
    const f = solved();
    applyMoveInPlace('R', f);
    expect(isCubeSolved(f)).toBe(false);
  });

  test('면 색이 동일하지만 위치가 뒤섞인 경우 완성으로 판단', () => {
    // isCubeSolved는 각 면의 9칸이 모두 같은 값이면 완성으로 봄
    // 면 간 색상 교환은 감지하지 않음 (현재 로직의 명시적 한계)
    const f = solved();
    // 수동으로 U면과 D면 색상 교환
    for (let i = 0; i < 9; i++) { f[i] = 3; f[27 + i] = 0; }
    expect(isCubeSolved(f)).toBe(true); // 현재 로직은 면별 동일성만 체크
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. 무브 적용 (applyMoveInPlace)
// ═══════════════════════════════════════════════════════════════════════════

describe('applyMoveInPlace', () => {
  test('U 4회 적용 시 원래 상태 복원', () => {
    const f = solved();
    applySequence(f, ['U', 'U', 'U', 'U']);
    expect(f).toEqual(solved());
  });

  test('R 4회 적용 시 원래 상태 복원', () => {
    const f = solved();
    applySequence(f, ['R', 'R', 'R', 'R']);
    expect(f).toEqual(solved());
  });

  test("U + U' = 항등 (역무브)", () => {
    const f = solved();
    applySequence(f, ['U', "U'"]);
    expect(f).toEqual(solved());
  });

  test('U2 = U + U', () => {
    const f1 = solved();
    applySequence(f1, ['U2']);
    const f2 = solved();
    applySequence(f2, ['U', 'U']);
    expect(f1).toEqual(f2);
  });

  test.each(Object.keys(MOVES))('%s 4회 = 항등', (base) => {
    const f = solved();
    const move = base;
    applySequence(f, [move, move, move, move]);
    expect(f).toEqual(solved());
  });

  test.each(ALL_MOVES)('%s + inverse = 항등', (move) => {
    const f = solved();
    const inv = inverseMoveOf(move);
    applySequence(f, [move, inv]);
    expect(f).toEqual(solved());
  });

  test('유효하지 않은 무브명은 무시', () => {
    const f = solved();
    const before = [...f];
    applyMoveInPlace('X', f);
    applyMoveInPlace('', f);
    applyMoveInPlace(null, f);
    expect(f).toEqual(before);
  });

  test('섹시 무브(R U R\' U\') 6회 = 항등', () => {
    const f = solved();
    for (let i = 0; i < 6; i++) applySequence(f, ['R', 'U', "R'", "U'"]);
    expect(f).toEqual(solved());
  });

  test('T-perm 알고리즘 2회 = 항등', () => {
    const f = solved();
    const tPerm = ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"];
    applySequence(f, tPerm);
    expect(isCubeSolved(f)).toBe(false);
    applySequence(f, tPerm);
    expect(f).toEqual(solved());
  });

  test('슈퍼플립(모든 엣지 반전) 적용 후 미완성', () => {
    const f = solved();
    const superflip = ['U', 'R2', 'F', 'B', 'R', 'B2', 'R', 'U2', 'L', 'B2',
                        'R', "U'", "D'", 'R2', 'F', "R'", 'L', 'B2', 'U2', 'F2'];
    applySequence(f, superflip);
    expect(isCubeSolved(f)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. 중간 레이어 (E, M, S)
// ═══════════════════════════════════════════════════════════════════════════

describe('중간 레이어 무브', () => {
  test('E 4회 = 항등', () => {
    const f = solved();
    applySequence(f, ['E', 'E', 'E', 'E']);
    expect(f).toEqual(solved());
  });

  test('M 4회 = 항등', () => {
    const f = solved();
    applySequence(f, ['M', 'M', 'M', 'M']);
    expect(f).toEqual(solved());
  });

  test('S 4회 = 항등', () => {
    const f = solved();
    applySequence(f, ['S', 'S', 'S', 'S']);
    expect(f).toEqual(solved());
  });

  test("E + E' = 항등", () => {
    const f = solved();
    applySequence(f, ['E', "E'"]);
    expect(f).toEqual(solved());
  });

  test("M + M' = 항등", () => {
    const f = solved();
    applySequence(f, ['M', "M'"]);
    expect(f).toEqual(solved());
  });

  test("S + S' = 항등", () => {
    const f = solved();
    applySequence(f, ['S', "S'"]);
    expect(f).toEqual(solved());
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. 무브 가환성 (교환 법칙)
// ═══════════════════════════════════════════════════════════════════════════

describe('무브 가환성', () => {
  test('대면 무브는 가환: U D = D U', () => {
    const f1 = solved(); applySequence(f1, ['U', 'D']);
    const f2 = solved(); applySequence(f2, ['D', 'U']);
    expect(f1).toEqual(f2);
  });

  test('대면 무브는 가환: R L = L R', () => {
    const f1 = solved(); applySequence(f1, ['R', 'L']);
    const f2 = solved(); applySequence(f2, ['L', 'R']);
    expect(f1).toEqual(f2);
  });

  test('대면 무브는 가환: F B = B F', () => {
    const f1 = solved(); applySequence(f1, ['F', 'B']);
    const f2 = solved(); applySequence(f2, ['B', 'F']);
    expect(f1).toEqual(f2);
  });

  test('인접 무브는 비가환: R U ≠ U R', () => {
    const f1 = solved(); applySequence(f1, ['R', 'U']);
    const f2 = solved(); applySequence(f2, ['U', 'R']);
    expect(f1).not.toEqual(f2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. inverseMoveOf
// ═══════════════════════════════════════════════════════════════════════════

describe('inverseMoveOf', () => {
  test("일반 무브 → 프라임 추가: R → R'", () => {
    expect(inverseMoveOf('R')).toBe("R'");
  });

  test("프라임 무브 → 프라임 제거: R' → R", () => {
    expect(inverseMoveOf("R'")).toBe('R');
  });

  test('더블 무브 → 자기 자신: U2 → U2', () => {
    expect(inverseMoveOf('U2')).toBe('U2');
  });

  test.each(ALL_MOVES)('%s의 역무브 적용 시 항등', (move) => {
    const f = solved();
    applyMoveInPlace(move, f);
    applyMoveInPlace(inverseMoveOf(move), f);
    expect(f).toEqual(solved());
  });

  test.each(['E', "E'", 'E2', 'M', "M'", 'M2', 'S', "S'", 'S2'])(
    '중간 레이어 %s의 역무브 적용 시 항등', (move) => {
      const f = solved();
      applyMoveInPlace(move, f);
      applyMoveInPlace(inverseMoveOf(move), f);
      expect(f).toEqual(solved());
    }
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. 시간 포맷 (_fmtTime)
// ═══════════════════════════════════════════════════════════════════════════

describe('_fmtTime', () => {
  test('0ms → "0.00s"', () => {
    expect(_fmtTime(0)).toBe('0.00s');
  });

  test('1234ms → "1.23s"', () => {
    expect(_fmtTime(1234)).toBe('1.23s');
  });

  test('59999ms → "59.99..." (60초 미만)', () => {
    const result = _fmtTime(59999);
    expect(result).toMatch(/^\d+\.\d+s$/);
  });

  test('60000ms → "1:00.00" (분:초 형식)', () => {
    expect(_fmtTime(60000)).toBe('1:00.00');
  });

  test('90500ms → "1:30.50"', () => {
    expect(_fmtTime(90500)).toBe('1:30.50');
  });

  test('125340ms → "2:05.34"', () => {
    expect(_fmtTime(125340)).toBe('2:05.34');
  });
});

describe('fmtStat', () => {
  test('null → "—"', () => {
    expect(fmtStat(null)).toBe('—');
  });

  test('숫자 → 포맷된 시간', () => {
    expect(fmtStat(1234)).toBe('1.23s');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. 통계 계산 (_averageOf, computeStats)
// ═══════════════════════════════════════════════════════════════════════════

describe('_averageOf', () => {
  test('데이터 부족 시 null 반환', () => {
    expect(_averageOf([1, 2, 3], 5)).toBeNull();
  });

  test('정확히 5개: 최고·최저 제외 3개 평균', () => {
    // [10, 20, 30, 40, 50] → 최고(10)·최저(50) 제외 → (20+30+40)/3 = 30
    expect(_averageOf([10, 20, 30, 40, 50], 5)).toBe(30);
  });

  test('최근 n개만 사용 (slice(-n))', () => {
    // [100, 10, 20, 30, 40, 50] → 마지막 5개: [10,20,30,40,50] → 30
    expect(_averageOf([100, 10, 20, 30, 40, 50], 5)).toBe(30);
  });

  test('동일 값 5개', () => {
    expect(_averageOf([10, 10, 10, 10, 10], 5)).toBe(10);
  });
});

describe('computeStats', () => {
  test('빈 히스토리', () => {
    const s = computeStats([]);
    expect(s.totalCount).toBe(0);
    expect(s.count).toBe(0);
    expect(s.best).toBeNull();
    expect(s.ao5).toBeNull();
  });

  test('솔버 사용 기록은 통계에서 제외', () => {
    const history = [
      { t: 30000, m: 50, d: 1, s: true },
      { t: 45000, m: 60, d: 2, s: true },
    ];
    const s = computeStats(history);
    expect(s.totalCount).toBe(2);
    expect(s.count).toBe(0);  // 솔버 사용은 제외
    expect(s.best).toBeNull();
  });

  test('혼합 히스토리 (솔버 + 수동)', () => {
    const history = [
      { t: 30000, m: 50, d: 1, s: false },
      { t: 45000, m: 60, d: 2, s: true },
      { t: 25000, m: 40, d: 3, s: false },
    ];
    const s = computeStats(history);
    expect(s.totalCount).toBe(3);
    expect(s.count).toBe(2);
    expect(s.best).toBe(25000);
    expect(s.worst).toBe(30000);
    expect(s.mean).toBe(27500);
    expect(s.ao5).toBeNull(); // 2개로 부족
  });

  test('5개 수동 솔브 → ao5 계산', () => {
    const history = [
      { t: 10000, m: 30, d: 1, s: false },
      { t: 20000, m: 40, d: 2, s: false },
      { t: 30000, m: 50, d: 3, s: false },
      { t: 40000, m: 60, d: 4, s: false },
      { t: 50000, m: 70, d: 5, s: false },
    ];
    const s = computeStats(history);
    expect(s.ao5).toBe(30000); // (20000+30000+40000) / 3
    expect(s.ao12).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. 무브 무결성 — 랜덤 스크램블 후 역순 복원
// ═══════════════════════════════════════════════════════════════════════════

describe('무브 무결성', () => {
  test('25수 랜덤 스크램블 후 역순 적용 → 복원', () => {
    const f = solved();
    const moves = [];
    let last = '';
    for (let i = 0; i < 25; i++) {
      const candidates = ALL_MOVES.filter(m => m[0] !== last[0]);
      const m = candidates[Math.floor(Math.random() * candidates.length)];
      moves.push(m);
      last = m;
    }

    applySequence(f, moves);
    expect(isCubeSolved(f)).toBe(false);

    // 역순으로 역무브 적용
    for (let i = moves.length - 1; i >= 0; i--) {
      applyMoveInPlace(inverseMoveOf(moves[i]), f);
    }
    expect(f).toEqual(solved());
  });

  test('동일 스크램블 시퀀스는 항상 동일 상태 생성', () => {
    const seq = ['R', 'U', 'F', "D'", 'L2', 'B', "R'", 'U2'];
    const f1 = solved(); applySequence(f1, seq);
    const f2 = solved(); applySequence(f2, seq);
    expect(f1).toEqual(f2);
  });

  test('100수 랜덤 시퀀스 후 역순 복원', () => {
    const f = solved();
    const allWithMid = [...ALL_MOVES, 'E', "E'", 'M', "M'", 'S', "S'"];
    const moves = [];
    for (let i = 0; i < 100; i++) {
      moves.push(allWithMid[Math.floor(Math.random() * allWithMid.length)]);
    }

    applySequence(f, moves);
    for (let i = moves.length - 1; i >= 0; i--) {
      applyMoveInPlace(inverseMoveOf(moves[i]), f);
    }
    expect(f).toEqual(solved());
  });
});
