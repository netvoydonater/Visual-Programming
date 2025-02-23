export function orderBy(arr, props) 
{
    if (!Array.isArray(arr)) {
        throw new TypeError('First argument must be an array');
    }
    
    arr.forEach(item => {
        if (typeof item !== 'object' || item === null) {
            throw new TypeError('All elements in array must be objects');
        }
        props.forEach(prop => {
            if (!(prop in item)) {
                throw new Error(`Property '${prop}' is missing in one of the objects`);
            }
        });
    });
    
    return [...arr].sort((a, b) => {
        for (let prop of props) {
            if (a[prop] > b[prop]) return 1;
            if (a[prop] < b[prop]) return -1;
        }
        return 0;
    });
}