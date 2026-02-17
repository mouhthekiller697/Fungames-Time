// Game Configuration
const CONFIG = {
    CANVAS_SIZE: 600,
    GRID_SIZE: 30,
    CELL_SIZE: 20,
    INITIAL_SPEED: 150,
    SPEED_INCREASE: 5,
    MIN_SPEED: 50,
};

// Theme Configurations
const THEMES = {
    nokia: {
        name: 'Nokia Classic',
        background: '#9bc700',
        grid: '#86a800',
        snake: '#000000',
        food: '#000000',
        text: '#000000',
        gridLines: true,
    },
    neon: {
        name: 'Neon Cyberpunk',
        background: '#0a0a1a',
        grid: '#1a1a2e',
        snake: '#00f5ff',
        snakeGlow: true,
        food: '#ff00ff',
        foodGlow: true,
        text: '#00f5ff',
        gridLines: true,
    },
    nature: {
        name: 'Nature Forest',
        background: '#a8e063',
        grid: '#8bc34a',
        snake: '#2e7d32',
        food: '#d32f2f',
        text: '#1b5e20',
        gridLines: false,
    },
    ocean: {
        name: 'Ocean Blue',
        background: '#1bffff',
        grid: '#00bcd4',
        snake: '#0d47a1',
        food: '#ff6f00',
        text: '#01579b',
        gridLines: false,
    },
    desert: {
        name: 'Desert Sand',
        background: '#f7b733',
        grid: '#f39c12',
        snake: '#8b4513',
        food: '#27ae60',
        text: '#6d4c41',
        gridLines: false,
    },
    space: {
        name: 'Space Galaxy',
        background: '#000428',
        grid: '#001845',
        snake: '#7b2cbf',
        snakeGlow: true,
        food: '#ffea00',
        foodGlow: true,
        text: '#ffffff',
        stars: true,
        gridLines: false,
    },
};

// Snake Skin Configurations
const SNAKE_SKINS = {
    classic: {
        name: 'Classic',
        render: (ctx, x, y, size, theme) => {
            ctx.fillStyle = theme.snake;
            ctx.fillRect(x, y, size, size);
            if (theme.snakeGlow) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = theme.snake;
            }
        },
    },
    gradient: {
        name: 'Gradient',
        render: (ctx, x, y, size, theme, index, length) => {
            const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
            const alpha = 1 - (index / length) * 0.5;
            gradient.addColorStop(0, theme.snake);
            gradient.addColorStop(1, adjustBrightness(theme.snake, -30));
            ctx.fillStyle = gradient;
            ctx.globalAlpha = alpha;
            ctx.fillRect(x, y, size, size);
            ctx.globalAlpha = 1;
        },
    },
    striped: {
        name: 'Striped',
        render: (ctx, x, y, size, theme, index) => {
            const isOdd = index % 2 === 0;
            ctx.fillStyle = isOdd ? theme.snake : adjustBrightness(theme.snake, 30);
            ctx.fillRect(x, y, size, size);
        },
    },
    rainbow: {
        name: 'Rainbow',
        render: (ctx, x, y, size, theme, index) => {
            const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, size, size);
            if (theme.snakeGlow) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = colors[index % colors.length];
            }
        },
    },
};

