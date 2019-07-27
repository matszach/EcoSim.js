// html elements
const CVS = document.getElementById("main_canvas");
const CTX = CVS.getContext("2d");

const VMHP_LEFT = document.getElementById("vmhp_left");
const VMHP_TOP = document.getElementById("vmhp_top");
const VMHP_RIGHT = document.getElementById("vmhp_right");
const VMHP_BOTTOM = document.getElementById("vmhp_bottom");

const NS_SLD_WIDTH = document.getElementById("ns_sld_width");
const NS_SLD_HEIGHT = document.getElementById("ns_sld_height");
const NS_SLD_RABBITS = document.getElementById("ns_sld_rabbits");
const NS_SLD_FOXES = document.getElementById("ns_sld_foxes");
const NS_SLD_NOF_PONDS = document.getElementById("ns_sld_nof_ponds");
const NS_SLD_POND_SIZE = document.getElementById("ns_sld_pond_size");
const NS_SLD_PLANT_DENSITY = document.getElementById("ns_sld_plant_density");


const SLD_SCALE = document.getElementById("scale_slider");


// fits canvas, and other componets to window
function fitToWindow(){

    // new size as variables
    w = window.innerWidth;
    h = window.innerHeight;

    // resize background canvas
    CTX.canvas.width = w;
    CTX.canvas.height = h;

    // resize and move movement panels
    VMHP_TOP.style.width = w + "px";
    VMHP_TOP.style.height = VMPH_THICKNESS + "px";
    VMHP_TOP.style.marginLeft = "0px";
    VMHP_TOP.style.marginTop = "0px";

    VMHP_BOTTOM.style.width = w + "px";
    VMHP_BOTTOM.style.height = VMPH_THICKNESS + "px";
    VMHP_BOTTOM.style.marginLeft = "0px";
    VMHP_BOTTOM.style.marginTop = h - VMPH_THICKNESS + "px";

    VMHP_LEFT.style.width = VMPH_THICKNESS + "px";
    VMHP_LEFT.style.height = h + "px";
    VMHP_LEFT.style.marginLeft = "0px";
    VMHP_LEFT.style.marginTop = "0px";

    VMHP_RIGHT.style.width = VMPH_THICKNESS + "px";
    VMHP_RIGHT.style.height = h + "px";
    VMHP_RIGHT.style.marginLeft = w - VMPH_THICKNESS + "px";
    VMHP_RIGHT.style.marginTop = "0px";

}

// Fired on window resize.
// Note that not a return value of a function ("function()""),
// but the function itself ("function") is bound to the trigger.
window.onresize = fitToWindow;

// apply new "isMouseDown" field to side panels
VMHP_LEFT.isMouseDown = false;
VMHP_TOP.isMouseDown = false;
VMHP_RIGHT.isMouseDown = false;
VMHP_BOTTOM.isMouseDown = false;

// set triggers to change the field's state
VMHP_LEFT.onmouseenter = () => VMHP_LEFT.isMouseDown = true;
VMHP_LEFT.onmouseleave = () => VMHP_LEFT.isMouseDown = false;
VMHP_TOP.onmouseenter = () => VMHP_TOP.isMouseDown = true;
VMHP_TOP.onmouseleave = () => VMHP_TOP.isMouseDown = false;
VMHP_RIGHT.onmouseenter = () => VMHP_RIGHT.isMouseDown = true;
VMHP_RIGHT.onmouseleave = () => VMHP_RIGHT.isMouseDown = false;
VMHP_BOTTOM.onmouseenter = () => VMHP_BOTTOM.isMouseDown = true;
VMHP_BOTTOM.onmouseleave = () => VMHP_BOTTOM.isMouseDown = false;

// start a loop that will move view according to user's mouse positon
function doMoveView(){
    if(VMHP_RIGHT.isMouseDown && ROOT_X > MIN_X) {
        ROOT_X -= getScreenScrollDistance();
    } else if (VMHP_BOTTOM.isMouseDown && ROOT_Y > MIN_Y){
        ROOT_Y -= getScreenScrollDistance();
    } else if(VMHP_LEFT.isMouseDown && ROOT_X < MAX_X){
        ROOT_X += getScreenScrollDistance();
    } else if (VMHP_TOP.isMouseDown && ROOT_Y < MAX_Y){
        ROOT_Y += getScreenScrollDistance();
    }
}

function getScreenScrollDistance(){
    return Math.ceil(24/UNIT);
}

// scaling
function doAdjustScale(){
    curr_slider_value = parseInt(SLD_SCALE.value);
    if(UNIT != curr_slider_value){
        setScale(curr_slider_value);
    }
}

function setScale(newUnitSize){

    if(newUnitSize > MAX_UNIT_SIZE || newUnitSize < MIN_UNIT_SIZE){
        return;
    }

    w = window.innerWidth;
    wOld = w/2/UNIT;
    wNew = w/2/newUnitSize;
    ROOT_X -= Math.round(wOld - wNew);

    h = window.innerHeight; 
    hOld = h/2/UNIT;
    hNew = h/2/newUnitSize;
    ROOT_Y -= Math.round(hOld - hNew);

    UNIT = newUnitSize;
    SLD_SCALE.value = UNIT;
}

function setScaleByWheel(delta){
    if(delta<0){
        setScale(UNIT+SCROLL_SCALE_INCREMENT);
    } else {
        setScale(UNIT-SCROLL_SCALE_INCREMENT);
    }
}

window.addEventListener('wheel', (e) => setScaleByWheel(e.deltaY));



function doAdjustView(){
    doMoveView();
    doAdjustScale();
}



setInterval(doAdjustView, 35);