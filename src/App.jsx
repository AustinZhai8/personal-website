import { useState, useEffect, useRef } from 'react'

// ─── Icons ─────────────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 19 5 12"/>
    </svg>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Resume', id: 'resume' },
  ]

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => handleNav('home')}
          className="text-lg font-bold tracking-tight transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
        >
          Austin <span style={{ color: 'var(--accent)' }}>Zhai</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="nav-link"
              style={{ color: activePage === id ? 'var(--accent)' : undefined }}
            >
              {label}
              {activePage === id && (
                <span style={{
                  position: 'absolute', bottom: -3, left: 0,
                  width: '100%', height: '1.5px',
                  background: 'var(--accent)',
                }} />
              )}
            </button>
          ))}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMenuOpen(o => !o)} className="flex flex-col gap-1.5 p-1" aria-label="Menu">
            <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: 'var(--text-primary)', transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
            <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: 'var(--text-primary)', opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 transition-all duration-200" style={{ backgroundColor: 'var(--text-primary)', transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-4" style={{ backgroundColor: 'var(--nav-bg)' }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => handleNav(id)} className="nav-link text-left py-1" style={{ color: activePage === id ? 'var(--accent)' : undefined }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Next Page Button ──────────────────────────────────────────────────────────

function NextPageButton({ label, onClick }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0 5rem' }}>
      <button onClick={onClick} className="btn-primary">{label}</button>
    </div>
  )
}

// ─── Page Wrapper ──────────────────────────────────────────────────────────────

function PageWrapper({ children, pageKey }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [pageKey])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}

// ─── Home Page ─────────────────────────────────────────────────────────────────

function HomePage({ loaded, onNavigate }) {
  return (
    <PageWrapper pageKey="home">
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-12">
        <div className={loaded ? 'main-animate flex flex-col items-center gap-6' : 'opacity-0 flex flex-col items-center gap-6'}>
          <div className="relative">
            <img
              src="/Headshot.JPG"
              alt="Austin Zhai"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover object-top"
              style={{ border: '2px solid var(--card-border)' }}
            />
          </div>

          <div>
            <h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Hi, I&apos;m <span style={{ color: 'var(--accent)' }}>Austin</span>!
            </h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Computer Engineering Student at UBC that likes to build stuff.
            </p>
          </div>

          <a href="mailto:austinhzhai@gmail.com" className="btn-primary mt-1">
            Let&apos;s connect!
          </a>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="mailto:austinhzhai@gmail.com" className="btn-social">
              <EmailIcon />
              austinhzhai@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/austin-zhai/" target="_blank" rel="noopener noreferrer" className="btn-social">
              <LinkedInIcon />
              LinkedIn
            </a>
          </div>

          <button
            onClick={() => onNavigate('about')}
            className="mt-8 flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 group"
            style={{
              border: '1.5px solid var(--card-border)',
              color: 'var(--text-muted)',
            }}
            aria-label="Go to About"
          >
            <span className="text-xs tracking-widest uppercase font-semibold group-hover:text-accent" style={{ color: 'inherit' }}>Explore</span>
            <ArrowDownIcon />
          </button>
        </div>
      </section>
    </PageWrapper>
  )
}

// ─── About Page ────────────────────────────────────────────────────────────────

function useScrollFade(ref) {
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
      { threshold: 0.12 }
    )
    ref.current.querySelectorAll('.fade-section').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

