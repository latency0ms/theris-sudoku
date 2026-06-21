# 🧩 Theris Sudoku

**Play now: [Live Demo](https://latency0ms.github.io/theris-sudoku/)**

**A cinematic, minimalist puzzle experience designed for focus and elegance.**

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Client-Side](https://img.shields.io/badge/Client--Side-BrightGreen?style=for-the-badge&logoColor=black)

Theris Sudoku is a polished, browser-based logic game that marries classical puzzle design with a premium "Apple-style" aesthetic. Built entirely with vanilla web technologies — no frameworks, no build steps — it delivers high usability, real-time timer accuracy, and an immersive atmosphere for distraction-free gaming.

---

## ✨ Key Features

### 🎮 Gameplay
- **Four Calibrated Difficulties**: Easy, Medium, Hard, or Expert — each puzzle mathematically guaranteed to have exactly one unique solution via backtracking verification.
- **Professional Input Flow**: Seamless cell → number interaction model for efficiency and precision.
- **Smart Highlighting**: Active row/col/3×3 block emphasis plus matching-number highlighting across the board.

### 🛠️ Pro Tools
- **Logic-Based Hint Engine** — Walks Sudoku techniques (Naked Singles → Hidden Singles) before falling back to direct solution fill. Tracks hint count per game (`game.hintUsed`).
- **Undo/Redo**: Command-pattern history stack for full move traversal.
- **Note Mode**: Dedicated pencil-mark system for Expert puzzle strategy (3D array `notes[row][col][]` backend).
- **Persistent Theme Selection** — your preference (Deep Space, Nordic Frost, Midnight Purple, Emerald Neon) remembered across page reloads via `localStorage`.

### 🌌 Atmosphere & UX
- **Dynamic Particle Constellation** — interactive background with mouse-reactive physics + ambient mist layers.
- **Glassmorphism Design** — backdrop filters, soft shadows, rounded geometry, responsive breakpoints at `480 px`.
- **Emotive Soundtrack** (Web Audio API):
  - *Victory*: Two-voice ascending major fanfare (≈0.6 s) + Confetti burst.
  - *Loss*: Five-note descending minor melody — melancholic "pity" tone (≈1.9 s).
  - *Input / Error / Undo / Hint*: tactile micro-sfx on every action.
- **Zero Layout Shift** — in-place DOM mutation keeps grid pixel-stable across all re-renders.

---

---

## 🛠️ Technical Architecture

Strict three-layer separation of concerns. For a deep dive, see [DOCUMENTATION.md](./DOCUMENTATION.md).

1. **Engine Layer** (`engine.js`) — pure logic: backtracking solver, unique-solution checker, puzzle "digger."
2. **State Layer** (`state.js`) — session data, timer delta (real-time `Date.now()`), history stack, localStorage guard with shape validation.
3. **UI Layer** (`ui.js` + `style.css`) — event wiring, in-place grid rendering, DOM update orchestration.

---

## 🚀 Quick Start

No installation or build steps required. Purely client-side.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/theris-sudoku.git
   ```
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).

**Alternative**: Visit the [live demo](https://latency0ms.github.io/theris-sudoku/) directly.

---

## 📂 Project Structure

| File | Responsibility |
|------|----------------|
| `index.html` | DOM skeleton — grid container, controls area, numpad, overlay modal |
| `style.css` | Design system: CSS custom properties per theme, glassmorphism, responsive layout |
| `engine.js` | Sudoku generation and backtracking solver algorithms |
| `state.js` | Game state management, undo/redo, logic-based hints, localStorage persistence + guard |
| `ui.js` | DOM bridging, event handlers, in-place grid rendering, emotive sound effects |
| `background.js` | Canvas particle constellation + fog cloud atmospheric layer |
| `confetti.js` | Victory confetti burst (auto-cleaning canvas) |

---

## 💡 Design Philosophy

1. **Zero dependencies** — no npm, no bundlers, no runtime frameworks. If the browser has it, it runs.
2. **Emotional resonance** — audio isn't just feedback; it's storytelling. Victory and loss each have distinct melodies that frame the player's emotional arc.
3. **Perfection at micro scale** — grid stays pixel-stable on re-render; timer accuracy survives tab switching; theme preference persists unconditionally. These details separate a usable app from one that feels *polished*.

---

## ❤️ Dedication

This project is developed with love for **Theresa**. ❤️
