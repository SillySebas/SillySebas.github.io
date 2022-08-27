//Grab document objects
let graph = document.querySelector(".graph-canvas");
let graphCanvas = graph.getContext("2d");

graphCanvas.font = "15px Arial"

const XOFFSET = graph.width/2;
const YOFFSET = graph.height/2;
const XLIMIT = graph.width;
const YLIMIT = graph.height;

const GRAPHMEASURES = 10;

let viewOriginX = 0;
let viewOriginY = 0;

let zoomRaw = 0;
let zoomFactor = 1;

let clarity = 5;

mouseDrag = {
    startX: 0,
    startY: 0,
    originalViewOriginX: 0,
    originalViewOriginY: 0,
    endX: 0,
    endY: 0
}
let isDragging = false;

let func = "x"
//Set document event handlers to new functions
document.onmousedown = onDragGraph;
document.onmouseup = ()=>{isDragging = false; updateGraph();}
document.onmousemove = dragGraph;
document.onwheel = onZoom;

//Zoom graph when mouse wheel is scrolled
function onZoom(event)
{
    zoomRaw += Math.abs(event.wheelDelta)/event.wheelDelta;
    if (zoomRaw == 0)
    {
        zoomRaw += Math.abs(event.wheelDelta)/event.wheelDelta;
    }

    if(zoomRaw > 0)
    {
        zoomFactor = (zoomRaw*zoomRaw);
    }else
    {
        zoomFactor = 1/(zoomRaw*zoomRaw);
    }

    updateGraph();
}
//Start dragging graph when mouse is clicked
function onDragGraph(event) {
    isDragging = true;
    //Save the starting mouse location and viewpoint location
    mouseDrag.startX = event.clientX;
    mouseDrag.startY = event.clientY;
    mouseDrag.originalViewOriginX = viewOriginX;
    mouseDrag.originalViewOriginY = viewOriginY;
    mouseDrag.endX = event.clientX;
    mouseDrag.endY = event.clientY;
    updateGraph();
}

//Drags graph to new viewpoint
function dragGraph(event) {
    if (isDragging){
        mouseDrag.endX = event.clientX;
        mouseDrag.endY = event.clientY;

        //Use the difference between the starting mouse location and the new mouse location to adjust the viewpoint accordingly
        viewOriginX = mouseDrag.originalViewOriginX + (mouseDrag.endX - mouseDrag.startX);
        viewOriginY = mouseDrag.originalViewOriginY + (mouseDrag.endY - mouseDrag.startY);
        
        updateGraph();
    }
    
}

//Draws graph axes
function drawGraphAxes()
{
    graphCanvas.fillStyle = "black";
    //Draw x axis
    graphCanvas.fillRect(0, YOFFSET+viewOriginY, XLIMIT, 1);
    //Draw y axis
    graphCanvas.fillRect(XOFFSET+viewOriginX, 0, 1, YLIMIT);
}

