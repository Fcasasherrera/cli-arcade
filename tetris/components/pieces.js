import chalk from 'chalk';

export const tetrominos = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[1,0],[1,0],[1,1]],
  J: [[0,1],[0,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]]
};

export const colors = {
  I: chalk.cyan,
  O: chalk.yellow,
  T: chalk.magenta,
  L: chalk.blue,
  J: chalk.green,
  S: chalk.red,
  Z: chalk.white
};

export function randomPiece(width) {
  const keys = Object.keys(tetrominos);
  const type = keys[Math.floor(Math.random() * keys.length)];
  const shape = tetrominos[type];
  return { type, shape, x: Math.floor(width/2)-2, y: 0 };
}
