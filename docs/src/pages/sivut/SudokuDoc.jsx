import { Link } from 'react-router-dom'

export default function SudokuDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Sudoku</span>
      </div>
      <div className="page-header">
        <h1>🔢 Sudoku</h1>
        <p>Klassinen 9×9 Sudoku-peli kolmella vaikeustasolla ja tarkistustoiminnolla.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Sudoku.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Sudoku-peli hakee satunnaisen puzzlen Supabase-tietokannasta. Käyttäjä valitsee solun ja syöttää numeron numeropainikkeilla. Peli tukee ratkaisun tarkistusta, nollausta ja uutta peliä.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">📊</div>
            <h3>Vaikeustasot</h3>
            <p>Easy (4), Medium (5), Hard (6) — määrittää tyhjien solujen määrän</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🗄️</div>
            <h3>Tietokantaintegraatio</h3>
            <p>Puzzlet haetaan <code>sudokupuzzles</code>-taulusta Supabasesta</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">✅</div>
            <h3>Tarkistus</h3>
            <p>Ratkaisun oikeellisuuden tarkistus animaatiolla</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🧹</div>
            <h3>Pyyhintä</h3>
            <p>Yksittäisten solujen tyhjentäminen eraser-painikkeella</p>
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
            <tr><td><code>board</code></td><td>2D Array</td><td>Pelilaudan nykyinen tila</td></tr>
            <tr><td><code>initialBoard</code></td><td>2D Array</td><td>Alkuperäinen puzzlen tila (lukitut solut)</td></tr>
            <tr><td><code>selected</code></td><td>[row, col]</td><td>Valittu solu</td></tr>
            <tr><td><code>difficulty</code></td><td>number</td><td>Vaikeustaso (4, 5, 6)</td></tr>
            <tr><td><code>solution</code></td><td>string</td><td>Oikea ratkaisu merkkijonona</td></tr>
            <tr><td><code>greenCells</code></td><td>number</td><td>Animaatiolaskuri oikealle ratkaisulle</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Pelilogiikka</h2>
        <div className="code-block">
{`// 1. Hae puzzle tietokannasta
const { data } = await supabase
  .from('sudokupuzzles')
  .select('*')
  .eq('difficulty', difficulty)

// 2. Valitse satunnainen puzzle
const puzzle = data[Math.floor(Math.random() * data.length)]

// 3. Käyttäjä klikkaa solua → selected = [row, col]
// 4. Käyttäjä klikkaa numeroa → board[row][col] = number
// 5. Tarkista ratkaisu → vertaa board vs solution`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/leaderboard">Leaderboard</Link> — Tulostaulu vaikeustason mukaan</li>
          <li><Link to="/komponentit/tuloksentallennus">TuloksenTallennus</Link> — Ajan tallennus</li>
          <li><Link to="/komponentit/pelientimer">PelienTimer</Link> — Ajastin</li>
        </ul>
      </div>
    </>
  )
}
