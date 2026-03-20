import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'

const sidebarSections = [
  {
    title: 'Yleiskatsaus',
    links: [
      { to: '/', label: 'Etusivu' },
    ]
  },
  {
    title: 'Sivut',
    links: [
      { to: '/sivut/etusivu', label: 'Etusivu (Pelit)' },
      { to: '/sivut/palapeli', label: 'Palapeli' },
      { to: '/sivut/sudoku', label: 'Sudoku' },
      { to: '/sivut/nonogram', label: 'Nonogram' },
      { to: '/sivut/muistipeli', label: 'Muistipeli' },
      { to: '/sivut/whitetile', label: 'White Tiles' },
      { to: '/sivut/login', label: 'Kirjautuminen' },
      { to: '/sivut/profiili', label: 'Profiili' },
      { to: '/sivut/ristinolla', label: 'Ristinolla' },
      { to: '/sivut/lobby', label: 'Lobby' },
    ]
  },
  {
    title: 'Komponentit',
    links: [
      { to: '/komponentit/leaderboard', label: 'Leaderboard' },
      { to: '/komponentit/tuloksentallennus', label: 'TuloksenTallennus' },
      { to: '/komponentit/pelientimer', label: 'PelienTimer' },
      { to: '/komponentit/muistipelilogiikka', label: 'MuistipeliLogiikka' },
      { to: '/komponentit/themecontext', label: 'ThemeContext' },
      { to: '/komponentit/authform', label: 'AuthForm' },
      { to: '/komponentit/navbar', label: 'Navbar' },
      { to: '/komponentit/supabaseclient', label: 'SupaBaseClient' },
    ]
  }
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          HJKMST Docs
        </Link>
        <div className="navbar-links">
          <a href="https://hjkmst.topim.fi" className="navbar-link" target="_blank" rel="noreferrer">Etusivu</a>
          <a href="https://github.com/Topi-M/HJKMST" className="navbar-link" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div className="layout">
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {sidebarSections.map((section) => (
            <div key={section.title} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        <main className="main-content">
          <Outlet />
          <footer className="docs-footer">
            Dokumentaation luonnissa käytetty tekoälyä
          </footer>
        </main>
      </div>
    </>
  )
}
