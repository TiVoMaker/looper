/*
 * Copyright (C) 2018 James M. Barton
 */

Object.defineProperty(Promise, 'looper', {
    value: function (worker, checker, initialValue) {
        return new Promise((ok, fail) => {

            function runOnce(nextValue) {
                if (nextValue instanceof Promise) {
                    nextValue.then(newValue => {
                        runOnce(newValue);
                    }).catch(err => {
                        fail(err);
                    });
                } else {
                    if (checker(nextValue)) {
                        setTimeout(() => runOnce(worker(nextValue)), 0);
                    } else {
                        ok(nextValue);
                    }
                }
            }

            if (initialValue !== undefined) {
                if (!checker(initialValue)) {
                    ok(initialValue);
                }
            }
            runOnce(worker(initialValue));
        });
    }
});

Object.defineProperty(Promise, 'waiter', {
    value: function(ms) {
        return new Promise(ok => {
            setTimeout(() => ok(), ms);
        });
    }
});
