// current state variables
var DATA_CURR_NOF_RABBIT_MALE = 0;
var DATA_CURR_NOF_RABBIT_FEMALE = 0;
var DATA_CURR_NOF_FOX_MALE = 0;
var DATA_CURR_NOF_FOX_FEMALE = 0;
var DATA_CURR_NOF_PLANTS = 0;
var DATA_CURR_AMT_FOOD = 0;

// saving data
const MAX_STACK_SIZE = 500;
const DATA_SAVE_INCREMENT = 20;
var data_timer = 0;
var data_stack = [];

function trySaveData(){
    data_timer += 1;

    if(data_timer > DATA_SAVE_INCREMENT){

        data_timer = 0;

        var sample = [
            DATA_CURR_NOF_RABBIT_MALE,
            DATA_CURR_NOF_RABBIT_FEMALE,
            DATA_CURR_NOF_FOX_MALE,
            DATA_CURR_NOF_FOX_FEMALE,
            DATA_CURR_NOF_PLANTS,
            DATA_CURR_AMT_FOOD
        ];

        data_stack.push(sample);

        if(data_stack.length > MAX_STACK_SIZE){
            data_stack.shift(); // removes oldest record
        }
    }
}


function manageData(){
    trySaveData();
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
    DATA_CURR_AMT_FOOD += plantValue
}

function displayData(){
    DATA_DISP_MALE_RABBITS.innerHTML = DATA_CURR_NOF_RABBIT_MALE;
    DATA_DISP_FEMALE_RABBITS.innerHTML = DATA_CURR_NOF_RABBIT_FEMALE;
    DATA_DISP_MALE_FOXES.innerHTML = DATA_CURR_NOF_FOX_MALE;
    DATA_DISP_FEMALE_FOXES.innerHTML = DATA_CURR_NOF_FOX_FEMALE;
    DATA_DISP_NOF_PLANTS.innerHTML = DATA_CURR_NOF_PLANTS;
    DATA_DISP_AMT_FOOD.innerHTML = "("+(DATA_CURR_AMT_FOOD/1000).toFixed(2)+"k)";
}


// generating data files
function generateDataCSV(){

    text = ',nof_rabbit_male,nof_rabbit_female,nof_fox_male,nof_fox_female,nof_plants,amt_food';
    for(i = 0; i < data_stack.length; i++){
        d = data_stack[i];
        text += '\n'+d[0]+','+d[1]+','+d[2]+','+d[3]+','+d[4]+','+d[5];
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'data.csv');

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}