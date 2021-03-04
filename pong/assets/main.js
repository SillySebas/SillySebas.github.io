
//Fetching The The Ball And Pong Container Elements From Document
let the_ball = document.querySelector("#the_ball");
let pong_container = document.querySelector(".pong_container");

//Creating The Balls Boundaries
const x_max = 1438;
const x_min = 100;

const y_max = 838;
const y_min = 100;

//Finding Margins And Widths That Are Important For Placing The Ball
//Correctly On The Document
const document_margin = Number(pong_container.style.margin.replace("px",""))
const the_ball_width = Number(the_ball.style.width.replace("px",""))

//Creating The X And Y Of The Ball, And Setting Them In The Middle Of The Pong Container
let ball_x = (x_max/2)
let ball_y = (y_max/2)

//Creating The X And Y Velocitys For The Ball
let ball_x_velocity = -1;
let ball_y_velocity = -1;

//Starts Game, And Begins Running The Game Function At An Interval
function startGame() 
{
    //Setting Ball In Place
    updateBallPosistion();

    //Creating An Interval To Update The Game Once Every Millisecond
    let game_interval = setInterval(game, 1);
};

//Main Function, Updates The Game
function game()
{
    updateBallPosistion();
    checkBoundaries();
}

//Redirects Ball When Ever The Ball Hits A Y Boundary
function bounce_y()
{
    //Inverts Ball's X Velocity, Making It "Bounce"
    ball_x_velocity = -ball_x_velocity;
    updateBallPosistion();
}

//Redirects Ball When Ever The Ball Hits A X Boundary
function bounce_x()
{
    //Inverts Ball's Y Velocity, Making It "Bounce"
    ball_y_velocity = -ball_y_velocity;
    updateBallPosistion();
}

//Checks To See If The Ball Has Left The Set Boundaries
//If the Ball Has Left, Places It Back Into The Boundaries And Makes It Bounce
function checkBoundaries()
{
    //Checking To See If The Ball Has Exceeded It's Max X
    if(ball_x > x_max)
    {
        ball_x = x_max;

        bounce_y();
    }
    //Checking To See If The Ball Has Exceeded It's Min X
    else if(ball_x < x_min)
    {
        ball_x = x_min;

        bounce_y();
    }

    //Checking To See If The Ball Has Exceeded It's Max Y
    if(ball_y > y_max)
    {
        ball_y = y_max;

        bounce_x();
    }

    //Checking To See If The Ball Has Exceeded It's Min Y
    else if(ball_y < y_min)
    {
        ball_y = y_min;

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
    the_ball.style.left = (ball_x) + "px";
    the_ball.style.top = (y_max - ball_y+document_margin)+ "px";
}

//Begins Game
startGame();