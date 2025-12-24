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
    currentSpeed: 150,  // Dynamic speed (starts at TICK_INTERVAL)
    newHighScorePlayed: false  // Flag to prevent repeated new high score sound
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

// Draw rounded cell (for snake body) with shadow
function drawRoundedCell(x, y, color) {
    if (!ctx) return;
    const px = x * CONFIG.CELL_SIZE;
    const py = y * CONFIG.CELL_SIZE;
    const size = CONFIG.CELL_SIZE;
    const radius = size * 0.3;
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(px + 1, py + 1, size, size, radius);
    } else {
        ctx.moveTo(px + 1 + radius, py + 1);
        ctx.lineTo(px + 1 + size - radius, py + 1);
        ctx.quadraticCurveTo(px + 1 + size, py + 1, px + 1 + size, py + 1 + radius);
        ctx.lineTo(px + 1 + size, py + 1 + size - radius);
        ctx.quadraticCurveTo(px + 1 + size, py + 1 + size, px + 1 + size - radius, py + 1 + size);
        ctx.lineTo(px + 1 + radius, py + 1 + size);
        ctx.quadraticCurveTo(px + 1, py + 1 + size, px + 1, py + 1 + size - radius);
        ctx.lineTo(px + 1, py + 1 + radius);
        ctx.quadraticCurveTo(px + 1, py + 1, px + 1 + radius, py + 1);
        ctx.closePath();
    }
    ctx.fill();
    
    // Draw main cell with gradient
    const gradient = ctx.createLinearGradient(px, py, px + size, py + size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, COLORS.snakeHead);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(px, py, size, size, radius);
    } else {
        ctx.moveTo(px + radius, py);
        ctx.lineTo(px + size - radius, py);
        ctx.quadraticCurveTo(px + size, py, px + size, py + radius);
        ctx.lineTo(px + size, py + size - radius);
        ctx.quadraticCurveTo(px + size, py + size, px + size - radius, py + size);
        ctx.lineTo(px + radius, py + size);
        ctx.quadraticCurveTo(px, py + size, px, py + size - radius);
        ctx.lineTo(px, py + radius);
        ctx.quadraticCurveTo(px, py, px + radius, py);
        ctx.closePath();
    }
    ctx.fill();
}

