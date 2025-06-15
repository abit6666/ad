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

// Enhanced focus testing variables
let focusTestActive = false;
let focusTestStartTime = 0;
let focusTestResults = [];
let focusQuantumState = 0;
let focusDecoherenceTime = 0;
let focusEntanglementMatrix = [];
let focusWaveFunction = [];
let focusPotentialWell = [];
let focusQuantumTunneling = 0;

// Advanced quantum focus constants
const FOCUS_QUANTUM_STATES = {
    SUPERPOSED: 0,
    COLLAPSED: 1,
    ENTANGLED: 2,
    DECOHERED: 3,
    TUNNELING: 4,
    RESONANT: 5,
    COHERENT: 6
};

// Quantum focus dimensions
const FOCUS_DIMENSIONS = {
    ATTENTION: 0,
    CONCENTRATION: 1,
    AWARENESS: 2,
    REACTION: 3,
    STABILITY: 4
};

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

    // Advanced quantum constants
    const h = 6.626e-34; // Planck's constant
    const kB = 1.381e-23; // Boltzmann constant
    const c = 3e8; // Speed of light
    const quantumBarrier = 0.7; // Arbitrary barrier for tunneling
    const alpha = 1/137; // Fine structure constant
    const G = 6.674e-11; // Gravitational constant

    // Get focus contribution
    const focusContribution = endFocusTest();
    
    // Quantum field state vector: [speed, consistency, perfects, focus, adaptation] as amplitudes
    let speedAmp = Math.max(0, 1 - (avg - 200) / 600);
    let consistencyAmp = Math.max(0, 1 - (stdDev / avg));
    let perfectAmp = Math.min(1, perfects / reactionTimes.length);
    let focusAmp = focusContribution.focusAmp;
    let adaptationAmp = Math.min(1, reactionTimes.length / 20);

    // Normalize amplitudes with quantum field normalization
    const norm = Math.sqrt(speedAmp ** 2 + consistencyAmp ** 2 + perfectAmp ** 2 + 
                          focusAmp ** 2 + adaptationAmp ** 2);
    speedAmp /= norm;
    consistencyAmp /= norm;
    perfectAmp /= norm;
    focusAmp /= norm;
    adaptationAmp /= norm;

    // Quantum phases with field interactions
    const phaseSpeed = (avg % 360) * Math.PI / 180;
    const phaseConsistency = (stdDev % 360) * Math.PI / 180;
    const phasePerfect = (perfects % 360) * Math.PI / 180;
    const phaseFocus = focusContribution.focusPhase;
    const phaseAdaptation = (adaptationAmp * 360) * Math.PI / 180;

    // Quantum field theory effects
    const fieldStrength = Math.sqrt(speedAmp ** 2 + consistencyAmp ** 2);
    const fieldCoupling = alpha * fieldStrength;
    const vacuumEnergy = Math.exp(-fieldStrength) * 0.1;

    // Enhanced quantum superposition with field interactions
    const superposed =
        speedAmp * Math.cos(phaseSpeed) +
        consistencyAmp * Math.cos(phaseConsistency) +
        perfectAmp * Math.cos(phasePerfect) +
        focusAmp * Math.cos(phaseFocus) +
        adaptationAmp * Math.cos(phaseAdaptation);

    // Quantum chaos effects
    const chaosFactor = Math.sin(phaseSpeed * phaseConsistency) * Math.cos(phasePerfect * phaseFocus);
    const butterflyEffect = Math.exp(-Math.abs(chaosFactor)) * 0.2;

    // Advanced quantum entanglement with multi-particle states
    const entanglement = 2 * speedAmp * consistencyAmp * Math.cos(phaseSpeed - phaseConsistency);
    const bellState = Math.sqrt(2) * (speedAmp * consistencyAmp + perfectAmp * speedAmp);
    const ghzState = Math.sqrt(3) * (speedAmp * consistencyAmp * perfectAmp);

    // Quantum tunneling with advanced Gamow factor and field effects
    let tunnelingProb = 0;
    if (avg < 300 && stdDev < 50) {
        const barrier = quantumBarrier;
        const energy = (1 / avg) * 1000;
        const gamowFactor = Math.exp(-2 * Math.sqrt(barrier - energy));
        const fieldTunneling = Math.exp(-fieldStrength * 2);
        tunnelingProb = gamowFactor * fieldTunneling * (1 - Math.exp(-reactionTimes.length / 10));
    }

    // Quantum decoherence with environment and field interactions
    const decoherence = Math.exp(-reactionTimes.length / 30);
    const environmentInteraction = Math.exp(-stdDev / 100);
    const fieldDecoherence = Math.exp(-fieldStrength * 3);

    // Quantum interference with multiple paths and field effects
    const interference = Math.cos(phaseSpeed + phaseConsistency + phasePerfect);
    const pathInterference = Math.sin(phaseSpeed) * Math.sin(phaseConsistency) * Math.sin(phasePerfect);
    const fieldInterference = Math.cos(fieldStrength * Math.PI);

    // Quantum measurement with collapse probability and field effects
    const collapseProb = Math.exp(-(avg - 200) / 400);
    const fieldCollapse = Math.exp(-fieldStrength * 2);

    // Quantum gravity effects (simplified)
    const gravityEffect = G * (speedAmp + consistencyAmp + perfectAmp) / 3;

    // Final quantum IQ calculation with all effects
    let quantumIQ = 100 +
        40 * superposed +
        20 * entanglement +
        15 * bellState +
        10 * ghzState +
        10 * interference +
        5 * pathInterference +
        15 * tunnelingProb +
        8 * chaosFactor +
        5 * butterflyEffect +
        3 * gravityEffect;

    // Apply quantum field effects
    quantumIQ *= decoherence * environmentInteraction * fieldDecoherence;
    quantumIQ *= (1 + collapseProb * 0.2) * (1 + fieldCollapse * 0.1);
    quantumIQ *= (1 + fieldCoupling * 0.15);
    quantumIQ += perfects * 2;
    quantumIQ += vacuumEnergy * 5;

    // Quantum uncertainty principle with field effects
    const uncertainty = Math.min(1, stdDev / avg);
    const fieldUncertainty = Math.exp(-fieldStrength);
    quantumIQ *= (1 + uncertainty * 0.1) * (1 + fieldUncertainty * 0.05);

    // Final adjustments with quantum field normalization
    quantumIQ = Math.round(quantumIQ);
    quantumIQ = Math.max(70, Math.min(quantumIQ, 180));

    // Add focus effects to final calculation
    quantumIQ *= (1 + focusContribution.focusField * 0.2);
    quantumIQ += focusAmp * 10;
    
    return quantumIQ;
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

