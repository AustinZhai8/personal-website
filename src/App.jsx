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

function GithubIconNav() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
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
              className="rounded-full object-cover object-top w-[194px] h-[194px] md:w-[238px] md:h-[238px]"
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

          <a href="https://www.linkedin.com/in/austin-zhai/" target="_blank" rel="noopener noreferrer" className="btn-primary mt-1">
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
            <a href="https://github.com/AustinZhai8" target="_blank" rel="noopener noreferrer" className="btn-social">
              <GithubIconNav />
              GitHub
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
        <div className="fade-section" style={screenBase}>
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
        <div className="fade-section" style={screenBase}>
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

        {/* ── INVESTING ── */}
        <div className="fade-section flex items-center gap-6 px-6 max-w-3xl mx-auto py-8">
          <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Investing</span>
          <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
        </div>

        <div className="fade-section max-w-4xl mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-5" style={{ color: 'var(--text-muted)' }}>
              Where it all started
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold mb-6"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Investing isn&apos;t just a hobby, it&apos;s the thread that ties everything together.
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              I spend a lot of time on fundamentals research: tracking key metrics, waiting on earnings, checking year-over-year growth, pulling apart business models, and building conviction one company at a time. The analytical side, the patient, evidence-based kind of investing, is what I love. Every position I hold is a thesis I can defend.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              That passion is actually what pulled me toward Computer Engineering. The goal is straightforward: work for a company I believe in enough to own, and build the products from the inside.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['wealthsimple', 'blossom'].map((name) => (
              <div
                key={name}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}
              >
                <img
                  src={`/${name}.png`}
                  alt={`${name} portfolio screenshot`}
                  loading="lazy"
                  style={{ display: 'block', width: '100%', maxHeight: '420px', objectFit: 'contain', background: 'var(--bg-secondary)' }}
                />
              </div>
            ))}
          </div>

          <p className="text-sm md:text-base text-center mt-8" style={{ color: 'var(--text-muted)' }}>
            Here&apos;s my{' '}
            <a
              href="https://link.blossomsocial.com/7uYa/kos58964"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', fontWeight: 600 }}
            >
              Blossom
            </a>
            {' '}if you have it and want to connect.
          </p>
        </div>

        {/* ── HOBBIES ── */}
        <div className="fade-section max-w-3xl mx-auto px-6 pb-16">
          <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
            Hobbies
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Basketball', 'Gym', 'Piano', 'Video Games'].map((label) => (
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
              'Newjeans and Laroi are fire',
              'Lanzhou handpulled noodles are my all time favorite dish',
              'Mavericks and Patriots fan',
              'Hit top 2% in League and top 1% in Valorant',
              'Top 0.7% performing TFSA',
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
    company: 'AdvancedUAV Tech',
    role: 'Electronics Engineering Intern',
    dates: 'June 2026 – Present',
    tag: 'Hardware Engineering',
    description: `drone.`,
  },
  {
    company: 'Galaxy Instrumentation and Controls Inc',
    role: 'Operational Technology Engineering Intern',
    dates: 'May 2026 – June 2026',
    tag: 'Engineering',
    description: `I joined Galaxy Instrumentation supporting CHEP's Perfect Plant initiative, a global rollout of upgraded Factory Management Systems across 750+ manufacturing sites. My job is to audit the OT infrastructure at each plant before and after migration, which means remotely connecting to FMS servers and verifying the network state of every device on site: Allen-Bradley PLCs, HMIs, ADI data integration units, and the underlying SQL databases that tie it all together. I work through roughly 25 sites a week, using RSLinx Classic Lite, AVEVA SCADA, ThinManager, Radmin, and SQL Server Management Studio to document configurations and flag anything that looks off. I also built a Python script integrated with Power Automate to automate the repetitive file navigation that comes with auditing at this scale, cutting setup time by about 15%. It is the first role where I have worked directly with industrial automation systems, and the gap between what gets taught in first-year engineering and what actually runs factory floors is larger than I expected.`,
  },
  {
    company: 'TELUS Digital',
    role: 'Bilingual Data Analyst',
    dates: 'March 2026 – June 2026',
    tag: 'Data & AI',
    description: `I work with TELUS Digital evaluating AI-generated geolocation data across English and French, helping train the models that power mapping products used by millions of people. Day to day, that means assessing 80+ search queries weekly across POI accuracy, search result relevance, routing quality, and autocomplete suggestions, applying structured rubrics to catch what models miss while maintaining a ~90% accuracy rate. The bilingual angle is a real differentiator: I flag multilingual discrepancies that monolingual reviewers can't catch, feeding those signals back into model retraining cycles. It's precise, pattern-heavy work that's taught me a lot about how large-scale AI systems actually get refined.`,
  },
  {
    company: 'Hydroficient',
    role: 'IoT Cyber Defense Extern',
    dates: 'April 2026 – June 2026',
    tag: 'Cybersecurity',
    description: `I worked with Hydroficient securing an IoT sensor pipeline for a simulated 500-room hotel water management system. That meant designing and stress-testing a 5-layer defense stack (TLS encryption, mutual TLS device authentication, HMAC message signing, timestamp validation, and sequence counters) against live attack classes I built myself: eavesdropping, sensor spoofing, and replay attacks. I reduced unauthorized broker access to zero by configuring per-device certificates and producing a formal provisioning policy. On top of that, I trained an Isolation Forest anomaly detection model on live telemetry and wired it into a real-time Streamlit dashboard so non-technical staff could monitor system security without touching a terminal. It's the most end-to-end security work I've done, and it changed how I think about trust in connected systems.`,
  },
  {
    company: 'UBC Sailbot',
    role: 'Operations Team Member',
    dates: 'September 2025 – April 2026',
    tag: 'Business Operations',
    description: `UBC Sailbot builds a fully autonomous sailing robot: no remote control, no crew. My role is on the operations side, which means connecting across electrical, mechanical, and software subteams to keep the project moving. I manage timelines, organize technical documentation for cross-subteam integration, and handle the outward-facing side: sponsor packages, website content, graphic design, and video production. I took ownership of our social media presence and grew average engagement by ~80% through a campaign I planned and executed end-to-end, contributing to a sponsorship roster of 18 active partners. It's taught me that engineering teams run on communication just as much as code.`,
  },
  {
    company: 'Independent Haircutting Business',
    role: 'Founder & Operator',
    dates: 'August 2024 – December 2025',
    tag: 'Entrepreneurship',
    description: `I started this purely for fun, but once I noticed how often my friends were walking around with bad haircuts, the scale and demand of the industry clicked. I took advantage of that gap and turned it into a real business. I handled everything: client acquisition, pricing, scheduling, payments, hygiene standards, and follow-up. I built an Excel-based management system to handle bookings and track clients, which brought my retention rate to ~85% and let the referral loop run on autopilot. By the time I wrapped up to focus on school, I had served 50+ clients across 350+ appointments and generated over $7,000 in revenue. More than the money, it proved to me that the scariest part of starting something is usually just starting.`,
  },
]

