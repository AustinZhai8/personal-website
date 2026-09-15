import { useState, useEffect, useMemo, useRef } from 'react'

// ─── Icons ───────────────────────────────────────────────────────────────

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconGithub({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}
function IconExternal({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
function IconArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
function IconArrowLeft({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}
function IconChevron({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
// ─── Hooks ───────────────────────────────────────────────────────────────

function useScrollReveal(ref, deps) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    ref.current.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || [])
}

// The prerendered <head> is correct for the first paint only. Navigating inside the
// SPA never reloads the document, so the tab title, description, canonical and the
// social tags have to be swapped by hand on every route change.
function setTag(selector, create, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', value)
}

function useDocumentHead(meta) {
  useEffect(() => {
    document.title = meta.title
    const meta$ = (name, value) =>
      setTag(`meta[name="${name}"]`, () => {
        const el = document.createElement('meta')
        el.setAttribute('name', name)
        return el
      }, value)
    const og$ = (prop, value) =>
      setTag(`meta[property="${prop}"]`, () => {
        const el = document.createElement('meta')
        el.setAttribute('property', prop)
        return el
      }, value)

    meta$('description', meta.description)
    meta$('robots', meta.noindex ? 'noindex, follow' : 'index, follow')
    meta$('twitter:title', meta.title)
    meta$('twitter:description', meta.description)
    og$('og:title', meta.title)
    og$('og:description', meta.description)
    og$('og:url', meta.canonical)
    setTag('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    }, meta.canonical)

    // One script holds whatever structured data the current route carries, so the
    // previous route's Breadcrumb/SoftwareSourceCode never lingers.
    let ld = document.getElementById('ld-route')
    if (!ld) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.id = 'ld-route'
      document.head.appendChild(ld)
    }
    ld.textContent = ldJson(meta)
  }, [meta])
}

const SECTION_IDS = ['home', 'about', 'experience', 'projects']

// '#experience' is a section of the one long page; '#experience/galaxy-controls'
// is a standalone detail view.
function pathFor(section, id) {
  if (id) return '/' + section + '/' + id
  return section === 'home' ? '/' : '/' + section
}

const HOME_ROUTE = { detail: null, id: null, section: 'home', notFound: false }
const NOT_FOUND_ROUTE = { detail: null, id: null, section: 'home', notFound: true }

// '/experience' is a section of the one long page; '/experience/galaxy-controls'
// is a standalone detail view. Every route below is prerendered to its own file at
// build time, so a deep link loads directly and anything else is a real 404 instead
// of a silent fall-through to the home page.
export function routeForPath(pathname) {
  const [a, b] = pathname.replace(/^\/+|\/+$/g, '').split('/')
  if (b) {
    if (a !== 'experience' && a !== 'projects') return NOT_FOUND_ROUTE
    const known = a === 'experience'
      ? EXPERIENCE.some((e) => e.id === b)
      : ALL_PROJECTS.some((p) => p.id === b)
    return known ? { detail: a, id: b, section: a, notFound: false } : NOT_FOUND_ROUTE
  }
  if (!a) return HOME_ROUTE
  return SECTION_IDS.includes(a)
    ? { detail: null, id: null, section: a, notFound: false }
    : NOT_FOUND_ROUTE
}

// The prerender pass runs this module under Node, where there is no window; it hands
// App its route explicitly instead, so this only ever answers on the client.
function parseRoute() {
  if (typeof window === 'undefined') return HOME_ROUTE
  return routeForPath(window.location.pathname)
}

// Internal links are real anchors, so crawlers can follow them and middle-click and
// "open in new tab" work. A plain left click stays inside the SPA; anything the
// browser has its own meaning for is left alone.
function interceptClick(go) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go()
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  try { history.replaceState(null, '', pathFor(id)) } catch { /* no-op */ }
}

// Which section owns the top of the viewport, for the nav underline.
function useScrollSpy(enabled) {
  const [active, setActive] = useState('home')
  useEffect(() => {
    if (!enabled) return undefined
    const check = () => {
      let current = SECTION_IDS[0]
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      })
      setActive(current)
    }
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [enabled])
  return active
}

// ─── Page transition wrapper ────────────────────────────────────────────

function Page({ pageKey, children }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 30)
    return () => clearTimeout(t)
  }, [pageKey])
  // A class, not an inline style: the reduced-motion, print and no-JS override blocks
  // in index.css all need to be able to force this visible, and !important cannot
  // reach an inline style set from JS.
  return <div className={'page-fade' + (on ? ' on' : '')}>{children}</div>
}

// ─── Nav ─────────────────────────────────────────────────────────────────

function Nav({ page, onNavigate }) {
  const links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
  ]
  return (
    <nav className="site-nav no-print">
      <div className="nav-inner">
        <a className="nav-brand" href="/" onClick={interceptClick(() => onNavigate('home'))}>
          Austin <span style={{ color: 'var(--accent)' }}>Zhai</span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a
              key={l.id}
              className={'nav-link' + (page === l.id ? ' active' : '')}
              href={pathFor(l.id)}
              aria-current={page === l.id ? 'page' : undefined}
              onClick={interceptClick(() => onNavigate(l.id))}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Small shared pieces ─────────────────────────────────────────────────

// Thin reading-progress line: the main cue that this is one continuous page.
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const check = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])
  return (
    <div className="scroll-progress no-print" aria-hidden="true">
      <div style={{ width: pct + '%' }} />
    </div>
  )
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="reveal section-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="page-title">{title}</h2>
    </div>
  )
}

function Eyebrow({ children, style }) {
  return <p className="eyebrow" style={style}>{children}</p>
}

function Chip({ label }) {
  return <span className="chip">{label}</span>
}

// Inline media for a read-through section: stills print, video is screen-only.
function Media({ items }) {
  if (!items || items.length === 0) return null
  // Side-by-side items get equal heights so their captions line up. Skipped when an
  // item claims its own row, since a lone stretched frame has no height to stretch to.
  const paired = items.filter((m) => !m.full).length > 1
  return (
    <div className={'media-row' + (paired ? ' even' : '')}>
      {items.map((m) => (
        <figure key={m.src}
          className={'media-frame' + (m.full ? ' full' : '') + (m.type === 'video' ? ' no-print' : '')}
          style={m.maxWidth ? { maxWidth: `${m.maxWidth}px` } : undefined}>
          {m.type === 'video' ? (
            // portrait phone clips need their real ratio, not the 16/9 CSS default
            <video src={m.src} poster={m.poster} controls muted loop playsInline
              style={m.w && m.h ? { aspectRatio: `${m.w} / ${m.h}` } : undefined}
              preload={m.preload || 'metadata'} aria-label={m.alt} />
          ) : (
            // width/height reserve the aspect ratio so a card full of media doesn't
            // jump around as the images arrive
            <img src={m.src} alt={m.alt} loading="lazy" width={m.w} height={m.h} />
          )}
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

// Label / expression / result rows — used for the flight-time budget and the model scores.
function StatBlock({ stat }) {
  if (!stat) return null
  return (
    <div className="stat-block">
      {stat.rows.map((r) => (
        <div key={r.label} className="stat-row">
          <span className="stat-label">{r.label}</span>
          <span className="stat-expr">{r.expr}</span>
          <span className="stat-result">{r.result}</span>
        </div>
      ))}
      {stat.note && <p className="stat-note">{stat.note}</p>}
    </div>
  )
}

// A titled section inside an expanded card, with its own media directly beneath it.
function PartCard({ part }) {
  return (
    <div className="part-card">
      <div className="part-tag">{part.tag}</div>
      <div className="part-body">{part.body}</div>
      {part.points && part.points.length > 0 && (
        <ul className="point-list">
          {part.points.map((pt) => (
            <li key={pt}><span className="fact-arrow">→</span>{pt}</li>
          ))}
        </ul>
      )}
      {part.chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {part.chips.map((c) => <Chip key={c} label={c} />)}
        </div>
      )}
      <StatBlock stat={part.stat} />
      <Media items={part.media} />
    </div>
  )
}

// Long detail reads (AUAV, Smart Alarm) need an exit that doesn't require
// scrolling back to the top.
function FloatingBack({ label, href, onClick }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const check = () => setShow(window.scrollY > 420)
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
    }
  }, [])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClick() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClick])
  return (
    <a
      className={'float-back no-print' + (show ? ' show' : '')}
      href={href}
      onClick={interceptClick(onClick)}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <IconArrowLeft size={13} /> {label}
    </a>
  )
}

function BackLink({ label, href, onClick }) {
  return (
    <a className="back-link no-print" href={href} onClick={interceptClick(onClick)}>
      <IconArrowLeft size={13} /> {label}
    </a>
  )
}

function HomeLink({ label, href, onClick }) {
  return (
    <a className="home-link" href={href} onClick={interceptClick(onClick)}>
      <span className="home-link-label">{label}</span>
      <span className="home-link-arrow"><IconArrowRight size={14} /></span>
    </a>
  )
}