//Draws the measures on the graph
function drawGraphMeasures()
{
    //Checks to see if the measures are properly filling the user's view of the graph, and adjusts the clarity of the measures accordingly
    if(GRAPHMEASURES*clarity*zoomFactor > XLIMIT)
    {
        clarity = clarity/2
    }else if (GRAPHMEASURES*clarity*zoomFactor < XOFFSET)
    {
        clarity = clarity*2
    }

    //Variablized to remove unnecessary recalculation
    let xReposistioning = (XOFFSET+viewOriginX)-(viewOriginX - viewOriginX%(clarity*zoomFactor));
    let yReposistioning = (YOFFSET+viewOriginY)-(viewOriginY - viewOriginY%(clarity*zoomFactor));

    //Loops through total number of graph measures
    for(let i = -GRAPHMEASURES; i<=GRAPHMEASURES; i++)
    {
        graphCanvas.fillStyle = "blue";

        //Draws horizontal measure line
        graphCanvas.fillRect(0, (zoomFactor*clarity*i)+yReposistioning, XLIMIT, 1);
        //Draws vertical measure line
        graphCanvas.fillRect((zoomFactor*clarity*i)+xReposistioning, 0, 1, YLIMIT);

        graphCanvas.fillStyle = "black";

        let lineX = (XOFFSET+viewOriginX)
        let lineY = (YOFFSET+viewOriginY)

        let textX = String((clarity*i)-((viewOriginX/zoomFactor) - (viewOriginX/zoomFactor)%(clarity)))
        let textY = String((clarity*i)+((viewOriginY/zoomFactor) - (viewOriginY/zoomFactor)%(clarity)))

        //Conditionals for when text would be drawn outside of view
        if (viewOriginX > XOFFSET - graphCanvas.measureText(textX).width)
        {
            lineX = XLIMIT - graphCanvas.measureText(textX).width;
        }else if (viewOriginX < -XOFFSET)
        {
            lineX = 0;
        }

        if (viewOriginY > YOFFSET)
        {
            lineY = YLIMIT;
        }else if (viewOriginY < -YOFFSET)
        {
            lineY = graphCanvas.measureText(textY).actualBoundingBoxAscent;
        }
    

        //Draws horizontal measure value
        graphCanvas.fillText(textX, (zoomFactor*clarity*i)+xReposistioning, lineY);
        //Draws vertical measure value
        graphCanvas.fillText(textY, lineX, -(zoomFactor*clarity*i)+yReposistioning);
        
    }
}

//Draws a given function on the graph
function drawFunction(f)
{
    let y = 0;
    let x = 0;

    let precision = false;
    if (clarity < 1)
    {
        precision = true;
    }

    graphCanvas.beginPath();
    graphCanvas.strokeStyle = "red";

    //Loops through the total number of pixels being drawn on the x-axis of the canvas
    for (let i = (-XOFFSET); i < (XOFFSET); i++)
    {
        //Adjust x to correspond to where the user is looking on the graph and to the precision of the zoom factor
        x = (i-viewOriginX)/zoomFactor;

        //Calculate y using x and the given function
        y= x*x*x
        
        //Draw the the new calculated point, and move the stroke to the same point to create a continous line
        graphCanvas.lineTo(Math.floor(x*(zoomFactor)+XOFFSET+viewOriginX), Math.floor(-y*(zoomFactor)+YOFFSET+viewOriginY));
        graphCanvas.moveTo(Math.floor(x*(zoomFactor)+XOFFSET+viewOriginX), Math.floor(-y*(zoomFactor)+YOFFSET+viewOriginY));
        if(isDragging && i == (mouseDrag.endX-XOFFSET)-graph.offsetLeft)
        {
            graphCanvas.fillStyle = "Green";

            if (precision) {
                graphCanvas.fillText("("+String(x)+", "+String(y)+")", Math.floor(x*(zoomFactor)+XOFFSET+viewOriginX), Math.floor(-y*(zoomFactor)+YOFFSET+viewOriginY)+graphCanvas.measureText("(").actualBoundingBoxAscent);
}
            else {
                graphCanvas.fillText("("+String(Math.round(x*100)/100)+", "+String(Math.round(y*100)/100)+")", Math.floor(x*(zoomFactor)+XOFFSET+viewOriginX), Math.floor(-y*(zoomFactor)+YOFFSET+viewOriginY)+graphCanvas.measureText("(").actualBoundingBoxAscent);
            }
        }
    }
    graphCanvas.stroke();
}

function stringToExpression(f)
{
    mathFunctions = ["sin", "tan",]
    mathExpressions = ["/","*","-","+"]
}

//Runs each function responsible for displaying the graph
function updateGraph()
{
    //Clears graph
    graphCanvas.clearRect(0,0, XLIMIT, YLIMIT);
    drawGraphMeasures();
    drawGraphAxes();
    
    drawFunction("");
}

updateGraph();