export default function init({ gsap, reduce }) {
  const dialog = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  if (!dialog || !img || !title) return null;

  const open = (src, label) => {
    img.src = src;
    img.alt = label;
    title.textContent = label;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (!reduce) {
      gsap.fromTo(dialog.querySelector('.lightbox__inner'), { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    }
  };

  const close = () => {
    const done = () => dialog.close();
    if (reduce) return done();
    gsap.to(dialog.querySelector('.lightbox__inner'), { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: done });
  };

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => open(btn.dataset.lightbox, btn.dataset.title));
  });
  dialog.querySelector('[data-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => e.target === dialog && close()); // click on backdrop
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault(); // Esc: use the animated close
    close();
  });
  dialog.addEventListener('close', () => (document.body.style.overflow = ''));

  return null;
}
