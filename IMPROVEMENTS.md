# Theris Sudoku - Improvement Plan

This document tracks all planned improvements for Theris Sudoku, organized by phase and priority. Each step includes checkboxes for tracking progress.

---

## Phase 1: Bug Fixes (Low Effort / High Priority)

All Phase 1 items complete. Applied fixes:

- [x] **1.1** Removed duplicate `</header>` tag from `index.html`
- [x] **1.3** Merged duplicate `.cell-notes` / `.note-digit` CSS blocks in `style.css` (also updated to use `var(--accent-color)` for cross-theme consistency)
- [x] **Layout fix** Corrected vertical box-border selectors from fragile `:nth-child(3n)` to precise `9n+3` / `9n+6` — outer grid edge no longer gets double-thick border

---

## Phase 2: Code Quality (Medium Effort / Refactor Only)

### 2.1 DRY `findHiddenSingle` Method
- **File:** `engine.js`
- **Lines:** 217–263
- **Details:** 45 lines of nearly identical copy-pasted logic for rows/cols/boxes. Extract a generic helper `getPossibleRegions(board, candidates, number, regionType)` that accepts the region type as input. Cuts code by ~60% while improving readability and testability.

### 2.2 ~~Clarify Dual Hint API~~ ✅ Done (Option A — merged into single logic-based getHint)
- [x] Replaced the trivial `getHint()` that just filled from the solution array with a proper two-strategy hint system:
  - **Strategy 1 — Naked Singles:** finds cells where only one candidate value is possible given row/col/box constraints, then places it.
  - **Strategy 2 — Hidden Singles:** for each unit (row/column/box), finds values that can only go in one empty cell within that unit's constraints, then places it.
  - **Fallback:** brute-force from solution array (rarely hit on Easy/Medium puzzles).
- No separate `getAdvancedHint()` or `peekHint()` existed in practice — there was only the original `getHint()`. Option A meant improving this single method, which is now complete.

### 2.3 Replace Magic Numbers with Named Constants
- **Files:** Scattered across `engine.js`, `state.js`, `ui.js`
- **Details:** Replace raw literals with descriptive names:
  ```javascript
  const BOARD_SIZE = 9;
  const BOX_SIZE = 3;
  const TOTAL_CELLS = 81;
  const MAX_MISTAKES = 3;
  const HINTS_MAX_DISTANCE = 150;
  // etc.
  ```

### 2.4 Guard Against Corrupted/Outdated localStorage State
- **File:** `state.js`
- **Lines:** 210–216
- **Details:** Add a shape validation check before assigning loaded data:
  ```javascript
  if (saved && saved.game && Array.isArray(saved.game.currentBoard)) { ... }
  else { /* fallback to fresh game */ }
  ```
- Prevents crashes from stale or manually corrupted saves.

### Phase 2 Checklist
```bash
- [ ] 2.1 DRY findHiddenSingle method
- [ ] 2.2 Clarify dual hint API (decision needed)
- [ ] 2.3 Replace magic numbers with named constants
- [ ] 2.4 Guard against corrupted localStorage state
```

---

## Phase 2b: Completed Enhancements

The following were implemented recently and are no longer pending:

- [x] **Theme persistence** (`ui.js`): Theme selection now saved to `localStorage('sudoku_theme')` and restored on load
- [x] **Timer accuracy** (`state.js` + `ui.js`): Replaced tick-counter with real elapsed time via `Date.now()` delta — no more interval drift

---

## Phase 3: UX & Usability (High Perceived-Impact)

### 3.1 Add Arrow-Key Grid Navigation
- **File:** `ui.js`
- **Lines:** 126–141 (keyboard listener)
- **Details:** Add handlers for `ArrowUp/Down/Left/Right` that move `selectedCell` to the adjacent row/column, wrapping at edges. Reuse existing highlight logic for the new selection so row/col/box highlighting still works correctly.

### 3.2 Dedicated "Clear Cell" Button
- **Files:** `index.html` (UI) + `ui.js:147–172` (logic)
- **Details:** Add a clear/eraser icon button next to the numpad ✕ for easier phone/mobile access. Enable right-click on grid cells as an alternative. Currently users must click ✕ or press Backspace which isn't obvious.

### 3.3 ~~Persist Theme Preference~~ ✅ Done
- [x] (Moved to Phase 2b — now complete)

### 3.4 Peek-Hint Without Auto-Fill
- **Files:** `engine.js:120–146` + new `ui.js` handler
- **Details:** Add a "Peek" hint variant that uses `analyzeHint()` to show the explanation message via `showHintMessage()` but does NOT call `setCell()`. Lets users learn logic without having their progress overwritten.

### 3.5 New Puzzle on Current Difficulty (Dedicated Button)
- **Files:** `index.html` + `ui.js`
- **Details:** Add a "New Game" button separate from the difficulty selector that:
  - Generates a fresh puzzle at the currently selected difficulty
  - Shows a confirmation modal if there's unsaved progress
  - Prevents accidental difficulty changes

