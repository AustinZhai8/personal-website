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
            <p className="hero-sub">Computer Engineering student at UBC who likes to build things.</p>
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
              'Mavericks and Patriots fan',
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
    company: 'AdvancedUAV Tech',
    role: 'Electronics Engineering Intern',
    dates: 'June 2026 to Present',
    tag: 'Hardware Engineering',
    description: 'Working on drone electronics. More to share soon.',
  },
  {
    company: 'Galaxy Instrumentation and Controls Inc',
    role: 'Operational Technology Engineering Intern',
    dates: 'May 2026 to June 2026',
    tag: 'Engineering',
    description: "I support CHEP's Perfect Plant initiative, a global rollout of upgraded Factory Management Systems across 750+ manufacturing sites. I audit the OT infrastructure at each plant before and after migration: remotely connecting to FMS servers and verifying the network state of every device on site, from Allen-Bradley PLCs and HMIs to ADI data integration units and the SQL databases underneath. I work through roughly 25 sites a week with RSLinx, AVEVA SCADA, ThinManager, Radmin, and SQL Server Management Studio, and I built a Python script integrated with Power Automate that cut audit setup time by about 15%. It is the first role where I have worked directly with the systems that actually run factory floors.",
  },
  {
    company: 'TELUS Digital',
    role: 'Bilingual Data Analyst',
    dates: 'March 2026 to June 2026',
    tag: 'Data & AI',
    description: "I evaluate AI-generated geolocation data across English and French, helping train the models behind mapping products used by millions. That means assessing 80+ search queries weekly across POI accuracy, search relevance, routing quality, and autocomplete, applying structured rubrics while maintaining a ~90% accuracy rate. The bilingual angle is the differentiator: I catch multilingual discrepancies that monolingual reviewers miss, and those signals feed back into model retraining.",
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

function ExperienceCard({ exp, index }) {
  return (
    <div className="exp-card" style={{ animationDelay: `${0.08 + index * 0.1}s` }}>
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
    </div>
  )
}

function ExperiencePage({ onNavigate }) {
  return (
    <Page pageKey="experience">
      <div className="page-pad">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="fade-in-up">
            <Eyebrow>Where I&apos;ve been</Eyebrow>
            <h1 className="page-title">Experience</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '2rem' }}>
            {EXPERIENCE.map((exp, i) => (
              <ExperienceCard key={exp.company} exp={exp} index={i} />
            ))}
          </div>
        </div>
        <NextPage label="View Projects" onClick={() => onNavigate('projects')} />
        <Footer />
      </div>
    </Page>
  )
}

// ─── Projects data ───────────────────────────────────────────────────────

const MAIN_PROJECTS = [
  {
    id: 'portfolio-vision',
    title: 'Portfolio Vision',
    year: '2026',
    category: 'Software',
    summary: 'A full-stack ETF portfolio decomposer that breaks any portfolio down into its true underlying holdings, with live prices, sector and geographic exposure, and saved user accounts.',
    detail: 'Built first as a Python CLI, then rebuilt entirely as a production web application deployed at portfoliovision.online.',
    parts: [
      {
        tag: 'Part 1 · Python CLI',
        body: 'Full-featured terminal decomposer with recursive ETF unwrapping, mixed USD/CAD currency detection, tabular holdings output with sector and geographic breakdowns, and a captured/untracked coverage summary. Handles circular references and depth capping.',
        chips: ['Python', 'CLI', 'JSON'],
      },
      {
        tag: 'Part 2 · Web App',
        body: 'Production web application with live stock prices via a Yahoo Finance proxy, Google OAuth and OTP email authentication via Supabase, saved portfolios with per-user row-level security, a USD/CAD display toggle with real-time Frankfurter API conversion, and Logo.dev company logo resolution. Deployed on Vercel with analytics.',
        chips: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'Google Cloud', 'Vercel'],
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
    images: [
      { src: '/projects/pv-cli.png', alt: 'Portfolio Vision Python CLI' },
      { src: '/screenshot.png', alt: 'Portfolio Vision web app' },
    ],
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
    <div className={'proj-card' + (open ? ' open' : '')}>
      <button className="proj-summary" onClick={onToggle} aria-expanded={open}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="proj-year">{p.year}</span>
            <span className="proj-cat">{p.category}</span>
          </div>
          <h2 className="proj-title">{p.title}</h2>
          <p className="proj-blurb">{p.summary}</p>
        </div>
        <span className="proj-toggle no-print"><IconChevron open={open} /></span>
      </button>

      <div className={'proj-body' + (open ? ' expanded' : '')}>
        <div className="proj-body-inner">
          {p.detail && <p className="proj-detail">{p.detail}</p>}

          {p.parts && p.parts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {p.parts.map((part) => (
                <div key={part.tag} className="part-card">
                  <div className="part-tag">{part.tag}</div>
                  <div className="part-body">{part.body}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {part.chips.map((c) => <Chip key={c} label={c} />)}
                  </div>
                </div>
              ))}
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
    <div className="minor-entry" style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
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
  const [openIds, setOpenIds] = useState({})
  const toggle = (id) => setOpenIds((s) => ({ ...s, [id]: !s[id] }))
  const ref = useRef(null)
  useScrollReveal(ref)

  return (
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

            <p className="sub-sub-heading" style={{ marginTop: '2.2rem' }}>Minor Software Projects</p>
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
