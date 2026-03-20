import { Link } from 'react-router-dom'

export default function AuthFormDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>AuthForm</span>
      </div>
      <div className="page-header">
        <h1>📝 AuthForm</h1>
        <p>Kirjautumis- ja rekisteröitymislomakekomponentti.</p>
      </div>

      <div className="file-path">📄 client/src/components/AuthFrom.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>AuthForm on lomakekomponentti, joka tukee sekä kirjautumista että rekisteröitymistä. Lomakkeen tila vaihtuu painikkeilla. Rekisteröityessä käyttäjänimi tallennetaan Supabasen käyttäjämetadataan.</p>
        <div className="info-card">
          <h3>Huomio: Tiedostonimi</h3>
          <p>Tiedoston nimi on <code>AuthFrom.jsx</code> (kirjoitusvirhe: "From" eikä "Form").</p>
        </div>
      </div>

      <div className="doc-section">
        <h2>Props</h2>
        <table className="props-table">
          <thead>
            <tr><th>Prop</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>supabase</code></td><td>SupabaseClient</td><td>Supabase-asiakasinstanssi</td></tr>
            <tr><td><code>setError</code></td><td>function</td><td>Virheviestien asettaminen</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Tilat (Modes)</h2>
        <table className="props-table">
          <thead>
            <tr><th>Tila</th><th>Kentät</th><th>Toiminto</th></tr>
          </thead>
          <tbody>
            <tr><td><code>"login"</code></td><td>Sähköposti, salasana</td><td><code>signInWithPassword</code></td></tr>
            <tr><td><code>"signup"</code></td><td>Sähköposti, salasana, käyttäjänimi</td><td><code>signUp</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Käyttöesimerkki</h2>
        <div className="code-block">
{`import AuthForm from '../components/AuthFrom'
import { supabase } from '../components/SupaBaseClient'

<AuthForm
  supabase={supabase}
  setError={setError}
/>`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/sivut/login">Login-sivu</Link> — Käyttää tätä komponenttia</li>
          <li><Link to="/komponentit/supabaseclient">SupaBaseClient</Link> — Supabase-yhteys</li>
        </ul>
      </div>
    </>
  )
}
