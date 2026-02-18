import React, { useState } from "react";

const GRID = 9; // 9x9

export default function Sudoku() {
  const[selected, setSelected] = useState([]);
  const board = Array(GRID).fill('').map(() => Array(GRID).fill(''));



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
                className="sudoku-input sudoku-cell"
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
}

const containerStyle = {
  textAlign: "center",
  color: "black",
  fontFamily: "Arial"
};

const cellStyle = {
  display: "grid",
  width: "40px",
  height: "40px",
  fontSize: "24px",
  textAlign: "center",
  border: "1px solid gray",
};