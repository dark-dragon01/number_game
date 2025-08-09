let game = {
    randomNumber: 0,
    maxAttempts: 10,
    attemptsLeft: 10,
    currentScore: 0,
    gameState: 'playing',
    bestScore: null,
    guessInput: null,
    guessBtn: null,
    restartBtn: null,
    attemptsLeftElement: null,
    currentScoreElement: null,
    bestScoreDisplay: null,
    messageSection: null,
    confettiContainer: null,

    init() {
        this.initializeElements();
        this.loadBestScore();
        this.setupEventListeners();
        this.startNewGame();
    },

    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.attemptsLeftElement = document.getElementById('attemptsLeft');
        this.currentScoreElement = document.getElementById('currentScore');
        this.bestScoreDisplay = document.getElementById('bestScoreDisplay');
        this.messageSection = document.getElementById('messageSection');
        this.confettiContainer = document.getElementById('confetti-container');

        if (!this.guessInput || !this.guessBtn || !this.bestScoreDisplay) {
            console.error('Required elements not found');
            return;
        }
    },

    setupEventListeners() {

        this.guessBtn.addEventListener('click', () => {
            this.makeGuess();
        });

        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });

        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.makeGuess();
                }
            }
        });

        this.guessInput.addEventListener('input', () => {
            this.validateInput();
        });
    },

    validateInput() {
        const value = this.guessInput.value.trim();
        const numValue = parseInt(value);
        const isValid = value !== '' && !isNaN(numValue) && numValue >= 1 && numValue <= 100;

        this.guessBtn.disabled = !isValid || this.gameState !== 'playing';

        if (value && !isValid) {
            this.guessInput.classList.add('is-invalid');
        } else {
            this.guessInput.classList.remove('is-invalid');
        }
    },

    startNewGame() {
        this.randomNumber = Math.floor(Math.random() * 100) + 1;
        this.attemptsLeft = this.maxAttempts;
        this.currentScore = 0;
        this.gameState = 'playing';

        console.log('Debug: Random number is', this.randomNumber);

        this.updateDisplay();
        this.updateBestScoreDisplay();
        this.clearMessages();
        this.enableInput();
        this.hideRestartButton();
        this.guessInput.focus();
    },

    makeGuess() {
        if (this.gameState !== 'playing') return;

        const guessValue = this.guessInput.value.trim();
        const guess = parseInt(guessValue);

        if (!guessValue || isNaN(guess) || guess < 1 || guess > 100) {
            this.showMessage('Please enter a valid number between 1 and 100.', 'warning');
            this.addShakeAnimation();
            return;
        }

        this.attemptsLeft--;
        this.currentScore = this.maxAttempts - this.attemptsLeft;
        this.updateDisplay();

        if (guess === this.randomNumber) {
            this.handleWin();
        } else if (this.attemptsLeft === 0) {
            this.handleLoss();
        } else {
            this.handleIncorrectGuess(guess);
        }

        this.guessInput.value = '';
        this.validateInput();
    },

    handleWin() {
        this.gameState = 'won';
        const isNewRecord = this.checkAndUpdateBestScore();

        let message = `🎉 Congratulations! You guessed the number ${this.randomNumber} in ${this.currentScore} attempts!`;

        if (isNewRecord) {
            message += '<br><strong>🏆 NEW RECORD!</strong>';
            this.highlightNewRecord();
        }

        this.showMessage(message, 'success');
        this.disableInput();
        this.showRestartButton();
        this.triggerWinAnimation();
        this.createConfetti();
    },

    handleLoss() {
        this.gameState = 'lost';
        const message = `😞 Game Over! The correct number was ${this.randomNumber}. Better luck next time!`;
        this.showMessage(message, 'danger');
        this.disableInput();
        this.showRestartButton();
        this.addShakeAnimation();
    },

    handleIncorrectGuess(guess) {
        const difference = Math.abs(guess - this.randomNumber);
        let message = '';
        let alertType = 'info';

        if (guess > this.randomNumber) {
            message = 'Too high! ⬇️';
        } else {
            message = 'Too low! ⬆️';
        }

        if (difference <= 5) {
            message += ' You\'re very close! 🔥';
            alertType = 'warning';
            this.addPulseAnimation();
        } else if (difference <= 10) {
            message += ' Getting warmer! 🌡️';
            alertType = 'warning';
        } else {
            message += ' Keep trying! 🎯';
            this.addShakeAnimation();
        }

        message += ` (${this.attemptsLeft} attempts left)`;
        this.showMessage(message, alertType);
    },

    showMessage(text, type) {
        this.clearMessages();
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = text;
        alertDiv.style.animation = 'fadeInUp 0.5s ease-out';
        this.messageSection.appendChild(alertDiv);
    },

    clearMessages() {
        this.messageSection.innerHTML = '';
    },

    updateDisplay() {
        this.attemptsLeftElement.textContent = this.attemptsLeft;
        this.currentScoreElement.textContent = this.currentScore;
    },

    updateBestScoreDisplay() {
        if (!this.bestScoreDisplay) return;

        if (this.bestScore === null) {
            this.bestScoreDisplay.textContent = 'No record yet';
        } else {
            this.bestScoreDisplay.textContent = `${this.bestScore} attempts`;
        }
    },

    highlightNewRecord() {
        if (this.bestScoreDisplay) {
            this.bestScoreDisplay.parentElement.parentElement.classList.add('new-record');
            setTimeout(() => {
                this.bestScoreDisplay.parentElement.parentElement.classList.remove('new-record');
            }, 3000);
        }
    },

    enableInput() {
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;
        this.validateInput();
    },

    disableInput() {
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;
    },

    showRestartButton() {
        this.restartBtn.style.display = 'inline-block';
        setTimeout(() => {
            this.restartBtn.focus();
        }, 100);
    },

    hideRestartButton() {
        this.restartBtn.style.display = 'none';
    },

    restartGame() {
        this.startNewGame();
    },

    // Animation methods
    addShakeAnimation() {
        this.guessInput.classList.add('shake');
        setTimeout(() => {
            this.guessInput.classList.remove('shake');
        }, 600);
    },

    addPulseAnimation() {
        this.guessInput.classList.add('pulse');
        setTimeout(() => {
            this.guessInput.classList.remove('pulse');
        }, 600);
    },

    triggerWinAnimation() {
        const card = document.querySelector('.game-card');
        if (card) {
            card.classList.add('win-animation');
            setTimeout(() => {
                card.classList.remove('win-animation');
            }, 1000);
        }
    },

    createConfetti() {
        if (!this.confettiContainer) return;

        this.confettiContainer.innerHTML = '';

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            this.confettiContainer.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    },

    loadBestScore() {
        try {
            const saved = localStorage.getItem('numberGuessingGameBestScore');
            this.bestScore = saved ? parseInt(saved) : null;
            console.log('Loaded best score:', this.bestScore);
        } catch (e) {
            console.log('LocalStorage not available');
            this.bestScore = null;
        }
    },

    saveBestScore() {
        try {
            if (this.bestScore !== null) {
                localStorage.setItem('numberGuessingGameBestScore', this.bestScore.toString());
                console.log('Saved best score:', this.bestScore);
            }
        } catch (e) {
            console.log('Could not save best score');
        }
    },

    checkAndUpdateBestScore() {
        let isNewRecord = false;

        if (this.bestScore === null || this.currentScore < this.bestScore) {
            this.bestScore = this.currentScore;
            this.saveBestScore();
            this.updateBestScoreDisplay();
            isNewRecord = true;
            console.log('New best score set:', this.bestScore);
        }

        return isNewRecord;
    }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing game...');
    game.init();
});

document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = '';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
});