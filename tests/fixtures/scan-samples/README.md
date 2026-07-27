# scan-samples fixture

`classifyFacelets()` 회귀용 54칸 RGB 샘플. 이 디렉터리의 모든 `*.json` 은
`tests/color-classify.test.js` 가 자동으로 읽어 검증한다. **파일만 추가하면 커버리지가
늘어난다** — 테스트 코드를 고칠 필요가 없다.

## 형식

```jsonc
{
  "name": "사람이 읽는 이름",
  "source": "synthetic" | "device",
  "note": "촬영 조건 / 생성 방식",
  "expectedFacelets": [54개 정수],   // 내부 U/R/F/D/L/B 정규화 결과
  "expectWarnings": ["SIMILAR_CENTERS", ...],  // 기대 경고 코드. 없으면 []
  "samples": [[r, g, b], ...]        // 54개, 인덱스 = faceIndex * 9 + position
}
```

`samples` 순서는 내부 면 순서 **U(0) R(1) F(2) D(3) L(4) B(5)** 이며 각 면은 촬영 방향
기준 row-major 다. 촬영 **순서**(`[0, 2, 3, 1, 5, 4]`)와 다르다는 점에 주의한다.

## 실측 fixture 만드는 법

디버그 빌드는 6면 촬영이 끝나면 샘플을 통째로 로그에 남긴다
(`MainActivity.kt` 의 `CubeScanner` 태그).

```bash
adb logcat -s CubeScanner
# RGB fixture=[[[r,g,b], ...], ...]   ← 6면 × 9칸 중첩 배열
```

이 배열을 flat 하게 펴서 `samples` 에 넣고, 실물을 보고 `expectedFacelets` 를 손으로
적는다. `source` 는 `device` 로, `note` 에 **조명·재질·기기**를 반드시 남긴다.

## 현재 상태

합성 fixture만 있다. **비표준 배색 실물 큐브 미확보** 상태이며, 실측 fixture 확보는
`ai-tickets` 의 `camera-scan-arbitrary-color-scheme` Phase 4 가 소유한다.
합성 RGB는 카메라 노이즈·정반사·화이트밸런스 드리프트를 재현하지 못하므로
이것만으로 릴리스 판정을 하면 안 된다.
