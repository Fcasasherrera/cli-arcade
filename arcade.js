#!/usr/bin/env node
// archivo: arcade.js

const readline = require("readline");
const chalk = require("chalk");
const figlet = require("figlet");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Dibujar título retro
console.clear();
console.log(chalk.green(figlet.textSync("CLI ARCADE", { horizontalLayout: "full" })));
console.log(chalk.yellow("Bienvenido Fernando ⚡ a tu Arcade en la terminal!\n"));

// Opciones de juegos
const juegos = [
  { id: 1, nombre: "Snake 🐍", script: "./snake/start.js" },
  { id: 2, nombre: "Chess 💀", script: "./chess/start.js" },
  { id: 3, nombre: "Tetris 🧩", script: "./tetris/start.js" },
  { id: 4, nombre: "Salir 🚪", script: null }
];

// Mostrar menú
function mostrarMenu() {
  console.log(chalk.cyan("Selecciona un juego:\n"));
  juegos.forEach(j => {
    console.log(`${j.id}. ${j.nombre}`);
  });
  rl.question("\nTu elección: ", (respuesta) => {
    const opcion = parseInt(respuesta, 10);
    const juego = juegos.find(j => j.id === opcion);

    if (!juego) {
      console.log(chalk.red("❌ Opción inválida."));
      return mostrarMenu();
    }

    if (juego.script) {
      console.log(chalk.green(`\n🎮 Iniciando ${juego.nombre}...\n`));
      console.clear();
      rl.close();
      require("child_process").spawn("node", [juego.script], { stdio: "inherit" });
    } else {
      console.log(chalk.magenta("👋 Gracias por jugar, hasta la próxima!"));
      console.clear();
      rl.close();
    }
  });
}

mostrarMenu();
