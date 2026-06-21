/**
 * state.js - Game State & Logic Manager
 * Handles current session, move history, hints, and localStorage.
 */

class SudokuState {
    constructor(engine) {
        this.engine = engine;
        this.game = {
            puzzle: [],
            solved: [],
            currentBoard: [],
            initialBoard: [], // To prevent editing starting numbers
            notes: [], // 3D array [row][col][note_values]
            mistakes: 0,
            hintUsed: 0,
            difficulty: 'medium',
            status: 'playing', // 'playing', 'won', 'lost'
        };
        this.history = [];
        this.redoStack = [];
        this.game.startTime = null;
    }

    /**
     * Completely wipes the game state and localStorage to start from scratch
     */
    startFromScratch(difficulty = 'medium') {
        localStorage.removeItem('sudoku_save');
        this.history = [];
        this.redoStack = [];
        this.newGame(difficulty);
    }

    /**
     * Resets only the current board to its initial clues without generating a new puzzle
     */
    resetCurrentBoard() {
        this.game.currentBoard = this.game.initialBoard.map(row => [...row]);
        this.game.mistakes = 0;
        this.game.status = 'playing';
        this.history = [];
        this.redoStack = [];
    }

    /**
     * Starts a new game with the specified difficulty
     */
    newGame(difficulty = 'medium') {
        const { puzzle, solved } = this.engine.generatePuzzle(difficulty);
        
        this.game.puzzle = puzzle;
        this.game.solved = solved;
        this.game.initialBoard = puzzle.map(row => [...row]);
        this.game.currentBoard = puzzle.map(row => [...row]);
        this.game.notes = Array.from({ length: 9 }, () => 
            Array.from({ length: 9 }, () => [])
        );
        this.game.difficulty = difficulty;
        this.game.mistakes = 0;
        this.game.status = 'playing';

        this.history = [];
        this.redoStack = [];

        this.startTimer();
    }

    /**
     * Toggles a number in the notes for a specific cell
     */
    toggleNote(row, col, val) {
        if (this.game.status !== 'playing') return false;
        if (this.game.initialBoard[row][col] !== 0) return false;

        const cellNotes = this.game.notes[row][col];
        const index = cellNotes.indexOf(val);

        if (index > -1) {
            cellNotes.splice(index, 1); // Remove if exists
        } else {
            cellNotes.push(val); // Add if doesn't exist
            cellNotes.sort(); // Keep sorted for display
        }
        return true;
    }

    /**
     * Sets a value in the current board
     */
    setCell(row, col, val) {
        if (this.game.status !== 'playing') return false;
        if (this.game.initialBoard[row][col] !== 0) return false; // Cannot change initial clues

        const prevVal = this.game.currentBoard[row][col];
        if (prevVal === val) return true;

        // Push to history for undo
        this.history.push({ row, col, prevVal, newVal: val });
        this.redoStack = []; // Clear redo on new move

        this.game.currentBoard[row][col] = val;

        if (val !== 0) {
            // Clear notes for this cell when a value is placed
            this.game.notes[row][col] = [];

            if (val !== this.game.solved[row][col]) {
                this.game.mistakes++;
                if (this.game.mistakes >= 3) {
                    this.game.status = 'lost';
                    this.stopTimer();
                }
            }
        }

        this.checkWinCondition();
        return true;
    }

    undo() {
        if (this.history.length === 0) return false;
        const move = this.history.pop();
        this.redoStack.push(move);
        this.game.currentBoard[move.row][move.col] = move.prevVal;
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;
        const move = this.redoStack.pop();
        this.history.push(move);
        this.game.currentBoard[move.row][move.col] = move.newVal;
        return true;
    }

