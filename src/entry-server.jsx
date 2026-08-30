// Build-time only. `vite build --ssr` bundles this for Node, then
// scripts/prerender.mjs calls render() once per route and writes the HTML.
// Deliberately imports no CSS: the client build already emits the stylesheet.
import { renderToString } from 'react-dom/server'
import App, { routeForPath } from './App.jsx'

export { ALL_ROUTES, SITEMAP_ROUTES, SITE, metaFor, routeForPath, ldJson } from './App.jsx'

export function render(path) {
  return renderToString(<App initialRoute={routeForPath(path)} />)
}
