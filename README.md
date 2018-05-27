# Promise.looper(worker, checker, [initial value])

I've found myself making looping constructs within an explicitly created Promise over and over, and I was getting tired of it. I made this to reduce the drudgery of it.

Just require it:

	require('looper');

And use it:

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