class Animal{

    // =========================================== MAIN =====================================
    // delay between inner act() calls
    calculateDelay(){
        return SPEED_DIV/this.speed + SPEED_BASE;
    }

    // perform lifecycle logic
    doActAndDraw(x, y){
        // console.log("H:", Math.round(this.needHunger,2), 
        //     "T:", Math.round(this.needThrirst,2), 
        //     "B:", Math.round(this.needBreed,2));
        this.manageNeeds();
        this.handleAge();
        if(this.actDelayCurr < 0){
            this.fieldIterator.reset(x, y);
            this.act(x, y);
            this.actDelayCurr = this.actDelayMax;
            this.isPostActPending = true;
        } else {    
            this.actDelayCurr -= 1;
            this.draw(x, y);
        }
    }
    

    act(x, y){
        // to be overriden
    }


    // =========================================== FEEDING =====================================
    feed(x, y){
        // to be overriden
    }

    lookForWater(x, y){

        // if there's water here - stay
        if(fieldsMap[x][y] == SHALLOW_WATER_FIELD_ID){
            return;
        }
        
        // use iterator to look for food
        while(this.fieldIterator.hasNext()){
            var field = this.fieldIterator.getNext();
            var xTarg = field[0];
            var yTarg = field[1];

            let fieldIsWater; 
            try {
                fieldIsWater = fieldsMap[xTarg][yTarg] == SHALLOW_sWATER_FIELD_ID;
            } catch {
                continue;
            }
            
            if(fieldIsWater){
                // if move to field fails -> move randomly -> stay;
                if(!this.moveToField(x, y, xTarg, yTarg)){
                    this.moveRandom(x, y);
                }
                return;
            }
        }
        this.moveRandom(x,y);
    }

    // =========================================== BREEDING =====================================
    breed(mate, x, y){

        // iterator reset
        this.fieldIterator.reset(x, y);

        while(this.fieldIterator.hasNext()){

            // retrieve checked field
            var fld = this.fieldIterator.getNext();
            var osX = fld[0];
            var osY = fld[1];
            
            // a legal field is found
            if(isFieldMovementLegal(osX, osY)){

                // place the offspring on a nearby empty field
                animalsMap[osX][osY] = this.buildOffspring(mate);
                this.onBreedNeedsAdjust();
                return true;

            }
        }
        return false
    }

    onBreedNeedsAdjust(){
        this.needHunger += CHILD_HUNGER_COST;
        this.needThrirst += CHILD_THIRST_COST;
        this.needBreed -= CHILD_SATISFACTION;
    }

    tryNearbyFieldsForMates(x, y){
        if(this.tryFieldForMate(x, y+1)){
            return true;
        } else if (this.tryFieldForMate(x, y-1)){
            return true;
        } else if (this.tryFieldForMate(x-1, y)){
            return true;
        } else if (this.tryFieldForMate(x+1, y)){
            return true;
        } else {
            return false;
        }
    }

