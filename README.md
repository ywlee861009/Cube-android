# Cube-android

Android WebView + Three.js(WebGL) 기반의 3x3 루빅스 큐브 앱입니다.

![App Demo](app.gif)

## 주요 기능

- **3D 큐브 렌더링** — Three.js(r128)로 26개 Cubie를 실시간 WebGL 렌더링
- **터치 인터랙션** — 레이어 드래그 회전, 핀치 줌, 뷰 회전, Fling 관성
- **스냅 애니메이션** — cubic ease-out 220ms 레이어 확정 애니메이션
- **셔플 / 리셋** — 랜덤 20수 셔플, 초기 상태 복귀
- **단계별 솔버** — Kociemba 2-phase 알고리즘으로 최적 해법 계산, 한 수씩 수동 실행

## 기술 스택

| 항목 | 내용 |
|------|------|
| 플랫폼 | Android (Min SDK 26 / Target SDK 35) |
| 언어 | Kotlin 2.0.21 |
| 렌더링 | Three.js r128 (WebGL via WebView) |
| 빌드 | AGP 8.7.3 / Gradle 8.9 / JVM 17 |

## 빌드 & 실행

```bash
# 디버그 빌드
./gradlew assembleDebug

# 디바이스 설치
./gradlew installDebug
```
