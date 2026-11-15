import { getLang } from './i18n.js';

const MSG = {
  sending: { en: '> sending ...', id: '> mengirim ...' },
  ok: { en: '✓ Message sent. Thanks, I will reply soon.', id: '✓ Pesan terkirim. Terima kasih, nanti saya balas.' },
  err: {
    en: '✗ Could not send. Please email me directly.',
    id: '✗ Gagal mengirim. Silakan email saya langsung.',
  },
};

export default function init({ gsap, reduce }) {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return null;

  const say = (key, cls = '') => {
    note.className = `form__note ${cls}`;
    note.textContent = MSG[key][getLang()];
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    say('sending');
    try {
      // Netlify Forms: POST url-encoded to "/" with the form-name field.
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say('ok', 'ok');
      if (!reduce) gsap.fromTo(note, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    } catch {
      say('err', 'err');
    } finally {
      btn.disabled = false;
    }
  });

  return null;
}
