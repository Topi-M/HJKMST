import { Link } from 'react-router-dom'

export default function SupaBaseClientDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>SupaBaseClient</span>
      </div>
      <div className="page-header">
        <h1>SupaBaseClient</h1>
        <p>Supabase-asiakkaan alustus ja yhteyden hallinta.</p>
      </div>

      <div className="file-path">client/src/components/SupaBaseClient.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>SupaBaseClient luo ja exporttaa yhden Supabase-asiakasinstanssin, jota kaikki komponentit käyttävät. Yhteys konfiguroidaan ympäristömuuttujilla.</p>
      </div>

      <div className="doc-section">
        <h2>Ympäristömuuttujat</h2>
        <table className="props-table">
          <thead>
            <tr><th>Muuttuja</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>VITE_SUPABASE_URL</code></td><td>Supabase-projektin URL</td></tr>
            <tr><td><code>VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY</code></td><td>Supabasen julkinen API-avain (anon key)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Käyttö</h2>
        <div className="code-block">
{`// SupaBaseClient.jsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Muissa komponenteissa:
import { supabase } from '../components/SupaBaseClient'

// Tietokantakysely
const { data } = await supabase.from('table').select('*')

// Autentikaatio
const { user } = await supabase.auth.getUser()

// Realtime
const channel = supabase.channel('my-channel')

// Storage
const { data } = await supabase.storage.from('bucket').list()`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Supabase-palvelut käytössä</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Database</h3>
            <p>Pelitulokset, sudoku-puzzlet, huoneet</p>
          </div>
          <div className="feature-card">
            <h3>Auth</h3>
            <p>Käyttäjätunnistautuminen sähköpostilla</p>
          </div>
          <div className="feature-card">
            <h3>Storage</h3>
            <p>Palapelin kuvat ja muistipelin kortit</p>
          </div>
          <div className="feature-card">
            <h3>Realtime</h3>
            <p>Ristinollan broadcast ja Lobbyn postgres_changes</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Käyttävät kaikki komponentit</h2>
        <p>Lähes jokainen sovelluksen komponentti importtaa tämän. Tärkeimmät:</p>
        <ul>
          <li><Link to="/sivut/login">Login</Link> — Autentikaatio</li>
          <li><Link to="/sivut/ristinolla">Ristinolla</Link> — Realtime</li>
          <li><Link to="/sivut/lobby">Lobby</Link> — Database + Realtime</li>
          <li><Link to="/komponentit/leaderboard">Leaderboard</Link> — Database</li>
          <li><Link to="/komponentit/tuloksentallennus">TuloksenTallennus</Link> — Database + Auth</li>
        </ul>
      </div>
    </>
  )
}
