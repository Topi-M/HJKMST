export const getLetterStatus = (guess, solution) => {
        if (!guess || !solution) return Array(5).fill('absent');

        const status = Array(5).fill('absent');
        const solutionChars = [...solution]
        const guessChars = [...guess]

        guessChars.forEach((char, i) => {
            if (char === solutionChars[i]) {
                status[i] = 'correct';
                solutionChars[i] = null;
            }
        });

        guessChars.forEach((char, i) => {
            if (status[i] === 'correct') return;

            const solutionIndex = solutionChars.indexOf(char);
            if (solutionIndex !== -1) {
                status[i] = 'present';
                solutionChars[solutionIndex] = null;
            }
        });
        return status;
    };

export const getKeyStatus = (guesses, solution) => {
    const keyStatus = {};

    guesses.forEach((guess) => {
        if (!guess) return;

        const status = getLetterStatus(guess, solution);

        [...guess].forEach((letter, i) => {
            const currentStatus = keyStatus[letter] || 'unused';
            const newStatus = status[i];

            if (currentStatus === 'correct') return;
            if (currentStatus === 'present' && newStatus !== 'correct') return;

            keyStatus[letter] = newStatus;
        });
    });
    return keyStatus;
};