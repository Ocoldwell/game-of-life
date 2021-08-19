// Any live cell with fewer than two live neighbors dies, as if caused by under population.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies, as if by overcrowding.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
const size = 30;

let started = false;
let timer;
let evolutionSpeed = 500;
let currGen = [size];
let nextGen = [size];

const createGenArrays = () => {
  for (let i = 0; i < size; i++) {
    currGen[i] = new Array(size);
    nextGen[i] = new Array(size);
  }
};

const initGenArrays = () => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      currGen[i][j] = 0;
      nextGen[i][j] = 0;
    }
  }
};

const createWorld = () => {
  let world = document.querySelector('#grid');

  let tbl = document.createElement('table');
  tbl.setAttribute('id', 'worldgrid');
  for (let i = 0; i < size; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < size; j++) {
      let cell = document.createElement('td');
      cell.setAttribute('id', i + '_' + j);
      cell.setAttribute('class', 'dead');
      cell.addEventListener('click', cellClick);

      tr.appendChild(cell);
    }
    tbl.appendChild(tr);
  }
  world.appendChild(tbl);
};

function cellClick() {
  let loc = this.id.split('_');
  let row = Number(loc[0]);
  let col = Number(loc[1]);

  if (this.className === 'alive') {
    this.setAttribute('class', 'dead');
    currGen[row][col] = 0;
  } else {
    this.setAttribute('class', 'alive');
    currGen[row][col] = 1;
  }
}

const createNextGen = () => {
  for (row in currGen) {
    for (col in currGen[row]) {
      let neighbours = getNeighborCount(row, col);

      if (currGen[row][col] === 1) {
        if (neighbours < 2) {
          nextGen[row][col] = 0;
        } else if (neighbours === 2 || neighbours === 3) {
          nextGen[row][col] = 1;
        } else if (neighbours > 3) {
          nextGen[row][col] = 0;
        }
      } else if (currGen[row][col] === 0) {
        if (neighbours === 0) {
          nextGen[row][col] = 1;
        }
      }
    }
  }
};

const updateCurrGen = () => {
  for (row in currGen) {
    for (col in currGen[row]) {
      currGen[row][col] = nextGen[row][col];
      nextGen[row][col] = 0;
    }
  }
};

const updateGrid = () => {
  let cell = '';
  for (row in currGen) {
    for (col in currGen[row]) {
      cell = document.getElementById(row + '_' + col);
      if (currGen[row][col] === 0) {
        cell.setAttribute('class', 'dead');
      } else {
        cell.setAttribute('class', 'alive');
      }
    }
  }
};

const reproduce = () => {
  let startstop = document.querySelector('#btnstartstop');
  if (!started) {
    started = true;
    startstop.value = 'Stop reproducing';
    evolve();
  } else {
    started = false;
    startstop.value = 'Start reproducing';
    clearTimeout(timer);
  }
};

const getNeighborCount = (row, col) => {
  let count = 0;
  let nrow = Number(row);
  let ncol = Number(col);

  // Make sure we are not at the first row
  if (nrow - 1 >= 0) {
    // Check top neighbor
    if (currGen[nrow - 1][ncol] == 1) count++;
  }
  // Make sure we are not in the first cell
  // Upper left corner
  if (nrow - 1 >= 0 && ncol - 1 >= 0) {
    //Check upper left neighbor
    if (currGen[nrow - 1][ncol - 1] == 1) count++;
  }
  // Make sure we are not on the first row last column
  // Upper right corner
  if (nrow - 1 >= 0 && ncol + 1 < size) {
    //Check upper right neighbor
    if (currGen[nrow - 1][ncol + 1] == 1) count++;
  }
  // Make sure we are not on the first column
  if (ncol - 1 >= 0) {
    //Check left neighbor
    if (currGen[nrow][ncol - 1] == 1) count++;
  }
  // Make sure we are not on the last column
  if (ncol + 1 < size) {
    //Check right neighbor
    if (currGen[nrow][ncol + 1] == 1) count++;
  }
  // Make sure we are not on the bottom left corner
  if (nrow + 1 < size && ncol - 1 >= 0) {
    //Check bottom left neighbor
    if (currGen[nrow + 1][ncol - 1] == 1) count++;
  }
  // Make sure we are not on the bottom right
  if (nrow + 1 < size && ncol + 1 < size) {
    //Check bottom right neighbor
    if (currGen[nrow + 1][ncol + 1] == 1) count++;
  }

  // Make sure we are not on the last row
  if (nrow + 1 < size) {
    //Check bottom neighbor
    if (currGen[nrow + 1][ncol] == 1) count++;
  }

  return count;
};

const evolve = () => {
  createNextGen();
  updateCurrGen();
  updateGrid();

  if (started) {
    timer = setTimeout(evolve, evolutionSpeed);
  }
};

window.onload = () => {
  createWorld();
  createGenArrays();
  initGenArrays();
};
