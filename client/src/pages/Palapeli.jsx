import React, { useState, useEffect, useMemo, useRef } from "react";
import "../css/palapeli.css";
import { DndContext, DragOverlay, useDroppable, useDraggable, closestCorners } from "@dnd-kit/core";
import PalapeliSizeMenu from "../components/PalapeliSizeMenu.jsx";
import PalapeliCreateButton from "../components/PalapeliCreateButton.jsx";
import PalapeliFetchKuvaButton from "../components/PalapeliFetchKuvaButton.jsx";
import PalapeliKuvaValinta from "../components/PalapeliKuvanValinta.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import PelienTimer from "../components/PelienTimer.jsx";
import PalapeliStartButton from "../components/PalapeliStartButton.jsx";
import { tallennaTulos } from "../components/TuloksenTallennus.jsx";

export default function Palapeli() {

  const [IMAGE_SRC, setImageSrc] = useState(
    "https://zzeyhenubyohhtzbeoyv.supabase.co/storage/v1/object/public/kuvat/testikuva.png"
  );

  const [kuvaValintaAuki, setKuvaValintaAuki] = useState(false);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const [menuGridSize, setMenuGridSize] = useState(3);
  const [gridSize, setGridSize] = useState(3);

  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState(Array(3 * 3).fill(null));
  const [imageReady, setImageReady] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const resultSubmittedRef = useRef(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [activeDragId, setActiveDragId] = useState(null);

  useEffect(() => {
    if (!IMAGE_SRC) return;
    const img = new Image();
    img.onload = () => setImageReady(true);
    img.src = IMAGE_SRC;
    return () => { setImageReady(false); };
  }, [IMAGE_SRC]);

  useEffect(() => {
    const total = gridSize * gridSize;
    setBoard(Array(total).fill(null));
    const newPieces = Array.from({ length: total }, (_, i) => i);
    setPieces(shuffle(newPieces));
  }, [gridSize]);

  const isSolved = useMemo(() => {
    if (!board || board.length === 0) return false;
    return board.every((pieceId, idx) => pieceId !== null && pieceId === idx);
  }, [board]);

  function handleCreateClick() {
    const total = menuGridSize * menuGridSize;
    setGridSize(menuGridSize);
    setBoard(Array(total).fill(null));
    const newPieces = Array.from({ length: total }, (_, i) => i);
    setPieces(shuffle(newPieces));
    setIsGameActive(false);
    resultSubmittedRef.current = false;
    setTimerResetKey(prev => prev + 1);
  }

  function parseDragId(id) {
    if (!id) return null;
    if (id.startsWith("storage-")) {
      return { source: "storage", pieceId: parseInt(id.slice(8)), fromIndex: null };
    }
    // "board-{fromIndex}-{pieceId}"
    const parts = id.split("-");
    return { source: "board", fromIndex: parseInt(parts[1]), pieceId: parseInt(parts[2]) };
  }

  function handleDragEnd({ active, over }) {
    setActiveDragId(null);
    if (!over) return;

    const { source, pieceId, fromIndex } = parseDragId(active.id);
    const overId = over.id;

    if (overId === "storage") {
      if (source === "board") {
        setBoard(prev => {
          const next = [...prev];
          if (fromIndex != null) next[fromIndex] = null;
          return next;
        });
        setPieces(prev => (prev.includes(pieceId) ? prev : [...prev, pieceId]));
      }
      return;
    }

    if (!overId.startsWith("cell-")) return;
    const targetIndex = parseInt(overId.slice(5));
    if (source === "board" && fromIndex === targetIndex) return;

    const targetHas = board[targetIndex];

    if (source === "storage") {
      if (targetHas !== null) {
        setBoard(prev => {
          const next = [...prev];
          next[targetIndex] = pieceId;
          return next;
        });
        setPieces(prev => [...prev.filter(p => p !== pieceId), targetHas]);
      } else {
        setBoard(prev => {
          const next = [...prev];
          next[targetIndex] = pieceId;
          return next;
        });
        setPieces(prev => prev.filter(p => p !== pieceId));
      }
    } else if (source === "board") {
      if (targetHas === null) {
        setBoard(prev => {
          const next = [...prev];
          next[fromIndex] = null;
          next[targetIndex] = pieceId;
          return next;
        });
      } else {
        setBoard(prev => {
          const next = [...prev];
          next[targetIndex] = pieceId;
          next[fromIndex] = targetHas;
          return next;
        });
      }
    }
  }

  const handleGameFinish = async () => {
    if (resultSubmittedRef.current) return;
    resultSubmittedRef.current = true;
    const endTimeMs = Date.now();
    const solveTimeMs = endTimeMs - gameStartTime;

    console.log(
      "Peli valmis! Aloitus aika:", gameStartTime,
      "Lopetusaika:", endTimeMs,
      "Ratkaisu aika (ms):", solveTimeMs,
      "Difficulty (gridSize):", gridSize
    );

    const vastaus = await tallennaTulos(1, gameStartTime, endTimeMs, gridSize);
    if (vastaus.success) {
      console.log("Tulos tallennettu onnistuneesti kantaan.");
    } else {
      console.error("Tallennus epäonnistui:", vastaus.error || vastaus.message);
    }
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  };

  function resetGameToStart(nextGridSize = gridSize) {
    const total = nextGridSize * nextGridSize;
    setGridSize(nextGridSize);
    setBoard(Array(total).fill(null));
    const newPieces = Array.from({ length: total }, (_, i) => i);
    setPieces(shuffle(newPieces));
    setIsGameActive(false);
    resultSubmittedRef.current = false;
  }

  const activePiece = parseDragId(activeDragId);
  const canDrag = isGameActive && !isSolved;

  return (
    <>
      {/* Yläpalkki */}
      <div className="puzzle-topbar">
        <div className="puzzle-topbar__content puzzle-topbar__content--centered">
          <div className="topbar-left" />
          <div className="topbar-center">
            <PelienTimer
              isRunning={isGameActive && !isSolved && imageReady}
              resetTrigger={timerResetKey}
              onFinish={handleGameFinish}
              setGameStartTime={setGameStartTime}
            />
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
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={({ active }) => setActiveDragId(active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveDragId(null)}
          >
            {/* Varasto */}
            <DroppableStorage>
              <div className="storage-grid" style={gridStyle}>
                {pieces.map((id) => (
                  <div key={id} className="stored-piece">
                    <DraggablePiece id={`storage-${id}`} disabled={!canDrag}>
                      <PuzzlePiece id={id} size={gridSize} image={IMAGE_SRC} />
                    </DraggablePiece>
                  </div>
                ))}
              </div>
            </DroppableStorage>

            {/* Pelilauta */}
            <div className={`board${isSolved ? " board--solved" : ""}`} style={gridStyle}>
              <PalapeliStartButton
                visible={!isGameActive && !isSolved && imageReady}
                onStart={() => {
                  resultSubmittedRef.current = false;
                  setIsGameActive(true);
                }}
              />
              {board.map((pieceId, idx) => (
                <DroppableCell key={idx} id={`cell-${idx}`}>
                  {pieceId !== null && (
                    <DraggablePiece id={`board-${idx}-${pieceId}`} disabled={!canDrag}>
                      <PuzzlePiece id={pieceId} size={gridSize} image={IMAGE_SRC} />
                    </DraggablePiece>
                  )}
                </DroppableCell>
              ))}
            </div>

            {/* Drag overlay: näyttää raahattavan palan hiiren alla */}
            <DragOverlay dropAnimation={null}>
              {activePiece && (
                <div style={{ width: "100%", height: "100%", opacity: 0.9, transform: "scale(1.05)", cursor: "grabbing" }}>
                  <PuzzlePiece id={activePiece.pieceId} size={gridSize} image={IMAGE_SRC} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Oikea paneeli: valikko + nappi */}
        <div className="puzzle-right">
          <div className="side-panel">
            <PalapeliFetchKuvaButton onClick={() => setKuvaValintaAuki(true)} />
            <PalapeliSizeMenu
              selectedSize={menuGridSize}
              onSelectSize={setMenuGridSize}
            />
            <div style={{ marginTop: 12 }}>
              <PalapeliCreateButton size={menuGridSize} onClick={handleCreateClick} />
            </div>
            <Leaderboard table="minigame1_leaderboard" difficulty={gridSize} time_conversion={true} format="scale" />
          </div>
        </div>
      </div>

      {/* Kuvavalinta overlay */}
      <PalapeliKuvaValinta
        visible={kuvaValintaAuki}
        onClose={() => setKuvaValintaAuki(false)}
        onSelect={(url) => {
          setImageSrc(url);
          setKuvaValintaAuki(false);
          resetGameToStart(gridSize);
          setTimerResetKey(prev => prev + 1);
        }}
      />
    </>
  );
}

// --- Apukomponentit ---

function DraggablePiece({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        width: "100%",
        height: "100%",
        opacity: isDragging ? 0.3 : 1,
        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      {children}
    </div>
  );
}

function DroppableCell({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="cell"
      style={{ outline: isOver ? "2px solid #45d4f5" : undefined, background: isOver ? "#1a2a3a" : undefined }}
    >
      {children}
    </div>
  );
}

function DroppableStorage({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: "storage" });
  return (
    <div
      ref={setNodeRef}
      className="piece-storage"
      style={{ outline: isOver ? "2px solid #45d4f5" : undefined }}
    >
      {children}
    </div>
  );
}

function PuzzlePiece({ id, size, image }) {
  const col = id % size;
  const row = Math.floor(id / size);
  const offsetX = (col / (size - 1)) * 100;
  const offsetY = (row / (size - 1)) * 100;

  return (
    <div
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
