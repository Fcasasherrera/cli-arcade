#!/usr/bin/env node
// file: chess.js

const readline = require("readline");
const chalk = require("chalk");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initial board setup
let board = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  [" "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "],
  [" "," "," "," "," "," "," "," "],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let turn = "white"; // alternates between "white" and "black"

function drawBoard() {
  console.clear();
  console.log(chalk.green("\n♔ CLI Chess ♚\n"));
  for (let i = 0; i < 8; i++) {
    let row = "";
    for (let j = 0; j < 8; j++) {
      row += board[i][j] + " ";
    }
    console.log(8 - i + " " + row);
  }
  console.log("  a b c d e f g h\n");
  console.log(chalk.yellow(`Turn: ${turn}`));
}

function parseMove(move) {
  const [from, to] = move.split(" ");
  if (!from || !to) return null;

  const fromCol = from.charCodeAt(0) - "a".charCodeAt(0);
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - "a".charCodeAt(0);
  const toRow = 8 - parseInt(to[1]);

  if (
    fromCol < 0 || fromCol > 7 || toCol < 0 || toCol > 7 ||
    fromRow < 0 || fromRow > 7 || toRow < 0 || toRow > 7
  ) return null;

  return { fromRow, fromCol, toRow, toCol };
}

// Basic move validation for pawns and rooks
function isLegalMove(piece, fromRow, fromCol, toRow, toCol) {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  switch (piece) {
    // White pawn
    case "♙":
      if (fromRow === 6 && dy === -2 && dx === 0 && board[toRow][toCol] === " ") return true; // double step
      if (dy === -1 && dx === 0 && board[toRow][toCol] === " ") return true; // single step
      if (dy === -1 && Math.abs(dx) === 1 && board[toRow][toCol] !== " ") return true; // capture
      return false;

    // Black pawn
    case "♟":
      if (fromRow === 1 && dy === 2 && dx === 0 && board[toRow][toCol] === " ") return true;
      if (dy === 1 && dx === 0 && board[toRow][toCol] === " ") return true;
      if (dy === 1 && Math.abs(dx) === 1 && board[toRow][toCol] !== " ") return true;
      return false;

    // Rooks
    case "♖":
    case "♜":
      if (dx !== 0 && dy !== 0) return false; // must move straight
      // check path is clear
      if (dx === 0) {
        const step = dy > 0 ? 1 : -1;
        for (let r = fromRow + step; r !== toRow; r += step) {
          if (board[r][fromCol] !== " ") return false;
        }
      } else {
        const step = dx > 0 ? 1 : -1;
        for (let c = fromCol + step; c !== toCol; c += step) {
          if (board[fromRow][c] !== " ") return false;
        }
      }
      return true;

    default:
      // Other pieces not yet implemented
      return true;
  }
}

function askMove() {
  rl.question("Enter your move (e.g. e2 e4, q to quit): ", (input) => {
    if (input.toLowerCase() === "q") {
      console.log(chalk.magenta("👋 Game ended."));
      rl.close();
      return;
    }

    const move = parseMove(input);
    if (!move) {
      console.log(chalk.red("❌ Invalid move format."));
      return askMove();
    }

    const { fromRow, fromCol, toRow, toCol } = move;
    const piece = board[fromRow][fromCol];

    if (piece === " ") {
      console.log(chalk.red("❌ No piece at the source square."));
      return askMove();
    }

    if (!isLegalMove(piece, fromRow, fromCol, toRow, toCol)) {
      console.log(chalk.red("❌ Illegal move for that piece."));
      return askMove();
    }

    // Move piece
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = " ";

    // Alternate turn
    turn = turn === "white" ? "black" : "white";

    drawBoard();
    askMove();
  });
}

drawBoard();
askMove();
