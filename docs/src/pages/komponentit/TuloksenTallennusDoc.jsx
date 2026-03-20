import { Link } from 'react-router-dom'

export default function TuloksenTallennusDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>TuloksenTallennus</span>
      </div>
      <div className="page-header">
        <h1>💾 TuloksenTallennus</h1>
        <p>Apufunktio pelitulosten tallentamiseen Supabase-tietokantaan.</p>
      </div>

      <div className="file-path">📄 client/src/components/TuloksenTallennus.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>TuloksenTallennus ei ole visuaalinen komponentti, vaan apufunktio (<code>tallennaTulos</code>), joka tallentaa pelituloksen Supabasen <code>submission</code>-tauluun. Funktio tarkistaa käyttäjän autentikaation ennen tallennusta.</p>
      </div>

      <div className="doc-section">
        <h2>Funktiosignatuuri</h2>
        <div className="code-block">
{`tallennaTulos(
  minigame_id,   // number - Pelin tunniste
  startTimeMs,   // number - Aloitusaika (ms)
  endTimeMs,     // number - Lopetusaika (ms)
  difficulty,    // string - Vaikeustaso
  score = null   // number? - Valinnainen pistemäärä
)`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Parametrit</h2>
        <table className="props-table">
          <thead>
            <tr><th>Parametri</th><th>Tyyppi</th><th>Pakollinen</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>minigame_id</code></td><td>number</td><td>Kyllä</td><td>Pelin tunniste</td></tr>
            <tr><td><code>startTimeMs</code></td><td>number</td><td>Kyllä</td><td>Pelin aloitusaika millisekunneissa</td></tr>
            <tr><td><code>endTimeMs</code></td><td>number</td><td>Kyllä</td><td>Pelin lopetusaika millisekunneissa</td></tr>
            <tr><td><code>difficulty</code></td><td>string</td><td>Kyllä</td><td>Vaikeustason nimi</td></tr>
            <tr><td><code>score</code></td><td>number | null</td><td>Ei</td><td>Jos annettu, käytetään lasketun ajan sijasta</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Peli-ID:t</h2>
        <table className="props-table">
          <thead>
            <tr><th>ID</th><th>Peli</th></tr>
          </thead>
          <tbody>
            <tr><td><code>1</code></td><td>Palapeli</td></tr>
            <tr><td><code>2</code></td><td>Sudoku</td></tr>
            <tr><td><code>6</code></td><td>White Tiles</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Toimintalogiikka</h2>
        <div className="code-block">
{`async function tallennaTulos(minigame_id, startTimeMs, endTimeMs, difficulty, score = null) {
  // 1. Tarkista autentikaatio
  const user = supabase.auth.getUser()
  if (!user) return { success: false }

  // 2. Laske suoritusaika
  const time = endTimeMs - startTimeMs

  // 3. Tallenna tietokantaan
  const { error } = await supabase
    .from('submission')
    .insert({
      minigame_id,
      time: score ?? time,  // score ohittaa lasketun ajan
      difficulty,
      user_id: user.id
    })

  return { success: !error }
}`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Käyttävät sivut</h2>
        <ul>
          <li><Link to="/sivut/palapeli">Palapeli</Link> (minigame_id: 1)</li>
          <li><Link to="/sivut/sudoku">Sudoku</Link> (minigame_id: 2)</li>
          <li><Link to="/sivut/whitetile">White Tiles</Link> (minigame_id: 6)</li>
        </ul>
      </div>
    </>
  )
}