function AboutPage({ onNavigate }) {
  const containerRef = useRef(null)
  useScrollFade(containerRef)

  const screenBase = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '6rem 1.5rem',
    position: 'relative',
    textAlign: 'center',
  }

  return (
    <PageWrapper pageKey="about">
      <div ref={containerRef}>

        {/* ── SCREEN 0: Convexity hero ── */}
        <div style={screenBase}>
          <p
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            One word that describes my mindset
          </p>
          <h1
            className="font-black select-none"
            style={{
              fontSize: 'clamp(4.25rem, 15.3vw, 13.6rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: 'var(--text-primary)',
            }}
          >
            Convexity
          </h1>
          <p
            className="mt-8 text-base md:text-lg max-w-sm mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Asymmetric outcomes. Limited downside. Unlimited upside.
          </p>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35">
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>scroll</span>
            <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
          </div>
        </div>

        {/* ── SCREEN 1: The Idea ── */}
        <div className="fade-section" style={{ ...screenBase, opacity: 0, transform: 'translateY(36px)', transition: 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <p className="text-xs tracking-[0.28em] uppercase font-semibold mb-10" style={{ color: 'var(--text-muted)' }}>
            The Idea
          </p>
          <p
            className="font-bold max-w-2xl mx-auto mb-6"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            The more you put in, the faster the returns grow.
          </p>
          <p
            className="text-xl font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            Effort compounds.
          </p>
        </div>

        {/* ── SCREEN 2: Middle thought ── */}
        <div className="fade-section" style={{ ...screenBase, opacity: 0, transform: 'translateY(36px)', transition: 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <p
            className="font-medium max-w-3xl mx-auto"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              color: 'var(--text-primary)',
            }}
          >
            Where small risks in your decision making can lead to immense upside.
          </p>
        </div>

        {/* ── SCREEN 3: Closing ── */}
        <div className="fade-section" style={{ ...screenBase, opacity: 0, transform: 'translateY(36px)', transition: 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <p
            className="font-bold max-w-3xl mx-auto mb-4"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            I would always take that risk
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--accent)',
            }}
          >
            and choose the convex path.
          </p>
        </div>

        {/* ── DIVIDER ── */}
        <div className="fade-section flex items-center gap-6 px-6 max-w-3xl mx-auto py-8">
          <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>About Me</span>
          <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
        </div>

        {/* ── BIO ── */}
        <div className="fade-section max-w-3xl mx-auto px-6 py-16 text-center">
          <p
            className="text-xl md:text-2xl font-medium leading-relaxed"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
          >
            UBC Computer Engineering student who spends way too much time on business student activities.
            Somewhere along the way that turned into a genuine interest in where hardware meets software.
          </p>
        </div>

        {/* ── HOBBIES ── */}
        <div className="fade-section max-w-3xl mx-auto px-6 pb-16">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
            Hobbies
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Finance / Investing', 'Basketball', 'Gym', 'Piano'].map((label) => (
              <span
                key={label}
                className="text-sm font-medium"
                style={{
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.25rem',
                  background: 'var(--bg-primary)',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── QUICK FACTS ── */}
        <div className="fade-section max-w-3xl mx-auto px-6 pb-16">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
            Quick Facts
          </p>
          <div
            className="rounded-2xl p-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}
          >
            {[
              '3.5 languages: English, French, Chinese, and a little Spanish',
              'Newjeans is tuff',
              'Lanzhou noodles are the best',
              'Mavericks and Patriots fan',
            ].map((fact) => (
              <div key={fact} className="flex items-start gap-4 py-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1.3rem', fontWeight: '700', marginTop: '0px', flexShrink: 0, lineHeight: '1' }}>→</span>
                <p className="text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>{fact}</p>
              </div>
            ))}
          </div>
        </div>

        <NextPageButton label="View Experience" onClick={() => onNavigate('experience')} />
      </div>
    </PageWrapper>
  )
}

// ─── Experience Page ───────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: 'TELUS Digital',
    role: 'Bilingual Online Data Analyst',
    dates: 'March 2026 – Present',
    tag: 'Data & AI',
    description: `I work with TELUS Digital evaluating AI-generated geolocation data across English and French, helping train the models that power mapping products used by millions of people. Day to day, that means assessing search result relevance, POI accuracy, routing quality, and autocomplete suggestions, applying structured rubrics to catch what models miss. The bilingual angle is a real differentiator: I flag multilingual discrepancies that monolingual reviewers can't catch, feeding those signals back into model retraining cycles. It's precise, pattern-heavy work that's taught me a lot about how large-scale AI systems actually get refined.`,
  },
  {
    company: 'UBC Sailbot',
    role: 'Operations Team Member',
    dates: 'September 2025 – Present',
    tag: 'Business Operations',
    description: `UBC Sailbot builds a fully autonomous sailing robot: no remote control, no crew. My role is on the operations side, which means connecting across electrical, mechanical, and software subteams to keep the project moving. I manage timelines, organize technical documentation for cross-subteam integration, and handle the outward-facing side: sponsor packages, website content, graphic design, and video production. I took ownership of our social media presence and grew average engagement by 50 to 100% through a campaign I planned and executed end-to-end. It's taught me that engineering teams run on communication just as much as code.`,
  },
  {
    company: 'Independent Haircutting Business',
    role: 'Founder & Operator',
    dates: 'August 2024 – December 2025',
    tag: 'Entrepreneurship',
    description: `I started this business because I saw a convex opportunity: low startup cost, immediate market (friends, then referrals), and the chance to learn how to actually run something. I handled everything: client acquisition, pricing, scheduling, payments, hygiene standards, and follow-up. I built a digital management system to handle bookings and track clients, which brought my retention rate to 85% and let the referral loop run on autopilot. By the time I wrapped up to focus on school, I had served 50+ clients and generated over $7,000 in revenue. More than the money, it proved to me that the scariest part of starting something is usually just starting.`,
  },
]