    tryFieldForMate(xF, yF){
        try {
            if(animalsMap[xF][yF].isAdult && 
                animalsMap[xF][yF].sex != this.sex && 
                animalsMap[xF][yF].typeId == this.typeId){
                return this.breed(animalsMap[xF][yF], xF, yF);
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }

    calcMutation(){
        return (1 + (Math.random() - 0.5) * MUTATION_LEVEL);
    }

    lookForMate(x, y){
        // if there's a viable mate nearby - stay
        if(this.tryNearbyFieldsForMates(x, y)){
            return;
        }

        while(this.fieldIterator.hasNext()){

            var field = this.fieldIterator.getNext();
            var xTarg = field[0];
            var yTarg = field[1];

            let fieldHasValidMate; 
            try {
                fieldHasValidMate = animalsMap[xTarg][yTarg].typeId == this.typeId &&
                                        animalsMap[xTarg][yTarg].sex != this.sex;
            } catch {
                continue;
            }
            
            if(fieldHasValidMate){
                // if move to field fails -> move randomly -> stay;
                if(!this.moveToField(x, y, xTarg, yTarg)){
                    this.moveRandom(x, y);
                }
                return;
            }
        }

        this.moveRandom(x, y);
    }

    buildOffspring(mate){
        return null;
    }
    // =========================================== NEEDS =====================================
    manageNeeds(){

        // apply upkeep
        this.needBreed += this.urgeToBreed;
        this.needThrirst += this.upkeepThirst;
        this.needHunger += this.upkeepHunger;

        // slice if below 0, "else if" here is more efficent than a triple "if"
        if(this.needBreed < 0){
            this.needBreed = 0;
        } else if(this.needThrirst < 0){
            this.needThrirst = 0;
        } else if(this.needHunger < 0){
            this.needHunger = 0;
        }

        // slice/die if above max
        if(this.needThrirst > MAX_NEED){
            this.die();
        } else if(this.needHunger > MAX_NEED){
            this.die();            
        } else if(this.needBreed > MAX_NEED){
            this.needBreed = MAX_NEED;
        }
        
    }

    // returns id of the need the animal will attepmt to satisfy
    getTopNeed(){
        if(this.isAdult &&  
            this.needBreed > this.needHunger &&
            this.needBreed > this.needThrirst &&
            this.needHunger < this.breedThreshold &&
            this.needThrirst < this.breedThreshold){
            return BREEDING_NEED_ID;
        } else if (this.needHunger > this.needThrirst){
            return HUNGER_NEED_ID;
        } else {
            return THIRST_NEED_ID;
        }
    }

    // =========================================== MISC =====================================
    die(){
        this.isAlive = false;
    }


    // draw this animal on canvas
    draw(x, y){
        CTX.fillStyle = this.color;
        var s = this.isAdult ? this.drawSize : this.drawSize * CHILD_SIZE_DRAW_MOD;
        var off = (1 - s)/2;
        CTX.fillRect((ROOT_X + x + off) * UNIT, (ROOT_Y + y + off) * UNIT, UNIT*s, UNIT*s);
    }

    // =========================================== MOVEMENT =====================================
    canMoveTo(x, y){
        // should be ovveriden
    }

    moveLeft(x, y){
        if(!this.canMoveTo(x-1,y)){
            return false;
        }
        this.nullField(x, y);
        this.placeSelf(x-1, y);
        return true;
    }

    moveRight(x, y){
        if(!this.canMoveTo(x+1,y)){
            return false;
        }
        this.nullField(x, y);
        this.placeSelf(x+1, y);
        return true;
    }

    moveUp(x, y){
        if(!this.canMoveTo(x,y-1)){
            return false;
        }
        this.nullField(x, y);
        this.placeSelf(x, y-1);
        return true;
    }

    moveDown(x, y){
        if(!this.canMoveTo(x,y+1)){
            return false;
        }
        this.nullField(x, y);
        this.placeSelf(x, y+1);
        return true;
    }

    nullField(x, y){
        animalsMap[x][y] = null;
    }

    placeSelf(x, y){
        animalsMap[x][y] = this;
    }

    moveRandom(x, y){
        var dir = Math.floor(Math.random() * 4);
        switch(dir){
            case 0: return this.moveLeft(x,y); 
            case 1: return this.moveRight(x,y);
            case 2: return this.moveUp(x,y); 
            case 3: return this.moveDown(x,y);
            default: return false;
        }
    }

    moveToField(xCurr, yCurr, xTarg, yTarg){
        var xDir = xCurr - xTarg;
        var yDir = yCurr - yTarg;
        if(Math.abs(xDir) > Math.abs(yDir)){
            if(xDir > 0){
                return this.moveLeft(xCurr, yCurr);
            } else {
                return this.moveRight(xCurr, yCurr);
            }
        } else {
            if(yDir > 0){
                return this.moveUp(xCurr, yCurr);
            } else {
                return this.moveDown(xCurr, yCurr);
            }
        }

    }

    // post move
    postMove(x, y){
        if(this.isPostActPending){
            this.feed(x, y);
            this.draw(x. y);
            this.isPostActPending = false;
        }
     
    }

    // handles age
    handleAge(){
        this.age += 1;
        if (!this.isAdult && this.age > this.childhoodTime){
            this.isAdult = true;
        }
    }

    // constructors
    constructor(color, drawSize, speed, sight, urgeToBreed, breedThreshold, sex, childhoodTime, startAsAdult){

        this.typeId = ANIMAL_TYPE_ID;

        // draw color and size
        this.color = color;
        this.drawSize = drawSize;

        // genome
        this.speed = speed;
        this.sight = sight;
        this.urgeToBreed = urgeToBreed;
        this.breedThreshold = breedThreshold;
        this.sex = sex;
        this.childhoodTime = childhoodTime;

        // needs
        this.needHunger = 0;
        this.needThrirst = 0;
        this.needBreed = 0;

        // upkeep costs 
        this.upkeepHunger = this.speed * SPEED_HUNGER_COST + this.sight * SIGHT_HUNGER_COST;
        this.upkeepThirst = this.speed * SPEED_THRIST_COST + this.sight * SIGHT_THRIST_COST;

        // delays 
        this.actDelayMax = this.calculateDelay();
        this.actDelayCurr = this.actDelayMax - Math.floor(Math.random()*this.actDelayMax);

        // alive
        this.isAlive = true;

        // age
        this.age = startAsAdult ? childhoodTime : 0;
        this.isAdult = false;
        
        // iterator
        this.fieldIterator = new NerbyFieldIterator(0, 0, this.sight);

        // post move action pending marker (post act sis performed directly after act)
        this.isPostActPending;
 
    }
}

// ===============================================================================================================
// =====================================  RABBIT =================================================================
// ===============================================================================================================
class Rabbit extends Animal{

    canMoveTo(x, y){
        return isFieldMovementLegal(x, y);
    }

    feed(x, y){
        if(fieldsMap[x][y] == SHALLOW_WATER_FIELD_ID){
            this.needThrirst -= WATER_DRUNK_PER_ACT;
            return;
        }
        var amountEaten = plantsMap[x][y] > PLANT_EATEN_PER_ACT ? PLANT_EATEN_PER_ACT : plantsMap[x][y];
        this.needHunger -= amountEaten;
        plantsMap[x][y] -= amountEaten;
    }

    lookForPlants(x, y){

        // if there's sufficieng food left to warrant staying - stay
        if(plantsMap[x][y] > MIN_PLANT_TO_CONSIDER){
            return;
        }

        // use iterator to look for food
        while(this.fieldIterator.hasNext()){
            var field = this.fieldIterator.getNext();
            var xTarg = field[0];
            var yTarg = field[1];

            let foodAtField; 
            try {
                foodAtField = plantsMap[xTarg][yTarg];
            } catch {
                continue;
            }

            if(foodAtField > MIN_PLANT_TO_CONSIDER){
                // if move to field fails -> move randomly -> stay;
                if(!this.moveToField(x, y, xTarg, yTarg)){
                    this.moveRandom(x, y);
                }
                return;
            }
        }
        this.moveRandom(x, y);
    }

    act(x, y){
        switch(this.getTopNeed()){
            case HUNGER_NEED_ID : this.lookForPlants(x, y); break;
            case THIRST_NEED_ID : this.lookForWater(x, y); break;
            case BREEDING_NEED_ID : this.lookForMate(x, y); break;
            default : this.moveRandom(x, y);
        }
    }

    buildOffspring(mate){
        // calculate attributes of the child
        var osSpeed = (this.speed + mate.speed)/2 * this.calcMutation();
        var osSight = (this.sight + mate.sight)/2 * this.calcMutation();
        var osUrgeToBreed = (this.urgeToBreed + mate.urgeToBreed)/2 * this.calcMutation();
        var osBreedThreshold = (this.breedThreshold + mate.breedThreshold)/2 * this.calcMutation();
        var osSex = Math.random() > 0.5 ? MALE : FEMALE; 
        var osChildhoodTime = (this.childhoodTime + mate.childhoodTime)/2 * this.calcMutation();

        // create the child
        return new Rabbit(osSpeed, osSight, osUrgeToBreed, osBreedThreshold, osSex, osChildhoodTime, false);
    }
    
    constructor(speed, sight, urgeToBreed, breedThreshold, sex, childhoodTime, startAsAdult){
        var color = sex == MALE ? RABBIT_MALE_COLOR : RABBIT_FEMALE_COLOR;
        var drawSize = sex == MALE ? RABBIT_MALE_DRAW_SIZE : RABBIT_FEMALE_DRAW_SIZE;
        super(color, drawSize, speed, sight, urgeToBreed, breedThreshold, sex, childhoodTime, startAsAdult);
        this.typeId = RABBIT_TYPE_ID;        
    }
}


// ===============================================================================================================
// =====================================  FOX  ===================================================================
// ===============================================================================================================
class Fox extends Animal{

    feed(x, y){
        if(this.tryNearbyFieldsForRabbits(x, y)){
            return;
        }
        if(fieldsMap[x][y] == SHALLOW_WATER_FIELD_ID){
            this.needThrirst -= WATER_DRUNK_PER_ACT;
        }
    }

    lookForRabbits(x, y){

        while(this.fieldIterator.hasNext()){

            var field = this.fieldIterator.getNext();
            var xTarg = field[0];
            var yTarg = field[1];

            let fieldHasRabbit; 
            try {
                fieldHasRabbit = animalsMap[xTarg][yTarg].typeId == RABBIT_TYPE_ID;
            } catch {
                continue;
            }
            
            if(fieldHasRabbit){
                // if move to field fails -> move randomly -> stay;
                if(!this.moveToField(x, y, xTarg, yTarg)){
                    this.moveRandom(x, y);
                }
                return;
            }
        }
        this.moveRandom(x, y);
    }

    tryNearbyFieldsForRabbits(x, y){
        if(this.tryFieldForRabbit(x, y+1)){
            return true;
        } else if (this.tryFieldForRabbit(x, y-1)){
            return true;
        } else if (this.tryFieldForRabbit(x-1, y)){
            return true;
        } else if (this.tryFieldForRabbit(x+1, y)){
            return true;
        } else {
            return false;
        }
    }

    tryFieldForRabbit(x, y){
        try{
            if(animalsMap[x][y].typeId == RABBIT_TYPE_ID){
                this.eatRabbit(animalsMap[x][y]);
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }

    eatRabbit(rabbit){
        rabbit.die();
        let f = rabbit.isAdult ? RABBIT_ADULT_FOOD_VALUE : RABBIT_CHILD_FOOD_VALUE;
        this.needHunger -= f;
    }

    act(x, y){
        switch(this.getTopNeed()){
            case HUNGER_NEED_ID : this.lookForRabbits(x, y); break;
            case THIRST_NEED_ID : this.lookForWater(x, y); break;
            case BREEDING_NEED_ID : this.lookForMate(x, y);break;
            default : this.moveRandom(x, y);
        }
    }

    buildOffspring(mate){
        // calculate attributes of the child
        var osSpeed = (this.speed + mate.speed)/2 * this.calcMutation();
        var osSight = (this.sight + mate.sight)/2 * this.calcMutation();
        var osUrgeToBreed = (this.urgeToBreed + mate.urgeToBreed)/2 * this.calcMutation();
        var osBreedThreshold = (this.breedThreshold + mate.breedThreshold)/2 * this.calcMutation();
        var osSex = Math.random() > 0.5 ? MALE : FEMALE; 
        var osChildhoodTime = (this.childhoodTime + mate.childhoodTime)/2 * this.calcMutation();

        // create the child
        return new Fox(osSpeed, osSight, osUrgeToBreed, osBreedThreshold, osSex, osChildhoodTime, false);
    }


    canMoveTo(x, y){
        return isFieldMovementLegal(x, y);
    }

    constructor(speed, sight, urgeToBreed, breedThreshold, sex, childhoodTime, startAsAdult){
        var color = sex == MALE ? FOX_MALE_COLOR : FOX_FEMALE_COLOR;
        var drawSize = sex == MALE ? FOX_MALE_DRAW_SIZE :FOX_FEMALE_DRAW_SIZE;
        super(color, drawSize, speed, sight, urgeToBreed, breedThreshold, sex, childhoodTime, startAsAdult);
        this.typeId = FOX_TYPE_ID;
    }
}