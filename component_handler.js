// html elements
const CVS = document.getElementById("main_canvas");
const CTX = CVS.getContext("2d");

const VMHP_LEFT = document.getElementById("vmhp_left");
const VMHP_TOP = document.getElementById("vmhp_top");
const VMHP_RIGHT = document.getElementById("vmhp_right");
const VMHP_BOTTOM = document.getElementById("vmhp_bottom");


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