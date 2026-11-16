import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTheme } from './js/theme.js';
import { initI18n } from './js/i18n.js';
import { initNav } from './js/nav.js';
import { initCvMenus } from './js/cv.js';
import { initTransitions } from './js/transitions.js';
import { initCommon, splitChars } from './js/common.js';

gsap.registerPlugin(ScrollTrigger);

const reduce = document.documentElement.classList.contains('no-motion');
const page = document.body.dataset.page || 'index';

const pages = {
  index: () => import('./js/home.js'),
  achievements: () => import('./js/achievements.js'),
  projects: () => import('./js/projects.js'),
  contact: () => import('./js/contact.js'),
  404: () => import('./js/notfound.js'),
};

async function boot() {
  initTheme();
  initI18n(() => ScrollTrigger.refresh());
  initNav();
  initCvMenus();

  const ctx = { gsap, ScrollTrigger, reduce, splitChars };
  initCommon(ctx);

  let entrance = null;
  try {
    const mod = await pages[page]?.();
    entrance = mod?.default?.(ctx) ?? null;
  } catch (err) {
    // Never let an animation bug hide the content.
    console.error(err);
    document.documentElement.classList.add('no-motion');
  }

  const { ready } = initTransitions(ctx, { page });
  await ready;
  entrance?.play?.();
  ScrollTrigger.refresh();
}

boot();
