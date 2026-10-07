# 프로젝트 진행 상황 (2026-10-07)

## 현재 버전

`versionName = 1.2.0` / `versionCode = 10` (`8fee6e5`, 서명 AAB `app-1.2.0-10.aab` 빌드 완료 · 스토어 업로드는 사용자 진행)

### 1.2.0 릴리스 범위 (1.1.2 `8b1bf4f` 이후)
- 실물 큐브 카메라 스캔 + 임의 배색 스캔 + 3D 미니 큐브 촬영 가이드
- 스캔 솔브 따라 하기 모드 (프로토타입)
- 태블릿 반응형 레이아웃 (Phase 1~4)
- 큐브 터치 햅틱·스티커 강조 피드백
- 뒤로 가기 처리 개선 (오버레이·따라 하기 화면 닫기, 스캔 결과에서 마지막 면 재촬영 복귀)

> ⚠️ 위 스캔·따라 하기 기능은 기능 플래그 없이 1.2.0 기본 경로에 포함되지만 **실기기 검증 전**이다.
> 아래 "구현 완료 · 미검증" 참고. 내부 테스트 트랙 선배포 후 실기기 확인을 권장.

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
- **단계별 실행** — 첫 수 자동 + 이후 Solve 버튼 탭마다 1수씩, "N / total" 진행 표시 (스캔 솔브는 따라 하기 모드로 대체)
- **계산 중 pulse 애니메이션** — 솔버 계산 중 Solve 버튼에 0.9s pulse 효과

### Undo / Redo
- **히스토리 스택** — `undoStack` / `redoStack`, 역이동(`inverseMoveOf`) 애니메이션
- **동시 차단** — `isShuffling`, `isSolving`, `isUndoRedo` 플래그로 충돌 방지

### 스코어링 & UI
- **실시간 타이머** — 셔플 완료 시점부터 실시간 경과 시간 표시 (requestAnimationFrame 기반)
- **PB 트래킹** — localStorage 기반 시간/이동수 개인 최고 기록
- **축하 오버레이** — 솔브 완료 시 통계 카드 + New Best 배지 + 컨페티 애니메이션
- **솔버 사용 시 제외** — `usedSolver = true`이면 PB 기록 제출 안 함
- **솔브 히스토리 저장** — localStorage에 솔브 기록(시간/무브수/날짜/솔버여부) 저장, 최대 1000건 (ST-005)
- **통계 대시보드** — ao5/ao12/ao100, 최고 기록, 스파크라인 차트, 최근 20건 목록 (ST-100)

### 테마 & UX
- **글래스모피즘 UI** — backdrop-filter blur(24px), 반투명 배경, 둥근 모서리(24px)
- **다크 모드 토글** — localStorage 저장, CSS data-theme + WebGL 배경색 연동
- **Solve 버튼 아이콘 동적 표시** — 광고 필요 여부에 따라 아이콘 전환
- **햅틱 피드백** — 레이어 확정 시 `AndroidBridge.hapticFeedback()` 호출 (셔플 중 비활성화)
- **터치 피드백** — 큐브 면 터치 시작 시 짧은 햅틱 + 누르는 동안 해당 스티커만 강조
- **태블릿 반응형 레이아웃** — 600px 브레이크포인트, 메인 화면 재배치, 통계·스캔 결과 오버레이 중앙 다이얼로그화 (에뮬레이터 검증, 실기기 잔여)

### 플랫폼
- **Edge-to-Edge** — `enableEdgeToEdge()` + WindowInsets → CSS `--safe-*` 변수 브릿지
- **Android 15 와이드스크린 인셋 대응** — systemBars + displayCutout 합집합으로 safe inset 계산 (IF-020)
- **AdMob 리워드 광고** — 셔플/리셋 후 첫 솔브 시 1회 광고 (`solveGranted` 플래그)
- **광고 실패 폴백** — 광고 로드/표시 실패 시 솔버 무료 허용
- **생명주기** — `onDestroy`에서 광고 콜백 해제 + WebView destroy
- **백 버튼** — `AndroidCube.handleBack()`이 열린 화면을 위에서부터 하나씩 닫음 (완성 → 스캔 결과 → 통계 → 따라 하기). 스캔 결과는 버리지 않고 마지막 면 재촬영으로 복귀하며 수동 색 수정 유지. 닫을 화면이 없으면 `finishAndRemoveTask()` (실기기 미확인)
- **다크모드 aria-label** — 테마 토글 버튼에 접근성 라벨 설정
- **인앱 강제 업데이트** — AppUpdateManager IMMEDIATE 타입, 앱 시작 시 업데이트 확인 (IF-103)
- **Play Console 권장 조치 반영** — androidx.fragment 1.8.5 constraint, androidx.activity 1.10.1, androidx.core 1.16.0 (IF-018/IF-019)

## 구현 완료 · 미검증 (릴리스 게이트 미통과)

- **실물 큐브 스캔** — CameraX 6면 촬영, 상대 색 분류, 결과 수정 후 3D 상태 주입·Solve.
  `ai-tickets`의 `camera-cube-scan` Phase 1~7 구현 완료, Phase 8 코드 하드닝(lint opt-in 에러 해소,
  저조도 경고·반복 실패 격상·광고 콜백 방어·회전 시 진행 유지) 완료. 3D 미니 큐브 촬영 가이드 포함.
  **실기기 조명 매트릭스 실측 전**이며 릴리스 게이트를 통과하지 않았다.
  실측은 `camera-scan-arbitrary-color-scheme` Phase 4 소유.