function startFocusTest() {
    focusTestActive = true;
    focusTestStartTime = performance.now();
    focusTestResults = [];
    focusQuantumState = FOCUS_QUANTUM_STATES.SUPERPOSED;
    focusDecoherenceTime = 0;
    focusEntanglementMatrix = initializeEntanglementMatrix();
    focusWaveFunction = initializeWaveFunction();
    focusPotentialWell = initializePotentialWell();
    focusQuantumTunneling = 0;
    
    // Create enhanced quantum focus measurement UI
    const focusUI = document.createElement('div');
    focusUI.id = 'focusTestUI';
    focusUI.innerHTML = `
        <div class="focus-test-container">
            <div class="quantum-focus-indicator"></div>
            <div class="focus-status">Quantum Focus State: Superposed</div>
            <div class="focus-measurement"></div>
            <div class="focus-dimensions"></div>
            <div class="quantum-visualization"></div>
            <div class="focus-stability"></div>
        </div>
    `;
    document.body.appendChild(focusUI);
    
    // Start advanced focus measurement
    measureFocus();
}

function initializeEntanglementMatrix() {
    const matrix = [];
    for (let i = 0; i < Object.keys(FOCUS_DIMENSIONS).length; i++) {
        matrix[i] = new Array(Object.keys(FOCUS_DIMENSIONS).length).fill(0);
        matrix[i][i] = 1; // Self-entanglement
    }
    return matrix;
}

function initializeWaveFunction() {
    return Object.keys(FOCUS_DIMENSIONS).map(() => ({
        amplitude: 1,
        phase: 0,
        energy: 0
    }));
}

function initializePotentialWell() {
    return Object.keys(FOCUS_DIMENSIONS).map(() => ({
        depth: 1,
        width: 1,
        barrier: 0.5
    }));
}

