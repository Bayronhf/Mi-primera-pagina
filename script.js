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
        <div class="chat-bubble">${input}</div>
        <div class="chat-avatar user">
            <i class="fas fa-user"></i>
        </div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Limpiar input
    document.getElementById("userInput").value = "";
    
    // Mostrar indicador de escritura
    const typingMessage = document.createElement("div");
    typingMessage.className = "chat-message bot";
    typingMessage.innerHTML = `
        <div class="chat-avatar bot">
            <i class="fas fa-robot"></i>
        </div>
        <div class="chat-bubble">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    `;
    chatMessages.appendChild(typingMessage);
    
    // Scroll al fondo
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
            method: "POST",
            headers: {
                "Authorization": "Bearer ",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: "<|user|>\n" + input + "\n<|assistant|>"
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
                <i class="fas fa-robot"></i>
            </div>
            <div class="chat-bubble">
                ${data.error ? "Lo siento, hubo un error. Por favor, intenta de nuevo." : data.generated_text || "No pude generar una respuesta."}
            </div>
        `;
        chatMessages.appendChild(botMessage);
        
        // Scroll al fondo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        // Eliminar indicador de escritura
        chatMessages.removeChild(typingMessage);
        
        // Mostrar mensaje de error
        const errorMessage = document.createElement("div");
        errorMessage.className = "chat-message bot";
        errorMessage.innerHTML = `
            <div class="chat-avatar bot">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chat-bubble">
                Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.
            </div>
        `;
        chatMessages.appendChild(errorMessage);
    }
}

// Agregar evento para enviar con Enter
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        enviar();
    }
});

//juego 1//

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

let contador = 0

boton.addEventListener("click", function() {
   if (contador < 4) {
    let coloral = colorExad();
      color.textContent = coloral;
      document.getElementById("contenedor").style.backgroundColor = coloral;
      contador++}
      else {
        boton.style.display = "none";
        color.style.display = "none";

         const mensaje = document.createElement("p");
        mensaje.textContent = "ya 🤙";
        mensaje.style.fontWeight = "bold";
        mensaje.style.fontSize = "1.5rem";
        mensaje.style.color = "white";
        document.getElementById("contenedor").appendChild(mensaje);
      }
 }
)

//juego 2//
function toggleMenu(id) {
  const content = document.getElementById(id);
  content.style.display = (content.style.display === 'block') ? 'none' : 'block';
}

const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartButton = document.getElementById('restart');

let isJumping = false;
let gravity = 0.9;
let playerY = 0;
let playerVelocity = 0;
let obstacles = [];
let buildings = [];
let gameSpeed = 5;
let score = 0;
let gameActive = true;
let currentWalk = 1;
let walkFrameCounter = 0;
let jumpHeight = 15;

if (/Android/i.test(navigator.userAgent)) {
    jumpHeight = 11;
}

function jump() {
    if (!isJumping && gameActive) {
        isJumping = true;
        playerVelocity = -jumpHeight;
    }
}

function createObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${window.innerWidth}px`;
    game.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        x: window.innerWidth
    });
}

function createBuilding() {
    const building = document.createElement('div');
    building.classList.add('building');

    const height = Math.random() * 200 + 100;
    const width = Math.random() * 100 + 50;

    building.style.height = `${height}px`;
    building.style.width = `${width}px`;
    building.style.left = `${window.innerWidth}px`;

    game.appendChild(building);

    buildings.push({
        element: building,
        x: window.innerWidth,
        width: width
    });
}

function updatePlayer() {
    playerVelocity += gravity;
    playerY += playerVelocity;

    if (playerY > 0) {
        playerY = 0;
        isJumping = false;
        playerVelocity = 0;
    }

    player.style.bottom = `${50 - playerY}px`;
}

function animatePlayer() {
    if (isJumping) {
        player.style.backgroundImage = 'url("imagenes/saltar.png")';
    } else {
        walkFrameCounter++;
        if (walkFrameCounter > 5) {
            currentWalk = currentWalk === 1 ? 2 : 1;
            player.style.backgroundImage = `url("imagenes/caminar${currentWalk}.png")`;
            walkFrameCounter = 0;
        }
    }
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;
        obstacles[i].element.style.left = `${obstacles[i].x}px`;

        if (obstacles[i].x < -30) {
            obstacles[i].element.remove();
            obstacles.splice(i, 1);
            i--;
            continue;
        }

        if (gameActive && detectCollision(obstacles[i])) {
            gameOver();
        }
    }
}

function updateBuildings() {
    for (let i = 0; i < buildings.length; i++) {
        buildings[i].x -= gameSpeed * 0.5;
        buildings[i].element.style.left = `${buildings[i].x}px`;

        if (buildings[i].x < -buildings[i].width) {
            buildings[i].element.remove();
            buildings.splice(i, 1);
            i--;
        }
    }
}

function detectCollision(obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    return !(
        playerRect.right < obstacleRect.left || 
        playerRect.left > obstacleRect.right || 
        playerRect.bottom < obstacleRect.top || 
        playerRect.top > obstacleRect.bottom
    );
}

function updateScore() {
    score++;
    scoreElement.textContent = `Puntaje: ${score}`;

    if (score % 500 === 0) {
        gameSpeed += 0.5;
    }
}

function gameOver() {
    gameActive = false;
    gameOverElement.style.display = 'block';
}

function restart() {
    jumpHeight = /Android/i.test(navigator.userAgent) ? 11 : 15;
    obstacles.forEach(obstacle => obstacle.element.remove());
    obstacles = [];
    buildings.forEach(building => building.element.remove());
    buildings = [];

    score = 0;
    gameSpeed = 5;
    playerY = 0;
    playerVelocity = 0;
    isJumping = false;

    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';

    gameActive = true;
}

function gameLoop() {
    updatePlayer();
    updateObstacles();
    updateBuildings();
    animatePlayer();

    if (gameActive) {
        updateScore();

        if (Math.random() < 0.01) {
            createObstacle();
        }

        if (Math.random() < 0.005) {
            createBuilding();
        }
    }   else {
            player.style.backgroundImage = "url('imagenes/caminar1.png')";
        }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {if (gameActive) {
        jump();}
      else {restart();
      }
        event.preventDefault();
    }
});

game.addEventListener('mousedown', jump);
restartButton.addEventListener('click', restart);

for (let i = 0; i < 3; i++) {
    createBuilding();
}

gameLoop();




