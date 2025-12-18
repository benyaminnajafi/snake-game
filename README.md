# Snake Game 🐍

A classic Snake game built with vanilla HTML5, CSS3, and JavaScript. Single-file, zero dependencies, and ready to play!

## 📋 Table of Contents

- [English](#english)
  - [About](#about)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [How It Works](#how-it-works)
  - [Running Locally](#running-locally)
  - [Controls](#controls)
  - [Configuration](#configuration)
  - [Contributing](#contributing)
  - [Future Enhancements](#future-enhancements)
- [فارسی](#فارسی)
  - [درباره](#درباره-1)
  - [ویژگی‌ها](#ویژگی‌ها)
  - [تکنولوژی‌ها](#تکنولوژی‌ها)
  - [ساختار پروژه](#ساختار-پروژه)
  - [نحوه کار](#نحوه-کار)
  - [اجرای محلی](#اجرای-محلی)
  - [کنترل‌ها](#کنترل‌ها)
  - [پیکربندی](#پیکربندی)
  - [مشارکت](#مشارکت)
  - [بهبودهای آینده](#بهبودهای-آینده)

---

# English

## About

This is a classic Snake game implementation featuring:
- **Single-file architecture**: Everything in one HTML file - no build process needed
- **Nokia-style aesthetics**: Retro pixelated graphics with classic green snake
- **Responsive design**: Works on desktop and mobile devices
- **Zero dependencies**: Pure vanilla JavaScript, HTML5 Canvas, and CSS3

The game uses a wrap-around mechanic (snake wraps around screen edges) and includes sound effects when eating food.

## Features

- 🎮 Classic Snake gameplay
- 📱 Mobile-responsive with touch support
- 🎨 Retro pixelated graphics
- 🔊 Sound effects (Web Audio API)
- ⌨️ Keyboard controls (Arrow keys, WASD)
- 🔄 Wrap-around screen edges
- 📊 Score tracking
- 🎯 Self-collision detection

## Tech Stack

- **HTML5**: Structure and Canvas element
- **CSS3**: Styling and responsive layout
- **Vanilla JavaScript (ES6+)**: Game logic, no frameworks
- **Canvas 2D API**: Rendering

## Project Structure

```
.
├── snake-game.html          # Main game file (everything in one file)
├── snake-game-technical-spec.md  # Detailed technical documentation
├── PRD.md                   # Product Requirements Document template
└── README.md                # This file
```

The entire game is contained in `snake-game.html`:
- HTML structure in `<body>`
- CSS styles in `<style>` tag
- JavaScript game engine in `<script>` tag

## How It Works

### Game Loop Architecture

The game follows a standard game loop pattern:

```
Input → Update (tick) → Render → Repeat
```

1. **Input Handling**: Keyboard events are captured and stored in `gameState.nextDirection`
2. **Update (Tick)**: Every 150ms, the game state is updated:
   - Snake moves one cell in current direction
   - Collision detection (self-collision)
   - Food consumption check
   - Score update
3. **Render**: Every frame (60 FPS), the canvas is redrawn with current game state

### State Management

The game state is stored in a single object:

```javascript
const gameState = {
    snake: [],              // Array of {x, y} positions
    direction: 'right',     // Current movement direction
    nextDirection: 'right', // Buffered next direction (prevents 180° turns)
    food: { x: 0, y: 0 },  // Food position
    score: 0,               // Current score
    gameOver: false,        // Game state flag
    lastTick: 0            // Timestamp for tick timing
};
```

### Key Functions

- **`tick()`**: Updates game state (snake movement, collision, food)
- **`render()`**: Draws everything on canvas
- **`gameLoop(timestamp)`**: Main loop using `requestAnimationFrame`
- **`setDirection(newDir)`**: Handles input with 180° turn prevention
- **`resetGame()`**: Resets all state to initial values
- **`generateFood()`**: Creates food at random valid position
- **`checkSelfCollision(head)`**: Detects if snake hits itself

### Code Organization

The code is organized into logical sections:
1. **Configuration Constants** (`CONFIG`, `COLORS`, `DIRECTIONS`, etc.)
2. **Game State** (`gameState` object)
3. **Helper Functions** (utility functions)
4. **Game Logic** (`tick()`, collision detection)
5. **Rendering** (`render()`, `drawCell()`, `drawGameOver()`)
6. **Input Handling** (keyboard event listeners)
7. **Game Loop** (`gameLoop()`, `init()`)

## Running Locally

1. Clone or download this repository
2. Open `snake-game.html` in any modern web browser
3. That's it! No build process, no dependencies, no server needed.

You can also use a local server if preferred:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then open http://localhost:8000/snake-game.html
```

## Controls

- **Arrow Keys** or **WASD**: Change direction
- **Spacebar** or **R**: Restart game after game over
- **Touch/Click**: (Future: on-screen D-pad controls)

## Configuration

You can easily customize the game by modifying constants at the top of the script:

```javascript
const CONFIG = {
    CELL_SIZE: 4,           // Pixels per grid cell
    GRID_SIZE: 25,          // Grid dimensions (25×25)
    CANVAS_SIZE: 100,       // Canvas size in pixels
    TICK_INTERVAL: 150,     // Game speed (milliseconds between moves)
    INITIAL_LENGTH: 3       // Starting snake length
};

const COLORS = {
    background: '#0f0f1e',
    snake: '#00ff00',       // Classic green
    snakeHead: '#00cc00',   // Darker green for head
    food: '#ff0000',         // Red food
    // ... more colors
};
```

**Tips for customization:**
- Lower `TICK_INTERVAL` = faster game
- Higher `GRID_SIZE` = larger playing field
- Adjust `COLORS` for different themes

## Contributing

We welcome contributions! Here's how you can help:

### Safe Areas to Modify

These areas are safe to modify without breaking core functionality:

1. **Visual Styling** (`<style>` section):
   - Colors, fonts, layout
   - Canvas appearance
   - Responsive breakpoints

2. **Configuration Constants**:
   - `CONFIG` object (game speed, grid size)
   - `COLORS` object (color palette)
   - `KEY_MAP` object (keyboard controls)

3. **UI Elements**:
   - Score display styling
   - Game over message
   - Future: Menu screens, buttons

### How to Add Features

1. **New Game Mechanics**:
   - Add logic in `tick()` function
   - Update `gameState` object if needed
   - Modify `render()` to display new elements

2. **New Controls**:
   - Add to `KEY_MAP` object
   - Extend `setDirection()` if needed
   - Add event listeners

3. **New Visual Effects**:
   - Add drawing functions (like `drawCell()`)
   - Call them in `render()` function
   - Update `COLORS` if needed

### Code Organization Guidelines

- Keep functions focused and single-purpose
- Use descriptive variable names
- Add comments for complex logic
- Maintain the existing code structure
- Test changes in multiple browsers

### Testing Your Changes

1. Open `snake-game.html` in browser
2. Test basic gameplay (movement, food, collision)
3. Test edge cases (wrap-around, rapid direction changes)
4. Test on mobile if adding touch features
5. Check browser console for errors

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with description of changes

## Future Enhancements

Ideas for contributors:

- [ ] High score persistence (localStorage)
- [ ] Progressive difficulty (speed increases with score)
- [ ] Difficulty selection menu
- [ ] On-screen D-pad for mobile
- [ ] Multiple food types with different scores
- [ ] Obstacles/walls
- [ ] Power-ups (speed boost, invincibility)
- [ ] Multiplayer mode
- [ ] Themes/skins
- [ ] Particle effects
- [ ] Better sound effects library

---

# فارسی

## درباره

این یک پیاده‌سازی کلاسیک بازی مار است که شامل موارد زیر می‌شود:
- **معماری تک فایلی**: همه چیز در یک فایل HTML - بدون نیاز به فرآیند ساخت
- **زیبایی‌شناسی به سبک نوکیا**: گرافیک پیکسلی رترو با مار سبز کلاسیک
- **طراحی واکنش‌گرا**: کار می‌کند روی دسکتاپ و موبایل
- **بدون وابستگی**: جاوااسکریپت خالص، HTML5 Canvas، و CSS3

بازی از مکانیک wrap-around استفاده می‌کند (مار از لبه‌های صفحه عبور می‌کند) و شامل افکت‌های صوتی هنگام خوردن غذا است.

## ویژگی‌ها

- 🎮 گیم‌پلی کلاسیک مار
- 📱 واکنش‌گرا برای موبایل با پشتیبانی لمسی
- 🎨 گرافیک پیکسلی رترو
- 🔊 افکت‌های صوتی (Web Audio API)
- ⌨️ کنترل‌های صفحه کلید (کلیدهای جهت‌نما، WASD)
- 🔄 عبور از لبه‌های صفحه
- 📊 ردیابی امتیاز
- 🎯 تشخیص برخورد با خود

## تکنولوژی‌ها

- **HTML5**: ساختار و عنصر Canvas
- **CSS3**: استایل و چیدمان واکنش‌گرا
- **جاوااسکریپت خالص (ES6+)**: منطق بازی، بدون فریمورک
- **Canvas 2D API**: رندرینگ

## ساختار پروژه

```
.
├── snake-game.html          # فایل اصلی بازی (همه چیز در یک فایل)
├── snake-game-technical-spec.md  # مستندات فنی تفصیلی
├── PRD.md                   # قالب سند نیازمندی‌های محصول
└── README.md                # این فایل
```

کل بازی در `snake-game.html` قرار دارد:
- ساختار HTML در `<body>`
- استایل‌های CSS در تگ `<style>`
- موتور بازی جاوااسکریپت در تگ `<script>`

## نحوه کار

### معماری حلقه بازی

بازی از الگوی حلقه بازی استاندارد پیروی می‌کند:

```
ورودی → به‌روزرسانی (tick) → رندر → تکرار
```

1. **پردازش ورودی**: رویدادهای صفحه کلید گرفته شده و در `gameState.nextDirection` ذخیره می‌شوند
2. **به‌روزرسانی (Tick)**: هر 150 میلی‌ثانیه، وضعیت بازی به‌روزرسانی می‌شود:
   - مار یک سلول در جهت فعلی حرکت می‌کند
   - تشخیص برخورد (برخورد با خود)
   - بررسی مصرف غذا
   - به‌روزرسانی امتیاز
3. **رندر**: هر فریم (60 FPS)، canvas با وضعیت فعلی بازی دوباره رسم می‌شود

### مدیریت وضعیت

وضعیت بازی در یک شیء واحد ذخیره می‌شود:

```javascript
const gameState = {
    snake: [],              // آرایه موقعیت‌های {x, y}
    direction: 'right',     // جهت حرکت فعلی
    nextDirection: 'right', // جهت بعدی بافر شده (جلوگیری از چرخش 180 درجه)
    food: { x: 0, y: 0 },  // موقعیت غذا
    score: 0,               // امتیاز فعلی
    gameOver: false,        // پرچم وضعیت بازی
    lastTick: 0            // برچسب زمانی برای زمان‌بندی tick
};
```

### توابع کلیدی

- **`tick()`**: وضعیت بازی را به‌روزرسانی می‌کند (حرکت مار، برخورد، غذا)
- **`render()`**: همه چیز را روی canvas رسم می‌کند
- **`gameLoop(timestamp)`**: حلقه اصلی با استفاده از `requestAnimationFrame`
- **`setDirection(newDir)`**: ورودی را با جلوگیری از چرخش 180 درجه پردازش می‌کند
- **`resetGame()`**: همه وضعیت را به مقادیر اولیه برمی‌گرداند
- **`generateFood()`**: غذا را در موقعیت معتبر تصادفی ایجاد می‌کند
- **`checkSelfCollision(head)`**: تشخیص می‌دهد که آیا مار به خودش برخورد کرده است

### سازماندهی کد

کد به بخش‌های منطقی سازماندهی شده است:
1. **ثابت‌های پیکربندی** (`CONFIG`, `COLORS`, `DIRECTIONS`, و غیره)
2. **وضعیت بازی** (شیء `gameState`)
3. **توابع کمکی** (توابع ابزاری)
4. **منطق بازی** (`tick()`, تشخیص برخورد)
5. **رندرینگ** (`render()`, `drawCell()`, `drawGameOver()`)
6. **پردازش ورودی** (شنونده‌های رویداد صفحه کلید)
7. **حلقه بازی** (`gameLoop()`, `init()`)

## اجرای محلی

1. این مخزن را کلون یا دانلود کنید
2. `snake-game.html` را در هر مرورگر وب مدرن باز کنید
3. همین! بدون فرآیند ساخت، بدون وابستگی، بدون نیاز به سرور.

همچنین می‌توانید از یک سرور محلی استفاده کنید:
```bash
# Python 3
python -m http.server 8000

# Node.js (با http-server)
npx http-server

# سپس http://localhost:8000/snake-game.html را باز کنید
```

## کنترل‌ها

- **کلیدهای جهت‌نما** یا **WASD**: تغییر جهت
- **Spacebar** یا **R**: راه‌اندازی مجدد بازی پس از پایان بازی
- **لمس/کلیک**: (آینده: کنترل‌های D-pad روی صفحه)

## پیکربندی

می‌توانید به راحتی بازی را با تغییر ثابت‌های ابتدای اسکریپت سفارشی کنید:

```javascript
const CONFIG = {
    CELL_SIZE: 4,           // پیکسل به ازای هر سلول شبکه
    GRID_SIZE: 25,          // ابعاد شبکه (25×25)
    CANVAS_SIZE: 100,       // اندازه canvas به پیکسل
    TICK_INTERVAL: 150,     // سرعت بازی (میلی‌ثانیه بین حرکات)
    INITIAL_LENGTH: 3       // طول اولیه مار
};

const COLORS = {
    background: '#0f0f1e',
    snake: '#00ff00',       // سبز کلاسیک
    snakeHead: '#00cc00',   // سبز تیره‌تر برای سر
    food: '#ff0000',         // غذای قرمز
    // ... رنگ‌های بیشتر
};
```

**نکات برای سفارشی‌سازی:**
- `TICK_INTERVAL` کمتر = بازی سریع‌تر
- `GRID_SIZE` بیشتر = میدان بازی بزرگ‌تر
- تنظیم `COLORS` برای تم‌های مختلف

## مشارکت

ما از مشارکت‌ها استقبال می‌کنیم! در اینجا نحوه کمک شما آمده است:

### مناطق امن برای تغییر

این مناطق برای تغییر امن هستند بدون شکستن عملکرد اصلی:

1. **استایل بصری** (بخش `<style>`):
   - رنگ‌ها، فونت‌ها، چیدمان
   - ظاهر canvas
   - نقاط شکست واکنش‌گرا

2. **ثابت‌های پیکربندی**:
   - شیء `CONFIG` (سرعت بازی، اندازه شبکه)
   - شیء `COLORS` (پالت رنگ)
   - شیء `KEY_MAP` (کنترل‌های صفحه کلید)

3. **عناصر رابط کاربری**:
   - استایل نمایش امتیاز
   - پیام پایان بازی
   - آینده: صفحه‌های منو، دکمه‌ها

### نحوه افزودن ویژگی‌ها

1. **مکانیک‌های بازی جدید**:
   - افزودن منطق در تابع `tick()`
   - به‌روزرسانی شیء `gameState` در صورت نیاز
   - تغییر `render()` برای نمایش عناصر جدید

2. **کنترل‌های جدید**:
   - افزودن به شیء `KEY_MAP`
   - گسترش `setDirection()` در صورت نیاز
   - افزودن شنونده‌های رویداد

3. **افکت‌های بصری جدید**:
   - افزودن توابع رسم (مثل `drawCell()`)
   - فراخوانی آن‌ها در تابع `render()`
   - به‌روزرسانی `COLORS` در صورت نیاز

### دستورالعمل‌های سازماندهی کد

- توابع را متمرکز و تک‌منظوره نگه دارید
- از نام‌های متغیر توصیفی استفاده کنید
- برای منطق پیچیده کامنت اضافه کنید
- ساختار کد موجود را حفظ کنید
- تغییرات را در چندین مرورگر تست کنید

### تست تغییرات شما

1. `snake-game.html` را در مرورگر باز کنید
2. گیم‌پلی پایه را تست کنید (حرکت، غذا، برخورد)
3. موارد لبه را تست کنید (wrap-around، تغییرات سریع جهت)
4. روی موبایل تست کنید اگر ویژگی‌های لمسی اضافه می‌کنید
5. کنسول مرورگر را برای خطاها بررسی کنید

### ارسال تغییرات

1. مخزن را fork کنید
2. یک شاخه ویژگی ایجاد کنید
3. تغییرات خود را اعمال کنید
4. به طور کامل تست کنید
5. یک pull request با توضیح تغییرات ارسال کنید

## بهبودهای آینده

ایده‌هایی برای مشارکت‌کنندگان:

- [ ] پایداری امتیاز بالا (localStorage)
- [ ] دشواری پیشرونده (سرعت با امتیاز افزایش می‌یابد)
- [ ] منوی انتخاب دشواری
- [ ] D-pad روی صفحه برای موبایل
- [ ] انواع مختلف غذا با امتیازهای مختلف
- [ ] موانع/دیوارها
- [ ] قدرت‌افزایی (افزایش سرعت، آسیب‌ناپذیری)
- [ ] حالت چندنفره
- [ ] تم/پوست
- [ ] افکت‌های ذره‌ای
- [ ] کتابخانه افکت‌های صوتی بهتر

---

## License

This project is open source and available for contribution. Feel free to fork, modify, and submit pull requests!

---

**Made with ❤️ for the open source community**
