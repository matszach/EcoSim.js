// default and value of the unit of measuremet
const MIN_UNIT_SIZE = 1;
var UNIT = 24;
const MAX_UNIT_SIZE = 200;

// entities and map will be drawn with an offset based on these,
// positive whole numbers only
// * init values place view on initial load neatly in in the center
var ROOT_X = 5; 
var ROOT_Y = -15;
// * temp values, overriden on load and resize
var MIN_X = 0; 
var MIN_Y = 0; 
var MAX_X = 0; 
var MAX_Y = 0; 

// controls if the grid should be drawn
var SHOULD_DRAW_GRID = true;

// view movement interval
var SCROLL_SPEED = 40;