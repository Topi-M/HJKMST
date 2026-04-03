import { useEffect } from "react";
import "../css/wordleKeyboard.css";

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const Keyboard = ({ isGameOver, onKeyPress, keyStatus }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isGameOver) {
                const key = event.key;

                if (key === 'Enter' || key === 'Backspace' || /^[a-z]$/.test(key)) {
                    event.preventDefault();
                    onKeyPress(key.toUpperCase());
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });


const handleKeyClick = (key) => {
    if (!isGameOver) {
        onKeyPress(key.toUpperCase());
    }
};
    return (
        <div className="wordle-keyboard">
            {KEYBOARD_ROWS.map((row, rowIndex) => {
                return (
                    <div className="wordle-keyboard-row" key={rowIndex}>
                        {row.map((key) => {
                            const status = key.length === 1 ? keyStatus[key.toLowerCase()] : '';
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleKeyClick(key)}
                                    className={`wordle-keyboard-key 
                                        ${key === 'Backspace' || key === 'Enter' 
                                            ? 'wordle-key-wide' 
                                            : ''}
                                        ${status}`}
                                >
                                    {key === 'Backspace' ? '⌫' : key}
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Keyboard;