function measureFocus() {
    if (!focusTestActive) return;
    
    const currentTime = performance.now();
    const timeSinceLastMeasurement = currentTime - focusTestStartTime;
    
    // Advanced quantum measurement principles
    const measurementProbability = Math.exp(-timeSinceLastMeasurement / 1000);
    const quantumNoise = Math.random() * 0.1;
    
    // Heisenberg's uncertainty principle for each dimension
    const uncertainties = Object.keys(FOCUS_DIMENSIONS).map(dim => {
        const positionUncertainty = Math.sqrt(h / (2 * Math.PI * measurementProbability));
        const momentumUncertainty = h / (4 * Math.PI * positionUncertainty);
        return { position: positionUncertainty, momentum: momentumUncertainty };
    });
    
    // Update wave function
    updateWaveFunction(timeSinceLastMeasurement);
    
    // Update entanglement matrix
    updateEntanglementMatrix();
    
    // Calculate quantum tunneling probability
    const tunnelingProb = calculateTunnelingProbability();
    
    // Focus quantum state evolution with advanced states
    switch (focusQuantumState) {
        case FOCUS_QUANTUM_STATES.SUPERPOSED:
            if (Math.random() < measurementProbability) {
                focusQuantumState = FOCUS_QUANTUM_STATES.COLLAPSED;
                updateFocusUI("Focus State Collapsed");
            }
            break;
            
        case FOCUS_QUANTUM_STATES.COLLAPSED:
            if (Math.random() < 0.3) {
                focusQuantumState = FOCUS_QUANTUM_STATES.ENTANGLED;
                updateFocusUI("Focus State Entangled");
            }
            break;
            
        case FOCUS_QUANTUM_STATES.ENTANGLED:
            focusDecoherenceTime += timeSinceLastMeasurement;
            if (focusDecoherenceTime > 2000) {
                if (tunnelingProb > 0.7) {
                    focusQuantumState = FOCUS_QUANTUM_STATES.TUNNELING;
                    updateFocusUI("Focus State Tunneling");
                } else {
                    focusQuantumState = FOCUS_QUANTUM_STATES.DECOHERED;
                    updateFocusUI("Focus State Decohered");
                }
            }
            break;
            
        case FOCUS_QUANTUM_STATES.TUNNELING:
            if (Math.random() < 0.5) {
                focusQuantumState = FOCUS_QUANTUM_STATES.RESONANT;
                updateFocusUI("Focus State Resonant");
            }
            break;
            
        case FOCUS_QUANTUM_STATES.RESONANT:
            if (Math.random() < 0.3) {
                focusQuantumState = FOCUS_QUANTUM_STATES.COHERENT;
                updateFocusUI("Focus State Coherent");
            }
            break;
    }
    
    // Record advanced focus measurement
    const focusMeasurement = {
        time: currentTime,
        state: focusQuantumState,
        uncertainties: uncertainties,
        noise: quantumNoise,
        decoherence: focusDecoherenceTime,
        waveFunction: [...focusWaveFunction],
        entanglement: focusEntanglementMatrix.map(row => [...row]),
        tunneling: tunnelingProb
    };
    
    focusTestResults.push(focusMeasurement);
    updateFocusMeasurement(focusMeasurement);
    updateFocusDimensions();
    updateQuantumVisualization();
    
    // Continue measurement if test is active
    if (focusTestActive) {
        requestAnimationFrame(measureFocus);
    }
}

function updateWaveFunction(timeDelta) {
    focusWaveFunction.forEach((wave, index) => {
        // Update amplitude based on focus state
        wave.amplitude *= Math.exp(-timeDelta / 1000);
        
        // Update phase based on energy
        wave.phase += wave.energy * timeDelta / 1000;
        
        // Update energy based on potential well
        const well = focusPotentialWell[index];
        wave.energy = Math.sqrt(well.depth * well.width) * (1 - Math.exp(-timeDelta / 500));
    });
}

function updateEntanglementMatrix() {
    for (let i = 0; i < focusEntanglementMatrix.length; i++) {
        for (let j = i + 1; j < focusEntanglementMatrix.length; j++) {
            // Update entanglement based on wave function correlation
            const correlation = Math.cos(focusWaveFunction[i].phase - focusWaveFunction[j].phase);
            focusEntanglementMatrix[i][j] = focusEntanglementMatrix[j][i] = correlation;
        }
    }
}

function calculateTunnelingProbability() {
    let totalTunneling = 0;
    focusWaveFunction.forEach((wave, index) => {
        const well = focusPotentialWell[index];
        const energy = wave.energy;
        const barrier = well.barrier;
        if (energy < barrier) {
            const tunnelingProb = Math.exp(-2 * Math.sqrt(barrier - energy));
            totalTunneling += tunnelingProb;
        }
    });
    return totalTunneling / focusWaveFunction.length;
}

function updateFocusDimensions() {
    const dimensionsDiv = document.querySelector('.focus-dimensions');
    if (dimensionsDiv) {
        const dimensionScores = Object.keys(FOCUS_DIMENSIONS).map((dim, index) => {
            const wave = focusWaveFunction[index];
            const score = (wave.amplitude * 100).toFixed(1);
            return `${dim}: ${score}%`;
        });
        dimensionsDiv.innerHTML = dimensionScores.join('<br>');
    }
}

