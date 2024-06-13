
type MouseDrag =
{
        x1: number,
        y1: number,
        x2: number,
        y2: number
}

type Coordinate = 
{
    x: number,
    y: number
}

interface ImageDictionary 
{
    [key: string]: HTMLImageElement;
}

interface AreasDictionary 
{
    [key: string]: Area;
}

class Component
{
    parent: GameObject | null = null;
    constructor()
    {

    }

    setParent(parent: GameObject)
    {
        this.parent = parent;
    }
}

class Transform extends Component
{
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    scale: number = 0;

    constructor()
    {
        super();
    }

    init(parent: GameObject, x: number, y: number, width: number, height: number, scale: number)
    {
        super.setParent(parent);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    getWidth() : number
    {
        return this.width*this.scale
    }
    getHeight() : number
    {
        return this.height*this.scale
    }
}

class BoundingBox extends Component
{
    transform: Transform = new Transform();
    isInteractable: boolean = false;
    isCollidable: boolean = false;

    constructor()
    {
        super()
    }

    init(parent: GameObject, transform: Transform, isInteractable: boolean, isCollidable: boolean)
    {
        super.setParent(parent);

        this.transform = transform;
        this.isInteractable = isInteractable;
        this.isCollidable = isCollidable;
    }
    isPointInBounds(x: number, y: number)
    {
        return (this.transform.x - (this.transform.width*0.5 )) <= x && 
               (this.transform.x + (this.transform.width*0.5 )) >= x && 
               (this.transform.y - (this.transform.height*0.5)) <= y && 
               (this.transform.y + (this.transform.height*0.5)) >= y;
    }
}

class Sprite extends Component
{
    image: HTMLImageElement = ImageManager.images.unfound;

    constructor()
    {
        super()
    }

    init(parent: GameObject, image : HTMLImageElement)
    {
        super.setParent(parent);

        this.image = image;
    }

}

class GameObject
{
    transform: Transform;
    sprite: Sprite
    boundingBox: BoundingBox;
    horizontalMovementSpeed: number = 0;
    verticalMovementSpeed: number = 0;
    areaIn : Area;
    

    constructor(area: Area)
    {
        this.areaIn = area;
        this.areaIn.objects.push(this);

        this.transform = new Transform();
        this.sprite = new Sprite();
        this.boundingBox = new BoundingBox();
    }

    move(vector: Coordinate)
    {
        //console.log(vector.x * this.horizontalMovementSpeed, vector.y * this.verticalMovementSpeed)

        this.transform.x += (vector.x * this.horizontalMovementSpeed) * Game.FIXED_UPDATE;
        this.transform.y += (vector.y * this.verticalMovementSpeed) * Game.FIXED_UPDATE;
        console.log(this.transform.x, this.transform.y)
    }

}

class Camera extends GameObject
{
    //Guassion Zoom Curve
    static GZC_A: number = 50;
    static GZC_B: number = 25;
    static GZC_C: number = 9;

    horizontalMovementSpeed: number = 5;
    verticalMovementSpeed: number = 5;
    absoluteScale: number = 0;
    clampScale: boolean = true;

    constructor(area : Area)
    {
        super(area);
        this.transform.init(this, 0,0,0,0,0);
        this.scale(500);
    }

    scale(amount: number)
    {
        this.absoluteScale += amount/100;

        this.transform.scale = Camera.GZC_A * Math.exp(-Math.pow(this.absoluteScale - Camera.GZC_B, 2) / (2 * Math.pow(Camera.GZC_C, 2)));

        console.log(this.absoluteScale, this.transform.scale);

        if(this.absoluteScale > Camera.GZC_B)
        {
            this.clampScale = true;
        } else if(this.absoluteScale < 0)
        {
            this.clampScale = true;
        }
    }

    clampScaleContinuously()
    {
        if(this.clampScale)
        {
            if(this.absoluteScale > Camera.GZC_B)
            {
                this.absoluteScale -= 0.05;
            } else if(this.absoluteScale < 0)
            {
                this.absoluteScale += 0.05;
            }
        }
    }

    update()
    {
        this.clampScaleContinuously();
    }
}

class TileGrid
{
    tiles: Array<HTMLImageElement>;
    width: number;
    height: number;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
        this.tiles = new Array<HTMLImageElement>((this.width*this.height));
    }
}

