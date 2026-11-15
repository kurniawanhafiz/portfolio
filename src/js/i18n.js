/**
 * EN / ID toggle. Any element with data-en + data-id gets its innerHTML swapped.
 * Default language: saved choice > browser language (id-*) > English.
 */
let current = 'en';

function detect() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    /* ignore */
  }
  return (navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en';
}

export function setLang(lang, onChange) {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch {
    /* ignore */
  }

  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'en' ? 'ID' : 'EN';

  document.querySelectorAll('[data-en][data-id]').forEach((el) => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll('[data-en-placeholder]').forEach((el) => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
  });
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  onChange?.(lang);
}

export function getLang() {
  return current;
}

export function initI18n(onChange) {
  const initial = detect();
  // Only touch the DOM on load when it differs from the English markup.
  if (initial !== 'en') setLang(initial, onChange);
  else {
    current = 'en';
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = 'ID';
  }
  document.getElementById('langToggle')?.addEventListener('click', () => {
    setLang(current === 'en' ? 'id' : 'en', onChange);
  });
}
