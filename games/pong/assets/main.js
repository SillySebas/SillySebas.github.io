
//Fetching The The Ball And Pong Container Elements From Document
let the_ball = document.querySelector("#the_ball");
let pong_container = document.querySelector(".pong_container");
let bounce_sound = document.querySelector("#bounce_sound");
let left_bouncer = document.querySelector("#left_bouncer");

//Finding Margins And Widths That Are Important For Placing The Ball
//Correctly On The Document
const document_margin = Number(pong_container.style.marginLeft.replace("px",""))
const document_width = Number(pong_container.style.width.replace("px",""))
const document_height = Number(pong_container.style.height.replace("px",""))
const the_ball_width = Number(the_ball.style.width.replace("px",""))

console.log(document_margin, document_width, document_height);

//Creating The Balls Boundaries
const x_max = document_width;
const x_min = 0;

const y_max = document_height;
const y_min = 0;

//Creating The X And Y Of The Ball, And Setting Them In The Middle Of The Pong Container
//*Being Replaced With Random Posisiton
let ball_x = 0;
let ball_y = 0;



//Creating The X And Y Velocitys For The Ball
let ball_x_velocity = 0;
let ball_y_velocity = 0;

let game_interval;

//Starts Game, And Begins Running The Game Function At An Interval
function startGame() 
{
    //Setting Ball Velocitys To Random Directions
    ball_x_velocity = Math.round((Math.random()));
    if(ball_x_velocity == 0)
    { ball_x_velocity = -1}

    ball_y_velocity = Math.round((Math.random()));
    if(ball_y_velocity == 0)
    { ball_y_velocity = -1}

    //Setting Ball's Location To A Random Spot
    ball_x = Math.round((Math.random()*(x_max-x_min))+document_margin);
    ball_y = Math.round((Math.random()*(y_max-y_min))+document_margin)

    //Setting Ball In Place
    updateBallPosistion();

    //Creating An Interval To Update The Game Once Every Millisecond
    game_interval = setInterval(game, 1);
};

function restartGame()
{
    clearInterval(game_interval);

    game_interval = "";

    startGame();
}

//Main Function, Updates The Game
function game()
{
    updateBallPosistion();
    checkBoundaries();
}

//Redirects Ball When Ever The Ball Hits A Y Boundary
function bounce_y()
{
    console.log(ball_x, ball_y);
    //Inverts Ball's X Velocity, Making It "Bounce"
    ball_x_velocity = -ball_x_velocity;
    updateBallPosistion();

    //Play Bounce Sound
    bounce_sound.play();

    
}

//Redirects Ball When Ever The Ball Hits A X Boundary
function bounce_x()
{
    console.log(ball_x, ball_y);
    //Inverts Ball's Y Velocity, Making It "Bounce"
    ball_y_velocity = -ball_y_velocity;
    updateBallPosistion();

    //Play Bounce Sound
    bounce_sound.play();

    
}

//Checks To See If The Ball Has Left The Set Boundaries
//If the Ball Has Left, Places It Back Into The Boundaries And Makes It Bounce
function checkBoundaries()
{
    //Checking To See If The Ball Has Exceeded It's Max X
    if(ball_x > x_max || ball_x+the_ball_width > x_max)
    {
        ball_x = x_max-the_ball_width;

        bounce_y();
    }
    //Checking To See If The Ball Has Exceeded It's Min X
    else if(ball_x < x_min)
    {
        ball_x = x_min;

        bounce_y();
    }

    //Checking To See If The Ball Has Exceeded It's Max Y
    if(ball_y > y_max )
    {
        ball_y = y_max;

        bounce_x();
    }

    //Checking To See If The Ball Has Exceeded It's Min Y
    else if(ball_y < y_min || ball_y-the_ball_width < y_min)
    {
        ball_y = y_min+the_ball_width;

        bounce_x();
    }
}
//Updates The Ball's Position Both In Game And On The Document
function updateBallPosistion()
{
    //Adds The Current X Velocity To The Ball, Moving It Forward
    ball_x += ball_x_velocity;
    //Adds The Current Y Velocity To The Ball, Moving It Forward
    ball_y += ball_y_velocity;

    //Updates The Document On The New Posistion Of The Ball
    the_ball.style.left = (ball_x+document_margin) + "px";
    the_ball.style.top = (y_max - ball_y+document_margin)+ "px";
}

//Begins Game
startGame();