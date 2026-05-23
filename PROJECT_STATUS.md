# 프로젝트 진행 상황 (2026-05-24)

## 현재 버전

`versionName = 1.0.5` / `versionCode = 6`

## 완료된 기능

### 코어
- **3D 큐브 렌더링** — Three.js r128, 26개 Cubie, WebGL via WebView
- **터치 인터랙션** — 레이어 드래그 회전, 뷰 회전, 핀치 줌(4~20), Fling 관성
- **큐브 논리** — 18개 표준 무브 + E/M/S 중간 레이어, facelets Array(54) 상태 관리
- **셔플** — 랜덤 25수 (같은 면 연속 방지), 90ms 순차 애니메이션
- **리셋** — 셔플 버튼 롱프레스(600ms) 또는 `resetCube()` 호출
- **무브 카운터** — 수동 무브 카운트 표시 (셔플/솔버 무브 제외)

### 솔버
- **cubing.js 솔버** — Kociemba 2-phase 알고리즘 (cubing-solver.bundle.js)
- **Strategy 패턴** — `CubeSolverBase` → `CubingJsSolver` → `SolverFactory`
- **단계별 실행** — 첫 수 자동 + 이후 Solve 버튼 탭마다 1수씩, "N / total" 진행 표시
- **계산 중 pulse 애니메이션** — 솔버 계산 중 Solve 버튼에 0.9s pulse 효과

### Undo / Redo
- **히스토리 스택** — `undoStack` / `redoStack`, 역이동(`inverseMoveOf`) 애니메이션
- **동시 차단** — `isShuffling`, `isSolving`, `isUndoRedo` 플래그로 충돌 방지

### 스코어링 & UI
- **실시간 타이머** — 셔플 완료 시점부터 실시간 경과 시간 표시 (requestAnimationFrame 기반)
- **PB 트래킹** — localStorage 기반 시간/이동수 개인 최고 기록
- **축하 오버레이** — 솔브 완료 시 통계 카드 + New Best 배지 + 컨페티 애니메이션
- **솔버 사용 시 제외** — `usedSolver = true`이면 PB 기록 제출 안 함

### 테마 & UX
- **글래스모피즘 UI** — backdrop-filter blur(24px), 반투명 배경, 둥근 모서리(24px)
- **다크 모드 토글** — localStorage 저장, CSS data-theme + WebGL 배경색 연동
- **Solve 버튼 아이콘 동적 표시** — 광고 필요 여부에 따라 아이콘 전환
- **햅틱 피드백** — 레이어 확정 시 `AndroidBridge.hapticFeedback()` 호출 (셔플 중 비활성화)

### 플랫폼
- **Edge-to-Edge** — `enableEdgeToEdge()` + WindowInsets → CSS `--safe-*` 변수 브릿지
- **AdMob 리워드 광고** — 셔플/리셋 후 첫 솔브 시 1회 광고 (`solveGranted` 플래그)
- **광고 실패 폴백** — 광고 로드/표시 실패 시 솔버 무료 허용
- **생명주기** — `onDestroy`에서 광고 콜백 해제 + WebView destroy
- **백 버튼** — `finishAndRemoveTask()` + `killProcess()`
- **다크모드 aria-label** — 테마 토글 버튼에 접근성 라벨 설정

## 최근 수정 이력

| 커밋 | 내용 |
|------|------|
| `9dfc379` | build.gradle.kts 업데이트 |
| `3a82f4c` | 솔버 계산 중 Solve 버튼 pulse 애니메이션 추가 (UX-007) |
| `58f568e` | 솔브 중 실시간 타이머 표시 (ST-007) |
| `83149dc` | 프로젝트 백로그 티켓화 (8개 관심사별 MD 파일, 129개 티켓) |
| `c22d4e8` | deploy 1.0.4 |
| `584d6e0` | actions.js, layer-rotation.js, cube.html 관심사 분리 |
| `8ea3963` | 솔버 사용 후 수동 마무리 시 축하 오버레이 미표시 버그 수정 |
| `1e3613c` | deploy 1.0.3 |
| `65fb4b9` | 다크 모드 토글 추가 (localStorage 저장) |
| `6521e48` | Solve 버튼 아이콘을 광고 필요 여부에 따라 동적 표시 |
| `267c96f` | 솔버 완료 오버레이 표시 시 WebGL context 반복 소실 및 깜빡임 수정 |

---
*업데이트: 2026년 5월 24일*
