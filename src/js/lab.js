/**
 * Interactive viewer for the LKSN 2025 Module D topology (Cisco CML export, sanitized:
 * only device names, positions and links are kept - no configs, addresses or credentials).
 */
import data from '../data/lab-module-d.json';
import { getLang } from './i18n.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
};
const t = (o) => o[getLang()] ?? o.en;

/* ---------- semantic metadata (from the Test Project's physical + routing topology) ---------- */
const ZONES = {
  cor1: { en: 'Core site 1 (COR1)', id: 'Site core 1 (COR1)', label: 'COR1' },
  cor2: { en: 'Core site 2 (COR2)', id: 'Site core 2 (COR2)', label: 'COR2' },
  reg1: { en: 'Region 1 (REG1)', id: 'Region 1 (REG1)', label: 'REG1' },
  reg2: { en: 'Region 2 (REG2)', id: 'Region 2 (REG2)', label: 'REG2' },
  isp: { en: 'Internet (ISP)', id: 'Internet (ISP)', label: '' },
};
const R = (en, id) => ({ en, id });
const META = {
  ISP: { zone: 'isp', role: R('ISP router, external transit', 'Router ISP, transit eksternal'), domain: 'isp' },
  CO1: { zone: 'cor1', role: R('Edge router of core site 1', 'Router edge site core 1'), domain: 'bgp' },
  CO2: { zone: 'cor2', role: R('Edge router of core site 2', 'Router edge site core 2'), domain: 'bgp' },
  RCO1: { zone: 'cor1', role: R('Core router', 'Router core'), domain: 'ospf' },
  RCO2: { zone: 'cor1', role: R('Core router', 'Router core'), domain: 'ospf' },
  RCO3: { zone: 'cor2', role: R('Core router', 'Router core'), domain: 'boundary' },
  RCO4: { zone: 'cor2', role: R('Core router', 'Router core'), domain: 'eigrp' },
  S3CO1: { zone: 'cor1', role: R('Distribution switch', 'Switch distribusi'), domain: 'ospf' },
  S3CO2: { zone: 'cor1', role: R('Distribution switch', 'Switch distribusi'), domain: 'ospf' },
  S3CO3: { zone: 'cor2', role: R('Distribution switch', 'Switch distribusi'), domain: 'eigrp' },
  S3CO4: { zone: 'cor2', role: R('Distribution switch', 'Switch distribusi'), domain: 'eigrp' },
  S2CO1: { zone: 'cor1', role: R('Access switch', 'Switch akses'), domain: 'l2' },
  S2CO2: { zone: 'cor2', role: R('Access switch', 'Switch akses'), domain: 'l2' },
  'CO1-SVR': { zone: 'cor1', role: R('Server', 'Server'), domain: 'l2' },
  'CO1-CLI': { zone: 'cor1', role: R('Client PC', 'PC klien'), domain: 'l2' },
  'CO2-CLI': { zone: 'cor2', role: R('Client PC', 'PC klien'), domain: 'l2' },
  RG1: { zone: 'reg1', role: R('Region router', 'Router region'), domain: 'eigrp' },
  RG2: { zone: 'reg2', role: R('Region router', 'Router region'), domain: 'eigrp' },
  SRG1: { zone: 'reg1', role: R('Access switch', 'Switch akses'), domain: 'l2' },
  SRG2: { zone: 'reg2', role: R('Access switch', 'Switch akses'), domain: 'l2' },
  'RG1-CLI': { zone: 'reg1', role: R('Client PC', 'PC klien'), domain: 'l2' },
  'RG2-CLI': { zone: 'reg2', role: R('Client PC', 'PC klien'), domain: 'l2' },
};
const DOMAINS = {
  ospf: { en: 'OSPF (area 0 in core site 1)', id: 'OSPF (area 0 di site core 1)', cls: 'd-ospf' },
  eigrp: { en: 'EIGRP (core site 2 and regions)', id: 'EIGRP (site core 2 dan region)', cls: 'd-eigrp' },
  bgp: { en: 'BGP AS 65000.3 (CO1 and CO2)', id: 'BGP AS 65000.3 (CO1 dan CO2)', cls: 'd-bgp' },
  isp: { en: 'BGP AS 65000.1 (ISP)', id: 'BGP AS 65000.1 (ISP)', cls: 'd-isp' },
  boundary: { en: 'OSPF / EIGRP boundary (as drawn in the routing diagram)', id: 'Batas OSPF / EIGRP (sesuai diagram routing)', cls: 'd-boundary' },
  l2: { en: 'Layer 2 / end hosts (no routing process)', id: 'Layer 2 / host akhir (tanpa proses routing)', cls: 'd-l2' },
};
const KIND_NAME = {
  router: R('Router', 'Router'),
  isp: R('Router', 'Router'),
  switch: R('Switch', 'Switch'),
  client: R('Client PC', 'PC klien'),
  server: R('Server', 'Server'),
};

