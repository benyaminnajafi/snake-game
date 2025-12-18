# Ghaoch Ghaoch - Simple Snake Game 🐍

A classic Snake game built with vanilla HTML5, CSS3, and JavaScript. Zero dependencies, retro vibrant style, and ready to play!

<p align="center">
  <img src="img/Screenshot (Play).png" alt="Gameplay" width="45%">
  &nbsp;&nbsp;&nbsp;
  <img src="img/Screenshot (Game Over).png" alt="Game Over" width="45%">
</p>

## About

This is a classic Snake game implementation:
- **Clean structure**: Separated HTML, CSS, and JavaScript files
- **Zero dependencies**: Pure vanilla JavaScript, HTML5 Canvas, and CSS3
- **Retro vibrant style**: Colorful graphics with blue/green theme
- **Responsive**: Works on desktop and mobile devices
- **Sound effects**: Eat, level up, game over, and new high score sounds

The game uses wrap-around mechanics (snake wraps around screen edges).

## 🎮 Live Demo

Play the game online: **[https://ghaochghaoch.ir](https://ghaochghaoch.ir)**

## Features

- 🐍 Classic Snake gameplay
- 🎮 Keyboard controls (Arrow keys, WASD)
- 🔄 Wrap-around screen edges
- 📊 Score tracking with **Best Score** saved locally
- 🏆 New high score celebration sound
- 🔊 Sound effects (eat, level up, game over)
- ⚡ Progressive difficulty - speed increases every 10 points
- 💀 Self-collision detection
- 🎯 "Play Again" button on game over

## How to Play

1. Open `index.html` in any modern web browser
2. Use **Arrow Keys** or **WASD** to change direction
3. Eat the yellow food to grow and increase your score
4. Every 10 points, the game speeds up!
5. Avoid hitting yourself!

**Controls:**
- **Arrow Keys** or **WASD**: Change direction
- **Spacebar** or **R**: Restart game
- **Play Again button**: Click to restart after game over

## Project Structure

```
.
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All game styles
├── js/
│   └── game.js        # Game logic and engine
├── img/
│   └── *.png          # Game screenshots
├── sound/
│   └── *.m4a          # Sound effects
└── README.md          # This file
```

The game is organized into separate files:
- **index.html**: HTML structure and page layout
- **css/style.css**: All styling and visual design
- **js/game.js**: Game logic, rendering, and controls
- **sound/**: Audio files for game events

## Running Locally

Simply open `index.html` in your browser. No server needed!

## Customization

You can customize the game by modifying constants in `js/game.js`:

```javascript
const CONFIG = {
    CELL_SIZE: 4,           // Pixels per grid cell
    GRID_SIZE: 25,          // Grid dimensions (25×25)
    TICK_INTERVAL: 150,     // Initial game speed (milliseconds)
    INITIAL_LENGTH: 3       // Starting snake length
};
```

You can also customize colors in `js/game.js`:

```javascript
const COLORS = {
    background: '#3D6B2E',  // Green grass
    snake: '#5CBF45',       // Snake body
    snakeHead: '#7EE868',   // Snake head
    food: '#FFE135',        // Yellow food
    // ... more colors
};
```

## License

This project is open source and available for contribution.
