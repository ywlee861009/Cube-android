# Phase 3 — 실제 색 기반 검토·수정·3D 렌더링

> 상태: **미착수**
> 선행: Phase 2
> 검증 주체: 실기기 UI 확인 + Jest

## 문제/목표

현재 검토 화면과 3D 큐브는 `FACE_COLORS` 고정 팔레트를 사용한다. 보라색 스티커를 촬영해도
주황색 등 앱 기본색으로 보이면 사용자가 오인식을 확인하기 어렵다. 스캔 세션 동안 실제 센터
팔레트를 표시하고, 일반 셔플·리셋 흐름에서는 기본 팔레트로 안전하게 복원한다.

## 수정 대상

- `app/src/main/assets/js/scan/scan-review.js`
- `app/src/main/assets/js/scan/scan-apply.js`
- `app/src/main/assets/js/cubies.js`
- `app/src/main/assets/js/actions.js`
- `app/src/main/assets/js/shuffle.js`
- `app/src/main/assets/js/constants.js`
- `app/src/main/assets/css/cube.css`
- `app/src/main/assets/js/CLAUDE.md`
- 관련 Jest 테스트

## 구현 방향

### 팔레트 상태 분리

```js
const DEFAULT_FACE_COLORS = [...];
let activeFaceColors = DEFAULT_FACE_COLORS.slice();
```

- 일반 게임 모드: `activeFaceColors = DEFAULT_FACE_COLORS`
- 스캔 검토/스캔 Solve: `activeFaceColors = scanResult.palette`
- `applyFacelets()`는 `activeFaceColors`를 사용
- 셔플·리셋·새 일반 게임 시작 시 기본 팔레트 복원

### 검토·수정 화면

- 전개도, 면 편집기, 수동 수정 팔레트 모두 `scanResult.palette` 사용
- 색약 및 유사색 대응을 위해 실제 색과 함께 A/B/C/D/E/F 또는 내부 면 기호 표시
- 센터 6칸은 계속 수정 불가
- `warnings`가 있으면 상단에 구체적 안내 표시
- 유사색 경고가 있는 두 색은 팔레트에서 테두리 패턴이나 문자로 구분

### 상태 수명

- 검토 취소: 기존 3D 팔레트와 facelets 모두 유지
- 다시 스캔: 이전 세션 팔레트 폐기
- 스캔 적용: facelets와 팔레트를 원자적으로 함께 적용
- 광고 거부: 스캔 facelets와 팔레트 모두 유지
- 셔플·리셋: 기본 facelets 흐름과 기본 팔레트 복원

## 검증

- 보라색 포함 팔레트가 검토 전개도·수정 팔레트·3D 큐브에 동일하게 표시
- 검토 취소 시 기존 상태와 팔레트가 바뀌지 않음
- 광고 거부 후 재시도해도 스캔 팔레트 유지
- 스캔 Solve 후 셔플·리셋 시 기본 `FACE_COLORS` 복원
- PB·솔브 히스토리 차단 정책 회귀 없음
- 다크/라이트 모드에서 흰색·어두운색 스티커 경계가 명확함

