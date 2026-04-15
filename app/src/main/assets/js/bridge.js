// Android → JS 호출 인터페이스
// 사용: webView.evaluateJavascript("AndroidCube.applyMove('R')", null)
window.AndroidCube = {
  applyMove:   (name) => applyMove(name),
  shuffle:     ()     => shuffleCube(),
  reset:       ()     => resetCube(),
  getFacelets: ()     => JSON.stringify(facelets),
};
