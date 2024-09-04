const gameBoard = document.querySelector('.game-board');
const welcome = document.querySelector('.welcome');
const score = document.querySelector('.score');
const scoreImg = document.getElementById('score-img');
const bird = document.querySelector('.bird');
const birdImg = document.getElementById('bird-img');
const ground = document.querySelector('.ground');

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
let pipeSpeed = 5;
let pipeGenerationSpeed;
const maxPipeGenerationSpeed = 2000;
const minPipeGenerationSpeed = 900;
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
    welcome.style.setProperty('display', 'none');
    score.style.setProperty('display', 'block');
    bird.style.setProperty('display', 'block');
    moveBird();
    setTimeout(generatePipes, 2000)
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
            let rect = pipe.getBoundingClientRect();
            let pipeX = rect.x;

            if(pipeX <= 521) {
                scoreCounter += 1;
                
            }

            pipe.style = `animation: movePipe ${pipeSpeed}s linear;`;
        })
        // setTimeout(generatePipes, pipeGenerationSpeed);
    }
}

function managePipes() {
    const pipes = document.querySelectorAll('.pipes');

    if (pipes.length > 5) {
        const oldestPipe = pipes[0];
        oldestPipe.remove();
    }
    // pipes.forEach(pipe => {
    //     let rect = pipe.getBoundingClientRect();
    //     let pipeXx = rect.x;

    //     if (pipeXx > 302) {
    //         Alert("PPIPWWWW")
    //     }
    // })
}

// setInterval(() => {
//     // document.getElementById('c').innerHTML = scoreCounter;
    
    
//     let rect = document.querySelector('.pipes').getBoundingClientRect();
//     let pipeXy = rect.x;
//     document.getElementById('c').innerHTML = pipeXy;
// }, 1)