/* ---------- geometry ---------- */
const byId = Object.fromEntries(data.nodes.map((n) => [n.id, n]));
const VIEWBOX = '-450 -250 1300 740';
const PAD_X = 70;
const PAD_Y = 66;

function zoneBox(zone) {
  const m = data.nodes.filter((n) => META[n.id]?.zone === zone);
  const xs = m.map((n) => n.x), ys = m.map((n) => n.y);
  return { x: Math.min(...xs) - PAD_X, y: Math.min(...ys) - PAD_Y, w: Math.max(...xs) - Math.min(...xs) + PAD_X * 2, h: Math.max(...ys) - Math.min(...ys) + PAD_Y * 2 };
}

/** Glyph drawn around (0,0) for each device kind. */
function drawGlyph(g, node) {
  const k = node.kind;
  const isL3 = /^S3CO/.test(node.id);
  if (k === 'router') {
    el('circle', { r: 22, class: 'shape' }, g);
    el('path', { class: 'glyph', d: 'M-10 -10L10 10M10 -10L-10 10M-10 -10h6M-10 -10v6M10 10h-6M10 10v-6M10 -10h-6M10 -10v6M-10 10h6M-10 10v-6' }, g);
  } else if (k === 'switch') {
    if (isL3) {
      el('rect', { x: -22, y: -22, width: 44, height: 44, rx: 7, class: 'shape' }, g);
      el('path', { class: 'glyph', d: 'M-10 -10L10 10M10 -10L-10 10M-10 -10h6M-10 -10v6M10 10h-6M10 10v-6M10 -10h-6M10 -10v6M-10 10h6M-10 10v-6' }, g);
    } else {
      el('rect', { x: -22, y: -15, width: 44, height: 30, rx: 7, class: 'shape' }, g);
      el('path', { class: 'glyph', d: 'M-12 -4H12M8 -8L12 -4L8 0M12 5H-12M-8 1L-12 5L-8 9' }, g);
    }
  } else if (k === 'client') {
    el('rect', { x: -16, y: -14, width: 32, height: 22, rx: 3, class: 'shape' }, g);
    el('path', { class: 'glyph', d: 'M-20 14H20M-6 8V14M6 8V14' }, g);
  } else if (k === 'server') {
    el('rect', { x: -14, y: -20, width: 28, height: 40, rx: 4, class: 'shape' }, g);
    el('path', { class: 'glyph', d: 'M-8 -10H8M-8 -2H8M-8 14H-4' }, g);
  } else if (k === 'isp') {
    el('path', { class: 'shape', d: 'M-28 12C-40 12 -40 -6 -26 -6C-24 -22 0 -26 8 -14C22 -18 34 -6 28 6C34 14 26 16 20 12Z' }, g);
    el('text', { class: 'isp-text', x: 0, y: 4, 'text-anchor': 'middle' }, g).textContent = 'ISP';
  }
}
const labelDy = (n) => (n.kind === 'isp' ? 40 : n.kind === 'client' ? 32 : n.kind === 'server' ? 38 : 38);

/* ---------- small static preview for the project card ---------- */
export function renderThumb(host) {
  const svg = el('svg', { viewBox: VIEWBOX, role: 'img', 'aria-label': 'Network topology preview', class: 'lab-thumb__svg' });
  for (const z of ['cor1', 'cor2', 'reg1', 'reg2']) {
    const b = zoneBox(z);
    el('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 28, class: `zone z-${z}` }, svg);
  }
  data.links.forEach((l) => {
    const a = byId[l.a], b = byId[l.b];
    el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'link thumb-link' }, svg);
  });
  data.nodes.forEach((n) => {
    const z = META[n.id].zone;
    el('circle', { cx: n.x, cy: n.y, r: n.kind === 'router' || n.kind === 'isp' ? 17 : 12, class: `thumb-node tz-${z}` }, svg);
  });
  host.appendChild(svg);
}

