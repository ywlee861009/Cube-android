# 프로젝트 진행 상황 (2026-04-27)

## 현재 버전

`versionName = 1.0.1` / `versionCode = 2`

## 완료된 기능

### 코어
- **3D 큐브 렌더링** — Three.js r128, 26개 Cubie, WebGL via WebView
- **터치 인터랙션** — 레이어 드래그 회전, 뷰 회전, 핀치 줌(4~20), Fling 관성
- **큐브 논리** — 18개 표준 무브 + E/M/S 중간 레이어, facelets Array(54) 상태 관리
- **셔플** — 랜덤 25수 (같은 면 연속 방지), 90ms 순차 애니메이션
- **리셋** — 셔플 버튼 롱프레스(600ms) 또는 `resetCube()` 호출

### 솔버
- **cubing.js 솔버** — Kociemba 2-phase 알고리즘 (cubing-solver.bundle.js)
- **Strategy 패턴** — `CubeSolverBase` → `CubingJsSolver` → `SolverFactory`
- **단계별 실행** — 첫 수 자동 + 이후 Solve 버튼 탭마다 1수씩, "N / total" 진행 표시

### Undo / Redo
- **히스토리 스택** — `undoStack` / `redoStack`, 역이동(`inverseMoveOf`) 애니메이션
- **동시 차단** — `isShuffling`, `isSolving`, `isUndoRedo` 플래그로 충돌 방지

### 스코어링 & UI
- **타이머** — 셔플 완료 시점부터 솔브 완료까지 시간 측정
- **PB 트래킹** — localStorage 기반 시간/이동수 개인 최고 기록
- **축하 오버레이** — 솔브 완료 시 통계 카드 + New Best 배지 + 컨페티 애니메이션
- **솔버 사용 시 제외** — `usedSolver = true`이면 PB 기록 제출 안 함

### 플랫폼
- **Edge-to-Edge** — `enableEdgeToEdge()` + WindowInsets → CSS `--safe-*` 변수 브릿지
- **AdMob 리워드 광고** — 셔플/리셋 후 첫 솔브 시 1회 광고 (`solveGranted` 플래그)
- **햅틱 피드백** — 레이어 확정 시 `AndroidBridge.hapticFeedback()` 호출
- **생명주기** — `onDestroy`에서 광고 콜백 해제 + WebView destroy
- **백 버튼** — `finishAndRemoveTask()` + `killProcess()`

## 최근 수정 이력

| 커밋 | 내용 |
|------|------|
| `8750052` | 버전 업 1.0.0 → 1.0.1 (versionCode 2) |
| `23fc436` | animation.js RAF 취소 시 orphaned layerGroup 메모리 누수 수정 |
| `ab4ae9b` | JS P1 버그 수정 (재진입 가드, 유효성 검사, RAF 취소) |

---
*업데이트: 2026년 4월 27일*
