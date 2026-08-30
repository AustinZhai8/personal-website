import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

const el = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
)

// `npm run build` prerenders every route into #root, so production hydrates. The dev
// server ships the bare index.html, so there is nothing to hydrate there.
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)
