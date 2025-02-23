const orderBy = require('./orderBy');

describe('orderBy function', () => {
    test('sorts array of objects correctly', () => {
        const data = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Alice', age: 25 }
        ];
        const sortedData = orderBy(data, ['name', 'age']);
        expect(sortedData).toEqual([
            { name: 'Alice', age: 25 },
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 }
        ]);
    });

    test('throws error when first argument is not an array', () => {
        expect(() => orderBy({}, ['name'])).toThrow('First argument must be an array');
    });

    test('throws error when elements in array are not objects', () => {
        expect(() => orderBy([1, 2, 3], ['name'])).toThrow('All elements in array must be objects');
    });

    test('throws error when a property is missing', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob', age: 25 }];
        expect(() => orderBy(data, ['name', 'age'])).toThrow("Property 'age' is missing in one of the objects");
    });
});