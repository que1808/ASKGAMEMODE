// Game data
const categoryImages = {
    "Daglig-Behov": [
        { image: "vente.jpg", hint: "Noe du gjør når du står i kø" },
        { image: "Spise.jpg", hint: "En handling du gjør når du er sulten" },
        { image: "Ferdig.jpg", hint: "Når du har fullført en oppgave" },
        { image: "God-morgen.jpg", hint: "En hilsen du bruker når du våkner" },
        { image: "do.jpg", hint: "Et sted du går for å gjøre dine fornødenheter" },
        { image: "Takk.jpg", hint: "Et høflighetsord du sier når du er takknemlig" },
        { image: "Sove.jpg", hint: "Noe du gjør om natten for å hvile" },
        { image: "Hjelpe.jpg", hint: "Å bistå noen som trenger assistanse" }
    ],
    "Dyr": [
        { image: "Edderkopp.jpg", hint: "Et åttebent krypdyr som spinner nett" },
        { image: "Ekorn.jpg", hint: "Et lite gnagerdyr som liker nøtter" },
        { image: "Elefant.jpg", hint: "Et stort dyr med snabel" },
        { image: "Elg.jpg", hint: "Et stort hjortedyr med gevir" },
        { image: "Fisk.jpg", hint: "Et dyr som lever i vann og har gjeller" },
        { image: "Gris.jpg", hint: "Et rosa husdyr som liker å rulle seg i gjørme" },
        { image: "Hund.jpg", hint: "Menneskets beste venn" },
        { image: "Katt.jpg", hint: "Et pelsdyr som maler og liker å jakte mus" }
    ],
    "Farger": [
        { image: "Rød.jpg", hint: "Fargen på blod og jordbær" },
        { image: "Blå.jpg", hint: "Fargen på en klar himmel" },
        { image: "Brun.jpg", hint: "Fargen på sjokolade" },
        { image: "Grønn.jpg", hint: "Fargen på gress" },
        { image: "Hvit.jpg", hint: "Fargen på snø" },
        { image: "Lilla.jpg", hint: "En blanding av rød og blå" },
        { image: "oransje.jpg", hint: "Fargen på en appelsin" },
        { image: "Rosa.jpg", hint: "En lysere nyanse av rød" },
        { image: "Svart.jpg", hint: "Fargen på en kråke" }
    ],
    "Frukt-og-Gronnsaker": [
        { image: "Eple.jpg", hint: "En rund frukt som ofte er rød eller grønn" },
        { image: "Appelsin.jpg", hint: "En sitrusfrukt med oransje skall" },
        { image: "Banan.jpg", hint: "En lang, gul frukt" },
        { image: "Gulrot.jpg", hint: "En oransje grønnsak som kaniner liker" },
        { image: "Jordbær.jpg", hint: "En liten, rød frukt med frø på utsiden" },
        { image: "Melon.jpg", hint: "En stor, rund frukt med grønt skall og rødt kjøtt" },
        { image: "Pære.jpg", hint: "En frukt formet som en lyspære" }
    ],
    "Garderoben": [
        { image: "Jakke.jpg", hint: "Et ytterplagg du bruker for å holde deg varm" },
        { image: "kle på.jpg", hint: "Handlingen å ta på seg klær" },
        { image: "Lue.jpg", hint: "Noe du bruker på hodet for å holde deg varm" },
        { image: "Refleks.jpg", hint: "Noe du bruker for å bli sett i mørket" },
        { image: "Regndress.jpg", hint: "Et plagg du bruker når det regner" },
        { image: "Sekk.jpg", hint: "Noe du bærer ting i på ryggen" },
        { image: "Sko.jpg", hint: "Noe du har på føttene" },
        { image: "Votter.jpg", hint: "Noe du har på hendene for å holde dem varme" }
    ],
    "Tilfeldig": [
        { image: "Ball.jpg", hint: "En rund gjenstand du kan kaste og sparke" },
        { image: "Sykkel.jpg", hint: "Et tohjulet kjøretøy du tråkker på" }
    ]
};

// Game state
const gameState = {
    currentCategory: null,
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    timer: null,
    timeLeft: 30,
    hintsUsed: 0,
    currentHint: null,
    highScore: 0,
    imagePool: [],
    correctAnswer: "",
    attempts: 0,
    maxAttempts: 3,
    hintUsed: false,
    timeLimit: 15,
    totalQuestions: 0,
    answeredQuestions: 0
};

// Sound effects
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const timeUpSound = new Audio('sounds/timeup.mp3');

// Utility functions
function showWindow(windowId) {
    const windows = ['welcome-screen', 'category-menu', 'game-screen', 'results-screen', 'flashcard-screen', 'progress-screen'];
    windows.forEach(id => {
        document.getElementById(id).style.display = id === windowId ? 'block' : 'none';
    });
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('high-score').textContent = gameState.highScore;
}

