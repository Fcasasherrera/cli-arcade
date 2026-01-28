import readline from 'readline';
import { colors } from './pieces.js';
import chalk from 'chalk';

export function drawBoard(board, currentPiece, ghostY, width, height, hudFn) {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  hudFn(); // dibuja HUD

  console.log("-".repeat(width*2));

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      let bg = (x+y) % 2 === 0 ? chalk.bgBlack : chalk.bgGray;

      if (isPieceCell(currentPiece, x, y)) {
        row += bg(colors[currentPiece.type]("██"));
      } else if (isGhostCell(currentPiece, x, y, ghostY)) {
        row += bg(chalk.white("░░"));
      } else {
        row += board[y][x] === " " 
          ? bg("  ") 
          : bg(colors[board[y][x]]("██"));
      }
    }
    console.log(row);
  }
}

function isPieceCell(piece, x, y) {
  const shape = piece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx] &&
          x === piece.x + dx &&
          y === piece.y + dy) {
        return true;
      }
    }
  }
  return false;
}

function isGhostCell(piece, x, y, ghostY) {
  const shape = piece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx] &&
          x === piece.x + dx &&
          y === ghostY + dy) {
        return true;
      }
    }
  }
  return false;
}
