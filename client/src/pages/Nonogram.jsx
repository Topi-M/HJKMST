import React, { useState, useEffect } from 'react';
import PelienTimer from '../components/PelienTimer';
import { tallennaTulos } from '../components/TuloksenTallennus'; 
import Leaderboard from '../components/Leaderboard';
import '../css/nonogram.css';
import '../css/leaderboard.css';

const PIXEL_STATES = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
  X: 'X'
};

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

  const handleGameFinish = async (durationMs, startTime) => {
    setFinalTimeMs(durationMs);
    const endTime = Date.now();
    const actualStartTime = gameStartTime || startTime; 
    const difficultyId = size;

    const result = await tallennaTulos(5, actualStartTime, endTime, difficultyId);
    
    if (result.success) {
      setSaveStatus('Tulos tallennettu!');
      setLeaderboardKey(prev => prev + 1);
    } else {
      setSaveStatus(result.message || 'Tallennus epäonnistui.');
    }
  };

  const formatFinalTime = (time) => {
    if (!time) return "00:00:00";
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const ms = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

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
    setSaveStatus(null);
    setResetTrigger(prev => !prev);
  };

  useEffect(() => { generateNewGame(size); }, [size]);

  const calculateHints = (targetGrid, gameSize) => {
    const rowHints = targetGrid.map(row => getSequence(row.map(p => p.solution)));
    const colHints = Array.from({ length: gameSize }, (_, i) => 
      getSequence(targetGrid.map(row => row[i].solution))
    );
    setHints({ rows: rowHints, cols: colHints });
  };

  const getSequence = (arr) => {
    const sequence = [];
    let count = 0;
    arr.forEach(val => {
      if (val === PIXEL_STATES.BLACK) count++;
      else if (count > 0) { sequence.push(count); count = 0; }
    });
    if (count > 0) sequence.push(count);
    return sequence.length > 0 ? sequence : [0];
  };

  const handlePixelClick = (r, c, isRightClick) => {
    if (isSolved || !gameStarted) return;
    const newGrid = [...grid];
    const pixel = { ...newGrid[r][c] };
    pixel.current = isRightClick 
      ? (pixel.current === PIXEL_STATES.X ? PIXEL_STATES.WHITE : PIXEL_STATES.X)
      : (pixel.current === PIXEL_STATES.BLACK ? PIXEL_STATES.WHITE : PIXEL_STATES.BLACK);
    
    newGrid[r][c] = pixel;
    setGrid(newGrid);
    
    if (newGrid.every(row => row.every(p => 
      p.solution === PIXEL_STATES.BLACK ? p.current === PIXEL_STATES.BLACK : p.current !== PIXEL_STATES.BLACK
    ))) {
      setIsSolved(true);
    }
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#0b0e14', minHeight: '100vh', color: '#e0e0e0' }}>
      <div className="row g-4 justify-content-center">
        
        {/* PELI-ALUE */}
        <div className="col-xl-9 col-lg-8 d-flex flex-column align-items-center">
          <h2 className="mb-4 fw-bold text-info" style={{ letterSpacing: '1px' }}>NONOGRAM</h2>

          <button 
            className="btn btn-outline-info btn-sm mb-3 text-white fw-bold" 
            style={{ borderColor: '#0dcaf0' }}
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? 'Sulje ohjeet' : 'Ohjeet'}
          </button>

          {showInstructions && (
            <div className="instructions-box mb-4 p-3 rounded shadow-sm text-start" style={{ backgroundColor: '#1a1f2b', borderLeft: '4px solid #0dcaf0', maxWidth: '500px' }}>
              <h6 className="text-info">Kuinka pelata:</h6>
              <ul className="small mb-0 text-white">
                <li>Väritä ruudut numerovihjeiden mukaan.</li>
                <li><strong>Vasen klikkaus:</strong> Täytä ruutu (musta).</li>
                <li><strong>Oikea klikkaus:</strong> Merkitse tyhjäksi (X).</li>
              </ul>
            </div>
          )}

          <PelienTimer 
            isRunning={gameStarted && !isSolved} 
            onFinish={handleGameFinish} 
            resetTrigger={resetTrigger}
            setGameStartTime={setGameStartTime}
          />

          <div className="btn-group my-4 shadow-lg">
            {[5, 7, 9].map((s) => (
              <button 
                key={s} 
                className={`btn ${size === s ? 'btn-info text-dark fw-bold' : 'btn-outline-info text-white'} px-4`} 
                style={size !== s ? { borderColor: '#0dcaf0' } : {}}
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
                display: 'grid',
                gridTemplateColumns: `minmax(75px, auto) repeat(${size}, 75px)`,
                filter: !gameStarted ? 'blur(4px)' : 'none',
                transition: 'filter 0.3s ease'
              }}
            >
              <div className="grid-corner"></div>
              {hints.cols.map((h, i) => (
                <div key={`col-${i}`} className="hint-cell d-flex flex-column justify-content-end pb-2 text-info fw-bold text-center">
                  {h.map((n, idx) => <div key={idx}>{n}</div>)}
                </div>
              ))}
              {grid.map((row, rIdx) => (
                <React.Fragment key={`row-group-${rIdx}`}>
                  <div className="hint-cell d-flex align-items-center justify-content-end pe-3 fw-bold text-info">
                    {hints.rows[rIdx].join(' ')}
                  </div>
                  {row.map((pixel, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handlePixelClick(rIdx, cIdx, false)}
                      onContextMenu={(e) => { e.preventDefault(); handlePixelClick(rIdx, cIdx, true); }}
                      className={`pixel-75 ${pixel.current === PIXEL_STATES.BLACK ? 'pixel-black' : 'pixel-white'}`}
                      style={{ 
                        width: '75px', 
                        height: '75px', 
                        border: '1px solid #1f232e', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      {pixel.current === PIXEL_STATES.X && <span className="text-danger fs-3 fw-bold">X</span>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {!gameStarted && !isSolved && (
              <div className="start-overlay d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10 }}>
                <button className="btn btn-info btn-lg px-5 py-2 shadow-lg fw-bold text-dark" onClick={() => setGameStarted(true)}>
                  Aloita
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            {isSolved && (
              <div className="alert alert-success border-0 shadow bg-success text-white py-2 px-5 mb-3">
                Peli ratkaistu! Aikasi: {formatFinalTime(finalTimeMs)}
              </div>
            )}
            <button 
              className="btn btn-outline-info text-white fw-bold px-4" 
              style={{ borderColor: '#0dcaf0' }}
              onClick={() => generateNewGame()}
            >
              {isSolved ? 'Pelaa uudelleen' : 'Nollaa peli'}
            </button>
          </div>
        </div>

        {/* LEADERBOARD-ALUE */}
        <div className="col-xl-3 col-lg-4">
          <div className="p-4 shadow-lg rounded" style={{ backgroundColor: '#05070a', border: '1px solid #161a24', minHeight: '500px' }}>
            <h5 className="text-info mb-4 text-uppercase fw-bold border-bottom border-secondary pb-2" style={{ letterSpacing: '1px' }}>
              Leaderboard
            </h5>
            <Leaderboard 
            table="nonogram"
            difficulty={size}
            time_conversion={true}
            format="scale"
            key={`${leaderboardKey}-${size}`}
            />
          </div>
          {saveStatus && <div className="mt-3 text-center text-info small fw-bold">{saveStatus}</div>}
        </div>

      </div>
    </div>
    
  );
};

export default NonogramGame;