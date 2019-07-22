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
        CTX.fillRect((ROOT_X + x) * UNIT, (ROOT_Y + y) * UNIT, UNIT, UNIT);
    }

    // movement 
    canMoveLeft(x, y){
        return isFieldLegal(x-1, y);
    }

    moveLeft(x, y){
        if(!this.canMoveLeft(x,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x-1][y] = this;
        return true;
    }

    canMoveRight(x, y){
        return isFieldLegal(x+1, y);
    }

    moveRight(x, y){
        if(!this.canMoveRight(x,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x+1][y] = this;
        return true;
    }

    canMoveUp(x, y){
        return isFieldLegal(x, y-1);
    }

    moveUp(x, y){
        if(!this.canMoveUp(x,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x][y-1] = this;
        return true;
    }

    canMoveDown(x, y){
        return isFieldLegal(x, y+1);
    }

    moveDown(x, y){
        if(!this.canMoveDown(x,y)){
            return false;
        }
        animalsMap[x][y] = null;
        animalsMap[x][y+1] = this;
        return true;
    }

    moveRandom(x, y){
        var dir = Math.floor(Math.random() * 4);
        switch(dir){
            case 0: this.moveLeft(x,y); break;
            case 1: this.moveRight(x,y); break;
            case 2: this.moveUp(x,y); break;
            case 3: this.moveDown(x,y); break;
        }
    }

    // constructor
    constructor(color, speed, sight, urgeToBreed, breedThreshold, sex){

        // draw color 
        this.color = color;

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

    feed(x, y){
        this.needHunger -= plantsMap[x][y];
        plantsMap[x][y] = 0;
        if(fieldsMap[x][y] == 2){
            this.needThrirst = 0;
        }
    }

    act(x, y){
        this.moveRandom(x,y);
    }
    
    constructor(speed, sight, urgeToBreed, breedThreshold, sex){
        var color = sex == 0 ? RABBIT_MALE_COLOR : RABBIT_FEMALE_COLOR;
        super(color, speed, sight, urgeToBreed, breedThreshold, sex);
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