class WorldChunk extends TileGrid
{
    baseCoordinate : Coordinate;
    
    constructor(c : Coordinate, width: number, height: number)
    {
        super(width, height);
        this.baseCoordinate = c;
    }

    populate(type : HTMLImageElement)
    {
        for(let i = 0; i < this.height*this.width; i++)
        {
            this.tiles[i] = type;
            if(Math.random() < 0.1)
            {
                this.tiles[i] = ImageManager.images["flower"];
            }
            
        }
    }
}

class Area {
    chunks : Array<WorldChunk> = new Array<WorldChunk>();
    name : string;
    objects: Array<GameObject> = [];

    constructor(name : string)
    {
        this.name = name
    }
}

class GameWorld
{
    areas : AreasDictionary = {};

    constructor()
    {
        this.initalizeAreas();
    }

    initalizeAreas()
    {
        this.areas["field"] = new Area("field");

        let c1 = new WorldChunk({x: 0,y: 0}, 16, 16);
        c1.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c1);

        let c2 = new WorldChunk({x: -1,y: 0}, 16, 16);
        c2.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c2);

        let c3 = new WorldChunk({x: 0,y: -1}, 16, 16);
        c3.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c3);

        let c4 = new WorldChunk({x: -1,y: -1}, 16, 16);
        c4.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c4);

    }

    onDrag(mouseDrag: MouseDrag)
    {
        console.log("I HAVE BEEN DRAGGED", mouseDrag);
    }
}

class ImageManager
{
    static METERS_TO_PIXELS = 16; // This many pixels = 1 meter, used to convert an object's size in meters into pixels to be display, not scaled to camera scale.
    static images: ImageDictionary = {};
    static offsetX: number = 0; // This is the offset, in pixels, that objects need to be shifted over in order for them to be display in the middle.
    static offsetY: number = 0; // ^

    /*
    Initalizes all game images into a dictionary, as "Sprite name": ImgHTMLObject.
    These images are held in the document, under the class "hidden-sprite", where the id is the sprite name.
    The class "hidden-sprite", hides the actual reference sprites from the user.
    */
    static init()
    {
        console.log("INITIALIZING GAME SPRITES:");

        document.querySelectorAll<HTMLImageElement>(".hidden-sprite").forEach((sprite, posistion) => {
            console.log("Sprite: ", posistion, sprite.id);
            this.images[sprite.id] = sprite;
        });
    }

    static drawArea()
    {
        camera.areaIn.chunks.forEach((chunk : WorldChunk) =>
        {
            console.log(chunk)
            for (let x = 0; x < chunk.height; x++) {
                for (let y = 0; y < chunk.width; y++) {
                    worldCanvasContext.drawImage(chunk.tiles[(x+(y*(chunk.width)))],
                                                this.offsetX+(((((chunk.baseCoordinate.x)*16)+x-camera.transform.x)-0)*this.METERS_TO_PIXELS*camera.transform.scale),
                                                this.offsetY+(((((chunk.baseCoordinate.y)*16)+y+camera.transform.y)-0)*this.METERS_TO_PIXELS*camera.transform.scale),
                                                (this.METERS_TO_PIXELS*camera.transform.scale),
                                                (this.METERS_TO_PIXELS*camera.transform.scale)
                                                );
                }            
            }
        });
    }
    /*static drawBackground()
    {
        //Draws the games background with respect to the camera's posistion and the zoom factor/scaling of the world. REMEMBER to always differentiate between
        //the WORLDS x and y coordinates and the CANVAS' x and y coordinates, as in the the cameras coordinates are relative to the world, but the worlds coordinates
        //are relative to the canvas.
        let x = 1; // in meters
        let y = 1; // in meters
        let w = 1; // in meters
        let h = 1; // in meters
        worldCanvasContext.drawImage(world.sprite.image,
                                    this.offsetX+(((0-camera.transform.x)-(world.transform.getWidth() /2))*this.METERS_TO_PIXELS*camera.transform.scale),
                                    this.offsetY+(((0+camera.transform.y)-(world.transform.getHeight() /2))*this.METERS_TO_PIXELS*camera.transform.scale),
                                    (world.transform.getWidth()*this.METERS_TO_PIXELS*camera.transform.scale),
                                    (world.transform.getHeight()*this.METERS_TO_PIXELS*camera.transform.scale)
                                    )
        

        /*worldCanvasContext.drawImage(world.sprite.image,
                                    0,
                                    0,
                                    (world.transform.getWidth()*this.METERS_TO_PIXELS*camera.transform.scale),
                                    (world.transform.getHeight()*this.METERS_TO_PIXELS*camera.transform.scale)
                                    )
        */
        /*worldCanvasContext.drawImage(world.sprite.image,
                                    (this.offsetX-(camera.transform.x*camera.transform.scale)),
                                    (this.offsetY+(camera.transform.y*camera.transform.scale)), 
                                    (world.transform.width*camera.transform.scale), 
                                    (world.transform.height*camera.transform.scale));
        
    }*/

