const orb = document.getElementById('orb');
const timerDiv = document.getElementById('timer');
const scoreDiv = document.getElementById('score');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const clickSound = document.getElementById('clickSound');

let time = 10.0;
let score = 0;
let timer = null;
let running = false;

function startGame() {
    time = 10.0;
    score = 0;
    running = true;
    scoreDiv.innerText = '0';
    timerDiv.innerText = time.toFixed(1);
    messageDiv.innerText = '';
    restartBtn.style.display = 'none';
    orb.style.pointerEvents = 'auto';
    orb.innerText = '💠';
    orb.style.filter = '';
    timer = setInterval(() => {
        time -= 0.1;
        if (time <= 0) {
            endGame();
        } else {
            timerDiv.innerText = time.toFixed(1);
        }
    }, 100);
}

function endGame() {
    running = false;
    clearInterval(timer);
    timerDiv.innerText = '0.0';
    orb.style.pointerEvents = 'none';
    orb.innerText = '⏱️';
    orb.style.filter = 'grayscale(0.7)';
    let msg = '';
    if (score === 0) msg = "Try clicking the orb!";
    else if (score < 20) msg = "Keep practicing!";
    else if (score < 40) msg = "Nice! You're quick!";
    else if (score < 60) msg = "Great job! Nexus fan!";
    else msg = "Incredible! Nexus Master!";
    messageDiv.innerText = `Time's up!\n${msg}`;
    restartBtn.style.display = 'inline-block';
}

orb.onclick = function() {
    if (!running) return;
    score++;
    scoreDiv.innerText = score;
    orb.style.transform = 'scale(1.08)';
    setTimeout(() => orb.style.transform = '', 80);
    clickSound.currentTime = 0;
    clickSound.play();
};

restartBtn.onclick = startGame;

// Start on load
startGame(); 