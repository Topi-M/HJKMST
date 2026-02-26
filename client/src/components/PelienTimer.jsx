import React, { useState, useEffect, useRef } from "react";

const PelienTimer = ({ isRunning, onFinish, resetTrigger, setGameStartTime }) => {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(null);
  const requestRef = useRef();

  // Resetointi
  useEffect(() => {
    setTime(0);
    startTimeRef.current = null;
    cancelAnimationFrame(requestRef.current);
  }, [resetTrigger]);

  useEffect(() => {
    const update = () => {
      if (startTimeRef.current) {
        setTime(Date.now() - startTimeRef.current);
        requestRef.current = requestAnimationFrame(update);
      }
    };

    if (isRunning) {
      if (!startTimeRef.current) {
        const now = Date.now();
        startTimeRef.current = now;
        if (setGameStartTime) setGameStartTime(now);
      }
      requestRef.current = requestAnimationFrame(update);
    } else {
      // Kun peli pysähtyy (isSolved = true)
      if (startTimeRef.current) {
        const finalDuration = Date.now() - startTimeRef.current;
        onFinish(finalDuration, startTimeRef.current);
        startTimeRef.current = null; 
      }
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]); // Huom: poistettu onFinish riippuvuuksista loopin välttämiseksi

  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const ms = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  return <div className="timer-display">{formatTime()}</div>;
};

export default PelienTimer;