    static drawGameObjects()
    {
        if(camera.areaIn)
        {
            camera.areaIn.objects.forEach((object) => {
                worldCanvasContext.drawImage(object.sprite.image,
                    this.offsetX+((((object.transform.x)-camera.transform.x)-(object.transform.getWidth() /2))*this.METERS_TO_PIXELS*camera.transform.scale),
                    this.offsetY+((((-object.transform.y)+camera.transform.y)-(object.transform.getHeight()/2))*this.METERS_TO_PIXELS*camera.transform.scale),
                    (object.transform.getWidth()*this.METERS_TO_PIXELS*camera.transform.scale),
                    (object.transform.getHeight()*this.METERS_TO_PIXELS*camera.transform.scale)
                    )
            });
        }
 
    }

    static drawDebug()
    {
        worldCanvasContext.fillStyle = "#FF0000";
        worldCanvasContext?.fillRect(0, worldCanvas.height/2-1, worldCanvas.width, 2);
        worldCanvasContext?.fillRect(worldCanvas.width/2-1, 0, 2, worldCanvas.height);
    }

    static draw()
    {
        worldCanvasContext.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
        worldCanvasContext.imageSmoothingEnabled = false;

        this.drawArea();
        this.drawGameObjects();
        //this.drawDebug();
    }

    static windowUpdate()
    {
        worldCanvas.width = window.innerWidth;
        worldCanvas.height = window.innerHeight;
    
        this.offsetX = ((worldCanvas.width)/2)
        this.offsetY = ((worldCanvas.height)/2);

        this.draw();
    }
    
}

class Hamster extends GameObject
{
    horizontalWalkingSpeed: number;
    verticalWalkingSpeed: number;

    movementCooldown: number = 0;
    
    isHeld: boolean = false;

    
    
    constructor(area : Area, location : Coordinate)
    {
        super(area);
        this.transform.init(this, 0, 0, 1, 1, 1);
        this.boundingBox.init(this, this.transform, true, true);
        this.sprite.init(this, ImageManager.images["happyFacingLeft"]);

        //Hamster properties
        this.horizontalWalkingSpeed = 1;
        this.verticalWalkingSpeed = 1;
    }

    checkMovement()
    {
        if(this.movementCooldown == 0 && !this.isHeld)
        {

        }
    }

    update()
    {
        this.checkMovement();
    }

}

class Game
{
    static FIXED_UPDATE: number = 0.01;

    static init()
    {
        console.log("INITIALIZING GAME:");
        ImageManager.windowUpdate();
        ImageManager.draw();

        camera.areaIn = world.areas["field"];
    }

    static intializeGameObjects()
    {
        
    }

    static update()
    {
        GameController.update();
        ImageManager.draw();
        camera.update();
    }
}

class GameController
{
    static keysPressed: Set<string> = new Set();
    static changeInScroll: number = 0;
    static mousePress: string= "";
    static isDragging: boolean = false;
    static dragStart: Coordinate = {
                                    x: 0,
                                    y: 0
                                    }
    static mouseLocation: Coordinate = {
                                        x: 0,
                                        y: 0
                                        };

    static keyboardDirectionVector: Coordinate = {
                                                x: 0,
                                                y: 0
                                                };
    static diagonalSpeedAdjustment = 1 / Math.sqrt(2);

    static holding: GameObject | null = null;

