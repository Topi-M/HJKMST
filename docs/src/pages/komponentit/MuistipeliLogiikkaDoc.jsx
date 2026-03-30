import { Link } from 'react-router-dom'

export default function MuistipeliLogiikkaDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>MuistipeliLogiikka</span>
      </div>
      <div className="page-header">
        <h1>MuistipeliLogiikka</h1>
        <p>Muistipelin koko pelilogiikka ja käyttöliittymä.</p>
      </div>

      <div className="file-path">client/src/components/MuistipeliLogiikka.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>MuistipeliLogiikka sisältää koko muistipelin toteutuksen: teeman ja vaikeustason valinnan, kuvien haun Supabasesta, korttien kääntölogiikan, parien tunnistamisen ja voiton tarkistuksen.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Vaikeustasot</h3>
            <p>4, 6 tai 8 paria</p>
          </div>
          <div className="feature-card">
            <h3>Teemat</h3>
            <p>Eläimet, Autot, Dinosaurukset</p>
          </div>
          <div className="feature-card">
            <h3>Supabase Storage</h3>
            <p>Kuvat haetaan <code>muistipeliKuvat</code>-bucketista</p>
          </div>
          <div className="feature-card">
            <h3>Kääntöanimaatio</h3>
            <p>CSS-luokkapohjaiset korttien animaatiot</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Tilan hallinta</h2>
        <table className="props-table">
          <thead>
            <tr><th>Tila</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>cardsState</code></td><td>Array</td><td>Kaikkien korttien tilat</td></tr>
            <tr><td><code>firstCard</code></td><td>Object | null</td><td>Ensimmäinen valittu kortti</td></tr>
            <tr><td><code>secondClick</code></td><td>boolean</td><td>Onko toinen kortti valittu</td></tr>
            <tr><td><code>hasWon</code></td><td>boolean</td><td>Onko peli voitettu</td></tr>
            <tr><td><code>difficulty</code></td><td>number</td><td>Parien lukumäärä</td></tr>
            <tr><td><code>theme</code></td><td>string</td><td>Valittu teema</td></tr>
            <tr><td><code>wait</code></td><td>boolean</td><td>Odotustila (1500ms) ei-matchaavien korttien välillä</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Pelilogiikka</h2>
        <div className="code-block">
{`// Kortin klikkaus:
// 1. Käännä kortti (isFlipped = true)
// 2. Jos ensimmäinen kortti → tallenna firstCard
// 3. Jos toinen kortti:
//    a. Parit matchaavat (pairId sama):
//       → Merkitse molemmat passed = true
//    b. Parit eivät matchaa:
//       → Odota 1500ms
//       → Käännä molemmat takaisin
// 4. Tarkista voitto: kaikki kortit passed?`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Kortti-komponentti</h2>
        <div className="info-card">
          <h3><code>Kortti.jsx</code></h3>
          <p>Visuaalinen kortti-komponentti, joka näyttää etupuolen (kuva) tai takapuolen. CSS-luokkakytkintä käytetään kääntöanimaatioon. Takapuolen kuva haetaan Supabasesta.</p>
        </div>
        <div className="code-block">
{`// Kortti.jsx Props:
{
  card: {
    id, pairId, image,
    isFlipped, passed
  },
  onClick: (card) => void
}`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/sivut/muistipeli">Muistipeli-sivu</Link> — Wrapper joka renderöi tämän</li>
          <li><Link to="/komponentit/pelientimer">PelienTimer</Link> — Ajastin</li>
        </ul>
      </div>
    </>
  )
}
