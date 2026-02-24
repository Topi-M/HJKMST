import React, { useState, useEffect } from 'react';
import PelienTimer from '../components/PelienTimer';
import '../css/nonogram.css';

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
  
  const [resetTrigger, setResetTrigger] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(null);

  const handleGameFinish = (usedTimeMs) => setFinalTimeMs(usedTimeMs);

  const generateNewGame = (gameSize = size) => {
    const newGrid = [];
    for (let r = 0; r < gameSize; r++) {
      const row = [];
      for (let c = 0; c < gameSize; c++) {
        row.push({
          current: PIXEL_STATES.WHITE,
          solution: Math.random() > 0.4 ? PIXEL_STATES.BLACK : PIXEL_STATES.WHITE
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    calculateHints(newGrid, gameSize);
    setIsSolved(false);
    setGameStarted(false); 
    setFinalTimeMs(null);
    setResetTrigger(prev => !prev);
  };

  useEffect(() => { generateNewGame(size); }, [size]);

  const calculateHints = (targetGrid, gameSize) => {
    const rowHints = [];
    const colHints = [];
    for (let i = 0; i < gameSize; i++) {
      rowHints.push(getSequence(targetGrid[i].map(p => p.solution)));
      colHints.push(getSequence(targetGrid.map(row => row[i].solution)));
    }
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

    if (isRightClick) {
      pixel.current = pixel.current === PIXEL_STATES.X ? PIXEL_STATES.WHITE : PIXEL_STATES.X;
    } else {
      pixel.current = pixel.current === PIXEL_STATES.BLACK ? PIXEL_STATES.WHITE : PIXEL_STATES.BLACK;
    }

    newGrid[r][c] = pixel;
    setGrid(newGrid);
    
    const solved = newGrid.every(row => 
      row.every(p => p.solution === PIXEL_STATES.BLACK ? p.current === PIXEL_STATES.BLACK : p.current !== PIXEL_STATES.BLACK)
    );

    if (solved) setIsSolved(true);
  };

  if (grid.length === 0) return <div className="text-white text-center">Ladataan...</div>;

  return (
    <div className="nonogram-container d-flex flex-column align-items-center py-5">
      <h2 className="mb-4 text-info fw-bold">Nonogram</h2>

      <PelienTimer 
        isRunning={gameStarted && !isSolved} 
        onFinish={handleGameFinish} 
        resetTrigger={resetTrigger} 
      />

      <div className="btn-group my-4 shadow">
        {[5, 7, 9].map((s) => (
          <button 
            key={s} 
            className={`btn ${size === s ? 'btn-info' : 'btn-outline-info'}`} 
            onClick={() => setSize(s)}
            disabled={gameStarted && !isSolved}
          >
            {s}x{s}
          </button>
        ))}
      </div>

      {isSolved && (
        <div className="alert alert-success fw-bold mb-3 shadow animate__animated animate__tada">
          Peli ratkaistu! Aikasi: {(finalTimeMs / 1000).toFixed(2)}s
        </div>
      )}

      {/* Ruudukko ja Aloita-nappi samassa säiliössä */}
      <div className="position-relative">
        <div 
          className="nonogram-grid-container" 
          style={{ 
            display: 'grid',
            gridTemplateColumns: `minmax(70px, auto) repeat(${size}, 50px)`,
            filter: !gameStarted ? 'blur(2px)' : 'none', // Kevyt sumennus ennen aloitusta
            opacity: !gameStarted ? 0.4 : 1
          }}
        >
          <div className="grid-corner"></div>
          {hints.cols.map((h, i) => (
            <div key={`col-${i}`} className="hint-cell d-flex flex-column justify-content-end pb-1">
              {h.map((n, idx) => <div key={idx}>{n}</div>)}
            </div>
          ))}
          {grid.map((row, rIdx) => (
            <React.Fragment key={`row-group-${rIdx}`}>
              <div className="hint-cell justify-content-end pe-2 fw-bold">
                {hints.rows[rIdx].join(' ')}
              </div>
              {row.map((pixel, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handlePixelClick(rIdx, cIdx, false)}
                  onContextMenu={(e) => { e.preventDefault(); handlePixelClick(rIdx, cIdx, true); }}
                  className={`pixel ${pixel.current === PIXEL_STATES.BLACK ? 'pixel-black' : 'pixel-white'}`}
                >
                  {pixel.current === PIXEL_STATES.X && <span className="pixel-x">X</span>}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Aloita-nappi overlay */}
        {!gameStarted && !isSolved && (
          <div className="start-overlay">
            <button 
              className="btn-aloita shadow-lg"
              onClick={() => setGameStarted(true)}
            >
              Aloita
            </button>
          </div>
        )}
      </div>

      <button className="btn btn-outline-info mt-5" onClick={() => generateNewGame()}>
        {isSolved ? 'Pelaa uudelleen' : 'Nollaa / Uusi peli'}
      </button>
    </div>
  );
};

export default NonogramGame;