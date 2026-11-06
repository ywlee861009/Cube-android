// Android supplies the language selected by its resource resolver. Browser previews
// use the browser's preferred language. English is the default resource language.
const uiLocale = (window.AndroidBridge?.getUiLanguage?.() || navigator.language || 'en')
  .toLowerCase().split('-')[0] === 'ko' ? 'ko' : 'en';

const koreanStrings = {
  'Solved!': '완성!',
  'Time': '시간',
  'Moves': '이동 수',
  'Moves: {count}': '이동 {count}수',
  '{count} moves': '{count}수',
  'New Best!': '최고 기록 갱신!',
  'Best Time': '최고 시간',
  'Best Moves': '최소 이동 수',
  '⇄ Play Again': '⇄ 다시 풀기',
  'Statistics': '통계',
  'Open statistics': '통계 열기',
  'Close statistics': '통계 닫기',
  'Solves': '완성 횟수',
  'Best': '최고 기록',
  'Mean': '평균',
  'Need more solves': '기록이 더 필요해요',
  'No solves yet': '아직 완성 기록이 없어요',
  'Solver': '풀이 도움',
  'Scan': '스캔',
  'Options': '옵션',
  'Dark mode': '어두운 테마',
  'Light mode': '밝은 테마',
  'Policies': '앱 정책',
  '↩ Undo': '↩ 되돌리기',
  'Redo ↪': '다시 실행 ↪',
  '⇄ Shuffle': '⇄ 섞기',
  'Solve': '풀이 보기',
  '📺 Solve': '📺 풀이 보기',
  '📷 Scan Cube': '📷 실물 큐브 스캔',
  'Watch the ad to use the solver.': '광고를 시청하면 풀이를 볼 수 있어요.',
  'The scanned cube is already solved.': '스캔한 큐브가 이미 완성되어 있어요.',
  'Already solved!': '이미 완성된 큐브예요!',
  'Solver loading…': '풀이 기능을 준비하고 있어요…',
  'Calculating…': '풀이를 계산하고 있어요…',
  'Could not find a solution. Try again.': '풀이를 찾지 못했어요. 다시 시도해 주세요.',
  'Tap Solve to continue.': '풀이 보기를 누르면 이어서 볼 수 있어요.',
  'Hold the cube like the picture, then tap.': '화면과 똑같이 들고, 탭하세요',
  'Close guided solve': '따라 하기 닫기',
  'Daily 3 Moves': '오늘의 3수',
  'Resume Daily 3 Moves': '오늘의 3수 이어서 풀기',
  'Daily 3 Moves · Completed': '오늘의 3수 · 완료',
  'Hint': '힌트',
  'Free play': '자유 플레이',
  'Skip': '건너뛰기',
  'Turn top layer': '윗면 돌리기',
  'One turn to go! Follow the arrow on the top layer.': '한 수만 남았어요! 윗줄을 화살표 방향으로 돌려 보세요.',
  'Your first solve!': '첫 큐브 완성!',
  'Try today’s puzzle next.': '이제 오늘의 3수에 도전해 보세요.',
  'Solve the cube in three moves.': '세 수로 큐브를 맞춰 보세요.',
  'Today’s cube is solved!': '오늘의 큐브 완성!',
  'A new puzzle arrives tomorrow.': '내일 새 문제가 열려요.',
  'Try again': '다시 도전',
  'Turn the {face} face clockwise.': '{face}을 시계 방향으로 돌려 보세요.',
  'Turn the {face} face counterclockwise.': '{face}을 반시계 방향으로 돌려 보세요.',
  'top': '윗면',
  'right': '오른쪽 면',
  'front': '앞면',
  'bottom': '아랫면',
  'left': '왼쪽 면',
  'back': '뒷면',
  'Undo the last move to get back on track.': '마지막 수를 되돌려 풀이를 이어 가세요.',
  'No hints used': '힌트 없이',
  'Hints used: {count}': '힌트 {count}회',
  '1 / 6 — Reference face': '1 / 6 — 기준면',
  'Getting the camera ready…': '카메라를 준비하고 있어요…',
  '↶ Previous face': '↶ 이전 면',
  '● Capture': '● 촬영',
  'Cancel': '취소',
  'Review scan': '스캔 결과 확인',
  'Stickers to check: {count}': '확인이 필요한 칸 {count}개',
  'Close scan review': '스캔 결과 닫기',
  'Cube net showing all six faces': '큐브 6면 전개도',
  '{face} face': '{face} 면',
  'Retake {face} face': '{face} 면 다시 촬영',
  'Sticker colors': '색 선택 팔레트',
  'Scan again': '다시 스캔',
  'Start solving': '풀이 시작',
  'Retake just this face. Match the orientation shown.': '이 면만 다시 촬영합니다. 안내한 방향으로 맞춰 주세요.',
  'Camera scanning is available in the Android app.': '카메라 스캔은 Android 앱에서 사용할 수 있어요.',
  'Line up one face with the grid, then capture.': '격자에 한 면을 맞춘 뒤 촬영하세요.',
  'Camera permission was denied.': '카메라 권한이 거부됐어요.',
  'Allow camera access in Settings.': '설정에서 카메라 권한을 허용해 주세요.',
  'No camera is available.': '사용 가능한 카메라가 없어요.',
  'Could not start the camera.': '카메라를 시작하지 못했어요.',
  'Scan cancelled.': '스캔을 취소했어요.',
  'Try again after the update.': '업데이트가 끝난 뒤 다시 시도해 주세요.',
  'Reading colors…': '색을 읽고 있어요…',
  'Back one step. Turn the cube as shown, then capture.': '한 단계 되돌렸어요. 안내대로 큐브를 되돌린 뒤 촬영하세요.',
  'Some faces are missing. Scan the cube again.': '촬영되지 않은 면이 있어요. 처음부터 다시 스캔해 주세요.',
  'Colors updated from the retaken face.': '다시 촬영한 면으로 색을 새로 판정했어요.',
  'All six faces captured.': '6면 촬영을 완료했어요.',
  'Try again when the camera is ready.': '카메라 준비가 끝나면 다시 촬영해 주세요.',
  'Could not read the colors. Try again.': '색을 읽지 못했어요. 다시 촬영해 주세요.',
  'Retake: {face}': '{face} 다시 촬영',
  'Hold the cube with the {face} on top.': '{face}이 위로 오게 들어주세요',
  'Could not load the camera guide.': '가이드 좌표를 불러오지 못했어요.',
  'Tilt the cube so the top face points forward': '위쪽 면이 정면으로 오도록 굴리세요',
  'Tilt the cube so the face you just scanned points up': '방금 촬영한 면이 위로 가도록 굴리세요',
  'Turn the cube so the left face points forward': '왼쪽 면이 정면으로 오도록 돌리세요',
  'Turn the cube so the right face points forward': '오른쪽 면이 정면으로 오도록 돌리세요',
  'Rotate the cube 90° counterclockwise in the frame': '화면 안에서 반시계로 90도 돌리세요',
  'Rotate the cube 90° clockwise in the frame': '화면 안에서 시계로 90도 돌리세요',
  'Choose a reference face and point it forward. Keep track of which edge is up': '기준으로 삼을 면을 정면에 두세요. 위 방향을 정하면 끝까지 유지하세요',
  'Reference face': '기준면',
  'Face opposite the reference face': '기준면 반대편',
  'Right face': '오른쪽 면',
  'Left face': '왼쪽 면',
  'Top face': '위쪽 면',
  'Bottom face': '아래쪽 면',
  'Two faces look very similar to the camera. Check the marked stickers.': '두 면의 색이 카메라에서 거의 같게 보여요. 표시된 칸을 직접 확인해 주세요.',
  'Glare washed out several faces. Change the angle and scan again.': '반사광으로 여러 면이 하얗게 날아갔어요. 각도를 바꿔 다시 촬영하세요.',
  'Lighting is low. Scan again in a brighter place for better accuracy.': '전체적으로 어두워요. 더 밝은 곳에서 다시 촬영하면 정확도가 올라갑니다.',
  'The cube state is valid. You can start solving.': '큐브 상태가 올바릅니다. 풀이를 시작할 수 있어요.',
  'Several scans failed. Scan slowly in a brighter place.': '여러 번 인식에 실패했어요. 밝은 곳에서 큐브를 천천히 다시 스캔해 주세요.',
  '{message} (Low light)': '{message} (조명이 어두웠어요)',
  '{face} face, sticker {index}, current color {color}': '{face} 면 {index}번 칸, 현재 {color}',
  'Scan discarded.': '스캔 결과를 적용하지 않았어요.',
  'Scan is not ready to apply.': '스캔 상태 적용 기능을 준비하고 있어요.',
  'Scanned cube applied.': '스캔한 큐브를 적용했어요.',
  'Check all 54 stickers.': '큐브의 54칸을 모두 확인해 주세요.',
  'Check the stickers with unknown colors.': '알 수 없는 색이 있는 칸을 확인해 주세요.',
  'Each color needs nine stickers. Counts: {counts}': '색마다 9칸이어야 해요. 현재 {counts}',
  'White': '흰색',
  'Red': '빨강',
  'Green': '초록',
  'Yellow': '노랑',
  'Orange': '주황',
  'Blue': '파랑',
  'All six center colors must be different.': '가운데 색 6개가 서로 달라야 해요.',
  'One corner piece was read incorrectly.': '모서리 조각 하나가 잘못 읽혔어요.',
  'Check the colors on the corner pieces.': '모서리 조각의 색 조합을 다시 확인해 주세요.',
  'Check the colors on the edge pieces.': '가장자리 조각의 색 조합을 다시 확인해 주세요.',
  'Check the orientation of a corner piece.': '모서리 조각 하나의 방향을 다시 확인해 주세요.',
  'Check the orientation of an edge piece.': '가장자리 조각 하나의 방향을 다시 확인해 주세요.',
  'Check whether two pieces are swapped.': '서로 바뀐 조각이 있는지 다시 확인해 주세요.',
};

// Existing scan models supply Korean text. Translate at the presentation boundary
// so those models and their Node tests do not depend on Android or the browser.
const englishScanStrings = new Map(Object.entries(koreanStrings).map(([english, korean]) => [korean, english]));

function t(message, values = {}) {
  const localized = uiLocale === 'ko'
    ? (Object.prototype.hasOwnProperty.call(koreanStrings, message) ? koreanStrings[message] : message)
    : (englishScanStrings.get(message) ?? message);
  return localized.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function localizedValidationMessage(validation) {
  if (validation.code === 'COLOR_COUNT') {
    const names = ['White', 'Red', 'Green', 'Yellow', 'Orange', 'Blue'];
    const counts = validation.counts.map((count, index) => `${t(names[index])} ${count}`).join(', ');
    return t('Each color needs nine stickers. Counts: {counts}', { counts });
  }
  return t(validation.message);
}

document.documentElement.lang = uiLocale;
document.querySelectorAll('[data-i18n]').forEach(element => {
  element.textContent = t(element.textContent);
});
document.querySelectorAll('[data-i18n-label]').forEach(element => {
  element.setAttribute('aria-label', t(element.getAttribute('aria-label')));
});
