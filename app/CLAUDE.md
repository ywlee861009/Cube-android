# app/ — Android / Kotlin

## 주요 파일

- `MainActivity.kt` — WebView 초기화, Edge-to-Edge, 시스템 인셋, AdMob, CubeBridge
- `CubeApplication.kt` — Application 클래스 (최소 구성)

## Android ↔ JS 브릿지

### JS → Android (`window.AndroidBridge` / `CubeBridge` inner class)

| 메서드 | 동작 |
|--------|------|
| `hapticFeedback()` | `webView.performHapticFeedback()` |
| `requestSolve()` | AdMob 광고 처리 후 `onSolveGranted()` / `onSolveDenied()` 콜백 |

### Android → JS

| 호출 | 동작 |
|------|------|
| `window.AndroidCube.setInsets(top,bottom,left,right)` | CSS `--safe-*` 변수 갱신 |
| `window.onSolveGranted()` | 광고 후 솔브 허용 |
| `window.onSolveDenied()` | 광고 거부/실패 시 솔브 차단 |

## AdMob

- 패키지: `com.kero.cubie`
- App ID: `ca-app-pub-2103375309908918~1118005116` (AndroidManifest.xml)
- `AD_INTERVAL = 5`: 5회 솔브마다 리워드 광고 노출
- `requestSolve()`: `count % AD_INTERVAL == 4`이면 광고 표시
- `loadRewardedAd()` / `showRewardedAd()`: 비동기 로드/표시 → 리워드 후 `onSolveGranted()` 콜백
