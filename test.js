/*
 * Copyright (C) 2018 James M. Barton
 */

require('./index');
const assert = require('assert');

describe('Test the looper Promise function', function () {

    it('A while loop that should add up to 10', function () {
        return Promise.looper(
            value => value + 1,
            worked => worked < 10,
            0
        ).then(finalValue => assert(finalValue === 10));
    });

    it('A while loop that should add up to 10, using Promises', function () {
        return Promise.looper(
            value => Promise.resolve(value + 1),
            worked => worked < 10,
            0
        ).then(finalValue => assert(finalValue === 10));
    });

    it('Make a do ... until loop', function () {
        const maxValue = 10;
        return Promise.looper(
            value => (value === undefined ? 0 : value + 1),
            worked => worked < maxValue
        ).then(finalValue => assert(finalValue === 10));
    });

    it('Should follow a Promise chain', function () {
        return Promise.looper(
            value => {
                return new Promise(ok => {
                    setTimeout(() => ok(value+1), 10);
                });
            },
            worked => worked < 10,
            0
        ).then(finalValue => assert.strictEqual(finalValue, 10));
    });
});
