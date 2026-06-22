/**
 * ui.js - User Interface Bridge
 * Connects the SudokuEngine and SudokuState to the DOM.
 */

class SudokuUI {
    constructor() {
        this.engine = new SudokuEngine();
        this.state = new SudokuState(this.engine);
        
        this.selectedCell = null; // {row, col}
        this.noteMode = false; // Toggle for note entry
        
        // Shared AudioContext to prevent browser throttling
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // DOM Elements
        this.gridEl = document.getElementById('sudoku-grid');
        this.timerEl = document.getElementById('timer');
        this.overlayEl = document.getElementById('overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMsg = document.getElementById('modal-msg');

        this.init();
    }

    init() {
        // Restore saved theme
        const savedTheme = localStorage.getItem('sudoku_theme');
        if (savedTheme) this.setTheme(savedTheme);

        // Theme selection active state
        document.querySelectorAll('.btn-theme').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === savedTheme || (!savedTheme && btn.dataset.theme === 'default'));
        });

        // Start a fresh game on load (no persistence)
        this.startNewGame('medium');

        this.setupEventListeners();
    }

    /**
     * Starts a new game with selected difficulty
     */
    startNewGame(difficulty) {
        this.selectedCell = null; // Reset selection for new game
        this.state.newGame(difficulty);
        this.renderGrid();
        this.updateTimerDisplay();
        this.overlayEl.classList.add('hidden');
    }

    setTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    setupEventListeners() {
        // Theme Selection
        document.querySelectorAll('.btn-theme').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
                if (theme === 'default') {
                    localStorage.removeItem('sudoku_theme');
                } else {
                    localStorage.setItem('sudoku_theme', theme);
                }
                
                document.querySelectorAll('.btn-theme').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Difficulty Selection
        document.querySelectorAll('.btn-diff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.startNewGame(e.target.dataset.diff);
            });
        });

        // Numeric Keypad
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = parseInt(btn.dataset.val);
                this.handleInput(val);
            });
        });

        // Action Buttons
        document.getElementById('undo-btn').addEventListener('click', () => {
            if (this.state.undo()) this.renderGrid();
            this.playAudio('undo');
        });
        document.getElementById('redo-btn').addEventListener('click', () => {
            if (this.state.redo()) this.renderGrid();
            this.playAudio('redo');
        });
        document.getElementById('hint-btn').addEventListener('click', () => {
            if (this.state.getHint()) {
                this.renderGrid();
                this.playAudio('hint');
            }
        });

        document.getElementById('note-toggle').addEventListener('click', (e) => {
            this.noteMode = !this.noteMode;
            e.target.classList.toggle('active', this.noteMode);
            this.playAudio('input');
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (this.selectedCell) {
                const { row, col } = this.selectedCell;
                this.handleInput(0);  // Clear the cell by setting it to 0
                this.playAudio('input');
            }
        });

        // Restart Button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startNewGame(this.state.game.difficulty);
        });



        // Keyboard Support
        window.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.handleInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.handleInput(0);
            } else if (e.key.toLowerCase() === 'n') {
                // Keyboard shortcut to toggle Note Mode
                const btn = document.getElementById('note-toggle');
                this.noteMode = !this.noteMode;
                btn.classList.toggle('active', this.noteMode);
                this.playAudio('input');
            } else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                if (this.state.undo()) this.renderGrid();
            }
        });

        // Start timer loop for UI update
        setInterval(() => this.updateTimerDisplay(), 1000);
    }

    handleInput(val) {
        if (!this.selectedCell) return;
        const { row, col } = this.selectedCell;

        if (this.noteMode && val !== 0) {
            if (this.state.toggleNote(row, col, val)) {
                this.renderGrid();
                this.playAudio('input');
            }
            return;
        }

        const success = this.state.setCell(row, col, val);
        if (success) {
            if (val !== 0 && val !== this.state.game.solved[row][col]) {
                this.playAudio('error');
                this.triggerErrorAnimation(row, col);
            } else {
                this.playAudio('input');
            }
            this.renderGrid();
        }

        if (this.state.game.status === 'won') this.showGameOver(true);
        if (this.state.game.status === 'lost') this.showGameOver(false);
    }

    renderGrid() {
        if (!this.state || !this.state.game || !this.state.game.currentBoard) {
            console.error('Game state not initialized');
            return;
        }

        this.gridEl.innerHTML = '';
        const board = this.state.game.currentBoard;
        const initial = this.state.game.initialBoard;

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (initial[r][c] !== 0) cell.classList.add('initial');
                else if (board[r][c] !== 0) cell.classList.add('user-input');

                const val = board[r][c];
                if (val === 0) {
                    // Render Notes if cell is empty
                    const notesContainer = document.createElement('div');
                    notesContainer.className = 'cell-notes';

                    for (let n = 1; n <= 9; n++) {
                        const noteDigit = document.createElement('div');
                        noteDigit.className = 'note-digit';
                        const hasNote = this.state.game.notes[r][c].includes(n);
                        noteDigit.textContent = hasNote ? n : '';
                        notesContainer.appendChild(noteDigit);
                    }
                    cell.appendChild(notesContainer);
                } else {
                    cell.textContent = val;
                }

                // Selection & Highlighting logic
                if (this.selectedCell && this.selectedCell.row === r && this.selectedCell.col === c) {
                    cell.classList.add('selected');
                } else if (this.selectedCell) {
                    const { row, col } = this.selectedCell;
                    const cellVal = board[r][c];
                    if (row === r || col === c || 
                        (Math.floor(row/3) === Math.floor(r/3) && Math.floor(col/3) === Math.floor(c/3))) {
                        cell.classList.add('highlight');
                    }
                    if (cellVal !== 0 && cellVal === board[row][col]) {
                        cell.classList.add('highlight');
                    }
                }

                cell.addEventListener('click', () => this.selectCell(r, c));
                this.gridEl.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        this.selectedCell = { row, col };
        this.renderGrid();
    }

    updateTimerDisplay() {
        if (this.state.game.startTime) {
            const elapsed = Math.floor((Date.now() - this.state.game.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            this.timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        } else {
            this.timerEl.textContent = this.state.formatTime();
        }
    }

    triggerErrorAnimation(row, col) {
        // Use a small delay to ensure render updates first if needed’
        setTimeout(() => {
            const cells = document.querySelectorAll('.cell');
            const idx = row * 9 + col;
            cells[idx].classList.add('error');
            setTimeout(() => cells[idx].classList.remove('error'), 400);
        }, 10);
    }

    showGameOver(won) {
        if (won) {
            Confetti.shoot();
            this.playCheeringSound();
        } else {
            this.playSadSound();
        }
        this.modalTitle.textContent = won ? 'Puzzle Solved!' : 'Game Over';
        this.modalMsg.textContent = won 
            ? `Great job! Time: ${this.state.formatTime()}` 
            : 'You made too many mistakes.';
        this.overlayEl.classList.remove('hidden');
    }

    /**
     * Plays a 5-note descending minor-scale melody to convey "pity" on loss.
     * Designed same audio pipeline as existing sounds — no external assets needed.
     */
    playSadSound() {
        const now = this.audioCtx.currentTime;

        const melody = [220, 196, 175, 165, 147]; // A3 → G#3 → F#3 → E3 → D3

        melody.forEach((freq, i) => {
            const start = now + i * 0.4;
            const dur = 0.38;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.04);     // attack
            gain.gain.exponentialRampToValueAtTime(0.008, start + dur); // release into silence

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(start);
            osc.stop(start + dur + 0.01);
        });

        // No need to close context - we're using a shared one
    }

    /**
     * Plays a bright, ascending major-scale fanfare to celebrate winning.
     * Uses two overlapping arpeggios for richness — same Web Audio pipeline.
     */
    playCheeringSound() {
        const now = this.audioCtx.currentTime;

        // Two overlapping major-scale arpeggio patterns
        // Pattern A: higher voice (C5 → E5 → G5 → C6 pattern)
        const patA = [523, 659, 784, 1047];
        // Pattern B: lower harmonizing voice (G4 → C5 → E5 → G5 pattern)
        const patB = [392, 523, 659, 784];

        [patA, patB].forEach((pattern, track) => {
            pattern.forEach((freq, i) => {
                const start = now + i * 0.15;
                const dur = 0.25;

                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                // Alternate between sine and triangle for timbre variety
                osc.type = track === 0 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, start);

                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.08, start + 0.03);     // attack
                gain.gain.setValueAtTime(0.06, start + dur - 0.05);        // sustain hold
                gain.gain.exponentialRampToValueAtTime(0.003, start + dur); // release

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(start);
                osc.stop(start + dur + 0.01);
            });
        });

        // No need to close context - we're using a shared one
    }

    /**
     * Simple Web Audio API beeps to avoid needing external mp3 files
     */
    playAudio(type) {
        const now = this.audioCtx.currentTime;

        if (type === 'input') {
            // Magic Wand Sparkle effect: Rapidly ascending high-pitched tones
            const notes = [880, 1108, 1318, 1760]; // A5 -> C#6 -> E6 -> A6
            notes.forEach((freq, i) => {
                const startOffset = i * 0.04; // Play notes every 40ms
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + startOffset);
                
                gain.gain.setValueAtTime(0, now + startOffset);
                gain.gain.linearRampToValueAtTime(0.1, now + startOffset + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, now + startOffset + 0.15);
                
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now + startOffset);
                osc.stop(now + startOffset + 0.15);
            });
        } else {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            if (type === 'error') {
                osc.frequency.setValueAtTime(150, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(); osc.stop(now + 0.3);
            } else if (type === 'undo' || type === 'redo') {
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(); osc.stop(now + 0.1);
            } else if (type === 'hint') {
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(); osc.stop(now + 0.2);
            }
        }
    }
}

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    new SudokuUI();
});
