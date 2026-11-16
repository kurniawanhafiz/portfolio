import { getLang, setLang } from './i18n.js';
import { setTheme } from './theme.js';
import { cvUrl } from './cv.js';

/**
 * Interactive terminal for the home hero.
 * Only commands that the site really supports exist here; output follows the site language.
 */
const PAGES = {
  home: '/',
  achievements: '/achievements',
  projects: '/projects',
  contact: '/contact',
};

const LINKS = {
  github: 'https://github.com/kurniawanhafiz',
  linkedin: 'https://linkedin.com/in/kurniawanhafiz',
  instagram: 'https://instagram.com/kurniawanhafizzz',
};

const EMAIL = 'fizallinone@gmail.com';

const T = (en, id) => ({ en, id });

const DOC = {
  whoami: ['kurniawan-hafiz'],
  about: T(
    [
      'Kurniawan Hafiz · Information Systems undergrad, Universitas Riau',
      'Award-winning in Cloud Computing & IT Network Systems Administration (up to national level).',
      'Fiber optic, Linux (Debian/Red Hat), Cisco, MikroTik, AWS.',
      'Based in Pekanbaru, Riau.',
    ],
    [
      'Kurniawan Hafiz · mahasiswa Sistem Informasi, Universitas Riau',
      'Berprestasi di Cloud Computing & IT Network Systems Administration (hingga tingkat nasional).',
      'Fiber optic, Linux (Debian/Red Hat), Cisco, MikroTik, AWS.',
      'Berdomisili di Pekanbaru, Riau.',
    ]
  ),
  skills: T(
    [
      'cloud    AWS (EC2, S3, ELB, CloudWatch, IAM), Git/GitHub, Netlify, Vercel, SSL/TLS',
      'systems  Linux Debian 12 / Red Hat, DNS, DHCP, web & mail, Samba, LDAP, VPN',
      'network  Cisco (VLAN, OSPF, EIGRP, BGP, ACL), MikroTik (hotspot, queue, firewall)',
      'physical fiber optic: fusion splicer, OPM, OTDR, ONT',
    ],
    [
      'cloud    AWS (EC2, S3, ELB, CloudWatch, IAM), Git/GitHub, Netlify, Vercel, SSL/TLS',
      'sistem   Linux Debian 12 / Red Hat, DNS, DHCP, web & mail, Samba, LDAP, VPN',
      'jaringan Cisco (VLAN, OSPF, EIGRP, BGP, ACL), MikroTik (hotspot, queue, firewall)',
      'fisik    fiber optic: fusion splicer, OPM, OTDR, ONT',
    ]
  ),
  experience: T(
    [
      'Network Technician Intern · PT Global Riau Data Solusi',
      'Nov 2025 – Mar 2026 · ISP fiber optic installation, ONT setup, on-site troubleshooting',
    ],
    [
      'Network Technician Intern · PT Global Riau Data Solusi',
      'Nov 2025 – Mar 2026 · instalasi fiber optic ISP, konfigurasi ONT, troubleshooting lapangan',
    ]
  ),
  education: T(
    ['2026 – now   Universitas Riau, B.Sc. Information Systems', '2023 – 2026  SMK Negeri 1 Sijunjung, Computer & Network Engineering'],
    ['2026 – kini  Universitas Riau, S1 Sistem Informasi', '2023 – 2026  SMK Negeri 1 Sijunjung, Teknik Komputer & Jaringan']
  ),
  achievements: T(
    [
      '2026  3rd place, Cloud Computing · LKS West Sumatra',
      '2025  Finalist (18th/30), IT Network Systems Admin · LKS National',
      '2025  1st place, IT Network Systems Admin · LKS West Sumatra',
      '2025  2nd place, IT Network Systems Admin · LKS Sijunjung',
      "type 'cd achievements' for details",
    ],
    [
      '2026  Juara 3, Cloud Computing · LKS Sumatera Barat',
      '2025  Finalis (18/30), IT Network Systems Admin · LKS Nasional',
      '2025  Juara 1, IT Network Systems Admin · LKS Sumatera Barat',
      '2025  Juara 2, IT Network Systems Admin · LKS Kab. Sijunjung',
      "ketik 'cd achievements' untuk detail",
    ]
  ),
  certs: T(
    [
      'BNSP Junior Technical Support, Data Center · 2026–2029',
      'BNSP Junior Technical Support · 2026–2029',
      'Red Hat Academy · Linux Fundamentals · Dec 2025',
    ],
    [
      'BNSP Junior Technical Support Pusat Data · 2026–2029',
      'BNSP Junior Technical Support · 2026–2029',
      'Red Hat Academy · Linux Fundamentals · Des 2025',
    ]
  ),
};

