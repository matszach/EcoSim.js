class Animal{

    // delay between inner act() calls
    calculateDelay(){
        return SPEED_DIV/this.speed + SPEED_BASE;
    }

    // perform lifecycle logic
    doAct(x, y){
        this.manageNeeds();
        if(this.actDelayCurr < 0){
            this.fieldIterator.reset(x, y);
            this.act(x, y);
            this.actDelayCurr = this.actDelayMax;
        } else {    
            this.actDelayCurr -= 1;
        }
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

    move(animalsMap,currX,currY,newX,newY){
        animalsMap[newX][newY] = animalsMap[currX][currY];
        animalsMap[currX][currY] = null;
    }

    moveInDir(currX,currY,targetX,targetY){
        
        // TEMP TODO
        var dX = currX > targetX;
        var dY = currY > targetY;
        var coin = Math.random() > 0.5;
    
        if(dX){
            if(dY){
                if(coin){
                    this.move(currX,currY,currX-1,currY);
                } else {
                    this.move(currX,currY,currX,currY-1);
                }
            } else {
                if(coin){
                    this.move(currX,currY,currX-1,currY);
                } else {
                    this.move(currX,currY,currX,currY+1);
                }
            }
        } else {
            if(dY){
                if(coin){
                    this.move(currX,currY,currX+1,currY);
                } else {
                    this.move(currX,currY,currX,currY-1);
                }
            } else {
                if(coin){
                    this.move(currX,currY,currX+1,currY);
                } else {
                    this.move(currX,currY,currX,currY+1);
                }
            }
        }
    }

    // draw on canvas
    doDraw(x, y){
        CTX.fillStyle = this.color;
        CTX.fillRect((ROOT_X + x) * UNIT, (ROOT_Y + y) * UNIT, UNIT, UNIT);
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
        this.actDelayCurr = this.actDelayMax;

        // alive
        this.isAlive = true;

        // iterator
        this.fieldIterator = new NerbyFieldIterator(0, 0, this.sight);
        
    }

}


class Rabbit extends Animal{

    feed(x, y){
        // TEMP TODO
        this.needHunger -= plantsMap[x][y];
        plantsMap[x][y] = 0;
        if(fieldsMap[x][y] == 2){
            this.needThrirst = 0;
        }
    }

    act(x, y){

        this.feed(x, y);

        while(this.fieldIterator.hasNext()){
            var f = this.fieldIterator.getNext();
            var x = f[0];
            var y = f[1];
            if(plantsMap[f[0]][f[1]] > 0){
                this.moveInDir(this.x, this.y, x, y);
                return;
            }
        }
        
        var rand = Math.random();

        if(rand > 0.75){
            this.move(x,y,x+1,y);
        } else if(rand > 0.5){
            this.move(x,y,x-1,y);
        } else if(rand > 0.25){
            this.move(x,y,x,y+1);
        } else {
            this.move(x,y,x,y-1);
        }
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