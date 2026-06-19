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
            timer: 0,
            difficulty: 'medium',
            status: 'playing' // 'playing', 'won', 'lost'
        };
        this.history = [];
        this.redoStack = [];
        this.timerInterval = null;
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
        this.game.timer = 0;
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
        this.game.timer = 0;
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

    getHint() {
        if (this.game.status !== 'playing') return null;
        
        // Find an empty cell to fill
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.game.currentBoard[r][c] === 0) {
                    const correctVal = this.game.solved[r][c];
                    this.setCell(r, c, correctVal);
                    return { row: r, col: c, val: correctVal };
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
        this.timerInterval = setInterval(() => {
            this.game.timer++;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    formatTime() {
        const mins = Math.floor(this.game.timer / 60);
        const secs = this.game.timer % 60;
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
            this.game = data.game;
            this.history = data.history;
            if (this.game.status === 'playing') this.startTimer();
        }
    }
}

window.SudokuState = SudokuState;