// Game State
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_SIZE;
        this.canvas.height = CONFIG.CANVAS_SIZE;
        
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = { x: 0, y: 0 };
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameLoop = null;
        this.speed = CONFIG.INITIAL_SPEED;
        this.isRunning = false;
        this.isPaused = false;
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'nokia';
        this.currentSnakeSkin = localStorage.getItem('selectedSnake') || 'classic';
        this.stars = [];
        
        this.initializeUI();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.applyTheme();
        this.applySnakeSkin();
        
        if (THEMES[this.currentTheme].stars) {
            this.generateStars();
        }
    }
    
    initializeUI() {
        // Initialize theme selection
        document.querySelectorAll('.theme-card').forEach(card => {
            if (card.dataset.theme === this.currentTheme) {
                card.classList.add('selected');
            }
        });
        
        // Initialize snake selection
        document.querySelectorAll('.snake-card').forEach(card => {
            if (card.dataset.snake === this.currentSnakeSkin) {
                card.classList.add('selected');
            }
        });
    }
    
    setupEventListeners() {
        // Theme selection
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.currentTheme = card.dataset.theme;
                localStorage.setItem('selectedTheme', this.currentTheme);
                this.applyTheme();
                
                if (THEMES[this.currentTheme].stars && this.stars.length === 0) {
                    this.generateStars();
                }
            });
        });
        
        // Snake skin selection
        document.querySelectorAll('.snake-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.snake-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.currentSnakeSkin = card.dataset.snake;
                localStorage.setItem('selectedSnake', this.currentSnakeSkin);
                this.applySnakeSkin();
            });
        });
        
        // Start game button
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Back to menu button
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            if (this.isPaused) {
                this.togglePause();
                e.preventDefault();
                return;
            }
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.nextDirection = { x: 0, y: -1 };
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.nextDirection = { x: 0, y: 1 };
                    }
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.nextDirection = { x: -1, y: 0 };
                    }
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.nextDirection = { x: 1, y: 0 };
                    }
                    e.preventDefault();
                    break;
                case ' ':
                case 'Escape':
                    this.togglePause();
                    e.preventDefault();
                    break;
            }
        });
    }
    
    applyTheme() {
        document.body.className = `theme-${this.currentTheme}`;
    }
    
    applySnakeSkin() {
        // Snake skin is applied during rendering
    }
    
    startGame() {
        this.showScreen('gameScreen');
        this.resetGame();
        this.isRunning = true;
        this.isPaused = false;
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }
    
    resetGame() {
        this.snake = [
            { x: 15, y: 15 },
            { x: 14, y: 15 },
            { x: 13, y: 15 },
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.speed = CONFIG.INITIAL_SPEED;
        this.updateScore();
        this.generateFood();
        this.draw();
    }
    
    update() {
        if (this.isPaused) return;
        
        this.direction = { ...this.nextDirection };
        
        const head = { 
            x: this.snake[0].x + this.direction.x, 
            y: this.snake[0].y + this.direction.y 
        };
        
        // Check collisions
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            this.createParticles(
                this.food.x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                this.food.y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2
            );
            
            // Increase speed
            if (this.speed > CONFIG.MIN_SPEED) {
                this.speed = Math.max(CONFIG.MIN_SPEED, this.speed - CONFIG.SPEED_INCREASE);
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= CONFIG.GRID_SIZE || 
            head.y < 0 || head.y >= CONFIG.GRID_SIZE) {
            return true;
        }
        
        // Self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
    
    generateFood() {
        let newFood;
        let isOnSnake;
        
        do {
            isOnSnake = false;
            newFood = {
                x: Math.floor(Math.random() * CONFIG.GRID_SIZE),
                y: Math.floor(Math.random() * CONFIG.GRID_SIZE),
            };
            
            for (let segment of this.snake) {
                if (newFood.x === segment.x && newFood.y === segment.y) {
                    isOnSnake = true;
                    break;
                }
            }
        } while (isOnSnake);
        
        this.food = newFood;
    }
    
    draw() {
        const theme = THEMES[this.currentTheme];
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars for space theme
        if (theme.stars && this.stars.length > 0) {
            this.drawStars();
        }
        
        // Draw grid
        if (theme.gridLines) {
            this.ctx.strokeStyle = theme.grid;
            this.ctx.lineWidth = 1;
            for (let i = 0; i <= CONFIG.GRID_SIZE; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * CONFIG.CELL_SIZE, 0);
                this.ctx.lineTo(i * CONFIG.CELL_SIZE, this.canvas.height);
                this.ctx.stroke();
                
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * CONFIG.CELL_SIZE);
                this.ctx.lineTo(this.canvas.width, i * CONFIG.CELL_SIZE);
                this.ctx.stroke();
            }
        }
        
        // Draw snake
        this.ctx.shadowBlur = 0;
        const snakeSkin = SNAKE_SKINS[this.currentSnakeSkin];
        this.snake.forEach((segment, index) => {
            snakeSkin.render(
                this.ctx,
                segment.x * CONFIG.CELL_SIZE,
                segment.y * CONFIG.CELL_SIZE,
                CONFIG.CELL_SIZE,
                theme,
                index,
                this.snake.length
            );
        });
        this.ctx.shadowBlur = 0;
        
        // Draw food
        const foodX = this.food.x * CONFIG.CELL_SIZE;
        const foodY = this.food.y * CONFIG.CELL_SIZE;
        
        if (theme.foodGlow) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = theme.food;
        }
        
        this.ctx.fillStyle = theme.food;
        this.ctx.beginPath();
        this.ctx.arc(
            foodX + CONFIG.CELL_SIZE / 2,
            foodY + CONFIG.CELL_SIZE / 2,
            CONFIG.CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    generateStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                opacity: Math.random(),
            });
        }
    }
    
    drawStars() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }
    
    createParticles(x, y) {
        const theme = THEMES[this.currentTheme];
        const particleContainer = document.getElementById('particleContainer');
        const colors = [theme.food, theme.snake, '#ffffff'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    updateScore() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('gameHighScore').textContent = this.highScore;
    }
    
    updateHighScoreDisplay() {
        document.getElementById('menuHighScore').textContent = this.highScore;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pauseOverlay');
        
        if (this.isPaused) {
            pauseOverlay.classList.add('active');
        } else {
            pauseOverlay.classList.remove('active');
        }
    }
    
    gameOver() {
        this.isRunning = false;
        clearInterval(this.gameLoop);
        
        // Check for new high score
        const isNewHighScore = this.score > this.highScore;
        if (isNewHighScore) {
            this.highScore = this.score;
            this.saveHighScore();
            document.getElementById('newHighScoreMsg').classList.remove('hidden');
        } else {
            document.getElementById('newHighScoreMsg').classList.add('hidden');
        }
        
        // Update final scores
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalHighScore').textContent = this.highScore;
        
        // Show game over screen
        setTimeout(() => {
            this.showScreen('gameOverScreen');
        }, 500);
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'welcomeScreen') {
            this.updateHighScoreDisplay();
        }
    }
    
    loadHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore')) || 0;
    }
    
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore);
    }
}

// Utility function to adjust color brightness
function adjustBrightness(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
