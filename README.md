# Snake Game 🐍

A classic Snake game built with vanilla HTML5, CSS3, and JavaScript. Single-file, zero dependencies, and ready to play!

![Game Screenshot](Screenshot.png)

## About

This is a classic Snake game implementation:
- **Single-file**: Everything in one HTML file - no build process needed
- **Zero dependencies**: Pure vanilla JavaScript, HTML5 Canvas, and CSS3
- **Retro style**: Pixelated graphics with classic green snake
- **Responsive**: Works on desktop and mobile devices

The game uses wrap-around mechanics (snake wraps around screen edges).

## 🎮 Live Demo

Play the game online: **[https://ghaochghaoch.ir](https://ghaochghaoch.ir)**

## Features

- Classic Snake gameplay
- Keyboard controls (Arrow keys, WASD)
- Wrap-around screen edges
- Score tracking
- Self-collision detection

## How to Play

1. Open `index.html` in any modern web browser
2. Use **Arrow Keys** or **WASD** to change direction
3. Eat the red food to grow and increase your score
4. Avoid hitting yourself!

## Project Structure

```
.
├── index.html    # Main game file (everything in one file)
└── README.md     # This file
```

The entire game is contained in `index.html`:
- HTML structure in `<body>`
- CSS styles in `<style>` tag
- JavaScript game engine in `<script>` tag

## Running Locally

Simply open `index.html` in your browser. No server needed!

Or use a local server:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000/index.html
```

## Controls

- **Arrow Keys** or **WASD**: Change direction
- **Spacebar** or **R**: Restart game after game over

## Customization

You can customize the game by modifying constants in `index.html`:

```javascript
const CONFIG = {
    CELL_SIZE: 4,           // Pixels per grid cell
    GRID_SIZE: 25,          // Grid dimensions (25×25)
    TICK_INTERVAL: 150,     // Game speed (milliseconds)
    INITIAL_LENGTH: 3       // Starting snake length
};
```

## License

This project is open source and available for contribution.
