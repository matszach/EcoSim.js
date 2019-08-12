// current state variables
var DATA_CURR_NOF_RABBIT_MALE = 0;
var DATA_CURR_NOF_RABBIT_FEMALE = 0;
var DATA_CURR_NOF_FOX_MALE = 0;
var DATA_CURR_NOF_FOX_FEMALE = 0;

function resetData(){
    DATA_CURR_NOF_RABBIT_MALE = 0;
    DATA_CURR_NOF_RABBIT_FEMALE = 0;
    DATA_CURR_NOF_FOX_MALE = 0;
    DATA_CURR_NOF_FOX_FEMALE = 0;
}

function countAnimal(animal){
    if(animal.typeId == FOX_TYPE_ID){
        if(animal.sex == MALE){
            DATA_CURR_NOF_FOX_MALE += 1;
        } else {
            DATA_CURR_NOF_FOX_FEMALE += 1;
        }
    } else {
        if(animal.sex == MALE){
            DATA_CURR_NOF_RABBIT_MALE += 1;
        } else {
            DATA_CURR_NOF_RABBIT_FEMALE += 1;
        }
    }
}

function displayData(){
    // TODO
}