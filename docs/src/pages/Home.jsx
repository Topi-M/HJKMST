import { Link } from 'react-router-dom'

const games = [
  { to: '/sivut/palapeli', icon: '🧩', title: 'Palapeli', desc: 'Drag & drop -palapeli vaihtuvilla kuvilla ja vaikeustasoilla' },
  { to: '/sivut/sudoku', icon: '🔢', title: 'Sudoku', desc: '9x9 logiikkapeli kolmella vaikeustasolla' },
  { to: '/sivut/nonogram', icon: '🖼️', title: 'Nonogram', desc: 'Kuva-logiikkapeli vihjeiden perusteella' },
  { to: '/sivut/muistipeli', icon: '🃏', title: 'Muistipeli', desc: 'Korttien muistipeli eri teemoilla' },
  { to: '/sivut/whitetile', icon: '🎹', title: 'White Tiles', desc: 'Nopea reaktiopeli kahdella pelimuodolla' },
  { to: '/sivut/ristinolla', icon: '❌', title: 'Ristinolla', desc: 'Moninpeli reaaliajassa Supabase Realtimella' },
]

const components = [
  { to: '/komponentit/leaderboard', icon: '🏆', title: 'Leaderboard', desc: 'Tuloslistat vaikeustason mukaan suodatettuna' },
  { to: '/komponentit/tuloksentallennus', icon: '💾', title: 'TuloksenTallennus', desc: 'Pelitulosten tallennus Supabaseen' },
  { to: '/komponentit/pelientimer', icon: '⏱️', title: 'PelienTimer', desc: 'Ajastin peleille millisekunnin tarkkuudella' },
  { to: '/komponentit/themecontext', icon: '🌗', title: 'ThemeContext', desc: 'Tumma/vaalea teeman hallinta' },
]

export default function Home() {
  return (
    <>
      <div className="home-hero">
        <h1>HJKMST Dokumentaatio</h1>
        <p>Minipelialusta, jossa on 6 peliä, käyttäjätunnistautuminen, tuloslistat ja moninpeli. Rakennettu Reactilla ja Supabasella.</p>
        <div className="home-stats">
          <div className="home-stat">
            <div className="home-stat-number">6</div>
            <div className="home-stat-label">Peliä</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">10</div>
            <div className="home-stat-label">Sivua</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-number">14</div>
            <div className="home-stat-label">Komponenttia</div>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2 className="home-section-title">Teknologiat</h2>
        <div className="tech-list">
          <span className="tech-badge">⚛️ React 18</span>
          <span className="tech-badge">⚡ Vite</span>
          <span className="tech-badge">🛣️ React Router v6</span>
          <span className="tech-badge">🗄️ Supabase</span>
          <span className="tech-badge">🎨 React Bootstrap</span>
          <span className="tech-badge">🖱️ @dnd-kit</span>
          <span className="tech-badge">📡 Supabase Realtime</span>
        </div>
      </div>

      <div className="doc-section">
        <h2 className="home-section-title">Pelit</h2>
        <div className="game-grid">
          {games.map((g) => (
            <Link key={g.to} to={g.to} className="game-card">
              <div className="game-card-icon">{g.icon}</div>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="doc-section">
        <h2 className="home-section-title">Yhteiset komponentit</h2>
        <div className="game-grid">
          {components.map((c) => (
            <Link key={c.to} to={c.to} className="game-card">
              <div className="game-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="doc-section">
        <h2 className="home-section-title">Projektin rakenne</h2>
        <div className="code-block">
{`client/src/
├── pages/              # Sivukomponentit
│   ├── Etusivu.jsx     # Pelivalikko
│   ├── Palapeli.jsx    # Palapeli
│   ├── Sudoku.jsx      # Sudoku
│   ├── Nonogram.jsx    # Nonogram
│   ├── Muistipeli.jsx  # Muistipeli
│   ├── WhiteTile.jsx   # White Tiles
│   ├── Login.jsx       # Kirjautuminen
│   ├── Profiili.jsx    # Profiili
│   ├── Ristinolla.tsx  # Ristinolla (moninpeli)
│   └── Lobby.tsx       # Pelilobby
├── components/         # Uudelleenkäytettävät komponentit
│   ├── Leaderboard.jsx
│   ├── TuloksenTallennus.jsx
│   ├── PelienTimer.jsx
│   ├── MuistipeliLogiikka.jsx
│   ├── ThemeContext.jsx
│   ├── AuthFrom.jsx
│   ├── SupaBaseClient.jsx
│   └── ...palapeli-komponentit
├── css/                # Tyylitiedostot
├── App.jsx             # Sovelluksen juuri
├── main.jsx            # Sisääntulopiste
├── router.jsx          # Reititys
└── navbar.jsx          # Navigointipalkki`}
        </div>
      </div>
    </>
  )
}
