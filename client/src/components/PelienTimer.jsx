import React, { useState, useEffect, useRef } from "react";

const PelienTimer = ({ isRunning, onFinish, resetTrigger, setGameStartTime }) => {
  // Tallennetaan aika millisekunneissa, että näyttää kivemmalta ja on tarkempi
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);
  const startTimeRef = useRef(null); 

 // Resettaa ajastimen kun resetTrigger vaihtuu (FALSE/TRUE)
  useEffect(() => {
    setTime(0);
    timeRef.current = 0;
    startTimeRef.current = null;
  }, [resetTrigger]);

  // referenssi sync
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      //  Kun ajastin käynnistyy startTime aika muistiin 
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        if (setGameStartTime) setGameStartTime(startTimeRef.current); 
      }

      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      if (timeRef.current > 0) {
        // Kun ajastin valmis -> kokonaisaika 
        onFinish(timeRef.current, startTimeRef.current);
      }
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, onFinish, setGameStartTime]);

  // Muotoillaan näytettäväksi
  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;
  };

  return <div className="timer-display">{formatTime()}</div>;
};

export default PelienTimer;