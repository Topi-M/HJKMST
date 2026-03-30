import { Link } from 'react-router-dom'

export default function ThemeContextDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>ThemeContext</span>
      </div>
      <div className="page-header">
        <h1>ThemeContext</h1>
        <p>Globaali konteksti tumman ja vaalean teeman hallintaan.</p>
      </div>

      <div className="file-path">client/src/components/ThemeContext.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>ThemeContext tarjoaa globaalin tumma/vaalea-tila -kontekstin koko sovellukselle. Se tallentaa valinnan localStorageen ja lisää/poistaa <code>dark-mode</code> CSS-luokan body-elementistä.</p>
      </div>

      <div className="doc-section">
        <h2>API</h2>
        <table className="props-table">
          <thead>
            <tr><th>Export</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>ThemeProvider</code></td><td>Component</td><td>Wrappaa sovelluksen main.jsx:ssä</td></tr>
            <tr><td><code>useTheme()</code></td><td>Hook</td><td>Palauttaa <code>{"{ isDarkMode, toggleTheme }"}</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>useTheme() -hook</h2>
        <table className="props-table">
          <thead>
            <tr><th>Palautusarvo</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>isDarkMode</code></td><td>boolean</td><td>Onko tumma tila päällä</td></tr>
            <tr><td><code>toggleTheme</code></td><td>function</td><td>Vaihtaa teemaa</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Käyttöesimerkki</h2>
        <div className="code-block">
{`// main.jsx - Provider
import { ThemeProvider } from './components/ThemeContext'

<ThemeProvider>
  <RouterProvider router={router} />
</ThemeProvider>

// Komponentissa - Hook
import { useTheme } from '../components/ThemeContext'

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Vaalea' : 'Tumma'}
    </button>
  )
}`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Toimintalogiikka</h2>
        <ol>
          <li>Alustetaan tila localStoragesta</li>
          <li><code>toggleTheme</code> kääntää <code>isDarkMode</code>-arvon</li>
          <li>useEffect lisää/poistaa <code>dark-mode</code>-luokan body:stä</li>
          <li>Tallennetaan valinta localStorageen</li>
        </ol>
      </div>

      <div className="doc-section">
        <h2>Käyttävät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/navbar">Navbar</Link> — Teeman vaihtopainike</li>
          <li><Link to="/sivut/login">Login</Link> — Tumma tila tuki</li>
        </ul>
      </div>
    </>
  )
}
