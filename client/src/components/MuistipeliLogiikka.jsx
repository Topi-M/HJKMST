import React, { useState, useEffect } from "react";
import Card from "./Kortti";
import {supabase} from '../components/SupaBaseClient'

function Game() {
  let [cardsState, setCardsState] = useState([]);
  let [hasWon, setHasWon] = useState(false);

  let [firstCard, setFirstCard] = useState(null);
  let [secondClick, setSecondClick] = useState(false);
  let [wait, setWait] = useState(false);

  let [difficulty, setDifficulty] = useState(4);
  let [theme, setTheme] = useState("Elaimet");
  let [gameStarted, setGameStarted] = useState(false);

  const generateCards = async (difficulty, theme) => {
    console.log("Haetaan kansiosta:", theme);
    const { data, error } = await supabase
      .storage
      .from("muistipeliKuvat")
      .list(theme, { limit: 100 });

    console.log("List data:", data);
    console.log("List error:", error);

    if (error) {
      console.error(error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("Ei kuvia löytynyt kansiosta:", theme);
      return [];
    }

    const imageFiles = data.filter(file =>
      file.name.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    const shuffledImages = [...imageFiles].sort(() => Math.random() - 0.5);

    const selectedImages = shuffledImages
      .slice(0, difficulty)
      .map(file => file.name);

    console.log("Kaikki kuvat:", imageFiles.length);
    console.log("Valitut kuvat:", selectedImages.length);

    const duplicated = [...selectedImages, ...selectedImages];

    const cards = duplicated.map((fileName, index) => {
      const { data } = supabase
        .storage
        .from("muistipeliKuvat")
        .getPublicUrl(`${theme}/${fileName}`);

      return {
        id: index + 1,
        pairId: fileName,
        image: data.publicUrl,
        isFlipped: false,
        passed: false,
      };
    });

    return cards.sort(() => Math.random() - 0.5);
  };

  const startGame = async () => {
    console.log("Difficulty:", difficulty);

    const newCards = await generateCards(Number(difficulty), theme);

    if (newCards.length === 0) {
      alert("Kuvia ei löytynyt!");
      return;
    }

    setCardsState(newCards);
    setGameStarted(true);
  };

  const checker = async (card) => {
    if (card.pairId === firstCard.pairId) {
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
    if (firstCard && clickedCard.id === firstCard.id) {
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

  const goBackToMenu = () => {
    setGameStarted(false);
    setHasWon(false);
    setFirstCard(null);
    setSecondClick(false);
    setWait(false);
    setTheme(e.target.value);
  };

  const resetGame = async () => {

    setHasWon(false);
    setFirstCard(null);
    setSecondClick(false);
    setWait(false);

    setCardsState([]);

    setTimeout(async () => {
      const newCards = await generateCards(difficulty, theme);
      setCardsState(newCards);
    }, 100);
  };

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);



  return (
    <div className="muistipeli-root d-flex flex-column align-items-center py-5">
      {!gameStarted && (
        <div className="muistipeliMenu">
          <h2 className="MuistipelinTekstit">Valitse vaikeusaste</h2>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
          >
            <option value={4}>Helppo (4 paria)</option>
            <option value={6}>Keskitaso (6 paria)</option>
            <option value={8}>Vaikea (8 paria)</option>
          </select>

          <h2 className="MuistipelinTekstit">Valitse teema</h2>

          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="Elaimet">Eläimet</option>
            <option value="Autot">Autot</option>
            <option value="Dinosaurukset">Dinosaurukset</option>
          </select>

          <button onClick={startGame}>Aloita peli</button>
        </div>
      )}
      {gameStarted && (
        <>
          <button className="btn btn-outline-info back-button"
            onClick={goBackToMenu}
          >
            ⬅ Takaisin
          </button>
          {hasWon && (
            <div className="win-message">
              <h2 className="MuistipelinTekstit">🎉 Voitit pelin!</h2>
              <button className="btn btn-outline-info" onClick={resetGame}>Pelaa uudestaan</button>
            </div>
          )}
          <section style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cardsState.length))}, 1fr)` }} className="memory-game">
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
        </>
      )}
    </div>
  );
}

export default Game;