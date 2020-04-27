export const logger = function(store){
    return function(next){
        return function(action){
            console.log(action,"Store");
            next(action);
        }
    }
}