import { Link } from 'react-router-dom'

export default function LeaderboardDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>Leaderboard</span>
      </div>
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Tuloslistakomponentti, joka näyttää parhaita tuloksia vaikeustason mukaan suodatettuna.</p>
      </div>

      <div className="file-path">client/src/components/Leaderboard.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Leaderboard on uudelleenkäytettävä komponentti, joka hakee pelituloksia Supabasen näkymästä ja näyttää ne listana. Komponentti tukee suodatusta vaikeustasojen mukaan ja eri esitysmuotoja painikkeille.</p>
      </div>

      <div className="doc-section">
        <h2>Props</h2>
        <table className="props-table">
          <thead>
            <tr><th>Prop</th><th>Tyyppi</th><th>Pakollinen</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>table</code></td><td>string</td><td>Kyllä</td><td>Supabase-näkymän nimi (esim. <code>"palapeli_leaderboard"</code>)</td></tr>
            <tr><td><code>difficulty</code></td><td>string</td><td>Ei</td><td>Oletussuodatus vaikeustason mukaan</td></tr>
            <tr><td><code>time_conversion</code></td><td>boolean</td><td>Ei</td><td>Muuntaa millisekunnit sekunneiksi</td></tr>
            <tr><td><code>format</code></td><td>string</td><td>Ei</td><td>Painikkeiden muoto: <code>"raw"</code> tai <code>"scale"</code></td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Painikemuodot</h2>
        <table className="props-table">
          <thead>
            <tr><th>Muoto</th><th>Esimerkki</th><th>Käyttö</th></tr>
          </thead>
          <tbody>
            <tr><td><code>raw</code></td><td>Easy, Medium, Hard</td><td>Sudoku, yleinen</td></tr>
            <tr><td><code>scale</code></td><td>3×3, 5×5, 7×7</td><td>Palapeli, Nonogram</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Käyttöesimerkki</h2>
        <div className="code-block">
{`import Leaderboard from '../components/Leaderboard'

// Palapelin tulostaulu
<Leaderboard
  table="palapeli_leaderboard"
  difficulty="3"
  time_conversion={true}
  format="scale"
/>

// Sudokun tulostaulu
<Leaderboard
  table="sudoku_leaderboard"
  difficulty="Easy"
  format="raw"
/>`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Toimintalogiikka</h2>
        <ol>
          <li>Hae kaikki tulokset Supabase-näkymästä</li>
          <li>Poimi uniikit vaikeustasot datasta</li>
          <li>Luo dynaamisesti suodatuspainikkeet</li>
          <li>Suodata ja näytä tulokset: sijoitus, käyttäjänimi, paras aika</li>
        </ol>
      </div>

      <div className="doc-section">
        <h2>Näytetyt tiedot</h2>
        <table className="props-table">
          <thead>
            <tr><th>Sarake</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td>Sijoitus</td><td>Järjestysnumero</td></tr>
            <tr><td>Käyttäjänimi</td><td>Pelaajan nimi</td></tr>
            <tr><td>Paras aika</td><td>Nopein suoritusaika</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Käyttävät sivut</h2>
        <ul>
          <li><Link to="/sivut/palapeli">Palapeli</Link></li>
          <li><Link to="/sivut/sudoku">Sudoku</Link></li>
          <li><Link to="/sivut/nonogram">Nonogram</Link></li>
          <li><Link to="/sivut/whitetile">White Tiles</Link></li>
        </ul>
      </div>
    </>
  )
}
