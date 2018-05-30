# Promise Conveniences

I've found myself making  a few Promise helpers over and over, and I was getting tired of it. I made this to reduce the drudgery of it.

Just require it:

	require('promise-conveniences');

A looping construct:

	console.log(Promise.looper(
		function (value) {
			return Promise.resolve(value + 1);
		},
		function (nextResult) {
			return nextResult < 10;
		},
		1
	));   // 10
	
If you provide an initial value, it's a **while** loop, or without one it's a **do...until** loop.

To wait a specific amount of time:

	const then = Date.now();
	Promise.waiter(2500)
	.then(() => {
		const now = Date.now();
		console.log(`Waited ${now - then} milliseconds`);   // 2504
	});