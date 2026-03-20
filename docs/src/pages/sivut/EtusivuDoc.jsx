import { Link } from 'react-router-dom'

export default function EtusivuDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Etusivu</span>
      </div>
      <div className="page-header">
        <h1>🎮 Etusivu</h1>
        <p>Sovelluksen pääsivu, joka esittelee kaikki pelivalinnat korttinäkymänä.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Etusivu.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Etusivu toimii sovelluksen päävalikkona, josta käyttäjä voi valita pelattavan pelin. Jokainen peli esitetään korttiruudukossa, joka sisältää kuvan, otsikon ja lyhyen kuvauksen.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">🃏</div>
            <h3>Pelikortit</h3>
            <p>5 pelikorttia kuvineen, otsikoineen ja kuvauksineen</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📱</div>
            <h3>Responsiivinen</h3>
            <p>1 sarake mobiililla, 2 tabletilla, 3 desktopilla</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔗</div>
            <h3>Navigointi</h3>
            <p>Klikkaus vie suoraan pelin sivulle React Routerin kautta</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Pelivalinnat</h2>
        <table className="props-table">
          <thead>
            <tr><th>Peli</th><th>Reitti</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td>Palapeli</td><td><code>/palapeli</code></td><td>Drag & drop palapeli</td></tr>
            <tr><td>Sudoku</td><td><code>/Sudoku</code></td><td>9x9 logiikkapeli</td></tr>
            <tr><td>Nonogram</td><td><code>/Nonogram</code></td><td>Kuva-logiikkapeli</td></tr>
            <tr><td>Muistipeli</td><td><code>/Muistipeli</code></td><td>Korttien muistipeli</td></tr>
            <tr><td>White Tiles</td><td><code>/whitetiles</code></td><td>Reaktiopeli</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Responsiivinen ruudukko</h2>
        <div className="code-block">
{`/* CSS Grid -toteutus */
.game-grid {
  display: grid;
  gap: 16px;
}

/* Mobiili: 1 sarake */
@media (max-width: 600px) {
  grid-template-columns: 1fr;
}

/* Tabletti: 2 saraketta */
@media (min-width: 601px) and (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: 3 saraketta */
@media (min-width: 1025px) {
  grid-template-columns: repeat(3, 1fr);
}`}
        </div>
      </div>
    </>
  )
}
