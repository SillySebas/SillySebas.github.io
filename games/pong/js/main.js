//Borrowed Code: Used To Find Where The Mouse Is Located On The Screen
//Specifically For Debug Mode
var mousePos;
document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    mousePos = {
        x: event.pageX,
        y: event.pageY
    };

}

//Fetching The The Ball, Score And Pong Container Elements From Document
let the_ball = document.querySelector("#the_ball");
let pong_container = document.querySelector(".pong_container");

let bounce_sound = document.querySelector("#bounce_sound");
let death_sound = document.querySelector("#death_sound");

let left_bouncer = document.querySelector("#left_bouncer");
let right_bouncer = document.querySelector("#right_bouncer");

let player_score = document.querySelector("#score_player")
let ai_score = document.querySelector("#score_ai")
let winner_announcement = document.querySelector("#winner")

//Cteating Options
const options_set = {
    isDebugMode: false,
    isPaused: false
}
let options = options_set;

//Finding Margins And Widths That Are Important For Placing The Ball
//Correctly On The Document
const document_margin = Number(pong_container.style.marginLeft.replace("px",""));
const document_width = Number(pong_container.style.width.replace("px",""));
const document_height = Number(pong_container.style.height.replace("px",""));

const the_ball_width = Number(the_ball.style.width.replace("px",""));

const bouncer_height = Number(left_bouncer.style.height.replace("px",""));
const bouncer_width = Number(left_bouncer.style.width.replace("px",""))

console.log(document_margin, document_width, document_height, bouncer_height, bouncer_width);

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

//Creating The X And Y For The Bouncers.
let left_bouncer_x = 64;
let left_bouncer_y = 528;

let left_bouncer_y_velocity = 0

let right_bouncer_x = 1304;
let right_bouncer_y = 528;

let right_bouncer_y_velocity = 0

//Intiating The Game Interval, Allowing It To Be Restarted
let game_interval;

//Creating The Score Variable
let game_score = {
    player: 0,
    ai: 0
}

//Event listener For When The Player Gives Input
document.addEventListener("keydown", (key)=>{
    console.log(key.key)
    //Makes Bouncer Move Up If W Pressed
    if(key.key.toLowerCase() == "w" || key.key.toLowerCase() == "arrowup")
    {
        left_bouncer_y_velocity = 1
    } 
    //Makes Bouncer Move Down If S Pressed
    else if (key.key.toLowerCase() == "s" || key.key.toLowerCase() == "arrowdown")
    {
        left_bouncer_y_velocity = -1
    } 
    
})

//Toggles Debug Mode
function debugToggle()
{
    options.isDebugMode = !options.isDebugMode
}



//Starts Game, And Begins Running The Game Function At An Interval
function startGame() 
{
    //Clearing The Winner
    winner_announcement.innerHTML = ""

    //Make Sure Game Isn't Running Before Hand
    clearInterval(game_interval)
    options.isPaused = false

    //Setting Ball Velocitys To Random Directions
    ball_x_velocity = Math.round(Math.random() * 3) - 1.5;

    ball_y_velocity = Math.round(Math.random() * 3) - 1.5;

    //Setting Ball's Location To A Random Spot
    ball_x = Math.round((Math.random()*((x_max-x_min)*0.5))+document_margin);
    ball_y = Math.round((Math.random()*(y_max-y_min*0.5))+document_margin)

    //Setting Ball In Place
    updateBallPosistion();

    //Creating An Interval To Update The Game Once Every Millisecond
    game_interval = setInterval(game, 1);
};

//Restarts The Game
function restartGame()
{
    //Clearing Scores
    game_score = {
        player: 0,
        ai: 0
    }

    //Starts Game
    startGame();
}

//Updates The Game When A Player Dies
function die()
{
    //Pauses Game
    options.isPaused = true;
    //Play Death Sound
    death_sound.play();

    //Make the Game Continue For Next Turn
    continue_game()
}

//Continues The Game After A Player Has Died
function continue_game()
{
    //Move Ball And Bouncers To Correct Beginging Posisitions
    updateBallPosistion()
    left_bouncer_x = 64;
    left_bouncer_y = 528;

    left_bouncer_y_velocity = 0

    right_bouncer_x = 1304;
    right_bouncer_y = 528;

    right_bouncer_y_velocity = 0

    //Check If Someone Hasn't Won
    if(!checkScores())
    {
        //Return To Playing
        setTimeout(startGame, 2000)
    }
    
}

//Returns True If Someone Has Won, And Displays Who Won
function checkScores()
{
    //See If The Player Has Won
    if (game_score.player >= 5)
    {
        //Display Player Has Won
        winner_announcement.innerHTML = "The Player Has Won!"
        return true  
    }
    //See If The AI Has Won
    else if
    (game_score.ai >= 5)
    {
        //Display AI Won
        winner_announcement.innerHTML = "The AI Has Won!"
        return true
    }
    //No One Won
    else
    {
        return false
    }
}

