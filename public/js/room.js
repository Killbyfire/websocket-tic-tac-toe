const players = { player1: "x-symbol.svg", player2: "o-symbol.svg" };

const turnIndication = document.getElementById("currentTurn");

const assetFolder = "../assets/";

var socket = io();

// Player 0 and are allowed to play and -1 is spectating
let currentPlayer;
let currentTurn = 0;
let inputBlocked = false;
let roomID;

// TODO if user leaves it should open a spot, if everyone leaves it should just pop the key.

if (!location.pathname.startsWith("/room")) {
  location.href = "/";
} else {
  roomID = location.pathname.split("/")[2];
  socket.emit("joinRoom", roomID, getPlayerUUID());
}

function generatePlayerUUID() {
  const newPlayerUUID = crypto.randomUUID();
  localStorage.setItem("playerID", newPlayerUUID);
  return;
}

function getPlayerUUID() {
  let playerID = localStorage.getItem("playerID");

  if (!playerID) {
    generatePlayerUUID();
    playerID = localStorage.getItem("playerID");
  }

  return playerID;
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

function markSquare(row, col) {
  if (inputBlocked) {
    return;
  }

  const square = document.getElementById(`col-${row}-${col}`);

  const image = square.querySelector("img");

  // Don't allow a square to be played again
  if (image.src) {
    return;
  }

  const playImage = assetFolder + players[Object.keys(players)[currentTurn]];

  image.src = playImage;

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

  if (won) {
    socket.emit("playerWon");
  }

  return;
}

//TODO Make this cleaner
function createGrid(madeGrid) {
  const grid = document.getElementById("grid");

  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.classList.add("gridRow");
    grid.appendChild(row);
    for (let j = 0; j < 3; j++) {
      const col = document.createElement("div");
      const image = document.createElement("img");
      col.id = `col-${i}-${j}`;
      col.classList.add("gridSquare");
      col.addEventListener("click", () => {
        if (currentPlayer === currentTurn) {
          socket.emit("updateMove", i, j);
        }
      });
      col.appendChild(image);
      row.appendChild(col);
    }
  }

  updatePayerIndication();
}

window.addEventListener("beforeunload", (ev) => {
  socket.emit("leaveRoom", roomID, getPlayerUUID());
});

socket.on("playerAssign", (player, mentioned) => {
  if (mentioned === getPlayerUUID()) {
    currentPlayer = player;
  }
});

socket.on("updateMove", (row, col) => {
  markSquare(row, col);
});

socket.on("playerWon", () => {
  setWinText();
});

createGrid();
