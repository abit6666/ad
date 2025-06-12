const dot = document.getElementById('dot');
const dotLogo = document.getElementById('dotLogo');
const dotArea = document.getElementById('dotArea');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const tapSound = document.getElementById('tapSound');
const streakMsg = document.getElementById('streakMsg');
const perfectMsg = document.getElementById('perfectMsg');
const statsPanel = document.getElementById('statsPanel');
const leaderboard = document.getElementById('leaderboard');
const lbList = document.getElementById('lbList');
const roundNumDiv = document.getElementById('roundNum');
const getReadyDiv = document.getElementById('getReady');
const difficultySelect = document.getElementById('difficultySelect');
const settingsBtn = document.getElementById('settingsBtn');

// Game state
let round = 0;
let times = [];
let running = false;
let startTime = 0;
let streak = 0;
let bestStreak = 0;
let totalGames = 0;
let bestAvg = null;
let bestIQ = null;
let roundsTotal = 10;
let dotSize = 60;
let minDelay = 400;
let maxDelay = 1200;
let consecutivePerfects = 0;
let totalPerfects = 0;
let lastReactionTime = 0;
let consistencyScore = 0;
let gameStartTime = 0;

// Advanced difficulty settings
const difficultySettings = {
    easy: {
        rounds: 10,
        size: 60,
        minDelay: 400,
        maxDelay: 1200,
        perfectThreshold: 300,
        streakBonus: 1.2
    },
    medium: {
        rounds: 15,
        size: 50,
        minDelay: 300,
        maxDelay: 1000,
        perfectThreshold: 250,
        streakBonus: 1.3
    },
    hard: {
        rounds: 20,
        size: 40,
        minDelay: 200,
        maxDelay: 800,
        perfectThreshold: 200,
        streakBonus: 1.4
    },
    expert: {
        rounds: 25,
        size: 30,
        minDelay: 150,
        maxDelay: 600,
        perfectThreshold: 150,
        streakBonus: 1.5
    }
};

function calculateIQ(reactionTimes, perfects = 0) {
    if (!reactionTimes.length) return 70;
    const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const stdDev = Math.sqrt(reactionTimes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / reactionTimes.length);

    let baseIQ = 100;
    let reactionFactor = Math.max(0, 150 - (avg - 250) * 0.2); // 250ms = 150 IQ, 500ms = 100 IQ, 750ms = 80 IQ
    let consistencyFactor = Math.max(0, 1 - (stdDev / avg));   // 0 (bad) to 1 (perfect)
    let perfectBonus = perfects * 2; // 2 IQ per perfect tap

    let iq = Math.round(baseIQ + (reactionFactor - 100) * 0.7 + (consistencyFactor * 20) + perfectBonus);
    iq = Math.max(70, Math.min(iq, 160)); // Clamp between 70 and 160
    return iq;
}

function calculateConsistencyScore(reactionTimes) {
    if (reactionTimes.length < 2) return 0;
    
    const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const stdDev = Math.sqrt(reactionTimes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / reactionTimes.length);
    
    // Convert to percentage (lower stdDev = higher consistency)
    return Math.max(0, Math.round(100 * (1 - (stdDev / avg))));
}

function randomPos() {
    const areaRect = dotArea.getBoundingClientRect();
    const size = dotSize;
    const x = Math.random() * (areaRect.width - size);
    const y = Math.random() * (areaRect.height - size);
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
}

function showDot() {
    randomPos();
    dot.style.display = 'block';
    dotLogo.style.pointerEvents = 'auto';
    dot.style.animation = 'pulse 1s infinite alternate';
    startTime = performance.now();
    roundNumDiv.innerText = `Round ${round + 1} / ${roundsTotal}`;
}

function nextRound() {
    if (round >= roundsTotal) {
        endGame();
        return;
    }
    setTimeout(showDot, minDelay + Math.random() * (maxDelay - minDelay));
}

function handleTap() {
    if (!running) return;
    const reaction = performance.now() - startTime;
    times.push(reaction);
    dot.style.display = 'none';
    dotLogo.style.pointerEvents = 'none';
    tapSound.currentTime = 0;
    tapSound.play();
    round++;
    
    // Streak and perfect logic
    const settings = difficultySettings[difficultySelect.value];
    if (reaction < settings.perfectThreshold) {
        streak++;
        if (streak > bestStreak) bestStreak = streak;
        if (streak >= 3) {
            streakMsg.innerText = `🔥 Streak! (${streak})`;
            streakMsg.style.opacity = 1;
        }
        if (reaction < settings.perfectThreshold * 0.8) {
            consecutivePerfects++;
            totalPerfects++;
            perfectMsg.innerText = 'Perfect!';
            perfectMsg.style.opacity = 1;
            setTimeout(() => { perfectMsg.style.opacity = 0; }, 700);
        }
    } else {
        streak = 0;
        consecutivePerfects = 0;
        streakMsg.innerText = '';
        perfectMsg.style.opacity = 0;
    }
    
    // Update consistency score
    consistencyScore = calculateConsistencyScore(times);
    
    nextRound();
}

dotLogo.onclick = handleTap;
dotLogo.ontouchstart = function(e) {
    e.preventDefault(); // Prevents ghost click
    handleTap();
};
dotArea.ontouchstart = e => { if (dot.style.display === 'block') e.preventDefault(); };

