import React, { useState } from "react";

const GRID = 9; // 9x9

export default function Sudoku() {
  const[selected, setSelected] = useState([]);
  const board = Array(GRID).fill('').map(() => Array(GRID).fill(''));



  return (
    <div style = {containerStyle}>
      <h2>Sudoku peli</h2>
      <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={{ padding: 0, margin: 0 }}>  
                  <input 
                    style={cellStyle}
                    type="text"
                    maxLength="1"
                    value={cell}
                    onChange={() => {}}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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