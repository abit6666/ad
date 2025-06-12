// Replace with your deployed contract address and ABI from Remix
const contractAddress = '0x65fd84ae49F576C6490Cf2dcFfaEE84C9c4198F0';
const contractABI = [
  {
    "inputs": [],
    "name": "spin",
    "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "address", "name": "player", "type": "address" } ],
    "name": "getWins",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "prizeAmount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "win", "type": "bool" },
      { "indexed": false, "internalType": "uint256", "name": "prizeAmount", "type": "uint256" }
    ],
    "name": "SpinResult",
    "type": "event"
  }
];

let web3, contract, account;
const connectBtn = document.getElementById('connectWallet');
const spinBtn = document.getElementById('spinBtn');
const walletDiv = document.getElementById('wallet');
const resultDiv = document.getElementById('result');
const wheelText = document.getElementById('wheelText');

connectBtn.onclick = async function() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);
      walletDiv.innerText = `Wallet: ${account.slice(0,6)}...${account.slice(-4)}`;
      spinBtn.disabled = false;
      resultDiv.innerText = '';
    } catch (e) {
      walletDiv.innerText = 'Wallet: Connection failed';
    }
  } else {
    walletDiv.innerText = 'Wallet: MetaMask not found';
  }
};

spinBtn.onclick = async function() {
  if (!contract || !account) return;
  spinBtn.disabled = true;
  resultDiv.innerText = '';
  animateWheel();
  try {
    const tx = await contract.methods.spin().send({ from: account });
    // Find the SpinResult event in the receipt
    const event = tx.events && tx.events.SpinResult;
    let win = false, prize = 0;
    if (event) {
      win = event.returnValues.win;
      prize = web3.utils.fromWei(event.returnValues.prizeAmount, 'ether');
    }
    setTimeout(() => {
      stopWheel(win);
      resultDiv.innerHTML = win ? `<span style='color:#00ffea'>You WON! 🎉<br>Prize: ${prize} NEX</span>` : `<span style='color:#ff5252'>No luck, try again!</span>`;
      spinBtn.disabled = false;
    }, 2000);
  } catch (e) {
    stopWheel(false);
    resultDiv.innerText = 'Spin failed or cancelled.';
    spinBtn.disabled = false;
  }
};

let wheelInterval;
function animateWheel() {
  let options = ['💎', '❌', '💎', '❌'];
  let i = 0;
  clearInterval(wheelInterval);
  wheelInterval = setInterval(() => {
    wheelText.innerText = options[i % options.length];
    i++;
  }, 80);
}
function stopWheel(win) {
  clearInterval(wheelInterval);
  wheelText.innerText = win ? '💎' : '❌';
} 