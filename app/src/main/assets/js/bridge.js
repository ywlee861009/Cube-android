// Android → JS 호출 인터페이스
// 사용: webView.evaluateJavascript("AndroidCube.applyMove('R')", null)
window.AndroidCube = {
  applyMove:   (name) => applyMove(name),
  shuffle:     ()     => shuffleCube(),
  reset:       ()     => resetCube(),
  getFacelets: ()     => JSON.stringify(facelets),
  setInsets:   (top, bottom, left, right) => {
    console.log(`[JS BRIDGE] setInsets called: top=${top}, bottom=${bottom}`);
    document.documentElement.style.setProperty('--safe-top', top + 'px');
    document.documentElement.style.setProperty('--safe-bottom', bottom + 'px');
    document.documentElement.style.setProperty('--safe-left', left + 'px');
    document.documentElement.style.setProperty('--safe-right', right + 'px');
  }
};