function ExperienceCard({ company, role, dates, tag, description, index }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="fade-section exp-card rounded-2xl p-7 md:p-10"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {company}
          </h3>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {role}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
          >
            {tag}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dates}</span>
        </div>
      </div>
      <p className="text-sm md:text-base leading-8" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  )
}

function ExperiencePage({ onNavigate }) {
  const containerRef = useRef(null)
  useScrollFade(containerRef)

  return (
    <PageWrapper pageKey="experience">
      <div ref={containerRef} className="pt-28 pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="fade-section">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              Where I&apos;ve been
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-8"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Experience
            </h1>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {EXPERIENCE.map((exp, i) => (
              <ExperienceCard key={exp.company} {...exp} index={i} />
            ))}
          </div>
        </div>
      </div>
      <NextPageButton label="View Projects" onClick={() => onNavigate('projects')} />
    </PageWrapper>
  )
}

// ─── Projects Page ─────────────────────────────────────────────────────────────

function ProjectsPage({ onNavigate }) {
  const containerRef = useRef(null)
  useScrollFade(containerRef)

  return (
    <PageWrapper pageKey="projects">
      <div ref={containerRef} className="pt-28 pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="fade-section">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              What I&apos;ve built
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-8"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Projects
            </h1>
          </div>

          <div
            className="rounded-2xl flex flex-col items-center justify-center text-center fade-section"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--card-border)',
              minHeight: '300px',
              padding: '4rem 2rem',
            }}
          >
            <p className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Coming soon.
            </p>
            <p className="text-sm max-w-xs leading-6" style={{ color: 'var(--text-muted)' }}>
              Projects are in the works. Check back soon.
            </p>
          </div>
        </div>
      </div>
      <NextPageButton label="View Resume" onClick={() => onNavigate('resume')} />
    </PageWrapper>
  )
}

// ─── Resume Page ───────────────────────────────────────────────────────────────

function ResumePage() {
  const containerRef = useRef(null)
  useScrollFade(containerRef)

  return (
    <PageWrapper pageKey="resume">
      <div ref={containerRef} className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2 fade-section">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
                Full history
              </p>
              <h1
                className="text-4xl md:text-5xl font-extrabold mb-8"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                Resume
              </h1>
            </div>
            <a
              href="/Austin Zhai Resume - Google Docs.pdf"
              download
              className="btn-social mt-10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden fade-section" style={{ border: '1px solid var(--card-border)' }}>
            <iframe
              src="/Austin Zhai Resume - Google Docs.pdf"
              className="w-full"
              style={{ height: '88vh', display: 'block' }}
              title="Austin Zhai Resume"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center text-xs"
      style={{
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--card-border)',
        background: 'var(--bg-primary)',
      }}
    >
      <p>© {new Date().getFullYear()} Austin Zhai</p>
    </footer>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [mainLoaded, setMainLoaded] = useState(false)
  const [activePage, setActivePage] = useState('home')

  useEffect(() => {
    const t = setTimeout(() => setMainLoaded(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-section').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activePage])

  const navigate = (page) => setActivePage(page)

  const pages = {
    home: <HomePage loaded={mainLoaded} onNavigate={navigate} />,
    about: <AboutPage onNavigate={navigate} />,
    experience: <ExperiencePage onNavigate={navigate} />,
    projects: <ProjectsPage onNavigate={navigate} />,
    resume: <ResumePage />,
  }

  return (
    <>
      <Navbar activePage={activePage} onNavigate={navigate} />
      <main>{pages[activePage]}</main>
      <Footer />
    </>
  )
}
