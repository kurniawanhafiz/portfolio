/**
 * Boot loader (first visit of the session, home only) + page transitions.
 * Every page starts covered by .curtain (set in the HTML), then lifts.
 * Clicking an internal link brings the curtain back up before navigating.
 */
const BOOT_LINES = [
  '> initializing portfolio ...',
  '> loading modules   [gsap] [scrolltrigger]',
  '> mounting /home/hafiz',
  '> ready_',
];

export function initTransitions({ gsap, reduce }, { page }) {
  const curtain = document.querySelector('.curtain');
  if (!curtain) return { ready: Promise.resolve() };

  if (reduce) {
    curtain.remove();
    return { ready: Promise.resolve() };
  }

  const text = curtain.querySelector('.curtain__text');
  let firstVisit = false;
  try {
    firstVisit = page === 'index' && !sessionStorage.getItem('booted');
  } catch {
    /* ignore */
  }

  const lift = (delay = 0) =>
    new Promise((resolve) => {
      gsap.to(curtain, {
        yPercent: -100,
        duration: 0.85,
        delay,
        ease: 'power4.inOut',
        onStart: () => setTimeout(resolve, 380), // start page entrance while the curtain is leaving
        onComplete: () => {
          curtain.classList.remove('is-boot');
          gsap.set(curtain, { yPercent: 100, display: 'none' });
        },
      });
    });

  let ready;
  if (firstVisit && text) {
    try {
      sessionStorage.setItem('booted', '1');
    } catch {
      /* ignore */
    }
    ready = new Promise((resolve) => {
      const state = { n: 0 };
      const total = BOOT_LINES.join('\n').length;
      gsap.set(text, { opacity: 1 });
      gsap.to(state, {
        n: total,
        duration: 1.15,
        ease: 'none',
        onUpdate: () => {
          text.textContent = BOOT_LINES.join('\n').slice(0, Math.round(state.n));
        },
        onComplete: () => lift(0.25).then(resolve),
      });
    });
  } else {
    ready = lift(0.05);
  }

  // ---- outgoing transition ----
  const isInternal = (a) =>
    a.origin === location.origin &&
    !a.target &&
    !a.hasAttribute('download') &&
    !(a.pathname === location.pathname && a.hash) &&
    a.pathname !== location.pathname;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest('a[href]');
    if (!a || !isInternal(a)) return;
    e.preventDefault();
    gsap.set(curtain, { display: 'grid', yPercent: 100 });
    gsap.to(curtain, {
      yPercent: 0,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        location.href = a.href;
      },
    });
  });

  // Back/forward cache: make sure the curtain is not left covering the page.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(curtain, { display: 'none', yPercent: 100 });
  });

  return { ready };
}
