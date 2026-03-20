import { Link } from 'react-router-dom'

export default function PalapeliDoc() {
  return (
    <>
      <div className="page-breadcrumb">
        <Link to="/">Docs</Link> <span>/</span> <span>Sivut</span> <span>/</span> <span>Palapeli</span>
      </div>
      <div className="page-header">
        <h1>🧩 Palapeli</h1>
        <p>Drag & drop -palapeli, jossa voi valita kuvan ja vaikeustason.</p>
      </div>

      <div className="file-path">📄 client/src/pages/Palapeli.jsx</div>

      <div className="doc-section">
        <h2>Yleiskuvaus</h2>
        <p>Palapeli on interaktiivinen palapeli, jossa käyttäjä raahaa palasia varastosta pelilaudalle oikeille paikoilleen. Peli tukee eri kokoja ja kuvia Supabase-tallennustilasta.</p>
      </div>

      <div className="doc-section">
        <h2>Ominaisuudet</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">📐</div>
            <h3>Vaikeustasot</h3>
            <p>3×3, 5×5 ja 7×7 ruudukkokoot</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🖼️</div>
            <h3>Kuvien valinta</h3>
            <p>Valitse kuva Supabase-tallennustilasta</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🖱️</div>
            <h3>Drag & Drop</h3>
            <p>@dnd-kit-kirjastolla toteutettu raahauslogiikka</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">⏱️</div>
            <h3>Ajastin</h3>
            <p>PelienTimer-komponentti mittaa suoritusajan</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🏆</div>
            <h3>Tulostaulu</h3>
            <p>Leaderboard vaikeustason mukaan suodatettuna</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🎉</div>
            <h3>Voittoanimaatio</h3>
            <p>Visuaalinen palaute pelin voittamisesta</p>
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
            <tr><td><code>board</code></td><td>Array</td><td>Palojen sijainnit pelilaudalla</td></tr>
            <tr><td><code>pieces</code></td><td>Array</td><td>Palat varastossa</td></tr>
            <tr><td><code>gridSize</code></td><td>number</td><td>Ruudukon koko (3, 5 tai 7)</td></tr>
            <tr><td><code>IMAGE_SRC</code></td><td>string</td><td>Valitun kuvan URL</td></tr>
            <tr><td><code>isGameActive</code></td><td>boolean</td><td>Onko peli käynnissä</td></tr>
          </tbody>
        </table>
      </div>

      <div className="doc-section">
        <h2>Apukomponentit</h2>
        <div className="info-card">
          <h3><code>DraggablePiece</code></h3>
          <p>Wrapper-komponentti raahattaville palasille. Käyttää @dnd-kit:n useDraggable-hookia.</p>
        </div>
        <div className="info-card">
          <h3><code>DroppableCell</code></h3>
          <p>Pelilaudan solu, johon paloja voi pudottaa. Käyttää @dnd-kit:n useDroppable-hookia.</p>
        </div>
        <div className="info-card">
          <h3><code>DroppableStorage</code></h3>
          <p>Palojen varastoalue laudan ulkopuolella.</p>
        </div>
        <div className="info-card">
          <h3><code>PuzzlePiece</code></h3>
          <p>Palan visuaalinen esitys käyttäen CSS:n background-position-ominaisuutta kuvan leikkaamiseen.</p>
        </div>
      </div>

      <div className="doc-section">
        <h2>Drag & Drop -toteutus</h2>
        <div className="code-block">
{`// @dnd-kit käyttö
import { DndContext, closestCenter } from '@dnd-kit/core'

<DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  {/* Pelilauta ja varasto */}
</DndContext>

// handleDragEnd: siirtää palan varastosta laudalle
// tai vaihtaa kahden palan paikkoja laudalla`}
        </div>
      </div>

      <div className="doc-section">
        <h2>Liittyvät komponentit</h2>
        <ul>
          <li><Link to="/komponentit/leaderboard">Leaderboard</Link> — Tulostaulu</li>
          <li><Link to="/komponentit/tuloksentallennus">TuloksenTallennus</Link> — Tulosten tallennus</li>
          <li><Link to="/komponentit/pelientimer">PelienTimer</Link> — Ajastin</li>
        </ul>
      </div>
    </>
  )
}
