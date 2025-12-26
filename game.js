// Game configuration
const WORDS = ['PULS', 'LÖPARSKO', 'SKATÅS', 'PREMIÄRLOPPET'];
const MAX_WRONG_GUESSES = 6;
const SWEDISH_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';

// Game state
let currentLevel = 0;
let currentWord = '';
let guessedLetters = new Set();
let wrongGuesses = 0;
let revealedLetters = new Set();

// DOM elements
const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const currentLevelDisplay = document.getElementById('current-level');
const nextLevelBtn = document.getElementById('next-level-btn');
const gamePage = document.getElementById('game-page');
const completionPage = document.getElementById('completion-page');
const playAgainBtn = document.getElementById('play-again-btn');

// Initialize game
function initGame() {
    currentWord = WORDS[currentLevel];
    guessedLetters = new Set();
    wrongGuesses = 0;
    revealedLetters = new Set();
    message.textContent = '';
    message.className = 'message';
    nextLevelBtn.style.display = 'none';

    currentLevelDisplay.textContent = currentLevel + 1;

    createWordDisplay();
    createKeyboard();
}

// Create word display with letter boxes
function createWordDisplay() {
    wordDisplay.innerHTML = '';

    for (let letter of currentWord) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';

        if (letter === ' ') {
            letterBox.style.border = 'none';
            letterBox.style.width = '20px';
        } else if (revealedLetters.has(letter)) {
            letterBox.textContent = letter;
        }

        wordDisplay.appendChild(letterBox);
    }
}

// Create keyboard
function createKeyboard() {
    keyboard.innerHTML = '';

    for (let letter of SWEDISH_LETTERS) {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.setAttribute('data-letter', letter);

        if (guessedLetters.has(letter)) {
            key.disabled = true;
            if (currentWord.includes(letter)) {
                key.classList.add('correct');
            } else {
                key.classList.add('incorrect');
            }
        } else {
            key.addEventListener('click', () => handleGuess(letter));
        }

        keyboard.appendChild(key);
    }
}

// Handle letter guess
function handleGuess(letter) {
    if (guessedLetters.has(letter)) return;

    guessedLetters.add(letter);

    if (currentWord.includes(letter)) {
        // Correct guess
        revealedLetters.add(letter);
        updateKeyboardButton(letter, true);
        createWordDisplay();

        if (checkWin()) {
            handleWin();
        }
    } else {
        // Wrong guess
        wrongGuesses++;
        updateKeyboardButton(letter, false);

        if (wrongGuesses >= MAX_WRONG_GUESSES) {
            handleLoss();
        }
    }
}

// Update keyboard button state
function updateKeyboardButton(letter, correct) {
    const button = keyboard.querySelector(`[data-letter="${letter}"]`);
    if (button) {
        button.disabled = true;
        button.classList.add(correct ? 'correct' : 'incorrect');
    }
}

// Check if player won
function checkWin() {
    for (let letter of currentWord) {
        if (letter !== ' ' && !revealedLetters.has(letter)) {
            return false;
        }
    }
    return true;
}

// Handle win
function handleWin() {
    message.textContent = '🎉 Bra jobbat!';
    message.className = 'message success';
    disableKeyboard();

    if (currentLevel < WORDS.length - 1) {
        nextLevelBtn.style.display = 'block';
    } else {
        // All levels completed
        setTimeout(() => {
            showCompletionPage();
        }, 1500);
    }
}

// Handle loss
function handleLoss() {
    message.textContent = `😢 Tyvärr! Ordet var: ${currentWord}`;
    message.className = 'message error';
    disableKeyboard();

    // Show correct word
    revealedLetters = new Set(currentWord.split(''));
    createWordDisplay();

    // Allow retry of the same level
    setTimeout(() => {
        nextLevelBtn.textContent = 'Försök igen 🔄';
        nextLevelBtn.style.display = 'block';
    }, 2000);
}

// Disable all keyboard buttons
function disableKeyboard() {
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = true;
    });
}

// Show completion page
function showCompletionPage() {
    gamePage.classList.remove('active');
    completionPage.classList.add('active');
}

// Next level handler
nextLevelBtn.addEventListener('click', () => {
    if (message.className.includes('error')) {
        // Retry same level
        initGame();
    } else {
        // Go to next level
        currentLevel++;
        if (currentLevel < WORDS.length) {
            nextLevelBtn.textContent = 'Nästa Nivå 🎅';
            initGame();
        }
    }
});

// Play again handler
playAgainBtn.addEventListener('click', () => {
    currentLevel = 0;
    completionPage.classList.remove('active');
    gamePage.classList.add('active');
    initGame();
});

// Start the game
initGame();
