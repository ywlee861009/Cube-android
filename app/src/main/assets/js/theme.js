// ─── 다크 모드 토글 ────────────────────────────────────────────────────────
(function () {
  var LIGHT_BG = 0xe8eaf0;
  var DARK_BG  = 0x1c1c1e;
  var btnTheme = document.getElementById('btn-theme');
  var saved = localStorage.getItem('cube-theme');
  if (saved === 'dark') applyTheme('dark');

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'dark' : '');
    btnTheme.textContent = isDark ? '☀️' : '🌙';
    setSceneBg(isDark ? DARK_BG : LIGHT_BG);
    localStorage.setItem('cube-theme', theme);
  }

  btnTheme.addEventListener('click', function () {
    var current = document.body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();
