// ─── 다크 모드 토글 ────────────────────────────────────────────────────────
(function () {
  var btnTheme = document.getElementById('btn-theme');
  var saved = localStorage.getItem('cube-theme');
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'dark' : '');
    btnTheme.textContent = t(isDark ? 'Light mode' : 'Dark mode');
    localStorage.setItem('cube-theme', theme);
  }

  btnTheme.addEventListener('click', function () {
    var current = document.body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();
