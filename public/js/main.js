const players = { player1: "x-symbol.svg", player2: "o-symbol.svg" };

const turnIndication = document.getElementById("currentTurn");

const assetFolder = "./assets/";

let currentTurn = 0;
let inputBlocked = false;

function setPlayerUUID(playerUUID) {
  localStorage.setItem("playerID", playerUUID);
  return;
}

function getPlayerUUID() {
  return localStorage.getItem("playerID");
}

function startRematch() {
  inputBlocked = false;
}

function setWinText() {
  let playerNumber;
  currentTurn ? (playerNumber = 1) : (playerNumber = 2);
  turnIndication.innerText = `Player ${playerNumber} has won!`;
  inputBlocked = true;
}

function updatePayerIndication() {
  const playerNumber = currentTurn + 1;
  turnIndication.innerText = `It is currently player ${playerNumber}'s turn`;
}

function markSquare(square) {
  if (inputBlocked) {
    return;
  }

  const image = square.querySelector("img");

  // Don't allow a square to be played again
  if (image.src) {
    return;
  }

  const playImage = assetFolder + players[Object.keys(players)[currentTurn]];

  image.src = playImage;

  const currentWinner = currentTurn;

  // Use 0 and 1 and -1 for empty
  currentTurn ? (currentTurn = 0) : (currentTurn = 1);
  currentTurn ? (square.dataset.player = 0) : (square.dataset.player = 1);
  updatePayerIndication();
  checkWinState();
}

function getBoard() {
  const board = document.querySelector("div#grid");

  const boardArray = [];

  const rows = board.children;

  for (let i = 0; i < rows.length; i++) {
    boardArray.push([]);
    const columns = rows[i].children;
    for (let j = 0; j < columns.length; j++) {
      const player = columns[j].dataset.player;

      if (!player) {
        boardArray[i].push(-1);
      } else {
        boardArray[i].push(parseInt(player));
      }
    }
  }

  return boardArray;
}

function checkWinState() {
  const board = getBoard();

  const gridSize = board.length;

  let won = false;

  // Check rows
  for (let row = 0; row < gridSize; row++) {
    if (
      board[row][0] !== -1 &&
      board[row].every((square) => square === board[row][0])
    ) {
      won = true;
      break;
    }
  }

  // Check columns
  for (let col = 0; col < gridSize; col++) {
    if (
      board[0][col] !== -1 &&
      board.every((row) => row[col] === board[0][col])
    ) {
      won = true;
      break;
    }
  }

  // Check diagonal (top-left -> bottom-right)
  for (let col = 0; col < gridSize; col++) {
    if (board[0][0] !== -1 && board.every((row, i) => row[i] === board[0][0])) {
      won = true;
      break;
    }
  }

  // Check diagonal (top-right -> bottom-left)
  for (let col = 0; col < gridSize; col++) {
    if (
      board[0][gridSize - 1] !== -1 &&
      board.every((row, i) => row[gridSize - 1 - i] === board[0][gridSize - 1])
    ) {
      won = true;
      break;
    }
  }

  console.log(won);

  if (won) {
    setWinText();
  }

  return;
}

function createGrid() {
  const grid = document.getElementById("grid");

  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.classList.add("gridRow");
    grid.appendChild(row);
    for (let j = 0; j < 3; j++) {
      const col = document.createElement("div");
      const image = document.createElement("img");
      col.classList.add("gridSquare");
      col.addEventListener("click", () => {
        markSquare(col);
      });
      col.appendChild(image);
      row.appendChild(col);
    }
  }

  updatePayerIndication();
}

createGrid();
