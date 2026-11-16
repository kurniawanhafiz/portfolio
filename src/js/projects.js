import { initLightbox } from './lightbox.js';
import { renderThumb, createViewer } from './lab.js';

export default function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  initLightbox(ctx);
  initLab(ctx);
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

/* ---------- interactive network lab (dialog) ---------- */
function initLab({ gsap, reduce }) {
  const dialog = document.getElementById('labDialog');
  const canvas = document.getElementById('labCanvas');
  const panel = document.getElementById('labPanel');
  const legend = document.getElementById('labLegend');
  const thumb = document.getElementById('labThumb');
  if (!dialog || !canvas || !panel || !legend) return;

  if (thumb) renderThumb(thumb);

  const inner = dialog.querySelector('.lightbox__inner');
  let viewer = null;

  const open = () => {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (!viewer) viewer = createViewer({ canvas, panel, legend, gsap, reduce });
    viewer.reset();
    viewer.play();
    if (!reduce) gsap.fromTo(inner, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
  };
  const close = () => {
    if (reduce) return dialog.close();
    gsap.to(inner, { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: () => dialog.close() });
  };

  document.querySelectorAll('[data-open-lab]').forEach((b) => b.addEventListener('click', open));
  dialog.querySelector('[data-lab-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => e.target === dialog && close());
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    viewer?.reset();
  });

  const seg = dialog.querySelectorAll('.seg__btn');
  seg.forEach((btn) =>
    btn.addEventListener('click', () => {
      seg.forEach((b) => b.classList.toggle('is-active', b === btn));
      viewer?.setView(btn.dataset.view);
    })
  );
}
