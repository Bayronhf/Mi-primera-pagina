//para el monito//
function scrollToClass(className) {
    const element = document.querySelector('.' + className);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

//el chatbot//

async function enviar() {
    const input = document.getElementById("userInput").value;
    if (!input.trim()) return;

    const chatMessages = document.getElementById("chat-messages");
    
    // Agregar mensaje del usuario
    const userMessage = document.createElement("div");
    userMessage.className = "chat-message user";
    userMessage.innerHTML = `
        <div class="chat-avatar user">
            <img src="imagenes/logo.png" alt="avatar1" class="avatar1">
        </div>
        <div class="chat-bubble">${input}</div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Limpiar input
    document.getElementById("userInput").value = "";
    
    // Mostrar indicador de escritura
    const typingMessage = document.createElement("div");
    typingMessage.className = "chat-message bot";
    typingMessage.innerHTML = `
        <div class="chat-avatar bot">
            <img src="https://www.pngplay.com/wp-content/uploads/13/Robot-Head-Transparent-Images.png" class="avatar2" alt="avatar2">
        </div>
        <div class="chat-bubble">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    `;
    chatMessages.appendChild(typingMessage);
    
    // Scroll al fondo
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
            method: "POST",
            headers: {
                "Authorization": "Bearer ",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: input
            })
        });

        const data = await response.json();
        
        // Eliminar indicador de escritura
        chatMessages.removeChild(typingMessage);
        
        // Agregar respuesta del bot
        const botMessage = document.createElement("div");
        botMessage.className = "chat-message bot";
        botMessage.innerHTML = `
            <div class="chat-avatar bot">
               <img src="https://www.pngplay.com/wp-content/uploads/13/Robot-Head-Transparent-Images.png" class="avatar2" alt="avatar2">
            </div>
            <div class="chat-bubble">
                ${data.error ? "En mantenimiento..." : data.generated_text || "En mantenimiento..."}
            </div>
        `;
        chatMessages.appendChild(botMessage);
        
        // Scroll al fondo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {

        chatMessages.removeChild(typingMessage);
        
        const errorMessage = document.createElement("div");
        errorMessage.className = "chat-message bot";
        errorMessage.innerHTML = `
            <div class="chat-avatar bot">
                <img src="https://www.pngplay.com/wp-content/uploads/13/Robot-Head-Transparent-Images.png" class="avatar2" alt="avatar2">
            </div>
            <div class="chat-bubble">
                En mantenimiento...
            </div>
        `;
        chatMessages.appendChild(errorMessage);
    }
}

/*Agregar evento para enviar con Enter
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        enviar();
    }
});*/

//juego 1
const color = document.getElementById('color');
const boton = document.getElementById("boton");

function colorExad() {
    let digitos = "0123456789abcdef";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        let indiceal = Math.floor(Math.random() * 16);
        color += digitos[indiceal];
    }
    return color;
}

let contador = 0;

boton.addEventListener("click", function() {
    if (contador < 4) {
        let coloral = colorExad();
        color.textContent = coloral;
        document.getElementById("contenedor").style.backgroundColor = coloral;
        contador++;
    } else {
        boton.style.display = "none";
        color.style.display = "none";
        const mensaje = document.createElement("p");
        mensaje.textContent = "ya 🤙";
        mensaje.style.fontWeight = "bold";
        mensaje.style.fontSize = "1.5rem";
        mensaje.style.color = "white";
        document.getElementById("contenedor").appendChild(mensaje);
    }
});

//juego 2
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let gameStarted = false;
let timer = 0;
let timerInterval;

function createMemoryGame() {
    const gameContainer = document.getElementById('original');
    if (!gameContainer) return;

    gameContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <span id="memory-timer" style="font-size: 24px; color: #18bc9c;">Tiempo: 0s</span>
            <span id="memory-pairs" style="font-size: 24px; color: #18bc9c; margin-left: 20px;">Pares: 0/6</span>
        </div>
        <div id="memory-game"></div>
        <div style="text-align: center";>
        <button id="start-memory" style="margin-top: 20px; padding: 20px 30px; background-color:hsl(168, 62.90%, 32.70%); color: white; border: none; border-radius: 5px; cursor: pointer;">Empezar</button>
        </div>
        `;

    const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎮', '🎲', '🎯', '🎪', '🎨', '🎭'];
    cards = emojis.sort(() => Math.random() - 0.5);

    const gameBoard = document.getElementById('memory-game');
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.innerHTML = `<span style="display: none;">${emoji}</span>`;
        card.dataset.index = index;
        card.onclick = () => flipCard(card);
        gameBoard.appendChild(card);
    });

    document.getElementById('start-memory').onclick = startMemoryGame;
}

function startMemoryGame() {
    if (gameStarted) return;
    gameStarted = true;
    document.getElementById('start-memory').style.display = 'none';
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('memory-timer').textContent = `Tiempo: ${timer}s`;
    }, 1000);
    
    const cards = document.querySelectorAll('#memory-game div');
    cards.forEach(card => {
        card.style.backgroundColor = '#3498db';
    });
}

