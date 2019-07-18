// Organism - parent class to all entities
class Organism {

    draw(x, y){
        CTX.fillStyle = this.color;
        CTX.rect((ROOT_X + x) * UNIT, (ROOT_Y + y) * UNIT, UNIT, UNIT);
        CTX.fill();
    }

    constructor(color){
        this.color = color;
    }

}

class Animal extends Organism{

    constructor(speed){
        
    }
    


}

/*

state:
need-to-feed - dead at 100
need-to-hydrate - dead at 100
need-to-breed - capped at 100

every frame upkeep:
food-upkeep - calculated on construct
water-upkeep - calculated on construct

speed - every how many frames the creature moves (values like 5.6 will cause alteranting wait times of 5 and 6 etc)
sight - how far (in fields) the animal sees
want-to-breed - how quickly the need to breed raises 
breed-threshold - when needs to fee and hydrate are below this threshold, the animal igmores its need to breed


*/

/*

speed, sight weights
child costs,
plant spawn chance

*/