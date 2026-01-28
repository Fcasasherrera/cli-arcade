import readline from 'readline';
import chalk from 'chalk';
import { createBoard, collides, placePiece } from './components/board.js';
import { randomPiece } from './components/pieces.js';
import { drawBoard } from './components/render.js';

// Configuración
const width = 10;
const height = 20;
let board = createBoard(width, height);

let currentPiece = randomPiece(width);
let nextPieces = [randomPiece(width), randomPiece(width), randomPiece(width)];
let holdPiece = null;
let canHold = true;

let combo = 0;
let score = 0;
let level = 1;
let linesCleared = 0;
let speed = 500;

// HUD
function drawHUD() {
  console.log(chalk.green(`Score: ${score}   Level: ${level}   Lines: ${linesCleared}`));

  process.stdout.write(chalk.blue("Hold: "));
  if (holdPiece) {
    console.log(holdPiece.type);
  } else {
    console.log("empty");
  }

  process.stdout.write(chalk.magenta("Next: "));
  console.log(nextPieces.map(p => p.type).join(" | "));
}

// Ghost piece
function getGhostY() {
  let ghostY = currentPiece.y;
  while (!collides(board, currentPiece.x, ghostY+1, currentPiece.shape, width, height)) {
    ghostY++;
  }
  return ghostY;
}

// Clear lines con puntuación avanzada
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

    // puntuación avanzada según número de líneas
    if (cleared === 1) score += 100;
    else if (cleared === 2) score += 300;
    else if (cleared === 3) score += 500;
    else if (cleared >= 4) {
      score += 800;
      console.log(chalk.redBright("💥 TETRIS!"));
    }

    // combos: cada limpieza consecutiva suma bonus
    combo++;
    score += combo * 50; // bonus progresivo
    console.log(chalk.yellow(`Combo x${combo}! +${combo*50} puntos`));

    // subir nivel
    if (linesCleared >= level * 5) {
      level++;
      speed = Math.max(100, speed - 50);
      restartInterval();
      console.log(chalk.greenBright(`Nivel ${level} alcanzado!`));
    }
  } else {
    combo = 0; // se rompe el combo si no limpias nada
  }
}

// Loop principal
function tick() {
  if (!collides(board, currentPiece.x, currentPiece.y+1, currentPiece.shape, width, height)) {
    currentPiece.y++;
  } else {
    placePiece(board, currentPiece);
    clearLines();
    currentPiece = nextPieces.shift();
    nextPieces.push(randomPiece(width));
    canHold = true;
    if (collides(board, currentPiece.x, currentPiece.y, currentPiece.shape, width, height)) {
      console.log(chalk.red("GAME OVER"));
      process.exit();
    }
  }
  drawBoard(board, currentPiece, getGhostY(), width, height, drawHUD);
}

// Controles
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "a" && !collides(board, currentPiece.x-1, currentPiece.y, currentPiece.shape, width, height)) currentPiece.x--;
  if (key.name === "d" && !collides(board, currentPiece.x+1, currentPiece.y, currentPiece.shape, width, height)) currentPiece.x++;
  if (key.name === "s" && !collides(board, currentPiece.x, currentPiece.y+1, currentPiece.shape, width, height)) currentPiece.y++;
  if (key.name === "w") rotatePiece();
  if (key.name === "h") holdCurrentPiece();
  if (key.name === "space") hardDrop();   // 👈 nuevo
  if (key.ctrl && key.name === "c") process.exit();
  drawBoard(board, currentPiece, getGhostY(), width, height, drawHUD);
});

// Hard Drop
function hardDrop() {
  const ghostY = getGhostY();
  currentPiece.y = ghostY;
  placePiece(board, currentPiece);
  clearLines();
  currentPiece = nextPieces.shift();
  nextPieces.push(randomPiece(width));
  canHold = true;
  if (collides(board, currentPiece.x, currentPiece.y, currentPiece.shape, width, height)) {
    console.log(chalk.red("GAME OVER"));
    process.exit();
  }
}

// Rotación
function rotatePiece() {
  const shape = currentPiece.shape;
  const rotated = shape[0].map((_, i) =>
    shape.map(row => row[i]).reverse()
  );
  if (!collides(board, currentPiece.x, currentPiece.y, rotated, width, height)) {
    currentPiece.shape = rotated;
  }
}

// Hold
function holdCurrentPiece() {
  if (!canHold) return;
  if (!holdPiece) {
    holdPiece = currentPiece;
    currentPiece = nextPieces.shift();
    nextPieces.push(randomPiece(width));
  } else {
    [holdPiece, currentPiece] = [currentPiece, holdPiece];
    currentPiece.x = Math.floor(width/2)-2;
    currentPiece.y = 0;
  }
  canHold = false;
}

// Intervalo
let interval = setInterval(tick, speed);

function restartInterval() {
  clearInterval(interval);
  interval = setInterval(tick, speed);
}

// Inicia
drawBoard(board, currentPiece, getGhostY(), width, height, drawHUD);
