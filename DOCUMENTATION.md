# Technical Documentation: Minimalist Sudoku

**Last Updated**: Thu Jun 18 2026
**Status**: Completed / Maintenance

## 🏗 Technical Architecture

The application is architected around a strict unidirectional data flow to prevent UI state from desyncing with the game logic.

### Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+).
- **State Management**: Custom state machine utilizing the Command pattern for Undo/Redo functionality to ensure a deterministic history stack.
- **Storage**: Browser `localStorage` API for session persistence.

### Logical Modules
The application is split into three distinct layers:
1.  **Engine Layer (`engine.js`)**: Pure logic. Handles board generation via backtracking and solvers to verify puzzle integrity (ensuring unique solutions).
2.  **State Layer (`state.js`)**: The a "Brain." Manages the current game session, timer, mistake counter, history stack, and cell-specific notes (3D array). It acts as the single source of truth.
3.  **UI Layer (`ui.js` & `style.css`)**: DOM manipulation. Handles event listeners, animations, audio triggers, and responsive rendering.

### Note Mode Implementation
Note Mode allows users to mark candidate numbers in a cell without committing to a value.
- **Data Structure**: Stored as a 3D array `notes[row][col][values]` within the state object.
- **Activation**: Toggled via the `#note-toggle` button, which modifies the `UI.noteMode` boolean.
- **Persistence**: Notes are saved/loaded alongside the game board in `localStorage` to maintain progress across sessions.

### Visual Language
- **Aesthetic**: Minimalist / Apple-inspired.
- **Visual Cues**: 
    - Glassmorphism for overlays using `backdrop-filter`.
    - Soft shadows and rounded corners (`12px+`) to create depth.
    - High contrast accent colors for active selections to guide focus.
- **Interactions**: Springy CSS transitions (cubic-bezier), haptic-like audio feedback, and a dynamic canvas-based confetti burst upon successful puzzle completion.

## 📂 File Reference

| File | Technical Responsibility |
| :--- | :--- |
| `index.html` | Main entry point; defines the DOM skeleton for the grid and controls. |
| `style.css` | Design system, CSS Grid layout for the board, and responsive breakpoints. |
| `engine.js` | Implementation of Sudoku solving and "digging" generation algorithms. |
| `state.js` | State machine logic, Command pattern implementation, and LocalStorage proxy. |
| `ui.js` | Event binding, DOM updating functions, and interaction orchestration. |
| `background.js` | Canvas-based particle system and atmospheric mist effects. |
| `confetti.js` | Lightweight canvas-based particle system for victory celebrations. |

## ✅ Verification & QA (Completed)
- **Unique Solution Verification**: Every generated puzzle is passed through the solver to ensure only one solution exists.
- **State Persistence Test**: Verified that refreshing the browser recovers the exact board state and timer value via LocalStorage.
- **Responsiveness Audit**: Confirmed numeric keypad accessibility across varied viewport heights on mobile devices.
