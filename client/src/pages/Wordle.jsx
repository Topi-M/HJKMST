import React, { useEffect, useRef, useState} from "react";
import "../css/wordle.css";
import WordleGrid from "../components/WordleGrid.jsx";
import Keyboard from "../components/WordleKeyboard.jsx";
import { getKeyStatus, getLetterStatus } from "../wordleLogic.js";
import { supabase } from "../components/SupaBaseClient";

export default function Wordle() {
    
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [solution, setSolution] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [solutions, setSolutions] = useState([]);
    const [validWords, setValidWords] = useState([]);

    useEffect(() => {
        const fetchWords = async () => {
            const { data, error } = await supabase
                .from("wordle_words")
                .select("word, type");
            
            if (error) {
                console.error("Supabase error:", error);
                return;
            }
            
            const solutions = data
                .filter(w => w.type === "solution")
                .map(w => w.word.trim().toLowerCase());

            const valids = data
                .map(w => w.word.trim().toLowerCase());

            setSolutions(solutions);
            setValidWords(valids);

            if (solutions.length > 0) {
                const randomWord = solutions[Math.floor(Math.random() * solutions.length)];
                setSolution(randomWord);
            }
        };
        fetchWords();
    }, []);



    const startNewGame = () => {
        if (solutions.length === 0) return;

        const randomWord = solutions[Math.floor(Math.random() * solutions.length)];
        setSolution(randomWord);
        setGuesses([]);
        setCurrentGuess('');
        setIsGameOver(false);
        setStatusMessage('');
    };

    const handleKeyPress = (key) => {
        if (isGameOver) return;

        if (key === 'ENTER') {
            if (currentGuess.length === 5) {
                const normalizedGuess = currentGuess.toLowerCase();

                if (!validWords.includes(normalizedGuess)) {
                    setStatusMessage("Sana ei ole listalla");
                    setTimeout(() => setStatusMessage(""), 1500);
                    return;
                }

                const newGuesses = [...guesses, normalizedGuess];
                setGuesses(newGuesses);
                setCurrentGuess('');

                if (normalizedGuess === solution.toLowerCase()) {
                    setIsGameOver(true);
                    setStatusMessage(`Onnittelut! Arvasit sanan ${newGuesses.length}. yrityksellä!`);
                } else if (newGuesses.length >= 6) {
                    setIsGameOver(true);
                    setStatusMessage(`Peli ohi! Oikea sana oli: ${solution.toUpperCase()}`);
                }
            }
        } else if (key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5 && /^[A-ZÅÄÖ]$/.test(key)) {
            setCurrentGuess(prev => prev + key.toLowerCase());
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