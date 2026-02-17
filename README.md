# 🐍 Snake Game

A fully functional, beautiful Snake Game website with multiple themes and customization options. Built with pure HTML, CSS, and JavaScript - no external dependencies required!

## 🎮 Features

### Game Mechanics
- **Classic Snake gameplay** with smooth, responsive controls
- **Arrow keys** or **WASD** for movement
- **Score tracking** with high score persistence (localStorage)
- **Progressive difficulty** - game speeds up as you play
- **Pause functionality** - Press Space or Escape to pause
- **Collision detection** - Game over on wall or self-collision
- **Smooth animations** and visual feedback

### 🎨 Visual Design
- **Beautiful, modern UI** with gradient backgrounds
- **Animated welcome screen** with bouncing title letters
- **Smooth transitions** between screens
- **Particle effects** when eating food
- **Hover animations** on all interactive elements
- **Responsive design** - works on desktop, tablet, and mobile

### 🌈 6 Unique Themes
1. **Nokia 3310 Classic** - Retro green monochrome display with authentic grid
2. **Neon Cyberpunk** - Bright neon colors with glowing effects
3. **Nature/Forest** - Green grass background with organic colors
4. **Ocean/Aquatic** - Blue water theme with aquatic vibes
5. **Desert/Sand** - Warm sandy colors with desert palette
6. **Space/Galaxy** - Dark space theme with stars and cosmic colors

### 🐍 4 Snake Skins
1. **Classic** - Traditional solid-color snake
2. **Gradient** - Beautiful gradient fade effect
3. **Striped** - Alternating color pattern
4. **Rainbow** - Full rainbow spectrum colors

## 🚀 Getting Started

### Quick Start
1. Clone this repository
2. Open `index.html` in a web browser
3. Choose your theme and snake skin
4. Click "Start New Game" and enjoy!

### No Installation Required
This is a pure client-side application - no server, no build process, no dependencies. Just open and play!

## 🎯 How to Play

### Controls
- **Arrow Keys** or **WASD** - Move the snake
- **Space** or **Escape** - Pause/Resume game

### Rules
- Guide the snake to eat the food (circular dots)
- Each food increases your score by 10 points
- The snake grows longer with each food eaten
- Game speeds up as you progress
- Avoid hitting walls or your own body
- Try to beat your high score!

## 📁 Project Structure

```
Snake-Game/
├── index.html    # Main HTML structure
├── styles.css    # All styling and animations
├── game.js       # Game logic and rendering
└── README.md     # This file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** for game rendering
- **CSS3** for animations and styling
- **Vanilla JavaScript** for game logic
- **localStorage** for data persistence

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with HTML5 Canvas support

### Performance
- Optimized for smooth 60fps gameplay
- Efficient canvas rendering
- Minimal memory footprint
- Fast load times (no external dependencies)

## 📱 Responsive Design
The game automatically adapts to different screen sizes:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-friendly interface
- **Mobile**: Optimized layout and controls

## 💾 Features Implementation

### LocalStorage
- High scores persist between sessions
- Theme preferences saved
- Snake skin selection saved

### Particle System
- Dynamic particle effects on food consumption
- Multiple colors based on current theme
- Smooth animations

### Theme System
- Easy to add new themes
- Complete color customization
- Background effects (stars for space theme)
- Grid styling options

## 🎨 Customization

### Adding New Themes
Edit the `THEMES` object in `game.js`:
```javascript
newtheme: {
    name: 'Theme Name',
    background: '#color',
    snake: '#color',
    food: '#color',
    // ... more options
}
```

### Adding New Snake Skins
Edit the `SNAKE_SKINS` object in `game.js` to add custom rendering logic.

## 🏆 High Score System
- Automatically saves your best score
- Displays high score on menu screen
- Shows "NEW HIGH SCORE!" message when achieved
- Persistent across browser sessions

## 🎭 Animations
- Bouncing letters in title
- Rotating trophy icon
- Pulsing start button
- Smooth screen transitions
- Particle explosions
- Hover effects on all buttons

## 📄 License
This project is open source and available for educational purposes.

## 🤝 Contributing
Feel free to fork this project and add your own features, themes, or improvements!

## 🎉 Enjoy!
Have fun playing Snake! Try to beat your high score and experiment with different themes and snake skins!
