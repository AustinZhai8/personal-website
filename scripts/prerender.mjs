// Turns the single-page build into one real HTML document per route.
//
// Runs after `vite build` (which produces dist/index.html with the hashed asset tags)
// and `vite build --ssr` (which produces dist-ssr/entry-server.js). For each route it
// renders the app to markup, swaps in that route's <title> and head tags, and writes
// dist/<route>/index.html. Also emits dist/404.html and dist/sitemap.xml.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const server = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, ALL_ROUTES, SITEMAP_ROUTES, SITE, metaFor, routeForPath, ldJson } = server

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')

if (!template.includes('<!--seo-->')) throw new Error('index.html is missing the <!--seo--> marker')
if (!template.includes('<div id="root"></div>')) throw new Error('index.html is missing an empty #root')

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(meta) {
  const tags = [
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    // </ inside a script body would close the tag early
    `<script type="application/ld+json" id="ld-route">${ldJson(meta).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.join('\n    ')
}

function pageFor(route) {
  const meta = metaFor(routeForPath(route))
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace('<!--seo-->', headFor(meta))
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
}

async function write(relDir, html) {
  const dir = path.join(dist, relDir)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'index.html'), html)
}

for (const route of ALL_ROUTES) {
  await write(route === '/' ? '.' : route.slice(1), pageFor(route))
}

// Vercel serves this with a real 404 status for any path that has no file above.
await fs.writeFile(path.join(dist, '404.html'), pageFor('/__not-found__'))

const lastmod = new Date().toISOString().slice(0, 10)
const urls = SITEMAP_ROUTES.map((r) => [
  '  <url>',
  `    <loc>${SITE.origin}${r}</loc>`,
  `    <lastmod>${lastmod}</lastmod>`,
  `    <priority>${r === '/' ? '1.0' : '0.8'}</priority>`,
  '  </url>',
].join('\n')).join('\n')

await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`)

console.log(`prerendered ${ALL_ROUTES.length} routes + 404.html, sitemap has ${SITEMAP_ROUTES.length} urls`)