/* ---------- full interactive viewer ---------- */
export function createViewer({ canvas, panel, legend, gsap, reduce }) {
  let view = 'zones';
  let selected = null;
  let selectedLink = null;
  let flowTweens = [];

  const svg = el('svg', { viewBox: VIEWBOX, class: 'lab-svg', role: 'group', 'aria-label': 'Interactive network topology' });
  const gZones = el('g', {}, svg);
  const gLinks = el('g', {}, svg);
  const gFlow = el('g', { class: 'flow' }, svg);
  const gNodes = el('g', {}, svg);
  canvas.appendChild(svg);

  for (const z of ['cor1', 'cor2', 'reg1', 'reg2']) {
    const b = zoneBox(z);
    el('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 28, class: `zone z-${z}` }, gZones);
    el('text', { x: b.x + 16, y: b.y + 28, class: 'zone-label' }, gZones).textContent = ZONES[z].label;
  }

  /* links (parallel offset when two links join the same pair of devices) */
  const pairCount = {};
  const linkEls = data.links.map((l, i) => {
    const key = [l.a, l.b].sort().join('|');
    pairCount[key] = (pairCount[key] || 0) + 1;
    const idx = pairCount[key] - 1;
    const a = byId[l.a], b = byId[l.b];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const off = idx === 0 ? 0 : 6;
    const ox = (-dy / len) * off, oy = (dx / len) * off;
    const g = el('g', { class: 'link-g', 'data-i': i }, gLinks);
    const coords = { x1: a.x + ox, y1: a.y + oy, x2: b.x + ox, y2: b.y + oy };
    const line = el('line', { ...coords, class: 'link' }, g);
    const hit = el('line', { ...coords, class: 'link-hit' }, g);
    el('title', {}, hit).textContent = `${l.a} ${l.ia}  <->  ${l.b} ${l.ib}`;
    hit.addEventListener('click', (e) => {
      e.stopPropagation();
      selectLink(i);
    });
    return { g, line, hit, l, coords };
  });

  /* nodes */
  const nodeEls = {};
  data.nodes.forEach((n) => {
    const g = el('g', { class: `node k-${n.kind}`, transform: `translate(${n.x} ${n.y})`, tabindex: 0, role: 'button', 'data-id': n.id, 'aria-label': `${n.id}, ${t(META[n.id].role)}` }, gNodes);
    el('circle', { r: 30, class: 'node-hit' }, g);
    drawGlyph(g, n);
    el('text', { class: 'node-label', y: labelDy(n), 'text-anchor': 'middle' }, g).textContent = n.id;
    g.addEventListener('pointerenter', () => !selected && !selectedLink && focusNode(n.id));
    g.addEventListener('pointerleave', () => !selected && !selectedLink && clearFocus());
    g.addEventListener('focus', () => !selected && !selectedLink && focusNode(n.id));
    g.addEventListener('blur', () => !selected && !selectedLink && clearFocus());
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(selected === n.id ? null : n.id);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectNode(selected === n.id ? null : n.id);
      }
    });
    nodeEls[n.id] = g;
  });
  svg.addEventListener('click', () => selectNode(null));

  /* ---------- state painting ---------- */
  const neighborsOf = (id) => data.links.filter((l) => l.a === id || l.b === id);

  function paintDomains() {
    data.nodes.forEach((n) => {
      const g = nodeEls[n.id];
      g.setAttribute('class', g.getAttribute('class').replace(/\b(d|tz)-\S+/g, '').trim());
      g.classList.add(view === 'routing' ? DOMAINS[META[n.id].domain].cls : `tz-${META[n.id].zone}`);
    });
    svg.classList.toggle('is-routing', view === 'routing');
  }

  function stopFlow() {
    flowTweens.forEach((tw) => tw.kill());
    flowTweens = [];
    gFlow.replaceChildren();
  }

  function startFlow(id) {
    stopFlow();
    if (reduce) return;
    neighborsOf(id).forEach((l, k) => {
      const from = byId[id], to = byId[l.a === id ? l.b : l.a];
      const dot = el('circle', { r: 4.5, class: 'packet', cx: from.x, cy: from.y }, gFlow);
      const p = { v: 0 };
      flowTweens.push(
        gsap.to(p, {
          v: 1, duration: 1.4, delay: k * 0.18, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.3,
          onUpdate: () => {
            dot.setAttribute('cx', from.x + (to.x - from.x) * p.v);
            dot.setAttribute('cy', from.y + (to.y - from.y) * p.v);
            dot.setAttribute('opacity', Math.sin(Math.PI * p.v));
          },
        })
      );
    });
  }

  function dimAll(on) {
    svg.classList.toggle('has-focus', on);
    Object.values(nodeEls).forEach((g) => g.classList.remove('is-on'));
    linkEls.forEach((le) => le.g.classList.remove('is-on'));
  }

  function focusNode(id) {
    dimAll(true);
    nodeEls[id].classList.add('is-on');
    neighborsOf(id).forEach((l) => {
      nodeEls[l.a].classList.add('is-on');
      nodeEls[l.b].classList.add('is-on');
      linkEls[data.links.indexOf(l)].g.classList.add('is-on');
    });
  }
  function clearFocus() {
    dimAll(false);
  }

  function selectNode(id) {
    selected = id;
    selectedLink = null;
    if (id) {
      focusNode(id);
      startFlow(id);
    } else {
      clearFocus();
      stopFlow();
    }
    renderPanel();
  }

  function selectLink(i) {
    selected = null;
    selectedLink = i;
    stopFlow();
    dimAll(true);
    const l = data.links[i];
    nodeEls[l.a].classList.add('is-on');
    nodeEls[l.b].classList.add('is-on');
    linkEls[i].g.classList.add('is-on');
    renderPanel();
  }

  /* ---------- panel + legend ---------- */
  function renderPanel() {
    panel.replaceChildren();
    const h = (tag, cls, text) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    };
    if (selectedLink != null) {
      const l = data.links[selectedLink];
      panel.append(h('div', 'lab-p__eyebrow', t(R('link', 'link'))));
      panel.append(h('h4', '', `${l.a} ↔ ${l.b}`));
      const rows = h('div', 'lab-p__rows');
      rows.append(h('div', 'lab-p__row mono', `${l.a}: ${l.ia}`), h('div', 'lab-p__row mono', `${l.b}: ${l.ib}`));
      panel.append(rows);
      return;
    }
    if (!selected) {
      panel.append(h('div', 'lab-p__eyebrow', t(R('overview', 'ringkasan'))));
      panel.append(h('h4', '', t(R('Multi-site enterprise network', 'Jaringan enterprise multi-site'))));
      panel.append(h('p', 'lab-p__text', t(R(
        `${data.nodes.length} devices and ${data.links.length} links: an ISP, two core sites (COR1, COR2) and two regional branches (REG1, REG2), exported from Cisco CML.`,
        `${data.nodes.length} device dan ${data.links.length} link: ISP, dua site core (COR1, COR2), dan dua cabang regional (REG1, REG2), diekspor dari Cisco CML.`
      ))));
      panel.append(h('p', 'lab-p__text dim', t(R('Select a device to see what it connects to.', 'Pilih sebuah device untuk melihat koneksinya.'))));
      return;
    }
    const n = byId[selected], m = META[selected];
    panel.append(h('div', 'lab-p__eyebrow', `${t(KIND_NAME[n.kind])} · ${t(ZONES[m.zone])}`));
    panel.append(h('h4', '', selected));
    panel.append(h('p', 'lab-p__text', t(m.role)));
    if (view === 'routing') panel.append(h('p', 'lab-p__text accent', t(DOMAINS[m.domain])));
    panel.append(h('div', 'lab-p__eyebrow', `${t(R('connections', 'koneksi'))} (${neighborsOf(selected).length})`));
    const list = h('div', 'lab-p__rows');
    neighborsOf(selected).forEach((l) => {
      const mine = l.a === selected ? l.ia : l.ib;
      const other = l.a === selected ? l.b : l.a;
      const oi = l.a === selected ? l.ib : l.ia;
      const b = h('button', 'lab-p__row mono');
      b.type = 'button';
      b.textContent = `${mine} → ${other} (${oi})`;
      b.addEventListener('click', () => selectNode(other));
      list.append(b);
    });
    panel.append(list);
  }

  function renderLegend() {
    legend.replaceChildren();
    const items = view === 'routing'
      ? ['ospf', 'eigrp', 'bgp', 'isp', 'boundary', 'l2'].map((k) => ({ cls: DOMAINS[k].cls, text: t(DOMAINS[k]) }))
      : ['cor1', 'cor2', 'reg1', 'reg2', 'isp'].map((k) => ({ cls: `tz-${k}`, text: t(ZONES[k]) }));
    items.forEach((it) => {
      const s = document.createElement('span');
      s.className = 'lab-key';
      s.innerHTML = `<i class="${it.cls}"></i>`;
      s.append(it.text);
      legend.append(s);
    });
  }

  function setView(v) {
    view = v;
    paintDomains();
    renderLegend();
    renderPanel();
  }

  document.addEventListener('langchange', () => {
    renderPanel();
    renderLegend();
  });

  paintDomains();
  renderLegend();
  renderPanel();

  /** Entrance animation: zones fade in, links draw, nodes pop. */
  function play() {
    if (reduce) return;
    const nodes = Object.values(nodeEls);
    gsap.set(nodes, { opacity: 0, transformOrigin: '50% 50%' });
    linkEls.forEach((le) => {
      const len = le.line.getTotalLength();
      le.line.style.strokeDasharray = len;
      le.line.style.strokeDashoffset = len;
    });
    gsap.set(gZones.children, { opacity: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(gZones.children, { opacity: 1, duration: 0.5, stagger: 0.04 })
      .to(linkEls.map((le) => le.line), { strokeDashoffset: 0, duration: 0.9, stagger: 0.02, onComplete() { linkEls.forEach((le) => { le.line.style.strokeDasharray = ''; le.line.style.strokeDashoffset = ''; }); } }, 0.15)
      .to(nodes, { opacity: 1, duration: 0.4, stagger: 0.03 }, 0.3);
  }

  function reset() {
    stopFlow();
    selected = null;
    selectedLink = null;
    clearFocus();
    renderPanel();
  }

  return { setView, play, reset };
}