### Phase 3 Checklist
```bash
- [ ] 3.1 Arrow-key grid navigation
- [ ] 3.2 Dedicated clear cell button
- [x] 3.3 ~~Persist theme preference~~ (moved to Phase 2b)
- [ ] 3.4 Peek-hint without auto-fill
- [ ] 3.5 New puzzle on current difficulty (dedicated button)
```

---

## Phase 4: Sudoku Domain Depth (Requires Algorithm Changes / Testing)

### 4.1 Difficulty Classification by Solving Technique
- **File:** `engine.js`
- **Details:** Current difficulty is purely based on clue count, which doesn't correlate with actual solving complexity. Implement technique-based classification:
  - "Easy" puzzles where all cells can be solved using only Naked Singles and Hidden Singles
  - "Medium" where naked pairs/cages are needed
  - "Hard" where X-Wing or Swordfish techniques are required
  - "Expert" where chaining/bifurcation is the only path

This matches how professional Sudoku apps classify difficulty and gives players what they expect rather than just arbitrary clue counts.

### 4.2 Adjustable Maximum Mistakes
- **Files:** `state.js` (maxMistakes config) + `ui.js` (settings UI)
- **Details:** Replace the hardcoded `MAX_MISTAKES = 3` with an adjustable setting: 3, 5, 10, or "Unlimited". Give players control over how penalty-hard their game is.

### 4.3 Show Possible Moves for Selected Cell
- **File:** `engine.js` (new method) + `ui.js` (rendering)
- **Details:** When a cell is selected and empty, show small dots/numbers indicating which values are valid (no conflicts in that row/col/box). Standard Sudoku app feature that helps users verify they won't place an illegal value before committing.

### 4.4 Better Same-Value Highlight for Error Cells
- **File:** `style.css` + `ui.js:226–228`
- **Details:** When showing same-number highlighting, distinguish between a matching clue cell AND a player's error cell with a distinct style (outlined border + red tint) so users don't confuse the two states visually.

### Phase 4 Checklist
```bash
- [ ] 4.1 Difficulty classification by solving technique
- [ ] 4.2 Adjustable maximum mistakes
- [ ] 4.3 Show possible moves for selected cell
- [ ] 4.4 Better same-value highlight for error cells
```

---

## Phase 5: Polish & Performance (Nice-to-Have / Defer if Needed)

### 5.1 Share Puzzle via URL
- **Details:** Encode the initial grid in standard format (base85 per standard Sudoku notation) and add a "Share" button that copies a URL to the clipboard. Users can share or generate specific puzzles with friends.

### 5.2 Optimize Background Particles Performance
- **File:** `background.js`
- **Details:** Replace O(n²) pairwise distance checks (100 particles = ~5,000 iterations/frame) with spatial bucketing. Add a "Reduced motion" setting on mobile for battery/performance savings.

### 5.3 Track and Display Game Statistics
- **Files:** `state.js` + new stats display in game-over modal
- **Details:** Store per-difficulty statistics (best time, games played, hints used) in localStorage. Show a small summary alongside the timer on the game-over screen.

### 5.4 Keyboard Shortcut Shortcut Reference
- **Details:** Pressing `?` shows an overlay listing all keyboard shortcuts: arrow navigation, N for notes, Ctrl+Z for undo, etc. Improves power-user adoption for desktop players.

### Phase 5 Checklist
```bash
- [ ] 5.1 Share puzzle via URL
- [ ] 5.2 Optimize background particles performance
- [ ] 5.3 Track and display game statistics
- [ ] 5.4 Keyboard shortcut reference overlay
```

---

## Effort Estimate

| Phase | Estimated Time | Priority | Notes | Status |
|-------|---------------|----------|-------|--------|
| Phase 1: Bug Fixes | ~30 min | Critical (now) | Zero risk, removes real bugs | ✅ Complete |
| Phase 2: Code Quality | ~1 hour | High (before features) | Pure refactor, no behavioral change | ⬜ Pending |
| Phase 2b: Recent Enhancements | ~15 min | Done | Theme persistence + timer accuracy | ✅ Complete |
| Phase 3: UX & Usability | 1–2 hours | High (biggest perceptual impact) | Improves daily gameplay flow |
| Phase 4: Sudoku Depth | 2–3 hours | Medium (needs testing) | Core algorithm changes require validation |
| Phase 5: Polish & Perf | 1–2 hours | Low/Easy-defer | Nice-to-have, won't block launch |

**Total all phases: ~6–9 hours of work.**

---

## Questions to Resolve Before Starting

1. **Hints (Phase 3.4):** Two-approach hints or one? Users who want to learn should see hint explanations without auto-filling. Those who want saving time need the fill. Which is more important for this project?
2. **Mistake Limit (Phase 4.2):** Adjustable via settings slider or keep at 3 as a hard design choice?
3. **Difficulty Algorithm (Phase 4.1):** Hybrid approach (clue count + technique depth) or purely technique-based?

---

## Status Legend

- [ ] Not started
- [x] Done
- [~] In progress