const HELP = T(
  [
    'info      whoami · about · skills · experience · education',
    '          achievements · certs · projects · contact',
    'navigate  cd <home|achievements|projects|contact> · open <page> · ls',
    'site      theme [dark|light] · lang [en|id] · cv [id|en]',
    '          github · linkedin · instagram · email',
    'shell     help · clear · history · date · pwd · echo · neofetch',
    'tip: Tab to autocomplete, ↑/↓ for history',
  ],
  [
    'info      whoami · about · skills · experience · education',
    '          achievements · certs · projects · contact',
    'navigasi  cd <home|achievements|projects|contact> · open <halaman> · ls',
    'situs     theme [dark|light] · lang [en|id] · cv [id|en]',
    '          github · linkedin · instagram · email',
    'shell     help · clear · history · date · pwd · echo · neofetch',
    'tips: Tab untuk autocomplete, ↑/↓ untuk riwayat',
  ]
);

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

export function initTerminal({ body, gsap, reduce }) {
  const term = body.closest('.terminal');
  const lang = () => getLang();
  const pick = (v) => (Array.isArray(v) ? v : v[lang()]);

  // ---- DOM ----
  body.innerHTML = '';
  const log = document.createElement('div');
  log.className = 't-log';
  const inputRow = document.createElement('div');
  inputRow.className = 't-input-row';
  inputRow.hidden = true;
  inputRow.innerHTML =
    '<span class="t-prompt">hafiz@portfolio</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$&nbsp;</span>';
  const input = document.createElement('input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'terminal input');
  input.enterKeyHint = 'send';
  inputRow.append(input);
  body.append(log, inputRow);

  const chips = document.createElement('div');
  chips.className = 'terminal__chips';
  chips.hidden = true;
  chips.innerHTML =
    '<span>try:</span>' + ['help', 'about', 'skills', 'achievements', 'cv', 'theme'].map((c) => `<button type="button" data-cmd="${c}">${c}</button>`).join('');
  term.append(chips);

  const scroll = () => (body.scrollTop = body.scrollHeight);

  function print(lines, cls = '') {
    pick(lines)
      .concat()
      .forEach((l) => {
        const row = document.createElement('div');
        row.className = `row t-out ${cls}`;
        row.innerHTML = l;
        log.append(row);
      });
    scroll();
  }
  const printText = (arr, cls) => print(arr.map(esc), cls);

  const echoCmd = (text) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span class="t-prompt">hafiz@portfolio</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$ </span><span class="t-cmd">${esc(text)}</span>`;
    log.append(row);
  };

  // ---- navigation through the existing page-transition interceptor ----
  function go(href) {
    const a = document.createElement('a');
    a.href = href;
    a.style.display = 'none';
    document.body.append(a);
    a.click();
    a.remove();
  }
  function openExternal(url) {
    const w = window.open(url, '_blank', 'noopener');
    if (!w) printText([url]); // popup blocked: show the URL instead
  }
  function download(l) {
    const a = document.createElement('a');
    a.href = cvUrl(l);
    a.download = '';
    document.body.append(a);
    a.click();
    a.remove();
  }

  const msg = (en, id) => T([en], [id]);
  const pageOf = (arg) => {
    const k = (arg || '').replace(/^~?\/?/, '').replace(/\/$/, '').replace(/\.html$/, '').toLowerCase();
    if (k === '' || k === 'index') return 'home';
    return PAGES[k] ? k : null;
  };

  // ---- commands ----
  const history = [];
  const COMMANDS = {
    help: () => print(HELP),
    '?': () => print(HELP),
    whoami: () => printText(DOC.whoami),
    about: () => print(DOC.about),
    skills: () => print(DOC.skills),
    experience: () => print(DOC.experience),
    education: () => print(DOC.education),
    certs: () => print(DOC.certs),
    certifications: () => print(DOC.certs),
    achievements: () => print(DOC.achievements),
    projects: () => {
      print(msg('Opening projects ...', 'Membuka projects ...'));
      go(PAGES.projects);
    },
    contact: () => {
      print(msg(`email  ${EMAIL}`, `email  ${EMAIL}`));
      print(msg("type 'cd contact' for the contact form", "ketik 'cd contact' untuk form kontak"));
    },
    email: () => printText([EMAIL]),
    ls: () => printText(['home/', 'achievements/', 'projects/', 'contact/', 'cv/']),
    pwd: () => printText(['/home/hafiz']),
    date: () => printText([new Date().toString()]),
    history: () => printText(history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`)),
    clear: () => (log.innerHTML = ''),
    cls: () => (log.innerHTML = ''),
    neofetch: () =>
      printText([
        'hafiz@portfolio',
        '---------------',
        'OS:      Debian 12 (and Windows, forgive me)',
        'Role:    Cloud / IT Network & Systems Admin',
        'Shell:   gsap-sh 3.13',
        'Uptime:  since 2023 (SMK TKJ)',
        'Stack:   AWS · Linux · Cisco · MikroTik',
        'Next:    AWS professional certification',
      ]),
    cd: (a) => {
      if (!a) return printText(['']);
      const p = pageOf(a);
      if (!p) return print(msg(`cd: ${esc(a)}: no such page (try: ls)`, `cd: ${esc(a)}: halaman tidak ada (coba: ls)`), 't-err');
      if ((p === 'home' && location.pathname === '/') || location.pathname.replace(/\/$/, '') === PAGES[p])
        return print(msg('already here', 'kamu sudah di sini'));
      print(msg(`entering ${p}/ ...`, `masuk ke ${p}/ ...`));
      setTimeout(() => go(PAGES[p]), 250);
    },
    open: (a) => (a ? COMMANDS.cd(a) : print(msg('usage: open <page>', 'pemakaian: open <halaman>'), 't-err')),
    theme: (a) => {
      const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      const next = a === 'dark' || a === 'light' ? a : cur === 'dark' ? 'light' : 'dark';
      setTheme(next);
      print(msg(`theme → ${next}`, `tema → ${next}`));
    },
    lang: (a) => {
      const next = a === 'en' || a === 'id' ? a : lang() === 'en' ? 'id' : 'en';
      setLang(next);
      print(msg(`language → ${next}`, `bahasa → ${next}`));
    },
    cv: (a) => {
      const l = a === 'id' || a === 'en' ? a : lang();
      download(l);
      print(msg(`downloading CV_Kurniawan_Hafiz_${l.toUpperCase()}.pdf ...`, `mengunduh CV_Kurniawan_Hafiz_${l.toUpperCase()}.pdf ...`));
    },
    echo: (_a, raw) => printText([raw.replace(/^echo\s*/, '').replace(/^["']|["']$/g, '')]),
    ping: (a) =>
      printText([
        `PING ${a || 'kurniawanhafiz.web.id'}: 56 data bytes`,
        '64 bytes: icmp_seq=0 ttl=64 time=0.042 ms',
        '64 bytes: icmp_seq=1 ttl=64 time=0.038 ms',
        '--- 0% packet loss · hire me? ---',
      ]),
    sudo: () => print(msg('hafiz is not in the sudoers file. This incident will be reported.', 'hafiz tidak ada di file sudoers. Insiden ini akan dilaporkan.'), 't-err'),
    exit: () => print(msg("there is no escape. (try 'cd home')", "tidak ada jalan keluar. (coba 'cd home')")),
    vim: () => print(msg('you are now trapped. :q! to leave (just kidding)', 'kamu sekarang terjebak. :q! untuk keluar (bercanda)')),
    hello: () => print(msg('hi! type help to see what I can do', 'halo! ketik help untuk lihat yang bisa dilakukan')),
    hi: () => COMMANDS.hello(),
    coffee: () => printText(['  ( (', '   ) )', ' .______.', ' |      |]', ' \\      /', "  `----'", 'brewing... ☕']),
  };
  for (const k of Object.keys(LINKS)) {
    COMMANDS[k] = () => {
      print(msg(`opening ${k} ...`, `membuka ${k} ...`));
      openExternal(LINKS[k]);
    };
  }
  const NAMES = Object.keys(COMMANDS).filter((k) => !['?', 'cls', 'hi', 'certifications'].includes(k));

  function run(raw) {
    const text = raw.trim();
    echoCmd(raw);
    if (!text) return scroll();
    history.push(text);
    hIdx = history.length;

    // easter egg with arguments
    if (/^rm\s+-rf\s+\/?\*?/.test(text)) {
      print(msg('rm: permission denied. nice try. 😄', 'rm: izin ditolak. nice try. 😄'), 't-err');
      return scroll();
    }
    const [cmd, ...rest] = text.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (!fn) {
      print(msg(`${esc(cmd)}: command not found. type 'help'`, `${esc(cmd)}: perintah tidak ditemukan. ketik 'help'`), 't-err');
    } else {
      fn(rest[0]?.toLowerCase(), text);
    }
    scroll();
  }

  // ---- input handling ----
  let hIdx = 0;
  let draft = '';
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value;
      input.value = '';
      run(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIdx === history.length) draft = input.value;
      if (hIdx > 0) input.value = history[--hIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < history.length - 1) input.value = history[++hIdx];
      else {
        hIdx = history.length;
        input.value = draft;
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value;
      if (/\s/.test(v)) {
        const [c, a = ''] = v.split(/\s+/);
        const opts = c === 'cd' || c === 'open' ? Object.keys(PAGES) : c === 'theme' ? ['dark', 'light'] : c === 'lang' ? ['en', 'id'] : c === 'cv' ? ['id', 'en'] : [];
        const m = opts.filter((o) => o.startsWith(a.toLowerCase()));
        if (m.length === 1) input.value = `${c} ${m[0]}`;
        return;
      }
      const m = NAMES.filter((n) => n.startsWith(v.toLowerCase()));
      if (m.length === 1) input.value = m[0];
      else if (m.length > 1) {
        echoCmd(v);
        printText([m.join('  ')]);
      }
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      log.innerHTML = '';
    }
  });

  body.addEventListener('click', () => {
    if (!getSelection()?.toString()) input.focus({ preventScroll: true });
  });
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cmd]');
    if (!b) return;
    run(b.dataset.cmd);
  });

  const isTouch = matchMedia('(pointer: coarse)').matches;

  return {
    /** Called after the intro finished: show the live prompt. */
    enable() {
      inputRow.hidden = false;
      chips.hidden = false;
      if (!isTouch) input.focus({ preventScroll: true });
      scroll();
    },
    log,
    print,
    printText,
    echoCmd,
    isTouch,
    hint: () => print(msg("type 'help' to see commands", "ketik 'help' untuk melihat perintah")),
  };
}
