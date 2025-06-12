const dot = document.getElementById('dot');
const dotLogo = dot.querySelector('.nexusDotLogo');
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
const walletConnect = document.getElementById('walletConnect');
const walletStatus = document.getElementById('walletStatus');
const addNexusNetworkBtn = document.getElementById('addNexusNetwork');

// Game state
let round = 0;
let times = [];
let running = false;
let startTime = 0;
let streak = 0;
let bestStreak = 0;
let totalGames = 0;
let bestAvg = Infinity;
let bestIQ = 0;
let roundsTotal = 10;
let dotSize = 60;
let minDelay = 400;
let maxDelay = 1200;
let consecutivePerfects = 0;
let totalPerfects = 0;
let lastReactionTime = 0;
let consistencyScore = 0;
let gameStartTime = 0;
let walletConnected = false;
let provider;
let signer;
let contract;

// Nexus Testnet II network params
const NEXUS_CHAIN_ID = '0x189'; // 393 in hex
const NEXUS_PARAMS = {
    chainId: NEXUS_CHAIN_ID,
    chainName: 'Nexus Testnet II',
    rpcUrls: ['https://testnet.nexus.xyz/rpc'],
    nativeCurrency: { name: 'Nexus', symbol: 'NEX', decimals: 18 },
    blockExplorerUrls: ['https://explorer.testnet.nexus.xyz']
};

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = "0xC12075E14E51A6566F219B86eB8C0BBA29c98522";
const CONTRACT_ABI = [
    "function submitScore(uint256 score, uint256 iq) public",
    "function getTopScores() public view returns (tuple(uint256 score, uint256 iq, address player)[])",
    "event ScoreSubmitted(address indexed player, uint256 score, uint256 iq)"
];

// Difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: {
        rounds: 10,
        size: 60,
        minDelay: 1000,
        maxDelay: 3000,
        perfectThreshold: 300
    },
    medium: {
        rounds: 15,
        size: 50,
        minDelay: 800,
        maxDelay: 2500,
        perfectThreshold: 250
    },
    hard: {
        rounds: 20,
        size: 40,
        minDelay: 600,
        maxDelay: 2000,
        perfectThreshold: 200
    },
    expert: {
        rounds: 25,
        size: 30,
        minDelay: 400,
        maxDelay: 1500,
        perfectThreshold: 150
    }
};

function calculateIQ(reactionTimes) {
    if (!reactionTimes.length) return 70;
    
    const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const stdDev = Math.sqrt(reactionTimes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / reactionTimes.length);
    const consistency = 1 - (stdDev / avg);
    
    // Base IQ calculation
    let iq = Math.round(200 - (avg / 5));
    
    // Adjust IQ based on consistency
    iq = Math.round(iq * (0.7 + (consistency * 0.3)));
    
    // Adjust for perfect streaks
    iq = Math.round(iq * (1 + (consecutivePerfects * 0.05)));
    
    // Cap IQ between 70 and 160
    return Math.min(Math.max(iq, 70), 160);
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
    const settings = DIFFICULTY_SETTINGS[difficultySelect.value];
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
dotArea.ontouchstart = e => { if (dot.style.display === 'block') e.preventDefault(); };

difficultySelect.onchange = function() {
    const settings = DIFFICULTY_SETTINGS[difficultySelect.value];
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
    const iq = calculateIQ(times);
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

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            walletConnected = true;
            walletStatus.textContent = "Wallet Connected";
            walletStatus.style.color = "#4CAF50";
            walletConnect.textContent = "Connected";
            walletConnect.disabled = true;
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            walletStatus.textContent = "Connection failed. Please try again.<br>" + error.message;
            walletStatus.style.color = "#ff4444";
            alert('MetaMask error: ' + error.message);
        }
    } else {
        walletStatus.textContent = "Please install MetaMask to connect";
        walletStatus.style.color = "#ff4444";
        alert('MetaMask is not installed!');
    }
}

// Connect wallet
async function connectWallet() {
    if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '393') { // Replace with actual Chain ID
            await addNexusNetwork();
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await initWeb3();
    }
}

walletConnect.onclick = connectWallet;

// Calculate IQ based on reaction time and consistency
function calculateIQ(reactionTime, consistency) {
    const baseIQ = 100;
    const timeFactor = Math.max(0, 1 - (reactionTime / 1000));
    const consistencyFactor = consistency / 100;
    return Math.round(baseIQ + (timeFactor * 50) + (consistencyFactor * 50));
}

// Calculate consistency score
function calculateConsistency(times) {
    if (times.length < 2) return 100;
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, Math.round(100 - (stdDev / avg * 100)));
}

// Submit score to blockchain
async function submitScore(score, iq) {
    if (!walletConnected) {
        messageDiv.textContent = "Please connect your wallet to submit scores";
        return;
    }
    try {
        const tx = await contract.submitScore(score, iq);
        await tx.wait();
        messageDiv.textContent = "Score submitted successfully!";
        updateLeaderboard();
    } catch (error) {
        console.error("Error submitting score:", error);
        messageDiv.textContent = "Failed to submit score. Please try again.";
    }
}

// Update leaderboard from blockchain
async function updateLeaderboard() {
    if (!walletConnected) return;
    try {
        const scores = await contract.getTopScores();
        lbList.innerHTML = '';
        scores.forEach((score, index) => {
            const item = document.createElement('div');
            item.className = 'lbItem';
            item.textContent = `${index + 1}. Score: ${score.score}ms, IQ: ${score.iq}`;
            lbList.appendChild(item);
        });
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
}

async function addNexusNetwork() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '393', // Example: 12345 in hex, replace with actual Chain ID
                    chainName: 'Nexus Testnet II',
                    rpcUrls: ['https://testnet.nexus.xyz/rpc'], // Replace with actual RPC
                    nativeCurrency: { name: 'Nexus', symbol: 'NEX', decimals: 18 },
                    blockExplorerUrls: ['https://explorer.testnet.nexus.xyz'] // Replace with actual explorer
                }]
            });
        } catch (err) {
            alert('Failed to add Nexus Testnet: ' + err.message);
        }
    }
}

addNexusNetworkBtn.onclick = addNexusNetwork;