import { useState, useEffect, useRef } from "react";
import "../css/whitetile.css";
import Leaderboard from "../components/Leaderboard.jsx";
import { tallennaTulos } from "../components/TuloksenTallennus.jsx";

/**
 * Piano tiles tyyppinen "Dont tap the white tile" peli. Klikkaa mahdollisimman montaa mustaa
 * ruutua annetussa ajassa.
 */

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const BLACK_COUNT = 3;
const GAME_DURATION = 10;

// Asettaa mustat ruudut pelin alussa.
function initBlackTiles() {
  const set = new Set();
  while (set.size < BLACK_COUNT) { // Joukko ei hyväksy duplikaatteja, toistetaan kunnes saadaan 3 eri indeksiä
    set.add(Math.floor(Math.random() * TOTAL_TILES));
  }
  return set;
}

// Lisää uuden mustan ruudun satunnaiseen sijaintiin. Kutsutaan mustaa ruutua klikatessa.
// Parametreinä existing, eli nykyiset mustat ruudut ja exclude, joka on juuri klikattu musta ruutu.
// exclude varmistaa, että musta ruutu ei voi saada samaa sijaintia kahdesti peräkkäin.
function addRandomBlack(existing, exclude = -1) {
  const available = [];

  // Loopissa available listaan lisätään kaikki mahdolliset vapaat paikat, joihin uusi musta ruutu voidaan asettaa.
  for (let i = 0; i < TOTAL_TILES; i++) {
    if (!existing.has(i) && i !== exclude) available.push(i);
  }
  if (available.length === 0) return existing;
  const pick = available[Math.floor(Math.random() * available.length)]; // arvotaan uuden mustan ruudun sijainti
  const next = new Set(existing);
  next.add(pick);
  return next; // Palautetaan uusi lista mustista ruuduista
}
//
// Pelin varsinainen logiikka
//
export default function WhiteTile() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hitWhite, setHitWhite] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [blackTiles, setBlackTiles] = useState(new Set());
  const [pops, setPops] = useState([]);
  const blackTilesRef = useRef(new Set());
  const scoreRef = useRef(0);

  // Countdown-ajastin
  useEffect(() => {
    if (!isGameActive) return;
    if (timeLeft <= 0) {
      setIsGameActive(false);
      setGameOver(true);
      blackTilesRef.current = new Set();
      setBlackTiles(new Set());
      tallennaTulos(6, Date.now(), Date.now(), "10s", scoreRef.current);
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [isGameActive, timeLeft]);

  // Kutsutaan uutta peliä aloittaessa. Nollaa mustien ruutujen sijainnin, ajan, pisteet ja muut tilat.
  function handleStart() {
    const initial = initBlackTiles();
    blackTilesRef.current = initial;
    setBlackTiles(initial);
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setHitWhite(false);
    setIsGameActive(true);
  }

  // Kutsutaan mitä tahansa ruutua klikatessa. Parametrina idx = klikatun ruudun indeksi (0-TOTAL_TILES)
  function handleTileClick(idx) {
    if (!isGameActive) return;
    const current = blackTilesRef.current;

    // Jos klikattu ruutu ei ole mustien ruutujen joukossa -> peli loppuu 
    if (!current.has(idx)) {
      setIsGameActive(false);
      setGameOver(true);
      setHitWhite(true);
      blackTilesRef.current = new Set();
      setBlackTiles(new Set());
      return;
    }

    // Jos klikattu ruutu oli musta, poistetaan se mustien ruutujen listasta ja lisätään pelilaudalle uusi musta ruutu.
    const withoutClicked = new Set(current);
    withoutClicked.delete(idx);
    const next = addRandomBlack(withoutClicked, idx); // <- arvotaan uusi sijainti
    blackTilesRef.current = next;
    setBlackTiles(next);

    // Päivitetään score
    scoreRef.current += 1;
    setScore(s => s + 1);

    // "+1" animaation lisäys
    const popId = Date.now() + Math.random();
    setPops(p => [...p, { id: popId, idx }]);
    setTimeout(() => setPops(p => p.filter(pop => pop.id !== popId)), 700);
  }

  const showOverlay = !isGameActive;

  return (
    <div className="wt-shell">
      <div className="wt-content">
        {/* Aika ja pisteet */}
        <div className="wt-stats-row">
          <div className="wt-stat">
            <span className="wt-stat-label">Aika</span>
            <span className={`wt-stat-value${timeLeft <= 5 && isGameActive ? " wt-time-urgent" : ""}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="wt-stat">
            <span className="wt-stat-label">Pisteet</span>
            <span key={score} className="wt-stat-value wt-score-jump">{score}</span>
          </div>
        </div>

        {/* Pelilauta + leaderboard */}
        <div className="wt-main-row">
          <div className="wt-board-wrap">
          <div className="wt-board">
            {/* Aloita / Peli ohi -overlay */}
            {showOverlay && (
              <div className="wt-start-overlay">
                {gameOver && hitWhite && (
                  <div className="wt-hit-white">Osuit valkoiseen ruutuun!</div>
                )}
                {gameOver && !hitWhite && (
                  <div className="wt-gameover-score">Pisteet: {score}</div>
                )}
                <button className="wt-start-btn" onClick={handleStart}>
                  {gameOver ? "Uusi peli" : "Aloita"}
                </button>
              </div>
            )}

            {/* Ruudukko */}
            {Array.from({ length: TOTAL_TILES }, (_, idx) => {
              const activePop = pops.find(p => p.idx === idx);
              return (
                <div
                  key={idx}
                  className={`wt-tile${blackTiles.has(idx) ? " wt-tile--black" : ""}`}
                  onPointerDown={() => handleTileClick(idx)}
                >
                  {activePop && <span key={activePop.id} className="wt-pop">+1</span>}
                </div>
              );
            })}
          </div>
          </div>
          <div className="wt-leaderboard-panel">
            <Leaderboard table="whitetiles_leaderboard" time_conversion={false} format="raw" />
          </div>
        </div>
      </div>
    </div>
  );
}