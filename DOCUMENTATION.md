# Project Documentation: Minimalist Sudoku

**Last Updated**: Thu Jun 18 2026
**Status**: Initiation / Planning Phase

## 📖 Overview
Minimalist Sudoku is a modern, browser-based puzzle application designed with an "Apple-style" aesthetic. It focuses on simplicity, high usability, and responsiveness, providing a premium feel through minimalist design and smooth interactions.

## 🎯 Key Features
- **Classic Sudoku Gameplay**: Full $9\times9$ grid implementation.
- **Dynamic Difficulty**: Four levels of difficulty (Easy, Medium, Hard, Expert) with guaranteed unique solutions.
- **Pro Player UX**: a "Cell $\rightarrow$ Number" input flow with comprehensive highlighting for rows, columns, blocks, and matching numbers.
- **Quality of Life Tools**: 
    - **Undo/Redo**: Full history traversal of player moves.
    - **Hints**: Intelligent assistance based on the pre-calculated solution.
    - **Persistence**: Automatic game saving via `localStorage`.
- **Responsive Design**: A mobile-first approach ensuring a seamless experience from desktops to smartphones.

## 🛠 Technical Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+).
- **State Management**: Custom state machine utilizing the Command pattern for Undo/Redo functionality.
- **Storage**: Browser `localStorage` API.

### Logical Modules
The application is split into three distinct layers to ensure maintainability:
1.  **Engine Layer (`engine.js`)**: Pure logic. Handles board generation via backtracking and solvers to verify puzzle integrity.
2.  **State Layer (`state.js`)**: The "Brain." Manages the current game session, timer, mistake counter, and history stack.
3.  **UI Layer (`ui.js` & `style.css`)**: DOM manipulation. Handles event listeners, animations, audio triggers, and responsive rendering.

## 🎨 Design Specification
- **Aesthetic**: Minimalist / Apple-inspired.
- **Visual Cues**: 
    - Glassmorphism for overlays.
    - Soft shadows and rounded corners (`12px+`).
    - High contrast accent colors for active selections.
- **Interactions**: Springy CSS transitions and haptic-like audio feedback.

## 🚀 Getting Started
Since this is a purely client-side application, no installation is required.
1. Open `index.html` in any modern web browser.
2. Select a difficulty level to start.

## 📂 File Structure
- `index.html`: The main entry point and layout structure.
- `style.css`: Design system and responsive layouts.
- `engine.js`: Sudoku generation and solving algorithms.
- `state.js`: Game state, undo/redo logic, and persistence.
- `ui.js`: DOM bridging and user interaction handlers.
