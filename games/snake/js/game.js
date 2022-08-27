let gameBoard = document.querySelector(".game-board");
let gameCanvas = gameBoard.getContext("2d");
let gameMenu= document.querySelector(".game-menu");
let gameHighscoreDisplay= document.querySelector(".highscore-h1");
let gameScoreDisplay = document.querySelector(".snake-score");

let hasUpdated = true;
let nextMove = "";
let highscore = 0;

let lastTail = [];
let snake = [[5,8], [4,8]];
let snakeDirection = 'd';

let apple = [8, 8];

const limit = 16;

document.addEventListener("keydown", (key)=>{

    //Scuffed- Trying to figure out how to have the snake remember the next move if an input is introduced during the dead period after game updates
    if (hasUpdated)
    {
        if(key.key.toLowerCase() == "w" || key.key.toLowerCase() == "arrowup")
        {
            if(snakeDirection!="s") snakeDirection = 'w';
        } else if (key.key.toLowerCase() == "a" || key.key.toLowerCase() == "arrowleft")
        {
            if(snakeDirection!="d") snakeDirection = 'a';
        } else if (key.key.toLowerCase() == "s" || key.key.toLowerCase() == "arrowdown")
        {
            if(snakeDirection!="w") snakeDirection = 's';
        } else if (key.key.toLowerCase() == "d" || key.key.toLowerCase() == "arrowright")
        {
            if(snakeDirection!="a") snakeDirection = 'd';
        }

        hasUpdated = false;
    }
})

function drawBoard()
{    
    gameCanvas.fillStyle = "rgb(240, 55, 30)"
    gameCanvas.fillRect(apple[0]*32,apple[1]*32,32,32);

    gameCanvas.clearRect(lastTail[0]*32,lastTail[1]*32,32,32);

    
    let alternate = false;
    snake.forEach(segment => {
        if (alternate) {gameCanvas.fillStyle = "rgb(83, 180, 123)"}
        else {gameCanvas.fillStyle = "rgb(53, 148, 92)"}
        
        gameCanvas.fillRect(segment[0]*32,segment[1]*32,32,32);

        alternate = !alternate;
    });

    gameCanvas.fillStyle = "rgb(126, 255, 180)"
    gameCanvas.fillRect(snake[0][0]*32,snake[0][1]*32,32,32);


}

function placeApple()
{   
    apple[0] = Math.floor(Math.random() * limit);
    apple[1] = Math.floor(Math.random() * limit);

    for (let body = 0; body <= snake.length; body++)
    {
        try{
        if(apple[0] == snake[body][0] && apple[1] == snake[body][1])
        {
            placeApple()
            console.log("REPLACED")
        }
        } catch{}
    }
    
}

function moveSnake()
{
    x = 0
    y = 0

    
    if (snakeDirection === "w")
    {
        y=1;
    } else if (snakeDirection === "a")
    {
        x=-1;
    } else if (snakeDirection === "s")
    {
        y=-1;
    } else if (snakeDirection === "d")
    {
        x=1;
    }

    snake.unshift([Number(snake[0][0]+x), Number(snake[0][1]-y)]);
    lastTail = snake.pop();
}

function checkSnake()
{
    if (snake[0][0] === apple[0] & snake[0][1] === apple[1])
    {
        snake.push([Number(snake[snake.length-1][0]), Number(snake[snake.length-1][1])])
        placeApple();
    } 

    if (snake[0][0] > limit || snake[0][1] > limit || snake[0][0] < 0 || snake[0][1] < 0)
    {
        die();
    }

    for (let body = 1; body <= snake.length; body++)
    {
        try{
        if(snake[0][0] == snake[body][0] && snake[0][1] == snake[body][1])
        {
            die();
        }
        } catch{}
    }
}

function die()
{
    clearInterval(game);
    gameMenu.style.visibility='visible'
    updateHighscore();
}

function updateHighscore()
{
    if(snake.length > highscore)
    {
        highscore = snake.length;
    }
    gameHighscoreDisplay.innerHTML = "Highscore " + String(highscore);
}

function update()
{   
    moveSnake();
    checkSnake();
    drawBoard();
    gameScoreDisplay.innerHTML = "Score " + String(snake.length);
    hasUpdated = true;
}


let game = null;
function onStart()
{
    gameCanvas.clearRect(0, 0, gameBoard.width, gameBoard.height)
    clearInterval(game);
    game = setInterval(update, 150)

    gameMenu.style.visibility='hidden' 

    hasUpdated = true;
    nextMove = "";

    lastTail = [];
    snake = [[5,8], [4,8]];
    snakeDirection = 'd';

    apple = [8, 8];
}

