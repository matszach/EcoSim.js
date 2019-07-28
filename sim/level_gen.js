function doGenerate(){

    // generating the map
    width = parseInt(NS_SLD_WIDTH.value);
    height = parseInt(NS_SLD_HEIGHT.value);
    nof_rabbits = parseInt(NS_SLD_RABBITS.value);
    nof_foxes = parseInt(NS_SLD_FOXES.value);
    nof_ponds = parseInt(NS_SLD_NOF_PONDS.value);
    pond_size = parseInt(NS_SLD_POND_SIZE.value);
    plant_density = parseInt(NS_SLD_PLANT_DENSITY.value)/100
    generateLevel(width, height, nof_rabbits, nof_foxes, nof_ponds, pond_size, plant_density)

    // adjusting the simulation variables
    PLANT_SPAWN_CHANCE = parseFloat(NS_SLD_PLANT_SPAWN.value);
    PLANT_GROWTH_RATE = parseFloat(NS_SLD_PLANT_GROWTH.value);
}

function generateLevel(width, height, nof_rabbits, nof_foxes, nof_ponds, pond_size, plant_density){

    // adjusts min and max map scroll
    MIN_X = -width + ROOT_VIEW_PADDING;
    MIN_Y = -height + ROOT_VIEW_PADDING;
    MAX_X = width - ROOT_VIEW_PADDING;
    MAX_Y = height - ROOT_VIEW_PADDING;

    // adjust root X an Y 
    if(ROOT_X > MAX_X) {
        ROOT_X = MAX_X;
    } else if(ROOT_X < MIN_X) {
        ROOT_X = MIN_X;
    }

    if(ROOT_Y > MAX_Y) {
        ROOT_Y = MAX_Y;
    } else if(ROOT_Y < MIN_Y) {
        ROOT_Y = MIN_Y;
    }
    
    // initial array sizes
    fieldsMap = [];
    plantsMap = [];
    animalsMap = [];

    for(x = 0; x < width; x++){
        fieldsMap[x] = [];
        plantsMap[x] = [];
        animalsMap[x] = [];
        for(y = 0; y < height; y++){
            fieldsMap[x][y] = VOID_FIELD_ID;
            plantsMap[x][y] = 0;
            animalsMap[x][y] = null;
        }
    }

    // initial map elipis
    a = width / 2;
    aSq = a*a;
    b = height / 2;
    bSq = b*b;

    for(x = 0; x < width; x++){
        ex = x - a;
        exSq = ex*ex;

        for(y = 0; y < height; y++){
            ey = y - b;
            eySq = ey*ey;
            
            // check if inside of the map elipsis
            if(exSq/aSq + eySq/bSq < 1){
                fieldsMap[x][y] = GRASS_FIELD_ID;
            }
        }
    }

    // generate ponds
    while(nof_ponds > 0){

        try { 
            x = Math.floor(Math.random()*width);
            y = Math.floor(Math.random()*height);
            if(fieldsMap[x][y] == GRASS_FIELD_ID){
                generatePond(x, y, pond_size);
            }
            nof_ponds -= 1;
        } catch {
            // it's quicker to catch an exception here rather than check for out of bounds
            // in generatePond()
        }
    }
    fillGapsInPonds(width, height, 2);
    fillGapsInPonds(width, height, 3);
    fillGapsInPonds(width, height, 4);
    generateShallowWater(width, height);

    // generate plants
    for(x = 0; x < width; x++){
        for(y = 0; y < height; y++){
            if(fieldsMap[x][y] == GRASS_FIELD_ID && Math.random() < plant_density){
                    plantsMap[x][y] = Math.round(Math.random()*PLANT_MAX_VALUE);
            }
        }
    }
   

    // generate animals
    while(nof_rabbits > 0){
        x = Math.floor(Math.random()*width);
        y = Math.floor(Math.random()*height);
        if(fieldsMap[x][y] == GRASS_FIELD_ID && animalsMap[x][y] == null){
            var SEX = nof_rabbits % 2;
            animalsMap[x][y] = new Rabbit(
                INIT_RABBIT_SPEED,INIT_RABBIT_SIGHT,INIT_RABBIT_URGE,INIT_RABBIT_THRESHOLD,
                SEX, INIT_RABBIT_CHILDHOOD, true);
            nof_rabbits -= 1;
        }
    }

    while(nof_foxes > 0){
        x = Math.floor(Math.random()*width);
        y = Math.floor(Math.random()*height);
        if(fieldsMap[x][y] == GRASS_FIELD_ID && animalsMap[x][y] == null){
            var SEX = nof_foxes % 2;
            animalsMap[x][y] = new Fox(
                INIT_FAX_SPEED,INIT_FAX_SIGHT,INIT_FAX_URGE,INIT_FAX_THRESHOLD,
                SEX, INIT_FAX_CHILDHOOD, true);
            nof_foxes -= 1;
        }
    }


}

