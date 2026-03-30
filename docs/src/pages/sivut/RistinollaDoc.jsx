import { Link } from 'react-router-dom'

export default function RistinollaDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Ristinolla</span>
      </div>
      <div className="page-header">
        <h1>Ristinolla</h1>
        <p>Moninpeli-ristinolla reaaliajassa Supabase Realtimella.</p>
      </div>

      <div className="file-path">client/src/pages/Ristinolla.tsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Ristinolla on reaaliaikainen moninpeli, joka käyttää Supabase Realtime -kanavia siirtojen synkronointiin pelaajien välillä. Jokainen peli tapahtuu omassa huoneessa, jonka ID tulee URL-parametrista.</p>
        <div className="info-card">
          <h3>Huomio: TypeScript</h3>
          <p>Tämä komponentti on kirjoitettu TypeScriptillä (.tsx), toisin kuin muut sivut.</p>
        </div>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Reaaliaikainen</h3>
            <p>Supabase Realtime broadcast siirtojen synkronointiin</p>
          </div>
          <div className="feature-card">
            <h3>Presence-seuranta</h3>
            <p>Näyttää yhdistettyjen pelaajien määrän</p>
          </div>
          <div className="feature-card">
            <h3>Automaattinen rooli</h3>
            <p>X/O jaetaan automaattisesti liittymisjärjestyksen mukaan</p>
          </div>
          <div className="feature-card">
            <h3>Katselutila</h3>
            <p>Jos huone täynnä (2+ pelaajaa), muut ovat katsojia</p>
          </div>
          <div className="feature-card">
            <h3>Nollaus</h3>
            <p>Lauta voidaan nollata kaikille pelaajille</p>
          </div>
          <div className="feature-card">
            <h3>Voittajan tunnistus</h3>
            <p>8 mahdollista voittolinjaa tarkistetaan</p>
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
            <tr><td><code>board</code></td><td>Array(9)</td><td>Pelilaudan 9 solua</td></tr>
            <tr><td><code>currentTurn</code></td><td>"X" | "O"</td><td>Kenen vuoro</td></tr>
            <tr><td><code>myPlayer</code></td><td>"X" | "O" | null</td><td>Oma pelaajasymboli</td></tr>
            <tr><td><code>playersCount</code></td><td>number</td><td>Yhdistettyjen pelaajien määrä</td></tr>
            <tr><td><code>myId</code></td><td>string</td><td>Uniikki pelaajatunniste</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Realtime-arkkitehtuuri</h2>
        <div className="code-block">
{`// Supabase Realtime Channel
const channel = supabase.channel('room-' + id)

// Broadcast: siirtojen lähettäminen
channel.send({
  type: 'broadcast',
  event: 'move',
  payload: { index, player }
})

// Presence: pelaajien seuranta
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  setPlayersCount(Object.keys(state).length)
})`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Reititys</h2>
        <div className="code-block">
{`// Dynaaminen reitti
<Route path="/Ristinolla/:id" element={<Ristinolla />} />

// Huoneen ID tulee URL:sta
const { id } = useParams()`}
        </div>
      </div>
    </>
  )
}