- **스캔 솔브 따라 하기 모드 (프로토타입)** — 스캔으로 시작한 솔브는 글 설명 없이 따라 하도록
  움직일 줄만 밝게 + 회전축 둘레 3D 화살표 + 회전 반복 미리보기. 탭/왼쪽 스와이프 = 다음 수,
  오른쪽 스와이프 = 이전 수, 진행 바·닫기. 브라우저에서만 확인. **남은 것**: 비숙련자 대상 실기기
  사용자 테스트, B/D(가려진 면) 수 가독성, 가로·태블릿 확인, 미리보기 속도(0.75s) 조정.
- **임의 배색 스캔** — `camera-scan-arbitrary-color-scheme` Phase 1~3 구현 완료(회전 기반 촬영 순서,
  세션 센터 팔레트·유사색 경고, 실제 색 검토·3D 렌더링, 면 단위 재촬영). 경고 임계값은 잠정값이며
  Phase 4(비표준 배색 실물 큐브 실측)는 **큐브 조달 대기로 차단**. 기능 플래그 없이 기본 경로에 적용됨.

### 테스트
- **Jest 순수 로직 테스트** — 큐브 무브·역무브·통계, 색 분류·세션 팔레트·큐브 검증, 촬영 순서 회전 모델,
  스캔 저조도 판정까지 206개 테스트 (2026-10-07 전부 통과) (`cube-logic` / `color-classify` / `cube-validate` / `scan-orientation` /
  `face-palette` / `scan-brightness`) (IF-008). 스캔 테스트는 합성 RGB 기준, 실측 fixture 미확보

## 최근 수정 이력

| 커밋 | 내용 |
|------|------|
| `8fee6e5` | versionName 1.2.0 / versionCode 10 업데이트 |
| `dba48bc` | origin/main → feature/arbitrary-color-scheme-scan 머지 |
| `e8e8d66` | 마지막 면 재촬영 후에도 스캔 결과의 수동 색 수정 유지 |
| `6e24b19` | 오버레이 화면에서 뒤로 가기 시 앱 종료 대신 화면 닫기 |
| `79eace4` | 따라 하기 모드에서 뒤로 가기 시 앱 종료 대신 화면 닫기 |
| `defcbe3` | 스캔 솔브 따라 하기 모드 프로토타입 |
| `9d2c86d` | 카메라 스캔 3D 미니 큐브 촬영 가이드 |
| `461b466` | 태블릿 레이아웃 Phase 4 에뮬레이터 검증 결과 기록 |
| `84b5cce` | 태블릿 레이아웃 Phase 3 — 오버레이 중앙 다이얼로그화 |
| `4fb7c90` | 태블릿 레이아웃 Phase 2 — 메인 화면 재배치 |
| `67a1641` | 태블릿 반응형 레이아웃 티켓 + Phase 1 브레이크포인트 스캐폴드 |
| `36f408d` | 카메라 스캔 Phase 8 하드닝 — lint 게이트·실패 복구·회전 유지 |
| `d7efc77` | CameraX opt-in 전파 차단으로 린트 오류 13건 해소 |
| `f765257` | 제조사 배색과 무관한 실물 큐브 스캔 (Phase 1~3) |
| `2222efa` | 임의 배색 큐브 스캔 티켓 추가 |
| `4b1f948` | 터치한 스티커만 누르는 동안 강조 |
| `0aa6a8e` | 큐브 터치 면 햅틱과 강조 피드백 추가 |
| `87313bf` | 스캔 가이드를 정사각형으로 보정 |
| `ea0dab3` | CameraX 디버그 컴파일 오류 수정 |
| `bc01605` | 스캔 큐브 상태 주입과 Solve 연동 |
| `ef065af` | 스캔 결과 검토 및 색 수정 UI |
| `2b4492a` | 상대 군집 기반 큐브 색 분류기 |
| `dcc394d` | CameraX 큐브 스캔 프리뷰 기반 |
| `8b1bf4f` | 버전 1.1.2 (versionCode 9) 릴리스 |
| `2b79265` | Target SDK 36 대응 — AGP 8.9.1·Gradle 8.11.1 업그레이드 |
| `770b667` | versionName 1.1.1 / versionCode 8 업데이트 |
| `3862ccc` | Android 15 displayCutout 포함 인셋 계산 보강 (IF-020) |
| `8ea33dd` | androidx.activity/core 업그레이드로 Edge-to-Edge deprecated API 제거 (IF-019) |
| `663c80c` | androidx.fragment 1.8.5 강제 업그레이드 (IF-018) |
| `7d7864e` | Play Console 권장 조치 3건 인프라 백로그 티켓 추가 |
| `330e8a5` | 큐브 순수 로직 Jest 테스트 97개 추가 |
| `30db33c` | 동시성 플래그 잠김, 데이터 손실 등 14개 버그 수정 |
| `a6d49f4` | 문서·백로그 v1.1.0 기준 전수조사 싱크 현행화 |
| `83e8855` | 인앱 강제 업데이트 추가 |
| `3faa732` | deploy 1.1.0 |
| `0735df6` | 솔버 완료 시 솔브 히스토리 기록 누락 버그 수정 |
| `643cedf` | 솔브 히스토리 저장 + 통계 대시보드 추가 (ST-005 / ST-100) |
| `b201cac` | 터치감 개선 티켓 6개 추가 (CG-016~021) 및 구현 가이드 |
| `885f0aa` | 프로젝트 문서·백로그 v1.0.5 기준 싱크 현행화 |
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
*업데이트: 2026년 10월 7일*
