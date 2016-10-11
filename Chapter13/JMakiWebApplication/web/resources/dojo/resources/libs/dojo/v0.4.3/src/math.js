/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.math");
djd43.math.degToRad = function (x) {
	return (x * Math.PI) / 180;
};
djd43.math.radToDeg = function (x) {
	return (x * 180) / Math.PI;
};
djd43.math.factorial = function (n) {
	if (n < 1) {
		return 0;
	}
	var retVal = 1;
	for (var i = 1; i <= n; i++) {
		retVal *= i;
	}
	return retVal;
};
djd43.math.permutations = function (n, k) {
	if (n == 0 || k == 0) {
		return 1;
	}
	return (djd43.math.factorial(n) / djd43.math.factorial(n - k));
};
djd43.math.combinations = function (n, r) {
	if (n == 0 || r == 0) {
		return 1;
	}
	return (djd43.math.factorial(n) / (djd43.math.factorial(n - r) * djd43.math.factorial(r)));
};
djd43.math.bernstein = function (t, n, i) {
	return (djd43.math.combinations(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i));
};
djd43.math.gaussianRandom = function () {
	var k = 2;
	do {
		var i = 2 * Math.random() - 1;
		var j = 2 * Math.random() - 1;
		k = i * i + j * j;
	} while (k >= 1);
	k = Math.sqrt((-2 * Math.log(k)) / k);
	return i * k;
};
djd43.math.mean = function () {
	var array = djd43.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0;
	for (var i = 0; i < array.length; i++) {
		mean += array[i];
	}
	return mean / array.length;
};
djd43.math.round = function (number, places) {
	if (!places) {
		var shift = 1;
	} else {
		var shift = Math.pow(10, places);
	}
	return Math.round(number * shift) / shift;
};
djd43.math.sd = djd43.math.standardDeviation = function () {
	var array = djd43.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	return Math.sqrt(djd43.math.variance(array));
};
djd43.math.variance = function () {
	var array = djd43.lang.isArray(arguments[0]) ? arguments[0] : arguments;
	var mean = 0, squares = 0;
	for (var i = 0; i < array.length; i++) {
		mean += array[i];
		squares += Math.pow(array[i], 2);
	}
	return (squares / array.length) - Math.pow(mean / array.length, 2);
};
djd43.math.range = function (a, b, step) {
	if (arguments.length < 2) {
		b = a;
		a = 0;
	}
	if (arguments.length < 3) {
		step = 1;
	}
	var range = [];
	if (step > 0) {
		for (var i = a; i < b; i += step) {
			range.push(i);
		}
	} else {
		if (step < 0) {
			for (var i = a; i > b; i += step) {
				range.push(i);
			}
		} else {
			throw new Error("djd43.math.range: step must be non-zero");
		}
	}
	return range;
};

