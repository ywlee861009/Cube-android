# Phase 8 — 조명 매트릭스 실기기 검증·실패 복구·릴리스 게이트

> 상태: **진행 중 (범위 축소)**
> 선행: Phase 7
> 검증 주체: 실기기 매트릭스 테스트

## 범위 변경 (2026-07-27)

**아래 "검증 매트릭스"와 "릴리스 게이트"는 `camera-scan-arbitrary-color-scheme` 티켓의
Phase 4로 이관됐다.** 이 phase에서는 실기기 실측을 수행하지 않는다.

이유: 그 티켓의 Phase 3이 검토 화면과 3D 렌더링 팔레트를 바꾸므로, 지금 UI를 포함해 측정하면
Phase 3 완료 시점에 결과가 무효화된다. 두 매트릭스(조명 4종 × 재질 3종)와 게이트(90%)도
사실상 동일해 같은 실기기 측정을 두 번 하게 된다.

| 항목 | 소유 |
| --- | --- |
| 실기기 실측 매트릭스, 정확도·위험 케이스 측정 | `camera-scan-arbitrary-color-scheme` Phase 4 |
| 최종 릴리스 게이트 판정 | `camera-scan-arbitrary-color-scheme` Phase 4 |
| **실패 복구 경로 점검 및 코드 하드닝** | **이 phase** |
| **릴리스 준비(Play Console, 권한 안내, 크기)** | **이 phase** |

아래 매트릭스·게이트 내용은 이관 대상의 원본 기록으로 남겨둔다.

## 검증 매트릭스 (→ Phase 4로 이관)

### 조명 조건 (최소 4)

| 조건 | 설명 |
| --- | --- |
| 주광 | 낮 창가 간접광 |
| 형광등 | 일반 실내 천장등 |
| 백열/전구색 | 따뜻한 색온도 (R 편향) |
| 저조도 | 어두운 실내 — 노이즈 증가 |

혼합 조명(창가 + 실내등)은 화이트밸런스가 가장 불안정한 조건이므로 별도로 확인한다.

### 큐브 종류 (가능한 만큼)

- 스티커 큐브 (기준)
- 스티커리스 큐브 — 색이 더 탁하고 채도가 낮다. **여기서 실패하면 별도 티켓으로 분리하고
  스티커 큐브만 지원한다고 명시하는 편이 낫다.** 억지로 하나의 분류기로 덮으려 하면
  스티커 큐브 정확도까지 떨어진다
- 광택 큐브 — 정반사 하이라이트 (Phase 2의 중앙값 샘플링이 효과 있는지 확인)

### 기기 (가능한 만큼)

카메라 하드웨어와 WebView 버전 편차. 특히 **Phase 1의 AE/AWB lock이 실제로 걸리는지**
기기별로 확인 — 미지원 기기가 있으면 그 기기에서의 정확도를 따로 측정한다.

## 측정 항목

각 조합에서 **완성 큐브 + 스크램블 큐브 각 5회**, 총 시도 대비:

- **1차 인식 정확도** — 수동 수정 없이 54칸 전부 정확한 비율
- **칸 단위 오인식률** — 틀린 칸 수 / 54
- **검증 통과율** — `validateFacelets()` 통과 비율
- **위험 케이스** — 검증은 통과했지만 실물과 다른 경우 **(가장 위험. 0건이어야 한다)**
- 오인식이 집중된 색 쌍 (빨/주 예상)

결과를 이 파일의 "진행 기록"에 표로 남긴다.

## 실패 복구 경로 점검

- 6면 스캔 도중 앱 백그라운드 → 복귀 시 진행 상태 유지 또는 명확한 재시작 안내
- 카메라 점유 실패 (다른 앱이 사용 중) → 안내 후 복귀
- 저조도로 인식이 불가능한 수준일 때 → "조명이 어두워요" 사전 안내
  (샘플 전체의 L* 평균이 임계 이하면 촬영 전 경고)
- 검증 실패가 반복될 때 → "다시 스캔" 유도 문구
- 스캔 중 리워드 광고 로드 완료 콜백이 끼어드는 경우

## 릴리스 게이트 (→ Phase 4로 이관)

아래를 만족하지 못하면 기능을 숨긴 채 릴리스하거나 릴리스를 미룬다.

- 주광·형광등 조건 1차 인식 정확도 **90% 이상**
- 전 조건에서 "검증 통과했지만 실물과 다름" **0건**
- 수동 수정 후 정상 solve 진입 **100%**
- 기존 셔플→solve 플로우, PB, 솔브 히스토리, 테마에 회귀 **0건**
- `./gradlew lint` 신규 경고 없음, `npm test` 통과

## 릴리스 준비

- `PROJECT_STATUS.md` 갱신
- Play Console: CAMERA 권한 추가로 스토어 리스팅의 권한 목록이 바뀐다.
  기능 설명에 카메라 사용 목적을 명시
- APK/AAB 크기 증가분 최종 확인 (기준선 약 5.3MB)
- 스티커리스 미지원으로 결론 났다면 스토어 설명 또는 앱 내 안내에 명시
- 미해결 이슈는 `backlog/` 해당 파일에 티켓으로 남긴다

## 검증

