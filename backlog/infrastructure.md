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
| IF-103 | 인앱 강제 업데이트 | P2 | AppUpdateManager IMMEDIATE 타입, 앱 시작 시 업데이트 확인 + onResume 재확인 |

## TODO

| ID | Title | P | Description |
|----|-------|---|-------------|
| IF-005 | ProGuard 패키지명 수정 | P1 | `com.metrex.cube` → `com.kero.cubie` (현재 잘못된 패키지 참조) |
| IF-006 | Hilt ProGuard 규칙 제거 | P3 | Hilt/Dagger keep 규칙 존재하나 실제 사용하지 않음 |
| IF-007 | PROJECT_STATUS.md 업데이트 | P2 | v1.0.5 기준으로 작성됨 → v1.1.0 현행화 필요 |
| IF-008 | 자동화 테스트 추가 | P1 | JUnit/Espresso 의존성은 있으나 테스트 파일 0개 |
| IF-009 | CI/CD 파이프라인 구축 | P1 | GitHub Actions로 빌드/린트/테스트 자동화 |
| ~~IF-010~~ | ~~키스토어 자격증명 보안화~~ | — | .gitignore로 관리됨 — 불필요 |
| IF-011 | 크래시 리포팅 (Firebase Crashlytics) | P1 | 사용자 보고 외 크래시 가시성 없음 |
| IF-012 | 애널리틱스 (Firebase Analytics) | P2 | 사용 패턴 분석 — 현재 AdMob 지표만 존재 |
| IF-013 | JS 모듈 번들러 도입 | P2 | 12+ script 태그 순차 로딩 → ESBuild/Vite로 번들링하여 로드 타임 개선 |
| IF-014 | WebView CSP 설정 | P2 | cube.html에 Content Security Policy 없음 — 보안 강화 필요 |
| IF-015 | 메모리 릭 감사 | P2 | RAF 고아 버그는 수정됨, 체계적 릭 탐지 필요 |
| IF-016 | WebView GPU 렌더링 최적화 | P3 | Three.js용 하드웨어 가속 설정 확인 및 최적화 |
| IF-017 | 버전 카탈로그 정리 | P3 | libs.versions.toml 일관성 개선 |
| IF-018 | [Play 권장] androidx.fragment 버전 업 | P1 | 구글 신고: transitive `androidx.fragment:fragment` 1.1.0 오래됨. libs.versions.toml에 fragment 버전 추가(1.8.x+)로 강제 업그레이드. 직접 의존 없음 → AdMob/activity transitive 추정, `./gradlew :app:dependencies`로 출처 확인 후 명시 |
| IF-019 | [Play 권장] Edge-to-Edge deprecated API 제거 | P1 | 구글 신고: `setStatusBarColor`/`setNavigationBarColor`/`LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES` 사용. 호출 위치(androidx.activity.o.b/q.b, H.e.p)는 앱 코드 아닌 **라이브러리 내부**. 해법: androidx.activity 1.9.3→1.10.1+, androidx.core 1.15.0→1.16.0+ 업그레이드 (신버전 enableEdgeToEdge는 deprecated API 미사용) |
| IF-020 | [Play 권장] Android 15 인셋/와이드스크린 검증 | P2 | 구글 신고: SDK 35 타겟 와이드스크린 인셋 미처리 가능성. 코드는 이미 enableEdgeToEdge()+인셋 브릿지(IF-002) 존재 → Android 15 기기/에뮬에서 상태바·내비바·디스플레이 컷아웃 영역 큐브 렌더 겹침 여부 실측 검증, 필요 시 CSS --safe-* 적용 보강 |

## Ideas

| ID | Title | P | Description |
|----|-------|---|-------------|
| IF-100 | 피처 플래그 시스템 | P2 | 앱 업데이트 없이 기능 토글 (Firebase Remote Config) |
| IF-101 | A/B 테스트 프레임워크 | P3 | 광고 타이밍, 셔플 횟수 등 UX 실험 |
| IF-102 | 오프라인 우선 데이터 레이어 | P2 | IndexedDB/Room으로 로컬 데이터 + 선택적 클라우드 동기화 |
| ~~IF-103~~ | ~~앱 업데이트 프롬프트~~ | — | Done으로 이동 (v1.1.0에서 구현) |

## 로드맵

- **v1.2 (Play 제출 전 권장)**: IF-018 (fragment 버전 업), IF-019 (Edge-to-Edge deprecated API), IF-020 (Android 15 인셋 검증)
- **v1.2**: IF-005 (ProGuard 수정), IF-011 (크래시 리포팅), IF-008 (테스트), IF-009 (CI/CD)
- **v1.3**: IF-013 (JS 번들러), IF-012 (애널리틱스)
- ~~**v1.1**: IF-103 (앱 업데이트)~~ ✅ Done
- **v2.0**: IF-100 (피처 플래그)

---
*Last updated: 2026-06-24*
