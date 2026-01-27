#!/usr/bin/env node
// file: chess-ai.js

const readline = require("readline");
const chalk = require("chalk");
const { Chess } = require("chess.js");
const path = require("path");
const loadEngine = require("./loadEngine.js");

const engine = loadEngine(require.resolve("stockfish/src/stockfish-17.1-8e4d048.js"));
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const game = new Chess();

const pieceIcons = {
  w: { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" },
  b: { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" }
};

function drawBoard() {
  console.clear();
  console.log(chalk.green("\n♔ CLI Chess vs AI ♚\n"));
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    let row = "";
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      row += square ? pieceIcons[square.color][square.type] + " " : chalk.gray("· ");
    }
    console.log(8 - i + " " + row);
  }
  console.log("  a b c d e f g h\n");
  console.log(chalk.yellow(`Turn: ${game.turn() === "w" ? "White" : "Black"}`));
}

function aiTurn() {
  engine.send("position fen " + game.fen());
  engine.send("go movetime 2000", (msg) => {
    const parts = msg.split(" ");
    const aiMove = parts[1];
    if (aiMove) {
      game.move(aiMove, { sloppy: true });
      console.log(chalk.red(`🤖 AI plays: ${aiMove}`));
      drawBoard();
      askMove();
    }
  });
}

function askMove() {
  if (game.isGameOver()) {
    console.log(chalk.magenta("👋 Game over!"));
    rl.close();
    engine.quit();
    return;
  }

  rl.question("Enter your move (e.g. e2e4, q to quit): ", (input) => {
    if (input.toLowerCase() === "q") {
      console.log(chalk.magenta("👋 Game ended."));
      rl.close();
      engine.quit();
      return;
    }

    const normalized = input.replace(/\s+/g, "");
    let move;

    try {
      move = game.move(normalized, { sloppy: true });
    } catch (err) {
      console.log(chalk.red(`❌ Illegal move: ${normalized}`));
      return askMove();
    }

    if (!move) {
      console.log(chalk.red(`❌ Illegal move: ${normalized}`));
      return askMove();
    }

    drawBoard();
    aiTurn();
  });
}


// --- Inicialización correcta ---
engine.send("uci", (msg) => {
  console.log("uciok:", msg);
  engine.send("isready", (msg) => {
    drawBoard();
    askMove();
  });
});
