// current state variables
var DATA_CURR_NOF_RABBIT_MALE = 0;
var DATA_CURR_NOF_RABBIT_FEMALE = 0;
var DATA_CURR_NOF_FOX_MALE = 0;
var DATA_CURR_NOF_FOX_FEMALE = 0;
var DATA_CURR_NOF_PLANTS = 0;
var DATA_CURR_AMT_FOOD = 0;

function resetData(){
    DATA_CURR_NOF_RABBIT_MALE = 0;
    DATA_CURR_NOF_RABBIT_FEMALE = 0;
    DATA_CURR_NOF_FOX_MALE = 0;
    DATA_CURR_NOF_FOX_FEMALE = 0;
    DATA_CURR_NOF_PLANTS = 0;
    DATA_CURR_AMT_FOOD = 0;
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

function countPlant(plantValue){
    DATA_CURR_NOF_PLANTS += 1;
    DATA_CURR_AMT_FOOD += plantValue;
}

function displayData(){
    DATA_DISP_MALE_RABBITS.innerHTML = DATA_CURR_NOF_RABBIT_MALE;
    DATA_DISP_FEMALE_RABBITS.innerHTML = DATA_CURR_NOF_RABBIT_FEMALE;
    DATA_DISP_MALE_FOXES.innerHTML = DATA_CURR_NOF_FOX_MALE;
    DATA_DISP_FEMALE_FOXES.innerHTML = DATA_CURR_NOF_FOX_FEMALE;
}