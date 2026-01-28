#!/usr/bin/env node
// file: chess-ai.js

const chalk = require("chalk");
const { Chess } = require("chess.js");
const path = require("path");
const loadEngine = require("./loadEngine.js");
const { Select } = require("enquirer");

const game = new Chess();

const pieceIcons = {
  w: { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" },
  b: { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" }
};

function drawBoard() {
  console.clear();
  console.log(chalk.bgMagenta.white.bold("\n♔ CLI Chess vs AI ♚\n"));
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    let row = chalk.bgBlack.white(`${8 - i} `);
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      const bg = (i + j) % 2 === 0 ? chalk.bgGray : chalk.bgWhite;
      const piece = square ? pieceIcons[square.color][square.type] : "  "; // más ancho
      row += bg.black(` ${piece} `); // casilla más grande
    }
    console.log(row);
    console.log(row); // duplicar línea para hacerlo más alto
  }
  console.log(chalk.bgBlack.white("    a   b   c   d   e   f   g   h\n"));
  console.log(chalk.yellow(`Turn: ${game.turn() === "w" ? "White" : "Black"}`));
}

function startGame(movetime) {
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const engine = loadEngine(require.resolve("stockfish/src/stockfish-17.1-8e4d048.js"));

  function aiTurn() {
    engine.send("position fen " + game.fen());
    engine.send(`go movetime ${movetime}`, (msg) => {
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

  // Inicialización del motor
  engine.send("uci", () => {
    engine.send("isready", () => {
      drawBoard();
      askMove();
    });
  });
}

// --- Menú de dificultad ---
const prompt = new Select({
  name: "level",
  message: "Choose AI level",
  choices: ["Level 1", "Level 2", "Level 3", "Boss Mode"]
});

prompt.run()
  .then(answer => {
    console.log(chalk.cyan(`🎮 Selected difficulty: ${answer}`));

    const movetime = {
      "Level 1": 300,
      "Level 2": 800,
      "Level 3": 1500,
      "Boss Mode": 3000
    }[answer];

    // arrancar juego después de elegir nivel
    startGame(movetime);
  })
  .catch(console.error);
