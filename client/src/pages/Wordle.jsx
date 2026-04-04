import React, { useEffect, useRef, useState} from "react";
import "../css/wordle.css";
import WordleGrid from "../components/WordleGrid.jsx";
import Keyboard from "../components/WordleKeyboard.jsx";
import { getKeyStatus, getLetterStatus } from "../wordleLogic.js";

const WORDS = [
  'trust', 'apple', 'beach', 'bread', 'cloud', 'dance', 'earth', 'field', 
  'fruit', 'glass', 'heart', 'house', 'juice', 'light', 'money', 'music', 
  'night', 'ocean', 'party', 'piano', 'pilot', 'plane', 'river', 'smile', 
  'space', 'stone', 'table', 'tiger', 'trees', 'water', 'world', 'write'
];

export default function Wordle() {
    
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [solution, setSolution] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setSolution(randomWord);
        setGuesses([]);
        setCurrentGuess('');
        setIsGameOver(false);
        setStatusMessage('');
    };

    const handleKeyPress = (key) => {
        if (guesses.length >= 6) {
            return;
        }

        if (key === 'ENTER') {
            if (currentGuess.length === 5) {
                setGuesses([...guesses, currentGuess])
                
                if (currentGuess === solution) {
                    setTimeout(() => {
                        setStatusMessage('Onnittelut! Sait sanan oikein ' + (guesses.length + 1) + ' yrityksellä!');
                    }, 100);
                    
                    setIsGameOver(true);
                } else if (guesses.length === 5) {
                    setTimeout(() => {
                        setStatusMessage(`Game Over! The correct word was: "${solution.toUpperCase()}"`);
                    }, 100);
                    setIsGameOver(true);
                }
                setCurrentGuess('');
            }
        } else if (key === 'BACKSPACE') {
            setCurrentGuess(currentGuess.slice(0, -1));
        } else if (currentGuess.length < 5) {
            setCurrentGuess((prev) => prev + key.toLowerCase());
        }
    };

    const keyStatus = getKeyStatus(guesses, solution);

    return (
        <div className="wordle-page">
            <div className="wordle-container">
                <div className="wordle-glass-header">
                    <h1 className="wordle-header">WORDLE</h1>
                </div>
                <div className="wordle-status">
                    {statusMessage ? (
                        <div className="wordle-status-container">
                            <div className={`status-banner ${statusMessage.includes("Onnittelut") ? "success" : "warning"}`}>
                                {statusMessage}
                            </div>
                            <button className="wordle-new-game-button" onClick={startNewGame}>Uusi peli</button>
                        </div>
                    ) : (
                <div className="wordle-status-banner"></div>
          )}
        </div>

                <WordleGrid guesses={guesses} currentGuess={currentGuess} solution={solution} getLetterStatus={getLetterStatus} />
                <div className="wordle-keyboard-container">
                    <Keyboard isGameOver={isGameOver} onKeyPress={handleKeyPress} keyStatus={keyStatus} />
                </div>
            </div>
        </div>
    )

}