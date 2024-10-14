"use strict";
class Component {
    constructor() {
        this.parent = null;
    }
    setParent(parent) {
        this.parent = parent;
    }
}
class Transform extends Component {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.unscaledWidth = 0;
        this.unscaledHeight = 0;
        this.scale = 0;
    }
    init(parent, x, y, width, height, scale) {
        super.setParent(parent);
        this.x = x;
        this.y = y;
        this.unscaledWidth = width;
        this.unscaledHeight = height;
        this.scale = scale;
        this.width = width;
        this.height = height;
        this.applyScale(this.scale);
    }
    applyScale(scale) {
        this.width = this.unscaledWidth * scale;
        this.height = this.unscaledHeight * scale;
    }
}
class BoundingBox extends Component {
    constructor() {
        super();
        this.transform = new Transform();
        this.isInteractable = false;
        this.isCollidable = false;
        this.isPushable = false;
    }
    init(parent, transform, isInteractable, isCollidable, isPushable) {
        super.setParent(parent);
        this.transform = transform;
        this.isInteractable = isInteractable;
        this.isCollidable = isCollidable;
        this.isPushable = isPushable;
    }
    isPointInBounds(x, y) {
        return (this.transform.x - (this.transform.width)) <= x &&
            (this.transform.x + (this.transform.width)) >= x &&
            (this.transform.y - (this.transform.height)) <= y &&
            (this.transform.y + (this.transform.height)) >= y;
    }
    isCollidingWith(object) {
        /*
            ((Ax1 < Bx1 && Ax2 > Bx1) ||
            (Ax1 < Bx2 && Ax2 > Bx2)) && ((this.transform.y < object.transform.y && (this.transform.y + this.transform.height) > object.transform.y) ||
            (this.transform.y < (object.transform.y + object.transform.height) && (this.transform.y + this.transform.height) > (object.transform.y + object.transform.height)))
         */
        //console.log(this.parent, object);
        if (((this.transform.x < object.transform.x && (this.transform.x + this.transform.width) > object.transform.x) || (this.transform.x < (object.transform.x + object.transform.width) && (this.transform.x + this.transform.width) > (object.transform.x + object.transform.width))) && ((this.transform.y < object.transform.y && (this.transform.y + this.transform.height) > object.transform.y) || (this.transform.y < (object.transform.y + object.transform.height) && (this.transform.y + this.transform.height) > (object.transform.y + object.transform.height)))) {
            console.log("COLLISON");
            let overlapX1 = (object.transform.x + object.transform.width) - this.transform.x;
            let overlapX2 = object.transform.x - (this.transform.x + this.transform.width);
            let finalX = overlapX2;
            if (Math.abs(overlapX1) < Math.abs(overlapX2)) {
                finalX = overlapX1;
            }
            let overlapY1 = (object.transform.y + object.transform.height) - this.transform.y;
            let overlapY2 = object.transform.y - (this.transform.y + this.transform.height);
            let finalY = overlapY2;
            if (Math.abs(overlapY1) < Math.abs(overlapY2)) {
                finalY = overlapY1;
            }
            if (Math.abs(finalX) < Math.abs(finalY)) {
                if (this.isPushable)
                    this.transform.x += finalX / 2;
                if (object.boundingBox.isPushable)
                    object.transform.x -= finalX / 2;
            }
            else {
                if (this.isPushable)
                    this.transform.y += finalY / 2;
                if (object.boundingBox.isPushable)
                    object.transform.y -= finalY / 2;
            }
        }
        /*if(this.transform.x <= (object.transform.x + object.transform.width) && (this.transform.x + this.transform.width) >= (object.transform.x + object.transform.width))
        {
            console.log(this.parent, "is colliding case 2");
        }
        if(this.transform.y <= object.transform.y && (this.transform.y + this.transform.height) >= object.transform.y)
            {
                console.log(this.parent, "is colliding", object);
            }
        if(this.transform.y <= (object.transform.y + object.transform.height) && (this.transform.y + this.transform.height) >= (object.transform.y + object.transform.height))
        {
            console.log(this.parent, "is colliding case 2");
        }*/
    }
    isColliding() {
        var _a;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.areaIn.objects.forEach((object) => {
            if (this.parent != object) {
                this.isCollidingWith(object);
            }
        });
    }
    update() {
        this.isColliding();
    }
}
class Sprite extends Component {
    constructor() {
        super();
        this.image = ImageManager.images.unfound;
    }
    init(parent, image) {
        super.setParent(parent);
        this.image = image;
    }
}
class GameObject {
    constructor(area) {
        this.horizontalMovementSpeed = 0;
        this.verticalMovementSpeed = 0;
        this.movementVector = { x: 0, y: 0 };
        this.areaIn = area;
        this.areaIn.objects.push(this);
        this.transform = new Transform();
        this.sprite = new Sprite();
        this.boundingBox = new BoundingBox();
    }
    move() {
        //console.log(vector.x * this.horizontalMovementSpeed, vector.y * this.verticalMovementSpeed)
        this.transform.x += (this.movementVector.x * this.horizontalMovementSpeed) * Game.FIXED_UPDATE;
        this.transform.y += (this.movementVector.y * this.verticalMovementSpeed) * Game.FIXED_UPDATE;
        //console.log(this.transform.x, this.transform.y)
    }
    update() {
        this.boundingBox.update();
        this.move();
    }
}
class Camera extends GameObject {
    constructor(area) {
        super(area);
        this.horizontalMovementSpeed = 5;
        this.verticalMovementSpeed = 5;
        this.absoluteScale = 0;
        this.clampScale = true;
        this.transform.init(this, 0, 0, 0, 0, 0);
        this.scale(500);
    }
    scale(amount) {
        this.absoluteScale += amount / 100;
        this.transform.scale = Camera.GZC_A * Math.exp(-Math.pow(this.absoluteScale - Camera.GZC_B, 2) / (2 * Math.pow(Camera.GZC_C, 2)));
        //console.log(this.absoluteScale, this.transform.scale);
        if (this.absoluteScale > Camera.GZC_B) {
            this.clampScale = true;
        }
        else if (this.absoluteScale < 0) {
            this.clampScale = true;
        }
    }
    clampScaleContinuously() {
        if (this.clampScale) {
            if (this.absoluteScale > Camera.GZC_B) {
                this.absoluteScale -= 0.05;
            }
            else if (this.absoluteScale < 0) {
                this.absoluteScale += 0.05;
            }
        }
    }
    update() {
        this.clampScaleContinuously();
    }
}
//Guassion Zoom Curve
Camera.GZC_A = 50;
Camera.GZC_B = 25;
Camera.GZC_C = 9;
class TileGrid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array((this.width * this.height));
    }
}
class WorldChunk extends TileGrid {
    constructor(c, width, height) {
        super(width, height);
        this.baseCoordinate = c;
    }
    populate(type) {
        for (let i = 0; i < this.height * this.width; i++) {
            this.tiles[i] = type;
            if (Math.random() < 0.1) {
                this.tiles[i] = ImageManager.images["flower"];
            }
        }
    }
}
class Area {
    constructor(name) {
        this.chunks = new Array();
        this.objects = [];
        this.name = name;
    }
}
class GameWorld {
    constructor() {
        this.areas = {};
        this.initalizeAreas();
    }
    initalizeAreas() {
        this.areas["field"] = new Area("field");
        let c1 = new WorldChunk({ x: 0, y: 0 }, 16, 16);
        c1.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c1);
        let c2 = new WorldChunk({ x: -1, y: 0 }, 16, 16);
        c2.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c2);
        let c3 = new WorldChunk({ x: 0, y: -1 }, 16, 16);
        c3.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c3);
        let c4 = new WorldChunk({ x: -1, y: -1 }, 16, 16);
        c4.populate(ImageManager.images["grass"]);
        this.areas["field"].chunks.push(c4);
    }
    onDrag(mouseDrag) {
        console.log("I HAVE BEEN DRAGGED", mouseDrag);
    }
}
class ImageManager {
    /*
    Initalizes all game images into a dictionary, as "Sprite name": ImgHTMLObject.
    These images are held in the document, under the class "hidden-sprite", where the id is the sprite name.
    The class "hidden-sprite", hides the actual reference sprites from the user.
    */
    static init() {
        console.log("INITIALIZING GAME SPRITES:");
        document.querySelectorAll(".hidden-sprite").forEach((sprite, posistion) => {
            console.log("Sprite: ", posistion, sprite.id);
            this.images[sprite.id] = sprite;
        });
    }
    static drawArea() {
        camera.areaIn.chunks.forEach((chunk) => {
            //console.log(chunk)
            for (let x = 0; x < chunk.height; x++) {
                for (let y = 0; y < chunk.width; y++) {
                    worldCanvasContext.drawImage(chunk.tiles[(x + (y * (chunk.width)))], this.offsetX + (((((chunk.baseCoordinate.x) * 16) + x - camera.transform.x) - 0) * this.METERS_TO_PIXELS * camera.transform.scale), this.offsetY + (((((chunk.baseCoordinate.y) * 16) + y + camera.transform.y) - 0) * this.METERS_TO_PIXELS * camera.transform.scale), (this.METERS_TO_PIXELS * camera.transform.scale), (this.METERS_TO_PIXELS * camera.transform.scale));
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
    static drawGameObjects() {
        if (camera.areaIn) {
            camera.areaIn.objects.forEach((object) => {
                worldCanvasContext.drawImage(object.sprite.image, this.offsetX + ((((object.transform.x) - camera.transform.x)) * this.METERS_TO_PIXELS * camera.transform.scale), this.offsetY + ((((-object.transform.y - object.transform.width) + camera.transform.y)) * this.METERS_TO_PIXELS * camera.transform.scale), (object.transform.width * this.METERS_TO_PIXELS * camera.transform.scale), (object.transform.height * this.METERS_TO_PIXELS * camera.transform.scale));
            });
        }
    }
    static drawDebug() {
        worldCanvasContext.fillStyle = "#FF0000";
        worldCanvasContext === null || worldCanvasContext === void 0 ? void 0 : worldCanvasContext.fillRect(0, worldCanvas.height / 2 - 1, worldCanvas.width, 2);
        worldCanvasContext === null || worldCanvasContext === void 0 ? void 0 : worldCanvasContext.fillRect(worldCanvas.width / 2 - 1, 0, 2, worldCanvas.height);
        camera.areaIn.objects.forEach((object) => {
            worldCanvasContext.strokeRect(this.offsetX + ((((object.transform.x) - camera.transform.x)) * this.METERS_TO_PIXELS * camera.transform.scale), this.offsetY + ((((-object.transform.y) + camera.transform.y) - (object.transform.height)) * this.METERS_TO_PIXELS * camera.transform.scale), (object.transform.width * this.METERS_TO_PIXELS * camera.transform.scale), (object.transform.height * this.METERS_TO_PIXELS * camera.transform.scale));
        });
    }
    static draw() {
        worldCanvasContext.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
        worldCanvasContext.imageSmoothingEnabled = false;
        this.drawArea();
        this.drawGameObjects();
        this.drawDebug();
    }
    static windowUpdate() {
        worldCanvas.width = window.innerWidth;
        worldCanvas.height = window.innerHeight;
        this.offsetX = ((worldCanvas.width) / 2);
        this.offsetY = ((worldCanvas.height) / 2);
        this.draw();
    }
}
ImageManager.METERS_TO_PIXELS = 16; // This many pixels = 1 meter, used to convert an object's size in meters into pixels to be display, not scaled to camera scale.
ImageManager.images = {};
ImageManager.offsetX = 0; // This is the offset, in pixels, that objects need to be shifted over in order for them to be display in the middle.
ImageManager.offsetY = 0; // ^
class Entity extends GameObject {
    constructor(area, location, dimension, scale, sprite) {
        super(area);
        this.transform.init(this, location.x, location.y, dimension.x, dimension.y, scale);
        this.boundingBox.init(this, this.transform, true, true, true);
        this.sprite.init(this, sprite);
    }
}
class Structure extends GameObject {
    constructor(area, location, dimension, scale, sprite) {
        super(area);
        this.transform.init(this, location.x, location.y, dimension.x, dimension.y, scale);
        this.boundingBox.init(this, this.transform, false, true, false);
        this.sprite.init(this, sprite);
    }
}
class Hamster extends Entity {
    constructor(area, location) {
        super(area, location, { x: 1, y: 1 }, 1, ImageManager.images["happyFacingLeft"]);
        this.movementCooldown = 0;
        this.isHeld = false;
    }
}
class Fountain extends Structure {
    constructor(area, location) {
        super(area, location, { x: 4, y: 4 }, 1, ImageManager.images["fountain"]);
    }
}
class Game {
    static init() {
        console.log("INITIALIZING GAME:");
        ImageManager.windowUpdate();
        ImageManager.draw();
        camera.areaIn = world.areas["field"];
    }
    static intializeGameObjects() {
    }
    static updateGameObjects() {
        camera.areaIn.objects.forEach((object) => {
            object.update();
        });
    }
    static update() {
        GameController.update();
        Game.updateGameObjects();
        ImageManager.draw();
    }
}
Game.FIXED_UPDATE = 0.01;
class GameController {
    static init() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        document.addEventListener("wheel", this.handleMouseWheel.bind(this));
        document.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }
    static handleKeyDown(event) {
        if (!this.keysPressed.has(event.key.toLowerCase())) {
            this.keysPressed.add(event.key.toLowerCase());
            this.keyboardUpdate();
        }
    }
    static handleKeyUp(event) {
        this.keysPressed.delete(event.key.toLowerCase());
        this.keyboardUpdate();
    }
    static keyboardUpdate() {
        this.keyboardDirectionVector.x = 0;
        this.keyboardDirectionVector.y = 0;
        if (this.keysPressed.has("w")) {
            this.keyboardDirectionVector.y += 1;
        }
        if (this.keysPressed.has("s")) {
            this.keyboardDirectionVector.y += -1;
        }
        if (this.keysPressed.has("a")) {
            this.keyboardDirectionVector.x += -1;
        }
        if (this.keysPressed.has("d")) {
            this.keyboardDirectionVector.x += 1;
        }
        if (this.keyboardDirectionVector.x !== 0 && this.keyboardDirectionVector.y !== 0) {
            this.keyboardDirectionVector.x *= this.diagonalSpeedAdjustment;
            this.keyboardDirectionVector.y *= this.diagonalSpeedAdjustment;
        }
        this.focus.movementVector.y = 0;
        this.focus.movementVector.x = 0;
        if (this.keysPressed.has("w")) {
            this.focus.movementVector.y += 1;
        }
        if (this.keysPressed.has("s")) {
            this.focus.movementVector.y += -1;
        }
        if (this.keysPressed.has("a")) {
            this.focus.movementVector.x += -1;
        }
        if (this.keysPressed.has("d")) {
            this.focus.movementVector.x += 1;
        }
        if (this.focus.movementVector.x !== 0 && this.focus.movementVector.y !== 0) {
            this.focus.movementVector.x *= this.diagonalSpeedAdjustment;
            this.focus.movementVector.y *= this.diagonalSpeedAdjustment;
        }
        //console.log(this.focus);
    }
    static handleMouseWheel(event) {
        camera.scale(event.deltaY);
    }
    static handleMouseDown(event) {
        this.isDragging = true;
        this.dragStart.x = this.mouseLocation.x;
        this.dragStart.y = this.mouseLocation.y;
        camera.areaIn.objects.forEach((object) => {
            if (object.boundingBox.isInteractable) {
                if (object.boundingBox.isPointInBounds(this.mouseLocation.x, this.mouseLocation.y)) {
                    this.holding = object;
                }
            }
        });
    }
    static handleMouseUp(event) {
        this.isDragging = false;
        this.holding = null;
    }
    static handleMouseMove(event) {
        this.mouseLocation.x = ((event.clientX - ImageManager.offsetX) / ImageManager.METERS_TO_PIXELS / camera.transform.scale) + camera.transform.x;
        this.mouseLocation.y = -((event.clientY - ImageManager.offsetY) / ImageManager.METERS_TO_PIXELS / camera.transform.scale) + camera.transform.y;
        console.log(this.mouseLocation);
        if (this.holding) {
            this.holding.transform.x = this.mouseLocation.x - this.holding.transform.width / 2;
            this.holding.transform.y = this.mouseLocation.y - this.holding.transform.height / 2;
        }
        else if (this.isDragging) {
            camera.transform.x += (this.dragStart.x - this.mouseLocation.x);
            camera.transform.y += (this.dragStart.y - this.mouseLocation.y);
        }
    }
    static update() {
        if (this.keyboardDirectionVector.x || this.keyboardDirectionVector.y)
            camera.move();
    }
}
GameController.keysPressed = new Set();
GameController.changeInScroll = 0;
GameController.mousePress = "";
GameController.isDragging = false;
GameController.dragStart = {
    x: 0,
    y: 0
};
GameController.mouseLocation = {
    x: 0,
    y: 0
};
GameController.keyboardDirectionVector = {
    x: 0,
    y: 0
};
GameController.diagonalSpeedAdjustment = 1 / Math.sqrt(2);
GameController.holding = null;
//Global Objects
const worldCanvas = document.querySelector(".hamster-canvas");
const worldCanvasContext = worldCanvas === null || worldCanvas === void 0 ? void 0 : worldCanvas.getContext("2d");
worldCanvas.width = window.innerWidth;
worldCanvas.height = window.innerHeight;
ImageManager.init();
const camera = new Camera(new Area("NO WHERE"));
const world = new GameWorld();
const hamster = new Hamster(world.areas["field"], { x: 0, y: 3 });
const hamster2 = new Hamster(world.areas["field"], { x: 0, y: 0 });
hamster2.transform.applyScale(1);
const fountain = new Fountain(world.areas["field"], { x: 0, y: 0 });
Game.init();
GameController.init();
GameController.focus = hamster2;
function onWindowResize() {
    ImageManager.windowUpdate();
}
window.addEventListener("resize", onWindowResize);
// G A M E   O P E R A T I O N S
console.log("MADE IT");
const fixedUpdate = setInterval(Game.update, Game.FIXED_UPDATE * 1000);
/*
1/13

I HAVE SUCCESFFULY transfered my hamster game from javascript to typescript! Now we must continue to fix camera displaying and add funtionallity to everything!

*/ 
