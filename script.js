let board = Array(9).fill(null);
let currentPlayer = "X";
let gameMode = null;
let isGameOver = false;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

// Disable reset at start
resetBtn.disabled = true;

// Start game with selected mode
function startGame(mode) {
  gameMode = mode;
  board.fill(null);
  currentPlayer = "X";
  isGameOver = false;
  resetBtn.disabled = false;
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();

  // Disable mode buttons during game
  pvpBtn.disabled = true;
  aiBtn.disabled = true;
}

// Render the tic-tac-toe board
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    if (cell !== null) {
      cellElement.textContent = cell;
      cellElement.classList.add("disabled");
    }
    cellElement.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(cellElement);
  });
}

// Handle clicking on a cell
function handleCellClick(index) {
  if (board[index] !== null || isGameOver) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    statusElement.textContent = `Player ${currentPlayer} wins! 🎉`;
    endGame();
    return;
  }

  if (board.every(cell => cell !== null)) {
    statusElement.textContent = "It's a draw! 🤝";
    endGame();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "ai" && currentPlayer === "O") {
    statusElement.textContent = "AI is thinking...";
    setTimeout(() => aiMove(), 600);
  } else {
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Simple AI picks a random empty spot
function aiMove() {
  if (isGameOver) return;

  const emptyIndices = board
    .map((val, idx) => (val === null ? idx : null))
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    statusElement.textContent = "AI wins! 🤖";
    endGame();
    return;
  }

  if (board.every(cell => cell !== null)) {
    statusElement.textContent = "It's a draw! 🤝";
    endGame();
    return;
  }

  currentPlayer = "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Check winning conditions for player
function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],  // rows
    [0,3,6],[1,4,7],[2,5,8],  // columns
    [0,4,8],[2,4,6]           // diagonals
  ];
  return winPatterns.some(pattern => 
    pattern.every(idx => board[idx] === player)
  );
}

// End the game and disable cells
function endGame() {
  isGameOver = true;
  resetBtn.disabled = false;
  pvpBtn.disabled = false;
  aiBtn.disabled = false;

  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.add("disabled");
  });
}

function resetGame() {
  board.fill(null);
  currentPlayer = "X";
  isGameOver = false;
  statusElement.textContent = "Choose a mode to start";
  resetBtn.disabled = true;
  renderBoard();

  pvpBtn.disabled = false;
  aiBtn.disabled = false;
}

pvpBtn.addEventListener("click", () => startGame("player"));
aiBtn.addEventListener("click", () => startGame("ai"));
resetBtn.addEventListener("click", resetGame);

renderBoard();
