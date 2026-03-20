import { Link } from 'react-router-dom'

export default function LobbyDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Lobby</span>
      </div>
      <div className="page-header">
        <h1>🚪 Lobby</h1>
        <p>Moninpelin pelilobby huoneiden luomiseen ja liittymiseen.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Lobby.tsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Lobby on moninpelin aulasivu, jossa pelaajat voivat luoda uusia pelihuoneita tai liittyä olemassa oleviin. Huoneet päivittyvät reaaliajassa Supabasen postgres_changes-kuuntelijalla.</p>
        <div className="info-card">
          <h3>Huomio: TypeScript</h3>
          <p>Tämä komponentti on kirjoitettu TypeScriptillä (.tsx).</p>
        </div>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">➕</div>
            <h3>Huoneen luonti</h3>
            <p>Nimi, pelityyppi ja valinnainen salasana</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📋</div>
            <h3>Huonelistaus</h3>
            <p>Kaikki saatavilla olevat huoneet reaaliajassa</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔒</div>
            <h3>Salasanasuojaus</h3>
            <p>Huoneet voivat olla salasanasuojattuja</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📡</div>
            <h3>Reaaliaikaiset päivitykset</h3>
            <p>Supabase postgres_changes kuuntelee muutoksia</p>
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
            <tr><td><code>rooms</code></td><td>Array</td><td>Lista saatavilla olevista huoneista</td></tr>
            <tr><td><code>name</code></td><td>string</td><td>Uuden huoneen nimi</td></tr>
            <tr><td><code>gameType</code></td><td>string</td><td>Pelityyppi (tällä hetkellä "ristinolla")</td></tr>
            <tr><td><code>password</code></td><td>string</td><td>Huoneen salasana</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Tietokantarakenne</h2>
        <div className="code-block">
{`// rooms-taulu Supabasessa
{
  id: uuid,
  name: string,        // Huoneen nimi
  game_type: string,   // Pelityyppi
  password: string?,   // Valinnainen salasana
  created_at: timestamp
}

// Reaaliaikaiset päivitykset
supabase.channel('rooms')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'rooms' },
    (payload) => { /* päivitä huonelista */ }
  )`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät sivut</h2>
        <ul>
          <li><Link to="/sivut/ristinolla">Ristinolla</Link> — Ristinollapeli, johon lobby ohjaa</li>
        </ul>
      </div>
    </>
  )
}
