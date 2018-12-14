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
        ).then(finalValue => assert.strictEqual(finalValue, 10));
    });

    it('A while loop that should add up to 10, using Promises', function () {
        return Promise.looper(
            value => Promise.resolve(value + 1),
            worked => worked < 10,
            0
        ).then(finalValue => assert.strictEqual(finalValue, 10));
    });

    it('Make a do ... until loop', function () {
        const maxValue = 10;
        return Promise.looper(
            value => (value === undefined ? 0 : value + 1),
            worked => worked < maxValue
        ).then(finalValue => assert.strictEqual(finalValue, 10));
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
    
    it('Should handle a Promise as the initial value', function () {
        let nLoops = 5;
        return Promise.looper(
            value => {
                return Promise.resolve().then(() => {
                    if (nLoops === 0) {
                        return;
                    }
                    return nLoops;
                });
            },
            worked => {
                if (!worked) {
                    assert(nLoops === 0, 'The looper did not loop correctly');
                    return false;
                }
                nLoops--;
                return true;
            },
            Promise.resolve('startTest')
        );
    });

    it('Should throw an error properly', function () {
        return Promise.looper(
            value => Promise.reject(new Error('Testing thrown error')),
            worked => assert(false, 'I should not have been called')
        ).then(final => {
            assert(false, 'The Promise should not have resolved');
        }).catch(err => {
            assert(err.message.indexOf('Testing thrown error') >= 0, 'The wrong error was thrown');
        });
    });
});

describe('Test the waiter Promise function', function () {

    it('Should wait 3 seconds', function () {
        this.timeout(5000);
        const then = Date.now();
        return Promise.waiter(3*1000)
        .then(() => {
            const now = Date.now();
            assert(now - then >= 3000, 'Promise did not wait long enough');
        });
    });
});
