# Technical Documentation: Minimalist Sudoku

**Last Updated**: Thu Jun 18 2026
**Status**: Implementation Phase

## 🏗 Technical Architecture

The application is architected around a strict unidirectional data flow to prevent UI state from desyncing with the game logic.

### Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+).
- **State Management**: Custom state machine utilizing the Command pattern for Undo/Redo functionality to ensure a deterministic history stack.
- **Storage**: Browser `localStorage` API for session persistence.

### Logical Modules
The application is split into three distinct layers:
1.  **Engine Layer (`engine.js`)**: Pure logic. Handles board generation via backtracking and solvers to verify puzzle integrity (ensuring unique solutions).
2.  **State Layer (`state.js`)**: The "Brain." Manages the current game session, timer, mistake counter, and history stack. It acts as the single source of truth.
3.  **UI Layer (`ui.js` & `style.css`)**: DOM manipulation. Handles event listeners, animations, audio triggers, and responsive rendering.

## 🎨 Design Specification

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
| `confetti.js` | Lightweight canvas-based particle system for victory celebrations. |

## 🧪 Development & Testing (Planned)
- **Unique Solution Verification**: Every generated puzzle must be passed through the solver to ensure only one solution exists.
- **State Persistence Test**: Verify that refreshing the browser recovers the exact board state and timer value.
- **Responsiveness Audit**: Ensure the numeric keypad remains accessible on varied viewport heights.
