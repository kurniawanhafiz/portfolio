const root = document.documentElement;

export function setTheme(next) {
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage can be blocked, theme still works for this visit */
  }
}

export function initTheme() {
  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage can be blocked, theme still works for this visit */
    }
  });
}
