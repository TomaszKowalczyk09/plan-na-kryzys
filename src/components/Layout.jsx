import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import clsx from 'clsx'
import { useCheckInNotifications } from '../hooks/useCheckInNotifications'
import { useSettings, useSobrietyTimer } from '../hooks/useIndexedDB'

export default function Layout() {
  useCheckInNotifications()
  const { pathname } = useLocation()
  // Licznik czystości
  const {
    startDate,
    loading: sobrietyLoading,
    setSobrietyStart,
    resetSobriety,
    getElapsed,
  } = useSobrietyTimer();
  const elapsed = getElapsed();

  const hideHeader = pathname === '/privacy' || pathname === '/terms'

  const { value: accepted, loading: acceptedLoading } = useSettings('legal_ack_v1_2026-02-04', false)
  const isOnboardingActive = !acceptedLoading && !accepted

  const hideBottomNav = isOnboardingActive

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
    <div className={clsx('app', !hideBottomNav && 'appHasBottomNav')}>
      
      {!hideHeader ? (
        <header className="header headerRedesigned">
          <div className="headerInner headerInnerRedesigned">
            <div className="headerLeft">
              <img className="brandLogo brandLogoRedesigned" src="/logo.svg" alt="Plan na kryzys" />
            </div>
            <div className="headerCenter">
              <div className="brand brandRedesigned">Plan na kryzys</div>
              <div className="headerTitle">{title}</div>
              {pathname === '/crisis' ? <span className="badgeDanger badgeDangerRedesigned">Pilne</span> : null}
              {/* ...existing code... */}
            </div>
            <div className="headerRight">
              <button
                type="button"
                className="btn btnIcon btnIconRedesigned"
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                aria-label={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
                title={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
              >
                {theme === 'dark' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M21 13.2A8.2 8.2 0 0 1 10.8 3a7 7 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <Link to="/about" className="btn btnRedesigned" style={{ padding: '8px 16px', fontWeight: 600 }}>
                Informacje
              </Link>
            </div>
          </div>
          <div className="headerDescription headerDescriptionRedesigned">Offline. Bez kont. Dane tylko na urządzeniu.</div>
        </header>
      ) : null}

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {hideBottomNav ? null : (
        <nav
          className="nav"
          aria-label="Nawigacja główna"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'rgba(30, 30, 60, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 24,
            boxShadow: '0 8px 32px #0004',
            padding: '12px 24px',
            display: 'flex',
            gap: 8,
            minWidth: 340,
            maxWidth: 480,
            width: 'calc(100vw - 32px)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {[{
            to: '/',
            end: true,
            ico: '🏠',
            label: 'Start',
          }, {
            to: '/mood',
            ico: '☁️',
            label: 'Nastrój',
          }, {
            to: '/crisis',
            ico: '🆘',
            label: 'Kryzys',
          }, {
            to: '/knowledge',
            ico: '📚',
            label: 'Wiedza',
          }, {
            to: '/addiction-config',
            ico: '🧩',
            label: 'Uzależnienie',
          }].map(({ to, end, ico, label }) => (
            <NavLink
              key={to}
              to={to}
              end={!!end}
              className={({ isActive }) =>
                clsx('navLink', isActive && 'navLinkActive')
              }
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 70,
                padding: '8px 0',
                borderRadius: 16,
                fontSize: 15,
                fontWeight: 500,
                color: '#d0d0ff',
                transition: 'background .2s,color .2s',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 2 }}>{ico}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <footer
        className="footer"
        style={{
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: 12,
          opacity: 0.75,
        }}
      >
        Developed by Tomasz Kowalczyk and Łukasz Majka
      </footer>
    </div>
  )
}
