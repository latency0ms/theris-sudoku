/**
 * engine.js - Core Sudoku Logic
 * Handles puzzle generation, solving and validation.
 */

class SudokuEngine {
    constructor() {
        this.size = 9;
        this.boxSize = 3;
    }

    /**
     * Checks if it's valid to place a number in a cell
     */
    isValid(board, row, col, num) {
        for (let i = 0; i < this.size; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }

        const startRow = row - (row % this.boxSize);
        const startCol = col - (col % this.boxSize);
        for (let i = 0; i < this.boxSize; i++) {
            for (let j = 0; j < this.boxSize; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    /**
     * Solves the board using backtracking.
     * Returns true if solvable, false otherwise.
     */
    solve(board) {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.solve(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Counts number of solutions to check for uniqueness.
     */
    countSolutions(board, limit = 2) {
        let count = 0;
        const solveAndCount = (b) => {
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    if (b[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (this.isValid(b, row, col, num)) {
                                b[row][col] = num;
                                solveAndCount(b);
                                b[row][col] = 0;
                                if (count >= limit) return;
                            }
                        }
                        return;
                    }
                }
            }
            count++;
        };

        // Copy board to avoid mutating original during count
        const boardCopy = board.map(row => [...row]);
        solveAndCount(boardCopy);
        return count;
    }

    /**
     * Generates a fully solved valid Sudoku board
     */
    generateSolvedBoard() {
        const board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.fillBoard(board);
        return board;
    }

    fillBoard(board) {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (board[row][col] === 0) {
                    const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of nums) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.fillBoard(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Generates a puzzle by removing numbers from a solved board
     * @param {string} difficulty - 'easy', 'medium', 'hard', 'expert'
     */
    generatePuzzle(difficulty = 'medium') {
        const solved = this.generateSolvedBoard();
        const puzzle = solved.map(row => [...row]);

        const cluesMap = {
            'easy': 40,
            'medium': 32,
            'hard': 26,
            'expert': 21
        };
        const targetClues = cluesMap[difficulty] || 32;
        let currentClues = 81;

        const cells = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) cells.push({r, c});
        }
        this.shuffle(cells);

        for (let cell of cells) {
            if (currentClues <= targetClues) break;

            const tempVal = puzzle[cell.r][cell.c];
            puzzle[cell.r][cell.c] = 0;

            if (this.countSolutions(puzzle) !== 1) {
                puzzle[cell.r][cell.c] = tempVal;
            } else {
                currentClues--;
            }
        }

        return { puzzle, solved };
    }
}

// Export for use in other modules
window.SudokuEngine = SudokuEngine;
