function isFieldMovementLegal(x, y){

    // field does not exist
    if(isFieldOutOfBounds(x,y)){
        return false;
    // field is void
    } else if(fieldsMap[x][y] == VOID_FIELD_ID){
        return false;
    // field is occupied
    } else if(animalsMap[x][y] != null){
        return false;
    // field is water and is sorrounded by water 
    } else if (fieldsMap[x][y] == DEEP_WATER_FIELD_ID){
        return false;
    }

    // otherwise the field is legal
    return true;
}

function isFieldOutOfBounds(x, y){
    if(x < 0 || y < 0){
        return false;
    } else {
        return x > fieldsMap.length - 1 || y > fieldsMap[0].length - 1;
    }
}