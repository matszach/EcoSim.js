class Animal{

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
            this.feed(x, y);
            this.actDelayCurr = this.actDelayMax;
        } else {    
            this.actDelayCurr -= 1;
        }
        this.draw(x, y);
    }
    

    act(x, y){
        // to be overriden
    }

    feed(x, y){
        // to be overriden
    }

    breed(mate, x, y){

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
            // todo
    }

    static calcMutation(){
        return (1 + (Math.random() - 0.5) * MUTATION_LEVEL);
    }

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
        if(this.needBreed > MAX_NEED){
            this.needBreed = MAX_NEED;
        } else if(this.needThrirst > MAX_NEED){
            this.die();
        } else if(this.needHunger > MAX_NEED){
            this.die();            
        }
        
    }

    die(){
        this.isAlive = false;
    }


    // draw this animal on canvas
    draw(x, y){
        CTX.fillStyle = this.color;
        var off = (1 - this.drawSize)/2;
        CTX.fillRect((ROOT_X + x + off) * UNIT, (ROOT_Y + y + off) * UNIT, UNIT*this.drawSize, UNIT*this.drawSize);
    }

    // movement 
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

    // post move
    postMove(x, y){
        this.feed(x, y);
        this.draw(x, y);
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
                // if move to field fails -> move randomly
                if(!this.moveToField(x, y, xTarg, yTarg)){
                    this.moveRandom(x, y);
                }
                return;
            }
        }
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