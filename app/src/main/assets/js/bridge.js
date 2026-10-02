// Android → JS 호출 인터페이스
// 사용: webView.evaluateJavascript("AndroidCube.applyMove('R')", null)
window.AndroidCube = {
  applyMove:   (name) => applyMove(name),
  shuffle:     ()     => shuffleCube(),
  reset:       ()     => resetCube(),
  getFacelets: ()     => JSON.stringify(facelets),
  handleBack:  ()     => handleAndroidBack(),
  setInsets:   (top, bottom, left, right) => {
    console.log(`[JS BRIDGE] setInsets called: top=${top}, bottom=${bottom}`);
    document.documentElement.style.setProperty('--safe-top', top + 'px');
    document.documentElement.style.setProperty('--safe-bottom', bottom + 'px');
    document.documentElement.style.setProperty('--safe-left', left + 'px');
    document.documentElement.style.setProperty('--safe-right', right + 'px');
  }
};

// Android 뒤로 가기: 열린 화면을 위에 있는 것부터 하나 닫고 true, 닫을 게 없으면 false(앱 종료).
// 스캔 카메라 화면은 네이티브(MainActivity)에서 먼저 처리한다.
function handleAndroidBack() {
  const isOpen = id => {
    const el = document.getElementById(id);
    return !!el && !el.classList.contains('hidden');
  };
  if (isOpen('solved-overlay'))      { dismissSolvedOverlay(); return true; }
  if (isOpen('scan-review-overlay')) { backFromScanReview();   return true; }
  if (isOpen('stats-overlay'))       { closeDashboard();       return true; }
  return typeof exitGuidedSolve === 'function' && exitGuidedSolve();
}
