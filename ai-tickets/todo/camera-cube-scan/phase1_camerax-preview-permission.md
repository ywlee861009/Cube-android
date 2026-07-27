# Phase 1 — CameraX 프리뷰·CAMERA 권한·AE/AWB lock

> 상태: **미착수**
> 선행: 없음
> 검증 주체: 실기기 수동 확인 + `./gradlew assembleDebug`

## 문제/목표

앱에 카메라가 아예 없다. CameraX 프리뷰를 띄우고, 스캔 중 노출·화이트밸런스가 흔들리지
않도록 잠근다. **AE/AWB lock이 이 phase의 진짜 산출물이다** — 이게 없으면 Phase 4 색 분류가
성립하지 않는다.

## 현재 상태

- `app/src/main/AndroidManifest.xml:4-5` — `INTERNET`, `VIBRATE`만. CAMERA 권한 없음
- `MainActivity.kt:102-103` — `javaScriptEnabled`, `domStorageEnabled`만 설정
- `MainActivity.kt:106` — `WebViewClient`만 있고 `WebChromeClient` 없음
- `MainActivity.kt:112` — `loadUrl("file:///android_asset/cube.html")`, WebView 전체화면
- `gradle/libs.versions.toml` — CameraX 없음
- Min SDK 26 (CameraX 요구 21 이상 — 문제없음)
- `app/build.gradle.kts:22-23` — R8·리소스 축소 활성

## 수정 대상

- `gradle/libs.versions.toml` — `camera-core`, `camera-camera2`, `camera-lifecycle`, `camera-view` 추가
- `app/build.gradle.kts` — 의존성 배선
- `app/src/main/AndroidManifest.xml` — `<uses-permission android:name="android.permission.CAMERA" />`,
  `<uses-feature android:name="android.hardware.camera" android:required="false" />`
- `app/src/main/res/layout/` — 레이아웃 신설 (현재 WebView를 코드로 생성 중이면 구조 변경 필요)
- `MainActivity.kt` — 프리뷰 생명주기, 권한 요청, 브릿지 메서드 추가
- 신규 `app/src/main/java/com/kero/cubie/scan/CubeScanner.kt` — CameraX 캡슐화

## 구현 방향

### 뷰 합성

`PreviewView`를 아래, WebView를 위에 놓고 **WebView 배경을 투명**하게 만든다
(`webView.setBackgroundColor(Color.TRANSPARENT)`). 스캔 모드가 아닐 때는 `PreviewView`를
`GONE`으로 두고 WebView 배경을 원래대로 되돌린다.

> ⚠️ WebView 배경을 투명하게 하면 Three.js 캔버스 렌더러의 `alpha` 설정과 상호작용한다.
> `scene.js`의 렌더러/`setSceneBg()`를 건드리지 않고 스캔 모드에서만 토글하는 방식으로 격리할 것.
> 여기서 기존 큐브 화면 배경이 깨지면 즉시 롤백하고 대안(별도 Activity)을 검토한다.

### AE/AWB lock

`Camera2Interop.Extender`로 `Preview` 빌드 시 세팅한다. 첫 면 촬영 직전 한 번 수렴시킨 뒤
잠그고, 6면 스캔이 끝날 때까지 유지한다. 스캔 시작/종료 시점에만 lock을 토글한다.

```
CONTROL_AE_LOCK = true
CONTROL_AWB_LOCK = true
```

lock을 지원하지 않는 기기가 있을 수 있으므로 적용 성공 여부를 Logcat에 남기고,
실패해도 스캔 자체는 진행되게 한다(Phase 8에서 영향 실측).

### 권한

- 스캔 진입 시점에 요청한다. 앱 시작 시 요청 금지 — 기존 사용자가 이유 없이 카메라 권한 팝업을 보면 안 된다
- `ActivityResultContracts.RequestPermission` 사용
- 영구 거부(`shouldShowRequestPermissionRationale` false + 거부) 시 설정 화면 안내 후 스캔 취소
- 거부 시 JS로 `window.onScanCancelled(reason)` 콜백 — 기존 UI 복귀

### 브릿지

`CubeBridge`(JS → Android)에 추가:

| 메서드 | 동작 |
| --- | --- |
| `startScan()` | 권한 확인 → 프리뷰 표시 → AE/AWB 수렴·lock |
| `stopScan()` | 프리뷰 숨김, lock 해제, 카메라 언바인드 |

Android → JS:

| 호출 | 동작 |
| --- | --- |
| `window.onScanReady()` | 프리뷰 준비 완료 |
| `window.onScanCancelled(reason)` | 권한 거부·카메라 없음·오류 |

`app/CLAUDE.md`의 브릿지 표 2개를 함께 갱신한다.

## 구현 시 주의

- **AdMob 리워드 광고와의 충돌**: 스캔 중 광고가 뜨면 카메라 생명주기가 꼬인다.
  `onPause()`에서 반드시 언바인드하고 `onResume()`에서 스캔 모드였는지 복원한다
- **인앱 업데이트 immediate flow**와 겹치는 경우도 동일
- `isShuffling`/`isSolving` 중에는 `startScan()`을 거부한다 (`actions.js`의 기존 차단 플래그 관례를 따라 `isScanning` 추가)
- APK 증가분을 측정해 기록할 것. 현재 릴리스 AAB 기준선 약 5.3MB

## 검증

- `./gradlew assembleDebug` 성공, `./gradlew lint` 신규 경고 없음
- 실기기: 스캔 진입 → 프리뷰 표시 → 종료 → 기존 큐브 화면 정상 복귀
- **다크모드에서 진입/종료** 후 배경 깨짐 없음 (`theme.js` 토글과 교차 확인)
- 권한 거부 / 영구 거부 두 경로 모두 앱이 멈추지 않고 복귀
- 스캔 중 홈 버튼 → 복귀 시 카메라 정상 동작
- 조명이 밝은 곳→어두운 곳으로 기기를 옮겨도 프리뷰 밝기가 **변하지 않음** (lock 확인)
- APK 증가분 기록