    static init()
    {
        document.addEventListener("keydown",   this.handleKeyDown.bind(this));
        document.addEventListener("keyup",     this.handleKeyUp.bind(this));
        document.addEventListener("wheel",     this.handleMouseWheel.bind(this));
        document.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document.addEventListener("mouseup",   this.handleMouseUp.bind(this));
        document.addEventListener("mousemove",   this.handleMouseMove.bind(this));
    }

    static handleKeyDown(event: KeyboardEvent)
    {
        if(!this.keysPressed.has(event.key.toLowerCase()))
        {
            this.keysPressed.add(event.key.toLowerCase());
            this.keyboardUpdate();
        }
    }

    static handleKeyUp(event: KeyboardEvent)
    {
        this.keysPressed.delete(event.key.toLowerCase());
        this.keyboardUpdate();
    }

    static keyboardUpdate()
    {
        this.keyboardDirectionVector.x = 0;
        this.keyboardDirectionVector.y = 0;

        if(this.keysPressed.has("w"))
        {
            this.keyboardDirectionVector.y += 1;
        } 
        if(this.keysPressed.has("s"))
        {
            this.keyboardDirectionVector.y += -1;
        }

        if(this.keysPressed.has("a"))
        {
            this.keyboardDirectionVector.x += -1;
        } 
        if(this.keysPressed.has("d"))
        {
            this.keyboardDirectionVector.x += 1;
        }

        if (this.keyboardDirectionVector.x !== 0 && this.keyboardDirectionVector.y !== 0)
        {
            this.keyboardDirectionVector.x *= this.diagonalSpeedAdjustment;
            this.keyboardDirectionVector.y *= this.diagonalSpeedAdjustment;
        }
    }

    static handleMouseWheel(event: WheelEvent)
    {
        camera.scale(event.deltaY);
    }

    static handleMouseDown(event: MouseEvent)
    {
        this.isDragging = true;
        this.dragStart.x = this.mouseLocation.x;
        this.dragStart.y = this.mouseLocation.y;

        camera.areaIn.objects.forEach((object) => {
            if(object.boundingBox.isInteractable)
            {
                if(object.boundingBox.isPointInBounds(this.mouseLocation.x,this.mouseLocation.y))
                {
                    this.holding = object;
                }
            }
        })

    }

    static handleMouseUp(event: MouseEvent)
    {
        this.isDragging = false;

        this.holding = null;
    }

    static handleMouseMove(event: MouseEvent)
    {
        this.mouseLocation.x = ((event.clientX-ImageManager.offsetX)/ImageManager.METERS_TO_PIXELS/camera.transform.scale)+camera.transform.x;
        this.mouseLocation.y = -((event.clientY-ImageManager.offsetY)/ImageManager.METERS_TO_PIXELS/camera.transform.scale)+camera.transform.y;

        console.log(this.mouseLocation)

        if(this.holding)
        {
            this.holding.transform.x = this.mouseLocation.x;
            this.holding.transform.y = this.mouseLocation.y;
        }else if(this.isDragging)
        {
            camera.transform.x += (this.dragStart.x - this.mouseLocation.x);
            camera.transform.y += (this.dragStart.y - this.mouseLocation.y);
        }
        
    }

    static update()
    {
        if(this.keyboardDirectionVector.x || this.keyboardDirectionVector.y) camera.move(this.keyboardDirectionVector);
    }
}

//Global Objects
const worldCanvas = document.querySelector<HTMLCanvasElement>(".hamster-canvas")!
const worldCanvasContext = worldCanvas?.getContext("2d")!

worldCanvas.width = window.innerWidth;
worldCanvas.height = window.innerHeight;

ImageManager.init();
const camera = new Camera(new Area("NO WHERE"));
const world = new GameWorld();
const hamster = new Hamster(world.areas["field"], {x: 0, y: 0});

Game.init();
GameController.init();

function onWindowResize()
{
    ImageManager.windowUpdate();
}
window.addEventListener("resize", onWindowResize);

// G A M E   O P E R A T I O N S


console.log("MADE IT");

const fixedUpdate = setInterval(Game.update, Game.FIXED_UPDATE*1000);

/*
1/13

I HAVE SUCCESFFULY transfered my hamster game from javascript to typescript! Now we must continue to fix camera displaying and add funtionallity to everything!

*/