function flipCard(card) {
    if (!gameStarted || !canFlip || flippedCards.includes(card) || card.classList.contains('matched')) return;

    card.style.transform = 'rotateY(180deg)';
    card.style.backgroundColor = 'white';
    card.querySelector('span').style.display = 'block';
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        const [card1, card2] = flippedCards;
        const match = card1.querySelector('span').textContent === card2.querySelector('span').textContent;

        setTimeout(() => {
            if (match) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.style.backgroundColor = '#18bc9c';
                card2.style.backgroundColor = '#18bc9c';
                matchedPairs++;
                document.getElementById('memory-pairs').textContent = `Pares: ${matchedPairs}/6`;

                if (matchedPairs === 6) {
                    clearInterval(timerInterval);
                    setTimeout(() => {
                        alert(`Ganaste en ${timer} segundos`);
                        resetMemoryGame();
                    }, 500);
                }
            } else {
                card1.style.transform = '';
                card2.style.transform = '';
                card1.style.backgroundColor = '#3498db';
                card2.style.backgroundColor = '#3498db';
                card1.querySelector('span').style.display = 'none';
                card2.querySelector('span').style.display = 'none';
            }
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function resetMemoryGame() {
    gameStarted = false;
    matchedPairs = 0;
    flippedCards = [];
    canFlip = true;
    clearInterval(timerInterval);
    createMemoryGame();
}

//juego 3
let isGameActive = true;
let playerX = 50;
let playerY = 200;
let bullets = [];
let enemies = [];
let stars = [];
let powerUps = [];
let gameScore = 0;
let playerHealth = 100;
let hasShield = false;
let rapidFire = false;
let lastShot = 0;

function initializeSpaceGame() {
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    const player = document.getElementById('player');
    if (!player) return;

    player.style.backgroundImage = 'none';
    player.style.backgroundColor = '#18bc9c';
    player.style.borderRadius = '5px';
    player.style.width = '40px';
    player.style.height = '40px';
    player.style.boxShadow = '0 0 10px #18bc9c';
    
    createStars();
    createGameUI();

    // Mouse/touch control
    gameElement.addEventListener('mousemove', (e) => {
        if (!isGameActive) return;
        const rect = gameElement.getBoundingClientRect();
        playerX = Math.max(0, Math.min(e.clientX - rect.left - 20, gameElement.offsetWidth - 40));
        playerY = Math.max(0, Math.min(e.clientY - rect.top - 20, gameElement.offsetHeight - 40));
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    });

    // Touch control
    gameElement.addEventListener('touchmove', (e) => {
        if (!isGameActive) return;
        e.preventDefault();
        const rect = gameElement.getBoundingClientRect();
        const touch = e.touches[0];
        playerX = Math.max(0, Math.min(touch.clientX - rect.left - 20, gameElement.offsetWidth - 40));
        playerY = Math.max(0, Math.min(touch.clientY - rect.top - 20, gameElement.offsetHeight - 40));
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    });

    // Shooting control
    gameElement.addEventListener('click', shoot);
    gameElement.addEventListener('touchstart', shoot);
}

function createGameUI() {
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    const healthBar = document.createElement('div');
    healthBar.id = 'health-bar';
    
    const healthFill = document.createElement('div');
    healthFill.id = 'health-fill';
    
    healthBar.appendChild(healthFill);
    gameElement.appendChild(healthBar);
}

function createStars() {
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        stars.push({
            element: star,
            speed: Math.random() * 2 + 1
        });
        gameElement.appendChild(star);
    }
}

function shoot() {
    if (!isGameActive || Date.now() - lastShot < (rapidFire ? 150 : 300)) return;
    
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    lastShot = Date.now();
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${playerX + 40}px`;
    bullet.style.top = `${playerY + 18}px`;
    gameElement.appendChild(bullet);
    bullets.push({
        element: bullet,
        x: playerX + 40,
        y: playerY + 18
    });
}

function createEnemy() {
    if (!isGameActive) return;
    
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.right = '0';
    enemy.style.top = `${Math.random() * (gameElement.offsetHeight - 30)}px`;
    gameElement.appendChild(enemy);
    enemies.push({
        element: enemy,
        x: gameElement.offsetWidth,
        y: parseFloat(enemy.style.top),
        speed: Math.random() * 2 + 2
    });
}

function createPowerUp() {
    if (!isGameActive) return;
    
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    const types = ['shield', 'rapidFire', 'health'];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = {
        shield: '#f1c40f',
        rapidFire: '#9b59b6',
        health: '#2ecc71'
    };
    
    const powerUp = document.createElement('div');
    powerUp.className = 'power-up';
    powerUp.style.backgroundColor = colors[type];
    powerUp.style.right = '0';
    powerUp.style.top = `${Math.random() * (gameElement.offsetHeight - 20)}px`;
    powerUp.dataset.type = type;
    gameElement.appendChild(powerUp);
    powerUps.push({
        element: powerUp,
        x: gameElement.offsetWidth,
        y: parseFloat(powerUp.style.top),
        type: type
    });
}

function updateGame() {
    if (!isGameActive) return;

    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    const player = document.getElementById('player');
    if (!player) return;

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.x += 10;
        bullet.element.style.left = `${bullet.x}px`;
        
        if (bullet.x > gameElement.offsetWidth) {
            bullet.element.remove();
            bullets.splice(index, 1);
        }
    });

    // Update enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.x -= enemy.speed;
        enemy.element.style.left = `${enemy.x}px`;
        
        // Check bullet collisions
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                enemy.element.remove();
                enemies.splice(enemyIndex, 1);
                bullet.element.remove();
                bullets.splice(bulletIndex, 1);
                gameScore += 10;
                document.getElementById('score').textContent = `Puntaje: ${gameScore}`;
            }
        });
        
        // Check player collision
        if (checkCollision({x: playerX, y: playerY, width: 40, height: 40}, enemy)) {
            if (hasShield) {
                hasShield = false;
                player.style.boxShadow = '0 0 10px #18bc9c';
                enemy.element.remove();
                enemies.splice(enemyIndex, 1);
            } else {
                playerHealth -= 20;
                document.getElementById('health-fill').style.width = `${playerHealth}%`;
                if (playerHealth <= 0) {
                    gameOver();
                }
            }
        }
        
        if (enemy.x < -30) {
            enemy.element.remove();
            enemies.splice(enemyIndex, 1);
        }
    });

    // Update power-ups
    powerUps.forEach((powerUp, index) => {
        powerUp.x -= 3;
        powerUp.element.style.left = `${powerUp.x}px`;
        
        if (checkCollision({x: playerX, y: playerY, width: 40, height: 40}, powerUp)) {
            switch (powerUp.type) {
                case 'shield':
                    hasShield = true;
                    player.style.boxShadow = '0 0 20px #f1c40f';
                    break;
                case 'rapidFire':
                    rapidFire = true;
                    setTimeout(() => rapidFire = false, 5000);
                    break;
                case 'health':
                    playerHealth = Math.min(100, playerHealth + 30);
                    document.getElementById('health-fill').style.width = `${playerHealth}%`;
                    break;
            }
            powerUp.element.remove();
            powerUps.splice(index, 1);
        }
        
        if (powerUp.x < -20) {
            powerUp.element.remove();
            powerUps.splice(index, 1);
        }
    });

    updateStars();
}

function updateStars() {
    stars.forEach(star => {
        let left = parseFloat(star.element.style.left);
        left -= star.speed;
        if (left < 0) {
            left = 100;
            star.element.style.top = `${Math.random() * 100}%`;
        }
        star.element.style.left = `${left}%`;
    });
}

function checkCollision(obj1, obj2) {
    return !(obj1.x + obj1.width < obj2.x || 
             obj1.x > obj2.x + 30 ||
             obj1.y + obj1.height < obj2.y ||
             obj1.y > obj2.y + 30);
}

function gameOver() {
    isGameActive = false;
    const gameOverElement = document.getElementById('gameOver');
    if (!gameOverElement) return;

    gameOverElement.style.display = 'block';
    const finalScore = document.createElement('p');
    finalScore.textContent = `Puntaje: ${gameScore}`;
    finalScore.style.color = 'white';
    finalScore.style.fontSize = '20px';
    gameOverElement.appendChild(finalScore);
}

function restartGame() {
    const gameElement = document.getElementById('game');
    if (!gameElement) return;

    // Clear all game elements
    bullets.forEach(bullet => bullet.element.remove());
    enemies.forEach(enemy => enemy.element.remove());
    powerUps.forEach(powerUp => powerUp.element.remove());
    stars.forEach(star => star.element.remove());
    
    // Reset game state
    bullets = [];
    enemies = [];
    powerUps = [];
    stars = [];
    gameScore = 0;
    playerHealth = 100;
    hasShield = false;
    rapidFire = false;
    playerX = 50;
    playerY = 200;
    
    // Reset UI
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('health-fill').style.width = '100%';
    document.getElementById('gameOver').style.display = 'none';
    
    isGameActive = true;
    initializeSpaceGame();
}

// Game loop
function gameLoop() {
    if (isGameActive) {
        updateGame();
        
        if (Math.random() < 0.02) {
            createEnemy();
        }
        
        if (Math.random() < 0.005) {
            createPowerUp();
        }
    }
    requestAnimationFrame(gameLoop);
}

// Initialize games when the page loads
window.onload = function() {
    createMemoryGame();
    initializeSpaceGame();
    document.querySelector('#restart').addEventListener('click', restartGame);
    
    gameLoop();
};
