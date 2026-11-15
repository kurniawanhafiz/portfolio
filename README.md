# Portfolio - Kurniawan Hafiz

Multi-page portfolio built with **Vite** and **GSAP** (+ ScrollTrigger), deployed on **Netlify**.
Live: https://kurniawanhafiz.web.id

## Develop
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # output in dist/
npm run preview
```

## Structure
- `*.html` - pages (index, achievements, projects, contact, 404)
- `src/partials/` - nav, footer, SVG icon sprite (injected at build by `vite.config.js`)
- `src/styles/main.css` - design tokens + all styles (dark/light)
- `src/js/` - GSAP modules (transitions, reveal, home hero, lightbox, filters, Netlify form)
- `public/` - favicon, robots.txt, sitemap.xml, Google/Bing verification, optimized images
- `netlify.toml` - build, clean-URL rewrites, cache + security headers

## Netlify
Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
The contact form uses Netlify Forms (enable form notifications in the Netlify dashboard).
