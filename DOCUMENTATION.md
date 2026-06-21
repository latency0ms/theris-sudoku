# 🧩 Theris Sudoku Documentation

## 🌟 Overview
Theris Sudoku is a modern, web-based Sudoku application featuring procedural puzzle generation, multiple difficulty levels, various themes, and native Web Audio feedback. It provides a polished user experience with features like undo/redo, note mode, and hi-fidelity audio effects generated entirely via the Web Audio API.

## 🏗️ Technical Architecture

The project follows a modular architecture where concerns are separated into three main layers:
1.  **⚙️ Engine layer (`engine.js`)**: Handles the mathematical logic of Sudoku (generation, solving, validation).
2.  **💾 State layer (`state.js`)**: Manages the game state, including the current board, move history, notes, and persistence via `localStorage`.
3.  **🎨 UI layer (`ui.js`)**: Orchestrates the DOM, handles user interactions (click, keyboard), and manages visual/audio feedback.

### 🧩 Core Modules

#### 1. SudokuEngine (`engine.js`)
The engine is responsible for all "pure" logic:
- **✅ Validation**: `isValid(board, row, col, num)` checks if a move complies with Sudoga rules (row, column, and $3 \times 3$ box constraints).
- **🔍 Solving**: Uses a backtracking algorithm (`solve`) to determine if a board state is validly solvable.
- **✨ Uniqueness Check**: `countSolutions` ensures that every generated puzzle has exactly one unique solution.
- **🎲 Generation**: 
    - `generateSolvedBoard`: Creates a completed, valid $9 \times 9$ grid.
    - `generatePuzzle(difficulty)`: Removes numbers from a solved board based on the requested difficulty (`easy`, `medium`, `hard`, `expert`) while maintaining puzzle uniqueness.

#### 2. SudokuState (`state.js`)
The state manager maintains the "truth" of the current session:
- **📊 Game Data**: Stores the `puzzle` (initial clues), `solved` (answer key), `currentBoard` (user progress), and `notes` (pencil marks).
- **⏪ Move History**: Implements a stack-based Undo/Redo system for player moves.
- **⚖️ Game Rules Enforcement**: Tracks mistakes (limit of 3) and handles win/loss conditions.
- **💡 Hint System**: Implements advanced solving strategies:
    - **🎯 Naked Singles**: Finds cells where only one number is possible.
    - **🕵️ Hidden Singles**: Finds numbers that can only be placed in one specific cell within a unit (row, column, or box).
- **📁 Persistence**: `saveToLocalStorage` and `loadFromLocalStorage` allow players to resume games across sessions.

#### 3. SudokuUI (`ui.js`)
The UI layer bridges the logic with the user's browser:
- **🖱️ Event Handling**: Listens for mouse clicks on the grid, keypad interaction, and keyboard shortcuts (e.g., `1-9` for numbers, `Backspace` to clear, `N` for note mode, `Ctrl+Z` for undo).
- **🖼️ Dynamic Rendering**: Efficiently updates the DOM grid, handles cell highlighting (related cells/same values), and renders "notes" within empty cells.
- **🌈 Theme Management**: Handles switching between visual themes (`default`, `nordic`, `midnight`, `emerald`) by manipulating CSS data attributes.
- **🎵 Audio Engine**: Uses the Web Audio API to synthesize sounds procedurally:
    - **🎉 Win/Loss Fanfares**: Complex arpeggios using oscillators and gain envelopes.
    - **🔔 Action Feedback**: Short, high-pitched "sparkles" for inputs and low-frequency tones for errors.

## 🎮 Game Features

| Feature | Description |
| :--- | :--- |
| **📈 Difficulty Levels** | `Easy` (40 clues), `Medium` (32), `Hard` (26), `Expert` (21). |
| **✏️ Note Mode** | Allows placing small "pencil" numbers in cells to track candidates. |
| **🎭 Themes** | Four visually distinct color palettes to suit user preference. |
| **⏪ Undo/Redo** | Full history of moves allows players to correct mistakes. |
| **📱 Responsive Design** | Optimized for both desktop (keyboard) and touch/click interactions. |

## 🛠️ Implementation Details

### 🔊 Audio Synthesis
Instead of large external MP3 assets, the app uses `AudioContext` to synthesize sound on-the-fly. This keeps the application lightweight and extremely fast-loading. It utilizes:
- **🌊 Oscillators**: Sine and Triangle waves for different timbres.
- **📉 Gain Envelopes**: Smooth attack/release curves to prevent clicking and create "musical" sensations.

### 💎 Puzzle Uniqueness
To ensure a high-quality experience, the generator never produces an ambiguous puzzle. After removing a number, it runs `countSolutions`. If more than one solution is found, the removal is reverted, ensuring every player faces exactly one correct path to victory.

## 📂 Files Reference
- `index.html`: 📄 Main entry point and DOM structure.
- `style.css`: 🎨 Visual styling and theme definitions.
- `engine.js`: ⚙️ The core mathematical logic.
- `state.js`: 💾 Game lifecycle and state management.
- `ui.js`: 🖥️ User interface and interaction layer.
- `background.js`: 🌌 Animated canvas background implementation.
- `confetti.js`: 🎉 Visual celebration effect for wins.
