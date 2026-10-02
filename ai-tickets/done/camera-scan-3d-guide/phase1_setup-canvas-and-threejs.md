# Phase 1: Setup Canvas and Three.js

## 문제/목표
스캔 화면(`scan-overlay`) 상단이나 하단의 빈 공간에 미니 3D 큐브를 띄우기 위한 캔버스를 준비하고, Three.js를 통해 기본 큐브 모델을 렌더링합니다.

## 수정 대상 파일과 위치
- `app/src/main/assets/index.html` (스캔 오버레이 쪽에 `<div id="scan-3d-guide"></div>` 추가)
- `app/src/main/assets/css/index.css` (미니 큐브 컨테이너의 절대 위치 및 크기 스타일링)
- `app/src/main/assets/js/scan/scan-ui.js` (Three.js 초기화 및 Scene 구성 로직 추가)

## 구체적인 구현 방향
1. `scan-overlay` 내에 `scan-3d-guide` 컨테이너 추가. z-index를 높게 주어 카메라 화면보다 위에 보이게 합니다.
2. `scan-ui.js`에서 Three.js의 `WebGLRenderer`, `Scene`, `PerspectiveCamera`를 생성하여 해당 컨테이너에 붙입니다.
3. 기본 3x3 큐브 모델(Mesh 배열 등)을 생성하여 Scene에 추가합니다. 
4. 조명(AmbientLight, DirectionalLight)을 설정하여 큐브의 색상이 명확히 보이도록 합니다.

## 검증 방법
스캔 모드를 켰을 때, 화면 한쪽에 3D 큐브가 정상적으로(정지된 상태로) 렌더링되어 표시되는지 확인합니다.
