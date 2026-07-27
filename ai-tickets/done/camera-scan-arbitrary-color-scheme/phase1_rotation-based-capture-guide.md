# Phase 1 — 색 이름 없는 회전 기반 6면 촬영 가이드

> 상태: **구현 완료 · 실기기 확인 대기**
> 선행: `camera-cube-scan`의 Phase 5 (6면 가이드 구현)
> 검증 주체: Jest(회전 모델) + 브라우저 UI 확인 + 실기기 수동 확인

## 문제/목표

현재 `scan-ui.js:1-8`은 `SCAN_FACE_GUIDE`에 `'흰색'`, `'빨강'` 같은 제조사 색 이름을 박아두고
"흰색 면(U)을 촬영, 파랑 면(B)이 위" 식으로 안내한다. 보라색이나 비표준 센터 배색을 쓰는
큐브에서는 사용자가 어느 면을 어느 슬롯에 넣어야 하는지 알 수 없다.

첫 번째 면은 사용자가 임의로 고르고, 이후에는 색 이름이 아니라 **큐브를 어느 방향으로 90도
돌릴지** 안내해 6면의 공간 관계와 각 면의 row-major 방향을 결정한다.

## 전제 (overview의 결정 1·2)

- 방향 규약(면별 "화면 위쪽에 오는 면")은 **바꾸지 않는다**. `FACE_DEFS.slots`와 묶여 있다.
- 촬영 **순서**만 `U → F → D → R → B → L`(슬롯 인덱스 `0, 2, 3, 1, 5, 4`)로 바꾼다.
- 사용자가 고른 기준면이 정의상 내부 U다. 데이터 순열은 발생하지 않는다.

### 확정 시퀀스

| 스텝 | 안내할 조작 | 슬롯 | 화면 위쪽 | 회전 |
| --- | --- | --- | --- | --- |
| 1 | 기준면을 정면에, 위 방향을 하나 정한다 | U (0) | B | — |
| 2 | 위쪽을 뒤로 넘겨 한 칸 굴린다 | F (2) | U | `pitch-` |
| 3 | 같은 방향으로 한 칸 더 굴린다 | D (3) | F | `pitch-` |
| 4 | 한 칸 되돌린 뒤, 오른쪽 면이 정면으로 오게 돌린다 | R (1) | U | `pitch+` → `yaw-` |
| 5 | 같은 방향으로 한 번 더 돌린다 | B (5) | U | `yaw-` |
| 6 | 같은 방향으로 한 번 더 돌린다 | L (4) | U | `yaw-` |

스텝 4만 복합이다. 규약 6자세의 단일 90° 인접 그래프에서 `U^B`와 `D^F`가 모두 `F^U`에만
붙은 차수 1 노드라 해밀턴 경로가 존재하지 않으며, 복합 전이 1회가 이론적 최소다.
(현재 순서 `U→R→F→D→L→B`는 복합이 2회다.)

## 수정 대상

- 신규 `app/src/main/assets/js/scan/scan-orientation.js` — 순수 회전 모델
- 신규 `tests/scan-orientation.test.js`
- `app/src/main/assets/js/scan/scan-ui.js` — 색 이름 제거, 스텝/슬롯 인덱스 분리
- `app/src/main/assets/cube.html` — 회전 도식 DOM
- `app/src/main/assets/css/cube.css`
- `app/src/main/assets/js/CLAUDE.md` — 모듈 표·로딩 순서 갱신

`scan-capture.js`와 네이티브 `captureFace(faceIndex)`는 **변경하지 않는다.** 슬롯 인덱스를
그대로 넘기면 `scanFaceSamples`가 처음부터 내부 면 순서로 채워진다.

## 구현 방향

### `scan-orientation.js` (순수 모듈)

문자열 배열로 순서를 하드코딩하지 말고 회전을 실제로 계산한다.

```js
// 카메라 좌표계: x=오른쪽, y=위, z=화면 밖
// 큐브 로컬 우수계: X=R, Y=U, Z=F  (R = U × F)
buildScanSequence() => [
  { step, slot, front, up, ops: ['pitch-'], hint }, ...
]
```

- 자세를 `{면 → 카메라축 단위벡터}` 맵으로 표현하고 `pitch±`/`yaw±`/`roll±` 90° 행렬을 적용
- 각 스텝의 결과 `front`/`up`이 `camera-cube-scan`의 방향 규약과 일치하는지 모듈 내부에서 단언
- 카이랄리티 검사(`R === U × F`)를 자세 생성 시 강제해 거울상 배치를 원천 차단
- 파일 끝에 `if (typeof module !== 'undefined') module.exports = {...}`
  (`camera-cube-scan` overview의 테스트 인프라 제약)

### `scan-ui.js` — 스텝과 슬롯 분리

현재 `currentScanFace` 하나가 "몇 번째 스텝인가"와 "어느 면 슬롯인가"를 겸하고 있다.
촬영 순서가 슬롯 순서와 달라지므로 반드시 분리해야 한다. 영향 지점:

