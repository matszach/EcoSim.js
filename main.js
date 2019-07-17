// clear canvas every frame
function clearCanvas(){
    CTX.clearRect(0, 0, CTX.canvas.width, CTX.canvas.height);
}

// draws unit grid
function drawGrid(){

    w = window.innerWidth;
    h = window.innerHeight;

    CTX.strokeStyle = GRID_COLOR;
    CTX.lineWidth = GRID_WIDTH;
    CTX.beginPath();

    for(i = 1; i < w/UNIT; i++) {
        x = i * UNIT;
        CTX.moveTo(x, 0);
        CTX.lineTo(x, h);
    }

    for(i = 1; i < h/UNIT; i++) {
        y = i * UNIT;
        CTX.moveTo(0, y);
        CTX.lineTo(w, y);
    }

    CTX.stroke();
}

// main game loop called on an interval
function mainLoop(){
    clearCanvas();
    runOneSimulationRound();
    drawGrid();
}

// updating interval
function updateInterval(newInterval){
    INTERVAL = newInterval;
    clearInterval(MAIN_LOOP);
    MAIN_LOOP = setInterval(mainLoop, INTERVAL);
}

// init
fitToWindow();
drawGrid();

// the INTERVAL can be changed later to allow for speeding and slowing down the game
MAIN_LOOP = setInterval(mainLoop, INTERVAL);