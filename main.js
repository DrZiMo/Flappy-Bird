const gameBoard = document.querySelector('.game-board');
const welcome = document.querySelector('.welcome');
const score = document.querySelector('.score');
const scoreImgH = document.getElementById('score-img1');
const scoreImgT = document.getElementById('score-img2');
const scoreImgO = document.getElementById('score-img3');
const bird = document.querySelector('.bird');
const birdImg = document.getElementById('bird-img');
const ground = document.querySelector('.ground');

let gravity = 4;
let jumpHeight = 110; // 35
let posiY = 0;
let scoreCounter = 0;
let isPlaying = false;
let speed = 5;
let birdMovement = [
    'downflap',
    'midflap',
    'upflap'
];
let birdColor = 'yellow';

let currentFrame = 0;
const frameDuration = 200;

// let pipeX;
let pipeWaitingTime = 2000; // in milliseconds
let pipeSpeed = 5;
let pipeGenerationSpeed;
const maxPipeGenerationSpeed = 2500;
const minPipeGenerationSpeed = 1500;
const minPipeHeight = 146;
const maxPipeHeight = 25;

window.onload = welcomePage();

function welcomePage() {
    welcome.style.setProperty('display', 'flex');
    score.style.setProperty('display', 'none');
    bird.style.setProperty('display', 'none');
    gameBoard.addEventListener('click', startGame);
    window.addEventListener('keydown', checkKey);
}

function checkKey(e) {
    let key = e.keyCode;

    // space = 32
    if (key == 32) {
        startGame()
        window.removeEventListener('keydown', checkKey);
        gameBoard.removeEventListener('click', startGame);
    }
}

function startGame() {
    isPlaying = true;
    window.removeEventListener('keydown', checkKey);
    gameBoard.removeEventListener('click', startGame)
    scoreImgH.style.setProperty('display', 'none');
    scoreImgT.style.setProperty('display', 'none');
    scoreImgO.style.setProperty('display', 'inline');
    welcome.style.setProperty('display', 'none');
    score.style.setProperty('display', 'block');
    bird.style.setProperty('display', 'block');
    moveBird();
    birdControl();
    applyGravity();
    // setTimeout(upplyGravity, 1000)
    setTimeout(generatePipes, pipeWaitingTime)
    ground.style = `animation: move ${speed}s linear infinite;`;
    console.log("started the game");
}

function moveBird() {
    if (isPlaying) {
        const path = 'flappy-bird-assets/sprites/';
        birdImg.src = `${path}${birdColor}bird-${birdMovement[currentFrame]}.png`

        currentFrame = (currentFrame + 1) % birdMovement.length;
        setTimeout(moveBird, frameDuration)
    }
}



function generatePipes() {
    let pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    if (isPlaying) {
        const pipes = document.createElement('div');
        pipes.className = "pipes";
        gameBoard.appendChild(pipes);

        const upperPipe = document.createElement('div');
        upperPipe.className = "upper-pipe";
        upperPipe.style = `height: ${pipeHeight}%`
        pipes.appendChild(upperPipe);

        const lowerPipe = document.createElement('div');
        lowerPipe.className = "lower-pipe";
        pipes.appendChild(lowerPipe);
        movePipes()
        managePipes();
    }
}

function movePipes() {
    pipeGenerationSpeed = Math.floor(Math.random() * (maxPipeGenerationSpeed - minPipeGenerationSpeed + 1)) + minPipeGenerationSpeed;
    const pipes = document.querySelectorAll('.pipes');
    pipes.style = `animation: none`;
    if (isPlaying) {
        pipes.forEach(pipe => {
            pipe.style = `animation: movePipe ${pipeSpeed}s linear;`;
        })
        setTimeout(generatePipes, pipeGenerationSpeed);
    }
}

function managePipes() {
    const pipes = document.querySelectorAll('.pipes');

    if (pipes.length > 5) {
        const oldestPipe = pipes[0];
        oldestPipe.remove();
    }
}

