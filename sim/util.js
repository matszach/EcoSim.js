function isFieldLegalForRabbit(x, y){

    // field is void
    if(fieldsMap[x][y] == 0){
        return false;
    // field is occupied
    } else if(animalsMap[x][y] != null){
        return false;
    // field is water and is sorrounded by water 
    } else if (isFieldDeepWater(x, y)){
        return false;
    }

    // otherwise the field is legal
    return true;
}

function isFieldDeepWater(x, y){
    // "it's easier to as for forgiveness than for permission"
    try{
        return fieldsMap[x][y] == 2 &&
            fieldsMap[x+1][y] == 2 &&
            fieldsMap[x-1][y] == 2 &&
            fieldsMap[x][y+1] == 2 &&
            fieldsMap[x][y+1] == 2;
    } catch {
        return false;
    }
}

function isFieldInLegalRange(x, y){
    if(x < 0 || y < 0){
        return false;
    } else {
        return x > fieldsMap.length - 1 || y > fieldsMap[0].length - 1;
    }
}