    _canPlace(board, row, col, val) {
        const size = 9, boxSize = 3;
        const br = row - (row % boxSize), bc = col - (col % boxSize);

        // Row check
        for (let i = 0; i < size; i++) { if (board[row][i] === val) return false; }
        
        // Column check
        for (let i = 0; i < size; i++) { if (board[i][col] === val) return false; }
        
        // Box check
        for (let i = 0; i < boxSize; i++) {
            for (let j = 0; j < boxSize; j++) {
                if (board[br + i][bc + j] === val) return false;
            }
        }
        return true;
    }

    getHint() {
        if (this.game.status !== 'playing') return null;
        
        this.game.hintUsed++;
        const board = this.game.currentBoard;
        const size = 9;
        const boxSize = 3;

        // Strategy 1: Naked Singles — find cells where only one candidate remains
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] !== 0) continue;

                const candidates = [];
                for (let v = 1; v <= 9; v++) {
                    if (this._canPlace(board, r, c, v)) candidates.push(v);
                }

                if (candidates.length === 1) {
                    this.setCell(r, c, candidates[0]);
                    return { row: r, col: c, val: candidates[0], reason: 'nakedSingle' };
                }
            }
        }

        // Strategy 2: Hidden Singles — for each unit (row/col/box), find values that can only go in one place
        for (let u = 0; u < size * 3; u++) {
            const isRow = u < size;
            const isBox = u >= size * 2;
            
            let unitCells = [];
            if (isRow) {
                for (let k = 0; k < size; k++) unitCells.push({r: u, c: k});
            } else if (!isBox) {
                for (let k = 0; k < size; k++) unitCells.push({r: k, c: u - size});
            } else {
                const bx = u - size * 2;
                const br = bx % boxSize, bc = Math.floor(bx / boxSize);
                for (let i = 0; i < boxSize; i++) {
                    for (let j = 0; j < boxSize; j++) {
                        unitCells.push({r: bc * boxSize + i, c: br * boxSize + j});
                    }
                }
            }

            let regionVals = new Set();
            for (const cell of unitCells) {
                if (board[cell.r][cell.c] !== 0) regionVals.add(board[cell.r][cell.c]);
            }

            for (let val = 1; val <= size; val++) {
                if (regionVals.has(val)) continue;

                let validPlacements = [];
                for (const cell of unitCells) {
                    if (board[cell.r][cell.c] !== 0) continue;
                    if (this._canPlace(board, cell.r, cell.c, val)) validPlacements.push(cell);
                }

                if (validPlacements.length === 1) {
                    const p = validPlacements[0];
                    this.setCell(p.r, p.c, val);
                    return { row: p.r, col: p.c, val, reason: 'hiddenSingle' };
                }
            }
        }

        // Fallback: brute-force from solution (shouldn't normally be hit for Easy/Medium puzzles)
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) {
                    board[r][c] = this.game.solved[r][c];
                    return { row: r, col: c, val: this.game.solved[r][c], reason: 'forced' };
                }
            }
        }

        return null;
    }

    checkWinCondition() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.game.currentBoard[r][c] !== this.game.solved[r][c]) return;
            }
        }
        this.game.status = 'won';
        this.stopTimer();
    }

    startTimer() {
        this.stopTimer();
        this.game.startTime = Date.now();
    }

    stopTimer() {
        // Timer is now real-time, no interval to clear
    }

    formatTime() {
        let elapsed;
        if (this.game.startTime) {
            elapsed = Math.floor((Date.now() - this.game.startTime) / 1000);
        } else if (this.game.timer !== undefined) {
            // Legacy compat for loaded saves from before timer refactor
            elapsed = this.game.timer;
        } else {
            elapsed = 0;
        }
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('sudoku_save', JSON.stringify({
            game: this.game,
            history: this.history
        }));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('sudoku_save');
        if (saved) {
            const data = JSON.parse(saved);
            // Validate shape before overwriting state
            if (!data.game || !Array.isArray(data.game.currentBoard)) return;
            
            this.game = data.game;
            this.history = data.history;
            if (this.game.status === 'playing') this.startTimer();
        }
    }
}

window.SudokuState = SudokuState;
