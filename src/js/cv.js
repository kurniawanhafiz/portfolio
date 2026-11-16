import { getLang } from './i18n.js';

export const cvUrl = (lang) => `/cv/CV_Kurniawan_Hafiz_${lang === 'id' ? 'ID' : 'EN'}.pdf`;

/** Dropdown "Download CV" buttons. The CV in the site's current language is listed first. */
export function initCvMenus() {
  const menus = [...document.querySelectorAll('[data-cv-menu]')];
  if (!menus.length) return;

  const closeAll = (except) =>
    menus.forEach((m) => {
      if (m === except) return;
      m.classList.remove('is-open');
      m.querySelector('.cv-dl__btn')?.setAttribute('aria-expanded', 'false');
    });

  const sync = () =>
    menus.forEach((m) =>
      m.querySelectorAll('a[data-cv]').forEach((a) => {
        a.style.order = a.dataset.cv === getLang() ? '0' : '1';
      })
    );

  menus.forEach((m) => {
    const btn = m.querySelector('.cv-dl__btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !m.classList.contains('is-open');
      closeAll(m);
      m.classList.remove('is-right', 'is-left');
      m.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        // keep the menu inside the viewport: flip to the other edge if it overflows
        const r = m.querySelector('.cv-dl__menu').getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        if (r.right > vw - 8) m.classList.add('is-right');
        else if (r.left < 8) m.classList.add('is-left');
      }
    });
    m.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeAll()));
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeAll());
  document.addEventListener('langchange', sync);
  sync();
}
