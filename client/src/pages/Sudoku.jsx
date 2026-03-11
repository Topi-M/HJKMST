import React, { useRef, useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import "../css/sudoku.css";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PelienTimer from "../components/PelienTimer.jsx";
import { tallennaTulos } from "../components/TuloksenTallennus.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

const GRID = 9; // 9x9

export default function Sudoku() {
  const [board, setBoard] = useState(
    Array(GRID).fill(null).map(() => Array(GRID).fill(null))
  );

  const [initialBoard, setInitialBoard] = useState(
    Array(GRID).fill(null).map(() => Array(GRID).fill(null))
  );

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [solution, setSolution] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [greenCells, setGreenCells] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [fetchingLevel, setFetchingLevel] = useState(null);
  const [activeNumber, setActiveNumber] = useState(null);
  const [isSudokuActive, setIsSudokuActive] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [sudokuStartTime, setSudokuStartTime] = useState(0);
  const animationRef = useRef(null);

  const difficultyNames = { 4: "Easy", 5: "Medium", 6: "Hard" };


  const reset = () => {
    // muistiin että vois alottaa timerin alusta jos painaa resettiä kesken pelin
    // muistiin myös se, että kun on ratkaistu peli ja painaa resettiä, niin ei alota timeriä uudestaan ennenkuin hakee uuden sudokun
    setResetTimer(prev => prev + 1);
    setBoard(initialBoard.map(row => [...row]))
    setStatusMessage("");
    setGreenCells(0);
  };

  const check = () => {
    const currentSolutionStr = board.flat().map(cell => (cell === null ? "0" : cell.toString())).join("");

    if (currentSolutionStr.includes("0")) {
      setStatusMessage("Peli on vielä kesken. Täytä kaikki ruudut!");
      return;
    }

    if (currentSolutionStr === solution) {
      setStatusMessage("Oikein ratkaistu!");
      setIsSudokuActive(false);
      handleSudokuFinish();
      let count = 0;
      const totalCells = GRID * GRID;
      animationRef.current = setInterval(() => {
        count++;
        setGreenCells(count);
        if (count === totalCells) {
          clearInterval(animationRef.current);
        }
      }, 20);
      return;
    } else {
      setStatusMessage("Jokin meni pieleen. Yritä uudestaan!")
      setGreenCells(0);
    }
  };

  const newSudoku = () => {

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    setDifficulty(null);
    setBoard(Array(GRID).fill(null).map(() => Array(GRID).fill(null)));
    setInitialBoard(Array(GRID).fill(null).map(() => Array(GRID).fill(null)));
    setGreenCells(0);
    setStatusMessage("");
    setActiveNumber(null);
    setSelected(null);
    setIsSudokuActive(false);
    clearInterval();

    // pitää muistaa nollata timer
    setResetTimer(prev => prev + 1);
  }

  const stringToGrid = (str) => {
    const grid = [];
    for (let i = 0; i < GRID; i++) {
      const row = str.substring(i * GRID, i * GRID + GRID).split('').map(char => {
        const num = parseInt(char);
        return num === 0 ? null : num;
      });
      grid.push(row);
    }
    return grid;
  }

  const fetchSudoku = async (level) => {
    setGreenCells(0);
    setStatusMessage("");
    setLoading(true);
    setFetchingLevel(level);

    try {
      const { data, error } = await supabase
        .from('sudokupuzzles')
        .select('puzzle, solution')
        .eq('difficulty', level)
        .limit(1)

      if (error) throw error;

      if (data && data.length > 0) {
        const game = data[0];
        const newGrid = stringToGrid(game.puzzle);
        setBoard(newGrid);
        setInitialBoard(newGrid.map(row => [...row]));
        setSolution(game.solution);
        setDifficulty(level);
      }
    } catch (error) {
      console.error("Virhe hakiessa sudokua:", error.message);
    } finally {
      setLoading(false);
      setFetchingLevel(null);
      setIsSudokuActive(true);
      setSudokuStartTime(Date.now());
    }
  };

  const clearSelections = () => {
    setSelected(null);
    setActiveNumber(null);
  };

  const applyNumber = (r, c, value) => {
    setBoard(prev => prev.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === r && colIndex === c) {
          return cell === value ? null : value;
        }
        return cell;
      })
    ));
    clearSelections();
  };

  const handleCellClick = (e, rowIndex, colIndex) => {
    e.stopPropagation();
    if (!difficulty || initialBoard[rowIndex][colIndex] !== null)
      return; // Tämä estää muokkaasta alkuperäisiä sudokun numeroita

    setSelected([rowIndex, colIndex]);

    if (activeNumber === "erase") {
      applyNumber(rowIndex, colIndex, null);
    } else if (activeNumber !== null) {
      applyNumber(rowIndex, colIndex, activeNumber);
    } else {
      setSelected([rowIndex, colIndex]);
    }
  };

  const handleNumberSelect = (e, num) => {
    e.stopPropagation();

    if (selected) {
      applyNumber(selected[0], selected[1], num);
    } else {
      setActiveNumber(num === activeNumber ? null : num);
    }
  };

  const handleErase = (e) => {
    e.stopPropagation();
    if (selected) {
      applyNumber(selected[0], selected[1], null);
    } else {
      setActiveNumber(activeNumber === "erase" ? null : "erase");
    }
  };

  const handleSudokuFinish = async () => {
    const sudokuEndTime = Date.now();
    const duration = (sudokuEndTime - sudokuStartTime);

    console.log(
      "Sudoku on oikein ratkaistu! Aloitus aika:", sudokuStartTime,
      "Lopetusaika:", sudokuEndTime,
      "Ratkaisu aika (ms):", duration,
      "Vaikeustaso:", difficultyNames[difficulty] || difficulty
    );

    const lahetaTulos = await tallennaTulos(2, sudokuStartTime, sudokuEndTime, difficultyNames[difficulty], duration);
    if (lahetaTulos.success) {
      console.log("Tulos tallennettu onnistuneesti kantaan.");
    } else {
      console.error("Tallennus epäonnistui:", lahetaTulos.error || lahetaTulos.message);
    }
  }

  return (
    <div className="sudoku-page">
      <div className="sudoku-container" onClick={clearSelections}>
        <div className="sudoku-headers" onClick={(e) => e.stopPropagation()}>
          <div className="sudoku-timer">
            <PelienTimer
              isRunning={isSudokuActive}
              resetTrigger={resetTimer}
              onFinish={() => console.log("Timer pysäytetty")}
              setGameStartTime={setSudokuStartTime}
            />
          </div>
          <div className="glass-header">
            <h1 className="sudoku-title">SUDOKU</h1>
            {difficulty && (
              <div className="sudoku-current-level">
                <Badge bg="glass">Vaikeustaso: {difficultyNames[difficulty] || String(difficulty).toUpperCase()}</Badge>
              </div>
            )}
          </div>

          {!difficulty && (
            <div className="sudoku-difficulty-selection">
              <p>Valitse vaikeustaso:</p>
              <ButtonGroup aria-label="Difficulty level" className="sudoku-difficulty-buttons">
                <Button
                  variant="outline-primary"
                  onClick={() => fetchSudoku(4)}
                  disabled={loading}>
                  {fetchingLevel === 4 ? "Ladataan..." : "Easy"}
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => fetchSudoku(5)}
                  disabled={loading}>
                  {fetchingLevel === 5 ? "Ladataan..." : "Medium"}
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => fetchSudoku(6)}
                  disabled={loading}>
                  {fetchingLevel === 6 ? "Ladataan..." : "Hard"}
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>

        <div className="sudoku-status">
          {statusMessage ? (
            <div className={`status-banner ${statusMessage.includes("Oikein") ? "success" : "warning"}`}>
              {statusMessage}
            </div>
          ) : (
            <div className="sudoku-status-banner"></div>
          )}
        </div>

        <div
          className={`sudoku-grid ${!difficulty ? 'sudoku-grid-placeholder' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {board.map((row, rowIndex) => row.map((cell, colIndex) => {
            const isPreFilled = initialBoard[rowIndex][colIndex] !== null;
            const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;
            const cellIndex = rowIndex * GRID + colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell ${isPreFilled ? 'pre-filled-cell' : ''} ${cellIndex < greenCells ? 'green-cell' : ''} ${isSelected ? 'selected-cell' : ''}`}
                onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
              >
                {cell || ""}
              </div>
            );
          }))}
        </div>

        {difficulty && (
          <div className="sudoku-num-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant={activeNumber === num ? "primary" : "outline-primary"}
                className="sudoku-num-button"
                onClick={(e) => handleNumberSelect(e, num)}
              >
                {num}
              </Button>
            ))}
            <Button
              variant={activeNumber === "erase" ? "danger" : "outline-danger"}
              className="sudoku-num-button"
              onClick={handleErase}
            >
              ⌫
            </Button>
          </div>
        )}

        {difficulty && (
          <div className="sudoku-buttons">
            <Button variant="outline-primary" onClick={reset}>
              Reset ↩
            </Button>
            <Button variant="outline-success" onClick={check}>
              Check ✓
            </Button>
            <Button variant="outline-primary" onClick={newSudoku}>
              New Game
            </Button>
          </div>
        )}
      </div>
      <div className="sudoku-leaderboard">
        <Leaderboard
          table='sudoku_leaderboard'
          difficulty={difficultyNames[difficulty]}
          time_conversion={true}
          format='raw'
        />
      </div>
    </div>
  );
};