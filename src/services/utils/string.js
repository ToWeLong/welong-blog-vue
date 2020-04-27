export function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

// export let findKey = (value, compare = (a, b) => a === b) =>{
//     return Object.keys(obj).find(k => compare(obj[k], value))
// }
  