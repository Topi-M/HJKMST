import React from "react";
import "../css/palapeli.css";

export default function PalapeliStartButton({ visible, onStart }) {
  if (!visible) return null;

  return (
    <div className="start-overlay">
      <button className="start-button" onClick={onStart}>
        Aloita
      </button>
    </div>
  );
}