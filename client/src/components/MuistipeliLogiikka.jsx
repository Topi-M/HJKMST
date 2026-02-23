import React, { useState, useEffect } from "react";
import Card from "./Kortti";
import { cardsData } from "./Kortit";

function Game() {
  let [cardsState, setCardsState] = useState(cardsData);
  let [hasWon, setHasWon] = useState(false);

  let [firstCard, setFirstCard] = useState(null);
  let [secondClick, setSecondClick] = useState(false);
  let [wait, setWait] = useState(false);

  const checker = async (card) => {
    if (card.name === firstCard.name) {
      console.log("hellooo");
      card["passed"] = true;
      firstCard["passed"] = true;
      changeCardStatusHandler(card);
      changeCardStatusHandler(firstCard);
    } else {
      setWait(true);
      setTimeout(() => {
        changeCardStatusHandler(card);
        changeCardStatusHandler(firstCard);
        setWait(false);
      }, 1500);
    }
  };

  const changeCardStatusHandler = async (clickedCard) => {
    if (!clickedCard.passed) clickedCard.isFlipped = !clickedCard.isFlipped;
    let index = cardsState.findIndex((card) => card.id === clickedCard.id);
    let newState = [...cardsState];
    newState.splice(index, 1, clickedCard);
    await setCardsState(newState);
  };

  const handleClick = async (e, clickedCard) => {
    if (wait) {
      return;
    }
    if (!secondClick) {
      await setFirstCard(clickedCard);
      await setSecondClick(true);
      changeCardStatusHandler(clickedCard);
    } else {
      await setSecondClick(false);
      changeCardStatusHandler(clickedCard);
      checker(clickedCard);
      setFirstCard(null);
    }
  };

  useEffect(() => {
  const allPassed = cardsState.every(card => card.passed === true);
  if (allPassed && cardsState.length > 0) {
    setHasWon(true);
  }
}, [cardsState]);

const resetGame = () => {
  const resetCards = cardsData.map(card => ({
    ...card,
    isFlipped: false,
    passed: false,
    order: Math.floor(Math.random() * cardsData.length),
  }));

  setCardsState(resetCards);
  setFirstCard(null);
  setSecondClick(false);
  setWait(false);
  setHasWon(false);
};

useEffect(() => {
  return () => {
    resetGame();
  };
}, []);



  return (
    <div className="d-flex flex-column align-items-center py-5" style={{ backgroundColor: '#0b0c10', minHeight: '100vh', color: 'white' }}>
      {hasWon && (
          <div className="win-message">
            <h2>🎉 Voitit pelin!</h2>
            <button className="btn btn-outline-info mt-4" onClick={resetGame}>Pelaa uudestaan</button>
          </div>
        )}
      <section className="memory-game">
        {cardsState?.map((card) => {
          return (
            <Card
              key={card.id}
              card={card}
              onClick={(e) => handleClick(e, card)}
            />
          );
        })}
      </section>
    </div>  
  );
}

export default Game;