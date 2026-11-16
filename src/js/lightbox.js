/**
 * Shared image lightbox (<dialog id="lightbox">).
 * Any element with data-lightbox="<src>" and data-title="<caption>" opens it.
 */
export function initLightbox({ gsap, reduce }) {
  const dialog = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  if (!dialog || !img || !title) return;

  const inner = dialog.querySelector('.lightbox__inner');

  const open = (src, label) => {
    img.src = src;
    img.alt = label;
    title.textContent = label;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (!reduce) {
      gsap.fromTo(inner, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    }
  };

  const close = () => {
    if (reduce) return dialog.close();
    gsap.to(inner, { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: () => dialog.close() });
  };

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => open(el.dataset.lightbox, el.dataset.title || ''));
  });
  dialog.querySelector('[data-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => e.target === dialog && close());
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => (document.body.style.overflow = ''));
}
