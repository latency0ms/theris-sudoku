# 🧩 Theris Sudoku | Technical Documentation

## 📌 Introduction
Theris Sudoku is a high-fidelity, web-native Sudoku application engineered for a seamless and immersive user experience. The project combines algorithmic procedural generation with advanced Web Audio synthesis to provide a standalone, asset-light gaming environment. This documentation outlines the architectural design, engine specifications, and implementation strategies employed in the codebase.

---

## 📖 Table of Contents
- [🏗️ Architecture](#-architecture)
    - [System Design Principles](#system-design-principles)
    - [Data Flow Model](#data-flow-model)
- [🧩 Core Module Specification](#-core-module-specification)
    - [SudokuEngine (The Logic Layer)](#sudokuengine-the-logic-layer)
    - [SudokuState (The State Manager)](#sudokustate-the-state-manager)
    - [SudokuUI (The View Layer)](#sudokuui-the-view-layer)
- [🎮 Gameplay Mechanics & Features](#-gameplay-mechanics--features)
- [🛠️ Technical Implementation](#-technical-implementation)
    - [Procedural Audio Synthesis](#procedural-audio-synthesis)
    - [Algorithmic Puzzle Generation](#algorithmic-puzzle-generation)
- [💻 Technology Stack](#-technology-stack)
- [📂 Repository Structure](#-repository-structure)

---

## 🏗️ Architecture

### System Design Principles
The application is built upon the principle of **Separation of Concerns (SoC)**, partitioning the software into three distinct, decoupled layers:
1.  **Logic Layer**: Pure mathematical operations and constraints.
2.  **State Layer**: Management of mutable game data and session persistence.
3.  **View Layer**: DOM manipulation, user input handling, and sensory feedback.

### Data Flow Model
The application follows a unidirectional-inspired flow to ensure state integrity:
`User Input (Click/Key)` $\rightarrow$ `UI Event Handler` $\rightarrow$ `State Mutation (Apply Move)` $\rightarrow$ `Engine Validation (Check Constraints)` $\rightarrow$ `DOM Re-render & Audio Feedback`.

> [!NOTE]
> This loop ensures that the `SudokuEngine` remains a "pure" component, unaware of the DOM, making it highly testable and portable.

---

## 🧩 Core Module Specification

### SudokuEngine (The Logic Layer)
**File:** `engine.js`  
The Engine is responsible for the mathematical validity of the Sudoku grid. It operates without any dependency on the browser's DOM or the application state.

*   **Constraint Validation**: Implements $O(N)$ complexity checks for row, column, and $$\text{sub-grid} (3 \times 3)$$ constraints via `isValid()`.
*   **Backtracking Solver**: Utilizes a recursive backtracking algorithm to solve boards and validate solvability.
*   **Uniqueness Verification**: The `countSolutions()` method performs a depth-limited search to ensure that every generated puzzle contains exactly one unique solution, preventing ambiguous gameplay.

### SudokuState (The State Manager)
**File:** `state.js`  
Acts as the single source of truth for the active game session.

*   **Mutable State Management**: Tracks the current board, initial clues, player notes (pencil marks), and mistake counters.
*   **Command Pattern (Undo/Redo)**: Implements dual stacks (`history` and `redoStack`) to allow players to traverse through previous board states.
*   **Persistence Engine**: Interfaces with `localStorage` to serialize the game state, enabling seamless session recovery across browser refreshes.
*   **Heuristic Hint System**: Provides intelligent assistance using the **Naked Singles** and **Hidden Singles** algorithms.

### SudokuUI (The View Layer)
**File:** `ui.js`  
Handles the orchestration of the user interface and sensory engagement.

*   **Reactive Rendering**: Rebuilds the DOM grid dynamically based on state changes, managing cell highlighting for related rows/columns/boxes.
*   **Input Orchestration**: A unified interface for mouse clicks, touch interactions, and keyboard mapped inputs (e.g., `1-9`, `Backspace`, `N` for Note mode).
*   **Sensory Feedback Engine**: Integrates the Web Audio API to trigger procedural soundscapes during gameplay events.

---

## 🎮 Gameplay Mechanics & Features

| Feature | Technical Implementation | Impact on UX |
| :--- | :--- | :--- |
| **Difficulty Scaling** | Variable clue density (21 to 40 clues) | Tailored challenge levels for all players. |
| **Note Mode** | 3D-array based pencil marking system | Enables advanced strategic play (Candidate tracking). |

| **Theme Engine** | CSS Custom Properties (Variables) via `data-theme` | High visual customization without reloading assets. |
| **Error Handling** | Three-strike failure condition | Maintains tension and stakes during gameplay. |

---

## 🛠️ Technical Implementation

### Procedural Audio Synthesis
To maintain a zero-dependency, high-performance footprint, the application avoids external `.mp3` or `.wav` files. Instead, it utilizes the **Web Audio API** to synthesize sound waves in real-time:
*   **Oscillators**: `sine` and `triangle` waveforms are used to create distinct timbres for "Success" (high-pitched arpeggios) and "Error" (low-frequency pulses).
*   **ADSR Envelopes**: Manual implementation of Attack, Decay, Sustain, and Release via `GainNode` automation ensures smooth, professional audio transitions without "popping."

### Algorithmic Puzzle Generation
The generation pipeline follows a robust three-step process:
1.  **Seed Generation**: A fully populated $9 \times 9$ valid grid is generated using randomized backtracking.
2.  **Iterative Digging**: Numbers are removed from the completed grid based on target difficulty.
3.  **Uniqueness Pruning**: After each removal, `countSolutions()` is invoked. If a removal creates multiple possible solutions, the cell is immediately restored to its original value.

---

## 💻 Technology Stack
*   **Languages**: HTML5, CSS3 (Advanced Flexbox/Grid), ES6+ JavaScript (Modules, Classes).
*   **Web APIs**: Web Audio API (Synthesis), localStorage (Persistence), Canvas API (Background Animation).

---

## 📂 Repository Structure

| File | Role |
| :--- | :--- |
| `index.html` | Application Entry Point & DOM Blueprint. |
| `style.css` | Design System, Themes, and Layout. |
| `engine.js` | Algorithmic Core (Validation/Generation). |
| `state.js` | Session Management & Undo/Redo Logic. |
| `ui.js` | Interaction Layer & Audio Orchestration. |
| `background.js` | Procedural Background Animation (Canvas). |
| `confetti.js` | Visual Reward System (Particles). |

---
*Copyright © 2026 Theris Sudoku Project.*
