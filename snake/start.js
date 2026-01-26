#!/usr/bin/env node
// archivo: snake.js

const readline = require("readline");
const chalk = require("chalk");
const figlet = require("figlet");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const width = 20;
const height = 10;
let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food = { x: 10, y: 5 };
let score = 0;
let gameOver = false;

// Dibujar título retro
console.clear();
console.log(chalk.green(figlet.textSync("SNAKE", { horizontalLayout: "full" })));
console.log(chalk.yellow("Usa WASD para mover. Q para salir.\n"));

function draw() {
  console.clear();
  console.log(chalk.green(figlet.textSync("SNAKE", { horizontalLayout: "full" })));
  console.log(chalk.cyan(`Score: ${score}\n`));

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      if (snake.some(seg => seg.x === x && seg.y === y)) {
        row += chalk.green("■"); // cuerpo de la serpiente
      } else if (food.x === x && food.y === y) {
        row += chalk.red("●"); // comida
      } else {
        row += chalk.gray("·"); // fondo
      }
    }
    console.log(row);
  }
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // colisiones
  if (
    head.x < 0 || head.x >= width ||
    head.y < 0 || head.y >= height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true;
    console.log(chalk.red("\n💀 Game Over!"));
    console.log(chalk.yellow(`Tu puntaje final: ${score}`));
    process.exit();
  }

  snake.unshift(head);

  // comer
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
  } else {
    snake.pop();
  }
}

function loop() {
  if (!gameOver) {
    update();
    draw();
  }
}

setInterval(loop, 200);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "q") {
    console.log(chalk.magenta("\n👋 Saliste del juego."));
    process.exit();
  }
  if (key.name === "w" && direction.y === 0) direction = { x: 0, y: -1 };
  if (key.name === "s" && direction.y === 0) direction = { x: 0, y: 1 };
  if (key.name === "a" && direction.x === 0) direction = { x: -1, y: 0 };
  if (key.name === "d" && direction.x === 0) direction = { x: 1, y: 0 };
});
