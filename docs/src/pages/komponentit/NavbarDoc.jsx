import { Link } from 'react-router-dom'

export default function NavbarDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>Navbar</span>
      </div>
      <div className="page-header">
        <h1>📌 Navbar</h1>
        <p>Sovelluksen navigointipalkki linkein ja teeman vaihdolla.</p>
      </div>

      <div className="file-path">📄 client/src/navbar.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>AppNavbar on ylänavigointipalkki, joka näkyy kaikilla sivuilla. Se sisältää linkit kaikkiin peleihin ja sivuihin, teeman vaihtopainikkeen sekä responsiivisen hampurilaisvalikon.</p>
      </div>

      <div className="doc-section">
        <h2>Navigointilinkit</h2>
        <table className="props-table">
          <thead>
            <tr><th>Linkki</th><th>Reitti</th></tr>
          </thead>
          <tbody>
            <tr><td>Etusivu</td><td><code>/</code></td></tr>
            <tr><td>Palapeli</td><td><code>/palapeli</code></td></tr>
            <tr><td>Sudoku</td><td><code>/Sudoku</code></td></tr>
            <tr><td>Nonogram</td><td><code>/Nonogram</code></td></tr>
            <tr><td>Muistipeli</td><td><code>/Muistipeli</code></td></tr>
            <tr><td>White Tiles</td><td><code>/whitetiles</code></td></tr>
            <tr><td>Lobby</td><td><code>/Lobby</code></td></tr>
            <tr><td>Profiili</td><td><code>/profiili</code></td></tr>
            <tr><td>Kirjaudu</td><td><code>/Login</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">🌗</div>
            <h3>Teeman vaihto</h3>
            <p>Tumma/vaalea tila ThemeContextin kautta</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📱</div>
            <h3>Responsiivinen</h3>
            <p>Bootstrap Navbar.Toggle hampurilaisvalikko</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔗</div>
            <h3>NavLink</h3>
            <p>Aktiivisen sivun korostus React Router NavLinkillä</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Tekninen toteutus</h2>
        <div className="code-block">
{`// React Bootstrap + React Router
import { Navbar, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useTheme } from './components/ThemeContext'

// Teeman vaihto
const { isDarkMode, toggleTheme } = useTheme()

// NavLink aktiivisuus
<NavLink to="/palapeli" className={({isActive}) =>
  isActive ? 'nav-link active' : 'nav-link'
}>
  Palapeli
</NavLink>`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/themecontext">ThemeContext</Link> — Teeman hallinta</li>
        </ul>
      </div>
    </>
  )
}
