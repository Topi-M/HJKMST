import React, { useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import "../css/sudoku.css";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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

  const reset = () => {
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
      let count = 0;
      const totalCells = GRID * GRID;
      const interval = setInterval(() => {
        count++;
        setGreenCells(count);
        if (count === totalCells) clearInterval(interval);
      }, 20);
      return;
    } else {
      setStatusMessage("Jokin meni pieleen. Yritä uudestaan!")
      setGreenCells(0);
    }
  };

  const newSudoku = () => {
    setGreenCells(0);
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

  const fetchSudoku = async (difficulty) => {
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('sudokupuzzles')
        .select('puzzle, solution')
        .eq('difficulty', difficulty)
        .limit(1)

      if (error) throw error;

      if (data && data.length > 0) {
        const game = data[0];
        const newGrid = stringToGrid(game.puzzle);
        setBoard(newGrid);
        setInitialBoard(newGrid.map(row => [...row]));
        setSolution(game.solution);

      }
    } catch (error) {
      console.error("Virhe hakiessa sudokua:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (rowIndex, colIndex, value) => {
    if (initialBoard[rowIndex][colIndex] !== null)
      return; // Tämä estää muokkaasta alkuperäisiä sudokun numeroita

    if (value === '' || (value >= 1 && value <= 9)) {
      setBoard((prev) =>
        prev.map((row, r) =>
          row.map((cell, c) => {
            if (r === rowIndex && c === colIndex) {
              return value ? parseInt(value) : null;
            }
            return cell;
          })
        )
      );
    }
  };

  return (
    <div className="sudoku-container">
      <h2 className="sudoku-title">
        <Badge bg="primary">
          Welcome to play Sudoku! <br /> <br />
          Choose your difficulty level and start playing!
        </Badge>
      </h2>
      {statusMessage && <div className="sudoku-status">{statusMessage}</div>}
      <ButtonGroup aria-label="Difficulty level" className="sudoku-difficulty-buttons">
        <Button variant="outline-primary" onClick={() => fetchSudoku('easy')}>Easy</Button>
        <Button variant="outline-primary" onClick={() => fetchSudoku('medium')}>Medium</Button>
        <Button variant="outline-primary" onClick={() => fetchSudoku('hard')}>Hard</Button>
      </ButtonGroup>
      <div className="sudoku-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPreFilled = initialBoard[rowIndex] && initialBoard[rowIndex][colIndex] !== null;
            const cellIndex = rowIndex * GRID + colIndex;
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-input sudoku-cell ${isPreFilled ? 'pre-filled' : ''} ${cellIndex < greenCells ? 'green-cell' : ''}`}
                maxLength={1}
                value={cell === null ? '' : cell}
                readOnly={isPreFilled}
                onFocus={() => {
                  setSelected([rowIndex, colIndex]);
                }}
                onClick={() => {
                  setSelected([rowIndex, colIndex]);
                }}
                onChange={(e) => 
                  handleInput(rowIndex, colIndex, e.target.value)
                }
              />
            );
          })
        )}
      </div>
      <div className="sudoku-buttons">
        <Button variant="primary" onClick={reset}>
          Reset ↩
        </Button>
        <Button variant="success" onClick={check}>
          Check ✓
        </Button>
        <Button variant="primary" onClick={newSudoku}>
          New Game
        </Button>
      </div>
    </div>
  );
};