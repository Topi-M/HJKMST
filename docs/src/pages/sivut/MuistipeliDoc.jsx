import { Link } from 'react-router-dom'

export default function MuistipeliDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Muistipeli</span>
      </div>
      <div className="page-header">
        <h1>🃏 Muistipeli</h1>
        <p>Korttien muistipeli eri teemoilla ja vaikeustasoilla.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Muistipeli.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Muistipeli on klassinen korttien kääntöpeli, jossa etsitään parit. Sivu itsessään on wrapper-komponentti, joka renderöi <code>MuistipeliLogiikka</code>-komponentin.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">📊</div>
            <h3>Vaikeustasot</h3>
            <p>4, 6 tai 8 paria</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🎨</div>
            <h3>Teemat</h3>
            <p>Eläimet, Autot, Dinosaurukset</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🖼️</div>
            <h3>Supabase-kuvat</h3>
            <p>Kuvat haetaan <code>muistipeliKuvat</code>-bucketista</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔄</div>
            <h3>Kääntöanimaatio</h3>
            <p>CSS-pohjainen kortin kääntöefekti</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Arkkitehtuuri</h2>
        <div className="code-block">
{`Muistipeli.jsx          (Sivukomponentti / wrapper)
  └── MuistipeliLogiikka.jsx  (Koko pelin logiikka)
       └── Kortti.jsx          (Yksittäinen pelikortti)`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Kortin tietorakenne</h2>
        <div className="code-block">
{`{
  id: 1,           // Uniikki tunniste
  pairId: 0,       // Parin tunniste
  image: "url",    // Kuvan URL Supabasesta
  isFlipped: false, // Onko kortti käännetty
  passed: false     // Onko pari löydetty
}`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/muistipelilogiikka">MuistipeliLogiikka</Link> — Pelin logiikka</li>
          <li><Link to="/komponentit/pelientimer">PelienTimer</Link> — Ajastin</li>
        </ul>
      </div>
    </>
  )
}
