const worldCanvas = document.querySelector(".hamster-canvas");
const worldCanvasContext = worldCanvas.getContext("2d");

worldCanvas.width = window.innerWidth;
worldCanvas.height = window.innerHeight;

let hamX = 150;
let hamY = (worldCanvas.height/2)-128;
let hamWidth = 64;
let hamVelocity = 0;
let hamJumpAcceleration = -6;

let isJumping = false;

let images = {};

let groundHeight = 50;

let barriers = [ ];
let barSeperation = 250;
let barrierWidth = 100;
let barSpacing = 600;

let score = 0;

barriers.push({x: worldCanvas.width - barSpacing, y: (barSeperation+64 + (Math.random()*(worldCanvas.height)) - barSeperation*2+64)});

for(let i = 0; i < 20; i++)
{
    barriers.push({x: worldCanvas.width + (barSpacing * i), y: (barSeperation+64 + (Math.random()*(worldCanvas.height)) - (barSeperation*2+64))})
}
console.log(barriers);

document.querySelectorAll(".hidden-sprite").forEach((sprite, posistion) => {
    console.log("Sprite: ", posistion, sprite.id);
    images[sprite.id] = sprite;
});

document.addEventListener("keydown", (e) => {
    if(e.key == " ")
    {
        if(!isJumping)
        {
            isJumping = true;

            hamVelocity = hamJumpAcceleration; 
            console.log("JUMP");
        }

    }
});

document.addEventListener("keyup", (e) => {
    isJumping = false;
});

function update()
{
    hamY += hamVelocity;
    hamVelocity += .15;

    barriers.forEach((barrier) => {
        barrier.x -= 1;
    });
    
    draw(); 
    checkCollision();
    updateBarriers();
}

function updateBarriers()
{
    barriers.forEach((barrier) => {
        if(barrier.x < -300)
        {
            score += 1;
            barrier.x = barriers[barriers.length -1].x;
            barrier.y = (barSeperation+64 + (Math.random()*(worldCanvas.height) - (barSeperation*2)+64));
        }
    })
}

function checkCollision()
{
    if(hamY >= worldCanvas.height - (groundHeight+hamWidth))
    {
        die();
    }

    barriers.forEach((barrier) => {
        if (hamX > barrier.x && hamX < barrier.x+barrierWidth)
        {
            if((hamY+20) < barrier.y-barSeperation || (hamY)+hamWidth > barrier.y+barSeperation)
            {
                die();
            }
        }
        else if (hamX+hamWidth > barrier.x && hamX+hamWidth < barrier.x+barrierWidth)
            {
                if((hamY+20) < barrier.y-barSeperation || (hamY)+hamWidth > barrier.y+barSeperation)
                {
                    die();
                }
            }
    });
}

function die()
{
    console.log("die");
    clearInterval(fixedUpdate);
}

function draw()
{
    
    worldCanvasContext.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
    worldCanvasContext.imageSmoothingEnabled = false;

    worldCanvasContext.font = "48px serif";
    worldCanvasContext.fillText(String(score), 100, 100);

    worldCanvasContext.drawImage(images.happyFacingLeft, hamX, hamY, hamWidth, hamWidth);

    worldCanvasContext.drawImage(images.grass, 0, worldCanvas.height - 50, worldCanvas.width, 50);

    barriers.forEach((barrier) => {
        worldCanvasContext.drawImage(images.idle, barrier.x, 0, barrierWidth, barrier.y-barSeperation);
        worldCanvasContext.drawImage(images.idle, barrier.x, barrier.y+barSeperation, barrierWidth, worldCanvas.height);
    });
}

draw();


const fixedUpdate = setInterval(update, 7);
