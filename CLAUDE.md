# CLAUDE.md

## 빌드

```bash
./gradlew assembleDebug   # 빌드
./gradlew installDebug    # 디바이스 설치
./gradlew lint            # 린트
./gradlew clean           # 클린
```

## 스택

Android WebView + Three.js (WebGL). 단일 `:app` 모듈.

```
MainActivity.kt  →  WebView  →  assets/cube.html  →  assets/js/
```

## 하위 CLAUDE.md

- `app/` — Android/Kotlin, AdMob, 브릿지 상세
- `app/src/main/assets/js/` — JS 모듈 구조, 로딩 순서, 핵심 데이터 모델
- `app/src/main/assets/js/solver/` — 솔버 아키텍처

## 의존성

버전은 `gradle/libs.versions.toml`에서 중앙 관리.
AGP 8.7.3 / Kotlin 2.0.21 / Min SDK 26 / Target SDK 35 / Three.js r128 / AdMob 23.6.0

## deploy 명령

사용자가 **"deploy"** 라고 입력하면 아래 절차를 순서대로 수행한다.

### 1. 버전 타입 선택
`major / minor / patch` 중 어떤 것을 올릴지 사용자에게 묻는다.

### 2. 버전 번호 업데이트 (`app/build.gradle.kts`)
- 현재 `versionName`(semver) 과 `versionCode`(정수)를 읽는다.
- 선택에 따라 versionName 세그먼트 증가 (major → X+1.0.0 / minor → x.Y+1.0 / patch → x.y.Z+1)
- `versionCode` 는 무조건 +1
- 파일을 직접 수정한다.

### 3. 서명된 AAB 빌드
keystore 정보는 `keystore/keystore-info.md` 에서 읽어온다.

```bash
./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file="$(pwd)/keystore/kero-studio.jks" \
  -Pandroid.injected.signing.store.password=<StorePassword> \
  -Pandroid.injected.signing.key.alias=<KeyAlias> \
  -Pandroid.injected.signing.key.password=<KeyPassword>
```

### 4. AAB 이동 및 이름 변경
빌드 결과물(`app/build/outputs/bundle/release/app-release.aab`)을
프로젝트 루트로 이동하며 이름을 변경한다.

```
app-{versionName}-{versionCode}.aab
```

예시: `app-1.2.0-7.aab`
