export default function init({ gsap, reduce, splitChars }) {
  const code = document.querySelector('.nf__code');
  if (!code || reduce) return null;

  const chars = splitChars(code);
  gsap.set(chars, { opacity: 0, yPercent: -60, rotate: () => gsap.utils.random(-14, 14) });
  gsap.set('.nf [data-hero]', { opacity: 0, y: 20 });

  return {
    play() {
      gsap
        .timeline({ defaults: { ease: 'bounce.out' } })
        .to(chars, { opacity: 1, yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.12 })
        .to('.nf [data-hero]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.6)
        .to(chars, { x: () => gsap.utils.random(-6, 6), duration: 0.06, repeat: 5, yoyo: true, ease: 'none', stagger: 0.02 }, '+=0.4')
        .to(chars, { x: 0, duration: 0.1 });
    },
  };
}