function updateQuantumVisualization() {
    const visualizationDiv = document.querySelector('.quantum-visualization');
    if (visualizationDiv) {
        const waveData = focusWaveFunction.map(wave => 
            `Amplitude: ${wave.amplitude.toFixed(2)}, Phase: ${wave.phase.toFixed(2)}`
        );
        visualizationDiv.innerHTML = waveData.join('<br>');
    }
}

function updateFocusUI(message) {
    const focusStatus = document.querySelector('.focus-status');
    if (focusStatus) {
        focusStatus.textContent = `Quantum Focus State: ${message}`;
    }
}

function updateFocusMeasurement(measurement) {
    const focusMeasurement = document.querySelector('.focus-measurement');
    if (focusMeasurement) {
        focusMeasurement.innerHTML = `
            Uncertainty: ${measurement.uncertainties.map(u => `${u.position.toFixed(4)} ± ${u.momentum.toFixed(4)}`).join('<br>')}
        `;
    }
}

function endFocusTest() {
    focusTestActive = false;
    
    // Calculate focus score using quantum principles
    const focusScore = calculateFocusScore(focusTestResults);
    
    // Update IQ calculation with focus results
    const focusContribution = calculateFocusContribution(focusScore);
    
    // Remove focus test UI
    const focusUI = document.getElementById('focusTestUI');
    if (focusUI) {
        focusUI.remove();
    }
    
    return focusContribution;
}

function calculateFocusScore(results) {
    if (!results.length) return 0;
    
    // Enhanced quantum focus scoring
    const stateWeights = {
        [FOCUS_QUANTUM_STATES.SUPERPOSED]: 1.0,
        [FOCUS_QUANTUM_STATES.COLLAPSED]: 0.8,
        [FOCUS_QUANTUM_STATES.ENTANGLED]: 0.9,
        [FOCUS_QUANTUM_STATES.DECOHERED]: 0.6,
        [FOCUS_QUANTUM_STATES.TUNNELING]: 1.2,
        [FOCUS_QUANTUM_STATES.RESONANT]: 1.1,
        [FOCUS_QUANTUM_STATES.COHERENT]: 1.3
    };
    
    // Calculate average state weight
    const avgStateWeight = results.reduce((sum, result) => 
        sum + stateWeights[result.state], 0) / results.length;
    
    // Calculate uncertainty penalty
    const avgUncertainty = results.reduce((sum, result) => 
        sum + result.uncertainties.reduce((s, u) => s + u.position, 0), 0) / 
        (results.length * Object.keys(FOCUS_DIMENSIONS).length);
    
    // Calculate wave function coherence
    const coherence = results.reduce((sum, result) => 
        sum + result.waveFunction.reduce((s, w) => s + w.amplitude, 0), 0) / 
        (results.length * Object.keys(FOCUS_DIMENSIONS).length);
    
    // Calculate entanglement strength
    const entanglement = results.reduce((sum, result) => 
        sum + result.entanglement.reduce((s, row) => 
            s + row.reduce((t, val) => t + Math.abs(val), 0), 0), 0) / 
        (results.length * Object.keys(FOCUS_DIMENSIONS).length * Object.keys(FOCUS_DIMENSIONS).length);
    
    // Calculate tunneling contribution
    const tunneling = results.reduce((sum, result) => 
        sum + result.tunneling, 0) / results.length;
    
    // Final focus score with all quantum effects
    return (avgStateWeight * 100) * 
           (1 - avgUncertainty) * 
           (0.7 + 0.3 * coherence) * 
           (0.8 + 0.2 * entanglement) * 
           (1 + 0.2 * tunneling);
}

function calculateFocusContribution(focusScore) {
    // Convert focus score to quantum contribution
    return {
        focusAmp: focusScore / 100,
        focusPhase: (focusScore % 360) * Math.PI / 180,
        focusField: Math.exp(-focusScore / 50)
    };
}

// Add focus test button to the UI
function addFocusTestButton() {
    const focusTestBtn = document.createElement('button');
    focusTestBtn.id = 'focusTestBtn';
    focusTestBtn.textContent = 'Start Focus Test';
    focusTestBtn.onclick = startFocusTest;
    document.body.appendChild(focusTestBtn);
}

// Initialize focus testing
document.addEventListener('DOMContentLoaded', () => {
    addFocusTestButton();
});
