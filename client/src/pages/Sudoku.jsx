import React, { useState } from "react";
import "../css/Sudoku.css";
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const GRID = 9; // 9x9

export default function Sudoku() {
  const[board, setBoard] = useState(
    Array(GRID).fill(null).map(() => Array(GRID).fill(null))
  );
  
  const [selected, setSelected] = useState(null);

  const reset = () => {}
  const check = () => {}
  const newSudoku = () => {}
  

  const handleInput = (rowIndex, colIndex, value) => {
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
        <Badge bg="primary">Welcome to play Sudoku! 
          <br />
          <br />
          Choose your difficulty level and start playing!
        </Badge>
      </h2>

      <ButtonGroup aria-label="Difficulty level" className="sudoku-difficulty-buttons">
        <Button variant="outline-primary">Easy</Button>
        <Button variant="outline-primary">Medium</Button>
        <Button variant="outline-primary">Hard</Button>
      </ButtonGroup>

      <div className="sudoku-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPreFilled = false; // vaihtaa sit ku haetaan sudoku numerot backendistä

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className="sudoku-cell"
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

      <Button variant="outline-primary" className="sudoku-buttons">
        Reset ↩
      </Button>
      <Button variant="outline-primary" className="sudoku-buttons">
        Check ✓
      </Button>
      <Button variant="outline-primary" className="sudoku-buttons">
        New Game 
      </Button>
    </div>
  );
};