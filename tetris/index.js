import readline from 'readline';
import chalk from 'chalk';

const width = 10;
const height = 20;

let board = Array.from({ length: height }, () => Array(width).fill(" "));

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
  const type = keys[Math.floor(Math.random() * keys.length)];
  const shape = tetrominos[type];
  return { type, shape, x: Math.floor(width/2)-2, y: 0 };
}



let currentPiece = randomPiece();
let nextPieces = [randomPiece(), randomPiece(), randomPiece()];
let holdPiece = null;
let canHold = true;

let score = 0;
let level = 1;
let linesCleared = 0;
let speed = 500;

const colors = {
  I: chalk.cyan,
  O: chalk.yellow,
  T: chalk.magenta,
  L: chalk.blue,
  J: chalk.green,
  S: chalk.red,
  Z: chalk.white
};

function drawHUD() {
  console.log(chalk.green(`Score: ${score}   Level: ${level}   Lines: ${linesCleared}`));

  // Hold
  process.stdout.write(chalk.blue("Hold: "));
  if (holdPiece) {
    drawMiniPiece(holdPiece);
  } else {
    console.log("empty");
  }

  // Next
  process.stdout.write(chalk.magenta("Next: "));
  nextPieces.forEach(p => drawMiniPiece(p));
  console.log();
}

function drawMiniPiece(piece) {
  const color = colors[piece.type];
  let output = "";
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      output += piece.shape[y][x] ? color("██") : "  ";
    }
    output += "  "; // espacio entre filas
  }
  process.stdout.write(output + " ");
}

function drawBoard() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  drawHUD();
  console.log("-".repeat(width*2));

  const ghostY = getGhostY();

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      let bg = (x+y) % 2 === 0 ? chalk.bgBlack : chalk.bgGray;

      if (isPieceCell(x, y)) {
        row += bg(colors[currentPiece.type]("██"));
      } else if (isGhostCell(x, y, ghostY)) {
        row += bg(chalk.white("░░"));
      } else {
        row += board[y][x] === " " 
          ? bg("  ") 
          : bg(colors[board[y][x]]("██")); // conserva color al fijarse
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

function isGhostCell(x, y, ghostY) {
  const shape = currentPiece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx] &&
          x === currentPiece.x + dx &&
          y === ghostY + dy) {
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

function getGhostY() {
  let ghostY = currentPiece.y;
  while (!collides(currentPiece.x, ghostY+1, currentPiece.shape)) {
    ghostY++;
  }
  return ghostY;
}

function placePiece() {
  const shape = currentPiece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx]) {
        board[currentPiece.y + dy][currentPiece.x + dx] = currentPiece.type;
      }
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let y = height-1; y >= 0; y--) {
    if (board[y].every(cell => cell !== " ")) {
      board.splice(y,1);
      board.unshift(Array(width).fill(" "));
      cleared++;
      y++;
    }
  }
  if (cleared > 0) {
    linesCleared += cleared;
    score += cleared * 100;
    if (linesCleared >= level * 5) {
      level++;
      speed = Math.max(100, speed - 50);
      restartInterval();
    }
  }
}

function tick() {
  if (!collides(currentPiece.x, currentPiece.y+1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    placePiece();
    clearLines();
    currentPiece = nextPieces.shift();
    nextPieces.push(randomPiece());
    canHold = true;
    if (collides(currentPiece.x, currentPiece.y, currentPiece.shape)) {
      console.log(chalk.red("GAME OVER"));
      process.exit();
    }
  }
  drawBoard();
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "a" && !collides(currentPiece.x-1, currentPiece.y, currentPiece.shape)) currentPiece.x--;
  if (key.name === "d" && !collides(currentPiece.x+1, currentPiece.y, currentPiece.shape)) currentPiece.x++;
  if (key.name === "s" && !collides(currentPiece.x, currentPiece.y+1, currentPiece.shape)) currentPiece.y++;
  if (key.name === "w") rotatePiece();
  if (key.name === "h") holdCurrentPiece();
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

function holdCurrentPiece() {
  if (!canHold) return;
  if (!holdPiece) {
    holdPiece = currentPiece;
    currentPiece = nextPieces.shift();
    nextPieces.push(randomPiece());
  } else {
    [holdPiece, currentPiece] = [currentPiece, holdPiece];
    currentPiece.x = Math.floor(width/2)-2;
    currentPiece.y = 0;
  }
  canHold = false;
}

let interval = setInterval(tick, speed);

function restartInterval() {
  clearInterval(interval);
  interval = setInterval(tick, speed);
}

drawBoard();
