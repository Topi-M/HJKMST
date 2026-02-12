import React, { useState, useEffect, useRef } from "react";

const PelienTimer = ({ isRunning, onFinish, resetTrigger }) => {
  // Tallennetaan aika millisekunneissa, että näyttää kivemmalta ja on tarkempi
  const [time, setTime] = useState(0);
  const timeRef = useRef(0);

  useEffect(() => {
    setTime(0);
    timeRef.current = 0;
  }, [resetTrigger]);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      // Päivitetään 10ms välein (100 kertaa sekunnissa)
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      if (timeRef.current > 0) {
        // Lähetetään kokonaisaika millisekunneissa ylös
        onFinish(timeRef.current);
      }
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // Muotoilu: millisekunneiksi
  const formatTime = () => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10); // Otetaan kaksi numeroa

    return (
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}:` +
      `${milliseconds.toString().padStart(2, "0")}`
    );
  };

  return (
    <div className="timer-display" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
      {formatTime()}
    </div>
  );
};

export default PelienTimer;