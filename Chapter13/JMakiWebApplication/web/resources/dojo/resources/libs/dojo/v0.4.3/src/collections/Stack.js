/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.collections.Stack");
djd43.require("djd43.collections.Collections");
djd43.collections.Stack = function (arr) {
	var q = [];
	if (arr) {
		q = q.concat(arr);
	}
	this.count = q.length;
	this.clear = function () {
		q = [];
		this.count = q.length;
	};
	this.clone = function () {
		return new djd43.collections.Stack(q);
	};
	this.contains = function (o) {
		for (var i = 0; i < q.length; i++) {
			if (q[i] == o) {
				return true;
			}
		}
		return false;
	};
	this.copyTo = function (arr, i) {
		arr.splice(i, 0, q);
	};
	this.forEach = function (fn, scope) {
		var s = scope || dj_global;
		if (Array.forEach) {
			Array.forEach(q, fn, s);
		} else {
			for (var i = 0; i < q.length; i++) {
				fn.call(s, q[i], i, q);
			}
		}
	};
	this.getIterator = function () {
		return new djd43.collections.Iterator(q);
	};
	this.peek = function () {
		return q[(q.length - 1)];
	};
	this.pop = function () {
		var r = q.pop();
		this.count = q.length;
		return r;
	};
	this.push = function (o) {
		this.count = q.push(o);
	};
	this.toArray = function () {
		return [].concat(q);
	};
};

