export function createBoard(width, height) {
  return Array.from({ length: height }, () => Array(width).fill(" "));
}

export function collides(board, px, py, shape, width, height) {
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

export function placePiece(board, piece) {
  const shape = piece.shape;
  for (let dy = 0; dy < shape.length; dy++) {
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (shape[dy][dx]) {
        board[piece.y + dy][piece.x + dx] = piece.type;
      }
    }
  }
}
