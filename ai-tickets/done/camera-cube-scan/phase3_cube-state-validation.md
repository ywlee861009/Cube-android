# Phase 3 — 큐브 상태 유효성 검증 (솔버 앞단 방어)

> 상태: **구현 완료 · 통합 검증 대기** (2026-07-27)
> 선행: 없음 (Phase 1과 병렬 착수 가능)
> 검증 주체: `npm test`

## 문제/목표

**이건 스캔 기능과 무관하게 지금도 있어야 할 방어 코드다.**

`app/src/main/assets/js/lib/cubing-solver.bundle.js:13213` `faceletsToKPuzzleState()`에는
유효성 검증이 전혀 없다. 조각을 못 찾으면 `pieceIdx = -1`이 그대로 permutation 배열에
들어간다.

```js
// bundle.js:13303 근처
let pieceIdx = -1;
for (let p = 0; p < 8; p++) { ... }
cornerPermutation[pos] = pieceIdx;   // -1이어도 그대로
```

지금까지 무사했던 건 앱이 항상 "완성 상태에서 정당한 move만 적용"했기 때문이다.
스캔 상태를 주입하는 순간 잘못된 큐브가 솔버 내부로 들어가 예외·무한대기·쓰레기 해법이 된다.
`solve.js:80`의 `solver.solve([...facelets])` 앞에 검증을 세운다.

## 수정 대상

- 신규 `app/src/main/assets/js/scan/cube-validate.js` — 순수 검증 모듈
- `app/src/main/assets/js/solve.js:56` `_runSolve()` — 솔버 호출 전 검증 삽입
- `app/src/main/assets/cube.html` — 스크립트 로딩 순서 (solver 뒤, `solve.js` 앞)
- 신규 `tests/cube-validate.test.js`
- `app/src/main/assets/js/CLAUDE.md`, `app/src/main/assets/js/solver/CLAUDE.md` — 흐름 갱신

## 구현 방향

### API

```js
// 반환: { ok: true } | { ok: false, code, message, badIndices: [] }
function validateFacelets(f)
```

`badIndices`는 Phase 6의 수정 UI에서 문제 위치를 하이라이트하는 데 쓴다.
**메시지는 사용자에게 그대로 노출될 수 있으므로 기술 용어를 피한다** —
"코너 방향 합 불일치"가 아니라 "모서리 조각 하나가 잘못 읽혔어요" 수준.

### 검사 항목 (순서대로, 앞에서 걸리면 조기 반환)

1. **길이·범위** — 54개, 각 값이 0~5 정수
2. **색 개수** — 각 색이 정확히 9개
3. **센터 유일성** — 인덱스 4, 13, 22, 31, 40, 49의 값이 서로 모두 달라야 함
4. **코너 조각 집합** — 8개 코너의 색 3개조가 정당한 조각 8종과 정확히 일대일 대응.
   같은 조각 중복·불가능한 조합(예: 흰+노) 검출
5. **엣지 조각 집합** — 12개 엣지 동일
6. **코너 방향 합** — `% 3 == 0`
7. **엣지 방향 합** — `% 2 == 0`
8. **순열 패리티** — 코너 순열 패리티와 엣지 순열 패리티가 일치

4~8은 `bundle.js:13213`의 `CORNER_STICKERS`/`EDGE_STICKERS`/`CORNER_FACE_CYCLES`/
`EDGE_FACE_CYCLES` 상수와 **동일한 인덱스 테이블**을 써야 한다. 번들을 수정하지 말고
`cube-validate.js`에 복사해 오되, 출처를 주석으로 남긴다.

> 3~8번은 "센터가 표준 색 배치"임을 가정한다. 스캔한 큐브의 센터 색 배치가 표준과 다를 수
> 있으므로(큐브 제조사별 배색 차이), 센터 6개를 읽어 면 인덱스를 매핑하는 일은 Phase 4가
> 담당하고 이 모듈은 이미 정규화된 facelets를 받는다.

### `_runSolve()` 통합

```js
const v = validateFacelets(facelets);
if (!v.ok) { setStatus(v.message); resetButtons(); return; }
const solution = await solver.solve([...facelets]);
```

기존 셔플 경로에서는 항상 `ok: true`여야 하므로 회귀가 없다.

### 모듈 형식

`overview.md`의 테스트 인프라 제약에 따라 파일 끝에:

```js
if (typeof module !== 'undefined') module.exports = { validateFacelets };
```

`tests/cube-logic.js`처럼 코드를 복사하지 않고 Jest가 원본을 직접 require 한다.

## 검증

`tests/cube-validate.test.js`:

- 완성 상태 → `ok: true`
- `ALL_MOVES`에서 무작위 100회 셔플한 상태 → 전부 `ok: true`
  (`tests/cube-logic.js`의 `applyMoveInPlace` 재사용)
- 색 개수 위반 (한 칸을 다른 색으로) → 코드 `COLOR_COUNT`
- 코너 스티커 2개 교환 → 패리티 위반 검출
- 코너 1개만 비틀기 → 방향 합 위반 검출
- 엣지 1개만 뒤집기 → 방향 합 위반 검출
- 두 엣지 교환 (코너 그대로) → 패리티 위반 검출
- 불가능한 색 조합 코너(흰+노 인접) → 조각 집합 위반 검출
- `badIndices`가 실제 문제 위치를 가리키는지

`npm test` 전체 통과. 기존 `cube-logic.test.js` 회귀 없음.
