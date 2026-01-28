# ♔ CLI Chess vs Stockfish ♚

A colorful, text‑based chess game in your terminal. Play against the powerful Stockfish engine, choose difficulty levels, and enjoy a retro‑styled board right from the command line.

---

## ✨ Features
- 🎮 **Play vs AI** powered by Stockfish.
- 🖼️ **Colored ASCII board** with Unicode chess pieces.
- 🧩 **Difficulty menu** using `enquirer` (Level 1 → Boss Mode).
- ✅ **Move validation** with `chess.js` (illegal moves are rejected gracefully).
- ♟️ **Supports castling, en passant, and promotions.**
- 🔄 **Game over detection** (checkmate, stalemate, draw).
- 🚀 Runs entirely in Node.js, no GUI required.

---

## 📦 Installation
Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/cli-chess.git
cd cli-chess
npm install
```

## ▶️ Usage
Run the game:
```
```bash
node chess-ai.js
```
    - Use arrow keys to select difficulty.

    - Enter moves in UCI notation (e2e4, g1f3) or SAN (O-O, O-O-O).

    - Type q to quit.

## 🎨 Controls & Notation

    - Castling: O-O (short), O-O-O (long) or e1g1, e1c1, e8g8, e8c8.

    - Promotion: e7e8q promotes pawn to queen.

    - Quit: q.

## 🛠️ Tech Stack
    - Node.js

    - chess.js for rules & validation

    - Stockfish for AI

    - chalk for colors

    - enquirer for interactive menus

## 🚧 Roadmap
    - [ ] Add move history & PGN export

    - [ ] Show captured pieces

    - [ ] Add timers (blitz mode)

    - [ ] Puzzle / training mode

    - [ ] Online play via Lichess API

## 📜 License

MIT License. Free to use, modify, and share.