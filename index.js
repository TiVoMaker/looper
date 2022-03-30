/*
 * Copyright (C) 2018 James M. Barton
 */

if (!Promise.looper) {
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
                        const answer = checker(nextValue);
                        if (answer instanceof Promise) {
                            answer.then(newAnswer => {
                                if (newAnswer) {
                                    setTimeout(() => runOnce(worker(nextValue)), 0);
                                } else {
                                    ok(nextValue);
                                }
                            }).catch(err => {
                                fail(err);
                            });
                        } else if (answer) {
                            setTimeout(() => runOnce(worker(nextValue)), 0);
                        } else {
                            ok(nextValue);
                        }
                    }
                }

                if (initialValue !== undefined) {
                    if (initialValue instanceof Promise) {
                        initialValue.then(newValue => {
                            if (!checker(newValue)) {
                                ok(newValue);
                                return;
                            }
                            runOnce(newValue);
                        }).catch(err => {
                            fail(err);
                        });
                        return;
                    }
                    if (!checker(initialValue)) {
                        ok(initialValue);
                        return;
                    }
                }
                runOnce(worker(initialValue));
            });
        }
    });
}

if (!Promise.waiter) {
    Object.defineProperty(Promise, 'waiter', {
        value: function(ms) {
            return new Promise(ok => {
                setTimeout(() => ok(), ms);
            });
        }
    });
}
