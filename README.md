# Austin Zhai Portfolio

Personal portfolio at **[austinzhai.com](https://austinzhai.com)**.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: plain CSS in `src/index.css` (Tailwind v4 is installed but the codebase does not use utility classes)
- **Hosting**: Vercel, deployed on push to `main`
- **Domain**: Namecheap

## Features

- One long scrolling page (home / about / experience / projects) plus a standalone detail view per role and per project
- Hash-free real URLs, hand-rolled routing, no router library
- **Every route is prerendered to static HTML at build time**, so crawlers, social scrapers and LLMs see real content with JavaScript off
- Per-route title, meta description, canonical, Open Graph card and JSON-LD
- Scroll-triggered reveal animations, with reduced-motion and no-JS fallbacks
- The projects page doubles as a print-optimized resume (Ctrl+P)
- Real 404 page served with a 404 status

## Local Development

### Prerequisites

- Node.js v20+
- Git

### Setup

```bash
git clone https://github.com/AustinZhai8/personal-website.git
cd personal-website
npm install
npm run dev
```

Open <http://localhost:5173>.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server. Serves the bare `index.html`; the app client-renders. |
| `npm run build` | Client build, then an SSR build, then `scripts/prerender.mjs` writes one HTML file per route plus `404.html` and `sitemap.xml`. |
| `npm run preview` | Serves `dist/` — the only way to see the prerendered output locally. |
| `npm run lint` | ESLint. Must exit 0 before committing. |

## Build Pipeline

`npm run build` runs three steps:

1. `vite build` — client bundle into `dist/`
2. `vite build --ssr src/entry-server.jsx --outDir dist-ssr` — Node-targeted bundle of the same app
3. `node scripts/prerender.mjs` — renders each route in `ALL_ROUTES` to markup, injects that route's head tags, and writes `dist/<route>/index.html`

`ALL_ROUTES` and the per-route metadata both come from `metaFor()` in `src/App.jsx`, which reads the content arrays directly — a new project or role is picked up by the sitemap and the prerender pass automatically.

## Project Structure

```
index.html              # static <head>; the <!--seo--> marker is where per-route tags go
src/
  App.jsx               # every component, hook, and all content data (deliberately one file)
  entry-server.jsx      # build-time only; renders a route to a string
  index.css             # the entire visual system, incl. print + reduced-motion blocks
  main.jsx              # hydrates the prerendered HTML (falls back to createRoot in dev)
scripts/
  prerender.mjs         # writes dist/<route>/index.html, 404.html, sitemap.xml
public/                 # static assets, robots.txt, llms.txt, og.png, favicon, manifest
```

See `CLAUDE.md` for the conventions this codebase follows.

## License

MIT
