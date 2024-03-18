//Grab document objects
let paintCanvas = document.querySelector(".paint-canvas");
let paint = paintCanvas.getContext("2d");

document.onmousemove = fetchPaintBrushPositionRelativeToPaintCanvas;
document.onmousedown = () => {paintBrush.isDrawing = true; draw();}
document.onmouseup = () => {paintBrush.isDrawing = false;}

let paintBrush = 
{
    x: 0,
    y: 0,
    radius: 5,
    isDrawing: false
}





function fetchPaintBrushPositionRelativeToPaintCanvas(event)
{
    let rect = paintCanvas.getBoundingClientRect()
    paintBrush.x = event.clientX - rect.left;
    paintBrush.y = event.clientY - rect.top;

    draw();
};

function draw()
{
    if(paintBrush.isDrawing)
    {
        
        paint.beginPath();
        paint.fillStyle = "black";
        paint.arc(paintBrush.x, paintBrush.y, paintBrush.radius, 0, 2 * Math.PI, false);
        paint.fill();
    }
}
