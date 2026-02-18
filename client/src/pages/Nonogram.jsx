import React, { useState, useEffect } from 'react';

const PIXEL_STATES = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
  X: 'X'
};

const NonogramGame = () => {
  // Lisätään tila pelin koolle (oletus 5)
  const [size, setSize] = useState(5);
  const [grid, setGrid] = useState([]);
  const [hints, setHints] = useState({ rows: [], cols: [] });
  const [errors, setErrors] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  // Funktio uuden pelin luomiseen annetulla koolla
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
    setErrors(0);
    setIsSolved(false);
  };

  // Uudelleenlataus kun koko muuttuu
  useEffect(() => {
    generateNewGame(size);
  }, [size]);

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
      if (val === PIXEL_STATES.BLACK) {
        count++;
      } else if (count > 0) {
        sequence.push(count);
        count = 0;
      }
    });
    if (count > 0) sequence.push(count);
    return sequence.length > 0 ? sequence : [0];
  };

const handlePixelClick = (r, c, isRightClick) => {
  if (isSolved) return;

  const newGrid = [...grid];
  const pixel = { ...newGrid[r][c] };

  if (isRightClick) {
    if (pixel.current === PIXEL_STATES.X) {
      pixel.current = PIXEL_STATES.WHITE;
    } else {
      pixel.current = PIXEL_STATES.X;
    }
  } else {

    if (pixel.current === PIXEL_STATES.BLACK) {

      pixel.current = PIXEL_STATES.WHITE;
    } else {
 
      pixel.current = PIXEL_STATES.BLACK;
      

      if (pixel.solution === PIXEL_STATES.WHITE) {
        setErrors(prev => prev + 1);
      }
    }
  }

  newGrid[r][c] = pixel;
  setGrid(newGrid);
  
  // Voiton tarkistus
  checkSolution(newGrid);
};

  if (grid.length === 0) return <div className="text-white text-center">Ladataan...</div>;

  return (
    <div className="d-flex flex-column align-items-center py-5" style={{ backgroundColor: '#0b0c10', minHeight: '100vh', color: 'white' }}>
      <h2 className="mb-4">Nonogram</h2>

      {/* KOON VALINTAMENU */}
      <div className="btn-group mb-4" role="group">
        {[5, 7, 9].map((s) => (
          <button
            key={s}
            className={`btn ${size === s ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSize(s)}
          >
            {s}x{s}
          </button>
        ))}
      </div>

      <div className="mb-3 fs-4">Virheitä: <span className="text-danger">{errors}</span></div>
      
      {isSolved && <div className="alert alert-success fw-bold animate__animated animate__bounceIn">Peli ratkaistu!</div>}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `minmax(60px, auto) repeat(${size}, 50px)`, 
        gap: '2px',
        background: '#455a64',
        padding: '5px',
        border: '2px solid #455a64'
      }}>
        <div style={{ background: '#0b0c10' }}></div>

        {/* Sarakevihjeet */}
        {hints.cols.map((h, i) => (
          <div key={`col-${i}`} className="d-flex flex-column align-items-center justify-content-end p-1" style={{ background: '#1c1e22', color: '#66fcf1', fontSize: '14px' }}>
            {h.map((n, idx) => <div key={idx}>{n}</div>)}
          </div>
        ))}

        {/* Ruudukko */}
        {grid.map((row, rIdx) => (
          <React.Fragment key={`row-frag-${rIdx}`}>
            <div className="d-flex align-items-center justify-content-end pe-2" style={{ background: '#1c1e22', color: '#66fcf1', fontWeight: 'bold', fontSize: '14px' }}>
              {hints.rows[rIdx].join(' ')}
            </div>
            {row.map((pixel, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => handlePixelClick(rIdx, cIdx, false)}
                onContextMenu={(e) => { e.preventDefault(); handlePixelClick(rIdx, cIdx, true); }}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: pixel.current === PIXEL_STATES.BLACK ? '#000' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#d32f2f',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  transition: 'background-color 0.1s'
                }}
              >
                {pixel.current === PIXEL_STATES.X ? 'X' : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <button className="btn btn-primary mt-4" onClick={() => generateNewGame()}>
        Nollaa tämä taso
      </button>
    </div>
  );
};

export default NonogramGame;