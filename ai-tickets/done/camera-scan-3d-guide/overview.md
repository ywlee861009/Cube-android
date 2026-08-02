# Camera Scan 3D Animation Guide

## 목적과 배경
- **목적:** 카메라 스캔 화면(`scan-ui.js`)에서 제공하는 텍스트 기반 방향 가이드를 직관적인 3D 애니메이션 가이드로 교체하여 사용자 경험(UX)을 향상시킵니다.
- **배경:** 현재 사용자는 6면 스캔 시 텍스트 지시만으로 큐브의 방향을 잡아야 하므로 3D 공간 방향을 헷갈리기 매우 쉽습니다. 프로젝트 내에 포함된 Three.js를 활용하여 화면 구석에 작은 3D 큐브 모델을 렌더링하고, 회전 애니메이션을 보여줍니다.

## 하위 티켓 목록
1. `phase1_setup-canvas-and-threejs.md` - 스캔 UI에 3D 미니 큐브를 렌더링할 캔버스 추가 및 Three.js 초기화
2. `phase2_implement-rotation-animation.md` - 스캔 단계별(U, R, F, D, L, B) 목표 회전 값 설정 및 전환 애니메이션(TWEEN) 구현
3. `phase3_ui-integration-and-polish.md` - 기존 텍스트 가이드 축소 및 미니 큐브 스타일 폴리싱 (반투명 처리 등)

## 선행 관계
- phase1 ➔ phase2 ➔ phase3 순서로 진행되어야 합니다.
