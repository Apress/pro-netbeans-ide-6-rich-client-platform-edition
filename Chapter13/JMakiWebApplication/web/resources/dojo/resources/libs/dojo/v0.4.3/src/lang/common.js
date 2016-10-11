/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.lang.common");
djd43.lang.inherits = function (subclass, superclass) {
	if (!djd43.lang.isFunction(superclass)) {
		djd43.raise("djd43.inherits: superclass argument [" + superclass + "] must be a function (subclass: [" + subclass + "']");
	}
	subclass.prototype = new superclass();
	subclass.prototype.constructor = subclass;
	subclass.superclass = superclass.prototype;
	subclass["super"] = superclass.prototype;
};
djd43.lang._mixin = function (obj, props) {
	var tobj = {};
	for (var x in props) {
		if ((typeof tobj[x] == "undefined") || (tobj[x] != props[x])) {
			obj[x] = props[x];
		}
	}
	if (djd43.render.html.ie && (typeof (props["toString"]) == "function") && (props["toString"] != obj["toString"]) && (props["toString"] != tobj["toString"])) {
		obj.toString = props.toString;
	}
	return obj;
};
djd43.lang.mixin = function (obj, props) {
	for (var i = 1, l = arguments.length; i < l; i++) {
		djd43.lang._mixin(obj, arguments[i]);
	}
	return obj;
};
djd43.lang.extend = function (constructor, props) {
	for (var i = 1, l = arguments.length; i < l; i++) {
		djd43.lang._mixin(constructor.prototype, arguments[i]);
	}
	return constructor;
};
djd43.inherits = djd43.lang.inherits;
djd43.mixin = djd43.lang.mixin;
djd43.extend = djd43.lang.extend;
djd43.lang.find = function (array, value, identity, findLast) {
	if (!djd43.lang.isArrayLike(array) && djd43.lang.isArrayLike(value)) {
		djd43.deprecated("djd43.lang.find(value, array)", "use djd43.lang.find(array, value) instead", "0.5");
		var temp = array;
		array = value;
		value = temp;
	}
	var isString = djd43.lang.isString(array);
	if (isString) {
		array = array.split("");
	}
	if (findLast) {
		var step = -1;
		var i = array.length - 1;
		var end = -1;
	} else {
		var step = 1;
		var i = 0;
		var end = array.length;
	}
	if (identity) {
		while (i != end) {
			if (array[i] === value) {
				return i;
			}
			i += step;
		}
	} else {
		while (i != end) {
			if (array[i] == value) {
				return i;
			}
			i += step;
		}
	}
	return -1;
};
djd43.lang.indexOf = djd43.lang.find;
djd43.lang.findLast = function (array, value, identity) {
	return djd43.lang.find(array, value, identity, true);
};
djd43.lang.lastIndexOf = djd43.lang.findLast;
djd43.lang.inArray = function (array, value) {
	return djd43.lang.find(array, value) > -1;
};
djd43.lang.isObject = function (it) {
	if (typeof it == "undefined") {
		return false;
	}
	return (typeof it == "object" || it === null || djd43.lang.isArray(it) || djd43.lang.isFunction(it));
};
djd43.lang.isArray = function (it) {
	return (it && it instanceof Array || typeof it == "array");
};
djd43.lang.isArrayLike = function (it) {
	if ((!it) || (djd43.lang.isUndefined(it))) {
		return false;
	}
	if (djd43.lang.isString(it)) {
		return false;
	}
	if (djd43.lang.isFunction(it)) {
		return false;
	}
	if (djd43.lang.isArray(it)) {
		return true;
	}
	if ((it.tagName) && (it.tagName.toLowerCase() == "form")) {
		return false;
	}
	if (djd43.lang.isNumber(it.length) && isFinite(it.length)) {
		return true;
	}
	return false;
};
djd43.lang.isFunction = function (it) {
	return (it instanceof Function || typeof it == "function");
};
(function () {
	if ((djd43.render.html.capable) && (djd43.render.html["safari"])) {
		djd43.lang.isFunction = function (it) {
			if ((typeof (it) == "function") && (it == "[object NodeList]")) {
				return false;
			}
			return (it instanceof Function || typeof it == "function");
		};
	}
})();
djd43.lang.isString = function (it) {
	return (typeof it == "string" || it instanceof String);
};
djd43.lang.isAlien = function (it) {
	if (!it) {
		return false;
	}
	return !djd43.lang.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it));
};
djd43.lang.isBoolean = function (it) {
	return (it instanceof Boolean || typeof it == "boolean");
};
djd43.lang.isNumber = function (it) {
	return (it instanceof Number || typeof it == "number");
};
djd43.lang.isUndefined = function (it) {
	return ((typeof (it) == "undefined") && (it == undefined));
};

