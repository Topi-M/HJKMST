import React, { useState, useEffect } from 'react';
import PelienTimer from '../components/PelienTimer';
import { tallennaTulos } from '../components/TuloksenTallennus';
import Leaderboard from '../components/Leaderboard';
import '../css/nonogram.css';

const PIXEL_STATES = { WHITE: 'WHITE', BLACK: 'BLACK', X: 'X' };

const NonogramGame = () => {
  const [size, setSize] = useState(5);
  const [grid, setGrid] = useState([]);
  const [hints, setHints] = useState({ rows: [], cols: [] });
  const [isSolved, setIsSolved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  // Generointi ja logiikka pidetty samana (toimiva pohja)
  const generateNewGame = (gameSize = size) => {
    const newGrid = Array.from({ length: gameSize }, () =>
      Array.from({ length: gameSize }, () => ({
        current: PIXEL_STATES.WHITE,
        solution: Math.random() > 0.4 ? PIXEL_STATES.BLACK : PIXEL_STATES.WHITE
      }))
    );
    setGrid(newGrid);
    calculateHints(newGrid, gameSize);
    setIsSolved(false);
    setGameStarted(false);
    setFinalTimeMs(null);
    setResetTrigger(prev => !prev);
  };

  useEffect(() => { generateNewGame(size); }, [size]);

  const calculateHints = (targetGrid, gameSize) => {
    const getSeq = (arr) => {
      const seq = []; let c = 0;
      arr.forEach(v => { if (v === PIXEL_STATES.BLACK) c++; else if (c > 0) { seq.push(c); c = 0; } });
      if (c > 0) seq.push(c); return seq.length > 0 ? seq : [0];
    };
    setHints({
      rows: targetGrid.map(row => getSeq(row.map(p => p.solution))),
      cols: Array.from({ length: gameSize }, (_, i) => getSeq(targetGrid.map(row => row[i].solution)))
    });
  };

  const handlePixelClick = (r, c, isRightClick) => {
    if (isSolved || !gameStarted) return;
    const newGrid = [...grid];
    const pixel = { ...newGrid[r][c] };
    
    if (isRightClick) {
      pixel.current = pixel.current === PIXEL_STATES.X ? PIXEL_STATES.WHITE : PIXEL_STATES.X;
    } else {
      pixel.current = pixel.current === PIXEL_STATES.BLACK ? PIXEL_STATES.WHITE : PIXEL_STATES.BLACK;
    }

    newGrid[r][c] = pixel;
    setGrid(newGrid);

    if (newGrid.every(row => row.every(p => 
      p.solution === PIXEL_STATES.BLACK ? p.current === PIXEL_STATES.BLACK : p.current !== PIXEL_STATES.BLACK
    ))) {
      setIsSolved(true);
    }
  };

return (
    <div className="nonogram-container container-fluid py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-xl-9 col-lg-8 d-flex flex-column align-items-center text-center">
          <h2 className="NonogramOtsikko">NONOGRAM</h2>

          <button className="btn-ohjeet mb-3" onClick={() => setShowInstructions(!showInstructions)}>
            {showInstructions ? 'Sulje ohjeet' : 'Ohjeet'}
          </button>

          {/* Timer ja koon valinta säilyvät ennallaan */}
          <PelienTimer 
            isRunning={gameStarted && !isSolved} 
            onFinish={(ms) => setFinalTimeMs(ms)}
            resetTrigger={resetTrigger}
            setGameStartTime={setGameStartTime}
          />

          <div className="btn-group my-4 shadow-lg">
            {[5, 7, 9].map((s) => (
              <button 
                key={s} 
                className={`btn ${size === s ? 'btn-info fw-bold' : 'btn-outline-info text-white'}`}
                style={size === s ? { color: '#000000', backgroundColor: '#00bcd4', borderColor: '#00bcd4' } : {}}
                onClick={() => setSize(s)}
                disabled={gameStarted && !isSolved}
              >
                {s}x{s}
              </button>
            ))}
          </div>

          <div className="position-relative p-4 rounded shadow-lg" style={{ backgroundColor: '#05070a', border: '1px solid #1f232e' }}>
            <div 
              className="nonogram-grid-container"
              style={{ 
                /* TIETOKONE: Ensimmäinen sarake on automaattinen, muut 75px. 
                   CSS-tiedoston @media huolehtii mobiilikoosta. */
                gridTemplateColumns: `minmax(50px, auto) repeat(${size}, min-content)`,
                filter: !gameStarted ? 'blur(4px)' : 'none'
              }}
            >
              <div className="grid-corner"></div>
              {hints.cols.map((h, i) => (
                <div key={`col-${i}`} className="hint-cell d-flex flex-column justify-content-end pb-2 fw-bold">
                  {h.map((n, idx) => <div key={idx}>{n}</div>)}
                </div>
              ))}
              {grid.map((row, rIdx) => (
                <React.Fragment key={`row-group-${rIdx}`}>
                  <div className="hint-cell d-flex align-items-center justify-content-end pe-3 fw-bold">
                    {hints.rows[rIdx].join(' ')}
                  </div>
                  {row.map((pixel, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handlePixelClick(rIdx, cIdx, false)}
                      onContextMenu={(e) => { e.preventDefault(); handlePixelClick(rIdx, cIdx, true); }}
                      className={`pixel-75 ${pixel.current === PIXEL_STATES.BLACK ? 'pixel-black' : ''}`}
                    >
                      {/* X-merkki näkyy vain jos se on merkitty (hiiren oikea klikkaus) */}
                      {pixel.current === PIXEL_STATES.X && <span className="text-danger fs-3 fw-bold">X</span>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {!gameStarted && !isSolved && (
              <div className="start-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <button className="btn-aloita" onClick={() => setGameStarted(true)}>Aloita</button>
              </div>
            )}
          </div>

          <div className="mt-4">
            {isSolved && <div className="alert alert-success px-5">Peli ratkaistu!</div>}
            <button className="btn-ohjeet fw-bold" onClick={() => generateNewGame()}>
              {isSolved ? 'Pelaa uudelleen' : 'Nollaa peli'}
            </button>
          </div>
        </div>

        {/* Leaderboard omassa sarakkeessaan tietokoneella */}
        <div className="col-xl-3 col-lg-4">
          <Leaderboard table="nonogram" difficulty={size} time_conversion={true} key={`${leaderboardKey}-${size}`} />
        </div>
      </div>
    </div>
  );
};

export default NonogramGame;