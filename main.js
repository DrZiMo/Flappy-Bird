const gameBoard = document.querySelector('.game-board');
const welcome = document.querySelector('.welcome');
const score = document.querySelector('.score');
const scoreImgH = document.getElementById('score-img1');
const scoreImgT = document.getElementById('score-img2');
const scoreImgO = document.getElementById('score-img3');
const bird = document.querySelector('.bird');
const birdImg = document.getElementById('bird-img');
const ground = document.querySelector('.ground');
const gameOverConatiner = document.querySelector('.game-over');
const gameOverScoreImgH = document.getElementById('go-score-img1');
const gameOverScoreImgT = document.getElementById('go-score-img2');
const gameOverScoreImgO = document.getElementById('go-score-img3');
const gameOverBestScoreImgH = document.getElementById('bt-score-img1');
const gameOverBestScoreImgT = document.getElementById('bt-score-img2');
const gameOverBestScoreImgO = document.getElementById('bt-score-img3');
const restartBtn = document.getElementById('restartBtn');

let gravity = 4;
let jumpHeight = 110; // 35
let posiY = 0;
let scoreCounter = 0;
let scores = [];
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

// Sounds
const die_sound = new Audio('flappy-bird-assets/audio/die.ogg');
const point_sound = new Audio('flappy-bird-assets/audio/point.ogg');
const swoosh_sound = new Audio('flappy-bird-assets/audio/swoosh.ogg');
const wing_sound = new Audio('flappy-bird-assets/audio/wing.ogg');

function loadScores() {
    const savedScores = localStorage.getItem('scores');
    if (saveScores) {
        scores = JSON.parse(savedScores);
    } else {
        scores = [];
    }
}

loadScores()


window.onload = welcomePage();

const assets = {
    images: [
        'flappy-bird-assets/sprites/0.png',
        'flappy-bird-assets/sprites/1.png',
        'flappy-bird-assets/sprites/2.png',
        'flappy-bird-assets/sprites/3.png',
        'flappy-bird-assets/sprites/4.png',
        'flappy-bird-assets/sprites/5.png',
        'flappy-bird-assets/sprites/6.png',
        'flappy-bird-assets/sprites/7.png',
        'flappy-bird-assets/sprites/8.png',
        'flappy-bird-assets/sprites/9.png',
        'flappy-bird-assets/sprites/yellowbird-upflap.png',
        'flappy-bird-assets/sprites/yellowbird-midflap.png',
        'flappy-bird-assets/sprites/yellowbird-downflap.png'
    ],
    sounds: [
        'flappy-bird-assets/audio/point.ogg',
        'flappy-bird-assets/audio/die.ogg',
        'flappy-bird-assets/audio/swoosh.ogg'
    ]
};

let loadedImages = [];
let loadedSounds = [];

function preloadImages(imageArray) {
    return Promise.all(imageArray.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    }));
}

function preloadSounds(soundArray) {
    return Promise.all(soundArray.map(src => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(src);
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
        });
    }));
}

function loadAssets() {
    return Promise.all([
        preloadImages(assets.images),
        preloadSounds(assets.sounds)
    ]);
}

loadAssets()
    .then(() => welcomePage())
    .catch(error => console.error(error));


function welcomePage() {
    welcome.style.setProperty('display', 'flex');
    score.style.setProperty('display', 'none');
    bird.style.setProperty('display', 'none');
    bird.style.top = 'calc(50% + 50px);';
    bird.style.left = '50%;';
    gameOverConatiner.style.setProperty('display', 'none');

    gameBoard.removeEventListener('click', startGame);
    window.removeEventListener('keydown', checkKey);

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
    swoosh_sound.play();
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
    birdJump();
    applyGravity();
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
    updateScore();
}, 100)

function updateScore() {
    const pipes = document.querySelectorAll('.pipes');
    const birdRect = bird.getBoundingClientRect();
    
    pipes.forEach(pipe => {
        let pipeRect = pipe.getBoundingClientRect();
        let pipeX = pipeRect.x;

        // the 40 that is added to pipeX is to enture that the bird has completely passed the pipe
        if (birdRect.x > (pipeX + 50) && !pipe.hasAttribute('scored')) {
            point_sound.play();
            scoreCounter++;
            pipe.setAttribute('scored', 'true');
            scoreImgO.src = changeTheScoreImg(scoreCounter).src;
            if (scoreCounter > 9) {
                scoreImgT.style.setProperty('display', 'inline');
                scoreImgT.src = changeTheScoreImg(scoreCounter).srcT;
            } else {
                scoreImgT.style.setProperty('display', 'none');
            }
            if (scoreCounter > 99) {
                scoreImgH.style.setProperty('display', 'inline');
                scoreImgH.src = changeTheScoreImg(scoreCounter).srcH;
            } else {
                scoreImgH.style.setProperty('display', 'none');
            }
        }
    })
}

