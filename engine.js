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
     * Find a logical hint for the board based on simplest logic first.
     * Priority: Naked Singles -> Hidden Singles.
     */
    findLogicalHint(board) {
        // 1. Check for Naked Singles (A cell that can only be one number)
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (board[r][c] === 0) {
                    const candidates = [];
                    for (let n = 1; n <= 9; n++) {
                        if (this.isValid(board, r, c, n)) candidates.push(n);
                    }
                    if (candidates.length === 1) {
                        return {
                            type: 'naked',
                            row: r, col: c, val: candidates[0],
                            msg: `Cell at Row ${r + 1}, Col ${c + 1} can only contain the number ${candidates[0]}.`
                        };
                    }
                }
            }
        }

        // 2. Check for Hidden Singles (A number that can only fit in one cell of a row/col/box)
        for (let n = 1; n <= 9; n++) {
            // Rows
            for (let r = 0; r < this.size; r++) {
                const possibleCols = [];
                for (let c = 0; c < this.size; c++) {
                    if (board[r][c] === 0 && this.isValid(board, r, c, n)) possibleCols.push(c);
                }
                if (possibleCols.length === 1) {
                    return {
                        type: 'hidden_row',
                        row: r, col: possibleCols[0], val: n,
                        msg: `In Row ${r + 1}, the number ${n} can only fit in one position.`
                    };
                }
            }

            // Columns
            for (let c = 0; c < this.size; c++) {
                const possibleRows = [];
                for (let r = 0; r < this.size; r++) {
                    if (board[r][c] === 0 && this.isValid(board, r, c, n)) possibleRows.push(r);
                }
                if (possibleRows.length === 1) {
                    return {
                        type: 'hidden_col',
                        row: possibleRows[0], col: c, val: n,
                        msg: `In Column ${c + 1}, the number ${n} can only fit in one position.`
                    };
                }
            }

            // Boxes
            for (let b = 0; b < 9; b++) {
                const boxRowStart = Math.floor(b / 3) * 3;
                const boxColStart = (b % 3) * 3;
                const possibleCells = [];
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        const currR = boxRowStart + r;
                        const currC = boxColStart + c;
                        if (board[currR][currC] === 0 && this.isValid(board, currR, currC, n)) {
                            possibleCells.push({r: currR, c: currC});
                        }
                    }
                }
                if (possibleCells.length === 1) {
                    return {
                        type: 'hidden_box',
                        row: possibleCells[0].r, col: possibleCells[0].c, val: n,
                        msg: `In the current 3x3 block, the number ${n} has only one position.`
                    };
                }
            }
        }
        return null;
    }

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

window.SudokuEngine = SudokuEngine;