// Draw food as a glowing circle
function drawFood(x, y) {
    if (!ctx) return;
    const px = x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
    const py = y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
    const radius = CONFIG.CELL_SIZE * 0.45;
    
    // Add pulsing animation based on time
    const time = Date.now() * 0.005;
    const pulse = 1 + Math.sin(time) * 0.1;
    const currentRadius = radius * pulse;
    
    // Draw glow/shadow
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, currentRadius * 1.5);
    gradient.addColorStop(0, COLORS.food);
    gradient.addColorStop(0.7, '#FFD700');
    gradient.addColorStop(1, 'rgba(255, 225, 53, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, currentRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw main food circle
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(px, py, currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(px - currentRadius * 0.3, py - currentRadius * 0.3, currentRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
}

// Calculate distance to food (Manhattan distance)
function getDistanceToFood() {
    const head = gameState.snake[0];
    const food = gameState.food;
    return Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
}

// Draw snake head with mouth (opens when near food)
function drawSnakeHead(x, y) {
    if (!ctx) return;
    
    const px = x * CONFIG.CELL_SIZE;
    const py = y * CONFIG.CELL_SIZE;
    const size = CONFIG.CELL_SIZE;
    const center = size / 2;
    const dir = gameState.direction;
    
    // Check if mouth should be open (within 3 cells of food)
    const distanceToFood = getDistanceToFood();
    const mouthOpen = distanceToFood <= 3;
    
    if (mouthOpen) {
        // Calculate mouth direction offset
        let mouthX = 0, mouthY = 0;
        if (dir === 'right') { mouthX = 1; }
        else if (dir === 'left') { mouthX = -1; }
        else if (dir === 'up') { mouthY = -1; }
        else { mouthY = 1; }
        
        // Draw shadow for head
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(px + center + 1, py + center + 1, center, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw head base (circle) with gradient
        const headGradient = ctx.createRadialGradient(
            px + center - size * 0.2, py + center - size * 0.2, 0,
            px + center, py + center, center
        );
        headGradient.addColorStop(0, '#9FFF8A');
        headGradient.addColorStop(1, COLORS.snakeHead);
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(px + center, py + center, center, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth interior (dark red/maroon)
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        
        if (dir === 'right') {
            ctx.moveTo(px + center, py + center);
            ctx.lineTo(px + size + size * 0.3, py + center - size * 0.4);
            ctx.lineTo(px + size + size * 0.3, py + center + size * 0.4);
            ctx.closePath();
        } else if (dir === 'left') {
            ctx.moveTo(px + center, py + center);
            ctx.lineTo(px - size * 0.3, py + center - size * 0.4);
            ctx.lineTo(px - size * 0.3, py + center + size * 0.4);
            ctx.closePath();
        } else if (dir === 'up') {
            ctx.moveTo(px + center, py + center);
            ctx.lineTo(px + center - size * 0.4, py - size * 0.3);
            ctx.lineTo(px + center + size * 0.4, py - size * 0.3);
            ctx.closePath();
        } else { // down
            ctx.moveTo(px + center, py + center);
            ctx.lineTo(px + center - size * 0.4, py + size + size * 0.3);
            ctx.lineTo(px + center + size * 0.4, py + size + size * 0.3);
            ctx.closePath();
        }
        ctx.fill();
        
        // Draw tongue (red)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        
        if (dir === 'right') {
            ctx.ellipse(px + size + size * 0.15, py + center, size * 0.2, size * 0.1, 0, 0, Math.PI * 2);
        } else if (dir === 'left') {
            ctx.ellipse(px - size * 0.15, py + center, size * 0.2, size * 0.1, 0, 0, Math.PI * 2);
        } else if (dir === 'up') {
            ctx.ellipse(px + center, py - size * 0.15, size * 0.1, size * 0.2, 0, 0, Math.PI * 2);
        } else { // down
            ctx.ellipse(px + center, py + size + size * 0.15, size * 0.1, size * 0.2, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Draw teeth (white triangles)
        ctx.fillStyle = '#FFFFFF';
        const t = size * 0.12; // tooth size
        
        if (dir === 'right') {
            // Top jaw teeth
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center + i * t * 1.5, py + center - size * 0.35);
                ctx.lineTo(px + center + t * 0.7 + i * t * 1.5, py + center - size * 0.15);
                ctx.lineTo(px + center + t * 1.4 + i * t * 1.5, py + center - size * 0.35);
                ctx.fill();
            }
            // Bottom jaw teeth
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center + i * t * 1.5, py + center + size * 0.35);
                ctx.lineTo(px + center + t * 0.7 + i * t * 1.5, py + center + size * 0.15);
                ctx.lineTo(px + center + t * 1.4 + i * t * 1.5, py + center + size * 0.35);
                ctx.fill();
            }
        } else if (dir === 'left') {
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center - i * t * 1.5, py + center - size * 0.35);
                ctx.lineTo(px + center - t * 0.7 - i * t * 1.5, py + center - size * 0.15);
                ctx.lineTo(px + center - t * 1.4 - i * t * 1.5, py + center - size * 0.35);
                ctx.fill();
            }
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center - i * t * 1.5, py + center + size * 0.35);
                ctx.lineTo(px + center - t * 0.7 - i * t * 1.5, py + center + size * 0.15);
                ctx.lineTo(px + center - t * 1.4 - i * t * 1.5, py + center + size * 0.35);
                ctx.fill();
            }
        } else if (dir === 'up') {
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center - size * 0.35, py + center - i * t * 1.5);
                ctx.lineTo(px + center - size * 0.15, py + center - t * 0.7 - i * t * 1.5);
                ctx.lineTo(px + center - size * 0.35, py + center - t * 1.4 - i * t * 1.5);
                ctx.fill();
            }
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center + size * 0.35, py + center - i * t * 1.5);
                ctx.lineTo(px + center + size * 0.15, py + center - t * 0.7 - i * t * 1.5);
                ctx.lineTo(px + center + size * 0.35, py + center - t * 1.4 - i * t * 1.5);
                ctx.fill();
            }
        } else { // down
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center - size * 0.35, py + center + i * t * 1.5);
                ctx.lineTo(px + center - size * 0.15, py + center + t * 0.7 + i * t * 1.5);
                ctx.lineTo(px + center - size * 0.35, py + center + t * 1.4 + i * t * 1.5);
                ctx.fill();
            }
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(px + center + size * 0.35, py + center + i * t * 1.5);
                ctx.lineTo(px + center + size * 0.15, py + center + t * 0.7 + i * t * 1.5);
                ctx.lineTo(px + center + size * 0.35, py + center + t * 1.4 + i * t * 1.5);
                ctx.fill();
            }
        }
        
        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        if (dir === 'right' || dir === 'left') {
            ctx.beginPath();
            ctx.arc(px + center, py + center - size * 0.25, size * 0.15, 0, Math.PI * 2);
            ctx.arc(px + center, py + center + size * 0.25, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            // Pupils
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px + center + (dir === 'right' ? size * 0.05 : -size * 0.05), py + center - size * 0.25, size * 0.07, 0, Math.PI * 2);
            ctx.arc(px + center + (dir === 'right' ? size * 0.05 : -size * 0.05), py + center + size * 0.25, size * 0.07, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(px + center - size * 0.25, py + center, size * 0.15, 0, Math.PI * 2);
            ctx.arc(px + center + size * 0.25, py + center, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            // Pupils
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px + center - size * 0.25, py + center + (dir === 'down' ? size * 0.05 : -size * 0.05), size * 0.07, 0, Math.PI * 2);
            ctx.arc(px + center + size * 0.25, py + center + (dir === 'down' ? size * 0.05 : -size * 0.05), size * 0.07, 0, Math.PI * 2);
            ctx.fill();
        }
    } else {
        // Draw shadow for closed head
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(px + center + 1, py + center + 1, center, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw normal closed head (circle with eyes) with gradient
        const headGradient = ctx.createRadialGradient(
            px + center - size * 0.2, py + center - size * 0.2, 0,
            px + center, py + center, center
        );
        headGradient.addColorStop(0, '#9FFF8A');
        headGradient.addColorStop(1, COLORS.snakeHead);
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(px + center, py + center, center, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes for closed mouth
        ctx.fillStyle = '#FFFFFF';
        if (dir === 'right' || dir === 'left') {
            ctx.beginPath();
            ctx.arc(px + center + (dir === 'right' ? size * 0.15 : -size * 0.15), py + center - size * 0.2, size * 0.12, 0, Math.PI * 2);
            ctx.arc(px + center + (dir === 'right' ? size * 0.15 : -size * 0.15), py + center + size * 0.2, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px + center + (dir === 'right' ? size * 0.2 : -size * 0.2), py + center - size * 0.2, size * 0.06, 0, Math.PI * 2);
            ctx.arc(px + center + (dir === 'right' ? size * 0.2 : -size * 0.2), py + center + size * 0.2, size * 0.06, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(px + center - size * 0.2, py + center + (dir === 'down' ? size * 0.15 : -size * 0.15), size * 0.12, 0, Math.PI * 2);
            ctx.arc(px + center + size * 0.2, py + center + (dir === 'down' ? size * 0.15 : -size * 0.15), size * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px + center - size * 0.2, py + center + (dir === 'down' ? size * 0.2 : -size * 0.2), size * 0.06, 0, Math.PI * 2);
            ctx.arc(px + center + size * 0.2, py + center + (dir === 'down' ? size * 0.2 : -size * 0.2), size * 0.06, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// New high score sound
const newHighScoreAudio = new Audio('sound/bababenazam.m4a');

function playNewHighScoreSound() {
    newHighScoreAudio.currentTime = 0;
    newHighScoreAudio.play().catch(() => {});
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = gameState.score;
    
    // Check if we beat the previous high score (only play sound once)
    const previousHighScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    if (gameState.score > previousHighScore && !gameState.newHighScorePlayed) {
        gameState.newHighScorePlayed = true;
        playNewHighScoreSound();
    }
    
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
    
    // Draw food (as glowing circle)
    drawFood(gameState.food.x, gameState.food.y);
    
    // Draw snake
    gameState.snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head with mouth animation
            drawSnakeHead(segment.x, segment.y);
        } else {
            // Draw rounded body segments for smoother look
            drawRoundedCell(segment.x, segment.y, COLORS.snake);
        }
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
    gameState.newHighScorePlayed = false;  // Reset high score sound flag
    
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
