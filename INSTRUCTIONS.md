# Implementation Instructions: Minimalist Sudoku App

This document provides a step-by-step guide to implementing the Minimalist Sudoku application. The goal is to build a high-quality, responsive browser-based app with an Apple-style aesthetic.

## Phase 1: Core Sudoku Engine (`engine.js`)
Objective: Build a standalone logic module that handles puzzle generation and solving without any DOM dependencies.

### 1.1 The Solver
- Implement a backtracking algorithm to solve a given $9\times9$ grid.
- Ensure the solver can determine if a puzzle has a unique solution (essential for valid puzzle generation).

### 1.2 The Generator
- Create a function to generate a fully solved board.
- Implement the "digging" process: selectively remove numbers while ensuring the puzzle remains solvable and has exactly one unique solution.

### 1.3 Difficulty Management
- Define clue counts for each level:
    - **Easy**: ~40+ clues
    - **Medium**: ~30-39 clues
    - **Hard**: ~25-29 clues
    - **Expert**: <25 clues
- Ensure the generator adheres to these constraints.

---

## Phase 2: Game State & Logic Manager (`state.js`)
Objective: Manage the active session, user input, and game rules.

### 2.1 State Tracking
- Maintain a state object containing: `initialBoard`, `currentBoard`, `solvedBoard`, `mistakes`, and `timer`.
- Implement `localStorage` synchronization to save and load the current game automatically.

### 2.2 Undo/Redo System
- Implement a history stack. Every user input should be pushed onto the stack.
- Provide `undo()` and `redo()` methods to traverse this stack.

### 2.3 Hint Logic
- Implement a `getHint()` function that fills a selected empty cell with the correct value from the `solvedBoard`.

---

## Phase 3: UI Skeleton & Layout (`index.html`, `style.css`)
Objective: Build a responsive, minimalist structure.

### 3.1 HTML Structure
- Create a container for the $9\times9$ grid.
- Add a dedicated Numeric Keypad (1-9) and utility buttons (Undo, Redo, Hint).
- Implement a difficulty selector and a timer display.

### 3.2 CSS Grid Layout
- Use `display: grid` for the Sudoku board.
- Ensure the layout is fluid; use `rem` or `vh/vw` units to ensure it fits on mobile screens without scrolling.
- Design the "Apple Style": high whitespace, rounded corners, and subtle shadows.

---

## Phase 4: Interaction & UX (`ui.js`)
Objective: Connect the engine and state manager to the DOM.

### 4.1 Input Flow (Cell $\rightarrow$ Number)
- Implement cell selection logic. When a cell is selected:
    - Highlight the active row, column, and $3\times3$ subgrid.
    - Highlight all other cells on the board containing the same number.
- Bind the numeric keypad and keyboard events to update the state and re-render the cell.

### 4.2 Visual Feedback & Animations
- Add a CSS animation (shake) for incorrect entries.
- Implement smooth transitions for cell selection highlights.
- Create a "victory" overlay with a minimalist celebration effect.

### 4.3 Audio Integration
- Integrate soft audio cues for:
    - Valid input (pop).
    - Error (low tone).
    - Game win (chime).

---

## Phase 5: Polishing & QA
- **Cross-Browser Testing**: Ensure consistency across Chrome, Safari, and Firefox.
- **Mobile Audit**: Verify that the numeric keypad is ergonomically placed for thumb usage on mobile devices.
- **Edge Case Check**: Test "impossible" scenarios (e.g., clicking hint on a filled cell).