setInterval(() => {
    // checkCollision();
    updateScore();
}, 100)

function updateScore() {
    const pipes = document.querySelectorAll('.pipes');
    const birdRect = bird.getBoundingClientRect();
    
    pipes.forEach(pipe => {
        let pipeRect = pipe.getBoundingClientRect();
        let pipeX = pipeRect.x;

        // the 40 that is added to pipeX is to enture that the bird has completely passed the pipe
        if (birdRect.x > (pipeX + 40) && !pipe.hasAttribute('scored')) {
            scoreCounter++;
            pipe.setAttribute('scored', 'true');
            changeTheScoreImg(scoreCounter);
        }
    })
}

function changeTheScoreImg(score) {
    let path = "flappy-bird-assets/sprites/";
    if(score < 10) {
        scoreImgO.src = `${path}${score}.png`;
    }
    else if (score > 9 && score < 100) {
        scoreImgT.style.setProperty('display', 'inline');
        let tens = Math.floor(score / 10);
        let ones = score % 10;

        scoreImgT.src = `${path}${tens}.png`;
        scoreImgO.src = `${path}${ones}.png`
    }
    else if (score > 99 && score < 1000) {
        scoreImgT.style.setProperty('display', 'inline');
        scoreImgH.style.setProperty('display', 'inline');
        let hundreds = Math.floor(score / 100);
        let tens = Math.floor((score % 100) / 10);
        let ones = score % 10;

        scoreImgH.src = `${path}${hundreds}.png`;
        scoreImgT.src = `${path}${tens}.png`;
        scoreImgO.src = `${path}${ones}.png`
    }
}

function birdControl() {
    gameBoard.onclick = () => {
        posiY -= jumpHeight;
    }
}

function applyGravity() {
    if (isPlaying) {
        checkCollision();
        bird.style = `transform: translateY(${posiY}px)`
        posiY += gravity;
        requestAnimationFrame(applyGravity);
        // setTimeout(applyGravity, 1);
    }
    return posiY;
}

function checkCollision() {
    const pipes = document.querySelectorAll('.pipes');
    const upperPipes = document.querySelectorAll('.upper-pipe');
    const lowerPipes = document.querySelectorAll('.lower-pipe');

    
    const groundRect = ground.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    // check if the bird touches the ground
    if (birdRect.bottom >= groundRect.top) {
        gameOver();
    }

    upperPipes.forEach((upperPipe) => {
        const upperPipeRect = upperPipe.getBoundingClientRect();
        // const lowerPipeRect = lowerPipe.getBoundingClientRect();
        if (birdRect.left < upperPipeRect.right && birdRect.right > upperPipeRect.left &&
            birdRect.top < upperPipeRect.bottom && birdRect.bottom > upperPipeRect.top) {
            gameOver();
        }
    })

    lowerPipes.forEach((lowerPipe) => {
        const lowerPipeRect = lowerPipe.getBoundingClientRect();
        if (birdRect.left < lowerPipeRect.right && birdRect.right > lowerPipeRect.left &&
            birdRect.top < lowerPipeRect.bottom && birdRect.bottom > lowerPipeRect.top) {
            gameOver();
        }
    })
}

function gameOver() {
    fallAnimation();
    isPlaying = false;
    birdImg.src = "flappy-bird-assets/sprites/yellowbird-midflap.png";
    ground.style.animation = "none";
    
    const pipes = document.querySelectorAll('.pipes');
    pipes.forEach((pipe) => {
        pipe.style = `animation: movePipe ${pipeSpeed}s linear; animation-play-state: paused;`;
    })

    console.log("Game Over");
}

function fallAnimation() {
    const targetY = 136;
    const fallSpeed = 10;

    function animateFall() {
        if (posiY < targetY) {
            posiY += fallSpeed;
            bird.style.transform = `translateY(${posiY}px)`;

            requestAnimationFrame(animateFall);
        } else {
            posiY = targetY;
            bird.style.transform = `translateY(${posiY}px)`;
        }
    }

    animateFall();
}