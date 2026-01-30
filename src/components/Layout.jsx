import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import clsx from 'clsx'

export default function Layout() {
  const { pathname } = useLocation()

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
            <Link to="/about" className="btn" style={{ padding: '8px 12px' }}>
              Info
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
        <div className="navInner">
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