위 매트릭스 전체 수행 후 결과표를 이 파일에 기록하고, 릴리스 게이트 항목별 통과/미통과를
명시한다. 미통과 항목이 있으면 원인 phase로 되돌리거나 후속 티켓을 만든다.

## 진행 기록

- 2026-07-27: **린트 오류 13건 해소 → `./gradlew lint` BUILD SUCCESSFUL**
  - 원인: `CubeScanner` 클래스에 붙은 `@ExperimentalCamera2Interop` 가 opt-in 요구를
    **모든 호출자로 전파**해 `MainActivity` 에서 13건이 터졌다. 실제 실험적 API 사용은
    `bindPreview()` 의 `Camera2Interop` 와 `lockSupport()` 의 `Camera2CameraInfo` 뿐이다.
  - 조치: 클래스 애노테이션을 제거하고 그 두 private 함수에서만 opt-in. 두 함수 모두
    시그니처에 실험적 타입이 없어 공개 API 표면이 안정형으로 남는다.
  - 함정: **`kotlin.OptIn` 으로는 안 된다.** `ExperimentalCamera2Interop` 은
    `androidx.annotation.RequiresOptIn` 이라 Kotlin 컴파일러가 아니라 lint 가 강제하는데,
    lint 의 `UnsafeOptInUsageError` 검사기는 `kotlin.OptIn` 을 인식하지 못한다.
    `@androidx.annotation.OptIn(markerClass = [...])` 를 써야 13 → 8 → 0 으로 떨어진다.
  - 남은 경고 42건은 전부 기존 항목이다: `GradleDependency` 30, `AndroidGradlePluginVersion` 6
    (모두 "더 최신 버전 있음" 정보성), `UseKtx` 2, `UnusedResources` 2, `ObsoleteSdkInt` 1,
    `MergeRootFrame` 1. 릴리스 게이트의 "신규 경고 없음" 은 충족한다.
- 2026-07-27: `:app:compileDebugKotlin` 성공
- 수정: AGP에서 생성되지 않는 `BuildConfig.DEBUG` 참조 제거
- 수정: CameraX `ListenableFuture` 타입을 제공하도록 Guava Android 의존성 명시
- 수정: 세로 화면에서 늘어나던 가이드를 짧은 변 기준 60% 정사각형으로 통일
- `FaceSamplerTest` 성공 (정사각형 영역·4방향 회전·median 샘플링)
- 터치 면 식별 피드백 추가 후 Kotlin 컴파일 및 Jest 115개 성공
- 2026-08-02: **릴리스 게이트 자동 검사 착수 — lint 13개 에러 해소.**
  `CubeScanner` 클래스의 `@ExperimentalCamera2Interop`가 opt-in을 밖으로 전파해
  `MainActivity` 전 호출부에서 `UnsafeOptInUsageError`(error)가 발생하던 것을,
  클래스 어노테이션을 제거하고 실험 API를 실제 사용하는 private 메서드(`bindPreview`,
  `lockSupport`)에 `@androidx.annotation.OptIn(markerClass=[...])`을 붙여 캡슐화. `./gradlew lint` BUILD SUCCESSFUL(에러 0). 남은 42 warnings는 의존성 버전·미사용 리소스 등 스캔 무관 기존 경고.
- 2026-08-02: **실패 복구 경로 3건 구현** (감사 결과 미구현/부분구현 항목):
  - 저조도 경고(항목3): `scan-capture.js`에 자립형 L* 계산(`sampleLstar`/`meanScanLstar`/
    `isScanTooDark`, 잠정 임계 `SCAN_DARK_LSTAR=32`) 추가, 6면 수집 완료 시 `lowLight`
    플래그를 리뷰로 전달해 검증 실패 메시지에 "(조명이 어두웠어요)" 부기. **임계값은
    실측 보정 대상.**
  - 반복 실패 격상(항목4): `scan-review.js`에 `scanFailedAttempts` 카운터 추가, 6면 스캔
    검증 2회 연속 실패 시 "여러 번 인식에 실패했어요. 밝은 곳에서… 다시 스캔" 유도.
  - 광고 콜백 방어(항목5): `solve.js` `onSolveGranted`에 `isScanning` 가드 추가.
  - Jest: 저조도 순수 함수 테스트 7건 추가 → 총 122개 통과.
- **미완료(수동 실측 필요, 코드로 대체 불가)**: §검증 매트릭스 전체(조명 4종·큐브 종류·
  기기별 1차 인식 정확도/오인식률/위험 케이스 실측), §릴리스 게이트 수치 판정
  (주광·형광등 90%, 위험 케이스 0건 등), 실기기 AE/AWB lock 동작 확인.
- 2026-08-02: **항목1(회전 복원) 처리 — 사용자 결정에 따라 configChanges 방식 채택.**
  `AndroidManifest.xml` MainActivity에 `configChanges="orientation|screenSize|smallestScreenSize|keyboardHidden"`
  추가. 회전 시 Activity 재생성이 사라져 WebView·스캔 진행 상태가 유지된다.
  프로세스 사망(백그라운드 시스템 종료) 대비 영속화는 여전히 미대응 — 실측에서 빈도 확인 후 판단.
  **회귀 확인 필요: 가로 방향에서 게임/스캔 레이아웃 정상 여부(실기기).**