function updateProgressDisplay() {
    const progressPercentage = (gameState.answeredQuestions / gameState.totalQuestions) * 100;
    document.getElementById('progress-percentage').textContent = progressPercentage.toFixed(1);
    document.getElementById('answered-questions').textContent = gameState.answeredQuestions;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;
}

// Game logic
function loadCategories() {
    const categoryButtons = document.getElementById('category-buttons');
    categoryButtons.innerHTML = '';
    Object.keys(categoryImages).forEach(category => {
        const li = document.createElement('li');
        li.className = 'list_item';
        const button = document.createElement('button');
        button.className = 'list_button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p class="list_text">${category.replace(/-/g, ' ')}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        button.onclick = () => startCategory(category);
        li.appendChild(button);
        categoryButtons.appendChild(li);
    });
    showWindow('category-menu');
}

function startCategory(category) {
    resetGameState();
    gameState.currentCategory = category;
    gameState.imagePool = [...categoryImages[category]];
    gameState.totalQuestions = gameState.imagePool.length;
    gameState.answeredQuestions = 0;
    updateProgressDisplay();
    document.getElementById('category-title').textContent = category.replace(/-/g, ' ');
    showWindow('game-screen');
    loadNextImage();
}

function resetGameState() {
    gameState.score = 0;
    gameState.streak = 0;
    gameState.answeredQuestions = 0;
    gameState.attempts = 0;
    gameState.hintUsed = false;
    clearInterval(gameState.timer);

    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-answer').disabled = false;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('timer').textContent = gameState.timeLimit;
    updateScoreDisplay();
    updateProgressDisplay();
}

function loadNextImage() {
    if (gameState.imagePool.length > 0) {
        const randomIndex = Math.floor(Math.random() * gameState.imagePool.length);
        const imageData = gameState.imagePool.splice(randomIndex, 1)[0];
        gameState.correctAnswer = imageData.image.split('.')[0].toLowerCase();

        const img = document.getElementById('current-image');
        img.src = `images/${gameState.currentCategory}/${imageData.image}`;
        img.alt = `ASK Tegn: ${gameState.correctAnswer}`;
        img.onerror = () => {
            img.src = 'placeholder.jpg';
            img.alt = 'Bilde ikke tilgjengelig';
        };

        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').disabled = false;
        document.getElementById('submit-answer').disabled = false;
        document.getElementById('feedback').style.display = 'none';
        gameState.attempts = 0;
        gameState.hintUsed = false;
        gameState.currentHint = imageData.hint;
        updateProgressDisplay();
        startTimer();
    } else {
        showResults();
    }
}

function startTimer() {
    clearInterval(gameState.timer);
    gameState.timeLeft = gameState.timeLimit;
    updateTimerDisplay(gameState.timeLeft);
    document.getElementById('time-progress-fill').style.width = '100%';
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay(gameState.timeLeft);
        const progressPercent = (gameState.timeLeft / gameState.timeLimit) * 100;
        document.getElementById('time-progress-fill').style.width = `${progressPercent}%`;
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUpSound.play();
            checkAnswer(true); // Time's up
        }
    }, 1000);
}

function updateTimerDisplay(time) {
    document.getElementById('timer').textContent = time;
}

function checkAnswer(timeUp = false) {
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');

    document.getElementById('answer-input').disabled = true;
    document.getElementById('submit-answer').disabled = true;

    clearInterval(gameState.timer);

    if (userAnswer === gameState.correctAnswer && !timeUp) {
        feedback.textContent = 'Riktig!';
        feedback.className = 'alert-success';
        feedback.style.display = 'block';
        correctSound.play();
        gameState.score += gameState.hintUsed ? 5 : 10;
        gameState.streak++;
        if (gameState.streak > gameState.highScore) {
            gameState.highScore = gameState.streak;
        }
        gameState.answeredQuestions++;
        setTimeout(() => {
            loadNextImage();
        }, 2000);
    } else {
        gameState.attempts++;
        incorrectSound.play();
        if (gameState.attempts < gameState.maxAttempts && !timeUp) {
            feedback.textContent = `Feil. Du har ${gameState.maxAttempts - gameState.attempts} forsøk igjen.`;
            feedback.className = 'alert-warning';
            feedback.style.display = 'block';
            document.getElementById('answer-input').disabled = false;
            document.getElementById('submit-answer').disabled = false;
            startTimer();
        } else {
            feedback.textContent = `Feil. Riktig svar er: ${gameState.correctAnswer}`;
            feedback.className = 'alert-danger';
            feedback.style.display = 'block';
            gameState.streak = 0;
            gameState.answeredQuestions++;
            setTimeout(() => {
                loadNextImage();
            }, 2000);
        }
    }
    updateScoreDisplay();
    updateProgressDisplay();
}

