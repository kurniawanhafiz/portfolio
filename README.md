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

## CV & terminal
- `public/cv/` holds the ID/EN PDFs. Regenerate with `python3 tools/build_cv.py` (needs Python Playwright).
- The "Download CV" menu lives in `src/partials/cv.html` (`<!--@cv-->` in pages, `<!--@cv-up-->` in the footer).
- The hero terminal is `src/js/terminal.js`; add a command by adding a key to `COMMANDS` (and the `HELP` text).
