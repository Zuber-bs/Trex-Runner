// Trex
var trex, trexAnimation;
var trexVelY;
var jumpSound;
var trexCollide;
var dead;

// Ground
var ground, groundImg;
var invisibleGround;

// Obstacles
var obstacle, obstacleGroup;
var obstacle1;
var obstacle2;
var obstacle3;
var obstacle4;
var obstacle5;
var obstacle6;

// Game
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImg;
var restart, restartImg;
var score = 0;
var checkpoint;
var fps = 30;

// Cloud
var cloud, cloudImg;

function preload() {
    // Trex
    trexAnimation = loadAnimation("trex1.png", "trex2.png", "trex3.png");
    jumpSound = loadSound("jump.mp3");
    trexCollide = loadAnimation("trex_collided.png")
    dead = loadSound("die.mp3");

    // Ground
    groundImg = loadImage("ground.png");

    // Obstacles
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    obstacleGroup = createGroup();

    // Cloud
    cloudImg = loadImage("cloud.png");

    // Game
    restartImg = loadImage("restart.png");
    gameOverImg = loadImage("gameOver.png");
    checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
    createCanvas(600, 200);

    // Trex
    trex = createSprite(50, 160);
    trex.addAnimation("run", trexAnimation);
    trex.scale = 0.5;

    // Ground
    ground = createSprite(0, 180);
    ground.addImage(groundImg);
    ground.velocityX = -7;

    // Invisible ground
    invisibleGround = createSprite(0, 195, 200, 25);
    invisibleGround.visible = false;

    // Game
    restart = createSprite(300, 130);
    restart.addImage(restartImg);
    restart.scale = 0.5;
    restart.visible = false;

    gameOver = createSprite(300, 70);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.7;
    gameOver.visible = false;
}

function draw() {
    background(255);
    drawSprites();

    frameRate(fps);


    text("Score: " + score, 520, 30);

    if(score !== 0) {
        if(score % 100 === 0) {
            checkpoint.play();
        }
    }

    if(score % 100 === 0) {
        fps += 1;
    }


    if(gameState === PLAY) {
        // Trex
        trex.collide(invisibleGround);

        if(trex.y > 158) {
            if(keyDown("space")) {
                trex.velocityY  = -13;
                jumpSound.play();
            }
        }
        trex.velocityY += 0.8;

        if(trex.isTouching(obstacleGroup)) {
            gameState = END;
            dead.play();
        }

        // Ground
        if(ground.x < -50) {
            ground.x = 1200;
        }

        // Obstacles
        spawnObstacles();

        // Clouds
        spawnCloud();

        // Game
        score = Math.round(frameCount/2);
    }

    if(gameState === END) {

        // Trex
        trex.collide(invisibleGround);
        trex.addAnimation("run", trexCollide);
        trex.velocityY = 0;

        // Ground
        ground.velocityX = 0;

        // Obstacles
        obstacleGroup.setVelocityEach(0, 0);
        obstacleGroup.destroyEach();

        // Clouds
        cloud.velocityX = 0;
        cloud.lifetime = 0;

        // Game
        gameOver.visible = true;
        restart.visible = true;

        if(mouseIsPressed) {
            if(mouseIsOver(restart)) {
                restartGame();
            }
        }
    }

}

function restartGame() {
    gameState = PLAY;
    obstacleGroup.add(obstacle);

    // Trex
    trex.addAnimation("run", trexAnimation);

    // Ground
    ground.velocityX = -7;

    // Game
    restart.visible = false;
    gameOver.visible = false;
    score = 0;
    frameCount = 0;
    fps = 30;
}

function spawnObstacles() {
    if(frameCount % 100 === 0) {
        var rand = Math.round(random(1, 6));
        obstacle = createSprite(630, 160);
        obstacle.scale = 0.6;
        obstacle.velocityX = -7;

        switch(rand){
            case 1:
                obstacle.addImage(obstacle1);
                break;

            case 2:
                obstacle.addImage(obstacle2);
                break;

            case 3:
                obstacle.addImage(obstacle3);
                break;

            case 4:
                obstacle.addImage(obstacle4);
                break;

            case 5:
                obstacle.addImage(obstacle5);
                break;

            case 6:
                obstacle.addImage(obstacle6);
                break;

        }

        obstacleGroup.add(obstacle);
    }
}

function spawnCloud() {
    if(frameCount % 80 === 0) {
        cloud = createSprite(630, 50);
        cloud.addImage(cloudImg);
        cloud.velocityX = -4;
        cloud.scale = 0.5;
    }
}