//Main Function, Updates The Game
function game()
{
    if(!options.isPaused)
    {
        //Call All Required Functions For Gameplay
        updateBallPosistion();
        moveBouncers();
        checkBoundaries();
        updateGameScore();  
    }
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
        //Increase score for the Player
        game_score.player += 1;

        die();
        
    }
    //Checking To See If The Ball Has Exceeded It's Min X
    else if(ball_x < x_min)
    {
        ball_x = x_min;

        //Increase score for the Ai
        game_score.ai += 1;
        die();

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

    //Checking To See If The Ball Has Collided With The Left Bouncer
    if(ball_x+the_ball_width >= left_bouncer_x && ball_x <= left_bouncer_x+bouncer_width)
    {
        if ((ball_y >= left_bouncer_y-bouncer_height && ball_y-the_ball_width <= left_bouncer_y))
        {
            bounce_y();
            if(ball_x_velocity > 0)
            {
                ball_x_velocity += 0.2;
            }else{
                ball_x_velocity -= 0.2;
            }
        }
    } 
    if ((ball_y >= left_bouncer_y-bouncer_height && ball_y-the_ball_width <= left_bouncer_y))
    {
        if(ball_x+the_ball_width >= left_bouncer_x && ball_x <= left_bouncer_x+bouncer_width)
        {
            
            bounce_x();
            ball_y -= ball_y_velocity + left_bouncer_y_velocity
            ball_x -= ball_x_velocity

        }
    }
    
    //Checking To See If The Ball Has Collided With The Right Bouncer
    if(ball_x+the_ball_width >= right_bouncer_x && ball_x <= right_bouncer_x+bouncer_width)
    {
        if (ball_y >= right_bouncer_y-bouncer_height && ball_y-the_ball_width <= right_bouncer_y)
        {
            bounce_y();
            if(ball_x_velocity > 0)
            {
                ball_x_velocity += 0.2;
            }else{
                ball_x_velocity -= 0.2;
            }
        }
    } 
    if (ball_y >= right_bouncer_y-bouncer_height && ball_y-the_ball_width <= right_bouncer_y)
    {
        if (ball_x+the_ball_width >= right_bouncer_x && ball_x <= right_bouncer_x+bouncer_width)
        {
            bounce_x();
            ball_y -= ball_y_velocity + right_bouncer_y_velocity
            ball_x -= ball_x_velocity
        }
    }
}
//The Right Bouncer "AI"
function moveBouncers()
{ 
    if(ball_y_velocity > 0)
    {
        right_bouncer_y_velocity = 1
    }
    else if(ball_y_velocity < 0)
    {
        right_bouncer_y_velocity = -1
    }

    if (right_bouncer_y > y_max-5)
    {
        right_bouncer_y = y_max-5;
    }
    else if(right_bouncer_y-bouncer_height < y_min+5)
    {
        right_bouncer_y = y_min+5+bouncer_height;
    }   

    right_bouncer_y += right_bouncer_y_velocity

    if (left_bouncer_y > y_max-5)
    {
        left_bouncer_y = y_max-5;
    }
    else if(left_bouncer_y-bouncer_height < y_min+5)
    {
        left_bouncer_y = y_min+5+bouncer_height;
    }  

    left_bouncer_y += left_bouncer_y_velocity
}


//Updates The Score And The Ball's Position Both In Game And On The Document
function updateBallPosistion()
{
    if(!options.isDebugMode){
        //Adds The Current X Velocity To The Ball, Moving It Forward
        ball_x += ball_x_velocity;
        //Adds The Current Y Velocity To The Ball, Moving It Forward
        ball_y += ball_y_velocity;
    }else
    {
        ball_x = mousePos.x - document_margin - (the_ball_width/2)
        ball_y = y_max - mousePos.y + document_margin + (the_ball_width/2)
    }
    

    //Updates The Document On The New Posistion Of The Game Objects
    the_ball.style.left = (ball_x+document_margin) + "px";
    the_ball.style.top = (y_max - ball_y+document_margin)+ "px";

    left_bouncer.style.left = (left_bouncer_x+document_margin) + "px";
    left_bouncer.style.top = (y_max - left_bouncer_y+document_margin)+ "px";

    right_bouncer.style.left = (right_bouncer_x+document_margin) + "px";
    right_bouncer.style.top = (y_max - right_bouncer_y+document_margin)+ "px";

    
}
//Updates The Game Score
function updateGameScore(){
    //Updates The Game Score
    new_score = game_score.player
    if(game_score.player < 10)
    {
        new_score = "0" + game_score.player
    }
    player_score.innerHTML = new_score

    new_score = game_score.ai
    if(game_score.ai < 10)
    {
        new_score = "0" + game_score.ai
    }
    ai_score.innerHTML = new_score
}
