// holds field values
// 0 - void, 1 - grass, 2 - water
let fieldsMap;

function drawFiels() {

    for(x = 0; x < fieldsMap.length; x++){
        for(y = 0; y < fieldsMap[x].length; y++){

            if(fieldsMap[x][y] == GRASS_FIELD_ID){
                CTX.fillStyle = GRASS_FIELD_COLOR;
            } else if (fieldsMap[x][y] == SHALLOW_WATER_FIELD_ID){
                CTX.fillStyle = SHALLOW_WATER_FIELD_COLOR;
            } else if (fieldsMap[x][y] == DEEP_WATER_FIELD_ID){
                CTX.fillStyle = DEEP_WATER_FIELD_COLOR;
            } else {
                continue;
            }
      
            CTX.fillRect((ROOT_X+x)*UNIT,(ROOT_Y+y)*UNIT, UNIT, UNIT);

        }
    }
}

// holds plant values
// 0 - no plant, n - plant of food value of n 
let plantsMap;

function growAndDrawPlats() {

    CTX.fillStyle = PLANT_COLOR;

    for(x = 0; x < fieldsMap.length; x++){
        for(y = 0; y < fieldsMap[x].length; y++){

            v = plantsMap[x][y]
            if(v > 0){

                if(v < PLANT_MAX_VALUE){
                    plantsMap[x][y] += PLANT_GROWTH_RATE;
                }

                scale = v/PLANT_MAX_VALUE*MAX_VALUE_PLANT_DRAW_SIZE;
                off = -scale/2 + 0.5
                CTX.fillRect((ROOT_X+x+off)*UNIT,(ROOT_Y+y+off)*UNIT, scale*UNIT, scale*UNIT);

                countPlant(v);

            } else if (fieldsMap[x][y] == GRASS_FIELD_ID){
                if(Math.random() < PLANT_SPAWN_CHANCE){
                    plantsMap[x][y] = 1;
                }
            }

        }
    }

}

// holds animals
// null - no animal, not null - active animal
let animalsMap;

function actAndDrawAnimals() {
    for(x = 0; x < fieldsMap.length; x++){
        for(y = 0; y < fieldsMap[x].length; y++){
            if(animalsMap[x][y] != null){
                a = animalsMap[x][y];
                if (!a.isAlive){
                    animalsMap[x][y] = null;
                } else {
                    a.doActAndDraw(x, y);
                }
            }
        }
    }

    for(x = 0; x < fieldsMap.length; x++){
        for(y = 0; y < fieldsMap[x].length; y++){
            if(animalsMap[x][y] != null){
                a = animalsMap[x][y]
                a.postMove(x, y);
                
                countAnimal(a);
            }
        }
    }
}

doGenerate();

function runOneSimulationRound(){

    // resets data manager
    resetData();

    // performs simulation logic, draws view and generates data
    drawFiels();
    growAndDrawPlats();
    actAndDrawAnimals();
   
    // displas data in interaction panel
    displayData();
}

