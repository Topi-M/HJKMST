import React, { useState, useEffect } from "react";

const IMG_PATH = "/src/assets/testikuva.png"; 
const GRID_SIZE = 3; // 3x3
const TILE_SIZE = 512 / GRID_SIZE; // 170.666...

export default function Palapeli() {
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  // Luo 3x3 palat
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      arr.push(i);
    }
    // Sekoita palat
    const shuffled = arr
      .map((n) => ({ n, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((o) => o.n);

    setTiles(shuffled);
  }, []);

  // Tarkista onko ratkaistu
  useEffect(() => {
    const solved = tiles.every((value, index) => value === index);
    setIsSolved(solved);
  }, [tiles]);

  const handleTileClick = (index) => {
    if (selected === null) {
      setSelected(index);
      return;
    }

    // Vaihda kahden palan paikka
    const newTiles = [...tiles];
    [newTiles[selected], newTiles[index]] = [newTiles[index], newTiles[selected]];

    setTiles(newTiles);
    setSelected(null);
  };

  // Laske taustaposition koordinaatit
  const getBackgroundPosition = (tileIndex) => {
    const x = (tileIndex % GRID_SIZE) * (100 / (GRID_SIZE - 1));
    const y = Math.floor(tileIndex / GRID_SIZE) * (100 / (GRID_SIZE - 1));
    return `${x}% ${y}%`;
  };

  return (
    <div style={containerStyle}>
      <h2>3x3 Palapeli</h2>

      <div style={boardStyle}>
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            style={{
              ...tileStyle,
              border:
                selected === index ? "3px solid #0f0" : "2px solid #222",
              backgroundImage: `url(${IMG_PATH})`,
              backgroundSize: "300% 300%",
              backgroundPosition: getBackgroundPosition(tile),
            }}
          ></div>
        ))}
      </div>

      {isSolved && (
        <div style={solvedStyle}>
          ✔ Palapeli ratkaistu!
        </div>
      )}
    </div>
  );
}

/* --- Tyylit JS‑objekteina --- */

const containerStyle = {
  textAlign: "center",
  color: "white",
  fontFamily: "Arial",
};

const boardStyle = {
  width: "512px",
  height: "512px",
  margin: "20px auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  gap: "4px",
  background: "#111",
  padding: "4px",
};

const tileStyle = {
  width: "100%",
  height: "100%",
  backgroundRepeat: "no-repeat",
  cursor: "pointer",
};

const solvedStyle = {
  marginTop: "20px",
  fontSize: "24px",
  color: "#00ff00",
};