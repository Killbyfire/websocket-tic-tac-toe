const players = { player1: "x-symbol.svg", player2: "o-symbol.svg" };

const turnIndication = document.getElementById("currentTurn");

const assetFolder = "./assets/";

let currentTurn = 0;

function setPlayerUUID(playerUUID) {
  localStorage.setItem("playerID", playerUUID);

  return true;
}

function getPlayerUUID() {
  return localStorage.getItem("playerID");
}

function updatePayerIndication() {
  const playerNumber = currentTurn + 1;
  turnIndication.innerText = `It is currently player ${playerNumber}'s turn`;
}

function markSquare(square) {
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

// Use neighbor functions
// Check neighbor of every square
function checkWinState() {}

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
