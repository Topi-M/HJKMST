import { Link } from 'react-router-dom'

export default function NonogramDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Nonogram</span>
      </div>
      <div className="page-header">
        <h1>🖼️ Nonogram</h1>
        <p>Kuva-logiikkapeli (Picross), jossa täytetään ruudukkoa vihjeiden perusteella.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Nonogram.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Nonogram on logiikkapeli, jossa käyttäjä täyttää ruudukon mustia soluja vihjeiden avulla. Vihjeet kertovat, kuinka monta peräkkäistä mustaa solua on kullakin rivillä ja sarakkeella. Vasen klikkaus täyttää solun mustaksi, oikea klikkaus merkitsee X:llä.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">📐</div>
            <h3>Ruudukkokoot</h3>
            <p>5×5, 7×7 ja 9×9</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🖱️</div>
            <h3>Hiiren napit</h3>
            <p>Vasen = musta, oikea = X-merkintä</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔢</div>
            <h3>Vihjeet</h3>
            <p>Rivi- ja sarakevihjeet peräkkäisistä mustista soluista</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🎯</div>
            <h3>Automaattinen voitto</h3>
            <p>Peli tunnistaa automaattisesti oikean ratkaisun</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🌫️</div>
            <h3>Blur-efekti</h3>
            <p>Ruudukko on sumennettu ennen pelin aloitusta</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📖</div>
            <h3>Ohjeet</h3>
            <p>Ohjeikkuna uusille pelaajille</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Pikselitilat</h2>
        <table className="props-table">
          <thead>
            <tr><th>Tila</th><th>Kuvaus</th><th>Syöte</th></tr>
          </thead>
          <tbody>
            <tr><td><span className="tag tag-blue">WHITE</span></td><td>Tyhjä solu (täyttämätön)</td><td>Oletustila</td></tr>
            <tr><td><span className="tag tag-purple">BLACK</span></td><td>Täytetty musta solu</td><td>Vasen klikkaus</td></tr>
            <tr><td><span className="tag tag-red">X</span></td><td>Merkitty mahdottomaksi</td><td>Oikea klikkaus</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Tilan hallinta</h2>
        <table className="props-table">
          <thead>
            <tr><th>Tila</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>grid</code></td><td>2D Array</td><td>Ruudukon pikselitilat</td></tr>
            <tr><td><code>hints</code></td><td>Object</td><td>Rivi- ja sarakevihjeet</td></tr>
            <tr><td><code>size</code></td><td>number</td><td>Ruudukon koko (5, 7, 9)</td></tr>
            <tr><td><code>gameStarted</code></td><td>boolean</td><td>Onko peli aloitettu</td></tr>
            <tr><td><code>isSolved</code></td><td>boolean</td><td>Onko peli ratkaistu</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/leaderboard">Leaderboard</Link> — Tulostaulu vaikeustason mukaan</li>
          <li><Link to="/komponentit/pelientimer">PelienTimer</Link> — Ajastin</li>
        </ul>
      </div>
    </>
  )
}
