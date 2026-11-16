/** Split an element's text into word-wrapped character spans. Returns the char elements. */
export function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const frag = document.createDocumentFragment();
  const chars = [];
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.style.cssText = 'display:inline-block;white-space:nowrap';
    word.setAttribute('aria-hidden', 'true');
    [...part].forEach((c) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = c;
      word.appendChild(s);
      chars.push(s);
    });
    frag.appendChild(word);
  });
  el.appendChild(frag);
  return chars;
}

/** Behaviour shared by every page: reveal on scroll, counters, magnetic buttons, cursor glow, timelines. */
export function initCommon({ gsap, ScrollTrigger, reduce }) {
  if (reduce) {
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count;
    });
    return;
  }

  // ---- scroll reveal (batched, so siblings stagger) ----
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        overwrite: true,
      }),
  });

  // ---- counters ----
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(state.v)),
        }),
    });
  });

  // ---- timeline line that draws while scrolling ----
  document.querySelectorAll('.timeline').forEach((tl) => {
    const bar = tl.querySelector('.timeline__line i');
    if (!bar) return;
    gsap.to(bar, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
    });
  });

  // ---- fine pointer only: cursor glow + magnetic buttons ----
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    const gx = gsap.quickTo(glow, 'x', { duration: 0.7, ease: 'power3' });
    const gy = gsap.quickTo(glow, 'y', { duration: 0.7, ease: 'power3' });
    window.addEventListener(
      'pointermove',
      (e) => {
        gsap.to(glow, { opacity: 1, duration: 0.6, overwrite: 'auto' });
        gx(e.clientX);
        gy(e.clientY);
      },
      { passive: true }
    );

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      el.addEventListener('pointerleave', () => {
        mx(0);
        my(0);
      });
    });
  }
}
