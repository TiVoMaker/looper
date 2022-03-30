# Promise Conveniences

I've found myself making  a few Promise helpers over and over, and I was getting tired of it. I made this to reduce the drudgery of it.

Just require it:

	require('promise-conveniences');

A looping construct:

	console.log(Promise.looper(
		function worker (value) {
			return Promise.resolve(value + 1);
		},
		function checker (nextResult) {
			return nextResult < 10;
		},
		1
	));   // 10
	
If you provide an initial value, it's a **while** loop, or without one it's a **do...until** loop.

If the initial value is a Promise, it will wait for the Promise to
resolve before starting the loop.

You may return a Promise from the checker, in which case it will wait
for the Promise to resolve, and will continue if it resolves with a truthy value, passing the
the last worker result to the next invocation.

To wait a specific amount of time:

	const then = Date.now();
	Promise.waiter(2500)
	.then(() => {
		const now = Date.now();
		console.log(`Waited ${now - then} milliseconds`);   // 2504
	});
