import React, { useState, useEffect, useMemo } from "react";
import "../css/palapeli.css";
import testikuva from "../assets/testikuva.png";
import PalapeliSizeMenu from "../components/PalapeliSizeMenu.jsx";
import PalapeliCreateButton from "../components/PalapeliCreateButton.jsx";

export default function Palapeli() {

  const [IMAGE_SRC, setImageSrc] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/testikuva")
      .then((res) => res.blob())
      .then((blob) => {
        setImageSrc(URL.createObjectURL(blob));
      });
  }, []);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Oikean valikon valinta (ei vielä aktiivinen ennen nappia)
  const [menuGridSize, setMenuGridSize] = useState(3);
  // Aktiivinen palapelin koko
  const [gridSize, setGridSize] = useState(3);

  // Palat varastossa ja lauta
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState(Array(3 * 3).fill(null));
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageReady(true);
    img.src = IMAGE_SRC;
  }, [IMAGE_SRC]);

  // Luo/luo uudelleen palapeli aina kun gridSize muuttuu
  useEffect(() => {
    const total = gridSize * gridSize;
    setBoard(Array(total).fill(null));
    const newPieces = Array.from({ length: total }, (_, i) => i);
    setPieces(shuffle(newPieces));
  }, [gridSize]);

  // Yläpalkin valmis-indikaattori
  const isSolved = useMemo(() => {
    if (!board || board.length === 0) return false;
    return board.every((pieceId, idx) => pieceId !== null && pieceId === idx);
  }, [board]);

  // Luo palapeli valikosta valitulla koolla
  function handleCreateClick() {
    setGridSize(menuGridSize);
  }

  function handleDragStart(e, pieceId, source, fromIndex = null) {
    const payload = JSON.stringify({ pieceId, source, fromIndex });
    e.dataTransfer.setData("text/plain", payload);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDropToBoard(e, targetIndex) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const { pieceId, source, fromIndex } = payload;
    if (typeof pieceId !== "number") return;
    if (source === "board" && fromIndex === targetIndex) return;

    const targetHas = board[targetIndex];

    if (source === "storage") {
      if (board[targetIndex] !== null) {
        setBoard((prev) => {
          const next = [...prev];
          next[targetIndex] = pieceId;
          return next;
        });
        setPieces((prev) => {
          const withoutDragged = prev.filter((p) => p !== pieceId);
          return [...withoutDragged, targetHas];
        });
      } else {
        setBoard((prev) => {
          const next = [...prev];
          next[targetIndex] = pieceId;
          return next;
        });
        setPieces((prev) => prev.filter((p) => p !== pieceId));
      }
    } else if (source === "board") {
      if (board[targetIndex] === null) {
        setBoard((prev) => {
          const next = [...prev];
          next[fromIndex] = null;
          next[targetIndex] = pieceId;
          return next;
        });
      } else {
        setBoard((prev) => {
          const next = [...prev];
          const tmp = next[targetIndex];
          next[targetIndex] = pieceId;
          next[fromIndex] = tmp;
          return next;
        });
      }
    }
  }

  function handleDropToStorage(e) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const { pieceId, source, fromIndex } = payload;
    if (typeof pieceId !== "number") return;

    if (source === "board") {
      setBoard((prev) => {
        const next = [...prev];
        if (fromIndex != null) next[fromIndex] = null;
        return next;
      });
      setPieces((prev) => (prev.includes(pieceId) ? prev : [...prev, pieceId]));
    }
  }

  // Dynaaminen grid-tyyli varastolle ja laudalle
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  };

  return (
    <>
      {/* Yläpalkki keskitettyine solved-tekstillä */}
      <div className="puzzle-topbar">
        <div className="puzzle-topbar__content puzzle-topbar__content--centered">
          <div className="topbar-left" />
          <div className="topbar-center">
            {isSolved && (
              <span className="solved-badge" aria-live="polite" role="status">
                Oikein ratkaistu 🎉
              </span>
            )}
          </div>
          <div className="topbar-right" />
        </div>
      </div>

      {/* 80% / 20% layout */}
      <div className="puzzle-shell">
        {/* Vasen paneeli: varasto + lauta */}
        <div className="puzzle-left">
          <div
            className="piece-storage"
            onDrop={handleDropToStorage}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="storage-grid" style={gridStyle}>
              {pieces.map((id) => (
                <div
                  key={id}
                  className="stored-piece"
                  draggable
                  onDragStart={(e) => handleDragStart(e, id, "storage")}
                >
                  {/* Käytä AKTIIVISTA gridSizea */}
                  <PuzzlePiece id={id} size={gridSize} image={IMAGE_SRC} />
                </div>
              ))}
            </div>
          </div>

          <div className="board" style={gridStyle}>
            {board.map((pieceId, idx) => (
              <div
                key={idx}
                className="cell"
                onDrop={(e) => handleDropToBoard(e, idx)}
                onDragOver={(e) => e.preventDefault()}
              >
                {pieceId !== null && (
                  <div
                    style={{ width: "100%", height: "100%" }}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, pieceId, "board", idx)
                    }
                  >
                    {/* Käytä AKTIIVISTA gridSizea */}
                    <PuzzlePiece id={pieceId} size={gridSize} image={IMAGE_SRC} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Oikea paneeli: valikko + nappi */}
        <div className="puzzle-right">
          <div className="side-panel">
            <PalapeliSizeMenu
              selectedSize={menuGridSize}
              onSelectSize={setMenuGridSize}
            />
            <div style={{ marginTop: 12 }}>
              <PalapeliCreateButton
                size={menuGridSize}
                onClick={handleCreateClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PuzzlePiece({ id, size, image, ...props }) {
  const col = id % size;
  const row = Math.floor(id / size);

  const offsetX = (col / (size - 1)) * 100;
  const offsetY = (row / (size - 1)) * 100;

  return (
    <div
      {...props}
      className="puzzle-piece"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: `${size * 100}% ${size * 100}%`,
        backgroundPosition: `${offsetX}% ${offsetY}%`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}