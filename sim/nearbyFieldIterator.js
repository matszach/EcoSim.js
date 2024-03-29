
class NerbyFieldIterator{

    reset(newX, newY){
        this.x = newX;
        this.y = newY;
        this.i = 0;
        this.pattern = getRandomPattern();
    }

    getNext(){
        this.i ++;
        var p = this.pattern[this.i];
        return [this.x + p[0], this.y + p[1]];
    }

    hasNext(){
        return this.i < this.range;
    }

    constructor(initX, initY, range){
        this.x = initX;
        this.y = initY;
        this.range = range;
        this.i = 0;
        this.pattern = getRandomPattern();
    }

}

const FIELD_PATTERN_1 = [
    [-1,0], [0,-1], [1,0], [0,1],        // "radius" 1                    
    [-1,-1], [1,-1], [1,1], [-1,1],      // sight 8

    [-2,0], [0,-2], [2,0], [0,2],        // "radius" 2                      
    [-2,-1], [1,-2], [2,1], [-1,2],     
    [-2,1], [-1,-2], [2,-1], [1,2],                        
    [-2,-2], [2,-2], [2,2], [-2,2],      // sight 24

    [-3,0], [0,-3], [3,0], [0,3],        // "radius" 3
    [-3,-1], [1,-3], [3,1], [-1,3], 
    [-3,1], [-1,-3], [3,-1], [1,3],  
    [-3,-2], [2,-3], [3,2], [-2,3], 
    [-3,2], [-2,-3], [3,-2], [2,3], 
    [-3,-3], [3,-3], [3,3], [-3,3],      // sight 48
    
    [-4,0], [0,-4], [4,0], [0,4],        // "radius" 4
    [-4,-1], [1,-4], [4,1], [-1,4], 
    [-4,1], [-1,-4], [4,-1], [1,4],  
    [-4,-2], [2,-4], [4,2], [-2,4], 
    [-4,2], [-2,-4], [4,-2], [2,4], 
    [-4,-3], [3,-4], [4,3], [-3,4], 
    [-4,3], [-3,-4], [4,-3], [3,4], 
    [-4,-4], [4,-4], [4,4], [-4,4],      // sight 80
    
    [-5,0], [0,-5], [5,0], [0,5],        // "radius" 5
    [-5,-1], [1,-5], [5,1], [-1,5], 
    [-5,1], [-1,-5], [5,-1], [1,5],  
    [-5,-2], [2,-5], [5,2], [-2,5], 
    [-5,2], [-2,-5], [5,-2], [2,5], 
    [-5,-3], [3,-5], [5,3], [-3,5], 
    [-5,3], [-3,-5], [5,-3], [3,5], 
    [-5,-4], [4,-5], [5,4], [-4,5], 
    [-5,4], [-4,-5], [5,-4], [4,5],
    [-5,-5], [5,-5], [5,5], [-5,5],      // sight 120

    [-6,0], [0,-6], [6,0], [0,6],        // "radius" 6
    [-6,-1], [1,-6], [6,1], [-1,6], 
    [-6,1], [-1,-6], [6,-1], [1,6],  
    [-6,-2], [2,-6], [6,2], [-2,6], 
    [-6,2], [-2,-6], [6,-2], [2,6], 
    [-6,-3], [3,-6], [6,3], [-3,6], 
    [-6,3], [-3,-6], [6,-3], [3,6], 
    [-6,-4], [4,-6], [6,4], [-4,6], 
    [-6,4], [-4,-6], [6,-4], [4,6],
    [-6,-5], [5,-6], [6,5], [-5,6], 
    [-6,5], [-5,-6], [6,-5], [5,6],
    [-6,-6], [6,-6], [6,6], [-6,6],      // sight 168

    [-7,0], [0,-7], [7,0], [0,7],        // "radius" 7
    [-7,-1], [1,-7], [7,1], [-1,7], 
    [-7,1], [-1,-7], [7,-1], [1,7],  
    [-7,-2], [2,-7], [7,2], [-2,7], 
    [-2,2], [-2,-7], [7,-2], [2,7], 
    [-7,-3], [3,-7], [7,3], [-3,7], 
    [-7,3], [-3,-7], [7,-3], [3,7], 
    [-7,-4], [4,-7], [7,4], [-4,7], 
    [-7,4], [-4,-7], [7,-4], [4,7],
    [-7,-5], [5,-7], [7,5], [-5,7], 
    [-7,5], [-5,-7], [7,-5], [5,7],
    [-7,-6], [6,-7], [7,6], [-6,7], 
    [-7,6], [-6,-7], [7,-6], [6,7],
    [-7,-7], [7,-7], [7,7], [-7,7],      // sight 224

    [-8,0], [0,-8], [8,0], [0,8],        // "radius" 8
    [-8,-1], [1,-8], [8,1], [-1,8], 
    [-8,1], [-1,-8], [8,-1], [1,8],  
    [-8,-2], [2,-8], [8,2], [-2,8], 
    [-2,2], [-2,-8], [8,-2], [2,8], 
    [-8,-3], [3,-8], [8,3], [-3,8], 
    [-8,3], [-3,-8], [8,-3], [3,8], 
    [-8,-4], [4,-8], [8,4], [-4,8], 
    [-8,4], [-4,-8], [8,-4], [4,8],
    [-8,-5], [5,-8], [8,5], [-5,8], 
    [-8,5], [-5,-8], [8,-5], [5,8],
    [-8,-6], [6,-8], [8,6], [-6,8], 
    [-8,6], [-6,-8], [8,-6], [6,8],
    [-8,-7], [7,-8], [8,7], [-7,8], 
    [-8,7], [-7,-8], [8,-7], [7,8],
    [-8,-8], [8,-8], [8,8], [-8,8]       // sight 288
]

