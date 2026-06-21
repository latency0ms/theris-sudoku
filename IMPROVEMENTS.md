# 🛠️ Theris Sudoku - Engineering Roadmap & Optimization Log

This document tracks the evolution, optimization, and feature expansion of the Theris Sudoku engine. It serves as both a historical record of completed fixes and a strategic blueprint for technical excellence.

---

## ✅ Completed Milestones (The Foundation)

### Phase 1: Critical Bug Fixes
*Resolved structural and rendering regressions to ensure baseline stability.*

- [x] **DOM Integrity**: Eliminated redundant `</header>` tags in `index.html`.
- [x] **CSS Optimization**: Refactored `.cell-notes` and `.note-digit` selectors, standardizing on `var(--accent-color)` for cross-theme consistency.
- [x] **Geometric Precision**: Corrected vertical box-border logic, replacing fragile `:nth-child(3n)` with precise `9n+3`/`9n+6` selectors to eliminate edge thickness doubling.

### Phase 2b: User Experience Enhancements
*Implemented high-impact features for immediate usability improvement.*

- [x] **Persistent Aesthetic**: Integrated `localStorage` synchronization for user theme preferences (`sudoku_theme`).
- [x] **Temporal Precision**: Refactored the timer architecture from an interval-driven counter to a real-time `Date.now()` delta, ensuring zero drift during tab switching or backgrounding.

---



## 🚀 Active Refactoring (Phase 2: Code Integrity)

*Focus: Reducing technical debt and enhancing algorithmic efficiency.*

- [ ] **2.1 Logic De-duplication**: Extract a generic helper in `engine.js` to refactor the highly redundant `findHiddenSingle` logic, reducing codebase footprint by ~60%.
- [ ] **2.3 Constant Standardization**: Replace all magic number literals (e.g., `9`, `3`, `81`) with descriptive global constants (`BOARD_SIZE`, `BOX_SIZE`).
- [ ] **2.4 Schema Validation**: Implement a robust shape-validation guard in `state.js` to prevent application crashes caused by corrupted or outdated `localStorage` payloads.
- [ ] **2.5 Configuration Centralization**: Decouple difficulty clue counts from the generator and migrate them into a centralized, immutable `Config` object.
- [ ] **2.6 Algorithmic Optimization**: Integrate **Constraint Propagation (AC-3)** within the solver to accelerate pruning during high-complexity puzzle generation.

---

## 🎮 UX Evolution (Phase 3: User Interaction)

*Focus: Minimizing friction and maximizing professional input flow.*

- [ ] **3.1 Keyboard Mastering**: Implement `ArrowKey` navigation handlers in `ui.js`, allowing seamless cell traversal and wrapping at grid boundaries.
- [ 
  ] **3.2 Eradication of Redundancy**: Add a dedicated "Clear Cell" utility button to the control dashboard for easier mobile/touch interaction.
- [ ] **3.4 The "Peek" Capability**: Develop a non-mutating hint variant that utilizes `analyzeHint()` to provide logical explanations without altering the `currentBoard`.
- [ ] **3.5 One-Click Regeneration**: Implement a "New Game" action that generates a fresh puzzle at the *currently selected* difficulty level without requiring menu navigation.

---

## 🧩 Domain Mastery (Phase 4: Algorithmic Depth)

*Focus: Elevating gameplay from arbitrary clue counting to true logic-based challenges.*

- [ ] **4.1 Technique-Based Classification**: Re-engineer the difficulty engine to classify puzzles based on required solving depth (e.g., Naked Singles $\rightarrow$ X-Wing $\rightarrow$ Chaining).
- [ ] **4.2 Adaptive Error Tolerance**: Replace the hardcoded `MAX_MISTAKES` with an adjustable user preference (3, 5, 10, or Unlimited).
- [ ] **4.3 Predictive UI**: Implement a "Possible Moves" overlay that highlights valid candidates for a selected empty cell based on real-time constraint checks.
- [ ] **4.4 Visual Error Distinction**: Enhance the CSS error state to visually differentiate between "clue conflicts" and "user errors" using distinct border treatments.

---

## ✨ Final Polish (Phase 5: Performance & Reach)

*Focus: Optimizing for broad device compatibility and social connectivity.*

- [ ] **5.1 Social Connectivity**: Implement a "Share Puzzle" feature via URL encoding (Base85), allowing users to distribute unique board states via clipboard.
- [ ] **5.2 Particle Engine Optimization**: Refactor `background.js` using spatial bucketing to mitigate $O(n^2)$ complexity during particle collision/interaction checks.
- [ ] **5.3 Comprehensive Analytics**: Integrate a persistent statistics engine to track best times and hint usage per difficulty level in `localStorage`.
- [ ] **5.4 Power-User Toolbox**: Implement a keyboard shortcut reference overlay (triggered by `?`) for advanced desktop users.

---

**Total Estimated Effort Remaining: ~12–18 hours of engineering.**