function changeTheScoreImg(score) {
    let path = "flappy-bird-assets/sprites/";
    let src = '';
    let srcT = '';
    let srcH = '';
    if(score < 10) {
        src = `${path}${score}.png`;
        return {src};
    }
    else if (score > 9 && score < 100) {
        
        let tens = Math.floor(score / 10);
        let ones = score % 10;

        src = `${path}${ones}.png`;
        srcT = `${path}${tens}.png`;

        return {src, srcT};
    }
    else if (score > 99 && score < 1000) {
        
        let hundreds = Math.floor(score / 100);
        let tens = Math.floor((score % 100) / 10);
        let ones = score % 10;

        src = `${path}${ones}.png`;
        srcT = `${path}${tens}.png`;
        srcH = `${path}${hundreds}.png`;

        return {src, srcT, srcH};
    }
}

function birdJump() {
    const jump = () => {
        posiY -= jumpHeight;
    };

    if (isPlaying) {
        gameBoard.onclick = jump;
        gameBoard.addEventListener('touchstart', jump);
        document.addEventListener('keydown', checkSpaceKey);
    } else {
        gameBoard.removeEventListener('touchstart', jump);
        document.removeEventListener('keydown', checkSpaceKey);
    }
}

function checkSpaceKey(e) {
    let key = e.keyCode;

    if (key == 32) {
        posiY -= jumpHeight;
    }
}

function applyGravity() {
    if (isPlaying) {
        checkCollision();
        bird.style = `transform: translateY(${posiY}px)`
        posiY += gravity;
        requestAnimationFrame(applyGravity);
    }
    return posiY;
}

function checkCollision() {
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

function saveScores() {
    const uniqueScore = scores.filter((value, index) => scores.indexOf(value) == index);
    localStorage.setItem('scores', JSON.stringify(uniqueScore));
}

function gameOver() {
    die_sound.play();
    fallAnimation();
    scores.push(scoreCounter);
    saveScores();
    gameOverDisplay();
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

// Game Over Structure
function gameOverDisplay() {
    let bestScore = scores[0];

    for (let i = 1; i < scores.length; i++) {
        if (scores[i] > bestScore) {
            bestScore = scores[i];
        }
    }
    gameOverConatiner.style.setProperty('display', 'flex');

    // Setting The Score in Game Over part
    gameOverScoreImgO.src = changeTheScoreImg(scoreCounter).src;
    if (scoreCounter > 9) {
        gameOverScoreImgT.style.setProperty('display', 'inline')
        gameOverScoreImgT.src = changeTheScoreImg(scoreCounter).srcT;
    
    } else {
        gameOverScoreImgT.style.setProperty('display', 'none')
    }

    if (scoreCounter > 99) {
        gameOverScoreImgH.style.setProperty('display', 'inline')
        gameOverScoreImgH.src = changeTheScoreImg(scoreCounter).srcH;
    } else {
        gameOverScoreImgH.style.setProperty('display', 'none')
    }
    
    // Setting The Best Score in Game Over part
    gameOverBestScoreImgO.src = changeTheScoreImg(bestScore).src;
    if (bestScore > 9) {
        gameOverBestScoreImgT.style.setProperty('display', 'inline')
        gameOverBestScoreImgT.src = changeTheScoreImg(bestScore).srcT;
    
    } else {
        gameOverBestScoreImgT.style.setProperty('display', 'none')
    }

    if (bestScore > 99) {
        gameOverBestScoreImgH.style.setProperty('display', 'inline')
        gameOverBestScoreImgH.src = changeTheScoreImg(bestScore).srcH;
    } else {
        gameOverBestScoreImgH.style.setProperty('display', 'none');
    };
}

// restart
restartBtn.addEventListener('click', () => {
    window.location.reload()
})