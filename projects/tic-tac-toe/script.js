const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const playerXScore = document.getElementById('playerX');
const playerOScore = document.getElementById('playerO');
const resetButton = document.getElementById('reset');
const themeSelect = document.getElementById('theme');
const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isSinglePlayer = true;
let scores = { X: 0, O: 0 };
let difficulty = 'hard';

// Minimax Algorithm for Hard AI
function minimax(boardState, depth, isMaximizing) {
  const winner = checkWinner(boardState);
  if (winner === 'X') return -10 + depth;
  if (winner === 'O') return 10 - depth;
  if (boardState.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'O';
        bestScore = Math.max(bestScore, minimax(boardState, depth + 1, false));
        boardState[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        boardState[i] = 'X';
        bestScore = Math.min(bestScore, minimax(boardState, depth + 1, true));
        boardState[i] = null;
      }
    }
    return bestScore;
  }
}

// AI Move
function makeAIMove() {
  let move;
  if (difficulty === 'easy') {
    move = getRandomMove();
  } else if (difficulty === 'medium') {
    move = getMediumMove();
  } else if (difficulty === 'hard') {
    move = getBestMove();
  }
  gameState[move] = 'O';
  cells[move].textContent = 'O';
  cells[move].classList.add('taken');
  clickSound.play();
  if (checkWinner(gameState)) endGame();
  else currentPlayer = 'X';
}

// Random Move (Easy AI)
function getRandomMove() {
  const availableMoves = gameState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium AI (Winning/Blocking Move)
function getMediumMove() {
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === null) {
      gameState[i] = 'O';
      if (checkWinner(gameState)) {
        gameState[i] = null;
        return i;
      }
      gameState[i] = null;
    }
  }
  // Check for blocking move
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === null) {
      gameState[i] = 'X';
      if (checkWinner(gameState)) {
        gameState[i] = null;
        return i;
      }
      gameState[i] = null;
    }
  }
  // Random move if no winning/blocking move
  return getRandomMove();
}

// Best Move (Hard AI)
function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === null) {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

// Check Winner
function checkWinner(boardState) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return { winner: boardState[a], cells: [a, b, c] };
    }
  }
  return null;
}

// End Game
function endGame(winner, winningCells) {
  scores[winner]++;
  updateScoreboard();
  winSound.play();
  showWinnerModal(winner);
  setTimeout(() => {
    resetGame();
  }, 100);
}

// Show Winner Modal
function showWinnerModal(winner) {
  winnerMessage.textContent = `${winner} wins!`;
  winnerModal.style.display = 'flex';
}

// Hide Winner Modal
function hideWinnerModal() {
  winnerModal.style.display = 'none';
}

// Reset Game
function resetGame() {
  gameState.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  currentPlayer = 'X';
}

// Update Scoreboard
function updateScoreboard() {
  playerXScore.textContent = `Player X: ${scores.X}`;
  playerOScore.textContent = `Player O: ${scores.O}`;
}

// Event Listeners
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (!cell.classList.contains('taken')) {
      const index = cell.getAttribute('data-index');
      gameState[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add('taken');
      clickSound.play();

      const result = checkWinner(gameState);
      if (result) {
        endGame(result.winner, result.cells);
      } else if (gameState.every(cell => cell !== null)) {
        drawSound.play();
        winnerMessage.textContent = "It's a draw!";
        winnerModal.style.display = 'flex';
        setTimeout(() => {
          resetGame();
        }, 100);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isSinglePlayer && currentPlayer === 'O') makeAIMove();
      }
    }
  });
});

resetButton.addEventListener('click', resetGame);

themeSelect.addEventListener('change', (e) => {
  document.body.classList.toggle('dark', e.target.value === 'dark');
});

modeSelect.addEventListener('change', (e) => {
  isSinglePlayer = e.target.value === 'single';
  resetGame();
});

difficultySelect.addEventListener('change', (e) => {
  difficulty = e.target.value;
  resetGame();
});

// Hide modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === winnerModal) {
    hideWinnerModal();
  }
});