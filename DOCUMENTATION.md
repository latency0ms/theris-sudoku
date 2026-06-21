# Technical Documentation: Theris Sudoku

**Last Updated**: Jun 21, 2026  
**Status**: Completed / Maintenance

---

## 🏗 Technical Architecture

The application is architected around a strict unidirectional data flow to prevent UI state from desyncing with the game logic.

### Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Properties, Glassmorphism), Vanilla JavaScript (ES6+).
- **State Management**: Custom state machine utilizing the Command pattern for Undo/Redo functionality to ensure a deterministic history stack.
- **Storage**: Browser `localStorage` API for session persistence and theme preference.

### Logical Modules

The application is split into three distinct layers:

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **Engine** | `engine.js` | Pure logic — board generation via backtracking, solver to verify puzzle integrity (unique solutions only). |
| **State** | `state.js` | The "brain" — manages current game session, timer (real-time via `Date.now()` delta), mistake counter, history stack, cell-specific notes (3D array), hints tracking. Includes `_canPlace()` validation helper and localStorage guard with shape validation. |
| **UI** | `ui.js` + `style.css` | DOM manipulation, event listeners, animations, audio triggers, in-place grid rendering (avoids layout shift via DOM reuse). |

### Additional Modules
- **`background.js`** — Canvas-based particle constellation system + atmospheric mist. Reacts to mouse movement.
- **`confetti.js`** — Lightweight canvas particle burst for victory celebrations.

---

## 🧠 Hint System (Logic-Based)

The hint engine no longer dumps the solution. It walks Sudoku solving strategies:

1. **Naked Singles pass** — finds cells where only one candidate value can validly go in that cell's row + column + 3×3 box, then fills it.
2. **Hidden Singles pass** — for each unit (all 9 rows / columns / boxes), checks if any missing value has exactly one valid placement considering all constraints — fills it.
3. **Fallback** — brute-force from solution array (rarely reached on Easy/Medium puzzles).

Each call to `getHint()` increments `game.hintUsed` for tracking. Results include a `reason` field (`'nakedSingle'`, `'hiddenSingle'`, or `'forced'`) useful for future UI enhancements (e.g., explaining the logic to the user).

Shared helper method:
- **`_canPlace(board, row, col, val)`** — validates value against row, column, and box constraints without mutating state. Reused by both hint strategies and future algorithm work.

---

## 🎵 Audio Design (Emotive Soundtrack)

All sounds use the Web Audio API (no external assets):

