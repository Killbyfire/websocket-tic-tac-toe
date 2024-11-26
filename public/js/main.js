function markSquare(col, row, player) {
  const square = document.getElementById(`square-${row}-${col}`);

  const image = square.querySelector("img");
}

function createGrid() {
  const grid = document.getElementById("grid");

  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.classList.add("gridRow");
    grid.appendChild(row);
    for (let j = 0; j < 3; j++) {
      const squareID = `square-${i}-${col}`;
      const col = document.createElement("div");
      const image = document.createElement("img");
      col.classList.add("gridSquare", "x-symbol");
      image.id = squareID;
      col.id = squareID;
      row.appendChild(col);
    }
  }
}

createGrid();
