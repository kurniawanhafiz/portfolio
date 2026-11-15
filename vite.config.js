import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const root = import.meta.dirname;
const pages = ['index', 'achievements', 'projects', 'contact', '404'];
const cleanUrls = ['/achievements', '/projects', '/contact'];

/**
 * Tiny HTML include system:
 *  <!--@nav-->, <!--@footer-->, <!--@icons--> are replaced by files in src/partials.
 *  In the nav, the link with data-nav="<page>" gets the active state.
 */
function htmlPartials() {
  const read = (n) => readFileSync(resolve(root, 'src/partials', `${n}.html`), 'utf8');
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const page = (ctx.path || '/index.html').replace(/^\//, '').replace(/\.html$/, '') || 'index';
        const nav = read('nav').replace(
          new RegExp(`data-nav="${page}"`),
          `data-nav="${page}" aria-current="page" class="is-active"`
        );
        return html
          .replace('<!--@icons-->', read('icons'))
          .replace('<!--@nav-->', nav)
          .replace('<!--@footer-->', read('footer'));
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/partials/')) server.ws.send({ type: 'full-reload' });
    },
  };
}

/** Make /achievements etc. work in `vite dev` and `vite preview`, like Netlify does. */
function cleanUrlRewrite() {
  const rewrite = (req, _res, next) => {
    const [path, qs] = (req.url || '').split('?');
    if (cleanUrls.includes(path.replace(/\/$/, ''))) {
      req.url = path.replace(/\/$/, '') + '.html' + (qs ? `?${qs}` : '');
    }
    next();
  };
  return {
    name: 'clean-url-rewrite',
    configureServer: (s) => s.middlewares.use(rewrite),
    configurePreviewServer: (s) => s.middlewares.use(rewrite),
  };
}

export default defineConfig({
  plugins: [htmlPartials(), cleanUrlRewrite()],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])),
    },
  },
});
