import React from 'react';
import "../css/wordle.css";

const rows = 6;
const columns = 5;

const WordleGrid = ({ guesses, currentGuess, solution, getLetterStatus}) => {
    
    const allGuesses = [...guesses]
    if (currentGuess) {
        allGuesses.push(currentGuess);
    }
    while (allGuesses.length < rows) {
        allGuesses.push('');
    }

    return (
        <div className="wordle-grid">
            {Array(rows).fill().map((_, rowIndex) => {

                const isComplete = guesses.length > rowIndex;
                const status = isComplete ?
                getLetterStatus(allGuesses[rowIndex], solution)
                : Array(5).fill('');
                
                return(
                    <div className="wordle-row" key={rowIndex}>
                        {Array(columns).fill().map((_, colIndex) => {
                            const letter = allGuesses[rowIndex]?.[colIndex] || "";
                            const letterStatus = status[colIndex];
                            return (
                                <div  className={`wordle-cell wordle-cell-${letterStatus}`} key={`${rowIndex}-${colIndex}`}>
                                    {letter} 
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default WordleGrid;