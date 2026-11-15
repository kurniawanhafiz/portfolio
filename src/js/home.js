const ROLES = [
  'Cloud Computing (AWS)',
  'IT Network Administration',
  'Linux Systems Administration',
  'Fiber Optic & ISP Infrastructure',
];

const SCRIPT = [
  { cmd: 'whoami', out: ['kurniawan-hafiz'] },
  { cmd: 'cat focus.txt', out: ['Cloud Computing · AWS', 'IT Network & Systems Administration', 'Linux · Cisco · MikroTik'] },
  { cmd: 'ls -1 achievements/', out: ['LKSN-2025_national-finalist', 'LKS-Prov-2025_1st-place', 'LKS-Prov-2026_3rd-cloud'] },
  { cmd: 'echo $NEXT_GOAL', out: ['AWS professional certification'] },
];

const promptHTML =
  '<span class="t-prompt">hafiz@portfolio</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$ </span>';

export default function init({ gsap, reduce, splitChars }) {
  const title = document.querySelectorAll('.hero__title [data-split]');
  const roleEl = document.getElementById('roleText');
  const termBody = document.getElementById('termBody');

  /* ---------- reduced motion: static content, no timelines ---------- */
  if (reduce) {
    if (roleEl) roleEl.textContent = 'Cloud Computing · IT Network · SysAdmin';
    if (termBody) {
      termBody.innerHTML = SCRIPT.map(
        (s) =>
          `<div class="row">${promptHTML}${s.cmd}</div>` +
          s.out.map((o) => `<div class="row t-out">${o}</div>`).join('')
      ).join('');
    }
    return null;
  }

  const chars = [...title].flatMap((el) => splitChars(el));
  gsap.set(chars, { yPercent: 115, rotate: 6 });
  const heroItems = gsap.utils.toArray('.hero [data-hero]');
  gsap.set(heroItems, { opacity: 0, y: 24 });
  gsap.set('.terminal', { opacity: 0, y: 40, scale: 0.96 });

  /* ---------- rotating role (typewriter) ---------- */
  function startRoles() {
    if (!roleEl) return;
    const state = { n: 0 };
    const tl = gsap.timeline({ repeat: -1 });
    ROLES.forEach((role) => {
      tl.to(state, {
        n: role.length,
        duration: role.length * 0.055,
        ease: 'none',
        onUpdate: () => (roleEl.textContent = role.slice(0, Math.round(state.n))),
      })
        .to({}, { duration: 1.6 })
        .to(state, {
          n: 0,
          duration: role.length * 0.025,
          ease: 'none',
          onUpdate: () => (roleEl.textContent = role.slice(0, Math.round(state.n))),
        })
        .to({}, { duration: 0.25 });
    });
  }

  /* ---------- terminal typing ---------- */
  function playTerminal() {
    if (!termBody) return;
    termBody.innerHTML = '';
    const tl = gsap.timeline({ delay: 0.2 });
    SCRIPT.forEach((step) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `${promptHTML}<span class="cmd"></span>`;
      const cmd = row.querySelector('.cmd');
      const state = { n: 0 };
      tl.call(() => termBody.appendChild(row)).to(state, {
        n: step.cmd.length,
        duration: step.cmd.length * 0.045,
        ease: 'none',
        onUpdate: () => (cmd.textContent = step.cmd.slice(0, Math.round(state.n))),
      });
      step.out.forEach((line) => {
        tl.call(() => {
          const out = document.createElement('div');
          out.className = 'row t-out';
          out.textContent = line;
          termBody.appendChild(out);
          gsap.from(out, { opacity: 0, x: -8, duration: 0.3 });
        }, null, '+=0.12');
      });
      tl.to({}, { duration: 0.35 });
    });
    tl.call(() => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `${promptHTML}<span class="caret"></span>`;
      termBody.appendChild(row);
    });
  }

  /* ---------- hero entrance ---------- */
  return {
    play() {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.035 }, 0)
        .to(heroItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.25)
        .to('.terminal', { opacity: 1, y: 0, scale: 1, duration: 1.1 }, 0.35)
        .call(startRoles, null, 0.9)
        .call(playTerminal, null, 1.0);
    },
  };
}
