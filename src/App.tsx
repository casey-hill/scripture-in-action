import { useEffect, useRef, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import './App.css'

const screens = ['home', 'challenge', 'progress'] as const
type Screen = (typeof screens)[number]

function currentScreen(): Screen | 'missing' {
  const hash = window.location.hash.slice(1) || 'home'
  return screens.find((screen) => screen === hash) ?? 'missing'
}

function BookMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 13c-5-4-12-5-19-3v26c7-2 14-1 19 3 5-4 12-5 19-3V10c-7-2-14-1-19 3Zm0 0v26" />
      <path d="M11 18c3 0 5 1 7 2m-7 6c3 0 5 1 7 2m12-8c2-1 4-2 7-2m-7 10c2-1 4-2 7-2" />
    </svg>
  )
}

function HomeScreen() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">A little space. A lasting practice.</p>
        <h1 tabIndex={-1}>Today's journey</h1>
        <p>Slow down. Look closer. Bring wisdom into the everyday.</p>
      </div>
      <section className="hero-card" aria-labelledby="welcome-title">
        <div className="hero-art" aria-hidden="true"><BookMark /><span>Read. Reflect. Live.</span></div>
        <div className="hero-copy">
          <p className="eyebrow">Your quiet place to begin</p>
          <h2 id="welcome-title">Wisdom for the moments that matter.</h2>
          <p>A five-minute rhythm of Scripture, reflection, and practice. No streaks to protect. Just room to grow.</p>
          <a className="button primary" href="#challenge">Explore the challenge preview <span aria-hidden="true">&rarr;</span></a>
          <p className="caption">Milestone A preview. Lessons are not available yet.</p>
        </div>
      </section>
      <div className="two-column">
        <section className="card" aria-labelledby="journey-title">
          <p className="eyebrow">One day at a time</p>
          <h2 id="journey-title">A seven-day journey, ahead</h2>
          <p>Reviewed lessons will arrive in Milestone B. These markers show the planned journey, not completed lessons.</p>
          <ol className="days" aria-label="Seven planned days">
            {Array.from({ length: 7 }, (_, index) => <li key={index}><span>{index + 1}</span><small>Planned</small></li>)}
          </ol>
        </section>
        <section className="card" aria-labelledby="practice-title">
          <p className="eyebrow">Make room for recall</p>
          <h2 id="practice-title">Practice without pressure</h2>
          <p>Memory exercises and personal review dates are coming later. Nothing is due, scored, or saved in this preview.</p>
          <a className="text-link" href="#progress">See the progress preview <span aria-hidden="true">&rarr;</span></a>
        </section>
      </div>
    </>
  )
}

function ChallengeScreen() {
  return (
    <>
      <div className="page-intro"><p className="eyebrow">From understanding to everyday life</p><h1 tabIndex={-1}>Challenge</h1><p>A place to consider a situation before rushing to an answer.</p></div>
      <section className="card spacious">
        <span className="badge">Coming in Milestones B and C</span>
        <h2>Your first challenge is still being prepared.</h2>
        <p>Lessons need reviewed passages, context, and translation permissions before you can begin. This scaffold includes no Bible text or generated interpretation.</p>
        <ol className="steps">
          <li><strong>Consider</strong><span>A realistic situation, with space for nuance.</span></li>
          <li><strong>Explore</strong><span>Scripture in context, distinct from application.</span></li>
          <li><strong>Practice</strong><span>Memorization and a gentle reflection.</span></li>
        </ol>
        <a className="button secondary" href="#home">Back to today's journey</a>
      </section>
    </>
  )
}

function ProgressScreen() {
  return (
    <>
      <div className="page-intro"><p className="eyebrow">Growth, not a scoreboard</p><h1 tabIndex={-1}>Progress</h1><p>Your learning story will live here, privately on your device.</p></div>
      <section className="card spacious">
        <span className="badge">Coming in Milestone D</span>
        <h2>A fresh beginning.</h2>
        <p>There is no learning history yet. Completion, recall history, review dates, and JSON backup and restore are not implemented in this preview.</p>
        <div className="notice"><strong>Private by design</strong><p>No account, analytics, cloud sync, or remote AI. This version caches only the app shell; it does not save lessons, reflections, or progress.</p></div>
        <a className="button secondary" href="#home">Return home</a>
      </section>
    </>
  )
}

export default function App() {
  const [screen, setScreen] = useState(currentScreen)
  const [online, setOnline] = useState(navigator.onLine)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const [workerError, setWorkerError] = useState('')
  const mainRef = useRef<HTMLElement>(null)
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: () => setWorkerError('Offline setup failed. Reconnect and reload to try again.'),
  })

  useEffect(() => {
    const navigate = () => {
      setScreen(currentScreen())
      requestAnimationFrame(() => mainRef.current?.querySelector('h1')?.focus())
    }
    const connected = () => setOnline(true)
    const disconnected = () => setOnline(false)
    window.addEventListener('hashchange', navigate)
    window.addEventListener('online', connected)
    window.addEventListener('offline', disconnected)
    return () => {
      window.removeEventListener('hashchange', navigate)
      window.removeEventListener('online', connected)
      window.removeEventListener('offline', disconnected)
    }
  }, [])

  useEffect(() => {
    document.title = `${screen === 'missing' ? 'Page not found' : screen[0].toUpperCase() + screen.slice(1)} | Scripture in Action`
  }, [screen])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        mainRef.current?.focus()
      }}>Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Scripture in Action home"><BookMark /><span>Scripture<span className="brand-sub">in Action</span></span></a>
        <nav aria-label="Main navigation">
          {screens.map((item) => <a key={item} href={`#${item}`} aria-current={screen === item ? 'page' : undefined}>{item[0].toUpperCase() + item.slice(1)}</a>)}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? 'Dark' : 'Light'} theme</button>
      </header>
      <div className="status-bar" role="status">
        <span className="badge">Milestone A</span>
        <span>{workerError || (!online ? (offlineReady ? 'Offline - cached app shell available' : 'Offline - app shell may not be cached yet') : offlineReady ? 'App shell ready for offline use' : 'Preview - preparing offline app shell')}</span>
      </div>
      {needRefresh && <div className="update-bar" role="status"><span>A new version is ready.</span><button className="button secondary" onClick={() => {
        void updateServiceWorker(true).catch(() => setWorkerError('Update failed. Reconnect and reload to try again.'))
      }}>Update and reload</button></div>}
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {screen === 'home' ? <HomeScreen /> : screen === 'challenge' ? <ChallengeScreen /> : screen === 'progress' ? <ProgressScreen /> : <section className="card"><h1 tabIndex={-1}>Page not found</h1><p>This screen is not part of the preview.</p><a className="button primary" href="#home">Go home</a></section>}
      </main>
      <footer><span>Scripture in Action</span><p>App-shell preview only. In Edge, use the address-bar install icon or Apps menu when available. Open online once and wait for offline readiness before disconnecting.</p></footer>
    </div>
  )
}
