# 🧩 Theris Sudoku

**A cinematic, minimalist puzzle experience designed for focus and elegance.**

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Client-Side](https://img.shields.io/badge/Client--Side-BrightGreen?style=for-the-badge)

Theris Sudoku is not just a puzzle game; it is a polished, browser-based application that marries classical logic with a premium "Apple-style" aesthetic. Built entirely with vanilla web technologies, it focuses on high usability, responsiveness, and a calming atmosphere to provide a distraction-free gaming experience.

---

## ✨ Key Features

### 🎮 Gameplay
- **Four Calibrated Difficulties**: Choose from Easy, Medium, Hard, or Expert. Every puzzle is mathematically guaranteed to have exactly one unique solution.
- **Professional Input Flow**: A seamless "Cell $\rightarrow$ Number" interaction model designed for efficiency and precision.
- **Smart Highlighting**: Instant visual cues for active rows, columns, $3\times3$ blocks, and matching numbers across the board.

### 🛠️ Pro Tools
- **Command-based Undo/Redo**: A robust history stack allowing you to traverse every move with confidence.
- **Intelligent Hints**: Stuck? Get precise assistance based on the pre-calculated solution without breaking your flow.
- **Note Mode**: Dedicated pencil-mark functionality for strategizing complex Expert puzzles.

### 🌌 Atmosphere & UX
- **Cinematic Visuals**: A dynamic background featuring an interactive particle constellation and a slowly drifting subtle mist effect.
- **Glassmorphism Design**: A modern UI utilizing backdrop filters, soft shadows, and rounded geometry.
- **Haptic-like Feedback**: Soft audio cues for inputs and errors, paired with springy CSS transitions.

---

## 🛠️ Technical Architecture

The project follows a strict three-layer separation of concerns to ensure maintainability and purity. For a deep dive into the implementation details, see [DOCUMENTATION.md](./DOCUMENTATION.md).

1.  **Engine Layer**: Core mathematical logic, backtracking solver, and puzzle generation.
2.  **State Layer**: Session management and Undo/Redo history.
3.  **UI Layer**: DOM bridging, animations, and responsive rendering.

---

## 🚀 Quick Start

No installation or build steps are required. This is a purely client-side application.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/theris-sudoku.git
   ```
2. **Launch the game:**
   Open `index.html` in any modern web browser (Chrome, Firefox, Safari, or Edge).

---

## 📂 Project Structure

| File | Responsibility |
| :--- | :--- |
| `index.html` | Main entry point and layout structure |
| `style.css` | Design system, glassmorphism, and responsive layouts |
| `engine.js` | Sudoku generation and backtracking solver algorithms |
| `state.js` | Game state management, undo/redo logic, and persistence |
| `ui.js` | DOM bridging and user interaction handlers |
| `background.js` | Canvas-based particle system and mist effects |

---

## ❤️ Dedication

This project is developed with love for **Theresa**. ❤️