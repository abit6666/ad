const contractAddress = '0xC12075E14E51A6566F219B86eB8C0BBA29c98522'; // Replace with your deployed contract address
const contractABI = [
  {
    "inputs": [{"internalType": "uint256","name": "score","type": "uint256"}],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyBestScore",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

let web3, contract, account;
const connectBtn = document.getElementById('connectWallet');
const walletDiv = document.getElementById('wallet');

connectBtn.onclick = async function() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);
      walletDiv.innerText = `Wallet: ${account.slice(0,6)}...${account.slice(-4)}`;
    } catch (e) {
      walletDiv.innerText = 'Wallet: Connection failed';
    }
  } else {
    walletDiv.innerText = 'Wallet: MetaMask not found';
  }
};

const gameArea = document.getElementById('gameArea');
const timerDiv = document.getElementById('timer');
const scoreDiv = document.getElementById('score');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const popSound = document.getElementById('popSound');

const EMOJIS = ['💠','✨','🚀','🌟','🔷','🪐','💎','🌀','🔹','🌈'];
let time = 30.0;
let score = 0;
let timer = null;
let running = false;
let emojiInterval = null;
let emojiId = 0;

function startGame() {
    time = 30.0;
    score = 0;
    running = true;
    scoreDiv.innerText = '0';
    timerDiv.innerText = time.toFixed(1);
    messageDiv.innerText = '';
    restartBtn.style.display = 'none';
    gameArea.innerHTML = '';
    // Start timer
    timer = setInterval(() => {
        time -= 0.1;
        if (time <= 0) {
            endGame();
        } else {
            timerDiv.innerText = time.toFixed(1);
        }
    }, 100);
    // Spawn emojis
    emojiInterval = setInterval(spawnEmoji, 400);
}

function endGame() {
    running = false;
    clearInterval(timer);
    clearInterval(emojiInterval);
    timerDiv.innerText = '0.0';
    // Remove all emojis
    setTimeout(() => gameArea.innerHTML = '', 800);
    let msg = '';
    if (score === 0) msg = "Try clicking the emojis!";
    else if (score < 10) msg = "Keep practicing!";
    else if (score < 25) msg = "Nice! You're quick!";
    else if (score < 40) msg = "Great job! Nexus fan!";
    else msg = "Incredible! Nexus Master!";
    messageDiv.innerText = `Time's up!\n${msg}`;
    // Always show replay button at end
    restartBtn.style.display = 'inline-block';
    // Submit score to Nexus blockchain if wallet is connected
    if (contract && account) {
      contract.methods.submitScore(score).send({ from: account, gasPrice: web3.utils.toWei('1', 'gwei') })
        .then(() => {
          messageDiv.innerText += '\nScore submitted to Nexus!';
        })
        .catch((err) => {
          messageDiv.innerText += '\nFailed to submit score.';
          console.error('Blockchain error:', err);
        });
    }
}

function spawnEmoji() {
    if (!running) return;
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.innerText = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const left = Math.random() * (gameArea.offsetWidth - 40);
    emoji.style.left = `${left}px`;
    emoji.style.top = '-40px';
    emoji.dataset.id = emojiId++;
    gameArea.appendChild(emoji);
    // Animate falling
    let pos = -40;
    const speed = 2 + Math.random() * 2;
    const fall = setInterval(() => {
        if (!running) { clearInterval(fall); return; }
        pos += speed;
        emoji.style.top = `${pos}px`;
        if (pos > gameArea.offsetHeight) {
            clearInterval(fall);
            if (emoji.parentNode) emoji.parentNode.removeChild(emoji);
        }
    }, 20);
    // Click to score
    emoji.onclick = function() {
        if (!running) return;
        score++;
        scoreDiv.innerText = score;
        emoji.style.transform = 'scale(1.3)';
        setTimeout(() => {
            if (emoji.parentNode) emoji.parentNode.removeChild(emoji);
        }, 80);
        popSound.currentTime = 0;
        popSound.play();
    };
}

restartBtn.onclick = function() {
    // Clean up any remaining emojis
    gameArea.innerHTML = '';
    startGame();
};

// Start on load
startGame(); 