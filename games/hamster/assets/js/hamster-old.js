class Transform
{
    constructor(parent, x, y, width, height, scale)
    {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }
}

class BoundingBox
{
    constructor(transform, isInteractable, isCollidable)
    {
        this.transform = transform;
        this.isInteractable = isInteractable;
        this.isCollidable = isCollidable;
    }

    isPointInBounds(x, y)
    {
        return this.transform.x <= x && (this.transform.x + this.transform.width) >= x && this.transform.y <= y && (this.transform.y + this.transform.width) >= y;
    }
}

class Sprite
{
    constructor(image)
    {
        this.image = image;
    }

    getImage()
    {
        return sprites.images[this.image];
    }
}

class Camera
{
    constructor()
    {
        this.transform = new Transform(this, 0, 0, 0, 0, 1)
    }
}


class GameWorld 
{
    constructor()
    {
        this.transform = new Transform(this, 0, 0, 512, 512, 1);
        this.sprite = new Sprite("world");
    }

    onDrag(mouseDrag)
    {
        console.log("I HAVE BEEN DRAGGED", mouseDrag);
    }
}

class ImageManager
{
    constructor()
    {
        this.images = {};
        this.offsetX = 0;
        this.offsetY = 0;

        this.intializeImgs();
    }

    /*
    Initalizes all game images into a dictionary, as "Sprite name": ImgHTMLObject.
    These images are held in the document, under the class "hidden-sprite", where the id is the sprite name.
    The class "hidden-sprite", hides the actual reference sprites from the user.
    */
    intializeImgs()
    {
        console.log("INITIALIZING GAME SPRITES:");

        document.querySelectorAll(".hidden-sprite").forEach((sprite, posistion) => {
            console.log("Sprite: ", posistion, sprite.id);
            this.images[sprite.id] = sprite;
        });
    }

    drawBackground()
    {
        //Draws the games background with respect to the camera's posistion and the zoom factor/scaling of the world. REMEMBER to always differentiate between
        //the WORLDS x and y coordinates and the CANVAS' x and y coordinates, as in the the cameras coordinates are relative to the world, but the worlds coordinates
        //are relative to the canvas.
        worldCanvasContext.drawImage(world.sprite.getImage(),
                                    (this.offsetX),
                                    (this.offsetY), 
                                    (world.transform.width*camera.transform.scale), 
                                    (world.transform.height*camera.transform.scale));

    }

    drawGameObjects()
    {
        game.objects.forEach((object) => {
            console.log(object)
            worldCanvasContext.drawImage(object.sprite.getImage(), 
                                        this.offsetX,
                                        this.offsetY, 
                                        hamster.transform.width*camera.transform.scale, 
                                        hamster.transform.height*camera.transform.scale);
        });
 
    }

    drawDebug()
    {
        console.log("DRAWING DEBUG:");
        worldCanvasContext.fillStyle = "#FF0000";
        worldCanvasContext.fillRect(0, worldCanvas.height/2-3, worldCanvas.width, 6);
        worldCanvasContext.fillRect(worldCanvas.width/2-3, 0, 6, worldCanvas.height);
    }

    draw()
    {
        worldCanvasContext.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
        this.drawBackground();
        this.drawDebug();
        this.drawGameObjects();
    }

    windowUpdate()
    {
        worldCanvas.width = window.innerWidth;
        worldCanvas.height = window.innerHeight;
    
        this.offsetX = ((worldCanvas.width)/2)-(camera.transform.x*camera.transform.scale);
        this.offsetY = ((worldCanvas.height)/2)+(camera.transform.y*camera.transform.scale);

        this.draw();
    }
    
}

class Hamster
{
    constructor()
    {
        game.objects.push(this);
        //Hamster properties
        this.transform = new Transform(this, 1, 1, 150, 150, 1)
        this.sprite = new Sprite("happyFacingLeft");

        this.boundingBox = new BoundingBox(this.transform);

        this.mood = "pleasant";
        this.facing = "forward";

        this.horizontalWalkingSpeed = 1;
        this.verticalWalkingSpeed = 1;

        this.inputKeyboard = this.inputKeyboard.bind(this);
    }

    inputKeyboard(event)
    {
        let key = event.key.toLowerCase();
        let movementVertical = 0;
        let movementHorizontal = 0;

        console.log(event);
        switch(key)
        {
            case "w": movementVertical = 1;break;
            case "s": movementVertical = -1;break;
            case "a": movementHorizontal = -1;break;
            case "d": movementHorizontal = 1;break;
            case " ": {
                clearInterval(fixedUpdate);
                console.log("FixedUpdate halted");
            } 
        }


        this.transform.x += movementHorizontal * this.horizontalWalkingSpeed;
        this.transform.y += movementVertical * this.verticalWalkingSpeed;
    }

}

class Game
{
    constructor()
    {
        this.objects = [];
    }

    intializeGame()
    {
        console.log("INITIALIZING GAME:");
        sprites.windowUpdate();
        sprites.draw();
    }

    intializeGameObjects()
    {
        
    }

    update()
    {
        sprites.draw();
        console.log("UPDATED");
    }
}

class GameController
{
    constructor(){
        this.keyPress = "";
        this.changeInScroll = 0;
        this.mousePress = "";
        this.isDragging = false;
        this.mouseDragging = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.mouseLocation = {
            x: 0,
            y: 0
        }

        document.addEventListener("keydown", hamster.inputKeyboard);
        document.addEventListener("wheel", this.handleMouseWheel);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseWheel(event)
    {
        camera.transform.scale += event.deltaY/500;
    }

    handleMouseDown(event)
    {
        this.isDragging = true;

        game.objects.forEach((object) => {
            if(object.boundingBox.isInteractable)
            {
                object.boundingBox;
            }
        })

    }
    handleMouseUp(event)
    {
        this.isDragging = false;
    }
}

//Global Objects
const worldCanvas = document.querySelector(".hamster-canvas");
const worldCanvasContext = worldCanvas.getContext("2d");

worldCanvas.width = window.innerWidth;
worldCanvas.height = window.innerHeight;


const camera = new Camera();
const world = new GameWorld();
const sprites = new ImageManager();
const game = new Game();
const hamster = new Hamster();
const gamecontroller = new GameController();

function onWindowResize()
{
    sprites.windowUpdate();
}
window.addEventListener("resize", onWindowResize);

// G A M E   O P E R A T I O N S

game.intializeGame();

console.log("MADE IT");

const fixedUpdate = setInterval(game.update, 100);

/*1/12/24
Currently working on clicking objects and notifing them that they have been clicked, using bounding boxes, this is to know whether or not the world is being dragged or if the object is being dragged, plus it will have addtion functionality in the future.

Current issues, Image mangager needs work to properly display images where they belong relative to window and then world.

Addtionally, im adding object componets (transform, boundingbox), to have their parents linked to them.

EVENTUALLY, i should rework game objects so there is a stand GameObject class that then is built off of for things such as the hamster.


*/