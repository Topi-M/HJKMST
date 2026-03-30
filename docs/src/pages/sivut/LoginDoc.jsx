import { Link } from 'react-router-dom'

export default function LoginDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Kirjautuminen</span>
      </div>
      <div className="page-header">
        <h1>Kirjautuminen</h1>
        <p>Käyttäjätunnistautumissivu kirjautumis- ja rekisteröitymislomakkeilla.</p>
      </div>

      <div className="file-path">client/src/pages/Login.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Login-sivu tarjoaa Supabase-autentikaation kirjautumiseen ja uuden tilin luomiseen. Sivu tunnistaa jo kirjautuneen käyttäjän ja näyttää kirjautumistiedot tai lomakkeen tilanteen mukaan.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Sähköposti + salasana</h3>
            <p>Kirjautuminen sähköpostilla ja salasanalla</p>
          </div>
          <div className="feature-card">
            <h3>Rekisteröityminen</h3>
            <p>Uuden tilin luonti käyttäjänimellä</p>
          </div>
          <div className="feature-card">
            <h3>Tumma tila</h3>
            <p>Tukee ThemeContext-tummatilaa</p>
          </div>
          <div className="feature-card">
            <h3>Tilan seuranta</h3>
            <p>Supabase auth state listener tunnistaa käyttäjän</p>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>Komponenttirakenne</h2>
        <div className="code-block">
{`Login.jsx
├── AuthForm.jsx       // Kirjautumis/rekisteröitymislomake
│   ├── mode: "login" | "signup"
│   ├── Sähköposti + salasana -kentät
│   └── Käyttäjänimi (vain rekisteröityminen)
└── ErrorMessage.jsx   // Virheviestien näyttö`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Supabase Auth -integraatio</h2>
        <div className="code-block">
{`// Kirjautuminen
const { error } = await supabase.auth
  .signInWithPassword({ email, password })

// Rekisteröityminen
const { error } = await supabase.auth
  .signUp({
    email,
    password,
    options: {
      data: { username }  // Tallennetaan metadataan
    }
  })

// Uloskirjautuminen
await supabase.auth.signOut()`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/authform">AuthForm</Link> — Lomakekomponentti</li>
          <li><Link to="/komponentit/themecontext">ThemeContext</Link> — Teeman hallinta</li>
          <li><Link to="/komponentit/supabaseclient">SupaBaseClient</Link> — Supabase-yhteys</li>
        </ul>
      </div>
    </>
  )
}
