// Game Configuration
const CONFIG = {
    CELL_SIZE: 4,
    GRID_SIZE: 25,
    CANVAS_SIZE: 100,
    TICK_INTERVAL: 150,
    INITIAL_LENGTH: 3
};

// Color Scheme - Retro vibrant style
const COLORS = {
    background: '#3D6B2E',
    snake: '#5CBF45',
    snakeHead: '#7EE868',
    food: '#FFE135',
    gameOverOverlay: 'rgba(41, 82, 227, 0.85)',
    gameOverText: '#FFE135'
};

// Direction Vectors
const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

// Opposite Directions (to prevent 180° turns)
const OPPOSITES = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
};

// Keyboard Mapping
const KEY_MAP = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
};

// Game State
const gameState = {
    snake: [],
    direction: 'right',
    nextDirection: 'right',
    food: { x: 0, y: 0 },
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0,
    gameOver: false,
    lastTick: 0,
    currentSpeed: 150  // Dynamic speed (starts at TICK_INTERVAL)
};

// Canvas Setup
const canvas = document.getElementById('game');
if (!canvas) {
    console.error('Canvas element not found!');
}
const ctx = canvas ? canvas.getContext('2d') : null;

// Utility Functions
function wrapCoordinate(value, max) {
    return ((value % max) + max) % max;
}

function isOnSnake(position) {
    return gameState.snake.some(segment => 
        segment.x === position.x && segment.y === position.y
    );
}

function checkSelfCollision(head) {
    return gameState.snake.slice(1).some(segment => 
        segment.x === head.x && segment.y === head.y
    );
}

function generateFood() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
            y: Math.floor(Math.random() * CONFIG.GRID_SIZE)
        };
    } while (isOnSnake(position));
    return position;
}

// Rendering Functions
function drawCell(x, y, color) {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(
        x * CONFIG.CELL_SIZE,
        y * CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE
    );
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = gameState.score;
    
    // Update high score if current score is higher
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
    document.getElementById('high-score').textContent = gameState.highScore;
}

// Audio Functions
let audioContext = null;

function playEatSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.warn('Audio not available:', e);
    }
}

// Level up sound - plays every 10 points
function playLevelUpSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }
        
        // Play a cheerful ascending melody
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.15);
            oscillator.start(audioContext.currentTime + i * 0.1);
            oscillator.stop(audioContext.currentTime + i * 0.1 + 0.15);
        });
    } catch (e) {
        console.warn('Audio not available:', e);
    }
}

// Game over sound
function playGameOverSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }
        
        // Play a sad descending sound
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.2);
            oscillator.start(audioContext.currentTime + i * 0.15);
            oscillator.stop(audioContext.currentTime + i * 0.15 + 0.2);
        });
    } catch (e) {
        console.warn('Audio not available:', e);
    }
}

// Canvas Resize
function resizeCanvas() {
    if (!canvas) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const size = Math.max(200, Math.min(vw, vh) - 100);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.style.margin = '0';
}

// Game Logic
function tick() {
    if (gameState.gameOver) return;
    
    gameState.direction = gameState.nextDirection;
    const head = gameState.snake[0];
    const dir = DIRECTIONS[gameState.direction];
    
    let newHead = {
        x: wrapCoordinate(head.x + dir.x, CONFIG.GRID_SIZE),
        y: wrapCoordinate(head.y + dir.y, CONFIG.GRID_SIZE)
    };
    
    if (checkSelfCollision(newHead)) {
        gameState.gameOver = true;
        playGameOverSound();
        showGameOverOverlay();
        return;
    }
    
    gameState.snake.unshift(newHead);
    
    if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
        gameState.score++;
        gameState.food = generateFood();
        updateScoreDisplay();
        
        // Check if we hit a multiple of 10
        if (gameState.score % 10 === 0 && gameState.score > 0) {
            playLevelUpSound();
            // Increase speed (reduce interval) - minimum 50ms
            gameState.currentSpeed = Math.max(50, gameState.currentSpeed - 15);
        } else {
            playEatSound();
        }
    } else {
        gameState.snake.pop();
    }
}

function showGameOverOverlay() {
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('game-over-overlay').classList.remove('hidden');
}

function hideGameOverOverlay() {
    document.getElementById('game-over-overlay').classList.add('hidden');
}

function render() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CONFIG.CANVAS_SIZE, CONFIG.CANVAS_SIZE);
    
    // Draw food
    drawCell(gameState.food.x, gameState.food.y, COLORS.food);
    
    // Draw snake
    gameState.snake.forEach((segment, index) => {
        const color = index === 0 ? COLORS.snakeHead : COLORS.snake;
        drawCell(segment.x, segment.y, color);
    });
    
    // Game over is now handled by HTML overlay
}

function setDirection(newDir) {
    if (!gameState.gameOver && OPPOSITES[newDir] !== gameState.direction) {
        gameState.nextDirection = newDir;
    }
}

// Input Handling
document.addEventListener('keydown', (e) => {
    const dir = KEY_MAP[e.key];
    if (dir) {
        e.preventDefault();
        setDirection(dir);
    }
    if (e.key === ' ' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetGame();
    }
});

// Game Control
function resetGame() {
    const centerX = Math.floor(CONFIG.GRID_SIZE / 2);
    const centerY = Math.floor(CONFIG.GRID_SIZE / 2);
    
    gameState.snake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
    ];
    gameState.direction = 'right';
    gameState.nextDirection = 'right';
    gameState.food = generateFood();
    gameState.score = 0;
    gameState.gameOver = false;
    gameState.lastTick = performance.now();
    gameState.currentSpeed = CONFIG.TICK_INTERVAL;  // Reset speed
    
    hideGameOverOverlay();
    updateScoreDisplay();
}

function gameLoop(timestamp) {
    const elapsed = timestamp - gameState.lastTick;
    
    // Use dynamic speed instead of fixed TICK_INTERVAL
    if (elapsed >= gameState.currentSpeed && !gameState.gameOver) {
        tick();
        gameState.lastTick = timestamp;
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Initialization
function init() {
    if (!canvas || !ctx) {
        console.error('Failed to initialize canvas!');
        return;
    }
    
    // Load and display high score on start
    document.getElementById('high-score').textContent = gameState.highScore;
    
    // Play Again button click handler
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    resetGame();
    requestAnimationFrame(gameLoop);
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
