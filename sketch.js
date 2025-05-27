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
  let buildings = [];
  let score = 0;
  
  

function drawScore() {
  p.fill(0);
  p.textSize(24);
  p.text("Puntaje: " + score, 10, 30);
}

  p.preload = function() {
    caminar1 = p.loadImage('imagenes/caminar1.png');
    caminar2 = p.loadImage('imagenes/caminar2.png');
    saltar = p.loadImage('imagenes/saltar.png');
  };

  p.setup = function() {
     p.createCanvas(1080, 300).parent("sketch");

    groundY = p.height - 50;
    playerY = groundY - 100;
  };

  p.draw = function() {
    p.background(255);

    p.fill(200);
    p.rect(0, groundY, p.width, p.height - groundY);

    velocity += gravity;
    playerY += velocity;

    if (playerY >= groundY - 100) {
      playerY = groundY - 100;
      velocity = 0;
      isJumping = false;

      score += 100000000;
drawScore();
    }

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