| 위치 | 현재 | 변경 |
| --- | --- | --- |
| `captureScanFace(currentScanFace)` | 스텝=슬롯 | `captureScanFace(step.slot)` |
| `scan-face-sampled` 핸들러의 `faceIndex !== currentScanFace` | 스텝 비교 | 슬롯 비교 |
| `currentScanFace === 5` 종료 조건 | 슬롯 5 | `step === 5` (마지막 스텝) |
| `retakePreviousScanFace()` → `clearScanFace(currentScanFace)` | 스텝 | 이전 스텝의 슬롯 |
| `SCAN_FACE_GUIDE[currentScanFace]` | 슬롯 순 배열 | 시퀀스 스텝 배열 |

`camera-cube-scan` overview의 경고대로 여기서 어긋나면 **"검증은 통과하는데 실물과 다른
큐브"** 가 되어 조용히 틀린다. 슬롯 혼동을 막기 위해 변수명을 `currentScanStep` /
`currentScanSlot`으로 명시적으로 나눈다.

### 안내 UI

- `흰색`, `빨강` 같은 제조사 색 이름 제거
- `기준면`, `오른쪽 면`, `반대 면` 등 관계 명칭 사용
- 회전축과 방향을 화살표 또는 작은 큐브 도식으로 표시. 스텝 4는 "되돌리기 → 옆으로"의
  2단 애니메이션으로 표현
- 기준면의 위 방향을 유지하도록 스텝 1에 꼭짓점/센터 기준 도식 제공
- 현재까지 촬영한 센터색 미리보기는 보조 정보로만 표시하고, 촬영 대상을 색으로 지시하지 않음

## 검증

### Jest (`tests/scan-orientation.test.js`)

- 시퀀스가 6개 슬롯을 중복 없이 정확히 한 번씩 방문
- 각 스텝의 `front`/`up`이 `camera-cube-scan` 방향 규약 표와 완전히 일치
- 회전 op를 순차 적용한 결과가 선언된 `front`/`up`과 일치 (표와 op가 따로 놀지 않음)
- 모든 자세에서 `R === U × F` 카이랄리티 유지
- 복합 전이가 1회뿐임을 회귀 고정
- 슬롯 순서가 `[0, 2, 3, 1, 5, 4]`임을 고정 — `scan-ui.js`가 이 값을 신뢰한다

### 수동

- 기본 배색을 모르는 사용자가 텍스트와 도식만 보고 6면 촬영 가능
- 표준 배색 큐브로 촬영 → 완성 상태에서 `validateFacelets()` 통과 및 실물과 일치
  (슬롯 분리 실수를 잡는 유일한 실물 검증)
- 재촬영(이전 스텝) 후에도 올바른 슬롯이 초기화됨
- 세로·가로 화면에서 회전 화살표와 촬영 가이드가 겹치지 않음

## 진행 기록

- 2026-07-27: 구현 완료
  - 신규 `scan/scan-orientation.js` — 정수 90도 회전 행렬, 우수계(`R = U × F`) 강제,
    규약 위반 시 `buildScanSequence()`가 예외를 던진다
  - 신규 `tests/scan-orientation.test.js` 35개 — 전체 스위트 150개 통과
    (`camera-cube-scan` 기준선 115개 + 35개)
  - `scan-ui.js`: `SCAN_FACE_GUIDE` 색 이름 테이블 제거, `currentScanFace` →
    `currentScanStep` / `currentScanSlot()` 로 분리
  - `cube.html` / `cube.css`: `#scan-rotation` 회전 안내 칩 추가, 헤더 기본 문구에서 색 이름 제거
- 추가 발견 및 수정: **되돌리기 안내가 틀렸다.** 스텝 N 에서 N-1 로 돌아갈 때 N-1 의 정방향
  ops 를 보여주면 이미 수행한 회전을 또 하라는 안내가 된다. `invertScanOps()` 를 추가해
  역회전을 보여주도록 고쳤다.
- 네이티브 무변경 확인: `MainActivity.kt:150` `captureFace(faceIndex)` 는 faceIndex 를 저장
  인덱스로만 쓰고 면별 회전 보정을 하지 않으므로 촬영 순서 변경이 안전하다
- `./gradlew assembleDebug` 성공
- `./gradlew lint` 실패 — 다만 **기존 문제**였다. `git stash` 후 HEAD 에서도 동일하게
  13 errors / 42 warnings 이며 전부 CameraX `ExperimentalCamera2Interop` opt-in 누락이다.
  이 phase 가 만든 신규 경고는 없었다.
  → `camera-cube-scan` Phase 8 에서 해소 완료. 현재 `./gradlew lint` 는 통과한다.

## 남은 확인 (실기기)

- 표준 배색 큐브로 6면 촬영 후 실물 일치 확인 — 슬롯/스텝 분리 검증
- 세로·가로에서 회전 칩과 가이드 격자가 겹치지 않는지
- 스텝 4 복합 안내가 실제로 따라 하기 쉬운지
