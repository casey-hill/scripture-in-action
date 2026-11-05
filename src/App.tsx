import { useEffect, useRef, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { curriculum, getLesson, lessonHref, passageSummary } from './content/curriculum'
import type { Journey, Lesson } from './content/model'
import LessonReader from './LessonReader'
import './App.css'

const screens = ['home', 'challenge', 'progress'] as const
type Route = { screen: 'home' | 'progress' | 'missing' } | { screen: 'challenge'; journey: Journey; lesson: Lesson }

function currentRoute(): Route {
  const hash = window.location.hash.slice(1) || 'home'
  if (hash === 'home' || hash === 'progress') return { screen: hash }
  if (hash === 'challenge') {
    const journey = curriculum.journeys[0]
    return { screen: 'challenge', journey, lesson: getLesson(journey.lessons[0].lessonId) }
  }
  const parts = hash.split('/')
  if (parts.length === 3 && parts[0] === 'challenge') {
    const journey = curriculum.journeys.find((item) => encodeURIComponent(item.id) === parts[1])
    const entry = journey?.lessons.find((item) => encodeURIComponent(item.lessonId) === parts[2])
    if (journey && entry) return { screen: 'challenge', journey, lesson: getLesson(entry.lessonId) }
  }
  return { screen: 'missing' }
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
          <a className="button primary" href="#challenge">Begin the journey <span aria-hidden="true">&rarr;</span></a>
          <p className="caption">Seven days to explore at your own pace. No dates or completion gates.</p>
        </div>
      </section>
      <div className="two-column">
        {curriculum.journeys.map((journey) => (
          <section key={journey.id} className="card" aria-labelledby={`${journey.id}-title`}>
            <p className="eyebrow">One day at a time</p>
            <h2 id={`${journey.id}-title`}>{journey.title}</h2>
            <p>{journey.description}</p>
            <ol className="lesson-outline" aria-label={journey.title}>
              {journey.lessons.map(({ day, lessonId }) => {
                const lesson = getLesson(lessonId)
                return <li key={lessonId}><a href={lessonHref(journey.id, lesson.id)}><span className="lesson-day">Day {day}</span><span><strong>{lesson.title}</strong><small>{passageSummary(lesson)} / {lesson.translationId}</small></span><span aria-hidden="true">&rarr;</span></a></li>
              })}
            </ol>
          </section>
        ))}
        <section className="card" aria-labelledby="practice-title">
          <p className="eyebrow">Make room for recall</p>
          <h2 id="practice-title">Practice without pressure</h2>
          <p>Read, consider a scenario, and reflect. Memory exercises and personal review dates are coming later. Nothing is due, scored, or saved.</p>
          <a className="text-link" href="#progress">See the progress preview <span aria-hidden="true">&rarr;</span></a>
        </section>
      </div>
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
        <div className="notice"><strong>Private by design</strong><p>No account, analytics, cloud sync, or remote AI. The app shell and original lesson content are cached; your choices, reflections, and progress are not saved. External NIV readings require internet access.</p></div>
        <a className="button secondary" href="#home">Return home</a>
      </section>
    </>
  )
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)
  const { screen } = route
  const [online, setOnline] = useState(navigator.onLine)
  const [workerControlled, setWorkerControlled] = useState(() => !!navigator.serviceWorker?.controller)
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
  const cachedAppAvailable = offlineReady || workerControlled

  useEffect(() => {
    const navigate = () => {
      setRoute(currentRoute())
      requestAnimationFrame(() => mainRef.current?.querySelector('h1')?.focus())
    }
    const connected = () => setOnline(true)
    const disconnected = () => setOnline(false)
    const workerChanged = () => setWorkerControlled(!!navigator.serviceWorker?.controller)
    window.addEventListener('hashchange', navigate)
    window.addEventListener('online', connected)
    window.addEventListener('offline', disconnected)
    navigator.serviceWorker?.addEventListener('controllerchange', workerChanged)
    return () => {
      window.removeEventListener('hashchange', navigate)
      window.removeEventListener('online', connected)
      window.removeEventListener('offline', disconnected)
      navigator.serviceWorker?.removeEventListener('controllerchange', workerChanged)
    }
  }, [])

  useEffect(() => {
    document.title = `${route.screen === 'challenge' ? route.lesson.title : screen === 'missing' ? 'Page not found' : screen[0].toUpperCase() + screen.slice(1)} | Scripture in Action`
  }, [route, screen])

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
      <div className="status-bar" role="status" aria-label="App status">
        <span className="badge">Milestone B</span>
        <span>{workerError || (!online ? (cachedAppAvailable ? 'Offline - cached shell and lessons available; NIV links need internet' : 'Offline - shell and lessons may not be cached yet; NIV links need internet') : cachedAppAvailable ? 'App shell and lessons ready for offline use' : 'Preparing offline shell and lessons')}</span>
      </div>
      {needRefresh && <div className="update-bar" role="status"><span>A new version is ready.</span><button className="button secondary" onClick={() => {
        void updateServiceWorker(true).catch(() => setWorkerError('Update failed. Reconnect and reload to try again.'))
      }}>Update and reload</button></div>}
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {route.screen === 'home' ? <HomeScreen /> : route.screen === 'challenge' ? <LessonReader key={`${route.journey.id}/${route.lesson.id}`} journey={route.journey} lesson={route.lesson} /> : route.screen === 'progress' ? <ProgressScreen /> : <section className="card"><h1 tabIndex={-1}>Page not found</h1><p>This screen or lesson could not be found.</p><a className="button primary" href="#home">Go home</a></section>}
      </main>
      <footer><span>Scripture in Action</span><p>Seven-day curriculum / no saved progress. In Edge, use the address-bar install icon or Apps menu when available. Open online once and wait for offline readiness before disconnecting. NIV readings open externally and need internet.</p></footer>
    </div>
  )
}