difficultySelect.onchange = function() {
    const settings = difficultySettings[difficultySelect.value];
    roundsTotal = settings.rounds;
    dotSize = settings.size;
    minDelay = settings.minDelay;
    maxDelay = settings.maxDelay;
    dotLogo.setAttribute('width', settings.size);
    dotLogo.setAttribute('height', settings.size);
    dot.style.width = `${settings.size}px`;
    dot.style.height = `${settings.size}px`;
};

function startGame() {
    round = 0;
    times = [];
    running = false;
    streak = 0;
    consecutivePerfects = 0;
    streakMsg.innerText = '';
    perfectMsg.innerText = '';
    messageDiv.innerText = '';
    restartBtn.style.display = 'none';
    dot.style.display = 'none';
    dotLogo.style.pointerEvents = 'none';
    dot.style.animation = '';
    roundNumDiv.innerText = '';
    getReadyDiv.innerText = '';
    gameStartTime = performance.now();
    showStats();
    showLeaderboard();
    
    // Get Ready countdown
    let count = 3;
    getReadyDiv.innerText = 'Get Ready...';
    const countdown = setInterval(() => {
        getReadyDiv.innerText = count > 0 ? count : 'Go!';
        count--;
        if (count < -1) {
            clearInterval(countdown);
            getReadyDiv.innerText = '';
            running = true;
            nextRound();
        }
    }, 700);
}

function endGame() {
    running = false;
    dot.style.display = 'none';
    dotLogo.style.pointerEvents = 'none';
    dot.style.animation = '';
    roundNumDiv.innerText = '';
    getReadyDiv.innerText = '';
    
    const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const iq = calculateIQ(times, totalPerfects);
    const consistency = calculateConsistencyScore(times);
    const gameTime = (performance.now() - gameStartTime) / 1000;
    
    let msg = '';
    if (avg === 0) msg = "Try tapping the logo!";
    else if (avg > 600) msg = "Keep practicing!";
    else if (avg > 400) msg = "Nice! You're quick!";
    else if (avg > 300) msg = "Great job! Nexus fan!";
    else msg = "Incredible! Nexus Master!";
    
    messageDiv.innerHTML = `
        <div class="results">
            <div>Average reaction: ${avg.toFixed(0)} ms</div>
            <div>IQ Level: ${iq}</div>
            <div>Consistency: ${consistency}%</div>
            <div>Perfect taps: ${totalPerfects}</div>
            <div>Best streak: ${bestStreak}</div>
            <div>Game time: ${gameTime.toFixed(1)}s</div>
            <div class="message">${msg}</div>
        </div>
    `;
    
    restartBtn.style.display = 'inline-block';
    saveToLeaderboard(avg, iq, consistency, totalPerfects);
    
    totalGames = (parseInt(localStorage.getItem('nexusDotTotalGames')) || 0) + 1;
    localStorage.setItem('nexusDotTotalGames', totalGames);
    
    if (bestAvg === null || avg < bestAvg) {
        bestAvg = avg;
        localStorage.setItem('nexusDotBestAvg', bestAvg);
    }
    
    if (bestIQ === null || iq > bestIQ) {
        bestIQ = iq;
        localStorage.setItem('nexusDotBestIQ', bestIQ);
    }
    
    showStats();
    showLeaderboard();
}

function saveToLeaderboard(avg, iq, consistency, perfects) {
    let lb = JSON.parse(localStorage.getItem('nexusDotLB') || '[]');
    lb.push({
        avg: avg,
        iq: iq,
        consistency: consistency,
        perfects: perfects,
        date: new Date().toISOString(),
        difficulty: difficultySelect.value
    });
    lb.sort((a, b) => a.avg - b.avg);
    lb = lb.slice(0, 5);
    localStorage.setItem('nexusDotLB', JSON.stringify(lb));
}

function showLeaderboard() {
    let lb = JSON.parse(localStorage.getItem('nexusDotLB') || '[]');
    if (lb.length === 0) {
        leaderboard.style.display = 'none';
        return;
    }
    leaderboard.style.display = 'block';
    lbList.innerHTML = lb.map((item, i) => `
        <div class='lbItem'>
            #${i+1}: ${item.avg.toFixed(0)} ms | IQ: ${item.iq} | 
            Consistency: ${item.consistency}% | Perfects: ${item.perfects} | 
            ${item.difficulty}
        </div>
    `).join('');
}

function showStats() {
    bestAvg = parseFloat(localStorage.getItem('nexusDotBestAvg')) || null;
    bestIQ = parseInt(localStorage.getItem('nexusDotBestIQ')) || null;
    totalGames = parseInt(localStorage.getItem('nexusDotTotalGames')) || 0;
    
    if (bestAvg === null && bestIQ === null && totalGames === 0) {
        statsPanel.style.display = 'none';
        return;
    }
    
    statsPanel.style.display = 'block';
    statsPanel.innerHTML = `
        <div class="stats">
            <div>Best Avg: ${bestAvg ? bestAvg.toFixed(0) : '-'} ms</div>
            <div>Best IQ: ${bestIQ || '-'}</div>
            <div>Games Played: ${totalGames}</div>
        </div>
    `;
}

restartBtn.onclick = startGame;
settingsBtn.onclick = function() {
    if (confirm('Reset all stats and leaderboard?')) {
        localStorage.removeItem('nexusDotLB');
        localStorage.removeItem('nexusDotBestAvg');
        localStorage.removeItem('nexusDotBestIQ');
        localStorage.removeItem('nexusDotTotalGames');
        showStats();
        showLeaderboard();
    }
};

// Start on load
showStats();
showLeaderboard();
startGame();
