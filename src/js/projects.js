export default function init({ gsap, ScrollTrigger, reduce }) {
  const cards = [...document.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('.filter')];

  /* ---------- filter ---------- */
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.toggle('is-active', b === btn));
      const kind = btn.dataset.filter;
      const show = cards.filter((c) => kind === 'all' || c.dataset.kind.split(' ').includes(kind));
      const hide = cards.filter((c) => !show.includes(c));

      if (reduce) {
        hide.forEach((c) => (c.hidden = true));
        show.forEach((c) => (c.hidden = false));
        return;
      }
      gsap.to(cards, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          hide.forEach((c) => (c.hidden = true));
          show.forEach((c) => (c.hidden = false));
          gsap.to(show, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 });
          ScrollTrigger.refresh();
        },
      });
    });
  });

  /* ---------- 3D tilt (fine pointers only) ---------- */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 6);
        rx(-py * 6);
      });
      card.addEventListener('pointerleave', () => {
        rx(0);
        ry(0);
      });
    });
  }

  return null;
}
