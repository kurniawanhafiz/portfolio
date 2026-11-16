export function initNav() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;

  const set = (open) => {
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => set(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  window.matchMedia('(min-width: 821px)').addEventListener('change', (e) => e.matches && set(false));
}
