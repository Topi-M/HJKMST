import React, { useState, useEffect, useRef } from "react";

const PelienTimer = ({ isRunning, onFinish, resetTrigger, setGameStartTime }) => {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // Resetointi
  useEffect(() => {
    clearInterval(intervalRef.current);
    setTime(0);
    startTimeRef.current = null;
  }, [resetTrigger]);

  useEffect(() => {
    if (isRunning) {
      if (!startTimeRef.current) {
        const now = Date.now();
        startTimeRef.current = now;
        if (setGameStartTime) setGameStartTime(now);
      }

      // Käytetään setIntervalia, jota Vitestin fake timers ymmärtää heti
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10); // Päivitys 10ms välein (sadasosat)
    } else {

      if (startTimeRef.current) {
        const finalDuration = Date.now() - startTimeRef.current;
        onFinish(finalDuration, startTimeRef.current);
        startTimeRef.current = null;
      }
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onFinish, setGameStartTime]);

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