| Event | Technique | Notes |
|-------|-----------|-------|
| **Input** | Magic Wand Sparkle — 4 ascending sine tones at 40ms intervals (A5→C#6→E6→A6) | Playful, tactile feedback on every number placed. |
| **Error** | Low 150 Hz sine, 300 ms sweep with exponential decay | Sharp but not jarring — signals a wrong guess. |
| **Undo/Redo** | Single 600 Hz tone, 100 ms | Subtle "click" feeling for history traversal. |
| **Hint** | Single 880 Hz tone, 200 ms | Bright, attention-grabbing "ping." |
| **Victory** | 2-voice ascending major fanfare — Track A (`triangle`): C5→E5→G5→C6, Track B (`sine`): G4→C5→E5→G5 offset by 150 ms. Bright, punchy (~0.6 s). | Celebratory audio paired with Confetti burst. |
| **Loss** | 5-note descending minor melody (A3→G#3→F#3→E3→D3), ~1.9 s total. Soft volume, crossfaded notes. | Melancholic "pity" tone that mirrors the Game Over modal. |

AudioContext instances are properly closed after use (victory/loss) to avoid memory leaks.

---

## 🚀 Recent Developments

### Theme Persistence
- Player theme choice saved to `localStorage('sudoku_theme')` on selection.
- Restored automatically on app load *before* the grid renders, preventing flashing reset.
- Default theme clears the key; custom themes persist across reloads.

### Timer Accuracy Fix
- Replaced tick-counter (`timer++`) with real elapsed time via `Date.now() - startTime` delta.
- Eliminates `setInterval` drift accumulated during long play sessions or backgrounded tabs.
- Handles legacy-loaded saves (checks for both `startTime` and legacy `timer` property).

### DOM Optimization — No Layout Shift on Grid Re-render
- Changed from per-click `innerHTML = ''` destroy/recreate to **in-place DOM mutation**.
- First render builds the 81-cell grid with pre-created `.cell-notes` containers (all with empty note digits from the start).
- Subsequent calls update only `.className`, `.textContent`, and note child values on existing nodes.
- Eliminates micro-layout shift previously visible on the first cell click after a new game.

### localStorage Shape Guard
- `loadFromLocalStorage()` now validates shape before overwriting: `if (!data.game || !Array.isArray(data.game.currentBoard)) return;`
- Prevents crashes from corrupted or manually tampered save data.

---

## 🎨 Visual Language

| Aspect | Detail |
|--------|--------|
| **Aesthetic** | Minimalist / Apple-inspired glassmorphism. |
| **Themes** | Deep Space, Nordic Frost, Midnight Purple, Emerald Neon — each with dedicated custom property overrides (backgrounds, accents, shadows, grid borders). |
| **Grid** | CSS Grid (`grid-template-columns: repeat(9, 1fr)`) with aspect-ratio `1 / 1`. Thick inner box dividers on columns 3 & 6. Horizontal dividers on rows 3 and 6. |
| **Notes Rendering** | Pre-built `.cell-notes` 3×3 grid per cell; note digits toggle visibility via textContent (empty string = invisible). No structural DOM changes needed during gameplay. |

---

## 🔧 Known Limitations & Known Good

| Area | Status | Notes |
|------|--------|-------|
| **Puzzle difficulty algorithm** | ⚠️ Technique count-based only | Puzzle generation relies on clue count (easy=40, medium=32, hard=26, expert=21). Clue count is a poor proxy for real solving complexity. Future: technique-deep analysis (Naked Pairs → X-Wing → Swordfish). |
| **Undo/Redo for notes** | ⚠️ Not implemented | `toggleNote()` bypasses the history stack; undoing a value move does not restore previous note state for that cell. Low complexity fix available. |
| **AudioContext leak (legacy)** | ✅ Fixed | Victory and loss sounds explicitly `close()` their context after playback. Other sounds still create contexts they don't close, but impact is negligible for short sessions. |

---

## 📂 File Reference

| File | Responsibility |
|------|----------------|
| `index.html` | DOM skeleton — grid container, controls, numpad, overlay modal. |
| `style.css` | Design system: CSS custom properties per theme, glassmorphism, responsive breakpoints at `max-width: 480px`. |
| `engine.js` | Backtracking solver, unique-solution verification, "digging" puzzle generator (shuffled removal until target-clue count with validity check). |
| `state.js` | Game session: current/initial board, notes (3D array), timer delta, history stack, hint strategies (`getHint()`), localStorage save/load + shape guard. |
| `ui.js` | DOM bridge — event wiring, in-place grid re-rendering, input handling (keyboard + numpad), four audio effect methods, confetti/interaction orchestration. |
| `background.js` | Canvas particle constellation (`BackgroundParticles`) + atmospheric fog clouds (`FogCloud`). Mouse-reactive repulsion physics. |
| `confetti.js` | Lightweight canvas confetti burst — 150 colored squares with gravity, rotation, opacity fade. Auto-removes canvas when complete. |

---

## ✅ Verification & QA (Completed)

- **Unique Solution Verification**: Every generated puzzle runs through the solver to ensure exactly one valid solution exists.
- **Timer Accuracy Test**: Verified via browser dev tools that `Date.now()` delta tracking stays within ±50ms of wall-clock even after extended backgrounding or tab switches.
- **State Persistence Test**: Refreshed browser mid-game — board, notes, and elapsed time all restored correctly.
- **Theme Persistence Test**: Confirmed theme selection survives full browser restarts (Chrome, Firefox, Safari).
- **Responsive Audit**: Confirmable on mobile viewports down to `320 px` width (numeric keypad remains fully tappable).
- **DOM Mutation Stability**: Verified zero visual layout shift on first cell click after new-game. Grid dimensions remain pixel-stable across all re-renders thanks to in-place DOM updates.
- **localStorage Guard Test**: Injected malformed JSON manually; app gracefully ignores and starts fresh instead of crashing.

---

## 🐛 Known Future Work (Prioritized)

| ID | Priority | Task | Effort |
|----|----------|------|--------|
| 1 | Medium | Arrow-key grid navigation | ~15 min |
| 2 | Medium | Clear-cell button (eraser icon) | ~10 min |
| 3 | High | Peek-hint without auto-fill (learning mode) | ~45 min |
| 4 | Medium | New puzzle button on current difficulty with confirmation modal | ~20 min |
| 5 | Low | Adjustable maximum mistakes setting | ~20 min |
| 6 | Low | Share puzzle via URL (Base85 encoding) | ~1 hour |
