/*
 * Copyright (C) 2018 James M. Barton
 */

Object.defineProperty(Promise, 'looper', {
    value: function (worker, checker, initialValue) {
        return new Promise(ok => {

            function runOnce(nextValue) {
                if (nextValue instanceof Promise) {
                    nextValue.then(newValue => {
                        runOnce(newValue);
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
