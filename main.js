const gameBoard = document.querySelector('.game-board');
const welcome = document.querySelector('.welcome'); 
const pipes = document.querySelector('.pipes');
const upperPipe = document.querySelector('.upper-pipe');
const ground = document.querySelector('.ground');

let speed = 5;

window.onload = welcomePage();

function welcomePage() {
    welcome.style.setProperty('display', 'flex');

    gameBoard.addEventListener('click', startGame);
    window.addEventListener('keydown', checkKey);
}

function checkKey(e) {
    let key = e.keyCode;

    // space = 32
    if (key == 32) {
        startGame()
        window.removeEventListener('keydown', checkKey);
    }
}

function startGame() {
    gameBoard.removeEventListener('click', startGame)
    welcome.style.setProperty('display', 'none');
    ground.style = `animation: move ${speed}s linear infinite;`;
    console.log("started the game");
}