# Infrastructure 백로그 (IF-)

빌드, CI/CD, 테스트, 보안, 아키텍처 관련 티켓

---

## Done

| ID | Title | P | Description |
|----|-------|---|-------------|
| IF-001 | Android-JS 브릿지 | P0 | CubeBridge 내부 클래스, @JavascriptInterface 3개 메서드 |
| IF-002 | 인셋 브릿지 | P0 | WindowInsets→CSS --safe-* 변수 (evaluateJavascript) |
| IF-003 | WebView 라이프사이클 관리 | P1 | onDestroy에서 광고 콜백 정리, WebView 파괴 |
| IF-004 | 솔버 전략 패턴 | P1 | SolverBase → CubingJsSolver → SolverFactory (교체 가능) |
| IF-005 | ProGuard 패키지명 수정 | P1 | `app/proguard-rules.pro` keep 대상 패키지를 `com.kero.cubie`로 정정 |
| IF-006 | Hilt ProGuard 규칙 제거 | P3 | 실제 사용하지 않는 Hilt/Dagger keep 규칙 제거 |
| IF-007 | PROJECT_STATUS.md 업데이트 | P2 | v1.1.1 / 2026-06-25 기준으로 프로젝트 상태 문서 현행화 |
| IF-008 | 자동화 테스트 추가 | P1 | Jest 기반 큐브 순수 로직 테스트 97개 추가 (`tests/cube-logic.test.js`): 무브/역무브/통계 계산 회귀 검증 |
| IF-018 | [Play 권장] androidx.fragment 버전 업 | P1 | `androidx.fragment:fragment` 1.8.5를 version catalog + dependency constraint로 강제 적용 |
| IF-019 | [Play 권장] Edge-to-Edge deprecated API 제거 | P1 | androidx.activity 1.10.1, androidx.core 1.16.0 업그레이드로 deprecated API 사용 경고 대응 |
| IF-020 | [Play 권장] Android 15 인셋/와이드스크린 검증 | P2 | `systemBars()` + `displayCutout()` 합집합을 WebView safe inset으로 전달하여 컷아웃/와이드스크린 겹침 대응 |
| IF-103 | 인앱 강제 업데이트 | P2 | AppUpdateManager IMMEDIATE 타입, 앱 시작 시 업데이트 확인 + onResume 재확인 |

## TODO

| ID | Title | P | Description |
|----|-------|---|-------------|
| IF-009 | CI/CD 파이프라인 구축 | P1 | GitHub Actions로 빌드/린트/테스트 자동화 |
| ~~IF-010~~ | ~~키스토어 자격증명 보안화~~ | — | .gitignore로 관리됨 — 불필요 |
| IF-011 | 크래시 리포팅 (Firebase Crashlytics) | P1 | 사용자 보고 외 크래시 가시성 없음 |
| IF-012 | 애널리틱스 (Firebase Analytics) | P2 | 사용 패턴 분석 — 현재 AdMob 지표만 존재 |
| IF-013 | JS 모듈 번들러 도입 | P2 | 12+ script 태그 순차 로딩 → ESBuild/Vite로 번들링하여 로드 타임 개선 |
| IF-014 | WebView CSP 설정 | P2 | cube.html에 Content Security Policy 없음 — 보안 강화 필요 |
| IF-015 | 메모리 릭 감사 | P2 | RAF 고아 버그는 수정됨, 체계적 릭 탐지 필요 |
| IF-016 | WebView GPU 렌더링 최적화 | P3 | Three.js용 하드웨어 가속 설정 확인 및 최적화 |
| IF-017 | 버전 카탈로그 정리 | P3 | libs.versions.toml 일관성 개선 |

## Ideas

| ID | Title | P | Description |
|----|-------|---|-------------|
| IF-100 | 피처 플래그 시스템 | P2 | 앱 업데이트 없이 기능 토글 (Firebase Remote Config) |
| IF-101 | A/B 테스트 프레임워크 | P3 | 광고 타이밍, 셔플 횟수 등 UX 실험 |
| IF-102 | 오프라인 우선 데이터 레이어 | P2 | IndexedDB/Room으로 로컬 데이터 + 선택적 클라우드 동기화 |
| ~~IF-103~~ | ~~앱 업데이트 프롬프트~~ | — | Done으로 이동 (v1.1.0에서 구현) |

## 로드맵

- ~~**v1.2 (Play 제출 전 권장)**: IF-018 (fragment 버전 업), IF-019 (Edge-to-Edge deprecated API), IF-020 (Android 15 인셋 검증)~~ ✅ Done
- **v1.2**: IF-011 (크래시 리포팅), IF-009 (CI/CD)
- **v1.3**: IF-013 (JS 번들러), IF-012 (애널리틱스)
- ~~**v1.1**: IF-103 (앱 업데이트)~~ ✅ Done
- **v2.0**: IF-100 (피처 플래그)

---
*Last updated: 2026-06-25*
