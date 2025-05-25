/*let fondo;
let fondoX = 0;

let caminar1, caminar2, saltar;
let currentWalk = 1;
let walkCounter = 0;

let playerX = 100;
let playerY = 0;
let velocity = 0;
let gravity = 0.9;
let jumpHeight = 15;
let isJumping = false;
let fondoSpeed = 4;

let obstaculos = [];
let obstaculoImg;

function preload() {
  fondo = loadImage('imagenes/fondo.png');
  caminar1 = loadImage('imagenes/caminar1.png');
  caminar2 = loadImage('imagenes/caminar2.png');
  saltar = loadImage('imagenes/saltar.png');
  obstaculoImg = loadImage('imagenes/obstaculo.png'); // agrega una imagen de obstáculo
}

function setup() {
  createCanvas(1116, 300).parent('sketch');
}

function draw() {
  // Mover fondo
  fondoX -= fondoSpeed;
  if (fondoX <= -width) fondoX = 0;

  image(fondo, fondoX, 0, width, height);
  image(fondo, fondoX + width, 0, width, height);

  // Simular gravedad
  velocity += gravity;
  playerY += velocity;

  if (playerY > 0) {
    playerY = 0;
    velocity = 0;
    isJumping = false;
  }

  // Suelo
  fill(200);
  rect(0, height - 50, width, 50);

  // Animación del jugador
  if (isJumping) {
    image(saltar, playerX, height - 100 - playerY);
  } else {
    walkCounter++;
    if (walkCounter > 10) {
      currentWalk = currentWalk === 1 ? 2 : 1;
      walkCounter = 0;
    }
    let frame = currentWalk === 1 ? caminar1 : caminar2;
    image(frame, playerX, height - 100 - playerY);
  }

  // Obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let ob = obstaculos[i];
    ob.x -= fondoSpeed;

    image(obstaculoImg, ob.x, height - 80, 40, 40);

    // Colisión
    if (
      playerX + 40 > ob.x &&
      playerX < ob.x + 40 &&
      playerY < 30
    ) {
      noLoop(); // Detiene el juego
      fill(255, 0, 0);
      textSize(32);
      text('¡Perdiste!', width / 2 - 70, height / 2);
    }

    if (ob.x < -50) {
      obstaculos.splice(i, 1);
    }
  }

  // Crear obstáculo aleatoriamente
  if (frameCount % 90 === 0) {
    obstaculos.push({ x: width });
  }
}

function keyPressed() {
  if (key === ' ' && !isJumping) {
    isJumping = true;
    velocity = -jumpHeight;
  }
}

function touchStarted() {
  if (!isJumping) {
    isJumping = true;
    velocity = -jumpHeight;
  }
}*/

new p5(function(p) {
  let caminar1, caminar2, saltar;
  let currentWalk = 1;
  let walkCounter = 0;

  let playerX = 100;
  let playerY = 0;
  let velocity = 0;
  let gravity = 0.9;
  let jumpHeight = 15;
  let isJumping = false;

  let groundY;

  p.preload = function() {
    caminar1 = p.loadImage('imagenes/caminar1.png');
    caminar2 = p.loadImage('imagenes/caminar2.png');
    saltar = p.loadImage('imagenes/saltar.png');
  };

  p.setup = function() {
    p.createCanvas(1116, 300).parent("sketch");
    groundY = p.height - 50;
    playerY = groundY - 100;
  };

  p.draw = function() {
    p.background(255);

    // Dibujar suelo
    p.fill(200);
    p.rect(0, groundY, p.width, p.height - groundY);

    // Gravedad y salto
    velocity += gravity;
    playerY += velocity;

    if (playerY >= groundY - 100) {
      playerY = groundY - 100;
      velocity = 0;
      isJumping = false;
    }

    // Dibujar jugador
    if (isJumping) {
      p.image(saltar, playerX, playerY);
    } else {
      walkCounter++;
      if (walkCounter > 10) {
        currentWalk = currentWalk === 1 ? 2 : 1;
        walkCounter = 0;
      }
      let frame = currentWalk === 1 ? caminar1 : caminar2;
      p.image(frame, playerX, playerY);
    }
  };

  p.touchStarted = function() {
    if (!isJumping) {
      isJumping = true;
      velocity = -jumpHeight;
    }
  };
});