// Home / Experience / Advanced UAV Tech. Real anchors, and mirrored as BreadcrumbList
// JSON-LD by metaFor() so search results show the same trail.
function Breadcrumb({ trail, onGo }) {
  return (
    <nav className="breadcrumb no-print" aria-label="Breadcrumb">
      {trail.map((c, i) => (
        <span key={c.path}>
          {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">/</span>}
          {i === trail.length - 1
            ? <span aria-current="page">{c.name}</span>
            : <a href={c.path} onClick={interceptClick(() => onGo(c.section))}>{c.name}</a>}
        </span>
      ))}
    </nav>
  )
}

function SectionRule({ label }) {
  return (
    <div className="section-rule reveal">
      <div className="rule-line" />
      <span>{label}</span>
      <div className="rule-line" />
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer no-print">
      <span>Austin Zhai</span>
      <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
        <a href="mailto:austinhzhai@gmail.com" aria-label="Email"><IconMail /></a>
        <a href="https://www.linkedin.com/in/austin-zhai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn /></a>
        <a href="https://github.com/AustinZhai8" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><IconGithub /></a>
      </div>
    </footer>
  )
}

// ─── Home ────────────────────────────────────────────────────────────────

function HomeSection({ onNavigate }) {
  return (
    <section id="home" className="hero-screen">
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
        <img src="/Headshot.JPG" alt="Austin Zhai" className="headshot"
          width="2501" height="2784" fetchPriority="high" />
        <div>
          <h1 className="hero-title">Hi, I&apos;m <span style={{ color: 'var(--accent)' }}>Austin</span>.</h1>
          <p className="hero-sub">Computer Engineering student at UBC.</p>
        </div>
        <a href="https://www.linkedin.com/in/austin-zhai/" target="_blank" rel="noopener noreferrer" className="btn-primary">Let&apos;s connect</a>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          <a href="mailto:austinhzhai@gmail.com" className="btn-social"><IconMail /> austinhzhai@gmail.com</a>
          <a href="https://www.linkedin.com/in/austin-zhai/" target="_blank" rel="noopener noreferrer" className="btn-social"><IconLinkedIn /> LinkedIn</a>
          <a href="https://github.com/AustinZhai8" target="_blank" rel="noopener noreferrer" className="btn-social"><IconGithub /> GitHub</a>
        </div>
        <div className="home-links">
          <HomeLink label="About me" href="/about" onClick={() => onNavigate('about')} />
          <HomeLink label="Experience" href="/experience" onClick={() => onNavigate('experience')} />
          <HomeLink label="Projects" href="/projects" onClick={() => onNavigate('projects')} />
        </div>
      </div>
      <div className="scroll-cue no-print" aria-hidden="true">
        <span className="scroll-cue-label">Scroll</span>
        <span className="scroll-cue-track"><span className="scroll-cue-dot" /></span>
      </div>
    </section>
  )
}

// ─── About ───────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="page-shell">
      <SectionHeading eyebrow="Who I am" title="About" />

      <div className="reveal" style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
        <p className="bio-line">
          UBC Computer Engineering student who spends way too much time on business student activities.
          Somewhere along the way that turned into a genuine interest in where hardware meets software.
        </p>
      </div>

      {/* Investing */}
      <SectionRule label="Investing" />
      <div className="reveal" style={{ paddingTop: '1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <Eyebrow>Where it all started</Eyebrow>
          <h3 className="section-title">Investing is the thread that ties everything together.</h3>
          <p className="body-text" style={{ marginBottom: '1.1rem' }}>
            I spend a lot of time on fundamentals research: tracking key metrics, waiting on earnings,
            pulling apart business models, and building conviction one company at a time.
            Every position I hold is a thesis I can defend.
          </p>
          <p className="body-text">
            That passion is what pulled me toward Computer Engineering. The goal is simple:
            work for a company I believe in enough to own, and build the products from the inside.
          </p>
        </div>
        <div className="invest-grid">
          <div className="img-card"><img src="/wealthsimple-private.png" alt="Wealthsimple weekly portfolio performance with financial amounts obscured" loading="lazy" /></div>
          <div className="img-card"><img src="/blossom.png" alt="Blossom portfolio" loading="lazy" /></div>
        </div>
        <p className="body-text" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px' }}>
          Here&apos;s my <a href="https://link.blossomsocial.com/7uYa/kos58964" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>Blossom</a> if
          you have it and want to connect.
        </p>
      </div>

      {/* Hobbies */}
      <div className="reveal" style={{ paddingTop: '3.5rem' }}>
        <Eyebrow style={{ textAlign: 'center', marginBottom: '1.6rem' }}>Hobbies</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {['Basketball', 'Gym', 'Piano', 'Video Games'].map((h) => (
            <span key={h} className="hobby-pill">{h}</span>
          ))}
        </div>
      </div>

      {/* Quick facts */}
      <div className="reveal" style={{ paddingTop: '3rem' }}>
        <Eyebrow style={{ textAlign: 'center', marginBottom: '1.6rem' }}>Quick Facts</Eyebrow>
        <div className="facts-card">
          {[
            '3.5 languages: English, French, Chinese, and a little Spanish',
            'NewJeans and The Kid LAROI are fire',
            'Lanzhou hand-pulled noodles are my all-time favorite dish',
            'Mavericks and Patriots fan (and the number one fantasy football manager out there)',
            'Top 0.7% performing TFSA',
          ].map((fact, i, arr) => (
            <div key={fact} className="fact-row" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="fact-arrow">→</span>
              <p>{fact}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}

// ─── Experience ──────────────────────────────────────────────────────────

export const EXPERIENCE = [
  {
    id: 'advanced-uav-tech',
    logo: '/logos/auav.png',
    company: 'Advanced UAV Tech',
    role: 'Electronics Engineering Intern',
    dates: 'June 2026 to August 2026',
    tag: 'Hardware Engineering',
    blurb: 'Designed a flight controller from scratch for the company’s move into recreational drones, and led a 5-person team building a DHL warehouse inspection drone.',
    description: "Two things came out of this internship. I designed a flight controller board from scratch, aimed at the company's move into recreational drones, and that is the first thing below. The rest of the summer went on a drone that checks warehouse pallets for damage at DHL sites, where I led a team of 5. A pilot flies it down an aisle filming the shelves, and software the team trained reads that footage back and marks which pallets are damaged. My side of that was the electronics: I sized and built the power system, wired the whole stack onto a 20 inch carbon fiber frame, tuned it until it could hold still indoors where there is no GPS to lock onto, and designed and printed landing legs when nothing off the shelf fit our motors. I also ran the project day to day and was the point of contact at DHL.",
    links: [{ href: 'https://github.com/zacharyL16/DroneScan', label: 'DroneScan, the team repo' }],
    parts: [
      {
        tag: 'Start here · Designing a flight controller from scratch',
        body: "This is the piece of work I am proudest of. The company has always been a contract shop, and leadership wanted a second line of business that did not depend on winning contracts: recreational drones, sold off a shelf.",
        points: [
          'On a product made by the thousand, every dollar in the parts bill multiplies, and the flight controller is one of the priciest parts in a small drone',
          'A board you buy is built to suit everybody: video transmitters, GPS, extra sensors. A weekend hobby pilot pays for almost none of it',
          'Mine carries only what the job needs: a processor, one motion sensor, a regulator, a USB port, and connections for the motors, receiver and battery',
          'Fewer parts means a smaller, cheaper board, and owning the design means the company is not tied to a supplier’s stock or roadmap',
          'Runs off USB at a desk or off the battery in the air, with a pair of diodes so the two supplies can never push current into each other',
          'The reference design used a motion sensor that has since been discontinued, so I moved to a current part that is also cheaper and smaller',
        ],
        chips: ['Altium Designer', 'STM32F405', 'ICM-20602', '4-Layer Stackup', 'USB-C'],
        media: [
          {
            src: '/projects/auav-fc-schematic.png', w: 1702, h: 1334, full: true,
            alt: 'Flight controller schematic divided into power, microcontroller, motion sensor, LED and startup blocks',
            caption: 'The schematic, drawn in blocks so each piece can be read on its own: power coming in, the processor, the motion sensor, and the small stuff around them.',
          },
          {
            src: '/projects/auav-fc-pcb.png', w: 1176, h: 1176,
            alt: 'Four-layer flight controller layout with the processor centred and traces fanning out to the edge pads',
            caption: 'The layout. Processor in the middle, everything it talks to kept close, and the connection pads pushed out to the edges where the wires land.',
          },
          {
            src: '/projects/auav-fc-3d.png', w: 1166, h: 1160,
            alt: '3D render of the finished flight controller board with USB-C connector and status LEDs',
            caption: 'The 3D view, which is the last honest look at whether anything collides before the files go anywhere.',
          },
        ],
      },
      {
        tag: 'Where that board actually stands',
        body: "It is not built. The design finished at the end of my internship, so right now it is a schematic and a board layout, with the full-time electrical engineers reviewing it. I expect that review to find things: it was the most complex board I had drawn, and some faults only show up on real hardware.",
        points: [
          'Next: engineering review and corrections, then a small prototype run',
          'Then bench testing, because a board that looks right and a board that flies are not the same claim',
          'Then firmware, its own job: a blank processor does nothing until every pin is mapped to the motor, sensor or radio it connects to',
          'What it already settled: what a stripped-down in-house board looks like, and what it costs against buying one in',
        ],
        chips: [],
        media: [],
      },
      {
        tag: 'The problem',
        body: "Everything from here down is the project I spent most of the summer on. Warehouses check pallets for damage by eye, one at a time, and a large DHL site holds thousands of them. We wanted to fly an aisle once and let software do the looking. I ran the meetings with DHL, so what they needed came back to the team through me.",
        points: [
          'Damage gets spotted by whoever happens to walk past it',
          'Pallets are stacked well above head height, so the top rows are the hardest to check',
          'A drone can film a whole aisle, top shelf included, in a single pass',
        ],
        chips: [],
        media: [
          {
            src: '/projects/auav-warehouse.jpg', w: 1300, h: 1154,
            alt: 'A convex safety mirror reflecting a DHL warehouse aisle lined with racking and pallets',
            caption: 'The floor we designed around: racking down one side, loading docks down the other, and a lot of pallets to check by hand.',
          },
        ],
      },
      {
        tag: 'Prototype',
        body: 'We started with a drone the company already owned, one of its light-show quads. It was never going to be the final build. It was there to answer a single question.',
        points: [
          'The question: how does a drone hold still indoors, where there is no GPS to lock onto?',
          'The answer: an optical flow sensor, a small downward camera and laser rangefinder that watches the floor slide past and works out how far the drone has drifted',
          'Once it was fitted and tuned the drifting stopped, and everything after this was designed around it',
        ],
        chips: ['DJI F450', 'Pixhawk 2.4.8', 'MTF-01 Optical Flow'],
        media: [
          {
            src: '/projects/auav-prototype.jpg', w: 1300, h: 1143,
            alt: 'The prototype quadcopter on a desk with its flight controller mounted on top',
            caption: 'The prototype: a light-show drone stripped back and rebuilt around a new flight controller, with the optical flow sensor tucked underneath.',
          },
          {
            type: 'video', preload: 'none', full: true, maxWidth: 340, w: 720, h: 1280,
            src: '/projects/auav-prototype-flight.mp4',
            poster: '/projects/auav-prototype-poster.jpg',
            alt: 'The F450 prototype hovering during flight testing',
            caption: 'The prototype holding a hover indoors, which is what told us the optical flow approach would work.',
          },
        ],
      },
      {
        tag: 'Power system',
        body: 'How long the drone stays up decides how much of a warehouse you can cover in one go, and that comes down to the battery. So I worked the flight time out on paper before we bought anything, rather than picking a battery and hoping.',
        points: [
          'One battery feeds all four motors, the flight controller and the camera',
          'Everything runs through a board I wired up that splits that single supply out to each of them',
          'Roughly 40 soldered connections across the whole drone, every cable cut to length and heat-shrunk',
        ],
        chips: ['4S LiPo', 'ESCs', 'XT60', 'Soldering'],
        stat: {
          rows: [
            { label: 'Usable charge', expr: 'battery capacity, minus the fifth you never drain', result: '1.76 Ah' },
            { label: 'Weight', expr: 'frame, motors, props, battery, camera and wiring', result: '≈1.34 kg' },
            { label: 'Draw in a hover', expr: 'roughly 10 A per kilogram of drone', result: '≈13.4 A' },
            { label: 'Flight time', expr: 'charge ÷ draw, in minutes', result: '≈7.9 min' },
          ],
          note: 'An estimate, not a measurement. The drone was never put on a scale and never flown down to empty, so treat it as the ballpark it is. The last fifth of the battery is off limits because draining a pack that far damages it.',
        },
        media: [
          {
            src: '/projects/auav-power.jpg', w: 1300, h: 1464,
            alt: 'Top-down view of the drone showing the power distribution board and the four motor controllers on the arms',
            caption: 'Top-down on the power board: one motor controller zip-tied to each arm, battery lead into the middle, optical flow sensor at the nose.',
          },
          {
            src: '/projects/auav-wiring.jpg', w: 1300, h: 1300,
            alt: 'The drone mid-rebuild on a workbench with helping hands and custom heat-shrunk cables',
            caption: 'Mid-rebuild on the bench, with every cable cut to length and heat-shrunk.',
          },
        ],
      },
      {
        tag: 'Final airframe',
        body: 'The prototype could not carry everything we needed, so we moved onto a bigger 20 inch carbon fiber frame. I assembled and wired this one myself, and designed the parts that did not exist off the shelf.',
        points: [
          'A better flight controller than the prototype had, with the optical flow sensor mounted underneath',
          'No landing leg on the market fitted our combination of motors and frame, so I modelled our own around the real parts and printed them',
          'They are hollowed out in a hex pattern to save weight without going floppy, and they are the legs holding the drone up in the photos below',
          'Then tuned until it held still indoors',
        ],
        chips: ['Carbon Fiber Frame', 'Pixhawk V6X', 'Onshape', '3D Printing'],
        media: [
          {
            src: '/projects/auav-cad-leg.png', w: 1300, h: 583, full: true,
            alt: 'CAD model of the custom landing leg, showing the motor mounting flange and hex cutouts',
            caption: 'The landing leg in CAD, modelled around the real motors and frame rather than a guess at them.',
          },
          {
            src: '/projects/auav-final.jpg', w: 1300, h: 1040,
            alt: 'The finished carbon fiber quadcopter on a desk with its flight controller and GPS mounted',
            caption: 'The finished airframe, standing on the printed legs.',
          },
          {
            src: '/projects/auav-flight.jpg', w: 1300, h: 1300,
            alt: 'The finished drone hovering above a rooftop against an overcast sky',
            caption: 'Hover testing off the roof, on the same tune it flew indoors.',
          },
        ],
      },
      {
        tag: 'Flying it',
        body: 'A pilot flew the drone down the aisle and filmed the racking. That sounds like the easy part, but it was the part everything downstream depended on.',
        points: [
          'If the drone drifts or wobbles, the video blurs',
          'A blurred frame is a pallet the software cannot read',
        ],
        chips: ['PID Tuning'],
        media: [
          {
            type: 'video', preload: 'none', maxWidth: 340, w: 720, h: 1280,
            src: '/projects/auav-final-flight.mp4',
            poster: '/projects/auav-final-flight-poster.jpg',
            alt: 'The finished drone flying during a test',
            caption: 'The final build in flight.',
          },
        ],
      },
      {
        tag: 'Getting the footage off the drone',
        body: 'The footage came off the drone live. It carried a tiny camera and transmitter, and the picture arrived on a laptop while the drone was still in the air.',
        points: [
          'Camera and transmitter in one part, 4.7 g and about the size of a thumbnail',
          'It beams to a receiver plugged into a laptop, which records the feed',
          'That recording is what gets fed through the software afterwards',
        ],
        chips: ['FPV', 'OBS', 'Video Capture'],
        media: [
          {
            type: 'video', preload: 'none', maxWidth: 340, w: 720, h: 1280,
            src: '/projects/auav-fpv-feed.mp4',
            poster: '/projects/auav-fpv-feed-poster.jpg',
            alt: 'The drone being flown while its camera feed arrives live in OBS on a laptop',
            caption: 'The drone in the air, with its camera feed coming through live in OBS on the laptop.',
          },
        ],
      },
      {
        tag: 'Teaching it to recognise a damaged pallet',
        body: 'Before software can spot damage, someone has to show it thousands of examples. We labelled every training photo by hand, drawing a shape around each pallet and tagging it twice: damaged or not, and stacked flat or in a pyramid.',
        points: [
          'Both tags sit on the same pallet, which would have the model draw two boxes around every one it finds',
          'So we trained it on the damage tags alone, and saved the stacking question for a later step',
        ],
        chips: ['Roboflow'],
        media: [
          {
            src: '/projects/auav-detection.png', w: 398, h: 399, maxWidth: 398,
            alt: 'Detector output on a warehouse photo, with boxes labelled damaged and undamaged',
            caption: 'Output on a test photo: one box per pallet, each with its verdict and how confident the model is.',
          },
        ],
      },
      {
        tag: 'Training the models',
        body: 'Three models chained together. The first finds the pallets, and the other two look at each pallet it found: one says whether it is damaged, the other whether it is stacked flat or in a pyramid.',
        points: [
          'Damaged pallets are rare in the training photos, so the damage model is deliberately tuned to over-report',
          'Missing a broken pallet costs a lot more than sending someone to double-check a good one',
        ],
        chips: ['YOLO11', 'Ultralytics', 'Jupyter'],
        stat: {
          rows: [
            { label: 'Finding pallets', expr: 'score on photos it had never seen', result: '0.88' },
            { label: 'Flat or pyramid', expr: 'how often it got the stacking right', result: '0.86' },
            { label: 'Damaged or not', expr: 'overall / damaged ones caught', result: '0.82 / 0.80' },
          ],
        },
        media: [
          {
            src: '/projects/auav-training.png', w: 1032, h: 442,
            alt: 'Notebook cell training the pallet detector, with its score printed after each pass',
            caption: 'Training the pallet detector, with its score climbing pass over pass.',
          },
          {
            src: '/projects/auav-ml-results.png', w: 576, h: 542,
            alt: 'Confusion matrix for the orientation classifier, showing 55 of 64 test crops correct',
            caption: 'Marking the stacking model against photos it had never seen: 55 of 64 correct, 85.9%.',
          },
        ],
      },
      {
        tag: 'DroneScan, the app clients actually use',
        body: 'None of it is worth much if a warehouse manager cannot run it, so the team wrapped the whole pipeline in an app called DroneScan. You hand it the footage from a flight and it hands back a report.',
        points: [
          'Drop in photos or a whole video, and it pulls the frames out for you',
          'Every pallet comes back outlined, marked damaged or clear, with a confidence score',
          'Filter a long list down to just the damaged ones',
        ],
        chips: ['React', 'FastAPI', 'Python', 'Docker'],
        media: [
          {
            src: '/projects/auav-app.png', w: 1231, h: 625,
            alt: 'The DroneScan web app showing an upload queue with annotated inspection results',
            caption: 'The inspection queue: batch upload, a verdict per file, and annotated results you can open full screen.',
          },
        ],
      },
    ],
  },
  {
    id: 'galaxy-controls',
    logo: '/logos/galaxy.png',
    company: 'Galaxy Instrumentation and Controls Inc',
    role: 'Automation and Controls Engineering Intern',
    dates: 'May 2026 to June 2026',
    tag: 'Automation & Controls',
    blurb: 'Verified the health of CHEP’s plant control systems at roughly 25 sites a week, ahead of a worldwide software upgrade, and wrote a Python script that automated the repetitive setup around those checks, cutting the time each site took by about 20%.',
    description: "This was my first real look inside industrial automation: the controllers, monitoring software and operator terminals that keep a factory floor running. CHEP was rolling out upgraded factory software across its plants worldwide, and my job was to check each site was healthy before the upgrade touched it, at roughly 25 sites a week.",
    parts: [
      {
        tag: 'What checking a site looked like',
        body: 'At each site I connected in and worked down the stack, from the network up to the software watching the floor.',
        points: [
          'Confirmed the seven or so controllers on the plant network were reachable and answering',
          'Recorded how each operator terminal was configured',
          'Cross-checked the same equipment in the monitoring software, to tell a dead network link apart from a program that had quietly stopped responding',
          'Confirmed the automated pallet inspection rigs were still reporting in on time',
        ],
        chips: ['RSLinx Classic', 'AVEVA SCADA', 'ThinManager', 'Radmin', 'SQL Server'],
        media: [],
      },
      {
        tag: 'Automating the boring part',
        body: 'The checks themselves came off a runbook the team built together. The setup around them, though, was the same repetitive steps every time, so I scripted it.',
        points: [
          'Opened remote sessions, navigated to the right files, and filled in the repeated inputs automatically',
          'Cut about 20% off the time each site needed',
          'Wired into the company’s automation tool so anyone on the team could run it',
        ],
        chips: ['Python', 'Power Automate'],
        media: [],
      },
      {
        tag: 'What I took from it',
        body: 'Learning to read a controls stack top to bottom, and to tell which layer a fault actually lives in.',
        points: [
          'I reported findings up the chain: fixing them was someone else’s job, which is normal for an intern and worth saying plainly',
        ],
        chips: [],
        media: [],
      },
    ],
  },
  {
    id: 'telus-digital',
    logo: '/logos/telus.png',
    company: 'TELUS Digital',
    role: 'Bilingual Data Analyst',
    dates: 'March 2026 to June 2026',
    tag: 'Data & AI',
    blurb: 'Rated the map results an AI system returns, in both English and French, working through 80+ searches a week so its mistakes could be found and corrected.',
    description: "I rated the map results an AI system produced, in English and French, so the places it got wrong could be fed back and fixed.",
    parts: [
      {
        tag: 'What rating one result means',
        body: 'Every search gets checked against reality, not just against the tool itself.',
        points: [
          '80+ searches judged a week',
          'Is this the place the search actually meant?',
          'Do the name, category and address match reality?',
          'Does the pin sit on the right building?',
          'Verifying that means leaving the tool: checking the business’s own site and the postal listing',
          'Both languages is where I added the most: a French listing that looks fine to an English reviewer often is not',
        ],
        chips: ['French', 'English', 'TryRating'],
        media: [],
      },
    ],
  },
  {
    id: 'hydroficient',
    logo: '/logos/hydroficient.png',
    company: 'Hydroficient',
    role: 'IoT Cyber Defense Extern',
    dates: 'April 2026 to June 2026',
    tag: 'Cybersecurity',
    blurb: 'Built five layers of defense around a hotel’s water sensors, attacked the system myself to prove they held, and flagged bad readings with a trained model.',
    description: "This was an eight-project curriculum that ran like a real engagement: secure the water monitoring system of a hotel that only exists on paper.",
    parts: [
      {
        tag: 'The setup',
        body: 'The sensors report over the network, and left alone that traffic is wide open.',
        points: [
          'Anyone nearby can read it',
          'Anyone can pretend to be a sensor',
          'Anyone can record a genuine message and send it again later',
        ],
        chips: [],
        media: [],
      },
      {
        tag: 'Five layers of defense',
        body: 'I built a layer against each way in, then wrote the attacks myself and ran them at the system to confirm every layer actually held.',
        points: [
          'Encrypted all the traffic',
          'Issued every device its own certificate, so the system only listens to sensors it knows',
          'Stamped each message with a timestamp',
          'And a running counter',
          'And a signature, so a copied or altered message gets thrown out',
        ],
        chips: ['Python', 'Mosquitto MQTT', 'TLS', 'mTLS', 'HMAC-SHA256'],
        media: [],
      },
      {
        tag: 'Catching a sensor that’s lying',
        body: 'A faulty sensor can still send perfectly valid, signed messages, so the layers above cannot catch it.',
        points: [
          'Trained a model on live readings to flag ones that look out of character',
          'Picked a model type that can score each message as it arrives, not one that needs the whole batch first',
          'Alerts route to a live dashboard someone can watch without touching a terminal',
        ],
        chips: ['Isolation Forest', 'WebSocket'],
        media: [],
      },
    ],
  },
  {
    id: 'ubc-sailbot',
    logo: '/logos/sailbot.png',
    company: 'UBC Sailbot',
    role: 'Operations Team Member',
    dates: 'September 2025 to April 2026',
    tag: 'Business Operations',
    blurb: 'Ran operations for a student team building a fully autonomous sailing robot.',
    description: "UBC Sailbot builds a sailboat that crosses open water on its own: no remote control, no crew. I worked on the operations side, keeping the electrical, mechanical and software subteams in step with each other. I ran timelines, kept the documentation the teams needed to hand work between them, and owned the outward-facing side: sponsor packages, website content and video. A social campaign I planned end to end grew average engagement by around 80%, which matters when 18 active sponsors are deciding whether to stay.",
  },
  {
    id: 'haircutting',
    company: 'Independent Haircutting Business',
    role: 'Founder & Operator',
    dates: 'August 2024 to December 2025',
    tag: 'Entrepreneurship',
    blurb: 'Turned a hobby into a real business: 50+ clients, 350+ appointments, $7,000+ in revenue.',
    description: "This started as a hobby, but once I noticed how many friends were walking around with bad haircuts, the demand clicked and I turned it into a real business. I handled everything: client acquisition, pricing, scheduling, payments, and follow-up. An Excel-based booking and client system pushed retention to ~85% and let referrals run on autopilot. By the time I wrapped up to focus on school, I had served 50+ clients across 350+ appointments and generated over $7,000 in revenue. The biggest lesson: the scariest part of starting something is just starting.",
  },
]

function LogoTile({ src, size }) {
  // no logo on file: render nothing and let that card sit a little differently
  if (!src) return null
  return (
    <span className={'logo-tile' + (size ? ' ' + size : '')}>
      <img src={src} alt="" loading="lazy" />
    </span>
  )
}

function ExperienceSection({ onOpen }) {
  return (
    <section id="experience" className="section-pad">
      <div className="page-shell">
        <SectionHeading eyebrow="Where I&apos;ve been" title="Experience" />
        <div className="card-grid experience-grid reveal">
          {EXPERIENCE.slice(0, 4).map((exp) => (
            <a key={exp.id} className={'grid-card' + (exp.id === 'advanced-uav-tech' ? ' experience-featured' : '')} href={pathFor('experience', exp.id)}
              onClick={interceptClick(() => onOpen(exp.id))}>
              <span className="grid-card-brand">
                <LogoTile src={exp.logo} />
                <span className="exp-dates">{exp.dates}</span>
              </span>
              <span className="grid-card-title">{exp.company}</span>
              <span className="grid-card-role">{exp.role}</span>
              <span className="exp-tag">{exp.tag}</span>
              <span className="grid-card-blurb">{exp.blurb}</span>
              {exp.id === 'advanced-uav-tech' && (
                <span className="experience-feature-image no-print">
                  <img src="/projects/auav-flight.jpg" alt="The warehouse inspection drone hover testing above a rooftop" loading="lazy" />
                  <span>Prototype to rooftop flight test</span>
                </span>
              )}
              <span className="grid-card-more">{exp.id === 'advanced-uav-tech' ? 'Follow the build' : 'View experience'} <IconArrowRight size={12} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceDetail({ exp, trail, onBack, onGo }) {
  return (
    <div className="page-pad">
      <div className="page-shell">
        <BackLink label="All experience" href="/experience" onClick={onBack} />
        <Breadcrumb trail={trail} onGo={onGo} />
        <div className="detail-head">
          <div className="detail-brand">
            <LogoTile src={exp.logo} size="lg" />
            <div>
              <h1 className="page-title">{exp.company}</h1>
              <p className="detail-role">{exp.role}</p>
            </div>
          </div>
          <div className="detail-meta">
            <span className="exp-tag">{exp.tag}</span>
            <span className="exp-dates">{exp.dates}</span>
          </div>
        </div>
        <p className="exp-body detail-lead">{exp.description}</p>

        {exp.parts && exp.parts.length > 0 && (
          <div className="detail-parts">
            {exp.parts.map((part) => <PartCard key={part.tag} part={part} />)}
          </div>
        )}

        {exp.links && exp.links.length > 0 && (
          <>
            <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1.6rem' }}>
              {exp.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pill-ghost">
                  <IconGithub size={12} /> {l.label}
                </a>
              ))}
            </div>
            <div className="print-links print-only">
              {exp.links.map((l) => <div key={l.href}>{l.label}: {l.href}</div>)}
            </div>
          </>
        )}
      </div>
      <FloatingBack label="All experience" href="/experience" onClick={onBack} />
      <Footer />
    </div>
  )
}

// ─── Projects data ───────────────────────────────────────────────────────

export const MAIN_PROJECTS = [
  {
    id: 'smart-alarm',
    title: 'Smart Alarm',
    year: '2026',
    category: 'Hardware',
    summary: 'A bedside alarm clock that tracks your sleep with a motion sensor on the mattress and wakes you during light sleep instead of at a fixed time. I built all of it: the code, the sleep model, and the circuit board it runs on.',
    detail: 'Everything runs on the clock itself. No phone, no cloud, no app.',
    thumb: '/projects/smart-alarm-thumb.jpg',
    parts: [
      {
        tag: 'Part 1 · Firmware and interface',
        body: 'Ten screens, one knob, one button: the alarm, the smart alarm, your sleep data, the weather and the settings.',
        points: [
          'Sets its own time from the internet and pulls a five-day forecast',
          'Redraws only the digits that changed, so the screen never flickers',
          'Alarm and snooze settings survive being unplugged, so the clock wakes up exactly as you left it',
        ],
        chips: ['ESP32', 'Arduino', 'TFT_eSPI', 'SPI', 'I2C', 'EEPROM'],
        media: [
          {
            src: '/projects/smart-alarm-main.jpg',
            alt: 'Finished Smart Alarm PCB showing time, date, weather and alarm status',
            caption: 'The finished board. Home screen: the time, the date, live weather and the alarm status, all flicker-free.',
          },
          {
            type: 'video',
            src: '/projects/smart-alarm-demo.mp4',
            poster: '/projects/smart-alarm-demo-poster.jpg', w: 1280, h: 720,
            alt: 'Walkthrough of the menu system, sleep data screen, and entering sleep mode',
            caption: 'Paging the menus, opening Sleep Data, and dropping into sleep mode, all on one encoder and one button.',
          },
        ],
      },
      {
        tag: 'Part 2 · Sleep tracking and on-device ML',
        body: 'A motion sensor sits on the mattress next to the pillow and records how much you move, twice a second, onto a memory card.',
        points: [
          'Every 30 seconds: half a minute of movement boiled down to 21 numbers, scored as light or deep sleep',
          'The verdict is saved as it goes, so the chart survives overnight even if the power drops',
          'Trained on eight nights I labelled by hand, roughly 420,000 readings',
          'Converted to run on the clock itself, no phone, no server',
        ],
        stat: {
          rows: [
            { label: 'Overall accuracy', expr: 'right call across every window', result: '65%' },
            { label: 'Light sleep caught', expr: 'of the windows that were actually light', result: '76%' },
            { label: 'Deep sleep caught', expr: 'of the windows that were actually deep', result: '19%' },
            { label: 'Baseline', expr: 'accuracy from just always guessing light', result: '81%' },
          ],
          note: 'Below the baseline, and worth saying plainly: mattress movement alone barely separates light sleep from deep.',
        },
        chips: ['Python', 'scikit-learn', 'micromlgen', 'MPU-6050', 'SD / CSV'],
        media: [
          {
            src: '/projects/smart-alarm-sleep-data.jpg',
            alt: 'Sleep Data screen showing a night charted as light and deep sleep, with totals underneath',
            caption: 'The Sleep Data screen: how long you slept, the night charted out, and the light and deep totals, read back off the memory card.',
          },
        ],
      },
      {
        tag: 'Part 3 · Schematic and PCB',
        body: 'The first version lived on two breadboards with the display taped to the front. Once I stopped moving wires around, I redrew the whole thing as a real circuit board and had it manufactured.',
        points: [
          'Every part breaks out to a labelled socket, so any one of them can still be swapped',
          'Same code, considerably less wire',
        ],
        chips: ['Altium Designer', 'Schematic Capture', 'PCB Layout'],
        media: [
          {
            src: '/projects/smart-alarm-breadboard.jpg',
            alt: 'The original two-breadboard prototype running the same firmware',
            caption: 'Where it started. Same firmware, same home screen, considerably more wire.',
          },
          {
            src: '/projects/smart-alarm-schematic.jpg',
            alt: 'Schematic split into passive components, active components, and the processor',
            caption: 'The schematic, organised into passive parts, active parts, and the processor itself.',
          },
          {
            src: '/projects/smart-alarm-pcb-layout.jpg',
            alt: 'Circuit board layout with each part broken out to a labelled socket',
            caption: 'The layout. Every part breaks out to a labelled socket, so any one of them can still be swapped.',
          },
          {
            src: '/projects/smart-alarm-pcb-3d.jpg',
            alt: '3D render of the assembled PCB',
            caption: 'The 3D render of the assembled board, before it went out for fabrication.',
          },
        ],
      },
    ],
    highlights: [
      'Rings early at the first stretch of light sleep, at one of three sensitivity levels, and falls back to the exact alarm time if that moment never comes',
      'The model I trained ended up below a plain always-guess-light baseline, so I did not ship it as the displayed stage: see the numbers above',
      'Shipped the standard sleep-cycle model instead: 20 to 27% deep sleep, matching published norms, with my model’s guess still logged every window for comparison',
      'Roughly 1,100 lines of code plus a 1.4 MB model outgrew the chip’s default program space, which meant redrawing how its memory is divided up',
      'A button that double-registered and a pin needing a resistor the chip doesn’t supply, both caught on the breadboard and fixed in the board design',
      'The memory card file opens once per sleep session, not on every write. An earlier version corrupted the card doing that, so the rule is now built into the code',
    ],
    links: [
      { href: 'https://github.com/AustinZhai8/Smart-Alarm', label: 'GitHub', primary: true },
      { href: 'https://github.com/AustinZhai8/Smart-Alarm#demo', label: 'Demo clip', external: true },
    ],
    images: [],
  },
  {
    id: 'portfolio-vision',
    title: 'Portfolio Vision',
    year: '2026',
    category: 'Software',
    thumb: '/screenshot.png',
    summary: 'A web app that takes a portfolio of funds and shows you the companies you actually own underneath them, with live prices and a breakdown by sector and country.',
    detail: 'Built first as a command-line tool, then rebuilt as a full web app running at portfoliovision.online.',
    parts: [
      {
        tag: 'Part 1 · Command-line tool',
        body: 'The first version ran in a terminal. You type in what you hold, and it opens each fund up into the companies inside it, repeating that on any fund it finds along the way.',
        points: [
          'Prints the combined result with sector and country breakdowns',
          'An honest note on how much of the portfolio it could not account for',
          'Two funds holding each other would loop forever, so it watches for that and stops',
        ],
        chips: ['Python', 'CLI', 'JSON'],
        media: [
          {
            src: '/projects/pv-cli.png',
            alt: 'Portfolio Vision Python CLI decomposing a portfolio in the terminal',
            caption: 'The CLI output, trimmed: currency detection, the input portfolio, and the top of the unwrapped holdings table.',
            maxWidth: 663, // its natural width — stops the frame stretching and softening the terminal text
          },
        ],
      },
      {
        tag: 'Part 2 · Web App',
        body: 'The web version does the same work behind a real interface, live at portfoliovision.online.',
        points: [
          'Sign in with Google or a code emailed to you',
          'Portfolios save to your account, where nobody else can reach them',
          'Prices come in live, and the whole thing flips between US and Canadian dollars at the current rate',
        ],
        chips: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'Google Cloud', 'Vercel'],
        media: [
          {
            src: '/screenshot.png',
            alt: 'The Portfolio Vision web app showing a decomposed portfolio with live prices',
            caption: 'The deployed app at portfoliovision.online, with live prices and saved per-user portfolios.',
          },
        ],
      },
    ],
    highlights: [
      'Opens funds up into what they actually hold across 750+ tickers, following funds inside funds without ever going round in circles',
      'Live prices across the US and Canadian exchanges, fetched through a small service I wrote rather than a paid data provider, which cut $30+ a month in costs and the request limits that came with them',
      'Sign in with Google or a one-time emailed code, with rules on the database itself so one account can never read another one’s portfolios',
      'Switch between US and Canadian dollars at the live rate, either for one holding or across the whole portfolio',
      '400+ page views in the first week after launch',
      'Built, deployed and running on my own domain, with every key kept out of the code',
    ],
    links: [
      { href: 'https://www.portfoliovision.online/', label: 'portfoliovision.online', primary: true, external: true },
      { href: 'https://github.com/AustinZhai8/Portfolio-Vision-Web', label: 'Web App' },
      { href: 'https://github.com/AustinZhai8/Portfolio-Vision-Py', label: 'Python CLI' },
    ],
    images: [],
  },
  {
    id: 'pocketsense',
    title: 'PocketSense',
    year: '2026',
    category: 'Hardware',
    thumb: '/projects/pocketsense-thumb.jpg',
    summary: 'A pocket-sized room monitor on a circuit board I designed from scratch. Temperature, humidity, pressure, UV and WiFi signal on a small screen, paged through with three buttons and running off AA batteries.',
    detail: 'Breadboard, then schematic, then board, then switching it on. I wrote the code, drew the circuit, laid out the board, and soldered every part by hand.',
    parts: [
      {
        tag: 'Part 1 · Breadboard and firmware',
        body: 'Nothing got committed to a board until it worked on a breadboard first: the whole program was written and proven before I drew a single line of the circuit.',
        points: [
          'The sensor and the screen share one set of wires to the processor, a clash worth finding while it is still a jumper wire away from fixed',
          'The UV sensor sits on a pin that keeps working while the WiFi radio is on',
          'Deliberately small interface: five screens, three buttons',
        ],
        chips: ['ESP32', 'Arduino', 'I2C', 'Adafruit GFX', 'SSD1306', 'BME280'],
        media: [
          {
            src: '/projects/pocketsense-breadboard.jpg',
            alt: 'Breadboard prototype showing the Temperature screen reading 23.3 C',
            caption: 'The breadboard build, running the finished firmware. Every screen and every pin was proven here before the pinout was frozen.',
          },
        ],
      },
      {
        tag: 'Part 2 · Schematic and PCB',
        body: 'Drawn as four blocks: power, reset, startup, and the connector I program it through.',
        points: [
          'Three AA cells feed a regulator through a switch that cuts the supply itself, so the board is genuinely dead when off',
          'Four layers, with solid power and ground through the middle and a deliberate gap left under the antenna',
          'Design checks came back clean, and I previewed the manufacturing files with the fab house before ordering',
        ],
        chips: ['Altium Designer', 'Schematic Capture', 'PCB Layout', '4-Layer Stackup', 'JLCPCB'],
        media: [
          {
            src: '/projects/pocketsense-schematic.png',
            alt: 'Schematic split into power, reset, startup, and programming connector blocks',
            caption: 'The schematic, in four blocks: power, reset, startup, and the connector I program it through.',
          },
          {
            src: '/projects/pocketsense-pcb-layout.png',
            alt: 'Four-layer board layout with a clear gap left under the antenna at the top edge',
            caption: 'Four-layer layout. Wiring on the outside, solid power and ground through the middle, and a clear gap under the antenna.',
          },
          {
            src: '/projects/pocketsense-pcb-3d.png',
            alt: '3D render of the assembled PocketSense board',
            caption: 'The 3D view, the last check before the files go out. Mostly: does anything collide, and does the display actually fit.',
          },
        ],
      },
      {
        tag: 'Part 3 · Assembly',
        body: 'The boards came back from the fab house and I soldered every part by hand, flat parts first while nothing tall was in the way.',
        points: [
          'The switch that arrived had more pins than the footprint I drew, so I traced it with a meter and found the three that line up, rather than reordering',
          'Checked power and ground for a short before any voltage went near the board. No beep, safe to switch on',
        ],
        chips: ['SMD Soldering', 'SOT-223', '0603 / 0805', 'Continuity Testing'],
        media: [
          {
            src: '/projects/pocketsense-assembly.jpg',
            alt: 'Bare PocketSense PCB with the ESP32 module placed and unpopulated footprints visible',
            full: true,
            caption: 'Fresh from the fab, with the module dry-fitted. Surface mount work goes first, while the board is still flat.',
          },
          {
            src: '/projects/pocketsense-final-front.jpg',
            alt: 'Fully populated PocketSense board with ESP32, OLED, BME280, UV sensor and six buttons',
            caption: 'Fully populated. Purple board is the environment sensor, red is the UV sensor, and the three buttons along the bottom are back, scroll, and select.',
          },
          {
            src: '/projects/pocketsense-final-back.jpg',
            alt: 'Back of the PocketSense board with a three-cell AA battery holder mounted over the LDO',
            caption: 'The back, with the battery holder mounted over the regulator. It runs off cells you can buy anywhere.',
          },
        ],
      },
      {
        tag: 'Part 4 · UART bring-up',
        body: 'This board has no circuit to put itself into programming mode, so you do it by hand: hold one button, tap the other, let go, all within the second the computer is trying to connect.',
        points: [
          'It works: the chip answers and the transfer starts, meaning the reset circuit, data lines and power supply are all doing their jobs',
          'Then the transfer dies partway, and the meter explains why: the supply sags under real current and the board cuts out mid-upload',
          'A battery and regulator problem, not a layout one',
        ],
        chips: ['FT232R', 'UART', 'esptool', 'Hardware Bring-up'],
        media: [
          {
            src: '/projects/pocketsense-bringup.jpg',
            alt: 'PocketSense wired to a USB adapter with the upload running on screen',
            full: true,
            caption: 'First power-up, over a USB adapter. The chip answers and the upload starts, right up until the supply gives out.',
          },
        ],
      },
    ],
    highlights: [
      'Five sensor screens on one small display, all driven by three buttons. No phone, no app, no cloud',
      'The bug that almost shipped: two buttons were wired to pins reserved for the chip’s own memory. Caught it against the datasheet before the board went out',
      'The antenna gap took a second pass: clearing the outer layers doesn’t clear the solid copper underneath, which has to be cut away separately',
      'The program runs about 927 KB, roughly 70% of the space set aside for it, a lot for something that draws five screens',
      'Every stage was mine end to end: code on a breadboard, circuit and layout, files to the fab house, every part soldered by hand',
      'One step from done: the upload cuts out when the batteries sag, and the fix is a steadier supply, not a new board',
    ],
    links: [
      { href: 'https://github.com/AustinZhai8/Pocket-Sense', label: 'GitHub', primary: true },
    ],
    images: [],
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    year: '2026',
    category: 'Software',
    summary: 'Designed, built, and deployed austinzhai.com end to end. A React single-page site with a dark theme, scroll-triggered reveals, and a projects page that prints as a clean resume.',
    detail: 'Full CI/CD through GitHub and Vercel, with the domain and DNS set up from scratch.',
    thumb: '/projects/personal-website-thumb.jpg',
    parts: [],
    skills: [
      { label: 'Languages', chips: ['JavaScript', 'HTML', 'CSS'] },
      { label: 'Frameworks', chips: ['React', 'Tailwind CSS', 'Vite'] },
      { label: 'Tools', chips: ['Git', 'GitHub', 'Vercel', 'Domain Setup'] },
    ],
    highlights: [
      'Mine end to end: design, build, deploy, and the domain it sits on',
      'Under 100 KB of JavaScript, and the page is up in under a second from a cold load',
      'The projects page prints as a clean resume-style document, laid out separately from the screen version',
      'Every push to the main branch deploys itself',
    ],
    links: [
      { href: 'https://austinzhai.com', label: 'austinzhai.com', primary: true, external: true },
      { href: 'https://github.com/AustinZhai8/personal-website', label: 'GitHub' },
    ],
    images: [
      { src: '/projects/personal-website-hero.jpg', alt: 'The austinzhai.com landing page, with the headshot, intro and navigation cards' },
    ],
  },
]

export const MINOR_HARDWARE = [
  {
    id: 'sonar',
    title: 'Servo Sonar Radar',
    summary: 'An ultrasonic sensor on a servo sweeps 180 degrees and plots whatever it finds on a live radar display.',
    year: '2026',
    description: 'An ultrasonic sensor on a servo sweeps back and forth through 180°, measuring the distance to whatever is in front of it. Anything it finds is drawn on a live radar display on a laptop. Three modes: sweep continuously, stop when something is spotted, or aim it yourself with a joystick.',
    chips: ['Arduino', 'Servo Control', 'Ultrasonic Sensing', 'Serial Communication', 'Processing'],
    links: [{ href: 'https://github.com/AustinZhai8/Sonar-Servo-Radar', label: 'GitHub' }],
    images: [
      { src: '/projects/sonar-square.jpg', alt: 'Servo Sonar Radar close-up', w: 300 },
      { src: '/projects/sonar-wide.jpg', alt: 'Servo Sonar Radar with radar display', w: 350 },
    ],
  },
  {
    id: 'smart-gate',
    title: 'Smart Gate Access System',
    summary: 'An RFID card or a keypad code opens a servo-driven gate, with status on an LCD and LED and buzzer feedback.',
    year: '2026',
    description: 'A gate that opens either to a tap of an RFID card or a code typed on a keypad, then swings shut behind you. A small screen shows what it is doing, and a light and a buzzer tell you whether you were let in or turned away.',
    chips: ['ESP32', 'RFID', 'SPI', 'I2C', 'Servo Control', 'Embedded Systems'],
    links: [{ href: 'https://github.com/AustinZhai8/Smart-Gate-Access-System', label: 'GitHub' }],
    images: [{ src: '/projects/smart-gate-2.jpg', alt: 'Smart Gate Access System', w: 'auto' }],
  },
]

export const MINOR_SOFTWARE = [
  {
    id: 'stock-predictor',
    title: 'Stock Predictor',
    summary: 'A Random Forest that predicts whether the S&P 500 closes up or down the next day, backtested to ~0.58 precision.',
    year: '2026',
    description: 'A Random Forest classifier that predicts next-day S&P 500 direction (up or down) from historical price and volume data pulled via yfinance. Trained and backtested in a Jupyter notebook, reaching a precision score of about 0.58 on held-out data.',
    chips: ['Python', 'scikit-learn', 'pandas', 'Jupyter'],
    links: [{ href: 'https://github.com/AustinZhai8/Stock-Predictor', label: 'GitHub' }],
    images: [],
  },
  {
    id: 'hangman',
    title: 'Hangman',
    summary: 'The classic word-guessing game in the terminal, with difficulty levels and six lives.',
    year: '2026',
    description: 'A command-line implementation of the classic word-guessing game. Players choose a difficulty, then guess letters or the full word with 6 lives. Draws from a curated word list per difficulty and tracks guessed letters to prevent duplicates.',
    chips: ['Python', 'CLI'],
    links: [{ href: 'https://github.com/AustinZhai8/Hangman', label: 'GitHub' }],
    images: [],
  },
  {
    id: 'password-manager',
    title: 'Random Password Manager',
    summary: 'Generates, stores and retrieves credentials locally from the command line, persisted to a JSON file.',
    year: '2026',
    description: 'A command-line Python password manager that stores, retrieves, and deletes credentials locally. A built-in generator guarantees variety across uppercase, lowercase, digits, and symbols on every run. Data persists via a local JSON file.',
    chips: ['Python', 'JSON', 'CLI'],
    links: [{ href: 'https://github.com/AustinZhai8/Random-Password-Manager', label: 'GitHub' }],
    images: [],
  },
]

// One flat list, because ids are unique across all three project arrays and routing,
// the print sheet and the sitemap all need to look a project up by id alone.
export const ALL_PROJECTS = [...MAIN_PROJECTS, ...MINOR_HARDWARE, ...MINOR_SOFTWARE]

// ─── Expandable main project card ───────────────────────────────────────

// The full write-up for one project. Shared by the detail view and the print sheet,
// so the resume printout can never drift from what the site shows.
function ProjectBody({ p }) {
  const gallery = p.images && p.images.length > 0
  return (
    <>
      {p.detail && <p className="proj-detail">{p.detail}</p>}
      {p.description && <p className="minor-desc">{p.description}</p>}

      {p.chips && p.chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {p.chips.map((c) => <Chip key={c} label={c} />)}
        </div>
      )}

      {p.parts && p.parts.length > 0 && (
        <div className="detail-parts" style={{ marginBottom: '22px' }}>
          {p.parts.map((part) => <PartCard key={part.tag} part={part} />)}
        </div>
      )}

      {p.skills && (
        <div style={{ marginBottom: '20px' }}>
          <div className="mini-label">Skills used</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {p.skills.map(({ label, chips }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span className="skill-label">{label}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {chips.map((c) => <Chip key={c} label={c} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {p.highlights && p.highlights.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div className="mini-label">Highlights</div>
          {p.highlights.map((h, i) => (
            <div key={i} className="highlight-row" style={{ borderBottom: i < p.highlights.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="fact-arrow">→</span>
              {h}
            </div>
          ))}
        </div>
      )}

      <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: gallery ? '20px' : 0 }}>
        {p.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={l.primary ? 'pill-primary' : 'pill-ghost'}>
            {l.external ? <IconExternal /> : <IconGithub size={12} />} {l.label}
          </a>
        ))}
      </div>
      <div className="print-links print-only">
        {p.links.map((l) => <div key={l.href}>{l.label}: {l.href}</div>)}
      </div>

      {gallery && (
        p.highlights ? (
          <div className="proj-images">
            {p.images.map((img) => (
              <div key={img.src} className="proj-img-frame">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {p.images.map((img) => (
              <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="minor-img"
                style={{ width: img.w === 'auto' ? 'auto' : `${img.w}px` }} />
            ))}
          </div>
        )
      )}
    </>
  )
}

function ProjectCard({ p, featured, onOpen }) {
  return (
    <a className={'grid-card' + (featured ? ' featured' : '')} href={pathFor('projects', p.id)}
      onClick={interceptClick(() => onOpen(p.id))}>
      {featured && p.thumb && (
        <span className="grid-thumb"><img src={p.thumb} alt="" loading="lazy" /></span>
      )}
      <span className="grid-card-top">
        <span className="proj-cat">{p.category || 'Project'}</span>
        <span className="proj-year">{p.year}</span>
      </span>
      <span className="grid-card-title">{p.title}</span>
      <span className="grid-card-blurb">{p.summary || p.description}</span>
      <span className="grid-card-more">Read more <IconArrowRight size={12} /></span>
    </a>
  )
}

// Always mounted outside the screen content so printing works from any route.
// Reuse the content data without adding controls or changing the screen layout.
function PortfolioLinks({ links = [], path }) {
  return (
    <div className="portfolio-links">
      {[{ href: SITE.origin + path, label: 'Full write-up' }, ...links].map((link) => (
        <div key={link.href}>{link.label}: <a href={link.href} target="_blank" rel="noopener noreferrer">{link.href}</a></div>
      ))}
    </div>
  )
}

function PortfolioImages({ images }) {
  if (!images.length) return null
  return (
    <div className="portfolio-images">
      {images.map((img) => (
        <figure key={img.src}>
          {(img.type !== 'video' || img.poster) && <img src={img.type === 'video' ? img.poster : img.src} alt={img.alt} loading="eager" />}
          <figcaption>{img.caption || img.alt}</figcaption>
          {img.type === 'video' && <div className="portfolio-links">Watch video: <a href={SITE.origin + img.src} target="_blank" rel="noopener noreferrer">{SITE.origin + img.src}</a></div>}
        </figure>
      ))}
    </div>
  )
}

function PortfolioPart({ part }) {
  return (
    <section className="portfolio-part">
      <h3>{part.tag}</h3>
      <p>{part.body}</p>
      {part.points?.length > 0 && <ul>{part.points.map((point) => <li key={point}>{point}</li>)}</ul>}
      {part.chips?.length > 0 && <p className="portfolio-meta">{part.chips.join(' · ')}</p>}
      <StatBlock stat={part.stat} />
      <PortfolioImages images={part.media || []} />
    </section>
  )
}

function PrintSheet() {
  return (
    <article className="print-only portfolio-print" aria-label="Printable portfolio">
      <header className="portfolio-header">
        <p>Engineering portfolio</p>
        <h1>Austin Zhai</h1>
        <p>Computer Engineering · University of British Columbia</p>
        <p><a href={SITE.origin} target="_blank" rel="noopener noreferrer">austinzhai.com</a> · <a href={'mailto:' + SITE.email}>{SITE.email}</a></p>
        <p><a href={SITE.github} target="_blank" rel="noopener noreferrer">github.com/AustinZhai8</a> · <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/austin-zhai</a></p>
      </header>
      <h2>Experience</h2>
      {EXPERIENCE.map((exp) => (
        <section className={'portfolio-entry' + (exp.parts?.length ? ' portfolio-long' : '')} key={exp.id}>
          <h3>{exp.company}</h3>
          <p className="portfolio-meta">{exp.role} · {exp.dates}</p>
          <p>{exp.description}</p>
          {exp.parts?.map((part) => <PortfolioPart key={part.tag} part={part} />)}
          <PortfolioLinks links={exp.links} path={pathFor('experience', exp.id)} />
        </section>
      ))}
      {MAIN_PROJECTS.map((p) => (
        <section className={p.parts.length ? 'portfolio-main' : 'portfolio-entry'} key={p.id}>
          <p className="portfolio-kicker">Projects · {p.category} · {p.year}</p>
          <h2>{p.title}</h2>
          <p>{p.summary}</p>
          {p.detail && <p>{p.detail}</p>}
          {(p.parts || []).map((part) => <PortfolioPart key={part.tag} part={part} />)}
          {p.skills?.map((skill) => <p key={skill.label}><strong>{skill.label}: </strong>{skill.chips.join(', ')}</p>)}
          {p.highlights?.length > 0 && <><h3>Highlights</h3><ul>{p.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></>}
          <PortfolioImages images={p.images || []} />
          <PortfolioLinks links={p.links} path={pathFor('projects', p.id)} />
        </section>
      ))}
      <section className="portfolio-additional">
        <h2>Additional projects</h2>
        {[...MINOR_HARDWARE, ...MINOR_SOFTWARE].map((p) => (
          <section className="portfolio-entry" key={p.id}>
            <h3>{p.title} · {p.year}</h3>
            <p>{p.description}</p>
            <p className="portfolio-meta">{p.chips.join(' · ')}</p>
            <PortfolioImages images={p.images} />
            <PortfolioLinks links={p.links} path={pathFor('projects', p.id)} />
          </section>
        ))}
      </section>
    </article>
  )
}

function ProjectsSection({ onOpen }) {
  return (
    <section id="projects" className="section-pad">
      <div className="page-shell">
        <SectionHeading eyebrow="What I&apos;ve built" title="Projects" />
        <p className="print-only print-name">Austin Zhai · austinzhai.com · github.com/AustinZhai8</p>

        <div className="reveal">
          <div className="group-head">
            <h3 className="group-title">Main Projects</h3>
          </div>
          <div className="card-grid main">
            {MAIN_PROJECTS.map((p) => <ProjectCard key={p.id} p={p} featured onOpen={onOpen} />)}
          </div>
        </div>

        <div className="reveal minor-block">
          <div className="group-head">
            <h3 className="group-title sm">Minor Projects</h3>
          </div>

          <p className="sub-heading">Hardware / Firmware</p>
          <div className="card-grid compact">
            {MINOR_HARDWARE.map((p) => <ProjectCard key={p.id} p={p} onOpen={onOpen} />)}
          </div>

          <p className="sub-heading" style={{ marginTop: '2.2rem' }}>Software</p>
          <div className="card-grid compact">
            {MINOR_SOFTWARE.map((p) => <ProjectCard key={p.id} p={p} onOpen={onOpen} />)}
          </div>
        </div>

      </div>
    </section>
  )
}

function ProjectDetail({ p, trail, onBack, onGo }) {
  return (
    <div className="page-pad">
      <div className="page-shell">
        <BackLink label="All projects" href="/projects" onClick={onBack} />
        <Breadcrumb trail={trail} onGo={onGo} />
        <div className="detail-head">
          <div className="detail-meta">
            {p.category && <span className="proj-cat">{p.category}</span>}
            <span className="proj-year">{p.year}</span>
          </div>
          <h1 className="page-title">{p.title}</h1>
          {p.summary && !p.description && <p className="proj-blurb detail-lead">{p.summary}</p>}
        </div>
        <ProjectBody p={p} />
      </div>
      <FloatingBack label="All projects" href="/projects" onClick={onBack} />
      <Footer />
    </div>
  )
}

// ─── SEO / route metadata ────────────────────────────────────────────────

export const SITE = {
  origin: 'https://austinzhai.com',
  name: 'Austin Zhai',
  ogImage: '/og.png',
  ogAlt: 'Austin Zhai — Computer Engineering student at UBC',
  linkedin: 'https://www.linkedin.com/in/austin-zhai/',
  github: 'https://github.com/AustinZhai8',
  email: 'austinhzhai@gmail.com',
}

// Every URL the site answers on, in sitemap order. Derived from the content arrays
// so a new experience or project entry can never be missing from the sitemap or the
// prerender pass.
export const ALL_ROUTES = [
  '/',
  '/about',
  '/experience',
  '/projects',
  ...EXPERIENCE.map((e) => '/experience/' + e.id),
  ...ALL_PROJECTS.map((p) => '/projects/' + p.id),
]

// '/about', '/experience' and '/projects' scroll to a section of the one long home
// page — same document, same content. They get their own title for the tab and the
// back button, but canonicalise to '/' rather than presenting four URLs of identical
// content to a crawler, and they stay out of the sitemap.
const SECTION_ROUTES = ['/about', '/experience', '/projects']
export const SITEMAP_ROUTES = ALL_ROUTES.filter((r) => !SECTION_ROUTES.includes(r))

// Meta descriptions are cut at a word boundary; Google truncates around 160 anyway.
function clamp(text, max = 158) {
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, s.lastIndexOf(' ', max - 1)).replace(/[,;:.]$/, '') + '…'
}

const PERSON_LD = {
  '@type': 'Person',
  '@id': SITE.origin + '/#person',
  name: 'Austin Zhai',
  url: SITE.origin + '/',
  jobTitle: 'Computer Engineering Student',
  email: 'mailto:' + SITE.email,
  image: SITE.origin + '/Headshot.JPG',
  affiliation: { '@type': 'CollegeOrUniversity', name: 'University of British Columbia' },
  knowsAbout: [
    'Embedded systems', 'PCB design', 'Unmanned aerial vehicles', 'Machine learning',
    'Industrial automation and controls', 'Full-stack web development', 'Investing',
  ],
  sameAs: [SITE.linkedin, SITE.github],
}

const SECTION_META = {
  home: {
    title: 'Austin Zhai',
    description: 'Austin Zhai is a Computer Engineering student at UBC who builds hardware and software: inspection drones, custom PCBs, and full-stack apps.',
  },
  about: {
    title: 'About — Austin Zhai',
    description: 'How investing became the thread that pulled Austin Zhai into Computer Engineering at UBC, plus the hobbies, languages and quick facts behind the work.',
  },
  experience: {
    title: 'Experience — Austin Zhai',
    description: 'Austin Zhai’s engineering and business experience: Advanced UAV Tech, Galaxy Instrumentation and Controls, TELUS Digital, Hydroficient and UBC Sailbot.',
  },
  projects: {
    title: 'Projects — Austin Zhai',
    description: 'Projects Austin Zhai designed and built, from an ESP32 sleep-tracking alarm clock with a custom PCB to a full-stack ETF portfolio decomposer.',
  },
}

// One place decides the title, description, canonical, breadcrumb trail and structured
// data for a route. Read by the prerenderer at build time and by useDocumentHead on
// every client-side navigation, so the two can never disagree.
export function metaFor(route) {
  const crumb = (name, path, section) => ({ name, path, section })
  const home = crumb('Home', '/', 'home')

  if (route.notFound) {
    return {
      title: 'Page not found — Austin Zhai',
      description: 'That page doesn’t exist. Browse Austin Zhai’s experience and projects instead.',
      canonical: SITE.origin + '/404',
      noindex: true,
      trail: [],
      jsonLd: [PERSON_LD],
    }
  }

  if (route.detail === 'experience') {
    const exp = EXPERIENCE.find((e) => e.id === route.id)
    const path = pathFor('experience', exp.id)
    return {
      title: `${exp.company} · Austin Zhai`,
      description: clamp(`${exp.role}. ${exp.blurb}`),
      canonical: SITE.origin + path,
      noindex: false,
      trail: [home, crumb('Experience', '/experience', 'experience'), crumb(exp.company, path, 'experience')],
      jsonLd: [PERSON_LD, breadcrumbLd([home, crumb('Experience', '/experience'), crumb(exp.company, path)])],
    }
  }

  if (route.detail === 'projects') {
    const p = ALL_PROJECTS.find((x) => x.id === route.id)
    const path = pathFor('projects', p.id)
    const repo = (p.links || []).find((l) => l.href.startsWith('https://github.com/'))
    const description = clamp(p.summary || p.description)
    const work = {
      '@type': repo ? 'SoftwareSourceCode' : 'CreativeWork',
      name: p.title,
      description,
      url: SITE.origin + path,
      author: { '@id': SITE.origin + '/#person' },
      ...(p.year ? { dateCreated: p.year } : {}),
      ...(repo ? { codeRepository: repo.href } : {}),
    }
    return {
      title: `${p.title} · Austin Zhai`,
      description,
      canonical: SITE.origin + path,
      noindex: false,
      trail: [home, crumb('Projects', '/projects', 'projects'), crumb(p.title, path, 'projects')],
      jsonLd: [PERSON_LD, breadcrumbLd([home, crumb('Projects', '/projects'), crumb(p.title, path)]), work],
    }
  }

  const section = route.section || 'home'
  const path = pathFor(section)
  const base = SECTION_META[section] || SECTION_META.home
  return {
    title: base.title,
    description: base.description,
    // all four are the same document, so they all canonicalise to '/' — see SECTION_ROUTES
    canonical: SITE.origin + '/',
    noindex: false,
    trail: [],
    jsonLd: section === 'home'
      ? [
        { '@type': 'ProfilePage', '@id': SITE.origin + '/#page', url: SITE.origin + '/', name: base.title, mainEntity: { '@id': SITE.origin + '/#person' } },
        { '@type': 'WebSite', '@id': SITE.origin + '/#website', url: SITE.origin + '/', name: SITE.name, author: { '@id': SITE.origin + '/#person' } },
        PERSON_LD,
      ]
      : [PERSON_LD, breadcrumbLd([home, crumb(base.title.split(' —')[0], path)])],
  }
}

function breadcrumbLd(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: SITE.origin + c.path,
    })),
  }
}

// One @graph per page rather than a stack of separate scripts, so the nodes can refer
// to each other by @id (every page's structured data points at the same Person).
export function ldJson(meta) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.jsonLd })
}

// ─── Not found ───────────────────────────────────────────────────────────

// Nothing here uses .reveal: a 404 has to be readable the instant it paints, without
// waiting on the IntersectionObserver.
function NotFoundSection({ onGo }) {
  return (
    <div className="page-pad not-found">
      <div className="page-shell">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="page-title">This page doesn&apos;t exist.</h1>
        <p className="body-text not-found-lead">
          The link may be out of date, or the address slightly off. Everything on the
          site is one click away below.
        </p>
        <a className="btn-primary" href="/" onClick={interceptClick(() => onGo('home'))}>
          Back to home
        </a>
        <div className="home-links not-found-links">
          <HomeLink label="About me" href="/about" onClick={() => onGo('about')} />
          <HomeLink label="Experience" href="/experience" onClick={() => onGo('experience')} />
          <HomeLink label="Projects" href="/projects" onClick={() => onGo('projects')} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────

export default function App({ initialRoute }) {
  // The prerender pass supplies the route; in the browser the URL is the source of truth.
  const [route, setRoute] = useState(() => initialRoute || parseRoute())
  const ref = useRef(null)
  const pending = useRef(route.section)
  // deps matter: swapping between the main page and a detail view mounts fresh
  // .reveal nodes that the observer has to pick up
  useScrollReveal(ref, [route.detail, route.id])
  const spy = useScrollSpy(!route.detail && !route.notFound)
  const meta = useMemo(() => metaFor(route), [route])
  useDocumentHead(meta)

  const openDetail = (kind, id) => {
    setRoute({ detail: kind, id, section: kind, notFound: false })
    try { history.pushState(null, '', pathFor(kind, id)) } catch { /* no-op */ }
  }

  const goSection = (id) => {
    if (route.detail || route.notFound) {
      pending.current = id
      setRoute({ detail: null, id: null, section: id, notFound: false })
      try { history.replaceState(null, '', pathFor(id)) } catch { /* no-op */ }
    } else {
      scrollToSection(id)
    }
  }

  // Hash links from before the switch to real paths (#projects,
  // #experience/advanced-uav-tech) are still out in the world on a resume and a
  // LinkedIn profile. The server only ever saw '/' for those, so rather than patch the
  // route in place — which would mean hydrating one route on top of another's HTML —
  // send the browser to the prerendered document for that path. One extra navigation,
  // on legacy links only.
  useEffect(() => {
    const raw = window.location.hash.replace('#', '')
    if (!raw) return
    const [a, b] = raw.split('/')
    if (!SECTION_IDS.includes(a)) return
    const path = pathFor(a, b)
    if (routeForPath(path).notFound) return
    window.location.replace(path)
  }, [])

  // One place decides scroll position after a view swap, so leaving a detail view
  // returns you to the card you came from rather than the top of the page.
  useEffect(() => {
    if (route.detail || route.notFound) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const target = pending.current || 'home'
    pending.current = null
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [route.detail, route.id, route.notFound])

  useEffect(() => {
    const onPop = () => {
      const next = parseRoute()
      pending.current = next.section
      setRoute(next)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // routeForPath has already checked the id exists, so these lookups always hit.
  let body
  if (route.notFound) {
    body = <NotFoundSection onGo={goSection} />
  } else if (route.detail === 'experience') {
    const exp = EXPERIENCE.find((e) => e.id === route.id)
    body = <ExperienceDetail exp={exp} trail={meta.trail} onBack={() => goSection('experience')} onGo={goSection} />
  } else if (route.detail === 'projects') {
    const proj = ALL_PROJECTS.find((x) => x.id === route.id)
    body = <ProjectDetail p={proj} trail={meta.trail} onBack={() => goSection('projects')} onGo={goSection} />
  }

  return (
    <>
      <ScrollProgress />
      <Nav page={route.detail || spy} onNavigate={goSection} />
      <div ref={ref} className="screen-content">
        {body ? (
          <Page key={meta.canonical} pageKey={meta.canonical}>{body}</Page>
        ) : (
          <>
            <HomeSection onNavigate={goSection} />
            <AboutSection />
            <ExperienceSection onOpen={(id) => openDetail('experience', id)} />
            <ProjectsSection onOpen={(id) => openDetail('projects', id)} />
            <Footer />
          </>
        )}
      </div>
      <PrintSheet />
    </>
  )
}