function showResults() {
    clearInterval(gameState.timer);
    document.getElementById('final-score').textContent = `Din score: ${gameState.score}`;
    document.getElementById('final-streak').textContent = `Høyeste streak: ${gameState.highScore}`;
    showWindow('results-screen');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', loadCategories);

    document.getElementById('submit-answer').addEventListener('click', () => checkAnswer());

    document.getElementById('answer-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    document.getElementById('back-to-categories-game').addEventListener('click', () => {
        resetGameState();
        showWindow('category-menu');
    });

    document.getElementById('back-to-main').addEventListener('click', () => {
        showWindow('welcome-screen');
    });

    document.getElementById('play-again').addEventListener('click', () => {
        resetGameState();
        showWindow('category-menu');
    });

    document.getElementById('back-to-categories-from-results').addEventListener('click', () => {
        resetGameState();
        showWindow('category-menu');
    });

    // Initialize the game
    showWindow('welcome-screen');
});

// Expose necessary variables and functions for potential future use
window.gameState = gameState;
window.gameActions = {
    setHintUsed: (value) => { gameState.hintUsed = value; }
};
// Flashcard mode
function startFlashcardMode() {
    resetGameState();
    gameState.flashcardMode = true;
    gameState.currentQuestionIndex = 0;
    loadFlashcards();
    showWindow('flashcard-screen');
}

function loadFlashcards() {
    const categoryData = categoryImages[gameState.currentCategory];
    gameState.currentFlashcard = categoryData[gameState.currentQuestionIndex];
    showFlashcard();
}

function showFlashcard() {
    const flashcardImage = document.getElementById('flashcard-image');
    flashcardImage.src = `images/${gameState.currentCategory}/${gameState.currentFlashcard.image}`;
    flashcardImage.alt = `ASK Tegn: ${gameState.currentFlashcard.image.split('.')[0]}`;
    flashcardImage.onerror = () => {
        flashcardImage.src = 'placeholder.jpg';
        flashcardImage.alt = 'Bilde ikke tilgjengelig';
    };
    document.getElementById('flashcard-answer').textContent = '';
    document.getElementById('flashcard-answer').style.display = 'none';
    document.getElementById('show-answer').style.display = 'block';
    document.getElementById('next-flashcard').style.display = 'none';
}

function loadNextFlashcard() {
    const categoryData = categoryImages[gameState.currentCategory];
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex < categoryData.length) {
        gameState.currentFlashcard = categoryData[gameState.currentQuestionIndex];
        showFlashcard();
    } else {
        gameState.currentQuestionIndex = 0;
        gameState.currentFlashcard = categoryData[gameState.currentQuestionIndex];
        showFlashcard();
    }
}

// Progress tracking
function updateProgressScreen() {
    const progressContainer = document.getElementById('progress-container');
    progressContainer.innerHTML = '';

    Object.keys(categoryImages).forEach(category => {
        const progressItem = document.createElement('div');
        progressItem.classList.add('progress-item');

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.replace(/-/g, ' ');
        progressItem.appendChild(categoryTitle);

        const totalQuestions = categoryImages[category].length;
        const progressText = document.createElement('p');
        progressText.textContent = `Totalt antall spørsmål: ${totalQuestions}`;
        progressItem.appendChild(progressText);

        progressContainer.appendChild(progressItem);
    });
}

// Event listeners for flashcard mode
document.getElementById('start-flashcard').addEventListener('click', () => {
    showWindow('category-menu');
    loadCategories();
    document.querySelectorAll('.list_button').forEach(button => {
        button.onclick = () => {
            gameState.currentCategory = button.querySelector('.list_text').textContent.replace(/ /g, '-');
            startFlashcardMode();
        };
    });
});

document.getElementById('show-answer').addEventListener('click', () => {
    document.getElementById('flashcard-answer').textContent = gameState.currentFlashcard.image.split('.')[0].replace(/-/g, ' ');
    document.getElementById('flashcard-answer').style.display = 'block';
    document.getElementById('show-answer').style.display = 'none';
    document.getElementById('next-flashcard').style.display = 'block';
});

document.getElementById('next-flashcard').addEventListener('click', loadNextFlashcard);

document.getElementById('back-to-main-from-flashcard').addEventListener('click', () => {
    showWindow('welcome-screen');
});

// Event listener for progress screen
document.getElementById('view-progress').addEventListener('click', () => {
    updateProgressScreen();
    showWindow('progress-screen');
});

document.getElementById('back-to-main-from-progress').addEventListener('click', () => {
    showWindow('welcome-screen');
});

// Hint system
document.getElementById('show-hint').addEventListener('click', () => {
    if (gameState.currentHint && !gameState.hintUsed) {
        document.getElementById('feedback').textContent = `Hint: ${gameState.currentHint}`;
        document.getElementById('feedback').className = 'alert-info';
        document.getElementById('feedback').style.display = 'block';
        gameState.hintUsed = true;
        gameState.hintsUsed++;
    }
});

// Initialize the game
showWindow('welcome-screen');

// Expose necessary variables and functions for potential future use
window.gameState = gameState;
window.gameActions = {
    setHintUsed: (value) => { gameState.hintUsed = value; }
};