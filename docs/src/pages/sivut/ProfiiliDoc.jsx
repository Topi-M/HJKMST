import { Link } from 'react-router-dom'

export default function ProfiiliDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Profiili</span>
      </div>
      <div className="page-header">
        <h1>👤 Profiili</h1>
        <p>Käyttäjän profiilisivu pelitilastoilla.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Profiili.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Profiili-sivu näyttää kirjautuneen käyttäjän pelitilastot. Jos käyttäjä ei ole kirjautunut, sivu ohjaa kirjautumissivulle. Data haetaan Supabasen <code>profiili_tilastot</code>-näkymästä.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">🔒</div>
            <h3>Autentikaatiotarkistus</h3>
            <p>Tarkistaa kirjautumistilan ennen datan hakua</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📊</div>
            <h3>Pelitilastot</h3>
            <p>Ratkaistut palapelit ja muut tilastot</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">⏳</div>
            <h3>Lataus- ja virhetilat</h3>
            <p>Loading spinner ja virheilmoitukset</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Data</h2>
        <div className="code-block">
{`// Haetaan Supabasesta
const { data } = await supabase
  .from('profiili_tilastot')
  .select('palapeli_submission_count')
  .eq('user_id', user.id)
  .single()

// Näytetään:
// - Ratkaistujen palapelienn lukumäärä`}
        </div>
      </div>
    </>
  )
}