function ExperienceCard({ company, role, dates, tag, description, index }) {
  return (
    <div
      className="exp-card rounded-2xl p-7 md:p-10"
      style={{
        opacity: 0,
        animation: `fadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        animationDelay: `${0.1 + index * 0.12}s`,
      }}
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
  return (
    <PageWrapper pageKey="experience">
      <div className="pt-28 pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div style={{ opacity: 0, animation: 'fadeUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s forwards' }}>
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

const GithubIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
)

const ExternalLinkIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

function ProjectChip({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: '999px',
      fontSize: '11px', fontWeight: 500,
      border: '1px solid var(--card-border)',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

const ACCENT_BLUE = '#6db8f0'

function CategoryChip({ label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 9px', borderRadius: '999px',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.03em',
      background: '#e8f4fd', color: '#2d7abf', border: '1px solid #b8d9f5',
    }}>{label}</span>
  )
}

function HighlightList({ items }) {
  return (
    <div>
      <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>Highlights</div>
      {items.map((h, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: i < items.length - 1 ? '1px solid var(--card-border)' : 'none', fontSize: '12px', lineHeight: 1.45, color: 'var(--text-primary)' }}>
          <span style={{ color: ACCENT_BLUE, fontWeight: 700, flexShrink: 0 }}>→</span>
          {h}
        </div>
      ))}
    </div>
  )
}

function ActionPill({ href, primary, children }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
  }
  const style = primary
    ? { ...base, background: ACCENT_BLUE, color: '#fff' }
    : { ...base, background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>
  )
}

function MainCardShell({ children }) {
  return (
    <div style={{
      border: '1px solid var(--card-border)',
      borderRadius: '18px',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {children}
    </div>
  )
}

function MinorProjectEntry({ title, year, description, chips, links, children, isLast }) {
  return (
    <div style={{ padding: '20px 0', borderBottom: isLast ? 'none' : '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {children}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '7px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{title}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{year}</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '10px' }}>{description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {chips.map(c => <ProjectChip key={c} label={c} />)}
        </div>
        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', fontWeight: 600 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: ACCENT_BLUE }}>
              <GithubIcon /> {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectsPage({ onNavigate }) {
  const containerRef = useRef(null)
  useScrollFade(containerRef)

  return (
    <PageWrapper pageKey="projects">
      <div ref={containerRef} className="pt-28 pb-4 px-6">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ opacity: 0, animation: 'fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.05s forwards', marginBottom: '40px' }}>
            <p className="text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              What I&apos;ve built
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Projects
            </h1>
          </div>

          {/* ── MAIN PROJECTS ── */}
          <div className="fade-section" style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px' }}>
              Main Projects
            </p>

            {/* ── Portfolio Vision card ── */}
            <div style={{ marginBottom: '24px' }}>
              <MainCardShell>
                {/* Info (top) */}
                <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2026</span>
                      <CategoryChip label="Software" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Portfolio Vision
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
                      A full-stack ETF portfolio decomposer that recursively breaks down any portfolio of ETFs and stocks into underlying holdings, with real-time price data, sector and geographic exposure breakdowns, and persistent user accounts. Built first as a Python CLI, then rebuilt entirely as a production web application.
                    </p>

                    {/* Two parts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                      {[
                        {
                          tag: 'Part 1 — Python CLI',
                          body: 'Full-featured terminal decomposer with recursive ETF unwrapping, mixed USD/CAD currency detection, tabular holdings output with sector and geographic breakdowns, and a captured/untracked coverage summary. Handles circular references and depth capping.',
                          chips: ['Python', 'CLI', 'JSON'],
                        },
                        {
                          tag: 'Part 2 — Web App',
                          body: 'Production web application with live stock price integration via Twelve Data API, Google OAuth and OTP email authentication via Supabase, saved and loadable portfolios with per-user row-level security, USD/CAD display toggle with real-time Frankfurter API conversion, and Logo.dev company logo resolution. Deployed on Vercel with Vercel Analytics.',
                          chips: ['Python', 'React', 'Vite', 'Tailwind CSS', 'Supabase', 'Google Cloud', 'Twelve Data API', 'Vercel'],
                        },
                      ].map(part => (
                        <div key={part.tag} style={{ background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '6px' }}>{part.tag}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>{part.body}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {part.chips.map(c => <ProjectChip key={c} label={c} />)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <HighlightList items={[
                      'Recursive ETF decomposition across 500+ tickers with configurable depth cap and circular reference protection',
                      'Enabled live price fetching across US and Canadian exchanges (TSX, NEO, CSE) by building a Vercel serverless proxy to Yahoo Finance, eliminating API key requirements and exchange restrictions',
                      'Google OAuth + OTP email auth via Supabase with row-level security policies per user',
                      'Google Cloud OAuth 2.0 project with authorized domain configuration and test user management',
                      'Real-time USD/CAD conversion via Frankfurter API with per-position and display-level currency toggling',
                      '400+ page views within the first week of launch, tracked via Vercel Analytics',
                      'Deployed end-to-end on Vercel with custom domain, analytics, and environment-based secrets management',
                    ]} />
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <ActionPill href="https://www.portfoliovision.online/" primary>
                      <ExternalLinkIcon /> portfoliovision.online
                    </ActionPill>
                    <ActionPill href="https://github.com/AustinZhai8/Portfolio-Vision-Web">
                      <GithubIcon /> Web App
                    </ActionPill>
                    <ActionPill href="https://github.com/AustinZhai8/Portfolio-Vision-Py">
                      <GithubIcon /> Python CLI
                    </ActionPill>
                  </div>
                </div>

                {/* Visual (bottom) */}
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderTop: '1px solid var(--card-border)',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ height: '320px', borderRadius: '8px', overflow: 'hidden', flex: '1 1 240px', minWidth: 0 }}>
                    <img src="/projects/pv-cli.png" alt="Portfolio Vision Python CLI" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  </div>
                  <div style={{ height: '320px', borderRadius: '8px', overflow: 'hidden', flex: '1 1 240px', minWidth: 0 }}>
                    <img src="/projects/pv-web.png" alt="Portfolio Vision Web App" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  </div>
                </div>
              </MainCardShell>
            </div>

            {/* ── Personal Website card ── */}
            <MainCardShell>
              {/* Info (top) */}
              <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2026</span>
                    <CategoryChip label="Software" />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Personal Website
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
                    Designed, built, and deployed austinzhai.com end-to-end. A Vite + React SPA with custom CSS animations, scroll-triggered fades, and a full CI/CD pipeline via GitHub and Vercel. Set up the custom domain and DNS configuration from scratch.
                  </p>

                  {/* Skills */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Skills used</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { label: 'Languages', chips: ['JavaScript', 'HTML', 'CSS'] },
                        { label: 'Frameworks', chips: ['React', 'Tailwind CSS', 'Vite'] },
                        { label: 'Tools', chips: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Domain Setup'] },
                      ].map(({ label, chips }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '68px', flexShrink: 0 }}>{label}</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {chips.map(c => <ProjectChip key={c} label={c} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <HighlightList items={[
                    'End-to-end ownership: design, build, deploy, domain setup',
                    'Sub-100KB JS bundle, <1s LCP on cold load',
                    'Continuous deployment via GitHub → Vercel pipeline',
                  ]} />
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <ActionPill href="https://austinzhai.com" primary>
                    <ExternalLinkIcon /> austinzhai.com
                  </ActionPill>
                  <ActionPill href="https://github.com/AustinZhai8/personal-website">
                    <GithubIcon /> GitHub
                  </ActionPill>
                </div>
              </div>

              {/* Visual (bottom) — browser frame mock */}
              <div style={{
                background: 'var(--bg-primary)',
                padding: '24px',
                borderTop: '1px solid var(--card-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '100%', maxWidth: '380px', borderRadius: '9px', overflow: 'hidden',
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg-primary)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    height: '26px', background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--card-border)',
                    display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px',
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                    <span style={{
                      marginLeft: '10px', flex: 1, maxWidth: '170px', height: '14px',
                      borderRadius: '3px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)',
                      fontSize: '8px', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', padding: '0 6px',
                    }}>austinzhai.com</span>
                  </div>
                  <div style={{
                    padding: '24px 20px 28px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    textAlign: 'center', minHeight: '220px', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                      Hi, I&apos;m <span style={{ color: ACCENT_BLUE }}>Austin</span>!
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: 1.5 }}>
                      Computer Engineering Student at UBC that likes to build stuff.
                    </div>
                    <div style={{ background: ACCENT_BLUE, color: '#fff', fontSize: '9px', fontWeight: 600, padding: '5px 12px', borderRadius: '999px' }}>
                      Let&apos;s connect!
                    </div>
                  </div>
                </div>
              </div>
            </MainCardShell>
          </div>

          {/* Divider */}
          <div className="fade-section" style={{ height: '1px', background: 'var(--card-border)', margin: '40px 0' }} />

          {/* ── MINOR PROJECTS ── */}
          <div className="fade-section">
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '32px' }}>
              Minor Projects
            </p>

            {/* Hardware / Firmware sub-section */}
            <p style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Hardware / Firmware
            </p>
            <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '2px' }} />

            <MinorProjectEntry
              title="Servo Sonar Radar"
              year="2026"
              description="A servo-mounted ultrasonic sensor sweeps 180° to detect objects across three modes: continuous sweep, detection-triggered pause, and manual joystick control. Detected objects are visualized on a real-time radar display rendered in Processing."
              chips={['Arduino', 'Servo Control', 'Ultrasonic Sensing', 'Serial Communication', 'Processing']}
              links={[{ href: 'https://github.com/AustinZhai8/Sonar-Servo-Radar', label: 'GitHub' }]}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img src="/projects/sonar-square.jpg" alt="Servo Sonar Radar close-up" style={{ width: '300px', height: '300px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--card-border)', flexShrink: 0 }} />
                <img src="/projects/sonar-wide.jpg" alt="Servo Sonar Radar with radar display" style={{ width: '350px', height: '300px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--card-border)', flexShrink: 0 }} />
              </div>
            </MinorProjectEntry>

            <MinorProjectEntry
              title="Smart Gate Access System"
              year="2026"
              description="An ESP32-based access control system combining RFID card scanning and keypad password entry to control a servo-actuated gate, with an I2C LCD display for real-time status feedback and LED/buzzer alerts for granted and denied access events."
              chips={['ESP32', 'RFID', 'SPI', 'I2C', 'Servo Control', 'Embedded Systems']}
              links={[{ href: 'https://github.com/AustinZhai8/Smart-Gate-Access-System', label: 'GitHub' }]}
              isLast
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img src="/projects/smart-gate-2.jpg" alt="Smart Gate Access System wide view" style={{ height: '300px', width: 'auto', maxWidth: '100%', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--card-border)', flexShrink: 0 }} />
              </div>
            </MinorProjectEntry>

            {/* Software sub-section */}
            <p style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', marginTop: '36px' }}>
              Software
            </p>
            <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '2px' }} />

            <MinorProjectEntry
              title="Hangman"
              year="2026"
              description="A command-line implementation of the classic Hangman word-guessing game. Players choose a difficulty (easy, medium, or hard), then guess letters or the full word with 6 lives. Draws from a curated word list per difficulty and tracks guessed letters to prevent duplicates."
              chips={['Python', 'CLI', 'Game Logic']}
              links={[{ href: 'https://github.com/AustinZhai8/Hangman', label: 'GitHub' }]}
            />

            <MinorProjectEntry
              title="Random Password Manager"
              year="2026"
              description="A command-line Python password manager that stores, retrieves, and deletes credentials locally. Features a built-in password generator that guarantees cryptographic variety across uppercase, lowercase, digits, and symbols on every run. Data persists across sessions via a local JSON file."
              chips={['Python', 'CLI', 'random', 'json', 'os']}
              links={[{ href: 'https://github.com/AustinZhai8/Random-Password-Manager', label: 'GitHub' }]}
              isLast
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
  }

  return (
    <>
      <Navbar activePage={activePage} onNavigate={navigate} />
      <main>{pages[activePage]}</main>
      <Footer />
    </>
  )
}
