class Animal{

    // perform lifecycle logic
    doAct(x, y){

    }

    // draw on canvas
    draw(x, y){
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
        this.upkeepThirst = this.speed * SPEED_THIRST_COST + this.sight * SIGHT_THIRST_COST;

        
    }

}

