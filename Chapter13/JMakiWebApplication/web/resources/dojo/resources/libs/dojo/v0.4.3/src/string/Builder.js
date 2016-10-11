/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.string.Builder");
djd43.require("djd43.string");
djd43.require("djd43.lang.common");
djd43.string.Builder = function (str) {
	this.arrConcat = (djd43.render.html.capable && djd43.render.html["ie"]);
	var a = [];
	var b = "";
	var length = this.length = b.length;
	if (this.arrConcat) {
		if (b.length > 0) {
			a.push(b);
		}
		b = "";
	}
	this.toString = this.valueOf = function () {
		return (this.arrConcat) ? a.join("") : b;
	};
	this.append = function () {
		for (var x = 0; x < arguments.length; x++) {
			var s = arguments[x];
			if (djd43.lang.isArrayLike(s)) {
				this.append.apply(this, s);
			} else {
				if (this.arrConcat) {
					a.push(s);
				} else {
					b += s;
				}
				length += s.length;
				this.length = length;
			}
		}
		return this;
	};
	this.clear = function () {
		a = [];
		b = "";
		length = this.length = 0;
		return this;
	};
	this.remove = function (f, l) {
		var s = "";
		if (this.arrConcat) {
			b = a.join("");
		}
		a = [];
		if (f > 0) {
			s = b.substring(0, (f - 1));
		}
		b = s + b.substring(f + l);
		length = this.length = b.length;
		if (this.arrConcat) {
			a.push(b);
			b = "";
		}
		return this;
	};
	this.replace = function (o, n) {
		if (this.arrConcat) {
			b = a.join("");
		}
		a = [];
		b = b.replace(o, n);
		length = this.length = b.length;
		if (this.arrConcat) {
			a.push(b);
			b = "";
		}
		return this;
	};
	this.insert = function (idx, s) {
		if (this.arrConcat) {
			b = a.join("");
		}
		a = [];
		if (idx == 0) {
			b = s + b;
		} else {
			var t = b.split("");
			t.splice(idx, 0, s);
			b = t.join("");
		}
		length = this.length = b.length;
		if (this.arrConcat) {
			a.push(b);
			b = "";
		}
		return this;
	};
	this.append.apply(this, arguments);
};

