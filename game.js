// =============================
// GET HTML ELEMENTS
// =============================

let game = document.getElementById("game");
let bird = document.getElementById("bird");
let scoreText = document.getElementById("score");
let gameOverScreen = document.getElementById("gameOver");
let finalScore = document.getElementById("finalScore");


// =============================
// BIRD VARIABLES
// =============================

let birdY = game.clientHeight * 0.4;

let velocity = 0;

let gravity = 0.5;

let flapStrength = -9;


// =============================
// PIPE VARIABLES
// =============================

let pipeSpeed = 4;

let pipeGap = 180;

let pipeWidth = 70;

let score = 0;


// =============================
// GAME STATE
// =============================

let gameOver = false;


// =============================
// FLAP
// =============================

function flap() {

    if (gameOver) {
        restartGame();
        return;
    }

    velocity = flapStrength;
}


// =============================
// SPACE KEY
// =============================

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        flap();
    }

});


// =============================
// CREATE PIPE
// =============================

function createPipe() {

    let minimumHeight = 80;

    let maximumHeight =
        game.clientHeight - pipeGap - minimumHeight;

    let topHeight =
        Math.random() *
        (maximumHeight - minimumHeight)
        + minimumHeight;


    // TOP PIPE

    let topPipe = document.createElement("div");

    topPipe.classList.add("pipe");

    topPipe.style.height =
        topHeight + "px";


    // BOTTOM PIPE

    let bottomPipe = document.createElement("div");

    bottomPipe.classList.add("pipe");

    bottomPipe.style.height =
        (game.clientHeight - topHeight - pipeGap) + "px";

    bottomPipe.style.top =
        (topHeight + pipeGap) + "px";


    // START OUTSIDE RIGHT SIDE

    let pipeX =
        game.clientWidth + pipeWidth;


    topPipe.style.left =
        pipeX + "px";

    bottomPipe.style.left =
        pipeX + "px";


    // ADD TO GAME

    game.appendChild(topPipe);

    game.appendChild(bottomPipe);


    let passed = false;


    // MOVE PIPE

    function movePipe() {

        if (gameOver) {
            return;
        }


        pipeX -= pipeSpeed;


        topPipe.style.left =
            pipeX + "px";

        bottomPipe.style.left =
            pipeX + "px";


        // =============================
        // COLLISION
        // =============================

        let birdRect =
            bird.getBoundingClientRect();

        let topRect =
            topPipe.getBoundingClientRect();

        let bottomRect =
            bottomPipe.getBoundingClientRect();


        let hitTop =
            birdRect.right > topRect.left &&
            birdRect.left < topRect.right &&
            birdRect.top < topRect.bottom;


        let hitBottom =
            birdRect.right > bottomRect.left &&
            birdRect.left < bottomRect.right &&
            birdRect.bottom > bottomRect.top;


        if (hitTop || hitBottom) {

            endGame();

            return;
        }


        // =============================
        // SCORE
        // =============================

        if (
            !passed &&
            pipeX + pipeWidth < bird.offsetLeft
        ) {

            passed = true;

            score++;

            scoreText.textContent = score;
        }


        // =============================
        // REMOVE OLD PIPES
        // =============================

        if (pipeX < -pipeWidth) {

            topPipe.remove();

            bottomPipe.remove();

            return;
        }


        requestAnimationFrame(movePipe);
    }


    requestAnimationFrame(movePipe);
}


// =============================
// BIRD GAME LOOP
// =============================

function gameLoop() {

    if (!gameOver) {

        // GRAVITY

        velocity += gravity;


        // MOVE BIRD

        birdY += velocity;


        // TOP OF SCREEN

        if (birdY < 0) {

            birdY = 0;

            velocity = 0;
        }


        // BOTTOM OF SCREEN

       if (
    birdY + bird.offsetHeight >
    game.clientHeight
) {
    birdY =
        game.clientHeight -
        bird.offsetHeight;

    velocity = 0;
}


        // APPLY POSITION

        bird.style.top =
            birdY + "px";
    }


    requestAnimationFrame(gameLoop);
}


// =============================
// GAME OVER
// =============================

function endGame() {

    if (gameOver) {
        return;
    }

    gameOver = true;


    // SHOW FINAL SCORE

    finalScore.textContent = score;


    // SHOW GAME OVER SCREEN

    gameOverScreen.style.display =
        "block";
}


// =============================
// RESTART GAME
// =============================

function restartGame() {

    // REMOVE ALL PIPES

    let pipes =
        document.querySelectorAll(".pipe");

    pipes.forEach(function(pipe) {
        pipe.remove();
    });


    // RESET BIRD

    birdY =
        game.clientHeight * 0.4;

    velocity = 0;


    // RESET SCORE

    score = 0;

    scoreText.textContent = "0";

    finalScore.textContent = "0";


    // RESET BIRD POSITION

    bird.style.top =
        birdY + "px";


    // HIDE GAME OVER

    gameOverScreen.style.display =
        "none";


    // START GAME AGAIN

    gameOver = false;
}


// =============================
// CREATE PIPES
// =============================

setInterval(function() {

    if (!gameOver) {

        createPipe();
    }

}, 1800);


// =============================
// START GAME
// =============================

gameLoop();