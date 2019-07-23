class Animal{

    // =========================================== MAIN =====================================
    // delay between inner act() calls
    calculateDelay(){
        return SPEED_DIV/this.speed + SPEED_BASE;
    }

    // perform lifecycle logic
    doActAndDraw(x, y){
        this.manageNeeds();
        if(this.actDelayCurr < 0){
            this.fieldIterator.reset(x, y);
            this.act(x, y);
            this.actDelayCurr = this.actDelayMax;
        } else {    
            this.actDelayCurr -= 1;
            this.draw(x, y);
        }
    }
    

    act(x, y){
        // to be overriden
    }

    feed(x, y){
        // to be overriden
    }

    // =========================================== BREEDING =====================================
    breed(mate, x, y){

        // iterator reset
        this.fieldIterator.reset(x. y);

        while(this.fieldIterator.hasNext()){

            // retrieve checked field
            var fld = this.fieldIterator.getNext();
            osX = fld[0];
            osY = fld[1];
            
            // a legal field is found
            if(isFieldLegalForRabbit(osX, osY)){

                // appy costs
                this.needHunger += CHILD_HUNGER_COST;
                this.needThrirst += CHILD_THIRST_COST;
                this.needBreed -= CHILD_SATISFACTION;

                // calculate attributes of the child
                osSpeed = (this.speed + mate.speed)/2 * this.calcMutation();
                osSight = (this.sight + mate.sight)/2 * this.calcMutation();
                osUrgeToBreed = (this.urgeToBreed + mate.urgeToBreed)/2 * this.calcMutation();
                osBreedThreshold = (this.breedThreshold + mate.breedThreshold)/2 * this.calcMutation();
                osSex = 0 ? Math.random() > 0.5 : 1; 

                // create the child
                offspringAnimal = this.constructor(osSpeed, osSight, osUrgeToBreed, osBreedThreshold, osSex);

                // place the offspring on a nearby empty field
                animalsMap[osX][osY] = offspringAnimal;
                return true;

            }
        }
        return false;
    }

    static calcMutation(){
        return (1 + (Math.random() - 0.5) * MUTATION_LEVEL);
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


    static HUNGER_NEED_ID = 0;
    static THIRST_NEED_ID = 1;
    static BREEDING_NEED_ID = 2;

    getTopNeed(){
        if(this.needBreed > this.needHunger &&
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
        var off = (1 - this.drawSize)/2;
        CTX.fillRect((ROOT_X + x + off) * UNIT, (ROOT_Y + y + off) * UNIT, UNIT*this.drawSize, UNIT*this.drawSize);
    }

    // =========================================== MOVEMENT =====================================
    canMoveTo(x, y){
        // should be ovveriden
    }

    moveLeft(x, y){
        if(!this.canMoveTo(x-1,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x-1][y] = this;
        this.postMove(x-1, y);
        return true;
    }

    moveRight(x, y){
        if(!this.canMoveTo(x+1,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x+1][y] = this;
        this.postMove(x+1, y);
        return true;
    }

    moveUp(x, y){
        if(!this.canMoveTo(x,y-1)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x][y-1] = this;
        this.postMove(x, y-1);
        return true;
    }

    moveDown(x, y){
        if(!this.canMoveTo(x,y+1)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x][y+1] = this;
        this.postMove(x, y+1);
        return true;
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

    stayHere(x, y){
        this.postMove(x, y);
    }

    // post move
    postMove(x, y){
        this.feed(x, y);
        this.draw(x. y);
    }

    // constructor
    constructor(color, drawSize, speed, sight, urgeToBreed, breedThreshold, sex){

        // draw color and size
        this.color = color;
        this.drawSize = drawSize;

        // genome
        this.speed = speed;
        this.sight = sight;
        this.urgeToBreed = urgeToBreed;
        this.breedThreshold = breedThreshold;
        this.sex = sex;

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

        // iterator
        this.fieldIterator = new NerbyFieldIterator(0, 0, this.sight);
        
    }

}


class Rabbit extends Animal{

    canMoveTo(x, y){
        return isFieldLegalForRabbit(x, y);
    }

    feed(x, y){
        if(fieldsMap[x][y] == 2){
            this.needThrirst -= WATER_DRUNK_PER_ACT;
            return;
        }
        var amountEaten = plantsMap[x][y] > PLANT_EATEN_PER_ACT ? PLANT_EATEN_PER_ACT : plantsMap[x][y];
        this.needHunger -= amountEaten;
        plantsMap[x][y] -= amountEaten;
    }

    act(x, y){
        
        // food is a priority if ...
        if(this.needHunger > this.needThrirst){

            // if there's sufficieng food left to warrant staying - stay
            if(plantsMap[x][y] > MIN_PLANT_TO_CONSIDER){
                this.stayHere(x,y);
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
                        if(!this.moveRandom(x, y)){
                            this.stayHere(x, y);
                        }
                    }
                    return;
                }
            }

        // water is a priority if ...
        } else {

            // if there's water here - stay
            if(fieldsMap[x][y] == 2){
                this.stayHere(x,y);
                return;
            }
            
            // use iterator to look for food
            while(this.fieldIterator.hasNext()){
                var field = this.fieldIterator.getNext();
                var xTarg = field[0];
                var yTarg = field[1];

                let fieldIsWater; 
                try {
                    fieldIsWater = plantsMap[xTarg][yTarg] == 2
                } catch {
                    continue;
                }

                if(fieldIsWater){
                    // if move to field fails -> move randomly -> stay;
                    if(!this.moveToField(x, y, xTarg, yTarg)){
                        if(!this.moveRandom(x, y)){
                            this.stayHere(x, y);
                        }
                    }
                    return;
                }
            }

        }
        
        

        // if no clear result is reached by this point - move randomly
        this.moveRandom(x, y);
    }
    
    constructor(speed, sight, urgeToBreed, breedThreshold, sex){
        var color = sex == 0 ? RABBIT_MALE_COLOR : RABBIT_FEMALE_COLOR;
        var drawSize = sex == 0 ? RABBIT_MALE_DRAW_SIZE : RABBIT_FEMALE_DRAW_SIZE;
        super(color, drawSize, speed, sight, urgeToBreed, breedThreshold, sex);
    }
}

class Fox extends Animal{

    feed(x, y){
        // to be overriden
    }

    act(x, y){
        // todo
    }

    constructor(speed, sight, urgeToBreed, breedThreshold, sex){
        var color = sex == 0 ? FOX_MALE_COLOR : FOX_FEMALE_COLOR;
        super(color, speed, sight, urgeToBreed, breedThreshold, sex);

    }
}