const FIELD_PATTERN_2 = [
    [0,1], [-1,0], [0,-1], [1,0],         // "radius" 1                    
    [-1,1], [-1,-1], [1,-1], [1,1],    

    [0,2],[-2,0], [0,-2], [2,0],         // "radius" 2                      
    [-1,2], [-2,-1], [1,-2], [2,1],     
    [1,2],[-2,1], [-1,-2], [2,-1],                         
    [-2,2], [-2,-2], [2,-2], [2,2], 

    [0,3], [-3,0], [0,-3], [3,0],        // "radius" 3
    [-1,3],[-3,-1], [1,-3], [3,1],  
    [1,3],  [-3,1], [-1,-3], [3,-1], 
    [-2,3],[-3,-2], [2,-3], [3,2],  
    [2,3],[-3,2], [-2,-3], [3,-2],  
    [-3,3], [-3,-3], [3,-3], [3,3], 
    
    [0,4], [-4,0], [0,-4], [4,0],        // "radius" 4
    [-1,4], [-4,-1], [1,-4], [4,1], 
    [1,4],  [-4,1], [-1,-4], [4,-1], 
    [-2,4], [-4,-2], [2,-4], [4,2], 
    [2,4], [-4,2], [-2,-4], [4,-2], 
    [-3,4], [-4,-3], [3,-4], [4,3], 
    [3,4], [-4,3], [-3,-4], [4,-3], 
    [-4,4], [-4,-4], [4,-4], [4,4], 
    
    [0,5], [-5,0], [0,-5], [5,0],       // "radius" 5
    [-1,5],[-5,-1], [1,-5], [5,1],  
    [1,5],  [-5,1], [-1,-5], [5,-1], 
    [-2,5],[-5,-2], [2,-5], [5,2],  
    [2,5],[-5,2], [-2,-5], [5,-2],  
    [-3,5], [-5,-3], [3,-5], [5,3], 
    [3,5],[-5,3], [-3,-5], [5,-3],  
    [-4,5],[-5,-4], [4,-5], [5,4],  
    [4,5],[-5,4], [-4,-5], [5,-4], 
    [-5,5],[-5,-5], [5,-5], [5,5], 

    [0,6], [-6,0], [0,-6], [6,0],        // "radius" 6
    [-1,6], [-6,-1], [1,-6], [6,1],
    [1,6], [-6,1], [-1,-6], [6,-1],  
    [-2,6], [-6,-2], [2,-6], [6,2],
    [2,6], [-6,2], [-2,-6], [6,-2], 
    [-3,6],[-6,-3], [3,-6], [6,3],  
    [3,6], [-6,3], [-3,-6], [6,-3], 
    [-4,6],[-6,-4], [4,-6], [6,4], 
    [4,6],[-6,4], [-4,-6], [6,-4], 
    [-5,6], [-6,-5], [5,-6], [6,5], 
    [5,6],[-6,5], [-5,-6], [6,-5],
    [-6,6],[-6,-6], [6,-6], [6,6], 

    [0,7], [-7,0], [0,-7], [7,0],        // "radius" 7
    [-1,7],[-7,-1], [1,-7], [7,1],  
    [1,7],  [-7,1], [-1,-7], [7,-1],
    [-2,7], [-7,-2], [2,-7], [7,2],
    [2,7], [-2,2], [-2,-7], [7,-2], 
    [-3,7], [-7,-3], [3,-7], [7,3], 
    [3,7], [-7,3], [-3,-7], [7,-3], 
    [-4,7], [-7,-4], [4,-7], [7,4], 
    [4,7],[-7,4], [-4,-7], [7,-4], 
    [-5,7], [-7,-5], [5,-7], [7,5], 
    [5,7],[-7,5], [-5,-7], [7,-5], 
    [-6,7],[-7,-6], [6,-7], [7,6],  
    [6,7],[-7,6], [-6,-7], [7,-6], 
    [-7,7],[-7,-7], [7,-7], [7,7], 

    [0,8],[-8,0], [0,-8], [8,0],         // "radius" 8
    [-1,8], [-8,-1], [1,-8], [8,1], 
    [1,8], [-8,1], [-1,-8], [8,-1], 
    [-2,8], [-8,-2], [2,-8], [8,2], 
    [2,8],[-2,2], [-2,-8], [8,-2], 
    [-3,8], [-8,-3], [3,-8], [8,3], 
    [3,8],[-8,3], [-3,-8], [8,-3],  
    [-4,8], [-8,-4], [4,-8], [8,4], 
    [4,8],[-8,4], [-4,-8], [8,-4], 
    [-5,8], [-8,-5], [5,-8], [8,5], 
    [5,8],[-8,5], [-5,-8], [8,-5], 
    [-6,8],[-8,-6], [6,-8], [8,6],  
    [6,8],[-8,6], [-6,-8], [8,-6],
    [-7,8],[-8,-7], [7,-8], [8,7],  
    [7,8],[-8,7], [-7,-8], [8,-7], 
    [-8,8], [-8,-8], [8,-8], [8,8], 
]

