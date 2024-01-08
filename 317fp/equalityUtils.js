/* 
 * A way to compare two simple values for equality.
 * A value is "simple" if it contains no objects. 
 * i.e., it is a number, string, boolean, undefined, null, 
 * and (recursively) arrays of other simple values.  
 */

export function simpleValueEquals(val1, val2) {
    result = JSON.stringify(val1) === JSON.stringify(val2);
    // console.log (`simpleValueEquals(${JSON.stringify(val1)}, ${JSON.stringify(val2)}) = ${result}`);
    return result;
}

/* 
 * A simple way to compare two objects for equality.
 * It assumes all the values in the objects must be "simple".
 * A value is "simple" if it contains no objects. 
 * i.e., it is a number, string, boolean, undefined, null, 
 * and (recursively) arrays of other simple values.  
 */
export function simpleObjectEquals(obj1, obj2) {
    // console.log("calling simpleObjectEquals:", obj1, obj2);
    keys1 = Object.keys(obj1);
    keys2 = Object.keys(obj2);
    // Sort keys in alphabetical order
    keys1.sort() 
    keys2.sort()
    const keysEqual = simpleValueEquals(keys1, keys2)
    if (!keysEqual) {
        return false;
    }
    // Get here if the all the keys are equal.
    // Return true iff the same simple value is at every key
    // in the two objects  
    return keys1.every(key => simpleValueEquals(obj1[key], obj2[key]))
}