function generatePond(x, y, size) {

    if(size < 0){
        return;
    }

    if(fieldsMap[x][y] == GRASS_FIELD_ID){
        fieldsMap[x][y] = DEEP_WATER_FIELD_ID;
        if(Math.random() > 0.5){
            generatePond(x+1,y,size-1)
        } 
        if(Math.random() > 0.5){
            generatePond(x-1,y,size-1)
        }
        if(Math.random() > 0.5){
            generatePond(x,y+1,size-1)
        }
        if(Math.random() > 0.5){
            generatePond(x,y-1,size-1)
        }
    }
}

function fillGapsInPonds(width, height, min_neighbors) {

    var fieldsToFill = []

    for(x = 0; x < width; x++){
        fieldsToFill[x] = [];
        for(y = 0; y < height; y++){
            fieldsToFill[x][y] = VOID_FIELD_ID;
        }
    }

    for(x = 0; x < width; x++){
        for(y = 0; y < height; y++){
            try{
                var neighboors = 0;
                if(fieldsMap[x+1][y] == DEEP_WATER_FIELD_ID){
                    neighboors += 1;
                }
                if(fieldsMap[x-1][y] == DEEP_WATER_FIELD_ID){
                    neighboors += 1;
                }
                if(fieldsMap[x][y+1] == DEEP_WATER_FIELD_ID){
                    neighboors += 1;
                }
                if(fieldsMap[x][y-1] == DEEP_WATER_FIELD_ID){
                    neighboors += 1;
                }
                if(neighboors >= min_neighbors){
                    fieldsToFill[x][y] = DEEP_WATER_FIELD_ID;
                }
            } catch {
                continue;
            }
        }
    }

    for(x = 0; x < width; x++){
        for(y = 0; y < height; y++){
            if(fieldsToFill[x][y] == DEEP_WATER_FIELD_ID){
                fieldsMap[x][y] = DEEP_WATER_FIELD_ID;
            }
        }
    }
}

function generateShallowWater(width, height){
    for(x = 0; x < width; x++){
        for(y = 0; y < height; y++){
            // any field, currently mareked as deep water, is transformed to shallow water
            // if it has at least one grass neighbour
            if(fieldsMap[x][y] == DEEP_WATER_FIELD_ID){
                try{
                    if(fieldsMap[x+1][y] == GRASS_FIELD_ID || fieldsMap[x-1][y] == GRASS_FIELD_ID ||
                    fieldsMap[x][y+1] == GRASS_FIELD_ID || fieldsMap[x][y-1] == GRASS_FIELD_ID ||
                    fieldsMap[x+1][y+1] == GRASS_FIELD_ID || fieldsMap[x-1][y-1] == GRASS_FIELD_ID ||
                    fieldsMap[x+1][y-1] == GRASS_FIELD_ID || fieldsMap[x-1][y+1] == GRASS_FIELD_ID){
                        fieldsMap[x][y] = SHALLOW_WATER_FIELD_ID;
                    }
                } catch {
                    continue;
                }
            }
        }
    }
}