const FIELD_PATTERN_3 = [
    [1,0], [0,1],[-1,0], [0,-1],         // "radius" 1                    
    [1,1], [-1,1],   [-1,-1], [1,-1],  

    [2,0], [0,2], [-2,0], [0,-2],        // "radius" 2                      
    [2,1], [-1,2],[-2,-1], [1,-2],      
    [2,-1], [1,2],  [-2,1], [-1,-2],                       
    [2,2], [-2,2], [-2,-2], [2,-2], 

    [3,0], [0,3], [-3,0], [0,-3],        // "radius" 3
    [3,1], [-1,3], [-3,-1], [1,-3], 
    [3,-1], [1,3],[-3,1], [-1,-3],   
    [3,2], [-2,3], [-3,-2], [2,-3], 
    [3,-2], [2,3],[-3,2], [-2,-3],  
    [3,3], [-3,3], [-3,-3], [3,-3],
    
    [4,0], [0,4],[-4,0], [0,-4],        // "radius" 4
    [4,1], [-1,4], [-4,-1], [1,-4],
    [4,-1], [1,4], [-4,1], [-1,-4],  
    [4,2], [-2,4],[-4,-2], [2,-4],  
    [4,-2], [2,4], [-4,2], [-2,-4], 
    [4,3], [-3,4], [-4,-3], [3,-4], 
    [4,-3], [3,4],[-4,3], [-3,-4], 
    [4,4], [-4,4],[-4,-4], [4,-4],  
    
    [5,0], [0,5],[-5,0], [0,-5],         // "radius" 5
    [5,1], [-1,5], [-5,-1], [1,-5], 
    [5,-1], [1,5],[-5,1], [-1,-5],   
    [5,2], [-2,5], [-5,-2], [2,-5], 
    [5,-2], [2,5], [-5,2], [-2,-5], 
    [5,3], [-3,5], [-5,-3], [3,-5], 
    [5,-3], [3,5],[-5,3], [-3,-5],  
    [5,4], [-4,5], [-5,-4], [4,-5], 
    [5,-4], [4,5],[-5,4], [-4,-5],
    [5,5], [-5,5],[-5,-5], [5,-5], 

    [6,0], [0,6], [-6,0], [0,-6],        // "radius" 6
    [6,1], [-1,6],[-6,-1], [1,-6],  
    [6,-1], [1,6],  [-6,1], [-1,-6], 
    [6,2], [-2,6], [-6,-2], [2,-6], 
    [6,-2], [2,6], [-6,2], [-2,-6], 
    [6,3], [-3,6], [-6,-3], [3,-6], 
    [6,-3], [3,6], [-6,3], [-3,-6],
    [6,4], [-4,6],[-6,-4], [4,-6],  
    [6,-4], [4,6],[-6,4], [-4,-6], 
    [6,5], [-5,6], [-6,-5], [5,-6], 
    [6,-5], [5,6],[-6,5], [-5,-6], 
    [6,6], [-6,6],[-6,-6], [6,-6], 

    [7,0], [0,7], [-7,0], [0,-7],        // "radius" 7
    [7,1], [-1,7], [-7,-1], [1,-7], 
    [7,-1], [1,7],  [-7,1], [-1,-7],
    [7,2], [-2,7], [-7,-2], [2,-7],
    [7,-2], [2,7], [-2,2], [-2,-7], 
    [7,3], [-3,7], [-7,-3], [3,-7], 
    [7,-3], [3,7], [-7,3], [-3,-7],
    [7,4], [-4,7], [-7,-4], [4,-7], 
    [7,-4], [4,7],[-7,4], [-4,-7], 
    [7,5], [-5,7],[-7,-5], [5,-7], 
    [7,-5], [5,7],[-7,5], [-5,-7], 
    [7,6], [-6,7], [-7,-6], [6,-7], 
    [7,-6], [6,7],[-7,6], [-6,-7], 
    [7,7], [-7,7],[-7,-7], [7,-7],

    [8,0], [0,8],  [-8,0], [0,-8],       // "radius" 8
    [8,1], [-1,8], [-8,-1], [1,-8], 
    [8,-1], [1,8],  [-8,1], [-1,-8], 
    [8,2], [-2,8], [-8,-2], [2,-8], 
    [8,-2], [2,8], [-2,2], [-2,-8], 
    [8,3], [-3,8], [-8,-3], [3,-8], 
    [8,-3], [3,8],[-8,3], [-3,-8],  
    [8,4], [-4,8],[-8,-4], [4,-8],  
    [8,-4], [4,8],[-8,4], [-4,-8], 
    [8,5], [-5,8],[-8,-5], [5,-8],  
    [8,-5], [5,8],[-8,5], [-5,-8], 
    [8,6], [-6,8], [-8,-6], [6,-8], 
    [8,-6], [6,8],[-8,6], [-6,-8], 
    [8,7], [-7,8],[-8,-7], [7,-8],  
    [8,-7], [7,8],[-8,7], [-7,-8], 
    [8,8], [-8,8], [-8,-8], [8,-8]
]

