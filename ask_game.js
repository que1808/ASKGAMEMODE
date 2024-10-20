// ask_game.js - Primary JavaScript file for the ASK Game

// Game variables
let categories = [];
let imagePool = [];
let score = 0;
let streak = 0;
let highScore = 0;
let answeredQuestions = 0;
let totalQuestions = 0;
let currentCategory = null;
let correctAnswer = "";
let attempts = 0;
let maxAttempts = 3;
let hintUsed = false;
let timeLimit = 15; // seconds
let timer = null;

// Sound effects
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const timeUpSound = new Audio('sounds/timeup.mp3');

// Define categories, images, and hints
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

document.addEventListener('DOMContentLoaded', function() {
    // Function to show the active window
    function showWindow(windowId) {
        document.querySelectorAll('#welcome-screen, #category-menu, #game-screen, #results-screen').forEach(window => {
            window.style.display = 'none';
        });
        document.getElementById(windowId).style.display = 'block';
    }

    // Load categories into the start menu
    function loadCategories() {
        categories = Object.keys(categoryImages);
        const categoryButtons = document.getElementById('category-buttons');
        categoryButtons.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'list_item';
            const button = document.createElement('button');
            button.className = 'list_button';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- SVG icon code -->
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <p class="list_text">${category.replace(/-/g, ' ')}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- SVG icon code -->
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;
            button.onclick = () => startCategory(category);
            li.appendChild(button);
            categoryButtons.appendChild(li);
        });
    }

    // Start a category
    function startCategory(category) {
        resetGameState();
        currentCategory = category;
        imagePool = [...categoryImages[category]];
        totalQuestions = imagePool.length;
        answeredQuestions = 0;
        updateProgressDisplay();
        document.getElementById('category-title').textContent = category.replace(/-/g, ' ');
        showWindow('game-screen');
        loadNextImage();
    }

    // Reset game state
    function resetGameState() {
        score = 0;
        streak = 0;
        highScore = 0;
        answeredQuestions = 0;
        attempts = 0;
        hintUsed = false;
        clearInterval(timer);

        // Reset UI elements
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').disabled = false;
        document.getElementById('submit-answer').disabled = false;
        document.getElementById('feedback').style.display = 'none';
        document.getElementById('timer').textContent = timeLimit;
        document.getElementById('score').textContent = '0';
        document.getElementById('streak').textContent = '0';
        document.getElementById('high-score').textContent = '0';
        document.getElementById('progress-percentage').textContent = '0';
        document.getElementById('answered-questions').textContent = '0';
        document.getElementById('total-questions').textContent = '0';

        // Reset image and category data
        currentCategory = null;
        imagePool = [];
        correctAnswer = "";
    }

    // Load the next image
    function loadNextImage() {
        if (imagePool.length > 0) {
            const randomIndex = Math.floor(Math.random() * imagePool.length);
            const imageData = imagePool.splice(randomIndex, 1)[0];
            correctAnswer = imageData.image.split('.')[0];

            const img = document.getElementById('current-image');
            img.src = `images/${currentCategory}/${imageData.image}`;
            img.alt = `ASK Tegn: ${correctAnswer}`;

            document.getElementById('answer-input').value = '';
            document.getElementById('answer-input').disabled = false;
            document.getElementById('submit-answer').disabled = false;
            document.getElementById('feedback').style.display = 'none';
            attempts = 0;
            hintUsed = false;
            updateProgressDisplay();
            startTimer();

            // Store the hint for the current image
            window.gameState.currentHint = imageData.hint;
        } else {
            showQuizResults();
        }
    }

    // Update progress display
    function updateProgressDisplay() {
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        document.getElementById('progress-percentage').textContent = progressPercentage.toFixed(1);
        document.getElementById('answered-questions').textContent = answeredQuestions;
        document.getElementById('total-questions').textContent = totalQuestions;
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        document.getElementById('high-score').textContent = highScore;
    }

    // Start the timer
    function startTimer() {
        clearInterval(timer);
        let timeLeft = timeLimit;
        updateTimerDisplay(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUpSound.play();
                checkAnswer(true); // Time's up
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay(time) {
        document.getElementById('timer').textContent = time;
    }

    // Check the user's answer
    function checkAnswer(timeUp = false) {
        const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
        const feedback = document.getElementById('feedback');

        // Disable input to prevent multiple submissions
        document.getElementById('answer-input').disabled = true;
        document.getElementById('submit-answer').disabled = true;

        clearInterval(timer);

        if (userAnswer === correctAnswer.toLowerCase() && !timeUp) {
            feedback.textContent = 'Riktig!';
            feedback.className = 'alert-success';
            feedback.style.display = 'block';
            correctSound.play();
            score += hintUsed ? 5 : 10;
            streak++;
            if (streak > highScore) {
                highScore = streak;
            }
            answeredQuestions++;
            setTimeout(() => {
                loadNextImage();
            }, 2000);
        } else {
            attempts++;
            incorrectSound.play();
            if (attempts < maxAttempts && !timeUp) {
                feedback.textContent = `Feil. Du har ${maxAttempts - attempts} forsøk igjen.`;
                feedback.className = 'alert-warning';
                feedback.style.display = 'block';
                // Enable input for next attempt
                document.getElementById('answer-input').disabled = false;
                document.getElementById('submit-answer').disabled = false;
                startTimer(); // Restart the timer for the next attempt
            } else {
                feedback.textContent = `Feil. Riktig svar er: ${correctAnswer}`;
                feedback.className = 'alert-danger';
                feedback.style.display = 'block';
                streak = 0;
                answeredQuestions++;
                setTimeout(() => {
                    loadNextImage();
                }, 2000);
            }
        }
        updateProgressDisplay();
    }

    // Show quiz results
    function showQuizResults() {
        clearInterval(timer); // Clear any existing timer

        // Hide the game screen and show the results screen
        document.getElementById('game-screen').style.display = 'none';
        const resultsScreen = document.getElementById('results-screen');
        resultsScreen.style.display = 'block';

        // Update the results
        document.getElementById('final-score').textContent = `Din score: ${score}`;
        document.getElementById('final-streak').textContent = `Høyeste streak: ${highScore}`;
    }

    // Event Listeners
    document.getElementById('start-game').addEventListener('click', () => {
        showWindow('category-menu');
        loadCategories();
    });

    document.getElementById('submit-answer').addEventListener('click', () => {
        checkAnswer();
    });

    document.getElementById('answer-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Back to categories button on the game screen
    document.getElementById('back-to-categories-game').addEventListener('click', () => {
        resetGameState();
        showWindow('category-menu');
        loadCategories();
    });

    // Back to main menu button
    document.getElementById('back-to-main').addEventListener('click', () => {
        showWindow('welcome-screen');
    });

    // Event listeners for the results screen buttons
    document.getElementById('play-again').addEventListener('click', () => {
        resetGameState();
        document.getElementById('results-screen').style.display = 'none';
        showWindow('category-menu');
        loadCategories();
    });

    document.getElementById('back-to-categories-from-results').addEventListener('click', () => {
        resetGameState();
        document.getElementById('results-screen').style.display = 'none';
        showWindow('category-menu');
        loadCategories();
    });

    // Initialize the game
    showWindow('welcome-screen');
});

// Expose necessary variables and functions for potential future use
window.gameState = {
    correctAnswer,
    hintUsed,
    maxAttempts,
    timeLimit,
    currentHint: ""
};

window.gameActions = {
    setHintUsed: (value) => { hintUsed = value; }
};
