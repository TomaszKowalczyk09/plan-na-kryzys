import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import TabNavigation from './TabNavigation.jsx';
import clsx from 'clsx'
import { useCheckInNotifications } from '../hooks/useCheckInNotifications'
import { useSettings, useSobrietyTimer } from '../hooks/useIndexedDB'
import { useI18n } from '../i18n/index.jsx'

export default function Layout() {
  const { t, lang, setLang } = useI18n()
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

  const hideBottomNav = isOnboardingActive || pathname === '/knowledge/grounding' || pathname === '/'

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

  const [isHeaderCompact, setIsHeaderCompact] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (hideHeader) return undefined

    const onScroll = () => {
      setIsHeaderCompact(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hideHeader])

  const title =
    pathname === '/mood'
      ? t('routeTitles.mood')
      : pathname === '/crisis'
        ? t('routeTitles.crisis')
        : pathname === '/knowledge'
          ? t('routeTitles.knowledge')
          : pathname === '/friend'
            ? t('routeTitles.friend')
            : pathname === '/about'
              ? t('routeTitles.about')
              : pathname === '/privacy'
                ? t('routeTitles.privacy')
                : pathname === '/terms'
                  ? t('routeTitles.terms')
                  : pathname === '/crisis/cssrs'
                    ? t('routeTitles.cssrs')
                    : pathname === '/sobriety'
                      ? t('routeTitles.sobriety')
                      : pathname === '/addiction-config'
                        ? t('routeTitles.addictionConfig')
                        : t('routeTitles.default')

  const navActiveIndex =
    pathname === '/mood' ? 1 : pathname === '/crisis' ? 2 : pathname === '/knowledge' ? 3 : 0

  return (
    <div className={clsx('app', !hideBottomNav && 'appHasBottomNav')}>
      
      {!hideHeader ? (
        <header className={clsx('header headerRedesigned', isHeaderCompact && 'headerRedesignedCompact')}>
          <div className="headerInner headerInnerRedesigned">
            <div className="headerLeft">
              <img className="brandLogo brandLogoRedesigned" src="/unnamed-removebg-preview.png" alt="Plan na kryzys" />
            </div>
            <div className="headerCenter">
              <div className="brand brandRedesigned">{t('app.name')}</div>
              <div className="headerTitle">{title}</div>
              {pathname === '/crisis' ? <span className="badgeDanger badgeDangerRedesigned">{t('app.urgent')}</span> : null}
              {/* ...existing code... */}
            </div>
            <div className="headerRight">
              <button
                type="button"
                className="btn btnIcon btnIconRedesigned"
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                aria-label={theme === 'dark' ? t('app.themeToLight') : t('app.themeToDark')}
                title={theme === 'dark' ? t('app.themeToLight') : t('app.themeToDark')}
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
              <select
                className="btn btnRedesigned"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language"
                style={{ padding: '8px 10px', fontWeight: 600 }}
              >
                <option value="pl">PL</option>
                <option value="de">DE</option>
              </select>
              <Link to="/about" className="btn btnRedesigned" style={{ padding: '8px 16px', fontWeight: 600 }}>
                {t('app.info')}
              </Link>
            </div>
          </div>
          <div className="headerDescription headerDescriptionRedesigned">{t('app.headerDescription')}</div>
        </header>
      ) : null}

      <main className="main">
        <div className={clsx('container', pathname === '/knowledge' && 'containerWide')}>
          {/* ...existing code... */}
          <Outlet />
        </div>
      </main>

      {/* Nowy system nawigacji */}
      {!hideBottomNav && <TabNavigation />}

      <footer
        className="footer"
        style={{
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: 12,
          opacity: 0.75,
        }}
      >
        {t('app.footer')}
      </footer>
    </div>
  )
}
