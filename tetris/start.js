import readline from 'readline';
import chalk from 'chalk';

const width = 10;
const height = 20;

// Tablero vacío
let board = Array.from({ length: height }, () => Array(width).fill(" "));

// Tetrominos
const tetrominos = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[1,0],[1,0],[1,1]],
  J: [[0,1],[0,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]]
};

function randomPiece() {
  const keys = Object.keys(tetrominos);
  const shape = tetrominos[keys[Math.floor(Math.random() * keys.length)]];
  return { shape, x: Math.floor(width/2)-2, y: 0 };
}

let currentPiece = randomPiece();

function drawBoard() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      if (isPieceCell(x, y)) {
        row += chalk.cyan("█");
      } else {
        row += board[y][x] === " " ? chalk.gray(".") : chalk.yellow("█");
      }
    }
    console.log(row);
  }
}

function isPieceCell(x, y) {
  const shape = currentPiece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx] &&
          x === currentPiece.x + dx &&
          y === currentPiece.y + dy) {
        return true;
      }
    }
  }
  return false;
}

function collides(px, py, shape) {
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx]) {
        let x = px + dx;
        let y = py + dy;
        if (x < 0 || x >= width || y >= height) return true;
        if (y >= 0 && board[y][x] !== " ") return true;
      }
    }
  }
  return false;
}

function placePiece() {
  const shape = currentPiece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx]) {
        board[currentPiece.y + dy][currentPiece.x + dx] = "█";
      }
    }
  }
}

function clearLines() {
  for (let y = height-1; y >= 0; y--) {
    if (board[y].every(cell => cell !== " ")) {
      board.splice(y,1);
      board.unshift(Array(width).fill(" "));
      y++;
    }
  }
}

function tick() {
  if (!collides(currentPiece.x, currentPiece.y+1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    placePiece();
    clearLines();
    currentPiece = randomPiece();
    if (collides(currentPiece.x, currentPiece.y, currentPiece.shape)) {
      console.log(chalk.red("GAME OVER"));
      process.exit();
    }
  }
  drawBoard();
}

// Captura teclas
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "a" && !collides(currentPiece.x-1, currentPiece.y, currentPiece.shape)) currentPiece.x--;
  if (key.name === "d" && !collides(currentPiece.x+1, currentPiece.y, currentPiece.shape)) currentPiece.x++;
  if (key.name === "s" && !collides(currentPiece.x, currentPiece.y+1, currentPiece.shape)) currentPiece.y++;
  if (key.name === "w") rotatePiece();
  if (key.ctrl && key.name === "c") process.exit();
  drawBoard();
});

function rotatePiece() {
  const shape = currentPiece.shape;
  const rotated = shape[0].map((_, i) =>
    shape.map(row => row[i]).reverse()
  );
  if (!collides(currentPiece.x, currentPiece.y, rotated)) {
    currentPiece.shape = rotated;
  }
}

setInterval(tick, 500);
drawBoard();
