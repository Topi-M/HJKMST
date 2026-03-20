import { Link } from 'react-router-dom'

export default function WhiteTileDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>White Tiles</span>
      </div>
      <div className="page-header">
        <h1>🎹 White Tiles</h1>
        <p>Piano tiles -tyylinen reaktiopeli kahdella pelimuodolla.</p>
      </div>

      <div className="file-path">📄 client/src/pages/WhiteTile.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>White Tiles on nopea reaktiopeli, jossa pelaajan pitää klikata mustia laattoja ja välttää valkoisia. Peli tarjoaa kaksi pelimuotoa: 10 sekunnin aikarajoitetun ja kestävyysmuodon.</p>
      </div>

      <div className="doc-section">
        <h2>Pelimuodot</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">⏰</div>
            <h3>10 sekuntia</h3>
            <p>Klikkaa mahdollisimman monta mustaa laattaa 10 sekunnissa</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">💪</div>
            <h3>Kestävyys (Endurance)</h3>
            <p>+10s joka 35 pisteen välein. Valkoisen osuminen lopettaa pelin.</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Vakiot</h2>
        <table className="props-table">
          <thead>
            <tr><th>Vakio</th><th>Arvo</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>GRID_SIZE</code></td><td>4</td><td>4×4 ruudukko = 16 laattaa</td></tr>
            <tr><td><code>BLACK_COUNT</code></td><td>3</td><td>Mustia laattoja kerrallaan</td></tr>
            <tr><td><code>GAME_DURATION</code></td><td>10s</td><td>Aikarajoitetun muodon kesto</td></tr>
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
            <tr><td><code>mode</code></td><td>string</td><td>Pelimuoto</td></tr>
            <tr><td><code>isGameActive</code></td><td>boolean</td><td>Peli käynnissä</td></tr>
            <tr><td><code>blackTiles</code></td><td>Set</td><td>Mustien laattojen indeksit</td></tr>
            <tr><td><code>score</code></td><td>number</td><td>Pisteet</td></tr>
            <tr><td><code>timeLeft</code></td><td>number</td><td>Jäljellä oleva aika</td></tr>
            <tr><td><code>gameOver</code></td><td>boolean</td><td>Peli päättynyt</td></tr>
            <tr><td><code>hitWhite</code></td><td>boolean</td><td>Osuttiinko valkoiseen</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Pelilogiikka</h2>
        <div className="code-block">
{`// Mustan laatan klikkaus:
// 1. Poista klikattu laatta blackTiles-setistä
// 2. Lisää uusi satunnainen musta laatta
// 3. Kasvata pisteitä +1
// 4. Näytä "+1" popup-animaatio

// Valkoisen laatan klikkaus:
// → Peli päättyy välittömästi

// Kestävyysmuoto:
// if (score % 35 === 0) timeLeft += 10`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/leaderboard">Leaderboard</Link> — Tulostaulu</li>
          <li><Link to="/komponentit/tuloksentallennus">TuloksenTallennus</Link> — Tulosten tallennus</li>
        </ul>
      </div>
    </>
  )
}
