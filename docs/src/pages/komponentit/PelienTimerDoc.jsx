import { Link } from 'react-router-dom'

export default function PelienTimerDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Komponentit</span> <span>/</span> <span>PelienTimer</span>
      </div>
      <div className="page-header">
        <h1>⏱️ PelienTimer</h1>
        <p>Ajastinkomponentti peleille senttisekunnin tarkkuudella.</p>
      </div>

      <div className="file-path">📄 client/src/components/PelienTimer.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>PelienTimer on uudelleenkäytettävä ajastin, joka näyttää kuluneen ajan muodossa MM:SS:CS (minuutit:sekunnit:sadasosat). Ajastin päivittyy 10ms välein ja tukee nollausta.</p>
      </div>

      <div className="doc-section">
        <h2>Props</h2>
        <table className="props-table">
          <thead>
            <tr><th>Prop</th><th>Tyyppi</th><th>Kuvaus</th></tr>
          </thead>
          <tbody>
            <tr><td><code>isRunning</code></td><td>boolean</td><td>Onko ajastin aktiivinen</td></tr>
            <tr><td><code>onFinish</code></td><td>function</td><td>Callback kun ajastin pysäytetään</td></tr>
            <tr><td><code>resetTrigger</code></td><td>any</td><td>Muutos nollaa ajastimen</td></tr>
            <tr><td><code>setGameStartTime</code></td><td>function</td><td>Callback aloitusajan asettamiseen</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Aikaformaatti</h2>
        <div className="code-block">
{`// Näyttömuoto: MM:SS:CS
// Esimerkki: 02:34:56

// MM = minuutit (00-59)
// SS = sekunnit (00-59)
// CS = sadasosat (00-99)

// Päivitysväli: 10ms (setInterval)`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Käyttöesimerkki</h2>
        <div className="code-block">
{`import PelienTimer from '../components/PelienTimer'

<PelienTimer
  isRunning={isGameActive}
  onFinish={(endTime) => handleGameEnd(endTime)}
  resetTrigger={resetCounter}
  setGameStartTime={setStartTime}
/>`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Sisäinen toiminta</h2>
        <ol>
          <li><code>isRunning</code> muuttuu <code>true</code> → tallennetaan aloitusaika ja käynnistetään interval</li>
          <li>Interval päivittää näyttöä 10ms välein</li>
          <li><code>isRunning</code> muuttuu <code>false</code> → pysäytetään ja kutsutaan <code>onFinish</code></li>
          <li><code>resetTrigger</code> muuttuu → nollataan ajastin</li>
        </ol>
      </div>

      <div className="doc-section">
        <h2>Käyttävät sivut</h2>
        <ul>
          <li><Link to="/sivut/palapeli">Palapeli</Link></li>
          <li><Link to="/sivut/sudoku">Sudoku</Link></li>
          <li><Link to="/sivut/nonogram">Nonogram</Link></li>
          <li><Link to="/sivut/muistipeli">Muistipeli</Link></li>
        </ul>
      </div>
    </>
  )
}