const FIELD_PATTERN_4 = [
    [0,-1], [1,0], [0,1], [-1,0],        // "radius" 1                    
    [1,-1], [1,1], [-1,1], [-1,-1], 

    [0,-2], [2,0], [0,2], [-2,0],        // "radius" 2                      
    [1,-2], [2,1], [-1,2],  [-2,-1],   
    [-1,-2], [2,-1], [1,2],   [-2,1],                     
    [2,-2], [2,2], [-2,2], [-2,-2],

    [0,-3], [3,0], [0,3], [-3,0],        // "radius" 3
    [1,-3], [3,1], [-1,3], [-3,-1],
    [-1,-3], [3,-1], [1,3],  [-3,1], 
    [2,-3], [3,2], [-2,3],[-3,-2],  
    [-2,-3], [3,-2], [2,3], [-3,2], 
    [3,-3], [3,3], [-3,3],[-3,-3], 
    
    [0,-4], [4,0], [0,4],   [-4,0],       // "radius" 4
    [1,-4], [4,1], [-1,4], [-4,-1], 
    [-1,-4], [4,-1], [1,4],[-4,1],  
    [2,-4], [4,2], [-2,4], [-4,-2], 
    [-2,-4], [4,-2], [2,4],[-4,2],  
    [3,-4], [4,3], [-3,4],[-4,-3],  
    [-3,-4], [4,-3], [3,4], [-4,3], 
    [4,-4], [4,4], [-4,4], [-4,-4], 
    
    [0,-5], [5,0], [0,5],[-5,0],        // "radius" 5
    [1,-5], [5,1], [-1,5], [-5,-1], 
    [-1,-5], [5,-1], [1,5],  [-5,1], 
    [2,-5], [5,2], [-2,5], [-5,-2],
    [-2,-5], [5,-2], [2,5],[-5,2],  
    [3,-5], [5,3], [-3,5],[-5,-3],  
    [-3,-5], [5,-3], [3,5], [-5,3], 
    [4,-5], [5,4], [-4,5], [-5,-4], 
    [-4,-5], [5,-4], [4,5],[-5,4], 
    [5,-5], [5,5], [-5,5],[-5,-5], 

    [0,-6], [6,0], [0,6],  [-6,0],       // "radius" 6
    [1,-6], [6,1], [-1,6],[-6,-1],  
    [-1,-6], [6,-1], [1,6], [-6,1],  
    [2,-6], [6,2], [-2,6], [-6,-2], 
    [-2,-6], [6,-2], [2,6], [-6,2], 
    [3,-6], [6,3], [-3,6], [-6,-3],
    [-3,-6], [6,-3], [3,6], [-6,3], 
    [4,-6], [6,4], [-4,6],[-6,-4],  
    [-4,-6], [6,-4], [4,6],[-6,4], 
    [5,-6], [6,5], [-5,6], [-6,-5], 
    [-5,-6], [6,-5], [5,6],[-6,5], 
    [6,-6], [6,6], [-6,6],[-6,-6], 

    [0,-7], [7,0], [0,7],[-7,0],        // "radius" 7
    [1,-7], [7,1], [-1,7], [-7,-1],
    [-1,-7], [7,-1], [1,7],[-7,1],   
    [2,-7], [7,2], [-2,7], [-7,-2],  
    [-2,-7], [7,-2], [2,7], [-2,2], 
    [3,-7], [7,3], [-3,7], [-7,-3],
    [-3,-7], [7,-3], [3,7], [-7,3], 
    [4,-7], [7,4], [-4,7],[-7,-4], 
    [-4,-7], [7,-4], [4,7],[-7,4], 
    [5,-7], [7,5], [-5,7], [-7,-5],
    [-5,-7], [7,-5], [5,7],[-7,5], 
    [6,-7], [7,6], [-6,7], [-7,-6],
    [-6,-7], [7,-6], [6,7],[-7,6], 
    [7,-7], [7,7], [-7,7],[-7,-7], 

    [0,-8], [8,0], [0,8],[-8,0],         // "radius" 8
    [1,-8], [8,1], [-1,8], [-8,-1], 
    [-1,-8], [8,-1], [1,8],[-8,1],   
    [2,-8], [8,2], [-2,8], [-8,-2],
    [-2,-8], [8,-2], [2,8], [-2,2], 
    [3,-8], [8,3], [-3,8], [-8,-3],
    [-3,-8], [8,-3], [3,8],[-8,3],  
    [4,-8], [8,4], [-4,8], [-8,-4],
    [-4,-8], [8,-4], [4,8],[-8,4], 
    [5,-8], [8,5], [-5,8],[-8,-5],  
    [-5,-8], [8,-5], [5,8],[-8,5], 
    [6,-8], [8,6], [-6,8], [-8,-6],
    [-6,-8], [8,-6], [6,8],[-8,6], 
    [7,-8], [8,7], [-7,8],[-8,-7], 
    [-7,-8], [8,-7], [7,8],[-8,7], 
    [8,-8], [8,8], [-8,8], [-8,-8]
]


function getRandomPattern(){
    var p = Math.floor(Math.random()*4);
    switch(p){
        case 0: return FIELD_PATTERN_1;
        case 1: return FIELD_PATTERN_2;
        case 2: return FIELD_PATTERN_3;
        case 3: return FIELD_PATTERN_4;
        default: return FIELD_PATTERN_1;
    }
}