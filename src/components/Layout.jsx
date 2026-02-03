import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import clsx from 'clsx'

export default function Layout() {
  const { pathname } = useLocation()

  const systemPrefersDark = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
  }, [])

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return systemPrefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const title =
    pathname === '/mood'
      ? 'Mój nastrój'
      : pathname === '/crisis'
        ? 'Kryzys'
        : pathname === '/knowledge'
          ? 'Wiedza'
          : pathname === '/friend'
            ? 'Dla przyjaciela'
            : pathname === '/about'
              ? 'O aplikacji'
              : pathname === '/privacy'
                ? 'Polityka prywatności'
                : pathname === '/terms'
                  ? 'Regulamin'
                  : 'Plan na kryzys'

  const navActiveIndex =
    pathname === '/mood' ? 1 : pathname === '/crisis' ? 2 : pathname === '/knowledge' ? 3 : 0

  return (
    <div className="app">
      <header className="header">
        <div className="headerInner">
          <div className="brandRow">
            <img className="brandLogo" src="/logo.svg" alt="Plan na kryzys" />
            <div className="brand">{title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {pathname === '/crisis' ? <span className="badgeDanger">Pilne</span> : null}
            <button
              type="button"
              className="btn btnIcon"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
              title={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
            >
              {theme === 'dark' ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4.93 4.93l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17.66 17.66l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M21 13.2A8.2 8.2 0 0 1 10.8 3a7 7 0 1 0 10.2 10.2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <Link to="/about" className="btn" style={{ padding: '8px 12px' }}>
              Informacje
            </Link>
          </div>
        </div>
        <div className="headerDescription">Offline. Bez kont. Dane tylko na urządzeniu.</div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>


      <nav className="nav" aria-label="Nawigacja główna">
        <div className="navInner" style={{ '--active': navActiveIndex }}>
          <div className="navHighlight" aria-hidden="true" />
          <NavLink
            to="/"
            end
            className={({ isActive }) => clsx('navLink', isActive && 'navLinkActive')}
          >
            Start
          </NavLink>
          <NavLink
            to="/mood"
            className={({ isActive }) => clsx('navLink', isActive && 'navLinkActive')}
          >
            Nastrój
          </NavLink>
          <NavLink
            to="/crisis"
            className={({ isActive }) => clsx('navLink', isActive && 'navLinkActive')}
          >
            Kryzys
          </NavLink>
          <NavLink
            to="/knowledge"
            className={({ isActive }) => clsx('navLink', isActive && 'navLinkActive')}
          >
            Wiedza
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
