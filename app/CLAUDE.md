# app/ — Android / Kotlin

## 주요 파일

- `MainActivity.kt` — WebView 초기화, Edge-to-Edge, 시스템 인셋, AdMob, CubeBridge
- `CubeApplication.kt` — Application 클래스 (최소 구성)

## Android ↔ JS 브릿지

### JS → Android (`window.AndroidBridge` / `CubeBridge` inner class)

| 메서드 | 동작 |
|--------|------|
| `hapticFeedback()` | `webView.performHapticFeedback()` |
| `requestSolve()` | `solveGranted`면 바로 `onSolveGranted()`, 아니면 광고 표시 |
| `onShuffleOrReset()` | `solveGranted = false` — 광고 허가 초기화 |

### Android → JS

| 호출 | 동작 |
|------|------|
| `window.AndroidCube.setInsets(top,bottom,left,right)` | CSS `--safe-*` 변수 갱신 |
| `window.onSolveGranted()` | 광고 후 솔브 허용 → `_runSolve()` 실행 |
| `window.onSolveDenied()` | 광고 거부/실패 시 솔브 차단, 상태 메시지 표시 |

## AdMob

- 패키지: `com.kero.cubie`
- App ID: `ca-app-pub-2103375309908918~1118005116` (AndroidManifest.xml)
- **세션당 1회 광고**: 셔플/리셋 후 첫 솔브 시 리워드 광고 표시, 시청 완료 시 `solveGranted = true`
- 이후 같은 퍼즐에서 재솔브 시 광고 없이 바로 실행
- `loadRewardedAd()` / `showRewardedAd()`: 비동기 로드/표시 → 리워드 후 `onSolveGranted()` 콜백
