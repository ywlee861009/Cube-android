# app/ — Android / Kotlin

## 주요 파일

- `MainActivity.kt` — WebView 초기화, Edge-to-Edge, 시스템 인셋, AdMob, 인앱 업데이트, CubeBridge
- `CubeApplication.kt` — Application 클래스 (최소 구성)

## Android ↔ JS 브릿지

### JS → Android (`window.AndroidBridge` / `CubeBridge` inner class)

| 메서드 | 동작 |
|--------|------|
| `hapticFeedback()` | `webView.performHapticFeedback()` |
| `requestSolve()` | `solveGranted`면 바로 `onSolveGranted()`, 아니면 광고 표시 |
| `onShuffleOrReset()` | `solveGranted = false` — 광고 허가 초기화 |
| `startScan()` | CAMERA 권한 확인 후 CameraX 프리뷰 시작 |
| `stopScan()` | 카메라 해제 후 프리뷰 숨김 |

### Android → JS

| 호출 | 동작 |
|------|------|
| `window.AndroidCube.setInsets(top,bottom,left,right)` | CSS `--safe-*` 변수 갱신 |
| `window.onSolveGranted()` | 광고 후 솔브 허용 → `_runSolve()` 실행 |
| `window.onSolveDenied()` | 광고 거부/실패 시 솔브 차단, 상태 메시지 표시 |
| `window.onScanReady()` | 프리뷰 준비 완료 |
| `window.onScanCancelled(reason)` | 권한 거부·카메라 없음·시작 오류로 스캔 취소 |

## Edge-to-Edge / Insets

- `enableEdgeToEdge()`로 시스템 바 뒤까지 WebView를 확장
- `ViewCompat.setOnApplyWindowInsetsListener(webView)`에서 마지막 인셋을 저장하고 JS로 전달
- Android 15 와이드스크린/컷아웃 대응을 위해 `systemBars()`와 `displayCutout()` 인셋의 합집합을 CSS `--safe-*` 변수로 전달
- WebView 로딩 완료 후 `lastInsets`가 있으면 재적용하여 초기 로드 타이밍 차이를 보정

## AdMob

- 패키지: `com.kero.cubie`
- App ID: `ca-app-pub-2103375309908918~1118005116` (AndroidManifest.xml)
- **세션당 1회 광고**: 셔플/리셋 후 첫 솔브 시 리워드 광고 표시, 시청 완료 시 `solveGranted = true`
- 이후 같은 퍼즐에서 재솔브 시 광고 없이 바로 실행
- `loadRewardedAd()` / `showRewardedAd()`: 비동기 로드/표시 → 리워드 후 `onSolveGranted()` 콜백

## In-App Update

- `AppUpdateManager` + `AppUpdateOptions(AppUpdateType.IMMEDIATE)` 사용
- 앱 시작 시 업데이트 가능 여부를 확인하고, 진행 중이던 immediate update는 `onResume()`에서 재개
- `isUpdateFlowActive`로 업데이트 플로우 중복 시작 방지
