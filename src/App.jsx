import { useState, useEffect, useRef } from 'react'

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
function IconChevron({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
function IconArrowDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
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

function findCard(id) {
  return Array.from(document.querySelectorAll('[data-card-id]')).find((el) => el.dataset.cardId === id) || null
}

// Expand/collapse state for a page of cards, plus the id of the open card the reader is
// currently scrolled inside — so a floating control can offer to close it without
// scrolling back up to the header.
function useCollapsibleCards() {
  const [openIds, setOpenIds] = useState({})
  const [activeId, setActiveId] = useState(null)

  const toggle = (id) => setOpenIds((s) => ({ ...s, [id]: !s[id] }))

  // Land the reader back on the header rather than wherever the shrinking page leaves them.
  const collapse = (id) => {
    const el = findCard(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'instant' })
    setOpenIds((s) => ({ ...s, [id]: false }))
  }

  useEffect(() => {
    const ids = Object.keys(openIds).filter((k) => openIds[k])
    const check = () => {
      const hit = ids.find((id) => {
        const el = findCard(id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < 64 && r.bottom > 220
      })
      setActiveId(hit || null)
    }
    // deferred a frame so the first measurement happens after paint, not in the effect body
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [openIds])

  useEffect(() => {
    if (!activeId) return
    const onKey = (e) => { if (e.key === 'Escape') collapse(activeId) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  return { openIds, toggle, collapse, activeId }
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
        <button className="nav-brand" onClick={() => onNavigate('home')}>
          Austin <span style={{ color: 'var(--accent)' }}>Zhai</span>
        </button>
        <div className="nav-links">
          {links.map((l) => (
            <button
              key={l.id}
              className={'nav-link' + (page === l.id ? ' active' : '')}
              onClick={() => onNavigate(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Page transition wrapper ────────────────────────────────────────────

function Page({ pageKey, children }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => setOn(true), 30)
    return () => clearTimeout(t)
  }, [pageKey])
  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? 'none' : 'translateY(16px)',
      transition: 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  )
}

// ─── Small shared pieces ─────────────────────────────────────────────────

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

// Floating "collapse" pill, shown only while the reader is inside an expanded card.
function CollapseBar({ activeId, title, onCollapse }) {
  return (
    <button
      className={'collapse-bar no-print' + (activeId ? ' show' : '')}
      onClick={() => activeId && onCollapse(activeId)}
      tabIndex={activeId ? 0 : -1}
      aria-hidden={!activeId}
    >
      <IconChevron open />
      <span>Collapse{title ? ' ' + title : ''}</span>
    </button>
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

function NextPage({ label, onClick }) {
  return (
    <div className="no-print" style={{ textAlign: 'center', padding: '2.5rem 0 5rem' }}>
      <button className="btn-primary" onClick={onClick}>{label}</button>
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

function HomePage({ onNavigate }) {
  return (
    <Page pageKey="home">
      <section className="hero-screen">
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <img src="/Headshot.JPG" alt="Austin Zhai" className="headshot" />
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
          <button className="explore-btn" onClick={() => onNavigate('about')} aria-label="Go to About">
            <span>Explore</span>
            <IconArrowDown />
          </button>
        </div>
      </section>
    </Page>
  )
}

// ─── About ───────────────────────────────────────────────────────────────

function AboutPage({ onNavigate }) {
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
    <Page pageKey="about">
      <div ref={ref}>

        {/* Convexity */}
        <section className="convexity-screen reveal" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Eyebrow>One word that describes my mindset</Eyebrow>
          <h1 className="convexity-word">Convexity</h1>
          <div className="convexity-idea">
            <span className="idea-label">The Idea</span>
            <p className="idea-line">The more you put in, the faster the returns grow.</p>
            <p className="idea-tail">Effort compounds.</p>
          </div>
          <div className="scroll-hint">
            <span>scroll</span>
            <div className="scroll-line" />
          </div>
        </section>

        {/* Bio */}
        <SectionRule label="About Me" />
        <div className="reveal" style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <p className="bio-line">
            UBC Computer Engineering student who spends way too much time on business student activities.
            Somewhere along the way that turned into a genuine interest in where hardware meets software.
          </p>
        </div>

        {/* Investing */}
        <SectionRule label="Investing" />
        <div className="reveal" style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <Eyebrow>Where it all started</Eyebrow>
            <h2 className="section-title">Investing is the thread that ties everything together.</h2>
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
            <div className="img-card"><img src="/wealthsimple.png" alt="Wealthsimple portfolio" loading="lazy" /></div>
            <div className="img-card"><img src="/blossom.png" alt="Blossom portfolio" loading="lazy" /></div>
          </div>
          <p className="body-text" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px' }}>
            Here&apos;s my <a href="https://link.blossomsocial.com/7uYa/kos58964" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>Blossom</a> if
            you have it and want to connect.
          </p>
        </div>

        {/* Hobbies */}
        <div className="reveal" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
          <Eyebrow style={{ textAlign: 'center', marginBottom: '1.6rem' }}>Hobbies</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {['Basketball', 'Gym', 'Piano', 'Video Games'].map((h) => (
              <span key={h} className="hobby-pill">{h}</span>
            ))}
          </div>
        </div>

        {/* Quick facts */}
        <div className="reveal" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
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

        <NextPage label="View Experience" onClick={() => onNavigate('experience')} />
        <Footer />
      </div>
    </Page>
  )
}

// ─── Experience ──────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: 'Advanced UAV Tech',
    role: 'Electronics Engineering Intern',
    dates: 'June 2026 to August 2026',
    tag: 'Hardware Engineering',
    description: "I worked on a 5-person team building a drone that inspects warehouse pallets for damage at DHL sites. A pilot flew it down the aisles filming the racking, and that footage ran through a computer vision pipeline the team trained, which flagged which pallets were damaged and how they were stacked. My focus was the electronics: I sized and built the power system, assembled and wired the full stack onto a 20 inch carbon fiber airframe, and tuned the flight controller and optical flow sensor so it holds position indoors with no GPS. I also designed and printed the landing legs in Onshape when nothing off the shelf fit our motors and frame. Alongside the build I ran the project day to day and was the point of contact with DHL's staff and project managers.",
    links: [{ href: 'https://github.com/zacharyL16/DroneScan', label: 'DroneScan, the team repo' }],
    parts: [
      {
        tag: 'The problem',
        body: "Warehouses check pallets for damage by eye, one at a time, and a large DHL site holds thousands of them. We wanted to make that faster: fly an aisle once, and let software do the looking. I ran the meetings with DHL's staff and project managers, so what they needed came back to the team through me, and I kept the five of us pointed at the same milestones from there.",
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
        body: 'We started with a drone the company already owned, one of its light-show quads built on a DJI F450 frame. It was never going to be the final build. It was there to answer a single question.',
        points: [
          'The question: how does a drone hold still indoors, where there is no GPS to lock onto?',
          'The answer: an MTF-01 optical flow module, a downward camera and laser rangefinder that tracks movement against the floor',
          'Once it was fitted and tuned the drifting stopped, and everything after this was designed around it',
        ],
        chips: ['DJI F450', 'Pixhawk 2.4.8', 'MTF-01 Optical Flow'],
        media: [
          {
            src: '/projects/auav-prototype.jpg', w: 1300, h: 1143,
            alt: 'The F450 prototype quadcopter on a desk with a Pixhawk 2.4.8 flight controller mounted on top',
            caption: 'The prototype: a light-show F450 stripped back and rebuilt around a Pixhawk 2.4.8, with the optical flow module tucked underneath.',
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
        body: 'The battery decides how long a flight lasts, and how long a flight lasts decides how much of a warehouse you can cover in one go. So I sized the power system from measured numbers instead of guessing at a battery.',
        points: [
          'One 4S LiPo fed all four motor controllers, the flight controller and the video transmitter',
          'I worked the flight time out from measured current draw before we bought anything',
          'Roughly 40 soldered connections across the power and signal wiring, every cable cut to length and heat-shrunk',
          'We trialled a 4-in-1 ESC stack part way through and ended up back on four separate ESCs',
        ],
        chips: ['4S LiPo', 'ESCs', 'XT60', 'Soldering'],
        stat: {
          rows: [
            { label: 'Usable capacity', expr: '2.2 Ah × 0.8 depth of discharge', result: '1.76 Ah' },
            { label: 'All-up weight', expr: 'frame, motors, props, ESCs, Pixhawk, LiPo, FPV gear, wiring', result: '≈1.34 kg' },
            { label: 'Hover current', expr: '150 W/kg ÷ 14.8 V ≈ 10 A/kg, × 1.34 kg', result: '≈13.4 A' },
            { label: 'Endurance', expr: '1.76 Ah ÷ 13.4 A × 60', result: '≈7.9 min' },
          ],
          note: 'A projection, not a measurement. The airframe was never put on a scale and it has never been flown down to empty. The 0.8 is there because a LiPo below roughly 20% charge is off limits.',
        },
        media: [
          {
            src: '/projects/auav-power.jpg', w: 1300, h: 1464,
            alt: 'Top-down view of the drone showing the power distribution board, XT60 connector and four ESCs',
            caption: 'Top-down on the distribution board: four ESCs zip-tied along the arms, XT60 into the PDB, optical flow module at the nose.',
          },
          {
            src: '/projects/auav-wiring.jpg', w: 1300, h: 1300,
            alt: 'The drone mid-rebuild on a workbench with helping hands, custom heat-shrunk cables and a 4-in-1 ESC',
            caption: 'Mid-rebuild on the bench, with the 4-in-1 ESC we trialled and every cable cut to length and heat-shrunk.',
          },
        ],
      },
      {
        tag: 'Final airframe',
        body: 'The prototype could not carry everything we needed, so we moved onto a bigger 20 inch carbon fiber frame. I assembled and wired this one up myself, and designed the parts that did not exist off the shelf.',
        points: [
          'Pixhawk V6X flight controller, with the MTF-01 optical flow module mounted underneath',
          'No commercial landing leg fitted our combination of motors and frame, so I modelled our own in Onshape around the real parts and printed them',
          'They were hollowed out in a hex pattern to save weight without losing stiffness, and they are the legs holding the drone up in the photos below',
          'Then tuned until it held position steadily indoors',
        ],
        chips: ['Carbon Fiber Frame', 'Pixhawk V6X', 'Onshape', '3D Printing'],
        media: [
          {
            src: '/projects/auav-cad-leg.png', w: 1300, h: 583, full: true,
            alt: 'Onshape CAD model of the custom landing leg, showing the motor mounting flange and hex lightening cutouts',
            caption: 'The landing leg in Onshape, modelled around imported geometry of the motors and frame we actually had.',
          },
          {
            src: '/projects/auav-final.jpg', w: 1300, h: 1040,
            alt: 'The finished carbon fiber quadcopter on a desk with a Pixhawk V6X and GPS mounted',
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
        body: 'The footage came off the drone live. It carried a tiny FPV camera and video transmitter, and the picture arrived on a laptop while the drone was still in the air.',
        points: [
          'An all-in-one camera and video transmitter weighing 4.7 g, about a thumbnail at 18.7 × 13 mm',
          'It transmitted to a receiver plugged into a laptop, which captured the feed in OBS',
          'That recording is what got fed through the software afterwards',
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
        body: 'Before software can spot damage, someone has to show it thousands of examples. We labelled every training photo by hand in Roboflow, drawing a shape around each pallet and tagging it twice.',
        points: [
          'Tag one: is this pallet damaged, or undamaged?',
          'Tag two: is it stacked flat, or in a pyramid?',
          'The two shapes sit on top of each other, which would make the model draw two boxes around every pallet',
          'So we built its training set from the damage shapes only, and saved the stacking tags for a later step',
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
        body: 'Three models, trained in a notebook and chained together. The first one finds the pallets; the other two look at each pallet it found.',
        points: [
          'Model 1 draws a box around every pallet in the frame',
          'Model 2 decides whether that pallet is damaged',
          'Model 3 decides whether it is stacked flat or in a pyramid',
          'Damaged pallets are rare in the training data, so we tuned model 2 to catch as many as it could and tolerate a few false alarms. Missing a damaged pallet costs more than double-checking a good one.',
        ],
        chips: ['YOLO11', 'Ultralytics', 'Jupyter'],
        stat: {
          rows: [
            { label: 'Finding pallets', expr: 'detector score across the test set', result: '0.88' },
            { label: 'Flat or pyramid', expr: 'test set accuracy', result: '0.86' },
            { label: 'Damaged or not', expr: 'accuracy / damaged caught', result: '0.82 / 0.80' },
          ],
        },
        media: [
          {
            src: '/projects/auav-training.png', w: 1032, h: 442,
            alt: 'Jupyter notebook cell training the YOLO11 detector, with per-epoch loss and mAP output',
            caption: 'Training the pallet detector in the notebook, with its score climbing pass over pass.',
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
    company: 'Galaxy Instrumentation and Controls Inc',
    role: 'Automation and Controls Engineering Intern',
    dates: 'May 2026 to June 2026',
    tag: 'Automation & Controls',
    description: "This was my first real exposure to industrial automation: the PLCs, SCADA systems, and operator terminals that keep a factory floor running. I worked on CHEP's global rollout of upgraded Factory Management Systems, doing pre-migration verification across roughly 25 plants a week. At each site I connected to the plant server and baselined every layer beneath it, validating communication paths to about 7 Allen-Bradley PLCs, capturing HMI terminal configs in ThinManager, cross-checking device diagnostics in AVEVA SCADA, and confirming the automated pallet inspection systems were still hitting their timing spec. I wrote the verification runbook myself and automated the repetitive parts in Python. Learning to read a controls stack top to bottom, and to tell a network fault apart from a protocol one, is what I took away from it.",
  },
  {
    company: 'TELUS Digital',
    role: 'Bilingual Data Analyst',
    dates: 'March 2026 to June 2026',
    tag: 'Data & AI',
    description: "I evaluated AI-generated geolocation data across English and French, helping train the models behind mapping products used by millions. That meant assessing 80+ search queries weekly across POI accuracy, search relevance, routing quality, and autocomplete, applying structured rubrics while maintaining a ~90% accuracy rate. The bilingual angle was the differentiator: I caught multilingual discrepancies that monolingual reviewers missed, and those signals fed back into model retraining.",
  },
  {
    company: 'Hydroficient',
    role: 'IoT Cyber Defense Extern',
    dates: 'April 2026 to June 2026',
    tag: 'Cybersecurity',
    description: "I secured an IoT sensor pipeline for a simulated 500-room hotel water management system. I designed and stress-tested a 5-layer defense stack (TLS encryption, mutual TLS device authentication, HMAC message signing, timestamp validation, and sequence counters) against attack classes I built myself: eavesdropping, sensor spoofing, and replay attacks. Per-device certificates brought unauthorized broker access to zero, and I trained an Isolation Forest anomaly detection model wired into a real-time Streamlit dashboard so non-technical staff could monitor security without touching a terminal.",
  },
  {
    company: 'UBC Sailbot',
    role: 'Operations Team Member',
    dates: 'September 2025 to April 2026',
    tag: 'Business Operations',
    description: "UBC Sailbot builds a fully autonomous sailing robot: no remote control, no crew. I work on the operations side, connecting electrical, mechanical, and software subteams to keep the project moving. I manage timelines, organize technical documentation for cross-team integration, and own the outward-facing work: sponsor packages, website content, and video production. A social campaign I planned end-to-end grew average engagement by ~80%, supporting a roster of 18 active sponsors.",
  },
  {
    company: 'Independent Haircutting Business',
    role: 'Founder & Operator',
    dates: 'August 2024 to December 2025',
    tag: 'Entrepreneurship',
    description: "This started as a hobby, but once I noticed how many friends were walking around with bad haircuts, the demand clicked and I turned it into a real business. I handled everything: client acquisition, pricing, scheduling, payments, and follow-up. An Excel-based booking and client system pushed retention to ~85% and let referrals run on autopilot. By the time I wrapped up to focus on school, I had served 50+ clients across 350+ appointments and generated over $7,000 in revenue. The biggest lesson: the scariest part of starting something is just starting.",
  },
]

function ExperienceCard({ exp, index, open, onToggle }) {
  const expandable = exp.parts && exp.parts.length > 0
  return (
    <div className={'exp-card' + (open ? ' open' : '')} data-card-id={exp.company}
      style={{ animationDelay: `${0.08 + index * 0.1}s` }}>
      <div className="exp-head">
        <div>
          <h3>{exp.company}</h3>
          <p className="exp-role">{exp.role}</p>
        </div>
        <div className="exp-meta">
          <span className="exp-tag">{exp.tag}</span>
          <span className="exp-dates">{exp.dates}</span>
        </div>
      </div>
      <p className="exp-body">{exp.description}</p>

      {expandable && (
        <>
          <button className="exp-more no-print" onClick={onToggle} aria-expanded={open}>
            <span>{open ? 'Show less' : 'Read the full breakdown'}</span>
            <IconChevron open={open} />
          </button>
          <div className={'proj-body' + (open ? ' expanded' : '')}>
            <div className="exp-expand-inner">
              {exp.parts.map((part) => <PartCard key={part.tag} part={part} />)}
              {exp.links && exp.links.length > 0 && (
                <>
                  <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
          </div>
        </>
      )}
    </div>
  )
}

function ExperiencePage({ onNavigate }) {
  const { openIds, toggle, collapse, activeId } = useCollapsibleCards()

  return (
    <>
    <Page pageKey="experience">
      <div className="page-pad">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="fade-in-up">
            <Eyebrow>Where I&apos;ve been</Eyebrow>
            <h1 className="page-title">Experience</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '2rem' }}>
            {EXPERIENCE.map((exp, i) => (
              <ExperienceCard key={exp.company} exp={exp} index={i}
                open={!!openIds[exp.company]} onToggle={() => toggle(exp.company)} />
            ))}
          </div>
        </div>
        <NextPage label="View Projects" onClick={() => onNavigate('projects')} />
        <Footer />
      </div>
    </Page>
    <CollapseBar activeId={activeId} title={activeId} onCollapse={collapse} />
    </>
  )
}

// ─── Projects data ───────────────────────────────────────────────────────

const MAIN_PROJECTS = [
  {
    id: 'smart-alarm',
    title: 'Smart Alarm',
    year: '2026',
    category: 'Hardware',
    summary: 'An ESP32 bedside alarm clock that tracks your sleep with an onboard accelerometer and wakes you during light sleep instead of at a fixed time. I designed the whole thing: firmware, sleep-staging model, schematic, and PCB.',
    detail: 'Everything runs on the ESP32 itself. No phone, no cloud, no app.',
    thumb: '/projects/smart-alarm-thumb.jpg',
    parts: [
      {
        tag: 'Part 1 · Firmware and interface',
        body: 'A ten-screen menu system covering alarm, smart alarm, sleep data, weather, and settings, all driven by one rotary encoder and one button. The home face pulls NTP time and a 5-day OpenWeatherMap forecast, and repaints only the digits that actually changed, so the display never flickers. Alarm, smart-wake, and snooze settings live in EEPROM and reload on boot.',
        chips: ['ESP32', 'Arduino', 'TFT_eSPI', 'SPI', 'I2C', 'EEPROM'],
        media: [
          {
            src: '/projects/smart-alarm-main.jpg',
            alt: 'Finished Smart Alarm PCB showing time, date, weather and alarm status',
            caption: 'The finished board. Home screen: NTP time, date, live weather, and alarm status, all flicker-free.',
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
        body: 'An MPU-6050 clipped to the mattress logs motion to an SD card at 2 Hz. Every 30 seconds the device pulls 21 statistical features off a ring buffer, scores that window as light or deep sleep, and writes it back out, so the morning hypnogram survives a reboot. I trained a Random Forest on eight hand-labelled nights, roughly 420,000 raw samples, and exported it to C to run entirely on-chip.',
        chips: ['Python', 'scikit-learn', 'micromlgen', 'MPU-6050', 'SD / CSV'],
        media: [
          {
            src: '/projects/smart-alarm-sleep-data.jpg',
            alt: 'Sleep Data screen with a two-lane hypnogram and light/deep totals',
            caption: 'The Sleep Data screen: time asleep, a two-lane hypnogram, and light/deep totals, read back off the SD card.',
          },
        ],
      },
      {
        tag: 'Part 3 · Schematic and PCB',
        body: 'The first version lived on two breadboards with the display taped to the front. Once the pinout stopped changing I redrew it in Altium as a two-layer board, with every peripheral broken out to a labelled header so modules stay swappable, and had it fabricated. Same firmware, considerably less wire.',
        chips: ['Altium Designer', 'Schematic Capture', 'PCB Layout'],
        media: [
          {
            src: '/projects/smart-alarm-breadboard.jpg',
            alt: 'The original two-breadboard prototype running the same firmware',
            caption: 'Where it started. Same firmware, same home screen, considerably more wire.',
          },
          {
            src: '/projects/smart-alarm-schematic.jpg',
            alt: 'Altium schematic split into passive, active, and microcontroller blocks',
            caption: 'The schematic, organised into passive components, active components, and the ESP32 itself.',
          },
          {
            src: '/projects/smart-alarm-pcb-layout.jpg',
            alt: 'Two-layer PCB layout with labelled peripheral headers',
            caption: 'Two-layer layout. Every peripheral breaks out to a labelled header so modules stay swappable.',
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
      'Rings early at the first stretch of light sleep inside a window you choose, at one of three sensitivity levels, and falls back to the exact alarm time if that moment never comes',
      'The Random Forest hit 65% accuracy but only 0.19 recall on deep sleep, so I did not ship it as the displayed stage. Mattress motion alone barely separates deep from light: median peak deviation was 140 versus 142',
      'Shipped an actigraphy-style sleep-cycle model instead, using ~90 minute cycles where any movement forces light sleep. It produces 20 to 27% deep sleep, in line with published norms, and the Random Forest vote is still logged every window so the comparison stays honest',
      'Roughly 1,100 lines of firmware plus a 1.4 MB generated classifier, which is why the board needs the 3 MB huge_app partition instead of the default 1.3 MB one',
      'A 150 ms debounce plus a 400 ms hard lockout on the back button, and an external pull-up on the input-only encoder pin. Both problems surfaced on the breadboard and went straight into the schematic',
      'SD files open once on entering sleep mode and close once on exit. An earlier version reopened them on every write and corrupted the card, so that rule is now enforced by the architecture',
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
    summary: 'A full-stack ETF portfolio decomposer that breaks any portfolio down into its true underlying holdings, with live prices, sector and geographic exposure, and saved user accounts.',
    detail: 'Built first as a Python CLI, then rebuilt entirely as a production web application deployed at portfoliovision.online.',
    parts: [
      {
        tag: 'Part 1 · Python CLI',
        body: 'Full-featured terminal decomposer with recursive ETF unwrapping, mixed USD/CAD currency detection, tabular holdings output with sector and geographic breakdowns, and a captured/untracked coverage summary. Handles circular references and depth capping.',
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
        body: 'Production web application with live stock prices via a Yahoo Finance proxy, Google OAuth and OTP email authentication via Supabase, saved portfolios with per-user row-level security, a USD/CAD display toggle with real-time Frankfurter API conversion, and Logo.dev company logo resolution. Deployed on Vercel with analytics.',
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
      'Recursive ETF decomposition across 500+ tickers with configurable depth cap and circular reference protection',
      'Live price fetching across US and Canadian exchanges (TSX, NEO, CSE) through a Vercel serverless proxy to Yahoo Finance, removing API key requirements and exchange restrictions',
      'Google OAuth and OTP email auth via Supabase with row-level security policies per user',
      'Real-time USD/CAD conversion via Frankfurter API with per-position and display-level currency toggling',
      '400+ page views in the first week of launch, tracked via Vercel Analytics',
      'Deployed end-to-end on Vercel with a custom domain and environment-based secrets management',
    ],
    links: [
      { href: 'https://www.portfoliovision.online/', label: 'portfoliovision.online', primary: true, external: true },
      { href: 'https://github.com/AustinZhai8/Portfolio-Vision-Web', label: 'Web App' },
      { href: 'https://github.com/AustinZhai8/Portfolio-Vision-Py', label: 'Python CLI' },
    ],
    images: [],
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    year: '2026',
    category: 'Software',
    summary: 'Designed, built, and deployed austinzhai.com end to end. A Vite + React SPA with a refined dark theme, scroll-triggered reveals, and a print-optimized projects page.',
    detail: 'Full CI/CD via GitHub and Vercel, with the custom domain and DNS configured from scratch.',
    parts: [],
    skills: [
      { label: 'Languages', chips: ['JavaScript', 'HTML', 'CSS'] },
      { label: 'Frameworks', chips: ['React', 'Tailwind CSS', 'Vite'] },
      { label: 'Tools', chips: ['Git', 'GitHub', 'Vercel', 'Domain Setup'] },
    ],
    highlights: [
      'End-to-end ownership: design, build, deploy, domain setup',
      'Sub-100KB JS bundle with under 1s LCP on cold load',
      'Projects page prints as a clean, resume-style document via dedicated print CSS',
      'Continuous deployment through a GitHub to Vercel pipeline',
    ],
    links: [
      { href: 'https://austinzhai.com', label: 'austinzhai.com', primary: true, external: true },
      { href: 'https://github.com/AustinZhai8/personal-website', label: 'GitHub' },
    ],
    images: [],
  },
]

const MINOR_HARDWARE = [
  {
    id: 'sonar',
    title: 'Servo Sonar Radar',
    year: '2026',
    description: 'A servo-mounted ultrasonic sensor sweeps 180° to detect objects across three modes: continuous sweep, detection-triggered pause, and manual joystick control. Detected objects are visualized on a real-time radar display rendered in Processing.',
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
    year: '2026',
    description: 'An ESP32-based access control system combining RFID card scanning and keypad password entry to control a servo-actuated gate, with an I2C LCD display for real-time status feedback and LED/buzzer alerts for granted and denied access events.',
    chips: ['ESP32', 'RFID', 'SPI', 'I2C', 'Servo Control', 'Embedded Systems'],
    links: [{ href: 'https://github.com/AustinZhai8/Smart-Gate-Access-System', label: 'GitHub' }],
    images: [{ src: '/projects/smart-gate-2.jpg', alt: 'Smart Gate Access System', w: 'auto' }],
  },
]

const MINOR_SOFTWARE = [
  {
    id: 'stock-predictor',
    title: 'Stock Predictor',
    year: '2026',
    description: 'A Random Forest classifier that predicts next-day S&P 500 direction (up or down) from historical price and volume data pulled via yfinance. Trained and backtested in a Jupyter notebook, reaching a precision score of about 0.58 on held-out data.',
    chips: ['Python', 'scikit-learn', 'pandas', 'Jupyter'],
    links: [{ href: 'https://github.com/AustinZhai8/Stock-Predictor', label: 'GitHub' }],
    images: [],
  },
  {
    id: 'hangman',
    title: 'Hangman',
    year: '2026',
    description: 'A command-line implementation of the classic word-guessing game. Players choose a difficulty, then guess letters or the full word with 6 lives. Draws from a curated word list per difficulty and tracks guessed letters to prevent duplicates.',
    chips: ['Python', 'CLI'],
    links: [{ href: 'https://github.com/AustinZhai8/Hangman', label: 'GitHub' }],
    images: [],
  },
  {
    id: 'password-manager',
    title: 'Random Password Manager',
    year: '2026',
    description: 'A command-line Python password manager that stores, retrieves, and deletes credentials locally. A built-in generator guarantees variety across uppercase, lowercase, digits, and symbols on every run. Data persists via a local JSON file.',
    chips: ['Python', 'JSON', 'CLI'],
    links: [{ href: 'https://github.com/AustinZhai8/Random-Password-Manager', label: 'GitHub' }],
    images: [],
  },
]

// ─── Expandable main project card ───────────────────────────────────────

function MainProjectCard({ p, open, onToggle }) {
  return (
    <div className={'proj-card' + (open ? ' open' : '')} data-card-id={p.id}>
      <button className="proj-summary" onClick={onToggle} aria-expanded={open}>
        <div className="proj-summary-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="proj-year">{p.year}</span>
            <span className="proj-cat">{p.category}</span>
          </div>
          <h2 className="proj-title">{p.title}</h2>
          <p className="proj-blurb">{p.summary}</p>
        </div>
        {p.thumb && (
          <div className="proj-thumb no-print">
            {/* decorative: the same shot appears with full alt text in the gallery below */}
            <img src={p.thumb} alt="" loading="lazy" />
          </div>
        )}
        <span className="proj-toggle no-print"><IconChevron open={open} /></span>
      </button>

      <div className={'proj-body' + (open ? ' expanded' : '')}>
        <div className="proj-body-inner">
          {p.detail && <p className="proj-detail">{p.detail}</p>}

          {p.parts && p.parts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
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

          <div style={{ marginBottom: '20px' }}>
            <div className="mini-label">Highlights</div>
            {p.highlights.map((h, i) => (
              <div key={i} className="highlight-row" style={{ borderBottom: i < p.highlights.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span className="fact-arrow">→</span>
                {h}
              </div>
            ))}
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: p.images.length ? '20px' : 0 }}>
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={l.primary ? 'pill-primary' : 'pill-ghost'}>
                {l.external ? <IconExternal /> : <IconGithub size={12} />} {l.label}
              </a>
            ))}
          </div>
          <div className="print-links print-only">
            {p.links.map((l) => <div key={l.href}>{l.label}: {l.href}</div>)}
          </div>

          {p.images.length > 0 && (
            <div className="proj-images">
              {p.images.map((img) => (
                <div key={img.src} className="proj-img-frame">
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Minor project entry (expandable row) ───────────────────────────────

function MinorEntry({ p, open, onToggle, isLast }) {
  return (
    <div className="minor-entry" data-card-id={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
      <button className="minor-head" onClick={onToggle} aria-expanded={open}>
        <span className="minor-title">{p.title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="minor-year">{p.year}</span>
          <span className="no-print" style={{ color: 'var(--text3)' }}><IconChevron open={open} /></span>
        </span>
      </button>
      <div className={'proj-body' + (open ? ' expanded' : '')}>
        <div className="proj-body-inner" style={{ paddingTop: '4px' }}>
          <p className="minor-desc">{p.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
            {p.chips.map((c) => <Chip key={c} label={c} />)}
          </div>
          {p.images.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {p.images.map((img) => (
                <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="minor-img"
                  style={{ width: img.w === 'auto' ? 'auto' : `${img.w}px` }} />
              ))}
            </div>
          )}
          <div className="no-print" style={{ display: 'flex', gap: '14px' }}>
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="minor-link">
                <IconGithub size={12} /> {l.label}
              </a>
            ))}
          </div>
          <div className="print-links print-only">
            {p.links.map((l) => <div key={l.href}>{l.label}: {l.href}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Projects page ───────────────────────────────────────────────────────

function ProjectsPage({ onNavigate }) {
  const { openIds, toggle, collapse, activeId } = useCollapsibleCards()
  const ref = useRef(null)
  useScrollReveal(ref)
  const activeTitle = [...MAIN_PROJECTS, ...MINOR_HARDWARE, ...MINOR_SOFTWARE]
    .find((p) => p.id === activeId)?.title

  return (
    <>
    <Page pageKey="projects">
      <div ref={ref} className="page-pad">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="fade-in-up" style={{ marginBottom: '2.5rem' }}>
            <Eyebrow>What I&apos;ve built</Eyebrow>
            <h1 className="page-title">Projects</h1>
            <p className="print-only print-name">Austin Zhai · austinzhai.com · github.com/AustinZhai8</p>
          </div>

          <div className="reveal">
            <p className="sub-heading">Main Projects</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {MAIN_PROJECTS.map((p) => (
                <MainProjectCard key={p.id} p={p} open={!!openIds[p.id]} onToggle={() => toggle(p.id)} />
              ))}
            </div>
          </div>

          <div className="reveal" style={{ marginTop: '3.5rem' }}>
            <p className="sub-heading">Minor Projects</p>

            <p className="sub-sub-heading">Hardware / Firmware</p>
            <div className="minor-group">
              {MINOR_HARDWARE.map((p, i) => (
                <MinorEntry key={p.id} p={p} open={!!openIds[p.id]} onToggle={() => toggle(p.id)} isLast={i === MINOR_HARDWARE.length - 1} />
              ))}
            </div>

            <p className="sub-sub-heading" style={{ marginTop: '2.2rem' }}>Software</p>
            <div className="minor-group">
              {MINOR_SOFTWARE.map((p, i) => (
                <MinorEntry key={p.id} p={p} open={!!openIds[p.id]} onToggle={() => toggle(p.id)} isLast={i === MINOR_SOFTWARE.length - 1} />
              ))}
            </div>
          </div>
        </div>

        <NextPage label="Back to Home" onClick={() => onNavigate('home')} />
        <Footer />
      </div>
    </Page>
    <CollapseBar activeId={activeId} title={activeTitle} onCollapse={collapse} />
    </>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────

const PAGES = { home: HomePage, about: AboutPage, experience: ExperiencePage, projects: ProjectsPage }

export default function App() {
  const initial = (() => {
    const h = window.location.hash.replace('#', '')
    return PAGES[h] ? h : 'home'
  })()
  const [page, setPage] = useState(initial)

  const navigate = (id) => {
    setPage(id)
    try { history.replaceState(null, '', '#' + id) } catch { /* no-op */ }
  }

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '')
      if (PAGES[h]) setPage(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Current = PAGES[page]
  return (
    <>
      <Nav page={page} onNavigate={navigate} />
      <Current onNavigate={navigate} />
    </>
  )
}
