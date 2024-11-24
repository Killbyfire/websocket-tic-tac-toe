function createGrid() {
  const grid = document.getElementById("grid");

  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.classList.add("gridRow");
    grid.appendChild(row);
    for (let j = 0; j < 3; j++) {
      const col = document.createElement("div");
      col.classList.add("gridSquare");
      row.appendChild(col);
    }
  }
}

createGrid();
